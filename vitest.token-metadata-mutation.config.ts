import { defineConfig } from "vitest/config";

/**
 * The mutation run of `token-metadata` and `token-metadata-api`: `stryker.token-metadata.conf.json` mutates both
 * modules' files and the codec,
 * and reruns these tests, on PGlite only (`UMBRADB_PROCESS_BACKENDS=pglite`, set by
 * that configuration's command). The browser, backend-comparison, property and bounded-cost suites are left
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
      "test/features/token-metadata/codec.test.ts",
      "test/features/token-metadata/uri.test.ts",
      "test/features/token-metadata/log-reader-forms.test.ts",
      "test/features/token-metadata/fuzz.test.ts",
      "test/features/token-metadata/intl.test.ts",
      "test/features/token-metadata/module.test.ts",
      "test/features/token-metadata/events.test.ts",
      "test/features/token-metadata-api/api.test.ts",
      "test/features/token-metadata-api/routes.test.ts",
      "test/features/token-metadata-api/api-edges.test.ts",
      "test/features/token-metadata-api/sql.test.ts",
    ],
  },
});
