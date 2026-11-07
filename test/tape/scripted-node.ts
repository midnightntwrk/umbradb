import { createServer, type Server } from "node:http";
import { type WebSocket, WebSocketServer } from "ws";
import { closeServer, listenOnRandomPort } from "../node/fake-node.js";

/**
 * The record-and-replay check's scripted JSON-RPC server: a WebSocket JSON-RPC 2.0 server on the loopback interface, at
 * a random free port of at least 10000, that stands in for a Midnight node behind the recording builder. Each request
 * is answered by the test's script with steps sent in order, in the same turn: an answer, notifications, a raw frame,
 * or dropping the connection (once the frames before it are written out, without a close frame, as a node going away).
 * A request no step answers stays unanswered. [A71, TT-4]
 *
 * **Its frames are written by `JSON.stringify`**, not by the tape tools: `{"jsonrpc":"2.0","id":…,"result":…}` (or
 * `"error"`) and `{"jsonrpc":"2.0","method":…,"params":{"subscription":…,"result":…}}` — the spelling a Substrate node
 * (`jsonrpsee`) writes and the tape node writes too, so the bytes a client receives through the builder can be compared
 * with those the tape node sends on replay, without the tape tools being the oracle of their own output. A frame
 * `JSON.stringify` cannot write (an integer beyond 2^53) is a `raw` step.
 */

/** A request the scripted node received. */
export interface ScriptedRequest {
  /** Its connection, counting from 1. */
  readonly connection: number;
  /** The frame's text, as received. */
  readonly text: string;
  readonly id: unknown;
  readonly method: string;
  /** As the frame holds them: absent when the frame has none. */
  readonly params: unknown;
}

/** What the scripted node does for a request, in order. */
export type Step =
  | { readonly result: unknown }
  | { readonly error: unknown }
  | { readonly notify: string; readonly subscription: string | number; readonly result: unknown }
  | { readonly raw: string; readonly binary?: boolean }
  | { readonly drop: true };

/** The steps for a request: none leaves it unanswered. */
export type Script = (request: ScriptedRequest) => readonly Step[];

export class ScriptedNode {
  /** Every request received, in order. */
  readonly received: ScriptedRequest[] = [];
  /** The frames sent on each connection, in order (index 0: connection 1). */
  readonly sent: string[][] = [];
  /** Handshakes attempted, accepted or refused. */
  upgrades = 0;
  /** Each handshake's request headers, in order. */
  readonly handshakes: Readonly<Record<string, string | string[] | undefined>>[] = [];
  /** When set, the HTTP status to refuse the n-th handshake with (counting from 1), or undefined to accept it. */
  refuse: ((upgrade: number) => number | undefined) | undefined;
  /** When set, each handshake waits for it before it is answered (so a client's connection stays opening). */
  handshake: Promise<void> | undefined;

  readonly #server: Server;
  readonly #wss: WebSocketServer;
  readonly #port: number;
  readonly #sockets = new Set<WebSocket>();
  readonly #byConnection = new Map<number, WebSocket>();
  #script: Script;
  #connections = 0;

  private constructor(server: Server, wss: WebSocketServer, port: number, script: Script) {
    this.#server = server;
    this.#wss = wss;
    this.#port = port;
    this.#script = script;
  }

  static async start(script: Script): Promise<ScriptedNode> {
    const server = createServer();
    const port = await listenOnRandomPort(server);
    let node: ScriptedNode | undefined;
    const wss = new WebSocketServer({
      server,
      perMessageDeflate: false,
      verifyClient: (info, done) => {
        const self = node as ScriptedNode;
        self.upgrades += 1;
        self.handshakes.push(info.req.headers);
        const status = self.refuse?.(self.upgrades);
        const answer = (): void => {
          if (status === undefined) done(true);
          else done(false, status, "refused by the scripted node");
        };
        if (self.handshake === undefined) answer();
        else void self.handshake.then(answer);
      },
    });
    node = new ScriptedNode(server, wss, port, script);
    wss.on("connection", (socket) => (node as ScriptedNode).#accept(socket));
    return node;
  }

  get url(): string {
    return `ws://127.0.0.1:${this.#port}`;
  }

  /** Connections accepted. */
  get connections(): number {
    return this.#connections;
  }

  /** Connections open now. */
  get open(): number {
    return this.#sockets.size;
  }

  /** Answers with `script` from now on. */
  set script(script: Script) {
    this.#script = script;
  }

  /** Sends `text` as a frame on the connection `connection` (counting from 1), outside any script. */
  send(connection: number, text: string): void {
    const socket = this.#byConnection.get(connection);
    if (socket === undefined) throw new Error(`the scripted node has no connection ${connection}`);
    (this.sent[connection - 1] as string[]).push(text);
    socket.send(text);
  }

  async stop(): Promise<void> {
    for (const socket of this.#sockets) socket.terminate();
    await new Promise<void>((resolve) => this.#wss.close(() => resolve()));
    await closeServer(this.#server);
  }

  #accept(socket: WebSocket): void {
    this.#connections += 1;
    const connection = this.#connections;
    const sent: string[] = [];
    this.sent[connection - 1] = sent;
    this.#sockets.add(socket);
    this.#byConnection.set(connection, socket);
    socket.on("error", () => {});
    socket.on("close", () => this.#sockets.delete(socket));
    socket.on("message", (data) => {
      const text = String(data);
      const message = JSON.parse(text) as { id: unknown; method: string; params?: unknown };
      const { id, method, params } = message;
      const request: ScriptedRequest = { connection, text, id, method, params };
      this.received.push(request);
      this.#run(socket, sent, request, this.#script(request));
    });
  }

  #run(socket: WebSocket, sent: string[], request: ScriptedRequest, steps: readonly Step[]): void {
    const writes: Promise<void>[] = [];
    const send = (text: string, binary = false): void => {
      sent.push(text);
      writes.push(new Promise((resolve) => socket.send(text, { binary }, () => resolve())));
    };
    for (const step of steps) {
      if ("notify" in step) {
        const params = { subscription: step.subscription, result: step.result };
        send(JSON.stringify({ jsonrpc: "2.0", method: step.notify, params }));
      } else if ("result" in step) send(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: step.result }));
      else if ("error" in step) send(JSON.stringify({ jsonrpc: "2.0", id: request.id, error: step.error }));
      else if ("raw" in step) send(step.raw, step.binary);
      else {
        // Dropped once every frame before it is written out: the client receives them, then the connection ends.
        void Promise.all(writes).then(() => socket.terminate());
        return;
      }
    }
  }
}
