/**
 * A private process's side of the process transport (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-3,
 * PP-4, PP-5, PP-6, PP-7, PP-11; `design.md` §8; CORE-ARCH §4.14; tasks 14.2, 14.3): its connection to the core's
 * `coreTransport` address, which wakes its wait for the public cursor ({@link PrivateTransport.next}, the `PublicWakes`
 * of `src/backbone/core-private-source/`), tells the core where it is ({@link PrivateTransport.connection}'s `hello`,
 * then {@link PrivateTransport.report}) and, when its public database is PGlite or not given, reads it through the core
 * ({@link PrivateTransport.publicDatabase}). One per private process start; its block source closes it.
 *
 * **Connecting.** Startup's chain check connects ({@link PrivateTransport.connection}: by then startup has read the
 * private cursor), to `ws://<coreTransport>`, or `wss://` with the `core` entry's `tls` — its certificate and key
 * presented to the core, the core's certificate checked against `trustedRoots` (PP-11). On open it sends `hello`: its
 * instance id, the build's version, and its position — the private cursor, or S − 1 with no hash before its first
 * commit. A `hello-ack` with `refused: null` connects it: every waiter is woken (PP-3: after every reconnect the private
 * process reads the public cursor and processes up to it). One with `refused: lockstep-behind` (PP-7) connects it too, as
 * the core keeps the connection: the instance is lockstep and halts by its own check at its first height, the public
 * cursor being past it. A `hello-ack` refusing it with `duplicate-instance` (another connection holds its id, as a
 * restart can find while the core has not yet seen the old connection close) is logged and retried as a lost
 * connection.
 *
 * **A changed public configuration** (PP-14, owner decision Q147; task 14.1b). The first `hello-ack` gives the core's
 * configuration hash ({@link PrivateTransport.configHash}); every later `hello-ack`, `committed` and `read-result` must
 * carry the same. One that carries another — the core restarted with another configuration — refuses the transport for
 * good with `public-config-changed` ({@link publicConfigChanged}): the connection is closed, it connects no more, and
 * every wait, read and {@link PrivateTransport.connection} fails with that `UmbraError` (not retryable), so the process
 * halts before it processes another height.
 *
 * **Lockstep** (PP-6; task 14.3). {@link PrivateTransport.lockstep} is the last `hello-ack`'s flag (kept while away).
 * While connected to a core that lists it and has not refused it, {@link PrivateTransport.report} sends each block the
 * private process committed as `report`. A close of the core for `report-hash-mismatch` (1008: its report's hash is not
 * the public block's) refuses it for good: the transport is `refused`, connects no more, and every wait, read and
 * {@link PrivateTransport.connection} fails with that `UmbraError` (not retryable), so the process halts.
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
import { CLOSE_PROTOCOL, REPORT_HASH_MISMATCH, TRANSPORT_LIMITS, type TransportLimits, type TransportTls } from "./core-transport.js";
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
import { unrefTimer } from "./timers.js";

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
  /**
   * Whether a `configHash` other than the first `hello-ack`'s refuses the transport (PP-14); `check` unless given —
   * `ignore` is the negative control's, which goes on after the core's configuration changed.
   */
  readonly configHash?: "check" | "ignore";
}

/**
 * PP-14's halt (`public-config-changed`, not retried; owner decision Q147, task 14.1b): the core's configuration hash is
 * `found`, not `recorded`, the one it was when this private process started — learned from a message of the core
 * (`transport`) or from the public configuration history read again at a reconnection to the public database
 * (`public-database`). Its message names the two hashes, never a setting.
 */
export function publicConfigChanged(recorded: string | null, found: string | null, via: "transport" | "public-database"): UmbraError {
  const how =
    via === "transport"
      ? `a message of the core at coreTransport carries the configuration hash ${found}`
      : `the public configuration history, read again at a reconnection to the public database, hashes to ${found}`;
  return new UmbraError(
    "public-config-changed",
    `${how}, and it was ${recorded} when this private process started (PP-14): the public core restarted with another ` +
      "configuration, so the public table items this process checked at its startup (PP-13) may no longer be what it " +
      "reads, and it halts before it processes another height; start it again, which checks the public side again",
    { recorded, found, via },
  );
}

/** Where the connection is: `refused` for good by the core (`report-hash-mismatch`), `closed` by the process. */
export type TransportState = "idle" | "connecting" | "connected" | "waiting" | "refused" | "closed";

/** A request waiting for its answer. */
interface Pending {
  resolve(message: ReadResult): void;
  reject(error: unknown): void;
}

/** A wait for the next wake-up. */
interface Waiter {
  wake(): void;
  fail(error: unknown): void;
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
  /** Why the core refused it for good, once it did. */
  #refusal: UmbraError | null = null;
  /** The core's configuration hash its first `hello-ack` gave (PP-14); null before. */
  #configHash: string | null = null;
  readonly #pending = new Map<string, Pending>();
  readonly #waiters = new Set<Waiter>();
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

  /** Whether the last `hello-ack` that connected it said the core lists it in `lockstepInstances` (PP-6). */
  get lockstep(): boolean {
    return this.#ack?.lockstep === true;
  }

  /** The core's configuration hash as its first `hello-ack` gave it (PP-14), which every later message must carry. */
  get configHash(): string | null {
    return this.#configHash;
  }

  /** Why it was refused for good (`report-hash-mismatch`, `public-config-changed`), or null. */
  get refusal(): UmbraError | null {
    return this.#refusal;
  }

  /**
   * The `hello-ack` that connects it: at once while connected; once connected when idle or connecting. Fails with
   * `connection-lost` (retryable) while it waits to connect again or after `close`, and with the core's refusal once
   * it refused it for good.
   */
  async connection(): Promise<HelloAck> {
    await this.#connected();
    return this.#ack as HelloAck;
  }

  /**
   * Tells the core that `block` committed (`report`, PP-6) — only while connected to a core that lists it and has not
   * refused it; a block committed meanwhile is the position of the next `hello`.
   */
  report(block: { readonly height: bigint; readonly hash: Uint8Array }): void {
    const socket = this.#socket;
    if (this.#state !== "connected" || socket === undefined || this.#ack?.lockstep !== true || this.#ack.refused !== null) return;
    socket.send(messageText({ v: 1, type: "report", height: block.height.toString(), hash: hexOf(block.hash) }));
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
      if (this.#refusal !== null) {
        reject(this.#refusal);
        return;
      }
      const waiter: Waiter = {
        wake: () => {
          this.#waiters.delete(waiter);
          signal.removeEventListener("abort", abort);
          resolve();
        },
        fail: (error) => {
          this.#waiters.delete(waiter);
          signal.removeEventListener("abort", abort);
          reject(error);
        },
      };
      const abort = (): void => {
        this.#waiters.delete(waiter);
        reject(signal.reason);
      };
      this.#waiters.add(waiter);
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
        unrefTimer(
          setTimeout(() => {
            socket.terminate();
            resolve();
          }, 1_000),
        );
      });
    }
  }

  /** Connects unless it is connected, connecting, waiting to connect again, or closed. */
  #start(): void {
    if (this.#state === "idle") this.#connect();
  }

  /** Resolves once connected (see {@link connection}); throws why it is not. */
  async #connected(): Promise<void> {
    this.#start();
    if (this.#state === "connecting") {
      await new Promise<void>((resolve, reject) => this.#connecting.add({ resolve, reject }));
    }
    if (this.#refusal !== null) throw this.#refusal;
    if (this.#state !== "connected" || this.#socket === undefined) {
      throw lost(this.#state === "closed" ? "the process is stopping" : "the core is not connected; connecting again");
    }
  }

  /** Sends `statements` as one `read` once connected, and resolves with its `read-result` (or fails). */
  async #request(statements: { sql: string; params: JsonValue[] }[]): Promise<ReadResult> {
    await this.#connected();
    const socket = this.#socket as WebSocket;
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
      unrefTimer(this.#pinger);
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
      if (code === CLOSE_PROTOCOL && why.toString() === REPORT_HASH_MISMATCH) {
        this.#refuse();
        return;
      }
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
      case "hello-ack": {
        if (this.#configChanged(message.configHash)) return null;
        if (message.refused === "duplicate-instance") return `the core refused instance ${this.#options.instance}: ${message.refused}`;
        this.#ack = message;
        this.#state = "connected";
        this.#attempts = 0;
        const behind = message.refused === null ? "" : "; refused lockstep-behind: this instance is behind the public cursor (PP-7)";
        this.#options.log(`transport: connected to the core at ${this.#options.address}${behind}`);
        for (const waiting of this.#connecting) waiting.resolve();
        this.#connecting.clear();
        this.#wake();
        return null;
      }
      case "committed":
        if (this.#configChanged(message.configHash)) return null;
        this.#wake();
        return null;
      case "read-result": {
        if (this.#configChanged(message.configHash)) return null;
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

  /**
   * PP-14 (task 14.1b): records the first `configHash` the core sends (its first `hello-ack`'s), and refuses the
   * transport for good when a later message carries another — unless told to ignore it. True when it refused.
   */
  #configChanged(found: string): boolean {
    if (this.#configHash === null) {
      this.#configHash = found;
      return false;
    }
    if (found === this.#configHash || this.#options.configHash === "ignore") return false;
    const recorded = this.#configHash;
    this.#refusal = publicConfigChanged(recorded, found, "transport");
    this.#state = "refused";
    this.#options.log(
      `transport: the core's configuration hash is now ${found}, not ${recorded} as when this instance started: ` +
        "public-config-changed (PP-14)",
    );
    const socket = this.#socket;
    this.#socket = undefined;
    clearInterval(this.#pinger);
    this.#fail(this.#refusal);
    for (const waiter of [...this.#waiters]) waiter.fail(this.#refusal);
    socket?.close(1000, "public-config-changed");
    return true;
  }

  /** Wakes every waiter (PP-3). */
  #wake(): void {
    for (const waiter of [...this.#waiters]) waiter.wake();
  }

  /** The core refused it for good (`report-hash-mismatch`, PP-6): everything that waits on it fails with that. */
  #refuse(): void {
    const instance = this.#options.instance;
    this.#refusal = new UmbraError(
      "report-hash-mismatch",
      `the core refused instance ${instance}: a block it reported committed has another hash than the public block at ` +
        "that height (PP-6), so its private data was computed from public data the core does not have; this instance " +
        "halts — find why its public database is not the core's, then give it a new private database",
      { instance },
    );
    this.#state = "refused";
    this.#options.log(`transport: the core refused instance ${instance} for good: ${REPORT_HASH_MISMATCH} (its report's hash is not the public block's, PP-6)`);
    this.#fail(this.#refusal);
    for (const waiter of [...this.#waiters]) waiter.fail(this.#refusal);
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
    unrefTimer(this.#timer);
  }
}
