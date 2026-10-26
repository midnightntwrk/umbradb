/**
 * The tape node (`openspec/changes/core-arch/specs/test-tape/spec.md` TT-2, TT-3; acceptance A69, A70; task 9.1): a
 * WebSocket JSON-RPC 2.0 server, on the loopback interface at a random free port of at least 10000, that serves a tape
 * in place of the Midnight node, so the node client of `src/node/` talks to it unchanged.
 *
 * **Sessions.** The k-th connection it accepts is served the tape's k-th session (`./session.ts`); a connection beyond
 * the last is served an empty one, where every call is `not-on-tape`. Connections are independent: two open at once are
 * served two sessions. A process that connects again after a `disconnect` gets the next session; a test that wants the
 * tape served again from its start starts another tape node.
 *
 * **Calls** are answered by occurrence (TT-2; `./rules.ts`): the k-th request of a method and params pair in a session
 * gets the pair's k-th record, then the last call record again. A call record answers its `result` or `error` after
 * its `delayMs` (at once without one), measured on the node's clock: a timer that fires early is set again for the time
 * left, so an answer never leaves sooner than its delay, also when the event loop's clock lags under load. A
 * subscription record answers its id; a `fault: "timeout"` record answers nothing; a `fault: "error"` record answers
 * the JSON-RPC error `{ code, message: "tape fault: <method>" }` (code −32603 without one). A request no record
 * answers gets `{ code: −32090, message: "not-on-tape: <method>", data: { method, params, session } }`.
 *
 * **Notifications** are sent in file order, each once every record before it in its session is done (TT-3), right after
 * the answer that let it through, as Substrate's notification of its subscription: `chain_newHead` for
 * `chain_subscribeNewHeads`, `chain_finalizedHead` for `chain_subscribeFinalizedHeads` (TT-1 does not record the name;
 * a subscription of another method is notified under the subscription method's own name).
 *
 * **A `disconnect`**, reached last in its session, drops the connection without a close frame (the client sees 1006, as
 * when a node goes away) once every frame sent before it has been written out; requests that arrive meanwhile are not
 * answered. A session that starts with one is dropped as soon as it opens, so a run of them is an outage: each
 * connection fails, and the client backs off between them.
 *
 * **The call log** ({@link TapeNode.calls}) holds every request received, in order, with its session, occurrence, the
 * line of the record that answered it and what happened; A83 checks a sync's methods against IN-8 by it, and A81 and
 * A84 count calls in it. Frames that are not JSON-RPC 2.0 requests (a batch among them) are answered with JSON-RPC's
 * own errors (−32700, −32600) and logged too. Pings are answered by `ws`, so the node client's heartbeat keeps the
 * connection.
 */

import { createServer, type Server } from "node:http";
import { performance } from "node:perf_hooks";
import { type WebSocket, WebSocketServer } from "ws";
import { FAULT_RPC_CODE, NOT_ON_TAPE_RPC_CODE } from "./errors.js";
import { errorFrame, notificationFrame, notificationMethod, readRequest, resultFrame } from "./frames.js";
import { type Json, jsonText, sortedJsonText } from "./json.js";
import { listenOnRandomPort } from "./port.js";
import {
  type CallRecord,
  checkTape,
  type FaultRecord,
  hasField,
  type NotifyRecord,
  type SubscribeRecord,
  type TapeRecord,
} from "./records.js";
import { answerDelay, type Entry } from "./rules.js";
import { emptySession, planSessions, Session, type SessionPlan } from "./session.js";

/** The clock the tape node times delays on: Node.js's timers and `performance.now()` by default. */
export interface TapeClock {
  setTimeout(run: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
  /** Milliseconds, on the clock the timers run on. */
  now(): number;
}

export const SYSTEM_CLOCK: TapeClock = Object.freeze({
  setTimeout: (run: () => void, ms: number): unknown => setTimeout(run, ms),
  clearTimeout: (handle: unknown): void => clearTimeout(handle as Parameters<typeof clearTimeout>[0]),
  now: (): number => performance.now(),
});

/** What the tape node did with a request. */
export type TapeOutcome =
  /** Answered by the call record of its occurrence. */
  | "answered"
  /** Answered by the pair's last call record again: no record was left for its occurrence. */
  | "repeated"
  /** A subscription call, answered with its record's id. */
  | "subscribed"
  /** Matched a `fault: "timeout"` record: never answered. */
  | "fault-timeout"
  /** Matched a `fault: "error"` record: answered with its error. */
  | "fault-error"
  /** No record answers it: answered `not-on-tape`. */
  | "not-on-tape"
  /** It came after its session's `disconnect` was reached: not answered. */
  | "dropped"
  /** Not a JSON-RPC 2.0 request: answered with JSON-RPC's error. */
  | "invalid-request";

/** A request the tape node received. */
export interface TapeCall {
  /** The session (the connection), counting from 1. */
  readonly session: number;
  /** Null for a frame that is not a request. */
  readonly method: string | null;
  readonly params: Json | null;
  /** Which request of its method and params this was in its session, counting from 1; null when not counted. */
  readonly occurrence: number | null;
  /** The tape line of the record that answered it, or null. */
  readonly line: number | null;
  readonly outcome: TapeOutcome;
}

export interface TapeNodeOptions {
  readonly records: readonly TapeRecord[];
  /** The clock delays are timed on; {@link SYSTEM_CLOCK} by default. */
  readonly clock?: TapeClock;
}

interface Connection {
  readonly socket: WebSocket;
  readonly session: Session;
  /** The delay timers set and not yet fired. */
  readonly timers: Set<unknown>;
  /** Frames handed to the socket and not yet written out. */
  sending: number;
  /** The session's disconnect was reached: the connection ends once every frame is written out. */
  dropping: boolean;
}

export class TapeNode {
  readonly #server: Server;
  readonly #wss: WebSocketServer;
  readonly #port: number;
  readonly #clock: TapeClock;
  readonly #plans: readonly SessionPlan[];
  readonly #open = new Set<Connection>();
  readonly #calls: TapeCall[] = [];
  #connections = 0;
  #closed: Promise<void> | undefined;

  private constructor(
    server: Server,
    wss: WebSocketServer,
    port: number,
    clock: TapeClock,
    plans: readonly SessionPlan[],
  ) {
    this.#server = server;
    this.#wss = wss;
    this.#port = port;
    this.#clock = clock;
    this.#plans = plans;
  }

  /** Starts a tape node serving `records`, checked as a tape first (`bad-tape-record` naming the record's place). */
  static async start(options: TapeNodeOptions): Promise<TapeNode> {
    checkTape(options.records);
    const plans = planSessions(options.records);
    const server = createServer();
    // Listen before `ws` attaches: it re-emits the server's errors, and a port found taken would then go unhandled.
    const port = await listenOnRandomPort(server);
    // Frames are sent as they are (no compression, which `ws` would do on another thread and out of the send's turn).
    const wss = new WebSocketServer({ server, perMessageDeflate: false });
    const node = new TapeNode(server, wss, port, options.clock ?? SYSTEM_CLOCK, plans);
    wss.on("connection", (socket) => node.#accept(socket));
    return node;
  }

  /** The node's URL, `ws://127.0.0.1:<port>`. */
  get url(): string {
    return `ws://127.0.0.1:${this.#port}`;
  }

  get port(): number {
    return this.#port;
  }

  /** Every request received, in order. */
  get calls(): readonly TapeCall[] {
    return Object.freeze([...this.#calls]);
  }

  /** The connections accepted so far: the sessions handed out. */
  get connections(): number {
    return this.#connections;
  }

  /** How many requests of `method` were received — with these params (compared as JSON values) when given. */
  count(method: string, params?: Json): number {
    const key = params === undefined ? undefined : sortedJsonText(params);
    return this.#calls.filter(
      (call) => call.method === method && (key === undefined || sortedJsonText(call.params) === key),
    ).length;
  }

  /** Ends every connection, drops every answer still delayed, and stops listening. */
  close(): Promise<void> {
    this.#closed ??= (async () => {
      for (const connection of this.#open) {
        for (const handle of connection.timers) this.#clock.clearTimeout(handle);
        connection.timers.clear();
        connection.socket.terminate();
      }
      await new Promise<void>((resolve) => this.#wss.close(() => resolve()));
      this.#server.closeAllConnections();
      await new Promise<void>((resolve) => this.#server.close(() => resolve()));
    })();
    return this.#closed;
  }

  #accept(socket: WebSocket): void {
    this.#connections += 1;
    const number = this.#connections;
    const plan = this.#plans[number - 1] ?? emptySession(number);
    const session = new Session(plan);
    const connection: Connection = { socket, session, timers: new Set(), sending: 0, dropping: false };
    this.#open.add(connection);
    // A protocol error from the client is followed by `close`; without a listener `ws` would throw it.
    socket.on("error", () => {});
    socket.on("close", () => {
      this.#open.delete(connection);
      for (const handle of connection.timers) this.#clock.clearTimeout(handle);
      connection.timers.clear();
    });
    socket.on("message", (data) => this.#request(connection, String(data)));
    this.#walk(connection);
  }

  #log(call: TapeCall): void {
    this.#calls.push(Object.freeze(call));
  }

  #request(connection: Connection, text: string): void {
    const session = connection.session.plan.number;
    const request = readRequest(text);
    if (connection.dropping) {
      const method = request.valid ? request.method : null;
      const params = request.valid ? request.params : null;
      this.#log({ session, method, params, occurrence: null, line: null, outcome: "dropped" });
      return;
    }
    if (!request.valid) {
      this.#log({ session, method: null, params: null, occurrence: null, line: null, outcome: "invalid-request" });
      this.#send(connection, errorFrame(request.id, request.error));
      return;
    }
    const { id, method, params } = request;
    const { occurrence, entry, repeat } = connection.session.take(method, params);
    if (entry === undefined) {
      this.#log({ session, method, params, occurrence, line: null, outcome: "not-on-tape" });
      const data = { method, params, session };
      this.#send(connection, errorFrame(id, { code: NOT_ON_TAPE_RPC_CODE, message: `not-on-tape: ${method}`, data }));
      return;
    }
    const line = entry.line;
    if (entry.kind === "call") {
      this.#log({ session, method, params, occurrence, line, outcome: repeat ? "repeated" : "answered" });
      const record = entry.record as CallRecord;
      const answer = hasField(record, "result")
        ? resultFrame(id, (record as { result: Json }).result)
        : errorFrame(id, (record as { error: Json }).error);
      this.#later(connection, answerDelay(record), () => {
        this.#send(connection, answer);
        // A repeat's record was answered first (it came first, with the same delay): marking it again changes nothing.
        this.#done(connection, entry);
      });
    } else if (entry.kind === "subscribe") {
      this.#log({ session, method, params, occurrence, line, outcome: "subscribed" });
      this.#send(connection, resultFrame(id, (entry.record as SubscribeRecord).subscribe));
      this.#done(connection, entry);
    } else {
      const record = entry.record as FaultRecord;
      this.#log({ session, method, params, occurrence, line, outcome: `fault-${record.fault}` });
      if (record.fault === "error") {
        const code = record.code ?? FAULT_RPC_CODE;
        this.#send(connection, errorFrame(id, { code, message: `tape fault: ${method}` }));
      }
      this.#done(connection, entry);
    }
  }

  /** Runs `run` `delayMs` after now on the node's clock (at once for 0), setting the timer again if it fires early. */
  #later(connection: Connection, delayMs: number, run: () => void): void {
    if (delayMs === 0) {
      run();
      return;
    }
    const due = this.#clock.now() + delayMs;
    const arm = (ms: number): void => {
      const handle = this.#clock.setTimeout(() => {
        connection.timers.delete(handle);
        const left = due - this.#clock.now();
        if (left > 0) arm(Math.ceil(left));
        else run();
      }, ms);
      connection.timers.add(handle);
    };
    arm(delayMs);
  }

  #done(connection: Connection, entry: Entry): void {
    connection.session.consume(entry);
    this.#walk(connection);
  }

  /** Sends the notifications the session's walk reaches, and drops the connection at its disconnect. */
  #walk(connection: Connection): void {
    for (const entry of connection.session.advance()) {
      if (entry.kind === "disconnect") {
        connection.dropping = true;
        if (connection.sending === 0) connection.socket.terminate();
        continue;
      }
      const record = entry.record as NotifyRecord;
      const method = notificationMethod(connection.session.plan.subscriptions.get(jsonText(record.notify)) as string);
      this.#send(connection, notificationFrame(method, record.notify, record.result));
    }
  }

  #send(connection: Connection, text: string): void {
    connection.sending += 1;
    connection.socket.send(text, () => {
      connection.sending -= 1;
      if (connection.dropping && connection.sending === 0) connection.socket.terminate();
    });
  }
}
