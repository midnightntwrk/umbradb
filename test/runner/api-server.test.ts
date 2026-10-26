import { once } from "node:events";
import { createServer, type Server, Socket } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import type { BlockWriteHandle, Database, ReadHandle, ReadOptions } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ApiRegistry, ModuleDeclaration } from "../../src/modules/declaration.js";
import {
  CLOSE_TIMEOUT_MS,
  listenModuleApi,
  type ModuleApiServer,
  parseAddress,
  startModuleApi,
} from "../../src/runner/api-server.js";
import type { ChainDataAnswer, ChainDataView } from "../../src/runner/envelope.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { ApiRoutes, type HttpRoute, ModuleApi, registerModuleApis } from "../../src/runner/module-api.js";
import { ProcessContexts } from "../../src/runner/process-context.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { recordingModule, RUNNER_BACKENDS, type SeenCall } from "./loop-harness.js";
import {
  freePort,
  InMemoryBlockSource,
  type Process,
  rejection,
  runLoop,
  startProcess,
  startThroughSeal,
} from "./process-harness.js";

/**
 * The module API on `listen.api` (task 5.2a; RN-15, RN-16; A75): HTTP handlers registered in `on-start-api` answer on
 * the listener with a read handle at the latest committed height, inside the chain-data envelope (`X-Umbra-View`,
 * `X-Umbra-Height`, `X-Umbra-Hash`; a GraphQL response's `extensions`), 503 `no-committed-height` before block S
 * commits; subscriptions on WebSocket at the same listener, notified from the module's `on-after-db-write` through
 * `emit`; two modules registering one route or subscription name refuse startup with `duplicate-api-route` before
 * anything listens. Over a database on both backends, through the runner's startup and loop; the server's own
 * behaviour (the WebSocket protocol, limits, slow subscribers, closing) without one.
 */

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** A WebSocket client that keeps every message it receives, parsed. */
class Client {
  readonly messages: unknown[] = [];
  readonly #waiting: (() => void)[] = [];
  readonly socket: WebSocket;

  private constructor(socket: WebSocket) {
    this.socket = socket;
    socket.on("message", (data, binary) => {
      this.messages.push(binary ? { binary: true } : JSON.parse(String(data)));
      for (const wake of this.#waiting.splice(0)) wake();
    });
    socket.on("close", () => {
      for (const wake of this.#waiting.splice(0)) wake();
    });
  }

  static async connect(url: string): Promise<Client> {
    const socket = new WebSocket(url);
    const client = new Client(socket);
    await once(socket, "open");
    return client;
  }

  send(message: unknown): void {
    this.socket.send(typeof message === "string" ? message : JSON.stringify(message));
  }

  /** Resolves with the messages once there are `count`; rejects after `ms`. */
  async until(count: number, ms = 10_000): Promise<unknown[]> {
    const deadline = Date.now() + ms;
    while (this.messages.length < count) {
      if (Date.now() > deadline || this.socket.readyState === WebSocket.CLOSED) {
        throw new Error(`expected ${count} messages, got ${JSON.stringify(this.messages)}`);
      }
      await new Promise<void>((resolve) => {
        this.#waiting.push(resolve);
        setTimeout(resolve, 50);
      });
    }
    return this.messages.slice(0, count);
  }

  async close(): Promise<void> {
    if (this.socket.readyState === WebSocket.CLOSED) return;
    const closed = once(this.socket, "close");
    this.socket.close();
    await closed;
  }
}

/** Waits until `check` holds, up to `ms`. */
async function eventually(check: () => boolean, ms = 10_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error("the condition did not hold in time");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

/** Whether something accepts TCP connections on `port` of 127.0.0.1. */
async function listening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new Socket();
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.connect(port, "127.0.0.1");
  });
}

/** The module `chain-api` of A75: its rows, three routes, a subscription notified from its `on-after-db-write`. */
function chainApi() {
  const calls: string[] = [];
  const listeners = new Set<(value: unknown) => void>();
  let unsubscribed = 0;
  const module = declaration("chain-api", {
    points: {
      async "on-start-api"(_p, api: ApiRegistry) {
        api.http("GET", "/height", async (_req, read) => {
          calls.push("height");
          const [row] = await read.query("SELECT count(*)::bigint AS rows FROM chain_api.rows");
          return { status: 200, body: { height: read.height, rows: row?.rows } };
        });
        api.http("GET", "/rows/:height", async (req, read) => {
          const rows = await read.query("SELECT height FROM chain_api.rows WHERE height = $1", [BigInt(req.params.height ?? "")]);
          return rows.length === 0
            ? { status: 404, body: { missing: req.params.height, read: read.height } }
            : { status: 200, body: { row: rows[0]?.height, read: read.height } };
        });
        api.http("POST", "/graphql", async (req, read) => ({
          status: 200,
          body: { data: { echo: (req.body as { query?: unknown }).query, read: String(read.height) } },
        }));
        api.subscription("heights", (args, emit) => {
          listeners.add(emit);
          if (args !== null && typeof args === "object" && "hello" in args) emit({ hello: (args as { hello: unknown }).hello });
          return () => {
            listeners.delete(emit);
            unsubscribed++;
          };
        });
      },
      async "on-db-write"(_p, b, w: BlockWriteHandle) {
        await w.execute("INSERT INTO chain_api.rows (height) VALUES ($1)", [b.height]);
      },
      async "on-after-db-write"(_p, b, read: ReadHandle) {
        const [row] = await read.query("SELECT count(*)::bigint AS rows FROM chain_api.rows");
        for (const emit of listeners) emit({ height: b.height, rows: row?.rows, read: read.height });
      },
    },
  });
  return {
    module,
    calls,
    listeners,
    get unsubscribed() {
      return unsubscribed;
    },
  };
}

/** A module `id` whose `on-start-api` runs `register`. */
const registering = (id: string, register: (api: ApiRegistry) => void): ModuleDeclaration =>
  declaration(id, {
    provides: [],
    migrations: [],
    points: {
      async "on-start-api"(_p, api) {
        register(api);
      },
    },
  });

const ok = async () => ({ status: 200, body: null });

/**
 * A75's envelope oracle over a process serving `chain-api` at committed height `height` with `hash`: the problems found
 * on `GET /height`, `GET /rows/1`, `GET /rows/999` (a handler's 404) and `POST /graphql` — none when every response
 * carries the view, height and hash of the read, the GraphQL one in its `extensions` too with its `data` unchanged.
 */
async function envelopeProblems(url: string, height: bigint, hash: Uint8Array): Promise<string[]> {
  const problems: string[] = [];
  const expected = { view: "finalized", height: String(height), hash: hex(hash) };
  const check = (what: string, response: Response, read: unknown) => {
    const got = {
      view: response.headers.get("x-umbra-view"),
      height: response.headers.get("x-umbra-height"),
      hash: response.headers.get("x-umbra-hash"),
    };
    if (JSON.stringify(got) !== JSON.stringify(expected)) problems.push(`${what}: headers ${JSON.stringify(got)}`);
    if (read !== String(height)) problems.push(`${what}: the handler read ${String(read)}`);
  };
  const first = await fetch(`${url}/height`);
  check("GET /height", first, ((await first.json()) as { height?: unknown }).height);
  const row = await fetch(`${url}/rows/1`);
  check("GET /rows/1", row, ((await row.json()) as { read?: unknown }).read);
  const missing = await fetch(`${url}/rows/999`);
  if (missing.status !== 404) problems.push(`GET /rows/999: status ${missing.status}`);
  check("GET /rows/999", missing, ((await missing.json()) as { read?: unknown }).read);
  const graphql = await fetch(`${url}/graphql`, { method: "POST", body: JSON.stringify({ query: "{ x }" }) });
  const body = (await graphql.json()) as { data?: { echo?: unknown; read?: unknown }; extensions?: unknown };
  check("POST /graphql", graphql, body.data?.read);
  if (JSON.stringify(body.data) !== JSON.stringify({ echo: "{ x }", read: String(height) })) {
    problems.push(`POST /graphql: data ${JSON.stringify(body.data)}`);
  }
  if (JSON.stringify(body.extensions) !== JSON.stringify(expected)) {
    problems.push(`POST /graphql: extensions ${JSON.stringify(body.extensions)}`);
  }
  return problems;
}

/** A75's duplicate oracle: the problems found when two modules register `GET /same`, or the subscription `same`. */
async function duplicateProblems(db: () => Promise<Database>, routes: () => ApiRoutes = () => new ApiRoutes()): Promise<string[]> {
  const problems: string[] = [];
  for (const kind of ["http", "subscription"] as const) {
    const port = await freePort();
    const register = (api: ApiRegistry) =>
      kind === "http" ? api.http("GET", "/same", ok) : api.subscription("same", () => () => undefined);
    const outcome = await startProcess(
      await db(),
      [registering("a-api", register), registering("b-api", register)],
      [entry("a-api", 1), entry("b-api", 1)],
      { listen: `127.0.0.1:${port}`, routes: routes() },
    ).then(
      async (process) => {
        await process.close();
        return "started";
      },
      (error: unknown) => error,
    );
    const route = kind === "http" ? "GET /same" : "same";
    if (
      !(
        outcome instanceof UmbraError &&
        outcome.code === "duplicate-api-route" &&
        JSON.stringify(outcome.details) === JSON.stringify({ kind, route, modules: ["a-api", "b-api"] })
      )
    ) {
      problems.push(`${kind}: ${String(outcome)}`);
    }
    if (await listening(port)) problems.push(`${kind}: something listens on the configured port`);
  }
  return problems;
}

/** A negative control: routes that take one route of two modules for two routes. */
class AcceptsDuplicates extends ApiRoutes {
  protected override key(kind: "http" | "subscription", module: string, route: string): string {
    return `${module} ${super.key(kind, module, route)}`;
  }
}

/** A negative control: a module API whose responses lack the envelope (its headers, and a GraphQL body's extensions). */
class NoEnvelope extends ModuleApi {
  protected override async chainData(
    route: HttpRoute,
    read: ReadHandle,
    answer: (view: ChainDataView) => Promise<ChainDataAnswer>,
  ): Promise<ChainDataAnswer> {
    const answered = await super.chainData(route, read, answer);
    const headers = Object.fromEntries(Object.entries(answered.headers ?? {}).filter(([name]) => !/^x-umbra-/i.test(name)));
    const body = answered.body as { extensions?: unknown } | null;
    if (body !== null && typeof body === "object" && "extensions" in body) delete body.extensions;
    return { ...answered, headers };
  }
}

describe.each(RUNNER_BACKENDS)("A75: module APIs on listen.api on $name (RN-15, RN-16)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  let opened: Process[] = [];
  const started = async (...args: Parameters<typeof startProcess>): Promise<Process> => {
    const process = await startProcess(...args);
    opened.push(process);
    return process;
  };
  afterAll(async () => {
    for (const process of opened) await process.close();
    opened = [];
  });

  it("answers with a read at the latest committed height, in the envelope; 503 no-committed-height before block S", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const process = await started(db, [api.module], [entry("chain-api", 1)]);
    // Before block S commits: 503, and the handler is not called.
    const before = await fetch(`${process.url}/height`);
    expect(before.status).toBe(503);
    expect(before.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(before.headers.get("x-umbra-height")).toBeNull();
    expect(await before.json()).toEqual({
      error: {
        code: "no-committed-height",
        message: "no height has committed yet: chain data is answered once block S commits (RN-16)",
      },
    });
    expect(api.calls).toEqual([]);

    const source = new InMemoryBlockSource({ head: 3n });
    await runLoop(process, source, 3n);
    const response = await fetch(`${process.url}/height`);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-umbra-view")).toBe("finalized");
    expect(response.headers.get("x-umbra-height")).toBe("3");
    expect(response.headers.get("x-umbra-hash")).toBe(hex(inMemoryBlock(3n).hash));
    expect(await response.json()).toEqual({ height: "3", rows: "3" });
    expect(await envelopeProblems(process.url, 3n, inMemoryBlock(3n).hash)).toEqual([]);

    // The head rises: each request reads the latest committed height.
    source.finalize(5n);
    await runLoop(process, source, 5n);
    expect(await (await fetch(`${process.url}/height`)).json()).toEqual({ height: "5", rows: "5" });
    expect(await envelopeProblems(process.url, 5n, inMemoryBlock(5n).hash)).toEqual([]);
    // Not a route: 404, without the envelope (no read).
    const missing = await fetch(`${process.url}/nothing`);
    expect([missing.status, missing.headers.get("x-umbra-height")]).toEqual([404, null]);
    expect(((await missing.json()) as { error: { code: string } }).error.code).toBe("not-found");
  }, 120_000);

  it("notifies a subscription from the module's on-after-db-write; unsubscribes on unsubscribe and on close", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const process = await started(db, [api.module], [entry("chain-api", 1)]);
    const first = await Client.connect(process.ws);
    first.send({ type: "subscribe", id: "a", name: "heights", args: { hello: 12345678901234567890n.toString() } });
    expect(await first.until(2)).toEqual([
      { type: "subscribed", id: "a" },
      { type: "next", id: "a", value: { hello: "12345678901234567890" } },
    ]);
    const second = await Client.connect(process.ws);
    second.send({ type: "subscribe", id: "b", name: "heights" });
    await second.until(1);
    expect(api.listeners.size).toBe(2);

    const source = new InMemoryBlockSource({ head: 2n });
    await runLoop(process, source, 2n);
    const notified = (height: number, id: string) => ({
      type: "next",
      id,
      value: { height: String(height), rows: String(height), read: String(height) },
    });
    expect((await first.until(4)).slice(2)).toEqual([notified(1, "a"), notified(2, "a")]);
    expect((await second.until(3)).slice(1)).toEqual([notified(1, "b"), notified(2, "b")]);

    // Unsubscribing by message: the module's unsubscribe runs, and the server says the subscription is complete.
    first.send({ type: "unsubscribe", id: "a" });
    expect((await first.until(5))[4]).toEqual({ type: "complete", id: "a" });
    expect(api.unsubscribed).toBe(1);
    // Closing the connection unsubscribes too.
    await second.close();
    await eventually(() => api.unsubscribed === 2);
    expect(api.listeners.size).toBe(0);

    const third = await Client.connect(process.ws);
    third.send({ type: "subscribe", id: "c", name: "heights" });
    await third.until(1);
    source.finalize(3n);
    await runLoop(process, source, 3n);
    // The loop run again at cursor 2 re-delivers 2's on-after-db-write first (RN-11; task 5.3), then goes on at 3.
    expect((await third.until(3)).slice(1)).toEqual([notified(2, "c"), notified(3, "c")]);
    expect(first.messages).toHaveLength(5);
    await first.close();
    await third.close();
  }, 120_000);

  it("passes A75's duplicate checks: duplicate-api-route for a route or a subscription name, before anything listens", async () => {
    expect(await duplicateProblems(async () => (await backend.database()).db)).toEqual([]);
  }, 120_000);

  it("negative control: a registry that accepts a duplicate route fails A75's duplicate checks", async () => {
    const problems = await duplicateProblems(async () => (await backend.database()).db, () => new AcceptsDuplicates());
    expect(problems).toEqual(["http: started", "subscription: started"]);
  }, 120_000);

  it("negative control: responses without the envelope fail A75's envelope checks", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const sealed = await startThroughSeal(db, [api.module], [entry("chain-api", 1)]);
    const routes = await registerModuleApis(sealed);
    const server = await listenModuleApi(new NoEnvelope(routes, { db, timeoutMs: 30_000 }), "127.0.0.1:0");
    try {
      await runLoop({ db, ...sealed }, new InMemoryBlockSource({ head: 1n }), 1n);
      const url = `http://127.0.0.1:${server.port}`;
      const problems = await envelopeProblems(url, 1n, inMemoryBlock(1n).hash);
      expect(problems.filter((p) => p.includes("headers"))).toHaveLength(4);
      expect(problems).toContain('POST /graphql: extensions undefined');
      // The real module API over the same routes and database passes.
      const real = await listenModuleApi(new ModuleApi(routes, { db, timeoutMs: 30_000 }), "127.0.0.1:0");
      try {
        expect(await envelopeProblems(`http://127.0.0.1:${real.port}`, 1n, inMemoryBlock(1n).hash)).toEqual([]);
      } finally {
        await real.close();
      }
    } finally {
      await server.close();
    }
  }, 120_000);

  it("A36/A39 with on-start-api: on-start-db, then on-start-api with its registry, then the loop's points (RN-1, RN-4)", async () => {
    const { db } = await backend.database();
    const seen: SeenCall[] = [];
    const recorder = recordingModule("recorder", seen, declaration);
    let registry: unknown;
    const withRegistry: ModuleDeclaration = {
      ...recorder,
      points: {
        ...recorder.points,
        async "on-start-api"(p, api) {
          registry = api;
          await recorder.points["on-start-api"]?.call(recorder.points, p, api);
        },
      },
    };
    const process = await started(db, [withRegistry], [entry("recorder", 1)]);
    await runLoop(process, new InMemoryBlockSource({ head: 2n }), 2n);
    const height = (h: number): string[] =>
      ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"].map((p) => `${p}@${h}`);
    // The recorder's entry starts at 1: on-start-height between on-parse and on-compute there (RN-1, RN-9; task 5.3).
    const [fetch1, parse1, ...rest1] = height(1);
    expect(seen.map((c) => (c.height === undefined ? c.point : `${c.point}@${c.height}`))).toEqual([
      "on-start-db",
      "on-start-api",
      "on-finalized@2",
      fetch1,
      parse1,
      "on-start-height@1",
      ...rest1,
      ...height(2),
    ]);
    expect(Object.keys(registry as object).sort()).toEqual(["http", "subscription"]);
    expect(Object.isFrozen(registry)).toBe(true);
  }, 60_000);

  it("runs on-start-api and refuses duplicates without listen.api, listening nowhere", async () => {
    const { db } = await backend.database();
    let ran = false;
    const process = await started(db, [registering("quiet", () => (ran = true))], [entry("quiet", 1)], { listen: null });
    expect(ran).toBe(true);
    expect(process.started.server).toBeNull();
    expect(() => process.url).toThrow(/no module API listener/);
    const twice = rejection(
      startProcess(
        (await backend.database()).db,
        [registering("a-api", (api) => api.http("GET", "/x", ok)), registering("b-api", (api) => api.http("GET", "/x", ok))],
        [entry("a-api", 1), entry("b-api", 1)],
        { listen: null },
      ),
    );
    expect(((await twice) as UmbraError).code).toBe("duplicate-api-route");
  }, 60_000);
});

// ── the server without a database ────────────────────────────────────────────────────────────────────────────

const HASH = new Uint8Array(32).fill(7);

/** A database whose reads see height 7 with `HASH`, for the server's own tests. */
const FAKE_DB = {
  read<T>(body: (read: ReadHandle) => Promise<T>, _options?: ReadOptions): Promise<T> {
    return body({
      height: 7n,
      query: async (sql: string) => (sql.startsWith("SELECT hash") ? [{ hash: HASH }] : []),
    });
  },
};

/** The routes of module `m` registered by `register`. */
function routesOf(register: (api: ApiRegistry) => void): ApiRoutes {
  const routes = new ApiRoutes();
  const registration = routes.open("m");
  register(registration.registry);
  registration.close();
  routes.check();
  return routes;
}

describe("the module API server without a database", () => {
  const servers: ModuleApiServer[] = [];
  const serve = async (
    register: (api: ApiRegistry) => void,
    options: Parameters<typeof listenModuleApi>[2] = {},
    onError?: (error: unknown) => void,
  ) => {
    const server = await listenModuleApi(
      new ModuleApi(routesOf(register), { db: FAKE_DB, timeoutMs: 1_000, ...(onError === undefined ? {} : { onError }) }),
      "127.0.0.1:0",
      options,
    );
    servers.push(server);
    return { server, http: `http://127.0.0.1:${server.port}`, ws: `ws://127.0.0.1:${server.port}` };
  };
  afterAll(async () => {
    for (const server of servers) await server.close();
  });

  it("parses listen addresses: a host name, IPv4, a bracketed IPv6 address, then the port", () => {
    expect(parseAddress("0.0.0.0:8080")).toEqual({ host: "0.0.0.0", port: 8080 });
    expect(parseAddress("localhost:0")).toEqual({ host: "localhost", port: 0 });
    expect(parseAddress("[::1]:65535")).toEqual({ host: "::1", port: 65535 });
    for (const bad of ["", "host", "host:", ":80", "host:65536", "host:-1", "[::1", "a b:1", "host:1x"]) {
      expect(() => parseAddress(bad), bad).toThrow(TypeError);
    }
    expect(() => parseAddress(8080 as unknown as string)).toThrow(
      "expected an address host:port, its port from 0 to 65535 (CF-4), not 8080",
    );
    // Only a string is an address, not an object that prints as one.
    expect(() => parseAddress({ toString: () => "host:1" } as unknown as string)).toThrow(TypeError);
  });

  it("listens on the port it is given and reports it; refuses a port another server holds", async () => {
    const port = await freePort();
    const holder: Server = createServer();
    await new Promise<void>((resolve) => holder.listen(port, "127.0.0.1", resolve));
    try {
      const error = await rejection(listenModuleApi(new ModuleApi(routesOf(() => undefined), { db: FAKE_DB, timeoutMs: 1 }), `127.0.0.1:${port}`));
      expect((error as NodeJS.ErrnoException).code).toBe("EADDRINUSE");
    } finally {
      await new Promise((resolve) => holder.close(resolve));
    }
    const free = await freePort();
    const server = await listenModuleApi(new ModuleApi(routesOf(() => undefined), { db: FAKE_DB, timeoutMs: 1 }), `127.0.0.1:${free}`);
    servers.push(server);
    expect([server.host, server.port]).toEqual(["127.0.0.1", free]);
  });

  it("answers a body larger than its limit with 413 request-too-large, and a body that is not UTF-8 with 400", async () => {
    const bodies: unknown[] = [];
    const { http } = await serve(
      (api) =>
        api.http("POST", "/q", async (req) => {
          bodies.push(req.body);
          return { status: 200, body: null };
        }),
      { maxBodyBytes: 16 },
    );
    const large = await fetch(`${http}/q`, { method: "POST", body: JSON.stringify({ a: "x".repeat(32) }) });
    expect(large.status).toBe(413);
    // The rest of the body is not read: the connection ends after the answer.
    expect(large.headers.get("connection")).toBe("close");
    expect(await large.json()).toEqual({
      error: { code: "request-too-large", message: "the request body is larger than 16 bytes" },
    });
    const notUtf8 = await fetch(`${http}/q`, { method: "POST", body: Uint8Array.of(0x22, 0xff, 0x22) });
    expect(notUtf8.status).toBe(400);
    expect(await notUtf8.json()).toEqual({ error: { code: "invalid-request", message: "the request body is not UTF-8" } });
    const fine = await fetch(`${http}/q`, { method: "POST", body: '"é"' });
    expect(fine.status).toBe(200);
    expect(bodies).toEqual(["é"]);
    // A body of many chunks past the limit is refused too; the handler never runs.
    const many = await fetch(`${http}/q`, { method: "POST", body: "x".repeat(1_000_000) });
    expect(many.status).toBe(413);
    expect(bodies).toHaveLength(1);
  });

  it("answers 400 for a request URL that cannot be read", async () => {
    const { server } = await serve((api) => api.http("GET", "/q", ok));
    const socket = new Socket();
    await new Promise<void>((resolve) => socket.connect(server.port, "127.0.0.1", resolve));
    const answer = new Promise<string>((resolve) => {
      let text = "";
      socket.on("data", (chunk) => {
        text += String(chunk);
        if (text.includes("}}")) resolve(text);
      });
    });
    socket.write("GET http://[ HTTP/1.1\r\nHost: x\r\n\r\n");
    const text = await answer;
    socket.destroy();
    expect(text).toMatch(/^HTTP\/1\.1 400 /);
    expect(text).toContain('{"error":{"code":"invalid-request","message":"the request URL cannot be read"}}');
  });

  it("survives a request whose client goes away in its body, calling no handler", async () => {
    const bodies: unknown[] = [];
    const { server, http } = await serve((api) =>
      api.http("POST", "/q", async (req) => {
        bodies.push(req.body);
        return { status: 200, body: null };
      }),
    );
    const socket = new Socket();
    await new Promise<void>((resolve) => socket.connect(server.port, "127.0.0.1", resolve));
    socket.write("POST /q HTTP/1.1\r\nHost: x\r\nContent-Length: 100\r\n\r\nabc");
    await new Promise((resolve) => setTimeout(resolve, 50));
    socket.destroy();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect((await fetch(`${http}/q`, { method: "POST", body: "1" })).status).toBe(200);
    expect(bodies).toEqual([1]);
  });

  it("passes the URL's path, decoded, and its query to the handler; answers on the address it reports", async () => {
    const seen: unknown[] = [];
    const { server, http } = await serve((api) =>
      api.http("GET", "/echo/:id", async (req) => {
        seen.push(req.params);
        return { status: 200, body: req.params };
      }),
    );
    expect(server.host).toBe("127.0.0.1");
    const response = await fetch(`${http}/echo/a%20b?x=1&x=2&y=%2F`);
    expect(await response.json()).toEqual({ id: "a b", x: "1", y: "/" });
    expect(seen).toHaveLength(1);
  });

  it("answers 500 for a header Node.js cannot send, telling onError", async () => {
    const errors: unknown[] = [];
    const { http } = await serve(
      (api) => api.http("GET", "/bad", async () => ({ status: 200, headers: { "bad name": "x" }, body: null })),
      {},
      (error) => errors.push(error),
    );
    const response = await fetch(`${http}/bad`);
    expect(response.status).toBe(500);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe("internal-error");
    expect(errors).toHaveLength(1);
  });

  it("speaks the subscription protocol: acks, errors for what it cannot do, completes on unsubscribe", async () => {
    let emit: ((value: unknown) => void) | undefined;
    const { ws } = await serve((api) => {
      api.subscription("s", (_args, e) => {
        emit = e;
        return () => undefined;
      });
      api.subscription("throws", () => {
        throw new Error("secret detail");
      });
    });
    const client = await Client.connect(`${ws}/any/path`);
    client.send("{not json");
    client.send({ type: "dance" });
    client.send({ type: "subscribe", id: 7, name: "s" });
    client.send({ type: "subscribe", id: "", name: "s" });
    client.send({ type: "subscribe", id: "x".repeat(129), name: "s" });
    client.send({ type: "subscribe", id: "n", name: 5 });
    client.send({ type: "subscribe", id: "x", name: "nothing" });
    client.send({ type: "subscribe", id: "x", name: "throws" });
    client.send({ type: "subscribe", id: "1", name: "s" });
    client.send({ type: "subscribe", id: "1", name: "s" });
    client.send({ type: "unsubscribe", id: "unknown" });
    client.send({ type: "unsubscribe", id: 5 });
    client.socket.send(Buffer.from([1, 2]), { binary: true });
    const invalid = (message: string, id?: string) => ({
      type: "error",
      ...(id === undefined ? {} : { id }),
      error: { code: "invalid-request", message },
    });
    const malformed = invalid("a subscribe message has an id, a string of 1 to 128 characters, and a name, a string");
    expect(await client.until(13)).toEqual([
      invalid("a message is a JSON object with a type"),
      invalid("a message's type is subscribe or unsubscribe"),
      malformed,
      malformed,
      malformed,
      malformed,
      { type: "error", id: "x", error: { code: "not-found", message: "no subscription is named nothing" } },
      { type: "error", id: "x", error: { code: "internal-error", message: "the subscription throws could not be opened" } },
      { type: "subscribed", id: "1" },
      invalid("the subscription 1 is open already", "1"),
      invalid("no subscription unknown is open", "unknown"),
      invalid("no subscription 5 is open"),
      invalid("a message is a JSON object with a type"),
    ]);
    emit?.({ big: 2n ** 70n, bytes: Uint8Array.of(1) });
    expect((await client.until(14))[13]).toEqual({ type: "next", id: "1", value: { big: "1180591620717411303424", bytes: "0x01" } });
    client.send({ type: "unsubscribe", id: "1" });
    expect((await client.until(15))[14]).toEqual({ type: "complete", id: "1" });
    // After the unsubscribe the emit sends nothing.
    emit?.(1);
    client.send({ type: "subscribe", id: "1", name: "s" });
    expect((await client.until(16))[15]).toEqual({ type: "subscribed", id: "1" });
    // An id of 128 characters is one.
    const long = "y".repeat(128);
    client.send({ type: "subscribe", id: long, name: "s" });
    expect((await client.until(17))[16]).toEqual({ type: "subscribed", id: long });
    await client.close();
  });

  it("closes a connection whose message is over the limit (1009), unsubscribing it, and serves the next", async () => {
    let unsubscribed = 0;
    const { ws } = await serve(
      (api) =>
        api.subscription("s", () => () => {
          unsubscribed++;
        }),
      { maxMessageBytes: 256 },
    );
    const client = await Client.connect(ws);
    client.send({ type: "subscribe", id: "1", name: "s" });
    await client.until(1);
    const closed = once(client.socket, "close");
    client.send({ type: "subscribe", id: "2", name: "s", args: "x".repeat(1_000) });
    const [code] = (await closed) as [number];
    expect(code).toBe(1009);
    await eventually(() => unsubscribed === 1);
    const next = await Client.connect(ws);
    next.send({ type: "subscribe", id: "1", name: "s" });
    expect(await next.until(1)).toEqual([{ type: "subscribed", id: "1" }]);
    await next.close();
  });

  it("throws at the module's emit for a value it cannot write, and keeps the subscription", async () => {
    let emit: ((value: unknown) => void) | undefined;
    const { ws } = await serve((api) =>
      api.subscription("s", (_args, e) => {
        emit = e;
        return () => undefined;
      }),
    );
    const client = await Client.connect(ws);
    client.send({ type: "subscribe", id: "1", name: "s" });
    await client.until(1);
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => emit?.(cyclic)).toThrow(TypeError);
    emit?.("fine");
    expect((await client.until(2))[1]).toEqual({ type: "next", id: "1", value: "fine" });
    await client.close();
  });

  it("disconnects a subscriber that falls behind, never making the emitter wait, and unsubscribes it", async () => {
    let emit: ((value: unknown) => void) | undefined;
    let unsubscribed = 0;
    const { ws } = await serve(
      (api) =>
        api.subscription("s", (_args, e) => {
          emit = e;
          return () => {
            unsubscribed++;
          };
        }),
    );
    const slow = await Client.connect(ws);
    slow.send({ type: "subscribe", id: "1", name: "s" });
    await slow.until(1);
    // The client stops reading: what the server sends piles up in its buffer.
    (slow.socket as unknown as { _socket: Socket })._socket.pause();
    const value = "x".repeat(256 * 1024);
    let longest = 0;
    for (let index = 0; index < 400 && unsubscribed === 0; index++) {
      const at = performance.now();
      emit?.(value);
      longest = Math.max(longest, performance.now() - at);
      await new Promise((resolve) => setImmediate(resolve));
    }
    expect(unsubscribed).toBe(1);
    expect(longest).toBeLessThan(250);
    // Once disconnected, the emit is a no-op.
    expect(() => emit?.(value)).not.toThrow();
    (slow.socket as unknown as { _socket: Socket })._socket.resume();
    await eventually(() => slow.socket.readyState === WebSocket.CLOSED);
  });

  it("closes: every WebSocket connection ends, its subscriptions are unsubscribed, and nothing listens", async () => {
    let unsubscribed = 0;
    const server = await listenModuleApi(
      new ModuleApi(
        routesOf((api) => {
          api.subscription("s", () => () => {
            unsubscribed++;
          });
          api.http("GET", "/x", ok);
        }),
        { db: FAKE_DB, timeoutMs: 1 },
      ),
      "127.0.0.1:0",
    );
    const client = await Client.connect(`ws://127.0.0.1:${server.port}`);
    client.send({ type: "subscribe", id: "1", name: "s" });
    client.send({ type: "subscribe", id: "2", name: "s" });
    await client.until(2);
    const keepAlive = await fetch(`http://127.0.0.1:${server.port}/x`);
    expect(keepAlive.status).toBe(200);
    const closed = once(client.socket, "close");
    await server.close();
    const [code] = (await closed) as [number];
    expect(code).toBe(1001);
    expect(unsubscribed).toBe(2);
    expect(await listening(server.port)).toBe(false);
    await server.close();
  });

  it("closes while a request is in flight: its connection ends, and its answer goes nowhere", async () => {
    let release: (() => void) | undefined;
    let answered = false;
    const server = await listenModuleApi(
      new ModuleApi(
        routesOf((api) =>
          api.http("GET", "/slow", async () => {
            await new Promise<void>((resolve) => (release = resolve));
            answered = true;
            return { status: 200, body: "late" };
          }),
        ),
        { db: FAKE_DB, timeoutMs: 1 },
      ),
      "127.0.0.1:0",
    );
    const request = fetch(`http://127.0.0.1:${server.port}/slow`).then(
      () => "answered",
      () => "failed",
    );
    await eventually(() => release !== undefined);
    await server.close();
    expect(await request).toBe("failed");
    release?.();
    await eventually(() => answered);
  });

  it("disconnects, when it closes, a client that does not answer the close, after CLOSE_TIMEOUT_MS", async () => {
    const server = await listenModuleApi(
      new ModuleApi(
        routesOf((api) => api.subscription("s", () => () => undefined)),
        { db: FAKE_DB, timeoutMs: 1 },
      ),
      "127.0.0.1:0",
    );
    const client = await Client.connect(`ws://127.0.0.1:${server.port}`);
    client.send({ type: "subscribe", id: "1", name: "s" });
    await client.until(1);
    // The client stops reading, so it never sees the close frame nor answers it.
    (client.socket as unknown as { _socket: Socket })._socket.pause();
    const started = performance.now();
    await server.close();
    const ms = performance.now() - started;
    expect(ms).toBeGreaterThanOrEqual(CLOSE_TIMEOUT_MS - 50);
    expect(ms).toBeLessThan(CLOSE_TIMEOUT_MS + 2_000);
    client.socket.terminate();
  }, 30_000);

  it("passes a handler's failure through startModuleApi to onError, with the module and the route", async () => {
    const errors: unknown[] = [];
    const broken = new Error("broken handler");
    const routes = new ApiRoutes();
    const graph = { modules: [], ranges: [] };
    const contexts = new ProcessContexts({ graph });
    contexts.seal();
    const registration = routes.open("m");
    registration.registry.http("GET", "/x", async () => {
      throw broken;
    });
    registration.close();
    const started = await startModuleApi({
      graph,
      contexts,
      db: FAKE_DB,
      address: "127.0.0.1:0",
      apiReadTimeoutMs: 1_000,
      routes,
      onError: (error, where) => errors.push([error, where]),
    });
    try {
      expect((await fetch(`http://127.0.0.1:${started.server?.port}/x`)).status).toBe(500);
      expect(errors).toEqual([[broken, { module: "m", route: "GET /x" }]]);
    } finally {
      await started.close();
    }
  });
});
