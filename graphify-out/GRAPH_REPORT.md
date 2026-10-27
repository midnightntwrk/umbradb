# Graph Report - UmbraDB

## Corpus Check
- 969 files · ~1,499,892 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 10454 nodes · 31629 edges · 300 communities (271 shown, 29 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3424 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `ffcb549a0f66608d` (969 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/errors.ts
- ref_node_crypto
- config/history.ts
- PgChainArchiveStore
- height-versioned.property.test.ts
- privacy-checks.ts
- intake.test.ts
- node-bridge.ts
- HeightRun
- code-registry.ts
- tape/index.ts
- block-fetch-decode.test.ts
- tx-replay-decoder.ts
- builders.test.ts
- digest.test.ts
- version-table.ts
- lockstep-refusals.test.ts
- createClient
- chain-placement.test.ts
- postgres/chain-archive-store.ts
- height-versioned.test.ts
- commit-proxy.ts
- child-processes.ts
- interfaces/temporal-kv.ts
- identity.ts
- cursor-table.property.test.ts
- 3. Proof-blocking findings
- validation.test.ts
- ws-mutual-tls.test.ts
- api-server.test.ts
- checkShape
- catalog.ts
- ProcessContexts
- HeldHeight
- pglite-outside-reads.ts
- ledger-storage.test.ts
- statementsOf
- fixtures.ts
- chain-events-source.test.ts
- BlobIntegrityError
- postgres/checkpoint-store.ts
- midnight-env — reproducible PREPROD dev environment
- RuntimeMetadata
- PgTransactionLeaseLayer
- height-versioned.ts
- admin-harness.ts
- ProcessItems
- runner/process.ts
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- src/index.ts
- NodeClient
- .name
- adapter-fixtures.ts
- ReadPool
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- core-transport.ts
- no-chain-sync-import-guard.test.ts
- runMigrations
- HeldRead
- ModuleDeclaration
- BlockRef
- core-private-source.test.ts
- restore-kill.worker.ts
- exitWithin
- declaration.ts
- CliBackend
- builder.test.ts
- write
- sweep-tapes.ts
- UmbraError
- fetch-fixtures.ts
- ref_node_fs
- adapter.ts
- backup-fixtures.ts
- loop.ts
- loop.test.ts
- node-format.ts
- db/migrate.ts
- FinalizedLoop
- range.ts
- refused-configuration.test.ts
- range.test.ts
- host.ts
- builds.ts
- core-ledger-state.ts
- .value
- zero-timeouts-checks.ts
- declaration
- LedgerPackage
- boundary.test.ts
- key-checks.ts
- chain-process.test.ts
- column-rules.test.ts
- ledger/types.ts
- column-rules.ts
- NodeBlockSource
- graph.ts
- real-tapes.ts
- cbor.ts
- ledger-tapes.ts
- chain-events-decode.test.ts
- opt-out.test.ts
- restore.test.ts
- core-settings.ts
- order.property.test.ts
- ValidationError
- plain-data.ts
- networks.ts
- core-key-registry.test.ts
- validate.ts
- validate.test.ts
- ref_node_path
- version-checks.ts
- ReadHandle
- core-block-commit.test.ts
- cbor.property.test.ts
- postgres/transaction-lease.ts
- child-processes.test.ts
- redact.ts
- process-context.test.ts
- binding.test.ts
- checks.test.ts
- mapping.ts
- test/postgres/setup.ts
- Lockstep
- private/lockstep-wait.test.ts
- PrivateTransport
- check-required-tests.ts
- legacy-excluded.test.ts
- ChainArchiveStore
- Problem
- version
- table
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- pg
- ref_node_url
- .boolean
- repository
- vitest
- mutation-per-adapter.mjs
- attempt
- facade-merge-loader.ts
- history.property.test.ts
- pack-install.mjs
- scoped-review-manifest
- ref_node_child_process
- failingSource
- .closed
- Requirement: DT-4 Per-block changes of every module table
- graph.py
- Full-Chain Storage — Design
- refused
- fn
- transform-checks.ts
- ADDED Requirements
- package.json
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- README.md
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- manifest.json
- Vendored ledger builds
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
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
- engines
- peerDependencies
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 325 edges
2. `UmbraError` - 280 edges
3. `ModuleDeclaration` - 159 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 100 edges
6. `NodeClient` - 95 edges
7. `Database` - 93 edges
8. `PgTransactionLeaseLayer` - 93 edges
9. `runMigrations()` - 90 edges
10. `PgCheckpointStore` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Scenario: history for a wallet+network with no checkpoints resolves empty` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: No checkpoint exists for the wallet+network at all` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (300 total, 29 thin omitted)

### Community 0 - "db/errors.ts"
Cohesion: 0.02
Nodes (203): BlockWriteHandle, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, ReadTimeoutSetting, MigrationPart, SchemaItem (+195 more)

### Community 1 - "ref_node_crypto"
Cohesion: 0.01
Nodes (206): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, JsonEncoded, PgTransactionHistoryStorage, StoredEntryJson (+198 more)

### Community 10 - "config/history.ts"
Cohesion: 0.03
Nodes (135): EntryView, CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryInput (+127 more)

### Community 100 - "PgChainArchiveStore"
Cohesion: 0.18
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 102 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (18): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+10 more)

### Community 103 - "privacy-checks.ts"
Cohesion: 0.13
Nodes (24): PrivateProcess, KeyCall, TestKeyConfig, KeyCrashJob, PrivacyOptions, privacyRun, hexOf(), report() (+16 more)

### Community 105 - "intake.test.ts"
Cohesion: 0.14
Nodes (15): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), against() (+7 more)

### Community 106 - "node-bridge.ts"
Cohesion: 0.13
Nodes (19): NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 108 - "HeightRun"
Cohesion: 0.09
Nodes (10): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+2 more)

### Community 109 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 11 - "tape/index.ts"
Cohesion: 0.04
Nodes (106): Failure, Variant, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformError (+98 more)

### Community 110 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (19): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+11 more)

### Community 112 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 113 - "builders.test.ts"
Cohesion: 0.11
Nodes (16): Entry, TestKey, Accepts, ConfigOf, CoreSettingsGiven, Minimal, PricesSettings, Private (+8 more)

### Community 114 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 115 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 116 - "lockstep-refusals.test.ts"
Cohesion: 0.19
Nodes (20): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+12 more)

### Community 12 - "createClient"
Cohesion: 0.03
Nodes (99): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+91 more)

### Community 120 - "chain-placement.test.ts"
Cohesion: 0.16
Nodes (18): ScaleValue, decodeExtrinsics(), chainHashOf(), callVariant(), carried(), is(), placeTransactions(), refuse() (+10 more)

### Community 121 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 122 - "height-versioned.test.ts"
Cohesion: 0.14
Nodes (14): BlockFails, Height, tokenMetadata(), versionedDatabase(), versionsOf(), outcome(), secondChangeProblems(), stateOf() (+6 more)

### Community 127 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 129 - "child-processes.ts"
Cohesion: 0.12
Nodes (14): LockResult, ReportedTest, guardContainers(), guardPid(), watcherInput(), kill(), startLockProcess(), containerFilters (+6 more)

### Community 13 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (134): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus, AsOf, AssertExact, HistoryUnavailableError (+126 more)

### Community 130 - "identity.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 131 - "cursor-table.property.test.ts"
Cohesion: 0.15
Nodes (17): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+9 more)

### Community 133 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 137 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 138 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 14 - "api-server.test.ts"
Cohesion: 0.03
Nodes (106): ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer (+98 more)

### Community 141 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 142 - "catalog.ts"
Cohesion: 0.16
Nodes (15): CatalogColumn, CatalogOptions, CatalogTable, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+7 more)

### Community 143 - "ProcessContexts"
Cohesion: 0.19
Nodes (5): ApiStartup, ProcessContexts, names(), providesProcessItem(), sealed()

### Community 144 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 147 - "pglite-outside-reads.ts"
Cohesion: 0.24
Nodes (10): LoadOutcome, OutsideRead, Traced, expectNoOutsideReads(), outsideReads(), runUnderReadLoad(), turn(), windows() (+2 more)

### Community 15 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (127): BlockParsed, LedgerHost, BlockHeader, SourceShared, itemsSeen, ingest, SourceClass, watched (+119 more)

### Community 150 - "statementsOf"
Cohesion: 0.25
Nodes (10): MetaCommands, Piece, State, StatementSplitter, checkStatement(), checkStatements(), statementsOf(), check() (+2 more)

### Community 156 - "fixtures.ts"
Cohesion: 0.14
Nodes (12): PendingKey, PendingKeys, CallEvent, API, ARGUMENTS, BLOCK, HASH, HEADER (+4 more)

### Community 157 - "chain-events-source.test.ts"
Cohesion: 0.19
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 159 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 16 - "postgres/checkpoint-store.ts"
Cohesion: 0.02
Nodes (128): CheckpointRecord, CheckpointSequence, CheckpointSummary, ContentHash, HistoryOptions, PruneResult, SaveCheckpointOptions, AggregateRow (+120 more)

### Community 162 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 163 - "RuntimeMetadata"
Cohesion: 0.19
Nodes (4): RuntimeMetadata, contentStateOf(), hexOf(), 5.6 Version selection, the built-in tables and the metadata at upgrades (LG-1 to LG-4)

### Community 17 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (91): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, GcPass, HistGroup (+83 more)

### Community 172 - "height-versioned.ts"
Cohesion: 0.23
Nodes (6): heightVersionedTable, HeightVersionedTableOptions, Migration, Control, checkName(), migrationSql()

### Community 18 - "admin-harness.ts"
Cohesion: 0.04
Nodes (102): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+94 more)

### Community 19 - "runner/process.ts"
Cohesion: 0.03
Nodes (58): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener (+50 more)

### Community 190 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 195 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (200): CheckpointNotFoundError, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, ConnectionError (+192 more)

### Community 20 - "NodeClient"
Cohesion: 0.05
Nodes (71): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+63 more)

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (95): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+87 more)

### Community 217 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 219 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 22 - "core-transport.ts"
Cohesion: 0.03
Nodes (94): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+86 more)

### Community 220 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 23 - "runMigrations"
Cohesion: 0.02
Nodes (115): AnySql, RolloverBucket, RolloverTable, exceedsMaxDepth(), assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound() (+107 more)

### Community 238 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 24 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (88): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminStarter (+80 more)

### Community 25 - "BlockRef"
Cohesion: 0.03
Nodes (75): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, Prefetch (+67 more)

### Community 26 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (55): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicDatabase, PublicIdentity, PublicSideOptions, PublicWakes (+47 more)

### Community 260 - "restore-kill.worker.ts"
Cohesion: 0.40
Nodes (3): RestoreJob, job, orphanGuard

### Community 27 - "declaration.ts"
Cohesion: 0.03
Nodes (88): privateIntake, CommandBuildOptions, RunOptions, RunSeams, SignalSource, stopSignal, coreEntry, CoreEntryInput (+80 more)

### Community 28 - "builder.test.ts"
Cohesion: 0.03
Nodes (48): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+40 more)

### Community 280 - "write"
Cohesion: 0.67
Nodes (3): statsConfig, write(), write()

### Community 29 - "sweep-tapes.ts"
Cohesion: 0.04
Nodes (67): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+59 more)

### Community 3 - "UmbraError"
Cohesion: 0.03
Nodes (132): ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession (+124 more)

### Community 30 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (84): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+76 more)

### Community 31 - "ref_node_fs"
Cohesion: 0.03
Nodes (48): NodeRetry, NodeTimers, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+40 more)

### Community 32 - "adapter.ts"
Cohesion: 0.03
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 33 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (80): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+72 more)

### Community 34 - "loop.ts"
Cohesion: 0.04
Nodes (77): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointSchedule, ProcessReason (+69 more)

### Community 35 - "loop.test.ts"
Cohesion: 0.05
Nodes (67): LockstepWait, Contexts, Faults, LostCommit, Seen, Seen, AtGate, LoopClass (+59 more)

### Community 36 - "node-format.ts"
Cohesion: 0.06
Nodes (58): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+50 more)

### Community 37 - "db/migrate.ts"
Cohesion: 0.04
Nodes (80): RestoreTarget, UmbraConfig, AppliedRow, Runnable, Settling, StartupInput, Difference, OwnPart (+72 more)

### Community 38 - "FinalizedLoop"
Cohesion: 0.05
Nodes (21): PointRun, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep, WaitingInRead (+13 more)

### Community 39 - "range.ts"
Cohesion: 0.04
Nodes (71): NodeClientOptions, NodeSubscription, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, CompletenessRange (+63 more)

### Community 4 - "refused-configuration.test.ts"
Cohesion: 0.02
Nodes (156): BlockItemSource, ProcessConfig, ProcessState, Answered, gate, StatusBody, Start, Child (+148 more)

### Community 40 - "range.test.ts"
Cohesion: 0.05
Nodes (45): ConnectSocket, Script, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+37 more)

### Community 41 - "host.ts"
Cohesion: 0.05
Nodes (51): RetainedState, ApplyOutput, ChainOutcome, LedgerTask, ParsedTransaction, StateSummary, AppliedState, ApplyBlock (+43 more)

### Community 42 - "builds.ts"
Cohesion: 0.05
Nodes (47): PrivateBackend, SessionSeen, PrivateOptions, PrivateRefusal, Pause, Q142Observation, A155Observation, Outcome (+39 more)

### Community 43 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (57): CoreLedgerStateOptions, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, ContractKeys, boundLedgerParser(), workerParser() (+49 more)

### Community 44 - ".value"
Cohesion: 0.08
Nodes (43): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+35 more)

### Community 45 - "zero-timeouts-checks.ts"
Cohesion: 0.05
Nodes (53): Settings, Run, Job, WorkerEvent, Report, Job, Outcome, blocksSql() (+45 more)

### Community 46 - "declaration"
Cohesion: 0.06
Nodes (52): GraphInput, PastFaultCase, RefusalCase, schemaName(), module(), keysModule(), contractLogs(), declaration() (+44 more)

### Community 47 - "LedgerPackage"
Cohesion: 0.08
Nodes (27): LedgerName, LedgerPackage, StateHandle, Held, LedgerEngine, hexOf(), idOf(), same() (+19 more)

### Community 48 - "boundary.test.ts"
Cohesion: 0.06
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+41 more)

### Community 49 - "key-checks.ts"
Cohesion: 0.08
Nodes (56): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Admission, AdmittedSeen, Blocking, KeyRefusal (+48 more)

### Community 5 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (134): BlockContext, EntryBoundary, InMemoryBlockSource, InMemoryItems, InMemorySourceOptions, Wait, ProcessHandle, ProcessingEnd (+126 more)

### Community 50 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+25 more)

### Community 51 - "ledger/types.ts"
Cohesion: 0.06
Nodes (41): LoadLedger, LedgerReleasePackage, ApplyInput, LedgerPackageOptions, AdapterWorkerAnswer, AdapterWorkerRequest, SlowStep, TestLoaderData (+33 more)

### Community 52 - "column-rules.ts"
Cohesion: 0.04
Nodes (57): AllowedRule, DefaultPart, DesignRow, PlacedRefusal, RefusalCode, RefusedRule, RuleBase, ScalarColumnType (+49 more)

### Community 53 - "NodeBlockSource"
Cohesion: 0.08
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, EventsRunner, NoWindow, OwnStateMetadata, Refetches (+3 more)

### Community 54 - "graph.ts"
Cohesion: 0.07
Nodes (50): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+42 more)

### Community 55 - "real-tapes.ts"
Cohesion: 0.07
Nodes (36): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+28 more)

### Community 56 - "cbor.ts"
Cohesion: 0.09
Nodes (41): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, checkSafeInteger(), compareBytes() (+33 more)

### Community 58 - "ledger-tapes.ts"
Cohesion: 0.09
Nodes (46): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, ledgerScenario, LedgerScenarioOptions (+38 more)

### Community 59 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (34): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, writeEventRows(), canonicalJson() (+26 more)

### Community 6 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (111): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+103 more)

### Community 60 - "restore.test.ts"
Cohesion: 0.10
Nodes (33): BackupBackend, killedRestore, cliProject, hashAt(), inMemoryBlock(), a77Problems(), a78Problems(), hex() (+25 more)

### Community 61 - "core-settings.ts"
Cohesion: 0.06
Nodes (39): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+31 more)

### Community 63 - "order.property.test.ts"
Cohesion: 0.08
Nodes (37): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, dispatch(), isParallelPoint(), runSchedule() (+29 more)

### Community 64 - "ValidationError"
Cohesion: 0.06
Nodes (39): ValidationError, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect (+31 more)

### Community 65 - "plain-data.ts"
Cohesion: 0.07
Nodes (30): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+22 more)

### Community 66 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 67 - "core-key-registry.test.ts"
Cohesion: 0.07
Nodes (27): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+19 more)

### Community 68 - "validate.ts"
Cohesion: 0.10
Nodes (36): CursorRule, Issue, Plain, SettingsSchema, TestKeysRuleOptions, FieldKind, coreSettingsSchema(), closest() (+28 more)

### Community 69 - "validate.test.ts"
Cohesion: 0.07
Nodes (30): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+22 more)

### Community 7 - "ref_node_path"
Cohesion: 0.03
Nodes (122): RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport (+114 more)

### Community 70 - "version-checks.ts"
Cohesion: 0.13
Nodes (28): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+20 more)

### Community 75 - "ReadHandle"
Cohesion: 0.07
Nodes (13): ReadHandle, cursorTable, CursorTableOptions, PointCallbacks, ModuleApiOptions, cursorDatabase, BlockFails, Writes (+5 more)

### Community 77 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (26): Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf(), sameBytes(), writeBlockRow() (+18 more)

### Community 78 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 8 - "postgres/transaction-lease.ts"
Cohesion: 0.02
Nodes (127): TransactionHistoryReader, TransactionHistoryWriter, TemporalKV, Lease, LeaseAcquireOptions, TransactionHandle, TransactionHandleInvalidError, WatermarkKey (+119 more)

### Community 83 - "child-processes.test.ts"
Cohesion: 0.08
Nodes (26): ParentJob, Kill, Orphaned, SourceFile, alive(), bystander(), childrenOf(), commandOf() (+18 more)

### Community 85 - "redact.ts"
Cohesion: 0.10
Nodes (25): RevisionSettings, RedactableConfig, RedactionForms, SecretForm, TextPattern, fieldKinds, Needs, findings() (+17 more)

### Community 86 - "process-context.test.ts"
Cohesion: 0.09
Nodes (22): MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems(), consumer() (+14 more)

### Community 87 - "binding.test.ts"
Cohesion: 0.12
Nodes (26): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+18 more)

### Community 88 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 89 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+19 more)

### Community 9 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (140): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+132 more)

### Community 90 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 94 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 95 - "PrivateTransport"
Cohesion: 0.13
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf() (+1 more)

### Community 96 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 97 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 99 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 226 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 57 - "version"
Cohesion: 0.04
Nodes (43): version(), 1. The invariant: the cursor is never ahead of its data, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes (+35 more)

### Community 104 - "table"
Cohesion: 0.08
Nodes (25): table(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db` (+17 more)

### Community 107 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.09
Nodes (22): listen(), 10. Ingest, 11. Chain data, 13. Contract data, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+14 more)

### Community 117 - "pg"
Cohesion: 0.10
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 124 - "ref_node_url"
Cohesion: 0.11
Nodes (10): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli (+2 more)

### Community 140 - ".boolean"
Cohesion: 0.14
Nodes (14): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Map key order (+6 more)

### Community 146 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 148 - "vitest"
Cohesion: 0.15
Nodes (4): settings, CORE_ARCH, DURABILITY, vitest

### Community 149 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 160 - "attempt"
Cohesion: 0.18
Nodes (12): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop (+4 more)

### Community 169 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 173 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 178 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 180 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 216 - "ref_node_child_process"
Cohesion: 0.33
Nodes (4): end(), removeContainers(), filters, listed

### Community 224 - ".closed"
Cohesion: 0.33
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 271 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 71 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 73 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 81 - "refused"
Cohesion: 0.06
Nodes (32): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+24 more)

### Community 82 - "fn"
Cohesion: 0.08
Nodes (31): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease (+23 more)

### Community 98 - "transform-checks.ts"
Cohesion: 0.13
Nodes (10): baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), readTapeFile(), tapeText(), TRANSFORMS (+2 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+18 more)

### Community 111 - "package.json"
Cohesion: 0.09
Nodes (22): bugs, url, description, exports, files, homepage, license, main (+14 more)

### Community 118 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 123 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 125 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 128 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 132 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 135 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 136 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 139 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 145 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 151 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 154 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 155 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 158 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 161 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 166 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 168 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 171 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 174 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 175 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 176 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 177 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 179 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 181 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 182 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 183 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 185 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 186 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 187 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 188 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 191 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 192 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 193 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 194 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 196 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 197 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 198 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 199 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 200 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 201 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 202 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 203 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 204 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 205 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 206 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 208 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 209 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 210 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 211 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 212 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 213 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 214 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 221 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 222 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 223 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 225 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 227 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 228 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 229 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 230 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 231 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 232 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 233 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 234 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 235 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 236 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 237 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 239 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 240 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 241 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 242 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 243 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 244 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 245 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 246 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 247 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 248 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 249 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 250 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 251 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 252 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 253 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 254 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 255 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 256 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 257 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 258 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 259 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 262 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 263 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 264 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 265 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 266 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 267 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 268 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 269 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 270 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 272 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 273 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 277 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 278 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 62 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+29 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+28 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects (+26 more)

### Community 80 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-3339`, `RFC-8785` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/errors.ts`, `ref_node_crypto`, `src/index.ts`, `UmbraError`, `refused-configuration.test.ts`, `chain-process.test.ts`, `opt-out.test.ts`, `ref_node_path`, `postgres/transaction-lease.ts`, `test/postgres/setup.ts`, `config/history.ts`, `tape/index.ts`, `createClient`, `interfaces/temporal-kv.ts`, `api-server.test.ts`, `ledger-storage.test.ts`, `postgres/checkpoint-store.ts`, `PgTransactionLeaseLayer`, `admin-harness.ts`, `runner/process.ts`, `NodeClient`, `adapter-fixtures.ts`, `core-transport.ts`, `ModuleDeclaration`, `BlockRef`, `core-private-source.test.ts`, `declaration.ts`, `builder.test.ts`, `sweep-tapes.ts`, `fetch-fixtures.ts`, `ref_node_fs`, `adapter.ts`, `backup-fixtures.ts`, `loop.ts`, `loop.test.ts`, `node-format.ts`, `db/migrate.ts`, `range.ts`, `range.test.ts`, `builds.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `declaration`, `boundary.test.ts`, `key-checks.ts`, `column-rules.test.ts`, `ledger/types.ts`, `real-tapes.ts`, `ledger-tapes.ts`, `chain-events-decode.test.ts`, `restore.test.ts`, `core-settings.ts`, `order.property.test.ts`, `plain-data.ts`, `networks.ts`, `core-key-registry.test.ts`, `validate.test.ts`, `version-checks.ts`, `ReadHandle`, `core-block-commit.test.ts`, `cbor.property.test.ts`, `child-processes.test.ts`, `redact.ts`, `process-context.test.ts`, `binding.test.ts`, `checks.test.ts`, `Lockstep`, `private/lockstep-wait.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `transform-checks.ts`, `height-versioned.property.test.ts`, `intake.test.ts`, `node-bridge.ts`, `code-registry.ts`, `block-fetch-decode.test.ts`, `package.json`, `builders.test.ts`, `digest.test.ts`, `lockstep-refusals.test.ts`, `chain-placement.test.ts`, `height-versioned.test.ts`, `ref_node_url`, `child-processes.ts`, `identity.ts`, `cursor-table.property.test.ts`, `validation.test.ts`, `ws-mutual-tls.test.ts`, `pglite-outside-reads.ts`, `mutation-per-adapter.mjs`, `statementsOf`, `chain-events-source.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.328) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017183340300543443 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/errors.ts`, `identity.ts`, `refused-configuration.test.ts`, `chain-process.test.ts`, `opt-out.test.ts`, `ref_node_path`, `validation.test.ts`, `config/history.ts`, `tape/index.ts`, `checkShape`, `api-server.test.ts`, `ledger-storage.test.ts`, `ProcessContexts`, `runner/process.ts`, `NodeClient`, `core-transport.ts`, `ModuleDeclaration`, `BlockRef`, `core-private-source.test.ts`, `declaration.ts`, `fetch-fixtures.ts`, `ref_node_fs`, `backup-fixtures.ts`, `loop.ts`, `RuntimeMetadata`, `loop.test.ts`, `db/migrate.ts`, `FinalizedLoop`, `range.ts`, `range.test.ts`, `host.ts`, `builds.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `declaration`, `NodeBlockSource`, `graph.ts`, `cbor.ts`, `core-settings.ts`, `plain-data.ts`, `core-key-registry.test.ts`, `validate.ts`, `validate.test.ts`, `version-checks.ts`, `ReadHandle`, `core-block-commit.test.ts`, `process-context.test.ts`, `binding.test.ts`, `checks.test.ts`, `mapping.ts`, `failingSource`, `PrivateTransport`, `table`, `version-table.ts`, `lockstep-refusals.test.ts`, `height-versioned.test.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_node_crypto` be split into smaller, more focused modules?**
  _Cohesion score 0.014673821901727318 - nodes in this community are weakly interconnected._