/**
 * The core's side of the process transport: its session logic, which every carrier of the link shares. The core
 * process serves private processes at the address its network plan gives the link (`umbradb run`'s
 * `listen.privateLink`, or a library host's request) over WebSocket (`./core-socket.ts`, the socket carrier), or over
 * the channels a library host hands it (`./core-channels.ts`), and answers them with the messages of `./messages.ts`.
 * Each connection is one {@link LinkSession} of {@link coreSessions}, over its carrier's {@link LinkConnection}: the
 * rules below are the same on every carrier. When the plan serves the link, the process starts it once its database
 * is open and its chain known, before the bootstrap's wait, and closes it at its stop (`src/runner/process.ts`).
 * [PP-3, PP-4, PP-5, PP-9, PP-11, LM-6; design §8; CORE-ARCH §4.14, §4.20]
 *
 * **A connection** speaks after its `hello`: any other message first closes it. A `hello` whose instance id another
 * connection holds (or this one already, when `hello` is sent twice) is refused with `hello-ack.refused`
 * `duplicate-instance`, and its connection is closed; the first connection is unchanged. Any other `hello` is answered
 * with `hello-ack`: whether the instance is listed in `lockstepInstances`, the public genesis hash, S, and the public
 * cursor (null before the first commit). Each of the core's three messages carries its configuration hash,
 * `configHash`, computed once at the process's startup (`../runner/process.ts`). [PP-4, PP-14, RN-16]
 *
 * **Lockstep.** A listed instance's `hello` below the public cursor − 1 means it was listed late or its database was
 * replaced, and the mutable public state of the heights it missed is gone. It is answered `refused: lockstep-behind`,
 * and its connection is kept: it holds its id and is answered, and it halts by its own check at its first height (the
 * public cursor is past it). Meanwhile the core keeps waiting for it and names it. [PP-7, Q24]
 *
 * The core's bookkeeping (`./lockstep.ts`, which the finalized loop waits on before `BEGIN`) is told of each listed
 * instance's `hello`, of each `report` that counts, and of the close of the connection holding the instance's id. A
 * `report` is checked against the public block's hash at its height, read in one `Database.read` (bounded as a read,
 * counted with the connection's reads):
 * - a matching hash counts;
 * - a different hash, or a height with no public block, closes the connection (1008, `report-hash-mismatch`), which
 *   tells the instance to halt; the core holds the instance refused until its next `hello` [PP-6];
 * - a report the core cannot check (its read failed) closes the connection with 1011 (`report-unchecked`), and the
 *   instance connects again, its `hello` giving its height.
 *
 * A refused instance's report counts for nothing. [PP-6]
 *
 * **What the core sends and answers.**
 * - `committed` after each public commit, to every connection past its `hello`. It only wakes a private process, which
 *   reads the public cursor itself, so a lost one costs nothing. [PP-3]
 * - `read-result` for each `read`. Its statements run in one consistent read of the public database (`Database.read`,
 *   bounded by `apiReadTimeoutMs` as a module API request is). It holds the height read (null on a database with
 *   nothing committed) and, per statement, each column's name and PostgreSQL type name with the rows, every value as
 *   `./messages.ts` writes it. On failure it holds `error`, a code: an `UmbraError`'s, or `database-error` for anything
 *   else, never a message, which may hold a credential. A result whose message would exceed {@link MAX_MESSAGE_BYTES}
 *   is answered `error: result-too-large`. [PP-4, DB-15, AE-6]
 * - **Confined reads.** Before any statement of a `read` runs, each must be one read (`./read-gate.ts`: its command
 *   `SELECT`, `WITH`, `VALUES` or `TABLE`, one statement, no function or catalog the core refuses). So none can leave
 *   the read-only transaction, in which the database refuses every write, nor change the session. A `read` with a
 *   statement that is not one read is answered `error: read-refused`, with `refused` naming the first such statement.
 *   None of its statements runs, the refusal is logged (the instance, the statement's place and what it names, never
 *   its text), and the connection stays open. [PP-4, A172; design §8]
 * - `report` (lockstep): checked and counted (see **Lockstep**); its height and hash are the instance's last known.
 *
 * **What closes a connection** [PP-4]:
 * - a message that is not JSON, has an unknown `v` or `type`, or fails its schema; an `api` or `api-result` message is
 *   an unknown `type`, since nothing calls a module across the transport [Q140 C];
 * - a binary frame (on a channel: a message that is no text);
 * - a message over {@link MAX_MESSAGE_BYTES} (`ws`'s `maxPayload`; on a channel, its envelope's check);
 * - a message only the core sends (`hello-ack`, `committed`, `read-result`);
 * - more than {@link MAX_PENDING_READS} reads unanswered at once;
 * - a peer that reads so slowly that more than {@link MAX_BUFFERED_BYTES} wait in its socket (or its channel, when the
 *   channel tells its `bufferedAmount`): the core never waits for an instance, it drops it, and the instance reconnects
 *   and catches up from the public cursor [PP-5];
 * - a peer that does not answer a ping within {@link PING_INTERVAL_MS} (a half-open connection would otherwise hold its
 *   instance id); the carrier pings, and ends the session by {@link LinkSession.terminate}.
 *
 * Each close is logged with its reason, never with the message's text.
 */


import type { Database, ReadHandle } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { BLOCKS_TABLE } from "../backbone/core-block-commit/sql.js";
import { RESULT_TYPES, resultColumns, type ResultColumn } from "../deterministic-postgresql/index.js";
import type { BlockRef } from "../runner/block-source.js";
import { Lockstep } from "./lockstep.js";
import { type RefusedStatement, refusedStatement } from "./read-gate.js";
import {
  decodeParameter,
  encodeValue,
  type Hello,
  hexOf,
  type JsonValue,
  type Message,
  messageText,
  type Parsed,
  type Read,
  READ_REFUSED,
  type Report,
  type StatementResult,
} from "./messages.js";

/** The largest message either side sends or takes, in bytes (`ws`'s `maxPayload`; a `read-result` above it is refused). */
export const MAX_MESSAGE_BYTES = 64 * 1024 * 1024;

/** The most bytes waiting in a connection's socket before the core drops it as too slow. [PP-5] */
export const MAX_BUFFERED_BYTES = 2 * MAX_MESSAGE_BYTES;

/** The most reads of one connection the core runs or holds at once. */
export const MAX_PENDING_READS = 64;

/** How often each side pings the other; a peer that has not answered the previous ping by then is dropped. */
export const PING_INTERVAL_MS = 15_000;

/** The WebSocket close code of a protocol fault (RFC 6455's policy violation). */
export const CLOSE_PROTOCOL = 1008;

/** The WebSocket close code of a report the core could not check (RFC 6455's internal error): connect again. */
export const CLOSE_UNCHECKED = 1011;

/**
 * The close reason that tells a lockstep instance its report's hash is not the public block's, and to halt. [PP-6]
 */
export const REPORT_HASH_MISMATCH = "report-hash-mismatch";

/** The transport's limits (see the module comment); the tests give smaller ones. */
export interface TransportLimits {
  readonly maxMessageBytes: number;
  readonly maxBufferedBytes: number;
  readonly maxPendingReads: number;
  readonly pingIntervalMs: number;
}

/** The limits a process runs with. */
export const TRANSPORT_LIMITS: TransportLimits = Object.freeze({
  maxMessageBytes: MAX_MESSAGE_BYTES,
  maxBufferedBytes: MAX_BUFFERED_BYTES,
  maxPendingReads: MAX_PENDING_READS,
  pingIntervalMs: PING_INTERVAL_MS,
});

/** The `tls` setting: the process's certificate and key, and the roots it trusts, each PEM text. [CF-4, PP-11] */
export interface TransportTls {
  readonly certificate: string;
  readonly key: string;
  readonly trustedRoots: readonly string[];
}

/** What the core knows of a connected instance: its id, its connection, its lockstep flag, its height. [PP-9] */
export interface InstanceView {
  readonly instance: string;
  readonly lockstep: boolean;
  /** Its `hello`'s height and hash, then its last `report`'s. */
  readonly height: bigint;
  readonly hash: string | null;
}

/** What {@link coreSessions} takes: everything of the link but its carrier. */
export interface CoreSessionOptions {
  /** The public database (reads only). */
  readonly db: Pick<Database, "read">;
  /** The public genesis hash, for `hello-ack`. */
  readonly genesis: Uint8Array;
  /** S, for `hello-ack`. */
  readonly start: bigint;
  /** The public cursor's height now (null before the first commit), for `hello-ack`. */
  readonly cursor: () => bigint | null;
  /** `lockstepInstances`. */
  readonly lockstepInstances: readonly string[];
  /** The process's lockstep bookkeeping, which the transport tells (`./lockstep.ts`); one of its own unless given. */
  readonly lockstep?: Lockstep;
  /** The bound of each read (`apiReadTimeoutMs`). [DB-15] */
  readonly readTimeoutMs: number;
  /** The process's configuration hash, sent on its `hello-ack`, `committed` and `read-result`. [RN-16, PP-4] */
  readonly configHash: string;
  /** Where log lines go. */
  readonly log: (line: string) => void;
  /** The negative controls' handling of a second `hello` of a connected id; refused unless `"accept"`. */
  readonly duplicates?: "refuse" | "accept";
  /** The negative controls' check of a `report`'s hash; compared with the public block's unless `"accept"`. */
  readonly reports?: "check" | "accept";
  /**
   * The negative control's read path. With `"unconfined"`, every statement of a `read` runs as sent, in the read-only
   * transaction and nothing more; unless given, each statement is checked first (`./read-gate.ts`).
   */
  readonly reads?: "confined" | "unconfined";
  /** The tests' limits; {@link TRANSPORT_LIMITS} unless given. */
  readonly limits?: Partial<TransportLimits>;
}

/**
 * One connection of the link as the session logic drives it, whatever carries it: a WebSocket (`./core-socket.ts`) or
 * a host's channel (`./core-channels.ts`). [PP-4, LM-6]
 */
export interface LinkConnection {
  /** Whether it still carries messages: nothing is sent once it does not. */
  isOpen(): boolean;
  /** The bytes waiting to be delivered, or null when the carrier does not know them (then it bounds its own queue). */
  bufferedAmount(): number | null;
  send(text: string): void;
  /** Ends it with `code` and `reason`: the carrier's own close (a WebSocket's close frame, a channel's close message). */
  close(code: number, reason: string): void;
  /** Ends it at once; `reason` is the session's (a channel tells its peer, a socket tells nothing). */
  terminate(reason: string): void;
}

/** What a carrier read from its peer: a message as {@link parseMessage} reads it, or a fault of the carrier's own. */
export type Received = Parsed | { readonly ok: false; readonly fault: string };

/** One connection's session (see the module comment), told by its carrier what happens on the connection. */
export interface LinkSession {
  /** A message from the peer, or why what it sent is none. */
  received(received: Received): void;
  /** A fault the carrier found: logged with its reason, and the connection closed with `code`. */
  drop(code: number, reason: string): void;
  /** A peer the carrier gives up on (no pong): logged with its reason, and the connection ended at once. */
  terminate(reason: string): void;
  /** The connection ended, however: its instance's id is free again. */
  closed(): void;
}

/** The core's sessions of the link: one per connection its carriers open. */
export interface CoreSessions {
  /** A new connection, past its carrier's own handshake: its session waits for its `hello`. */
  open(connection: LinkConnection): LinkSession;
  /** Tells every connection past its `hello` that `block` committed (`committed`). */
  committed(block: BlockRef): void;
  /** The instances connected now. */
  instances(): readonly InstanceView[];
}

/** The core's running link, whatever its carrier: what the process tells it and asks of it. [PP-4, LM-6] */
export interface CoreLink {
  /** Tells every connected instance that `block` committed (`committed`). */
  committed(block: BlockRef): void;
  /** The instances connected now. */
  instances(): readonly InstanceView[];
  /** Stops serving and closes every connection; resolves once its carrier closed. */
  close(): Promise<void>;
}

/** One connection. */
interface Session {
  readonly connection: LinkConnection;
  hello: Hello | null;
  reported: Report | null;
  /** Why the core does not count this connection's instance, or null. [PP-6, PP-7] */
  refused: "lockstep-behind" | "report-hash-mismatch" | null;
  pending: number;
}

const HASH_SQL = `SELECT hash FROM ${BLOCKS_TABLE} WHERE height = $1`;

const typeNames: ReadonlyMap<number, string> = new Map(
  RESULT_TYPES.flatMap((type) => [
    [type.oid, type.name],
    [type.arrayOid, `${type.name}[]`],
  ]),
);

/** The PostgreSQL type names of `columns`, those the mapping does not name read from the catalog in the same read. */
async function columnTypes(read: ReadHandle, columns: readonly ResultColumn[]): Promise<string[]> {
  const unknown = [...new Set(columns.map((column) => column.type).filter((oid) => !typeNames.has(oid)))];
  const named = new Map(typeNames);
  if (unknown.length > 0) {
    const rows = await read.query("SELECT t.oid::bigint AS oid, format_type(t.oid, NULL) AS name FROM unnest($1::oid[]) AS t(oid)", [
      unknown,
    ]);
    for (const row of rows) named.set(Number(row.oid), String(row.name));
  }
  // Every OID is named now: the mapping's own, or the catalog's for the rest.
  return columns.map((column) => named.get(column.type) as string);
}

/** One statement's result as a `read-result` carries it. */
async function statementResult(read: ReadHandle, rows: Record<string, unknown>[]): Promise<StatementResult> {
  // The database API's rows always carry their columns (`mapRows`).
  const columns = resultColumns(rows) as readonly ResultColumn[];
  const types = await columnTypes(read, columns);
  return {
    columns: columns.map((column, index) => ({ name: column.name, type: types[index] as string })),
    rows: rows.map((row) => columns.map((column, index) => encodeValue(types[index] as string, row[column.name]))),
  };
}

/** A failure as a `read-result`'s code: an `UmbraError`'s, `database-error` otherwise. [AE-6] */
const codeOf = (error: unknown): string => (error instanceof UmbraError ? error.code : "database-error");

/** The core's sessions of the link (see the module comment), over whatever carrier opens their connections. */
export function coreSessions(options: CoreSessionOptions): CoreSessions {
  const limits: TransportLimits = { ...TRANSPORT_LIMITS, ...options.limits };
  const connected = new Map<string, Session>();
  const lockstep = options.lockstep ?? new Lockstep({ listed: options.lockstepInstances, log: options.log });

  /** The connection's name in a log line: its instance's, once its `hello` gave one. */
  const of = (session: Session): string => (session.hello === null ? "" : ` of ${session.hello.instance}`);

  const drop = (session: Session, code: number, reason: string): void => {
    options.log(`transport: closed the connection${of(session)}: ${reason}`);
    session.connection.close(code, reason);
  };

  const send = (session: Session, message: Message): void => {
    if (!session.connection.isOpen()) return;
    const buffered = session.connection.bufferedAmount();
    if (buffered !== null && buffered > limits.maxBufferedBytes) {
      drop(session, CLOSE_PROTOCOL, "too-slow");
      return;
    }
    session.connection.send(messageText(message));
  };

  const ack = (session: Session, instance: string, refused: "duplicate-instance" | "lockstep-behind" | null): void => {
    const cursor = options.cursor();
    send(session, {
      v: 1,
      type: "hello-ack",
      lockstep: lockstep.isListed(instance),
      genesis: hexOf(options.genesis),
      start: options.start.toString(),
      cursor: cursor === null ? null : cursor.toString(),
      refused,
      configHash: options.configHash,
    });
  };

  const onHello = (session: Session, hello: Hello): void => {
    const holder = connected.get(hello.instance);
    const duplicate = holder !== undefined || session.hello !== null;
    if (duplicate && options.duplicates !== "accept") {
      ack(session, hello.instance, "duplicate-instance");
      drop(session, CLOSE_PROTOCOL, `duplicate-instance ${hello.instance}`);
      return;
    }
    if (session.hello !== null && connected.get(session.hello.instance) === session) connected.delete(session.hello.instance);
    session.hello = hello;
    connected.set(hello.instance, session);
    // A listed instance below the public cursor − 1 cannot process the heights it missed. [PP-7]
    const cursor = options.cursor();
    const listed = lockstep.isListed(hello.instance);
    const behind = listed && cursor !== null && BigInt(hello.height) < cursor - 1n;
    session.refused = behind ? "lockstep-behind" : null;
    if (listed) lockstep.hello(hello.instance, BigInt(hello.height), behind ? "lockstep-behind" : null);
    ack(session, hello.instance, behind ? "lockstep-behind" : null);
    const refusal = behind ? `; refused lockstep-behind: below the public cursor ${cursor} − 1` : "";
    options.log(`transport: instance ${hello.instance} connected at ${hello.height}${refusal}`);
  };

  /** Checks a `report` against the public block at its height, and counts it (see the module comment). */
  const onReport = async (session: Session, report: Report): Promise<void> => {
    const { instance } = session.hello as Hello;
    if (session.refused !== null) return;
    const height = BigInt(report.height);
    if (options.reports !== "accept") {
      session.pending += 1;
      let stored: Uint8Array | null;
      try {
        stored = await options.db.read(
          async (read) => ((await read.query(HASH_SQL, [height]))[0]?.hash as Uint8Array | undefined) ?? null,
          { timeoutMs: options.readTimeoutMs },
        );
      } catch (error) {
        options.log(`transport: the report of ${instance} at ${height} could not be checked (${codeOf(error)}); closing its connection`);
        drop(session, CLOSE_UNCHECKED, "report-unchecked");
        return;
      } finally {
        session.pending -= 1;
      }
      const found = stored === null ? null : hexOf(stored);
      if (found !== report.hash) {
        const there = found === null ? "the public database has no block there" : `the public block there has hash ${found}`;
        options.log(`transport: instance ${instance} reported height ${height} with hash ${report.hash}, and ${there}: ${REPORT_HASH_MISMATCH}`);
        session.refused = REPORT_HASH_MISMATCH;
        lockstep.mismatched(instance);
        drop(session, CLOSE_PROTOCOL, REPORT_HASH_MISMATCH);
        return;
      }
    }
    // Counted while its connection still holds the instance's id.
    if (connected.get(instance) !== session) return;
    session.reported = report;
    lockstep.reported(instance, height);
  };

  /** Answers a `read` the gate refused (see the module comment): nothing of it ran. */
  const refuse = (session: Session, request: Read, refused: RefusedStatement): void => {
    const place = `statement ${refused.statement + 1}`;
    const what = {
      command: refused.name === null ? `${place} is not a read` : `${place} is ${refused.name}, not a read`,
      function: `${place} names ${refused.name}`,
      statements: `${place} holds more than one statement`,
      unreadable: `${place} cannot be read (an unterminated literal, comment or quoted name, a U& escape or a NUL)`,
    }[refused.reason];
    options.log(`transport: refused a read of ${(session.hello as Hello).instance}: ${what}`);
    send(session, {
      v: 1,
      type: "read-result",
      id: request.id,
      height: null,
      configHash: options.configHash,
      error: READ_REFUSED,
      refused: { statement: refused.statement, reason: refused.reason, name: refused.name },
    });
  };

  const onRead = async (session: Session, request: Read): Promise<void> => {
    const refused = options.reads === "unconfined" ? null : refusedStatement(request.statements);
    if (refused !== null) {
      refuse(session, request, refused);
      return;
    }
    session.pending += 1;
    try {
      const { height, results } = await options.db.read(async (read) => {
        const answers: StatementResult[] = [];
        for (const statement of request.statements) {
          const rows = await read.query(statement.sql, statement.params.map((param) => decodeParameter(param as JsonValue)));
          answers.push(await statementResult(read, rows));
        }
        return { height: read.height, results: answers };
      }, { timeoutMs: options.readTimeoutMs });
      const answer: Message = {
        v: 1,
        type: "read-result",
        id: request.id,
        height: height === null ? null : height.toString(),
        configHash: options.configHash,
        results,
      };
      if (Buffer.byteLength(messageText(answer)) > limits.maxMessageBytes) {
        send(session, { v: 1, type: "read-result", id: request.id, height: answer.height, configHash: options.configHash, error: "result-too-large" });
      } else {
        send(session, answer);
      }
    } catch (error) {
      send(session, { v: 1, type: "read-result", id: request.id, height: null, configHash: options.configHash, error: codeOf(error) });
    } finally {
      session.pending -= 1;
    }
  };

  const received = (session: Session, parsed: Received): void => {
    if (!parsed.ok) {
      drop(session, CLOSE_PROTOCOL, parsed.fault);
      return;
    }
    const { message } = parsed;
    if (session.hello === null && message.type !== "hello") {
      drop(session, CLOSE_PROTOCOL, "hello-first");
      return;
    }
    switch (message.type) {
      case "hello":
        onHello(session, message);
        return;
      case "read":
        if (session.pending >= limits.maxPendingReads) {
          drop(session, CLOSE_PROTOCOL, "too-many-reads");
          return;
        }
        void onRead(session, message);
        return;
      case "report":
        if (session.pending >= limits.maxPendingReads) {
          drop(session, CLOSE_PROTOCOL, "too-many-reads");
          return;
        }
        void onReport(session, message);
        return;
      default:
        drop(session, CLOSE_PROTOCOL, `wrong-direction ${message.type}`);
    }
  };

  return Object.freeze({
    open(connection: LinkConnection): LinkSession {
      const session: Session = { connection, hello: null, reported: null, refused: null, pending: 0 };
      return Object.freeze({
        received: (parsed: Received) => received(session, parsed),
        drop: (code: number, reason: string) => drop(session, code, reason),
        terminate: (reason: string) => {
          options.log(`transport: closed the connection${of(session)}: ${reason}`);
          connection.terminate(reason);
        },
        closed: () => {
          if (session.hello !== null && connected.get(session.hello.instance) === session) {
            connected.delete(session.hello.instance);
            lockstep.disconnected(session.hello.instance);
            options.log(`transport: instance ${session.hello.instance} disconnected`);
          }
        },
      });
    },
    committed(block: BlockRef) {
      for (const session of connected.values()) {
        send(session, { v: 1, type: "committed", height: block.height.toString(), hash: hexOf(block.hash), configHash: options.configHash });
      }
    },
    instances() {
      return [...connected.values()].map((session) => {
        const last = session.reported ?? session.hello;
        return Object.freeze({
          instance: (session.hello as Hello).instance,
          lockstep: lockstep.isListed((session.hello as Hello).instance),
          height: BigInt((last as Hello | Report).height),
          hash: (last as Hello | Report).hash,
        });
      });
    },
  });
}
