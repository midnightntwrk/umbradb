import { describe, expect, it } from "vitest";
import { ifMatchPasses, parseByteRanges, parseIfMatch, resolveByteRanges } from "../../src/runner/byte-ranges.js";

/** Byte ranges (`src/runner/byte-ranges.ts`): the forms RFC 9110 §14.1.2 writes, resolved against a size. */

const resolve = (text: string, size: number) => {
  const specs = parseByteRanges(text, "optional");
  if (specs === undefined) throw new Error(`${text} did not parse`);
  return resolveByteRanges(specs, size);
};

describe("parseByteRanges", () => {
  it("reads each form, with spaces and empty list elements around commas", () => {
    expect(parseByteRanges("bytes=0-499", "required")).toEqual([{ first: 0, last: 499 }]);
    expect(parseByteRanges("BYTES = 500-", "required")).toEqual([{ first: 500 }]);
    expect(parseByteRanges("bytes=-500", "required")).toEqual([{ suffix: 500 }]);
    expect(parseByteRanges("bytes=0-0, ,-1", "required")).toEqual([{ first: 0, last: 0 }, { suffix: 1 }]);
  });

  it("requires the unit in the header only", () => {
    expect(parseByteRanges("0-9", "required")).toBeUndefined();
    expect(parseByteRanges("0-9", "optional")).toEqual([{ first: 0, last: 9 }]);
    expect(parseByteRanges("bytes=0-9", "optional")).toEqual([{ first: 0, last: 9 }]);
  });

  it("refuses what is no range", () => {
    for (const text of ["", "bytes=", "bytes=-", "bytes=5-4", "bytes=a-b", "bytes=1-2-3", "bytes=+1-2", "items=0-9", "bytes=0x1-"]) {
      expect(parseByteRanges(text, "required"), text).toBeUndefined();
    }
  });
});

describe("resolveByteRanges", () => {
  it("gives a single range's bytes, end exclusive, its last clipped to the file", () => {
    expect(resolve("0-499", 1000)).toEqual({ kind: "part", start: 0, end: 500 });
    expect(resolve("500-", 1000)).toEqual({ kind: "part", start: 500, end: 1000 });
    expect(resolve("-300", 1000)).toEqual({ kind: "part", start: 700, end: 1000 });
    expect(resolve("-3000", 1000)).toEqual({ kind: "part", start: 0, end: 1000 });
    expect(resolve("990-99999999999999999999", 1000)).toEqual({ kind: "part", start: 990, end: 1000 });
  });

  it("finds a range none of whose bytes exist unsatisfiable", () => {
    expect(resolve("1000-", 1000)).toEqual({ kind: "unsatisfiable" });
    expect(resolve("-0", 1000)).toEqual({ kind: "unsatisfiable" });
    expect(resolve("-5", 0)).toEqual({ kind: "unsatisfiable" });
    expect(resolve("0-", 0)).toEqual({ kind: "unsatisfiable" });
  });

  it("answers several ranges whole when any is satisfiable", () => {
    expect(resolve("0-1,5-6", 10)).toEqual({ kind: "whole" });
    expect(resolve("0-1,50-60", 10)).toEqual({ kind: "whole" });
    expect(resolve("20-30,50-60", 10)).toEqual({ kind: "unsatisfiable" });
  });
});

describe("parseIfMatch", () => {
  it("reads *, and a list's strong tags, dropping weak ones", () => {
    expect(parseIfMatch(" * ", "required")).toBe("*");
    expect(parseIfMatch(' "x", ,W/"y","a,b" ', "required")).toEqual(["x", "a,b"]);
    expect(parseIfMatch('W/"y"', "required")).toEqual([]);
  });

  it("takes one bare tag in the parameter only", () => {
    expect(parseIfMatch("v1", "required")).toBeUndefined();
    expect(parseIfMatch("v1", "optional")).toEqual(["v1"]);
    expect(parseIfMatch('"v1"', "optional")).toEqual(["v1"]);
  });

  it("refuses what is no list", () => {
    for (const text of ["", " , ", '"abc" x', '"abc', 'a"b', "Wed, 21 Oct 2015 07:28:00 GMT"]) expect(parseIfMatch(text, "optional"), text).toBeUndefined();
  });
});

describe("ifMatchPasses", () => {
  it("passes * and a list naming the etag; never a file without one", () => {
    expect(ifMatchPasses("*", undefined)).toBe(true);
    expect(ifMatchPasses(["x", "abc"], "abc")).toBe(true);
    expect(ifMatchPasses(["abd"], "abc")).toBe(false);
    expect(ifMatchPasses(["abc"], undefined)).toBe(false);
  });
});
