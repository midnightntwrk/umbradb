import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a146RefusalProblems, a146Refusals } from "./determinism-checks.js";

/**
 * A146's negative control (task 14.1): a private plan without DT-6's check. The schema plan of every process in this
 * file is the real one, except that a private process's plan lists the tables of its private modules as opted out —
 * which is how a plan tells the database API not to check a table (`optedOut`, Q76) — so the private process's
 * startup checks none of them. A146's checks must then fail: the private process starts with the `serial` column.
 */
vi.mock("../../src/modules/adapters.js", async (importOriginal) => {
  const real = await importOriginal<typeof import("../../src/modules/adapters.js")>();
  return {
    ...real,
    schemaPlan(declarations: readonly ModuleDeclaration[]) {
      const plan = real.schemaPlan(declarations);
      const unchecked = declarations
        .filter((part) => part.side === "private" && !part.id.startsWith("core-"))
        .flatMap((part) => part.provides.flatMap((item) => item.table?.tables.map((table) => ({ schema: item.table?.schema as string, table })) ?? []));
      return { ...plan, optedOut: [...plan.optedOut, ...unchecked] };
    },
  };
});

describe.each(PRIVATE_BACKENDS)("A146 negative control ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a private plan without DT-6's check accepts the serial column and fails A146",
    async () => {
      expect(a146RefusalProblems(await a146Refusals(backend))).toContain("the private process started with a serial column");
    },
    TEST_TIMEOUT_MS,
  );
});
