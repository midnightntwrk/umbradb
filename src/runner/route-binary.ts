/**
 * Binary routes over HTTP (`../modules/route.ts`): a `GET` whose handler gives a `BinaryFile`, answered whole (200) or
 * as the one byte range asked for (206, `Content-Range`). The range comes from the `Range` header or the `range`
 * parameter (`0-499`, `500-`, `-500`; `bytes=` optional), and the precondition from `If-Match` or the `ifMatch`
 * parameter (`*`, `"9f2c…", "41ab…"`, or one tag bare: `9f2c…`); each from a header or its parameter, never both, so a
 * transport without headers can send them. Input, errors and the one height are a JSON route's (`./route-http.ts`).
 *
 * - An unreadable or non-`bytes` `Range` header is ignored, as RFC 9110 §14.2 allows; an unreadable `If-Match` header
 *   never passes. An unreadable parameter is 400 `invalid-request`, as any input.
 * - Several ranges are answered whole (no `multipart/byteranges`), unless none is satisfiable.
 * - A range none of whose bytes exist is 416 `range-not-satisfiable`, its `Content-Range` giving the size.
 * - An `If-Match` the file's `ETag` fails is 412 `precondition-failed`, so a client reading in parts never mixes two
 *   versions. `If-Range` is not served: a client that wants the new version asks for it.
 * - An answer over the route's `maxAnswerBytes` is refused `resource-exhausted` (429): the client asks for less.
 */

import { type AnyBinaryRoute, type BinaryFile, invalidRequest, RouteError } from "../modules/route.js";
import { type ByteRangeSpec, type IfMatch, ifMatchPasses, parseByteRanges, parseIfMatch, type ResolvedRange, resolveByteRanges } from "./byte-ranges.js";
import { type Answer, answer, answerAtView, type BoundRoute, bindInput, JSON_HEADERS, type JsonSchema, type RouteEntry } from "./route-http.js";

/** The parameters a binary route reads its range and its `If-Match` from; its input may declare neither. */
export const RANGE_PARAMETER = "range";
export const IF_MATCH_PARAMETER = "ifMatch";

/** A binary route's `maxAnswerBytes` when it gives none: the module API's request body limit. */
export const DEFAULT_MAX_ANSWER_BYTES = 1_048_576;

/** The catalog's description of the core's parameters and of a binary answer. */
const RANGE_SCHEMA: JsonSchema = Object.freeze({
  type: "string",
  description: "A byte range, as the Range header writes one: 0-499, 500- or -500 (bytes= optional).",
});
const IF_MATCH_SCHEMA: JsonSchema = Object.freeze({
  type: "string",
  description: 'Answer only if the file\'s ETag is one of these, as the If-Match header writes them: *, "9f2c…", "41ab…" (or 9f2c… bare).',
});
const BINARY_OUTPUT: JsonSchema = Object.freeze({ type: "string", contentEncoding: "binary" });

/** An entity-tag's characters, `"` aside (RFC 9110 §8.8.3). */
const ETAG = /^[\x21\x23-\x7e]+$/;

/** The headers of every answer of a binary route but its content type. */
const { "content-type": _json, ...BINARY_HEADERS } = JSON_HEADERS;

/** `file` checked: what a handler gives that is no `BinaryFile` is a bug in the module. */
function checkFile(id: string, file: unknown): BinaryFile {
  const bug = (why: string) => new Error(`the binary route ${id} answered a file ${why}`);
  if (typeof file !== "object" || file === null) throw bug("that is no { contentType, size, read }");
  const { contentType, size, etag, read } = file as Partial<BinaryFile>;
  if (typeof contentType !== "string" || contentType === "") throw bug("whose contentType is not a non-empty string");
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 0) throw bug("whose size is not a non-negative safe integer");
  if (etag !== undefined && (typeof etag !== "string" || !ETAG.test(etag))) throw bug("whose etag is not visible ASCII without quotes");
  if (typeof read !== "function") throw bug("whose read is not a function");
  return file as BinaryFile;
}

/** `parameter` or `header`, read with `parse`; throws the 400 for both at once or an unreadable parameter. */
function fromEither<T>(
  name: string,
  headerName: string,
  parameter: string | undefined,
  header: string | undefined,
  parse: (text: string, from: "header" | "parameter") => T | undefined,
  rule: string,
): T | undefined {
  if (parameter !== undefined && header !== undefined) throw invalidRequest(`input/${name}: send the ${headerName} header or the ${name} parameter, not both`);
  if (parameter === undefined) return header === undefined ? undefined : parse(header, "header");
  const parsed = parse(parameter, "parameter");
  if (parsed === undefined) throw invalidRequest(`input/${name}: ${rule}`);
  return parsed;
}

/** The range a request asks for: undefined for the whole file, as for an unreadable header. */
const requestedRanges = (parameter: string | undefined, header: string | undefined): ByteRangeSpec[] | undefined =>
  fromEither(RANGE_PARAMETER, "Range", parameter, header, (text, from) => parseByteRanges(text, from === "header" ? "required" : "optional"), "not a byte range (0-499, 500- or -500)");

/** The `If-Match` a request sends: undefined for none; an unreadable header names no tag, so it never passes. */
const requestedIfMatch = (parameter: string | undefined, header: string | undefined): IfMatch | undefined =>
  fromEither(
    IF_MATCH_PARAMETER,
    "If-Match",
    parameter,
    header,
    (text, from) => (from === "header" ? (parseIfMatch(text, "required") ?? []) : parseIfMatch(text, "optional")),
    'not an entity-tag list (*, "9f2c…", "41ab…" or 9f2c…)',
  );

/**
 * `route`, registered by `module`, checked and bound to HTTP (see the module comment). Throws a `TypeError` for a route
 * that cannot be served.
 */
export function bindBinaryRoute(module: string, route: AnyBinaryRoute): BoundRoute {
  const bound = bindInput(module, route, "GET");
  const { id, inputOf } = bound;
  const { handle } = route;
  if (bound.http.method !== "GET") throw bound.refuse("whose http method is POST: a binary route is a GET, as a byte range is (RFC 9110 §14.2)");
  const properties = bound.input.properties as Record<string, unknown>;
  for (const name of [RANGE_PARAMETER, IF_MATCH_PARAMETER]) {
    if (Object.hasOwn(properties, name)) throw bound.refuse(`whose input declares ${name}, a parameter the core reads itself`);
  }
  const given: unknown = route.maxAnswerBytes ?? DEFAULT_MAX_ANSWER_BYTES;
  if (typeof given !== "number" || !Number.isSafeInteger(given) || given < 1) throw bound.refuse("whose maxAnswerBytes is not a positive safe integer");
  const max: number = given;
  const entry: RouteEntry = Object.freeze({
    module,
    name: bound.name,
    id,
    ...(bound.description === undefined ? {} : { description: bound.description }),
    input: Object.freeze({ ...bound.input, properties: Object.freeze({ ...properties, [RANGE_PARAMETER]: RANGE_SCHEMA, [IF_MATCH_PARAMETER]: IF_MATCH_SCHEMA }) }),
    output: BINARY_OUTPUT,
    http: bound.http,
    kind: "binary",
    route,
  });

  const handler: BoundRoute["handler"] = (request, read) =>
    answerAtView(read, async (context, chainHeaders) => {
      const { [RANGE_PARAMETER]: rangeParameter, [IF_MATCH_PARAMETER]: ifMatchParameter, ...params } = request.params;
      const specs = requestedRanges(rangeParameter, request.headers?.range);
      const ifMatch = requestedIfMatch(ifMatchParameter, request.headers?.ifMatch);
      const file = checkFile(id, await handle.call(route, inputOf({ params, body: request.body }), context));
      const headers: Record<string, string> = { ...BINARY_HEADERS, ...chainHeaders, "accept-ranges": "bytes" };
      if (file.etag !== undefined) headers.etag = `"${file.etag}"`;
      if (ifMatch !== undefined && !ifMatchPasses(ifMatch, file.etag)) {
        return answer(412, { error: { code: "precondition-failed", message: "the file's ETag is not one If-Match names" } }, headers);
      }
      const range: ResolvedRange = specs === undefined ? { kind: "whole" } : resolveByteRanges(specs, file.size);
      if (range.kind === "unsatisfiable") {
        return answer(416, { error: { code: "range-not-satisfiable", message: "no byte of the range is in the file" } }, { ...headers, "content-range": `bytes */${file.size}` });
      }
      const [start, end] = range.kind === "part" ? [range.start, range.end] : [0, file.size];
      if (end - start > max) {
        throw new RouteError("resource-exhausted", "answer-too-large", `this route answers at most ${max} bytes at once: ask for a range`);
      }
      const body = start === end ? new Uint8Array(0) : await file.read(start, end);
      if (!(body instanceof Uint8Array) || body.byteLength !== end - start) {
        throw new Error(`the binary route ${id}'s read(${start}, ${end}) gave ${body instanceof Uint8Array ? `${body.byteLength} bytes` : "no Uint8Array"}, not ${end - start} bytes`);
      }
      headers["content-type"] = file.contentType;
      if (range.kind === "whole") return { status: 200, headers, body } satisfies Answer;
      return { status: 206, headers: { ...headers, "content-range": `bytes ${start}-${end - 1}/${file.size}` }, body } satisfies Answer;
    });
  return Object.freeze({ entry, handler });
}
