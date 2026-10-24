import { describe, expect, expectTypeOf, it } from "vitest";
import { ERROR_CODES, type ErrorCode, UmbraError } from "../../src/db/errors.js";
import { type CanonicalEncodingFailure, CanonicalEncodingError, encodeCanonical } from "../../src/determinism/cbor.js";
import { type ModuleContentsFailure, ModuleContentsError } from "../../src/determinism/module-tables.js";

/**
 * `UmbraError { code, retryable, details }` (`design.md` §4, §12), keeping 0.9.5's split between retryable and
 * not-retryable errors (`design/design-interfaces.md` §1.1): DB-13 makes a lost connection the one retryable error.
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

  it("is retryable for a lost connection only (DB-13)", () => {
    for (const code of ERROR_CODES) {
      expect(new UmbraError(code, "m").retryable, code).toBe(code === "connection-lost");
    }
    expect(ERROR_CODES).toContain("connection-lost");
    expect(ERROR_CODES).toContain("database-error");
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
