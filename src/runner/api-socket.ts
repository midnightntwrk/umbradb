/**
 * The module API's socket carrier: its Node.js handlers — HTTP requests and WebSocket (`ws`) subscriptions — and its
 * listener, over the session logic of `./api-session.ts`. One set of handlers ({@link moduleApiHandlers}) answers both
 * on UmbraDB's own listener on `listen.api` ({@link listenModuleApi}) and mounted in a library host's own server
 * (`startUmbraDB`'s `api.http` and `api.upgrade`), so the two apply the same per-request and per-message rules. They run
 * on the main thread, beside the runner, since every request reads the database and runs a module's handler. The admin
 * endpoints have their own listener in a worker thread of their own, which shares nothing with this one but
 * `parseAddress`. The browser build carries this module only as its stub: a page has no Node.js server, and its
 * process answers through `./api-session.ts`'s fetch-style handler and channels.
 *
 * **HTTP.** A request's body is read from the request's stream with `./api-session.ts`'s rules. A mounted handler reads
 * the body itself: a host passes the request unread (one whose body was read already is answered 400
 * `invalid-request`).
 *
 * **Every HTTP answer names its build** (`./api-answers.ts`). The core's headers — `X-Umbra-Version`, the build's
 * version, and, given the process's configuration hash, `X-Umbra-Config-Hash` — are set once on every answer,
 * replacing a header of either name in any letter case; nothing else of the answer changes:
 * - on the listener, through its answers' class ({@link coreHeadersResponse}), which covers a handler's answer, the
 *   module API's own errors (400, 404, 405, 413, 500, 503, 504) and the answers Node.js writes itself (400 to a request
 *   without `Host`, 417 to an `Expect` it does not meet, 400, 408, 413 or 431 to bytes it cannot read as a request);
 * - mounted, in the handlers' own `writeHead`: a host's server's own answers are the host's;
 * - for the subscriptions, on the upgrade's `101 Switching Protocols` and `ws`'s refusals of an upgrade it cannot
 *   complete (400, 405), both ways.
 *
 * A `100 Continue` is an interim answer, before the request's own; a WebSocket message or close after the upgrade has no
 * headers. The process computes the hash once at startup (`./process.ts`), after `on-start-db`, so it changes only with
 * a restart under another configuration; a private process compares it with the core's.
 *
 * **WebSocket subscriptions**, at any path: the protocol of `./api-session.ts`, each message a text frame of at most the
 * message limit (`ws`'s `maxPayload`: a larger one closes the connection 1009); a slow subscriber's socket is
 * destroyed.
 *
 * **Closing** the handlers closes every WebSocket connection they opened (1001, going away; its end unsubscribes its
 * subscriptions) and takes no upgrade after. Closing the listener also stops accepting connections, ends every HTTP
 * connection, and resolves when it has closed. A request in flight keeps its read until its handler settles (bounded by
 * `apiReadTimeoutMs` on PostgreSQL); on the listener its answer goes nowhere.
 */

import { createServer, type IncomingMessage, ServerResponse, STATUS_CODES } from "node:http";
import type { AddressInfo } from "node:net";
import type { Duplex } from "node:stream";
import { type RawData, type WebSocket, WebSocketServer } from "ws";
import {
  type CoreHeaders,
  coreHeaders,
  type HeadersArgument,
  type NodeHttpHandler,
  type NodeUpgradeHandler,
  withCoreHeaders,
} from "./api-answers.js";
import {
  answerRequest,
  BODY_NOT_UTF8,
  BODY_READ_ALREADY,
  BODY_UNREADABLE,
  bodyTooLarge,
  CLOSE_TIMEOUT_MS,
  type ConnectionRules,
  connectionRules,
  DEFAULT_MAX_BODY_BYTES,
  DEFAULT_MAX_MESSAGE_BYTES,
  type ModuleApiLimits,
  parseAddress,
  type ServedConnection,
  SubscriptionConnection,
  utf8Text,
} from "./api-session.js";
import type { ApiResponse, ModuleApi } from "./module-api.js";

/** What {@link moduleApiHandlers} takes besides the module API. */
export interface ModuleApiHandlerOptions extends ModuleApiLimits {
  /** The process's configuration hash, set as `X-Umbra-Config-Hash`; none unless given. */
  readonly configHash?: string;
  /**
   * Where the core's headers are set on the HTTP answers: in the handlers' own `writeHead` (`"answer"`, mounted in a
   * host's server: the default), by the answers' class of the listener (`"response"`), or nowhere (`"none"`, a negative
   * control's: also not on the upgrade's answers).
   */
  readonly coreHeaders?: "answer" | "response" | "none";
}

/** The listener's limits (see the module comment). */
export interface ModuleApiServerOptions {
  readonly maxBodyBytes?: number;
  readonly maxMessageBytes?: number;
  /**
   * The class of each HTTP answer: {@link coreHeadersResponse}'s, which names the build and the configuration, by
   * default; another (Node.js's own `ServerResponse`) only for a negative control.
   */
  readonly response?: typeof ServerResponse;
  /** The process's configuration hash, set as `X-Umbra-Config-Hash`; none unless given. */
  readonly configHash?: string;
}

/**
 * The class of the listener's HTTP answers (see the module comment): every answer written through one — the module
 * API's, and those Node.js writes itself through a response (a request without `Host`, an `Expect` it does not meet) —
 * carries `X-Umbra-Version` with the build's version and, given `configHash`, `X-Umbra-Config-Hash` with it, whichever
 * form of `writeHead` wrote it, an implicit one included.
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
 * §4.4); its `message` — and the core's headers `core`, then closes the connection, as `ws` does.
 */
function refuseUpgrade(socket: Duplex, request: IncomingMessage, message: string, core: CoreHeaders): void {
  socket.once("finish", () => socket.destroy());
  socket.end(
    answerHead(request.method === "GET" ? 400 : 405, {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": String(Buffer.byteLength(message)),
      ...(message === VERSION_REFUSED ? { "Sec-WebSocket-Version": "13, 8" } : {}),
      ...Object.fromEntries(core),
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
 * One WebSocket connection's subscriptions (see the module comment): the session's protocol over `socket`, which
 * `ws` closes 1009 for a message over its `maxPayload`.
 */
function socketConnection(socket: WebSocket, api: ModuleApi, rules: ConnectionRules): ServedConnection {
  const closed = new Promise<void>((resolve) => socket.once("close", () => resolve()));
  // `ws` drops what is sent to a closed socket; `terminate` destroys it, and its `close` comes on a later turn.
  const connection = new SubscriptionConnection(
    { send: (text) => socket.send(text), bufferedAmount: () => socket.bufferedAmount, disconnect: () => socket.terminate() },
    api,
    rules,
  );
  socket.on("message", (data: RawData, binary: boolean) => connection.received(binary ? undefined : String(data)));
  socket.on("close", () => connection.ended());
  // A socket error (a message over the limit, a broken frame) is followed by its close, which unsubscribes.
  socket.on("error", () => undefined);
  return {
    /**
     * Closes the connection, going away; resolves when it closed — its end unsubscribes its subscriptions — at the
     * latest {@link CLOSE_TIMEOUT_MS} later, when a client that does not answer the close is disconnected.
     */
    async close(): Promise<void> {
      const timer = setTimeout(() => socket.terminate(), CLOSE_TIMEOUT_MS);
      socket.close(1001, "the module API is closing");
      await closed;
      clearTimeout(timer);
    },
  };
}

/** The body of `request`: its text, or the answer refusing it (see the module comment). */
function readBody(request: IncomingMessage, max: number): Promise<{ readonly text: string } | { readonly refused: ApiResponse }> {
  // A host's server passed a request whose body was read before the handler got it: its text is no more.
  if (request.readableEnded) return Promise.resolve({ refused: BODY_READ_ALREADY });
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
      if (size > max) finish({ refused: bodyTooLarge(max) });
      else chunks.push(chunk);
    });
    request.on("end", () => {
      const text = utf8Text(Buffer.concat(chunks));
      finish(text === null ? { refused: BODY_NOT_UTF8 } : { text });
    });
    request.on("error", () => finish({ refused: BODY_UNREADABLE }));
  });
}

/**
 * Answers one HTTP request through `api`, its headers given `headersOf` (the core's added, or as they are where the
 * answers' class adds them). Never rejects: an answer that can no longer be written (the client went away, a host's
 * server answered the request already) is dropped.
 */
async function serve(
  api: ModuleApi,
  request: IncomingMessage,
  response: ServerResponse,
  maxBody: number,
  headersOf: (headers: Readonly<Record<string, string>>) => HeadersArgument,
): Promise<void> {
  const body = await readBody(request, maxBody);
  let answer: ApiResponse;
  if ("refused" in body) {
    answer = body.refused;
  } else {
    // A server's request always has its URL and method; an absolute-form URL may not parse.
    let url: URL | undefined;
    try {
      url = new URL(request.url as string, "http://module-api");
    } catch {
      url = undefined;
    }
    answer = await answerRequest(api, request.method as string, url, body.text);
  }
  try {
    // A refused body was not read whole: the connection ends after the answer.
    if ("refused" in body) response.setHeader("Connection", "close");
    // `ModuleApi.answer` never rejects, and its statuses and headers are ones HTTP carries.
    response.writeHead(answer.status, headersOf(answer.headers));
    response.end(answer.body);
  } catch {
    // The response cannot be written any more: there is nothing to answer.
  }
}

/** The module API's Node.js handlers (see the module comment). */
export interface ModuleApiHandlers {
  /** Answers an HTTP request. */
  readonly http: NodeHttpHandler;
  /** Takes a subscriptions' upgrade: the WebSocket connection, at any path. */
  readonly upgrade: NodeUpgradeHandler;
  /** Closes every WebSocket connection the handlers opened (1001); resolves once each closed. Takes no upgrade after. */
  close(): Promise<void>;
}

/**
 * The module API's Node.js handlers over `api` (see the module comment): the same for UmbraDB's listener and for a
 * library host that mounts them in its own server.
 */
export function moduleApiHandlers(api: ModuleApi, options: ModuleApiHandlerOptions = {}): ModuleApiHandlers {
  const maxBody = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const rules = connectionRules(options);
  const placement = options.coreHeaders ?? "answer";
  const core = placement === "none" ? [] : coreHeaders(options.configHash);
  const headersOf =
    placement === "answer"
      ? (headers: Readonly<Record<string, string>>) => withCoreHeaders(headers, core)
      : (headers: Readonly<Record<string, string>>) => headers;
  const connections = new Set<ServedConnection>();
  const sockets = new WebSocketServer({ noServer: true, maxPayload: options.maxMessageBytes ?? DEFAULT_MAX_MESSAGE_BYTES });
  // The upgrade's 101 as ws writes it, and ws's refusals, with the core's headers (see the module comment).
  sockets.on("headers", (headers) => headers.push(...core.map(([name, value]) => `${name}: ${value}`)));
  sockets.on("wsClientError", (error, socket, request) => refuseUpgrade(socket, request, error.message, core));
  let closed = false;
  return Object.freeze({
    http: (request: IncomingMessage, response: ServerResponse) => void serve(api, request, response, maxBody, headersOf),
    upgrade: (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      if (closed) {
        socket.destroy();
        return;
      }
      sockets.handleUpgrade(request, socket, head, (ws) => {
        // An upgrade completed after the close: the connection ends at once.
        if (closed) {
          ws.terminate();
          return;
        }
        const connection = socketConnection(ws, api, rules);
        connections.add(connection);
        ws.once("close", () => connections.delete(connection));
      });
    },
    close: async () => {
      closed = true;
      await Promise.all([...connections].map((connection) => connection.close()));
      sockets.close();
    },
  });
}

/** Listens on `address` (`listen.api`) with `api` (see the module comment); rejects with Node.js's error (`EADDRINUSE`). */
export async function listenModuleApi(
  api: ModuleApi,
  address: string,
  options: ModuleApiServerOptions = {},
): Promise<ModuleApiServer> {
  const { host, port } = parseAddress(address);
  const { configHash } = options;
  // The handlers leave the core's headers to the answers' class, which also carries Node.js's own answers.
  const handlers = moduleApiHandlers(api, {
    ...(options.maxBodyBytes === undefined ? {} : { maxBodyBytes: options.maxBodyBytes }),
    ...(options.maxMessageBytes === undefined ? {} : { maxMessageBytes: options.maxMessageBytes }),
    ...(configHash === undefined ? {} : { configHash }),
    coreHeaders: "response",
  });
  const server = createServer({ ServerResponse: options.response ?? coreHeadersResponse(configHash) }, handlers.http);
  // Node.js's answer to what it cannot read as a request, with the build's version. Node.js holds its own back while
  // an answer of the connection is half written; the listener writes each of its answers whole, so none is. On a
  // connection that can no longer be written (the client reset it) the write fails, and Node.js ignores the error.
  server.on("clientError", (error: NodeJS.ErrnoException, socket: Duplex) => {
    socket.write(unreadableAnswer(error.code, configHash));
    socket.destroy();
  });
  server.on("upgrade", handlers.upgrade);
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
      await handlers.close();
      server.closeAllConnections();
      await closed;
    },
  });
}
