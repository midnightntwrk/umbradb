import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import { connect, createServer, type Server, type Socket } from "node:net";
import { type RawData, WebSocket, WebSocketServer } from "ws";
import { type Message, messageText, parseMessage, type Report } from "../../src/private/messages.js";

/**
 * Go-betweens of a private process and the core's transport for task 14.3's tests (PP-6): a TCP proxy whose target can
 * change ({@link RetargetProxy}: a restarted core listens on another free port, and the private process's
 * `coreTransport` stays the proxy's), and a WebSocket relay that can rewrite the reports a private process sends
 * ({@link ReportRelay}: a `report` whose hash is not the public block's, without changing the private process). Imports
 * nothing of Vitest.
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
