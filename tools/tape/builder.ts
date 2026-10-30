/**
 * The recording builder: a WebSocket proxy on the loopback interface, at a random free port of at least 10000, that a
 * client connects to in place of a Midnight node. It forwards each connection to the node and records the session as a
 * tape, which the tape node (`./node.ts`) then replays to the same client, byte for byte. [TT-4, A71]
 *
 * **Use.** `const builder = await TapeBuilder.start({ node: "ws://…" })`; point the client at `builder.url`; run it;
 * `const records = await builder.stop()`; `writeTapeFile(path, records)` (`./tape.ts`) writes the tape and returns its
 * id. The command `tsx tools/tape/main.ts record --node <url> --out <file>` does the same until Ctrl-C
 * (`./command.ts`).
 *
 * **Connections.** Each connection the builder accepts opens its own connection to the node and is one session of the
 * tape, in the order the builder accepted them (as the tape node serves them). The client's frames go to the node
 * unchanged, in order, held while the node's connection opens; the node's frames go to the client unchanged. What
 * each session records, in what order, and what it refuses: `./recording.ts`. Pings are answered by `ws` on each side
 * (the node client's heartbeat reaches the builder, not the node).
 *
 * **Ends.** When the node ends a connection (or its handshake fails: an empty session, which the tape node replays as
 * a connection dropped as it opens), the builder drops the client's once every frame before has been written out,
 * without a close frame (1006), as the tape node will; when the client ends one, the builder closes the node's. Each
 * session but the last ends with a `disconnect` record, and the last too when the node ended it (`joinSessions`).
 * {@link TapeBuilder.stop} ends the connections still open (requests still waiting become `timeout` faults), stops
 * listening, and returns the tape's records.
 *
 * **Refusals.** A frame the builder cannot record so that a replay gives it back byte for byte voids the recording:
 * the builder closes every connection with 1011, closes any new one at once, {@link TapeBuilder.failed} resolves with
 * the {@link RecordingError}, and {@link TapeBuilder.stop} rejects with it. The node's URL is never shown.
 */

import { createServer, type Server } from "node:http";
import { type RawData, WebSocket, WebSocketServer } from "ws";
import type { RecordingError } from "./errors.js";
import { listenOnRandomPort } from "./port.js";
import type { TapeRecord } from "./records.js";
import { joinSessions, type SessionEnd, SessionRecording } from "./recording.js";

export interface TapeBuilderOptions {
  /** The node's WebSocket URL (`ws://` or `wss://`). */
  readonly node: string;
  /**
   * Called as each session ends: its number (from 1), who ended it, and how many records it holds (not for the
   * sessions a refusal ends, which void the recording).
   */
  readonly onSessionEnd?: (session: number, end: SessionEnd, records: number) => void;
}

/** The close code the builder ends a connection with when the recording is void: WebSocket's "internal error". */
const VOID_CLOSE_CODE = 1011;

interface Link {
  readonly recording: SessionRecording;
  readonly client: WebSocket;
  readonly node: WebSocket;
  /** The client's frames waiting for the node's connection to open. */
  readonly queue: string[];
  /** Frames handed to the client's socket and not yet written out. */
  sending: number;
  /** The node ended the connection: the client's is dropped once every frame is written out. */
  dropping: boolean;
  /** Resolves once both sockets have closed. */
  readonly closed: Promise<void>;
}

/** Why a node URL is refused (the URL itself is never shown). */
export const NODE_URL_REFUSED = "the tape builder's node must be a ws:// or wss:// URL";

/** Whether `url` is a `ws://` or `wss://` URL. */
export function isWebSocketUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "ws:" || protocol === "wss:";
  } catch {
    return false;
  }
}

/** A frame's text, or a description of a binary frame (which the recording refuses). */
function frameText(data: RawData, binary: boolean): string {
  // `ws` delivers each message as one `Buffer` (its `binaryType` is `nodebuffer` unless set otherwise).
  const bytes = data as Buffer;
  return binary ? `a binary frame of ${bytes.length} bytes` : bytes.toString("utf8");
}

function whenClosed(socket: WebSocket): Promise<void> {
  return new Promise((resolve) => socket.once("close", () => resolve()));
}

export class TapeBuilder {
  /** Resolves with the error that voided the recording, at the moment it happens; never if none does. */
  readonly failed: Promise<RecordingError>;

  readonly #server: Server;
  readonly #wss: WebSocketServer;
  readonly #port: number;
  readonly #node: string;
  readonly #onSessionEnd: TapeBuilderOptions["onSessionEnd"];
  readonly #links: Link[] = [];
  readonly #fail: (error: RecordingError) => void;
  #failure: RecordingError | undefined;
  #stopped: Promise<readonly TapeRecord[]> | undefined;

  private constructor(server: Server, wss: WebSocketServer, port: number, options: TapeBuilderOptions) {
    this.#server = server;
    this.#wss = wss;
    this.#port = port;
    this.#node = options.node;
    this.#onSessionEnd = options.onSessionEnd;
    let fail: ((error: RecordingError) => void) | undefined;
    this.failed = new Promise((resolve) => {
      fail = resolve;
    });
    // The executor ran at once, so `fail` is set.
    this.#fail = fail as (error: RecordingError) => void;
  }

  /** Starts a builder in front of the node at `options.node`; nothing connects to the node before a client does. */
  static async start(options: TapeBuilderOptions): Promise<TapeBuilder> {
    if (!isWebSocketUrl(options.node)) throw new TypeError(NODE_URL_REFUSED);
    const server = createServer();
    // Listen before `ws` attaches: it re-emits the server's errors, and a port found taken would then go unhandled.
    const port = await listenOnRandomPort(server);
    const wss = new WebSocketServer({ server, perMessageDeflate: false });
    const builder = new TapeBuilder(server, wss, port, options);
    wss.on("connection", (socket) => builder.#accept(socket));
    return builder;
  }

  /** The URL to point the client at, `ws://127.0.0.1:<port>`. */
  get url(): string {
    return `ws://127.0.0.1:${this.#port}`;
  }

  get port(): number {
    return this.#port;
  }

  /** The connections accepted so far: the sessions recorded. */
  get sessions(): number {
    return this.#links.length;
  }

  /** The error that voided the recording, if one did. */
  get failure(): RecordingError | undefined {
    return this.#failure;
  }

  /**
   * Ends the connections still open (their waiting requests become `timeout` faults), stops listening, and resolves
   * with the tape's records; rejects with the {@link RecordingError} that voided the recording, if one did.
   */
  stop(): Promise<readonly TapeRecord[]> {
    this.#stopped ??= (async () => {
      // From here `ws` completes no handshake (it refuses one in progress with 503), so no connection is added.
      const listening = new Promise<void>((resolve) => this.#wss.close(() => resolve()));
      for (const link of this.#links) this.#end(link, "builder");
      await Promise.all(this.#links.map((link) => link.closed));
      await listening;
      this.#server.closeAllConnections();
      await new Promise<void>((resolve) => this.#server.close(() => resolve()));
      if (this.#failure !== undefined) throw this.#failure;
      return joinSessions(this.#links.map((link) => link.recording));
    })();
    return this.#stopped;
  }

  #accept(client: WebSocket): void {
    client.on("error", () => {});
    if (this.#failure !== undefined) {
      client.close(VOID_CLOSE_CODE, "cannot-record");
      return;
    }
    const node = new WebSocket(this.#node, { perMessageDeflate: false });
    node.on("error", () => {});
    const link: Link = {
      recording: new SessionRecording(this.#links.length + 1),
      client,
      node,
      queue: [],
      sending: 0,
      dropping: false,
      closed: Promise.all([whenClosed(client), whenClosed(node)]).then(() => undefined),
    };
    this.#links.push(link);
    client.on("message", (data, binary) => this.#fromClient(link, frameText(data, binary), binary));
    client.on("close", () => this.#end(link, "client"));
    node.on("open", () => {
      for (const text of link.queue.splice(0)) node.send(text);
    });
    node.on("message", (data, binary) => this.#fromNode(link, frameText(data, binary), binary));
    node.on("close", () => this.#end(link, "node"));
  }

  #fromClient(link: Link, text: string, binary: boolean): void {
    if (link.recording.end !== undefined) return;
    try {
      link.recording.fromClient(text, binary);
    } catch (error) {
      this.#void(error);
      return;
    }
    if (link.node.readyState === WebSocket.OPEN) link.node.send(text);
    else link.queue.push(text);
  }

  #fromNode(link: Link, text: string, binary: boolean): void {
    if (link.recording.end !== undefined) return;
    try {
      link.recording.fromNode(text, binary);
    } catch (error) {
      this.#void(error);
      return;
    }
    link.sending += 1;
    link.client.send(text, () => {
      link.sending -= 1;
      if (link.dropping && link.sending === 0) link.client.terminate();
    });
  }

  /** A connection ended (`end` says by whom): its session is closed, and the other side ended to match. */
  #end(link: Link, end: SessionEnd): void {
    if (link.recording.end !== undefined) {
      // Already ended: a stop ends what is still open, whatever it waited for.
      if (end === "builder") {
        link.client.terminate();
        link.node.terminate();
      }
      return;
    }
    link.recording.close(end);
    this.#onSessionEnd?.(link.recording.number, end, link.recording.records.length);
    if (end === "node") {
      link.dropping = true;
      if (link.sending === 0) link.client.terminate();
    } else if (end === "client") {
      link.node.close(1000);
    } else {
      link.client.terminate();
      link.node.terminate();
    }
  }

  /**
   * The recording is void: every connection is closed with 1011, and `failed` resolves. (Once void, no frame is read
   * and no connection is kept, so this happens once.)
   */
  #void(error: unknown): void {
    this.#failure = error as RecordingError;
    for (const link of this.#links) {
      link.recording.close("builder");
      link.client.close(VOID_CLOSE_CODE, "cannot-record");
      link.node.terminate();
    }
    this.#fail(this.#failure);
  }
}
