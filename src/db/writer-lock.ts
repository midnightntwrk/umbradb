/**
 * The writer lock: exactly one process writes each database, and the database API fails stop rather than risk a second
 * writer. [DB-11, Q50; design §4, §11]
 *
 * **PostgreSQL.** This is refactored from 0.9.5's `src/postgres/transaction-lease.ts`. That file held its lease as a
 * session advisory lock on a connection pinned for it (`sql.reserve()`), took it without waiting with
 * `pg_try_advisory_lock`, and knew that losing the connection loses the lock. [DB-11]
 *
 * The writer holds `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on its writer session (classes 1 and 2 were
 * 0.9.5's). That session is never recycled (`./postgres.ts`: one connection of its own, `max_lifetime` off). The writer
 * takes the lock whenever it opens a session, before that session's first statement of any transaction: the first time
 * when the writer starts ({@link startWriter}) or, failing that, before its first transaction (so before any
 * migration), and again on every new session after a lost one, before the next write. A session advisory lock lives as
 * long as its session, so a closed or lost writer session releases it; PostgreSQL scopes it to the database. [DB-11]
 * - The first time, another session holding it is `writer-lock-held` (a startup refusal, not retryable). Nothing was
 *   written, and a later attempt starts afresh.
 * - On a new session after a lost one, another session holding it is `writer-lock-lost`, and processing halts. Another
 *   process may have written since, so this database never writes again: every later transaction and start fails the
 *   same way, even once the lock is free.
 *
 * 0.9.5's lease timeouts, abort signals, tokens and `withLease` have no counterpart: the lock is taken once and held.
 *
 * **PGlite** in Node.js takes an operating-system lock before PGlite opens (`./pglite-lock.ts`); `memory://` takes none.
 *
 * {@link startWriter} is the startup step that runs the writer lock, then the durability probe, before the version check
 * and `startDatabase`. On PostgreSQL it opens the writer's session now, takes the lock, runs the durability probe on it
 * (`./durability-probe.ts`), and resolves with the probe's warnings. On PGlite the lock and the development opt-in were
 * checked when the database opened.
 */

import type { Row } from "../deterministic-postgresql/index.js";
import type { Database } from "./api.js";
import type { DurabilityWarning } from "./durability-probe.js";
import { UmbraError } from "./errors.js";

/** The lock's class; 1 and 2 were 0.9.5's migration lock and lease. */
export const WRITER_LOCK_CLASS = 3;
/** The lock's key, hashed by `hashtext`. */
export const WRITER_LOCK_KEY = "umbradb-writer";

/** Takes the lock on the current session without waiting; `locked` says whether it did. */
export const TAKE_WRITER_LOCK_SQL = `SELECT pg_try_advisory_lock(${WRITER_LOCK_CLASS}, hashtext('${WRITER_LOCK_KEY}')) AS locked`;

/**
 * The backend holding the lock (at most one), as `pg_locks` lists a two-key advisory lock: of this database only, since
 * `pg_locks` lists every database's locks and an advisory lock belongs to one.
 */
export const WRITER_LOCK_HOLDER_SQL =
  "SELECT pid FROM pg_locks WHERE locktype = 'advisory' " +
  `AND classid = ${WRITER_LOCK_CLASS} AND objid = (hashtext('${WRITER_LOCK_KEY}'))::oid AND objsubid = 2 AND granted ` +
  "AND database = (SELECT oid FROM pg_database WHERE datname = current_database())";

/** Statements on the writer's session, outside any transaction. */
export interface WriterSession {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
}

/**
 * Takes the writer lock on `session`: on its writer's first session (`"first"`) or on a new one after a lost session
 * (`"again"`). Rejects with `writer-lock-held` or `writer-lock-lost` when another session holds it, naming that
 * session's backend pid when PostgreSQL still lists it.
 */
export async function takeWriterLock(session: WriterSession, attempt: "first" | "again"): Promise<void> {
  const [row] = await session.query(TAKE_WRITER_LOCK_SQL);
  if (row?.locked === true) return;
  const [holding] = await session.query(WRITER_LOCK_HOLDER_SQL);
  const holder = typeof holding?.pid === "number" ? holding.pid : null;
  const who = holder === null ? "another session" : `another session (backend pid ${holder})`;
  if (attempt === "first") {
    throw new UmbraError(
      "writer-lock-held",
      `${who} holds this database's writer lock: exactly one process writes each database; stop the other ` +
        "process, or give this one another database",
      { backend: "postgresql", holder },
    );
  }
  throw new UmbraError(
    "writer-lock-lost",
    `the writer's connection was lost, and when it reconnected ${who} held this database's writer lock: another ` +
      "process may have written since, so this process must not write to the database again",
    { backend: "postgresql", holder },
  );
}

/** What starting the writer reports. */
export interface WriterStart {
  /** The durability probe's warnings (`synchronous_commit=off`), for the log; none on PGlite. */
  readonly durabilityWarnings: readonly DurabilityWarning[];
}

const starts = new WeakMap<object, () => Promise<WriterStart>>();

/** Called by a backend for each database it opens: `start` starts its writer. */
export function allowWriterStart(db: Database, start: () => Promise<WriterStart>): void {
  starts.set(db, start);
}

/**
 * Starts the writer of `db` — the first step of startup, before any write: on PostgreSQL takes the writer lock on the
 * writer's session and runs the durability probe there (rejecting with `writer-lock-held`, `writer-lock-lost`, a
 * `durability-*` code, `connection-lost` or `handle-closed`); on PGlite the lock and the opt-in were checked at open.
 * Starting a writer that already started resolves with the first start's warnings. Throws if `db` is not a database
 * the API opened.
 */
export async function startWriter(db: Database): Promise<WriterStart> {
  const start = starts.get(db);
  if (start === undefined) throw new Error("startWriter: the handle is not a database the database API opened");
  return start();
}
