import { once } from "node:events";
import { createServer, request as httpRequest, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { Socket } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import { WebSocket } from "ws";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { NodeHttpHandler, NodeUpgradeHandler } from "../../src/runner/api-answers.js";
import { readChainDataView } from "../../src/runner/envelope.js";
import type { Gate } from "../admin/admin-harness.js";

/**
 * What the tests of the mounted handlers share: a host's own `node:http` servers that mount a handle's handlers (the
 * module API on one, admin on another), the user module `mapi` whose routes and subscription exercise the
 * module API's rules, a WebSocket client that keeps what it receives, and plain HTTP requests that read every header.
 * [LM-4, LM-5]
 */

/** The handlers a handle carries (`UmbraDBHandle`'s, or the engine's). */
export interface Mountable {
  readonly api: { readonly http: NodeHttpHandler; readonly upgrade: NodeUpgradeHandler };
  readonly admin: { readonly http: NodeHttpHandler };
}

/** A host's servers that mount a handle's handlers. */
export interface Mounted {
  /** `http://127.0.0.1:<port>`: the module API, at every path. */
  readonly origin: string;
  /** `http://127.0.0.1:<port>` of a second server of the host's: admin's endpoints, at every path. */
  readonly admin: string;
  /** `ws://127.0.0.1:<port>`: the module API's subscriptions. */
  readonly ws: string;
  close(): Promise<void>;
}

/** A host's own server on `127.0.0.1` (a port the system gives) calling `request` and `upgrade` for its events. */
async function hostServer(
  request: (incoming: IncomingMessage, response: ServerResponse) => void,
  upgrade?: NodeUpgradeHandler,
): Promise<{ readonly port: number; close(): Promise<void> }> {
  const sockets = new Set<Socket>();
  const server: Server = createServer(request);
  if (upgrade !== undefined) server.on("upgrade", (incoming, socket, head) => upgrade(incoming, socket as Socket, head));
  server.on("connection", (socket: Socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address() as { port: number };
  return {
    port,
    close: async () => {
      const closed = new Promise<void>((resolve) => server.close(() => resolve()));
      for (const socket of sockets) socket.destroy();
      await closed;
    },
  };
}

/**
 * A host's own servers mounting `handle`'s handlers, as a host program would: one server's `request` event to the
 * module API's handler and its `upgrade` event to the module API's, another's `request` event to admin's. [LM-4]
 */
export async function mountHandlers(handle: Mountable): Promise<Mounted> {
  const api = await hostServer((request, response) => handle.api.http(request, response), handle.api.upgrade);
  const admin = await hostServer((request, response) => handle.admin.http(request, response));
  return {
    origin: `http://127.0.0.1:${api.port}`,
    admin: `http://127.0.0.1:${admin.port}`,
    ws: `ws://127.0.0.1:${api.port}`,
    close: async () => {
      await api.close();
      await admin.close();
    },
  };
}

/** One HTTP answer, read whole: its status, every header as sent (names in lower case, repeats kept), its body. */
export interface Exchanged {
  readonly status: number;
  readonly headers: readonly (readonly [string, string])[];
  readonly text: string;
}

/** The values of header `name` in `answer` (every one sent, in order). */
export const headerValues = (answer: Exchanged, name: string): string[] =>
  answer.headers.filter(([header]) => header === name.toLowerCase()).map(([, value]) => value);

/** `method path` against `origin` with `body`, read whole; rejects when no answer comes within `timeoutMs`. */
export function exchange(origin: string, method: string, path: string, body?: string | Buffer, timeoutMs = 30_000): Promise<Exchanged> {
  const { hostname, port } = new URL(origin);
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest({ hostname, port, path, method, agent: false, timeout: timeoutMs }, (answer) => {
      const chunks: Buffer[] = [];
      answer.on("data", (chunk: Buffer) => chunks.push(chunk));
      answer.on("end", () => {
        const headers: [string, string][] = [];
        for (let index = 0; index < answer.rawHeaders.length; index += 2) {
          headers.push([(answer.rawHeaders[index] as string).toLowerCase(), answer.rawHeaders[index + 1] as string]);
        }
        resolve({ status: answer.statusCode ?? 0, headers, text: Buffer.concat(chunks).toString("utf8") });
      });
      answer.on("error", reject);
    });
    outgoing.on("timeout", () => outgoing.destroy(new Error(`no answer to ${method} ${path} within ${timeoutMs} ms`)));
    // A server that answers before it read the whole body may reset the connection while it is sent.
    outgoing.on("error", reject);
    if (body !== undefined) outgoing.setHeader("Content-Type", "application/json");
    outgoing.end(body);
  });
}

/** The head of the answer to a WebSocket upgrade of `path` at `origin`, as raw bytes, and whether it upgraded. */
export async function upgradeHead(origin: string, path = "/subscriptions"): Promise<{ readonly head: string; readonly upgraded: boolean }> {
  const { hostname, port } = new URL(origin);
  const { connect } = await import("node:net");
  return new Promise((resolve, reject) => {
    const socket = connect(Number(port), hostname, () =>
      socket.write(
        `GET ${path} HTTP/1.1\r\nHost: ${hostname}\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n` +
          "Sec-WebSocket-Version: 13\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n\r\n",
      ),
    );
    let text = "";
    const done = () => {
      socket.destroy();
      const end = text.indexOf("\r\n\r\n");
      resolve({ head: end < 0 ? text : text.slice(0, end), upgraded: text.startsWith("HTTP/1.1 101 ") });
    };
    socket.on("data", (chunk) => {
      text += chunk.toString("latin1");
      if (text.includes("\r\n\r\n")) done();
    });
    socket.on("end", done);
    socket.on("error", reject);
  });
}

/** The values of header `name` in a raw answer head. */
export const rawHeaderValues = (head: string, name: string): string[] =>
  head
    .split("\r\n")
    .slice(1)
    .flatMap((line) => {
      const colon = line.indexOf(":");
      return colon > 0 && line.slice(0, colon).toLowerCase() === name.toLowerCase() ? [line.slice(colon + 1).trim()] : [];
    });

/** A WebSocket client that keeps every message it receives, parsed. */
export class Client {
  readonly messages: unknown[] = [];
  readonly socket: WebSocket;
  readonly closed: Promise<number>;

  private constructor(socket: WebSocket) {
    this.socket = socket;
    this.closed = new Promise((resolve) => socket.once("close", (code: number) => resolve(code)));
    socket.on("message", (data) => this.messages.push(JSON.parse(String(data))));
  }

  /** Connects to `url`. */
  static async connect(url: string): Promise<Client> {
    const socket = new WebSocket(url);
    const client = new Client(socket);
    await once(socket, "open");
    return client;
  }

  /** Sends `message`: a text as it is, anything else as JSON. */
  send(message: unknown): void {
    this.socket.send(typeof message === "string" ? message : JSON.stringify(message));
  }

  /** Waits until it holds `count` messages (or fails after `ms`); resolves with them. */
  async until(count: number, ms = 10_000): Promise<unknown[]> {
    const deadline = Date.now() + ms;
    while (this.messages.length < count) {
      if (Date.now() > deadline) throw new Error(`only ${this.messages.length} of ${count} messages came within ${ms} ms`);
      await sleep(10);
    }
    return this.messages.slice(0, count);
  }

  /** The socket underneath, to pause its reading (a slow subscriber). */
  get raw(): Socket {
    return (this.socket as unknown as { _socket: Socket })._socket;
  }

  async close(): Promise<void> {
    if (this.socket.readyState === WebSocket.CLOSED) return;
    this.socket.close();
    await this.closed;
  }
}

/** What `mapi` gives the test: the subscribers' emits, and the holds and failures it was built with. */
export interface MapiHooks {
  /** Every open subscription of `feed`'s emit. */
  readonly emits: Set<(value: unknown) => void>;
  /** A gate its `on-start-db` waits at, once. */
  readonly startDb?: Gate;
  /** What its `on-start-db` throws (a class-B refusal, `callback-error`). */
  readonly startDbFailure?: unknown;
  /** Gates its `on-db-write` waits at, by height, each once: inside the height's transaction. */
  readonly writes?: ReadonlyMap<bigint, Gate>;
  /**
   * Gates its `on-parse` waits at, by height, each once: before the height's reads and transaction, so that the module
   * API's reads go on meanwhile, on PGlite too (whose one session a read or a transaction holds).
   */
  readonly parses?: ReadonlyMap<bigint, Gate>;
  /** The height whose `on-db-write` throws (a halt), with `failure`'s message. */
  readonly haltAt?: bigint;
  /** The message of the error `/fails` throws and the halt's (a careless one may hold a secret). */
  readonly failure?: string;
  /** Told each height once its `on-after-db-write` emitted to `feed`'s subscribers (none unless given). */
  readonly afterWrite?: (height: bigint) => void;
}

/**
 * The user module `mapi` (see {@link MapiHooks}): it stores each height in `mapi.rows` and emits it to `feed`'s
 * subscribers from `on-after-db-write`. Its routes:
 * - `GET /rows`: the read's height and the rows it sees;
 * - `GET /view`: the chain-data view (`readChainDataView`), which before block S fails `no-committed-height`, uncaught;
 * - `GET /own-503`: the module's own 503;
 * - `POST /echo`: the body's JSON back;
 * - `GET /sleep`: `pg_sleep(3)` (PostgreSQL), past a 1 s `apiReadTimeoutMs`;
 * - `GET /idle`: 1.5 s between two statements of its read, past a 1 s `apiReadTimeoutMs`;
 * - `GET /fails`: throws an error whose message is {@link MapiHooks.failure}.
 */
export function mapiModule(hooks: MapiHooks): ModuleDeclaration {
  const startDb = hooks.startDb;
  const writes = hooks.writes ?? new Map();
  const parses = hooks.parses ?? new Map();
  return {
    id: "mapi",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "mapi-rows", lifetimes: ["table"], table: { schema: "mapi", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE mapi.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-start-db"() {
        await startDb?.wait();
        if (hooks.startDbFailure !== undefined) throw hooks.startDbFailure;
      },
      async "on-parse"(_p, b) {
        await parses.get(b.height)?.wait();
      },
      async "on-db-write"(_p, b, w) {
        await writes.get(b.height)?.wait();
        if (hooks.haltAt === b.height) throw new Error(hooks.failure ?? "mapi halts");
        await w.execute("INSERT INTO mapi.rows (height) VALUES ($1)", [b.height]);
      },
      async "on-after-db-write"(_p, b) {
        for (const emit of hooks.emits) emit({ height: b.height });
        hooks.afterWrite?.(b.height);
      },
      async "on-start-api"(_p, api) {
        api.http("GET", "/rows", async (_request, read) => {
          const rows = await read.query("SELECT count(*)::int AS n FROM mapi.rows");
          return { status: 200, body: { height: read.height, rows: rows[0]?.n } };
        });
        api.http("GET", "/view", async (_request, read) => ({ status: 200, body: await readChainDataView(read) }));
        api.http("GET", "/own-503", async () => ({ status: 503, body: { own: "the module's own 503" } }));
        api.http("POST", "/echo", async (request) => ({ status: 200, body: { echoed: request.body } }));
        api.http("GET", "/sleep", async (_request, read) => {
          await read.query("SELECT pg_sleep(3)");
          return { status: 200, body: "slept" };
        });
        api.http("GET", "/idle", async (_request, read) => {
          await read.query("SELECT 1 AS one");
          await sleep(1_500);
          await read.query("SELECT 2 AS two");
          return { status: 200, body: "idled" };
        });
        api.http("GET", "/fails", async () => {
          throw new Error(hooks.failure ?? "mapi fails");
        });
        api.subscription("feed", (_args, emit) => {
          hooks.emits.add(emit);
          return () => hooks.emits.delete(emit);
        });
      },
    },
  } as ModuleDeclaration;
}

/** Waits until `check` holds, or fails after `ms` naming `what`. */
export async function eventually(check: () => boolean | Promise<boolean>, what: string, ms = 30_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!(await check())) {
    if (Date.now() > deadline) throw new Error(`timed out after ${ms} ms: ${what}`);
    await sleep(20);
  }
}
