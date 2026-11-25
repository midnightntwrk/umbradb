/**
 * A route: one operation of a module's API, declared without naming a transport. A module gives the operation's name,
 * a zod schema of its input and one of its output, and a handler between them, and registers it from `on-start-api`
 * with `api.route(route)` (`ApiRegistry`, `./declaration.ts`). The core keeps the declaration and serves it: over HTTP
 * today (`../runner/route-http.ts`), and over any transport added later, with no change to the module.
 *
 * - **Name.** lowerCamelCase, unique within the module. `<module-id>.<name>` identifies the route on every transport.
 * - **Two sides.** A schema has a wire side, what a client sends and receives, and a handler side, what the handler
 *   works with. For most schemas they are the same (`z.int()`, `z.string()`). A zod codec gives them different types:
 *   `bigintText()` (`../helpers/bigint-text.ts`) is digits in a string on the wire and a `bigint` to the handler. The
 *   core reads the input with the schema (`z.decode`) and writes the output with it (`z.encode`).
 * - **The wire side is JSON:** what `z.toJSONSchema` can write, so every transport can carry the values and the core
 *   can describe the route. A bare `z.bigint()` or `z.date()` is refused at registration. A transform reads one way
 *   only, so it may be in an input and never in an output. Schemas are synchronous.
 * - **Logical types.** A schema states what the handler works with (`z.int()`, `z.boolean()`), never how a transport
 *   writes it. The transport converts: the HTTP adapter reads a `GET`'s parameters, which arrive as text, into the
 *   numbers and booleans the schema asks for.
 * - **The handler** gets the input as the schema read it and a {@link RouteContext}, and returns the output's handler
 *   side. The core checks the output against its schema before anything is sent, and sends what the schema wrote: a
 *   field the schema does not declare is left out (refused, with `z.strictObject`).
 * - **Bytes** (a hash, an address, a key) are text on both sides, `0x` and lowercase hex (`hexBytes()`): they are
 *   compared and looked up, not computed with. The context's `hash` is written so.
 * - **Errors.** A handler refuses a request by throwing a {@link RouteError}: a kind of {@link ROUTE_ERROR_KINDS},
 *   which each transport writes its own way (an HTTP status, an RPC code), the module's own code and a message. Any
 *   other error is a bug: the client is told nothing of it.
 * - **`http`** is a hint for the HTTP adapter only, and optional: the method and the path under `/<module-id>`.
 *   Without it the route is `POST /<module-id>/<name>`.
 * - **Binary routes** ({@link BinaryRoute}, `api.binaryRoute`) answer bytes instead of JSON, whole or a byte range
 *   (`../runner/route-binary.ts`).
 */

import type { z } from "zod";
import type { ReadHandle } from "../db/api.js";

/**
 * The kinds of a request a handler refuses. Each transport writes them its own way; the names are those of the RPC
 * status codes they correspond to.
 * - `invalid-argument`: the input is wrong whatever the chain holds.
 * - `not-found`: what the input names does not exist at the height read.
 * - `out-of-range`: the input is past what exists (a height above the committed one, a page after the last).
 * - `failed-precondition`: the request cannot be answered in the state the module is in.
 * - `resource-exhausted`: the request asks for more than the route gives at once.
 * - `unimplemented`: the route does not do what this input asks.
 * - `unavailable`: the route cannot answer now and may later.
 */
export const ROUTE_ERROR_KINDS = Object.freeze([
  "invalid-argument",
  "not-found",
  "out-of-range",
  "failed-precondition",
  "resource-exhausted",
  "unimplemented",
  "unavailable",
] as const);

/** A kind of {@link ROUTE_ERROR_KINDS}. */
export type RouteErrorKind = (typeof ROUTE_ERROR_KINDS)[number];

/** A request a handler refuses: its kind, the module's code for it and a message that never echoes the input. */
export class RouteError extends Error {
  override readonly name = "RouteError";
  readonly kind: RouteErrorKind;
  /** The module's own code, as a client matches it: `no-block`. */
  readonly code: string;

  constructor(kind: RouteErrorKind, code: string, message: string) {
    super(message);
    if (!ROUTE_ERROR_KINDS.includes(kind)) {
      throw new TypeError(`a RouteError's kind is one of ${ROUTE_ERROR_KINDS.join(", ")}, not ${JSON.stringify(kind)}`);
    }
    if (typeof code !== "string" || code === "") throw new TypeError("a RouteError's code is a non-empty string");
    this.kind = kind;
    this.code = code;
  }
}

/** An `invalid-argument` with the code `invalid-request`, the module API's own code for a request it cannot answer as sent. */
export const invalidRequest = (message: string): RouteError => new RouteError("invalid-argument", "invalid-request", message);

/** What a handler is given beside its input. */
export interface RouteContext {
  /** The request's read, at one committed height. */
  readonly read: ReadHandle;
  /** The committed height the answer is read at. A handler never runs before block S commits. */
  readonly height: bigint;
  /** That block's hash, as bytes are written in a route: `0x` and lowercase hex. */
  readonly hash: string;
}

/** The HTTP adapter's hint: the method, and the path under `/<module-id>` (`/v1/blocks/:height`). */
export interface RouteHttp {
  readonly method: "GET" | "POST";
  readonly path: string;
}

/** A route (see the module comment). */
export interface Route<I extends z.ZodType = z.ZodType, O extends z.ZodType = z.ZodType> {
  /** lowerCamelCase, unique within the module. */
  readonly name: string;
  /** One sentence a description of the API may show. */
  readonly description?: string;
  readonly input: I;
  readonly output: O;
  /** How the HTTP adapter serves the route; `POST /<module-id>/<name>` without it. */
  readonly http?: RouteHttp;
  /** A property, not a method, so that a handler must take every input its schema reads. */
  readonly handle: (input: z.output<I>, context: RouteContext) => Promise<z.output<O>>;
}

/** A route of any schemas, as the core holds one. */
// biome-ignore lint/suspicious/noExplicitAny: the schemas of a registered route are not known where it is held
export type AnyRoute = Route<any, any>;

/** {@link Route}, typed by its schemas: `defineRoute({ name, input, output, handle })`. */
export const defineRoute = <I extends z.ZodType, O extends z.ZodType>(route: Route<I, O>): Route<I, O> => route;

/**
 * What a binary route answers with. The core reads only the part a request asks for, so `read` may fetch lazily; it
 * is called only while the request runs, inside its read.
 */
export interface BinaryFile {
  /** The answer's `Content-Type`. */
  readonly contentType: string;
  /** The file's length in bytes. */
  readonly size: number;
  /** A strong validator, sent quoted as the `ETag` and checked against `If-Match`: equal only for equal bytes. Visible ASCII but `"`. */
  readonly etag?: string;
  /** Bytes `start` to `end` (exclusive), `0 <= start < end <= size`. */
  readonly read: (start: number, end: number) => Promise<Uint8Array>;
}

/**
 * A binary route: a {@link Route} whose answer is a {@link BinaryFile}, all of it or the byte range a request names
 * (`Range`, or the `range` parameter, which its input may not declare). Always a `GET`; `GET /<module-id>/<name>`
 * without `http`.
 */
export interface BinaryRoute<I extends z.ZodType = z.ZodType> {
  readonly name: string;
  readonly description?: string;
  readonly input: I;
  readonly http?: RouteHttp & { readonly method: "GET" };
  /** The most bytes one answer carries; a request for more is refused, so a client asks for ranges. 1 MiB by default. */
  readonly maxAnswerBytes?: number;
  readonly handle: (input: z.output<I>, context: RouteContext) => Promise<BinaryFile>;
}

/** A binary route of any input, as the core holds one. */
// biome-ignore lint/suspicious/noExplicitAny: the schema of a registered route is not known where it is held
export type AnyBinaryRoute = BinaryRoute<any>;

/** {@link BinaryRoute}, typed by its input: `defineBinaryRoute({ name, input, handle })`. */
export const defineBinaryRoute = <I extends z.ZodType>(route: BinaryRoute<I>): BinaryRoute<I> => route;

/** `bytes` held in memory as a {@link BinaryFile}. */
export const binaryData = (bytes: Uint8Array, contentType: string, etag?: string): BinaryFile => ({
  contentType,
  size: bytes.byteLength,
  ...(etag === undefined ? {} : { etag }),
  read: async (start, end) => bytes.subarray(start, end),
});
