import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * TransactionHistory's own test run (core-arch task 17.1, LS-3): never the conformance run, which excludes `legacy/`
 * (`vitest.config.ts`). Run by hand, from the repository's root:
 *
 *   npx vitest run --config legacy/transaction-history/vitest.config.ts
 *
 * PostgreSQL through Testcontainers as before (`./test/postgres/setup.ts`); the two live preprod tests skip unless
 * `UMBRADB_LIVE_PREPROD=1` (`npm run test:live`). No coverage, no floors: the code is kept, not built or shipped.
 */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  test: {
    include: ["test/**/*.test.ts"],
    hookTimeout: 60_000,
  },
});
