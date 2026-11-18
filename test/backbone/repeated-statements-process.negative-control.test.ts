import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type * as RepeatedStatements from "../../src/db/repeated-statements.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { FAMILIES, preparedOnWriter, preparedProblems } from "./repeated-statements-checks.js";

/**
 * The negative control of `./repeated-statements-process.test.ts`. This file's module graph is built with a
 * `RepeatedStatement` class whose `instanceof` answers no for the texts of one family at a time (`vi.mock` of
 * `src/db/repeated-statements.ts`). The PostgreSQL backend recognises a marked statement by that test, so it takes
 * the family's statements for plain texts, as it would were their call site to pass the text unmarked, and runs them
 * unnamed. For each family the checks must then name that family, and only it.
 */

const control = vi.hoisted(() => ({ unmarked: (_text: string): boolean => false }));

vi.mock("../../src/db/repeated-statements.js", async (importOriginal) => {
  const real = await importOriginal<typeof RepeatedStatements>();
  const RepeatedStatement = new Proxy(real.RepeatedStatement, {
    get(target, key, receiver) {
      if (key !== Symbol.hasInstance) return Reflect.get(target, key, receiver);
      return (value: unknown) => value instanceof target && !control.unmarked(value.text);
    },
  });
  return { ...real, RepeatedStatement };
});

const postgres = PROCESS_BACKENDS.find((backend) => backend.kind === "postgres") as ProcessBackend;

describe("[NEG] the engine's repeated statements through the process, one family taken for plain texts", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);

  it("the control changes nothing while no family is unmarked", async () => {
    control.unmarked = () => false;
    expect(preparedProblems(await preparedOnWriter(await postgres.database()))).toEqual([]);
  }, PATIENCE_MS * 4);

  for (const family of FAMILIES) {
    it(`[NEG] ${family.name} taken for plain texts: the writer's session holds no prepared statement of it, and the checks name it alone`, async () => {
      control.unmarked = family.is;
      try {
        const prepared = await preparedOnWriter(await postgres.database());
        expect(prepared.filter((row) => family.is(row.statement))).toEqual([]);
        expect(preparedProblems(prepared)).toEqual([
          `${family.name}: the writer's session holds no prepared statement of it`,
        ]);
      } finally {
        control.unmarked = () => false;
      }
    }, PATIENCE_MS * 4);
  }
});
