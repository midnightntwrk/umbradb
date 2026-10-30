/**
 * The database API: the one interface the runner, the backbone parts and the modules use to read and write a database,
 * over PostgreSQL (`./postgres.ts`) and PGlite (`./pglite.ts`), with the same observable results. Its errors are
 * {@link UmbraError}s (`./errors.ts`). Its result mapping and parameter texts come from the `deterministic_postgresql`
 * component (`../deterministic-postgresql/mapping.ts`), the same on both backends. [DB-1; design §4]
 *
 * The handles:
 * - A read handle sees exactly one committed height and reports it. The determinism code takes only its `query`
 *   (`ConsistentRead`, `../deterministic-postgresql/catalog.ts`). [DB-2; CORE-ARCH §4.10]
 * - Writes go through {@link Database.transaction}, one transaction at a time: on PostgreSQL on the writer connection,
 *   on PGlite as a job of the one queue every read and transaction waits in. [DB-4, DB-5]
 * - The block and schema write handles (own schema, `SET LOCAL ROLE`, closing) are built on it in
 *   `./write-handles.ts`. [DB-3]
 * - The `db` item a module may require is a {@link ReadOnlyDatabase} over a database: its `read` and nothing else
 *   (`./read-only.ts`). [Q73]
 */

import type { ConsistentRead } from "../deterministic-postgresql/index.js";

export type { Row } from "../deterministic-postgresql/index.js";
export { ERROR_CODES, type ErrorCode, type ErrorDetails, UmbraError } from "./errors.js";

/** One consistent read of committed data. [DB-2; CORE-ARCH §4.10] */
export interface ReadHandle {
  /** The committed height the read sees; null before block S commits. */
  readonly height: bigint | null;
  /**
   * Runs one statement. Parameters are sent as the component's `parameterText` makes them, and rows come back through
   * the component's result mapping. [DB-2]
   */
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/**
 * Inside the block transaction, under the module's role. It reads committed data plus what earlier callbacks wrote in
 * the block, and is closed once its `on-db-write` callback ends (`handle-closed`). Built in `./write-handles.ts`.
 * [DB-3; CORE-ARCH §4.10]
 */
export interface BlockWriteHandle extends ReadHandle {
  /** Runs one statement and returns the number of rows it affected; own schema only. */
  execute(sql: string, params?: unknown[]): Promise<number>;
}

/**
 * `on-start-db`: own schema, own transaction, closed once its callback ends (`./write-handles.ts`).
 * [DB-3; CORE-ARCH §4.10]
 */
export interface SchemaWriteHandle extends BlockWriteHandle {}

/** One transaction on the writer connection: what the write handles, migrations and the runner's commit build on. */
export interface Transaction {
  /** Runs one statement in the transaction and returns its rows; it sees the transaction's own writes. */
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  /** Runs one statement in the transaction and returns the number of rows it affected. */
  execute(sql: string, params?: unknown[]): Promise<number>;
}

/**
 * How a read learns its committed height: it reads the cursor inside the same transaction. The process's cursor (the
 * block source's `cursor(read)`) is read through the handle it is given, which runs it as the read's first statement,
 * so the height and the read's snapshot are the same. It must read the database, not a value held in memory. Null
 * before any height commits. [DB-2; design §3]
 */
export type CommittedHeight = (read: ConsistentRead) => Promise<bigint | null>;

/**
 * Options of one read (`Database.read`). Without them a read is not bounded: the read handles given to callbacks, like
 * the writer, run with every server-side timeout at 0 (the component's `ZERO_TIMEOUTS`), because they run work the
 * runner must finish. [DB-15, Q71]
 */
export interface ReadOptions {
  /**
   * Bounds this read, as a read for a module API request is bounded by `apiReadTimeoutMs` (the module API passes it).
   * It is in milliseconds, a whole number from 1 to 2147483647 (PostgreSQL's limit); anything else is rejected with
   * `invalid-configuration` before anything runs. [DB-15, CF-4]
   *
   * On PostgreSQL the read runs with `statement_timeout` and `idle_in_transaction_session_timeout` set to it, for this
   * read only (`SET LOCAL`). It fails with `query-timeout` (not retryable) once either ends it, even when `body` caught
   * the statement's error:
   * - a statement ran that long (the connection stays in the pool);
   * - the read was idle in its transaction that long, between two statements or after its last one while `body` still
   *   runs (this ends the session, and the pool opens a new one).
   *
   * PGlite enforces neither timeout and hangs once the second fires, so on PGlite it sets neither: the read is not
   * bounded. [design §14]
   */
  readonly timeoutMs?: number;
}

/** A database, opened on one backend. */
export interface Database {
  /**
   * Runs `body` with a read handle that sees one committed height: on PostgreSQL one `REPEATABLE READ READ ONLY`
   * transaction on a pooled read connection, on PGlite one job of its queue. Its height is read first, by
   * {@link CommittedHeight}. The handle closes when `body` settles; using it afterwards fails with `handle-closed`.
   * Resolves with `body`'s result. Rejects with `body`'s own error unchanged, or with an {@link UmbraError}, which is
   * `query-timeout` when {@link ReadOptions.timeoutMs} ended the read. [DB-2, DB-4]
   */
  read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T>;
  /**
   * Runs `body` in one transaction: on PostgreSQL on the writer connection, on PGlite as one exclusive job of its queue.
   * It commits when `body` resolves and rolls back when `body` rejects (with `body`'s own error, unchanged).
   * Transactions run one at a time, in the order asked for. The transaction closes when it ends; using it afterwards
   * fails with `handle-closed`. A transaction that a failed statement aborted is rolled back, never reported as
   * committed, even when `body` caught the statement's error. On PostgreSQL a lost connection fails with
   * `connection-lost` (retryable), and the next transaction opens a new connection; PGlite runs in the process and has
   * no connection to lose. [DB-4, DB-5]
   */
  transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T>;
  /** Closes every connection; later reads and transactions fail with `handle-closed`. Closing twice is harmless. */
  close(): Promise<void>;
}

/**
 * The `db` item: a database a module reads through for work outside the points, such as a timer, a background job or a
 * check at startup. It offers {@link Database.read} and nothing that writes, opens a transaction or closes the
 * database; modules write only through the handles the runner gives their callbacks. Made by `readOnlyDatabase`
 * (`./read-only.ts`). [CD-1, RN-4, Q73]
 *
 * Inside a callback a module uses the handle it was given. On PGlite a `read` from inside a callback that runs in a job
 * of the queue fails at once with `nested-call`; on PostgreSQL it runs on another connection and sees committed data
 * only. [DB-4]
 */
export interface ReadOnlyDatabase {
  /** {@link Database.read}, with the same arguments and results: the read option is passed through unchanged. */
  read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T>;
}
