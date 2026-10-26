# Graph Report - UmbraDB

## Corpus Check
- 870 files · ~1,331,549 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9200 nodes · 26835 edges · 291 communities (266 shown, 25 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3161 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `9a70bd5d9298142e` (870 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- runner/process.ts
- PgTransactionHistoryStorage
- opt-out.test.ts
- writer-lock.ts
- writer-lock.negative-control.test.ts
- height
- db/durability-probe.test.ts
- ChainArchiveStore
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- TransactionHandle
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- binding.test.ts
- attempt
- PrivateBlockSource
- api-server.test.ts
- 3. Proof-blocking findings
- holds
- ws-mutual-tls.test.ts
- checkShape
- cursor-durability.crash.test.ts
- builds.ts
- pglite-timeouts.test.ts
- BlobIntegrityError
- read-height.property.test.ts
- cursor-table.property.test.ts
- NodeClient
- chain-archive-rollover.ts
- source-scan.ts
- intake.test.ts
- tape/index.ts
- Session
- component-table.test.ts
- height-versioned.property.test.ts
- node/client.test.ts
- ledger-state.test.ts
- ProcessItems
- ingest-harness.ts
- postgres-image.test.ts
- config/history.ts
- src/index.ts
- declaration.ts
- .blockHash
- a114Run
- saveAndAdvance
- mutation-evidence.d.mts
- builder.test.ts
- ref_node_path
- validate.test.ts
- process-admin.ts
- SkipsAfterReconnect
- vitest
- CliBackend
- adapter.ts
- ValidationError
- chain-placement.test.ts
- PgCheckpointStore
- child-processes.test.ts
- node-format.ts
- host.ts
- core-config.test.ts
- range.ts
- column-rules.ts
- LedgerPackage
- .value
- transform-checks.ts
- UmbraError
- plain-data.ts
- ref_node_fs
- PgTransactionLeaseLayer
- InMemoryBlockSource
- validation.ts
- ledger/types.ts
- networks.ts
- validate.ts
- harness.ts
- column-rules.test.ts
- db/errors.ts
- range.test.ts
- cbor.ts
- FinalizedLoop
- NodeBlockSource
- digests.test.ts
- chain-data.test.ts
- postgres/chain-archive-store.ts
- graph.ts
- chain-events-decode.test.ts
- admin-harness.ts
- node-source.ts
- core-ledger-state.ts
- fetch-fixtures.ts
- version-checks.ts
- cbor.property.test.ts
- .show
- runMigrations
- BlockRef
- stop-heights.test.ts
- checks.test.ts
- core-private-source.test.ts
- mapping.ts
- determinism-checks.ts
- loop.test.ts
- crash.test.ts
- writer-lock-checks.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- sigterm.test.ts
- chain-process.test.ts
- writer-lock.test.ts
- loop.ts
- Process
- ledger-checks.ts
- node-bridge.ts
- private/backends.ts
- changes.property.test.ts
- chain-data.negative-control.test.ts
- digest.test.ts
- tx-replay-decoder.ts
- Problem
- halted
- version
- pg
- mutation-per-adapter.mjs
- mapping.test.ts
- twox.ts
- address
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- scoped-review-manifest
- midnight-env — reproducible PREPROD dev environment
- .boolean
- failingSource
- parseJsonLossless
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- read-only-checks.ts
- fresh-instance.mjs
- integer
- a47Run
- T
- graph.py
- ADDED Requirements
- fn
- ADDED Requirements
- boundary.test.ts
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- Full-Chain Storage — Design
- stryker.conf.json
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- UmbraDB module guide
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ROADMAP.md
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- UmbraDB and SLSA — supply-chain integrity assessment
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- Security policy & threat model
- 12. Milestone status
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Algebraic Specification of the midnight-pg-store Storage Layer
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Acceptance criteria — v1.0.0-perf-baseline
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- 9. Backups and browser
- Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)
- Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- bugs
- engines
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 274 edges
2. `UmbraError` - 220 edges
3. `ModuleDeclaration` - 129 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `NodeClient` - 87 edges
7. `ValidationError` - 87 edges
8. `PgCheckpointStore` - 87 edges
9. `Database` - 84 edges
10. `InMemoryBlockSource` - 82 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `Scope — documented preconditions vs. implemented controls (1.0.0)` --references--> `CheckpointStore`  [INFERRED]
  docs/THREAT_MODEL.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (291 total, 25 thin omitted)

### Community 0 - "runner/process.ts"
Cohesion: 0.02
Nodes (191): OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait (+183 more)

### Community 1 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (195): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, TransactionHistoryStorage, JsonEncoded, PgTransactionHistoryStorage (+187 more)

### Community 10 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (88): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+80 more)

### Community 101 - "writer-lock.ts"
Cohesion: 0.14
Nodes (11): DurabilityWarning, Writer, WriterSession, WriterStart, rollBack(), takeWriterLock(), starts, TAKE_WRITER_LOCK_SQL (+3 more)

### Community 102 - "writer-lock.negative-control.test.ts"
Cohesion: 0.19
Nodes (16): PostgresTestDatabase, startWriter(), opened(), loginOn(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), nextTransaction() (+8 more)

### Community 103 - "height"
Cohesion: 0.11
Nodes (19): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+11 more)

### Community 105 - "db/durability-probe.test.ts"
Cohesion: 0.18
Nodes (17): DurabilityProbeOptions, DurabilityViolation, ProbeSession, Outcome, Outcome, Row, assertNoTransactionPooler(), classifyFsync() (+9 more)

### Community 107 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 108 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.12
Nodes (13): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`) (+5 more)

### Community 11 - "TransactionHandle"
Cohesion: 0.03
Nodes (106): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, AsOf, AssertExact (+98 more)

### Community 112 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 114 - "binding.test.ts"
Cohesion: 0.13
Nodes (11): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), readPrivateCursor(), bindingIn(), outcomeOf() (+3 more)

### Community 117 - "attempt"
Cohesion: 0.12
Nodes (17): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+9 more)

### Community 118 - "PrivateBlockSource"
Cohesion: 0.24
Nodes (7): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, 8. Private processes (PP), 14. Private processes

### Community 12 - "api-server.test.ts"
Cohesion: 0.03
Nodes (97): Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, VersionedResponse, ChainDataAnswer, ChainDataView, ApiError (+89 more)

### Community 121 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 124 - "holds"
Cohesion: 0.25
Nodes (10): VersionedValue, StoredVersion, BlockFails, Model, canonicalText(), holds(), readBack(), same() (+2 more)

### Community 125 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 128 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 13 - "cursor-durability.crash.test.ts"
Cohesion: 0.02
Nodes (121): JsonValue, KvRow, Adapters, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState (+113 more)

### Community 130 - "builds.ts"
Cohesion: 0.17
Nodes (14): PrivateRefusal, genesisBlock(), genesisHex(), launchPrivate(), poll(), PRIVATE_ROWS_SQL(), privateCoreEntry(), privateModule() (+6 more)

### Community 131 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 132 - "BlobIntegrityError"
Cohesion: 0.26
Nodes (11): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface (+3 more)

### Community 138 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 139 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 14 - "NodeClient"
Cohesion: 0.05
Nodes (68): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+60 more)

### Community 141 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 146 - "source-scan.ts"
Cohesion: 0.29
Nodes (13): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), lineOf(), literalText(), moduleReferences() (+5 more)

### Community 147 - "intake.test.ts"
Cohesion: 0.26
Nodes (12): PrivateProcess, PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights() (+4 more)

### Community 15 - "tape/index.ts"
Cohesion: 0.05
Nodes (72): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+64 more)

### Community 155 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 157 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 158 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (11): Block, Counts, Effect, Key, Op, GAPS, OVERLAPS, KEYS (+3 more)

### Community 16 - "node/client.test.ts"
Cohesion: 0.03
Nodes (56): NodeCallOptions, NodeClientOptions, RecordingClient, Answer, FakeNode, Handler, Received, recorded (+48 more)

### Community 17 - "ledger-state.test.ts"
Cohesion: 0.06
Nodes (92): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+84 more)

### Community 18 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (84): RUNTIME, Decoded, FetchSeen, CrashEvent, CrashJob, ingest, SourceClass, watched (+76 more)

### Community 183 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 19 - "config/history.ts"
Cohesion: 0.04
Nodes (92): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRow (+84 more)

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (205): CheckpointStoreError, ChunkIntegrityError, ManifestCorruptError, ConnectionError, Retryability, SerializationFailedError, SharedStorageErrorCode, StorageError (+197 more)

### Community 20 - "declaration.ts"
Cohesion: 0.04
Nodes (61): BlockWriteHandle, ReadHandle, SchemaWriteHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+53 more)

### Community 202 - ".blockHash"
Cohesion: 0.36
Nodes (5): Final, blockUnavailable(), walkOver(), recordHeights(), sameBytes()

### Community 21 - "saveAndAdvance"
Cohesion: 0.04
Nodes (80): CheckpointStoreErrorCode, TransactionLeaseLayer, WalletStateEnvelopeErrorCode, WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, SaveAndAdvanceCursor (+72 more)

### Community 215 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 22 - "builder.test.ts"
Cohesion: 0.04
Nodes (44): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Script (+36 more)

### Community 23 - "ref_node_path"
Cohesion: 0.04
Nodes (70): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+62 more)

### Community 24 - "validate.test.ts"
Cohesion: 0.03
Nodes (78): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+70 more)

### Community 25 - "process-admin.ts"
Cohesion: 0.06
Nodes (75): ConfigFacts, OpenedConfig, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow, ModuleFacts (+67 more)

### Community 26 - "vitest"
Cohesion: 0.04
Nodes (61): Metadata, Step, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+53 more)

### Community 27 - "adapter.ts"
Cohesion: 0.04
Nodes (66): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+58 more)

### Community 28 - "ValidationError"
Cohesion: 0.03
Nodes (82): ValidationError, UmbraDBConnectionOptions, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect (+74 more)

### Community 29 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (76): BodyExtrinsic, BlockBody, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+68 more)

### Community 3 - "PgCheckpointStore"
Cohesion: 0.02
Nodes (156): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointSummary, ChunkMissingError, ContentHash, HistoryOptions, PruneResult (+148 more)

### Community 30 - "child-processes.test.ts"
Cohesion: 0.03
Nodes (62): ParentJob, Kill, Orphaned, SourceFile, FailsOnceStarted, SlowToReportPorts, SourceFile, LockResult (+54 more)

### Community 31 - "node-format.ts"
Cohesion: 0.06
Nodes (53): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+45 more)

### Community 32 - "host.ts"
Cohesion: 0.06
Nodes (52): LoadLedger, LedgerStateItem, LedgerName, ChainOutcome, NodeBatch, ParsedTransaction, StateSummary, AppliedState (+44 more)

### Community 33 - "core-config.test.ts"
Cohesion: 0.06
Nodes (53): adminRoutes, AdminEndpoint, AdminPart, AdminView, ChainView, DeclarationView, InstanceStatus, ItemView (+45 more)

### Community 34 - "range.ts"
Cohesion: 0.04
Nodes (59): ConnectSocket, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments (+51 more)

### Community 35 - "column-rules.ts"
Cohesion: 0.04
Nodes (72): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+64 more)

### Community 36 - "LedgerPackage"
Cohesion: 0.05
Nodes (33): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+25 more)

### Community 38 - ".value"
Cohesion: 0.09
Nodes (43): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+35 more)

### Community 39 - "transform-checks.ts"
Cohesion: 0.07
Nodes (41): ManualTimers, Failure, Variant, TransformError, NotificationRange, scriptedSockets(), turns(), until() (+33 more)

### Community 4 - "UmbraError"
Cohesion: 0.03
Nodes (129): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, PlannedSchema (+121 more)

### Community 40 - "plain-data.ts"
Cohesion: 0.05
Nodes (49): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, LoadedConfig, LoadOptions, PlainArray (+41 more)

### Community 41 - "ref_node_fs"
Cohesion: 0.04
Nodes (41): Lockfile, Manifest, Upstream, Finding, GuardViolation, ReportedTest, namesRunner(), runnerStarts() (+33 more)

### Community 42 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (40): PgTransactionLeaseLayer, Adapters, GcPass, HistGroup, SampleObservation, InjectedReleaseFaultLayer, phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed() (+32 more)

### Community 43 - "InMemoryBlockSource"
Cohesion: 0.08
Nodes (45): InMemoryBlockSource, ProcessHandle, Flaky, Lost, CoreSeen, testBuild, A42Observation, Seen (+37 more)

### Community 44 - "validation.ts"
Cohesion: 0.04
Nodes (55): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, DeepReadonly, PrivateKeys, PrivateOnly (+47 more)

### Community 45 - "ledger/types.ts"
Cohesion: 0.07
Nodes (48): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerEvent, LedgerPackageOptions (+40 more)

### Community 46 - "networks.ts"
Cohesion: 0.05
Nodes (58): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+50 more)

### Community 47 - "validate.ts"
Cohesion: 0.06
Nodes (51): RedactionForms, SecretForm, TextPattern, ConfigRule, CursorRule, Issue, Plain, Needs (+43 more)

### Community 48 - "harness.ts"
Cohesion: 0.09
Nodes (46): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+38 more)

### Community 49 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 5 - "db/errors.ts"
Cohesion: 0.03
Nodes (101): CommittedHeight, ReadOptions, ReadTimeoutSetting, MultiStatementRunner, Job, JobQueue, PgliteDatabase, PgliteOptions (+93 more)

### Community 50 - "range.test.ts"
Cohesion: 0.05
Nodes (35): NodeSocketEvents, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, RangeOptions, connectWebSocket() (+27 more)

### Community 51 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 52 - "FinalizedLoop"
Cohesion: 0.08
Nodes (14): EntryBoundary, FinalizedLoop, LoopObserver, Startup, WaitingInRead, SkipsStartAtRestart, SilentHalt, EagerLoop (+6 more)

### Community 53 - "NodeBlockSource"
Cohesion: 0.09
Nodes (14): RuntimeMetadataView, HeadWait, NodeBlockSource, NodeBlock, NodeHeader, PreparedBlock, QueueRunner, NoWindow (+6 more)

### Community 54 - "digests.test.ts"
Cohesion: 0.07
Nodes (46): Chain, ChainOptions, DigestRow, digestBlock(), isCheckpointHeight(), identityRow(), captured(), captureFunction() (+38 more)

### Community 55 - "chain-data.test.ts"
Cohesion: 0.10
Nodes (45): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, LedgerHeight, ledgerScenario, LedgerScenarioOptions (+37 more)

### Community 56 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 57 - "graph.ts"
Cohesion: 0.07
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+36 more)

### Community 58 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (32): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, fill(), le() (+24 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (134): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+126 more)

### Community 60 - "node-source.ts"
Cohesion: 0.08
Nodes (19): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, Prefetch, LedgerBinding (+11 more)

### Community 61 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (32): CoreLedgerStateOptions, boundLedgerParser(), workerParser(), applyBlock(), boundLedger(), coreLedgerState(), hex(), itemsOf() (+24 more)

### Community 62 - "fetch-fixtures.ts"
Cohesion: 0.09
Nodes (34): ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, blake2b256(), compress(), rotateRight() (+26 more)

### Community 63 - "version-checks.ts"
Cohesion: 0.14
Nodes (28): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+20 more)

### Community 68 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 69 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 7 - "runMigrations"
Cohesion: 0.03
Nodes (120): UmbraDBSql, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, RunMigrationsOptions, Started, SqliteTxRow (+112 more)

### Community 70 - "BlockRef"
Cohesion: 0.09
Nodes (11): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery (+3 more)

### Community 72 - "stop-heights.test.ts"
Cohesion: 0.07
Nodes (22): ProcessingEnd, ProcessDatabase, CoreStopsFirst, NoRedelivery, RunObservation, A47Observation, CommitsTheBoundary, Controls (+14 more)

### Community 74 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 77 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (9): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS (+1 more)

### Community 78 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 79 - "determinism-checks.ts"
Cohesion: 0.15
Nodes (24): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, a113Run(), against(), withCore() (+16 more)

### Community 8 - "loop.test.ts"
Cohesion: 0.02
Nodes (118): ErrorCode, GraphInput, DeclarationRule, HeightRun, MisuseListener, PublishRefusal, PastFaultCase, RefusalCase (+110 more)

### Community 80 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 83 - "writer-lock-checks.ts"
Cohesion: 0.15
Nodes (22): WriterProcess, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory() (+14 more)

### Community 85 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 86 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 87 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (19): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+11 more)

### Community 88 - "chain-process.test.ts"
Cohesion: 0.09
Nodes (18): WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky, Seen (+10 more)

### Community 89 - "writer-lock.test.ts"
Cohesion: 0.14
Nodes (18): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+10 more)

### Community 9 - "loop.ts"
Cohesion: 0.03
Nodes (119): ItemSink, PointName, HeightRange, ResolvedRange, LateUse, Callback, CallbackFailure, ParallelPoint (+111 more)

### Community 91 - "Process"
Cohesion: 0.15
Nodes (5): Heartbeat, Process, messageOf(), pause(), beat()

### Community 92 - "ledger-checks.ts"
Cohesion: 0.18
Nodes (17): ChildReader, childRefKeys(), readChildren(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+9 more)

### Community 93 - "node-bridge.ts"
Cohesion: 0.13
Nodes (19): NodeStore, StoredNode, EngineOptions, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes() (+11 more)

### Community 94 - "private/backends.ts"
Cohesion: 0.13
Nodes (16): PrivateBackend, SessionSeen, A112Observation, Wiring, a146HashProblems(), a146RefusalProblems(), optedOutProblems(), schemaPlan() (+8 more)

### Community 95 - "changes.property.test.ts"
Cohesion: 0.12
Nodes (23): Op, States, TableName, encodeCanonical(), sha256(), text(), blockAgrees(), compareKeys() (+15 more)

### Community 97 - "chain-data.negative-control.test.ts"
Cohesion: 0.15
Nodes (19): BlockParsed, itemsSeen, Json, coreBlockParsedOnParse(), a91Problems(), a92Problems(), a93Problems(), itemsWatcher() (+11 more)

### Community 98 - "digest.test.ts"
Cohesion: 0.12
Nodes (21): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), nextDigest(), sameBytes(), hex() (+13 more)

### Community 99 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 222 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 100 - "halted"
Cohesion: 0.11
Nodes (21): halted(), cursorRead(), following(), 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions (+13 more)

### Community 104 - "version"
Cohesion: 0.10
Nodes (20): version(), Requirement: CF-7 The history row and its hash, Scenario: The same entry gives the same hash, 3. The freeze: build + package.json (G1), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+12 more)

### Community 106 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 136 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 137 - "mapping.test.ts"
Cohesion: 0.19
Nodes (4): mapValue(), identity(), RESULT_TYPES, RFC-3339

### Community 148 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 150 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 160 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 162 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 165 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 168 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 172 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 173 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 188 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 199 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 220 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 250 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 251 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 252 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 263 - "integer"
Cohesion: 0.50
Nodes (4): integer(), Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length

### Community 268 - "a47Run"
Cohesion: 0.83
Nodes (4): a47Run(), buildOf(), moduleM(), moduleN()

### Community 37 - "T"
Cohesion: 0.03
Nodes (69): T(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5) (+61 more)

### Community 65 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 67 - "fn"
Cohesion: 0.07
Nodes (34): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does (+26 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+20 more)

### Community 96 - "boundary.test.ts"
Cohesion: 0.17
Nodes (20): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+12 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 110 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 111 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 115 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 116 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 119 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 120 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.12
Nodes (17): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+9 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 123 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 126 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 127 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 129 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 133 - "UmbraDB module guide"
Cohesion: 0.13
Nodes (14): Blocks from the node, Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests (+6 more)

### Community 134 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 140 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 142 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules (+5 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 145 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 149 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 153 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 154 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 159 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 164 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 166 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 167 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 169 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 170 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 174 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 175 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 176 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 177 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 178 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 179 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1) (+1 more)

### Community 180 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 181 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 182 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 184 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 185 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 186 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 187 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 189 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 190 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution, Design — v1.0.0-infosec-signoff

### Community 191 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 192 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 194 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 195 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 196 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 197 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 198 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 200 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 201 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 205 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 206 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 207 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 208 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 209 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 210 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

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

### Community 216 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 217 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (4): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 218 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 219 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 221 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 223 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 224 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 225 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 226 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 227 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 228 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 229 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 230 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 231 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 232 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 233 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 234 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 235 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 236 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 237 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 238 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 239 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 240 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 241 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 242 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 243 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 244 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 245 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 246 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 247 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 248 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 249 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 254 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 255 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 256 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 257 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 258 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 259 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 260 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 261 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 262 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 264 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 265 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 266 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 271 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 272 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 273 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 274 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 59 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 71 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+22 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease (+19 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

## Knowledge Gaps
- **49 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3167 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `runner/process.ts`, `PgTransactionHistoryStorage`, `src/index.ts`, `PgCheckpointStore`, `UmbraError`, `db/errors.ts`, `admin-harness.ts`, `runMigrations`, `loop.test.ts`, `loop.ts`, `opt-out.test.ts`, `TransactionHandle`, `api-server.test.ts`, `cursor-durability.crash.test.ts`, `NodeClient`, `tape/index.ts`, `node/client.test.ts`, `ledger-state.test.ts`, `ingest-harness.ts`, `config/history.ts`, `declaration.ts`, `saveAndAdvance`, `builder.test.ts`, `ref_node_path`, `validate.test.ts`, `process-admin.ts`, `adapter.ts`, `chain-placement.test.ts`, `child-processes.test.ts`, `node-format.ts`, `host.ts`, `core-config.test.ts`, `transform-checks.ts`, `plain-data.ts`, `ref_node_fs`, `PgTransactionLeaseLayer`, `InMemoryBlockSource`, `validation.ts`, `ledger/types.ts`, `networks.ts`, `validate.ts`, `column-rules.test.ts`, `range.test.ts`, `digests.test.ts`, `chain-data.test.ts`, `chain-events-decode.test.ts`, `core-ledger-state.ts`, `fetch-fixtures.ts`, `version-checks.ts`, `cbor.property.test.ts`, `stop-heights.test.ts`, `checks.test.ts`, `core-private-source.test.ts`, `crash.test.ts`, `writer-lock-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `sigterm.test.ts`, `chain-process.test.ts`, `writer-lock.test.ts`, `node-bridge.ts`, `private/backends.ts`, `changes.property.test.ts`, `boundary.test.ts`, `chain-data.negative-control.test.ts`, `digest.test.ts`, `writer-lock.negative-control.test.ts`, `db/durability-probe.test.ts`, `package.json`, `binding.test.ts`, `ws-mutual-tls.test.ts`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `mapping.test.ts`, `read-height.property.test.ts`, `cursor-table.property.test.ts`, `intake.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `height-versioned.property.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.297) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `runner/process.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018576007672698822 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `runner/process.ts`, `checkShape`, `db/errors.ts`, `admin-harness.ts`, `loop.test.ts`, `loop.ts`, `opt-out.test.ts`, `mapping.test.ts`, `api-server.test.ts`, `NodeClient`, `tape/index.ts`, `node/client.test.ts`, `ledger-state.test.ts`, `ingest-harness.ts`, `config/history.ts`, `declaration.ts`, `ref_node_path`, `validate.test.ts`, `process-admin.ts`, `Session`, `range.ts`, `LedgerPackage`, `transform-checks.ts`, `plain-data.ts`, `InMemoryBlockSource`, `validation.ts`, `ledger/types.ts`, `networks.ts`, `validate.ts`, `cbor.ts`, `FinalizedLoop`, `NodeBlockSource`, `graph.ts`, `node-source.ts`, `core-ledger-state.ts`, `version-checks.ts`, `stop-heights.test.ts`, `.blockHash`, `failingSource`, `checks.test.ts`, `core-private-source.test.ts`, `mapping.ts`, `writer-lock-checks.ts`, `chain-process.test.ts`, `writer-lock.test.ts`, `changes.property.test.ts`, `writer-lock.ts`, `writer-lock.negative-control.test.ts`, `db/durability-probe.test.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.015956323711278014 - nodes in this community are weakly interconnected._