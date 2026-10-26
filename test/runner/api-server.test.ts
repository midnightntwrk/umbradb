import { once } from "node:events";
import {
  createServer as createHttpServer,
  type IncomingMessage,
  type OutgoingHttpHeader,
  type OutgoingHttpHeaders,
  request as httpRequest,
  ServerResponse,
} from "node:http";
import { createServer, type Server, Socket } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { BlockWriteHandle, Database, ReadHandle, ReadOptions } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ApiRegistry, ModuleDeclaration } from "../../src/modules/declaration.js";
import {
  CLOSE_TIMEOUT_MS,
  listenModuleApi,
  type ModuleApiServer,
  parseAddress,
  startModuleApi,
  unreadableAnswer,
  VERSION_HEADER,
  VersionedResponse,
} from "../../src/runner/api-server.js";
import {
  answerChainData,
  type ChainDataAnswer,
  chainDataHeaders,
  readChainDataView,
  withViewExtensions,
} from "../../src/runner/envelope.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { ApiRoutes, type HttpHandler, type HttpRoute, ModuleApi, registerModuleApis } from "../../src/runner/module-api.js";
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
 * The module API on `listen.api` (tasks 5.2a, 5.2b; RN-15, RN-16; A75): HTTP handlers registered in `on-start-api`
 * answer on the listener with a read handle at the latest committed height, and the client gets each answer as the
 * module wrote it — status, headers and body: the core adds no envelope header and no `extensions` and tells no GraphQL
 * response apart (owner decisions Q104, Q105) —; a module that states the view, height and hash it read does so with
 * the envelope's helpers (`X-Umbra-View`, `X-Umbra-Height`, `X-Umbra-Hash`; a GraphQL response's `extensions`), and the
 * view's `no-committed-height` before block S commits, uncaught, is answered 503; but for one header: every HTTP answer
 * on the listener — a handler's, the module API's own errors, the answers Node.js and `ws` write themselves, the
 * subscription's upgrade — carries `X-Umbra-Version` with the build's version, once, a module's own header of that
 * name replaced (owner decision Q131, task 5.2c); subscriptions on WebSocket at the
 * same listener, notified from the module's `on-after-db-write` through `emit` with exactly the values it emitted; two
 * modules registering one route or subscription name refuse startup with `duplicate-api-route` before anything listens.
 * Over a database on both backends, through the runner's startup and loop; the server's own behaviour (the WebSocket
 * protocol, limits, slow subscribers, closing) without one.
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

/** Whether `name` is `X-Umbra-Version`'s, in any letter case. */
const isVersion = (name: string): boolean => name.toLowerCase() === "x-umbra-version";

/** The values of the `X-Umbra-Version` lines among raw headers (name, value, name, value, …), each line one value. */
const versionsOf = (rawHeaders: readonly string[]): string[] =>
  rawHeaders.flatMap((name, index) => (index % 2 === 0 && isVersion(name) ? [String(rawHeaders[index + 1])] : []));

/** The values of the `X-Umbra-Version` lines in the head of a raw HTTP answer. */
function versionsInHead(text: string): string[] {
  const lines = (text.split("\r\n\r\n")[0] ?? "").split("\r\n").slice(1);
  return lines.flatMap((line) => {
    const colon = line.indexOf(":");
    return colon > 0 && isVersion(line.slice(0, colon)) ? [line.slice(colon + 1).trim()] : [];
  });
}

/** One HTTP exchange on a connection of its own: the answer's status, its header lines as sent, its body. */
async function exchange(
  url: string,
  method: string,
  path: string,
  body?: string | Uint8Array,
): Promise<{ status: number; rawHeaders: string[]; body: Buffer }> {
  const { hostname, port } = new URL(url);
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest({ hostname, port, method, path, agent: false }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.on("end", () => {
        const status = response.statusCode as number;
        resolve({ status, rawHeaders: response.rawHeaders, body: Buffer.concat(chunks) });
      });
    });
    outgoing.on("error", reject);
    outgoing.end(body);
  });
}

/** What the listener on `port` of 127.0.0.1 writes back to `text`, until it closes the connection. */
async function rawExchange(port: number, text: string): Promise<string> {
  return new Promise((resolve) => {
    const socket = new Socket();
    let answer = "";
    socket.on("data", (chunk) => (answer += String(chunk)));
    socket.on("error", () => undefined);
    socket.on("close", () => resolve(answer));
    socket.connect(port, "127.0.0.1", () => socket.write(text));
  });
}

/** What `chain-api`'s `GET /raw` answers besides its read's height: its own status, headers and bytes. */
const RAW = Object.freeze({
  status: 203,
  headers: Object.freeze({
    "Content-Type": "application/x-chain-api",
    "Cache-Control": "no-store",
    "X-Umbra-Height": "the module's own",
    // The core's header (Q131), in another letter case: replaced by the build's version, never sent beside it.
    "x-Umbra-version": "9",
  }),
  body: Uint8Array.of(0, 1, 2, 0x7f, 0x80, 0xfe, 0xff),
});

/** The headers HTTP itself writes (Node.js's server), beside a module's. */
const TRANSPORT_HEADERS = new Set(["date", "connection", "keep-alive", "content-length", "transfer-encoding"]);

/**
 * The module `chain-api` of A75: its rows; routes that state their view with the envelope's helpers (`GET /height`,
 * `GET /rows/:height`, `POST /graphql`) and routes that do not (`POST /plain`, a GraphQL response's shape, and `GET
 * /raw`, its own status, headers and bytes); routes whose handlers fail (`GET /fails`: 500, `GET /timeout`: a read's
 * `query-timeout`, 504); a subscription notified from its `on-after-db-write`.
 */
function chainApi() {
  const calls: string[] = [];
  const listeners = new Set<(value: unknown) => void>();
  let unsubscribed = 0;
  const module = declaration("chain-api", {
    points: {
      async "on-start-api"(_p, api: ApiRegistry) {
        api.http("GET", "/height", async (_req, read) => {
          calls.push("height");
          // Before block S this fails with no-committed-height, which the handler leaves to the module API (503).
          const view = await readChainDataView(read);
          const [row] = await read.query("SELECT count(*)::bigint AS rows FROM chain_api.rows");
          return { status: 200, headers: chainDataHeaders(view), body: { height: read.height, rows: row?.rows } };
        });
        api.http("GET", "/rows/:height", async (req, read) =>
          answerChainData(read, async () => {
            const rows = await read.query("SELECT height FROM chain_api.rows WHERE height = $1", [BigInt(req.params.height ?? "")]);
            return rows.length === 0
              ? { status: 404, body: { missing: req.params.height, read: read.height } }
              : { status: 200, body: { row: rows[0]?.height, read: read.height } };
          }),
        );
        api.http("POST", "/graphql", async (req, read) => ({
          status: 200,
          body: withViewExtensions(
            { data: { echo: (req.body as { query?: unknown }).query, read: String(read.height) } },
            await readChainDataView(read),
          ),
        }));
        api.http("POST", "/plain", async (req, read) => {
          calls.push("plain");
          return { status: 200, body: { data: { echo: (req.body as { query?: unknown }).query, read: read.height } } };
        });
        api.http("GET", "/raw", async (_req, read) => ({
          status: RAW.status,
          headers: { ...RAW.headers, "X-Read": String(read.height) },
          body: RAW.body,
        }));
        api.http("GET", "/fails", async () => {
          throw new Error("chain-api failed");
        });
        api.http("GET", "/timeout", async () => {
          throw new UmbraError("query-timeout", "the read of GET /timeout ran past apiReadTimeoutMs");
        });
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
 * A75's helper oracle over a process serving `chain-api` at committed height `height` with `hash`: the problems found
 * on the routes whose handlers call the envelope's helpers — `GET /height`, `GET /rows/1`, `GET /rows/999` (a
 * handler's 404) and `POST /graphql` — none when each response carries the view, height and hash of the read: the
 * headers on the first three, the GraphQL one's in its `extensions` (and no header), its `data` unchanged.
 */
async function helperProblems(url: string, height: bigint, hash: Uint8Array): Promise<string[]> {
  const problems: string[] = [];
  const expected = { view: "finalized", height: String(height), hash: hex(hash) };
  /** `response`'s envelope headers: those of the read (`expected`), or none for a route whose module writes none. */
  const check = (what: string, response: Response, read: unknown, headers: typeof expected | null = expected) => {
    const got = {
      view: response.headers.get("x-umbra-view"),
      height: response.headers.get("x-umbra-height"),
      hash: response.headers.get("x-umbra-hash"),
    };
    const want = headers ?? { view: null, height: null, hash: null };
    if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`${what}: headers ${JSON.stringify(got)}`);
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
  // The GraphQL module states its view in the body's extensions only (RN-16's scenario): no header.
  check("POST /graphql", graphql, body.data?.read, null);
  if (JSON.stringify(body.data) !== JSON.stringify({ echo: "{ x }", read: String(height) })) {
    problems.push(`POST /graphql: data ${JSON.stringify(body.data)}`);
  }
  if (JSON.stringify(body.extensions) !== JSON.stringify(expected)) {
    problems.push(`POST /graphql: extensions ${JSON.stringify(body.extensions)}`);
  }
  return problems;
}

/**
 * A75's "the core leaves a module's answer as the module wrote it" (RN-16's scenario, Q104, Q105) over a process
 * serving `chain-api` whose reads see `height` (null before block S): the problems found on the routes whose handlers
 * call no helper — `GET /raw` (its own status, headers, an `X-Umbra-Height` of its own among them, and bytes) and `POST
 * /plain` (a GraphQL response's shape, written as JSON) — none when the client gets each exactly as written but for
 * the core's `X-Umbra-Version` (Q131): the status, the module's headers with their values and no others but HTTP's own
 * (and, for a body the module gave as an object, the JSON type its encoding writes), the build's version in place of
 * the module's own header of that name, and the body byte for byte.
 */
async function untouchedProblems(url: string, height: bigint | null): Promise<string[]> {
  const problems: string[] = [];
  const names = (response: Response) =>
    [...response.headers.keys()].filter((name) => !TRANSPORT_HEADERS.has(name) && !isVersion(name));
  /** The core's header: the build's version, once (a second line would show as two values joined by a comma). */
  const version = (what: string, response: Response) => {
    const got = response.headers.get(VERSION_HEADER);
    if (got !== UMBRADB_VERSION) problems.push(`${what}: X-Umbra-Version ${String(got)}`);
  };
  const raw = await fetch(`${url}/raw`);
  const written = { ...RAW.headers, "X-Read": String(height) };
  if (raw.status !== RAW.status) problems.push(`GET /raw: status ${raw.status}`);
  for (const [name, value] of Object.entries(written)) {
    if (isVersion(name)) continue;
    if (raw.headers.get(name) !== value) problems.push(`GET /raw: ${name} ${String(raw.headers.get(name))}`);
  }
  version("GET /raw", raw);
  const extra = names(raw).filter((name) => !Object.keys(written).some((own) => own.toLowerCase() === name));
  if (extra.length > 0) problems.push(`GET /raw: headers added ${extra.join(", ")}`);
  const bytes = new Uint8Array(await raw.arrayBuffer());
  if (hex(bytes) !== hex(RAW.body)) problems.push(`GET /raw: body ${hex(bytes)}`);
  const plain = await fetch(`${url}/plain`, { method: "POST", body: JSON.stringify({ query: "{ x }" }) });
  if (plain.status !== 200) problems.push(`POST /plain: status ${plain.status}`);
  version("POST /plain", plain);
  const added = names(plain).filter((name) => name !== "content-type");
  if (added.length > 0) problems.push(`POST /plain: headers added ${added.join(", ")}`);
  if (plain.headers.get("content-type") !== "application/json; charset=utf-8") {
    problems.push(`POST /plain: content-type ${String(plain.headers.get("content-type"))}`);
  }
  const text = await plain.text();
  const expected = JSON.stringify({ data: { echo: "{ x }", read: height === null ? null : String(height) } });
  if (text !== expected) problems.push(`POST /plain: body ${text}`);
  return problems;
}

/**
 * RN-16's "every answer names its build" and A75's `X-Umbra-Version` (Q131) over a listener serving `chain-api`, block
 * S committed (`committed`) or not: the problems found on its answers — the handlers' (`GET /raw`'s with the module's
 * own `x-Umbra-version`, a handler's 404), the module API's own errors (404, 405, 400 for a path and for a body, 500,
 * 503 before S, 504) and the subscription's upgrade (101) — none when each has the status asked for and exactly one
 * `X-Umbra-Version` line, the build's version. (A WebSocket message or close after the upgrade has no headers.)
 */
async function versionProblems(url: string, ws: string, committed: boolean): Promise<string[]> {
  const query = JSON.stringify({ query: "{ x }" });
  const asked: readonly (readonly [what: string, method: string, path: string, status: number, body?: string])[] = [
    ...(committed
      ? ([
          ["GET /height", "GET", "/height", 200],
          ["GET /rows/1", "GET", "/rows/1", 200],
          ["GET /rows/999", "GET", "/rows/999", 404],
          ["POST /graphql", "POST", "/graphql", 200, query],
        ] as const)
      : ([["GET /height", "GET", "/height", 503]] as const)),
    ["POST /plain", "POST", "/plain", 200, query],
    ["GET /raw", "GET", "/raw", 203],
    ["GET /nothing", "GET", "/nothing", 404],
    ["POST /raw", "POST", "/raw", 405],
    ["GET /%ff", "GET", "/%ff", 400],
    ["POST /plain with {", "POST", "/plain", 400, "{"],
    ["GET /fails", "GET", "/fails", 500],
    ["GET /timeout", "GET", "/timeout", 504],
  ];
  const problems: string[] = [];
  const check = (what: string, status: number, wanted: number, versions: readonly string[]) => {
    if (status !== wanted) problems.push(`${what}: status ${status}`);
    if (versions.length !== 1 || versions[0] !== UMBRADB_VERSION) {
      problems.push(`${what} (${status}): X-Umbra-Version ${JSON.stringify(versions)}`);
    }
  };
  for (const [what, method, path, status, body] of asked) {
    const answer = await exchange(url, method, path, body);
    check(what, answer.status, status, versionsOf(answer.rawHeaders));
  }
  const socket = new WebSocket(ws);
  // ws emits open right after upgrade, in the same turn: both are listened for at once.
  const opened = once(socket, "open");
  const [upgrade] = (await once(socket, "upgrade")) as [IncomingMessage];
  check("the upgrade", upgrade.statusCode as number, 101, versionsOf(upgrade.rawHeaders));
  await opened;
  const closed = once(socket, "close");
  socket.close();
  await closed;
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

/** A negative control: task 5.2a's module API, which put the envelope's headers on every answer (`answerChainData`). */
class AddsHeaders extends ModuleApi {
  protected override handle(route: HttpRoute, req: Parameters<HttpHandler>[0], read: ReadHandle): Promise<ChainDataAnswer> {
    return answerChainData(read, () => super.handle(route, req, read));
  }
}

/** Task 5.2a's GraphQL rule (Q105's option A): an object whose keys are only `data`, `errors`, `extensions`. */
const graphQLShaped = (body: unknown): body is object =>
  typeof body === "object" &&
  body !== null &&
  !Array.isArray(body) &&
  !(body instanceof Uint8Array) &&
  Object.keys(body).every((key) => ["data", "errors", "extensions"].includes(key)) &&
  ("data" in body || "errors" in body);

/** A negative control: task 5.2a's module API, which put the view in the `extensions` of a GraphQL-shaped body. */
class AddsExtensions extends ModuleApi {
  protected override async handle(
    route: HttpRoute,
    req: Parameters<HttpHandler>[0],
    read: ReadHandle,
  ): Promise<ChainDataAnswer> {
    const answered = await super.handle(route, req, read);
    if (!graphQLShaped(answered.body)) return answered;
    return { ...answered, body: withViewExtensions(answered.body, await readChainDataView(read)) };
  }
}

/**
 * A negative control (Q131): a module API that sets the build's version on the handlers' answers only — a module's own
 * header of that name replaced —, served by Node.js's own response, so the module API's errors go without it.
 */
class VersionsAnswersOnly extends ModuleApi {
  protected override async handle(
    route: HttpRoute,
    req: Parameters<HttpHandler>[0],
    read: ReadHandle,
  ): Promise<ChainDataAnswer> {
    const answered = await super.handle(route, req, read);
    const own = Object.entries(answered.headers ?? {}).filter(([name]) => !isVersion(name));
    return { ...answered, headers: { ...Object.fromEntries(own), [VERSION_HEADER]: UMBRADB_VERSION } };
  }
}

/**
 * A negative control (Q131): answers given the build's version beside, not in place of, a header of that name in
 * another letter case — a module's `x-Umbra-version` then sent too. (Only `writeHead`'s object form, the module API's.)
 */
class AppendsVersion<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  override writeHead(
    statusCode: number,
    headers?: string | OutgoingHttpHeaders | OutgoingHttpHeader[],
    _more?: OutgoingHttpHeaders | OutgoingHttpHeader[],
  ): this {
    const given = headers as OutgoingHttpHeaders | undefined;
    return super.writeHead(statusCode, { ...given, [VERSION_HEADER]: UMBRADB_VERSION });
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

  it("answers each request with a read at the latest committed height and the module's answer as it wrote it; 503 for an uncaught no-committed-height", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const process = await started(db, [api.module], [entry("chain-api", 1)]);
    // Before block S commits: the handler is called; its view's no-committed-height, uncaught, is answered 503.
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
    expect(api.calls).toEqual(["height"]);
    // A handler that does not ask for the view answers as it wrote it, its read's height null.
    expect(await untouchedProblems(process.url, null)).toEqual([]);
    expect(api.calls).toEqual(["height", "plain"]);

    const source = new InMemoryBlockSource({ head: 3n });
    await runLoop(process, source, 3n);
    const response = await fetch(`${process.url}/height`);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-umbra-view")).toBe("finalized");
    expect(response.headers.get("x-umbra-height")).toBe("3");
    expect(response.headers.get("x-umbra-hash")).toBe(hex(inMemoryBlock(3n).hash));
    expect(await response.json()).toEqual({ height: "3", rows: "3" });
    expect(await helperProblems(process.url, 3n, inMemoryBlock(3n).hash)).toEqual([]);
    expect(await untouchedProblems(process.url, 3n)).toEqual([]);

    // The head rises: each request reads the latest committed height.
    source.finalize(5n);
    await runLoop(process, source, 5n);
    expect(await (await fetch(`${process.url}/height`)).json()).toEqual({ height: "5", rows: "5" });
    expect(await helperProblems(process.url, 5n, inMemoryBlock(5n).hash)).toEqual([]);
    expect(await untouchedProblems(process.url, 5n)).toEqual([]);
    // Not a route: 404, without the envelope (no read).
    const missing = await fetch(`${process.url}/nothing`);
    expect([missing.status, missing.headers.get("x-umbra-height")]).toEqual([404, null]);
    expect(((await missing.json()) as { error: { code: string } }).error.code).toBe("not-found");
  }, 120_000);

  it("names its build on every answer: X-Umbra-Version once, the build's, a module's own replaced, the body the module's (Q131)", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const process = await started(db, [api.module], [entry("chain-api", 1)]);
    expect(await versionProblems(process.url, process.ws, false)).toEqual([]);
    await runLoop(process, new InMemoryBlockSource({ head: 2n }), 2n);
    expect(await versionProblems(process.url, process.ws, true)).toEqual([]);
    // RN-16's scenario: the module's own X-Umbra-Version (9) replaced, its body and every other header its own.
    const raw = await exchange(process.url, "GET", "/raw");
    expect(versionsOf(raw.rawHeaders)).toEqual([UMBRADB_VERSION]);
    expect(hex(raw.body)).toBe(hex(RAW.body));
    expect(await untouchedProblems(process.url, 2n)).toEqual([]);
  }, 120_000);

  it("negative control: a module API that leaves the version out of its own errors, or sends a module's beside it, fails 'every answer names its build'", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const sealed = await startThroughSeal(db, [api.module], [entry("chain-api", 1)]);
    const routes = await registerModuleApis(sealed);
    const listeners: ModuleApiServer[] = [];
    const listen = async (made: ModuleApi, response?: typeof ServerResponse) => {
      const server = await listenModuleApi(made, "127.0.0.1:0", response === undefined ? {} : { response });
      listeners.push(server);
      return { url: `http://127.0.0.1:${server.port}`, ws: `ws://127.0.0.1:${server.port}` };
    };
    const options = { db, timeoutMs: 30_000 };
    try {
      const answersOnly = await listen(new VersionsAnswersOnly(routes, options), ServerResponse);
      const appends = await listen(new ModuleApi(routes, options), AppendsVersion);
      const real = await listen(new ModuleApi(routes, options));
      const errors = (before: boolean) => [
        ...(before ? ["GET /height (503): X-Umbra-Version []"] : []),
        "GET /nothing (404): X-Umbra-Version []",
        "POST /raw (405): X-Umbra-Version []",
        "GET /%ff (400): X-Umbra-Version []",
        "POST /plain with { (400): X-Umbra-Version []",
        "GET /fails (500): X-Umbra-Version []",
        "GET /timeout (504): X-Umbra-Version []",
      ];
      const twice = `GET /raw (203): X-Umbra-Version ${JSON.stringify(["9", UMBRADB_VERSION])}`;
      expect(await versionProblems(answersOnly.url, answersOnly.ws, false)).toEqual(errors(true));
      expect(await versionProblems(appends.url, appends.ws, false)).toEqual([twice]);
      expect(await versionProblems(real.url, real.ws, false)).toEqual([]);
      await runLoop({ db, ...sealed }, new InMemoryBlockSource({ head: 1n }), 1n);
      expect(await versionProblems(answersOnly.url, answersOnly.ws, true)).toEqual(errors(false));
      expect(await versionProblems(appends.url, appends.ws, true)).toEqual([twice]);
      expect(await versionProblems(real.url, real.ws, true)).toEqual([]);
      // The one A75 oracle that reads the version through fetch sees the module's beside the build's as one value.
      expect(await untouchedProblems(appends.url, 1n)).toEqual([`GET /raw: X-Umbra-Version 9, ${UMBRADB_VERSION}`]);
    } finally {
      for (const server of listeners) await server.close();
    }
  }, 120_000);

  it("notifies a subscription from the module's on-after-db-write with exactly its values; unsubscribes on unsubscribe and on close", async () => {
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
    // Each value exactly as the module emitted it (toEqual: no member added, Q104 A), in the protocol's `next`.
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

  it("negative control: a module API that adds the envelope's headers, or a GraphQL body's extensions, fails A75's 'as the module wrote it'", async () => {
    const { db } = await backend.database();
    const api = chainApi();
    const sealed = await startThroughSeal(db, [api.module], [entry("chain-api", 1)]);
    const routes = await registerModuleApis(sealed);
    await runLoop({ db, ...sealed }, new InMemoryBlockSource({ head: 1n }), 1n);
    const problemsOf = async (made: ModuleApi) => {
      const server = await listenModuleApi(made, "127.0.0.1:0");
      try {
        const url = `http://127.0.0.1:${server.port}`;
        return { untouched: await untouchedProblems(url, 1n), helpers: await helperProblems(url, 1n, inMemoryBlock(1n).hash) };
      } finally {
        await server.close();
      }
    };
    const headers = await problemsOf(new AddsHeaders(routes, { db, timeoutMs: 30_000 }));
    expect(headers.untouched).toEqual([
      "GET /raw: X-Umbra-Height 1",
      "GET /raw: headers added x-umbra-hash, x-umbra-view",
      "POST /plain: headers added x-umbra-hash, x-umbra-height, x-umbra-view",
    ]);
    const extensions = await problemsOf(new AddsExtensions(routes, { db, timeoutMs: 30_000 }));
    expect(extensions.untouched).toHaveLength(1);
    expect(extensions.untouched[0]).toMatch(/^POST \/plain: body \{"data":.*"extensions":\{"view":"finalized","height":"1","hash":"0x[0-9a-f]{64}"\}\}$/);
    // The real module API over the same routes and database passes both oracles. Of the helpers' routes, the headers
    // control changes only the GraphQL one, whose module writes no header; the extensions control changes none.
    expect(await problemsOf(new ModuleApi(routes, { db, timeoutMs: 30_000 }))).toEqual({ untouched: [], helpers: [] });
    expect(headers.helpers).toEqual([expect.stringMatching(/^POST \/graphql: headers \{"view":"finalized","height":"1",/)]);
    expect(extensions.helpers).toEqual([]);
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

  it("VersionedResponse: every answer written through it carries the build's version once, in each form of writeHead", async () => {
    const answers: Record<string, (response: ServerResponse) => void> = {
      // A header of the version's name, in any letter case, is replaced; two others differing in case both stay.
      "/object": (response) =>
        response.writeHead(200, { "x-umbra-version": "9", "X-UMBRA-VERSION": "8", "X-A": "1", "x-a": "2" }).end("o"),
      "/array": (response) => response.writeHead(200, ["X-Umbra-Version", "9", "X-B", "1"]).end("a"),
      "/message": (response) => response.writeHead(201, "Made", { "X-Umbra-version": "9", "X-C": "1" }).end(),
      "/message-array": (response) => response.writeHead(202, "Taken", ["x-umbra-version", "9", "X-D", "1"]).end(),
      "/none": (response) => response.writeHead(200).end(),
      "/implicit": (response) => {
        response.statusCode = 204;
        response.end();
      },
      "/set": (response) => {
        response.setHeader("X-Umbra-Version", "9");
        response.setHeader("X-E", "1");
        response.writeHead(200, { "X-F": "1" }).end();
      },
    };
    const server = createHttpServer({ ServerResponse: VersionedResponse }, (request, response) =>
      answers[request.url as string]?.(response),
    );
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    try {
      const seen: Record<string, unknown> = {};
      for (const path of Object.keys(answers)) {
        const { status, rawHeaders, body } = await exchange(url, "GET", path);
        const own = rawHeaders.filter((_, index) => index % 2 === 0).filter((name) => /^x-/i.test(name));
        seen[path] = { status, versions: versionsOf(rawHeaders), own, body: String(body) };
      }
      const named = (status: number, own: string[], body = "") => ({ status, versions: [UMBRADB_VERSION], own, body });
      expect(seen).toEqual({
        "/object": named(200, ["X-A", "x-a", VERSION_HEADER], "o"),
        "/array": named(200, ["X-B", VERSION_HEADER], "a"),
        "/message": named(201, ["X-C", VERSION_HEADER]),
        "/message-array": named(202, ["X-D", VERSION_HEADER]),
        "/none": named(200, [VERSION_HEADER]),
        "/implicit": named(204, [VERSION_HEADER]),
        "/set": named(200, [VERSION_HEADER, "X-E", "X-F"]),
      });
      // The status message given is kept.
      const asked = "GET /message HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n";
      const message = await rawExchange(Number(new URL(url).port), asked);
      expect(message.split("\r\n")[0]).toBe("HTTP/1.1 201 Made");
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  /** The `X-Umbra-Version` values of the listener's answers that are not a handler's, by what was asked. */
  const ownAnswers = async (port: number, http: string): Promise<Record<string, string[]>> => {
    const raw = async (text: string) => versionsInHead(await rawExchange(port, text));
    const tooLarge = await exchange(http, "POST", "/q", JSON.stringify({ a: "x".repeat(32) }));
    const notUtf8 = await exchange(http, "POST", "/q", Uint8Array.of(0x22, 0xff, 0x22));
    const continued = await rawExchange(
      port,
      "POST /q HTTP/1.1\r\nHost: x\r\nExpect: 100-continue\r\nContent-Length: 1\r\nConnection: close\r\n\r\n1",
    );
    const [interim, final] = continued.split("\r\n\r\n");
    expect([tooLarge.status, notUtf8.status, interim, final?.split("\r\n")[0]]).toEqual([
      413,
      400,
      "HTTP/1.1 100 Continue",
      "HTTP/1.1 200 OK",
    ]);
    return {
      "413 request-too-large": versionsOf(tooLarge.rawHeaders),
      "400 a body not UTF-8": versionsOf(notUtf8.rawHeaders),
      "400 a URL it cannot read": await raw("GET http://[ HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n"),
      // Node.js's own answers, through the listener's response: a request without Host, an Expect it does not meet.
      "400 no Host": await raw("GET /q HTTP/1.1\r\nConnection: close\r\n\r\n"),
      "417 an unmet Expect": await raw("GET /q HTTP/1.1\r\nHost: x\r\nExpect: something\r\nConnection: close\r\n\r\n"),
      // The final answer after a 100 Continue (an interim answer: no headers but its status line).
      "200 after 100 Continue": versionsInHead(final ?? ""),
      // Node.js's answers to bytes it cannot read as a request, which the listener writes.
      "400 no request": await raw("GARBAGE\r\n\r\n"),
      "431 headers too large": await raw(`GET /q HTTP/1.1\r\nHost: x\r\nX-Big: ${"a".repeat(20_000)}\r\n\r\n`),
      "413 chunk extensions too large": await raw(
        `POST /q HTTP/1.1\r\nHost: x\r\nTransfer-Encoding: chunked\r\n\r\n1;${"e".repeat(20_000)}\r\n`,
      ),
    };
  };

  it("sets X-Umbra-Version on the listener's own answers: its refusals, Node.js's own and its answers to what is no request", async () => {
    const register = (api: ApiRegistry) => api.http("POST", "/q", async () => ({ status: 200, body: null }));
    const { server, http } = await serve(register, { maxBodyBytes: 16 });
    const answers = await ownAnswers(server.port, http);
    expect(answers).toEqual(Object.fromEntries(Object.keys(answers).map((what) => [what, [UMBRADB_VERSION]])));
    // Each status as Node.js gives it.
    const statuses = await Promise.all(
      [
        "GET /q HTTP/1.1\r\nConnection: close\r\n\r\n",
        "GET /q HTTP/1.1\r\nHost: x\r\nExpect: something\r\nConnection: close\r\n\r\n",
        "GARBAGE\r\n\r\n",
        `GET /q HTTP/1.1\r\nHost: x\r\nX-Big: ${"a".repeat(20_000)}\r\n\r\n`,
      ].map(async (text) => (await rawExchange(server.port, text)).split("\r\n")[0]),
    );
    expect(statuses).toEqual([
      "HTTP/1.1 400 Bad Request",
      "HTTP/1.1 417 Expectation Failed",
      "HTTP/1.1 400 Bad Request",
      "HTTP/1.1 431 Request Header Fields Too Large",
    ]);
    // Negative control: the same listener with Node.js's own response leaves out every answer written through one.
    const plain = await serve(register, { maxBodyBytes: 16, response: ServerResponse });
    expect(await ownAnswers(plain.server.port, plain.http)).toEqual({
      ...answers,
      "413 request-too-large": [],
      "400 a body not UTF-8": [],
      "400 a URL it cannot read": [],
      "400 no Host": [],
      "417 an unmet Expect": [],
      "200 after 100 Continue": [],
    });
  });

  it("survives a client that resets its connection in a request's head, and answers the next", async () => {
    const reasons: string[] = [];
    const { server, http } = await serve((api) => api.http("GET", "/q", ok));
    const listener = (error: Error) => reasons.push(error.message);
    process.on("uncaughtException", listener);
    try {
      const socket = new Socket();
      await new Promise<void>((resolve) => socket.connect(server.port, "127.0.0.1", resolve));
      socket.write("GET /q HTTP/1.1\r\nHost: x\r\n");
      await new Promise((resolve) => setTimeout(resolve, 50));
      socket.resetAndDestroy();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const next = await exchange(http, "GET", "/q");
      expect([next.status, versionsOf(next.rawHeaders), reasons]).toEqual([200, [UMBRADB_VERSION], []]);
    } finally {
      process.off("uncaughtException", listener);
    }
  });

  it("unreadableAnswer: Node.js's answer to what it cannot read as a request, by its error's code, with the build's version", () => {
    const answer = (status: string) =>
      `HTTP/1.1 ${status}\r\nConnection: close\r\nX-Umbra-Version: ${UMBRADB_VERSION}\r\n\r\n`;
    const codes = ["HPE_HEADER_OVERFLOW", "HPE_CHUNK_EXTENSIONS_OVERFLOW", "ERR_HTTP_REQUEST_TIMEOUT"];
    // Any other code — the parser's other errors, a name an object has, none — is 400.
    expect([...codes, "HPE_INVALID_METHOD", "constructor", undefined].map((code) => unreadableAnswer(code))).toEqual([
      answer("431 Request Header Fields Too Large"),
      answer("413 Payload Too Large"),
      answer("408 Request Timeout"),
      answer("400 Bad Request"),
      answer("400 Bad Request"),
      answer("400 Bad Request"),
    ]);
  });

  it("sets X-Umbra-Version on the subscription's upgrade and on ws's refusals of an upgrade it cannot complete", async () => {
    const { server, ws } = await serve((api) => api.subscription("s", () => () => undefined));
    const socket = new WebSocket(ws);
    const opened = once(socket, "open");
    const [upgrade] = (await once(socket, "upgrade")) as [IncomingMessage];
    expect([upgrade.statusCode, versionsOf(upgrade.rawHeaders)]).toEqual([101, [UMBRADB_VERSION]]);
    await opened;
    const closed = once(socket, "close");
    socket.close();
    await closed;
    // RFC 6455 §1.3's sample Sec-WebSocket-Key: 16 bytes, base64.
    const nonce = Buffer.from("the sample nonce").toString("base64");
    const upgradeTo = (method: string, protocol: string, headers: string) =>
      rawExchange(
        server.port,
        `${method} / HTTP/1.1\r\nHost: x\r\nConnection: Upgrade, HTTP2-Settings\r\nUpgrade: ${protocol}\r\n${headers}\r\n`,
      );
    const refusal = (status: string, message: string, versions = "") =>
      `HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Type: text/html\r\nContent-Length: ${message.length}\r\n` +
      `${versions}X-Umbra-Version: ${UMBRADB_VERSION}\r\n\r\n${message}`;
    expect(await upgradeTo("GET", "websocket", "Sec-WebSocket-Version: 13\r\n")).toBe(
      refusal("400 Bad Request", "Missing or invalid Sec-WebSocket-Key header"),
    );
    // A version ws does not speak: it says which it does (RFC 6455 §4.4).
    expect(await upgradeTo("GET", "websocket", `Sec-WebSocket-Key: ${nonce}\r\nSec-WebSocket-Version: 7\r\n`)).toBe(
      refusal("400 Bad Request", "Missing or invalid Sec-WebSocket-Version header", "Sec-WebSocket-Version: 13, 8\r\n"),
    );
    // ws's first check is the method's, then the Upgrade header's: neither names the versions, as ws's own do not.
    expect(await upgradeTo("POST", "websocket", "Content-Length: 0\r\n")).toBe(
      refusal("405 Method Not Allowed", "Invalid HTTP method"),
    );
    // As curl --http2 asks for HTTP/2 on http:// (no WebSocket header at all).
    expect(await upgradeTo("GET", "h2c", "HTTP2-Settings: AAMAAABkAAQAoAAAAAIAAAAA\r\n")).toBe(
      refusal("400 Bad Request", "Invalid Upgrade header"),
    );
    // The refused connection is closed, as ws closes it, also for a client that keeps its own side open: what it
    // writes afterwards finds no connection (a reset, seen at a later write) rather than one left half open.
    const halfOpen = new Socket({ allowHalfOpen: true });
    let answered = "";
    halfOpen.on("data", (chunk) => (answered += String(chunk)));
    halfOpen.on("error", () => undefined);
    const ended = once(halfOpen, "end");
    let open = true;
    // Not `once(…, "close")`, which rejects at the write's error (EPIPE) that comes first.
    halfOpen.on("close", () => (open = false));
    halfOpen.connect(server.port, "127.0.0.1", () =>
      halfOpen.write("GET / HTTP/1.1\r\nHost: x\r\nConnection: Upgrade\r\nUpgrade: h2c\r\n\r\n"),
    );
    await ended;
    expect(answered.split("\r\n")[0]).toBe("HTTP/1.1 400 Bad Request");
    for (let waited = 0; open && waited < 5_000; waited += 100) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (open) halfOpen.write("more");
    }
    expect(open ? "still open after 5 s" : "closed").toBe("closed");
  });

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
