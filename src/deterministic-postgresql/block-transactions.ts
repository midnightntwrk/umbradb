/**
 * Rows-only block transactions. A module's `on-db-write` changes rows only (`INSERT`, `UPDATE`, `DELETE`); schemas
 * change only in migrations. `TRUNCATE` fires no row trigger, so the rows it removes would silently escape the
 * per-block digests' change capture. This component's `BEFORE TRUNCATE … FOR EACH STATEMENT` trigger refuses it with
 * `truncate-not-allowed`. [DB-14, DT-4; design §4]
 *
 * The database API attaches the trigger to every module table not declared `deterministic: false`
 * (`src/db/truncate-guard.ts`), and each backend reports the refusal as an `UmbraError` with that code
 * (`src/db/errors.ts`). DDL in a block is a module error the system does not check. [Q46, Q75, Q76, Q84]
 *
 * **A block from a migration.** The trigger refuses unless the transaction carries the migration mark: the setting
 * {@link MIGRATION_MARK} equal to the transaction's own id. The migration runner sets it, transaction-local, first in
 * each migration's transaction ({@link MARK_MIGRATION_SQL}). It fails closed: a block, an `on-start-db` setup or any
 * other transaction the runner did not mark is refused. No mark reaches a transaction by accident: a transaction-local
 * setting ends with its transaction, and a mark left on the session (`set_config(…, false)`, or a plain `SET`) names an
 * earlier transaction, so it allows nothing in the next one, even on PGlite's single session or the writer's. Modules
 * are trusted: only one that sets the mark on purpose escapes the trigger. [A73, Q46]
 *
 * The function lives in `core_chain`, the schema the database API creates first. It reads only one setting and the
 * transaction's id, with a fixed `search_path`. A trigger function's `EXECUTE` is checked when the trigger is created,
 * never when it fires (checked on PostgreSQL 18.6, 2026-10-24). [DB-9]
 */

import { quoteIdentifier } from "./column-rules.js";
import { optOut, type TableName } from "./opt-out.js";

/**
 * The SQLSTATE the trigger raises: in class `UM`, which neither the SQL standard (classes `0`–`4`, `A`–`H`) nor
 * PostgreSQL uses, so no other error has it. Both backends turn it into the code `truncate-not-allowed`.
 */
export const TRUNCATE_NOT_ALLOWED_SQLSTATE = "UM014";

/** The setting that marks a migration's transaction: the transaction's own id (`pg_current_xact_id()`), as text. */
export const MIGRATION_MARK = "umbradb.migration";

/**
 * Marks the transaction it runs in as a migration's (`src/db/migrate.ts` runs it first in every migration's
 * transaction): transaction-local (`is_local` true), and naming this transaction only.
 */
export const MARK_MIGRATION_SQL = `SELECT set_config('${MIGRATION_MARK}', pg_current_xact_id()::text, true)`;

/**
 * The condition, true exactly in a transaction that carries its own migration mark, for SQL that must tell a
 * migration's transaction from any other: {@link MIGRATION_MARKED_SQL}, and the change-capture triggers of the digests
 * (`src/db/change-capture.ts`), which record nothing in a migration because a migration's writes are no block's
 * changes. Its functions are `pg_catalog`'s, written qualified, so it means the same under any `search_path`. [DT-4]
 */
export const MIGRATION_MARKED_CONDITION =
  `pg_catalog.current_setting('${MIGRATION_MARK}', true) IS NOT DISTINCT FROM pg_catalog.pg_current_xact_id()::text`;

/**
 * Whether the transaction it runs in still carries its own mark (`marked`): true from {@link MARK_MIGRATION_SQL} to the
 * end of the migration's transaction; false once a `COMMIT` or `ROLLBACK` inside the migration's SQL ended that
 * transaction, since the mark ended with it and what runs next is another transaction, with another id. The migration
 * runner checks it after the migration's SQL, before writing the migration's row (`src/db/migrate.ts`).
 */
export const MIGRATION_MARKED_SQL = `SELECT ${MIGRATION_MARKED_CONDITION} AS marked`;

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
      'TRUNCATE fires no row trigger, so the rows it removes would escape the per-block digests; '
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

/**
 * The statements that make the trigger guard exactly the listed tables that are not opted out: created on each one
 * that lacks it, and dropped from each one that has it but is now declared `deterministic: false` (the guard covers
 * only tables not declared so). A partition counts as opted out when the root of its partition tree is
 * (`./opt-out.ts`). `TRUNCATE` of a partitioned table fires the triggers of its partitions too, but a statement trigger
 * on the partitioned table is not copied to its partitions, so each partition of a guarded tree carries its own.
 * [DB-14]
 */
export function truncateGuardStatements(tables: readonly GuardTableRow[], optedOut: readonly TableName[]): string[] {
  const out = optOut(optedOut);
  const statements: string[] = [];
  for (const row of tables) {
    const root = row.root_table === null ? null : { schema: row.root_schema as string, table: row.root_table };
    const target = `${quoteIdentifier(row.schema)}.${quoteIdentifier(row.table)}`;
    if (out.covers({ schema: row.schema, table: row.table }) || out.covers(root)) {
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
