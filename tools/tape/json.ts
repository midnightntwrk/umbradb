/**
 * JSON for the test tape: read without loss, written in one form.
 *
 * **Reading.** With UmbraDB's own reader (`parseJsonLossless`, `src/deterministic-postgresql/mapping.ts`), not
 * `JSON.parse`: an integer written outside ±(2^53 − 1) — a node may answer a 128-bit balance as a JSON number — is read
 * as a `bigint` instead of being rounded, so a tape keeps every answer as the node gave it; and Node.js 24's
 * `JSON.parse` can misread an object key that is one escape sequence. [Q78; docs/issues/00007]
 *
 * **Writing** ({@link jsonText}): the one form `JSON.stringify` gives — no spaces; strings with its escapes; numbers as
 * it writes them (`1e+21`, `5e-7`, `0` for −0); object keys in the object's own order (JavaScript's: integer-like keys
 * ascending first, then the others as inserted) — and a `bigint` as its decimal digits. So a value read from a line in
 * this form is written back to the same text. A value JSON cannot hold (`undefined`, a function, a symbol, a non-finite
 * number, an object that is not plain — a `Map`, a `Date`, bytes —, an array with a hole, a cycle) is refused with
 * {@link NotJsonError}, never dropped or turned into `null` as `JSON.stringify` would.
 *
 * **Comparing** ({@link sortedJsonText}): the same text with every object's keys sorted, so two values equal as JSON
 * (keys in any order, `2.0` and `2`) give the same text; the tape node matches a call's parameters by it.
 */

import { parseJsonLossless } from "../../src/deterministic-postgresql/mapping.js";

/** A JSON value as the tape holds it: a `bigint` for an integer outside ±(2^53 − 1). */
export type Json = null | boolean | number | bigint | string | readonly Json[] | { readonly [key: string]: Json };

/** The deepest nesting written: far beyond any node answer, and short of the call stack's limit. */
export const MAX_DEPTH = 512;

/** A value that is not JSON, at `path` (`$` for the value itself). */
export class NotJsonError extends Error {
  constructor(
    readonly path: string,
    readonly found: string,
  ) {
    super(`${path} is ${found}, which is not a JSON value`);
    this.name = "NotJsonError";
  }
}

/** Reads JSON text without loss; throws {@link NotJsonError} for text that is not JSON. */
export function parseJsonText(text: string): unknown {
  try {
    return parseJsonLossless(text);
  } catch {
    throw new NotJsonError("$", "text that is not JSON");
  }
}

/** `value` written in the tape's one form; a part that is not JSON is named by its path from `path`. */
export function jsonText(value: unknown, path = "$"): string {
  return write(value, path, 0, false);
}

/** `value` written with every object's keys sorted: equal JSON values give equal texts. */
export function sortedJsonText(value: unknown): string {
  return write(value, "$", 0, true);
}

/** What a value that is not JSON is, for {@link NotJsonError}: `NaN`, `undefined`, `function`, `[object Map]`, … */
function describe(value: unknown): string {
  if (typeof value === "number") return String(value);
  return typeof value === "object" ? Object.prototype.toString.call(value) : typeof value;
}

function write(value: unknown, path: string, depth: number, sorted: boolean): string {
  switch (typeof value) {
    case "boolean":
      return value ? "true" : "false";
    case "number":
      if (!Number.isFinite(value)) throw new NotJsonError(path, describe(value));
      return JSON.stringify(value);
    case "bigint":
      return value.toString();
    case "string":
      return JSON.stringify(value);
    case "object":
      break;
    default:
      throw new NotJsonError(path, describe(value));
  }
  if (value === null) return "null";
  if (depth >= MAX_DEPTH) throw new NotJsonError(path, `nested deeper than ${MAX_DEPTH} levels`);
  if (Array.isArray(value)) {
    const items: string[] = [];
    for (let index = 0; index < value.length; index++) {
      items.push(write(value[index], `${path}[${index}]`, depth + 1, sorted));
    }
    return `[${items.join(",")}]`;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) throw new NotJsonError(path, describe(value));
  const object = value as Record<string, unknown>;
  const keys = Object.keys(object);
  if (sorted) keys.sort();
  const members = keys.map(
    (key) => `${JSON.stringify(key)}:${write(object[key], `${path}.${key}`, depth + 1, sorted)}`,
  );
  return `{${members.join(",")}}`;
}
