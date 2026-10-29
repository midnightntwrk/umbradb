/**
 * Change capture for the per-block digests. On every module table not declared `deterministic: false`, a row trigger
 * records, on the first touch of a primary key in a transaction, the row as it was (or that there was none). It writes
 * it to a shadow table, `core_digest_shadow.t_<first 32 hex digits of SHA-256(schema.table)>`. At the end of the
 * block `core-digest` reads each touched key's row as it was and as it is ({@link takeChanges}), and the digests are
 * computed from them (`src/determinism/digest.ts`, `src/backbone/core-digest/`). [DT-4, Q76, Q84, Q86; design §4]
 *
 * Every statement that writes a row fires the trigger: a module's own, a helper trigger's, a provider function's, a
 * cascade's. `TRUNCATE`, which fires none, is rejected in blocks, so no change escapes. [DB-14]
 *
 * **The trigger.** `AFTER INSERT OR UPDATE OR DELETE … FOR EACH ROW` (named {@link CAPTURE_TRIGGER}) is set on each
 * module table. On a partitioned table, PostgreSQL clones it onto every partition, those created later included. It
 * calls a function of the table's own, `core_digest_shadow.f_<same digits>()`, written for its columns. The function
 * stores:
 * - the old row of an update or a delete;
 * - for an insert, or an update that changed the key, the new key as absent before.
 *
 * Each is stored only if the key has no row of this transaction in the shadow table yet; a row of another transaction
 * (left by a crash or written outside a block) is replaced. The function is `SECURITY DEFINER`, owned by the writer's
 * login, with `search_path = pg_catalog, pg_temp`, so the module role a callback runs under needs no privilege on the
 * shadow table. Each shadow row carries the transaction's id (`pg_current_xact_id()`), which is how
 * {@link takeChanges} reads only this block's touches.
 *
 * **What is captured.** Writes in a block, and nothing a migration writes. The function returns at once in a
 * transaction carrying the migration mark (the component's `MIGRATION_MARKED_CONDITION`), so a migration's rows are no
 * block's changes, and a migration may change the table's columns before its function is rewritten. A part's
 * `on-start-db` writes are captured into the shadow tables, and {@link finishCapture} empties them when startup ends,
 * before any block, so every shadow table is empty whenever no block is open. The contents hash leaves the shadow
 * schema out, so the layout of the shadow tables may change in a release without changing the hash. [DT-3, Q101]
 *
 * **When.** The shadow schema belongs to `core-digest` (its migrations create it); until it exists nothing is
 * captured. [Q95]
 *
 * After each part's migrations and the determinism check, before its `on-start-db`, {@link captureTables} makes the
 * capture of the part's tables match the tables as they are now:
 * - a table a migration added gets it;
 * - a table whose columns changed gets its shadow table and function written again (each shadow table's comment holds
 *   a fingerprint of the definitions);
 * - a table declared `deterministic: false` loses its trigger.
 *
 * Then {@link finishCapture} drops the shadow tables and functions no table uses any more. The tables are those of the
 * `TRUNCATE` guard: every table of the plan's schemas, a partition with its partitioned table
 * (`TRUNCATE_GUARD_TABLES_SQL`), with the opt-out decided by the component's `optOut`. [DT-6]
 */

import { createHash } from "node:crypto";
import {
  type ColumnType,
  type ConsistentRead,
  compareUtf8,
  type GuardTableRow,
  keyOrderTerm,
  MIGRATION_MARKED_CONDITION,
  optOut,
  quoteIdentifier,
  TRUNCATE_GUARD_TABLES_SQL,
} from "../deterministic-postgresql/index.js";
import type { TouchedRow } from "../determinism/digest.js";
import type { Transaction } from "./api.js";
import type { SchemaPlan } from "./roles.js";

/** The schema of the shadow tables and the capture functions, created by `core-digest`'s migrations. */
export const SHADOW_SCHEMA = "core_digest_shadow";

/** The name of the capture trigger on each module table. */
export const CAPTURE_TRIGGER = "umbradb_capture_changes";

/**
 * The first 32 hex digits of SHA-256 of `schema.table` (schema names hold no dot): what names a table's shadow.
 * [DB-8]
 */
export function shadowDigits(schema: string, table: string): string {
  return createHash("sha256").update(`${schema}.${table}`, "utf8").digest("hex").slice(0, 32);
}

/** The shadow table of `schema.table`, unquoted: `t_<digits>`. */
export function shadowTableName(schema: string, table: string): string {
  return `t_${shadowDigits(schema, table)}`;
}

/** The capture function of `schema.table`, unquoted: `f_<digits>`. */
export function captureFunctionName(schema: string, table: string): string {
  return `f_${shadowDigits(schema, table)}`;
}

/**
 * A column of a captured table: its name, its type in the canonical row encoding, and how its copy in the shadow table
 * is declared. [DT-1]
 */
export interface CaptureColumn {
  readonly name: string;
  /** `format_type(atttypid, NULL)`: the type the row encoding takes (`bigint`, `text[]`, …). */
  readonly type: ColumnType;
  /** `format_type(atttypid, atttypmod)`, with the column's collation when it is not its type's. */
  readonly definition: string;
}

/** A module table as change capture and `core-digest` read it. */
export interface CapturedTable {
  readonly schema: string;
  readonly name: string;
  /** A partitioned table, read whole; an ordinary table is read with `ONLY`. */
  readonly partitioned: boolean;
  /** In column order; the shadow table names them `c0`, `c1`, … in this order. */
  readonly columns: readonly CaptureColumn[];
  /** The primary key: indexes into {@link columns}, in the key's declared order. */
  readonly key: readonly number[];
}

/** True when `core-digest`'s migrations have created the shadow schema, so that changes can be captured. */
export async function captureReady(tx: ConsistentRead): Promise<boolean> {
  const [row] = await tx.query(`SELECT pg_catalog.to_regnamespace('${SHADOW_SCHEMA}') IS NOT NULL AS ready`);
  return row?.ready === true;
}

/**
 * Makes the capture of the tables of `schemas` match them (see the module comment): creates or rewrites each table's
 * shadow table, function and trigger where they are missing, disabled or written for other columns, and drops the
 * trigger of each table declared `deterministic: false`. Run by the writer's login, after the determinism check of the
 * same tables (so a table reaching it has a primary key). A no-op for a table whose capture is current. [DT-6]
 */
export async function captureTables(tx: Transaction, plan: SchemaPlan, schemas: readonly string[]): Promise<void> {
  if (schemas.length === 0) return;
  const out = optOut(plan.optedOut);
  const tables = await describeTables(tx, schemas);
  const state = await captureState(tx, schemas);
  for (const table of tables) {
    const target = `${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
    const key = JSON.stringify([table.schema, table.name]);
    const trigger = state.triggers.get(key);
    if (out.covers({ schema: table.schema, table: table.name })) {
      if (trigger !== undefined) await tx.execute(`DROP TRIGGER ${CAPTURE_TRIGGER} ON ${target}`);
      continue;
    }
    const definitions = captureDefinitions(table);
    const shadow = shadowTableName(table.schema, table.name);
    const current =
      trigger?.function === captureFunctionName(table.schema, table.name) &&
      trigger.enabled &&
      state.fingerprints.get(shadow) === definitions.fingerprint;
    if (current) continue;
    if (trigger !== undefined) await tx.execute(`DROP TRIGGER ${CAPTURE_TRIGGER} ON ${target}`);
    for (const statement of definitions.statements) await tx.execute(statement);
  }
}

/**
 * At the end of startup, before any block: drops the shadow tables and functions no module table of the plan uses any
 * more (a table dropped or renamed, or declared `deterministic: false`), and empties the others: the rows a part's
 * `on-start-db` wrote are no block's changes, and the shadow tables are empty whenever no block is open. A no-op before
 * `core-digest`'s migrations created the shadow schema. [design §4]
 */
export async function finishCapture(tx: Transaction, plan: SchemaPlan): Promise<void> {
  if (!(await captureReady(tx))) return;
  const out = optOut(plan.optedOut);
  const kept = new Set<string>();
  for (const table of await describeTables(tx, plan.schemas.map((schema) => schema.name))) {
    if (!out.covers({ schema: table.schema, table: table.name })) kept.add(shadowDigits(table.schema, table.name));
  }
  const objects = await tx.query(SHADOW_OBJECTS_SQL);
  for (const row of objects) {
    const name = row.name as string;
    const digits = name.slice(2);
    if (row.kind === "function" && !kept.has(digits)) {
      await tx.execute(`DROP FUNCTION ${SHADOW_SCHEMA}.${quoteIdentifier(name)}()`);
    }
  }
  for (const row of objects) {
    const name = row.name as string;
    if (row.kind !== "table") continue;
    const shadow = `${SHADOW_SCHEMA}.${quoteIdentifier(name)}`;
    if (kept.has(name.slice(2))) await tx.execute(`DELETE FROM ${shadow}`);
    else await tx.execute(`DROP TABLE ${shadow}`);
  }
}

/**
 * The module tables whose changes are captured (those carrying the capture trigger, which startup attached), with their
 * columns and key: what `core-digest` digests at each height. They are in the contents hash's order: by schema, then
 * name, as bytes. [DT-3]
 */
export async function capturedTables(read: ConsistentRead): Promise<CapturedTable[]> {
  const rows = await read.query(CAPTURED_SQL);
  const schemas = [...new Set(rows.map((row) => row.schema as string))];
  const tables = schemas.length === 0 ? [] : await describeTables(read, schemas);
  const captured = new Set(rows.map((row) => JSON.stringify([row.schema, row.table])));
  return tables
    .filter((table) => captured.has(JSON.stringify([table.schema, table.name])))
    .sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
}

/**
 * The keys of `table` this transaction touched, in primary-key order. Each comes with its row as it was before the
 * transaction first touched it and as it is now (null where there is no row), as canonical row-encoding values. The
 * table's shadow rows are deleted, this transaction's and any other's. `core-digest` calls it last in the block.
 * [DT-1, DT-2, DT-4, DT-5]
 */
export async function takeChanges(read: ConsistentRead, table: CapturedTable): Promise<TouchedRow[]> {
  const shadow = `${SHADOW_SCHEMA}.${quoteIdentifier(shadowTableName(table.schema, table.name))}`;
  const target = `${table.partitioned ? "" : "ONLY "}${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
  const old = table.columns.map((_, i) => `d.c${i} AS o${i}`);
  const now = table.columns.map((column, i) => `t.${quoteIdentifier(column.name)} AS n${i}`);
  const first = table.columns[table.key[0] as number] as CaptureColumn;
  const join = table.key.map((i) => `t.${quoteIdentifier((table.columns[i] as CaptureColumn).name)} = d.c${i}`);
  const order = table.key.map((i) => keyOrderTerm(`o${i}`, (table.columns[i] as CaptureColumn).type));
  const rows = await read.query(
    `WITH d AS (DELETE FROM ${shadow} RETURNING *)
SELECT * FROM (
  SELECT d.existed AS e, t.${quoteIdentifier(first.name)} IS NOT NULL AS p, ${[...old, ...now].join(", ")}
    FROM d LEFT JOIN ${target} AS t ON ${join.join(" AND ")}
   WHERE d.xact = pg_catalog.pg_current_xact_id()::text::bigint
) AS x
ORDER BY ${order.join(", ")}`,
  );
  return rows.map((row) => ({
    before: row.e === true ? table.columns.map((_, i) => row[`o${i}`]) : null,
    after: row.p === true ? table.columns.map((_, i) => row[`n${i}`]) : null,
  }));
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The columns of the tables (not the partitions) of the schemas `$1`, in column order: name, type in the canonical row
 * encoding, declared type with the collation when it is not the type's own, and the position in the primary key. [DT-1]
 */
const COLUMNS_SQL = `SELECT n.nspname::text AS schema, c.relname::text AS "table", c.relkind = 'p' AS partitioned,
       a.attnum::integer AS number, a.attname::text AS name, pg_catalog.format_type(a.atttypid, NULL) AS type,
       pg_catalog.format_type(a.atttypid, a.atttypmod)
         || CASE WHEN a.attcollation <> 0 AND a.attcollation <> t.typcollation
                 THEN ' COLLATE ' || pg_catalog.quote_ident(cn.nspname::text) || '.'
                      || pg_catalog.quote_ident(co.collname::text)
                 ELSE '' END AS definition,
       (SELECT k.position::integer FROM unnest(i.indkey::smallint[]) WITH ORDINALITY AS k(attnum, position)
         WHERE k.attnum = a.attnum) AS key_position
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped AND a.attnum >= 1
  JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
  LEFT JOIN pg_catalog.pg_collation co ON co.oid = a.attcollation
  LEFT JOIN pg_catalog.pg_namespace cn ON cn.oid = co.collnamespace
  LEFT JOIN pg_catalog.pg_index i ON i.indrelid = c.oid AND i.indisprimary
 WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND n.nspname = ANY($1::text[])`;

/** The capture triggers of the tables of the schemas `$1` (not the clones on partitions): function, enabled. */
const TRIGGERS_SQL = `SELECT n.nspname::text AS schema, c.relname::text AS "table", p.proname::text AS function,
       g.tgenabled <> 'D' AS enabled
  FROM pg_catalog.pg_trigger g
  JOIN pg_catalog.pg_class c ON c.oid = g.tgrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_catalog.pg_proc p ON p.oid = g.tgfoid
 WHERE g.tgname = '${CAPTURE_TRIGGER}' AND g.tgparentid = 0 AND n.nspname = ANY($1::text[])`;

/** The shadow tables and capture functions, with each shadow table's fingerprint comment. */
const SHADOW_OBJECTS_SQL = `SELECT 'table' AS kind, c.relname::text AS name,
       pg_catalog.obj_description(c.oid, 'pg_class') AS fingerprint
  FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = '${SHADOW_SCHEMA}' AND c.relkind = 'r'
UNION ALL
SELECT 'function', p.proname::text, NULL
  FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = '${SHADOW_SCHEMA}'
 ORDER BY 1, 2`;

/** Every module table carrying the capture trigger (not the clones on partitions). */
const CAPTURED_SQL = `SELECT n.nspname::text AS schema, c.relname::text AS "table"
  FROM pg_catalog.pg_trigger g
  JOIN pg_catalog.pg_class c ON c.oid = g.tgrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
 WHERE g.tgname = '${CAPTURE_TRIGGER}' AND g.tgparentid = 0`;

/** What the catalog holds of the capture of some tables. */
interface CaptureState {
  /** Each table's capture trigger, by `[schema, table]` as JSON. */
  readonly triggers: ReadonlyMap<string, { readonly function: string; readonly enabled: boolean }>;
  /** Each shadow table's fingerprint comment, by its name. */
  readonly fingerprints: ReadonlyMap<string, string | null>;
}

async function captureState(tx: ConsistentRead, schemas: readonly string[]): Promise<CaptureState> {
  const triggers = new Map<string, { function: string; enabled: boolean }>();
  for (const row of await tx.query(TRIGGERS_SQL, [schemas])) {
    triggers.set(JSON.stringify([row.schema, row.table]), {
      function: row.function as string,
      enabled: row.enabled === true,
    });
  }
  const fingerprints = new Map<string, string | null>();
  for (const row of await tx.query(SHADOW_OBJECTS_SQL)) {
    if (row.kind === "table") fingerprints.set(row.name as string, row.fingerprint as string | null);
  }
  return { triggers, fingerprints };
}

/**
 * The tables (not the partitions) of `schemas` with their columns and keys: the tables the `TRUNCATE` guard lists, with
 * partitions left to their partitioned table, sorted by name in the contents hash's order. [DT-3]
 */
async function describeTables(read: ConsistentRead, schemas: readonly string[]): Promise<CapturedTable[]> {
  const listed = (await read.query(TRUNCATE_GUARD_TABLES_SQL, [schemas])) as unknown as GuardTableRow[];
  const roots = listed.filter(
    (row) => row.root_table === null || (row.root_schema === row.schema && row.root_table === row.table),
  );
  const columns = new Map<string, { number: number; column: CaptureColumn; key: number | null }[]>();
  const partitioned = new Map<string, boolean>();
  for (const row of await read.query(COLUMNS_SQL, [schemas])) {
    const id = JSON.stringify([row.schema, row.table]);
    partitioned.set(id, row.partitioned === true);
    const list = columns.get(id) ?? [];
    list.push({
      number: row.number as number,
      column: { name: row.name as string, type: row.type as ColumnType, definition: row.definition as string },
      key: row.key_position as number | null,
    });
    columns.set(id, list);
  }
  return roots
    .map((row): CapturedTable => {
      const id = JSON.stringify([row.schema, row.table]);
      const ordered = [...(columns.get(id) ?? [])].sort((a, b) => a.number - b.number);
      const key = ordered
        .map((entry, index) => ({ index, position: entry.key }))
        .filter((entry): entry is { index: number; position: number } => entry.position !== null)
        .sort((a, b) => a.position - b.position)
        .map((entry) => entry.index);
      return {
        schema: row.schema,
        name: row.table,
        partitioned: partitioned.get(id) === true,
        columns: ordered.map((entry) => entry.column),
        key,
      };
    })
    .sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
}

/** The statements that create a table's capture, and the fingerprint its shadow table's comment holds. */
function captureDefinitions(table: CapturedTable): { readonly statements: string[]; readonly fingerprint: string } {
  if (table.key.length === 0) {
    throw new Error(`change capture: ${table.schema}.${table.name} has no primary key (the determinism check runs first)`);
  }
  const shadow = `${SHADOW_SCHEMA}.${quoteIdentifier(shadowTableName(table.schema, table.name))}`;
  const fn = `${SHADOW_SCHEMA}.${quoteIdentifier(captureFunctionName(table.schema, table.name))}`;
  const target = `${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
  const isKey = (i: number): boolean => table.key.includes(i);
  const all = table.columns.map((_, i) => `c${i}`);
  const keys = table.key.map((i) => `c${i}`).join(", ");
  const rest = all.filter((_, i) => !isKey(i));
  const field = (record: "OLD" | "NEW", i: number): string =>
    `${record}.${quoteIdentifier((table.columns[i] as CaptureColumn).name)}`;
  const keyOf = (record: "OLD" | "NEW"): string => `ROW(${table.key.map((i) => field(record, i)).join(", ")})`;

  const create = [
    `CREATE TABLE ${shadow} (`,
    "  xact bigint NOT NULL,",
    "  existed boolean NOT NULL,",
    ...table.columns.map((column, i) => `  c${i} ${column.definition}${isKey(i) ? " NOT NULL" : ""},`),
    `  PRIMARY KEY (${keys})`,
    ")",
  ].join("\n");
  const firstTouch = (set: readonly string[]): string =>
    `ON CONFLICT (${keys}) DO UPDATE SET ${set.join(", ")}\n      WHERE s.xact <> EXCLUDED.xact`;
  const body = [
    "DECLARE",
    "  tx bigint := pg_catalog.pg_current_xact_id()::text::bigint;",
    "BEGIN",
    `  IF ${MIGRATION_MARKED_CONDITION} THEN`,
    "    RETURN NULL;",
    "  END IF;",
    "  IF TG_OP <> 'INSERT' THEN",
    `    INSERT INTO ${shadow} AS s (xact, existed, ${all.join(", ")})`,
    `      VALUES (tx, true, ${table.columns.map((_, i) => field("OLD", i)).join(", ")})`,
    `      ${firstTouch(["xact = EXCLUDED.xact", "existed = true", ...rest.map((c) => `${c} = EXCLUDED.${c}`)])};`,
    "  END IF;",
    `  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND ${keyOf("NEW")} IS DISTINCT FROM ${keyOf("OLD")}) THEN`,
    `    INSERT INTO ${shadow} AS s (xact, existed, ${keys})`,
    `      VALUES (tx, false, ${table.key.map((i) => field("NEW", i)).join(", ")})`,
    `      ${firstTouch(["xact = EXCLUDED.xact", "existed = false", ...rest.map((c) => `${c} = NULL`)])};`,
    "  END IF;",
    "  RETURN NULL;",
    "END",
  ].join("\n");
  const fnSql = [
    `CREATE OR REPLACE FUNCTION ${fn}() RETURNS trigger`,
    "  LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp",
    `AS $capture$\n${body}\n$capture$`,
  ].join("\n");
  const trigger =
    `CREATE TRIGGER ${CAPTURE_TRIGGER} AFTER INSERT OR UPDATE OR DELETE ON ${target} ` +
    `FOR EACH ROW EXECUTE FUNCTION ${fn}()`;
  const fingerprint = createHash("sha256").update([create, fnSql, trigger].join("\n"), "utf8").digest("hex").slice(0, 32);
  return {
    fingerprint,
    statements: [
      `DROP TABLE IF EXISTS ${shadow}`,
      create,
      `COMMENT ON TABLE ${shadow} IS '${fingerprint}'`,
      fnSql,
      trigger,
    ],
  };
}
