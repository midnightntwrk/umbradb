import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { coreKeyRegistry } from "../../src/backbone/core-key-registry/index.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a123Restarts, restartProblems } from "./key-checks.js";

/**
 * A123's committed negative control (task 14.4; CF-11, PP-8), on PostgreSQL 18.6 and PGlite 0.5.10: a registry that
 * admits a known key again at a new height (`coreKeyRegistry({ admission: "again" })`: every configured key pending at
 * the first height after the private cursor, its row's `arrived_height` replaced) fails A123's oracle — the restart
 * with the same key moves its `arrived_height` from 3 to 7, fires `on-key` again, and the key with another start is no
 * longer refused. A119's negative control (a validation that skips `validateKey`) is `test/config/validate.test.ts`'s.
 */

describe.each(PRIVATE_BACKENDS)("A123's negative control on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a registry that admits a known key again at a new height fails A123's arrived_height",
    async () => {
      const problems = restartProblems(await a123Restarts(backend, coreKeyRegistry({ admission: "again" })));
      expect(problems.join("\n")).toContain("after the restart with the same key the registry holds");
      expect(problems.join("\n")).toContain('"arrivedHeight":"7n"');
      expect(problems.join("\n")).toContain("the restart fired on-key again");
    },
    TEST_TIMEOUT_MS,
  );
});
