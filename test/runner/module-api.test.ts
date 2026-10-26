import { describe, expect, it } from "vitest";
import type { ReadHandle, ReadOptions, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ApiRegistry, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { resolveGraph } from "../../src/modules/graph.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import {
  API_ERROR_STATUS,
  ApiError,
  type ApiRequest,
  type ApiResponse,
  ApiRoutes,
  encodeJson,
  isGraphQLResponse,
  ModuleApi,
  registerModuleApis,
} from "../../src/runner/module-api.js";
import { ProcessContexts } from "../../src/runner/process-context.js";
import { declaration } from "../modules/declarations.js";
import { BACKBONE, CORE_BLOCK_FETCH, CORE_CHAIN, entry, graphInput } from "../modules/graph-fixtures.js";

/**
 * The module API without a listener (task 5.2a; RN-15, RN-16, DB-15; CORE-ARCH §4.10's `ApiRegistry`): the routes and
 * subscription names modules register in `on-start-api` (`ApiRoutes`, `registerModuleApis`), refused when registered
 * twice (`duplicate-api-route`); each request answered through one read bounded by `apiReadTimeoutMs`, inside the
 * chain-data envelope (`ModuleApi.answer`); the wire format of bodies and errors; and subscriptions (`ModuleApi.subscribe`).
 * Over a database and on `listen.api` it is `api-server.test.ts`; A141's request half is `api-timeouts.test.ts`.
 */

const HASH = Uint8Array.from({ length: 32 }, (_, i) => i);
const HEX = `0x${Buffer.from(HASH).toString("hex")}`;
const JSON_TYPE = "application/json; charset=utf-8";
const ENVELOPE = { "X-Umbra-View": "finalized", "X-Umbra-Height": "7", "X-Umbra-Hash": HEX };

/** A fake database whose reads see `height` (null: before S) with `HASH`, recording each read's options. */
function fakeDb(height: bigint | null = 7n, fail?: unknown) {
  const options: (ReadOptions | undefined)[] = [];
  const read: ReadHandle = Object.freeze({
    height,
    query: async (sql: string) => {
      if (sql.startsWith("SELECT hash FROM core_block_commit.blocks")) return [{ hash: HASH }];
      if (fail !== undefined) throw fail;
      return [{ n: 1n }];
    },
  });
  return {
    options,
    read,
    timeoutMs: 1_000,
    db: {
      read<T>(body: (r: ReadHandle) => Promise<T>, given?: ReadOptions): Promise<T> {
        options.push(given);
        return body(read);
      },
    },
  };
}

/** The routes of one module `m` registered by `register`, checked. */
function routesOf(register: (api: ApiRegistry) => void, module = "m"): ApiRoutes {
  const routes = new ApiRoutes();
  const registration = routes.open(module);
  register(registration.registry);
  registration.close();
  routes.check();
  return routes;
}

/** A request. */
const request = (method: string, path: string, rest: Partial<ApiRequest> = {}): ApiRequest => ({ method, path, ...rest });

/** The JSON body of `response`. */
const bodyOf = (response: ApiResponse): unknown =>
  JSON.parse(typeof response.body === "string" ? response.body : Buffer.from(response.body).toString("utf8"));

/** The error a body of `response` names. */
const errorOf = (response: ApiResponse) => (bodyOf(response) as { error: { code: string; message: string } }).error;

/** The error `body` throws. */
function thrown(body: () => unknown): unknown {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("expected a throw");
}

const ok = async () => ({ status: 200, body: { ok: true } });

describe("ApiRoutes: what modules register in on-start-api (RN-15)", () => {
  it("collects each module's HTTP routes and subscriptions in registration order", () => {
    const routes = new ApiRoutes();
    const a = routes.open("a");
    a.registry.http("GET", "/blocks/:height", ok);
    a.registry.subscription("heights", () => () => undefined);
    a.close();
    const b = routes.open("b");
    b.registry.http("POST", "/", ok);
    b.close();
    routes.check();
    expect(routes.http.map(({ module, method, path }) => [module, method, path])).toEqual([
      ["a", "GET", "/blocks/:height"],
      ["b", "POST", "/"],
    ]);
    expect(routes.subscriptions.map(({ module, name }) => [module, name])).toEqual([["a", "heights"]]);
    expect(Object.isFrozen(routes.http)).toBe(true);
  });

  it("refuses a malformed registration at the call, naming the module", () => {
    const routes = new ApiRoutes();
    const { registry } = routes.open("m");
    const bad: [string, () => void][] = [
      ["a method that is not GET or POST", () => registry.http("PUT" as "GET", "/x", ok)],
      ["a lowercase method", () => registry.http("get" as "GET", "/x", ok)],
      ["a path without its leading slash", () => registry.http("GET", "x", ok)],
      ["a longer path without its leading slash", () => registry.http("GET", "api/x", ok)],
      ["an empty segment", () => registry.http("GET", "/a//b", ok)],
      ["a trailing slash", () => registry.http("GET", "/a/", ok)],
      ["a space", () => registry.http("GET", "/a b", ok)],
      ["a query", () => registry.http("GET", "/a?b=1", ok)],
      ["a percent sign", () => registry.http("GET", "/a%20b", ok)],
      ["a parameter name that is not a name", () => registry.http("GET", "/a/:1x", ok)],
      ["a parameter named twice", () => registry.http("GET", "/:a/:a", ok)],
      ["a path that is not a string", () => registry.http("GET", 7 as unknown as string, ok)],
      ["a handler that is not a function", () => registry.http("GET", "/x", "no" as unknown as typeof ok)],
      ["an empty subscription name", () => registry.subscription("", () => () => undefined)],
      ["a subscription name that is not a string", () => registry.subscription(1 as unknown as string, () => () => undefined)],
      ["a subscription handler that is not a function", () => registry.subscription("s", null as unknown as () => () => void)],
    ];
    for (const [what, call] of bad) {
      const error = thrown(call);
      expect(error, what).toBeInstanceOf(TypeError);
      expect((error as Error).message, what).toMatch(/^m registered /);
      expect((error as Error).message, what).toMatch(/\(RN-15\)$/);
    }
    expect(routes.http).toHaveLength(0);
    expect(routes.subscriptions).toHaveLength(0);
  });

  it("refuses a registration once the module's on-start-api has ended", () => {
    const routes = new ApiRoutes();
    const registration = routes.open("m");
    registration.close();
    expect(() => registration.registry.http("GET", "/x", ok)).toThrow(
      "m registered GET /x after its on-start-api callback ended: modules register their API once, at startup (RN-15)",
    );
    expect(() => registration.registry.subscription("s", () => () => undefined)).toThrow(
      "m registered the subscription s after its on-start-api callback ended: modules register their API once, at " +
        "startup (RN-15)",
    );
    expect(Object.isFrozen(registration.registry)).toBe(true);
  });

  it("refuses two modules registering the same method and path with duplicate-api-route, naming both", () => {
    const routes = new ApiRoutes();
    for (const module of ["a", "b"]) {
      const registration = routes.open(module);
      registration.registry.http("GET", "/api/v4/graphql", ok);
      registration.close();
    }
    const error = thrown(() => routes.check()) as UmbraError;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.code).toBe("duplicate-api-route");
    expect(error.details).toEqual({ kind: "http", route: "GET /api/v4/graphql", modules: ["a", "b"] });
    expect(error.message).toBe("a and b both register GET /api/v4/graphql: a route is registered once (RN-15)");
  });

  it("refuses the same route twice in one module, and paths that differ only in their parameters' names", () => {
    const same = new ApiRoutes();
    const one = same.open("m");
    one.registry.http("POST", "/q", ok);
    one.registry.http("POST", "/q", ok);
    one.close();
    expect((thrown(() => same.check()) as UmbraError).details).toEqual({ kind: "http", route: "POST /q", modules: ["m", "m"] });
    expect((thrown(() => same.check()) as UmbraError).message).toBe("m registers POST /q twice: a route is registered once (RN-15)");

    const params = new ApiRoutes();
    const a = params.open("a");
    a.registry.http("GET", "/blocks/:height", ok);
    a.close();
    const b = params.open("b");
    b.registry.http("GET", "/blocks/:number", ok);
    b.close();
    expect((thrown(() => params.check()) as UmbraError).details).toEqual({
      kind: "http",
      route: "GET /blocks/:height",
      modules: ["a", "b"],
    });
  });

  it("refuses a subscription name registered twice, and reports the first duplicate in registration order", () => {
    const routes = new ApiRoutes();
    for (const module of ["a", "b", "c"]) {
      const registration = routes.open(module);
      if (module !== "a") registration.registry.http("GET", "/x", ok);
      registration.registry.subscription(module === "c" ? "other" : "heights", () => () => undefined);
      registration.close();
    }
    const error = thrown(() => routes.check()) as UmbraError;
    expect(error.details).toEqual({ kind: "subscription", route: "heights", modules: ["a", "b"] });
    expect(error.message).toBe("a and b both register the subscription heights: a subscription name is registered once (RN-15)");
  });

  it("accepts routes that differ in method, in a literal against a parameter, and a path named like a subscription", () => {
    expect(() =>
      routesOf((api) => {
        api.http("GET", "/a", ok);
        api.http("POST", "/a", ok);
        api.http("GET", "/a/:x", ok);
        api.http("GET", "/a/b", ok);
        api.http("GET", "/heights", ok);
        api.subscription("/heights", () => () => undefined);
        api.subscription("heights", () => () => undefined);
        api.subscription("GET /heights", () => () => undefined);
      }),
    ).not.toThrow();
  });
});

describe("ModuleApi.answer: one request, one bounded read, the envelope (RN-15, RN-16, DB-15)", () => {
  it("answers a route with a read bounded by apiReadTimeoutMs, the handler's answer and the envelope's headers", async () => {
    const { db, options, read } = fakeDb();
    const seen: unknown[] = [];
    const routes = routesOf((api) =>
      api.http("GET", "/blocks/:height", async (req, r) => {
        seen.push(req, r === read);
        return { status: 200, headers: { "X-Mine": "1", "x-umbra-height": "0" }, body: { height: r.height } };
      }),
    );
    const response = await new ModuleApi(routes, { db, timeoutMs: 1_234 }).answer(
      request("GET", "/blocks/12", { query: new URLSearchParams("height=99&limit=5&limit=6") }),
    );
    expect(options).toEqual([{ timeoutMs: 1_234 }]);
    expect(seen).toEqual([{ params: { height: "12", limit: "5" }, body: undefined }, true]);
    expect(Object.isFrozen((seen[0] as { params: object }).params)).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers).toEqual({ "X-Mine": "1", ...ENVELOPE, "Content-Type": JSON_TYPE });
    expect(response.body).toBe('{"height":"7"}');
  });

  it("parses a POST body as JSON, losslessly; an empty body is undefined, and a GET's body is ignored", async () => {
    const bodies: unknown[] = [];
    const routes = routesOf((api) => {
      api.http("POST", "/q", async (req) => {
        bodies.push(req.body);
        return { status: 204, body: undefined };
      });
      api.http("GET", "/q", async (req) => {
        bodies.push(req.body);
        return { status: 204, body: undefined };
      });
    });
    const api = new ModuleApi(routes, fakeDb());
    await api.answer(request("POST", "/q", { body: '{"n": 12345678901234567890, "k": "\\t"}' }));
    await api.answer(request("POST", "/q", { body: "" }));
    await api.answer(request("POST", "/q"));
    const get = await api.answer(request("GET", "/q", { body: "{not json" }));
    expect(bodies).toEqual([{ n: 12345678901234567890n, k: "\t" }, undefined, undefined, undefined]);
    expect(get.status).toBe(204);
    expect(get.body).toBe("");
    expect(get.headers["Content-Type"]).toBeUndefined();
  });

  it("refuses a POST body that is not JSON with 400 invalid-request, calling no handler and opening no read", async () => {
    let called = false;
    const { db, options } = fakeDb();
    const routes = routesOf((api) =>
      api.http("POST", "/q", async () => {
        called = true;
        return { status: 200, body: null };
      }),
    );
    const response = await new ModuleApi(routes, { db, timeoutMs: 1 }).answer(request("POST", "/q", { body: "{" }));
    expect(response.status).toBe(400);
    expect(response.headers).toEqual({ "Content-Type": JSON_TYPE });
    expect(errorOf(response)).toEqual({ code: "invalid-request", message: "the request body is not JSON" });
    expect(called).toBe(false);
    expect(options).toEqual([]);
  });

  it("answers 404 for a path no route has, 405 with Allow for a method it lacks, 400 for a path that cannot be decoded", async () => {
    const routes = routesOf((api) => {
      api.http("POST", "/q", ok);
      api.http("GET", "/q", ok);
      api.http("POST", "/only", ok);
    });
    const api = new ModuleApi(routes, fakeDb());
    const missing = await api.answer(request("GET", "/nothing/here"));
    expect(missing.status).toBe(404);
    expect(errorOf(missing)).toEqual({ code: "not-found", message: "no module API route answers GET /nothing/here" });
    const method = await api.answer(request("GET", "/only"));
    expect(method.status).toBe(405);
    expect(method.headers).toEqual({ "Content-Type": JSON_TYPE, Allow: "POST" });
    expect(errorOf(method)).toEqual({ code: "method-not-allowed", message: "/only answers POST, not GET" });
    const put = await api.answer(request("PUT", "/q"));
    expect(put.headers.Allow).toBe("GET, POST");
    const undecodable = await api.answer(request("GET", "/q%E0"));
    expect(undecodable.status).toBe(400);
    expect(errorOf(undecodable)).toEqual({ code: "invalid-request", message: "the request path is not valid percent-encoded UTF-8" });
    // A trailing slash is another path.
    expect((await api.answer(request("GET", "/q/"))).status).toBe(404);
    expect(API_ERROR_STATUS).toEqual({
      "invalid-request": 400,
      "not-found": 404,
      "method-not-allowed": 405,
      "request-too-large": 413,
      "internal-error": 500,
      "no-committed-height": 503,
      "query-timeout": 504,
    });
  });

  it("prefers a literal segment to a parameter, leftmost first, and decodes parameters", async () => {
    const hit: string[] = [];
    const routes = routesOf((api) => {
      api.http("GET", "/a/:x/c", async (req) => {
        hit.push(`param-first ${req.params.x}`);
        return { status: 200, body: null };
      });
      api.http("GET", "/a/b/:y", async (req) => {
        hit.push(`literal-first ${req.params.y}`);
        return { status: 200, body: null };
      });
      api.http("GET", "/", async () => {
        hit.push("root");
        return { status: 200, body: null };
      });
    });
    const api = new ModuleApi(routes, fakeDb());
    await api.answer(request("GET", "/a/b/c"));
    await api.answer(request("GET", "/a/z%2Fw%20x/c"));
    await api.answer(request("GET", "/%61/b/%63"));
    await api.answer(request("GET", "/"));
    expect(hit).toEqual(["literal-first c", "param-first z/w x", "literal-first c", "root"]);
    // The same with the more specific route registered first.
    const order: string[] = [];
    const reversed = routesOf((api) => {
      api.http("GET", "/p/q/:y", async () => {
        order.push("literal-first");
        return { status: 200, body: null };
      });
      api.http("GET", "/p/:x/r", async () => {
        order.push("param-first");
        return { status: 200, body: null };
      });
    });
    const second = new ModuleApi(reversed, fakeDb());
    await second.answer(request("GET", "/p/q/r"));
    await second.answer(request("GET", "/p/z/r"));
    expect(order).toEqual(["literal-first", "param-first"]);
  });

  it("answers 404 for a request path that does not start with a slash (an asterisk, an absolute form)", async () => {
    const api = new ModuleApi(
      routesOf((r) => {
        r.http("GET", "/", ok);
        r.http("GET", "/a", ok);
      }),
      fakeDb(),
    );
    expect((await api.answer(request("GET", "*"))).status).toBe(404);
    expect((await api.answer(request("GET", ""))).status).toBe(404);
    expect((await api.answer(request("GET", "xa"))).status).toBe(404);
    expect((await api.answer(request("GET", "/a"))).status).toBe(200);
  });

  it("gives a path parameter the name a query parameter also has", async () => {
    const params: unknown[] = [];
    const routes = routesOf((api) =>
      api.http("GET", "/:id", async (req) => {
        params.push(req.params);
        return { status: 200, body: null };
      }),
    );
    await new ModuleApi(routes, fakeDb()).answer(request("GET", "/7", { query: [["id", "8"], ["__proto__", "x"]] }));
    expect(params).toEqual([{ id: "7", ["__proto__"]: "x" }]);
    expect(Object.getPrototypeOf(params[0])).toBeNull();
  });

  it("answers 503 no-committed-height before block S commits, calling no handler", async () => {
    let called = false;
    const routes = routesOf((api) =>
      api.http("GET", "/x", async () => {
        called = true;
        return { status: 200, body: null };
      }),
    );
    const response = await new ModuleApi(routes, fakeDb(null)).answer(request("GET", "/x"));
    expect(response.status).toBe(503);
    expect(response.headers).toEqual({ "Content-Type": JSON_TYPE });
    expect(errorOf(response)).toEqual({
      code: "no-committed-height",
      message: "no height has committed yet: chain data is answered once block S commits (RN-16)",
    });
    expect(called).toBe(false);
  });

  it("answers 504 query-timeout when the read's timeout ended it, whatever the handler did", async () => {
    const timeout = new UmbraError(
      "query-timeout",
      "the read was ended by its timeout: a statement ran for 1000 ms (statement_timeout)",
      { timeoutMs: 1000, setting: "statement_timeout" },
    );
    const errors: unknown[] = [];
    const routes = routesOf((api) =>
      api.http("GET", "/x", async (_req, read) => {
        await read.query("SELECT pg_sleep(60)");
        return { status: 200, body: null };
      }),
    );
    const response = await new ModuleApi(routes, { ...fakeDb(7n, timeout), onError: (e) => errors.push(e) }).answer(
      request("GET", "/x"),
    );
    expect(response.status).toBe(504);
    expect(response.headers).toEqual({ "Content-Type": JSON_TYPE });
    expect(errorOf(response)).toEqual({ code: "query-timeout", message: timeout.message });
    expect(errors).toEqual([]);
  });

  it("answers 500 internal-error for a handler that fails or answers what is no answer, telling only onError why", async () => {
    const secret = new Error("postgres://user:hunter2@db/x refused");
    const answers: unknown[] = [
      undefined,
      null,
      { status: 99, body: null },
      { status: 600, body: null },
      { status: 200.5, body: null },
      { status: "200", body: null },
      { status: 200, headers: { a: 1 }, body: null },
      { status: 200, headers: "x", body: null },
      { status: 200, headers: ["x"], body: null },
      { status: 200, headers: { a: "line\r\nbreak" }, body: null },
      { status: 200, body: { cyclic: undefined as unknown } },
    ];
    (answers.at(-1) as { body: { cyclic: unknown } }).body.cyclic = (answers.at(-1) as { body: unknown }).body;
    const errors: [unknown, unknown][] = [];
    const routes = routesOf((api) => {
      api.http("GET", "/throws", async () => {
        throw secret;
      });
      api.http("GET", "/database", async (_req, read) => {
        await read.query("SELECT broken");
        return { status: 200, body: null };
      });
      answers.forEach((answer, index) => api.http("GET", `/bad${index}`, async () => answer as never));
    });
    const failing = new UmbraError("database-error", "syntax error at or near broken", { sqlstate: "42601" });
    const api = new ModuleApi(routes, { ...fakeDb(7n, failing), onError: (error, where) => errors.push([error, where]) });
    for (const path of ["/throws", "/database", ...answers.map((_, index) => `/bad${index}`)]) {
      const response = await api.answer(request("GET", path));
      expect(response.status, path).toBe(500);
      expect(response.headers, path).toEqual({ "Content-Type": JSON_TYPE });
      expect(errorOf(response), path).toEqual({ code: "internal-error", message: "the module API could not answer the request" });
      expect(response.body as string, path).not.toMatch(/hunter2|broken/);
    }
    expect(errors[0]).toEqual([secret, { module: "m", route: "GET /throws" }]);
    expect(errors[1]).toEqual([failing, { module: "m", route: "GET /database" }]);
    expect((errors[2]?.[0] as Error).message).toBe("the handler of GET /bad0 answered undefined, not { status, headers?, body }");
    expect((errors[3]?.[0] as Error).message).toBe("the handler of GET /bad1 answered null, not { status, headers?, body }");
    expect((errors[4]?.[0] as Error).message).toBe("the handler of GET /bad2 answered the status 99, not an integer from 200 to 599");
    expect((errors[8]?.[0] as Error).message).toBe("the handler of GET /bad6 answered a header a whose value is not a string");
    expect((errors[9]?.[0] as Error).message).toBe("the handler of GET /bad7 answered headers that are not an object");
    expect((errors[10]?.[0] as Error).message).toBe("the handler of GET /bad8 answered headers that are not an object");
    expect((errors[11]?.[0] as Error).message).toBe(
      'the handler of GET /bad9 answered a header "a" that HTTP cannot carry (RFC 9110 §5)',
    );
    expect(errors).toHaveLength(13);
    // Without onError, a failure is still answered 500; and so with an onError that throws.
    const quiet = new ModuleApi(routes, fakeDb());
    expect((await quiet.answer(request("GET", "/throws"))).status).toBe(500);
    const throwing = new ModuleApi(routes, {
      ...fakeDb(),
      onError: () => {
        throw new Error("the logger broke");
      },
    });
    expect((await throwing.answer(request("GET", "/throws"))).status).toBe(500);
  });

  it("carries the view in a GraphQL response's extensions, its data unchanged, and leaves other bodies alone", async () => {
    const bodies: Record<string, unknown> = {
      "/data": { data: { a: [1, 2] } },
      "/errors": { errors: [{ message: "bad" }] },
      "/both": { data: null, errors: [], extensions: { cost: 3, height: "mine" } },
      "/rest": { data: 1, other: 2 },
      "/array": [{ data: 1 }],
      "/bad-extensions": { data: 1, extensions: [1] },
      "/no-data": { extensions: {} },
    };
    const routes = routesOf((api) => {
      for (const [path, body] of Object.entries(bodies)) api.http("POST", path, async () => ({ status: 200, body }));
    });
    const api = new ModuleApi(routes, fakeDb());
    const view = { view: "finalized", height: "7", hash: HEX };
    const answered = async (path: string) => bodyOf(await api.answer(request("POST", path)));
    expect(await answered("/data")).toEqual({ data: { a: [1, 2] }, extensions: view });
    expect(await answered("/errors")).toEqual({ errors: [{ message: "bad" }], extensions: view });
    expect(await answered("/both")).toEqual({ data: null, errors: [], extensions: { cost: 3, ...view } });
    expect(await answered("/rest")).toEqual({ data: 1, other: 2 });
    expect(await answered("/array")).toEqual([{ data: 1 }]);
    expect(await answered("/bad-extensions")).toEqual({ data: 1, extensions: [1] });
    expect(await answered("/no-data")).toEqual({ extensions: {} });
    // Every one of them still carries the headers.
    expect((await api.answer(request("POST", "/rest"))).headers).toMatchObject(ENVELOPE);
  });

  it("writes bodies as JSON — bigints as decimal text, bytes as 0x hex — unless the handler typed its text or bytes", async () => {
    const bodies: Record<string, { headers?: Record<string, string>; body: unknown }> = {
      "/json": { body: { h: 12345678901234567890n, b: Uint8Array.of(0, 255), n: [1n, Buffer.from([1])], s: "x" } },
      "/text": { headers: { "content-type": "text/plain" }, body: "plain" },
      "/bytes": { headers: { "Content-Type": "application/octet-stream" }, body: Uint8Array.of(1, 2) },
      "/string": { body: "a string" },
      "/typed-json": { headers: { "Content-Type": "application/graphql-response+json" }, body: { data: 1 } },
      "/nothing": { body: undefined },
    };
    const routes = routesOf((api) => {
      for (const [path, answer] of Object.entries(bodies)) api.http("GET", path, async () => ({ status: 200, ...answer }));
    });
    const api = new ModuleApi(routes, fakeDb());
    const json = await api.answer(request("GET", "/json"));
    expect(json.body).toBe('{"h":"12345678901234567890","b":"0x00ff","n":["1","0x01"],"s":"x"}');
    expect(json.headers["Content-Type"]).toBe(JSON_TYPE);
    const text = await api.answer(request("GET", "/text"));
    expect([text.body, text.headers["content-type"], text.headers["Content-Type"]]).toEqual(["plain", "text/plain", undefined]);
    const bytes = await api.answer(request("GET", "/bytes"));
    expect(bytes.body).toEqual(Uint8Array.of(1, 2));
    expect(bytes.headers["Content-Type"]).toBe("application/octet-stream");
    expect((await api.answer(request("GET", "/string"))).body).toBe('"a string"');
    const typed = await api.answer(request("GET", "/typed-json"));
    expect([typed.body, typed.headers["Content-Type"]]).toEqual([
      '{"data":1,"extensions":{"view":"finalized","height":"7","hash":"' + HEX + '"}}',
      "application/graphql-response+json",
    ]);
    const nothing = await api.answer(request("GET", "/nothing"));
    expect([nothing.body, nothing.headers["Content-Type"]]).toEqual(["", undefined]);
  });

  it("encodes JSON values as the API writes them, and tells GraphQL responses by their shape", () => {
    expect(encodeJson({ a: 1n, b: [Uint8Array.of(16)], c: undefined, d: null })).toBe('{"a":"1","b":["0x10"],"d":null}');
    expect(encodeJson(-5n)).toBe('"-5"');
    expect(encodeJson(undefined)).toBeUndefined();
    expect(() => encodeJson({ f: () => 1, x: Symbol("s") })).not.toThrow();
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => encodeJson(cyclic)).toThrow(TypeError);
    expect(isGraphQLResponse({ data: {} })).toBe(true);
    expect(isGraphQLResponse({ errors: [] })).toBe(true);
    expect(isGraphQLResponse({ data: null, extensions: {} })).toBe(true);
    expect(isGraphQLResponse(Object.assign(Object.create(null), { data: 1 }))).toBe(true);
    for (const body of [null, 1, "data", [], { extensions: {} }, { data: 1, more: 2 }, { data: 1, extensions: null }, new Map()]) {
      expect(isGraphQLResponse(body), JSON.stringify(body)).toBe(false);
    }
    class Shaped {
      data = 1;
    }
    expect(isGraphQLResponse(new Shaped())).toBe(false);
  });
});

describe("ModuleApi.subscribe: subscriptions notified through emit (RN-15)", () => {
  it("calls the module's handler with the arguments, sends what it emits, and unsubscribes once", () => {
    const emits: ((value: unknown) => void)[] = [];
    let unsubscribed = 0;
    const routes = routesOf((api) =>
      api.subscription("heights", (args, emit) => {
        expect(args).toEqual({ from: 3 });
        emits.push(emit);
        return () => {
          unsubscribed++;
        };
      }),
    );
    const sent: unknown[] = [];
    const subscription = new ModuleApi(routes, fakeDb()).subscribe("heights", { from: 3 }, (value) => sent.push(value));
    emits[0]?.(1n);
    emits[0]?.({ h: 2n });
    expect(sent).toEqual([1n, { h: 2n }]);
    subscription();
    subscription();
    emits[0]?.(3n);
    expect(unsubscribed).toBe(1);
    expect(sent).toHaveLength(2);
  });

  it("refuses an unknown name (not-found) and a handler that throws or returns no unsubscribe (internal-error)", () => {
    const boom = new Error("handler broke");
    const errors: unknown[] = [];
    let emitted: ((value: unknown) => void) | undefined;
    const routes = routesOf((api) => {
      api.subscription("throws", () => {
        throw boom;
      });
      api.subscription("returns", (_args, emit) => {
        emitted = emit;
        return "no" as unknown as () => void;
      });
    });
    const api = new ModuleApi(routes, { ...fakeDb(), onError: (error) => errors.push(error) });
    const sent: unknown[] = [];
    const unknown = thrown(() => api.subscribe("nothing", null, (v) => sent.push(v))) as ApiError;
    expect(unknown).toBeInstanceOf(ApiError);
    expect([unknown.code, unknown.status, unknown.message]).toEqual(["not-found", 404, "no subscription is named nothing"]);
    const failed = thrown(() => api.subscribe("throws", null, (v) => sent.push(v))) as ApiError;
    expect([failed.code, failed.message]).toEqual(["internal-error", "the subscription throws could not be opened"]);
    const returned = thrown(() => api.subscribe("returns", null, (v) => sent.push(v))) as ApiError;
    expect(returned.code).toBe("internal-error");
    // Its emit sends nothing: the subscription never opened.
    emitted?.(1);
    expect(sent).toEqual([]);
    expect(errors[0]).toBe(boom);
    expect((errors[1] as Error).message).toBe("the subscription handler of returns returned no unsubscribe function");
    // An onError that throws changes nothing of the refusal.
    const loud = new ModuleApi(routes, {
      ...fakeDb(),
      onError: () => {
        throw new Error("the logger broke");
      },
    });
    expect((thrown(() => loud.subscribe("throws", null, () => undefined)) as ApiError).code).toBe("internal-error");
  });

  it("tells onError of an unsubscribe that throws, and goes on", () => {
    const errors: unknown[] = [];
    const boom = new Error("unsubscribe broke");
    const routes = routesOf((api) =>
      api.subscription("s", () => () => {
        throw boom;
      }),
    );
    const close = new ModuleApi(routes, { ...fakeDb(), onError: (error) => errors.push(error) }).subscribe("s", 1, () => undefined);
    expect(() => close()).not.toThrow();
    expect(errors).toEqual([boom]);
    const quiet = new ModuleApi(routes, fakeDb()).subscribe("s", 1, () => undefined);
    expect(() => quiet()).not.toThrow();
  });
});

// ── on-start-api through the runner's dispatch, without a database ─────────────────────────────────────────────

const UNUSED_WRITE: SchemaWriteHandle = Object.freeze({
  height: null,
  query: () => Promise.reject(new Error("not used")),
  execute: () => Promise.reject(new Error("not used")),
});

/** The test backbone with a `core-chain` that publishes the items `core-block-fetch` requires. */
const BACKBONE_PUBLISHING: readonly ModuleDeclaration[] = BACKBONE.map((part) =>
  part.id === "core-chain"
    ? {
        ...CORE_CHAIN,
        points: {
          async "on-start-db"(p) {
            for (const item of CORE_BLOCK_FETCH.requires) p.publish(item, item);
          },
        },
      }
    : part,
);

/** Sealed contexts over the graph of `user` (each from 1, or as `entries` say), on a database whose cursor is `cursor`. */
async function sealed(
  user: readonly ModuleDeclaration[],
  entries = user.map((d) => entry(d.id, 1)),
  cursor: bigint | null = null,
) {
  const graph = resolveGraph(graphInput(user, entries, { backbone: BACKBONE_PUBLISHING, cursor }));
  const contexts = new ProcessContexts({ graph });
  for (const part of graph.modules) await contexts.startDbPart(part).onStartDb?.(UNUSED_WRITE);
  contexts.seal();
  return { graph, contexts };
}

describe("registerModuleApis: on-start-api once, at startup (RN-1, RN-15)", () => {
  it("runs on-start-api for this process's parts in startup order, each with its context and its own registry", async () => {
    const calls: [string, unknown, unknown][] = [];
    const registering = (id: string, rest: Partial<ModuleDeclaration> = {}) =>
      declaration(id, {
        provides: [],
        migrations: [],
        ...rest,
        points: {
          async "on-start-api"(this: unknown, p, api) {
            calls.push([id, p, this]);
            api.http("GET", `/${id}`, ok);
          },
        },
      });
    const b = registering("b-mod");
    const a = registering("a-mod", { requires: ["b-mod-thing"] });
    const bProvides = { ...b, provides: [{ name: "b-mod-thing", lifetimes: ["block" as const] }] };
    const ended = registering("ended");
    const { graph, contexts } = await sealed(
      [a, bProvides, ended],
      [entry("a-mod", 1), entry("b-mod", 1), entry("ended", 1, 4)],
      9n,
    );
    const routes = await registerModuleApis({ graph, contexts });
    // Kahn order: b-mod provides what a-mod requires; ended's revisions all ended below the cursor's range.
    expect(calls.map(([id]) => id)).toEqual(["b-mod", "a-mod"]);
    expect(calls[0]?.[1]).toBe(contexts.of("b-mod"));
    expect(calls[0]?.[2]).toBe(bProvides.points);
    expect(routes.http.map(({ module, path }) => [module, path])).toEqual([
      ["b-mod", "/b-mod"],
      ["a-mod", "/a-mod"],
    ]);
  });

  it("closes each registry when its callback ends, and refuses duplicates once every on-start-api has run", async () => {
    let kept: ApiRegistry | undefined;
    const ran: string[] = [];
    const first = declaration("first", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"(_p, api) {
          kept = api;
          ran.push("first");
          api.subscription("s", () => () => undefined);
        },
      },
    });
    const second = declaration("second", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"(_p, api) {
          ran.push("second");
          expect(() => (kept as ApiRegistry).http("GET", "/late", ok)).toThrow(/after its on-start-api callback ended/);
          api.subscription("s", () => () => undefined);
        },
      },
    });
    const { graph, contexts } = await sealed([first, second, declaration("third", { provides: [], migrations: [] })]);
    const error = await registerModuleApis({ graph, contexts }).catch((e: unknown) => e);
    expect(ran).toEqual(["first", "second"]);
    expect((error as UmbraError).code).toBe("duplicate-api-route");
    expect((error as UmbraError).details).toEqual({ kind: "subscription", route: "s", modules: ["first", "second"] });
  });

  it("fails with the callback's failure, naming on-start-api and the module, and runs nothing after it", async () => {
    const ran: string[] = [];
    const breaks = declaration("breaks", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"(_p, api) {
          ran.push("breaks");
          api.http("GET", "no-slash", ok);
        },
      },
    });
    const after = declaration("zz", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"() {
          ran.push("zz");
        },
      },
    });
    const { graph, contexts } = await sealed([breaks, after]);
    const failure = (await registerModuleApis({ graph, contexts }).catch((e: unknown) => e)) as CallbackFailure;
    expect(failure).toBeInstanceOf(CallbackFailure);
    expect([failure.point, failure.module]).toEqual(["on-start-api", "breaks"]);
    expect(failure.cause).toBeInstanceOf(TypeError);
    expect(ran).toEqual(["breaks"]);
  });

  it("fails on a refused publish of another module made while on-start-api ran, and requires sealed contexts", async () => {
    let kept: ProcessContext | undefined;
    const keeper = declaration("keeper", {
      provides: [{ name: "thing", lifetimes: ["process"] }],
      migrations: [],
      points: {
        async "on-start-db"(p) {
          kept = p;
          p.publish("thing", 1);
        },
      },
    });
    const late = declaration("late", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"() {
          try {
            (kept as ProcessContext).publish("thing", 2);
          } catch {
            // Caught: the startup still fails.
          }
        },
      },
    });
    const { graph, contexts } = await sealed([keeper, late]);
    const error = await registerModuleApis({ graph, contexts }).catch((e: unknown) => e);
    expect((error as Error).message).toMatch(/^keeper published the process item thing after startup/);
    const open = new ProcessContexts({ graph });
    await expect(registerModuleApis({ graph, contexts: open })).rejects.toThrow(
      "registerModuleApis: on-start-api runs once the process contexts are sealed (MD-7: after every on-start-db)",
    );
  });
});
