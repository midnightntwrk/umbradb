/**
 * JSON as the module API writes it, shared by the answers of raw handlers (`./module-api.ts`), of routes
 * (`./route-http.ts`) and by subscriptions (`./api-session.ts`); and the numbers of a route's JSON body, read exactly.
 */

/** `0x` and `bytes` in lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

/**
 * `value` as the module API writes JSON: a `bigint` as its decimal text, bytes (a `Uint8Array`, a `Buffer`) as `0x`
 * and lowercase hex, everything else as `JSON.stringify` writes it; undefined where `JSON.stringify` gives nothing.
 * Throws `JSON.stringify`'s `TypeError` for a cyclic value.
 */
export function encodeJson(value: unknown): string | undefined {
  return JSON.stringify(value, function (this: Record<string, unknown>, key: string, replaced: unknown) {
    const raw = this[key];
    if (typeof raw === "bigint") return raw.toString();
    if (raw instanceof Uint8Array) return hex(raw);
    return replaced;
  });
}

/** Whether JSON has no value for `raw`: `JSON.stringify` leaves it out of an object and writes `null` for it in a list. */
const unwritable = (raw: unknown): boolean =>
  raw === undefined || typeof raw === "function" || typeof raw === "symbol" || (typeof raw === "number" && !Number.isFinite(raw));

/**
 * `value` as {@link encodeJson} writes it, with every non-ASCII character and `<`, `>`, `&` escaped: pure ASCII, and it
 * parses to the same value. Throws a `TypeError` for what JSON would write as another value: `undefined`, a function
 * or a symbol as the whole value or in a list, and a number that is not finite anywhere. An object's `undefined`
 * property is left out, as `JSON.stringify` leaves it.
 */
export function encodeAsciiJson(value: unknown): string {
  const refuse = (raw: unknown) => new TypeError(`JSON has no value for ${typeof raw === "number" ? String(raw) : typeof raw}`);
  if (unwritable(value)) throw refuse(value);
  const text = JSON.stringify(value, function (this: unknown, key: string, replaced: unknown) {
    const raw = (this as Record<string, unknown>)[key];
    if (typeof raw === "bigint") return raw.toString();
    if (raw instanceof Uint8Array) return hex(raw);
    if (unwritable(raw) && (Array.isArray(this) || typeof raw === "number")) throw refuse(raw);
    return replaced;
  });
  return text.replace(/[\u007f-\uffff<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

/** The most digits of an integer a route reads exactly: 10^78 is above 2^256, the largest integer a chain uses. */
export const MAX_INTEGER_DIGITS = 78;

/** A number of a route's JSON body that cannot be read as the value it writes. Its message is a client's to see. */
export class UnreadableNumber extends Error {
  override readonly name = "UnreadableNumber";
}

const TOKEN = /^(-?)([0-9]+)(?:\.([0-9]+))?(?:[eE]([+-]?[0-9]+))?$/;
const PLAIN_INTEGER = /^-?[0-9]+$/;

/**
 * A JSON number of a route's body, read exactly (`parseJsonLossless`'s `readNumber`):
 * - an integer of at most {@link MAX_INTEGER_DIGITS} digits, however written (`5`, `5.0`, `5e3`): a `number` within
 *   ±(2^53 − 1), a `bigint` beyond;
 * - any other number: the `number` nearest to it, as `JSON.parse` reads it. A longer integer is one of these, so it is
 *   never read as a `bigint`, and no schema of integers takes it.
 *
 * Throws {@link UnreadableNumber} for what would be read as another value: a number that is no integer but whose
 * nearest `number` is one (`1.0000000000000001`, `1e-400`), and a number beyond a `number`'s range (`1e999`).
 */
export function readExactNumber(token: string): number | bigint {
  const value = Number(token);
  if (!Number.isFinite(value)) throw new UnreadableNumber("a number in the request body is beyond a number's range");
  // A fraction is the number nearest to it.
  if (!Number.isInteger(value)) return value;
  if (Number.isSafeInteger(value) && PLAIN_INTEGER.test(token)) return value;
  const [, sign = "", whole = "", fraction = "", exponent = "0"] = TOKEN.exec(token) ?? [];
  const digits = (whole + fraction).replace(/^0+/, "");
  if (digits === "") return 0;
  // The number is `digits` times ten to the `scale`.
  let scale = Number(exponent) - fraction.length;
  let end = digits.length;
  for (; scale < 0 && digits[end - 1] === "0"; end--) scale++;
  if (scale < 0) throw new UnreadableNumber("a number in the request body is not an integer, and would be read as one");
  if (end + scale > MAX_INTEGER_DIGITS) return value;
  const exact = BigInt(`${sign}${digits.slice(0, end)}${"0".repeat(scale)}`);
  return exact >= BigInt(Number.MIN_SAFE_INTEGER) && exact <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(exact) : exact;
}
