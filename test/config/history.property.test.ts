import { createHash } from "node:crypto";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { dataHash } from "../../src/config/history.js";
import { type PlainData, type PlainObject, samePlainData } from "../../src/config/plain-data.js";

/**
 * A32 `[PROP]` (CF-7; task 4.3): for random data-field objects — plain data as a configuration's data fields are (CF-1:
 * objects, arrays, strings, booleans, `null`, integers from 0 to 2^53 − 1, nested) — `data_hash`, SHA-256 of the
 * canonical encoding (DT-1), is independent of property order at every depth and changes when any value changes, at any
 * depth. fast-check, seed recorded.
 *
 * The committed negative controls: a hash over the properties in their written order (`JSON.stringify`, unsorted)
 * fails the first property, and a hash of the keys alone fails the second — so each property can tell a hash that
 * breaks it.
 */

/** fast-check's seed and run count for every property here. */
const SEED = 20261025;
const RUNS = 300;

/** Keys: identifiers, other ASCII, and any Unicode without lone surrogates (task 4.2 refuses those). */
const key = fc.oneof(fc.string({ maxLength: 6 }), fc.string({ unit: "grapheme", maxLength: 4 }), fc.constantFrom("", "a", "b", "ab", "é", "😀"));

/** A plain-data value of a data field, nested up to a few levels. */
const { value: plainValue } = fc.letrec<{ value: PlainData; object: PlainObject }>((tie) => ({
  value: fc.oneof(
    { depthSize: "small" },
    fc.constant(null),
    fc.boolean(),
    fc.oneof(fc.integer({ min: 0, max: 1000 }), fc.maxSafeNat()),
    fc.string({ unit: "grapheme", maxLength: 8 }),
    fc.array(tie("value"), { maxLength: 4 }),
    tie("object"),
  ),
  object: fc.dictionary(key, tie("value"), { maxKeys: 5 }).map((record) => ({ ...record }) as PlainObject),
}));

/** A data-field object: the top level of a revision's data. */
const dataFields = fc.dictionary(key, plainValue, { minKeys: 1, maxKeys: 6 }).map((record) => ({ ...record }) as PlainObject);

/** `value` with the properties of every object in an order given by `order` (a permutation seed per object). */
function reordered(value: PlainData, order: () => number): PlainData {
  if (Array.isArray(value)) return value.map((element) => reordered(element, order));
  if (value === null || typeof value !== "object") return value;
  const entries = Object.entries(value).map(([k, v]) => [k, reordered(v, order)] as const);
  // A rotation and a reversal chosen by `order`: every order of two keys is reached, and most of longer lists.
  const turn = entries.length === 0 ? 0 : order() % entries.length;
  const rotated = [...entries.slice(turn), ...entries.slice(0, turn)];
  return Object.fromEntries(order() % 2 === 0 ? rotated : rotated.reverse());
}

/** The places of `value` that hold a value, as key paths from the top. */
function places(value: PlainData, path: readonly (string | number)[] = []): (readonly (string | number)[])[] {
  const here = path.length === 0 ? [] : [path];
  if (Array.isArray(value)) return [...here, ...value.flatMap((element, i) => places(element, [...path, i]))];
  if (value !== null && typeof value === "object") {
    return [...here, ...Object.entries(value).flatMap(([k, v]) => places(v, [...path, k]))];
  }
  return here;
}

/** `value` with `replacement` at `path`. */
function replaced(value: PlainData, path: readonly (string | number)[], replacement: PlainData): PlainData {
  if (path.length === 0) return replacement;
  const [head, ...rest] = path as [string | number, ...(string | number)[]];
  if (Array.isArray(value)) return value.map((element, i) => (i === head ? replaced(element, rest, replacement) : element));
  const object = value as PlainObject;
  return Object.fromEntries(
    Object.entries(object).map(([k, v]) => [k, k === head ? replaced(v, rest, replacement) : v]),
  );
}

type Hash = (data: PlainObject) => Uint8Array;

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");

/** Property 1: the hash of `data` equals the hash of `data` with its properties in another order, at every depth. */
const orderIndependent = (hash: Hash) =>
  fc.property(dataFields, fc.array(fc.nat(), { minLength: 1, maxLength: 64 }), (data, seeds) => {
    let next = 0;
    const order = () => seeds[next++ % seeds.length] as number;
    return hex(hash(reordered(data, order) as PlainObject)) === hex(hash(data));
  });

/** Property 2: replacing any value of `data`, at any depth, with a different one changes the hash. */
const changesWithValues = (hash: Hash) =>
  fc.property(dataFields, fc.nat(), plainValue, (data, pick, replacement) => {
    const all = places(data);
    const path = all[pick % all.length] as readonly (string | number)[];
    const changed = replaced(data, path, replacement) as PlainObject;
    fc.pre(!samePlainData(changed, data));
    return hex(hash(changed)) !== hex(hash(data));
  });

/** A control: SHA-256 of the properties in their written order. */
const unsorted: Hash = (data) => new Uint8Array(createHash("sha256").update(JSON.stringify(data)).digest());

/** A control: SHA-256 of the keys alone, sorted, at every depth. */
const keysOnly: Hash = (data) => {
  const keys = (value: PlainData): unknown =>
    Array.isArray(value)
      ? value.map(keys)
      : value !== null && typeof value === "object"
        ? Object.keys(value).sort().map((k) => [k, keys((value as PlainObject)[k] as PlainData)])
        : null;
  return new Uint8Array(createHash("sha256").update(JSON.stringify(keys(data))).digest());
};

describe("A32: data_hash over random data-field objects (CF-7)", () => {
  it(`is independent of property order at every depth (property, seed ${SEED})`, () => {
    fc.assert(orderIndependent(dataHash), { seed: SEED, numRuns: RUNS });
  });

  it(`changes when any value changes, at any depth (property, seed ${SEED})`, () => {
    fc.assert(changesWithValues(dataHash), { seed: SEED, numRuns: RUNS });
  });

  it("is 32 bytes for every object, and equal for equal data built separately", () => {
    fc.assert(
      fc.property(dataFields, (data) => {
        const copy = JSON.parse(JSON.stringify(data)) as PlainObject;
        return dataHash(data).length === 32 && hex(dataHash(copy)) === hex(dataHash(data));
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });
});

describe("A32's negative controls (committed): each property tells a hash that breaks it", () => {
  it("a hash over the properties in their written order fails the order property", () => {
    const result = fc.check(orderIndependent(unsorted), { seed: SEED, numRuns: RUNS });
    expect(result.failed).toBe(true);
    // ... and holds the other one: the control breaks exactly the property it is for.
    expect(fc.check(changesWithValues(unsorted), { seed: SEED, numRuns: RUNS }).failed).toBe(false);
  });

  it("a hash of the keys alone fails the change property", () => {
    expect(fc.check(changesWithValues(keysOnly), { seed: SEED, numRuns: RUNS }).failed).toBe(true);
    expect(fc.check(orderIndependent(keysOnly), { seed: SEED, numRuns: RUNS }).failed).toBe(false);
  });
});
