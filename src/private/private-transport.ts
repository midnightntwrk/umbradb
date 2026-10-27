/**
 * A private process's side of the process transport (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-3,
 * PP-4, PP-5, PP-11; `design.md` §8; CORE-ARCH §4.14; task 14.2): its connection to the core's `coreTransport` address,
 * which wakes its wait for the public cursor ({@link PrivateTransport.next}, the `PublicWakes` of
 * `src/backbone/core-private-source/`) and, when its public database is PGlite or not given, reads it through the core
 * ({@link PrivateTransport.publicDatabase}). One per private process start; its block source closes it.
 *
 * **Connecting.** The first wait or read connects (by then startup has read the private cursor), to
 * `ws://<coreTransport>`, or `wss://` with the `core` entry's `tls` — its certificate and key presented to the core,
 * the core's certificate checked against `trustedRoots` (PP-11). On open it sends `hello`: its instance id, the build's
 * version, and its position — the private cursor, or S − 1 with no hash before its first commit. A `hello-ack` with
 * `refused: null` connects it: every waiter is woken (PP-3: after every reconnect the private process reads the public
 * cursor and processes up to it). A `hello-ack` refusing it (`duplicate-instance`: another connection holds its id, as a
 * restart can find while the core has not yet seen the old connection close) is logged and retried as a lost
 * connection.
 *
 * **While the core is away** (PP-5: the core never waits for an independent instance, and the instance does not need
 * the core to stay up). A lost connection — closed, refused, a protocol fault, no pong within `PING_INTERVAL_MS` — is
 * logged, and connecting again starts after IN-10's back-off (1 s, doubling up to the `core` entry's
 * `backoffCeilingMs`), again and again until the process stops; the back-off starts again from 1 s once a `hello-ack`
 * connects it. Meanwhile a wait for the public cursor just waits (a connection wakes it), a read made while a
 * connection is being made waits for it, and a read in flight when the connection is lost, or made while waiting to
 * connect again, fails with `connection-lost` — the runner's retryable failure (IN-10): the height is processed again
 * once the core answers, and the process shows `database-retrying` meanwhile. With a PostgreSQL `publicDatabase` the
 * reads go there directly and only the wake-ups need the core.
 *
 * **Reads through the core** ({@link PrivateTransport.publicDatabase}). `read(body)` first sends a `read` with no
 * statement, whose `read-result` gives the height the read starts at — the handle's `height`, the public cursor then —,
 * and each `query` of `body` is then one `read` of one statement, read back with its columns' types
 * (`./messages.ts`'s `decodeValue`). Each is its own consistent read of the public database, at the public cursor when
 * the core runs it, so at or above the handle's `height`: what an independent instance reading append-only public
 * tables by height needs (PP-5); a lockstep instance's check of the cursor is task 14.3's. A `read-result` with
 * `error` fails the query with that code (`connection-lost` among them, retried).
 *
 * **What the core may ask** (PP-9): nothing but `hello` and `report`, which a private process sends unasked. A message
 * from the core that is not JSON, has an unknown `v` or `type` (an `api` or `api-result` among them: owner decision
 * Q140 C), fails its schema, or is one only a private process sends closes the connection (PP-4).
 */

import { WebSocket } from "ws";
import type { ReadHandle } from "../db/api.js";
import { ERROR_CODES, type ErrorCode, UmbraError } from "../db/errors.js";
import { backoffDelay } from "../node/backoff.js";
import { CLOSE_PROTOCOL, TRANSPORT_LIMITS, type TransportLimits, type TransportTls } from "./core-transport.js";
import {
  decodeValue,
  encodeParameter,
  hexOf,
  type HelloAck,
  type JsonValue,
  type Message,
  messageText,
  parseMessage,
  type ReadResult,
  type StatementResult,
} from "./messages.js";

/** A private process's position, as its `hello` gives it: its cursor, or S − 1 with no hash before its first commit. */
export interface TransportPosition {
  readonly height: bigint;
  readonly hash: Uint8Array | null;
}

/** What {@link PrivateTransport} takes. */
export interface PrivateTransportOptions {
  /** `coreTransport`, `host:port`. */
  readonly address: string;
  /** The `tls` setting; plain WebSocket without it. */
  readonly tls?: TransportTls | undefined;
  /** `instanceId`. */
  readonly instance: string;
  /** The build's version, for `hello`. */
  readonly version: string;
  /** The process's position now, for each `hello`. */
  readonly position: () => TransportPosition;
  /** `backoffCeilingMs` (IN-10). */
  readonly backoffCeilingMs: number;
  /** Where log lines go. */
  readonly log: (line: string) => void;
  /** The tests' limits (the largest message, the ping's interval); `TRANSPORT_LIMITS` unless given. */
  readonly limits?: Partial<Pick<TransportLimits, "maxMessageBytes" | "pingIntervalMs">>;
}

/** Where the connection is. */
export type TransportState = "idle" | "connecting" | "connected" | "waiting" | "closed";

/** A request waiting for its answer. */
interface Pending {
  resolve(message: ReadResult): void;
  reject(error: unknown): void;
}

/** The failure of a read the connection could not carry: retryable (IN-10). */
function lost(why: string): UmbraError {
  return new UmbraError("connection-lost", `the connection to the core's transport was lost: ${why}`, {
    connection: "transport",
  });
}

/** A `read-result`'s error code as the failure of its read. */
function readFailure(code: string): UmbraError {
  const known = (ERROR_CODES as readonly string[]).includes(code) ? (code as ErrorCode) : "database-error";
  return new UmbraError(known, `the core's read of the public database failed: ${code}`, { transportCode: code });
}

/** Rows of a statement's result as the database API gives them (DB-2): column name → value read back. */
function rowsOf(result: StatementResult): Record<string, unknown>[] {
  return result.rows.map((row) => {
    const out: Record<string, unknown> = {};
    result.columns.forEach((column, index) => {
      out[column.name] = decodeValue(column.type, (row[index] ?? null) as JsonValue);
    });
    return out;
  });
}

/** A private process's transport (see the module comment). */
export class PrivateTransport {
  readonly #options: PrivateTransportOptions;
  #state: TransportState = "idle";
  #socket: WebSocket | undefined;
  #attempts = 0;
  #timer: NodeJS.Timeout | undefined;
  #pinger: NodeJS.Timeout | undefined;
  #alive = true;
  #next = 0;
  #ack: HelloAck | null = null;
  readonly #pending = new Map<string, Pending>();
  readonly #waiters = new Set<() => void>();
  /** Reads made while connecting: settled when the attempt connects or fails. */
  readonly #connecting = new Set<{ resolve(): void; reject(error: unknown): void }>();

  constructor(options: PrivateTransportOptions) {
    this.#options = options;
  }

  /** Where the connection is. */
  get state(): TransportState {
    return this.#state;
  }

  /** The last `hello-ack` that connected it, or null. */
  get ack(): HelloAck | null {
    return this.#ack;
  }

  /**
   * Resolves at the next wake-up after the call — a `committed` message, or a connection (the first included) —, or
   * rejects with `signal`'s reason once it aborts (PP-3; `PublicWakes.next`).
   */
  next(signal: AbortSignal): Promise<void> {
    this.#start();
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      const wake = (): void => {
        this.#waiters.delete(wake);
        signal.removeEventListener("abort", abort);
        resolve();
      };
      const abort = (): void => {
        this.#waiters.delete(wake);
        reject(signal.reason);
      };
      this.#waiters.add(wake);
      signal.addEventListener("abort", abort, { once: true });
    });
  }

  /** The public database read through the core (see the module comment); closing it closes nothing (the source does). */
  publicDatabase(): { read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>; close(): Promise<void> } {
    return Object.freeze({
      read: <T>(body: (read: ReadHandle) => Promise<T>) => this.read(body),
      close: async () => undefined,
    });
  }

  /** One read of the public database through the core (see the module comment). */
  async read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
    const first = await this.#request([]);
    const height = first.height === null ? null : BigInt(first.height);
    const handle: ReadHandle = Object.freeze({
      height,
      query: async (sql: string, params: unknown[] = []) => {
        const answer = await this.#request([{ sql, params: params.map((param) => encodeParameter(param)) }]);
        return rowsOf((answer.results as StatementResult[])[0] as StatementResult);
      },
    });
    return body(handle);
  }

  /** Closes the connection and stops connecting; pending reads fail (`connection-lost`), waiters stay unresolved. */
  async close(): Promise<void> {
    if (this.#state === "closed") return;
    this.#state = "closed";
    clearTimeout(this.#timer);
    clearInterval(this.#pinger);
    const socket = this.#socket;
    this.#socket = undefined;
    this.#fail(lost("the process is stopping"));
    if (socket !== undefined && socket.readyState !== socket.CLOSED) {
      await new Promise<void>((resolve) => {
        socket.once("close", () => resolve());
        socket.close(1001, "the private process is stopping");
        setTimeout(() => {
          socket.terminate();
          resolve();
        }, 1_000).unref();
      });
    }
  }

  /** Connects unless it is connected, connecting, waiting to connect again, or closed. */
  #start(): void {
    if (this.#state === "idle") this.#connect();
  }

  /** Sends `statements` as one `read` once connected, and resolves with its `read-result` (or fails). */
  async #request(statements: { sql: string; params: JsonValue[] }[]): Promise<ReadResult> {
    this.#start();
    if (this.#state === "connecting") {
      await new Promise<void>((resolve, reject) => this.#connecting.add({ resolve, reject }));
    }
    const socket = this.#socket;
    if (this.#state !== "connected" || socket === undefined) {
      throw lost(this.#state === "closed" ? "the process is stopping" : "the core is not connected; connecting again");
    }
    this.#next += 1;
    const id = String(this.#next);
    const answer = await new Promise<ReadResult>((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      socket.send(messageText({ v: 1, type: "read", id, statements }));
    });
    if (answer.error !== undefined) throw readFailure(answer.error);
    return answer;
  }

  #connect(): void {
    const { address, tls } = this.#options;
    this.#state = "connecting";
    const url = `${tls === undefined ? "ws" : "wss"}://${address}/`;
    const limits = { ...TRANSPORT_LIMITS, ...this.#options.limits };
    const socket = new WebSocket(url, {
      maxPayload: limits.maxMessageBytes,
      perMessageDeflate: false,
      ...(tls === undefined ? {} : { cert: tls.certificate, key: tls.key, ca: [...tls.trustedRoots] }),
    });
    this.#socket = socket;
    let reason = "the connection closed";
    socket.on("open", () => {
      const position = this.#options.position();
      this.#alive = true;
      socket.send(
        messageText({
          v: 1,
          type: "hello",
          instance: this.#options.instance,
          version: this.#options.version,
          height: position.height.toString(),
          hash: position.hash === null ? null : hexOf(position.hash),
        }),
      );
      this.#pinger = setInterval(() => {
        if (!this.#alive) {
          reason = "the core did not answer a ping";
          socket.terminate();
          return;
        }
        this.#alive = false;
        socket.ping();
      }, limits.pingIntervalMs);
      this.#pinger.unref();
    });
    socket.on("pong", () => {
      this.#alive = true;
    });
    socket.on("message", (data, binary) => {
      const fault = this.#receive(binary ? null : data.toString());
      if (fault !== null) {
        reason = fault;
        socket.close(CLOSE_PROTOCOL, fault);
      }
    });
    socket.on("error", (error: Error & { code?: string }) => {
      reason = error.code ?? error.message;
    });
    socket.on("close", (code, why) => {
      if (this.#socket !== socket) return;
      clearInterval(this.#pinger);
      this.#socket = undefined;
      const text = why.length > 0 ? `${reason} (${code} ${why.toString()})` : reason;
      this.#lost(text);
    });
  }

  /** Handles one message from the core; returns why the connection must close, or null. */
  #receive(text: string | null): string | null {
    if (text === null) return "binary-frame";
    const parsed = parseMessage(text);
    if (!parsed.ok) return parsed.fault;
    const message: Message = parsed.message;
    switch (message.type) {
      case "hello-ack":
        if (message.refused !== null) return `the core refused instance ${this.#options.instance}: ${message.refused}`;
        this.#ack = message;
        this.#state = "connected";
        this.#attempts = 0;
        this.#options.log(`transport: connected to the core at ${this.#options.address}`);
        for (const waiting of this.#connecting) waiting.resolve();
        this.#connecting.clear();
        this.#wake();
        return null;
      case "committed":
        this.#wake();
        return null;
      case "read-result": {
        const pending = this.#pending.get(message.id);
        if (pending === undefined) return null;
        this.#pending.delete(message.id);
        pending.resolve(message);
        return null;
      }
      default:
        return `wrong-direction ${message.type}`;
    }
  }

  /** Wakes every waiter (PP-3). */
  #wake(): void {
    for (const wake of [...this.#waiters]) wake();
  }

  /** Fails every pending read and every read waiting for the connection with `error`. */
  #fail(error: unknown): void {
    for (const pending of this.#pending.values()) pending.reject(error);
    this.#pending.clear();
    for (const waiting of this.#connecting) waiting.reject(error);
    this.#connecting.clear();
  }

  /** The connection was lost (or never made): fail what waited on it and connect again after the back-off. */
  #lost(why: string): void {
    // A close of its own never comes here: `close` drops the socket first.
    this.#fail(lost(why));
    this.#attempts += 1;
    const delay = backoffDelay(this.#attempts, this.#options.backoffCeilingMs);
    this.#state = "waiting";
    this.#options.log(`transport: ${why}; connecting again in ${delay} ms (attempt ${this.#attempts})`);
    // `close` clears the timer, so it fires only while waiting.
    this.#timer = setTimeout(() => this.#connect(), delay);
    this.#timer.unref();
  }
}
