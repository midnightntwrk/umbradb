/**
 * Typed routes: the part of a module's HTTP API that any module needs, as a library over the module API's registry
 * (`ApiRegistry.http`, `../runner/module-api.ts`). A route declares its method, its path under the module's namespace,
 * a TypeBox schema for its input and one for its answer; its handler gets the input as that schema's type and returns
 * the answer's type.
 *
 * - **Namespace.** {@link registerTypedRoutes} serves every path under `/<namespace>`; give the module's id, so the
 *   routes of two modules cannot clash and a client sees whose a route is.
 * - **Input.** A `GET`'s input is its parameters, the query's and the path's (`:name` segments), all strings; a
 *   `POST`'s is its JSON body. It is checked against the route's `input` schema before the handler runs: what does not
 *   match is 400 `invalid-request`, whose message names the schema's paths and rules, never the values sent. Give an
 *   object schema with `additionalProperties: false`, so an unknown parameter or property is refused too.
 * - **Answer.** The handler's answer is checked against the route's `response` schema before it is sent. One that does
 *   not match is a bug in the module: it is thrown, so the module API answers 500 `internal-error` and reports it
 *   (`onError`), and nothing half-right is sent.
 * - **Errors.** A handler refuses a request by throwing a {@link RouteError} (status, code, message), answered in the
 *   module API's envelope, `{ "error": { "code", "message" } }`. Any other error is the module API's 500.
 * - **One height.** Each answer is read at the latest committed height and carries the chain-data headers
 *   (`X-Umbra-View`, `X-Umbra-Height`, `X-Umbra-Hash`; `../runner/envelope.ts`). Before block S commits, a route
 *   answers 503 `no-committed-height` without running its handler.
 * - **Untrusted text out.** An answer is JSON with every non-ASCII character and `<`, `>`, `&` escaped
 *   ({@link toAsciiJson}), and fixed headers that keep a browser from running it ({@link JSON_HEADERS}).
 *
 * The helper registers nothing on its own and opens nothing: a module calls {@link registerTypedRoutes} from its
 * `on-start-api` with the registry it is given.
 */

import type { Static, TSchema } from "typebox";
import Value from "typebox/value";
import type { ReadHandle } from "../db/api.js";
import type { ApiRegistry } from "../modules/declaration.js";
import { answerChainData } from "../runner/envelope.js";

/** The most schema errors one 400 answer lists. */
const MAX_ERRORS = 3;

/** A request a handler refuses: its HTTP status, its code and a message that never echoes the input. */
export class RouteError extends Error {
  override readonly name = "RouteError";
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** A 400 `invalid-request`, the module API's own code for a request it cannot answer as sent. */
export const invalidRequest = (message: string): RouteError => new RouteError(400, "invalid-request", message);

/** A typed route: its method, its path under the namespace, its input and answer schemas, and the handler between them. */
export interface TypedRoute<I extends TSchema = TSchema, R extends TSchema = TSchema> {
  readonly method: "GET" | "POST";
  /** Under the namespace: `/v1/tokens`, `/v1/blocks/:height`. */
  readonly path: string;
  /** A `GET`'s parameters (query and path, strings), or a `POST`'s JSON body. */
  readonly input: I;
  readonly response: R;
  handle(input: Static<I>, read: ReadHandle): Promise<Static<R>>;
}

/** {@link TypedRoute}, typed by its schemas: `typedRoute({ method, path, input: Schema, response: Schema, handle })`. */
export const typedRoute = <I extends TSchema, R extends TSchema>(route: TypedRoute<I, R>): TypedRoute<I, R> => route;

/** JSON with every non-ASCII character and `<`, `>`, `&` escaped: pure ASCII, and it parses to the same value. */
export function toAsciiJson(value: unknown): string {
  return JSON.stringify(value).replace(/[\u007f-￿<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

/** The headers of every typed answer. */
export const JSON_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

type Answer = { status: number; headers: Record<string, string>; body: string };

const answer = (status: number, body: unknown): Answer => ({
  status,
  headers: { ...JSON_HEADERS },
  body: toAsciiJson(body),
});

/** `schema`'s errors for `value`, as `<where><path>: <rule>`, at most three: paths and rules only, never values. */
export function schemaErrors(schema: TSchema, value: unknown, where = "input"): string[] {
  const out: string[] = [];
  for (const error of Value.Errors(schema, value)) {
    if (error.keyword === "boolean") continue;
    out.push(`${where}${error.instancePath}: ${error.message}`);
    if (out.length === MAX_ERRORS) break;
  }
  return out;
}

/** A namespace: a module id's form, lowercase letters, digits and `-`. */
const NAMESPACE = /^[a-z][a-z0-9-]*$/;

/**
 * Registers `routes` under `/<namespace>` on `api` (see the module comment). `namespace` is the module's id. Throws a
 * `RangeError` for a malformed namespace or path.
 */
export function registerTypedRoutes(
  api: ApiRegistry,
  namespace: string,
  // biome-ignore lint/suspicious/noExplicitAny: a list of routes of different schemas
  routes: readonly TypedRoute<any, any>[],
): void {
  if (!NAMESPACE.test(namespace)) throw new RangeError(`a namespace is a module id (lowercase letters, digits and -): ${JSON.stringify(namespace)}`);
  for (const route of routes) {
    if (!route.path.startsWith("/")) throw new RangeError(`a route's path starts with /: ${JSON.stringify(route.path)}`);
    const full = `/${namespace}${route.path}`;
    api.http(route.method, full, (request, read) =>
      answerChainData(read, async () => {
        try {
          const input = route.method === "GET" ? { ...request.params } : request.body;
          if (!Value.Check(route.input, input)) {
            const errors = input === undefined ? ["input: a JSON body is required"] : schemaErrors(route.input, input);
            throw invalidRequest(errors.join("; "));
          }
          const result = await route.handle(input, read);
          if (!Value.Check(route.response, result)) {
            throw new Error(`${route.method} ${full} built an answer its schema refuses: ${schemaErrors(route.response, result, "answer").join("; ")}`);
          }
          return answer(200, result);
        } catch (error) {
          if (error instanceof RouteError) return answer(error.status, { error: { code: error.code, message: error.message } });
          throw error;
        }
      }),
    );
  }
}
