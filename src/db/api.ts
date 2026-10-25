/**
 * The database API (`openspec/changes/core-arch/specs/database-api/spec.md`, `design.md` §4): the one interface the
 * runner, the backbone parts and the modules use to read and write a database, over PostgreSQL (`./postgres.ts`) and
 * PGlite (`./pglite.ts`), with the same observable results (DB-1). Its errors are {@link UmbraError}s
 * (`./errors.ts`); its result mapping and parameter texts are the `deterministic_postgresql` component's
 * (`../deterministic-postgresql/mapping.ts`), the same on both backends.
 *
 * The handles are CORE-ARCH §4.10's. A read handle sees exactly one committed height and reports it (DB-2); the
 * determinism code takes only its `query` (`ConsistentRead`, `../deterministic-postgresql/catalog.ts`). Writes go
 * through {@link Database.transaction}, one transaction at a time: on PostgreSQL on the writer connection (DB-5); on
 * PGlite as a job of the one queue every read and transaction waits in (DB-4). The block and schema write handles of DB-3
 * (own schema, `SET LOCAL ROLE`, closing) are built on it in `./write-handles.ts`. The `db` item a module may require
 * is a {@link ReadOnlyDatabase} over a database: its `read` and nothing else (`./read-only.ts`, Q73).
 */

import type { ConsistentRead } from "../deterministic-postgresql/index.js";

export type { Row } from "../deterministic-postgresql/index.js";
export { ERROR_CODES, type ErrorCode, type ErrorDetails, UmbraError } from "./errors.js";

/** One consistent read of committed data (CORE-ARCH §4.10, DB-2). */
export interface ReadHandle {
  /** The committed height the read sees; null before block S commits. */
  readonly height: bigint | null;
  /** Runs one statement; parameters as the component's `parameterText` sends them; rows mapped as DB-2 says. */
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/**
 * Inside the block transaction, under the module's role (CORE-ARCH §4.10, DB-3): reads committed data plus what earlier
 * callbacks wrote in the block; closed once its `on-db-write` callback ends (`handle-closed`). Built in
 * `./write-handles.ts`.
 */
export interface BlockWriteHandle extends ReadHandle {
  /** Runs one statement and returns the number of rows it affected; own schema only. */
  execute(sql: string, params?: unknown[]): Promise<number>;
}

/** `on-start-db`: own schema, own transaction, closed once its callback ends (CORE-ARCH §4.10, DB-3; `./write-handles.ts`). */
export interface SchemaWriteHandle extends BlockWriteHandle {}

/** One transaction on the writer connection: what the write handles, migrations and the runner's commit build on. */
export interface Transaction {
  /** Runs one statement in the transaction and returns its rows; it sees the transaction's own writes. */
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  /** Runs one statement in the transaction and returns the number of rows it affected. */
  execute(sql: string, params?: unknown[]): Promise<number>;
}

/**
 * How a read learns its committed height (DB-2: "read from the cursor inside the same transaction"): the process's
 * cursor — the block source's `cursor(read)` (`design.md` §3) — read through the handle it is given, which runs it as
 * the read's first statement, so the height and the read's snapshot are the same. It must read the database, not a
 * value held in memory. Null before any height commits.
 */
export type CommittedHeight = (read: ConsistentRead) => Promise<bigint | null>;

/**
 * Options of one read (`Database.read`; DB-15, owner decision Q71). Without them a read is not bounded: the read
 * handles given to callbacks, like the writer, run with every server-side timeout at 0 (the component's
 * `ZERO_TIMEOUTS`), because they run work the runner must finish.
 */
export interface ReadOptions {
  /**
   * Bounds this read, as a read for a module API request is bounded by `apiReadTimeoutMs` (CF-4; the module API passes
   * it, task 5.2a): milliseconds, a whole number from 1 to 2147483647 (PostgreSQL's limit), else the read is refused
   * with `invalid-configuration` before anything runs. On PostgreSQL the read runs with `statement_timeout` and
   * `idle_in_transaction_session_timeout` set to it, for this read only (`SET LOCAL`), and fails with `query-timeout`
   * (not retryable) once either ends it: a statement that ran that long (the connection stays in the pool), or the read
   * idle in its transaction that long — between two statements, or after its last one while `body` still runs — which
   * ends the session (the pool opens a new one). It fails so even when `body` caught the statement's error. On PGlite,
   * which enforces neither timeout and hangs once the second fires (`design.md` §14), it sets neither: the read is not
   * bounded.
   */
  readonly timeoutMs?: number;
}

/** A database, opened on one backend. */
export interface Database {
  /**
   * Runs `body` with a read handle that sees one committed height (DB-2): on PostgreSQL one `REPEATABLE READ READ
   * ONLY` transaction on a pooled read connection, on PGlite one job of its queue (DB-4); its height read first by
   * {@link CommittedHeight}. The handle closes when `body` settles; using it afterwards fails with `handle-closed`.
   * Resolves with `body`'s result; rejects with `body`'s own error unchanged, or with an {@link UmbraError} — with
   * `query-timeout` when {@link ReadOptions.timeoutMs} ended the read.
   */
  read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T>;
  /**
   * Runs `body` in one transaction — on PostgreSQL on the writer connection (DB-5), on PGlite as one exclusive job of
   * its queue (DB-4): it commits when `body` resolves and rolls back when `body` rejects (with `body`'s own error,
   * unchanged). Transactions run one at a time, in the order asked for. The transaction closes when it ends; using it
   * afterwards fails with `handle-closed`. A transaction a failed statement
   * aborted is rolled back, never reported as committed, even when `body` caught the statement's error. On PostgreSQL a
   * lost connection fails with `connection-lost` (retryable) and the next transaction opens a new connection; PGlite
   * runs in the process and has no connection to lose.
   */
  transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T>;
  /** Closes every connection; later reads and transactions fail with `handle-closed`. Closing twice is harmless. */
  close(): Promise<void>;
}

/**
 * The `db` item (CD-1, RN-4; owner decision Q73): a database a module reads through for work outside the points — a
 * timer, a background job, a check at startup. It offers {@link Database.read} and nothing that writes, opens a
 * transaction or closes the database; modules write only through the handles of RN-4. Made by `readOnlyDatabase`
 * (`./read-only.ts`). Inside a callback a module uses the handle it was given: on PGlite a `read` from inside a callback
 * that runs in a job of the queue fails at once with `nested-call` (DB-4), and on PostgreSQL it runs on another
 * connection and sees committed data only (the module guide, `docs/module-guide.md`).
 */
export interface ReadOnlyDatabase {
  /** {@link Database.read}, with the same arguments and results: the read option is passed through unchanged. */
  read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T>;
}
