/**
 * The module API: what modules register in `on-start-api`, and how a request and a subscription are answered. It has
 * no transport of its own, so the browser build can carry the same requests over `postMessage`; Node.js's HTTP and
 * WebSocket listener on `listen.api` is `./api-server.ts`. [RN-1, RN-15, RN-16, DB-15; design §2; CORE-ARCH §4.10's
 * `ApiRegistry`, §4.20]
 *
 * **Registration.** {@link registerModuleApis} runs `on-start-api` once, at startup, after the process contexts are
 * sealed. It runs for the parts this process may run: those active in a range of the graph's `ranges`, the cursor's
 * included. A part whose revisions all ended below the cursor runs no point in this process and serves no API. The
 * callbacks run in the startup order, in series, each with its module's process context and a registry of its own,
 * closed when the callback ends ({@link ApiRoutes.open}). A malformed registration throws at the call. Once every
 * `on-start-api` has run, two registrations of one method and path (parameters' names aside), or of one subscription
 * name, refuse startup with `duplicate-api-route`, naming the route and both modules, before anything listens.
 * [RN-15, MD-7, Q95]
 *
 * **Paths.** `/` or `/` and segments, each a literal of `A–Z a–z 0–9 - . _ ~ ! $ & ' ( ) * + , ; = @` or a parameter
 * `:name`. A request's segments are percent-decoded before they are compared, and a literal segment wins over a
 * parameter, leftmost first. A handler's `params` holds the query's parameters (the first value of each) and the path's
 * (which win a name both have), in an object without a prototype.
 *
 * **A request** ({@link ModuleApi.answer}) gets one read of the latest committed height, and the handler runs inside it.
 * The read is bounded by `apiReadTimeoutMs` (`db.read(…, { timeoutMs })`, on PostgreSQL only). So on PGlite a
 * `db.read` from a handler fails with `nested-call` rather than waiting. [DB-15, Q73]
 *
 * **The answer is the module's.** The module API adds no header and no `extensions` to it, treats a GraphQL response
 * like any other, and calls the handler before block S commits too. Only its HTTP listener sets `X-Umbra-Version`, the
 * build's version, on every answer it sends (`./api-server.ts`), not here; so another transport (the browser's) carries
 * the answer as the handler gave it. A module that states the view, height and hash it read does so itself with the
 * envelope's helpers (`./envelope.ts`: `readChainDataView`, `chainDataHeaders`, `withViewExtensions`,
 * `answerChainData`). Before block S commits, `readChainDataView` fails with `no-committed-height`, answered 503 when
 * the handler does not catch it. [RN-16, Q104, Q105, Q131]
 *
 * A POST's body is read as JSON by the component's own reader, which returns integers beyond ±(2^53 − 1) as `bigint`; a
 * GET's body is ignored. [Q78]
 *
 * **Bodies.** An answer's body is written as JSON, with `Content-Type: application/json; charset=utf-8`: a `bigint` as
 * decimal text and bytes as `0x`-prefixed lowercase hex, as the envelope writes heights and hashes. If the handler gave
 * a `Content-Type` and its body is text or bytes, the body is sent as it is. An `undefined` body is empty.
 *
 * **Errors** are `{ "error": { "code", "message" } }` with the status of {@link API_ERROR_STATUS}:
 * - a path no route has: 404 `not-found`;
 * - a method the path lacks: 405 `method-not-allowed`, with `Allow`;
 * - a path or body that cannot be read: 400 `invalid-request`;
 * - a body over the listener's limit: 413 `request-too-large`;
 * - the read's timeout: 504 `query-timeout`, with the database API's message;
 * - a `no-committed-height` the handler did not catch: 503 `no-committed-height`, with the envelope's message;
 * - anything else (a handler that throws or answers what is no answer, a database error): 500 `internal-error` with a
 *   fixed message, so no exception text, which may hold a credential, reaches a client. The error itself goes to
 *   `onError`. [AE-6]
 *
 * **Subscriptions** ({@link ModuleApi.subscribe}). The module's handler gets the subscriber's arguments and an `emit`,
 * and returns its unsubscribe. The module notifies its subscribers from its own `on-after-db-write`; nothing here checks
 * where `emit` is called from, since modules are trusted. `emit` never waits: it hands the value to the transport,
 * which writes it or drops a subscriber that fell behind. After the unsubscribe it does nothing. [RN-15, Q46]
 */

import type { ReadHandle, ReadOptions } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import type { ApiRegistry } from "../modules/declaration.js";
import type { ResolvedGraph } from "../modules/graph.js";
import { runSchedule, seriesOf } from "./dispatch.js";
import type { ChainDataAnswer } from "./envelope.js";
import type { ProcessContexts } from "./process-context.js";

/** A route's method. [CORE-ARCH §4.10] */
export type HttpMethod = "GET" | "POST";

/** A module's HTTP handler. */
export type HttpHandler = Parameters<ApiRegistry["http"]>[2];

/** A module's subscription handler: returns its unsubscribe. */
export type SubscriptionHandler = Parameters<ApiRegistry["subscription"]>[1];

/** One segment of a route's path: a literal, or a parameter's name. */
export type PathSegment = { readonly literal: string } | { readonly param: string };

/** An HTTP route a module registered. */
export interface HttpRoute {
  readonly module: string;
  readonly method: HttpMethod;
  /** As registered. */
  readonly path: string;
  readonly segments: readonly PathSegment[];
  readonly handler: HttpHandler;
}

/** A subscription a module registered. */
export interface SubscriptionRoute {
  readonly module: string;
  readonly name: string;
  readonly handler: SubscriptionHandler;
}

/** One module's registration in its `on-start-api`. */
export interface ModuleRegistration {
  /** What the module's `on-start-api` is given. */
  readonly registry: ApiRegistry;
  /** Ends the registration, when the callback ended: a later call throws. */
  close(): void;
}

/** The HTTP status of each error the module API answers (see the module comment). */
export const API_ERROR_STATUS = Object.freeze({
  "invalid-request": 400,
  "not-found": 404,
  "method-not-allowed": 405,
  "request-too-large": 413,
  "internal-error": 500,
  "no-committed-height": 503,
  "query-timeout": 504,
} as const);

/** A code an error body of the module API carries. */
export type ApiErrorCode = keyof typeof API_ERROR_STATUS;

/** A request the module API can answer: its code, its status and a message a client may see. */
export class ApiError extends Error {
  override readonly name = "ApiError";
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = API_ERROR_STATUS[code];
  }
}

/** A request, as the transport read it. */
export interface ApiRequest {
  readonly method: string;
  /** The URL's path, percent-encoded as sent. */
  readonly path: string;
  /** The URL's query parameters, in order (a `URLSearchParams` will do). */
  readonly query?: Iterable<readonly [string, string]>;
  /** The body as text; a POST's only. */
  readonly body?: string;
}

/** An answer, as the transport sends it. */
export interface ApiResponse {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | Uint8Array;
}

/** What a module API reads through and how. */
export interface ModuleApiOptions {
  /** The database (or its read-only item): each request is one of its reads. */
  readonly db: { read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T> };
  /** `apiReadTimeoutMs`: each request's read is bounded by it. [CF-4, DB-15] */
  readonly timeoutMs: number;
  /** Told of every failure answered 500, with the route: the runner logs it (redacted). */
  readonly onError?: (error: unknown, where: { readonly module: string; readonly route: string }) => void;
}

/** The content type of every JSON body the module API writes. */
export const JSON_CONTENT_TYPE = "application/json; charset=utf-8";

const INTERNAL = "the module API could not answer the request";
const LITERAL = /^[A-Za-z0-9\-._~!$&'()*+,;=@]+$/;
const PARAMETER = /^:([A-Za-z_][A-Za-z0-9_]*)$/;
/** A header's name (RFC 9110 §5.1, a token) and value (§5.5: tabs, visible ASCII and obs-text), as Node.js checks them. */
const HEADER_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const HEADER_VALUE = /^[\t\x20-\x7e\x80-\xff]*$/;
const PATH_RULE =
  `"/" or "/" and segments, each of letters, digits and -._~!$&'()*+,;=@, or :name for a parameter`;

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

/** The answer to a request the module API refuses with `code` (see the module comment). */
export function apiErrorResponse(code: ApiErrorCode, message: string, headers: Record<string, string> = {}): ApiResponse {
  return {
    status: API_ERROR_STATUS[code],
    headers: { "Content-Type": JSON_CONTENT_TYPE, ...headers },
    body: encodeJson({ error: { code, message } }) as string,
  };
}

/** The segments of `path`, registered by `module` with `method`; throws a `TypeError` for a path that is none. */
function parsePath(module: string, method: HttpMethod, path: unknown): PathSegment[] {
  if (typeof path !== "string") throw new TypeError(`${module} registered ${method} with a path that is not a string`);
  const refuse = (why: string) => new TypeError(`${module} registered ${method} ${path}, ${why}`);
  if (!path.startsWith("/")) throw refuse(`which is not a path: ${PATH_RULE}`);
  if (path === "/") return [];
  const names = new Set<string>();
  return path
    .slice(1)
    .split("/")
    .map((segment): PathSegment => {
      const parameter = PARAMETER.exec(segment)?.[1];
      if (parameter !== undefined) {
        if (names.has(parameter)) throw refuse(`which names the parameter ${parameter} twice`);
        names.add(parameter);
        return Object.freeze({ param: parameter });
      }
      if (!LITERAL.test(segment)) throw refuse(`which is not a path: ${PATH_RULE}`);
      return Object.freeze({ literal: segment });
    });
}

/** One registration, in order. */
type Registration =
  | { readonly kind: "http"; readonly route: HttpRoute }
  | { readonly kind: "subscription"; readonly route: SubscriptionRoute };

/** A route's shape: its method and segments, parameters' names left out. */
const shapeOf = (route: HttpRoute): string =>
  `${route.method} /${route.segments.map((segment) => ("literal" in segment ? segment.literal : ":")).join("/")}`;

/** What the modules register in `on-start-api` (see the module comment). */
export class ApiRoutes {
  readonly #registrations: Registration[] = [];

  /** The HTTP routes registered, in registration order. */
  get http(): readonly HttpRoute[] {
    return Object.freeze(this.#registrations.flatMap((r) => (r.kind === "http" ? [r.route] : [])));
  }

  /** The subscriptions registered, in registration order. */
  get subscriptions(): readonly SubscriptionRoute[] {
    return Object.freeze(this.#registrations.flatMap((r) => (r.kind === "subscription" ? [r.route] : [])));
  }

  /** A registry for `module`'s `on-start-api`, valid until {@link ModuleRegistration.close}. */
  open(module: string): ModuleRegistration {
    let open = true;
    const after = (what: string) =>
      new Error(
        `${module} registered ${what} after its on-start-api callback ended: modules register their API once, at ` +
          "startup",
      );
    const registry: ApiRegistry = Object.freeze({
      http: (method: HttpMethod, path: string, handler: HttpHandler): void => {
        if (!open) throw after(`${String(method)} ${String(path)}`);
        if (method !== "GET" && method !== "POST") {
          throw new TypeError(`${module} registered the method ${String(method)}, which is neither GET nor POST`);
        }
        const segments = parsePath(module, method, path);
        if (typeof handler !== "function") {
          throw new TypeError(`${module} registered ${method} ${path} with a handler that is not a function`);
        }
        this.#registrations.push({
          kind: "http",
          route: Object.freeze({ module, method, path, segments: Object.freeze(segments), handler }),
        });
      },
      subscription: (name: string, handler: SubscriptionHandler): void => {
        if (!open) throw after(`the subscription ${String(name)}`);
        if (typeof name !== "string" || name === "") {
          throw new TypeError(`${module} registered a subscription whose name is not a non-empty string`);
        }
        if (typeof handler !== "function") {
          throw new TypeError(`${module} registered the subscription ${name} with a handler that is not a function`);
        }
        this.#registrations.push({ kind: "subscription", route: Object.freeze({ module, name, handler }) });
      },
    });
    return Object.freeze({
      registry,
      close: () => {
        open = false;
      },
    });
  }

  /**
   * Refuses the first registration, in registration order, whose method and path (parameters' names aside) or
   * subscription name an earlier one has: `duplicate-api-route`, naming the route as first registered and both modules.
   */
  check(): void {
    const seen = new Map<string, Registration>();
    for (const registration of this.#registrations) {
      const route = registration.kind === "http" ? shapeOf(registration.route) : registration.route.name;
      const key = this.key(registration.kind, registration.route.module, route);
      const first = seen.get(key);
      if (first === undefined) {
        seen.set(key, registration);
        continue;
      }
      const shown = first.kind === "http" ? `${first.route.method} ${first.route.path}` : first.route.name;
      const modules = [first.route.module, registration.route.module];
      const what = first.kind === "http" ? shown : `the subscription ${shown}`;
      const who = modules[0] === modules[1] ? `${modules[0]} registers ${what} twice` : `${modules[0]} and ${modules[1]} both register ${what}`;
      const rule = first.kind === "http" ? "a route is registered once" : "a subscription name is registered once";
      throw new UmbraError("duplicate-api-route", `${who}: ${rule}`, {
        kind: first.kind,
        route: shown,
        modules,
      });
    }
  }

  /** The key two registrations collide on: their kind and route (`module` is the registering module's). */
  protected key(kind: Registration["kind"], _module: string, route: string): string {
    return `${kind} ${route}`;
  }
}

/** Whether `route`'s segments match the request's `segments` (decoded). */
const matches = (route: HttpRoute, segments: readonly string[]): boolean =>
  route.segments.length === segments.length &&
  route.segments.every((segment, index) => !("literal" in segment) || segment.literal === segments[index]);

/** A route's specificity as text — `0` for a literal segment, `1` for a parameter — smaller being more specific. */
const specificity = (route: HttpRoute): string => route.segments.map((segment) => ("param" in segment ? "1" : "0")).join("");

/** The module API over checked routes (see the module comment). */
export class ModuleApi {
  readonly #http: readonly HttpRoute[];
  readonly #subscriptions: readonly SubscriptionRoute[];
  readonly #options: ModuleApiOptions;

  constructor(routes: ApiRoutes, options: ModuleApiOptions) {
    this.#http = routes.http;
    this.#subscriptions = routes.subscriptions;
    this.#options = options;
  }

  /** Answers `request` (see the module comment); never rejects. */
  async answer(request: ApiRequest): Promise<ApiResponse> {
    let segments: string[];
    try {
      segments = request.path === "/" ? [] : request.path.slice(1).split("/").map(decodeURIComponent);
    } catch {
      return apiErrorResponse("invalid-request", "the request path is not valid percent-encoded UTF-8");
    }
    const candidates = request.path.startsWith("/") ? this.#http.filter((route) => matches(route, segments)) : [];
    if (candidates.length === 0) {
      return apiErrorResponse("not-found", `no module API route answers ${request.method} ${request.path}`);
    }
    // Checked routes that match one path with one method differ in a literal against a parameter: one is the most specific.
    const route = candidates
      .filter((candidate) => candidate.method === request.method)
      .reduce<HttpRoute | undefined>(
        (best, candidate) => (best === undefined || specificity(candidate) < specificity(best) ? candidate : best),
        undefined,
      );
    if (route === undefined) {
      const allow = [...new Set(candidates.map((candidate) => candidate.method))].sort().join(", ");
      return apiErrorResponse("method-not-allowed", `${request.path} answers ${allow}, not ${request.method}`, { Allow: allow });
    }
    let body: unknown;
    if (request.method === "POST" && request.body !== undefined && request.body !== "") {
      try {
        body = parseJsonLossless(request.body);
      } catch {
        return apiErrorResponse("invalid-request", "the request body is not JSON");
      }
    }
    const params: Record<string, string> = Object.create(null);
    for (const [name, value] of request.query ?? []) if (!(name in params)) params[name] = value;
    route.segments.forEach((segment, index) => {
      if ("param" in segment) params[segment.param] = segments[index] as string;
    });
    const req = Object.freeze({ params: Object.freeze(params), body });
    try {
      const answered = await this.#options.db.read((read) => this.handle(route, req, read), {
        timeoutMs: this.#options.timeoutMs,
      });
      return this.#encode(answered);
    } catch (error) {
      if (error instanceof UmbraError && error.code === "query-timeout") return apiErrorResponse("query-timeout", error.message);
      // The view of a read before block S (`readChainDataView`), which the handler did not catch. [RN-16]
      if (error instanceof UmbraError && error.code === "no-committed-height") {
        return apiErrorResponse("no-committed-height", error.message);
      }
      this.#report(error, { module: route.module, route: `${route.method} ${route.path}` });
      return apiErrorResponse("internal-error", INTERNAL);
    }
  }

  /**
   * Opens subscription `name` with the subscriber's `args`: `send` gets each value the module emits, until the
   * unsubscribe this returns is called (once; later calls do nothing). Throws an {@link ApiError} — `not-found` for a
   * name no module registered, `internal-error` for a handler that throws or returns no unsubscribe (told to
   * `onError`); an unsubscribe of the module that throws is told to `onError` only.
   */
  subscribe(name: string, args: unknown, send: (value: unknown) => void): () => void {
    const route = this.#subscriptions.find((subscription) => subscription.name === name);
    if (route === undefined) throw new ApiError("not-found", `no subscription is named ${name}`);
    const where = { module: route.module, route: `subscription ${name}` };
    let open = true;
    const failed = (error: unknown): ApiError => {
      open = false;
      this.#report(error, where);
      return new ApiError("internal-error", `the subscription ${name} could not be opened`);
    };
    const emit = (value: unknown): void => {
      if (open) send(value);
    };
    let unsubscribe: unknown;
    try {
      unsubscribe = route.handler(args, emit);
    } catch (error) {
      throw failed(error);
    }
    if (typeof unsubscribe !== "function") {
      throw failed(new Error(`the subscription handler of ${name} returned no unsubscribe function`));
    }
    return () => {
      if (!open) return;
      open = false;
      try {
        (unsubscribe as () => void)();
      } catch (error) {
        this.#report(error, where);
      }
    };
  }

  /** Tells `onError` of `error`; an `onError` that throws is ignored, so nothing it does fails an answer. */
  #report(error: unknown, where: { readonly module: string; readonly route: string }): void {
    try {
      this.#options.onError?.(error, where);
    } catch {
      // The logger's own failure is not the request's.
    }
  }

  /**
   * `route`'s handler called with `req` and `read`, its answer checked and returned as the handler wrote it: the module
   * API adds nothing to it. The listener's `X-Umbra-Version` is set where it sends. Protected for the negative
   * controls, which add the envelope back or set the version here. [RN-16, Q104, Q105, Q131]
   */
  protected async handle(route: HttpRoute, req: Parameters<HttpHandler>[0], read: ReadHandle): Promise<ChainDataAnswer> {
    const answer: unknown = await route.handler(req, read);
    const where = `the handler of ${route.method} ${route.path}`;
    if (typeof answer !== "object" || answer === null) {
      throw new Error(`${where} answered ${answer === null ? "null" : String(answer)}, not { status, headers?, body }`);
    }
    const { status, headers, body } = answer as { status?: unknown; headers?: unknown; body?: unknown };
    if (typeof status !== "number" || !Number.isInteger(status) || status < 200 || status > 599) {
      throw new Error(`${where} answered the status ${String(status)}, not an integer from 200 to 599`);
    }
    if (headers !== undefined) {
      if (typeof headers !== "object" || headers === null || Array.isArray(headers)) {
        throw new Error(`${where} answered headers that are not an object`);
      }
      for (const [name, value] of Object.entries(headers)) {
        if (typeof value !== "string") throw new Error(`${where} answered a header ${name} whose value is not a string`);
        if (!HEADER_NAME.test(name) || !HEADER_VALUE.test(value)) {
          throw new Error(`${where} answered a header ${JSON.stringify(name)} that HTTP cannot carry (RFC 9110 §5)`);
        }
      }
    }
    return { status, headers: { ...(headers as Record<string, string> | undefined) }, body };
  }

  /** `answered` as the transport sends it (see the module comment). */
  #encode(answered: ChainDataAnswer): ApiResponse {
    const headers: Record<string, string> = { ...answered.headers };
    const typed = Object.keys(headers).some((name) => name.toLowerCase() === "content-type");
    const { status, body } = answered;
    if (typed && (typeof body === "string" || body instanceof Uint8Array)) return { status, headers, body };
    const text = encodeJson(body);
    if (text === undefined) return { status, headers, body: "" };
    if (!typed) headers["Content-Type"] = JSON_CONTENT_TYPE;
    return { status, headers, body: text };
  }
}

/** What {@link registerModuleApis} runs over. */
export interface ApiStartup {
  /** The database's resolved graph: `modules` in startup order, and the `ranges` this process may run. */
  readonly graph: Pick<ResolvedGraph, "modules" | "ranges">;
  /** The process contexts, sealed. [MD-7] */
  readonly contexts: ProcessContexts;
}

/**
 * Runs `on-start-api` (see the module comment) into `routes`, then refuses duplicates; resolves with `routes`.
 * [RN-1, RN-15]
 *
 * Rejects with:
 * - the dispatch's `CallbackFailure` (point `on-start-api`, the module) for a callback that fails, a malformed
 *   registration included, and a refused `publish` of the module, caught or not;
 * - the first refused `publish` of the process made meanwhile;
 * - or `duplicate-api-route`.
 */
export async function registerModuleApis(startup: ApiStartup, routes: ApiRoutes = new ApiRoutes()): Promise<ApiRoutes> {
  const { graph, contexts } = startup;
  if (!contexts.sealed) {
    throw new Error("registerModuleApis: on-start-api runs once the process contexts are sealed, after every on-start-db");
  }
  const running = new Set(graph.ranges.flatMap((range) => range.order.map((part) => part.id)));
  await runSchedule(
    seriesOf(
      "on-start-api",
      graph.modules.filter((part) => running.has(part.id)),
    ),
    {
      contextOf: (id) => contexts.of(id),
      invoke: async (part, call) => {
        const registration = routes.open(part.id);
        try {
          await call(registration.registry);
        } finally {
          registration.close();
        }
        const refused = contexts.refusalOf(part.id);
        if (refused !== undefined) throw refused;
      },
    },
  );
  contexts.check();
  routes.check();
  return routes;
}
