/**
 * The database API's result mapping and parameter texts (DB-2, `openspec/changes/core-arch/design.md` §4), a rule of
 * the `deterministic_postgresql` component, the same on every backend: each backend hands over PostgreSQL's text output
 * of a value with the column's type OID, and this module maps it. No driver parser is involved — `postgres` 3.4.9's
 * array parser reads an unquoted `NULL` element as the text "NULL" (docs/issues/00006), and the two backends' drivers
 * differ in other details. Task 2.2b replaces the date and time mapping here (RFC 3339 text, owner decision Q68).
 *
 * Results, by type (the types `design.md` §4's column-type table names, with `oid`, `name` and `"char"` for catalog
 * queries); every type the table below does not name, and an array of one, is returned as its text:
 *
 * | Type | Value |
 * |---|---|
 * | `bigint` | `bigint` |
 * | `smallint`, `integer`, `oid`, `real`, `double precision` | `number` (`NaN` and the infinities as numbers) |
 * | `numeric` | its decimal text (`NaN` and the infinities as their text) |
 * | `bytea` | `Uint8Array` |
 * | `boolean` | `boolean` |
 * | `json`, `jsonb` | the JSON value; an integer outside ±(2^53 − 1) as a `bigint`, never a rounded `number` |
 * | `date`, `timestamp`, `timestamptz` | a JavaScript `Date`, as both drivers give it (milliseconds only) |
 * | `text`, `varchar`, `char(n)` (padded), `name`, `"char"`, `uuid` (lowercase) | its text |
 * | `time`, `timetz`, `interval`, `money` | its text |
 * | an array of any of these | a JavaScript array (nested per dimension) of the elements so mapped, `NULL` → `null` |
 *
 * The texts are PostgreSQL's output under the session settings every backend pins (`PINNED_SETTINGS`,
 * `./settings.ts`): `bytea` in hex, dates in ISO style, intervals in `postgres` style, time zone UTC, floats in their
 * shortest exact form. Output the mapping cannot read (`bytea` in escape form after a session changed `bytea_output`,
 * say) is refused, never guessed.
 *
 * Parameters are sent as text with no type, so PostgreSQL types each from the statement as it types an untyped
 * literal (write `$1::bigint` where the statement does not say); {@link parameterText} gives each JavaScript value's
 * text.
 */

import { UmbraError } from "./errors.js";

/** A result row: column name → mapped value. When two columns share a name, the later one's value is kept. */
export type Row = Record<string, unknown>;

/** A result column as the backend describes it: its name and its type's OID. */
export interface ResultColumn {
  readonly name: string;
  readonly type: number;
}

/** A type the mapping names: its name as `format_type(oid, NULL)` gives it, its OID and its array type's OID. */
export interface ResultType {
  readonly name: string;
  readonly oid: number;
  readonly arrayOid: number;
  /** Maps the type's text output (never `NULL`). */
  readonly parse: (text: string) => unknown;
}

const asText = (text: string): string => text;

function malformed(type: string, text: string): UmbraError {
  const shown = text.length > 40 ? `${text.slice(0, 40)}…` : text;
  return new UmbraError("database-error", `cannot read ${JSON.stringify(shown)} as ${type} output`, {
    reason: "unreadable-result",
    type,
  });
}

function parseInteger(type: string): (text: string) => number {
  return (text) => {
    if (!/^-?[0-9]+$/.test(text)) throw malformed(type, text);
    return Number(text);
  };
}

function parseBigint(text: string): bigint {
  if (!/^-?[0-9]+$/.test(text)) throw malformed("bigint", text);
  return BigInt(text);
}

function parseFloatOf(type: string): (text: string) => number {
  return (text) => {
    const value = Number(text);
    if (Number.isNaN(value) && text !== "NaN") throw malformed(type, text);
    return value;
  };
}

function parseBoolean(text: string): boolean {
  if (text === "t") return true;
  if (text === "f") return false;
  throw malformed("boolean", text);
}

function parseBytea(text: string): Uint8Array {
  if (!/^\\x(?:[0-9a-f]{2})*$/.test(text)) throw malformed("bytea", text);
  return new Uint8Array(Buffer.from(text.slice(2), "hex"));
}

const parseDate = (text: string): Date => new Date(text);

/**
 * JSON parsed without loss (DB-2), by a reader of RFC 8259's grammar written here, not `JSON.parse`:
 * - an integer written as digits outside ±(2^53 − 1) becomes a `bigint`; every other number is what `JSON.parse`
 *   makes of it (the `Number` of its text: `-0`, fractions, exponents, `1e400` as `Infinity`);
 * - strings, objects and arrays as `JSON.parse` builds them: every escape, each `\uXXXX` one UTF-16 code unit; a key
 *   given twice keeps its first place and its last value; `__proto__` is an own property; nesting is limited by memory
 *   only (no recursion);
 * - text that is not JSON is refused (`database-error`, `reason: unreadable-result`), never guessed.
 *
 * Not `JSON.parse`, because Node.js 24.9.0's (V8 13.6.233.10) can read an object key that is one escape sequence
 * (`"\t"`, `"\n"`, `"\u00e9"`, …) as a backslash once an earlier `JSON.parse` in the process has read the key `"\\"`
 * — whether it does depends on the strings the process already holds — so two different documents would read back
 * equal, and so would their contents hashes (found by task 2.2's differential round trip; the decision record's Q78).
 * It is a V8 bug in every Node.js 24 and 26 release: https://github.com/nodejs/node/issues/63785, fixed in V8 by
 * commit 93cd21e (https://github.com/v8/v8/commit/93cd21e8254b65c15ff131b2dcadf19beadb559d); the Node.js backport is
 * https://github.com/nodejs/node/pull/66542. Once every Node.js version UmbraDB supports carries the fix, this reader
 * may be replaced by `JSON.parse` with a source-text reviver (`docs/issues/00007`).
 */
export function parseJsonLossless(text: string): unknown {
  let at = 0;
  const unreadable = (): UmbraError => malformed("json", text);
  const skipSpace = (): void => {
    for (let code = text.charCodeAt(at); code === 0x20 || code === 0x0a || code === 0x0d || code === 0x09; ) {
      code = text.charCodeAt(++at);
    }
  };
  // At the opening quote; returns the string and leaves `at` after the closing quote.
  const readString = (): string => {
    at++;
    let value = "";
    for (;;) {
      JSON_PLAIN_RUN.lastIndex = at;
      JSON_PLAIN_RUN.test(text);
      value += text.slice(at, JSON_PLAIN_RUN.lastIndex);
      at = JSON_PLAIN_RUN.lastIndex;
      const char = text[at];
      if (char === '"') {
        at++;
        return value;
      }
      // Anything else that stops a run is a control character, the end of the text, or a backslash.
      if (char !== "\\") throw unreadable();
      const escaped = text[at + 1];
      if (escaped === "u") {
        JSON_HEX4.lastIndex = at + 2;
        if (!JSON_HEX4.test(text)) throw unreadable();
        value += String.fromCharCode(Number.parseInt(text.slice(at + 2, at + 6), 16));
        at += 6;
      } else {
        const decoded = escaped === undefined ? undefined : JSON_ESCAPES.get(escaped);
        if (decoded === undefined) throw unreadable();
        value += decoded;
        at += 2;
      }
    }
  };
  // An object's key and its colon.
  const readKey = (): string => {
    skipSpace();
    if (text[at] !== '"') throw unreadable();
    const key = readString();
    skipSpace();
    if (text[at] !== ":") throw unreadable();
    at++;
    return key;
  };
  const readScalar = (): unknown => {
    if (text[at] === '"') return readString();
    for (const [word, value] of JSON_WORDS) {
      if (text.startsWith(word, at)) {
        at += word.length;
        return value;
      }
    }
    JSON_NUMBER.lastIndex = at;
    const token = JSON_NUMBER.exec(text)?.[0];
    if (token === undefined) throw unreadable();
    at += token.length;
    const value = Number(token);
    return Number.isSafeInteger(value) || !/^-?[0-9]+$/.test(token) ? value : BigInt(token);
  };

  // The arrays and objects not yet closed, innermost last.
  const open: ({ readonly array: unknown[] } | { readonly object: Record<string, unknown>; key: string })[] = [];
  for (;;) {
    skipSpace();
    let value: unknown;
    const first = text[at];
    if (first === "[") {
      at++;
      skipSpace();
      if (text[at] !== "]") {
        open.push({ array: [] });
        continue;
      }
      at++;
      value = [];
    } else if (first === "{") {
      at++;
      skipSpace();
      if (text[at] !== "}") {
        open.push({ object: {}, key: readKey() });
        continue;
      }
      at++;
      value = {};
    } else {
      value = readScalar();
    }
    // Hands the value to the innermost open container, closing every container that ends after it.
    for (;;) {
      skipSpace();
      const container = open[open.length - 1];
      if (container === undefined) {
        if (at !== text.length) throw unreadable();
        return value;
      }
      if ("array" in container) {
        container.array.push(value);
      } else if (container.key === "__proto__") {
        // An own property, as JSON.parse makes it, not the object's prototype.
        const property = { value, writable: true, enumerable: true, configurable: true };
        Object.defineProperty(container.object, "__proto__", property);
      } else {
        container.object[container.key] = value;
      }
      const separator = text[at++];
      if (separator === ",") {
        if ("object" in container) container.key = readKey();
        break;
      }
      if (separator !== ("array" in container ? "]" : "}")) throw unreadable();
      open.pop();
      value = "array" in container ? container.array : container.object;
    }
  }
}

/** Characters a JSON string holds as themselves: anything but `"`, `\` and the control characters. */
const JSON_PLAIN_RUN = /[^"\\\u0000-\u001f]*/y;
const JSON_HEX4 = /[0-9a-fA-F]{4}/y;
const JSON_NUMBER = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
const JSON_ESCAPES: ReadonlyMap<string, string> = new Map([
  ['"', '"'],
  ["\\", "\\"],
  ["/", "/"],
  ["b", "\b"],
  ["f", "\f"],
  ["n", "\n"],
  ["r", "\r"],
  ["t", "\t"],
]);
const JSON_WORDS: readonly (readonly [string, boolean | null])[] = [
  ["true", true],
  ["false", false],
  ["null", null],
];

/** The types the mapping names, with their fixed OIDs (PostgreSQL's built-in `pg_type` entries). */
export const RESULT_TYPES: readonly ResultType[] = [
  { name: "boolean", oid: 16, arrayOid: 1000, parse: parseBoolean },
  { name: "bytea", oid: 17, arrayOid: 1001, parse: parseBytea },
  { name: '"char"', oid: 18, arrayOid: 1002, parse: asText },
  { name: "name", oid: 19, arrayOid: 1003, parse: asText },
  { name: "bigint", oid: 20, arrayOid: 1016, parse: parseBigint },
  { name: "smallint", oid: 21, arrayOid: 1005, parse: parseInteger("smallint") },
  { name: "integer", oid: 23, arrayOid: 1007, parse: parseInteger("integer") },
  { name: "text", oid: 25, arrayOid: 1009, parse: asText },
  { name: "oid", oid: 26, arrayOid: 1028, parse: parseInteger("oid") },
  { name: "json", oid: 114, arrayOid: 199, parse: parseJsonLossless },
  { name: "real", oid: 700, arrayOid: 1021, parse: parseFloatOf("real") },
  { name: "double precision", oid: 701, arrayOid: 1022, parse: parseFloatOf("double precision") },
  { name: "money", oid: 790, arrayOid: 791, parse: asText },
  { name: "character", oid: 1042, arrayOid: 1014, parse: asText },
  { name: "character varying", oid: 1043, arrayOid: 1015, parse: asText },
  { name: "date", oid: 1082, arrayOid: 1182, parse: parseDate },
  { name: "time without time zone", oid: 1083, arrayOid: 1183, parse: asText },
  { name: "timestamp without time zone", oid: 1114, arrayOid: 1115, parse: parseDate },
  { name: "timestamp with time zone", oid: 1184, arrayOid: 1185, parse: parseDate },
  { name: "interval", oid: 1186, arrayOid: 1187, parse: asText },
  { name: "time with time zone", oid: 1266, arrayOid: 1270, parse: asText },
  { name: "numeric", oid: 1700, arrayOid: 1231, parse: asText },
  { name: "uuid", oid: 2950, arrayOid: 2951, parse: asText },
  { name: "jsonb", oid: 3802, arrayOid: 3807, parse: parseJsonLossless },
];

const SCALAR_PARSERS = new Map(RESULT_TYPES.map((type) => [type.oid, type.parse]));
const ARRAY_PARSERS = new Map(
  RESULT_TYPES.map((type) => [type.arrayOid, (text: string) => parseArrayText(text, type.parse)]),
);

/** Maps one value of the type `typeOid` from its text output (`null` for SQL NULL). */
export function mapValue(typeOid: number, text: string | null): unknown {
  if (text === null) return null;
  const parse = SCALAR_PARSERS.get(typeOid) ?? ARRAY_PARSERS.get(typeOid);
  return parse === undefined ? text : parse(text);
}

/** Maps result rows given as text values in column order, as {@link mapValue} maps each value. */
export function mapRows(columns: readonly ResultColumn[], rows: readonly (readonly (string | null)[])[]): Row[] {
  return rows.map((values) => {
    const row: Row = {};
    columns.forEach((column, index) => {
      row[column.name] = mapValue(column.type, values[index] ?? null);
    });
    return row;
  });
}

/**
 * Reads PostgreSQL's array output (`array_out`): an optional dimension decoration (`[0:1]=`, written when a lower
 * bound is not 1, and dropped here), braces nested per dimension, elements separated by commas, an unquoted `NULL` for
 * NULL, and every element that is empty, equals `NULL` in any case, or holds a brace, a comma, a quote, a backslash or
 * white space in double quotes with `"` and `\` escaped by a backslash. Each other element is mapped by `element`.
 */
export function parseArrayText(text: string, element: (text: string) => unknown): unknown[] {
  let position = 0;
  if (text.startsWith("[")) {
    const decoration = /^(?:\[-?[0-9]+:-?[0-9]+\])+=/.exec(text);
    if (decoration === null) throw malformedArray(text);
    position = decoration[0].length;
  }
  const [value, end] = parseLevel(text, position, element);
  if (end !== text.length) throw malformedArray(text);
  return value;
}

function malformedArray(text: string): UmbraError {
  return malformed("array", text);
}

const UNQUOTED_FORBIDDEN = /["\\{}\s]/;

function parseLevel(text: string, start: number, element: (text: string) => unknown): [unknown[], number] {
  if (text[start] !== "{") throw malformedArray(text);
  let position = start + 1;
  const values: unknown[] = [];
  if (text[position] === "}") return [values, position + 1];
  for (;;) {
    const first = text[position];
    if (first === "{") {
      const [nested, end] = parseLevel(text, position, element);
      values.push(nested);
      position = end;
    } else if (first === '"') {
      let value = "";
      position++;
      for (;;) {
        const char = text[position];
        if (char === undefined) throw malformedArray(text);
        if (char === '"') break;
        if (char === "\\") {
          position++;
          const escaped = text[position];
          if (escaped === undefined) throw malformedArray(text);
          value += escaped;
        } else {
          value += char;
        }
        position++;
      }
      position++;
      values.push(element(value));
    } else {
      let end = position;
      while (end < text.length && text[end] !== "," && text[end] !== "}") end++;
      const value = text.slice(position, end);
      if (value === "" || UNQUOTED_FORBIDDEN.test(value)) throw malformedArray(text);
      values.push(value === "NULL" ? null : element(value));
      position = end;
    }
    const separator = text[position];
    if (separator === "}") return [values, position + 1];
    if (separator !== ",") throw malformedArray(text);
    position++;
  }
}

function invalidParameter(index: number, what: string): UmbraError {
  return new UmbraError("invalid-parameter", `parameter $${index + 1} cannot be sent: ${what}`, { index });
}

function isPlainObject(value: object): boolean {
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const hexOf = (bytes: Uint8Array): string =>
  Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");

/** `JSON.rawJSON` (Node.js 21 and later), which the TypeScript library in use does not declare yet. */
const rawJson = (JSON as unknown as { rawJSON(text: string): unknown }).rawJSON;

/** JSON text of a plain value, with every `bigint` written exactly; anything JSON cannot hold is refused. */
function jsonText(value: unknown, index: number): string {
  // `this[key]` is the value before any `toJSON` (a `Date` would otherwise arrive as its text).
  const replacer = function (this: Record<string, unknown>, key: string, replaced: unknown): unknown {
    const original = this[key];
    if (typeof original === "bigint") return rawJson(original.toString());
    if (typeof original === "number" && !Number.isFinite(original)) {
      throw invalidParameter(index, `JSON has no ${String(original)}`);
    }
    if (original === undefined || typeof original === "function" || typeof original === "symbol") {
      throw invalidParameter(index, `JSON has no ${original === undefined ? "undefined" : typeof original}`);
    }
    if (typeof original === "object" && original !== null && !Array.isArray(original) && !isPlainObject(original)) {
      const kind = original.constructor.name;
      throw invalidParameter(index, `JSON has no ${kind} (only plain objects, arrays and primitives)`);
    }
    return replaced;
  };
  try {
    return JSON.stringify(value, replacer);
  } catch (error) {
    if (error instanceof UmbraError) throw error;
    // JSON.stringify's own failures (a cycle, a structure too deep) are TypeErrors and RangeErrors.
    throw invalidParameter(index, (error as Error).message);
  }
}

/**
 * The text a parameter value is sent as (`null` for SQL NULL): a string as it is; a number or a `bigint` in decimal; a
 * boolean as `true`/`false`; a `Uint8Array` (a `Buffer` is one) as `bytea` hex (`\x…`); a `Date` as its ISO text; an
 * array as an array literal of its elements' texts, nested arrays as dimensions, `null` as NULL; a plain object as
 * JSON (lossless: a `bigint` exactly). A JSON array or scalar for a `json`/`jsonb` parameter is passed as its JSON text
 * (a JavaScript array is a PostgreSQL array). Anything else — `undefined`, a function, a symbol, an invalid `Date`, a
 * `Map` or another class instance — is refused with `invalid-parameter`, naming the parameter (`index` from 0).
 */
export function parameterText(value: unknown, index: number): string | null {
  if (value === null) return null;
  switch (typeof value) {
    case "string":
      return value;
    case "number":
    case "bigint":
      return String(value);
    case "boolean":
      return value ? "true" : "false";
    case "object":
      if (value instanceof Uint8Array) return `\\x${hexOf(value)}`;
      if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) throw invalidParameter(index, "an invalid Date");
        return value.toISOString();
      }
      if (Array.isArray(value)) return arrayLiteral(value, index);
      if (isPlainObject(value)) return jsonText(value, index);
      throw invalidParameter(index, `a ${value.constructor?.name ?? "object"} has no PostgreSQL text`);
    default:
      throw invalidParameter(index, `${typeof value} has no PostgreSQL text`);
  }
}

function arrayLiteral(values: readonly unknown[], index: number): string {
  const elements = values.map((element) => {
    if (element === null) return "NULL";
    if (Array.isArray(element)) return arrayLiteral(element, index);
    const text = parameterText(element, index) as string;
    return `"${text.replace(/[\\"]/g, (char) => `\\${char}`)}"`;
  });
  return `{${elements.join(",")}}`;
}
