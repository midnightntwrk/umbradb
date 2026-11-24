/**
 * Byte ranges as RFC 9110 §14 writes them (`0-499`, `500-`, `-500`, comma-separated), and `If-Match`. Shared by the
 * `Range` header and a binary route's `range` parameter, so both mean the same.
 */

/** One range-spec: `first`-`last` inclusive (`last` open when undefined), or the last `suffix` bytes. */
export type ByteRangeSpec = { readonly first: number; readonly last?: number } | { readonly suffix: number };

/** What a request's ranges come to against a file's size; `end` is exclusive. */
export type ResolvedRange =
  | { readonly kind: "whole" }
  | { readonly kind: "part"; readonly start: number; readonly end: number }
  | { readonly kind: "unsatisfiable" };

const DIGITS = /^[0-9]+$/;
const SPEC = /^([0-9]*)-([0-9]*)$/;
/** The unit and its `=`; optional where `unit` is. */
const UNIT = /^bytes[ \t]*=/i;

/**
 * The range-specs of `text`, or undefined when it is none (or names another unit). The parameter may leave out the
 * `bytes=` the header requires.
 */
export function parseByteRanges(text: string, unit: "required" | "optional"): ByteRangeSpec[] | undefined {
  const prefix = UNIT.exec(text);
  if (prefix === null && unit === "required") return undefined;
  const set = prefix === null ? text : text.slice(prefix[0].length);
  // A list's empty elements are allowed (RFC 9110 §5.6.1).
  const elements = set.split(",").map((element) => element.trim()).filter((element) => element !== "");
  if (elements.length === 0) return undefined;
  const specs: ByteRangeSpec[] = [];
  for (const element of elements) {
    const match = SPEC.exec(element);
    if (match === null) return undefined;
    const [, first = "", last = ""] = match;
    if (first === "") {
      if (!DIGITS.test(last)) return undefined;
      specs.push({ suffix: Number(last) });
    } else if (last === "") {
      specs.push({ first: Number(first) });
    } else {
      // Past 2^53 the numbers round, but only against sizes far below that.
      if (Number(last) < Number(first)) return undefined;
      specs.push({ first: Number(first), last: Number(last) });
    }
  }
  return specs;
}

/** `spec` against `size`: its bytes, or undefined when none of them exist. */
function resolveOne(spec: ByteRangeSpec, size: number): { start: number; end: number } | undefined {
  if ("suffix" in spec) return spec.suffix === 0 || size === 0 ? undefined : { start: Math.max(0, size - spec.suffix), end: size };
  if (spec.first >= size) return undefined;
  return { start: spec.first, end: Math.min(spec.last ?? size - 1, size - 1) + 1 };
}

/** `specs` against `size`. Several ranges are answered whole when any is satisfiable: multipart is not served. */
export function resolveByteRanges(specs: readonly ByteRangeSpec[], size: number): ResolvedRange {
  const resolved = specs.map((spec) => resolveOne(spec, size));
  if (resolved.every((range) => range === undefined)) return { kind: "unsatisfiable" };
  const [only] = resolved;
  return resolved.length === 1 && only !== undefined ? { kind: "part", ...only } : { kind: "whole" };
}

/** One entity-tag of a list, weak or strong, and the comma after it (RFC 9110 §8.8.3). */
const ENTITY_TAG = /^[ \t]*(W\/)?"([\x21\x23-\x7e]*)"[ \t]*(,|$)/;
/** A bare tag's characters: an entity-tag's, without `"` or `,`, so a list is never read as one tag. */
const BARE_TAG = /^[\x21\x23-\x2b\x2d-\x7e]+$/;

/** An `If-Match`: any entity-tag (`*`), or the strong ones it names; a weak one never matches, so it is dropped. */
export type IfMatch = "*" | readonly string[];

/**
 * The `If-Match` of `text` (§13.1.1), or undefined when it is none. The parameter may also be one tag without its
 * quotes (`9f2c…`) and commas, as `range` may leave out `bytes=`.
 */
export function parseIfMatch(text: string, quotes: "required" | "optional"): IfMatch | undefined {
  const trimmed = text.trim();
  if (trimmed === "*") return "*";
  if (quotes === "optional" && BARE_TAG.test(trimmed)) return [trimmed];
  const strong: string[] = [];
  let rest = text;
  let elements = 0;
  for (;;) {
    // A list's empty elements are allowed (§5.6.1).
    rest = rest.replace(/^[ \t,]+/, "");
    if (rest === "") return elements === 0 ? undefined : strong;
    const tag = ENTITY_TAG.exec(rest);
    if (tag === null) return undefined;
    elements += 1;
    if (tag[1] === undefined) strong.push(tag[2] as string);
    rest = rest.slice(tag[0].length);
  }
}

/** Whether `ifMatch` passes for a file whose entity-tag is `etag`, compared strongly. */
export const ifMatchPasses = (ifMatch: IfMatch, etag: string | undefined): boolean => ifMatch === "*" || (etag !== undefined && ifMatch.includes(etag));
