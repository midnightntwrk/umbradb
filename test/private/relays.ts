import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import { connect, createServer, type Server, type Socket } from "node:net";
import { type RawData, WebSocket, WebSocketServer } from "ws";
import { type Message, messageText, parseMessage, type Report } from "../../src/private/messages.js";

/**
 * Go-betweens of a private process and the core's transport, for the lockstep and core-restart tests. Imports nothing
 * of Vitest. [PP-6, PP-14]
 * - {@link RetargetProxy}: a TCP proxy whose target can change. A restarted core listens on another free port, and the
 *   private process's `coreTransport` stays the proxy's.
 * - {@link ReportRelay}: a WebSocket relay that can rewrite the reports a private process sends, giving a `report`
 *   whose hash is not the public block's without changing the private process.
 * - {@link HoldingRelay}: a WebSocket relay that holds a private process's messages until the test releases them.
 */

/** `host:port` split. */
function hostPort(address: string): { readonly host: string; readonly port: number } {
  const colon = address.lastIndexOf(":");
  return { host: address.slice(0, colon), port: Number(address.slice(colon + 1)) };
}

/** A TCP proxy to a target that {@link retarget} changes; with none, every connection is refused. */
export class RetargetProxy {
  readonly #server: Server;
  readonly #sockets = new Set<Socket>();
  #target: { readonly host: string; readonly port: number } | null = null;

  private constructor(server: Server) {
    this.#server = server;
    server.on("connection", (incoming) => {
      const target = this.#target;
      if (target === null) {
        incoming.destroy();
        return;
      }
      const outgoing = connect(target.port, target.host);
      for (const socket of [incoming, outgoing]) {
        this.#sockets.add(socket);
        socket.on("close", () => this.#sockets.delete(socket));
        socket.on("error", () => undefined);
      }
      incoming.pipe(outgoing).pipe(incoming);
      incoming.on("close", () => outgoing.destroy());
      outgoing.on("close", () => incoming.destroy());
    });
  }

  /** A proxy listening on a free port of the loopback interface, without a target yet. */
  static async start(): Promise<RetargetProxy> {
    const server = createServer();
    const proxy = new RetargetProxy(server);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    return proxy;
  }

  /** Where it listens. */
  get address(): string {
    return `127.0.0.1:${(this.#server.address() as { port: number }).port}`;
  }

  /** New connections go to `address` from now on (connections made are left as they are). */
  retarget(address: string | null): void {
    this.#target = address === null ? null : hostPort(address);
  }

  async close(): Promise<void> {
    this.#target = null;
    for (const socket of this.#sockets) socket.destroy();
    await new Promise<void>((resolve) => this.#server.close(() => resolve()));
  }
}

/** A close code a WebSocket may send itself (RFC 6455 §7.4: not 1005, 1006 or 1015). */
const sendable = (code: number): boolean => code === 1000 || (code >= 1001 && code <= 1014 && ![1004, 1005, 1006].includes(code)) || (code >= 3000 && code <= 4999);

/**
 * A WebSocket relay to the core's transport at `target`: each connection a private process makes is relayed to a
 * connection of its own to the core, every text message both ways — the private process's `report`s through
 * {@link rewrite} first — and each close passed on with its code and reason.
 */
export class ReportRelay {
  readonly #http: HttpServer;
  readonly #wss: WebSocketServer;
  /** The reports the private processes sent, before any rewriting. */
  readonly reports: Report[] = [];

  private constructor(http: HttpServer, target: string, rewrite: (report: Report) => Report) {
    this.#http = http;
    this.#wss = new WebSocketServer({ server: http, perMessageDeflate: false });
    this.#wss.on("connection", (inner) => {
      const outer = new WebSocket(`ws://${target}/`, { perMessageDeflate: false });
      const waiting: string[] = [];
      outer.on("open", () => {
        for (const text of waiting.splice(0)) outer.send(text);
      });
      inner.on("message", (data: RawData) => {
        let text = data.toString();
        const parsed = parseMessage(text);
        if (parsed.ok && parsed.message.type === "report") {
          this.reports.push(parsed.message);
          text = messageText(rewrite(parsed.message) as Message);
        }
        if (outer.readyState === WebSocket.OPEN) outer.send(text);
        else waiting.push(text);
      });
      outer.on("message", (data: RawData) => {
        if (inner.readyState === WebSocket.OPEN) inner.send(data.toString());
      });
      const pass = (to: WebSocket, code: number, reason: Buffer): void => {
        if (to.readyState === WebSocket.CLOSED || to.readyState === WebSocket.CLOSING) return;
        if (to.readyState === WebSocket.OPEN && sendable(code)) to.close(code, reason.toString());
        else to.terminate();
      };
      outer.on("close", (code, reason) => pass(inner, code, reason));
      inner.on("close", (code, reason) => pass(outer, code, reason));
      outer.on("error", () => undefined);
      inner.on("error", () => undefined);
    });
  }

  /** A relay to `target` listening on a free port of the loopback interface. */
  static async start(target: string, rewrite: (report: Report) => Report): Promise<ReportRelay> {
    const http = createHttpServer();
    const relay = new ReportRelay(http, target, rewrite);
    await new Promise<void>((resolve) => http.listen(0, "127.0.0.1", resolve));
    return relay;
  }

  /** Where it listens. */
  get address(): string {
    return `127.0.0.1:${(this.#http.address() as { port: number }).port}`;
  }

  async close(): Promise<void> {
    for (const client of this.#wss.clients) client.terminate();
    await new Promise<void>((resolve) => this.#wss.close(() => resolve()));
    this.#http.closeAllConnections();
    await new Promise<void>((resolve) => this.#http.close(() => resolve()));
  }
}

/** One private process's connection through a {@link HoldingRelay}. */
interface HeldLink {
  readonly inner: WebSocket;
  /** Its connection to the core, made when its first message is passed on. */
  outer: WebSocket | null;
  /** Messages for `outer` while it opens. */
  readonly opening: string[];
  /** Messages held since one of a held type came: passed on, in order, by {@link HoldingRelay.release}. */
  readonly held: string[];
}

/** The `type` of a message's text, or null. */
function typeOf(text: string): string | null {
  const parsed = parseMessage(text);
  return parsed.ok ? parsed.message.type : null;
}

/**
 * A WebSocket relay to the core's transport whose target can change ({@link retarget}, as a restarted core listens on
 * another free port), and which holds a private process's messages from the first of a held type on ({@link hold}:
 * `hello`, or `read`) until {@link release}. This lets a test restart the core between a private start's read of the
 * public history and its first `hello-ack` (PostgreSQL, `hello` held), or between that `hello-ack` and its first read
 * through the core (PGlite, `read` held). Each connection a private process makes gets a connection of its own to the target,
 * made when its first message is passed on (none while the target is null: the private process's connection is then
 * ended); the core's messages and each close are passed back.
 */
export class HoldingRelay {
  readonly #http: HttpServer;
  readonly #wss: WebSocketServer;
  readonly #links = new Set<HeldLink>();
  #target: string | null = null;
  #holding: ReadonlySet<string> = new Set();
  #heldCount = 0;

  private constructor(http: HttpServer) {
    this.#http = http;
    this.#wss = new WebSocketServer({ server: http, perMessageDeflate: false });
    this.#wss.on("connection", (inner) => {
      const link: HeldLink = { inner, outer: null, opening: [], held: [] };
      this.#links.add(link);
      inner.on("message", (data: RawData) => {
        const text = data.toString();
        if (link.held.length > 0 || this.#holding.has(typeOf(text) ?? "")) {
          link.held.push(text);
          this.#heldCount += 1;
          return;
        }
        this.#pass(link, text);
      });
      inner.on("close", (code, reason) => {
        this.#links.delete(link);
        if (link.outer !== null) HoldingRelay.#closeWith(link.outer, code, reason);
      });
      inner.on("error", () => undefined);
    });
  }

  /** A relay listening on a free port of the loopback interface, without a target and holding nothing. */
  static async start(): Promise<HoldingRelay> {
    const http = createHttpServer();
    const relay = new HoldingRelay(http);
    await new Promise<void>((resolve) => http.listen(0, "127.0.0.1", resolve));
    return relay;
  }

  /** Where it listens: a private process's `coreTransport`. */
  get address(): string {
    return `127.0.0.1:${(this.#http.address() as { port: number }).port}`;
  }

  /** How many messages it has held so far. */
  get held(): number {
    return this.#heldCount;
  }

  /** New connections to the core go to `address` from now on; with null, a private process's connection is ended. */
  retarget(address: string | null): void {
    this.#target = address;
  }

  /** Holds every connection's messages from the first of one of `types` on (see the class comment). */
  hold(types: readonly string[]): void {
    this.#holding = new Set(types);
  }

  /** Holds nothing from now on, and passes every held message on, in order, to the target at this time. */
  release(): void {
    this.#holding = new Set();
    for (const link of this.#links) for (const text of link.held.splice(0)) this.#pass(link, text);
  }

  /** Passes `text` on to the core, opening the link's connection to the target first. */
  #pass(link: HeldLink, text: string): void {
    if (link.outer === null) {
      const target = this.#target;
      if (target === null) {
        link.inner.terminate();
        return;
      }
      const outer = new WebSocket(`ws://${target}/`, { perMessageDeflate: false });
      link.outer = outer;
      outer.on("open", () => {
        for (const waiting of link.opening.splice(0)) outer.send(waiting);
      });
      outer.on("message", (data: RawData) => {
        if (link.inner.readyState === WebSocket.OPEN) link.inner.send(data.toString());
      });
      outer.on("close", (code, reason) => HoldingRelay.#closeWith(link.inner, code, reason));
      outer.on("error", () => undefined);
    }
    if (link.outer.readyState === WebSocket.OPEN) link.outer.send(text);
    else link.opening.push(text);
  }

  /** Closes `to` with `code` and `reason` when it may send them, else ends it. */
  static #closeWith(to: WebSocket, code: number, reason: Buffer): void {
    if (to.readyState === WebSocket.CLOSED || to.readyState === WebSocket.CLOSING) return;
    if (to.readyState === WebSocket.OPEN && sendable(code)) to.close(code, reason.toString());
    else to.terminate();
  }

  async close(): Promise<void> {
    this.#target = null;
    for (const link of this.#links) {
      link.inner.terminate();
      link.outer?.terminate();
    }
    for (const client of this.#wss.clients) client.terminate();
    await new Promise<void>((resolve) => this.#wss.close(() => resolve()));
    this.#http.closeAllConnections();
    await new Promise<void>((resolve) => this.#http.close(() => resolve()));
  }
}
