/**
 * A typed route on the module API: what any module's API needs, kept apart from `token-metadata-api`'s own handlers
 * so it can move into the core. A route declares its method, its path under the module's namespace, a TypeBox schema
 * for its JSON body and one for its answer; the handler receives the body as that schema's type and returns the
 * answer's type.
 *
 * - **Namespace.** Every path is served under `/<namespace>/`, the module's id, so two modules' routes cannot clash.
 * - **Input.** The body is checked against its schema before the handler runs; a body that does not match is 400
 *   `BAD_REQUEST`, with the schema's paths and rules (never the input's values) in the message.
 * - **Output.** The answer is checked against its schema before it is sent: an answer that does not match is a bug,
 *   answered 500 by the module API, never sent half-right.
 * - **Errors.** One envelope, `{ "error": { "code", "message" } }`: a handler throws an {@link ApiError}; the module API
 *   answers what no route reaches (404 `not-found`, 405 `method-not-allowed`, 500 `internal-error`).
 * - **Every answer** is ASCII-escaped JSON with fixed security headers and the core's `X-Umbra-*` chain-data headers,
 *   read at one committed height; at most `maxConcurrent` requests run at once, more get 503 `BUSY`.
 */

import type { Static, TSchema } from "typebox";
import Value from "typebox/value";
import type { ReadHandle } from "../../db/api.js";
import type { ApiRegistry } from "../../modules/declaration.js";
import { answerChainData } from "../../runner/envelope.js";

/** Requests answered at once; more are refused with 503 `BUSY`. */
export const DEFAULT_MAX_CONCURRENT_REQUESTS = 8;
/** The most schema errors one 400 answer lists. */
const MAX_ERRORS = 3;

/** A request a handler refuses: its status, code and a message that never echoes the input. */
export class ApiError extends Error {
  override readonly name = "ApiError";
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** A 400 `BAD_REQUEST`. */
export const badRequest = (message: string): ApiError => new ApiError(400, "BAD_REQUEST", message);

/** A route: its method, its path under the namespace, its body and answer schemas, and the handler between them. */
export interface Route<B extends TSchema, R extends TSchema> {
  readonly method: "POST";
  readonly path: string;
  readonly body: B;
  readonly response: R;
  handle(body: Static<B>, read: ReadHandle): Promise<Static<R>>;
}

/** {@link Route}, typed by its schemas (`route({ …, body: Schema, response: Schema, handle })`). */
export const route = <B extends TSchema, R extends TSchema>(r: Route<B, R>): Route<B, R> => r;

/** JSON with every non-ASCII character and `<`, `>`, `&` escaped: the body is pure ASCII and parses to the same value. */
export function toAsciiJson(value: unknown): string {
  return JSON.stringify(value).replace(/[\u007f-￿<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

/** The headers of every answer. */
export const JSON_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

type Answer = { status: number; headers: Record<string, string>; body: string };

const answer = (status: number, body: unknown, extra: Record<string, string> = {}): Answer => ({
  status,
  headers: { ...JSON_HEADERS, ...extra },
  body: toAsciiJson(body),
});

/** The schema's errors for `value`, as `body<path>: <rule>` (paths and rules only, never values). */
export function schemaErrors(schema: TSchema, value: unknown): string[] {
  const out: string[] = [];
  for (const error of Value.Errors(schema, value)) {
    if (error.keyword === "boolean") continue;
    out.push(`body${error.instancePath}: ${error.message}`);
    if (out.length === MAX_ERRORS) break;
  }
  return out;
}

/** The full path of `path` under `namespace`: `/<namespace><path>`. */
export const namespaced = (namespace: string, path: string): string => `/${namespace}${path}`;

/**
 * Registers `routes` under `/<namespace>/` on the module API (see the module comment); `maxConcurrent` requests run at
 * once across them.
 */
export function registerRoutes(
  api: ApiRegistry,
  namespace: string,
  // biome-ignore lint/suspicious/noExplicitAny: a list of routes of different schemas
  routes: readonly Route<any, any>[],
  maxConcurrent = DEFAULT_MAX_CONCURRENT_REQUESTS,
): void {
  let inFlight = 0;
  for (const r of routes) {
    api.http(r.method, namespaced(namespace, r.path), async (req, read) => {
      if (inFlight >= maxConcurrent) {
        return answer(503, { error: { code: "BUSY", message: "too many requests in progress; retry shortly" } }, { "retry-after": "1" });
      }
      inFlight++;
      try {
        return await answerChainData(read, async () => {
          try {
            if (!Value.Check(r.body, req.body)) {
              const errors = req.body === undefined ? ["body: a JSON body is required"] : schemaErrors(r.body, req.body);
              throw badRequest(errors.join("; "));
            }
            const result = await r.handle(req.body, read);
            if (!Value.Check(r.response, result)) {
              throw new Error(`${namespaced(namespace, r.path)} built an answer its schema refuses: ${schemaErrors(r.response, result).join("; ")}`);
            }
            return answer(200, result);
          } catch (error) {
            if (error instanceof ApiError) return answer(error.status, { error: { code: error.code, message: error.message } });
            throw error;
          }
        });
      } finally {
        inFlight--;
      }
    });
  }
}
