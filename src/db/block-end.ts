/**
 * The end of a block inside a transaction that goes on to hold the next block (`../runner/loop.ts`). Core. A block
 * stored alone ends with its transaction's `COMMIT`; {@link endBlock} gives a block that is not its transaction's last
 * what that `COMMIT` would have given it, so that the block fails where it would have failed and the next block starts
 * as in a new transaction.
 *
 * **What it sends.**
 * - {@link STATE}, one statement that reads whether any constraint is deferrable, and what the transaction cannot give
 *   the next block as a new one would. It is sent at every end.
 * - {@link CONSTRAINTS}, one simple-protocol text on the transaction's control path (`./read-view.ts`'s
 *   `controlText`, which never counts as a schema change), sent just before the read and together with it, unless the
 *   transaction's last end read that no constraint is deferrable: nothing can then be pending. If the read of this end
 *   finds one after all (the block made it), the text is sent then, and the read once more. So a database without a
 *   deferrable constraint costs one statement per end after a transaction's first, and any other three.
 *   - `SET CONSTRAINTS ALL IMMEDIATE` checks every pending deferred constraint and fires every pending deferred
 *     constraint trigger now, as the `COMMIT` would. One that fails gives the `COMMIT`'s error (its SQLSTATE, `23503`
 *     for a foreign key) and aborts the transaction, so nothing of it commits;
 *   - `SET CONSTRAINTS ALL DEFERRED` then puts every deferrable constraint in deferred mode, which is the mode a new
 *     transaction gives every constraint declared `INITIALLY DEFERRED`, whatever a callback set with
 *     `SET CONSTRAINTS` meanwhile.
 *
 * **When the transaction must end at this block** ({@link endBlock} resolves false; the caller commits):
 * - a constraint that is `DEFERRABLE INITIALLY IMMEDIATE` exists: `SET CONSTRAINTS ALL DEFERRED` deferred it, and no
 *   statement returns one constraint to its declared mode (the command names constraints, and a name may be shared by
 *   constraints of both modes);
 * - the session has a temporary table or sequence: its `ON COMMIT` action (`DELETE ROWS`, `DROP`) runs only at a
 *   `COMMIT`, and no catalog says which action a temporary table has;
 * - a cursor declared without `WITH HOLD` is open: only the transaction's end closes it.
 * UmbraDB's own SQL makes none of the three, so only a module's schema or statements end a transaction this way.
 *
 * **What it does not restore**, each the transaction's until its `COMMIT`: a setting made for the transaction
 * (`SET LOCAL`, `set_config(…, true)`, `SET TRANSACTION`), transaction-level advisory locks and row locks (other
 * sessions wait for them until the `COMMIT`), `NOTIFY` (delivered at the `COMMIT`, equal notifications once), `now()`
 * and the transaction id. A sequence's value is no part of a transaction: nothing is done to it at either end. A
 * deferrable constraint that a block creates after the transaction's first block takes the mode set here, deferred,
 * until that block's end, whatever its declaration says.
 */

import type { Transaction } from "./api.js";
import { controlText } from "./read-view.js";

/** Checks every pending deferred constraint and fires every pending deferred trigger, then defers them again. */
export const CONSTRAINTS = "SET CONSTRAINTS ALL IMMEDIATE; SET CONSTRAINTS ALL DEFERRED";

/**
 * What the transaction holds at a block's end (see the module comment), in one row: `deferrable` is true when any
 * constraint is deferrable (only then can a check be pending); `ends` is true when a constraint is deferrable and
 * initially immediate, the session has a temporary relation, or a cursor without hold is open. Its one parameter is
 * {@link OWN_CURSOR}, the name of the cursor this statement itself runs in on the extended protocol, which is not
 * counted. With a parameter the PostgreSQL session keeps the statement prepared, so it is planned once.
 */
export const STATE =
  "SELECT c.deferrable, c.immediate " +
  "OR (pg_catalog.pg_my_temp_schema() <> 0 AND EXISTS (SELECT FROM pg_catalog.pg_class WHERE relnamespace = pg_catalog.pg_my_temp_schema())) " +
  "OR EXISTS (SELECT FROM pg_catalog.pg_cursors WHERE NOT is_holdable AND name <> $1) AS ends " +
  "FROM (SELECT coalesce(bool_or(condeferrable), false) AS deferrable, coalesce(bool_or(condeferrable AND NOT condeferred), false) AS immediate " +
  "FROM pg_catalog.pg_constraint) AS c";

/** The empty name: the protocol's unnamed cursor. No `DECLARE` can give a cursor that name. */
export const OWN_CURSOR = "";

/** What {@link STATE} reads. */
interface State {
  readonly deferrable: unknown;
  readonly ends: unknown;
}

/** Whether a constraint was deferrable at each transaction's last end; none before its first. */
const deferrableAtLastEnd = new WeakMap<Transaction, boolean>();

/** The state read alone. */
async function read(tx: Transaction): Promise<State> {
  const rows = await tx.query(STATE, [OWN_CURSOR]);
  return rows[0] as unknown as State;
}

/** The constraints checked and deferred again, and the state read behind them: sent together, neither awaited alone. */
async function checkedAndRead(tx: Transaction): Promise<State> {
  const checked = controlText(tx, CONSTRAINTS);
  const state = read(tx);
  const [check] = await Promise.allSettled([checked, state]);
  // A constraint that failed aborted the transaction, and the read behind it with it: the constraint's error is the block's.
  if (check.status === "rejected") throw check.reason;
  return state;
}

/**
 * Ends a block in the transaction `tx`, which goes on (see the module comment). Resolves true when the next block may
 * be written in `tx`, false when `tx` must commit first. Rejects with the database's error when a deferred constraint
 * or trigger fails: the transaction is then aborted, as by any failed statement. Throws, sending nothing, when `tx`
 * is not a transaction a backend opened or a read view of it is open.
 */
export async function endBlock(tx: Transaction): Promise<boolean> {
  let state: State;
  if (deferrableAtLastEnd.get(tx) === false) {
    // No constraint was deferrable at the block before's end: none is pending unless this block made one.
    state = await read(tx);
    if (state.deferrable === true) state = await checkedAndRead(tx);
  } else {
    state = await checkedAndRead(tx);
  }
  deferrableAtLastEnd.set(tx, state.deferrable === true);
  return state.ends !== true;
}
