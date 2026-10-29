import { randomInt } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { Server as NetServer } from "node:net";
import { WebSocket, WebSocketServer } from "ws";

/**
 * A scripted Midnight node for the node client's tests: a JSON-RPC 2.0 server over WebSocket (`ws`, on the loopback
 * interface, a random free port at or above 10000). It:
 * - records every request it receives;
 * - answers each method with a handler the test sets, by default the real answers of `fixtures/mainnet-answers.json`;
 * - runs Substrate-style head subscriptions (`chain_newHead`, `chain_finalizedHead` notifications);
 * - can refuse the WebSocket handshake with an HTTP status, stay silent, drop every connection, send frames that are
 *   not JSON-RPC, and stop answering pings.
 *
 * Every request any fake node received in this process is also kept in {@link RECEIVED_BY_ANY_NODE}, for the suites'
 * check that the client used only the allowed node methods. [IN-8]
 */

/** One request a fake node received. */
export interface Received {
  readonly method: string;
  readonly params: unknown;
  readonly id: unknown;
  /** Which connection of this node it came on, counting from 1. */
  readonly connection: number;
}

/** What a handler answers: a result, a JSON-RPC error, nothing at all, or a raw frame. */
export type Answer =
  | { readonly result: unknown }
  | { readonly error: unknown }
  | { readonly silent: true }
  | { readonly raw: string };

export type Handler = (params: readonly unknown[], request: Received) => Answer;

/** The notification methods of the two head subscriptions, by subscribe method (Substrate's names). */
export const NOTIFICATIONS = {
  chain_subscribeNewHeads: "chain_newHead",
  chain_subscribeFinalizedHeads: "chain_finalizedHead",
} as const;

/** Every request every fake node of this process received, in order. */
export const RECEIVED_BY_ANY_NODE: Received[] = [];

interface Recorded {
  readonly method: string;
  readonly params: readonly unknown[];
  readonly result: unknown;
}

/** The recorded mainnet answers (`fixtures/mainnet-answers.json`). */
export const MAINNET: { readonly calls: readonly Recorded[] } = JSON.parse(
  readFileSync(new URL("./fixtures/mainnet-answers.json", import.meta.url), "utf8"),
) as { calls: readonly Recorded[] };

/** The recorded answer of `method`: the first recorded call of it. */
export function recorded(method: string): Recorded {
  const call = MAINNET.calls.find((candidate) => candidate.method === method);
  if (call === undefined) throw new Error(`no recorded mainnet answer for ${method}`);
  return call;
}

/** The finalized block the mainnet answers were recorded at. */
export const MAINNET_BLOCK = recorded("chain_getHeader").params[0] as string;

/** Listens on a random free port at or above 10000 on the loopback interface. */
export async function listenOnRandomPort(target: Server | NetServer): Promise<number> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = randomInt(10_000, 60_000);
    const listening = await new Promise<boolean>((resolve, reject) => {
      const onError = (error: NodeJS.ErrnoException) => {
        target.off("listening", onListening);
        if (error.code === "EADDRINUSE") resolve(false);
        else reject(error);
      };
      const onListening = () => {
        target.off("error", onError);
        resolve(true);
      };
      target.once("error", onError);
      target.once("listening", onListening);
      target.listen(candidate, "127.0.0.1");
    });
    if (listening) return candidate;
  }
  throw new Error("no free port at or above 10000 after 20 attempts");
}

/** Closes a server, ending its connections. */
export async function closeServer(server: Server | NetServer): Promise<void> {
  if ("closeAllConnections" in server) server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

export class FakeNode {
  /** Every request this node received, in order. */
  readonly received: Received[] = [];
  /** Handshakes attempted, accepted or refused. */
  upgrades = 0;
  /** Connections accepted. */
  connections = 0;
  /** When set, the status to refuse the n-th handshake with (counting from 1), or undefined to accept it. */
  refuse: ((upgrade: number) => number | undefined) | undefined;
  /** When set, what the node does on a new connection, before anything else (for example close it at once). */
  onConnection: ((socket: WebSocket) => void) | undefined;

  readonly #server: Server;
  readonly #wss: WebSocketServer;
  readonly #port: number;
  readonly #handlers = new Map<string, Handler>();
  readonly #sockets = new Set<WebSocket>();
  /** Per open socket: its subscriptions, subscription id → notification method. */
  readonly #subscriptions = new Map<WebSocket, Map<string, string>>();
  #nextSubscription = 1;

  private constructor(server: Server, wss: WebSocketServer, port: number) {
    this.#server = server;
    this.#wss = wss;
    this.#port = port;
  }

  /** Starts a fake node; `autoPong: false` makes it never answer a ping. */
  static async start(options: { autoPong?: boolean } = {}): Promise<FakeNode> {
    const server = createServer();
    // Listen before `ws` attaches: it re-emits the server's errors, and a port found taken would then go unhandled.
    const port = await listenOnRandomPort(server);
    let node: FakeNode | undefined;
    const wss = new WebSocketServer({
      server,
      autoPong: options.autoPong ?? true,
      verifyClient: (_info, done) => {
        const self = node as FakeNode;
        self.upgrades += 1;
        const status = self.refuse?.(self.upgrades);
        if (status === undefined) done(true);
        else done(false, status, "refused by the fake node");
      },
    });
    node = new FakeNode(server, wss, port);
    wss.on("connection", (socket) => (node as FakeNode).#accept(socket));
    return node;
  }

  /** The node's URL (`ws://127.0.0.1:<port>`), with an optional path and query. */
  url(suffix = ""): string {
    return `ws://127.0.0.1:${this.#port}${suffix}`;
  }

  get port(): number {
    return this.#port;
  }

  /** The methods received, in order. */
  methods(): string[] {
    return this.received.map((request) => request.method);
  }

  /** How many requests of `method` were received. */
  count(method: string): number {
    return this.received.filter((request) => request.method === method).length;
  }

  /** Answers `method` with `handler` from now on. */
  on(method: string, handler: Handler): this {
    this.#handlers.set(method, handler);
    return this;
  }

  /** Sends `result` as a notification of every live subscription to `notification`; returns how many were sent. */
  notify(notification: "chain_newHead" | "chain_finalizedHead", result: unknown): number {
    let sent = 0;
    for (const [socket, subscriptions] of this.#subscriptions) {
      for (const [subscription, method] of subscriptions) {
        if (method !== notification) continue;
        socket.send(JSON.stringify({ jsonrpc: "2.0", method, params: { subscription, result } }));
        sent += 1;
      }
    }
    return sent;
  }

  /** The subscription ids now live on the node, in the order they were made. */
  subscriptionIds(): string[] {
    return [...this.#subscriptions.values()].flatMap((subscriptions) => [...subscriptions.keys()]);
  }

  /** Sends `text` as a frame on every open connection. */
  sendRaw(text: string): void {
    for (const socket of this.#sockets) socket.send(text);
  }

  /** Ends every open connection abruptly (no close frame). */
  drop(): void {
    for (const socket of this.#sockets) socket.terminate();
  }

  /** How many connections are open now. */
  get open(): number {
    return this.#sockets.size;
  }

  async stop(): Promise<void> {
    for (const socket of this.#sockets) socket.terminate();
    await new Promise<void>((resolve) => this.#wss.close(() => resolve()));
    await closeServer(this.#server);
  }

  #accept(socket: WebSocket): void {
    this.connections += 1;
    const connection = this.connections;
    this.#sockets.add(socket);
    this.#subscriptions.set(socket, new Map());
    socket.on("close", () => {
      this.#sockets.delete(socket);
      this.#subscriptions.delete(socket);
    });
    socket.on("message", (data) => this.#request(socket, connection, String(data)));
    this.onConnection?.(socket);
  }

  #request(socket: WebSocket, connection: number, text: string): void {
    const message = JSON.parse(text) as { id: unknown; method: string; params: unknown };
    const request: Received = { method: message.method, params: message.params, id: message.id, connection };
    this.received.push(request);
    RECEIVED_BY_ANY_NODE.push(request);
    const params = Array.isArray(message.params) ? (message.params as unknown[]) : [];
    const answer = this.#answer(socket, params, request);
    if ("silent" in answer) return;
    if ("raw" in answer) {
      socket.send(answer.raw);
      return;
    }
    socket.send(JSON.stringify({ jsonrpc: "2.0", id: message.id, ...answer }));
  }

  #answer(socket: WebSocket, params: readonly unknown[], request: Received): Answer {
    const handler = this.#handlers.get(request.method);
    if (handler !== undefined) return handler(params, request);
    const notification = NOTIFICATIONS[request.method as keyof typeof NOTIFICATIONS];
    if (notification !== undefined) {
      const subscription = `sub-${this.#nextSubscription++}`;
      this.#subscriptions.get(socket)?.set(subscription, notification);
      return { result: subscription };
    }
    const call = MAINNET.calls.find(
      (candidate) => candidate.method === request.method && JSON.stringify(candidate.params) === JSON.stringify(params),
    );
    if (call !== undefined) return { result: call.result };
    return { error: { code: -32000, message: `not answered by the fake node: ${request.method}` } };
  }
}
