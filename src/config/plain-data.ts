/**
 * The plain-data check. The configuration file is evaluated, and its default export must then be plain data: objects,
 * arrays, strings, booleans, `null` and integers from 0 to 2^53 − 1. Otherwise startup stops with `not-plain-data`,
 * naming the path of the first value that is not (`entries[1].config.onError`). Only that data is validated, compared
 * with the history, recorded and shown, so the check returns a deeply frozen copy of it: nothing the file's code does
 * afterwards reaches what startup uses. [CF-1; CORE-ARCH §4.12; design §7]
 *
 * **Why these values.** The data is recorded as canonical JSON and hashed by its canonical encoding, so it must be
 * exactly what JSON holds [CF-7]:
 * - a function, a class instance (a `Date`, a `Uint8Array`, a `Map`, a boxed string, an object of the file's own
 *   class) or a symbol is not data;
 * - `undefined` has no JSON form (an unset environment variable reads as `undefined`);
 * - a bigint has none either, so heights are numbers in the file and become bigints only once read [CF-1];
 * - numbers are the integers from 0 to 2^53 − 1. Every height, count, duration and size of the configuration is one.
 *   An integer above 2^53 − 1 is not exact in JavaScript (2^53 + 1 reads as 2^53), so it could not be recorded as
 *   written. A fraction (1.5, `NaN`, `Infinity`) or a negative integer (−1) is rejected. −0 is the integer 0 and is
 *   copied as 0, as JSON and the canonical encoding read it.
 *
 * **What "objects" and "arrays" are.** An array is plain when its prototype is `Array.prototype`; any other object is
 * plain when its prototype is `Object.prototype` or `null`. Only what JSON keeps of them is data. So the check also
 * rejects, each by a rule of its own:
 * - an empty array slot;
 * - a property of an array besides its elements;
 * - a property keyed by a symbol;
 * - a non-enumerable property;
 * - a getter or setter, whose value a function computes at each read (the check never calls one);
 * - an object that contains itself.
 *
 * An object reached twice by different paths is data, copied at each place. A key named `__proto__` is kept as data,
 * without changing the copy's prototype.
 *
 * The rules are {@link PLAIN_DATA_RULES}, checked in order at each place, depth first in property order; the error
 * names the first place a rule rejects. The browser build, whose configuration is bundled into the page, calls
 * {@link plainData} on it directly; the Node.js loader (`./load.ts`) calls it on the file's default export.
 */

import { UmbraError } from "../db/errors.js";

/** Plain data: what a configuration evaluates to. [CF-1] */
export type PlainData = null | boolean | number | string | PlainArray | PlainObject;

/** An array of plain data. */
export type PlainArray = readonly PlainData[];

/** An object of plain data. */
export type PlainObject = { readonly [key: string]: PlainData };

/** One place of the configuration, as a rule sees it. */
export interface PlainDataNode {
  /** The value held there; `undefined` for an empty array slot and for a getter or setter, which is never called. */
  readonly value: unknown;
  /** Its key in its container: a property's, or an element's index; `null` for the default export itself. */
  readonly key: string | symbol | number | null;
  /** An empty slot of an array. */
  readonly hole: boolean;
  /** A property of an array that is not one of its elements. */
  readonly arrayProperty: boolean;
  readonly enumerable: boolean;
  /** A getter or setter, not a value. */
  readonly accessor: boolean;
  /** The objects that contain this place, from the default export down. */
  readonly ancestors: ReadonlySet<object>;
}

/** One way a value is not plain data. */
export interface PlainDataRule {
  readonly name: string;
  /** How to write the value as data, for the message. */
  readonly fix: string;
  /** What `node`'s value is, for the message and `details.found`, when this rule refuses it; otherwise undefined. */
  check(node: PlainDataNode): string | undefined;
}

/**
 * True for an object plain data allows: an array whose prototype is `Array.prototype`, or another object whose
 * prototype is `Object.prototype` or `null`.
 */
function isPlain(value: object): boolean {
  const prototype = Object.getPrototypeOf(value) as object | null;
  return Array.isArray(value) ? prototype === Array.prototype : prototype === Object.prototype || prototype === null;
}

/** What an object that is not plain is, for the message: an instance of its class, by the class's name. */
function instanceOf(value: object): string {
  const prototype = Object.getPrototypeOf(value) as object | null;
  const constructor: unknown =
    prototype === null ? undefined : Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
  const name: unknown =
    typeof constructor === "function" ? Object.getOwnPropertyDescriptor(constructor, "name")?.value : undefined;
  return typeof name === "string" && name !== ""
    ? `an instance of ${name}`
    : "an object whose prototype is neither Object.prototype nor Array.prototype";
}

const integer = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value);

/** The definition of plain data, as rules, in the order they are checked at each place. [CF-1] */
export const PLAIN_DATA_RULES: readonly PlainDataRule[] = Object.freeze([
  {
    name: "hole",
    fix: "fill the empty slot, or remove it",
    check: (node) => (node.hole ? "an empty array slot" : undefined),
  },
  {
    name: "array-property",
    fix: "only an array's elements are data; move the property into an object",
    check: (node) => (node.arrayProperty ? "a property of an array besides its elements" : undefined),
  },
  {
    name: "symbol-key",
    fix: "only properties keyed by strings are data",
    check: (node) => (typeof node.key === "symbol" ? "a property keyed by a symbol" : undefined),
  },
  {
    name: "not-enumerable",
    fix: "define it as an ordinary property",
    check: (node) => (node.enumerable ? undefined : "a non-enumerable property"),
  },
  {
    name: "accessor",
    fix: "write the value itself: a getter is a function, run each time it is read",
    check: (node) => (node.accessor ? "a getter or setter" : undefined),
  },
  {
    name: "undefined",
    fix: "leave the property out instead (an unset environment variable reads as undefined)",
    check: (node) => (node.value === undefined ? "undefined" : undefined),
  },
  {
    name: "function",
    fix: "a configuration is the data its file evaluates to: compute the value in the file and write the result",
    check: (node) => (typeof node.value === "function" ? "a function" : undefined),
  },
  {
    name: "bigint",
    fix: "write heights and counts as numbers: integers up to 2^53 - 1 are exact",
    check: (node) => (typeof node.value === "bigint" ? `the bigint ${node.value}n` : undefined),
  },
  {
    name: "symbol",
    fix: "a symbol is not data; write a string",
    check: (node) => (typeof node.value === "symbol" ? "a symbol" : undefined),
  },
  {
    name: "not-integer",
    fix: "a configuration's numbers are integers",
    check: (node) =>
      typeof node.value === "number" && !Number.isInteger(node.value)
        ? `${node.value}, which is not an integer`
        : undefined,
  },
  {
    name: "below-zero",
    fix: "a configuration's numbers are integers from 0",
    check: (node) => (integer(node.value) && node.value < 0 ? `${node.value}, which is below 0` : undefined),
  },
  {
    name: "above-max",
    fix:
      "a number above 2^53 - 1 is not exact in JavaScript (2^53 + 1 reads as 2^53), so it cannot be recorded as " +
      "written; a setting that needs one takes it as a string",
    check: (node) =>
      integer(node.value) && node.value > Number.MAX_SAFE_INTEGER
        ? `${node.value}, which is above 2^53 - 1`
        : undefined,
  },
  {
    name: "class-instance",
    fix:
      "write it as an object, an array or a string instead (byte values as 0x-prefixed lowercase hex strings)",
    check: (node) => {
      const { value } = node;
      return typeof value !== "object" || value === null || isPlain(value) ? undefined : instanceOf(value);
    },
  },
  {
    name: "cycle",
    fix: "an object cannot contain itself; write the data out",
    check: (node) =>
      typeof node.value === "object" && node.value !== null && node.ancestors.has(node.value)
        ? "an object that contains it (a cycle)"
        : undefined,
  },
]);

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * The path of `key` in the container at `path`: `entries[1].config.onError`, `config["feed-url"]`, `x[Symbol(t)]`. The
 * schema validation (`./validate.ts`) names its findings in the same format.
 */
export function pathOf(path: string, key: string | symbol | number): string {
  if (typeof key === "number") return `${path}[${key}]`;
  if (typeof key === "symbol") return `${path}[${String(key)}]`;
  if (IDENTIFIER.test(key)) return path === "" ? key : `${path}.${key}`;
  return `${path}[${JSON.stringify(key)}]`;
}

/** The place `key` of `container` holds, from its own property descriptor (never through a getter). */
function nodeAt(
  container: object,
  key: string | symbol | number,
  ancestors: ReadonlySet<object>,
  arrayProperty: boolean,
): PlainDataNode {
  const descriptor = Object.getOwnPropertyDescriptor(container, key);
  if (descriptor === undefined) {
    return { value: undefined, key, hole: true, arrayProperty, enumerable: true, accessor: false, ancestors };
  }
  const accessor = !("value" in descriptor);
  return {
    value: accessor ? undefined : descriptor.value,
    key,
    hole: false,
    arrayProperty,
    enumerable: descriptor.enumerable === true,
    accessor,
    ancestors,
  };
}

/** The walk's state: the rules, the file, and the objects that contain the place being checked. */
interface Walk {
  readonly rules: readonly PlainDataRule[];
  readonly file: string | undefined;
  readonly open: Set<object>;
}

/** Checks `node` at `path` and returns its frozen copy; throws the first refusal. */
function walk(node: PlainDataNode, path: string, state: Walk): unknown {
  for (const rule of state.rules) {
    const found = rule.check(node);
    if (found !== undefined) throw refusal(rule, path, found, state.file);
  }
  const { value } = node;
  if (typeof value !== "object" || value === null) return value === 0 ? 0 : value;
  state.open.add(value);
  const copy = Array.isArray(value) ? copyArray(value, path, state) : copyObject(value, path, state);
  state.open.delete(value);
  return Object.freeze(copy);
}

/** An array's elements, each checked and copied; its other properties checked, and not copied. */
function copyArray(value: readonly unknown[], path: string, state: Walk): unknown[] {
  const copy: unknown[] = [];
  for (let index = 0; index < value.length; index++) {
    copy.push(walk(nodeAt(value, index, state.open, false), pathOf(path, index), state));
  }
  for (const key of Reflect.ownKeys(value)) {
    if (key === "length" || (typeof key === "string" && isElementKey(key, value.length))) continue;
    walk(nodeAt(value, key, state.open, true), pathOf(path, key), state);
  }
  return copy;
}

/** An object's properties, each checked; those keyed by strings copied, as data properties. */
function copyObject(value: object, path: string, state: Walk): Record<string, unknown> {
  const copy: Record<string, unknown> = {};
  for (const key of Reflect.ownKeys(value)) {
    const copied = walk(nodeAt(value, key, state.open, false), pathOf(path, key), state);
    if (typeof key === "string") {
      Object.defineProperty(copy, key, { value: copied, enumerable: true, writable: true, configurable: true });
    }
  }
  return copy;
}

/** True when `key` names an element of an array of `length` elements: `"0"` to `String(length - 1)`. */
function isElementKey(key: string, length: number): boolean {
  const index = Number(key);
  return Number.isInteger(index) && index >= 0 && index < length && String(index) === key;
}

/** The refusal of the value at `path`, which is `found`. */
function refusal(rule: PlainDataRule, path: string, found: string, file: string | undefined): UmbraError {
  const where = path === "" ? "default export" : `value at ${path}`;
  const prefix = file === undefined ? "" : `${file}: `;
  return new UmbraError(
    "not-plain-data",
    `${prefix}the configuration's ${where} is ${found}, which is not plain data: a configuration holds objects, ` +
      `arrays, strings, booleans, null and integers from 0 to 2^53 - 1; ${rule.fix}`,
    file === undefined ? { path, found } : { file, path, found },
  );
}

/**
 * Checks `value` with `rules`. Returns a deeply frozen copy of it, or throws `not-plain-data` (not retryable) naming
 * the path of the first value a rule rejects, what it is (`details.found`) and, when given, the `file`. [CF-1]
 */
export function plainDataWith(value: unknown, rules: readonly PlainDataRule[], file?: string): PlainData {
  const open = new Set<object>();
  const root: PlainDataNode = {
    value,
    key: null,
    hole: false,
    arrayProperty: false,
    enumerable: true,
    accessor: false,
    ancestors: open,
  };
  return walk(root, "", { rules, file, open }) as PlainData;
}

/** Checks that `value` is plain data with {@link PLAIN_DATA_RULES}: see the module comment. [CF-1] */
export function plainData(value: unknown, file?: string): PlainData {
  return plainDataWith(value, PLAIN_DATA_RULES, file);
}

/**
 * True when `a` and `b` are the same plain data, whatever the order of their objects' keys: equal field for field. It
 * compares a core version with the build's, and a `versionEntry`'s `config` with its recorded row. [CF-3]
 */
export function samePlainData(a: PlainData, b: PlainData): boolean {
  if (a === b) return true;
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every((value, i) => samePlainData(value, b[i] as PlainData));
  }
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null || Array.isArray(b)) return false;
  const one = a as PlainObject;
  const other = b as PlainObject;
  const keys = Object.keys(one);
  return (
    keys.length === Object.keys(other).length &&
    keys.every((key) => Object.hasOwn(other, key) && samePlainData(one[key] as PlainData, other[key] as PlainData))
  );
}
