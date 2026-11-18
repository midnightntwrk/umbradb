/**
 * Integers beyond 2^53 in a route (`../modules/route.ts`) or a page cursor (`./page-cursor.ts`): zod schemas whose
 * handler side is a `bigint` and whose wire side is JSON. A handler takes and returns `bigint`s; a client sends the
 * integer as digits in a string or as a JSON number, and always receives digits in a string, which no JSON reader
 * rounds.
 *
 * - {@link bigintText}: an integer of at most {@link MAX_DIGITS} digits. 10^78 is above 2^256, the largest integer a
 *   chain uses.
 * - {@link uintText}: an integer from 0 to 2^bits − 1 (`uintText(64)`, `uintText(128)`, `uintText(256)`), checked both
 *   ways.
 *
 * Each is a zod codec, so it reads in one direction and writes in the other: a schema that holds one is parsed with
 * `z.decode` (or `parse`) and written with `z.encode`, as the core does for a route's input and output. A default is
 * given on the wire side, `bigintText().prefault("0")`: `.default(0n)` has no JSON to describe it.
 */

import { z } from "zod";

/** The most digits of an integer these schemas take. */
export const MAX_DIGITS = 78;
/** The most bits of {@link uintText}: 2^256 − 1 has {@link MAX_DIGITS} digits. */
export const MAX_BITS = 256;

/** An integer's digits, with and without a sign: no leading zero, no `-0`. Their length is checked apart. */
const SIGNED = /^(0|-?[1-9][0-9]*)$/;
const UNSIGNED = /^(0|[1-9][0-9]*)$/;

/**
 * The codec of the integers `accepts` takes, of at most `most` digits, with a sign or without. The text's length is
 * checked before anything else, so no long text is matched or read as a `bigint`. `expected` describes them.
 */
function integerText(signed: boolean, most: number, expected: string, accepts: (value: bigint) => boolean) {
  const message = `expected ${expected}, as digits in a string or as a JSON number`;
  const digits = signed ? SIGNED : UNSIGNED;
  const longest = most + (signed ? 1 : 0);
  // On the wire: digits in a string, a JSON integer, or one the module API's reader kept exact as a `bigint`.
  const isInteger = (value: unknown): boolean =>
    (typeof value === "string" && value.length <= longest && digits.test(value)) ||
    (typeof value === "number" && Number.isSafeInteger(value)) ||
    typeof value === "bigint";
  // What the catalog shows: the same digits, with their length in the pattern.
  const pattern = `^(0|${signed ? "-?" : ""}[1-9][0-9]{0,${most - 1}})$`;
  const wire = z
    .unknown()
    .refine(isInteger, message)
    .meta({ anyOf: [{ type: "string", pattern }, { type: "integer", ...(signed ? {} : { minimum: 0 }) }], format: "bigint" });
  return z
    .codec(wire, z.bigint(), { decode: (value) => BigInt(value as string | number | bigint), encode: (value) => value.toString() })
    .refine(accepts, message);
}

/** An integer of at most 78 digits, a `bigint` to the handler: `amount: bigintText()`. */
export function bigintText() {
  const limit = 10n ** BigInt(MAX_DIGITS);
  return integerText(true, MAX_DIGITS, `an integer of at most ${MAX_DIGITS} digits`, (value) => value > -limit && value < limit);
}

/**
 * An integer from 0 to 2^`bits` − 1, a `bigint` to the handler: `uintText(64)`. Throws a `RangeError` for `bits` that
 * is not an integer from 1 to {@link MAX_BITS}.
 */
export function uintText(bits: number) {
  if (!Number.isInteger(bits) || bits < 1 || bits > MAX_BITS) {
    throw new RangeError(`uintText takes a number of bits, an integer from 1 to ${MAX_BITS}, not ${String(bits)}`);
  }
  const limit = 1n << BigInt(bits);
  return integerText(false, (limit - 1n).toString().length, `an integer from 0 to 2^${bits} - 1`, (value) => value >= 0n && value < limit);
}
