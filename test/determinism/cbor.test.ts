import { describe, expect, it } from "vitest";
import {
  CanonicalEncodingError,
  type CanonicalEncodingFailure,
  type CanonicalValue,
  type ColumnType,
  encodeArrayHead,
  encodeCanonical,
  encodeRow,
} from "../../src/determinism/cbor.js";
import { toHex } from "./cbor-decoder.js";

/**
 * A52 (DT-1): the canonical encoder against RFC 8949 Appendix A, plus the boundaries and column mappings of DT-1.
 *
 * Every expected byte string here is written by hand: the Appendix A ones copied from RFC 8949 Table 6
 * (https://www.rfc-editor.org/rfc/rfc8949.txt, read 2026-10-23), the others derived from the head rules of RFC 8949 §3
 * and §4.2.1 (arguments 0–23 in the initial byte; then 1, 2, 4 or 8 following bytes, the shortest that fits). None is
 * produced by the encoder under test.
 */

const hexOf = (value: CanonicalValue): string => toHex(encodeCanonical(value));
const rowHex = (values: readonly unknown[], types: readonly ColumnType[]): string => toHex(encodeRow(values, types));

function failure(run: () => unknown): CanonicalEncodingError {
  try {
    run();
  } catch (error) {
    if (error instanceof CanonicalEncodingError) return error;
    throw error;
  }
  throw new Error("expected a CanonicalEncodingError, but encoding succeeded");
}

function expectFailure(run: () => unknown, reason: CanonicalEncodingFailure, path?: string): void {
  const error = failure(run);
  expect(error.reason).toBe(reason);
  if (path !== undefined) expect(error.path).toBe(path);
}

const range = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => from + i);

describe("A52 — RFC 8949 Appendix A examples inside DT-1's subset give the RFC's bytes", () => {
  // Table 6 rows whose value DT-1 can hold: integers within 64 bits, simple values false/true/null, byte strings,
  // text strings, arrays, and maps with text keys (a jsonb object's keys are always text).
  const RFC_TABLE_6: readonly (readonly [string, CanonicalValue, string])[] = [
    ["0", 0, "00"],
    ["1", 1, "01"],
    ["10", 10, "0a"],
    ["23", 23, "17"],
    ["24", 24, "1818"],
    ["25", 25, "1819"],
    ["100", 100, "1864"],
    ["1000", 1000, "1903e8"],
    ["1000000", 1000000, "1a000f4240"],
    ["1000000000000", 1000000000000, "1b000000e8d4a51000"],
    ["18446744073709551615", 18446744073709551615n, "1bffffffffffffffff"],
    ["-18446744073709551616", -18446744073709551616n, "3bffffffffffffffff"],
    ["-1", -1, "20"],
    ["-10", -10, "29"],
    ["-100", -100, "3863"],
    ["-1000", -1000, "3903e7"],
    ["false", false, "f4"],
    ["true", true, "f5"],
    ["null", null, "f6"],
    ["h''", new Uint8Array(0), "40"],
    ["h'01020304'", Uint8Array.of(1, 2, 3, 4), "4401020304"],
    ['""', "", "60"],
    ['"a"', "a", "6161"],
    ['"IETF"', "IETF", "6449455446"],
    ['"\\"\\\\"', '"\\', "62225c"],
    ['"\\u00fc"', "ü", "62c3bc"],
    ['"\\u6c34"', "水", "63e6b0b4"],
    ['"\\ud800\\udd51"', "𐅑", "64f0908591"],
    ["[]", [], "80"],
    ["[1, 2, 3]", [1, 2, 3], "83010203"],
    ["[1, [2, 3], [4, 5]]", [1, [2, 3], [4, 5]], "8301820203820405"],
    ["[1, 2, ..., 25]", range(1, 25), "98190102030405060708090a0b0c0d0e0f101112131415161718181819"],
    ["{}", {}, "a0"],
    ['{"a": 1, "b": [2, 3]}', { a: 1, b: [2, 3] }, "a26161016162820203"],
    ['["a", {"b": "c"}]', ["a", { b: "c" }], "826161a161626163"],
    [
      '{"a": "A", "b": "B", "c": "C", "d": "D", "e": "E"}',
      { a: "A", b: "B", c: "C", d: "D", e: "E" },
      "a56161614161626142616361436164614461656145",
    ],
  ];

  it.each(RFC_TABLE_6)("%s", (_diagnostic, value, expected) => {
    expect(hexOf(value)).toBe(expected);
  });

  it("the integer examples give the same bytes whether passed as number or bigint", () => {
    for (const [, value, expected] of RFC_TABLE_6) {
      if (typeof value === "number") expect(hexOf(BigInt(value))).toBe(expected);
    }
  });

  it("the bignum examples (beyond 64 bits) are outside the subset and fail", () => {
    expectFailure(() => encodeCanonical(18446744073709551616n), "integer-out-of-range", "$");
    expectFailure(() => encodeCanonical(-18446744073709551617n), "integer-out-of-range", "$");
  });

  it("the non-integer float examples are outside the subset and fail", () => {
    for (const value of [1.1, 1.5, 5.960464477539063e-8, 0.00006103515625, -4.1, Infinity, NaN, -Infinity]) {
      expectFailure(() => encodeCanonical(value), "not-integer", "$");
    }
    // Integral doubles beyond 2^53 cannot be told apart from a rounded integer: they must arrive as bigint.
    for (const value of [3.4028234663852886e38, 1.0e300]) expectFailure(() => encodeCanonical(value), "unsafe-integer");
  });

  it("integral float examples are JavaScript integers and encode as CBOR integers, never as floats", () => {
    // RFC: 0.0 → f90000, -0.0 → f98000, 1.0 → f93c00, -4.0 → f9c400, 65504.0 → f97bff, 100000.0 → fa47c35000.
    expect(hexOf(0.0)).toBe("00");
    expect(hexOf(-0.0)).toBe("00");
    expect(hexOf(1.0)).toBe("01");
    expect(hexOf(-4.0)).toBe("23");
    expect(hexOf(65504.0)).toBe("19ffe0");
    expect(hexOf(100000.0)).toBe("1a000186a0");
  });

  it("undefined is outside the subset and fails", () => {
    expectFailure(() => encodeCanonical(undefined as unknown as CanonicalValue), "unsupported-value", "$");
  });

  it("the integer-keyed map {1: 2, 3: 4} is outside the subset: JavaScript keys are text, encoded as text", () => {
    // RFC: {1: 2, 3: 4} → a201020304 (integer keys). DT-1 maps come from jsonb objects, whose keys are text.
    expect(hexOf({ 1: 2, 3: 4 })).toBe("a2613102613304");
  });
});

describe("DT-1 map key order (RFC 8949 §4.2.1: bytewise order of the encoded keys)", () => {
  it('the spec scenario: {"b": 1, "a": 2, "aa": 3} emits a, b, aa', () => {
    expect(hexOf({ b: 1, a: 2, aa: 3 })).toBe("a361610261620162616103");
    expect(rowHex([{ b: 1, a: 2, aa: 3 }], ["jsonb"])).toBe("81a361610261620162616103");
  });

  it("a shorter key sorts first even when JavaScript enumerates an integer-like key first", () => {
    // Object.keys({a: 1, "10": 2}) is ["10", "a"]; the encoded keys are 6161 < 623130.
    expect(hexOf({ a: 1, "10": 2 })).toBe("a261610162313002");
    expect(hexOf({ "10": 1, "9": 2 })).toBe("a261390262313001");
  });

  it("keys of equal encoded length sort by UTF-8 bytes, not by UTF-16 code units", () => {
    // "a" is ee 80 80 61 and "\u{10000}" is f0 90 80 80 (4 bytes each); UTF-16 puts d800 before e000.
    expect(hexOf({ "\u{10000}": 1, "a": 2 })).toBe("a264ee8080610264f090808001");
  });

  it("an own __proto__ key is encoded like any other key", () => {
    const value = JSON.parse('{"__proto__": 1}') as CanonicalValue;
    expect(hexOf(value)).toBe("a1695f5f70726f746f5f5f01");
  });

  it("objects with a null prototype are accepted", () => {
    const value = Object.create(null) as Record<string, CanonicalValue>;
    value.a = 1;
    expect(hexOf(value)).toBe("a1616101");
  });

  it("encoding leaves the input untouched", () => {
    const value = { b: 1, a: 2 };
    encodeCanonical(value);
    expect(Object.keys(value)).toEqual(["b", "a"]);
  });
});

describe("DT-1 integer boundaries (shortest argument, RFC 8949 §4.2.1)", () => {
  const BOUNDARIES: readonly (readonly [bigint, string])[] = [
    [0n, "00"],
    [23n, "17"],
    [24n, "1818"],
    [255n, "18ff"],
    [256n, "190100"],
    [65535n, "19ffff"],
    [65536n, "1a00010000"],
    [4294967295n, "1affffffff"],
    [4294967296n, "1b0000000100000000"],
    [9007199254740991n, "1b001fffffffffffff"],
    [18446744073709551615n, "1bffffffffffffffff"],
    [-1n, "20"],
    [-24n, "37"],
    [-25n, "3818"],
    [-256n, "38ff"],
    [-257n, "390100"],
    [-65536n, "39ffff"],
    [-65537n, "3a00010000"],
    [-4294967296n, "3affffffff"],
    [-4294967297n, "3b0000000100000000"],
    [-9007199254740991n, "3b001ffffffffffffe"],
    [-18446744073709551616n, "3bffffffffffffffff"],
  ];

  it.each(BOUNDARIES)("%s", (value, expected) => {
    expect(hexOf(value)).toBe(expected);
    if (value >= -9007199254740991n && value <= 9007199254740991n) expect(hexOf(Number(value))).toBe(expected);
  });

  it("2^64 and -2^64 - 1 fail; numbers beyond ±(2^53 - 1) must be bigint", () => {
    expectFailure(() => encodeCanonical(18446744073709551616n), "integer-out-of-range");
    expectFailure(() => encodeCanonical(-18446744073709551617n), "integer-out-of-range");
    expectFailure(() => encodeCanonical(9007199254740992), "unsafe-integer");
    expectFailure(() => encodeCanonical(-9007199254740992), "unsafe-integer");
  });
});

describe("DT-1 length boundaries (text, byte strings, arrays, maps)", () => {
  const LENGTHS: readonly (readonly [number, string])[] = [
    [0, "0"],
    [23, "17"],
    [24, "1818"],
    [255, "18ff"],
    [256, "190100"],
    [65535, "19ffff"],
    [65536, "1a00010000"],
  ];
  // The initial byte of a head is (major type << 5) | additional information; the major type adds 0x40, 0x60, 0x80
  // or 0xa0 to the head of the same argument as an unsigned integer (major type 0).
  const head = (majorBase: number, argumentHead: string): string => {
    const first = argumentHead === "0" ? 0 : Number.parseInt(argumentHead.slice(0, 2), 16);
    const rest = argumentHead === "0" ? "" : argumentHead.slice(2);
    return (majorBase + first).toString(16).padStart(2, "0") + rest;
  };

  it.each(LENGTHS)("text string of %i bytes", (length, argumentHead) => {
    expect(hexOf("x".repeat(length))).toBe(head(0x60, argumentHead) + "78".repeat(length));
  });

  it.each(LENGTHS)("byte string of %i bytes", (length, argumentHead) => {
    expect(hexOf(new Uint8Array(length).fill(0xab))).toBe(head(0x40, argumentHead) + "ab".repeat(length));
  });

  it.each(LENGTHS)("array of %i items", (length, argumentHead) => {
    expect(hexOf(new Array<null>(length).fill(null))).toBe(head(0x80, argumentHead) + "f6".repeat(length));
  });

  it.each(LENGTHS)("map of %i entries", (length, argumentHead) => {
    // Fixed-width keys "00000", "00001", …: equal encoded length, so their bytewise order is their numeric order.
    // They are inserted in reverse, so the encoder has to sort them.
    const key = (i: number): string => String(i).padStart(5, "0");
    const value: Record<string, null> = {};
    for (let i = length - 1; i >= 0; i--) value[key(i)] = null;
    let expected = head(0xa0, argumentHead);
    for (let i = 0; i < length; i++) expected += "65" + toHex(new TextEncoder().encode(key(i))) + "f6";
    expect(hexOf(value)).toBe(expected);
  });

  it("text length counts UTF-8 bytes, not UTF-16 code units", () => {
    expect(hexOf("ü".repeat(12))).toBe("7818" + "c3bc".repeat(12));
    expect(hexOf("水".repeat(8))).toBe("7818" + "e6b0b4".repeat(8));
    expect(hexOf("\u{10151}".repeat(6))).toBe("7818" + "f0908591".repeat(6));
    expect(hexOf("ü".repeat(11) + "a")).toBe("77" + "c3bc".repeat(11) + "61");
  });

  it("a text string with a lone surrogate has no UTF-8 encoding and fails", () => {
    expectFailure(() => encodeCanonical("\ud800"), "lone-surrogate", "$");
    expectFailure(() => encodeCanonical(["ok", "a\udc00b"]), "lone-surrogate", "$[1]");
    expectFailure(() => encodeCanonical({ "\udbff": 1 }), "lone-surrogate", '$["\\udbff"]');
  });
});

describe("DT-1 values outside the subset, nesting and cycles", () => {
  it("rejects values the subset has no encoding for, naming the path", () => {
    const bad: readonly unknown[] = [
      undefined,
      () => 1,
      Symbol("s"),
      new Map([["a", 1]]),
      new Set([1]),
      new Date(0),
      new Uint16Array(2),
      new ArrayBuffer(2),
      new (class Point {
        x = 1;
      })(),
      { [Symbol("s")]: 1 },
    ];
    for (const value of bad) {
      const wrapped = { k: [value] } as unknown as CanonicalValue;
      expectFailure(() => encodeCanonical(wrapped), "unsupported-value", '$["k"][0]');
    }
  });

  it("a Buffer is a byte string", () => {
    expect(hexOf(Buffer.from([1, 2, 3, 4]))).toBe("4401020304");
  });

  it("deep nesting does not exhaust the call stack", () => {
    const depth = 100_000;
    let nested: CanonicalValue = null;
    for (let i = 0; i < depth; i++) nested = [nested];
    expect(hexOf(nested)).toBe("81".repeat(depth) + "f6");
  });

  it("a cyclic value fails; a value shared without a cycle is encoded at each place", () => {
    const array: unknown[] = [];
    array.push(array);
    expectFailure(() => encodeCanonical(array as CanonicalValue), "cyclic-value", "$[0]");
    const object: Record<string, unknown> = {};
    object.self = { again: object };
    expectFailure(() => encodeCanonical(object as CanonicalValue), "cyclic-value", '$["self"]["again"]');
    const shared = [1];
    expect(hexOf([shared, shared])).toBe("8281018101");
  });

  it("each call returns its own exactly sized bytes", () => {
    const first = encodeCanonical([1]);
    const second = encodeCanonical([1]);
    first[0] = 0;
    expect(toHex(second)).toBe("8101");
    expect(second.byteOffset).toBe(0);
    expect(second.buffer.byteLength).toBe(second.length);
  });
});

describe("encodeArrayHead — the head of a definite-length array, for streaming rows into one array", () => {
  const HEADS: readonly (readonly [number, string])[] = [
    [0, "80"],
    [3, "83"],
    [23, "97"],
    [24, "9818"],
    [25, "9819"],
    [255, "98ff"],
    [256, "990100"],
    [65535, "99ffff"],
    [65536, "9a00010000"],
    [4294967295, "9affffffff"],
    [4294967296, "9b0000000100000000"],
  ];

  it.each(HEADS)("%i", (length, expected) => {
    expect(toHex(encodeArrayHead(length))).toBe(expected);
  });

  it("head followed by row encodings is the encoding of the array of rows", () => {
    const types: ColumnType[] = ["bigint", "text"];
    const streamed =
      toHex(encodeArrayHead(2)) + rowHex([1n, "a"], types) + rowHex([2n, "b"], types);
    expect(streamed).toBe("82" + "82016161" + "82026162");
    expect(streamed).toBe(hexOf([[1n, "a"], [2n, "b"]]));
  });

  it("rejects a length that is not a non-negative safe integer", () => {
    expectFailure(() => encodeArrayHead(-1), "integer-out-of-range");
    expectFailure(() => encodeArrayHead(1.5), "not-integer");
    expectFailure(() => encodeArrayHead(Number.NaN), "not-integer");
    expectFailure(() => encodeArrayHead(2 ** 53), "unsafe-integer");
  });
});

describe("encodeRow — DT-1 column mappings", () => {
  it("encodes a row as an array of its column values in column order", () => {
    const types: ColumnType[] = [
      "bigint",
      "integer",
      "smallint",
      "numeric",
      "bytea",
      "text",
      "boolean",
      "jsonb",
      "text[]",
    ];
    const values = [
      9223372036854775807n,
      -2147483648,
      32767,
      "-0042",
      Buffer.from([0xde, 0xad]),
      "ü",
      false,
      { b: 1, a: [true, null] },
      ["x", null],
    ];
    expect(rowHex(values, types)).toBe(
      "89" +
        "1b7fffffffffffffff" +
        "3a7fffffff" +
        "197fff" +
        "632d3432" +
        "42dead" +
        "62c3bc" +
        "f4" +
        "a2616182f5f6616201" +
        "826178f6",
    );
  });

  it("an empty row is an empty array", () => {
    expect(rowHex([], [])).toBe("80");
  });

  it("null is CBOR null in every column type", () => {
    const scalars = ["smallint", "integer", "bigint", "numeric", "bytea", "text", "boolean", "jsonb"] as const;
    const types: ColumnType[] = [...scalars, ...scalars.map((t) => `${t}[]` as const)];
    expect(rowHex(new Array(types.length).fill(null), types)).toBe("90" + "f6".repeat(16));
  });

  it("refuses a row whose length differs from its column types, and unknown column types", () => {
    expectFailure(() => encodeRow([1, 2], ["integer"]), "row-length", "$");
    // Column types are named as format_type(atttypid, NULL) names them: "character varying", never "varchar".
    expectFailure(() => encodeRow(["x"], ["varchar" as ColumnType]), "unsupported-column-type", "$[0]");
    expectFailure(() => encodeRow([[[1]]], ["integer[][]" as ColumnType]), "unsupported-column-type", "$[0]");
    expectFailure(() => encodeRow(["{}"], ["json" as ColumnType]), "unsupported-column-type", "$[0]");
    // Task 1.3 (owner decision Q58): a refused type gets the code `design.md` §4's column-type table gives it, the
    // same the contents hash and startup give; floating-point types are DT-6's `non-deterministic-column`.
    expectFailure(() => encodeRow([1.5], ["double precision" as ColumnType]), "non-deterministic-column", "$[0]");
  });

  describe("varchar and uuid (task 1.3, owner decision Q58; A52)", () => {
    const UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const UUID_BYTES = "a0eebc999c0b4ef8bb6d6bb9bd380a11";

    it("a varchar value is the same text string as a text value", () => {
      for (const value of ["", "a", "ü", "\u{1F600}", "x".repeat(24)]) {
        expect(rowHex([value], ["character varying"])).toBe(rowHex([value], ["text"]));
      }
      expect(rowHex(["Ab"], ["character varying"])).toBe("81" + "624162");
      expect(rowHex([["a", null], []], ["character varying[]", "character varying[]"])).toBe("82" + "826161f6" + "80");
    });

    it("a uuid is a byte string of its 16 bytes (head 0x50)", () => {
      expect(rowHex([UUID], ["uuid"])).toBe("81" + "50" + UUID_BYTES);
      expect(rowHex(["00000000-0000-0000-0000-000000000000"], ["uuid"])).toBe("81" + "50" + "00".repeat(16));
      expect(rowHex(["ffffffff-ffff-ffff-ffff-ffffffffffff"], ["uuid"])).toBe("81" + "50" + "ff".repeat(16));
      expect(rowHex([[UUID, null]], ["uuid[]"])).toBe("81" + "82" + "50" + UUID_BYTES + "f6");
      // The same 16 bytes as a bytea value: one encoding for one value, whichever type holds it.
      expect(rowHex([UUID], ["uuid"])).toBe(rowHex([Buffer.from(UUID_BYTES, "hex")], ["bytea"]));
    });

    it("null is CBOR null in varchar and uuid columns and their arrays", () => {
      const types: ColumnType[] = ["character varying", "uuid", "character varying[]", "uuid[]"];
      expect(rowHex([null, null, null, null], types)).toBe("84" + "f6".repeat(4));
    });

    it("a uuid must be PostgreSQL's output: 32 lowercase hex digits in groups 8-4-4-4-12", () => {
      const malformed = [
        UUID.toUpperCase(), // PostgreSQL never prints upper case
        "A0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        UUID_BYTES, // no hyphens
        `{${UUID}}`, // braces
        `urn:uuid:${UUID}`,
        "a0eebc999c0b-4ef8-bb6d-6bb9-bd380a11", // hyphens in the wrong places
        "a0eebc99-9c0b4ef8-bb6d6bb9-bd380a11",
        `${UUID} `,
        ` ${UUID}`,
        `${UUID}\n`,
        UUID.slice(0, -1), // 35 characters
        `${UUID}0`, // 37 characters
        "g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // not hex
        "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1١",
        "",
      ];
      for (const value of malformed) expectFailure(() => encodeRow([value], ["uuid"]), "uuid-invalid", "$[0]");
      expectFailure(() => encodeRow([[UUID, "x"]], ["uuid[]"]), "uuid-invalid", "$[0][1]");
    });

    it("a uuid must arrive as text, and varchar as a string", () => {
      expectFailure(() => encodeRow([Buffer.from(UUID_BYTES, "hex")], ["uuid"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([1n], ["uuid"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([5], ["character varying"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow(["a\ud800"], ["character varying"]), "lone-surrogate", "$[0]");
    });

    it("says what a malformed uuid is", () => {
      expect(failure(() => encodeRow(["ABC"], ["uuid"])).message).toBe(
        '$[0]: uuid-invalid: "ABC" is not a uuid as PostgreSQL prints it: 32 lowercase hexadecimal digits in groups ' +
          'of 8, 4, 4, 4 and 12, joined by "-"',
      );
    });
  });

  describe("integers: smallint, integer and bigint within their PostgreSQL ranges, as number or bigint", () => {
    const CASES: readonly (readonly [ColumnType, bigint, string])[] = [
      ["smallint", -32768n, "397fff"],
      ["smallint", 32767n, "197fff"],
      ["integer", -2147483648n, "3a7fffffff"],
      ["integer", 2147483647n, "1a7fffffff"],
      ["bigint", -9223372036854775808n, "3b7fffffffffffffff"],
      ["bigint", 9223372036854775807n, "1b7fffffffffffffff"],
      ["bigint", 9007199254740991n, "1b001fffffffffffff"],
    ];

    it.each(CASES)("%s %s", (type, value, expected) => {
      expect(rowHex([value], [type])).toBe("81" + expected);
      if (value >= -9007199254740991n && value <= 9007199254740991n) {
        expect(rowHex([Number(value)], [type])).toBe("81" + expected);
      }
    });

    it("one past each range fails", () => {
      expectFailure(() => encodeRow([-32769], ["smallint"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([32768n], ["smallint"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([-2147483649n], ["integer"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([2147483648], ["integer"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([-9223372036854775809n], ["bigint"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([9223372036854775808n], ["bigint"]), "integer-out-of-range", "$[0]");
    });

    it("non-integers, unsafe numbers and other types fail", () => {
      expectFailure(() => encodeRow([1.5], ["integer"]), "not-integer", "$[0]");
      expectFailure(() => encodeRow([2 ** 53], ["bigint"]), "unsafe-integer", "$[0]");
      expectFailure(() => encodeRow(["1"], ["bigint"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([true], ["smallint"]), "type-mismatch", "$[0]");
    });
  });

  describe("numeric: its canonical text; a fraction fails", () => {
    const CANONICAL: readonly (readonly [string, string])[] = [
      ["0", "6130"],
      ["-0", "6130"],
      ["000", "6130"],
      ["007", "6137"],
      ["-007", "622d37"],
      ["-42", "632d3432"],
      ["18446744073709551616", "74" + toHex(new TextEncoder().encode("18446744073709551616"))],
      ["123456789012345678901234567890", "781e" + "31323334353637383930".repeat(3)],
    ];

    it.each(CANONICAL)("%s", (value, expected) => {
      expect(rowHex([value], ["numeric"])).toBe("81" + expected);
    });

    it("a value with a fraction fails, including a zero fraction (Q57 options A and C)", () => {
      for (const value of ["1.5", "-0.5", "0.1", "1.0", "100.00", "-0.0"]) {
        expectFailure(() => encodeRow([value], ["numeric"]), "numeric-fraction", "$[0]");
      }
    });

    it("text that is not PostgreSQL's decimal output of an integer fails", () => {
      const invalid = ["", "-", "+5", " 5", "5 ", "1e3", "NaN", "Infinity", "-Infinity", ".5", "5.", "0x10", "--5"];
      invalid.push("\u0661\u0662"); // Arabic-Indic digits: not ASCII digits
      // A valid fraction with other characters around it is not PostgreSQL's output either.
      invalid.push("+1.5", "x1.5", "1.5e3", "1.5x", "1.5.5");
      for (const value of invalid) expectFailure(() => encodeRow([value], ["numeric"]), "numeric-invalid", "$[0]");
    });

    it("a numeric must arrive as a decimal string", () => {
      expectFailure(() => encodeRow([5], ["numeric"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([5n], ["numeric"]), "type-mismatch", "$[0]");
    });
  });

  describe("bytea, text and boolean", () => {
    it("bytea is a byte string; a Buffer and a Uint8Array give the same bytes", () => {
      expect(rowHex([Uint8Array.of(1, 2)], ["bytea"])).toBe("81420102");
      expect(rowHex([Buffer.from([1, 2])], ["bytea"])).toBe("81420102");
      expect(rowHex([new Uint8Array(0)], ["bytea"])).toBe("8140");
    });

    it("text is a text string, numeric-looking text unchanged", () => {
      expect(rowHex(["007", "1.5", ""], ["text", "text", "text"])).toBe("83" + "63303037" + "63312e35" + "60");
    });

    it("boolean is true/false", () => {
      expect(rowHex([true, false], ["boolean", "boolean"])).toBe("82f5f4");
    });

    it("mismatched types fail", () => {
      expectFailure(() => encodeRow(["dead"], ["bytea"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([[1, 2]], ["bytea"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([5], ["text"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([Uint8Array.of(1)], ["text"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([0], ["boolean"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow(["true"], ["boolean"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([undefined], ["text"]), "type-mismatch", "$[0]");
    });

    it("text with a lone surrogate fails", () => {
      expectFailure(() => encodeRow(["a\ud800"], ["text"]), "lone-surrogate", "$[0]");
    });
  });

  describe("arrays: CBOR arrays, nested for more dimensions, elements typed by the column", () => {
    it("encodes one- and two-dimensional arrays with null elements", () => {
      expect(rowHex([[[1, 2], [3, null]]], ["integer[]"])).toBe("81" + "828201028203f6");
      expect(rowHex([["10", "-0"]], ["numeric[]"])).toBe("81" + "826231306130");
      expect(rowHex([[Uint8Array.of(1)]], ["bytea[]"])).toBe("81" + "814101");
      expect(rowHex([[{ a: 1 }, null]], ["jsonb[]"])).toBe("81" + "82a1616101f6");
      expect(rowHex([[true]], ["boolean[]"])).toBe("81" + "81f5");
      expect(rowHex([[]], ["text[]"])).toBe("81" + "80");
    });

    it("element failures name the element", () => {
      expectFailure(() => encodeRow([["1", "1.5"]], ["numeric[]"]), "numeric-fraction", "$[0][1]");
      expectFailure(() => encodeRow([[[1], [32768]]], ["smallint[]"]), "integer-out-of-range", "$[0][1][0]");
      expectFailure(() => encodeRow([["a", 1]], ["text[]"]), "type-mismatch", "$[0][1]");
      expectFailure(() => encodeRow([[{ x: 1.5 }]], ["jsonb[]"]), "not-integer", '$[0][0]["x"]');
    });

    it("an array column needs an array, a scalar column refuses one", () => {
      expectFailure(() => encodeRow(["x"], ["text[]"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([{ a: 1 }], ["jsonb[]"]), "type-mismatch", "$[0]");
      expectFailure(() => encodeRow([["x"]], ["text"]), "type-mismatch", "$[0]");
    });
  });

  describe("jsonb: the JSON value as CBOR; numbers must be integers within the signed 64-bit range", () => {
    it("an integer gives the same bytes as number or bigint (the lossless parser's bigint)", () => {
      expect(rowHex([5], ["jsonb"])).toBe("8105");
      expect(rowHex([5n], ["jsonb"])).toBe("8105");
      expect(rowHex([-0], ["jsonb"])).toBe("8100");
    });

    it("JSON strings, booleans, null, arrays and objects", () => {
      expect(rowHex([["a", true, null, { "": [] }]], ["jsonb"])).toBe("81" + "846161f5f6a16080");
    });

    it("the signed 64-bit bounds are accepted and one past them fails", () => {
      expect(rowHex([9223372036854775807n], ["jsonb"])).toBe("811b7fffffffffffffff");
      expect(rowHex([-9223372036854775808n], ["jsonb"])).toBe("813b7fffffffffffffff");
      expectFailure(() => encodeRow([9223372036854775808n], ["jsonb"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([-9223372036854775809n], ["jsonb"]), "integer-out-of-range", "$[0]");
      expectFailure(() => encodeRow([{ n: 18446744073709551615n }], ["jsonb"]), "integer-out-of-range", '$[0]["n"]');
    });

    it("a non-integer JSON number fails, naming where it is", () => {
      expectFailure(() => encodeRow([1, { x: [1, 1.5] }], ["integer", "jsonb"]), "not-integer", '$[1]["x"][1]');
      expectFailure(() => encodeRow([{ x: Number.NaN }], ["jsonb"]), "not-integer", '$[0]["x"]');
      expectFailure(() => encodeRow([[Infinity]], ["jsonb"]), "not-integer", "$[0][0]");
      expectFailure(() => encodeRow([2 ** 53], ["jsonb"]), "unsafe-integer", "$[0]");
    });

    it("values JSON cannot hold fail", () => {
      expectFailure(() => encodeRow([{ b: Uint8Array.of(1) }], ["jsonb"]), "unsupported-value", '$[0]["b"]');
      expectFailure(() => encodeRow([{ u: undefined }], ["jsonb"]), "unsupported-value", '$[0]["u"]');
      expectFailure(() => encodeRow([new Map()], ["jsonb"]), "unsupported-value", "$[0]");
    });

    it("deep nesting does not exhaust the call stack", () => {
      const depth = 100_000;
      let nested: unknown = null;
      for (let i = 0; i < depth; i++) nested = { a: nested };
      expect(rowHex([nested], ["jsonb"])).toBe("81" + "a16161".repeat(depth) + "f6");
    });
  });

  it("the error is an Error with its reason and path in the message", () => {
    const error = failure(() => encodeRow(["1.5"], ["numeric"]));
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("CanonicalEncodingError");
    expect(error.message).toContain("$[0]");
    expect(error.message).toContain("numeric-fraction");
  });

  it("the error's message says what was wrong", () => {
    const cyclic: unknown[] = [];
    cyclic.push(cyclic);
    const DETAILS: readonly (readonly [() => unknown, string])[] = [
      [() => encodeRow([1, 2], ["integer"]), "$: row-length: 2 values for 1 columns"],
      [() => encodeRow(["x"], ["varchar" as ColumnType]), '$[0]: unsupported-column-type: column type "varchar"'],
      [() => encodeRow(["x"], ["text[]"]), "$[0]: type-mismatch: text[] needs an array, got a string"],
      [() => encodeRow([["x"]], ["text"]), "$[0]: type-mismatch: text needs a scalar, got an array"],
      [() => encodeRow([Uint8Array.of(1)], ["text"]), "$[0]: type-mismatch: text cannot hold a byte array"],
      [() => encodeRow([{}], ["bytea"]), "$[0]: type-mismatch: bytea cannot hold an object ([object Object])"],
      [() => encodeRow([undefined], ["boolean"]), "$[0]: type-mismatch: boolean cannot hold undefined"],
      [() => encodeRow([1.5], ["integer"]), "$[0]: not-integer: 1.5 is not an integer"],
      [
        () => encodeRow([2 ** 53], ["bigint"]),
        "$[0]: unsafe-integer: 9007199254740992 is beyond ±(2^53 - 1); pass it as a bigint",
      ],
      [() => encodeRow([32768], ["smallint"]), "$[0]: integer-out-of-range: 32768 is outside [-32768, 32767]"],
      [() => encodeRow([-32769n], ["smallint"]), "$[0]: integer-out-of-range: -32769 is outside [-32768, 32767]"],
      [() => encodeRow(["1.5"], ["numeric"]), '$[0]: numeric-fraction: "1.5" has a fraction'],
      [() => encodeRow(["1e3"], ["numeric"]), '$[0]: numeric-invalid: "1e3" is not decimal digits with an optional'],
      [() => encodeRow(["\ud800"], ["text"]), "$[0]: lone-surrogate: the text holds a lone UTF-16 surrogate"],
      [() => encodeCanonical(cyclic as CanonicalValue), "$[0]: cyclic-value: the value contains itself"],
      [() => encodeCanonical((() => 1) as unknown as CanonicalValue), "$: unsupported-value: a function has no"],
      [() => encodeArrayHead(-1), "$: integer-out-of-range: negative length -1"],
    ];
    for (const [run, message] of DETAILS) expect(failure(run).message).toContain(message);
  });
});
