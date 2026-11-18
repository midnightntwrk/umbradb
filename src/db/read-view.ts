/**
 * A read-only view inside an open write transaction, for a caller that must read inside a transaction it has written
 * in. Core. Nothing calls it yet.
 *
 * **What the view is.** {@link readView} runs `body` with a read handle whose statements run in the transaction `tx`,
 * between the two texts of `./read-view-sql.ts`, each sent as one simple-protocol text:
 * - `OPEN` (a savepoint, `SET TRANSACTION READ ONLY`, `RESET ALL`, `RESET ROLE`) goes with the body's first statement:
 *   both are sent at once, in that order, and the open is not awaited alone;
 * - `CLOSE` (`ROLLBACK TO SAVEPOINT`, `RELEASE SAVEPOINT`) is sent once the body settled, and awaited before the view
 *   returns.
 * A body that sends no statement sends nothing.
 *
 * **What it guarantees.**
 * - It cannot change a persistent object. On a table or a sequence that is not temporary, `INSERT`, `UPDATE`,
 *   `DELETE`, `SELECT … FOR UPDATE`, a writing `WITH`, `nextval` and `setval` fail with `25006`. So does a statement
 *   that creates, alters, truncates or drops an object, a temporary one too (`CREATE [TEMP] TABLE`, `TRUNCATE`,
 *   `DROP`, `COMMENT`). `SET TRANSACTION READ WRITE` and its `set_config` forms fail with `25001`. What it lets
 *   through on temporary objects is below.
 * - It sees the transaction's own uncommitted writes: each view, the rows written before it.
 * - A statement that fails inside it reaches the body as its own error and does not abort the transaction. The view's
 *   later statements, also those already sent behind it, fail with `25P02` and are not sent again; the close undoes the
 *   failure.
 * - It cannot change the session for later statements. Inside it the settings and the role are the session's own (the
 *   open's resets); a `SET`, `SET LOCAL`, `set_config` or `SET ROLE` is undone by the close, and the transaction's own
 *   `SET LOCAL ROLE` and local settings are back after it.
 * - It cannot end or leave the transaction: a statement whose first word is transaction control, also behind empty
 *   statements, or that sets the session authorization, is refused before it is sent (`./statement-refusal.ts`), and
 *   the server refuses `DO` and `CALL` that would end it (`2D000`) and two statements in one call (`42601`).
 * - A view whose statements only read takes no transaction id and no subtransaction id; `now()` and the transaction
 *   id are the transaction's.
 * - On PostgreSQL the open and close go through a path of the session that never counts as a schema change, so the
 *   session's prepared texts stay prepared; a prepared write is refused inside the view and usable after it.
 *
 * **What it lets through on temporary objects.** PostgreSQL's read-only transaction does not refuse changes to the
 * temporary tables and sequences its session already has, and the view adds no check of its own (it does not read the
 * body's SQL):
 * - `nextval` and `setval` of a temporary sequence succeed, and the close does not undo them: a sequence's value is no
 *   part of a transaction;
 * - `INSERT`, `UPDATE`, `DELETE`, `SELECT … FOR UPDATE` and a writing `WITH` on a temporary table succeed inside the
 *   view and are undone by the close; such a statement gives the view a subtransaction id, and the transaction an id
 *   if it had none. `DISCARD TEMP` is accepted and undone the same way.
 * UmbraDB's own SQL creates no temporary object. One exists on the writer's session only when a module made it, with
 * `CREATE TEMP …` in a migration or through a write handle, and what a view's statements then do to it is that
 * module's own doing.
 *
 * **What it does not undo.** Functions that act outside the transaction run and stay: a session-level advisory lock
 * (`pg_advisory_lock`) taken in a view outlives it and the commit, and `pg_terminate_backend` or `pg_cancel_backend`
 * act at once. `txid_current()` gives the transaction an id, which stays. The session's prepared statements and
 * cursors are no part of a transaction either: a statement prepared by name (`PREPARE`) in a view outlives it, as
 * through any handle, and one deallocated in a view (`DEALLOCATE`) stays deallocated; a cursor a view fetched from
 * (the transaction's own, or one an earlier transaction declared `WITH HOLD`) keeps its place, and a holdable cursor
 * closed in a view stays closed, while a cursor declared inside a view is gone after it. A custom setting first made
 * in a view reads `''`, not NULL, after it: treat `''` as unset. `LISTEN` and `UNLISTEN` in a view are undone, and
 * `NOTIFY` is accepted and dropped with the rolled-back subtransaction. On PGlite,
 * `set_config('session_authorization', …)` inside a `SELECT` is not caught, and nothing undoes it for the engine's
 * life.
 *
 * **Results and errors.** The view resolves with the body's result, or rejects with the body's own error unchanged. A
 * close that fails wins over both: the view rejects with the close's error, and the transaction refuses every later
 * statement with that error and rolls back at its end, never committing. A handle used after its body settled fails
 * with `handle-closed` (`handle: "read"`) and sends nothing. A view asked for while another view of the same
 * transaction is open throws a programming error before anything is sent, as does a `tx` no backend opened.
 *
 * **A transaction already aborted.** The open fails (`25P02`): the view's first statement rejects with the open's
 * error, its later statements with the same error without being sent, and the close is not sent. The transaction
 * stays aborted, and its commit is refused (`commit-rolled-back`).
 *
 * The transaction's own statements sent while a view is open run inside the view: read-only, and failing behind a
 * failed statement of the view.
 *
 * **The backends' path**, as for `./multi-statement.ts`: each backend registers, for every transaction it opens, how
 * to send a text inside it and how to mark it broken ({@link allowReadView}), keyed by the transaction object; nothing
 * else holds it.
 */

import type { ReadHandle, Transaction } from "./api.js";
import { controlRefused, handleClosed, type UmbraError } from "./errors.js";
import { CLOSE, OPEN } from "./read-view-sql.js";
import { controlStatement } from "./statement-refusal.js";

/** Options of one view. */
export interface ReadViewOptions {
  /** What the view's handle reports as `height`, as the write handles take it. */
  readonly height: bigint | null;
}

/** What a backend registers for a transaction it opened ({@link allowReadView}). */
export interface ReadViewPath {
  /**
   * Sends `text`, which may hold several statements, inside the transaction as one simple-protocol text; its results
   * are not read. Fails with `handle-closed` once the transaction ended.
   */
  control(text: string): Promise<void>;
  /** Makes the transaction refuse every later statement with `error` and roll back at its end, never committing. */
  broken(error: UmbraError): void;
}

interface Registered {
  readonly path: ReadViewPath;
  /** True while a view of the transaction is open. */
  viewing: boolean;
}

const registered = new WeakMap<Transaction, Registered>();

/** Called by each backend for every transaction it opens. */
export function allowReadView(tx: Transaction, path: ReadViewPath): void {
  registered.set(tx, { path, viewing: false });
}

/**
 * Runs `body` with a read-only view of the transaction `tx` (see the module comment) and resolves with its result.
 * Throws, sending nothing, when `tx` is not a transaction a backend opened or a view of it is open.
 */
export async function readView<T>(
  tx: Transaction,
  options: ReadViewOptions,
  body: (read: ReadHandle) => Promise<T>,
): Promise<T> {
  const entry = registered.get(tx);
  if (entry === undefined) throw new Error("readView: the handle is not a transaction the database API opened");
  if (entry.viewing) {
    throw new Error("readView: a view of this transaction is open; views do not nest, so use the open view's handle");
  }
  entry.viewing = true;
  try {
    return await view(tx, entry.path, options, body);
  } finally {
    entry.viewing = false;
  }
}

/** One view, open from its first statement until its close was answered. */
async function view<T>(
  tx: Transaction,
  path: ReadViewPath,
  options: ReadViewOptions,
  body: (read: ReadHandle) => Promise<T>,
): Promise<T> {
  let settled = false;
  /** Whether the open was accepted, once it was sent. */
  let opened: Promise<boolean> | undefined;
  /** The open's error, once it failed. */
  let openFailure: { readonly error: unknown } | undefined;
  const query = async (sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> => {
    if (settled) throw handleClosed("read");
    const command = controlStatement(sql);
    if (command !== null) throw controlRefused(command);
    if (openFailure !== undefined) throw openFailure.error;
    if (opened !== undefined) return tx.query(sql, params);
    // The first statement: the open is sent first and the statement right behind it, neither awaited alone.
    const open = path.control(OPEN);
    const sent = tx.query(sql, params);
    opened = open.then(
      () => true,
      (error: unknown) => {
        openFailure = { error };
        return false;
      },
    );
    const [openAnswer, answer] = await Promise.allSettled([open, sent]);
    if (openAnswer.status === "rejected") throw openAnswer.reason;
    if (answer.status === "rejected") throw answer.reason;
    return answer.value;
  };
  let outcome: { readonly result: T } | { readonly error: unknown };
  try {
    outcome = { result: await body({ height: options.height, query }) };
  } catch (error) {
    outcome = { error };
  } finally {
    settled = true;
  }
  if (opened !== undefined && (await opened)) {
    try {
      await path.control(CLOSE);
    } catch (error) {
      // The backends' paths fail with UmbraErrors only.
      path.broken(error as UmbraError);
      throw error;
    }
  }
  if ("error" in outcome) throw outcome.error;
  return outcome.result;
}
