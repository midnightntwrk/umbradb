/**
 * Routes over HTTP: how the core serves a module's route (`../modules/route.ts`) through the module API's HTTP
 * handlers (`./module-api.ts`). {@link bindRoute} checks a route as it is registered and gives its catalog entry and
 * its HTTP handler. Another transport binds the same {@link RouteEntry} its own way.
 *
 * **Registration** refuses, with a `TypeError` naming the module and the route:
 * - a name that is not lowerCamelCase, a handler that is not a function, a schema that is not a zod schema or that
 *   wire side JSON cannot carry (`z.toJSONSchema`);
 * - an `http` hint whose method is neither `GET` nor `POST` or whose path does not start with `/`;
 * - a `POST` whose path takes a parameter: a `POST`'s input is its body;
 * - a `GET` whose input is not an object of text, numbers and booleans, or whose path names a parameter the input
 *   lacks: a `GET`'s input is its parameters.
 *
 * **Where.** `/<module-id>` and the hint's path, so two modules' routes cannot clash. Without a hint,
 * `POST /<module-id>/<name>`.
 *
 * **Input.** A `GET`'s input is its parameters, the query's and the path's. They arrive as text: each is read as the
 * type its schema asks for (a number, `true` or `false`), and left as text where the schema takes text or the text is
 * not of that type. A parameter that is text or a number (`"all"` or a count) is read as text first, and as the number
 * if the schema refuses the text. A `POST`'s input is its JSON body, whose numbers are read exactly
 * (`readExactNumber`, `./api-json.ts`), and a parameter sent with it is refused. A name the input schema
 * does not declare is refused at the top level; write nested objects with `z.strictObject` to refuse them there too.
 * Then the schema checks the input. Each refusal is 400 `invalid-request`, whose message names paths and rules, never
 * the values sent: at most three problems, each name and rule cut to a fixed length. A message a schema writes itself
 * (`{ error: … }`) is sent as written, so it must hold nothing of the input.
 *
 * **Answer.** The handler's output is written with the output schema (`z.encode`), which checks it. One it refuses, or
 * that JSON has no value for (`undefined`, a number that is not finite), is a bug in the module: it is thrown, so the
 * module API answers 500 `internal-error` and reports it, and nothing half-right is sent. Otherwise what the schema wrote is sent, as ASCII JSON ({@link encodeAsciiJson}) with
 * {@link JSON_HEADERS}.
 *
 * **Errors.** A `RouteError` is answered with its kind's status ({@link ROUTE_ERROR_STATUS}) in the module API's
 * envelope, `{ "error": { "code", "message" } }`. Any other error is the module API's 500.
 *
 * **One height.** Each answer is read at the latest committed height and carries the chain-data headers
 * (`./envelope.ts`). Before block S commits, a route answers 503 `no-committed-height` without running its handler.
 */

import { z } from "zod";
import { UmbraError } from "../db/errors.js";
import type { ApiRegistry } from "../modules/declaration.js";
import { type AnyRoute, invalidRequest, RouteError, type RouteErrorKind, type RouteHttp } from "../modules/route.js";
import { encodeAsciiJson, readExactNumber } from "./api-json.js";
import { CHAIN_DATA_HEADERS, chainDataHeaders, NO_COMMITTED_HEIGHT_STATUS, readChainDataView } from "./envelope.js";

/** A JSON Schema, as `z.toJSONSchema` writes it. */
export type JsonSchema = Readonly<Record<string, unknown>>;

/** A registered route, as the core keeps it: what any transport needs to serve it and to describe it. */
export interface RouteEntry {
  readonly module: string;
  readonly name: string;
  /** `<module-id>.<name>`: the route's identity on every transport. */
  readonly id: string;
  readonly description?: string;
  /** What a client sends, as JSON Schema: the input schema's wire side. */
  readonly input: JsonSchema;
  /** What a client receives, as JSON Schema: the output schema's wire side. */
  readonly output: JsonSchema;
  /** Where the HTTP adapter serves it: the method and the whole path, `/<module-id>` included. */
  readonly http: RouteHttp;
  /** The declaration itself. */
  readonly route: AnyRoute;
}

/** A route bound to HTTP: its entry, and the handler the module API calls. */
export interface BoundRoute {
  readonly entry: RouteEntry;
  readonly handler: Parameters<ApiRegistry["http"]>[2];
}

/** The HTTP status of each kind of `RouteError`. */
export const ROUTE_ERROR_STATUS: Readonly<Record<RouteErrorKind, number>> = Object.freeze({
  "invalid-argument": 400,
  "not-found": 404,
  "out-of-range": 400,
  "failed-precondition": 400,
  "resource-exhausted": 429,
  unimplemented: 501,
  unavailable: 503,
});

/** The headers of every answer of a route. */
export const JSON_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

/** The most problems one 400 answer lists, and the most characters of a name and of a rule in it. */
const MAX_ERRORS = 3;
const MAX_NAME = 64;
const MAX_RULE = 200;

/** `text`, cut to `most` characters: a client's own names are in a message, never at the length the client chose. */
const clip = (text: string, most: number): string => (text.length > most ? `${text.slice(0, most)}…` : text);
const NAME = /^[a-z][A-Za-z0-9]{0,63}$/;
/** A JSON number, as a `GET` parameter writes one. */
const NUMBER = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?$/;

/** What a `GET` parameter's text may be read as. */
type Scalar = "string" | "number" | "boolean";

type Answer = { status: number; headers: Record<string, string>; body: string };

const answer = (status: number, body: unknown, headers: Record<string, string> = {}): Answer => ({
  status,
  headers: { ...JSON_HEADERS, ...headers },
  body: encodeAsciiJson(body),
});

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/** The scalar types the JSON Schema `schema` takes (`null` aside); undefined when it takes anything else. */
function scalarsOf(schema: unknown): Set<Scalar> | undefined {
  if (!isRecord(schema)) return undefined;
  const out = new Set<Scalar>();
  const add = (type: unknown): boolean => {
    if (type === "string" || type === "number" || type === "boolean") out.add(type);
    else if (type === "integer") out.add("number");
    else if (type !== "null") return false;
    return true;
  };
  const members = [schema.anyOf, schema.oneOf, schema.allOf].flatMap((list) => (Array.isArray(list) ? list : []));
  if (members.length > 0) {
    for (const member of members) {
      const scalars = scalarsOf(member);
      if (scalars === undefined) return undefined;
      for (const scalar of scalars) out.add(scalar);
    }
    return out;
  }
  if (schema.type !== undefined) return (Array.isArray(schema.type) ? schema.type : [schema.type]).every(add) ? out : undefined;
  const values = "const" in schema ? [schema.const] : Array.isArray(schema.enum) ? schema.enum : undefined;
  if (values === undefined) return undefined;
  return values.every((value) => add(value === null ? "null" : typeof value)) ? out : undefined;
}

/**
 * A parameter's `text` as the first of `scalars` it is: text where the schema takes text or it is none of them. A
 * number is read as a body's is (`readExactNumber`): an integer exactly, and text where it would be read as another
 * value, so the schema refuses it.
 */
function coerce(text: string, scalars: ReadonlySet<Scalar>): string | number | bigint | boolean {
  if (scalars.has("string")) return text;
  if (scalars.has("boolean") && (text === "true" || text === "false")) return text === "true";
  if (scalars.has("number") && NUMBER.test(text)) {
    try {
      return readExactNumber(text);
    } catch {
      return text;
    }
  }
  return text;
}

/**
 * The top-level names `schema` declares, when it refuses the others: an object's properties, or those of every member
 * of a union of such objects. Undefined when it takes names it does not declare (`z.looseObject`, `z.record`) or is no
 * object.
 */
function declaredNames(schema: JsonSchema): Set<string> | undefined {
  const members = [schema.anyOf, schema.oneOf].flatMap((list) => (Array.isArray(list) ? list : []));
  if (members.length > 0) {
    const out = new Set<string>();
    for (const member of members) {
      const names = isRecord(member) ? declaredNames(member) : undefined;
      if (names === undefined) return undefined;
      for (const name of names) out.add(name);
    }
    return out;
  }
  if (schema.type !== "object" || !isRecord(schema.properties)) return undefined;
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) return undefined;
  return new Set(Object.keys(schema.properties));
}

/**
 * `error`'s issues as `<where><path>: <rule>`, at most three, each name and rule cut to a fixed length. zod's own rules
 * name paths and types, never the values sent; a message a schema writes itself is given as written.
 */
function issuesOf(error: z.ZodError, where: string): string[] {
  return error.issues
    .slice(0, MAX_ERRORS)
    .map((issue) => `${where}${issue.path.map((part) => `/${clip(String(part), MAX_NAME)}`).join("")}: ${clip(issue.message, MAX_RULE)}`);
}

/**
 * `route`, registered by `module`, checked and bound to HTTP (see the module comment). Throws a `TypeError` for a route
 * that cannot be served.
 */
export function bindRoute(module: string, route: AnyRoute): BoundRoute {
  if (typeof route !== "object" || route === null) throw new TypeError(`${module} registered a route that is not an object`);
  const { name, description, handle } = route;
  if (typeof name !== "string" || !NAME.test(name)) {
    throw new TypeError(`${module} registered a route whose name is not lowerCamelCase (a letter, then up to 63 letters and digits): ${JSON.stringify(name)}`);
  }
  const refuse = (why: string) => new TypeError(`${module} registered the route ${name}, ${why}`);
  if (typeof handle !== "function") throw refuse("whose handle is not a function");
  if (description !== undefined && typeof description !== "string") throw refuse("whose description is not a string");
  const jsonSchemaOf = (side: "input" | "output"): JsonSchema => {
    const schema: unknown = route[side];
    if (!isRecord(schema) || typeof schema.safeParse !== "function" || !("_zod" in schema)) throw refuse(`whose ${side} is not a zod schema`);
    try {
      // A schema's wire side is its input side, whichever way the route uses it.
      return Object.freeze(z.toJSONSchema(schema as unknown as z.ZodType, { io: "input" }));
    } catch (error) {
      const why = error instanceof Error ? error.message : String(error);
      const fix = /default/i.test(why)
        ? "give a bigintText's default on the wire side, .prefault(\"0\")"
        : "for an integer beyond 2^53, use bigintText() or uintText(bits)";
      throw refuse(`whose ${side} schema JSON cannot carry (${why}): ${fix}`);
    }
  };
  const input = jsonSchemaOf("input");
  const output = jsonSchemaOf("output");
  // The schemas as registered: what the catalog describes is what each request is checked against.
  const schemas: { readonly input: z.ZodType; readonly output: z.ZodType } = { input: route.input, output: route.output };

  const hint: unknown = route.http ?? { method: "POST", path: `/${name}` };
  if (!isRecord(hint)) throw refuse("whose http is not { method, path }");
  const { method, path } = hint;
  if (method !== "GET" && method !== "POST") throw refuse(`whose http method is ${String(method)}, neither GET nor POST`);
  if (typeof path !== "string" || !path.startsWith("/")) throw refuse(`whose http path does not start with /: ${JSON.stringify(path)}`);
  const pathParameters = path
    .split("/")
    .filter((segment) => segment.startsWith(":"))
    .map((segment) => segment.slice(1));
  /** A `GET`'s parameters: what each one's text may be read as. */
  const parameters = new Map<string, ReadonlySet<Scalar>>();
  /** What a parameter that is text or something else is read as when it is not taken as text. */
  const withoutText = (scalars: ReadonlySet<Scalar>): ReadonlySet<Scalar> => new Set([...scalars].filter((scalar) => scalar !== "string"));
  if (method === "POST") {
    if (pathParameters.length > 0) throw refuse(`whose POST path takes the parameter ${pathParameters[0]}: a POST's input is its body, so use GET or put it in the body`);
  } else {
    if (input.type !== "object" || !isRecord(input.properties)) throw refuse("whose input is not an object: a GET's input is its parameters, so use POST");
    for (const [key, property] of Object.entries(input.properties)) {
      const scalars = scalarsOf(property);
      if (scalars === undefined) throw refuse(`whose input ${key} a GET's parameters cannot carry (text, numbers and booleans only): use POST`);
      parameters.set(key, scalars);
    }
    const missing = pathParameters.find((parameter) => !parameters.has(parameter));
    if (missing !== undefined) throw refuse(`whose path names the parameter ${missing}, which its input schema lacks`);
  }
  const declared = declaredNames(input);
  const id = `${module}.${name}`;
  const entry: RouteEntry = Object.freeze({
    module,
    name,
    id,
    ...(description === undefined ? {} : { description }),
    input,
    output,
    http: Object.freeze({ method, path: path === "/" ? `/${module}` : `/${module}${path}` }),
    route,
  });

  /** The request's input as the schema read it; throws the 400 for one it refuses. */
  const inputOf = (request: { params: Record<string, string>; body: unknown }): unknown => {
    const sent = Object.keys(request.params);
    if (method === "POST" && sent.length > 0) throw invalidRequest("input: a POST route takes its input in its JSON body, not in parameters");
    const named = method === "GET" ? sent : isRecord(request.body) ? Object.keys(request.body) : [];
    const unknown = declared === undefined ? [] : named.filter((key) => !declared.has(key));
    if (unknown.length > 0) {
      throw invalidRequest(unknown.slice(0, MAX_ERRORS).map((key) => `input/${clip(key, MAX_NAME)}: not an input of this route`).join("; "));
    }
    if (method === "POST") {
      const parsed = schemas.input.safeParse(request.body);
      if (parsed.success) return parsed.data;
      throw invalidRequest(request.body === undefined ? "input: a JSON body is required" : issuesOf(parsed.error, "input").join("; "));
    }
    /** The parameters, each read as its schema's type; those of `asOther` not as text, where the schema also takes text. */
    const read = (asOther: ReadonlySet<string>): Record<string, unknown> => {
      const out: Record<string, unknown> = {};
      for (const key of sent) {
        const text = request.params[key] as string;
        const scalars = parameters.get(key);
        const value = scalars === undefined ? text : coerce(text, asOther.has(key) ? withoutText(scalars) : scalars);
        // Defined, not assigned: a parameter named `__proto__` is a property like any other.
        Object.defineProperty(out, key, { value, enumerable: true, writable: true, configurable: true });
      }
      return out;
    };
    const parsed = schemas.input.safeParse(read(new Set()));
    if (parsed.success) return parsed.data;
    // A parameter the schema takes as text or as a number ("all" or a count) was read as text. Where the schema refused
    // that text, read it as the other type and ask again.
    const refused = new Set(parsed.error.issues.map((issue) => String(issue.path[0])));
    const retry = new Set(sent.filter((key) => refused.has(key) && (parameters.get(key)?.has("string") ?? false) && (parameters.get(key)?.size ?? 0) > 1));
    if (retry.size > 0) {
      const again = schemas.input.safeParse(read(retry));
      if (again.success) return again.data;
    }
    throw invalidRequest(issuesOf(parsed.error, "input").join("; "));
  };

  /** The handler's `result` as the output schema writes it. */
  const write = (result: unknown) => {
    try {
      return z.safeEncode(schemas.output, result as never);
    } catch (error) {
      // What is no issue of the value: a transform, which reads one way only.
      const why = error instanceof Error ? error.message : String(error);
      throw new Error(`the route ${id}'s output schema cannot write an answer (${why}): an output takes a codec, never a transform`);
    }
  };

  const handler: BoundRoute["handler"] = async (request, read) => {
    let view: Awaited<ReturnType<typeof readChainDataView>>;
    try {
      view = await readChainDataView(read);
    } catch (error) {
      if (!(error instanceof UmbraError && error.code === "no-committed-height")) throw error;
      return answer(NO_COMMITTED_HEIGHT_STATUS, { error: { code: error.code, message: error.message } });
    }
    const headers = chainDataHeaders(view);
    try {
      const context = Object.freeze({ read, height: view.height, hash: headers[CHAIN_DATA_HEADERS.hash] as string });
      const result = await handle.call(route, inputOf(request), context);
      const written = write(result);
      if (!written.success) {
        throw new Error(`the route ${id} built an answer its output schema refuses: ${issuesOf(written.error, "answer").join("; ")}`);
      }
      try {
        return answer(200, written.data, headers);
      } catch (error) {
        // What the schema took and JSON has no value for: `undefined`, or a number that is not finite.
        const why = error instanceof Error ? error.message : String(error);
        throw new Error(`the route ${id} built an answer JSON cannot carry (${why}): an output is a JSON value, null where there is none`);
      }
    } catch (error) {
      if (error instanceof RouteError) return answer(ROUTE_ERROR_STATUS[error.kind], { error: { code: error.code, message: error.message } }, headers);
      throw error;
    }
  };
  return Object.freeze({ entry, handler });
}
