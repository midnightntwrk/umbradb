import { describe, expect, it } from "vitest";
import {
  ERROR_CODES,
  mapValue,
  parameterText,
  parseArrayText,
  parseJsonLossless,
  RESULT_TYPES,
  UmbraError,
} from "../../src/deterministic-postgresql/index.js";

/**
 * The errors the component's rules throw (task 2.2a, decision record Q79): `UmbraError`, defined in the component, with
 * the code and the details DB-2 and DB-13 give them — output the mapping cannot read is `database-error` with `reason:
 * unreadable-result` and the type it was read as; a value the parameter texts cannot send is `invalid-parameter` with
 * its index; neither is retryable. Written after the mutation pass of task 2.2a found that no test asserted the code of
 * unreadable output, and that the suite did not check the class's own rules (`../db/errors.test.ts` did, through
 * `src/db/errors.ts`'s re-export).
 */

const oid = (name: string): number => (RESULT_TYPES.find((type) => type.name === name) as { oid: number }).oid;

function thrown(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError");
}

describe("the component's errors", () => {
  it("refuses output it cannot read as database-error, reason unreadable-result, with the type, not retryable", () => {
    const cases: readonly (readonly [() => unknown, string])[] = [
      [() => mapValue(oid("boolean"), "maybe"), "boolean"],
      [() => mapValue(oid("bytea"), "\\001"), "bytea"],
      [() => mapValue(oid("bigint"), "1.5"), "bigint"],
      [() => parseJsonLossless("{"), "json"],
      [() => parseArrayText("{a", (text) => text), "array"],
    ];
    for (const [run, type] of cases) {
      const error = thrown(run);
      expect(error.code, type).toBe("database-error");
      expect(error.retryable, type).toBe(false);
      expect(error.details, type).toEqual({ reason: "unreadable-result", type });
    }
  });

  it("refuses a value it cannot send as invalid-parameter, naming the parameter, not retryable", () => {
    const error = thrown(() => parameterText(undefined, 2));
    expect(error.code).toBe("invalid-parameter");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ index: 2 });
    expect(error.message).toMatch(/^parameter \$3 cannot be sent: /);
  });

  it("is retryable for connection-lost and node-unreachable only, and keeps a frozen copy of its details", () => {
    for (const code of ERROR_CODES) {
      expect(new UmbraError(code, "m").retryable, code).toBe(code === "connection-lost" || code === "node-unreachable");
    }
    const details = { table: "t" };
    const error = new UmbraError("database-error", "m", details);
    details.table = "changed";
    expect(error.details).toEqual({ table: "t" });
    expect(Object.isFrozen(error.details)).toBe(true);
    expect(error.name).toBe("UmbraError");
  });
});
