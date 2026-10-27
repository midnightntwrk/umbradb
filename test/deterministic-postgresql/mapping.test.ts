import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  mapRows,
  RESULT_COLUMNS,
  resultColumns,
  mapValue,
  parameterText,
  parseArrayText,
  parseJsonLossless,
  RESULT_TYPES,
  UmbraError,
} from "../../src/deterministic-postgresql/index.js";

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

  // Node.js 24.9.0's JSON.parse (V8 13.6.233.10) can read such a key as a backslash once an earlier JSON.parse in the
  // process has read the key "\\": two different documents would read back equal, and so would their contents
  // hashes. Whether it does depends on the strings the process already holds, so this test cannot make it happen on
  // demand; A7's seeded differential round trip (`../db/differential.test.ts`) did, on both backends, and is its
  // reproduction.
  it("reads an object key that is one escape sequence as its character, also after the key \"\\\\\" was read", () => {
    const keys = (text: string): string[] => Object.keys(parseJsonLossless(text) as object);
    expect(keys('{"\\\\": 1}')).toEqual(["\\"]);
    const ESCAPES: readonly (readonly [string, string])[] = [
      ["\\t", "\t"],
      ["\\n", "\n"],
      ["\\r", "\r"],
      ["\\b", "\b"],
      ["\\f", "\f"],
      ['\\"', '"'],
      ["\\/", "/"],
      ["\\\\", "\\"],
      ["\\u00e9", "é"],
      ["\\u0041", "A"],
      ["\\uD83D", "\uD83D"],
    ];
    for (const [escape, char] of ESCAPES) {
      expect(keys(`{"\\\\": 0}`)).toEqual(["\\"]);
      expect(keys(`{"${escape}": 1}`), escape).toEqual([char]);
      const nested = parseJsonLossless(`{"x": {"${escape}": [{"${escape}": 2}]}}`);
      expect(nested, escape).toEqual({ x: { [char]: [{ [char]: 2 }] } });
      expect(parseJsonLossless(`["${escape}"]`), escape).toEqual([char]);
    }
    expect(parseJsonLossless('{"\\t": 1, "\\\\": 2, "\\n": 3}')).toEqual({ "\t": 1, "\\": 2, "\n": 3 });
  });

  it("reads JSON as JSON.parse does: whitespace, every escape, surrogates, duplicate keys, __proto__, deep nesting", () => {
    const text =
      ' \t\n\r{ "a" : [ true , false , null , -0 , 0.5 , -1.25e-3 , 1E2 , 1e400 , "" ] ,\r\n ' +
      '"b\\u00e9\\ud83d\\ude00\\/\\"" : { } , "a" : [ ] , "__proto__" : { "x" : 1 } } \n';
    const read = parseJsonLossless(text) as Record<string, unknown>;
    expect(read).toEqual(JSON.parse(text));
    expect(Object.keys(read)).toEqual(["a", 'bé😀/"', "__proto__"]);
    expect(read.a).toEqual([]);
    expect(Object.getPrototypeOf(read)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(read, "__proto__")?.value).toEqual({ x: 1 });
    expect(Object.is((parseJsonLossless("[-0]") as number[])[0], -0)).toBe(true);
    expect(parseJsonLossless("[1e400, -1e400]")).toEqual([Infinity, -Infinity]);
    const deep = 100_000;
    let nested = parseJsonLossless(`${"[".repeat(deep)}7${"]".repeat(deep)}`);
    for (let depth = 0; depth < deep; depth++) nested = (nested as unknown[])[0];
    expect(nested).toBe(7);
  });

  it("refuses text that is not JSON as unreadable output, as an UmbraError", () => {
    const NOT_JSON = [
      ...["", " ", "{", "}", "[1,]", "[,1]", '{"a"}', '{"a":}', '{"a":1,}', "{a:1}", "[1 2]", "[]x", "{'a':1}"],
      ...['{"a" 12}', '{"a"x1}', '{"a",1}', '"\\'],
      ...['"\\x"', '"\\u12"', '"a', '"\u0001"', "01", "-", "1.", ".5", "1e", "+1", "tru", "nul", "NaN", "Infinity"],
    ];
    for (const text of NOT_JSON) {
      expect(() => JSON.parse(text), `JSON.parse refuses ${JSON.stringify(text)} too`).toThrow(SyntaxError);
      const error = (() => {
        try {
          parseJsonLossless(text);
        } catch (thrown) {
          return thrown;
        }
        return undefined;
      })();
      expect(error, JSON.stringify(text)).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details, JSON.stringify(text)).toEqual({ reason: "unreadable-result", type: "json" });
    }
  });

  it("round-trips random JSON values through JSON.stringify, with random spacing (property, seed 20261023)", () => {
    // A JSON value as this reader must give it back: an integer printed as digits outside ±(2^53 − 1) as a bigint
    // (JSON.stringify prints such doubles as digits below 1e21), and -0 as 0 (JSON.stringify prints it "0").
    const expected = (value: unknown): unknown => {
      if (typeof value === "number") {
        if (Object.is(value, -0)) return 0;
        const text = JSON.stringify(value);
        return Number.isSafeInteger(value) || !/^-?[0-9]+$/.test(text) ? value : BigInt(text);
      }
      if (Array.isArray(value)) return value.map(expected);
      if (value !== null && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [key, inner] of Object.entries(value)) {
          Object.defineProperty(out, key, { value: expected(inner), enumerable: true, writable: true, configurable: true });
        }
        return out;
      }
      return value;
    };
    fc.assert(
      fc.property(fc.jsonValue(), fc.constantFrom(undefined, 0, 1, 2, "\t", " \r\n "), (value, space) => {
        const text = JSON.stringify(value, null, space);
        expect(parseJsonLossless(text)).toEqual(expected(value));
      }),
      { seed: SEED, numRuns: 500 },
    );
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

  describe("date and time as RFC 3339 text (DB-2, owner decisions Q68 and Q81)", () => {
    // PostgreSQL's output under the pinned settings (`DateStyle = 'ISO, MDY'`, `TimeZone = UTC`), as PostgreSQL 17.11
    // and PGlite 0.5.10 print it (checked 2026-10-24): the fraction without trailing zeros, the offset always `+00`.
    const TIMESTAMPTZ: readonly (readonly [string, string])[] = [
      ["2025-05-21 14:30:00+00", "2025-05-21T14:30:00Z"],
      ["2025-05-21 14:30:00.123456+00", "2025-05-21T14:30:00.123456Z"],
      ["2025-05-21 14:30:00.1+00", "2025-05-21T14:30:00.1Z"],
      ["2025-05-21 14:30:00.12+00", "2025-05-21T14:30:00.12Z"],
      ["2025-05-21 14:30:00.000001+00", "2025-05-21T14:30:00.000001Z"],
      ["0001-01-01 00:00:00+00", "0001-01-01T00:00:00Z"],
      ["0999-01-01 00:00:00+00", "0999-01-01T00:00:00Z"],
      ["9999-12-31 23:59:59.999999+00", "9999-12-31T23:59:59.999999Z"],
      ["1969-12-31 23:59:59.5+00", "1969-12-31T23:59:59.5Z"],
      ["infinity", "infinity"],
      ["-infinity", "-infinity"],
    ];
    const TIMESTAMP: readonly (readonly [string, string])[] = [
      ["2025-05-21 14:30:00", "2025-05-21T14:30:00"],
      ["2025-05-21 14:30:00.123456", "2025-05-21T14:30:00.123456"],
      ["0001-01-01 00:00:00.5", "0001-01-01T00:00:00.5"],
      ["infinity", "infinity"],
      ["-infinity", "-infinity"],
    ];
    const DATE: readonly string[] = ["2025-05-21", "0001-01-01", "9999-12-31", "infinity", "-infinity"];

    it("maps a timestamptz to RFC 3339 UTC text, with the fraction PostgreSQL prints, and infinity as the word", () => {
      for (const [text, expected] of TIMESTAMPTZ) {
        expect(mapValue(oid("timestamp with time zone"), text), text).toBe(expected);
      }
    });

    it("maps a timestamp to the same text without Z, and a date to its text", () => {
      for (const [text, expected] of TIMESTAMP) {
        expect(mapValue(oid("timestamp without time zone"), text), text).toBe(expected);
      }
      for (const text of DATE) expect(mapValue(oid("date"), text), text).toBe(text);
    });

    it("maps arrays of them element by element, NULL to null", () => {
      expect(
        mapValue(
          arrayOid("timestamp with time zone"),
          '{"2025-05-21 14:30:00+00",NULL,infinity,"2025-05-21 14:30:00.5+00"}',
        ),
      ).toEqual(["2025-05-21T14:30:00Z", null, "infinity", "2025-05-21T14:30:00.5Z"]);
      expect(mapValue(arrayOid("timestamp without time zone"), '{"2025-05-21 14:30:00",NULL,-infinity}')).toEqual([
        "2025-05-21T14:30:00",
        null,
        "-infinity",
      ]);
      expect(mapValue(arrayOid("date"), "{{2025-05-21},{2025-05-22}}")).toEqual([["2025-05-21"], ["2025-05-22"]]);
      expect(mapValue(arrayOid("date"), "[0:1]={2025-05-21,NULL}")).toEqual(["2025-05-21", null]);
    });

    it("refuses what it cannot read as unreadable output: years outside 0001–9999, BC, an offset other than +00", () => {
      const unreadable: readonly (readonly [string, string])[] = [
        // Q81: PostgreSQL's range reaches 4714 BC and 294276 AD; the mapping reads years 0001–9999 only.
        ["timestamp with time zone", "10000-01-01 00:00:00+00"],
        ["timestamp with time zone", "294276-12-31 23:59:59.999999+00"],
        ["timestamp with time zone", "0044-03-15 12:00:00+00 BC"],
        ["timestamp with time zone", "4714-11-24 00:00:00+00 BC"],
        ["timestamp without time zone", "10000-01-01 00:00:00"],
        ["timestamp without time zone", "0044-03-15 12:00:00 BC"],
        ["date", "10000-01-01"],
        ["date", "0044-03-15 BC"],
        // A session that changed TimeZone or DateStyle: output not in the pinned form is never guessed.
        ["timestamp with time zone", "2025-05-21 14:30:00+09"],
        ["timestamp with time zone", "2025-05-21 14:30:00+05:30"],
        ["timestamp with time zone", "2025-05-21 14:30:00"],
        ["timestamp with time zone", "21.05.2025 14:30:00 UTC"],
        ["timestamp without time zone", "2025-05-21 14:30:00+00"],
        ["timestamp without time zone", "05/21/2025 14:30:00"],
        ["date", "21.05.2025"],
        // Not PostgreSQL's output at all: RFC 3339 itself, seven fraction digits, a short year, nothing.
        ["timestamp with time zone", "2025-05-21T14:30:00Z"],
        ["timestamp with time zone", "2025-05-21 14:30:00.1234567+00"],
        ["timestamp with time zone", "2025-05-21 14:30:00.+00"],
        ["timestamp without time zone", "25-05-21 14:30:00"],
        ["date", "2025-05-21 "],
        ["date", "Infinity"],
        ["date", ""],
      ];
      for (const [type, text] of unreadable) {
        let error: unknown;
        try {
          mapValue(oid(type), text);
        } catch (caught) {
          error = caught;
        }
        expect(error, `${type} ${JSON.stringify(text)}`).toBeInstanceOf(UmbraError);
        expect((error as UmbraError).code).toBe("database-error");
        expect((error as UmbraError).details).toEqual({ reason: "unreadable-result", type });
      }
      // PostgreSQL quotes an element holding a space: the element is read, and refused, as a date.
      expect(() => mapValue(arrayOid("date"), '{2025-05-21,"0044-03-15 BC"}')).toThrow(/as date output/);
    });

    it("returns text, never a JavaScript Date, which keeps milliseconds only (negative control)", () => {
      for (const [text] of TIMESTAMPTZ) expect(typeof mapValue(oid("timestamp with time zone"), text)).toBe("string");
      // The mapping task 2.1 shipped, `new Date(text)`, fails the microsecond case above: a Date cannot hold it.
      expect(new Date("2025-05-21 14:30:00.123456+00").toISOString()).toBe("2025-05-21T14:30:00.123Z");
    });
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

  it("keeps the result's columns on the rows, unseen by any other reader (task 14.2's read-result names their types)", () => {
    const columns = [
      { name: "a", type: 20 },
      { name: "b", type: 17 },
    ];
    const rows = mapRows(columns, [["1", "\\x01"]]);
    expect(resultColumns(rows)).toEqual(columns);
    expect(Object.isFrozen(resultColumns(rows))).toBe(true);
    // Not enumerable: the rows compare, copy and serialize as before.
    expect(Object.keys(rows)).toEqual(["0"]);
    expect(JSON.stringify(rows.map((row) => Object.keys(row)))).toBe('[["a","b"]]');
    expect((rows as unknown as Record<symbol, unknown>)[RESULT_COLUMNS]).toBe(resultColumns(rows));
    expect(resultColumns(mapRows(columns, []))).toEqual(columns);
    expect(resultColumns([{ a: 1 }])).toBeUndefined();
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
