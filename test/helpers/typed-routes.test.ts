import Type from "typebox";
import { describe, expect, it } from "vitest";
import type { ReadHandle } from "../../src/db/api.js";
import { MAX_CURSOR_LENGTH, pageCursor } from "../../src/helpers/page-cursor.js";
import { JSON_HEADERS, RouteError, registerTypedRoutes, toAsciiJson, typedRoute } from "../../src/helpers/typed-routes.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";

/**
 * Typed routes (`src/helpers/typed-routes.ts`) and page cursors (`src/helpers/page-cursor.ts`) on their own, with a
 * stand-in registry and read handle: the namespace, the input check of a `POST`'s body and of a `GET`'s parameters,
 * the answer check, the error envelope, the concurrency limit, the answer before any committed height, ASCII JSON, and
 * cursors. Through the real process and its HTTP listener: `typed-routes.process.test.ts`.
 */

type Handler = Parameters<ApiRegistry["http"]>[2];
type Answer = Awaited<ReturnType<Handler>>;

/** A registry that keeps what is registered. */
function registry(): { api: ApiRegistry; routes: Map<string, Handler> } {
  const routes = new Map<string, Handler>();
  return {
    routes,
    api: {
      http: (method, path, handler) => void routes.set(`${method} ${path}`, handler),
      subscription: () => undefined,
    },
  };
}

const HASH = new Uint8Array(32).fill(0xab);
/** A read at committed height 7 (or none), whose cursor table answers `HASH`. */
const readAt = (height: bigint | null = 7n): ReadHandle => ({ height, query: async () => [{ hash: HASH }] }) as unknown as ReadHandle;

const strict = { additionalProperties: false } as const;
const Body = Type.Object({ name: Type.String({ maxLength: 8 }) }, strict);
const Reply = Type.Object({ greeting: Type.String() }, strict);

/** Registers one `POST /ns/v1/hello` whose handler is `handle`, and returns its registered handler. */
function hello(handle: (body: { name: string }) => Promise<unknown>, maxConcurrent?: number): Handler {
  const { api, routes } = registry();
  const route = typedRoute({ method: "POST", path: "/v1/hello", input: Body, response: Reply, handle: handle as never });
  registerTypedRoutes(api, "ns", [route], maxConcurrent === undefined ? {} : { maxConcurrent });
  expect([...routes.keys()]).toEqual(["POST /ns/v1/hello"]);
  return routes.get("POST /ns/v1/hello")!;
}

const call = (h: Handler, body: unknown, read = readAt()): Promise<Answer> => h({ params: {}, body }, read);
const json = (a: Answer): any => JSON.parse(a.body as string);
const tick = () => new Promise((r) => setTimeout(r, 0));

describe("typed routes", () => {
  it("serve a route under its namespace, answering ASCII JSON with the fixed and chain-data headers", async () => {
    const answer = await call(hello(async (b) => ({ greeting: `héllo ${b.name}` })), { name: "<a>" });
    expect(answer.status).toBe(200);
    expect(answer.body).toBe('{"greeting":"h\\u00e9llo \\u003ca\\u003e"}');
    expect(json(answer)).toEqual({ greeting: "héllo <a>" });
    expect(answer.headers).toMatchObject({ ...JSON_HEADERS, "X-Umbra-Height": "7", "X-Umbra-Hash": `0x${"ab".repeat(32)}` });
  });

  it("refuse a body the input schema refuses with 400 invalid-request, naming paths and rules but never the values", async () => {
    let ran = false;
    const h = hello(async () => {
      ran = true;
      return { greeting: "" };
    });
    const tooLong = await call(h, { name: "secret-value-123" });
    expect([tooLong.status, json(tooLong).error.code]).toEqual([400, "invalid-request"]);
    expect(json(tooLong).error.message).toMatch(/^input\/name: /);
    expect(tooLong.body).not.toContain("secret-value-123");
    const extra = await call(h, { name: "a", other: "secret-value-456" });
    expect([extra.status, String(extra.body).includes("secret-value-456")]).toEqual([400, false]);
    const none = await call(h, undefined);
    expect([none.status, json(none).error.message]).toEqual([400, "input: a JSON body is required"]);
    expect(ran).toBe(false);
  });

  it("check a GET's query and path parameters against the input schema, refusing an unknown one", async () => {
    const { api, routes } = registry();
    const Params = Type.Object({ height: Type.String({ pattern: "^[0-9]{1,15}$" }), limit: Type.Optional(Type.String({ pattern: "^[1-9][0-9]?$" })) }, strict);
    const seen: unknown[] = [];
    registerTypedRoutes(api, "ns", [
      typedRoute({
        method: "GET",
        path: "/v1/blocks/:height",
        input: Params,
        response: Type.Object({ height: Type.String() }, strict),
        handle: async (params) => {
          seen.push(params);
          return { height: params.height };
        },
      }),
    ]);
    const h = routes.get("GET /ns/v1/blocks/:height")!;
    const params = (p: Record<string, string>) => Object.assign(Object.create(null), p);
    expect((await h({ params: params({ height: "12", limit: "5" }), body: undefined }, readAt())).status).toBe(200);
    expect(seen).toEqual([{ height: "12", limit: "5" }]);
    const bad = await h({ params: params({ height: "x" }), body: undefined }, readAt());
    expect([bad.status, json(bad).error.message]).toEqual([400, expect.stringMatching(/^input\/height: /)]);
    const unknown = await h({ params: params({ height: "1", other: "y" }), body: undefined }, readAt());
    expect(unknown.status).toBe(400);
    expect(seen).toHaveLength(1);
  });

  it("never send an answer its schema refuses: the handler's wrong answer is thrown, named by route and path", async () => {
    const error = await call(hello(async () => ({ greeting: 42, leaked: "secret-answer" })), { name: "a" }).then(
      () => undefined,
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(RouteError);
    expect((error as Error).message).toMatch(/^POST \/ns\/v1\/hello built an answer its schema refuses: answer/);
    expect((error as Error).message).not.toContain("secret-answer");
  });

  it("answer a handler's RouteError in the module API's envelope, and pass any other error on", async () => {
    const refused = await call(hello(async () => Promise.reject(new RouteError(404, "no-greeting", "no such greeting"))), { name: "a" });
    expect([refused.status, json(refused)]).toEqual([404, { error: { code: "no-greeting", message: "no such greeting" } }]);
    expect(refused.headers).toMatchObject(JSON_HEADERS);
    const broken = new Error("broken");
    await expect(call(hello(async () => Promise.reject(broken)), { name: "a" })).rejects.toBe(broken);
  });

  it("answer 503 no-committed-height before any height commits, without running the handler", async () => {
    let ran = false;
    const h = hello(async () => {
      ran = true;
      return { greeting: "" };
    });
    const answer = await call(h, { name: "a" }, readAt(null));
    expect([answer.status, (answer.body as { error: { code: string } }).error.code, ran]).toEqual([503, "no-committed-height", false]);
  });

  it("refuse requests above the limit with 503 busy, and free the slot when a request ends, answered or failed", async () => {
    const gates: (() => void)[] = [];
    let fail = false;
    const h = hello(
      () =>
        new Promise((resolve, reject) => {
          gates.push(() => (fail ? reject(new Error("failed")) : resolve({ greeting: "hi" })));
        }),
      1,
    );
    const first = call(h, { name: "a" });
    await tick();
    const busy = await call(h, { name: "b" });
    expect([busy.status, json(busy).error.code, busy.headers?.["retry-after"]]).toEqual([503, "busy", "1"]);
    gates.shift()!();
    expect((await first).status).toBe(200);
    fail = true;
    const failing = call(h, { name: "c" });
    await tick();
    gates.shift()!();
    await expect(failing).rejects.toThrow("failed");
    fail = false;
    const after = call(h, { name: "d" });
    await tick();
    gates.shift()!();
    expect((await after).status).toBe(200);
  });

  it("refuse a namespace that is not a module id and a path that does not start with /", () => {
    const route = typedRoute({ method: "POST", path: "/v1/hello", input: Body, response: Reply, handle: async () => ({ greeting: "" }) });
    for (const namespace of ["", "Ns", "a/b", "-a"]) expect(() => registerTypedRoutes(registry().api, namespace, [route])).toThrow(RangeError);
    expect(() => registerTypedRoutes(registry().api, "ns", [{ ...route, path: "v1/hello" }])).toThrow(RangeError);
  });

  it("toAsciiJson escapes every non-ASCII character and <, >, &, and parses back to the same value", () => {
    const value = { text: "a<b>&c é 漢 😀 \u007f", n: 1 };
    const text = toAsciiJson(value);
    expect(text).toMatch(/^[\x20-\x7e]*$/);
    expect(text).toContain("\\ud83d\\ude00");
    expect(JSON.parse(text)).toEqual(value);
  });
});

describe("page cursors", () => {
  const Key = Type.Object({ c: Type.String({ pattern: "^[0-9a-f]{4}$" }), k: Type.Tuple([Type.String(), Type.Integer()]) }, strict);
  const cursors = pageCursor(Key);

  it("give back the value they were made of, as base64url text without padding", () => {
    const value = { c: "abcd", k: ["é漢", 3] as [string, number] };
    const text = cursors.encode(value);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(cursors.decode(text)).toEqual(value);
  });

  it("refuse anything else with 400 invalid-request: forged, truncated, too long, or a value outside the schema", () => {
    const b64 = (v: unknown) => Buffer.from(JSON.stringify(v)).toString("base64url");
    const good = cursors.encode({ c: "abcd", k: ["x", 1] });
    for (const text of [
      "",
      "not a cursor!",
      good.slice(0, -3),
      "A".repeat(MAX_CURSOR_LENGTH + 1),
      Buffer.from("not json").toString("base64url"),
      Buffer.from([0xff, 0xfe]).toString("base64url"),
      b64({ c: "abcd", k: ["x", 1], extra: 1 }),
      b64({ c: "ABCD", k: ["x", 1] }),
      b64({ c: "abcd", k: ["x", 1.5] }),
    ]) {
      let thrown: unknown;
      try {
        cursors.decode(text);
      } catch (error) {
        thrown = error;
      }
      expect(thrown, text).toBeInstanceOf(RouteError);
      expect([(thrown as RouteError).status, (thrown as RouteError).code], text).toEqual([400, "invalid-request"]);
    }
  });
});
