import Type from "typebox";
import { describe, expect, it } from "vitest";
import type { ReadHandle } from "../../../src/db/api.js";
import { ApiError, JSON_HEADERS, registerRoutes, route, toAsciiJson } from "../../../src/features/token-metadata-api/router.js";
import { prefixEnd } from "../../../src/features/token-metadata-api/sql.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";

/**
 * The typed router (`router.ts`) on its own, with a stand-in registry and read handle: the namespace, the body check,
 * the answer check, the error envelope, the concurrency limit, the answer before any committed height, and ASCII JSON.
 * The real route through the process is `api.test.ts`'s and `api-edges.test.ts`'s.
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

const Body = Type.Object({ name: Type.String({ maxLength: 8 }) }, { additionalProperties: false });
const Reply = Type.Object({ greeting: Type.String() }, { additionalProperties: false });

/** Registers one route under `ns` whose handler is `handle`, and returns its registered handler. */
function one(handle: (body: { name: string }) => Promise<unknown>, maxConcurrent?: number): Handler {
  const { api, routes } = registry();
  registerRoutes(api, "ns", [route({ method: "POST", path: "/v1/hello", body: Body, response: Reply, handle: handle as never })], maxConcurrent);
  expect([...routes.keys()]).toEqual(["POST /ns/v1/hello"]);
  return routes.get("POST /ns/v1/hello")!;
}

const call = (h: Handler, body: unknown, read = readAt()): Promise<Answer> => h({ params: {}, body }, read);
const json = (a: Answer): any => JSON.parse(a.body as string);

describe("the typed router", () => {
  it("serves a route under its namespace, answering ASCII JSON with the fixed and chain-data headers", async () => {
    const answer = await call(one(async (b) => ({ greeting: `héllo ${b.name}` })), { name: "<a>" });
    expect(answer.status).toBe(200);
    expect(answer.body).toBe('{"greeting":"h\\u00e9llo \\u003ca\\u003e"}');
    expect(json(answer)).toEqual({ greeting: "héllo <a>" });
    expect(answer.headers).toMatchObject({ ...JSON_HEADERS, "X-Umbra-Height": "7", "X-Umbra-Hash": `0x${"ab".repeat(32)}` });
  });

  it("refuses a body its schema refuses with 400 BAD_REQUEST, naming paths and rules but never the values", async () => {
    let ran = false;
    const h = one(async () => {
      ran = true;
      return { greeting: "" };
    });
    const tooLong = await call(h, { name: "secret-value-123" });
    expect([tooLong.status, json(tooLong).error.code]).toEqual([400, "BAD_REQUEST"]);
    expect(json(tooLong).error.message).toMatch(/^body\/name: /);
    expect(tooLong.body).not.toContain("secret-value-123");
    const extra = await call(h, { name: "a", other: "secret-value-456" });
    expect([extra.status, String(extra.body).includes("secret-value-456")]).toEqual([400, false]);
    const none = await call(h, undefined);
    expect([none.status, json(none).error.message]).toEqual([400, "body: a JSON body is required"]);
    expect(ran).toBe(false);
  });

  it("never sends an answer its schema refuses: the handler's wrong answer is an error, named by route and path", async () => {
    const wrong = one(async () => ({ greeting: 42, leaked: "secret-answer" }));
    const error = await call(wrong, { name: "a" }).then(
      () => undefined,
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ApiError);
    expect((error as Error).message).toMatch(/^\/ns\/v1\/hello built an answer its schema refuses: body/);
    expect((error as Error).message).not.toContain("secret-answer");
  });

  it("answers a handler's ApiError in the one envelope, and passes any other error on", async () => {
    const refused = await call(one(async () => Promise.reject(new ApiError(404, "NOT_FOUND", "no such greeting"))), { name: "a" });
    expect([refused.status, json(refused)]).toEqual([404, { error: { code: "NOT_FOUND", message: "no such greeting" } }]);
    expect(refused.headers).toMatchObject(JSON_HEADERS);
    const broken = new Error("broken");
    await expect(call(one(async () => Promise.reject(broken)), { name: "a" })).rejects.toBe(broken);
  });

  it("answers 503 no-committed-height before any height commits, without running the handler", async () => {
    let ran = false;
    const h = one(async () => {
      ran = true;
      return { greeting: "" };
    });
    const answer = await call(h, { name: "a" }, readAt(null));
    expect([answer.status, (answer.body as { error: { code: string } }).error.code, ran]).toEqual([503, "no-committed-height", false]);
  });

  it("refuses requests above the limit with 503 BUSY, and frees the slot when a request ends, answered or failed", async () => {
    const gates: (() => void)[] = [];
    let fail = false;
    const h = one(
      () =>
        new Promise((resolve, reject) => {
          gates.push(() => (fail ? reject(new Error("failed")) : resolve({ greeting: "hi" })));
        }),
      1,
    );
    const first = call(h, { name: "a" });
    await new Promise((r) => setTimeout(r, 0));
    const busy = await call(h, { name: "b" });
    expect([busy.status, json(busy).error.code, busy.headers?.["retry-after"]]).toEqual([503, "BUSY", "1"]);
    gates.shift()!();
    expect((await first).status).toBe(200);
    fail = true;
    const failing = call(h, { name: "c" });
    await new Promise((r) => setTimeout(r, 0));
    gates.shift()!();
    await expect(failing).rejects.toThrow("failed");
    fail = false;
    const after = call(h, { name: "d" });
    await new Promise((r) => setTimeout(r, 0));
    gates.shift()!();
    expect((await after).status).toBe(200);
  });

  it("toAsciiJson escapes every non-ASCII character and <, >, &, and parses back to the same value", () => {
    const value = { text: "a<b>&c é 漢 😀 \u007f", n: 1 };
    const text = toAsciiJson(value);
    expect(text).toMatch(/^[\x20-\x7e]*$/);
    expect(text).toContain("\\ud83d\\ude00");
    expect(JSON.parse(text)).toEqual(value);
  });
});

describe("the end of a symbol prefix's range", () => {
  it("is the prefix with its last byte plus one; an empty prefix or one ending in 0xff, never UTF-8 symbols, throws", () => {
    expect([...prefixEnd(new TextEncoder().encode("ABC"))]).toEqual([0x41, 0x42, 0x44]);
    expect([...prefixEnd(new TextEncoder().encode("é"))]).toEqual([0xc3, 0xaa]);
    expect(() => prefixEnd(new Uint8Array())).toThrow(RangeError);
    expect(() => prefixEnd(Uint8Array.of(0x41, 0xff))).toThrow(RangeError);
  });
});
