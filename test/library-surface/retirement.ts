/**
 * A5 `[STATIC]` (LS-5, task 17.2): the retirement list of `openspec/changes/core-arch/design.md` §13 ("Quality gates:
 * what moves and what is retired"), transcribed, and the checks that compare the tree with it — the required-test
 * manifest, `stryker.conf.json` `mutate`, the coverage floors of `vitest.config.ts` and the file list of `Formal/Lean`
 * (A5's four), and the rest of §13's rows: the retired files, the scripts, the barrel's names, the Quint change.
 *
 * Every check takes plain data and returns one sentence per problem, empty when there is none, so
 * `./retirement.test.ts` runs the same checks on the real tree and on its negative controls. {@link SECTION_13_TERMS}
 * holds §13's own words for each list below; the test checks that §13 still says them, so the transcription cannot
 * drift from the document unseen.
 */

// ---------------------------------------------------------------------------------------------------------------------
// Lean (`Formal/Lean`, `lean.yml`)
// ---------------------------------------------------------------------------------------------------------------------

/** The Lake project: `lean.yml` builds it with `lake build --wfail`, which elaborates `UmbraDBFormalTest/Trust.lean`. */
export const LEAN_ROOT = "Formal/Lean";

/**
 * The file list of `Formal/Lean` once §13 is applied, `.lake/` (Lake's build output, ignored by git) left out: the
 * Watermarks model and laws (W1, the cursor table's law, SH-1), `APISmoke`, the trust audit, and the project's files.
 */
export const LEAN_FILES: readonly string[] = [
  "Formal/Lean/UmbraDBFormal.lean",
  "Formal/Lean/UmbraDBFormal/APISmoke.lean",
  "Formal/Lean/UmbraDBFormal/Watermarks.lean",
  "Formal/Lean/UmbraDBFormal/Watermarks/Laws.lean",
  "Formal/Lean/UmbraDBFormal/Watermarks/Model.lean",
  "Formal/Lean/UmbraDBFormalTest.lean",
  "Formal/Lean/UmbraDBFormalTest/APISmoke.lean",
  "Formal/Lean/UmbraDBFormalTest/Trust.lean",
  "Formal/Lean/UmbraDBFormalTest/Watermarks/Laws.lean",
  "Formal/Lean/UmbraDBFormalTest/Watermarks/Model.lean",
  "Formal/Lean/lake-manifest.json",
  "Formal/Lean/lakefile.lean",
  "Formal/Lean/lean-toolchain",
  "Formal/Lean/scripts/check-trust.ps1",
];

/**
 * §13's retired Lean modules: TemporalKV (T1–T5 and retention) and Checkpoint (C1) with their `UmbraDBFormalTest`
 * counterparts, and the two aggregators that only import them (`Checkpoint.lean`, `TemporalKV/Retention.lean`, which
 * lies under the first prefix). A path is retired when it is one of these or lies below one ending in `/`.
 */
export const RETIRED_LEAN: readonly string[] = [
  "Formal/Lean/UmbraDBFormal/TemporalKV/",
  "Formal/Lean/UmbraDBFormal/Checkpoint/",
  "Formal/Lean/UmbraDBFormalTest/TemporalKV/",
  "Formal/Lean/UmbraDBFormalTest/Checkpoint/",
  "Formal/Lean/UmbraDBFormal/Checkpoint.lean",
];

/** `UmbraDBFormal.lean` keeps the `APISmoke` and `Watermarks` imports and drops `Checkpoint` and the three TemporalKV. */
export const FORMAL_IMPORTS: readonly string[] = ["UmbraDBFormal.APISmoke", "UmbraDBFormal.Watermarks"];

/** `UmbraDBFormalTest/Trust.lean`, trimmed the same way: it audits every module it imports. */
export const TRUST_IMPORTS: readonly string[] = [
  "Mathlib.Util.AssertNoSorry",
  "UmbraDBFormalTest.APISmoke",
  "UmbraDBFormalTest.Watermarks.Model",
  "UmbraDBFormalTest.Watermarks.Laws",
];

/** `APISmoke`'s lemmas: §13 retires the three checkpoint-union lemmas and keeps the other two. */
export const RETIRED_LEMMAS: readonly string[] = ["checkpoint_union_comm", "checkpoint_union_assoc", "checkpoint_union_idem"];
export const KEPT_LEMMAS: readonly string[] = ["watermark_overwrite", "adjacent_Ico_disjoint"];

/** Whether `path` is one of {@link RETIRED_LEAN} or lies below one of its directories. */
export function retiredLean(path: string): boolean {
  return RETIRED_LEAN.some((retired) => (retired.endsWith("/") ? path.startsWith(retired) : path === retired));
}

/** The modules a Lean file imports, in order. */
export function leanImports(source: string): string[] {
  return [...source.matchAll(/^import\s+(\S+)/gm)].map((match) => match[1]!);
}

/** The theorems a Lean file declares. */
export function leanTheorems(source: string): string[] {
  return [...source.matchAll(/^theorem\s+(\S+)/gm)].map((match) => match[1]!);
}

/**
 * The file list of `Formal/Lean` against §13: a retired module still there, a kept file missing, a file §13 does not
 * list, the aggregators' imports, `APISmoke`'s lemmas. `read` gives a file's text by its repository path.
 */
export function leanProblems(files: readonly string[], read: (path: string) => string): string[] {
  const problems: string[] = [];
  const present = new Set(files);
  for (const file of files) {
    if (retiredLean(file)) problems.push(`${file} is retired by design.md §13 (Lean) but still in ${LEAN_ROOT}`);
    else if (!LEAN_FILES.includes(file)) problems.push(`${file} is in ${LEAN_ROOT} but not in design.md §13's list`);
  }
  for (const file of LEAN_FILES) {
    if (!present.has(file)) problems.push(`${file} is kept by design.md §13 (Lean) but missing`);
  }
  const imports = (file: string, expected: readonly string[]): void => {
    if (!present.has(file)) return;
    const found = leanImports(read(file));
    if (found.join("\n") !== expected.join("\n")) {
      problems.push(`${file} imports [${found.join(", ")}], design.md §13 keeps exactly [${expected.join(", ")}]`);
    }
  };
  imports("Formal/Lean/UmbraDBFormal.lean", FORMAL_IMPORTS);
  imports("Formal/Lean/UmbraDBFormalTest/Trust.lean", TRUST_IMPORTS);
  const apiSmoke = "Formal/Lean/UmbraDBFormal/APISmoke.lean";
  if (present.has(apiSmoke)) {
    const theorems = leanTheorems(read(apiSmoke));
    for (const lemma of RETIRED_LEMMAS) {
      if (theorems.includes(lemma)) problems.push(`APISmoke.${lemma} is retired by design.md §13 but still declared`);
    }
    for (const lemma of KEPT_LEMMAS) {
      if (!theorems.includes(lemma)) problems.push(`APISmoke.${lemma} is kept by design.md §13 but missing`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------------------------------
// Required test ids (`test/integration/required-tests.manifest.json`)
// ---------------------------------------------------------------------------------------------------------------------

/** Ids 1–4 (`crash-harness.smoke.*`), kept; task 18.1 retargets them to a crash worker that drives the runner. */
export const KEPT_REQUIRED_IDS: readonly string[] = [
  "crash-harness.smoke.spawn-sigkill-container-survives",
  "crash-harness.smoke.pg-terminate-backend-drops-and-recovers",
  "crash-harness.smoke.suite-watchdog-bounds-stalled-backend",
  "crash-harness.smoke.suite-watchdog-default-bound",
];

/** Ids 5–25, retired with the 0.9.5 parts their tests drive. */
export const RETIRED_REQUIRED_IDS: readonly string[] = [
  "crash-harness.smoke.no-hook-ordinary-save",
  "crash-harness.smoke.hook-pauses.before-commit",
  "crash-harness.smoke.hook-pauses.in-critical-section",
  "crash-harness.smoke.hook-pauses.after-data-commit-before-cursor",
  "crash-harness.smoke.hook-pauses.after-cursor-before-data",
  "crash-harness.smoke.t5-full-flow-negative-control",
  "crash.process-kill-save.no-partial-checkpoint",
  "crash.pg-kill-save.typed-connection-error",
  "crash.pg-kill-save.retry-benign-duplicate",
  "crash.cursor-durability.watermark-never-ahead",
  "crash.cursor-durability.replay-converges",
  "crash.cursor-durability.synchronous-commit-on",
  "crash.cursor-durability.synchronous-commit-off",
  "crash.lease-nonwedge.no-wedge-cold-start",
  "soak.full-sync.invariants-hold",
  "soak.load-under-prune.snapshot-isolation-safe",
  "property.p3.replay-fold-equivalence",
  "differential.fault-schedule.state-equivalent",
  "crash.saveAndAdvance.co-tx-atomic",
  "differential.fault-schedule.negative-control-fires",
  "differential.reference.import-clean",
];

/** The deferred id, retired with the 0.9.5 save it was deferred for. */
export const RETIRED_DEFERRED_IDS: readonly string[] = ["crash.pg-kill-save.no-duplicate-with-idempotency-key"];

/** The ids of `acceptance.md` §17 ("Required test ids added to the manifest"), read from its table. */
export function acceptanceIds(acceptance: string): string[] {
  const start = acceptance.indexOf("## 17. Required test ids added to the manifest");
  if (start < 0) return [];
  const next = acceptance.indexOf("\n## ", start + 1);
  const section = acceptance.slice(start, next < 0 ? undefined : next);
  return [...section.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]!);
}

export interface ManifestShape {
  readonly required: readonly { readonly id: string; readonly file?: string }[];
  readonly deferred?: readonly { readonly id: string }[];
}

/**
 * The manifest against §13: ids 1–4 kept, ids 5–25 and the deferred id gone, nothing else but `acceptance.md` §17's
 * ids (`added`), and the pinned count equal to the list. `pending` names the added ids that may still be absent: task
 * 18.4 adds them all and passes none, and from then on the comparison is exact.
 */
export function manifestProblems(
  manifest: ManifestShape,
  added: readonly string[],
  pending: readonly string[],
  pinnedCount: number,
  pinnedDeferred: number,
): string[] {
  const problems: string[] = [];
  const required = manifest.required.map((entry) => entry.id);
  const deferred = (manifest.deferred ?? []).map((entry) => entry.id);
  const allowed = new Set([...KEPT_REQUIRED_IDS, ...added]);
  const retired = new Set([...RETIRED_REQUIRED_IDS, ...RETIRED_DEFERRED_IDS]);
  for (const id of [...required, ...deferred]) {
    if (retired.has(id)) problems.push(`the manifest still holds ${id}, retired by design.md §13`);
  }
  for (const id of required) {
    if (!allowed.has(id) && !retired.has(id)) {
      problems.push(`the manifest requires ${id}, which is neither a kept id (1–4) nor an id of acceptance.md §17`);
    }
  }
  for (const id of KEPT_REQUIRED_IDS) {
    if (!required.includes(id)) problems.push(`the manifest lacks ${id}, kept by design.md §13 (ids 1–4)`);
  }
  for (const id of added) {
    if (!required.includes(id) && !pending.includes(id)) {
      problems.push(`the manifest lacks ${id}, an id of acceptance.md §17`);
    }
  }
  for (const id of deferred) {
    if (!retired.has(id)) problems.push(`the manifest defers ${id}; design.md §13 leaves no deferred id`);
  }
  if (pinnedCount !== required.length) {
    problems.push(`EXPECTED_REQUIRED_COUNT is ${pinnedCount} but the manifest requires ${required.length} ids`);
  }
  if (pinnedDeferred !== deferred.length) {
    problems.push(`EXPECTED_DEFERRED_COUNT is ${pinnedDeferred} but the manifest defers ${deferred.length} ids`);
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------------------------------
// Mutation (`stryker.conf.json` `mutate`, break 65; `vitest.mutation.config.ts`)
// ---------------------------------------------------------------------------------------------------------------------

/**
 * §13's mutation targets at the paths the build gave them (Q157): §13 named `src/runner/order.ts` (the order within
 * a point, RN-3: `src/runner/dispatch.ts`), `src/ledger/sweep.ts` (LG-14's step: `src/backbone/core-ledger-state/
 * sweep.ts`, task 12.5) and `src/backbone/block-fetch-queue.ts` (the best-block queue and the finalized prefetch, IN-5
 * and IN-6: `src/backbone/core-block-fetch/node-source.ts`, task 10.3). Each with the fast tests that kill its mutants;
 * `vitest.mutation.config.ts` runs exactly their union, and Stryker runs, per target, those that import it.
 */
export const MUTATION_TARGETS: Readonly<Record<string, readonly string[]>> = {
  "src/modules/graph.ts": ["test/modules/graph.test.ts", "test/modules/graph-public-items.test.ts"],
  "src/runner/dispatch.ts": ["test/runner/dispatch.test.ts", "test/runner/order.property.test.ts"],
  "src/config/history.ts": ["test/config/history.test.ts", "test/config/history.property.test.ts"],
  "src/determinism/cbor.ts": ["test/determinism/cbor.test.ts", "test/determinism/cbor.property.test.ts"],
  "src/determinism/digest.ts": ["test/determinism/digest.test.ts"],
  "src/helpers/height-versioned.ts": [
    "test/helpers/height-versioned.test.ts",
    "test/helpers/height-versioned.property.test.ts",
  ],
  "src/helpers/cursor-table.ts": ["test/helpers/cursor-table.test.ts", "test/helpers/cursor-table.property.test.ts"],
  "src/backbone/core-ledger-state/sweep.ts": ["test/backbone/ledger-sweep.test.ts"],
  "src/backbone/core-block-fetch/node-source.ts": ["test/backbone/node-source.test.ts"],
};

/** The five 0.9.5 adapters §13 retires as targets. */
export const RETIRED_MUTATION_TARGETS: readonly string[] = [
  "src/postgres/save-and-advance.ts",
  "src/postgres/checkpoint-store.ts",
  "src/postgres/watermarks.ts",
  "src/postgres/transaction-lease.ts",
  "src/postgres/temporal-kv.ts",
];

/** The break threshold §13 keeps. */
export const MUTATION_BREAK = 65;

/** `stryker.conf.json`'s `mutate` and break, and the mutation run's tests, against §13. */
export function mutationProblems(mutate: readonly string[], include: readonly string[], breakAt: number): string[] {
  const problems: string[] = [];
  const targets = Object.keys(MUTATION_TARGETS);
  for (const file of mutate) {
    if (RETIRED_MUTATION_TARGETS.includes(file)) problems.push(`stryker.conf.json still mutates ${file}, retired`);
    else if (!targets.includes(file)) problems.push(`stryker.conf.json mutates ${file}, not a target of design.md §13`);
  }
  for (const file of targets) {
    if (!mutate.includes(file)) problems.push(`stryker.conf.json does not mutate ${file}, a target of design.md §13`);
  }
  const tests = new Set(Object.values(MUTATION_TARGETS).flat());
  for (const file of include) {
    if (!tests.has(file)) problems.push(`the mutation run includes ${file}, not a test of a target of design.md §13`);
  }
  for (const file of tests) {
    if (!include.includes(file)) problems.push(`the mutation run lacks ${file}, a test of a target of design.md §13`);
  }
  if (breakAt !== MUTATION_BREAK) problems.push(`stryker.conf.json breaks at ${breakAt}, design.md §13 keeps 65`);
  return problems;
}

// ---------------------------------------------------------------------------------------------------------------------
// Coverage floors (`vitest.config.ts`)
// ---------------------------------------------------------------------------------------------------------------------

export interface Floor {
  readonly lines: number;
  readonly branches: number;
}

/** The five 0.9.5 floors §13 retires, and the three it keeps at moved paths (their old keys go with the files). */
export const RETIRED_FLOORS: readonly string[] = [
  "**/postgres/checkpoint-store.ts",
  "**/postgres/save-and-advance.ts",
  "**/postgres/watermarks.ts",
  "**/postgres/temporal-kv.ts",
  "**/postgres/transaction-lease.ts",
  "**/postgres/durability-probe.ts",
  "**/postgres/migrate.ts",
  "**/postgres/errors.ts",
];

/**
 * The floors §13 keeps at their moved paths and adds, each at least the figure given: `durability-probe`, `migrate`,
 * `errors` (the database API's and the `deterministic_postgresql` component's, which holds `UmbraError` since Q79),
 * the 95/90 directories, the sweep (`src/ledger/sweep*` in §13; as built, `src/backbone/core-ledger-state/sweep.ts`,
 * Q157) and the test tape. §13's default for `src/**` (90/85) is {@link DEFAULT_SRC_FLOOR}, one glob per directory.
 */
export const REQUIRED_FLOORS: Readonly<Record<string, Floor>> = {
  "**/src/db/durability-probe.ts": { lines: 97, branches: 92 },
  "**/src/db/migrate.ts": { lines: 90, branches: 85 },
  "**/src/db/errors.ts": { lines: 95, branches: 91 },
  "**/src/deterministic-postgresql/errors.ts": { lines: 95, branches: 91 },
  "**/src/determinism/**": { lines: 95, branches: 90 },
  "**/src/deterministic-postgresql/**": { lines: 95, branches: 90 },
  "**/src/helpers/**": { lines: 95, branches: 90 },
  "**/src/backbone/core-ledger-state/sweep.ts": { lines: 95, branches: 90 },
  "**/tools/tape/**": { lines: 90, branches: 85 },
};

/**
 * §13's floors not yet in `vitest.config.ts`, each with the reason; a pending floor may be absent, never weaker. The
 * sweep's 95/90 (Q158): `sweep.ts` measures 100 % lines and 89.33 % branches (67 of 75, 2026-10-27: eight branches
 * are defensive refusals and comparison ties no test reaches), so the floor would fail the gate; it stays under
 * the backbone's 90/85 floor until tests reach those branches or the owner answers otherwise. Empty once applied.
 */
export const PENDING_FLOORS: readonly string[] = ["**/src/backbone/core-ledger-state/sweep.ts"];

/** §13's default floor for every file of `src/`. */
export const DEFAULT_SRC_FLOOR: Floor = { lines: 90, branches: 85 };

/** The coverage exclusions of the 0.9.5 chain archive (`vitest.config.ts`), removed with it. */
export const RETIRED_COVERAGE_EXCLUDES: readonly string[] = [
  "src/postgres/chain-archive-store.ts",
  "src/postgres/chain-archive-rollover.ts",
  "src/interfaces/chain-archive-store.ts",
  "src/postgres/migrations/chain_archive/**",
];

/**
 * The coverage floors against §13. `thresholds` is `vitest.config.ts`'s `coverage.thresholds` (its glob keys hold
 * `{ lines, branches }`); `srcEntries` the names directly in `src/` (directories end with `/`), every one of which but
 * the barrel must fall under a floor of at least §13's default.
 */
export function floorProblems(
  thresholds: Readonly<Record<string, unknown>>,
  exclude: readonly string[],
  srcEntries: readonly string[],
  pending: readonly string[] = [],
): string[] {
  const problems: string[] = [];
  const floor = (key: string): Floor | undefined => {
    const value = thresholds[key];
    if (typeof value !== "object" || value === null) return undefined;
    const { lines, branches } = value as { lines?: unknown; branches?: unknown };
    return typeof lines === "number" && typeof branches === "number" ? { lines, branches } : undefined;
  };
  const atLeast = (key: string, wanted: Floor, why: string): void => {
    const found = floor(key);
    if (found === undefined) problems.push(`vitest.config.ts has no floor ${key} (${why})`);
    else if (found.lines < wanted.lines || found.branches < wanted.branches) {
      problems.push(
        `vitest.config.ts holds ${key} at ${found.lines}/${found.branches}, below ${wanted.lines}/${wanted.branches} (${why})`,
      );
    }
  };
  for (const key of RETIRED_FLOORS) {
    if (key in thresholds) problems.push(`vitest.config.ts still holds the floor ${key}, retired by design.md §13`);
  }
  for (const [key, wanted] of Object.entries(REQUIRED_FLOORS)) {
    if (pending.includes(key) && !(key in thresholds)) continue;
    atLeast(key, wanted, "design.md §13");
  }
  for (const entry of srcEntries) {
    if (entry === "index.ts") continue;
    if (entry.endsWith("/")) atLeast(`**/src/${entry}**`, DEFAULT_SRC_FLOOR, "design.md §13's default for src/**");
    else problems.push(`src/${entry} lies under no floor of design.md §13 (only directories have one)`);
  }
  for (const glob of RETIRED_COVERAGE_EXCLUDES) {
    if (exclude.includes(glob)) problems.push(`vitest.config.ts still excludes ${glob} from coverage (chain archive)`);
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------------------------------
// The retired files, the scripts, the barrel, the Quint change
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Every path §13 (and task 17.2's text) retires; a path ending in `/` is a whole directory. The 0.9.5 source —
 * TemporalKV, CheckpointStore, Watermarks, the transaction/lease layer, `saveAndAdvance`, WalletStateEnvelope, the
 * `chain_archive` store with its rollover and partitions, and the plumbing the new core refactored into `src/db/`
 * (client, migration runner and lineage, durability probe, errors, abort helper) — and `chain-archive-sync/`; their
 * tests (the "Test files" row; the 0.9.5 API pins of the "Public API pins" row); the benchmarks' workloads and
 * baseline with the harness and smoke guard that only drive them (the TransactionHistory workload included).
 */
export const RETIRED_PATHS: readonly string[] = [
  "src/postgres/",
  "src/interfaces/",
  "chain-archive-sync/",
  // TemporalKV, Watermarks, CheckpointStore, Lease, saveAndAdvance, WalletStateEnvelope and cross-part durability tests;
  // no-consumer-import-in-bench; chain-archive-{migrate,rollover,store}; no-chain-sync-import-guard; client, errors,
  // migrate, durability-probe (refactored or moved to test/db/); migration-lock-timeout.
  "test/postgres/checkpoint-id-validation.test.ts",
  "test/postgres/checkpoint-store-contract-doc.test.ts",
  "test/postgres/checkpoint-store-cotx.test.ts",
  "test/postgres/checkpoint-store.property.test.ts",
  "test/postgres/checkpoint-store.test.ts",
  "test/postgres/chain-archive-migrate.test.ts",
  "test/postgres/chain-archive-rollover.test.ts",
  "test/postgres/chain-archive-store.test.ts",
  "test/postgres/client.test.ts",
  "test/postgres/differential-equivalence.test.ts",
  "test/postgres/durability-probe.test.ts",
  "test/postgres/durable-cursor-crash-handoff.test.ts",
  "test/postgres/errors.test.ts",
  "test/postgres/json-depth.test.ts",
  "test/postgres/migrate.test.ts",
  "test/postgres/migration-lock-timeout.test.ts",
  "test/postgres/no-chain-sync-import-guard.test.ts",
  "test/postgres/no-consumer-import-in-bench.test.ts",
  "test/postgres/perf-batching.test.ts",
  "test/postgres/save-and-advance-import-guard.test.ts",
  "test/postgres/save-and-advance.property.test.ts",
  "test/postgres/save-and-advance.test.ts",
  "test/postgres/temporal-kv.property.test.ts",
  "test/postgres/temporal-kv.test.ts",
  "test/postgres/timeouts.test.ts",
  "test/postgres/transaction-lease.property.test.ts",
  "test/postgres/transaction-lease.test.ts",
  "test/postgres/wallet-state-envelope.property.test.ts",
  "test/postgres/wallet-state-envelope.test.ts",
  "test/postgres/watermarks.property.test.ts",
  "test/postgres/watermarks.test.ts",
  "test/postgres/with-lease-release-fault.test.ts",
  "test/integration/crash/process-kill-save.crash.test.ts",
  "test/integration/crash/pg-kill-save.crash.test.ts",
  "test/integration/crash/cursor-durability.crash.test.ts",
  "test/integration/crash/lease-nonwedge.crash.test.ts",
  "test/integration/crash/saveandadvance-cotx.crash.test.ts",
  "test/integration/soak/",
  "test/integration/chain-archive-replay-decode.integration.test.ts",
  // The 36-symbol pins, the error-catalog and retryability tables of 0.9.5, and the chain-archive routing.
  "test/api-surface/barrel-resolves.test.ts",
  "test/api-surface/frozen-types.test.ts",
  "test/api-surface/error-catalog-drift.test.ts",
  "test/api-surface/retryability-table.test.ts",
  "test/api-surface/withtx-methods.test.ts",
  "test/api-surface/chain-archive-routing.test.ts",
  // The benchmarks: the TemporalKV, Watermarks, CheckpointStore (with its GC curve) and Lease workloads, their baseline,
  // the harness and smoke guard that run them, and the TransactionHistory workload moved by task 17.1.
  "bench/workloads/",
  "bench/baseline.1.0.0-perf-baseline.1.json",
  "bench/harness.ts",
  "bench/smoke.ts",
  "legacy/transaction-history/bench/",
];

/** Whether `path` is retired by {@link RETIRED_PATHS}. */
export function retiredPath(path: string): boolean {
  return RETIRED_PATHS.some((retired) => (retired.endsWith("/") ? path.startsWith(retired) : path === retired));
}

/** The files of `files` (repository paths) that §13 retires. */
export function retiredFileProblems(files: readonly string[]): string[] {
  return files.filter(retiredPath).map((file) => `${file} is retired by design.md §13 but still in the tree`);
}

/**
 * `package.json`'s scripts: `archive:sync` gone (§13's Scripts row); `test:live` gone and legacy's TypeScript program out
 * of `typecheck` (owner decision Q112 B, task 17.2).
 */
export function scriptProblems(scripts: Readonly<Record<string, string>>): string[] {
  const problems: string[] = [];
  if ("archive:sync" in scripts) problems.push("package.json still has the script archive:sync, retired by design.md §13");
  if ("test:live" in scripts) problems.push("package.json still has the script test:live (Q112 B: legacy's run is dropped)");
  for (const [name, command] of Object.entries(scripts)) {
    if (command.includes("legacy/")) problems.push(`package.json's script ${name} still runs legacy/ (Q112 B)`);
  }
  return problems;
}

/**
 * 0.9.5's public names (`src/index.ts` at `a75ed95`, less TransactionHistory's, which task 17.1 removed): the 35 values
 * and the types. `Migration` is left out: design §12 exports a type of that name (a module's migration).
 */
export const RETIRED_EXPORTS: readonly string[] = [
  "createClient", "DEFAULT_SCHEMA", "runMigrations", "MigrationLockTimeoutError",
  "PgTemporalKV", "PgCheckpointStore", "PgWatermarks", "PgTransactionLeaseLayer", "PgWalletStateEnvelopeStore",
  "saveAndAdvance", "Rollback",
  "StorageError", "ValidationError", "SerializationFailedError", "ConnectionError",
  "VersionConflictError", "HistoryUnavailableError", "TransactionKeyReuseError",
  "CheckpointNotFoundError", "ChunkMissingError", "ChunkIntegrityError", "ManifestCorruptError",
  "TransactionRolledBackError", "TransactionFaultError", "LeaseTimeoutError", "LeaseNotHeldError", "LeaseFaultError",
  "TransactionHandleInvalidError", "EnvelopeVersionUnsupportedError", "EnvelopeCorruptError",
  "ExclusionViolationError", "ClockRegressionError", "UnrecognizedPostgresError",
  "DurabilityContractError", "TransactionPoolerDetectedError",
  "UmbraDBSql", "UmbraDBConnectionOptions", "RunMigrationsOptions", "SaveAndAdvanceDeps", "SaveAndAdvanceCursor",
  "Retryability", "SharedStorageErrorCode",
  "TemporalKV", "VersionedEntry", "AsOf", "JsonValue", "Namespace", "Scope", "Key", "Version", "TemporalKVErrorCode",
  "Watermarks", "WatermarkKind", "WatermarkKey", "WatermarkValue",
  "CheckpointStore", "CheckpointSummary", "CheckpointRecord", "PruneResult", "SaveCheckpointOptions", "HistoryOptions",
  "CheckpointSequence", "ContentHash", "CheckpointStoreErrorCode",
  "TransactionLeaseLayer", "TransactionHandle", "Lease", "TransactionOptions", "LeaseAcquireOptions",
  "TransactionRollbackCause", "TransactionLeaseErrorCode",
  "WalletStateEnvelope", "WalletStateEnvelopeErrorCode",
];

/** The barrel's exported names (values and types) against the retired ones. */
export function exportProblems(where: string, names: readonly string[]): string[] {
  return names
    .filter((name) => RETIRED_EXPORTS.includes(name))
    .map((name) => `${where} still exports ${name}, a 0.9.5 name retired with its part (design.md §13, LS-2)`);
}

/** The Quint change's proposal: §13 sets its status to Archived, its laws being retired. */
export const QUINT_PROPOSAL = "openspec/changes/v1.1.0-quint-model-checking/proposal.md";

export function quintProblems(proposal: string): string[] {
  // The status line and its continuation lines, up to the next bold item of the block quote or the quote's end.
  const status = (/^> \*\*Status:\*\* ((?:.*)(?:\n> (?!\*\*).*)*)/m.exec(proposal)?.[1] ?? "").replace(/\n> /g, " ");
  if (!status.startsWith("Archived")) return [`${QUINT_PROPOSAL}'s status is "${status}", not Archived (design.md §13)`];
  for (const law of ["C2a", "C2b", "L1", "T1"]) {
    if (!status.includes(law)) return [`${QUINT_PROPOSAL}'s Archived status does not give §13's reason (${law} retired)`];
  }
  return [];
}

// ---------------------------------------------------------------------------------------------------------------------
// §13's own words
// ---------------------------------------------------------------------------------------------------------------------

/** The text of `design.md` §13. */
export function section13(design: string): string {
  const start = design.indexOf("## 13. Quality gates");
  const end = design.indexOf("\n## 14.", start);
  return start < 0 ? "" : design.slice(start, end < 0 ? undefined : end);
}

/** The words §13 uses for each list above: the transcription is checked against them. */
export const SECTION_13_TERMS: readonly string[] = [
  "`UmbraDBFormal/TemporalKV/**`",
  "`UmbraDBFormal/Checkpoint/**`",
  "`UmbraDBFormalTest` counterparts",
  "`Formal/Lean/UmbraDBFormal/Checkpoint.lean`",
  "`UmbraDBFormal/TemporalKV/Retention.lean`",
  "`checkpoint_union_comm/assoc/idem`",
  "`APISmoke.watermark_overwrite`",
  "`APISmoke.adjacent_Ico_disjoint`",
  "`UmbraDBFormal/Watermarks/**`",
  "Ids 1–4 (`crash-harness.smoke.*`)",
  "Ids 5–25 and the deferred `crash.pg-kill-save.no-duplicate-with-idempotency-key`",
  "`checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease`",
  "`durability-probe` 97/92, `migrate` 90/85, `errors` 95/91 (moved paths)",
  "`src/**` 90/85 by default",
  "`src/determinism/**`, `src/deterministic-postgresql/**`, `src/helpers/**`",
  "`tools/tape/**` 90/85",
  "the `chain-archive` coverage exclusion",
  "The five 0.9.5 adapters",
  "Break threshold 65",
  ...Object.keys(MUTATION_TARGETS).map((file) => `\`${file}\``),
  "`src/backbone/core-ledger-state/sweep.ts` 95/90",
  "`archive:sync`",
  "Status set to Archived: its laws (C2a, C2b, L1, T1 cross-writer) are retired",
  "TemporalKV, Watermarks, CheckpointStore, Lease and TransactionHistory workloads and their baseline",
  "The 36-symbol pins, the error-catalog and retryability tables of 0.9.5",
];

/** One problem for each term §13 no longer says. */
export function sectionProblems(section: string): string[] {
  return SECTION_13_TERMS.filter((term) => !section.includes(term)).map(
    (term) => `design.md §13 no longer says ${term}: the transcription in retirement.ts is out of date`,
  );
}
