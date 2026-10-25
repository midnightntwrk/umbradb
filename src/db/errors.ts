/**
 * The database API's errors (`openspec/changes/core-arch/design.md` §4, §12): `UmbraError`, `ERROR_CODES`, `ErrorCode`
 * and `ErrorDetails`, defined in the `deterministic_postgresql` component (`../deterministic-postgresql/errors.ts`,
 * whose result mapping throws them; decision record Q79) and re-exported here unchanged, and the errors both backends
 * give alike.
 */

import { TRUNCATE_NOT_ALLOWED_SQLSTATE, UmbraError } from "../deterministic-postgresql/index.js";

export { ERROR_CODES, type ErrorCode, type ErrorDetails, UmbraError } from "../deterministic-postgresql/index.js";

/**
 * `handle-closed`: a read handle or transaction used after it ended, or a database used after it was closed — the
 * same error, with the same message, from both backends (DB-1).
 */
export function handleClosed(handle: "read" | "transaction" | "database"): UmbraError {
  const what = {
    read: "a read handle was used after its read ended",
    transaction: "a transaction was used after it ended",
    database: "the database was used after it was closed",
  }[handle];
  return new UmbraError("handle-closed", what, { handle });
}

/**
 * `handle-closed` for a write handle used after its callback returned or threw (DB-3, A10; `./write-handles.ts`): the
 * same code as {@link handleClosed}, naming the handle, the part whose callback it was given to and the point. The
 * runner treats it as that part's callback error (RN-8).
 */
export function writeHandleClosed(handle: "block-write" | "schema-write", part: string): UmbraError {
  const [kind, point] = handle === "block-write" ? ["block", "on-db-write"] : ["schema", "on-start-db"];
  return new UmbraError(
    "handle-closed",
    `a ${kind} write handle of ${part} was used after its ${point} callback ended: a write handle is valid only while ` +
      "its callback runs (DB-3); use the handle each callback is given, and keep none",
    { handle, module: part, point },
  );
}

/** The read timeout that ended a bounded read (DB-15). */
export type ReadTimeoutSetting = "statement_timeout" | "idle_in_transaction_session_timeout";

/**
 * `query-timeout` (DB-15): a read bounded by the read option (`ReadOptions.timeoutMs`, a module API request's
 * `apiReadTimeoutMs`) that `setting` ended — a statement ran for `timeoutMs` (`statement_timeout`), or the read stayed
 * idle in its transaction that long (`idle_in_transaction_session_timeout`). Not retryable: the same read would run as
 * long again.
 */
export function queryTimeout(timeoutMs: number, setting: ReadTimeoutSetting, cause?: unknown): UmbraError {
  const what = setting === "statement_timeout" ? "a statement ran" : "the read stayed idle in its transaction";
  return new UmbraError(
    "query-timeout",
    `the read was ended by its timeout: ${what} for ${timeoutMs} ms (${setting})`,
    { timeoutMs, setting },
    cause === undefined ? undefined : { cause },
  );
}

/**
 * A `COMMIT` that PostgreSQL answered with `ROLLBACK`, because a failed statement aborted the transaction and the body
 * caught its error: never reported as a commit, on either backend.
 */
export function commitRolledBack(): UmbraError {
  return new UmbraError(
    "database-error",
    "the transaction was rolled back, not committed: a statement in it failed, and its error was caught",
    { reason: "commit-rolled-back" },
  );
}

/**
 * A statement the server refused, as both backends report it (DB-13): `truncate-not-allowed` when the
 * `deterministic_postgresql` component's `TRUNCATE` trigger raised it (DB-14, its SQLSTATE in `details.sqlstate`),
 * `database-error` otherwise. Neither is retryable.
 */
export function statementRefused(message: string, details: Record<string, unknown>, cause: unknown): UmbraError {
  const code = details.sqlstate === TRUNCATE_NOT_ALLOWED_SQLSTATE ? "truncate-not-allowed" : "database-error";
  return new UmbraError(code, message, details, { cause });
}
