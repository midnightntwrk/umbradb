import { defineConfig } from "vitest/config";

/**
 * The mutation run of `token-metadata` (its task 6.1): `stryker.token-metadata.conf.json` mutates the module's own
 * files (the vendored codec excluded) and reruns these tests, on PGlite only (`UMBRADB_PROCESS_BACKENDS=pglite`, set by
 * that configuration's command). The stagenet, browser, backend-comparison, property and bounded-cost suites are left
 * out: each takes tens of seconds per rerun, and the tests here cover the same code.
 */
export default defineConfig({
  test: {
    hookTimeout: 120_000,
    testTimeout: 120_000,
    include: [
      "test/features/token-metadata/vectors.test.ts",
      "test/features/token-metadata/mip0018-state.test.ts",
      "test/features/token-metadata/mip0018-classify.test.ts",
      "test/features/token-metadata/log-reader.test.ts",
      "test/features/token-metadata/color.test.ts",
      "test/features/token-metadata/fuzz.test.ts",
      "test/features/token-metadata/intl.test.ts",
      "test/features/token-metadata/module.test.ts",
      "test/features/token-metadata/events.test.ts",
      "test/features/token-metadata/api.test.ts",
      "test/features/token-metadata/routes.test.ts",
    ],
  },
});
