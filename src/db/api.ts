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
 * (own schema, `SET LOCAL ROLE`, closing) are built on it in `./write-handles.ts`.
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

/** A database, opened on one backend. */
export interface Database {
  /**
   * Runs `body` with a read handle that sees one committed height (DB-2): on PostgreSQL one `REPEATABLE READ READ
   * ONLY` transaction on a pooled read connection, on PGlite one job of its queue (DB-4); its height read first by
   * {@link CommittedHeight}. The handle closes when `body` settles; using it afterwards fails with `handle-closed`.
   * Resolves with `body`'s result; rejects with `body`'s own error unchanged, or with an {@link UmbraError}.
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
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
