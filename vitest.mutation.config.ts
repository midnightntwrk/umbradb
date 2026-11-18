import { defineConfig } from "vitest/config";

/**
 * Narrow vitest config used ONLY by StrykerJS (`stryker.conf.json` → `vitest.configFile`).
 *
 * Mutation testing runs a mutated file's covering tests once PER mutant, so it runs a tight set of fast tests, never
 * the whole conformance suite. The targets are the graph
 * resolution, the order within a point (`src/runner/dispatch.ts`), the history comparison, the canonical CBOR encoder,
 * the digests, the two storage helpers, the ledger state's reclamation (`src/backbone/core-ledger-state/
 * run-reclaim.ts`, in the place of the per-block step, which moved to the tests as their reference, as the step had
 * taken the place of the sweep the `ledger-refcount` change removed) and the block fetch queue
 * (`src/backbone/core-block-fetch/node-source.ts`); `include` is the tests of each, which
 * `test/library-surface/retirement.ts` lists by target. The reclamation's are its unit tests, its negative controls,
 * its generated histories at the reduced size `env` sets below and the set of keys known to be rows
 * (`test/backbone/known-keys.test.ts`); its tests against PostgreSQL and PGlite (`test/backbone/run-reclaim-tables.test.ts`),
 * the histories at full size and the set's run at its bound (`test/backbone/known-keys-bound.test.ts`) run in the
 * normal suite only.
 * Stryker's `vitest.related` (its default) runs, for each target, only the included tests that import it, and
 * `coverageAnalysis: "perTest"` then reruns, per mutant, only the tests that cover it. Coverage instrumentation is off
 * here (it would collide with Stryker's own instrumentation).
 */
export default defineConfig({
  test: {
    hookTimeout: 60_000,
    // The suites' own budget: the helpers' tests start PostgreSQL in Docker and PGlite.
    testTimeout: 60_000,
    // The generated histories of `test/backbone/run-reclaim-histories.test.ts`: 10 a case, not the suite's 120, so
    // that each of the computation's mutants runs them in about a second instead of 13 (`run-reclaim.ts`'s target).
    env: { UMBRADB_HISTORY_RUNS: "10" },
    include: [
      "test/modules/graph.test.ts",
      "test/modules/graph-public-items.test.ts",
      "test/runner/dispatch.test.ts",
      "test/runner/order.property.test.ts",
      "test/config/history.test.ts",
      "test/config/history.property.test.ts",
      "test/determinism/cbor.test.ts",
      "test/determinism/cbor.property.test.ts",
      "test/determinism/digest.test.ts",
      "test/helpers/height-versioned.test.ts",
      "test/helpers/height-versioned.property.test.ts",
      "test/helpers/cursor-table.test.ts",
      "test/helpers/cursor-table.property.test.ts",
      "test/backbone/run-reclaim.test.ts",
      "test/backbone/run-reclaim.negative-control.test.ts",
      "test/backbone/run-reclaim-histories.test.ts",
      "test/backbone/known-keys.test.ts",
      "test/backbone/node-source.test.ts",
    ],
  },
});
