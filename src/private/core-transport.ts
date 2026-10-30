/**
 * The core's side of the process transport. The core process listens for private processes on its `listen.transport`
 * address over WebSocket (`ws`), and answers them with the messages of `./messages.ts`. When `listen.transport` is set,
 * the process starts the transport once its database is open and its chain known, before the bootstrap's wait, and
 * closes it at its stop (`src/runner/process.ts`). [PP-3, PP-4, PP-5, PP-9, PP-11; design §8; CORE-ARCH §4.14, §4.20]
 *
 * **Mutual TLS** is opt-in, through the `core` entry's `tls`: `certificate` and `key` (the core's own) and
 * `trustedRoots` (the certificate authorities whose certificates it accepts), each PEM text. With `tls` set, the server
 * is an `https` server that requires a client certificate signed by one of `trustedRoots` (`requestCert`,
 * `rejectUnauthorized`). A private process without such a certificate is refused in the TLS handshake, before any
 * WebSocket exists (`CERTIFICATE_REQUIRED`). Without `tls`, it is a plain `http` server and the transport is
 * unauthenticated: for trusted networks, one host, or a TEE with its own channel. TEE attestation is out of scope.
 * [PP-11, Q34; design §14]
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
 * - a binary frame;
 * - a message over {@link MAX_MESSAGE_BYTES} (`ws`'s `maxPayload`);
 * - a message only the core sends (`hello-ack`, `committed`, `read-result`);
 * - more than {@link MAX_PENDING_READS} reads unanswered at once;
 * - a peer that reads so slowly that more than {@link MAX_BUFFERED_BYTES} wait in its socket: the core never waits for
 *   an instance, it drops it, and the instance reconnects and catches up from the public cursor [PP-5];
 * - a peer that does not answer a ping within {@link PING_INTERVAL_MS} (a half-open connection would otherwise hold its
 *   instance id).
 *
 * Each close is logged with its reason, never with the message's text.
 */

import { createServer as createHttpServer, type IncomingMessage, type Server } from "node:http";
import { createServer as createHttpsServer, type ServerOptions } from "node:https";
import type { AddressInfo } from "node:net";
import { type RawData, type WebSocket, WebSocketServer } from "ws";
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
  parseMessage,
  type Read,
  READ_REFUSED,
  type Report,
  type StatementResult,
} from "./messages.js";
import { unrefTimer } from "./timers.js";

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

/** What {@link startCoreTransport} takes. */
export interface CoreTransportOptions {
  /** `listen.transport`, `host:port` (port 0 for a free one). */
  readonly address: string;
  /** The `tls` setting; plain WebSocket without it. */
  readonly tls?: TransportTls | undefined;
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
  /** The negative controls' `https` options from `tls`; {@link mutualTlsOptions} unless given. */
  readonly serverTls?: (tls: TransportTls) => ServerOptions;
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

/** The core's running transport. */
export interface CoreTransport {
  /** The address it listens on. */
  readonly host: string;
  readonly port: number;
  /** Tells every connected instance that `block` committed (`committed`). */
  committed(block: BlockRef): void;
  /** The instances connected now. */
  instances(): readonly InstanceView[];
  /** Stops listening and closes every connection (1001); resolves once the server closed. */
  close(): Promise<void>;
}

/** The `https` options of mutual TLS from `tls` (see the module comment). */
export function mutualTlsOptions(tls: TransportTls): ServerOptions {
  return {
    cert: tls.certificate,
    key: tls.key,
    ca: [...tls.trustedRoots],
    requestCert: true,
    rejectUnauthorized: true,
  };
}

/** `host:port` split; a bracketed IPv6 host without its brackets. */
export function splitAddress(address: string): { readonly host: string; readonly port: number } {
  const colon = address.lastIndexOf(":");
  const host = address.slice(0, colon);
  return { host: host.startsWith("[") ? host.slice(1, -1) : host, port: Number(address.slice(colon + 1)) };
}

/** One connection. */
interface Session {
  readonly socket: WebSocket;
  hello: Hello | null;
  reported: Report | null;
  /** Why the core does not count this connection's instance, or null. [PP-6, PP-7] */
  refused: "lockstep-behind" | "report-hash-mismatch" | null;
  pending: number;
  alive: boolean;
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

/** Starts the core's transport (see the module comment): resolves once it listens; rejects with `listen`'s error. */
export async function startCoreTransport(options: CoreTransportOptions): Promise<CoreTransport> {
  const { host, port } = splitAddress(options.address);
  const limits: TransportLimits = { ...TRANSPORT_LIMITS, ...options.limits };
  const server: Server =
    options.tls === undefined
      ? createHttpServer()
      : createHttpsServer((options.serverTls ?? mutualTlsOptions)(options.tls));
  const wss = new WebSocketServer({ noServer: true, maxPayload: limits.maxMessageBytes, perMessageDeflate: false });
  const sessions = new Set<Session>();
  const connected = new Map<string, Session>();
  const lockstep = options.lockstep ?? new Lockstep({ listed: options.lockstepInstances, log: options.log });

  const drop = (session: Session, code: number, reason: string): void => {
    options.log(`transport: closed the connection${session.hello === null ? "" : ` of ${session.hello.instance}`}: ${reason}`);
    session.socket.close(code, reason);
    // A peer that never completes the close handshake is ended after it.
    unrefTimer(setTimeout(() => session.socket.terminate(), 5_000));
  };

  const send = (session: Session, message: Message): void => {
    if (session.socket.readyState !== session.socket.OPEN) return;
    if (session.socket.bufferedAmount > limits.maxBufferedBytes) {
      drop(session, CLOSE_PROTOCOL, "too-slow");
      return;
    }
    session.socket.send(messageText(message));
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

  const onMessage = (session: Session, data: RawData, binary: boolean): void => {
    if (binary) {
      drop(session, CLOSE_PROTOCOL, "binary-frame");
      return;
    }
    // A text frame, whole: `ws` gives it as one Buffer (its default `binaryType`).
    const parsed = parseMessage((data as Buffer).toString("utf8"));
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

  wss.on("connection", (socket: WebSocket) => {
    const session: Session = { socket, hello: null, reported: null, refused: null, pending: 0, alive: true };
    sessions.add(session);
    socket.on("message", (data, binary) => onMessage(session, data, binary));
    socket.on("pong", () => {
      session.alive = true;
    });
    socket.on("error", () => undefined);
    socket.on("close", () => {
      sessions.delete(session);
      if (session.hello !== null && connected.get(session.hello.instance) === session) {
        connected.delete(session.hello.instance);
        lockstep.disconnected(session.hello.instance);
        options.log(`transport: instance ${session.hello.instance} disconnected`);
      }
    });
  });
  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    wss.handleUpgrade(request, socket, head, (client) => wss.emit("connection", client, request));
  });
  server.on("tlsClientError", () => undefined);

  const pings = setInterval(() => {
    for (const session of sessions) {
      if (!session.alive) {
        options.log(`transport: closed the connection${session.hello === null ? "" : ` of ${session.hello.instance}`}: no-pong`);
        session.socket.terminate();
        continue;
      }
      session.alive = false;
      session.socket.ping();
    }
  }, limits.pingIntervalMs);
  unrefTimer(pings);

  await new Promise<void>((resolve, reject) => {
    const failed = (error: Error): void => {
      clearInterval(pings);
      reject(error);
    };
    server.once("error", failed);
    server.listen(port, host, () => {
      server.off("error", failed);
      resolve();
    });
  });
  const bound = server.address() as AddressInfo;
  options.log(`transport listening on ${host}:${bound.port}${options.tls === undefined ? "" : " (mutual TLS)"}`);

  let closing: Promise<void> | undefined;
  return Object.freeze({
    host,
    port: bound.port,
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
    close() {
      closing ??= (async () => {
        clearInterval(pings);
        for (const session of sessions) session.socket.close(1001, "the core is stopping");
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
          // Sockets that do not finish their close handshake.
          unrefTimer(
            setTimeout(() => {
              for (const session of sessions) session.socket.terminate();
              server.closeAllConnections();
            }, 1_000),
          );
        });
        await new Promise<void>((resolve) => wss.close(() => resolve()));
      })();
      return closing;
    },
  });
}
