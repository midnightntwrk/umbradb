import { posix } from "node:path";

/**
 * A3 `[STATIC]` (LS-3, task 17.1): what moved to `legacy/transaction-history/`, and the checks that keep it out of the
 * TypeScript build, the package, the conformance run and the exports.
 *
 * Every function here takes repository-relative POSIX paths and returns one sentence per problem, empty when there is
 * none, so `./legacy-excluded.test.ts` runs the same checks on the real lists (`npm pack --dry-run --json`, the
 * TypeScript programs, `vitest list`, the coverage and mutation configurations) and on the negative controls' lists.
 */

/** Where TransactionHistory lives until the private wallet-data feature (FEATURES F9) refactors it (LS-3). */
export const LEGACY_ROOT = "legacy/transaction-history";

/**
 * The files task 17.1 moved, at their 0.9.5 paths. Each now lives at the same path below {@link LEGACY_ROOT}, so the
 * imports between them are unchanged; only their imports of files that stayed are two levels longer.
 */
export const MOVED_SOURCE: readonly string[] = [
  "src/interfaces/transaction-history-storage.ts",
  "src/postgres/transaction-history-storage.ts",
  // The table's migration: it left 0.9.5's `tier1_wallet` lineage (`src/postgres/migrate.ts`) with the source.
  "src/postgres/migrations/004_transaction_history.ts",
];

/** Its tests, test doubles and the fixtures only they use (the live preprod tests' wallet-SDK loaders). */
export const MOVED_TESTS: readonly string[] = [
  "test/postgres/transaction-history-storage.test.ts",
  "test/postgres/transaction-history-storage.property.test.ts",
  "test/postgres/in-memory-transaction-history-storage.ts",
  "test/postgres/reference-merge.ts",
  "test/postgres/reference-merge-parity.test.ts",
  "test/integration/pg-tx-history-adapter.ts",
  "test/integration/pg-tx-history-adapter.test.ts",
  "test/integration/preprod-db-sync.integration.test.ts",
  "test/integration/cold-boot-recovery.integration.test.ts",
  "test/integration/live-fixtures/facade-merge-loader.ts",
  "test/integration/live-fixtures/midnight-wallet-sdk-loader.ts",
  "test/integration/live-fixtures/preprod-fixtures.ts",
];

/** Its benchmark workload, which imports the source (`design.md` §13 retires it with the baseline: task 17.2). */
export const MOVED_BENCHMARKS: readonly string[] = [
  "bench/workloads/transaction-history.ts",
  "bench/workloads/tx-history-merge.ts",
];

export const MOVED: readonly string[] = [...MOVED_SOURCE, ...MOVED_TESTS, ...MOVED_BENCHMARKS];

/**
 * What the move added: a note on what the folder is, its own TypeScript program (`npm run typecheck` runs it apart from
 * the repository's), its own Vitest configuration (never the conformance run's), and the test setup that adds
 * migration 004 to the database the moved tests start.
 */
export const ADDED: readonly string[] = ["README.md", "tsconfig.json", "vitest.config.ts", "test/postgres/setup.ts"]
  .map((path) => legacyPath(path));

/** The path below {@link LEGACY_ROOT} of a file moved from `path`. */
export function legacyPath(path: string): string {
  return `${LEGACY_ROOT}/${path}`;
}

/** Whether `path` is `legacy/` itself or below it. */
export function underLegacy(path: string): boolean {
  return path === "legacy" || path.startsWith("legacy/");
}

/** One problem for each path below `legacy/`. `where` names the list ("the TypeScript build", "the tarball"). */
export function legacyProblems(where: string, paths: Iterable<string>): string[] {
  const problems: string[] = [];
  for (const path of paths) {
    if (underLegacy(path)) problems.push(`${where} includes ${path}, a file under legacy/ (A3, LS-3)`);
  }
  return problems;
}

/** One problem for each path that is a moved file's 0.9.5 path: TransactionHistory back outside `legacy/`. */
export function movedProblems(where: string, paths: Iterable<string>): string[] {
  const moved = new Set(MOVED);
  const problems: string[] = [];
  for (const path of paths) {
    if (moved.has(path)) {
      problems.push(`${where} includes ${path}, TransactionHistory's, whose place is ${legacyPath(path)} (LS-3)`);
    }
  }
  return problems;
}

const TRANSACTION_HISTORY_NAME = /transaction[-_]?history|tx[-_]?history/i;

/**
 * One problem for each other path whose name is TransactionHistory's (`transaction-history`, `transaction_history`,
 * `TransactionHistory`, `tx-history`, in any case) — what the build would emit for such a source,
 * `dist/postgres/transaction-history-storage.js` and its kind, or a source the inventory above does not list. Paths
 * below `legacy/` and moved files' 0.9.5 paths are the two functions above's to report.
 */
export function transactionHistoryProblems(where: string, paths: Iterable<string>): string[] {
  const moved = new Set(MOVED);
  const problems: string[] = [];
  for (const path of paths) {
    if (underLegacy(path) || moved.has(path)) continue;
    if (TRANSACTION_HISTORY_NAME.test(path)) {
      problems.push(`${where} includes ${path}, a TransactionHistory file (LS-3)`);
    }
  }
  return problems;
}

/** The TypeScript build (`tsconfig.build.json`'s program): nothing of `legacy/`, nothing of TransactionHistory. */
export function buildProblems(where: string, files: readonly string[]): string[] {
  return [...legacyProblems(where, files), ...movedProblems(where, files), ...transactionHistoryProblems(where, files)];
}

/** The conformance run's test files (and any other list of what runs): nothing of `legacy/` or of the moved tests. */
export function runProblems(where: string, files: readonly string[]): string[] {
  return [...legacyProblems(where, files), ...movedProblems(where, files)];
}

/**
 * Whether one of `globs` matches `path` the way Vitest 4 matches coverage globs: anywhere in the file's path
 * (picomatch's `contains`, in `isIncluded` of `vitest/dist/chunks/coverage.*.js`, which the v8 provider asks about
 * every file a test loads), so `src/**` matches `legacy/transaction-history/src/…` too. Modelled as matching any
 * trailing run of the path's segments.
 */
function matchesWithin(path: string, globs: readonly string[]): boolean {
  const segments = path.split("/");
  return globs.some((glob) => segments.some((_, i) => posix.matchesGlob(segments.slice(i).join("/"), glob)));
}

/**
 * The coverage of the run: a file below `legacy/` that the `include` globs match and the `exclude` globs do not would
 * be measured, were a test to load it, and held to the default floor.
 */
export function coverageProblems(include: readonly string[], exclude: readonly string[]): string[] {
  const problems: string[] = [];
  for (const path of [...MOVED.map(legacyPath), ...ADDED]) {
    if (matchesWithin(path, include) && !matchesWithin(path, exclude)) {
      problems.push(`the run's coverage includes ${path}, a file under legacy/ (A3, LS-3)`);
    }
  }
  return problems;
}

/** One problem for each file found below {@link LEGACY_ROOT} that is neither a moved file nor one the move added. */
export function inventoryProblems(files: Iterable<string>): string[] {
  const inventory = new Set([...MOVED.map(legacyPath), ...ADDED]);
  const problems: string[] = [];
  for (const file of files) {
    if (!inventory.has(file)) problems.push(`${file} is in ${LEGACY_ROOT}/ but not in A3's inventory (legacy.ts)`);
  }
  return problems;
}

/** A3's last clause: `legacy/transaction-history/` holds the source and its tests, and nothing is left behind. */
export function holdsProblems(exists: (path: string) => boolean): string[] {
  const problems: string[] = [];
  for (const path of MOVED) {
    if (!exists(legacyPath(path))) problems.push(`${legacyPath(path)} is missing: A3 wants it in ${LEGACY_ROOT}/`);
    if (exists(path)) problems.push(`${path} is still at its 0.9.5 path (LS-3: ${legacyPath(path)})`);
  }
  for (const path of ADDED) {
    if (!exists(path)) problems.push(`${path} is missing`);
  }
  return problems;
}
