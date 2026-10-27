# Graph Report - UmbraDB

## Corpus Check
- 1040 files · ~1,549,531 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 11006 nodes · 33421 edges · 320 communities (286 shown, 34 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 3460 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `d1421ce7aef17090` (1040 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ModuleDeclaration
- PgTransactionLeaseLayer
- api-server.test.ts
- intake.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- fixtures/configuration.ts
- ChainArchiveStore
- PgChainArchiveStore
- .value
- height-versioned.property.test.ts
- run.test.ts
- process-worker.ts
- config/history.ts
- worker-threads.test.ts
- page.ts
- cbor.property.test.ts
- code-registry.ts
- mapping.test.ts
- node-bridge.ts
- shims.test.ts
- tx-replay-decoder.ts
- pglite-writer.worker.ts
- tape/index.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- lockstep-refusals.test.ts
- Registry
- writer-lock.test.ts
- postgres/chain-archive-store.ts
- browser-harness.ts
- version-table.ts
- validate.ts
- private/lockstep-wait.test.ts
- sweep-fixture.ts
- commit-proxy.ts
- PortSocket
- package-identity.test.ts
- ref_node_fs
- chrome.ts
- ws-mutual-tls.test.ts
- .name
- BlockRef
- pglite-timeouts.test.ts
- no-indexer-or-wallet-sdk.test.ts
- Worker
- web-lock.ts
- attempt
- InMemoryBlockSource
- child-processes.ts
- read-height.property.test.ts
- BlobIntegrityError
- midnight-env — reproducible PREPROD dev environment
- NodeClient
- validation.test.ts
- history.property.test.ts
- buffer.ts
- 3. Proof-blocking findings
- ledger/types.ts
- extrinsics.ts
- RuntimeMetadata
- order.property.test.ts
- ref_node_crypto
- adapter-fixtures.ts
- ProcessItems
- ChromeTab
- postgres-image.test.ts
- column-rules.ts
- process-admin.ts
- mutation-evidence.d.mts
- runMigrations
- no-chain-sync-import-guard.test.ts
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- core-block-commit.test.ts
- .from
- core-transport.ts
- vitest
- adapter-worker.ts
- config-check.ts
- CheckTarget
- CliBackend
- ValidationError
- https.ts
- NodeFS
- src/index.ts
- backup/restore.ts
- PgTemporalKV
- runner/process.ts
- node-format.ts
- contract-modules.test.ts
- node/client.test.ts
- builder.test.ts
- refused-configuration.test.ts
- upgrade-boundary.test.ts
- UmbraError
- core-block-parsed.ts
- declaration.ts
- core-ledger-state.ts
- module-tables.ts
- LedgerPackage
- process-build.ts
- createClient
- NodeBlockSource
- ledger-sweep.test.ts
- key-checks.ts
- range.ts
- contract-data-checks.ts
- cbor.ts
- admin/types.ts
- chain-process.test.ts
- changes.property.test.ts
- transport-faults.test.ts
- transform-checks.ts
- admin-harness.ts
- builds.ts
- spawnChild
- translatePostgresError
- boundary.test.ts
- slow-block-harness.ts
- core-settings.ts
- graph.ts
- both-backends.test.ts
- serve.test.ts
- lifecycle.test.ts
- private/backends.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ledger-storage.test.ts
- version-checks.ts
- validation.ts
- core-chain-events.ts
- core-key-registry.test.ts
- net.test.ts
- networks.ts
- fetch-fixtures.ts
- binding.test.ts
- process-context.test.ts
- Lockstep
- browser.test.ts
- writer-lock-checks.ts
- FinalizedLoop
- crash.test.ts
- browser/build.ts
- checks.test.ts
- zero-timeouts-checks.ts
- mapping.ts
- Problem
- Tasks — v1.0.0-infosec-signoff
- ADDED Requirements
- ref_node_child_process
- .slowBlockMs
- mutation-per-adapter.mjs
- pg
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- scoped-review-manifest
- path.ts
- Performance — design
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- read-only-checks.ts
- port.ts
- T
- version
- graph.py
- table
- Full-Chain Storage — Design
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- package.json
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- README.md
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
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
- Tasks — v1.1.0: Quint model checking
- Contributing
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- Backups
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: RN-16 Chain-data reads name their view and height
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: CF-3 Every entry is validated at startup
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- bugs
- engines
- peerDependencies
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 337 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 166 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 100 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `PgTransactionLeaseLayer` - 93 edges
9. `runMigrations()` - 90 edges
10. `PgCheckpointStore` - 87 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex` --references--> `ValidationError`  [INFERRED]
  docs/v1-lessons-learned.md → src/interfaces/storage-errors.ts
- `Scenario: history for a wallet+network with no checkpoints resolves empty` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (320 total, 34 thin omitted)

### Community 0 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (232): Bound, CoreChainFacts, Database, ReadOnlyDatabase, SchemaWriteHandle, CapturedTable, AppliedRow, MigrationPart (+224 more)

### Community 1 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (239): JsonValue, PgCheckpointStore, KvRow, PgTransactionLeaseLayer, Adapters, BatchSpec, CurrentState, InvariantResult (+231 more)

### Community 10 - "api-server.test.ts"
Cohesion: 0.03
Nodes (113): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, Connection, HeadersArgument, ModuleApiServer (+105 more)

### Community 100 - "intake.test.ts"
Cohesion: 0.14
Nodes (16): PrivateSeen, A114Observation, A116Observation, TestLink, directPublic(), a114Problems(), a114Run(), a116Problems() (+8 more)

### Community 101 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 102 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 103 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 104 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 105 - "PgChainArchiveStore"
Cohesion: 0.18
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 106 - ".value"
Cohesion: 0.19
Nodes (11): MetadataType, Primitive, ScaleReader, ValueReader, blockTimeOf(), decodeExtrinsic(), decodeChainEvents(), littleEndian() (+3 more)

### Community 107 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (18): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+10 more)

### Community 108 - "run.test.ts"
Cohesion: 0.11
Nodes (19): RunningCommand, statsConfig, write(), adminPortIn(), chainNode(), chainTape(), exitWithin(), runCoreSettings() (+11 more)

### Community 109 - "process-worker.ts"
Cohesion: 0.14
Nodes (17): Scope, crossedError, StartRun, ToProcessWorker, adminAnswer(), messageAdmin(), withDevelopmentOptIn(), useNetwork() (+9 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (134): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryInput (+126 more)

### Community 110 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 111 - "page.ts"
Cohesion: 0.11
Nodes (18): NetworkBroker, PageState, ProcessView, CallMethod, FromProcessWorker, appendLog(), element(), onEvent() (+10 more)

### Community 112 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 113 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 114 - "mapping.test.ts"
Cohesion: 0.11
Nodes (12): Case, mapValue(), outcome(), shape(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES (+4 more)

### Community 115 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 117 - "shims.test.ts"
Cohesion: 0.15
Nodes (8): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 118 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 119 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (16): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.04
Nodes (93): Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+85 more)

### Community 120 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 121 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 122 - "lockstep-refusals.test.ts"
Cohesion: 0.19
Nodes (20): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+12 more)

### Community 125 - "Registry"
Cohesion: 0.24
Nodes (11): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+3 more)

### Community 126 - "writer-lock.test.ts"
Cohesion: 0.20
Nodes (15): PostgresTestDatabase, opened(), loginOn(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), lockReleased(), nextTransaction() (+7 more)

### Community 127 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 128 - "browser-harness.ts"
Cohesion: 0.17
Nodes (16): BrowserBuild, pageBench, ProcessName, PageServer, call(), eventsOf(), eventWhen(), logOf() (+8 more)

### Community 129 - "version-table.ts"
Cohesion: 0.19
Nodes (19): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+11 more)

### Community 13 - "validate.ts"
Cohesion: 0.02
Nodes (125): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+117 more)

### Community 130 - "private/lockstep-wait.test.ts"
Cohesion: 0.17
Nodes (14): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+6 more)

### Community 133 - "sweep-fixture.ts"
Cohesion: 0.18
Nodes (16): FixtureNode, FakeState, node(), rootOf(), stateNodes(), subtree(), utf8(), versionOf() (+8 more)

### Community 134 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 135 - "PortSocket"
Cohesion: 0.18
Nodes (7): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs

### Community 138 - "package-identity.test.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 14 - "ref_node_fs"
Cohesion: 0.04
Nodes (96): RestoreSeams, CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, RestoreCommandOptions, RestoreCommandSeams (+88 more)

### Community 144 - "chrome.ts"
Cohesion: 0.21
Nodes (9): Cdp, CdpEvent, ChromeBrowser, chrome(), chromePath(), chromeVersion(), launchChrome(), reject() (+1 more)

### Community 145 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 149 - ".name"
Cohesion: 0.19
Nodes (7): Fetching, Recorder, Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 15 - "BlockRef"
Cohesion: 0.03
Nodes (75): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, QueuedBlock, ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks (+67 more)

### Community 150 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 151 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.21
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 152 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 157 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 159 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 16 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (84): Transaction, InMemoryBlockSource, CommitOutcome, HeightRun, HeldHeight, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction (+76 more)

### Community 162 - "child-processes.ts"
Cohesion: 0.18
Nodes (11): ReportedTest, guardContainers(), guardPid(), watcherInput(), containerFilters, WATCHER, CONFIG, FIXTURE_CONFIG (+3 more)

### Community 164 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 166 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 168 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (73): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+65 more)

### Community 173 - "validation.test.ts"
Cohesion: 0.18
Nodes (10): Case, ShapeCase, Stats, failures(), loose(), refusal(), thrown(), DECLARATION_RULES (+2 more)

### Community 174 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 176 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 179 - "3. Proof-blocking findings"
Cohesion: 0.17
Nodes (12): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+4 more)

### Community 18 - "ledger/types.ts"
Cohesion: 0.04
Nodes (85): LoadLedger, LoadAdapter, LedgerStateItem, LedgerName, LedgerReleasePackage, ApplyOutput, ChainOutcome, LedgerPackageOptions (+77 more)

### Community 188 - "extrinsics.ts"
Cohesion: 0.20
Nodes (9): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataPallet, RuntimeMetadataView, callOf(), callVariants(), isCompactU64() (+1 more)

### Community 189 - "RuntimeMetadata"
Cohesion: 0.24
Nodes (4): RuntimeMetadata, contentStateOf(), hexOf(), walkOver()

### Community 19 - "order.property.test.ts"
Cohesion: 0.03
Nodes (102): EntryRange, GraphInput, PointRun, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec (+94 more)

### Community 2 - "ref_node_crypto"
Cohesion: 0.01
Nodes (229): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+221 more)

### Community 20 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (101): ApplyInput, StoredNode, DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+93 more)

### Community 202 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 21 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 22 - "process-admin.ts"
Cohesion: 0.04
Nodes (96): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+88 more)

### Community 229 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 23 - "runMigrations"
Cohesion: 0.02
Nodes (115): CheckpointSummary, AnySql, RolloverBucket, RolloverTable, UmbraDBConnectionOptions, exceedsMaxDepth(), assertDefaultSpanFitsOneBucket(), assertValidBucketBounds() (+107 more)

### Community 230 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 238 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 24 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (80): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext, Migration (+72 more)

### Community 25 - ".from"
Cohesion: 0.03
Nodes (88): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+80 more)

### Community 26 - "core-transport.ts"
Cohesion: 0.04
Nodes (75): PublicSide, Session, TransportLimits, Committed, Hello, HelloAck, JsonValue, MessageFault (+67 more)

### Community 27 - "vitest"
Cohesion: 0.04
Nodes (60): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+52 more)

### Community 274 - "adapter-worker.ts"
Cohesion: 0.50
Nodes (4): AdapterWorkerRequest, hex(), storeOf(), request

### Community 28 - "config-check.ts"
Cohesion: 0.04
Nodes (82): privateIntake, BackupOutcome, CommandBuildOptions, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus (+74 more)

### Community 29 - "ValidationError"
Cohesion: 0.02
Nodes (94): ValidationError, validateSaveOptions(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference (+86 more)

### Community 3 - "src/index.ts"
Cohesion: 0.02
Nodes (213): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, ChunkIntegrityError, ChunkMissingError (+205 more)

### Community 30 - "backup/restore.ts"
Cohesion: 0.05
Nodes (77): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+69 more)

### Community 31 - "PgTemporalKV"
Cohesion: 0.05
Nodes (68): AsOf, AssertExact, Key, Namespace, Scope, Version, VersionedEntry, _VersionedEntryInSync (+60 more)

### Community 32 - "runner/process.ts"
Cohesion: 0.04
Nodes (39): ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, CoreTransport, TransportTls, RetryCode, SlowBlockEvent (+31 more)

### Community 33 - "node-format.ts"
Cohesion: 0.06
Nodes (55): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+47 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (67): ContractLog, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LogSite, Program, UnsureReason, V9Raw (+59 more)

### Community 35 - "node/client.test.ts"
Cohesion: 0.04
Nodes (42): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, caught() (+34 more)

### Community 37 - "builder.test.ts"
Cohesion: 0.04
Nodes (38): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+30 more)

### Community 38 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (69): ProcessConfig, Answered, Observation, Start, Refusal, Start, listenError(), startAdminServer() (+61 more)

### Community 39 - "upgrade-boundary.test.ts"
Cohesion: 0.06
Nodes (65): ProcessingEnd, ProcessStatus, Q142Observation, A43Observation, testBuild, AlwaysLost, Fault, Recorded (+57 more)

### Community 4 - "UmbraError"
Cohesion: 0.02
Nodes (144): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+136 more)

### Community 40 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (67): MetadataVariant, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+59 more)

### Community 41 - "declaration.ts"
Cohesion: 0.04
Nodes (43): ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink, KnownPointsOnly (+35 more)

### Community 42 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (57): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, RetainedState, retainedStates, CoreRevision, GreyPicker, blockHeaderOf() (+49 more)

### Community 43 - "module-tables.ts"
Cohesion: 0.06
Nodes (47): CaptureColumn, CaptureState, CheckedMigration, ModuleColumn, ModuleContentsError, PageOptions, ConsistentRead, ColumnType (+39 more)

### Community 44 - "LedgerPackage"
Cohesion: 0.06
Nodes (30): LedgerPackage, StateHandle, LedgerEngine, Settled, hexOf(), idOf(), same(), sameBytes() (+22 more)

### Community 45 - "process-build.ts"
Cohesion: 0.05
Nodes (38): BlockItemSource, StatusFacts, ChainBuildOptions, CoreSeen, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext() (+30 more)

### Community 46 - "createClient"
Cohesion: 0.08
Nodes (52): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+44 more)

### Community 47 - "NodeBlockSource"
Cohesion: 0.07
Nodes (17): HeadWait, NodeBlockSource, Prefetch, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow (+9 more)

### Community 48 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (34): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+26 more)

### Community 49 - "key-checks.ts"
Cohesion: 0.07
Nodes (61): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Admission, AdmittedSeen, Blocking, KeyCall (+53 more)

### Community 5 - "range.ts"
Cohesion: 0.02
Nodes (138): NodeClientOptions, NodeSubscription, ConnectSocket, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest (+130 more)

### Community 50 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (56): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+48 more)

### Community 51 - "cbor.ts"
Cohesion: 0.07
Nodes (53): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+45 more)

### Community 52 - "admin/types.ts"
Cohesion: 0.06
Nodes (45): adminRoutes, AdminEndpoint, AdminPart, ChainView, DeclarationView, InstanceStatus, ItemView, ModuleTableStatus (+37 more)

### Community 53 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (44): ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+36 more)

### Community 54 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (52): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, boundTo(), coreChainDbWrite() (+44 more)

### Community 55 - "transport-faults.test.ts"
Cohesion: 0.07
Nodes (34): ResultColumn, Message, MessageType, Pem, TestCertificates, Ended, rawClient, mutualTlsOptions() (+26 more)

### Community 56 - "transform-checks.ts"
Cohesion: 0.10
Nodes (35): TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+27 more)

### Community 57 - "admin-harness.ts"
Cohesion: 0.08
Nodes (47): AdminRun, AdminRunOptions, Answerer, Expected, Hold, Prober, ProbeRecord, TestBuildOptions (+39 more)

### Community 58 - "builds.ts"
Cohesion: 0.07
Nodes (46): AdminStarter, PrivateOptions, PrivateProcess, PrivateRefusal, PublicCoreOptions, TestKeyConfig, KeyCrashJob, PrivacyOptions (+38 more)

### Community 59 - "spawnChild"
Cohesion: 0.05
Nodes (43): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, dockerExec(), alive() (+35 more)

### Community 6 - "translatePostgresError"
Cohesion: 0.02
Nodes (148): TransactionHistoryReader, TransactionHistoryWriter, Lease, LeaseAcquireOptions, LeaseFaultError, TransactionHandle, TransactionHandleInvalidError, TransactionOptions (+140 more)

### Community 60 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 62 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (40): HeightActivity, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+32 more)

### Community 63 - "core-settings.ts"
Cohesion: 0.06
Nodes (43): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+35 more)

### Community 64 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange (+37 more)

### Community 65 - "both-backends.test.ts"
Cohesion: 0.07
Nodes (29): ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, freshDatabase(), hashOf(), hex() (+21 more)

### Community 66 - "serve.test.ts"
Cohesion: 0.09
Nodes (28): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+20 more)

### Community 67 - "lifecycle.test.ts"
Cohesion: 0.07
Nodes (31): coreEntry, SignalTarget, Validator, Child, tableKey(), statusOf(), adminCore(), adminCoreSettings() (+23 more)

### Community 68 - "private/backends.ts"
Cohesion: 0.08
Nodes (22): PrivateBackend, SessionSeen, Pause, SkipsLockstep, A112Observation, Wiring, TransportProxy, pgliteBackend() (+14 more)

### Community 69 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 7 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (150): SourceShared, itemsSeen, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched (+142 more)

### Community 72 - "version-checks.ts"
Cohesion: 0.13
Nodes (29): MetadataNode, LedgerTable, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers (+21 more)

### Community 73 - "validation.ts"
Cohesion: 0.09
Nodes (31): DeclarationRule, PlacedDeclaration, Plain, Shape, checkItem(), checkShape(), first(), isObject() (+23 more)

### Community 74 - "core-chain-events.ts"
Cohesion: 0.08
Nodes (34): BlockEventSource, MetadataField, systemEventsKey(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch() (+26 more)

### Community 75 - "core-key-registry.test.ts"
Cohesion: 0.07
Nodes (27): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+19 more)

### Community 77 - "net.test.ts"
Cohesion: 0.09
Nodes (19): IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade, RawData (+11 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, LedgerRow (+26 more)

### Community 8 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (150): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Json, Scenario, transactionSpec, RecordingClient (+142 more)

### Community 85 - "binding.test.ts"
Cohesion: 0.11
Nodes (27): builtInNetwork, TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight() (+19 more)

### Community 86 - "process-context.test.ts"
Cohesion: 0.09
Nodes (22): MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems(), consumer() (+14 more)

### Community 87 - "Lockstep"
Cohesion: 0.10
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 88 - "browser.test.ts"
Cohesion: 0.10
Nodes (28): Reachable, PageEvent, StatusBody, PageRequest, midChainProblems(), networkProblems(), plain(), resumeProblems() (+20 more)

### Community 89 - "writer-lock-checks.ts"
Cohesion: 0.14
Nodes (24): WriterProcess, Job, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+16 more)

### Community 9 - "FinalizedLoop"
Cohesion: 0.03
Nodes (79): PointName, HeightRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule (+71 more)

### Community 90 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+16 more)

### Community 91 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 95 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 98 - "zero-timeouts-checks.ts"
Cohesion: 0.15
Nodes (21): Settings, Outcome, setUp(), idleBlock(), migrated(), part(), seenAt(), slowCallbackRead() (+13 more)

### Community 99 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 236 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 140 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (13): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 148 - "ref_node_child_process"
Cohesion: 0.13
Nodes (12): end(), removeContainers(), check, checker, env, forwarded, repoRoot, reportPath (+4 more)

### Community 153 - ".slowBlockMs"
Cohesion: 0.15
Nodes (13): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears (+5 more)

### Community 155 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 158 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 165 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 185 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 190 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 192 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 209 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 228 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 269 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 273 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 36 - "T"
Cohesion: 0.03
Nodes (81): n(), T(), 1. TemporalKV — event-sourced right action with a CAS guard, 4. Law-by-law repair map, 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+73 more)

### Community 61 - "version"
Cohesion: 0.04
Nodes (46): version(), TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 5. Test infrastructure (+38 more)

### Community 76 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 78 - "table"
Cohesion: 0.06
Nodes (36): table(), Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Running a module with the `umbradb` command (+28 more)

### Community 80 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 92 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.07
Nodes (28): insert(), 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints (+20 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 116 - "package.json"
Cohesion: 0.09
Nodes (22): bin, umbradb, description, exports, files, homepage, license, main (+14 more)

### Community 123 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build, Requirement: CF-9 The development opt-in gates development-only features (+12 more)

### Community 131 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 136 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 137 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 139 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 141 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 143 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+7 more)

### Community 154 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 156 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 161 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 163 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 167 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 171 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 175 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 177 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 178 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 180 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.17
Nodes (11): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 3. Modules, 4. Configuration (+3 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 182 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 183 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 184 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 186 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 187 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 191 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 193 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 194 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 195 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 196 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 197 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 198 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 199 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 203 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 204 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 205 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 206 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 207 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 208 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 210 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 211 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 212 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 213 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 214 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 215 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 216 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 217 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 218 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 219 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 220 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 221 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 222 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 223 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 224 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 225 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 226 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 227 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 232 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 233 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 234 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 235 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 237 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 239 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 240 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 241 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 242 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 243 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 244 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 245 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 246 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 247 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 248 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 249 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 250 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 251 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 252 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 253 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 254 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 255 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 256 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 257 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 258 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 259 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 260 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 261 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 262 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 263 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 264 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 265 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 266 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 267 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 268 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 270 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 271 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 272 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 275 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 276 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 277 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 278 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 279 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 280 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 281 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 282 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 283 - "Requirement: CF-3 Every entry is validated at startup"
Cohesion: 0.50
Nodes (4): Requirement: CF-3 Every entry is validated at startup, Scenario: A wrong type, Scenario: An upgrade that renames a setting, Scenario: Scheduling a newer version from the current build

### Community 284 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 285 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 286 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 294 - "Requirement: RN-5 The block context carries one height's items"
Cohesion: 0.67
Nodes (3): Requirement: RN-5 The block context carries one height's items, Scenario: A second put is an error, Scenario: An item reaches a later callback of the same block

### Community 295 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 296 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 82 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+21 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

## Knowledge Gaps
- **54 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-9110`, `RFC-6455`, `RFC-6455` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3619 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModuleDeclaration`, `PgTransactionLeaseLayer`, `ref_node_crypto`, `src/index.ts`, `UmbraError`, `range.ts`, `translatePostgresError`, `ledger-storage.test.ts`, `fetch-fixtures.ts`, `FinalizedLoop`, `api-server.test.ts`, `config/history.ts`, `tape/index.ts`, `validate.ts`, `ref_node_fs`, `BlockRef`, `InMemoryBlockSource`, `NodeClient`, `ledger/types.ts`, `order.property.test.ts`, `adapter-fixtures.ts`, `column-rules.ts`, `process-admin.ts`, `core-block-commit.test.ts`, `.from`, `core-transport.ts`, `config-check.ts`, `backup/restore.ts`, `PgTemporalKV`, `runner/process.ts`, `node-format.ts`, `contract-modules.test.ts`, `node/client.test.ts`, `builder.test.ts`, `refused-configuration.test.ts`, `upgrade-boundary.test.ts`, `core-block-parsed.ts`, `declaration.ts`, `core-ledger-state.ts`, `module-tables.ts`, `process-build.ts`, `createClient`, `NodeBlockSource`, `ledger-sweep.test.ts`, `key-checks.ts`, `contract-data-checks.ts`, `cbor.ts`, `admin/types.ts`, `chain-process.test.ts`, `changes.property.test.ts`, `transport-faults.test.ts`, `transform-checks.ts`, `admin-harness.ts`, `builds.ts`, `spawnChild`, `boundary.test.ts`, `slow-block-harness.ts`, `core-settings.ts`, `both-backends.test.ts`, `serve.test.ts`, `lifecycle.test.ts`, `private/backends.ts`, `version-checks.ts`, `core-chain-events.ts`, `core-key-registry.test.ts`, `net.test.ts`, `networks.ts`, `binding.test.ts`, `process-context.test.ts`, `Lockstep`, `browser.test.ts`, `writer-lock-checks.ts`, `crash.test.ts`, `browser/build.ts`, `checks.test.ts`, `zero-timeouts-checks.ts`, `intake.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `height-versioned.property.test.ts`, `run.test.ts`, `worker-threads.test.ts`, `cbor.property.test.ts`, `code-registry.ts`, `mapping.test.ts`, `node-bridge.ts`, `package.json`, `shims.test.ts`, `block-fetch-decode.test.ts`, `lockstep-refusals.test.ts`, `writer-lock.test.ts`, `private/lockstep-wait.test.ts`, `package-identity.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `ws-mutual-tls.test.ts`, `.name`, `pglite-timeouts.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `child-processes.ts`, `read-height.property.test.ts`, `twox.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `validation.test.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `no-chain-sync-import-guard.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-9110` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.017825894659923465 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `version-table.ts`, `range.ts`, `ledger-storage.test.ts`, `fetch-fixtures.ts`, `FinalizedLoop`, `package-identity.test.ts`, `config/history.ts`, `api-server.test.ts`, `validate.ts`, `ref_node_fs`, `BlockRef`, `InMemoryBlockSource`, `NodeClient`, `tape/index.ts`, `order.property.test.ts`, `process-admin.ts`, `core-block-commit.test.ts`, `core-transport.ts`, `config-check.ts`, `web-lock.ts`, `backup/restore.ts`, `runner/process.ts`, `contract-modules.test.ts`, `node/client.test.ts`, `refused-configuration.test.ts`, `upgrade-boundary.test.ts`, `declaration.ts`, `core-ledger-state.ts`, `module-tables.ts`, `LedgerPackage`, `validation.test.ts`, `NodeBlockSource`, `cbor.ts`, `admin/types.ts`, `chain-process.test.ts`, `changes.property.test.ts`, `transport-faults.test.ts`, `transform-checks.ts`, `builds.ts`, `RuntimeMetadata`, `slow-block-harness.ts`, `core-settings.ts`, `graph.ts`, `lifecycle.test.ts`, `version-checks.ts`, `validation.ts`, `core-key-registry.test.ts`, `table`, `binding.test.ts`, `process-context.test.ts`, `writer-lock-checks.ts`, `checks.test.ts`, `zero-timeouts-checks.ts`, `mapping.ts`, `mapping.test.ts`, `shims.test.ts`, `pglite-writer.worker.ts`, `lockstep-refusals.test.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.011579153605015675 - nodes in this community are weakly interconnected._