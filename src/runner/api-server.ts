/**
 * The module API listener (`openspec/changes/core-arch/specs/runner/spec.md` RN-15, RN-16; `design.md` §2; CORE-ARCH
 * §4.10, §4.20): `node:http` on `listen.api` (CF-4) carrying the module API of `./module-api.ts` — the HTTP routes as
 * HTTP, the subscriptions on WebSocket (`ws`) at the same listener, on any path. It runs on the main thread, beside the
 * runner, since every request reads the database and runs a module's handler; the admin endpoints have their own
 * listener in a worker thread of their own (AE-1, task 8.1), which shares nothing with this one but
 * {@link parseAddress}.
 *
 * **HTTP.** A request's body is read up to {@link ModuleApiServerOptions.maxBodyBytes} (413 `request-too-large` past
 * it) as UTF-8 (400 `invalid-request` otherwise) and passed with the URL's path and query to `ModuleApi.answer`.
 *
 * **WebSocket subscriptions.** Each message is a JSON text of at most
 * {@link ModuleApiServerOptions.maxMessageBytes}: `{ "type": "subscribe", "id", "name", "args"? }` — `id` a string of 1
 * to 128 characters the client chooses, unique among its open subscriptions — answered `{ "type": "subscribed", "id" }`
 * before any value; then `{ "type": "next", "id", "value" }` for each value the module emits; `{ "type": "unsubscribe",
 * "id" }` is answered `{ "type": "complete", "id" }`; what cannot be done is `{ "type": "error", "id"?, "error": {
 * "code", "message" } }` (the module API's codes). Values are written as the module API writes JSON (`encodeJson`):
 * a value it cannot write throws at the module's `emit`. A connection's end unsubscribes its subscriptions.
 *
 * **Slow subscribers never hold the loop** (RN-15's notifications come from `on-after-db-write`): `emit` hands the text
 * to the socket and returns. A subscriber whose connection still holds more than
 * {@link MAX_BUFFERED_BYTES} unsent when a value comes is disconnected (the socket destroyed) and
 * its subscriptions unsubscribed, after the module's `emit` returned; values for a closed subscriber are dropped.
 *
 * **Closing** stops accepting connections, closes every WebSocket connection (1001, going away; its end unsubscribes
 * its subscriptions), ends every HTTP connection, and resolves when the listener has closed. A request in flight keeps its
 * read until its handler settles (bounded by `apiReadTimeoutMs` on PostgreSQL); its answer goes nowhere.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { type RawData, type WebSocket, WebSocketServer } from "ws";
import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import {
  type ApiError,
  apiErrorResponse,
  type ApiResponse,
  type ApiRoutes,
  type ApiStartup,
  encodeJson,
  ModuleApi,
  type ModuleApiOptions,
  registerModuleApis,
} from "./module-api.js";

/** A request body's limit, by default: 1 MiB. */
export const DEFAULT_MAX_BODY_BYTES = 1_048_576;
/** How long a closing connection waits for the client's close before it is disconnected. */
export const CLOSE_TIMEOUT_MS = 2_000;
/** A WebSocket message's limit, by default: 64 KiB. */
export const DEFAULT_MAX_MESSAGE_BYTES = 65_536;
/** How much a subscriber may hold unsent before it is disconnected: 1 MiB. */
export const MAX_BUFFERED_BYTES = 1_048_576;

/** The listener's limits (see the module comment). */
export interface ModuleApiServerOptions {
  readonly maxBodyBytes?: number;
  readonly maxMessageBytes?: number;
}

/** The module API listener. */
export interface ModuleApiServer {
  /** The address it listens on, as the system reports it (an IPv6 address without its brackets). */
  readonly host: string;
  /** The port it listens on: `listen.api`'s, or the one the system gave for port 0. */
  readonly port: number;
  /** Closes it (see the module comment); closing twice is harmless. */
  close(): Promise<void>;
}

/** `host:port`, as CF-4 writes addresses: a host name or IPv4 address, or a bracketed IPv6 address; the port. */
const ADDRESS = /^(?:\[([0-9A-Fa-f:.]+)\]|([^\s:/[\]@]+)):(\d{1,5})$/;

/** `address` (`host:port`, CF-4) as a host and a port; throws a `TypeError` for anything else. */
export function parseAddress(address: string): { readonly host: string; readonly port: number } {
  const match = typeof address === "string" ? ADDRESS.exec(address) : null;
  const port = Number(match?.[3]);
  if (match === null || port > 65_535) {
    throw new TypeError(`expected an address host:port, its port from 0 to 65535 (CF-4), not ${JSON.stringify(address)}`);
  }
  return { host: (match[1] ?? match[2]) as string, port };
}

const INVALID = "invalid-request";

/** A subscription protocol error message. */
const errorMessage = (code: ApiError["code"], message: string, id?: string) => ({
  type: "error",
  ...(id === undefined ? {} : { id }),
  error: { code, message },
});

/** One WebSocket connection's subscriptions (see the module comment). */
class Connection {
  readonly #socket: WebSocket;
  readonly #api: ModuleApi;
  readonly #subscriptions = new Map<string, () => void>();
  /** Resolves when the connection has closed. */
  readonly #closed: Promise<void>;

  constructor(socket: WebSocket, api: ModuleApi) {
    this.#socket = socket;
    this.#api = api;
    this.#closed = new Promise((resolve) => socket.once("close", () => resolve()));
    socket.on("message", (data: RawData, binary: boolean) => this.#message(data, binary));
    socket.on("close", () => this.#end());
    // A socket error (a message over the limit, a broken frame) is followed by its close, which unsubscribes.
    socket.on("error", () => undefined);
  }

  /**
   * Closes the connection, going away; resolves when it closed — its end unsubscribes its subscriptions — at the latest
   * {@link CLOSE_TIMEOUT_MS} later, when a client that does not answer the close is disconnected.
   */
  async close(): Promise<void> {
    const timer = setTimeout(() => this.#socket.terminate(), CLOSE_TIMEOUT_MS);
    this.#socket.close(1001, "the module API is closing");
    await this.#closed;
    clearTimeout(timer);
  }

  /**
   * Writes `text`, unless the subscriber holds more than its limit unsent: then it is disconnected instead — its end,
   * which comes after the module's emit returned, unsubscribes its subscriptions, so a module's unsubscribe never runs
   * inside its own emit. After the end nothing is written (`ws` drops what is sent to a closed socket).
   */
  #write(text: string): void {
    if (this.#socket.bufferedAmount > MAX_BUFFERED_BYTES) this.#socket.terminate();
    else this.#socket.send(text);
  }

  #send(message: unknown): void {
    this.#write(encodeJson(message) as string);
  }

  #message(data: RawData, binary: boolean): void {
    let message: unknown;
    try {
      if (binary) throw new Error("binary");
      message = parseJsonLossless(String(data));
    } catch {
      message = undefined;
    }
    const { type, id, name, args } = (message ?? {}) as Record<string, unknown>;
    if (typeof message !== "object" || message === null || Array.isArray(message) || typeof type !== "string") {
      this.#send(errorMessage(INVALID, "a message is a JSON object with a type"));
    } else if (type === "subscribe") {
      if (typeof id !== "string" || id.length < 1 || id.length > 128 || typeof name !== "string") {
        this.#send(errorMessage(INVALID, "a subscribe message has an id, a string of 1 to 128 characters, and a name, a string"));
      } else if (this.#subscriptions.has(id)) {
        this.#send(errorMessage(INVALID, `the subscription ${id} is open already`, id));
      } else {
        this.#subscribe(id, name, args);
      }
    } else if (type === "unsubscribe") {
      const unsubscribe = typeof id === "string" ? this.#subscriptions.get(id) : undefined;
      if (unsubscribe === undefined) {
        this.#send(errorMessage(INVALID, `no subscription ${String(id)} is open`, typeof id === "string" ? id : undefined));
      } else {
        this.#subscriptions.delete(id as string);
        unsubscribe();
        this.#send({ type: "complete", id });
      }
    } else {
      this.#send(errorMessage(INVALID, "a message's type is subscribe or unsubscribe"));
    }
  }

  /** Opens subscription `id`: the values the module emits while its handler runs are sent after the acknowledgement. */
  #subscribe(id: string, name: string, args: unknown): void {
    let opening = true;
    const early: string[] = [];
    const send = (value: unknown): void => {
      const text = encodeJson({ type: "next", id, value }) as string;
      if (opening) early.push(text);
      else this.#write(text);
    };
    let unsubscribe: () => void;
    try {
      unsubscribe = this.#api.subscribe(name, args, send);
    } catch (error) {
      // `ModuleApi.subscribe` throws only `ApiError`s.
      const { code, message } = error as ApiError;
      this.#send(errorMessage(code, message, id));
      return;
    } finally {
      opening = false;
    }
    this.#subscriptions.set(id, unsubscribe);
    this.#send({ type: "subscribed", id });
    for (const text of early) this.#write(text);
  }

  /** Unsubscribes every subscription of the connection, once. */
  #end(): void {
    const all = [...this.#subscriptions.values()];
    this.#subscriptions.clear();
    for (const unsubscribe of all) unsubscribe();
  }
}

/** The body of `request`: its text, or the answer refusing it (see the module comment). */
function readBody(request: IncomingMessage, max: number): Promise<{ readonly text: string } | { readonly refused: ApiResponse }> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let done = false;
    const finish = (outcome: { readonly text: string } | { readonly refused: ApiResponse }) => {
      if (done) return;
      done = true;
      resolve(outcome);
    };
    request.on("data", (chunk: Buffer) => {
      if (done) return;
      size += chunk.length;
      if (size > max) finish({ refused: apiErrorResponse("request-too-large", `the request body is larger than ${max} bytes`) });
      else chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        finish({ text: new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)) });
      } catch {
        finish({ refused: apiErrorResponse(INVALID, "the request body is not UTF-8") });
      }
    });
    request.on("error", () => finish({ refused: apiErrorResponse(INVALID, "the request could not be read") }));
  });
}

/** Answers one HTTP request through `api`. */
async function serve(api: ModuleApi, request: IncomingMessage, response: ServerResponse, maxBody: number): Promise<void> {
  const body = await readBody(request, maxBody);
  let answer: ApiResponse;
  if ("refused" in body) {
    answer = body.refused;
    response.setHeader("Connection", "close");
  } else {
    // A server's request always has its URL and method; an absolute-form URL may not parse.
    const method = request.method as string;
    let url: URL | undefined;
    try {
      url = new URL(request.url as string, "http://module-api");
    } catch {
      url = undefined;
    }
    // The module API reads a POST's body only.
    answer =
      url === undefined
        ? apiErrorResponse(INVALID, "the request URL cannot be read")
        : await api.answer({ method, path: url.pathname, query: url.searchParams, body: body.text });
  }
  // `ModuleApi.answer` never rejects, and its statuses and headers are ones HTTP carries.
  response.writeHead(answer.status, answer.headers);
  response.end(answer.body);
}

/** Listens on `address` (`listen.api`) with `api` (see the module comment); rejects with Node.js's error (`EADDRINUSE`). */
export async function listenModuleApi(
  api: ModuleApi,
  address: string,
  options: ModuleApiServerOptions = {},
): Promise<ModuleApiServer> {
  const { host, port } = parseAddress(address);
  const maxBody = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const connections = new Set<Connection>();
  const sockets = new WebSocketServer({ noServer: true, maxPayload: options.maxMessageBytes ?? DEFAULT_MAX_MESSAGE_BYTES });
  const server = createServer((request, response) => {
    void serve(api, request, response, maxBody);
  });
  server.on("upgrade", (request, socket, head) => {
    sockets.handleUpgrade(request, socket, head, (ws) => {
      const connection = new Connection(ws, api);
      connections.add(connection);
      ws.once("close", () => connections.delete(connection));
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  const bound = server.address() as AddressInfo;
  return Object.freeze({
    host: bound.address,
    port: bound.port,
    async close(): Promise<void> {
      // A second close finds nothing open: the listener's callback then tells it is not running, which is ignored.
      const closed = new Promise<void>((resolve) => server.close(() => resolve()));
      await Promise.all([...connections].map((connection) => connection.close()));
      sockets.close();
      server.closeAllConnections();
      await closed;
    },
  });
}

/** What {@link startModuleApi} starts. */
export interface ModuleApiStart extends ApiStartup {
  /** The database each request reads (the core's, or its read-only item). */
  readonly db: ModuleApiOptions["db"];
  /** `listen.api` (CF-4): none, no listener — `on-start-api` and its checks still run. */
  readonly address?: string;
  /** `apiReadTimeoutMs` (CF-4, DB-15). */
  readonly apiReadTimeoutMs: number;
  readonly onError?: ModuleApiOptions["onError"];
  /** The routes to register into (a negative control's); new ones by default. */
  readonly routes?: ApiRoutes;
}

/** The module API started. */
export interface StartedModuleApi {
  readonly routes: ApiRoutes;
  readonly api: ModuleApi;
  /** Null without `listen.api`. */
  readonly server: ModuleApiServer | null;
  close(): Promise<void>;
}

/**
 * The startup's module API steps (RN-1, RN-15): `on-start-api` and the duplicate check (`registerModuleApis`), then
 * the listener on `listen.api`, if one is configured — so a refused startup listens nowhere. Rejects with the first
 * failure of either.
 */
export async function startModuleApi(input: ModuleApiStart): Promise<StartedModuleApi> {
  const routes = await registerModuleApis(input, input.routes);
  const api = new ModuleApi(routes, {
    db: input.db,
    timeoutMs: input.apiReadTimeoutMs,
    ...(input.onError === undefined ? {} : { onError: input.onError }),
  });
  const server = input.address === undefined ? null : await listenModuleApi(api, input.address);
  return Object.freeze({
    routes,
    api,
    server,
    close: async () => {
      await server?.close();
    },
  });
}
