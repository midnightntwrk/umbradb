import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  CanonicalEncodingError,
  type CanonicalEncodingFailure,
  type CanonicalValue,
  encodeCanonical,
  encodeRow,
} from "../../src/determinism/cbor.js";
import {
  checkCanonical,
  concatBytes,
  type Decoded,
  type DecodedMap,
  fromHex,
  isDecodedMap,
  plainOfDecoded,
  plainOfInput,
} from "./cbor-decoder.js";

/**
 * Property tests of the canonical encoder. The oracle is `cbor-decoder.ts`, a decoder and RFC 8949 §4.2.1 checker
 * written independently of the encoder. For every generated value it checks that:
 * - each argument is in its shortest form;
 * - no indefinite length appears;
 * - every map's keys are in strictly ascending bytewise order of their encodings;
 * - the decoded value equals the input.
 * [A53, DT-1]
 *
 * Determinism: every property runs with a pinned, reported fast-check seed.
 */
const SEED = 20261023;
const RUNS = 300;

/** jsonb keys: arbitrary Unicode, plus a pool that forces equal-length, prefix, integer-like and `__proto__` keys. */
const keyArb = fc.oneof(
  fc.string({ unit: "binary", maxLength: 6 }),
  fc.constantFrom("", "a", "b", "aa", "ab", "ba", "z", "10", "9", "01", "__proto__", "ü", "a", "\u{10000}"),
);

const int64 = { min: -(2n ** 63n), max: 2n ** 63n - 1n };

/** JSON values as the lossless jsonb parser gives them: safe integers as number, larger ones as bigint. */
const { json: jsonArb } = fc.letrec<{ json: unknown }>((tie) => ({
  json: fc.oneof(
    { depthSize: "small", withCrossShrink: true },
    fc.constant(null),
    fc.boolean(),
    fc.maxSafeInteger(),
    fc.bigInt(int64),
    fc.string({ unit: "binary", maxLength: 8 }),
    fc.array(tie("json"), { maxLength: 5 }),
    fc.dictionary(keyArb, tie("json"), { maxKeys: 6 }),
  ),
}));
const objectArb = fc.dictionary(keyArb, jsonArb, { minKeys: 1, maxKeys: 8 });

function failureReason(run: () => unknown): CanonicalEncodingFailure | "no-failure" {
  try {
    run();
  } catch (error) {
    if (error instanceof CanonicalEncodingError) return error.reason;
    throw error;
  }
  return "no-failure";
}

function defineKey(target: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}

/** A deep copy whose objects get their keys in a different insertion order (reversed, then rotated by `turn`). */
function reorder(value: unknown, turn: number): unknown {
  if (Array.isArray(value)) return value.map((v) => reorder(v, turn));
  if (value === null || typeof value !== "object") return value;
  const keys = Object.keys(value).reverse();
  const shift = keys.length === 0 ? 0 : turn % keys.length;
  const rotated = [...keys.slice(shift), ...keys.slice(0, shift)];
  const out: Record<string, unknown> = {};
  for (const key of rotated) defineKey(out, key, reorder((value as Record<string, unknown>)[key], turn));
  return out;
}

/** The key enumeration orders of every object in `value`, in a fixed traversal. */
function keyOrders(value: unknown): string[][] {
  if (Array.isArray(value)) return value.flatMap(keyOrders);
  if (value === null || typeof value !== "object") return [];
  const keys = Object.keys(value);
  return [keys, ...keys.flatMap((k) => keyOrders((value as Record<string, unknown>)[k]))];
}

/** Every map in a decoded item, depth first. */
function mapsOf(value: Decoded): DecodedMap[] {
  if (isDecodedMap(value)) return [value, ...value.map.flatMap((entry) => mapsOf(entry.value))];
  if (Array.isArray(value)) return (value as readonly Decoded[]).flatMap(mapsOf);
  return [];
}

describe("A53 — random jsonb objects: keys in RFC 8949 §4.2.1 order, encoding independent of insertion order", () => {
  it(`map keys ascend by encoded bytes, every head is shortest, the value round-trips (seed=${SEED})`, () => {
    fc.assert(
      fc.property(objectArb, (object) => {
        const bytes = encodeRow([object], ["jsonb"]);
        const checked = checkCanonical(bytes);
        expect(checked.violations).toEqual([]);
        expect(plainOfDecoded(checked.value as Decoded)).toEqual([plainOfInput(object)]);
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });

  it(`objects with the same entries in another insertion order encode to the same bytes (seed=${SEED})`, () => {
    let reordered = 0;
    fc.assert(
      fc.property(objectArb, fc.nat(), (object, turn) => {
        const other = reorder(object, turn);
        if (JSON.stringify(keyOrders(other)) !== JSON.stringify(keyOrders(object))) reordered += 1;
        expect(encodeRow([other], ["jsonb"])).toEqual(encodeRow([object], ["jsonb"]));
        expect(encodeCanonical(other as CanonicalValue)).toEqual(encodeCanonical(object as CanonicalValue));
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Negative control: the property is not vacuous — in most runs the copy really enumerates its keys differently.
    expect(reordered).toBeGreaterThan(RUNS / 2);
  });

  it(`negative control: the checker flags a map whose entries are put out of order (seed=${SEED})`, () => {
    let flagged = 0;
    fc.assert(
      fc.property(objectArb, (object) => {
        const top = checkCanonical(encodeCanonical(object as CanonicalValue)).value as DecodedMap;
        fc.pre(top.map.length >= 2);
        const reversed = concatBytes(top.headBytes, ...[...top.map].reverse().map((entry) => entry.entryBytes));
        expect(checkCanonical(reversed).violations.some((v) => v.startsWith("map keys not in ascending order"))).toBe(
          true,
        );
        flagged += 1;
      }),
      { seed: SEED, numRuns: RUNS },
    );
    expect(flagged).toBeGreaterThan(0);
  });

  it(`negative control: JavaScript's default key sort is not the canonical order (seed=${SEED})`, () => {
    // If insertion order or Array#sort happened to give the canonical order for the generated keys, the order property
    // above could pass without the encoder sorting by encoded bytes. Count objects where it does not.
    let differs = 0;
    fc.assert(
      fc.property(objectArb, (object) => {
        const maps = mapsOf(checkCanonical(encodeCanonical(object as CanonicalValue)).value as Decoded);
        for (const { map } of maps) {
          const canonical = map.map((entry) => entry.key as string);
          if (JSON.stringify([...canonical].sort()) !== JSON.stringify(canonical)) differs += 1;
        }
      }),
      { seed: SEED, numRuns: RUNS },
    );
    expect(differs).toBeGreaterThan(0);
  });

  it("negative control: the checker flags non-shortest heads, indefinite lengths, tags, floats, trailing bytes", () => {
    const cases: readonly (readonly [string, string])[] = [
      ["1817", "non-shortest argument"], // 23 with a one-byte argument
      ["1900ff", "non-shortest argument"], // 255 with a two-byte argument
      ["1a0000ffff", "non-shortest argument"],
      ["1b00000000ffffffff", "non-shortest argument"],
      ["7801" + "61", "non-shortest argument"],
      ["9fff", "indefinite length"],
      ["a2616201616102", "map keys not in ascending order"], // {"b": 1, "a": 2}
      ["a2616101616102", "duplicate map key"],
      ["a2626161016162 02", "map keys not in ascending order"], // {"aa": 1, "b": 2}: shorter key must come first
      ["c249010000000000000000", "tag outside the subset"],
      ["f93e00", "simple value or float outside the subset"],
      ["f7", "simple value or float outside the subset"],
      ["0000", "trailing bytes"],
      ["62c3", "length beyond the input"],
      ["61ff", "invalid UTF-8"],
    ];
    for (const [hex, violation] of cases) {
      const { violations } = checkCanonical(fromHex(hex));
      expect(violations.some((v) => v.startsWith(violation)), `${hex}: ${violations.join("; ")}`).toBe(true);
    }
    expect(checkCanonical(fromHex("a26161016162820203")).violations).toEqual([]);
  });
});

describe("A53 — integers of the whole CBOR 64-bit range encode with the shortest head", () => {
  it(`random integers round-trip with no violation (seed=${SEED})`, () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.bigInt({ min: -(2n ** 64n), max: 2n ** 64n - 1n }),
          fc.bigInt({ min: -(2n ** 33n), max: 2n ** 33n }),
          fc.integer({ min: -70_000, max: 70_000 }),
          fc.maxSafeInteger(),
        ),
        (value) => {
          const checked = checkCanonical(encodeCanonical(value));
          expect(checked.violations).toEqual([]);
          expect(checked.value).toBe(BigInt(value));
        },
      ),
      { seed: SEED, numRuns: RUNS * 3 },
    );
  });
});

describe("A53 — numeric values with a fraction fail; integral ones give their canonical text", () => {
  it(`integral decimal text gives BigInt's decimal text (seed=${SEED})`, () => {
    fc.assert(
      fc.property(fc.bigInt({ min: -(10n ** 40n), max: 10n ** 40n }), fc.nat({ max: 3 }), (value, zeros) => {
        const negative = value < 0n;
        const digits = "0".repeat(zeros) + (negative ? -value : value).toString();
        const text = (negative ? "-" : "") + digits;
        const checked = checkCanonical(encodeRow([text], ["numeric"]));
        expect(checked.violations).toEqual([]);
        expect(checked.value).toEqual([value.toString()]);
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });

  it(`decimal text with a fraction fails with numeric-fraction (seed=${SEED})`, () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: -(10n ** 40n), max: 10n ** 40n }),
        fc.stringMatching(/^[0-9]{1,12}$/),
        (whole, fraction) => {
          const text = `${whole}.${fraction}`;
          expect(failureReason(() => encodeRow([text], ["numeric"]))).toBe("numeric-fraction");
          expect(failureReason(() => encodeRow([[text]], ["numeric[]"]))).toBe("numeric-fraction");
        },
      ),
      { seed: SEED, numRuns: RUNS },
    );
  });
});

describe("A53 — non-integer or out-of-range JSON numbers fail to encode", () => {
  /** Puts `bad` at a random place inside a random JSON object. */
  const withBadNumber = (bad: fc.Arbitrary<unknown>) =>
    fc.tuple(objectArb, bad, fc.nat(), fc.boolean()).map(([object, value, pick, inArray]) => {
      const keys = Object.keys(object);
      const key = keys[pick % keys.length] as string;
      const copy = reorder(object, 0) as Record<string, unknown>;
      defineKey(copy, key, inArray ? [1, value, 2] : value);
      return copy;
    });

  it(`a non-integer number anywhere in a jsonb value fails with not-integer (seed=${SEED})`, () => {
    fc.assert(
      fc.property(withBadNumber(fc.double({ noInteger: true })), (object) => {
        expect(failureReason(() => encodeRow([object], ["jsonb"]))).toBe("not-integer");
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });

  it(`an integer outside the signed 64-bit range fails with integer-out-of-range (seed=${SEED})`, () => {
    const outside = fc.oneof(
      fc.bigInt({ min: 2n ** 63n, max: 2n ** 80n }),
      fc.bigInt({ min: -(2n ** 80n), max: -(2n ** 63n) - 1n }),
    );
    fc.assert(
      fc.property(withBadNumber(outside), (object) => {
        expect(failureReason(() => encodeRow([object], ["jsonb"]))).toBe("integer-out-of-range");
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });

  it(`an integral number beyond ±(2^53 - 1) fails with unsafe-integer: it must arrive as bigint (seed=${SEED})`, () => {
    const unsafe = fc.oneof(
      fc.double({ min: 2 ** 53, max: 2 ** 70, noNaN: true }),
      fc.double({ min: -(2 ** 70), max: -(2 ** 53), noNaN: true }),
    ).filter((x) => Number.isInteger(x));
    fc.assert(
      fc.property(withBadNumber(unsafe), (object) => {
        expect(failureReason(() => encodeRow([object], ["jsonb"]))).toBe("unsafe-integer");
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });

  it(`the same objects without the bad number encode (control for the three properties above) (seed=${SEED})`, () => {
    fc.assert(
      fc.property(objectArb, (object) => {
        expect(failureReason(() => encodeRow([object], ["jsonb"]))).toBe("no-failure");
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });
});
