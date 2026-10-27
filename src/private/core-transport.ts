/**
 * The core's side of the process transport (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-3, PP-4,
 * PP-5, PP-9, PP-11; `design.md` §8; CORE-ARCH §4.14, §4.20; task 14.2): the core process listens for private
 * processes on its `listen.transport` address over WebSocket (`ws`), and answers them with the messages of
 * `./messages.ts`. The process starts it once its database is open and its chain known, before the bootstrap's wait,
 * when `listen.transport` is set, and closes it at its stop (`src/runner/process.ts`).
 *
 * **Mutual TLS** (PP-11, owner decision Q34: opt-in). With the `core` entry's `tls` set — `certificate` and `key`, the
 * core's own, and `trustedRoots`, the certificate authorities whose certificates it accepts, each PEM text — the server
 * is an `https` server that requires a client certificate signed by one of `trustedRoots` (`requestCert`,
 * `rejectUnauthorized`): a private process without one, or with another, is refused in the TLS handshake, before any
 * WebSocket exists (design §14: `CERTIFICATE_REQUIRED`); without `tls` it is a plain `http` server and the transport is
 * unauthenticated, for trusted networks, one host, a TEE with its own channel. TEE attestation is out of scope.
 *
 * **A connection** speaks after its `hello`: any other message first closes it. A `hello` whose instance id another
 * connection holds — or this one already, a `hello` sent twice — is refused with `hello-ack.refused`
 * `duplicate-instance` and its connection closed, the first connection unchanged (PP-4); otherwise it is answered with
 * `hello-ack`: whether the instance is listed in `lockstepInstances`, the public genesis hash, S, and the public cursor
 * (null before the first commit). `lockstep-behind` (PP-7) is task 14.3's.
 *
 * **What the core sends and answers.**
 * - `committed` after each public commit, to every connection past its `hello` (PP-3: it only wakes a private process,
 *   which reads the public cursor itself, so a lost one costs nothing).
 * - `read-result` for each `read`: its statements run in one consistent read of the public database (`Database.read`,
 *   bounded by `apiReadTimeoutMs` as a module API request is, DB-15), the height read (null on a database with nothing
 *   committed) and, per statement, each column's name and PostgreSQL type name with the rows, every value as
 *   `./messages.ts` writes it; or `error`, a code (an `UmbraError`'s, `database-error` for anything else, never a
 *   message, which may hold a credential, AE-6). A result whose message would exceed {@link MAX_MESSAGE_BYTES} is
 *   answered `error: result-too-large`.
 * - `report` (lockstep, task 14.3) is kept as the instance's last report; nothing else is done with it yet.
 *
 * **What closes a connection** (PP-4): a message that is not JSON, has an unknown `v` or `type` — an `api` or
 * `api-result` among them: nothing calls a module across the transport (owner decision Q140 C) —, or fails its schema; a
 * binary frame; a message over {@link MAX_MESSAGE_BYTES} (`ws`'s `maxPayload`); a message only the core sends
 * (`hello-ack`, `committed`, `read-result`); more than {@link MAX_PENDING_READS} reads unanswered at once; a peer that
 * reads so slowly that more than {@link MAX_BUFFERED_BYTES} wait in its socket (PP-5: the core never waits for an
 * instance — it drops it, and the instance reconnects and catches up from the public cursor); a peer that does not
 * answer a ping within {@link PING_INTERVAL_MS} (a half-open connection would otherwise hold its instance id). Each
 * close is logged with its reason, never with the message's text.
 */

import { createServer as createHttpServer, type IncomingMessage, type Server } from "node:http";
import { createServer as createHttpsServer, type ServerOptions } from "node:https";
import type { AddressInfo } from "node:net";
import { type RawData, type WebSocket, WebSocketServer } from "ws";
import type { Database, ReadHandle } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { RESULT_TYPES, resultColumns, type ResultColumn } from "../deterministic-postgresql/index.js";
import type { BlockRef } from "../runner/block-source.js";
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
  type Report,
  type StatementResult,
} from "./messages.js";

/** The largest message either side sends or takes, in bytes (`ws`'s `maxPayload`; a `read-result` above it is refused). */
export const MAX_MESSAGE_BYTES = 64 * 1024 * 1024;

/** The most bytes waiting in a connection's socket before the core drops it as too slow (PP-5). */
export const MAX_BUFFERED_BYTES = 2 * MAX_MESSAGE_BYTES;

/** The most reads of one connection the core runs or holds at once. */
export const MAX_PENDING_READS = 64;

/** How often each side pings the other; a peer that has not answered the previous ping by then is dropped. */
export const PING_INTERVAL_MS = 15_000;

/** The WebSocket close code of a protocol fault (RFC 6455's policy violation). */
export const CLOSE_PROTOCOL = 1008;

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

/** The `tls` setting (CF-4, PP-11): the process's certificate and key, and the roots it trusts, each PEM text. */
export interface TransportTls {
  readonly certificate: string;
  readonly key: string;
  readonly trustedRoots: readonly string[];
}

/** What the core knows of a connected instance (PP-9: its id, its connection, its lockstep flag, its height). */
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
  /** The bound of each read (`apiReadTimeoutMs`, DB-15). */
  readonly readTimeoutMs: number;
  /** Where log lines go. */
  readonly log: (line: string) => void;
  /** The negative controls' `https` options from `tls`; {@link mutualTlsOptions} unless given. */
  readonly serverTls?: (tls: TransportTls) => ServerOptions;
  /** The negative controls' handling of a second `hello` of a connected id; refused unless `"accept"`. */
  readonly duplicates?: "refuse" | "accept";
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
  pending: number;
  alive: boolean;
}

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

/** A failure as a `read-result`'s code: an `UmbraError`'s, `database-error` otherwise (AE-6). */
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
  const lockstep = new Set(options.lockstepInstances);

  const drop = (session: Session, code: number, reason: string): void => {
    options.log(`transport: closed the connection${session.hello === null ? "" : ` of ${session.hello.instance}`}: ${reason}`);
    session.socket.close(code, reason);
    // A peer that never completes the close handshake is ended after it.
    setTimeout(() => session.socket.terminate(), 5_000).unref();
  };

  const send = (session: Session, message: Message): void => {
    if (session.socket.readyState !== session.socket.OPEN) return;
    if (session.socket.bufferedAmount > limits.maxBufferedBytes) {
      drop(session, CLOSE_PROTOCOL, "too-slow");
      return;
    }
    session.socket.send(messageText(message));
  };

  const ack = (session: Session, instance: string, refused: "duplicate-instance" | null): void => {
    const cursor = options.cursor();
    send(session, {
      v: 1,
      type: "hello-ack",
      lockstep: lockstep.has(instance),
      genesis: hexOf(options.genesis),
      start: options.start.toString(),
      cursor: cursor === null ? null : cursor.toString(),
      refused,
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
    ack(session, hello.instance, null);
    options.log(`transport: instance ${hello.instance} connected at ${hello.height}`);
  };

  const onRead = async (session: Session, request: Read): Promise<void> => {
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
        results,
      };
      if (Buffer.byteLength(messageText(answer)) > limits.maxMessageBytes) {
        send(session, { v: 1, type: "read-result", id: request.id, height: answer.height, error: "result-too-large" });
      } else {
        send(session, answer);
      }
    } catch (error) {
      send(session, { v: 1, type: "read-result", id: request.id, height: null, error: codeOf(error) });
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
        session.reported = message;
        return;
      default:
        drop(session, CLOSE_PROTOCOL, `wrong-direction ${message.type}`);
    }
  };

  wss.on("connection", (socket: WebSocket) => {
    const session: Session = { socket, hello: null, reported: null, pending: 0, alive: true };
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
  pings.unref();

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
        send(session, { v: 1, type: "committed", height: block.height.toString(), hash: hexOf(block.hash) });
      }
    },
    instances() {
      return [...connected.values()].map((session) => {
        const last = session.reported ?? session.hello;
        return Object.freeze({
          instance: (session.hello as Hello).instance,
          lockstep: lockstep.has((session.hello as Hello).instance),
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
          setTimeout(() => {
            for (const session of sessions) session.socket.terminate();
            server.closeAllConnections();
          }, 1_000).unref();
        });
        await new Promise<void>((resolve) => wss.close(() => resolve()));
      })();
      return closing;
    },
  });
}
