/**
 * The read at a block's end: whether a `COMMIT` of the block's transaction would have anything to do but make its
 * writes durable. Core. The finalized loop (`../runner/loop.ts`) writes the next block in the same transaction only
 * when {@link endBlock} found nothing; when it finds something the transaction commits at this block, so whatever the
 * block left for its transaction's end is done by a real `COMMIT`, at its own block. Nothing here does any part of a
 * `COMMIT` itself: no statement inside a transaction does what its end does (`SET CONSTRAINTS ALL IMMEDIATE` makes
 * every constraint immediate before the pending triggers fire, where a `COMMIT` fires them with the constraints still
 * deferred).
 *
 * **What the read looks for** ({@link STATE}, one statement, the same text on PostgreSQL and PGlite):
 * - a deferrable constraint, in any schema (`pg_constraint.condeferrable`): only a deferrable constraint can be checked
 *   at the transaction's end, whether it is declared `INITIALLY DEFERRED` or set so with `SET CONSTRAINTS`;
 * - a constraint trigger that is not PostgreSQL's own (`pg_trigger`, `tgconstraint <> 0` or `tgdeferrable`): only a
 *   constraint trigger can fire at the transaction's end;
 * - a temporary relation of the session (a table, a sequence): its `ON COMMIT` action runs at the transaction's end,
 *   and no catalog says which action a temporary table has;
 * - an open cursor of the session, with or without hold: the transaction's end closes one declared without hold, and
 *   runs the query of one declared `WITH HOLD` to its end to keep its rows.
 * Each is read from the catalogs as the transaction sees them, so one a block made is found at that block's end, and
 * one a block made and removed is not. UmbraDB's own SQL makes none of them: only a module's schema or statements do.
 *
 * **What it does not look for**, each the transaction's until its `COMMIT` and none of them a change of stored data by
 * itself: a setting made for the transaction (`SET LOCAL`, `set_config(…, true)`), transaction-level advisory locks,
 * row and table locks, `NOTIFY` and `LISTEN`, a large object's descriptor, `now()` and the transaction id. A sequence's
 * value is no part of a transaction. Rules and event triggers run with their statement, never at a transaction's end.
 * A module's handle refuses savepoints and `PREPARE TRANSACTION`.
 */

import type { Transaction } from "./api.js";

/**
 * Whether anything exists that a `COMMIT` acts on (see the module comment), as one row with one column, `acts`. Its
 * one parameter is {@link OWN_CURSOR}, the name of the cursor this statement itself runs in on the extended protocol,
 * which is not counted. With a parameter the PostgreSQL session keeps the statement prepared, so it is planned once.
 */
export const STATE =
  "SELECT EXISTS (SELECT FROM pg_catalog.pg_constraint WHERE condeferrable) " +
  "OR EXISTS (SELECT FROM pg_catalog.pg_trigger WHERE NOT tgisinternal AND (tgconstraint <> 0 OR tgdeferrable)) " +
  "OR (pg_catalog.pg_my_temp_schema() <> 0 AND EXISTS (SELECT FROM pg_catalog.pg_class WHERE relnamespace = pg_catalog.pg_my_temp_schema())) " +
  "OR EXISTS (SELECT FROM pg_catalog.pg_cursors WHERE name <> $1) AS acts";

/** The empty name: the protocol's unnamed cursor. No `DECLARE` can give a cursor that name. */
export const OWN_CURSOR = "";

/**
 * Reads, in the transaction `tx`, whether its `COMMIT` would have anything to do but make its writes durable (see the
 * module comment): one statement, which changes nothing. Resolves true when it found nothing, so another block may be
 * written in `tx`; false when `tx` must commit at this block. Rejects with the database's error when the read fails.
 */
export async function endBlock(tx: Transaction): Promise<boolean> {
  const rows = await tx.query(STATE, [OWN_CURSOR]);
  // Anything but a plain "nothing" commits: the cautious answer.
  return (rows[0] as { readonly acts: unknown }).acts === false;
}
