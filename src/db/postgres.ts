/**
 * The PostgreSQL backend of the database API (`./api.ts`; DB-2, DB-5, DB-13; `openspec/changes/core-arch/design.md`
 * §4), refactored from 0.9.5's `src/postgres/client.ts`, over `postgres` 3.4.9.
 *
 * **Connections.** Each connection is a `postgres` client of its own with at most one connection (a *session*), so
 * that each one's loss is known at once, from the driver's `onclose`, before anything else can run: the driver would
 * otherwise reconnect silently for the next statement — a new session, outside the transaction that was open — and
 * a reserved connection used after its loss crashes the process (`TypeError` in the driver's write, `postgres`
 * 3.4.9). A lost session is never used again: every later statement on it fails with `connection-lost`, and the next
 * read or transaction opens a new one.
 * - The **writer** is one session (DB-5): transactions run on it one at a time, in the order asked for. A statement
 *   runs on the extended protocol, one per call; a migration's text of several statements runs on the simple protocol,
 *   inside the transaction, through the path only the migration runner takes (`./multi-statement.ts`).
 * - **Reads** use a pool of up to `readConnections` sessions (default 10); a read waits for a free one.
 *
 * **Reads (DB-2).** `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`, then the committed height read by the
 * process's {@link CommittedHeight} as the first statement — which takes the snapshot — then the body's statements,
 * then `ROLLBACK`, which also undoes any `SET` the body ran, so no setting outlives the read.
 *
 * **Timeouts by connection role (DB-15, owner decision Q71).** Every session starts with every server-side timeout at
 * 0 (the component's zero timeouts, part of its session settings below), so the writer — migrations, setup, block
 * transactions — and the reads given to callbacks are never cut off. A read with the read option (`timeoutMs`, a module
 * API request's `apiReadTimeoutMs`) is bounded instead: {@link BoundedRead}.
 *
 * **Results and parameters** go through the `deterministic_postgresql` component's mapping
 * (`../deterministic-postgresql/mapping.ts`): the driver hands over every value as text (raw mode; none of its parsers
 * runs), and every parameter as the text the mapping gives it, untyped. Every session pins the component's session
 * settings ({@link SESSION_SETTINGS}, `../deterministic-postgresql/settings.ts`: the five that decide how values print,
 * and the zero timeouts) as startup parameters, which take precedence over the server's, the database's and the role's
 * defaults. The connection is the `database` setting's parts (CF-4, owner decision Q167 A): no URL, so nothing can
 * add a startup parameter; `ssl` reaches the driver as {@link driverConnectionOptions} maps it (task 4.5).
 *
 * **Errors (DB-13).** A lost connection is `connection-lost` (retryable); every other error of the driver or the server
 * is `database-error` (not retryable), with the server's SQLSTATE and the names it gives (constraint, table, schema,
 * column) — never the server's `detail`, which can hold row values, nor the password — except a `TRUNCATE` the
 * `deterministic_postgresql` component's trigger refused, which is `truncate-not-allowed` (DB-14), and a bounded read
 * one of its timeouts ended, which is `query-timeout` (DB-15; only such a read reports it).
 *
 * **The writer lock and the durability probe (DB-11, DB-12).** Every writer session takes the writer lock when it
 * opens, before its first transaction (`./writer-lock.ts`). The first one then runs the durability probe on the same
 * session (`./durability-probe.ts`): a refusal ends that session, so a refused writer holds no lock and wrote nothing.
 * A session opened after a lost one only takes the lock again; finding it taken is `writer-lock-lost`, after which the
 * writer never writes again. The read pool's sessions take no lock.
 */

import postgres, { type Sql } from "postgres";
import type { SslMode } from "../config/database-parts.js";
import { mapRows, parameterText, type Row, SESSION_SETTINGS } from "../deterministic-postgresql/index.js";
import type { CommittedHeight, Database, ReadHandle, ReadOptions, Transaction } from "./api.js";
import { type DurabilityWarning, probeDurability } from "./durability-probe.js";
import { commitRolledBack, handleClosed, queryTimeout, statementRefused, UmbraError } from "./errors.js";
import { allowMultiStatement } from "./multi-statement.js";
import { readTimeoutMs } from "./read-options.js";
import { allowWriterStart, takeWriterLock, type WriterSession } from "./writer-lock.js";

/**
 * The database a backend connects to: the `database` setting's PostgreSQL parts (CF-4, owner decision Q167 A), its
 * defaults applied (`../config/database-parts.ts`): the host (a Unix socket directory when it starts with `/`), the
 * port, the login and its password, the database's name and `ssl`.
 */
export interface PostgresConnection {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  /** Absent: none passed, so the driver takes `PGPASSWORD` as libpq does. */
  readonly password?: string;
  readonly name: string;
  readonly ssl: SslMode;
}

/** The driver's connection options {@link driverConnectionOptions} gives (`postgres` 3.4.9). */
export interface DriverConnectionOptions {
  readonly host: readonly string[];
  readonly port: readonly number[];
  /** A Unix socket's file, for a host that is a socket directory. */
  readonly path?: string;
  readonly user: string;
  readonly pass?: string;
  readonly database: string;
  readonly ssl: false | "require" | { readonly rejectUnauthorized: true; readonly host: string };
}

/**
 * The driver's options for `connection` (CF-4; owner decisions Q182 B, Q183 A), as `postgres` 3.4.9 reads them:
 * - `disable` is `false`: the driver takes an `ssl` option as given when it is set (`src/index.js`, `parseOptions`), and
 *   would read the text `"disable"` as a request for TLS;
 * - `require` is the driver's own `"require"`: TLS, the certificate not checked (`src/connection.js`, `secure()`, sets
 *   `rejectUnauthorized: false` for it);
 * - `verify-full` is an object the driver merges into Node.js's `tls.connect` options: `rejectUnauthorized: true`, so the
 *   certificate is checked against Node.js's default roots (no other authority, Q183 A), and the `host`, which Node.js's
 *   `checkServerIdentity` compares with the certificate's names — the driver sets `servername` only for a host that is
 *   no IP address, so without it an IP address would be compared as `localhost`.
 *
 * The host, port, login, password and name are given, so the driver's environment defaults (`PGHOST`, `PGSSLMODE`, …)
 * never apply, except `PGPASSWORD` when no password is given. The host and port are given as lists of one, which the
 * driver takes as they are: given as text, it would split the host at `:` to find a port (`src/index.js`), turning
 * `::1` into an empty host. A host starting with `/` is a socket directory: `path` is its `.s.PGSQL.<port>`, as libpq
 * and the driver name it.
 */
export function driverConnectionOptions(connection: PostgresConnection): DriverConnectionOptions {
  const ssl =
    connection.ssl === "disable"
      ? false
      : connection.ssl === "require"
        ? "require"
        : ({ rejectUnauthorized: true, host: connection.host } as const);
  return {
    host: [connection.host],
    port: [connection.port],
    ...(connection.host.startsWith("/") ? { path: `${connection.host}/.s.PGSQL.${connection.port}` } : {}),
    user: connection.user,
    ...(connection.password === undefined ? {} : { pass: connection.password }),
    database: connection.name,
    ssl,
  };
}

/** Options of {@link openPostgres}. */
export interface PostgresOptions {
  /** The database's parts (the `database` setting, CF-4). */
  readonly connection: PostgresConnection;
  /** How a read learns its committed height (DB-2). */
  readonly committedHeight: CommittedHeight;
  /** The read pool's size; default 10. */
  readonly readConnections?: number;
  /** How long opening a connection may take, in seconds; default the driver's 30. */
  readonly connectTimeoutSeconds?: number;
  /** The core entry's `fullPageWritesOffAllowed` (CF-4): the durability probe's override; default false (DB-12). */
  readonly fullPageWritesOffAllowed?: boolean;
  /**
   * Called each time the read pool drops a session it lost (before a read takes another or opens a new one): a
   * private process's reading of its public database again at a reconnection (PP-14; task 14.1b). None unless given.
   */
  readonly onReadSessionLost?: () => void;
  /** The negative control's mapping of the parts to the driver's options; {@link driverConnectionOptions} unless given. */
  readonly driverOptions?: (connection: PostgresConnection) => DriverConnectionOptions;
}

/** Which connection a session is. */
type Role = "writer" | "reader";

/**
 * Driver error codes of a lost connection: no SQLSTATE, as the connection never reached, or no longer reaches, the
 * server.
 */
const LOST_DRIVER_CODES: ReadonlySet<string> = new Set([
  "CONNECTION_CLOSED",
  "CONNECTION_DESTROYED",
  "CONNECTION_ENDED",
  "CONNECT_TIMEOUT",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EPIPE",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

/**
 * SQLSTATEs the server ends a connection with, after which a retry on a new connection can succeed: class 08
 * (connection exception), `57P01` admin shutdown (`pg_terminate_backend`), `57P02` crash shutdown, `57P03` cannot
 * connect now (starting up or shutting down), `25P03` idle-in-transaction timeout, `57P05` idle-session timeout. A
 * refused login (`28000`, `28P01`), a dropped database (`57P04`) or too many connections (`53300`) is not a lost
 * connection: DB-13 makes them not retryable.
 */
const LOST_SQLSTATES: ReadonlySet<string> = new Set([
  "08000",
  "08001",
  "08003",
  "08004",
  "08006",
  "08007",
  "08P01",
  "57P01",
  "57P02",
  "57P03",
  "25P03",
  "57P05",
]);

interface DriverError {
  readonly message?: unknown;
  readonly code?: unknown;
  readonly severity?: unknown;
  readonly constraint_name?: unknown;
  readonly table_name?: unknown;
  readonly schema_name?: unknown;
  readonly column_name?: unknown;
}

/**
 * An error the driver threw for a statement on the `connection` session, as an {@link UmbraError} (DB-13): a lost
 * connection is `connection-lost` (retryable); anything else is `database-error` (not retryable), or
 * `truncate-not-allowed` for the component's `TRUNCATE` refusal (DB-14). An error the server sent (it has a
 * `severity`) is told by its SQLSTATE; any other by the driver's code.
 */
export function classifyDriverError(error: unknown, connection: Role): UmbraError {
  const fields: DriverError = typeof error === "object" && error !== null ? (error as DriverError) : {};
  const code = typeof fields.code === "string" ? fields.code : undefined;
  const fromServer = typeof fields.severity === "string";
  const message = typeof fields.message === "string" ? fields.message : String(error);
  if (code !== undefined && (fromServer ? LOST_SQLSTATES : LOST_DRIVER_CODES).has(code)) {
    return new UmbraError(
      "connection-lost",
      `the ${connection} connection to PostgreSQL was lost (${code}): ${message}`,
      { connection, cause: code },
      { cause: error },
    );
  }
  const details: Record<string, unknown> = {};
  if (fromServer && code !== undefined) {
    details.sqlstate = code;
    for (const [field, name] of [
      ["constraint_name", "constraint"],
      ["table_name", "table"],
      ["schema_name", "schema"],
      ["column_name", "column"],
    ] as const) {
      if (typeof fields[field] === "string") details[name] = fields[field];
    }
  } else if (code !== undefined) {
    details.cause = code;
  }
  return statementRefused(message, details, error);
}

/** The value OIDs whose default driver serializer would rewrite a parameter's text (`postgres` 3.4.9 `types.js`). */
const TEXT_SERIALIZED_OIDS = [16, 17, 114, 1082, 1114, 1184, 3802];

/** What a statement gave back. */
interface Outcome {
  readonly rows: Row[];
  readonly count: number;
  readonly command: string;
}

/** One connection, used until it is lost or ended (see the module comment). */
class Session {
  private readonly sql: Sql;
  private state: "open" | "lost" | "ended" = "open";

  constructor(
    connection: DriverConnectionOptions,
    private readonly role: Role,
    connectTimeoutSeconds: number | undefined,
  ) {
    // The driver's types take one host as text; it takes the lists `driverConnectionOptions` gives as they are.
    this.sql = (postgres as unknown as (options: object) => Sql)({
      ...connection,
      max: 1,
      fetch_types: false,
      prepare: false,
      // Never recycled: the writer's connection holds the writer lock for as long as it lives (DB-11, ./writer-lock.ts).
      max_lifetime: null,
      onnotice: () => undefined,
      onclose: () => {
        if (this.state === "open") this.state = "lost";
      },
      connection: { application_name: "umbradb", ...Object.fromEntries(SESSION_SETTINGS) },
      // Parameters arrive as text (the component's `parameterText`); these types' default serializers would rewrite it.
      types: {
        umbradbText: {
          to: 25,
          from: TEXT_SERIALIZED_OIDS,
          serialize: (text: string) => text,
          parse: (text: string) => text,
        },
      },
      ...(connectTimeoutSeconds === undefined ? {} : { connect_timeout: connectTimeoutSeconds }),
    }) as unknown as Sql;
  }

  /** True until the connection is lost or ended. */
  get usable(): boolean {
    return this.state === "open";
  }

  /** True once {@link end} ran (read through a getter: the state changes while a statement is awaited). */
  private get ended(): boolean {
    return this.state === "ended";
  }

  /**
   * Runs one statement: on the extended protocol (one statement, parameters as text), or, for transaction control, on
   * the simple protocol. Its parameters are checked before anything is sent.
   */
  async run(text: string, params: readonly unknown[] = [], simple = false): Promise<Outcome> {
    const args = params.map((value, index) => parameterText(value, index));
    type Raw = Buffer[][] & {
      columns?: { name: string; type: number }[] | null;
      count: number | null;
      command: string;
    };
    const result = (await this.send(text, args, simple)) as Raw;
    const columns = (result.columns ?? []).map((column) => ({ name: column.name, type: column.type }));
    const rows = mapRows(
      columns,
      [...result].map((values) => values.map((value) => (value === null ? null : value.toString("utf8")))),
    );
    return { rows, count: result.count ?? 0, command: result.command };
  }

  /**
   * Runs a text of several statements on the simple protocol, inside whatever transaction the session has open (a
   * migration's, `./multi-statement.ts`); its results are not read (the driver gives one per statement).
   */
  async script(text: string): Promise<void> {
    await this.send(text, [], true);
  }

  /** Sends a text to the server unless the session ended or was lost; a driver error as an {@link UmbraError}. */
  private async send(text: string, args: readonly (string | null)[], simple: boolean): Promise<unknown> {
    if (this.state === "ended") throw handleClosed("database");
    if (this.state === "lost") {
      throw new UmbraError("connection-lost", `the ${this.role} connection to PostgreSQL was lost`, {
        connection: this.role,
        cause: "lost-earlier",
      });
    }
    try {
      // `simple` is a runtime option of `unsafe` the driver's types do not declare (`postgres` 3.4.9 `index.js`).
      const options = { simple } as unknown as postgres.UnsafeQueryOptions;
      return await this.sql.unsafe(text, args as string[], options).raw();
    } catch (error) {
      if (this.ended) throw handleClosed("database");
      const classified = classifyDriverError(error, this.role);
      if (classified.code === "connection-lost") this.state = "lost";
      throw classified;
    }
  }

  /** Ends the session's connection; later statements fail with `handle-closed`. */
  async end(): Promise<void> {
    this.state = "ended";
    await this.sql.end({ timeout: 0 }).catch(() => undefined);
  }
}

/** How every read's transaction starts (DB-2). */
const READ_BEGIN = "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY";

/**
 * A read bounded by the read option (DB-15) on its session. Its transaction starts with `statement_timeout` and
 * `idle_in_transaction_session_timeout` set to the timeout (`SET LOCAL`, in the `BEGIN`'s message, so they end with the
 * read's `ROLLBACK` and the session returns to the pool with its zeros). The server cancels a statement that runs that
 * long (`57014`; the session stays usable), and ends the session once the read has been idle in its transaction that
 * long — which never reaches the caller as an error: `postgres` 3.4.9 drops a server error that arrives while no
 * statement is pending (`connection.js`, `ErrorResponse`), and the session is merely lost (`onclose`). So the read tells
 * that one by its own clock: once it has been idle since its last statement settled for its timeout, the server has
 * ended its session (its idle time started first, when it sent the last answer), and the read is over: its next
 * statement, and the read itself when the body settles, fail with `query-timeout` (its `ROLLBACK` then finds the
 * session lost, and the pool drops it). Once a timeout ended the read, every later statement — and one still running
 * with the cancelled one — and the read itself fail with that error, also when the body caught it. A statement cannot
 * stay in flight for the timeout (`statement_timeout` cancels it first), so the clock never counts one as idle time.
 *
 * In a bounded read every `57014` is taken for its timeout (a `pg_cancel_backend` too: the server's message is the only
 * difference, and it is translated). A statement sent in the instant between the server ending an idle session and the
 * read's own clock reaching the timeout can find the session lost first: `connection-lost`.
 */
class BoundedRead {
  /** When the read's last statement settled (its `BEGIN` first); undefined while a statement of it is in flight. */
  private idleSince: number | undefined;
  /** The timeout that ended the read, once one did. */
  private ended: UmbraError | undefined;

  constructor(
    private readonly session: Session,
    private readonly timeoutMs: number,
  ) {}

  /** Starts the read's transaction with its two timeouts. */
  async begin(): Promise<void> {
    const ms = this.timeoutMs;
    await this.session.script(
      `${READ_BEGIN}; SET LOCAL statement_timeout = ${ms}; SET LOCAL idle_in_transaction_session_timeout = ${ms}`,
    );
    this.idleSince = performance.now();
  }

  /** Runs one statement of the read, unless a timeout ended the read. */
  async run(text: string, params?: readonly unknown[]): Promise<Outcome> {
    this.check();
    this.idleSince = undefined;
    try {
      return await this.session.run(text, params);
    } catch (error) {
      // A cancel by the read's statement_timeout ends the read; an error after that is the timeout's; any other passes.
      if (this.ended === undefined && error instanceof UmbraError && error.details.sqlstate === "57014") {
        this.ended = queryTimeout(this.timeoutMs, "statement_timeout", error);
      }
      throw this.ended ?? error;
    } finally {
      this.idleSince = performance.now();
    }
  }

  /** Throws the timeout that ended the read, if one did — also by the read having been idle for it until now. */
  check(): void {
    if (this.ended === undefined && this.idleSince !== undefined && performance.now() - this.idleSince >= this.timeoutMs) {
      this.ended = queryTimeout(this.timeoutMs, "idle_in_transaction_session_timeout");
    }
    if (this.ended !== undefined) throw this.ended;
  }
}

/** The read pool: up to `size` sessions, reused while usable. */
class ReadPool {
  private readonly idle: Session[] = [];
  private readonly all = new Set<Session>();
  private readonly waiting: { resolve: (session: Session) => void; reject: (error: unknown) => void }[] = [];
  private closed = false;

  constructor(
    private readonly size: number,
    private readonly open: () => Session,
    private readonly lost: () => void = () => undefined,
  ) {}

  async acquire(): Promise<Session> {
    if (this.closed) throw handleClosed("database");
    for (let session = this.idle.pop(); session !== undefined; session = this.idle.pop()) {
      if (session.usable) return session;
      this.drop(session);
    }
    if (this.all.size < this.size) return this.add();
    return new Promise((resolve, reject) => this.waiting.push({ resolve, reject }));
  }

  release(session: Session): void {
    const usable = session.usable && !this.closed;
    if (!usable) this.drop(session);
    const waiter = this.waiting.shift();
    if (waiter === undefined) {
      if (usable) this.idle.push(session);
    } else {
      waiter.resolve(usable ? session : this.add());
    }
  }

  async close(): Promise<void> {
    this.closed = true;
    for (const waiter of this.waiting.splice(0)) waiter.reject(handleClosed("database"));
    this.idle.length = 0;
    await Promise.all([...this.all].map((session) => session.end()));
    this.all.clear();
  }

  private add(): Session {
    const session = this.open();
    this.all.add(session);
    return session;
  }

  private drop(session: Session): void {
    this.all.delete(session);
    // A session dropped while the pool is open was lost (an ended one is the pool's own close).
    if (!this.closed) this.lost();
    void session.end();
  }
}

/**
 * The writer: one session, transactions one at a time. Each session takes the writer lock when it opens; the first also
 * runs the durability probe (see the module comment).
 */
class Writer {
  private session: Session | undefined;
  private queue: Promise<unknown> = Promise.resolve();
  private closed = false;
  /** The first probe's warnings, once a session held the lock and passed the probe. */
  private started: readonly DurabilityWarning[] | undefined;
  /** Set when a new session found the lock taken: this writer never writes again. */
  private lost: UmbraError | undefined;

  constructor(
    private readonly open: () => Session,
    private readonly fullPageWritesOffAllowed: boolean,
  ) {}

  transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.enqueue(() => this.run(body));
  }

  /** Opens the writer's session now, if it has none: the lock, and the first time the probe. */
  start(): Promise<readonly DurabilityWarning[]> {
    return this.enqueue(async () => {
      await this.ready();
      return this.started!;
    });
  }

  async close(): Promise<void> {
    this.closed = true;
    await this.session?.end();
  }

  private enqueue<T>(job: () => Promise<T>): Promise<T> {
    const run = this.queue.then(job);
    this.queue = run.catch(() => undefined);
    return run;
  }

  /** The writer's session, holding the writer lock: the current one while usable, else a new one. */
  private async ready(): Promise<Session> {
    if (this.closed) throw handleClosed("database");
    if (this.lost !== undefined) throw this.lost;
    if (this.session !== undefined && this.session.usable) return this.session;
    void this.session?.end();
    const session = this.open();
    this.session = session;
    const statements: WriterSession = { query: async (sql, params) => (await session.run(sql, params)).rows };
    try {
      if (this.started === undefined) {
        await takeWriterLock(statements, "first");
        this.started = await probeDurability(statements, { fullPageWritesOffAllowed: this.fullPageWritesOffAllowed });
      } else {
        await takeWriterLock(statements, "again");
      }
    } catch (error) {
      // A session without the lock, or whose server the probe refused, is never used: ending it releases what it took.
      this.session = undefined;
      await session.end();
      if (error instanceof UmbraError && error.code === "writer-lock-lost") this.lost = error;
      throw error;
    }
    return session;
  }

  private async run<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
    const session = await this.ready();
    await session.run("BEGIN", [], true);
    let ended = false;
    const statement = (sql: string, params: unknown[] | undefined) => {
      if (ended) throw handleClosed("transaction");
      return session.run(sql, params);
    };
    const tx: Transaction = {
      query: async (sql, params) => (await statement(sql, params)).rows,
      execute: async (sql, params) => (await statement(sql, params)).count,
    };
    allowMultiStatement(tx, async (sql) => {
      if (ended) throw handleClosed("transaction");
      await session.script(sql);
    });
    let result: T;
    try {
      result = await body(tx);
    } catch (error) {
      ended = true;
      await rollBack(session);
      throw error;
    }
    ended = true;
    const commit = await session.run("COMMIT", [], true);
    // PostgreSQL answers COMMIT with ROLLBACK when a failed statement aborted the transaction.
    if (commit.command !== "COMMIT") throw commitRolledBack();
    return result;
  }
}

/** Rolls back a session's open transaction; a session that cannot is ended, never reused in an unknown state. */
async function rollBack(session: Session): Promise<void> {
  if (!session.usable) return;
  try {
    await session.run("ROLLBACK", [], true);
  } catch {
    await session.end();
  }
}

/** Opens the PostgreSQL backend on the database `options.connection` names. No connection is made until it is needed. */
export function openPostgres(options: PostgresOptions): Database {
  const readConnections = options.readConnections ?? 10;
  if (!Number.isSafeInteger(readConnections) || readConnections < 1) {
    const message = `readConnections must be a positive integer, not ${readConnections}`;
    throw new UmbraError("invalid-configuration", message, { parameter: "readConnections" });
  }
  const connection = (options.driverOptions ?? driverConnectionOptions)(options.connection);
  const session = (role: Role) => () => new Session(connection, role, options.connectTimeoutSeconds);
  const writer = new Writer(session("writer"), options.fullPageWritesOffAllowed ?? false);
  const pool = new ReadPool(readConnections, session("reader"), options.onReadSessionLost);
  let closed = false;

  const database: Database = {
    async read<T>(body: (read: ReadHandle) => Promise<T>, readOptions?: ReadOptions): Promise<T> {
      const timeoutMs = readTimeoutMs(readOptions);
      if (closed) throw handleClosed("database");
      const reader = await pool.acquire();
      const bound = timeoutMs === undefined ? undefined : new BoundedRead(reader, timeoutMs);
      let open = true;
      try {
        if (bound === undefined) await reader.run(READ_BEGIN, [], true);
        else await bound.begin();
        const query = async (sql: string, params?: unknown[]): Promise<Row[]> => {
          if (!open) throw handleClosed("read");
          return (await (bound ?? reader).run(sql, params)).rows;
        };
        let result: T;
        try {
          const height = await options.committedHeight({ query });
          result = await body({ height, query });
        } catch (error) {
          bound?.check();
          throw error;
        }
        bound?.check();
        return result;
      } finally {
        open = false;
        await rollBack(reader);
        pool.release(reader);
      }
    },
    transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      if (closed) return Promise.reject(handleClosed("database"));
      return writer.transaction(body);
    },
    async close(): Promise<void> {
      closed = true;
      await Promise.all([writer.close(), pool.close()]);
    },
  };
  // A closed database's writer refuses with `handle-closed` itself (`close` closes it first).
  allowWriterStart(database, async () => ({ durabilityWarnings: await writer.start() }));
  return database;
}
