import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { ReadHandle } from "../../src/db/api.js";
import { bigintText, uintText } from "../../src/helpers/bigint-text.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";
import { defineRoute, invalidRequest, ROUTE_ERROR_KINDS, type Route, RouteError } from "../../src/modules/route.js";
import { type ApiRequest, type ApiResponse, ApiRoutes, ModuleApi } from "../../src/runner/module-api.js";
import { JSON_HEADERS, ROUTE_ERROR_STATUS } from "../../src/runner/route-http.js";

/**
 * Routes (`src/modules/route.ts`) registered with `api.route` and served by the module API without a listener
 * (`ApiRoutes`, `ModuleApi.answer`, `src/runner/route-http.ts`), over a stand-in database:
 * - registration: where a route is served, the catalog the core keeps, and every route it refuses;
 * - input: a `GET`'s parameters read as the types the schema asks for, a `POST`'s body, names the schema lacks;
 * - output: checked, sent as the schema parsed it, never sent when refused;
 * - errors: each kind's status, and any other error as the module API's 500;
 * - one height, the context, the headers and ASCII JSON.
 *
 * Through the real process and its HTTP listener: `test/helpers/routes.process.test.ts`.
 */

const HASH = new Uint8Array(32).fill(0xab);
const HEX = `0x${"ab".repeat(32)}`;

/** A module API over `register`'s registrations of module `m`, reading at committed `height` (null: before S). */
function apiOf(register: (api: ApiRegistry) => void, height: bigint | null = 7n) {
  const routes = new ApiRoutes();
  const registration = routes.open("m");
  register(registration.registry);
  registration.close();
  routes.check();
  const read: ReadHandle = Object.freeze({ height, query: async () => [{ hash: HASH }] });
  const errors: unknown[] = [];
  const api = new ModuleApi(routes, {
    db: { read: (body) => body(read) },
    timeoutMs: 1_000,
    onError: (error) => void errors.push(error),
  });
  return { routes, api, errors, read };
}

const request = (method: string, path: string, rest: Partial<ApiRequest> = {}): ApiRequest => ({ method, path, ...rest });
const get = (path: string, query: Record<string, string> = {}) => request("GET", path, { query: Object.entries(query) });
const post = (path: string, body: unknown) => request("POST", path, { body: JSON.stringify(body) });
const json = (response: ApiResponse): any => JSON.parse(response.body as string);
const error = (response: ApiResponse) => [response.status, json(response).error.code, json(response).error.message];

/** What `register` throws. */
function refusal(register: (api: ApiRegistry) => void): string {
  try {
    apiOf(register);
  } catch (thrown) {
    expect(thrown).toBeInstanceOf(TypeError);
    return (thrown as Error).message;
  }
  throw new Error("expected the registration to be refused");
}

const Greeting = z.strictObject({ greeting: z.string() });
const hello = (handle: Route<z.ZodObject<{ name: z.ZodString }>, typeof Greeting>["handle"]) =>
  defineRoute({ name: "hello", input: z.object({ name: z.string().max(8) }), output: Greeting, handle });

describe("api.route: registration", () => {
  it("serves a route without an http hint at POST /<module-id>/<name>, and one with a hint under /<module-id>", async () => {
    const { api, routes } = apiOf((registry) => {
      registry.route(hello(async ({ name }) => ({ greeting: `hello ${name}` })));
      registry.route(
        defineRoute({
          name: "getBlock",
          input: z.object({ height: z.int() }),
          output: z.object({ height: z.int() }),
          http: { method: "GET", path: "/v1/blocks/:height" },
          handle: async ({ height }) => ({ height }),
        }),
      );
    });
    expect(routes.http.map(({ module, method, path }) => [module, method, path])).toEqual([
      ["m", "POST", "/m/hello"],
      ["m", "GET", "/m/v1/blocks/:height"],
    ]);
    expect(json(await api.answer(post("/m/hello", { name: "a" })))).toEqual({ greeting: "hello a" });
    expect(json(await api.answer(get("/m/v1/blocks/5")))).toEqual({ height: 5 });
    expect((await api.answer(post("/hello", { name: "a" }))).status).toBe(404);
  });

  it("keeps each route in the catalog: its identity, its schemas as JSON Schema, where HTTP serves it, the declaration", () => {
    const route = defineRoute({
      name: "getBlock",
      description: "One block.",
      input: z.object({ height: z.int().min(0), full: z.boolean().optional() }),
      output: z.strictObject({ hash: z.string() }),
      http: { method: "GET", path: "/v1/blocks/:height" },
      handle: async () => ({ hash: "" }),
    });
    const [entry, ...rest] = apiOf((registry) => registry.route(route)).routes.routes;
    expect(rest).toEqual([]);
    expect(entry).toMatchObject({
      module: "m",
      name: "getBlock",
      id: "m.getBlock",
      description: "One block.",
      http: { method: "GET", path: "/m/v1/blocks/:height" },
      input: { type: "object", required: ["height"], properties: { height: { type: "integer", minimum: 0 }, full: { type: "boolean" } } },
      output: { type: "object", required: ["hash"], properties: { hash: { type: "string" } }, additionalProperties: false },
    });
    expect(entry?.route).toBe(route);
  });

  it("refuses a route that cannot be served, naming the module and the route", () => {
    const ok = { name: "r", input: z.object({}), output: z.object({}), handle: async () => ({}) };
    const refused = (route: unknown) => refusal((registry) => registry.route(route as Route));
    for (const name of ["", "Hello", "get-block", "1a", "a".repeat(65), 5]) expect(refused({ ...ok, name })).toMatch(/^m registered a route whose name is not lowerCamelCase/);
    expect(refused(null)).toBe("m registered a route that is not an object");
    expect(refused({ ...ok, handle: 1 })).toBe("m registered the route r, whose handle is not a function");
    expect(refused({ ...ok, input: { type: "object" } })).toBe("m registered the route r, whose input is not a zod schema");
    expect(refused({ ...ok, output: undefined })).toBe("m registered the route r, whose output is not a zod schema");
    expect(refused({ ...ok, input: z.object({ h: z.bigint() }) })).toMatch(/^m registered the route r, whose input schema JSON cannot carry \(BigInt/);
    expect(refused({ ...ok, output: z.object({ h: z.bigint() }) })).toMatch(/whose output schema JSON cannot carry \(BigInt.*use bigintText\(\) or uintText\(bits\)$/);
    expect(refused({ ...ok, output: z.object({ d: z.date() }) })).toMatch(/^m registered the route r, whose output schema JSON cannot carry \(Date/);
    expect(refused({ ...ok, http: { method: "PUT", path: "/r" } })).toMatch(/whose http method is PUT, neither GET nor POST$/);
    expect(refused({ ...ok, http: { method: "GET", path: "r" } })).toMatch(/whose http path does not start with \/: "r"$/);
    expect(refused({ ...ok, http: { method: "GET", path: "/a b" } })).toMatch(/^m registered GET \/m\/a b, which is not a path/);
  });

  it("refuses a POST whose path takes a parameter, and a GET whose input its parameters cannot carry", () => {
    const base = { name: "r", output: z.object({}), handle: async () => ({}) };
    const refused = (route: unknown) => refusal((registry) => registry.route(route as Route));
    expect(refused({ ...base, input: z.object({ id: z.string() }), http: { method: "POST", path: "/things/:id" } })).toMatch(
      /whose POST path takes the parameter id: a POST's input is its body/,
    );
    const getting = (input: z.ZodType, path = "/r") => refused({ ...base, input, http: { method: "GET", path } });
    expect(getting(z.string())).toMatch(/whose input is not an object: a GET's input is its parameters, so use POST$/);
    expect(getting(z.union([z.object({ a: z.string() }), z.object({ b: z.string() })]))).toMatch(/whose input is not an object/);
    for (const field of [z.array(z.string()), z.object({ x: z.string() }), z.unknown(), z.union([z.string(), z.array(z.string())])]) {
      expect(getting(z.object({ list: field }))).toMatch(/whose input list a GET's parameters cannot carry \(text, numbers and booleans only\): use POST$/);
    }
    expect(getting(z.object({ a: z.string() }), "/r/:id")).toMatch(/whose path names the parameter id, which its input schema lacks$/);
  });

  it("types a handler by its schemas: one that takes less than the input schema reads does not compile", () => {
    const input = z.object({ kind: z.enum(["one", "two"]) });
    const output = z.object({ kind: z.string() });
    defineRoute({ name: "ok", input, output, handle: async ({ kind }) => ({ kind }) });
    // @ts-expect-error a handler of { kind: "one" } cannot take the "two" the schema reads
    defineRoute({ name: "narrow", input, output, handle: async (given: { kind: "one" }) => ({ kind: given.kind }) });
    // @ts-expect-error an answer the output schema does not write
    defineRoute({ name: "wrong", input, output, handle: async () => ({ kind: 1 }) });
  });

  it("refuses a name the module registered already, and a path another registration has", () => {
    const route = hello(async () => ({ greeting: "" }));
    expect(refusal((registry) => (registry.route(route), registry.route({ ...route, http: { method: "POST", path: "/other" } })))).toBe(
      "m registered the route hello twice: a route's name is registered once",
    );
    expect(() => apiOf((registry) => (registry.route(route), registry.http("POST", "/m/hello", async () => ({ status: 200, body: null }))))).toThrow(
      /m registers POST \/m\/hello twice/,
    );
    let kept: ApiRegistry | undefined;
    apiOf((registry) => void (kept = registry));
    expect(() => (kept as ApiRegistry).route(route)).toThrow(/m registered the route hello after its on-start-api callback ended/);
  });

  it("gives two modules their own namespace: one name, two routes", async () => {
    const routes = new ApiRoutes();
    for (const module of ["a", "b"]) {
      const registration = routes.open(module);
      registration.registry.route(hello(async () => ({ greeting: module })));
      registration.close();
    }
    routes.check();
    expect(routes.routes.map((entry) => [entry.id, entry.http.path])).toEqual([
      ["a.hello", "/a/hello"],
      ["b.hello", "/b/hello"],
    ]);
  });
});

describe("a route's input", () => {
  const seen: unknown[] = [];
  const find = defineRoute({
    name: "find",
    input: z.object({
      height: z.int().min(0),
      limit: z.int().min(1).max(50).default(10),
      full: z.boolean().optional(),
      ratio: z.number().optional(),
      kind: z.union([z.literal(1), z.literal(2)]).optional(),
      mode: z.enum(["a", "b"]).optional(),
      id: z.union([z.string(), z.int()]).optional(),
      text: z.string().optional(),
    }),
    output: z.object({}),
    http: { method: "GET", path: "/find/:height" },
    handle: async (input) => (seen.push(input), {}),
  });
  const asked = async (path: string, query: Record<string, string> = {}) => {
    seen.length = 0;
    const response = await apiOf((registry) => registry.route(find)).api.answer(get(path, query));
    return response.status === 200 ? seen[0] : error(response);
  };

  it("reads a GET's parameters, path and query, as the types the schema asks for", async () => {
    expect(await asked("/m/find/12", { limit: "5", full: "true", ratio: "-0.5e1", kind: "2", mode: "b" })).toEqual({
      height: 12,
      limit: 5,
      full: true,
      ratio: -5,
      kind: 2,
      mode: "b",
    });
    expect(await asked("/m/find/0", { full: "false" })).toEqual({ height: 0, limit: 10, full: false });
  });

  it("leaves text as text where the schema takes text, digits included", async () => {
    expect(await asked("/m/find/1", { text: "007", id: "42", mode: "a" })).toEqual({ height: 1, limit: 10, text: "007", id: "42", mode: "a" });
  });

  it("refuses text that is not the type asked for with 400 invalid-request, naming the path and the rule, never the value", async () => {
    for (const height of ["x", "01", "1.5", "0x10", " 1", "1e999", "9007199254740993", "-1"]) {
      const [status, code, message] = (await asked(`/m/find/${encodeURIComponent(height)}`)) as [number, string, string];
      expect([height, status, code]).toEqual([height, 400, "invalid-request"]);
      expect(message).toMatch(/^input\/height: (Invalid input: expected (number|int), received (string|number|bigint)|Too small: expected number to be >=0)$/);
    }
    expect(await asked("/m/find/1", { full: "yes" })).toEqual([400, "invalid-request", "input/full: Invalid input: expected boolean, received string"]);
    expect(await asked("/m/find/1", { limit: "51" })).toEqual([400, "invalid-request", "input/limit: Too big: expected number to be <=50"]);
  });

  it("refuses a parameter the schema does not declare, naming it, and lists at most three problems", async () => {
    expect(await asked("/m/find/1", { hieght: "secret-value" })).toEqual([400, "invalid-request", "input/hieght: not an input of this route"]);
    const [, , many] = (await asked("/m/find/1", { a: "1", b: "2", c: "3", d: "4" })) as [number, string, string];
    expect(many.split("; ")).toHaveLength(3);
    expect(await asked("/m/find/1", Object.fromEntries([["__proto__", "x"]]))).toEqual([400, "invalid-request", "input/__proto__: not an input of this route"]);
  });

  it("reads a parameter that is text or a number as the text first, and as the number when the schema refuses the text", async () => {
    const page = defineRoute({
      name: "page",
      input: z.object({ size: z.union([z.literal("all"), z.int().min(1)]), from: z.union([z.literal("start"), z.int()]).optional(), note: z.string().optional() }),
      output: z.object({}),
      http: { method: "GET", path: "/page" },
      handle: async (input) => (seen.push(input), {}),
    });
    const { api: served } = apiOf((registry) => registry.route(page));
    for (const [query, read] of [
      [{ size: "all" }, { size: "all" }],
      [{ size: "5" }, { size: 5 }],
      [{ size: "5", from: "start", note: "7" }, { size: 5, from: "start", note: "7" }],
      [{ size: "all", from: "-3" }, { size: "all", from: -3 }],
    ] as const) {
      seen.length = 0;
      expect([(await served.answer(get("/m/page", query))).status, seen]).toEqual([200, [read]]);
    }
    expect(error(await served.answer(get("/m/page", { size: "0" })))).toEqual([400, "invalid-request", "input/size: Invalid input"]);
    expect(error(await served.answer(get("/m/page", { size: "some" })))[0]).toBe(400);
  });

  it("cuts a client's own names and a rule to a fixed length, so an answer is never as long as the client chose", async () => {
    const strict = defineRoute({ name: "strict", input: z.object({ inner: z.strictObject({ n: z.int() }), map: z.record(z.string(), z.int()).optional() }), output: z.object({}), handle: async () => ({}) });
    const { api: served } = apiOf((registry) => registry.route(strict));
    const long = "k".repeat(200_000);
    const top = await served.answer(post("/m/strict", { [long]: 1 }));
    expect(error(top)).toEqual([400, "invalid-request", `input/${"k".repeat(64)}…: not an input of this route`]);
    const nested = await served.answer(post("/m/strict", { inner: { n: 1, ...Object.fromEntries(Array.from({ length: 5_000 }, (_, i) => [`key${i}`, 1])) } }));
    expect([nested.status, String(nested.body).length < 400]).toEqual([400, true]);
    const path = await served.answer(post("/m/strict", { inner: { n: 1 }, map: { [long]: "x" } }));
    expect(error(path)).toEqual([400, "invalid-request", `input/map/${"k".repeat(64)}…: Invalid input: expected number, received string`]);
  });

  it("sends a message a schema writes itself as written: it is the schema's to keep the input out of", async () => {
    const own = defineRoute({ name: "own", input: z.object({ word: z.string().refine((word) => word === "open", { error: "the word is wrong" }) }), output: z.object({}), handle: async () => ({}) });
    const { api: served } = apiOf((registry) => registry.route(own));
    expect(error(await served.answer(post("/m/own", { word: "secret-value" })))).toEqual([400, "invalid-request", "input/word: the word is wrong"]);
  });

  it("lets the path's parameter win over a query parameter of its name", async () => {
    expect(await asked("/m/find/3", { height: "9" })).toMatchObject({ height: 3 });
  });

  it("gives a loose object's undeclared parameters to the handler as text", async () => {
    const loose = defineRoute({ name: "loose", input: z.looseObject({ n: z.int() }), output: z.object({}), http: { method: "GET", path: "/loose" }, handle: async (input) => (seen.push(input), {}) });
    seen.length = 0;
    expect((await apiOf((registry) => registry.route(loose)).api.answer(get("/m/loose", { n: "1", other: "2" }))).status).toBe(200);
    expect(seen).toEqual([{ n: 1, other: "2" }]);
  });

  it("takes a POST's JSON body as it is, and refuses what the schema refuses without running the handler", async () => {
    let ran = 0;
    const { api } = apiOf((registry) => registry.route(hello(async ({ name }) => (ran++, { greeting: name }))));
    expect(json(await api.answer(post("/m/hello", { name: "a" })))).toEqual({ greeting: "a" });
    expect(error(await api.answer(post("/m/hello", { name: "secret-value-123" })))).toEqual([400, "invalid-request", "input/name: Too big: expected string to have <=8 characters"]);
    expect(error(await api.answer(post("/m/hello", { name: 5 })))).toEqual([400, "invalid-request", "input/name: Invalid input: expected string, received number"]);
    expect(error(await api.answer(post("/m/hello", { name: "a", other: "secret-value-456" })))).toEqual([400, "invalid-request", "input/other: not an input of this route"]);
    expect(error(await api.answer(request("POST", "/m/hello")))).toEqual([400, "invalid-request", "input: a JSON body is required"]);
    expect(error(await api.answer(post("/m/hello", [1])))[0]).toBe(400);
    expect(ran).toBe(1);
  });

  it("refuses a parameter sent with a POST: its input is its body", async () => {
    const { api } = apiOf((registry) => registry.route(hello(async () => ({ greeting: "" }))));
    const response = await api.answer(request("POST", "/m/hello", { body: '{"name":"a"}', query: [["name", "b"]] }));
    expect(error(response)).toEqual([400, "invalid-request", "input: a POST route takes its input in its JSON body, not in parameters"]);
  });

  it("refuses an undeclared name of a union of objects at the top level, and leaves nested objects to the schema", async () => {
    const select = defineRoute({
      name: "select",
      input: z.union([z.strictObject({ colors: z.array(z.string()) }), z.strictObject({ contract: z.string(), page: z.object({ limit: z.int() }).optional() })]),
      output: z.object({}),
      handle: async (input) => (seen.push(input), {}),
    });
    const { api } = apiOf((registry) => registry.route(select));
    expect(error(await api.answer(post("/m/select", { colours: ["a"] })))).toEqual([400, "invalid-request", "input/colours: not an input of this route"]);
    seen.length = 0;
    expect((await api.answer(post("/m/select", { contract: "c", page: { limit: 1, extra: 2 } }))).status).toBe(200);
    expect(seen).toEqual([{ contract: "c", page: { limit: 1 } }]);
  });

  it("gives the handler what the schema parsed: defaults filled, transforms applied", async () => {
    const route = defineRoute({
      name: "parsed",
      input: z.object({ amount: z.string().regex(/^[0-9]+$/).transform(BigInt), limit: z.int().default(3) }),
      output: z.object({}),
      handle: async (input) => (seen.push(input), {}),
    });
    seen.length = 0;
    await apiOf((registry) => registry.route(route)).api.answer(post("/m/parsed", { amount: "18446744073709551616" }));
    expect(seen).toEqual([{ amount: 18446744073709551616n, limit: 3 }]);
  });
});

describe("a route's answer", () => {
  it("is ASCII JSON with the fixed headers and the chain-data headers of the height it read", async () => {
    const { api } = apiOf((registry) => registry.route(hello(async ({ name }) => ({ greeting: `héllo ${name} 😀` }))));
    const response = await api.answer(post("/m/hello", { name: "<a>&" }));
    expect(response.status).toBe(200);
    expect(response.body).toBe('{"greeting":"h\\u00e9llo \\u003ca\\u003e\\u0026 \\ud83d\\ude00"}');
    expect(response.body).toMatch(/^[\x20-\x7e]*$/);
    expect(json(response)).toEqual({ greeting: "héllo <a>& 😀" });
    expect(response.headers).toEqual({ ...JSON_HEADERS, "X-Umbra-View": "finalized", "X-Umbra-Height": "7", "X-Umbra-Hash": HEX });
  });

  it("gives the handler the request's read, its committed height and that block's hash as hex text", async () => {
    const contexts: unknown[] = [];
    const { api, read } = apiOf((registry) => registry.route(hello(async (_input, context) => (contexts.push(context), { greeting: "" }))));
    await api.answer(post("/m/hello", { name: "a" }));
    expect(contexts).toEqual([{ read, height: 7n, hash: HEX }]);
    expect(Object.isFrozen(contexts[0])).toBe(true);
  });

  it("is sent as the output schema parsed it: a field the schema does not declare is left out", async () => {
    const row = { a: 1, secretColumn: "x", nested: { b: "y", other: "z" } };
    const route = defineRoute({
      name: "row",
      input: z.object({}),
      output: z.object({ a: z.int(), nested: z.object({ b: z.string() }) }),
      handle: async () => row,
    });
    const response = await apiOf((registry) => registry.route(route)).api.answer(post("/m/row", {}));
    expect(json(response)).toEqual({ a: 1, nested: { b: "y" } });
  });

  it("is never sent when the output schema refuses it: the module API's 500, the error told to onError", async () => {
    const { api, errors } = apiOf((registry) => registry.route(hello(async () => ({ greeting: 42, leaked: "secret-answer" }) as never)));
    const response = await api.answer(post("/m/hello", { name: "a" }));
    expect(error(response)).toEqual([500, "internal-error", "the module API could not answer the request"]);
    expect(String(response.body)).not.toContain("secret-answer");
    expect(errors).toHaveLength(1);
    expect((errors[0] as Error).message).toBe(
      'the route m.hello built an answer its output schema refuses: answer/greeting: Invalid input: expected string, received number; answer: Unrecognized key: "leaked"',
    );
  });

  it("is never sent when JSON has no value for it: undefined, or a number that is not finite", async () => {
    for (const [output, result] of [
      [z.string().optional(), undefined],
      [z.array(z.string().optional()), [undefined]],
      [z.object({ list: z.array(z.unknown()) }), { list: [Number.NaN] }],
      [z.unknown(), Number.POSITIVE_INFINITY],
    ] as const) {
      const route = defineRoute({ name: "none", input: z.object({}), output: output as z.ZodType, handle: async () => result });
      const { api: served, errors } = apiOf((registry) => registry.route(route));
      expect(error(await served.answer(post("/m/none", {})))).toEqual([500, "internal-error", "the module API could not answer the request"]);
      expect((errors[0] as Error).message).toMatch(/^the route m\.none built an answer JSON cannot carry \(JSON has no value for (undefined|NaN|Infinity)\): an output is a JSON value, null where there is none$/);
    }
    const optional = defineRoute({ name: "some", input: z.object({}), output: z.object({ a: z.string().optional(), b: z.null() }), handle: async () => ({ a: undefined, b: null }) });
    expect((await apiOf((registry) => registry.route(optional)).api.answer(post("/m/some", {}))).body).toBe('{"b":null}');
  });

  it("is never sent through an output transform, which reads one way only: the module API's 500, naming the fix", async () => {
    const route = defineRoute({ name: "oneWay", input: z.object({}), output: z.object({ n: z.string().transform(Number) }), handle: async () => ({ n: 1 }) });
    const { api, errors } = apiOf((registry) => registry.route(route));
    expect(error(await api.answer(post("/m/oneWay", {})))[0]).toBe(500);
    expect((errors[0] as Error).message).toMatch(/^the route m\.oneWay's output schema cannot write an answer \(.*\): an output takes a codec, never a transform$/);
  });

  it("is 503 no-committed-height before any height commits, with the fixed headers and without running the handler", async () => {
    let ran = false;
    const { api } = apiOf((registry) => registry.route(hello(async () => ((ran = true), { greeting: "" }))), null);
    const response = await api.answer(post("/m/hello", { name: "a" }));
    expect([response.status, json(response).error.code, ran]).toEqual([503, "no-committed-height", false]);
    expect(response.headers).toEqual(JSON_HEADERS);
  });
});

describe("a route's errors", () => {
  it("answers a RouteError with its kind's status, in the module API's envelope, with the headers", async () => {
    expect(Object.keys(ROUTE_ERROR_STATUS)).toEqual([...ROUTE_ERROR_KINDS]);
    expect(ROUTE_ERROR_STATUS).toEqual({
      "invalid-argument": 400,
      "not-found": 404,
      "out-of-range": 400,
      "failed-precondition": 400,
      "resource-exhausted": 429,
      unimplemented: 501,
      unavailable: 503,
    });
    for (const kind of ROUTE_ERROR_KINDS) {
      const { api, errors } = apiOf((registry) => registry.route(hello(async () => Promise.reject(new RouteError(kind, "my-code", "my message")))));
      const response = await api.answer(post("/m/hello", { name: "a" }));
      expect([response.status, json(response)]).toEqual([ROUTE_ERROR_STATUS[kind], { error: { code: "my-code", message: "my message" } }]);
      expect(response.headers).toMatchObject({ ...JSON_HEADERS, "X-Umbra-Height": "7" });
      expect(errors).toEqual([]);
    }
  });

  it("answers any other error as the module API's 500, telling the client nothing of it", async () => {
    const broken = new Error("password=hunter2");
    const { api, errors } = apiOf((registry) => registry.route(hello(async () => Promise.reject(broken))));
    const response = await api.answer(post("/m/hello", { name: "a" }));
    expect(error(response)).toEqual([500, "internal-error", "the module API could not answer the request"]);
    expect(errors).toEqual([broken]);
  });

  it("a RouteError names a kind and a code; invalidRequest is the invalid-argument the module API's own 400 code names", () => {
    expect(() => new RouteError("teapot" as never, "c", "m")).toThrow(TypeError);
    expect(() => new RouteError(404 as never, "c", "m")).toThrow(TypeError);
    expect(() => new RouteError("not-found", "", "m")).toThrow(TypeError);
    const refused = invalidRequest("input: wrong");
    expect([refused.kind, refused.code, refused.message, refused.name]).toEqual(["invalid-argument", "invalid-request", "input: wrong", "RouteError"]);
  });
});

describe("integers beyond 2^53: bigintText and uintText", () => {
  const BIG = 2n ** 127n;
  const seen: unknown[] = [];
  const balance = defineRoute({
    name: "balance",
    input: z.object({ above: uintText(128), delta: bigintText().optional() }),
    output: z.strictObject({ amount: uintText(128), deltas: z.array(bigintText()) }),
    http: { method: "GET", path: "/balance/:above" },
    handle: async (input) => (seen.push(input), { amount: input.above + 1n, deltas: [input.delta ?? 0n, -BIG] }),
  });
  const send = defineRoute({ name: "send", input: z.object({ amount: uintText(64) }), output: z.object({ amount: uintText(64) }), handle: async (input) => (seen.push(input), input) });
  const api = () => ((seen.length = 0), apiOf((registry) => (registry.route(balance), registry.route(send))));

  it("give the handler a bigint from a GET's text, and send a bigint as digits in a string", async () => {
    const response = await api().api.answer(get(`/m/balance/${BIG}`, { delta: "-5" }));
    expect(seen).toEqual([{ above: BIG, delta: -5n }]);
    expect(response.body).toBe(`{"amount":"${BIG + 1n}","deltas":["-5","-${BIG}"]}`);
  });

  it("take a POST's integer as digits in a string or as a JSON number of any size, and always send a string", async () => {
    const { api: served } = api();
    for (const [body, amount] of [
      ['{"amount":"18446744073709551615"}', 18446744073709551615n],
      ['{"amount":18446744073709551615}', 18446744073709551615n],
      ['{"amount":7}', 7n],
      ['{"amount":"0"}', 0n],
    ] as const) {
      seen.length = 0;
      const response = await served.answer(request("POST", "/m/send", { body }));
      expect([body, seen, response.body]).toEqual([body, [{ amount }], `{"amount":"${amount}"}`]);
    }
  });

  it("refuse what is no integer of the range with 400 invalid-request, naming the rule", async () => {
    const { api: served } = api();
    const refused = [400, "invalid-request", "input/amount: expected an integer from 0 to 2^64 - 1, as digits in a string or as a JSON number"];
    for (const body of ['{"amount":"18446744073709551616"}', '{"amount":18446744073709551616}', '{"amount":-1}', '{"amount":"-1"}', '{"amount":"01"}', '{"amount":"1.0"}', '{"amount":1.5}', '{"amount":1e30}', '{"amount":""}', '{"amount":null}', '{"amount":true}', "{}"]) {
      expect([body, ...error(await served.answer(request("POST", "/m/send", { body })))]).toEqual([body, ...refused]);
    }
    expect(error(await served.answer(get("/m/balance/x")))).toEqual([400, "invalid-request", "input/above: expected an integer from 0 to 2^128 - 1, as digits in a string or as a JSON number"]);
    expect(error(await served.answer(get("/m/balance/1", { delta: "1.0000000000000001" })))).toEqual([400, "invalid-request", "input/delta: expected an integer of at most 78 digits, as digits in a string or as a JSON number"]);
    expect(seen).toEqual([]);
  });

  it("check the handler's bigint on the way out: one outside the range, or no bigint, is the module API's 500", async () => {
    for (const amount of [-1n, 2n ** 64n, 5, "5"]) {
      const wrong = defineRoute({ name: "wrong", input: z.object({}), output: z.object({ amount: uintText(64) }), handle: async () => ({ amount }) as never });
      const { api: served, errors } = apiOf((registry) => registry.route(wrong));
      expect([String(amount), error(await served.answer(post("/m/wrong", {})))[0]]).toEqual([String(amount), 500]);
      expect((errors[0] as Error).message).toMatch(/^the route m\.wrong built an answer its output schema refuses: answer\/amount: /);
    }
  });

  it("read a JSON number exactly however it is written, and refuse one that would be read as another value", async () => {
    const any = defineRoute({ name: "any", input: z.object({ n: bigintText() }), output: z.object({ n: bigintText() }), handle: async (input) => input });
    const { api: served } = apiOf((registry) => registry.route(any));
    const sent = (n: string) => served.answer(request("POST", "/m/any", { body: `{"n":${n}}` }));
    for (const [n, read] of [
      ["9007199254740993", "9007199254740993"],
      ["9007199254740993.0", "9007199254740993"],
      ["9007199254740993e0", "9007199254740993"],
      ["1e30", "1000000000000000000000000000000"],
      ["12.50e1", "125"],
      ["-0.0", "0"],
      ["5", "5"],
    ] as const) {
      expect([n, (await sent(n)).body]).toEqual([n, `{"n":"${read}"}`]);
    }
    for (const n of ["1.0000000000000001", "1e-400", "4.9999999999999999999"]) {
      expect([n, ...error(await sent(n))]).toEqual([n, 400, "invalid-request", "a number in the request body is not an integer, and would be read as one"]);
    }
    expect(error(await sent("1e999"))).toEqual([400, "invalid-request", "a number in the request body is beyond a number's range"]);
    expect(error(await sent("1.5"))).toEqual([400, "invalid-request", "input/n: expected an integer of at most 78 digits, as digits in a string or as a JSON number"]);
  });

  it("take at most 78 digits, and read no longer text or number as a bigint", async () => {
    const any = defineRoute({ name: "any", input: z.object({ n: bigintText() }), output: z.object({ n: bigintText() }), handle: async (input) => input });
    const { api: served } = apiOf((registry) => registry.route(any));
    const most = "9".repeat(78);
    expect((await served.answer(post("/m/any", { n: most }))).body).toBe(`{"n":"${most}"}`);
    expect((await served.answer(request("POST", "/m/any", { body: `{"n":-${most}}` }))).body).toBe(`{"n":"-${most}"}`);
    const tooLong = "input/n: expected an integer of at most 78 digits, as digits in a string or as a JSON number";
    expect(error(await served.answer(post("/m/any", { n: `1${most}` })))).toEqual([400, "invalid-request", tooLong]);
    const started = performance.now();
    expect(error(await served.answer(post("/m/any", { n: "9".repeat(900_000) })))).toEqual([400, "invalid-request", tooLong]);
    for (const digits of [79, 300]) {
      const response = await served.answer(request("POST", "/m/any", { body: `{"n":${"9".repeat(digits)}}` }));
      expect([digits, ...error(response)]).toEqual([digits, 400, "invalid-request", tooLong]);
    }
    const huge = await served.answer(request("POST", "/m/any", { body: `{"n":${"9".repeat(900_000)}}` }));
    expect(error(huge)).toEqual([400, "invalid-request", "a number in the request body is beyond a number's range"]);
    expect(performance.now() - started).toBeLessThan(150);
  });

  it("take a default on the wire side, prefault; a bigint default is refused at registration, naming it", () => {
    expect(z.decode(z.object({ n: bigintText().prefault("0") }), {})).toEqual({ n: 0n });
    const route = (n: z.ZodType) => defineRoute({ name: "d", input: z.object({ n }), output: z.object({}), handle: async () => ({}) });
    expect(apiOf((registry) => registry.route(route(bigintText().prefault("0")))).routes.routes[0]?.input).toMatchObject({ properties: { n: { default: "0" } } });
    expect(refusal((registry) => registry.route(route(bigintText().default(0n))))).toMatch(/BigInt defaults.*: give a bigintText's default on the wire side, \.prefault\("0"\)$/);
  });

  it("describe the wire side in the catalog: digits in a string or an integer, format bigint", () => {
    const [entry] = api().routes.routes;
    const unsigned = { anyOf: [{ type: "string", pattern: "^(0|[1-9][0-9]{0,38})$" }, { type: "integer", minimum: 0 }], format: "bigint" };
    const signed = { anyOf: [{ type: "string", pattern: "^(0|-?[1-9][0-9]{0,77})$" }, { type: "integer" }], format: "bigint" };
    expect(entry?.input).toMatchObject({ type: "object", required: ["above"], properties: { above: unsigned, delta: signed } });
    expect(entry?.output).toMatchObject({ type: "object", properties: { amount: unsigned, deltas: { type: "array", items: signed } }, additionalProperties: false });
  });

  it("uintText takes a number of bits from 1 to 256", () => {
    for (const bits of [0, -1, 1.5, Number.NaN, 257]) expect(() => uintText(bits)).toThrow(RangeError);
    expect(z.decode(uintText(256), (2n ** 256n - 1n).toString())).toBe(2n ** 256n - 1n);
    expect(z.safeDecode(uintText(256), (2n ** 256n).toString()).success).toBe(false);
    expect(z.decode(uintText(1), "1")).toBe(1n);
    expect(z.safeDecode(uintText(1), "2").success).toBe(false);
  });
});
