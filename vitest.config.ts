import { configDefaults, defineConfig } from "vitest/config";

/**
 * UmbraDB test + coverage configuration.
 *
 * Behaviour of `vitest run` is unchanged from the pre-config defaults (default `forks` pool,
 * default `**​/*.{test,spec}.ts` include, no global setup) — this file exists to add the
 * **coverage gate** that `v1.0.0-recovery-testing` owns and must CI-wire before G9 is declared
 * CLOSED (`docs/v1-implementation-guideline.md` §1.0, §2.3, §3.6). `src/` behaviour is untouched;
 * coverage only READS `src`.
 *
 * ── Coverage floors ──────────────────────────────────────────────────────────────────────────────────────────────
 * Lines and branches, per file. The repo-wide per-file floor (85 lines / 78 branches) applies to every included file no
 * glob below matches; vitest-4 semantics: a file matched by a glob threshold is checked ONLY against that glob (the
 * global thresholds are NOT inherited), glob keys must be real patterns, and each glob sets `perFile: true` itself.
 *
 * 0.9.5's durability floors (`checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease`)
 * and its chain-archive exclusions were retired with those parts by core-arch task 17.2 (`openspec/changes/core-arch/
 * design.md` §13); `durability-probe`, `migrate` and `errors` keep their floors at the paths they moved to, below.
 */

// CORE-ARCH floors (`openspec/changes/core-arch/design.md` §13, "Coverage floors" row), added with the directory each
// covers. The canonical encoding, the contents hash and digests decide whether two databases agree, so they are held
// above the default.
const CORE_ARCH = {
  "**/src/determinism/**": { lines: 95, branches: 90, perFile: true },
  // §13's default for `src/**`, added with the database API's directory; its errors module carries the `errors` floor
  // §13 keeps at the moved path.
  "**/src/db/**": { lines: 90, branches: 85, perFile: true },
  "**/src/db/errors.ts": { lines: 95, branches: 91, perFile: true },
  // §13's `migrate` floor at its moved path (task 2.4).
  "**/src/db/migrate.ts": { lines: 90, branches: 85, perFile: true },
  // §13's `durability-probe` floor at its moved path (task 2.5).
  "**/src/db/durability-probe.ts": { lines: 97, branches: 92, perFile: true },
  // §13's default for `src/**`, added with the modules' directory (task 3.1).
  "**/src/modules/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the configuration's directory (task 4.1).
  "**/src/config/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the runner's directory (task 5.1).
  "**/src/runner/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the `umbradb` command's directory (task 4.4).
  "**/src/cli/**": { lines: 90, branches: 85, perFile: true },
  "**/src/backup/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the backbone parts' directory (tasks 7.1 and 5.2: `core-digest`,
  // `core-block-commit`'s cursor table).
  "**/src/backbone/**": { lines: 90, branches: 85, perFile: true },
  // §13's sweep floor (`src/ledger/sweep*` in §13; as built `src/backbone/core-ledger-state/sweep.ts`, task 12.5),
  // added by task 17.5b (decision record Q158 A): its tables' reads and writes tested on their own
  // (`test/backbone/ledger-sweep-tables.test.ts`), the three branches no step could reach removed.
  "**/src/backbone/core-ledger-state/sweep.ts": { lines: 95, branches: 90, perFile: true },
  // §13's default for `src/**`, added with the node client's directory (task 10.1).
  "**/src/node/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the admin endpoints' directory (task 8.1).
  "**/src/admin/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the process transport's directory (task 14.2).
  "**/src/private/**": { lines: 90, branches: 85, perFile: true },
  // §13's default for `src/**`, added with the ledger adapters' directory (task 12.1).
  "**/src/ledger/**": { lines: 90, branches: 85, perFile: true },
  // The test tape (task 9.1): not in the package, but the tests of ingest, faults and differentials stand on it, so it
  // is measured and held to §13's default like `src/**`.
  "**/tools/tape/**": { lines: 90, branches: 85, perFile: true },
  // The storage helpers (§13: held above the default like determinism), added with the cursor table (task 6.1).
  "**/src/helpers/**": { lines: 95, branches: 90, perFile: true },
  // The `deterministic_postgresql` component (task 2.2a, owner decision Q69), held above the default like determinism;
  // `UmbraError` moved into it (decision record Q79), and the `errors` floor moved with the class.
  "**/src/deterministic-postgresql/**": { lines: 95, branches: 90, perFile: true },
  "**/src/deterministic-postgresql/errors.ts": { lines: 95, branches: 91, perFile: true },
} as const;

export default defineConfig({
  test: {
    // TransactionHistory's source and tests are kept in `legacy/transaction-history/`, outside the build, the package
    // and this run (core-arch task 17.1, LS-3, A3); that folder has its own configuration for a run by hand.
    exclude: [...configDefaults.exclude, "legacy/**"],
    // Teardown budget. `registerSuiteLifecycle`'s afterAll already sets 60s explicitly because
    // `container.stop()` can exceed the 10s default under heavy host load; suites with a plain
    // inline afterAll inherit this global so coverage-instrumented,
    // fully-parallel runs don't flake on teardown. Inline explicit timeouts still win.
    hookTimeout: 60_000,
    // Each test's budget (core-arch task 0.5, owner decision Q122, acceptance A153), for the same reason: Vitest's
    // default of 5 s is a unit test's. The database suites' tests — a fresh PostgreSQL database or PGlite engine,
    // migrations, several transactions through Docker's port proxy — take 0.2–3 s on a quiet machine and over 5 s on a
    // loaded one (the plan's Phase 3 "Load-sensitive tests": `test/db/migrate.test.ts`,
    // `test/config/history-database.test.ts`, `test/deterministic-postgresql/checks.test.ts`, … each failing at
    // 5,000–5,023 ms and passing alone), as do the static scans that parse every source file. The slowest such test
    // measured 10.1 s in a full run at a median load average of 61 (peak 95), and 21.0 s at a median of 77 (peak 100)
    // (2026-10-26); 60 s is about three times that. A test that really hangs still fails, at 60 s
    // (`test/timeouts/timeouts.test.ts`). A test that waits longer on purpose keeps its own, larger timeout.
    //
    // The pool keeps Vitest's default size (one worker fewer than the CPUs; 15 here, 3 on a 4-CPU CI runner). Measured
    // under the same load (load average 20 at the start, 61 at the median): capped at 8 workers the tests' tail was
    // shorter (99th percentile 17 s instead of 27 s) but the run 28 % longer (773 s instead of 604 s), and with the
    // budget above neither run failed, so there is no cap. On a crowded machine, `npm run test:conformance --
    // --maxWorkers=<n>` sets one for a run.
    testTimeout: 60_000,
    coverage: {
      provider: "v8",
      // Setting `include` also makes Vitest report every matching file no test loaded, at 0 %, so such a file is held
      // to its floor like any other.
      include: ["src/**/*.ts", "tools/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        // The `umbradb` command's `bin` entry runs only as a process of its own (`test/cli/umbradb.test.ts`, the pack
        // smoke test), outside coverage; what it calls, `runMain`, is covered (task 4.4).
        "src/cli/main.ts",
        "tools/**/index.ts",
        // The tape command's entry runs only as a process of its own (`test/tape/command.test.ts`); what it calls,
        // `runTapeCommand`, is covered (task 9.2).
        "tools/tape/main.ts",
        // The admin worker thread's entry runs only as a thread of its own (`test/admin/`); what it runs, `serveAdmin`,
        // is covered on the main thread too (task 8.1).
        "src/admin/worker.ts",
        // The ledger worker thread's entry runs only as a thread of its own (`test/ledger/worker-host.test.ts`, the
        // process tests); what it runs, the engine and the bridge, is covered on the main thread too (task 12.3).
        "src/ledger/worker/entry.ts",
        // The ledger worker thread's main, which task 12.6 moved out of `entry.ts` so a host's own entry can run it
        // (`runLedgerWorker`): it too runs only as a thread of its own; the engine it runs, ledger tasks included, is
        // covered on the main thread (`test/ledger/ledger-tasks.test.ts`).
        "src/ledger/worker/run.ts",
        // TransactionHistory, kept outside the run (task 17.1, LS-3, A3). Vitest matches these globs anywhere in a
        // file's path, so `src/**/*.ts` above would also take in `legacy/transaction-history/src/` if a test loaded it.
        "legacy/**",
        // The browser build (task 16.1, `browser/`): its code runs in Chrome's workers, which Node.js's coverage does
        // not see; `test/browser/` holds it (headless Chrome; its replacements of Node.js against Node.js's own). The
        // match anywhere would otherwise take `browser/src/` in, held to `src/**`'s floors by its Node.js tests alone.
        "browser/**",
      ],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        // Repo-wide floor, checked PER FILE (`perFile: true`). Applies to every included file no glob of CORE_ARCH
        // matches.
        perFile: true,
        lines: 85,
        branches: 78,
        ...CORE_ARCH,
      },
    },
  },
});
