import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { filePart, RANGE_NOT_SATISFIABLE, rangeNotSatisfiable } from "../../src/runner/api-range.js";

/**
 * Which bytes of a file a module API file answer sends for a GET's `Range` (`src/runner/api-range.ts`, RFC 9110 §14):
 * one range of `bytes` is a part (206), a range that holds none of the file is unsatisfiable (416), and everything else
 * — no `Range`, another unit, a malformed or multiple range, an `If-Range` that is not the answer's own strong `ETag` —
 * gets the whole file. The transports' use of it is `./binary-routes.test.ts` and the mounted handlers' test.
 */

const part = (start: number, end: number) => ({ kind: "part", start, end });
const WHOLE = { kind: "whole" };
const UNSATISFIABLE = { kind: "unsatisfiable" };

describe("filePart: the part of a file a Range asks for", () => {
  it("answers bytes=a-b, bytes=a- and bytes=-n with that part, cut to the file", () => {
    const cases: [string, unknown][] = [
      ["bytes=0-0", part(0, 0)],
      ["bytes=0-99", part(0, 99)],
      ["bytes=10-19", part(10, 19)],
      // The last position past the end is cut to the file's last byte.
      ["bytes=90-1000", part(90, 99)],
      ["bytes=99-99", part(99, 99)],
      ["bytes=95-", part(95, 99)],
      ["bytes=0-", part(0, 99)],
      ["bytes=-1", part(99, 99)],
      ["bytes=-10", part(90, 99)],
      // A suffix longer than the file is the whole file, as a part.
      ["bytes=-1000", part(0, 99)],
      // The unit in any letter case; spaces around the set and its one element; an empty list element.
      ["BYTES=1-2", part(1, 2)],
      ["  bytes=1-2  ", part(1, 2)],
      ["bytes= 1-2 ", part(1, 2)],
      ["bytes=1-2, ", part(1, 2)],
      ["bytes=,1-2", part(1, 2)],
      // Leading zeros are digits.
      ["bytes=007-008", part(7, 8)],
    ];
    for (const [range, expected] of cases) expect(filePart(100, range, undefined, undefined), range).toEqual(expected);
  });

  it("is unsatisfiable for a range that starts at or past the end, a suffix of 0, and any range of an empty file", () => {
    const cases: [number, string][] = [
      [100, "bytes=100-"],
      [100, "bytes=100-200"],
      [100, "bytes=12345678901234567890-"],
      [100, "bytes=-0"],
      [0, "bytes=0-"],
      [0, "bytes=0-0"],
      [0, "bytes=-1"],
    ];
    for (const [size, range] of cases) expect(filePart(size, range, undefined, undefined), `${size} ${range}`).toEqual(UNSATISFIABLE);
  });

  it("gives the whole file for no Range, another unit, a malformed range, and more than one range", () => {
    const ranges: (string | undefined)[] = [
      undefined,
      "",
      "items=0-1",
      "bytes 0-1",
      "bytes = 0-1",
      "bytes=",
      "bytes=,",
      "bytes=-",
      "bytes=a-b",
      "bytes=1-0",
      "bytes=5-4",
      "bytes=1.5-2",
      "bytes=+1-2",
      "bytes=1--2",
      "bytes=--1",
      "bytes=0-1,5-6",
      "bytes=0-1, 200-300",
      "bytes=0-1,0-1",
      "bytes=١-٢",
    ];
    for (const range of ranges) expect(filePart(100, range, undefined, undefined), String(range)).toEqual(WHOLE);
  });

  it("honours If-Range only when it is a strong tag equal to the answer's own ETag", () => {
    const range = "bytes=0-9";
    expect(filePart(100, range, '"v1"', '"v1"')).toEqual(part(0, 9));
    expect(filePart(100, range, ' "v1" ', '"v1"')).toEqual(part(0, 9));
    // Another tag, a weak tag, a weak ETag, no ETag, a date: the whole file.
    expect(filePart(100, range, '"v2"', '"v1"')).toEqual(WHOLE);
    expect(filePart(100, range, 'W/"v1"', 'W/"v1"')).toEqual(WHOLE);
    expect(filePart(100, range, '"v1"', 'W/"v1"')).toEqual(WHOLE);
    expect(filePart(100, range, '"v1"', undefined)).toEqual(WHOLE);
    expect(filePart(100, range, "Wed, 21 Oct 2015 07:28:00 GMT", '"v1"')).toEqual(WHOLE);
    // An If-Range without a Range changes nothing.
    expect(filePart(100, undefined, '"v1"', '"v1"')).toEqual(WHOLE);
    // A matching If-Range keeps an unsatisfiable range unsatisfiable.
    expect(filePart(100, "bytes=200-", '"v1"', '"v1"')).toEqual(UNSATISFIABLE);
  });

  it("property: bytes=a-b, bytes=a- and bytes=-n against a model of RFC 9110 §14.1.2; a part lies inside the file", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5_000 }),
        fc.oneof(
          fc.tuple(fc.nat(6_000), fc.nat(6_000)).map(([a, b]) => ({ text: `bytes=${a}-${b}`, a, b, kind: "int" as const })),
          fc.nat(6_000).map((a) => ({ text: `bytes=${a}-`, a, b: undefined, kind: "open" as const })),
          fc.nat(6_000).map((n) => ({ text: `bytes=-${n}`, a: n, b: undefined, kind: "suffix" as const })),
        ),
        (size, range) => {
          const got = filePart(size, range.text, undefined, undefined);
          let expected: unknown;
          if (range.kind === "int" && (range.b as number) < range.a) expected = WHOLE;
          else if (range.kind === "suffix") {
            expected = range.a === 0 || size === 0 ? UNSATISFIABLE : part(Math.max(0, size - range.a), size - 1);
          } else if (range.a >= size) expected = UNSATISFIABLE;
          else expected = part(range.a, range.kind === "open" ? size - 1 : Math.min(range.b as number, size - 1));
          expect(got).toEqual(expected);
          // A part lies inside the file and is never empty.
          if (got.kind === "part") {
            expect(got.start).toBeLessThanOrEqual(got.end);
            expect(got.end).toBeLessThan(size);
          }
        },
      ),
      { numRuns: 500 },
    );
  });
});

describe("rangeNotSatisfiable: the 416 answer", () => {
  it("is 416 with the module API's error body, Content-Range bytes */size and Accept-Ranges", () => {
    const answer = rangeNotSatisfiable(1234);
    expect(answer.status).toBe(416);
    expect(answer.headers).toEqual({
      "Content-Type": "application/json; charset=utf-8",
      "Content-Range": "bytes */1234",
      "Accept-Ranges": "bytes",
    });
    expect(JSON.parse(answer.body as string)).toEqual({
      error: { code: RANGE_NOT_SATISFIABLE, message: "the range holds none of the file's 1234 bytes" },
    });
    expect(RANGE_NOT_SATISFIABLE).toBe("range-not-satisfiable");
  });
});
