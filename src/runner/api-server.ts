/**
 * The module API listener: `node:http` on `listen.api`, carrying the module API of `./module-api.ts`. HTTP routes are
 * served as HTTP; subscriptions run on WebSocket (`ws`) at the same listener, on any path. It runs on the main thread,
 * beside the runner, since every request reads the database and runs a module's handler. The admin endpoints have their
 * own listener in a worker thread of their own, which shares nothing with this one but {@link parseAddress}.
 * [RN-15, RN-16, CF-4, AE-1; design §2; CORE-ARCH §4.10, §4.20]
 *
 * **HTTP.** A request's body is read up to {@link ModuleApiServerOptions.maxBodyBytes} (413 `request-too-large` past
 * it) as UTF-8 (400 `invalid-request` otherwise) and passed with the URL's path and query to `ModuleApi.answer`.
 *
 * **Every HTTP answer names its build.** The listener sets {@link VERSION_HEADER} to the build's version
 * (`UMBRADB_VERSION`) on every answer it gives:
 * - a handler's answer;
 * - the module API's own errors (400, 404, 405, 413, 500, 503, 504);
 * - the answers Node.js writes itself (400 to a request without `Host`, 417 to an `Expect` it does not meet, 400, 408,
 *   413 or 431 to bytes it cannot read as a request);
 * - for the subscriptions, the upgrade's `101 Switching Protocols` and `ws`'s refusals of an upgrade it cannot complete
 *   (400, 405).
 *
 * The header is set once, replacing a header of that name in any letter case; nothing else of the answer changes. A
 * `100 Continue` is an interim answer, before the request's own; a WebSocket message or close after the upgrade has no
 * headers. [RN-16, Q131]
 *
 * **And its configuration.** Given the process's configuration hash, the listener sets {@link CONFIG_HASH_HEADER} to it
 * on each of those answers alike, beside the version, replacing a header of that name in any letter case. The process
 * computes the hash once at startup (`./process.ts`), so it changes only with a restart under another configuration. A
 * private process compares it with the core's. [RN-16, PP-14, Q147]
 *
 * **WebSocket subscriptions.** Each message is a JSON text of at most
 * {@link ModuleApiServerOptions.maxMessageBytes}: `{ "type": "subscribe", "id", "name", "args"? }` — `id` a string of 1
 * to 128 characters the client chooses, unique among its open subscriptions — answered `{ "type": "subscribed", "id" }`
 * before any value; then `{ "type": "next", "id", "value" }` for each value the module emits; `{ "type": "unsubscribe",
 * "id" }` is answered `{ "type": "complete", "id" }`; what cannot be done is `{ "type": "error", "id"?, "error": {
 * "code", "message" } }` (the module API's codes). Values are written as the module API writes JSON (`encodeJson`):
 * a value it cannot write throws at the module's `emit`. A connection's end unsubscribes its subscriptions.
 *
 * **Slow subscribers never hold the loop.** Subscription values are emitted from `on-after-db-write`, so `emit` hands the
 * text to the socket and returns. A subscriber whose connection still holds more than {@link MAX_BUFFERED_BYTES} unsent
 * when a value comes is disconnected (the socket destroyed) and its subscriptions unsubscribed, after the module's
 * `emit` returned. Values for a closed subscriber are dropped. [RN-15]
 *
 * **Closing** stops accepting connections, closes every WebSocket connection (1001, going away; its end unsubscribes
 * its subscriptions), ends every HTTP connection, and resolves when the listener has closed. A request in flight keeps its
 * read until its handler settles (bounded by `apiReadTimeoutMs` on PostgreSQL); its answer goes nowhere.
 */

import {
  createServer,
  type IncomingMessage,
  type OutgoingHttpHeader,
  type OutgoingHttpHeaders,
  ServerResponse,
  STATUS_CODES,
} from "node:http";
import type { AddressInfo } from "node:net";
import type { Duplex } from "node:stream";
import { type RawData, type WebSocket, WebSocketServer } from "ws";
import { UMBRADB_VERSION } from "../config/build.js";
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
  /**
   * The class of each HTTP answer: {@link coreHeadersResponse}'s, which names the build and the configuration, by
   * default; another (Node.js's own `ServerResponse`) only for a negative control.
   */
  readonly response?: typeof ServerResponse;
  /** The process's configuration hash, set as {@link CONFIG_HASH_HEADER}; none unless given. [RN-16, Q147] */
  readonly configHash?: string;
}

/**
 * The header the core sets on every HTTP answer on `listen.api` (see the module comment): the build's version. The
 * `X-Umbra-` prefix holds the headers every module shares. This one is the core's; the envelope's helpers write
 * `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash` (`./envelope.ts`) for a module that calls them. [RN-16]
 */
export const VERSION_HEADER = "X-Umbra-Version";

/**
 * The header the core sets on every HTTP answer on `listen.api` beside {@link VERSION_HEADER}: the process's
 * configuration hash, computed once at startup. [RN-16, PP-14, Q147]
 */
export const CONFIG_HASH_HEADER = "X-Umbra-Config-Hash";

/** The core's headers, by their names in lower case (HTTP's header names are case-insensitive). */
const CORE_HEADER_NAMES: ReadonlySet<string> = new Set(["x-umbra-version", "x-umbra-config-hash"]);

/** Whether `name` is one of the core's headers, in any letter case. */
const isCoreHeader = (name: unknown): boolean => typeof name === "string" && CORE_HEADER_NAMES.has(name.toLowerCase());

/** The core's headers of a listener: the build's version, and the configuration hash when it has one. */
const coreHeaders = (configHash: string | undefined): readonly (readonly [string, string])[] => [
  [VERSION_HEADER, UMBRADB_VERSION],
  ...(configHash === undefined ? [] : [[CONFIG_HASH_HEADER, configHash] as const]),
];

type HeadersArgument = OutgoingHttpHeaders | OutgoingHttpHeader[];

/**
 * `headers` as `writeHead` takes them — an object, or a flat list of names and values — with the core's headers `core`
 * set: a header of one of their names in any letter case left out, the others kept as they are and in their order.
 */
function withCoreHeaders(headers: HeadersArgument | undefined, core: readonly (readonly [string, string])[]): HeadersArgument {
  if (Array.isArray(headers)) {
    const kept: OutgoingHttpHeader[] = [];
    for (let index = 0; index < headers.length; index += 2) {
      if (!isCoreHeader(headers[index])) kept.push(...headers.slice(index, index + 2));
    }
    return [...kept, ...core.flat()];
  }
  const kept = Object.entries(headers ?? {}).filter(([name]) => !isCoreHeader(name));
  return { ...Object.fromEntries(kept), ...Object.fromEntries(core) };
}

/**
 * The class of the listener's HTTP answers (see the module comment): every answer written through one — the module
 * API's, and those Node.js writes itself through a response (a request without `Host`, an `Expect` it does not meet) —
 * carries {@link VERSION_HEADER} with the build's version and, given `configHash`, {@link CONFIG_HASH_HEADER} with it,
 * whichever form of `writeHead` wrote it, an implicit one included.
 */
export function coreHeadersResponse(configHash?: string): typeof ServerResponse {
  const core = coreHeaders(configHash);
  return class CoreHeadersResponse<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
    override writeHead(statusCode: number, message?: string | HeadersArgument, headers?: HeadersArgument): this {
      return typeof message === "string"
        ? super.writeHead(statusCode, message, withCoreHeaders(headers, core))
        : super.writeHead(statusCode, withCoreHeaders(message, core));
    }
  };
}

/** {@link coreHeadersResponse} without a configuration hash: the build's version alone. */
export const VersionedResponse: typeof ServerResponse = coreHeadersResponse();

/** The head of an HTTP/1.1 answer with `status` and `headers`, as a connection's bytes. */
const answerHead = (status: number, headers: Readonly<Record<string, string>>): string =>
  `HTTP/1.1 ${status} ${STATUS_CODES[status]}\r\n${Object.entries(headers)
    .map(([name, value]) => `${name}: ${value}\r\n`)
    .join("")}\r\n`;

/** The status Node.js answers what it cannot read as a request with, by its error's code (400 for any other). */
const UNREADABLE_STATUS: ReadonlyMap<string, number> = new Map([
  ["HPE_HEADER_OVERFLOW", 431],
  ["HPE_CHUNK_EXTENSIONS_OVERFLOW", 413],
  ["ERR_HTTP_REQUEST_TIMEOUT", 408],
]);

/**
 * Node.js's answer to bytes it cannot read as a request (its HTTP server's own, the error's `code` its parser's or a
 * timeout's), with the build's version and, given one, the configuration hash: the listener writes it, then closes the
 * connection.
 */
export function unreadableAnswer(code: string | undefined, configHash?: string): string {
  const status = UNREADABLE_STATUS.get(code ?? "") ?? 400;
  return answerHead(status, { Connection: "close", ...Object.fromEntries(coreHeaders(configHash)) });
}

/** `ws`'s message (8.22.0) when the request's WebSocket version is none it speaks; its refusal names those it does. */
const VERSION_REFUSED = "Missing or invalid Sec-WebSocket-Version header";

/**
 * Writes `ws`'s refusal of an upgrade it cannot complete as `ws` writes it — 405 for a method other than GET (its first
 * check), else 400; its headers, with the versions it speaks when the request's version is what it refused (RFC 6455
 * §4.4); its `message` — and the build's version, then closes the connection, as `ws` does.
 */
function refuseUpgrade(socket: Duplex, request: IncomingMessage, message: string, configHash: string | undefined): void {
  socket.once("finish", () => socket.destroy());
  socket.end(
    answerHead(request.method === "GET" ? 400 : 405, {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": String(Buffer.byteLength(message)),
      ...(message === VERSION_REFUSED ? { "Sec-WebSocket-Version": "13, 8" } : {}),
      ...Object.fromEntries(coreHeaders(configHash)),
    }) + message,
  );
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

/**
 * `host:port`, as the configuration writes addresses: a host name or IPv4 address, or a bracketed IPv6 address; the
 * port. [CF-4]
 */
const ADDRESS = /^(?:\[([0-9A-Fa-f:.]+)\]|([^\s:/[\]@]+)):(\d{1,5})$/;

/** `address` (`host:port`) as a host and a port; throws a `TypeError` for anything else. [CF-4] */
export function parseAddress(address: string): { readonly host: string; readonly port: number } {
  const match = typeof address === "string" ? ADDRESS.exec(address) : null;
  const port = Number(match?.[3]);
  if (match === null || port > 65_535) {
    throw new TypeError(`expected an address host:port, its port from 0 to 65535, not ${JSON.stringify(address)}`);
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
  // The upgrade's 101 as ws writes it, and ws's refusals, with the core's headers (see the module comment).
  const { configHash } = options;
  sockets.on("headers", (headers) => headers.push(...coreHeaders(configHash).map(([name, value]) => `${name}: ${value}`)));
  sockets.on("wsClientError", (error, socket, request) => refuseUpgrade(socket, request, error.message, configHash));
  const server = createServer({ ServerResponse: options.response ?? coreHeadersResponse(configHash) }, (request, response) => {
    void serve(api, request, response, maxBody);
  });
  // Node.js's answer to what it cannot read as a request, with the build's version. Node.js holds its own back while
  // an answer of the connection is half written; the listener writes each of its answers whole, so none is. On a
  // connection that can no longer be written (the client reset it) the write fails, and Node.js ignores the error.
  server.on("clientError", (error: NodeJS.ErrnoException, socket: Duplex) => {
    socket.write(unreadableAnswer(error.code, configHash));
    socket.destroy();
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
  /** `listen.api`: none, no listener — `on-start-api` and its checks still run. [CF-4] */
  readonly address?: string;
  /** `apiReadTimeoutMs`. [CF-4, DB-15] */
  readonly apiReadTimeoutMs: number;
  readonly onError?: ModuleApiOptions["onError"];
  /** The routes to register into (a negative control's); new ones by default. */
  readonly routes?: ApiRoutes;
  /** The process's configuration hash, on every answer of the listener; none unless given. [RN-16, Q147] */
  readonly configHash?: string;
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
 * The startup's module API steps: `on-start-api` and the duplicate check (`registerModuleApis`), then the listener on
 * `listen.api`, if one is configured, so a refused startup listens nowhere. Rejects with the first failure of either.
 * [RN-1, RN-15]
 */
export async function startModuleApi(input: ModuleApiStart): Promise<StartedModuleApi> {
  const routes = await registerModuleApis(input, input.routes);
  const api = new ModuleApi(routes, {
    db: input.db,
    timeoutMs: input.apiReadTimeoutMs,
    ...(input.onError === undefined ? {} : { onError: input.onError }),
  });
  const server =
    input.address === undefined
      ? null
      : await listenModuleApi(api, input.address, input.configHash === undefined ? {} : { configHash: input.configHash });
  return Object.freeze({
    routes,
    api,
    server,
    close: async () => {
      await server?.close();
    },
  });
}
