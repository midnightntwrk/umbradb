import { defineConfig } from "vitest/config";

/**
 * Narrow vitest config used ONLY by StrykerJS (`stryker.conf.json` → `vitest.configFile`).
 *
 * Mutation testing runs a mutated file's covering tests once PER mutant, so it runs a tight set of fast tests, never
 * the whole conformance suite. The targets are `openspec/changes/core-arch/design.md` §13's (task 17.2): the graph
 * resolution, the order within a point (`src/runner/dispatch.ts`), the history comparison, the canonical CBOR encoder,
 * the digests, the two storage helpers, the ledger sweep and the block fetch queue (`src/backbone/core-block-fetch/
 * node-source.ts`); `include` is the tests of each, which `test/library-surface/retirement.ts` (A5) lists by target.
 * Stryker's `vitest.related` (its default) runs, for each target, only the included tests that import it, and
 * `coverageAnalysis: "perTest"` then reruns, per mutant, only the tests that cover it. Coverage instrumentation is off
 * here (it would collide with Stryker's own instrumentation).
 */
export default defineConfig({
  test: {
    hookTimeout: 60_000,
    // The suites' own budget (task 0.5): the helpers' tests start PostgreSQL in Docker and PGlite.
    testTimeout: 60_000,
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
      "test/backbone/ledger-sweep.test.ts",
      "test/backbone/ledger-sweep-tables.test.ts",
      "test/backbone/node-source.test.ts",
    ],
  },
});
