/**
 * The height-versioned-table helper (`openspec/changes/core-arch/specs/storage-helpers/spec.md` SH-2, SH-3;
 * `design.md` §1, §10, §12; CORE-ARCH §4.11a; owner decisions Q27, Q30), refactored from 0.9.5's TemporalKV
 * (`src/postgres/temporal-kv.ts`), with block heights where TemporalKV had wall-clock times: a key's value as of any
 * height — for example a token's metadata as of block h.
 *
 * **A library, not a module (Q30),** in the cursor table's shape (`./cursor-table.ts`): {@link heightVersionedTable}
 * names a table in the calling module's own schema and gives its migration, which the module puts in its own
 * `migrations` list, and the functions that read and write it through the handles its callbacks are given: `write` and
 * `delete` through the block write handle of its `on-db-write`, so they run inside the block's one transaction, under
 * the module's role (DB-3, DB-6, RN-4); `read` through any handle's `query`. It registers nothing, takes no point, and
 * opens no connection or transaction of its own: this file imports types only. The tables are the module's, so
 * stopping, digests (change capture, DT-4), backups and dropping treat them as any other table of the module; other
 * modules may read them, and the role refuses their writes. Writing only from `on-db-write` is the module's obligation
 * (Q46); the block it passes is the one that callback was given.
 *
 * **Two tables and a trigger (SH-2).** The current table `<table> (key text PRIMARY KEY, value jsonb NOT NULL,
 * from_height bigint NOT NULL)` holds each key's current version, which covers the heights from `from_height` on (its
 * `to` is null); the history table `<table>_history (key, from_height, to_height, value)`, keyed by `(key,
 * from_height)`, holds the closed versions, each covering the half-open range `[from_height, to_height)` (a `CHECK`
 * keeps it non-empty). The trigger `versions`, `BEFORE INSERT OR UPDATE OR DELETE … FOR EACH ROW` on the current table,
 * fills the history: writing key k at height h closes its current version at h (the trigger copies it into the history
 * with `to_height` = h) and makes the new value current from h; deleting k at h closes it at h without a new one;
 * writing the value k already has adds no version (jsonb equality, so `{"a":1,"b":2}` and `{"b":2,"a":1}` are one
 * value; the trigger skips the row, so nothing changes and no change is captured). Reading k at h returns the version
 * with `from_height ≤ h < to_height`, or nothing if k did not exist at h. The trigger runs under the module's role (it
 * is the role's, `SECURITY INVOKER`), beside change capture's `umbradb_capture_changes`, which fires on both tables as
 * on any module table. A `DELETE` cannot hand a trigger a value, so `delete` is one statement that first sets the
 * transaction-local setting `umbradb.delete_height` to h (as the migration runner's mark is a transaction-local
 * setting, design §4) for the trigger to read; the setting ends with the block's transaction.
 *
 * **One change of a key per block (SH-3).** The trigger refuses a write or delete of a key that already changed at this
 * height — whose current version starts at h, or whose last closed version ends at h (it was deleted at h) — with
 * SQLSTATE `23505` (`unique_violation`: a key changes at most once per height) and a message naming the table, the key
 * and the height. It fails the statement, so the write rejects with the database API's `database-error` (`details:
 * { sqlstate: "23505", schema, table }`), a callback error that halts with `callback-error` (RN-8); and since the
 * failed statement aborted the block's transaction, the block cannot commit even if the module catches the error (the
 * block's next statement fails with `25P02`, and a `COMMIT` would be answered with `ROLLBACK`). Writes that change
 * nothing — a write of the value the key has, a delete of a key with no current version — are neither refused nor
 * counted (task 6.2's question Q110). The cursor table does not share the rule (SH-1: the last write wins).
 *
 * **Misuse the trigger refuses,** so that the tables always hold SH-2's versions: a height below a version the key
 * already has (a block other than the one being written: SQLSTATE `23P01`, `exclusion_violation`, the code 0.9.5's
 * exclusion constraint `kv_history_no_overlap` gave overlapping versions), and two writes no helper makes (SQLSTATE
 * `0A000`, `feature_not_supported`): a `DELETE` without the height (not through `delete`), and an `UPDATE` changing a
 * key.
 *
 * **Deterministic (DT-1, DT-2, DT-6),** as the cursor table: `text` keys (unique by bytes; DT-2's byte order is the
 * `deterministic_postgresql` component's to apply, so the tables name no collation, A138), `jsonb` values under Q57's
 * `CHECK` (`umbradb_integers_value`, added by the module rules to both tables: a fraction or an integer beyond 64 bits
 * fails the block, `23514`), `bigint` heights; no time, no sequence, no default. 0.9.5's `ns`/`scope` (one key here: a
 * module wanting more uses several tables or composite keys), `version` counter, `updated_at`/`valid_from`/`valid_to`
 * times, `updated_xact` (a transaction id, no function of the chain), `bigserial` id, `tstzrange` column and its gist
 * exclusion constraint (which needed the `btree_gist` extension) are gone; its `fillfactor = 90` on the current table
 * (updated in place on every change, 0.9.5's `005_kv_current_fillfactor.ts`) and its rule never to index the current
 * table's `value` stay.
 *
 * **Values,** as the cursor table's: any JSON value, sent as JSON text by the database API's parameter mapping
 * (`invalid-parameter`, nothing sent, for what JSON cannot hold) and read back by its lossless reader (an integer
 * beyond ±(2^53 − 1) as an exact `bigint`); JSON `null` is a value, never SQL NULL; only a key with no version at the
 * height read reads as `undefined`.
 *
 * **The migration's SQL is fixed:** it is in each module's migration checksum (DB-9), so `test/helpers/
 * height-versioned.test.ts` pins its bytes; a change to the tables or the trigger is a later migration of the module.
 */

import type { BlockWriteHandle, ReadHandle } from "../db/api.js";
import type { BlockContext, Migration } from "../modules/declaration.js";
import type { CursorValue } from "./cursor-table.js";

/** A JSON value a version holds (DT-1: numbers must be integers within the signed 64-bit range); the cursor table's. */
export type VersionedValue = CursorValue;

/** Where the tables are: the calling module's schema (the module's id with `-` → `_`, DB-8) and the current table. */
export interface HeightVersionedTableOptions {
  readonly schema: string;
  readonly table: string;
}

/** A height-versioned table of one module (see the module comment). */
export interface HeightVersionedTable {
  readonly schema: string;
  /** The current table. */
  readonly table: string;
  /** The history table, `<table>_history`. */
  readonly historyTable: string;
  /** The migration that creates both tables and the trigger, with the id the module gives it. */
  migration(id: string): Migration;
  /**
   * The value of `key` as of `height` — the version with `from_height ≤ height < to_height` — or, without a height,
   * its current value; `undefined` if it had none. Through a read handle, as the height it reads knows it (a height
   * above that one reads its current version); through the block write handle, with the block's own writes, which are
   * at the block's height.
   */
  read(handle: Pick<ReadHandle, "query">, key: string, height?: bigint): Promise<VersionedValue | undefined>;
  /**
   * Writes `key` = `value` at `block.height`, through the block write handle of the module's `on-db-write` (inside the
   * block's transaction, under the module's role): its current version closes there and the value is current from
   * there; the value it has already adds no version. Rejects with the database API's errors: `database-error` with
   * SQLSTATE `23505` when the key already changed in this block (SH-3), `23514` for a number that is not a 64-bit
   * integer, `23P01` for a height below the key's versions, `42501` for another module's table; `invalid-parameter`
   * for a value JSON cannot hold (nothing sent); `handle-closed` after the callback ended.
   */
  write(
    handle: BlockWriteHandle,
    block: Pick<BlockContext, "height">,
    key: string,
    value: VersionedValue,
  ): Promise<void>;
  /**
   * Deletes `key` at `block.height`, through the block write handle of `on-db-write`: its current version closes there,
   * with no new one; a key with no current version is left as it is. Rejects as {@link write} does.
   */
  delete(handle: BlockWriteHandle, block: Pick<BlockContext, "height">, key: string): Promise<void>;
}

/** A schema or table name the helper accepts: a lowercase identifier (quoted in its SQL, so a reserved word is one). */
const NAME = /^[a-z_][a-z0-9_]*$/;

/** PostgreSQL's longest identifier, in bytes (`NAMEDATALEN` − 1); the names are ASCII, so bytes are characters. */
const SCHEMA_MAX_BYTES = 63;

/** The longest table name, so that `<table>_versions` (the trigger's function) and `<table>_history` fit 63 bytes. */
const TABLE_MAX_BYTES = 54;

function checkName(what: "schema" | "table", name: unknown, maxBytes: number): string {
  if (typeof name !== "string" || !NAME.test(name) || name.length > maxBytes) {
    throw new TypeError(
      `heightVersionedTable: the ${what} ${JSON.stringify(name)} is not a lowercase identifier ([a-z_][a-z0-9_]*) of ` +
        `at most ${maxBytes} bytes`,
    );
  }
  return name;
}

/** The migration's SQL for the current table `"<schema>"."<table>"` (see the module comment); its text is fixed. */
function migrationSql(schema: string, table: string): string {
  const current = `"${schema}"."${table}"`;
  const history = `"${schema}"."${table}_history"`;
  const fill = `"${schema}"."${table}_versions"`;
  return `CREATE TABLE ${current} (key text PRIMARY KEY, value jsonb NOT NULL, from_height bigint NOT NULL)
  WITH (fillfactor = 90);
CREATE TABLE ${history} (key text NOT NULL, from_height bigint NOT NULL, to_height bigint NOT NULL,
  value jsonb NOT NULL, PRIMARY KEY (key, from_height), CHECK (from_height < to_height));
CREATE FUNCTION ${fill}() RETURNS trigger LANGUAGE plpgsql AS $versions$
DECLARE
  k text;
  height bigint;
  reached bigint;
BEGIN
  IF TG_OP = 'INSERT' THEN
    k := NEW.key;
    -- An upsert of a key with a current version is its UPDATE's to decide.
    IF EXISTS (SELECT FROM ${current} WHERE key = k) THEN
      RETURN NEW;
    END IF;
    height := NEW.from_height;
    SELECT to_height INTO reached FROM ${history} WHERE key = k ORDER BY from_height DESC LIMIT 1;
  ELSIF TG_OP = 'UPDATE' THEN
    k := OLD.key;
    IF NEW.key IS DISTINCT FROM k THEN
      RAISE EXCEPTION USING ERRCODE = 'feature_not_supported', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,
        MESSAGE = format('%I.%I: the key %L cannot change to %L; delete it, and write the new key',
          TG_TABLE_SCHEMA, TG_TABLE_NAME, k, NEW.key);
    END IF;
    -- The value the key has already: no version (SH-2), and the row is left as it is.
    IF NEW.value = OLD.value THEN
      RETURN NULL;
    END IF;
    height := NEW.from_height;
    reached := OLD.from_height;
  ELSE
    k := OLD.key;
    height := nullif(pg_catalog.current_setting('umbradb.delete_height', true), '')::bigint;
    IF height IS NULL THEN
      RAISE EXCEPTION USING ERRCODE = 'feature_not_supported', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,
        MESSAGE = format('%I.%I: the key %L is deleted only through the helper''s delete, which gives the height',
          TG_TABLE_SCHEMA, TG_TABLE_NAME, k);
    END IF;
    reached := OLD.from_height;
  END IF;
  IF height = reached THEN
    RAISE EXCEPTION USING ERRCODE = 'unique_violation', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,
      MESSAGE = format('%I.%I: the key %L changed already at height %s, in this block; a height-versioned table '
        'takes one change of a key per block (SH-3)', TG_TABLE_SCHEMA, TG_TABLE_NAME, k, height);
  ELSIF height < reached THEN
    RAISE EXCEPTION USING ERRCODE = 'exclusion_violation', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,
      MESSAGE = format('%I.%I: the key %L cannot change at height %s: its versions reach height %s, and heights '
        'only go up', TG_TABLE_SCHEMA, TG_TABLE_NAME, k, height, reached);
  END IF;
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  INSERT INTO ${history} (key, from_height, to_height, value) VALUES (k, OLD.from_height, height, OLD.value);
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END
$versions$;
CREATE TRIGGER versions BEFORE INSERT OR UPDATE OR DELETE ON ${current}
  FOR EACH ROW EXECUTE FUNCTION ${fill}();`;
}

/**
 * The height-versioned table `options.table` (with its history table `<table>_history`) in the calling module's schema
 * `options.schema` (SH-2, SH-3; see the module comment). Throws a `TypeError` for a schema that is not a lowercase
 * identifier of at most 63 bytes, or a table of at most 54.
 */
export function heightVersionedTable(options: HeightVersionedTableOptions): HeightVersionedTable {
  const schema = checkName("schema", options.schema, SCHEMA_MAX_BYTES);
  const table = checkName("table", options.table, TABLE_MAX_BYTES);
  const historyTable = `${table}_history`;
  const current = `"${schema}"."${table}"`;
  const history = `"${schema}"."${historyTable}"`;
  const createSql = migrationSql(schema, table);
  const readSql = `SELECT value FROM ${current} WHERE key = $1`;
  // The current version if it started by then; else the last closed version that started by then, if it had not
  // ended. At most one row: a key's versions never overlap (the trigger), and the current one starts where the last
  // closed one ended or later.
  const readAtSql =
    `SELECT value FROM ${current} WHERE key = $1 AND from_height <= $2 UNION ALL ` +
    `SELECT value FROM (SELECT value, to_height FROM ${history} WHERE key = $1 AND from_height <= $2 ` +
    "ORDER BY from_height DESC LIMIT 1) AS closed WHERE $2 < to_height";
  // The value goes as the member `value` of an object, so that the API's parameter mapping sends every JSON value as
  // JSON text (as the cursor table's write does).
  const writeSql =
    `INSERT INTO ${current} (key, value, from_height) VALUES ($1, ($2::jsonb) -> 'value', $3) ` +
    "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, from_height = EXCLUDED.from_height";
  // The setting is evaluated with the row's condition, before the row is deleted and so before its trigger runs.
  const deleteSql =
    `DELETE FROM ${current} WHERE key = $1 ` +
    "AND pg_catalog.set_config('umbradb.delete_height', $2, true) IS NOT NULL";
  return Object.freeze({
    schema,
    table,
    historyTable,
    migration: (id: string): Migration => Object.freeze({ id, sql: createSql }),
    async read(handle: Pick<ReadHandle, "query">, key: string, height?: bigint): Promise<VersionedValue | undefined> {
      const [row] = await (height === undefined
        ? handle.query(readSql, [key])
        : handle.query(readAtSql, [key, height]));
      return row?.value as VersionedValue | undefined;
    },
    async write(
      handle: BlockWriteHandle,
      block: Pick<BlockContext, "height">,
      key: string,
      value: VersionedValue,
    ): Promise<void> {
      await handle.execute(writeSql, [key, { value }, block.height]);
    },
    async delete(handle: BlockWriteHandle, block: Pick<BlockContext, "height">, key: string): Promise<void> {
      await handle.execute(deleteSql, [key, block.height]);
    },
  });
}
