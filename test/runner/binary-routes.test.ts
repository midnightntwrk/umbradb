import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer, request as httpRequest, type IncomingMessage, type OutgoingHttpHeaders } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { setFlagsFromString } from "node:v8";
import { runInNewContext } from "node:vm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { ReadHandle, ReadOptions } from "../../src/db/api.js";
import type { ApiRegistry, HttpRequest } from "../../src/modules/declaration.js";
import { coreHeaders } from "../../src/runner/api-answers.js";
import { listenModuleApi, type ModuleApiServer } from "../../src/runner/api-server.js";
import { moduleApiFetch } from "../../src/runner/api-session.js";
import { moduleApiHandlers } from "../../src/runner/api-socket.js";
import { ApiRoutes, FILE_CONTENT_TYPE, ModuleApi } from "../../src/runner/module-api.js";

/**
 * The module API's binary routes (FR-C3), without a database: what the listener and the module API do; the same on the
 * handlers a host mounts, over PostgreSQL 18 and PGlite, is `test/library/mounted-binary-routes.test.ts`.
 *
 * - **Registration.** `api.http(method, path, handler, { body?, maxBodyBytes? })`: a malformed option refuses the
 *   registration at the call; a route's options never make a duplicate route another route.
 * - **Bodies.** A binary route gets its body's bytes as they came — bytes that are no UTF-8 included — in a buffer of
 *   its own at offset 0, empty for none and for a GET; a JSON route refuses them 400 as before. A route's own limit
 *   replaces the listener's: a body just under and at it is taken, one byte over it is refused 413 (the connection
 *   closed), above and below the 1 MiB default alike. A request no route answers keeps the old order: 413, then the
 *   UTF-8 400, then 404/405.
 * - **Headers.** Every handler gets the request's headers: names in lower case, the first value of a repeated header.
 * - **Files.** A file answer is streamed after the request's read ended: 200 with `Content-Length`, `Accept-Ranges` and
 *   the file's type (the handler's other headers kept, its `Content-*` and `Accept-Ranges` replaced); a GET's single
 *   range 206 with `Content-Range` (`bytes=a-b`, `bytes=a-`, `bytes=-n`); a range outside the file 416; several ranges,
 *   a POST's range and a stale `If-Range` the whole file; an empty file; a file that cannot be served 500, told to
 *   `onError`; a 48 MiB file sent while the client reads nothing more than its first chunk without the server holding
 *   it in memory (negative control: the same oracle fails a route that reads the file whole into its body).
 * - **The fetch-style handler** (the browser demo's): binary bodies, limits and headers as above; a file answer 500.
 */

/** A database whose reads see height 7, counting the reads open at any moment. */
function countingDb() {
  const state = { open: 0, reads: 0 };
  const db = {
    async read<T>(body: (read: ReadHandle) => Promise<T>, _options?: ReadOptions): Promise<T> {
      state.open++;
      state.reads++;
      try {
        return await body({ height: 7n, query: async () => [] } as unknown as ReadHandle);
      } finally {
        state.open--;
      }
    },
  };
  return { db, state };
}

/** The routes of module `m` registered by `register`, checked. */
function routesOf(register: (api: ApiRegistry) => void): ApiRoutes {
  const routes = new ApiRoutes();
  const registration = routes.open("m");
  register(registration.registry);
  registration.close();
  routes.check();
  return routes;
}

/** The error `body` throws. */
function thrown(body: () => unknown): unknown {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("expected a throw");
}

/** One HTTP answer, read whole: its status, its headers as sent (names in lower case), its body. */
interface Exchanged {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly raw: readonly string[];
  readonly body: Buffer;
}

/** `method path` against `origin` with `body` and `headers`, read whole. */
function exchange(
  origin: string,
  method: string,
  path: string,
  options: { readonly body?: Uint8Array | string; readonly headers?: OutgoingHttpHeaders } = {},
): Promise<Exchanged> {
  const { hostname, port } = new URL(origin);
  const body = options.body === undefined ? undefined : Buffer.from(options.body);
  // A GET's body needs its length stated, or Node.js's client sends it as the next request's bytes.
  const headers = { ...(body === undefined ? {} : { "Content-Length": String(body.byteLength) }), ...options.headers };
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest({ hostname, port, method, path, agent: false, headers }, (answer) => {
      const chunks: Buffer[] = [];
      answer.on("data", (chunk: Buffer) => chunks.push(chunk));
      answer.on("end", () => {
        const headers: Record<string, string> = {};
        for (let index = 0; index < answer.rawHeaders.length; index += 2) {
          headers[(answer.rawHeaders[index] as string).toLowerCase()] = answer.rawHeaders[index + 1] as string;
        }
        resolve({ status: answer.statusCode ?? 0, headers, raw: answer.rawHeaders, body: Buffer.concat(chunks) });
      });
      answer.on("error", reject);
    });
    // A server that answers before it read the whole body may reset the connection while it is sent.
    outgoing.on("error", reject);
    outgoing.end(body);
  });
}

/** The parsed JSON body of `answer`. */
const json = (answer: Exchanged): unknown => JSON.parse(answer.body.toString("utf8"));

/** `n` bytes counting up from `from`, modulo 256: bytes that are no UTF-8 among them. */
const bytes = (n: number, from = 0): Uint8Array<ArrayBuffer> => Uint8Array.from({ length: n }, (_, index) => (from + index) % 256);

/** SHA-256 of `data`, as hex. */
const sha256 = (data: Uint8Array): string => createHash("sha256").update(data).digest("hex");

/** What a binary route echoes of its body: length, digest, offset and whether the buffer is its own. */
const describeBody = (body: Uint8Array) => ({
  length: body.byteLength,
  sha256: sha256(body),
  offset: body.byteOffset,
  own: body.buffer.byteLength === body.byteLength,
  typed: Object.getPrototypeOf(body) === Uint8Array.prototype,
});

const ok = async () => ({ status: 200, body: null });

/** V8's collector, for the memory oracle. */
const collect: () => void = (() => {
  setFlagsFromString("--expose-gc");
  return runInNewContext("gc") as () => void;
})();

/**
 * The bytes the process's array buffers hold (Node.js's buffers among them) once collected: what it still holds, not
 * garbage of earlier tests. V8 frees a collected buffer's memory on a thread of its own after the collection, so the
 * sample is taken after a few collections and pauses.
 */
async function heldArrayBuffers(): Promise<number> {
  for (let round = 0; round < 3; round++) {
    collect();
    await sleep(25);
  }
  return process.memoryUsage().arrayBuffers;
}

describe("ApiRegistry: a route's options", () => {
  it("keeps each route's body kind and limit: json without options, binary or json as given", () => {
    const routes = routesOf((api) => {
      api.http("POST", "/plain", ok);
      api.http("POST", "/json", ok, { maxBodyBytes: 10 });
      api.http("POST", "/bin", async (req) => ({ status: 200, body: req.body.byteLength }), { body: "binary" });
      api.http("POST", "/big", ok, { body: "binary", maxBodyBytes: 0 });
      api.http("GET", "/empty-options", ok, {});
    });
    expect(routes.http.map(({ path, body, maxBodyBytes }) => [path, body, maxBodyBytes])).toEqual([
      ["/plain", "json", undefined],
      ["/json", "json", 10],
      ["/bin", "binary", undefined],
      ["/big", "binary", 0],
      ["/empty-options", "json", undefined],
    ]);
  });

  it("refuses options that are none at the call, naming the module and the route", () => {
    const { registry } = new ApiRoutes().open("m");
    const register = (options: unknown) => () => registry.http("POST", "/x", ok, options as never);
    const bad: [unknown, string][] = [
      [null, "options that are not an object"],
      [[], "options that are not an object"],
      ["binary", "options that are not an object"],
      [5, "options that are not an object"],
      [{ maxBody: 5 }, "the option maxBody, which is not body or maxBodyBytes"],
      [{ body: "text" }, "the body text, which is neither json nor binary"],
      [{ body: null }, "the body null, which is neither json nor binary"],
      [{ maxBodyBytes: -1 }, "the body limit -1, which is not a whole number of bytes"],
      [{ maxBodyBytes: 1.5 }, "the body limit 1.5, which is not a whole number of bytes"],
      [{ maxBodyBytes: Number.NaN }, "the body limit NaN, which is not a whole number of bytes"],
      [{ maxBodyBytes: "10" }, "the body limit 10, which is not a whole number of bytes"],
      [{ maxBodyBytes: 2 ** 53 }, "the body limit 9007199254740992, which is not a whole number of bytes"],
    ];
    for (const [options, why] of bad) {
      const error = thrown(register(options));
      expect(error, why).toBeInstanceOf(TypeError);
      expect((error as Error).message).toBe(`m registered POST /x with ${why}`);
    }
  });

  it("refuses one method and path registered twice, whatever their options", () => {
    const routes = new ApiRoutes();
    const { registry, close } = routes.open("m");
    registry.http("POST", "/x", ok);
    registry.http("POST", "/x", ok, { body: "binary", maxBodyBytes: 5 });
    close();
    expect(() => routes.check()).toThrow("m registers POST /x twice: a route is registered once");
  });
});

describe("ModuleApi: bodies, headers and file answers without a transport", () => {
  /** A module API over `register`'s routes, telling its failures to `errors`. */
  const apiOf = (register: (api: ApiRegistry) => void, errors: unknown[] = []) =>
    new ModuleApi(routesOf(register), { db: countingDb().db, timeoutMs: 1_000, onError: (error, where) => errors.push([where, error]) });

  it("bodyRule: the answering route's kind and limit; a JSON route's without its own limit when no route answers", () => {
    const api = apiOf((r) => {
      r.http("POST", "/bin/:id", ok, { body: "binary", maxBodyBytes: 7 });
      r.http("POST", "/json", ok, { maxBodyBytes: 3 });
      r.http("GET", "/json", ok);
    });
    expect(api.bodyRule("POST", "/bin/a%20b")).toEqual({ binary: true, maxBodyBytes: 7 });
    expect(api.bodyRule("POST", "/json")).toEqual({ binary: false, maxBodyBytes: 3 });
    expect(api.bodyRule("GET", "/json")).toEqual({ binary: false, maxBodyBytes: undefined });
    for (const [method, path] of [["GET", "/bin/x"], ["POST", "/nothing"], ["POST", "/bin/%E0"], ["PUT", "/json"], ["POST", "json"]]) {
      expect(api.bodyRule(method as string, path as string), `${method} ${path}`).toEqual({ binary: false, maxBodyBytes: undefined });
    }
  });

  it("gives a binary route its bytes as they are, text as UTF-8, none as an empty array, and a GET none", async () => {
    const seen: unknown[] = [];
    const api = apiOf((r) => {
      const handler = async (req: HttpRequest<Uint8Array>) => {
        seen.push(req.body);
        return { status: 204, body: undefined };
      };
      r.http("POST", "/bin", handler, { body: "binary" });
      r.http("GET", "/bin", handler, { body: "binary" });
    });
    const raw = Uint8Array.of(0xff, 0xfe, 0x00, 0x80);
    for (const body of [raw, "é{", undefined, ""] as const) {
      expect((await api.answer({ method: "POST", path: "/bin", ...(body === undefined ? {} : { body }) })).status).toBe(204);
    }
    expect((await api.answer({ method: "GET", path: "/bin", body: raw })).status).toBe(204);
    expect(seen).toEqual([raw, Uint8Array.of(0xc3, 0xa9, 0x7b), new Uint8Array(0), new Uint8Array(0), new Uint8Array(0)]);
    // The bytes given are passed on, not copied.
    expect(seen[0]).toBe(raw);
  });

  it("reads a JSON route's bytes as UTF-8: parsed, refused 400 when they are no UTF-8, undefined when they hold no text", async () => {
    const seen: unknown[] = [];
    const api = apiOf((r) =>
      r.http("POST", "/json", async (req) => {
        seen.push(req.body);
        return { status: 204, body: undefined };
      }),
    );
    expect((await api.answer({ method: "POST", path: "/json", body: new TextEncoder().encode('{"n":1}') })).status).toBe(204);
    expect((await api.answer({ method: "POST", path: "/json", body: new Uint8Array(0) })).status).toBe(204);
    // A byte-order mark alone decodes to no text.
    expect((await api.answer({ method: "POST", path: "/json", body: Uint8Array.of(0xef, 0xbb, 0xbf) })).status).toBe(204);
    const refused = await api.answer({ method: "POST", path: "/json", body: Uint8Array.of(0x22, 0xff, 0x22) });
    expect([refused.status, JSON.parse(refused.body as string)]).toEqual([
      400,
      { error: { code: "invalid-request", message: "the request body is not UTF-8" } },
    ]);
    const notJson = await api.answer({ method: "POST", path: "/json", body: new TextEncoder().encode("{") });
    expect(JSON.parse(notJson.body as string)).toEqual({ error: { code: "invalid-request", message: "the request body is not JSON" } });
    expect(seen).toEqual([{ n: 1 }, undefined, undefined]);
  });

  it("gives every handler the request's headers: lower-case names, the first value of a repeated one, frozen, no prototype", async () => {
    const seen: Record<string, string>[] = [];
    const api = apiOf((r) => {
      r.http("GET", "/h", async (req) => {
        seen.push(req.headers);
        return { status: 204, body: undefined };
      });
      r.http("POST", "/hb", async (req) => {
        seen.push(req.headers);
        return { status: 204, body: undefined };
      }, { body: "binary" });
    });
    const headers: [string, string][] = [["X-One", "1"], ["x-rep", "a"], ["X-REP", "b"], ["Authorization", "Bearer t"], ["constructor", "c"]];
    await api.answer({ method: "GET", path: "/h", headers });
    await api.answer({ method: "POST", path: "/hb", headers: new Headers({ "X-Fetch": "f" }) });
    await api.answer({ method: "GET", path: "/h" });
    const expected: Record<string, string>[] = [
      { "x-one": "1", "x-rep": "a", authorization: "Bearer t", constructor: "c" },
      { "x-fetch": "f" },
      {},
    ];
    expect(seen.map((h): Record<string, string> => ({ ...h }))).toEqual(expected);
    expect(Object.getPrototypeOf(seen[0])).toBeNull();
    expect(Object.isFrozen(seen[0])).toBe(true);
  });

  it("passes a file answer on as the answer's file, its type application/octet-stream unless given; failed() tells onError", async () => {
    const errors: unknown[] = [];
    const api = apiOf((r) => {
      r.http("GET", "/f", async () => ({ status: 200, headers: { ETag: '"x"' }, file: { path: "/data/a.bin" } }));
      r.http("POST", "/typed", async () => ({ status: 200, file: { path: "/data/b.json", contentType: "application/json" } }));
    }, errors);
    const plain = await api.answer({ method: "GET", path: "/f" });
    expect(plain).toMatchObject({ status: 200, headers: { ETag: '"x"' }, body: "" });
    expect([plain.file?.path, plain.file?.contentType]).toEqual(["/data/a.bin", FILE_CONTENT_TYPE]);
    expect(FILE_CONTENT_TYPE).toBe("application/octet-stream");
    const typed = await api.answer({ method: "POST", path: "/typed" });
    expect([typed.file?.path, typed.file?.contentType, typed.headers]).toEqual(["/data/b.json", "application/json", {}]);
    const failure = new Error("gone");
    plain.file?.failed(failure);
    expect(errors).toEqual([[{ module: "m", route: "GET /f" }, failure]]);
    // A body answer carries no file.
    const body = await apiOf((r) => r.http("GET", "/b", async () => ({ status: 200, body: { a: 1 } }))).answer({ method: "GET", path: "/b" });
    expect(body.file).toBeUndefined();
  });

  it("answers 500 for a file answer that is none, telling onError why", async () => {
    const answers: Record<string, unknown> = {
      "/with-body": { status: 200, body: "x", file: { path: "/a" } },
      "/status": { status: 206, file: { path: "/a" } },
      "/null-file": { status: 200, file: null },
      "/no-path": { status: 200, file: {} },
      "/empty-path": { status: 200, file: { path: "" } },
      "/nul-path": { status: 200, file: { path: "/a\0b" } },
      "/number-path": { status: 200, file: { path: 7 } },
      "/type": { status: 200, file: { path: "/a", contentType: "text/plain\n" } },
      "/empty-type": { status: 200, file: { path: "/a", contentType: "" } },
      "/number-type": { status: 200, file: { path: "/a", contentType: 1 } },
    };
    const errors: unknown[] = [];
    const api = apiOf((r) => {
      for (const [path, answer] of Object.entries(answers)) r.http("GET", path, async () => answer as never);
    }, errors);
    for (const path of Object.keys(answers)) {
      const answer = await api.answer({ method: "GET", path });
      expect([path, answer.status, answer.file, JSON.parse(answer.body as string)]).toEqual([
        path,
        500,
        undefined,
        { error: { code: "internal-error", message: "the module API could not answer the request" } },
      ]);
    }
    expect(errors.map((entry) => ((entry as [unknown, Error])[1]).message)).toEqual([
      "the handler of GET /with-body answered both a body and a file",
      "the handler of GET /status answered a file with the status 206, not 200",
      "the handler of GET /null-file answered a file whose path is not a non-empty text, not { path, contentType? }",
      "the handler of GET /no-path answered a file whose path is not a non-empty text, not { path, contentType? }",
      "the handler of GET /empty-path answered a file whose path is not a non-empty text, not { path, contentType? }",
      "the handler of GET /nul-path answered a file whose path is not a non-empty text, not { path, contentType? }",
      "the handler of GET /number-path answered a file whose path is not a non-empty text, not { path, contentType? }",
      "the handler of GET /type answered a file whose contentType HTTP cannot carry (RFC 9110 §5)",
      "the handler of GET /empty-type answered a file whose contentType HTTP cannot carry (RFC 9110 §5)",
      "the handler of GET /number-type answered a file whose contentType HTTP cannot carry (RFC 9110 §5)",
    ]);
  });
});

describe("the listener: binary bodies, per-route limits and headers", () => {
  const servers: ModuleApiServer[] = [];
  const serve = async (register: (api: ApiRegistry) => void, maxBodyBytes?: number) => {
    const errors: unknown[] = [];
    const counting = countingDb();
    const server = await listenModuleApi(
      new ModuleApi(routesOf(register), { db: counting.db, timeoutMs: 1_000, onError: (error, where) => errors.push([where, error]) }),
      "127.0.0.1:0",
      maxBodyBytes === undefined ? {} : { maxBodyBytes },
    );
    servers.push(server);
    return { origin: `http://127.0.0.1:${server.port}`, errors, state: counting.state };
  };
  afterAll(async () => {
    for (const server of servers) await server.close();
  });

  /** Routes that echo what they got of their body. */
  const echoes = (api: ApiRegistry) => {
    api.http("POST", "/bin", async (req) => ({ status: 200, body: describeBody(req.body) }), { body: "binary" });
    api.http("POST", "/bin-limit", async (req) => ({ status: 200, body: describeBody(req.body) }), {
      body: "binary",
      maxBodyBytes: 1_500_000,
    });
    api.http("POST", "/bin-small", async (req) => ({ status: 200, body: describeBody(req.body) }), { body: "binary", maxBodyBytes: 10 });
    api.http("POST", "/json", async (req) => ({ status: 200, body: { got: req.body } }));
    api.http("POST", "/json-small", async (req) => ({ status: 200, body: { got: req.body } }), { maxBodyBytes: 10 });
    api.http("GET", "/get-only", ok);
  };

  it("takes bytes that are no UTF-8 on a binary route, in a buffer of its own; refuses them 400 on a JSON route", async () => {
    const { origin } = await serve(echoes);
    const body = bytes(4_096, 0x80);
    const binary = await exchange(origin, "POST", "/bin", { body });
    expect(binary.status).toBe(200);
    expect(json(binary)).toEqual({ length: 4_096, sha256: sha256(body), offset: 0, own: true, typed: true });
    // Every byte value, in a body of many chunks.
    const large = bytes(1_000_000, 7);
    expect(json(await exchange(origin, "POST", "/bin", { body: large }))).toMatchObject({ length: 1_000_000, sha256: sha256(large) });
    const jsonRoute = await exchange(origin, "POST", "/json", { body: Uint8Array.of(0x22, 0xff, 0x22) });
    expect([jsonRoute.status, json(jsonRoute)]).toEqual([400, { error: { code: "invalid-request", message: "the request body is not UTF-8" } }]);
    // No body: an empty array; a GET of a binary route: none either.
    expect(json(await exchange(origin, "POST", "/bin"))).toMatchObject({ length: 0 });
    expect(json(await exchange(origin, "POST", "/json", { body: '{"a":[1]}' }))).toEqual({ got: { a: [1] } });
  });

  it("holds a route to its own limit: just under and at it taken, one byte over refused 413 and the connection closed", async () => {
    const { origin } = await serve(echoes);
    const limits: [string, number][] = [
      ["/bin-limit", 1_500_000],
      ["/bin-small", 10],
      // A binary route without a limit of its own has the listener's, 1 MiB.
      ["/bin", 1_048_576],
    ];
    for (const [path, limit] of limits) {
      for (const size of [limit - 1, limit]) {
        const taken = await exchange(origin, "POST", path, { body: bytes(size) });
        expect([path, size, taken.status, (json(taken) as { length: number }).length]).toEqual([path, size, 200, size]);
      }
      // Fetch's client reads the answer that comes before its body is sent whole.
      const over = await fetch(`${origin}${path}`, { method: "POST", body: bytes(limit + 1) });
      expect([path, over.status, over.headers.get("connection"), await over.json()]).toEqual([
        path,
        413,
        "close",
        { error: { code: "request-too-large", message: `the request body is larger than ${limit} bytes` } },
      ]);
    }
    // A JSON route with a limit of its own.
    expect(json(await exchange(origin, "POST", "/json-small", { body: '"12345678"' }))).toEqual({ got: "12345678" });
    const jsonOver = await exchange(origin, "POST", "/json-small", { body: '"123456789"' });
    expect([jsonOver.status, json(jsonOver)]).toEqual([
      413,
      { error: { code: "request-too-large", message: "the request body is larger than 10 bytes" } },
    ]);
  });

  it("answers a route's limit above the listener's own, and the listener's limit where the route has none", async () => {
    const { origin } = await serve(echoes, 16);
    expect(json(await exchange(origin, "POST", "/bin-limit", { body: bytes(100_000) }))).toMatchObject({ length: 100_000 });
    const json17 = await exchange(origin, "POST", "/json", { body: '"123456789012345"' });
    expect([json17.status, (json(json17) as { error: { message: string } }).error.message]).toEqual([
      413,
      "the request body is larger than 16 bytes",
    ]);
  });

  it("keeps the old order for a request no route answers: the listener's limit (413), UTF-8 (400), then 404 and 405", async () => {
    const { origin } = await serve(echoes, 64);
    const large = await exchange(origin, "POST", "/nothing", { body: "x".repeat(100) });
    expect([large.status, json(large)]).toEqual([413, { error: { code: "request-too-large", message: "the request body is larger than 64 bytes" } }]);
    const notUtf8 = await exchange(origin, "POST", "/nothing", { body: Uint8Array.of(0xff) });
    expect([notUtf8.status, json(notUtf8)]).toEqual([400, { error: { code: "invalid-request", message: "the request body is not UTF-8" } }]);
    expect((await exchange(origin, "POST", "/nothing", { body: "{}" })).status).toBe(404);
    // A method the path lacks: the same order, then 405.
    expect((await exchange(origin, "POST", "/get-only", { body: "x".repeat(100) })).status).toBe(413);
    expect((await exchange(origin, "POST", "/get-only", { body: Uint8Array.of(0xff) })).status).toBe(400);
    const method = await exchange(origin, "POST", "/get-only", { body: "{}" });
    expect([method.status, method.headers.allow]).toEqual([405, "GET"]);
    // A binary route's own limit applies to its method only: a GET of a POST-only binary path is read as no route's.
    expect((await exchange(origin, "GET", "/bin-limit", { body: "x".repeat(100) })).status).toBe(413);
  });

  it("gives the handler the request's headers: lower-case names, the first value of a repeated header", async () => {
    const seen: Record<string, string>[] = [];
    const { origin } = await serve((api) => {
      api.http("GET", "/headers", async (req) => {
        seen.push({ ...req.headers });
        return { status: 200, body: { ...req.headers } };
      });
      api.http("POST", "/bin-headers", async (req) => ({ status: 200, body: req.headers["x-key"] ?? null }), { body: "binary" });
    });
    const answer = await exchange(origin, "GET", "/headers", {
      headers: { "X-Custom": "Value One", "x-rep": ["first", "second"], Authorization: "Bearer secret-token" },
    });
    expect(answer.status).toBe(200);
    expect(seen[0]).toMatchObject({ "x-custom": "Value One", "x-rep": "first", authorization: "Bearer secret-token" });
    expect(seen[0]?.host).toMatch(/^127\.0\.0\.1:\d+$/);
    expect(Object.keys(seen[0] as object).every((name) => name === name.toLowerCase())).toBe(true);
    expect(json(await exchange(origin, "POST", "/bin-headers", { headers: { "X-Key": "k" }, body: bytes(3) }))).toBe("k");
  });
});

describe("the listener: file answers", () => {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-files-"));
  const small = join(dir, "small.bin");
  const empty = join(dir, "empty.bin");
  const large = join(dir, "large.bin");
  const folder = join(dir, "folder");
  const SMALL = bytes(100, 200);
  /** 48 MiB: a 1 MiB pseudo-random block, each copy shifted by its index. */
  const LARGE_SIZE = 48 * 1_048_576;
  let largeDigest = "";
  const servers: ModuleApiServer[] = [];
  const errors: unknown[] = [];
  const counting = countingDb();
  /** Whether a read was open while each file route's handler ran, and when each file answer's head arrived. */
  const during: number[] = [];
  let origin = "";

  beforeAll(async () => {
    writeFileSync(small, SMALL);
    writeFileSync(empty, new Uint8Array(0));
    mkdirSync(folder);
    const hash = createHash("sha256");
    const block = new Uint8Array(1_048_576);
    for (let index = 0; index < block.length; index++) block[index] = (index * 2_654_435_761) >>> 24;
    const chunks: Uint8Array[] = [];
    for (let copy = 0; copy < LARGE_SIZE / block.length; copy++) {
      const shifted = block.map((value) => (value + copy) % 256);
      chunks.push(shifted);
      hash.update(shifted);
    }
    writeFileSync(large, Buffer.concat(chunks));
    largeDigest = hash.digest("hex");
    const register = (api: ApiRegistry) => {
      const fileRoute = (method: "GET" | "POST", path: string, file: string, extra: Record<string, unknown> = {}) =>
        api.http(method, path, async () => {
          during.push(counting.state.open);
          return { status: 200, file: { path: file }, ...extra } as never;
        });
      fileRoute("GET", "/small", small, {
        headers: {
          ETag: '"small-v1"',
          "Cache-Control": "public, max-age=31536000, immutable",
          // Set by the file answer itself: the handler's are replaced.
          "content-type": "text/wrong",
          "Content-Length": "1",
          "Accept-Ranges": "none",
          "Content-Range": "bytes 0-0/1",
        },
      });
      api.http("GET", "/typed", async () => ({ status: 200, file: { path: small, contentType: "application/x-pss" } }));
      fileRoute("POST", "/small", small);
      fileRoute("GET", "/empty", empty);
      fileRoute("GET", "/large", large);
      fileRoute("GET", "/relative", "small.bin");
      fileRoute("GET", "/missing", join(dir, "missing.bin"));
      fileRoute("GET", "/folder", folder);
      // The negative control of the memory oracle: the same file, read whole into the answer's body.
      api.http("GET", "/large-whole", async () => ({
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
        body: readFileSync(large),
      }));
    };
    const server = await listenModuleApi(
      new ModuleApi(routesOf(register), { db: counting.db, timeoutMs: 1_000, onError: (error, where) => errors.push([where, error]) }),
      "127.0.0.1:0",
    );
    servers.push(server);
    origin = `http://127.0.0.1:${server.port}`;
  }, 120_000);

  afterAll(async () => {
    for (const server of servers) await server.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it("sends the whole file: 200, its length, Accept-Ranges and its type; the handler's other headers kept", async () => {
    const answer = await exchange(origin, "GET", "/small");
    expect(answer.status).toBe(200);
    expect(Buffer.compare(answer.body, Buffer.from(SMALL))).toBe(0);
    expect(answer.headers).toMatchObject({
      "content-type": "application/octet-stream",
      "content-length": "100",
      "accept-ranges": "bytes",
      etag: '"small-v1"',
      "cache-control": "public, max-age=31536000, immutable",
      "x-umbra-version": UMBRADB_VERSION,
    });
    expect(answer.headers["content-range"]).toBeUndefined();
    // Each header once: the handler's own Content-* and Accept-Ranges are gone, not sent beside the file's.
    const names = answer.raw.filter((_, index) => index % 2 === 0).map((name) => name.toLowerCase());
    expect(names.filter((name) => ["content-type", "content-length", "accept-ranges", "content-range"].includes(name)).sort()).toEqual([
      "accept-ranges",
      "content-length",
      "content-type",
    ]);
    const typed = await exchange(origin, "GET", "/typed");
    expect([typed.status, typed.headers["content-type"], typed.body.byteLength]).toEqual([200, "application/x-pss", 100]);
  });

  it("answers one range 206 with Content-Range: bytes=a-b, bytes=a- and bytes=-n, cut to the file", async () => {
    const cases: [string, number, number][] = [
      ["bytes=10-19", 10, 19],
      ["bytes=0-0", 0, 0],
      ["bytes=95-", 95, 99],
      ["bytes=-10", 90, 99],
      ["bytes=-1000", 0, 99],
      ["bytes=90-1000", 90, 99],
    ];
    for (const [range, start, end] of cases) {
      const answer = await exchange(origin, "GET", "/small", { headers: { Range: range } });
      expect([range, answer.status, answer.headers["content-range"], answer.headers["content-length"]]).toEqual([
        range,
        206,
        `bytes ${start}-${end}/100`,
        String(end - start + 1),
      ]);
      expect(Buffer.compare(answer.body, Buffer.from(SMALL.subarray(start, end + 1))), range).toBe(0);
      expect(answer.headers).toMatchObject({ "accept-ranges": "bytes", etag: '"small-v1"', "x-umbra-version": UMBRADB_VERSION });
    }
  });

  it("answers a range outside the file 416 with Content-Range bytes */size and the error body", async () => {
    for (const range of ["bytes=100-", "bytes=100-200", "bytes=-0"]) {
      const answer = await exchange(origin, "GET", "/small", { headers: { Range: range } });
      expect([range, answer.status, answer.headers["content-range"], json(answer)]).toEqual([
        range,
        416,
        "bytes */100",
        { error: { code: "range-not-satisfiable", message: "the range holds none of the file's 100 bytes" } },
      ]);
      // An error answer: the module API's, not the handler's headers.
      expect(answer.headers.etag).toBeUndefined();
      expect(answer.headers["x-umbra-version"]).toBe(UMBRADB_VERSION);
    }
  });

  it("sends the whole file for several ranges, a stale If-Range, another unit, and a POST's range", async () => {
    const asked: [string, string, OutgoingHttpHeaders][] = [
      ["GET", "several ranges", { Range: "bytes=0-1,5-6" }],
      ["GET", "another unit", { Range: "items=0-1" }],
      ["GET", "a malformed range", { Range: "bytes=9-1" }],
      ["GET", "a stale If-Range", { Range: "bytes=0-1", "If-Range": '"small-v0"' }],
      ["GET", "an If-Range date", { Range: "bytes=0-1", "If-Range": "Wed, 21 Oct 2015 07:28:00 GMT" }],
      ["POST", "a POST's range", { Range: "bytes=0-1" }],
    ];
    for (const [method, what, headers] of asked) {
      const answer = await exchange(origin, method, "/small", { headers });
      expect([what, answer.status, answer.headers["content-length"], answer.headers["content-range"]]).toEqual([what, 200, "100", undefined]);
      expect(Buffer.compare(answer.body, Buffer.from(SMALL)), what).toBe(0);
    }
    const current = await exchange(origin, "GET", "/small", { headers: { Range: "bytes=0-1", "If-Range": '"small-v1"' } });
    expect([current.status, current.headers["content-range"]]).toEqual([206, "bytes 0-1/100"]);
  });

  it("sends an empty file as 200 with no bytes, and refuses any range of it 416", async () => {
    const whole = await exchange(origin, "GET", "/empty");
    expect([whole.status, whole.headers["content-length"], whole.body.byteLength]).toEqual([200, "0", 0]);
    const range = await exchange(origin, "GET", "/empty", { headers: { Range: "bytes=0-" } });
    expect([range.status, range.headers["content-range"]]).toEqual([416, "bytes */0"]);
  });

  it("answers 500 for a path that is not absolute, a missing file and a folder, telling onError with the route", async () => {
    errors.length = 0;
    for (const path of ["/relative", "/missing", "/folder"]) {
      const answer = await exchange(origin, "GET", path);
      expect([path, answer.status, json(answer)]).toEqual([
        path,
        500,
        { error: { code: "internal-error", message: "the module API could not answer the request" } },
      ]);
      expect(answer.body.toString("utf8")).not.toContain(dir);
    }
    expect(errors.map((entry) => (entry as [{ route: string }, Error])[0].route)).toEqual(["GET /relative", "GET /missing", "GET /folder"]);
    expect((errors[0] as [unknown, Error])[1].message).toBe('the file answer\'s path "small.bin" is not absolute');
    expect((errors[1] as [unknown, NodeJS.ErrnoException])[1].code).toBe("ENOENT");
    expect((errors[2] as [unknown, Error])[1].message).toMatch(/is not a regular file$/);
  });

  it("streams after the request's read ended: no read is open when the answer's head arrives", async () => {
    during.length = 0;
    const { hostname, port } = new URL(origin);
    const openAtHead = await new Promise<number>((resolve, reject) => {
      const outgoing = httpRequest({ hostname, port, path: "/large", agent: false }, (answer: IncomingMessage) => {
        const open = counting.state.open;
        answer.destroy();
        resolve(open);
      });
      outgoing.on("error", reject);
      outgoing.end();
    });
    // The handler ran inside its read; the file's head came once the read had ended.
    expect(during).toEqual([1]);
    expect(openAtHead).toBe(0);
  });

  /**
   * Requests `path`, reads its first chunk, then holds the rest unread for `holdMs`: how much the process's array
   * buffers grew meanwhile; then reads the rest and gives its length and digest.
   */
  async function heldDownload(path: string, holdMs = 400): Promise<{ readonly grew: number; readonly length: number; readonly digest: string; readonly status: number }> {
    const { hostname, port } = new URL(origin);
    const before = await heldArrayBuffers();
    return new Promise((resolve, reject) => {
      const outgoing = httpRequest({ hostname, port, path, agent: false }, (answer: IncomingMessage) => {
        const hash = createHash("sha256");
        let length = 0;
        let grew = 0;
        let held = false;
        answer.on("data", (chunk: Buffer) => {
          hash.update(chunk);
          length += chunk.byteLength;
          if (held) return;
          held = true;
          answer.pause();
          void sleep(holdMs)
            .then(heldArrayBuffers)
            .then((held) => {
              grew = held - before;
              answer.resume();
            });
        });
        answer.on("end", () => resolve({ grew, length, digest: hash.digest("hex"), status: answer.statusCode ?? 0 }));
        answer.on("error", reject);
      });
      outgoing.on("error", reject);
      outgoing.end();
    });
  }

  /** The memory oracle: a 48 MiB answer held by its client grows the process's array buffers by less than 16 MiB. */
  const STREAMED_BOUND = 16 * 1_048_576;

  it("streams a 48 MiB file in chunks: held by its client, the server holds little of it; then all of it arrives", async () => {
    const download = await heldDownload("/large");
    expect([download.status, download.length, download.digest]).toEqual([200, LARGE_SIZE, largeDigest]);
    expect(download.grew).toBeLessThan(STREAMED_BOUND);
    // A range of the large file, from its middle to its end.
    const answer = await exchange(origin, "GET", "/large", { headers: { Range: `bytes=${LARGE_SIZE / 2}-` } });
    expect([answer.status, answer.body.byteLength, answer.headers["content-range"]]).toEqual([
      206,
      LARGE_SIZE / 2,
      `bytes ${LARGE_SIZE / 2}-${LARGE_SIZE - 1}/${LARGE_SIZE}`,
    ]);
    expect(sha256(answer.body)).toBe(sha256(readFileSync(large).subarray(LARGE_SIZE / 2)));
  }, 120_000);

  it("negative control: the memory oracle fails a route that reads the 48 MiB file whole into its body", async () => {
    const download = await heldDownload("/large-whole");
    expect([download.status, download.length, download.digest]).toEqual([200, LARGE_SIZE, largeDigest]);
    expect(download.grew).toBeGreaterThanOrEqual(STREAMED_BOUND);
  }, 120_000);

  it("sends nothing of a file when a host's server answered the request first, and answers the next", async () => {
    errors.length = 0;
    const handlers = moduleApiHandlers(
      new ModuleApi(
        routesOf((api) => api.http("GET", "/small", async () => ({ status: 200, file: { path: small } }))),
        { db: counting.db, timeoutMs: 1_000, onError: (error, where) => errors.push([where, error]) },
      ),
    );
    let answeredFirst = true;
    const host = createServer((request, response) => {
      if (answeredFirst) {
        response.writeHead(202, { "Content-Type": "text/plain" });
        response.end("the host's own");
      }
      handlers.http(request, response);
    });
    await new Promise<void>((resolve) => host.listen(0, "127.0.0.1", resolve));
    const hostOrigin = `http://127.0.0.1:${(host.address() as { port: number }).port}`;
    try {
      const first = await exchange(hostOrigin, "GET", "/small");
      expect([first.status, first.body.toString("utf8")]).toEqual([202, "the host's own"]);
      await sleep(50);
      answeredFirst = false;
      const next = await exchange(hostOrigin, "GET", "/small");
      expect([next.status, next.body.byteLength, next.headers["x-umbra-version"]]).toEqual([200, 100, UMBRADB_VERSION]);
      expect(errors).toEqual([]);
    } finally {
      await new Promise<void>((resolve) => host.close(() => resolve()));
      await handlers.close();
    }
  });

  it("ends the connection of a client that goes away mid-file, and answers the next request", async () => {
    const { hostname, port } = new URL(origin);
    await new Promise<void>((resolve, reject) => {
      const outgoing = httpRequest({ hostname, port, path: "/large", agent: false }, (answer: IncomingMessage) => {
        answer.once("data", () => {
          answer.destroy();
          resolve();
        });
      });
      outgoing.on("error", reject);
      outgoing.end();
    });
    await sleep(50);
    const next = await exchange(origin, "GET", "/small", { headers: { Range: "bytes=0-3" } });
    expect([next.status, next.body.byteLength]).toEqual([206, 4]);
  });
});

describe("the fetch-style handler: binary bodies, limits, headers; no files", () => {
  it("takes a binary route's bytes up to its own limit, gives headers, and answers a file answer 500, telling onError", async () => {
    const errors: unknown[] = [];
    const seen: unknown[] = [];
    const routes = routesOf((api) => {
      api.http("POST", "/bin", async (req) => {
        seen.push([req.body, req.headers["x-key"]]);
        return { status: 200, body: describeBody(req.body) };
      }, { body: "binary", maxBodyBytes: 8 });
      api.http("GET", "/bin", async (req) => ({ status: 200, body: describeBody(req.body) }), { body: "binary" });
      api.http("GET", "/file", async () => ({ status: 200, file: { path: "/tmp/x" } }));
      api.http("POST", "/json", async (req) => ({ status: 200, body: { got: req.body } }));
    });
    const fetch = moduleApiFetch(new ModuleApi(routes, { db: countingDb().db, timeoutMs: 1_000, onError: (error, where) => errors.push([where, error]) }), {
      core: coreHeaders(undefined),
      maxBodyBytes: 4,
    });
    const at = (path: string, init?: RequestInit) => fetch(new Request(`http://module-api${path}`, init));
    const body = Uint8Array.of(0xff, 0, 1, 2, 3, 4, 5, 6);
    const taken = await at("/bin", { method: "POST", body, headers: { "X-Key": "k" } });
    expect([taken.status, await taken.json()]).toEqual([200, { length: 8, sha256: sha256(body), offset: 0, own: true, typed: true }]);
    expect(seen).toEqual([[body, "k"]]);
    const over = await at("/bin", { method: "POST", body: bytes(9) });
    expect([over.status, ((await over.json()) as { error: { message: string } }).error.message]).toEqual([413, "the request body is larger than 8 bytes"]);
    // A JSON route has the handler's limit (4 bytes here) and refuses bytes that are no UTF-8.
    expect((await at("/json", { method: "POST", body: '"12345"' })).status).toBe(413);
    expect((await at("/json", { method: "POST", body: Uint8Array.of(0xff) })).status).toBe(400);
    expect(await (await at("/bin")).json()).toMatchObject({ length: 0 });
    const file = await at("/file");
    expect([file.status, await file.json()]).toEqual([500, { error: { code: "internal-error", message: "the module API could not answer the request" } }]);
    expect(file.headers.get("x-umbra-version")).toBe(UMBRADB_VERSION);
    expect(errors.map((entry) => [(entry as [{ route: string }, Error])[0].route, (entry as [unknown, Error])[1].message])).toEqual([
      ["GET /file", "a file answer is served by the module API's Node.js handlers only, not by its fetch-style handler"],
    ]);
  });
});

