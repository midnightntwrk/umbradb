import { describe, expect, it } from "vitest";
import { encodeAsciiJson, encodeJson, MAX_INTEGER_DIGITS, readExactNumber, UnreadableNumber } from "../../src/runner/api-json.js";

/**
 * JSON as the module API writes and reads it (`src/runner/api-json.ts`): the ASCII writer of a route's answer, which
 * refuses what JSON would write as another value, and the exact reader of the numbers of a route's body.
 */

describe("encodeAsciiJson", () => {
  it("writes pure ASCII that parses to the same value, a bigint as digits and bytes as 0x hex", () => {
    const value = { text: "a<b>&c é 漢 😀 \u007f", n: 1, big: 2n ** 64n, bytes: Uint8Array.of(0, 255) };
    const text = encodeAsciiJson(value);
    expect(text).toMatch(/^[\x20-\x7e]*$/);
    expect(text).toContain("\\ud83d\\ude00");
    expect(JSON.parse(text)).toEqual({ text: value.text, n: 1, big: "18446744073709551616", bytes: "0x00ff" });
    expect(JSON.parse(text)).toEqual(JSON.parse(encodeJson(value) as string));
  });

  it("refuses what JSON would write as another value, and leaves an object's undefined property out", () => {
    for (const value of [undefined, () => 1, Symbol("s"), Number.NaN, [undefined], [[() => 1]], { a: [Symbol("s")] }, { a: Number.POSITIVE_INFINITY }, [Number.NEGATIVE_INFINITY]]) {
      expect(() => encodeAsciiJson(value)).toThrow(TypeError);
    }
    expect(encodeAsciiJson({ a: undefined, b: null, "": undefined, c: [null, 0, ""] })).toBe('{"b":null,"c":[null,0,""]}');
    expect(encodeAsciiJson(null)).toBe("null");
  });
});

describe("readExactNumber", () => {
  it("reads an integer exactly however it is written: a number within 2^53, a bigint beyond", () => {
    for (const [token, value] of [
      ["0", 0],
      ["-0", -0],
      ["5", 5],
      ["-9007199254740991", -9007199254740991],
      ["9007199254740992", 9007199254740992n],
      ["-9007199254740993", -9007199254740993n],
      ["5.0", 5],
      ["5.000", 5],
      ["5e3", 5000],
      ["5E+3", 5000],
      ["1.5e1", 15],
      ["100e-2", 1],
      ["0e-400", 0],
      ["0.0", 0],
      ["9007199254740993.0", 9007199254740993n],
      ["1e30", 10n ** 30n],
      ["-1.25e20", -125n * 10n ** 18n],
      ["9".repeat(MAX_INTEGER_DIGITS), 10n ** 78n - 1n],
      ["1e77", 10n ** 77n],
    ] as const) {
      expect([token, readExactNumber(token)]).toEqual([token, value]);
    }
  });

  it("reads any other number as the number nearest to it, an integer of more than 78 digits among them", () => {
    const long = "9".repeat(MAX_INTEGER_DIGITS + 1);
    for (const token of ["1.5", "-0.1", "2.5e-3", "1e-5", "123456789.123456789", "1.7976931348623157e308", "1e78", "1.5e300", long, `-${long}`]) {
      expect([token, readExactNumber(token)]).toEqual([token, Number(token)]);
    }
  });

  it("refuses what would be read as another value", () => {
    const refused = (token: string): string => {
      try {
        readExactNumber(token);
      } catch (error) {
        expect(error).toBeInstanceOf(UnreadableNumber);
        return (error as Error).message;
      }
      throw new Error(`${token} was read`);
    };
    for (const token of ["1.0000000000000001", "1e-400", "4.9999999999999999999", "9007199254740993.5", `0.${"0".repeat(400)}1`]) {
      expect([token, refused(token)]).toEqual([token, "a number in the request body is not an integer, and would be read as one"]);
    }
    for (const token of ["1e309", "-1.5e999", "9".repeat(400), `-${"9".repeat(500_000)}`]) {
      expect([token.slice(0, 12), refused(token)]).toEqual([token.slice(0, 12), "a number in the request body is beyond a number's range"]);
    }
  });
});
