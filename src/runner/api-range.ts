/**
 * Which bytes of a file a module API file answer sends (RFC 9110 §14), and its answer when none can be sent. It imports
 * nothing of Node.js, so the engine, which the browser build bundles, may import it; only the Node.js handlers serve
 * files (`./api-socket.ts`).
 *
 * **One range, or the whole file.** A GET's `Range` of the unit `bytes` (in any letter case) with one range is answered
 * 206 with that part:
 * - `bytes=a-b`: bytes a to b, b cut to the file's last byte;
 * - `bytes=a-`: from byte a to the end;
 * - `bytes=-n`: the last n bytes, the whole file when it has fewer.
 *
 * A range that starts at or past the file's end, a suffix of 0 bytes, and any range of an empty file are unsatisfiable:
 * 416, with a `Content-Range` of `bytes`, an asterisk and the size ({@link rangeNotSatisfiable}). Everything else is
 * answered with the whole file (200), as RFC 9110 lets a server ignore `Range`: no `Range`, another unit, a malformed
 * range (`b` before `a`, no digits), a list of more than one range, and a `Range` beside an `If-Range` that is not the
 * answer's own strong `ETag` (the module API keeps no validator of its own, so a date or another tag cannot be checked).
 */

import { type ApiResponse, encodeJson, JSON_CONTENT_TYPE } from "./module-api.js";

/** What a file answer sends: the whole file, one part of it (`start` to `end`, both included), or nothing (416). */
export type FilePart =
  | { readonly kind: "whole" }
  | { readonly kind: "part"; readonly start: number; readonly end: number }
  | { readonly kind: "unsatisfiable" };

const WHOLE: FilePart = Object.freeze({ kind: "whole" });
const UNSATISFIABLE: FilePart = Object.freeze({ kind: "unsatisfiable" });

/** `bytes=` and its range set; the unit in any letter case. */
const BYTES = /^bytes=(.*)$/i;
/** `first-last`, `first-` or `-suffix`, each a run of digits. */
const SPEC = /^(?:(\d+)-(\d*)|-(\d+))$/;
/** A strong entity tag: a quoted string, without the weak prefix. */
const STRONG_TAG = /^"[^"]*"$/;

/**
 * The part of a file of `size` bytes that a GET with `range` (its `Range`) and `ifRange` (its `If-Range`) asks for, the
 * answer's own `ETag` being `etag` (see the module comment).
 */
export function filePart(size: number, range: string | undefined, ifRange: string | undefined, etag: string | undefined): FilePart {
  if (range === undefined) return WHOLE;
  if (ifRange !== undefined) {
    const tag = ifRange.trim();
    if (etag === undefined || !STRONG_TAG.test(tag) || tag !== etag.trim()) return WHOLE;
  }
  const set = BYTES.exec(range.trim())?.[1];
  if (set === undefined) return WHOLE;
  // A list may hold empty elements (RFC 9110 §5.6.1); one range is answered, more are not.
  const specs = set.split(",").map((spec) => spec.trim()).filter((spec) => spec !== "");
  if (specs.length !== 1) return WHOLE;
  const match = SPEC.exec(specs[0] as string);
  if (match === null) return WHOLE;
  const [, first, last, suffix] = match;
  if (suffix !== undefined) {
    const length = Number(suffix);
    if (length === 0 || size === 0) return UNSATISFIABLE;
    return Object.freeze({ kind: "part", start: Math.max(0, size - length), end: size - 1 });
  }
  const start = Number(first);
  if (last !== "" && Number(last) < start) return WHOLE;
  if (start >= size) return UNSATISFIABLE;
  return Object.freeze({ kind: "part", start, end: last === "" ? size - 1 : Math.min(Number(last), size - 1) });
}

/** The code of the 416 answer's error body. */
export const RANGE_NOT_SATISFIABLE = "range-not-satisfiable";

/**
 * The answer to a range of a file of `size` bytes that holds none of it: 416 with the module API's error body,
 * a `Content-Range` of `bytes`, an asterisk and the size, and `Accept-Ranges: bytes`.
 */
export function rangeNotSatisfiable(size: number): ApiResponse {
  return {
    status: 416,
    headers: { "Content-Type": JSON_CONTENT_TYPE, "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" },
    body: encodeJson({ error: { code: RANGE_NOT_SATISFIABLE, message: `the range holds none of the file's ${size} bytes` } }) as string,
  };
}
