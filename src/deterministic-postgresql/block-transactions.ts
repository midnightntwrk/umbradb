/**
 * Rows-only block transactions (`openspec/changes/core-arch/design.md` §4, "`TRUNCATE`"; DB-14): a module's
 * `on-db-write` changes rows only — `INSERT`, `UPDATE`, `DELETE` — and schemas change only in migrations. `TRUNCATE`
 * fires no row trigger, so the rows it removed would escape digest capture (DT-4) without an error; this component's
 * `BEFORE TRUNCATE … FOR EACH STATEMENT` trigger refuses it with `truncate-not-allowed`. The database API attaches it
 * to every module table not declared `deterministic: false` (Q75, Q76, Q84; `src/db/truncate-guard.ts`), and each
 * backend reports the refusal as an `UmbraError` with that code (`src/db/errors.ts`). DDL in a block is a module error
 * the system does not check (Q46).
 *
 * **A block from a migration (A73).** The trigger refuses unless the transaction carries the migration mark: the
 * setting {@link MIGRATION_MARK} equal to the transaction's own id, which the migration runner sets first in each
 * migration's transaction ({@link MARK_MIGRATION_SQL}, transaction-local). It fails closed: a block, an `on-start-db`
 * setup or any other transaction the runner did not mark is refused. No mark reaches a transaction by accident — a
 * transaction-local setting ends with its transaction, and a mark left on the session (`set_config(…, false)`, or a
 * plain `SET`) names an earlier transaction, so it allows nothing in the next one, even on PGlite's one session or the
 * writer's. Modules are trusted (Q46): only one that sets the mark on purpose escapes the trigger.
 *
 * The function lives in `core_chain`, the schema the database API creates first (DB-9); it reads only one setting and
 * the transaction's id, with a fixed `search_path`. A trigger function's `EXECUTE` is checked when the trigger is created, never when
 * it fires (checked on PostgreSQL 18.6, 2026-10-24).
 */

import { quoteIdentifier } from "./column-rules.js";

/**
 * The SQLSTATE the trigger raises: in class `UM`, which neither the SQL standard (classes `0`–`4`, `A`–`H`) nor
 * PostgreSQL uses, so no other error has it. Both backends turn it into the code `truncate-not-allowed`.
 */
export const TRUNCATE_NOT_ALLOWED_SQLSTATE = "UM014";

/** The setting that marks a migration's transaction: the transaction's own id (`pg_current_xact_id()`), as text. */
export const MIGRATION_MARK = "umbradb.migration";

/**
 * Marks the transaction it runs in as a migration's (task 2.4 runs it first in every migration's transaction):
 * transaction-local (`is_local` true), and naming this transaction only.
 */
export const MARK_MIGRATION_SQL = `SELECT set_config('${MIGRATION_MARK}', pg_current_xact_id()::text, true)`;

/** The name of the trigger on each guarded table. */
export const TRUNCATE_GUARD_TRIGGER = "umbradb_truncate_not_allowed";

/** The trigger function, `core_chain.truncate_not_allowed()`, created (or replaced) at every startup. */
export const TRUNCATE_GUARD_FUNCTION_SQL = `CREATE OR REPLACE FUNCTION core_chain.truncate_not_allowed()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = pg_catalog, pg_temp
AS $guard$
BEGIN
  IF current_setting('${MIGRATION_MARK}', true) = pg_current_xact_id()::text THEN
    RETURN NULL;
  END IF;
  RAISE EXCEPTION USING
    ERRCODE = '${TRUNCATE_NOT_ALLOWED_SQLSTATE}',
    MESSAGE = format(
      'TRUNCATE of %s.%s is refused outside a migration (truncate-not-allowed): a block changes rows only, and '
      'TRUNCATE fires no row trigger, so the rows it removes would escape the per-block digests (DT-4, DB-14); '
      'delete them with DELETE, or change the table in a migration',
      quote_ident(TG_TABLE_SCHEMA), quote_ident(TG_TABLE_NAME)),
    SCHEMA = TG_TABLE_SCHEMA,
    TABLE = TG_TABLE_NAME;
END
$guard$`;

/**
 * Lists the tables and partitioned tables (with their partitions) of the schemas given as `$1` (`text[]`): each with
 * the root of its partition tree (itself for a partitioned table; none for a table outside one) and whether it has the
 * trigger.
 */
export const TRUNCATE_GUARD_TABLES_SQL = `SELECT n.nspname AS schema, c.relname AS "table",
       rn.nspname AS root_schema, rc.relname AS root_table,
       EXISTS (SELECT 1 FROM pg_trigger t WHERE t.tgrelid = c.oid AND t.tgname = '${TRUNCATE_GUARD_TRIGGER}') AS guarded
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  LEFT JOIN pg_class rc ON rc.oid = pg_partition_root(c.oid)
  LEFT JOIN pg_namespace rn ON rn.oid = rc.relnamespace
 WHERE n.nspname = ANY($1::text[]) AND c.relkind IN ('r', 'p')
 ORDER BY n.nspname, c.relname`;

/** A row of {@link TRUNCATE_GUARD_TABLES_SQL}. */
export interface GuardTableRow {
  readonly schema: string;
  readonly table: string;
  readonly root_schema: string | null;
  readonly root_table: string | null;
  readonly guarded: boolean;
}

/** A table by schema and name. */
export interface TableName {
  readonly schema: string;
  readonly table: string;
}

/**
 * The statements that make the trigger guard exactly the listed tables that are not opted out: created on each one
 * that lacks it, dropped from each one that has it but is now declared `deterministic: false` (DB-14 covers only the
 * tables not declared so). A partition counts as opted out when its partition tree's root is: `TRUNCATE` of a
 * partitioned table fires the triggers of its partitions too, while a statement trigger on the partitioned table is
 * not copied to its partitions, so each partition of a guarded tree carries its own.
 */
export function truncateGuardStatements(tables: readonly GuardTableRow[], optedOut: readonly TableName[]): string[] {
  const out = new Set(optedOut.map(({ schema, table }) => JSON.stringify([schema, table])));
  const statements: string[] = [];
  for (const row of tables) {
    const declared = out.has(JSON.stringify([row.schema, row.table]));
    const rootDeclared = row.root_table !== null && out.has(JSON.stringify([row.root_schema, row.root_table]));
    const target = `${quoteIdentifier(row.schema)}.${quoteIdentifier(row.table)}`;
    if (declared || rootDeclared) {
      if (row.guarded) statements.push(`DROP TRIGGER ${TRUNCATE_GUARD_TRIGGER} ON ${target}`);
    } else if (!row.guarded) {
      statements.push(
        `CREATE TRIGGER ${TRUNCATE_GUARD_TRIGGER} BEFORE TRUNCATE ON ${target} ` +
          "FOR EACH STATEMENT EXECUTE FUNCTION core_chain.truncate_not_allowed()",
      );
    }
  }
  return statements;
}
