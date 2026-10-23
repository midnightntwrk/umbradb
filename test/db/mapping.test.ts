import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import {
  mapRows,
  mapValue,
  parameterText,
  parseArrayText,
  parseJsonLossless,
  RESULT_TYPES,
} from "../../src/db/mapping.js";

/**
 * The database API's result mapping and parameter texts (DB-2), without a database: PostgreSQL's text output as it
 * arrives from either backend, mapped by the column's type OID. `results.test.ts` checks the same against PostgreSQL.
 */

const SEED = 20261023;
const identity = (text: string): string => text;

function invalidParameter(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    if (error instanceof UmbraError && error.code === "invalid-parameter") return error;
    throw error;
  }
  throw new Error("expected invalid-parameter");
}

describe("PostgreSQL's array output (docs/issues/00006)", () => {
  it("reads an unquoted NULL as null and a quoted \"NULL\" as the text", () => {
    expect(parseArrayText("{x,NULL}", identity)).toEqual(["x", null]);
    expect(parseArrayText('{x,"NULL"}', identity)).toEqual(["x", "NULL"]);
    expect(parseArrayText("{NULL,NULL}", identity)).toEqual([null, null]);
  });

  it("applies the element parser to every element but NULL", () => {
    const seen: string[] = [];
    const parsed = parseArrayText("{1,NULL,-3}", (text) => {
      seen.push(text);
      return Number(text);
    });
    expect(parsed).toEqual([1, null, -3]);
    expect(seen).toEqual(["1", "-3"]);
  });

  it("reads empty, nested and decorated arrays", () => {
    expect(parseArrayText("{}", identity)).toEqual([]);
    expect(parseArrayText("{{1,2},{3,NULL}}", identity)).toEqual([["1", "2"], ["3", null]]);
    expect(parseArrayText("{{{a}},{{b}}}", identity)).toEqual([[["a"]], [["b"]]]);
    expect(parseArrayText("[0:1]={1,2}", identity)).toEqual(["1", "2"]);
    expect(parseArrayText("[-2:-1][1:2]={{a,b},{c,d}}", identity)).toEqual([["a", "b"], ["c", "d"]]);
  });

  it("unescapes quoted elements", () => {
    expect(parseArrayText('{"a\\"b","c\\\\d","e,f","{g}"," h ",""}', identity)).toEqual([
      'a"b',
      "c\\d",
      "e,f",
      "{g}",
      " h ",
      "",
    ]);
  });

  it("refuses text that is not an array's output", () => {
    for (const text of ["", "{1,2", "1,2}", "{1,,2}", '{"a}', "{1}x", "[0:1]{1}", "[0:1={1}", "{,1}", "{1,}", "{1\"2}"]) {
      expect(() => parseArrayText(text, identity), text).toThrow(/array/);
    }
  });
});

describe("lossless JSON (DB-2)", () => {
  it("reads 9007199254740992 and 9007199254740993 as two different bigints, and 42 as the number 42 (A9)", () => {
    const [a, b, c] = parseJsonLossless("[9007199254740992, 9007199254740993, 42]") as unknown[];
    expect(a).toBe(9007199254740992n);
    expect(b).toBe(9007199254740993n);
    expect(a).not.toBe(b);
    expect(c).toBe(42);
  });

  it("keeps every integer within ±(2^53 − 1) a number and every other integer a bigint", () => {
    expect(parseJsonLossless("9007199254740991")).toBe(9007199254740991);
    expect(parseJsonLossless("-9007199254740991")).toBe(-9007199254740991);
    expect(parseJsonLossless("-9007199254740992")).toBe(-9007199254740992n);
    expect(parseJsonLossless("18446744073709551616")).toBe(18446744073709551616n);
    expect(parseJsonLossless('{"a": {"b": [123456789012345678901234567890]}}')).toEqual({
      a: { b: [123456789012345678901234567890n] },
    });
  });

  it("leaves fractions and exponent forms to JSON.parse", () => {
    expect(parseJsonLossless("1.5")).toBe(1.5);
    expect(parseJsonLossless("1e2")).toBe(100);
    expect(parseJsonLossless('"9007199254740993"')).toBe("9007199254740993");
  });
});

describe("the result mapping by type (DB-2; design.md §4's column-type table)", () => {
  const oid = (name: string): number => {
    const type = RESULT_TYPES.find((entry) => entry.name === name);
    if (type === undefined) throw new Error(`no type ${name}`);
    return type.oid;
  };
  const arrayOid = (name: string): number => {
    const type = RESULT_TYPES.find((entry) => entry.name === name);
    if (type === undefined) throw new Error(`no type ${name}`);
    return type.arrayOid;
  };

  it("maps bigint to bigint, bytea to Uint8Array, numeric to a decimal string and jsonb to parsed JSON", () => {
    expect(mapValue(oid("bigint"), "-9223372036854775808")).toBe(-9223372036854775808n);
    const bytes = mapValue(oid("bytea"), "\\x00ff10");
    expect(bytes).toEqual(new Uint8Array([0, 255, 16]));
    expect(Object.getPrototypeOf(bytes)).toBe(Uint8Array.prototype);
    expect(mapValue(oid("bytea"), "\\x")).toEqual(new Uint8Array([]));
    expect(mapValue(oid("numeric"), "-12.50")).toBe("-12.50");
    expect(mapValue(oid("jsonb"), '{"n": 9007199254740993}')).toEqual({ n: 9007199254740993n });
    expect(mapValue(oid("json"), '{"n": 9007199254740993}')).toEqual({ n: 9007199254740993n });
  });

  it("maps the other named types as the drivers do", () => {
    expect(mapValue(oid("boolean"), "t")).toBe(true);
    expect(mapValue(oid("boolean"), "f")).toBe(false);
    expect(mapValue(oid("smallint"), "-32768")).toBe(-32768);
    expect(mapValue(oid("integer"), "2147483647")).toBe(2147483647);
    expect(mapValue(oid("oid"), "4294967295")).toBe(4294967295);
    expect(mapValue(oid("real"), "0.1")).toBe(0.1);
    expect(mapValue(oid("double precision"), "NaN")).toBeNaN();
    expect(mapValue(oid("double precision"), "-Infinity")).toBe(-Infinity);
    expect(mapValue(oid("text"), "NULL")).toBe("NULL");
    expect(mapValue(oid("uuid"), "00000000-0000-0000-0000-0000000000ff")).toBe("00000000-0000-0000-0000-0000000000ff");
    expect(mapValue(oid("timestamp with time zone"), "2026-10-23 10:00:00.123456+00")).toEqual(
      new Date("2026-10-23T10:00:00.123Z"),
    );
    expect(mapValue(oid("date"), "2026-10-23")).toEqual(new Date("2026-10-23T00:00:00.000Z"));
    expect(mapValue(oid("interval"), "1 day 02:00:00")).toBe("1 day 02:00:00");
    expect(mapValue(oid("money"), "$1.00")).toBe("$1.00");
  });

  it("maps a type the table does not name, and an array of one, to its text", () => {
    expect(mapValue(869, "192.168.0.1")).toBe("192.168.0.1"); // inet
    expect(mapValue(1041, "{192.168.0.1,NULL}")).toBe("{192.168.0.1,NULL}"); // inet[]
    expect(mapValue(16433, "{a,NULL}")).toBe("{a,NULL}"); // an enum's array (its OID is the database's)
  });

  it("maps NULL to null for every type", () => {
    for (const type of RESULT_TYPES) {
      expect(mapValue(type.oid, null), type.name).toBeNull();
      expect(mapValue(type.arrayOid, null), `${type.name}[]`).toBeNull();
    }
    expect(mapValue(869, null)).toBeNull();
  });

  it("maps an array of a named type element by element, NULL to null", () => {
    expect(mapValue(arrayOid("boolean"), "{t,NULL,f}")).toEqual([true, null, false]);
    expect(mapValue(arrayOid("integer"), "{1,NULL,0}")).toEqual([1, null, 0]);
    expect(mapValue(arrayOid("bigint"), "{9007199254740993,NULL}")).toEqual([9007199254740993n, null]);
    expect(mapValue(arrayOid("bytea"), '{"\\\\x01",NULL}')).toEqual([new Uint8Array([1]), null]);
    expect(mapValue(arrayOid("jsonb"), '{"{\\"a\\": 9007199254740993}",NULL,null}')).toEqual([
      { a: 9007199254740993n },
      null,
      null,
    ]);
    expect(mapValue(arrayOid("text"), '{x,NULL,"NULL",""}')).toEqual(["x", null, "NULL", ""]);
  });

  it("refuses output it cannot read rather than guess, showing at most 40 characters of it", () => {
    expect(() => mapValue(oid("real"), "abc")).toThrow(/real/);
    expect(() => mapValue(oid("boolean"), "x".repeat(100))).toThrow(`cannot read "${"x".repeat(40)}…" as boolean output`);
    expect(() => parseArrayText('{"a\\', identity)).toThrow(/array/);
  });

  it("refuses output it cannot read rather than guess", () => {
    expect(() => mapValue(oid("boolean"), "true")).toThrow(/boolean/);
    expect(() => mapValue(oid("bytea"), "\\001")).toThrow(/bytea/); // the escape output format
    expect(() => mapValue(oid("bytea"), "\\x0")).toThrow(/bytea/);
    expect(() => mapValue(oid("bytea"), "\\xzz")).toThrow(/bytea/);
    expect(() => mapValue(oid("integer"), "1.5")).toThrow(/integer/);
    expect(() => mapValue(oid("bigint"), "x")).toThrow(/bigint/);
  });

  it("lists every named type once, by its format_type name, with its array", () => {
    const names = RESULT_TYPES.map((type) => type.name);
    expect(new Set(names).size).toBe(names.length);
    const oids = RESULT_TYPES.flatMap((type) => [type.oid, type.arrayOid]);
    expect(new Set(oids).size).toBe(oids.length);
  });
});

describe("rows (DB-2)", () => {
  it("maps each column by its own type, the last of two equal names winning, as the drivers do", () => {
    const rows = mapRows(
      [
        { name: "a", type: 20 },
        { name: "b", type: 17 },
        { name: "a", type: 25 },
      ],
      [
        ["1", "\\x01", "x"],
        [null, null, null],
      ],
    );
    expect(rows).toEqual([
      { a: "x", b: new Uint8Array([1]) },
      { a: null, b: null },
    ]);
  });
});

describe("parameter texts", () => {
  it("sends each JavaScript value as the text PostgreSQL reads for it", () => {
    expect(parameterText(null, 0)).toBeNull();
    expect(parameterText("x", 0)).toBe("x");
    expect(parameterText(-12, 0)).toBe("-12");
    expect(parameterText(0.5, 0)).toBe("0.5");
    expect(parameterText(9223372036854775807n, 0)).toBe("9223372036854775807");
    expect(parameterText(true, 0)).toBe("true");
    expect(parameterText(false, 0)).toBe("false");
    expect(parameterText(new Uint8Array([0, 255]), 0)).toBe("\\x00ff");
    expect(parameterText(Buffer.from([1]), 0)).toBe("\\x01");
    expect(parameterText(new Date("2026-10-23T10:00:00.123Z"), 0)).toBe("2026-10-23T10:00:00.123Z");
  });

  it("sends an array as an array literal, every element quoted, NULL unquoted", () => {
    expect(parameterText([], 0)).toBe("{}");
    expect(parameterText([1, null, 3n], 0)).toBe('{"1",NULL,"3"}');
    expect(parameterText(['a"b', "c\\d", "NULL", "", "{,}"], 0)).toBe('{"a\\"b","c\\\\d","NULL","","{,}"}');
    expect(parameterText([[1, 2], [3, null]], 0)).toBe('{{"1","2"},{"3",NULL}}');
    expect(parameterText([new Uint8Array([1])], 0)).toBe('{"\\\\x01"}');
    expect(parameterText([{ a: 1 }], 0)).toBe('{"{\\"a\\":1}"}');
  });

  it("sends a plain object as JSON, integers beyond 2^53 exactly", () => {
    expect(parameterText({ a: 9007199254740993n, b: [1, "x", null, true], c: { d: -1.5 } }, 0)).toBe(
      '{"a":9007199254740993,"b":[1,"x",null,true],"c":{"d":-1.5}}',
    );
    expect(parameterText(Object.assign(Object.create(null) as object, { k: 1 }), 0)).toBe('{"k":1}');
  });

  it("refuses values it cannot send, naming the parameter", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const refused: readonly unknown[] = [
      undefined,
      () => 1,
      Symbol("s"),
      new Map(),
      new Date(Number.NaN),
      { a: undefined },
      { a: Number.NaN },
      { a: Infinity },
      { a: new Date(0) },
      { a: new Uint8Array(1) },
      { a: () => 1 },
      cyclic,
      [undefined],
      [new Map()],
      new (class Thing {})(),
      Object.create(Object.create(null) as object) as object,
    ];
    for (const value of refused) {
      const error = invalidParameter(() => parameterText(value, 2));
      expect(error.retryable).toBe(false);
      expect(error.details.index).toBe(2);
      expect(error.message).toMatch(/\$3/);
    }
  });

  it("round-trips arrays of any strings through the literal and the parser (property, seed 20261023)", () => {
    const element = fc.oneof(
      fc.string({ unit: "grapheme", maxLength: 8 }),
      fc.constantFrom("NULL", "", " ", '"', "\\", "{", "}", ","),
      fc.constant(null),
    );
    const oneDimension = fc.array(element, { maxLength: 6 });
    const twoDimensions = fc
      .tuple(fc.integer({ min: 1, max: 3 }), fc.integer({ min: 1, max: 3 }))
      .chain(([rows, columns]) =>
        fc.array(fc.array(element, { minLength: columns, maxLength: columns }), { minLength: rows, maxLength: rows }),
      );
    fc.assert(
      fc.property(fc.oneof(oneDimension, twoDimensions), (value) => {
        expect(parseArrayText(parameterText(value, 0) as string, identity)).toEqual(value);
      }),
      { seed: SEED, numRuns: 500 },
    );
  });
});
