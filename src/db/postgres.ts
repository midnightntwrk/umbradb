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
 * - The **writer** is one session (DB-5): transactions run on it one at a time, in the order asked for.
 * - **Reads** use a pool of up to `readConnections` sessions (default 10); a read waits for a free one.
 *
 * **Reads (DB-2).** `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`, then the committed height read by the
 * process's {@link CommittedHeight} as the first statement — which takes the snapshot — then the body's statements,
 * then `ROLLBACK`, which also undoes any `SET` the body ran, so no setting outlives the read.
 *
 * **Results and parameters** go through the `deterministic_postgresql` component's mapping
 * (`../deterministic-postgresql/mapping.ts`): the driver hands over every value as text (raw mode; none of its parsers
 * runs), and every parameter as the text the mapping gives it, untyped. Every session pins the component's session
 * settings ({@link PINNED_SETTINGS}, `../deterministic-postgresql/settings.ts`) as startup parameters, which take
 * precedence over the server's, the database's and the role's defaults; a `database` URL that would override one is
 * refused.
 *
 * **Errors (DB-13).** A lost connection is `connection-lost` (retryable); every other error of the driver or the server
 * is `database-error` (not retryable), with the server's SQLSTATE and the names it gives (constraint, table, schema,
 * column) — never the server's `detail`, which can hold row values, nor the URL.
 */

import postgres, { type Sql } from "postgres";
import { mapRows, PINNED_SETTINGS, parameterText, type Row } from "../deterministic-postgresql/index.js";
import type { CommittedHeight, Database, ReadHandle, Transaction } from "./api.js";
import { commitRolledBack, handleClosed, UmbraError } from "./errors.js";

/** Options of {@link openPostgres}. */
export interface PostgresOptions {
  /** A PostgreSQL URL (the `database` setting, CF-4). It must not set a {@link PINNED_SETTINGS} name. */
  readonly url: string;
  /** How a read learns its committed height (DB-2). */
  readonly committedHeight: CommittedHeight;
  /** The read pool's size; default 10. */
  readonly readConnections?: number;
  /** How long opening a connection may take, in seconds; default the driver's 30. */
  readonly connectTimeoutSeconds?: number;
}

/**
 * The first of `names` that `url` sets as a query parameter (PostgreSQL setting names are case-insensitive), or
 * undefined. The driver adds a URL's query parameters to the startup parameters after its own `connection` option, so
 * such a parameter would silently win. A plain text search, not `new URL()`, which cannot parse the driver's multi-host
 * URLs (`host1,host2`). Shared with 0.9.5's `createClient` (`../postgres/client.ts`).
 */
export function overridingUrlParameter(url: string, names: readonly string[]): string | undefined {
  return names.find((name) => new RegExp(`[?&]${name}=`, "i").test(url));
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
 * connection is `connection-lost` (retryable); anything else is `database-error` (not retryable). An error the server
 * sent (it has a `severity`) is told by its SQLSTATE; any other by the driver's code.
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
  return new UmbraError("database-error", message, details, { cause: error });
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
    url: string,
    private readonly role: Role,
    connectTimeoutSeconds: number | undefined,
  ) {
    this.sql = postgres(url, {
      max: 1,
      fetch_types: false,
      prepare: false,
      // Never recycled: the writer's connection will hold the writer lock for the process's life (DB-11).
      max_lifetime: null,
      onnotice: () => undefined,
      onclose: () => {
        if (this.state === "open") this.state = "lost";
      },
      connection: { application_name: "umbradb", ...Object.fromEntries(PINNED_SETTINGS) },
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
    if (this.state === "ended") throw handleClosed("database");
    if (this.state === "lost") {
      throw new UmbraError("connection-lost", `the ${this.role} connection to PostgreSQL was lost`, {
        connection: this.role,
        cause: "lost-earlier",
      });
    }
    type Raw = Buffer[][] & {
      columns?: { name: string; type: number }[] | null;
      count: number | null;
      command: string;
    };
    let result: Raw;
    try {
      // `simple` is a runtime option of `unsafe` the driver's types do not declare (`postgres` 3.4.9 `index.js`).
      const options = { simple } as unknown as postgres.UnsafeQueryOptions;
      result = (await this.sql.unsafe(text, args as string[], options).raw()) as unknown as Raw;
    } catch (error) {
      if (this.ended) throw handleClosed("database");
      const classified = classifyDriverError(error, this.role);
      if (classified.code === "connection-lost") this.state = "lost";
      throw classified;
    }
    const columns = (result.columns ?? []).map((column) => ({ name: column.name, type: column.type }));
    const rows = mapRows(
      columns,
      [...result].map((values) => values.map((value) => (value === null ? null : value.toString("utf8")))),
    );
    return { rows, count: result.count ?? 0, command: result.command };
  }

  /** Ends the session's connection; later statements fail with `handle-closed`. */
  async end(): Promise<void> {
    this.state = "ended";
    await this.sql.end({ timeout: 0 }).catch(() => undefined);
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
    void session.end();
  }
}

/** The writer: one session, transactions one at a time. */
class Writer {
  private session: Session | undefined;
  private queue: Promise<unknown> = Promise.resolve();
  private closed = false;

  constructor(private readonly open: () => Session) {}

  transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
    const run = this.queue.then(() => this.run(body));
    this.queue = run.catch(() => undefined);
    return run;
  }

  async close(): Promise<void> {
    this.closed = true;
    await this.session?.end();
  }

  private async run<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
    if (this.closed) throw handleClosed("database");
    if (this.session === undefined || !this.session.usable) {
      void this.session?.end();
      this.session = this.open();
    }
    const session = this.session;
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

/** Opens the PostgreSQL backend on the database at `options.url`. No connection is made until it is needed. */
export function openPostgres(options: PostgresOptions): Database {
  const overriding = overridingUrlParameter(options.url, PINNED_SETTINGS.map(([name]) => name));
  if (overriding !== undefined) {
    throw new UmbraError(
      "invalid-configuration",
      `the database URL must not set "${overriding}": the database API pins it on every connection, and the URL's ` +
        "value would silently replace it",
      { parameter: overriding },
    );
  }
  const readConnections = options.readConnections ?? 10;
  if (!Number.isSafeInteger(readConnections) || readConnections < 1) {
    const message = `readConnections must be a positive integer, not ${readConnections}`;
    throw new UmbraError("invalid-configuration", message, { parameter: "readConnections" });
  }
  const session = (role: Role) => () => new Session(options.url, role, options.connectTimeoutSeconds);
  const writer = new Writer(session("writer"));
  const pool = new ReadPool(readConnections, session("reader"));
  let closed = false;

  return {
    async read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
      if (closed) throw handleClosed("database");
      const reader = await pool.acquire();
      let open = true;
      try {
        await reader.run("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY", [], true);
        const query = async (sql: string, params?: unknown[]): Promise<Row[]> => {
          if (!open) throw handleClosed("read");
          return (await reader.run(sql, params)).rows;
        };
        const height = await options.committedHeight({ query });
        return await body({ height, query });
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
}
