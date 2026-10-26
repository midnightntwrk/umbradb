import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import {
  a146HashProblems,
  a146Hashes,
  a146RefusalProblems,
  a146Refusals,
  optedOutProblems,
  optedOutRun,
} from "./determinism-checks.js";

/**
 * A146 (DT-3, DT-6, PP-1, Q75; task 14.1): a private process runs the determinism rules of the core — DT-6's startup
 * refusals on its private plan, and DT-3's contents hash of its private database. The checks are in
 * `determinism-checks.ts`; the negative control, a private plan without DT-6's check, in
 * `determinism.negative-control.test.ts`. Also A147's private part (task 7.1 left it to this task): a table declared
 * `deterministic: false` on a private process, as on the core.
 */
describe.each(PRIVATE_BACKENDS)("A146 one set of determinism rules on a private process ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a private module table with a serial column, a now() default or a double precision column refuses the private " +
      "process's startup with the same code and message as in the core",
    async () => {
      const found = await a146Refusals(backend);
      expect(a146RefusalProblems(found)).toEqual([]);
      expect(found.map((table) => (table.private === "started" ? "started" : table.private.code))).toEqual([
        "non-deterministic-column",
        "non-deterministic-column",
        "non-deterministic-column",
      ]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "two private instances with the same configuration, test keys included, bound to the same public database, have " +
      "equal contents hashes at the same height",
    async () => {
      expect(a146HashProblems(await a146Hashes(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A147's private part: a private table declared deterministic: false with a now() default and a serial column " +
      "starts, is hashed by name only and is not digested; without the flag it refuses",
    async () => {
      expect(optedOutProblems(await optedOutRun(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});
