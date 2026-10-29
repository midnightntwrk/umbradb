import { describe, expect, expectTypeOf, it } from "vitest";
import { ERROR_CODES, type ErrorCode, UmbraError } from "../../src/db/errors.js";
import { type CanonicalEncodingFailure, CanonicalEncodingError, encodeCanonical } from "../../src/determinism/cbor.js";
import { type ModuleContentsFailure, ModuleContentsError } from "../../src/determinism/module-tables.js";
import { classifyPgliteError } from "../../src/db/pglite.js";
import { classifyDriverError } from "../../src/db/postgres.js";
import { TRUNCATE_NOT_ALLOWED_SQLSTATE } from "../../src/deterministic-postgresql/index.js";

/**
 * `UmbraError { code, retryable, details }`, keeping 0.9.5's split between retryable and not-retryable errors. A lost
 * connection is the one retryable database error, and an unreachable node the one retryable node error.
 * [DB-13, IN-10; design §4, §12; design-interfaces §1.1]
 */

describe("UmbraError", () => {
  it("carries its code, its retryability, its details and its cause", () => {
    const cause = new Error("socket closed");
    const error = new UmbraError("connection-lost", "the connection was lost", { connection: "writer" }, { cause });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("UmbraError");
    expect(error.code).toBe("connection-lost");
    expect(error.retryable).toBe(true);
    expect(error.details).toEqual({ connection: "writer" });
    expect(error.message).toBe("the connection was lost");
    expect(error.cause).toBe(cause);
  });

  it("is retryable for a lost database connection (DB-13) and an unreachable node (IN-10) only", () => {
    for (const code of ERROR_CODES) {
      expect(new UmbraError(code, "m").retryable, code).toBe(code === "connection-lost" || code === "node-unreachable");
    }
    expect(ERROR_CODES).toContain("connection-lost");
    expect(ERROR_CODES).toContain("database-error");
    expect(ERROR_CODES).toContain("node-unreachable");
    expect(ERROR_CODES).toContain("node-requirement");
    expect(ERROR_CODES).toContain("node-error");
    expect(new Set(ERROR_CODES).size).toBe(ERROR_CODES.length);
  });

  it("has no details unless given, and its details cannot be changed", () => {
    const error = new UmbraError("database-error", "m");
    expect(error.details).toEqual({});
    expect(Object.isFrozen(error.details)).toBe(true);
    expect(Object.isFrozen(new UmbraError("database-error", "m", { a: 1 }).details)).toBe(true);
  });

  it("names every code ErrorCode allows, and nothing else", () => {
    expectTypeOf<(typeof ERROR_CODES)[number]>().toEqualTypeOf<ErrorCode>();
    expectTypeOf<UmbraError["code"]>().toEqualTypeOf<ErrorCode>();
    expectTypeOf<UmbraError["retryable"]>().toEqualTypeOf<boolean>();
  });
});

describe("the determinism errors are UmbraErrors (design.md §12 exports UmbraError, not their classes)", () => {
  it("gives an encoding failure its reason as its code, not retryable, with where it is", () => {
    let error: unknown;
    try {
      encodeCanonical({ a: [1.5] });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(CanonicalEncodingError);
    expect(error).toBeInstanceOf(UmbraError);
    const encoding = error as CanonicalEncodingError;
    expect(encoding.name).toBe("CanonicalEncodingError");
    expect(encoding.code).toBe("not-integer");
    expect(encoding.code).toBe(encoding.reason);
    expect(encoding.retryable).toBe(false);
    expect(encoding.details).toEqual({ path: '$["a"][0]' });
  });

  it("gives a contents failure its reason as its code, not retryable, with the table and the column", () => {
    const error = new ModuleContentsError(
      "unencodable-row",
      { schema: "m", table: "t" },
      { name: "c", declaredType: "numeric" },
      "a fraction",
    );
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.name).toBe("ModuleContentsError");
    expect(error.code).toBe("unencodable-row");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ schema: "m", table: "t", sequence: null, column: "c", declaredType: "numeric" });
    const sequence = new ModuleContentsError("non-deterministic-table", { schema: "m", sequence: "q" }, null, "x");
    expect(sequence.details).toEqual({ schema: "m", table: null, sequence: "q", column: null, declaredType: null });
  });

  it("covers every reason of both in ErrorCode", () => {
    expectTypeOf<CanonicalEncodingFailure>().toExtend<ErrorCode>();
    expectTypeOf<ModuleContentsFailure>().toExtend<ErrorCode>();
  });
});

describe("a TRUNCATE the deterministic_postgresql component's trigger refused (DB-14, A73)", () => {
  // The fields each driver gives a server error: `postgres` 3.4.9 (`schema_name`, `table_name`) and PGlite 0.5.10
  // (`schema`, `table`), with the SQLSTATE the component's trigger raises.
  const message = "TRUNCATE of a.t is refused";

  it("is truncate-not-allowed, not retryable, on PostgreSQL, with the table it named", () => {
    const classified = classifyDriverError(
      { severity: "ERROR", code: TRUNCATE_NOT_ALLOWED_SQLSTATE, message, schema_name: "a", table_name: "t" },
      "writer",
    );
    expect(classified).toBeInstanceOf(UmbraError);
    expect(classified.code).toBe("truncate-not-allowed");
    expect(classified.retryable).toBe(false);
    expect(classified.message).toBe(message);
    expect(classified.details).toEqual({ sqlstate: TRUNCATE_NOT_ALLOWED_SQLSTATE, schema: "a", table: "t" });
  });

  it("is truncate-not-allowed on PGlite too, with the same details", () => {
    const classified = classifyPgliteError({
      severity: "ERROR",
      code: TRUNCATE_NOT_ALLOWED_SQLSTATE,
      message,
      schema: "a",
      table: "t",
    });
    expect(classified.code).toBe("truncate-not-allowed");
    expect(classified.details).toEqual({ sqlstate: TRUNCATE_NOT_ALLOWED_SQLSTATE, schema: "a", table: "t" });
  });

  it("leaves every other SQLSTATE a database-error, a raise with P0001 included", () => {
    expect(classifyDriverError({ severity: "ERROR", code: "P0001", message }, "writer").code).toBe("database-error");
    expect(classifyPgliteError({ severity: "ERROR", code: "P0001", message }).code).toBe("database-error");
    // The SQLSTATE without a server's severity is no server error: the driver's own code.
    expect(classifyDriverError({ code: TRUNCATE_NOT_ALLOWED_SQLSTATE, message }, "writer").code).toBe("database-error");
  });
});
