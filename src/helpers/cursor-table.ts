/**
 * The cursor-table helper, refactored from 0.9.5's Watermarks (`src/postgres/watermarks.ts`): a table with one row per
 * key, `key text` → `value jsonb`, where the last write of a key wins. A private module's per-key cursors are one
 * example. [SH-1, Q27; CORE-ARCH §4.11a; design §1, §10, §12]
 *
 * **A library, not a module.** {@link cursorTable} names a table in the calling module's own schema. It gives the
 * table's migration, which the module puts in its own `migrations` list, and the functions that read and write the
 * table through the handles the module's callbacks are given:
 * - `write` goes through the block write handle of the module's `on-db-write`, so the write runs inside the block's one
 *   transaction, under the module's role [DB-3, DB-6, RN-4];
 * - `read` goes through any handle's `query`.
 *
 * The helper registers nothing, takes no point, and opens no connection or transaction of its own: this file imports
 * types only. Since the table is the module's, stopping, digests (change capture), backups and dropping treat it as
 * any other table of the module. Other modules may read it (with `SELECT`), and the role refuses their writes. Writing
 * it from `on-db-write` only is the module's obligation: modules are trusted code, and a schema write handle has the
 * same shape as a block write handle. [Q30, DT-4, DB-6, Q46]
 *
 * **Last write wins.** A write is one upsert, so a key written again, in a later block or in the same one, holds the
 * last value; a write of a block that rolls back is gone with it. The rule of one write per key per block belongs to
 * the height-versioned table, not to this table, which keeps no history: a second write of a key in one block replaces
 * the first, as 0.9.5's Watermarks did. [SH-1, SH-3; `Formal/STORAGE_ALGEBRA.md` §3, Law W1]
 *
 * **Deterministic.** [DT-1, DT-2, DT-6]
 * - The key is `text`, an allowed key type. Its uniqueness is by bytes, since the database's collation is a
 *   deterministic one. The byte order for reading rows in key order (`keyOrderTerm`, the contents hash and digests) is
 *   the `deterministic_postgresql` component's to apply, so the table names no collation of its own: only that
 *   component writes the collation. [DT-2, A138, Q69]
 * - The value is `jsonb`, which the database API's module rules give the `CHECK` `umbradb_integers_value`: a JSON
 *   number must be an integer within the signed 64-bit range, or else the write fails the block (`database-error`,
 *   SQLSTATE `23514`). [DT-1, Q57]
 * - No column holds a time. 0.9.5's `updated_at DEFAULT now()` is gone, since a non-immutable default is refused and
 *   no table stores wall-clock time. [DT-6; design §10]
 * - 0.9.5's `kind` is gone too: the table has one key, and a module wanting several kinds uses several tables or
 *   composite keys. [SH-1]
 * - `fillfactor = 90` stays, for 0.9.5's reason: a cursor is updated in place often, and the free space lets an update
 *   stay on its page, heap-only. So does 0.9.5's rule never to index `value`.
 *
 * **Values.** A value is any JSON value, sent as JSON text by the database API's parameter mapping (`parameterText` of
 * the `deterministic_postgresql` component). That mapping writes a `bigint` exactly, and refuses what JSON cannot hold
 * (`undefined`, `NaN`, a `Date`, a `Map`, …) with `invalid-parameter` before anything is sent. JSON `null` is stored
 * as a value, never as SQL NULL. A read gives the value back through the API's lossless reader: an integer beyond
 * ±(2^53 − 1) comes back exactly, as a `bigint`. (0.9.5 asked for decimal strings there, because its driver's
 * `JSON.parse` rounded them.) A key never written reads as `undefined`. [DB-2]
 *
 * **The migration's SQL is fixed.** Its checksum is part of each module's migration record, so a different text in a
 * later build would make every database that applied it refuse to start (`migration-checksum-changed`). A change to
 * the table is a new migration of the module, after this one. `test/helpers/cursor-table.test.ts` pins the text.
 * [DB-9]
 */

import type { BlockWriteHandle, ReadHandle } from "../db/api.js";
import type { Migration } from "../modules/declaration.js";

/** A JSON value a cursor holds: its numbers must be integers within the signed 64-bit range. [DT-1] */
export type CursorValue =
  | null
  | boolean
  | number
  | bigint
  | string
  | readonly CursorValue[]
  | { readonly [key: string]: CursorValue };

/** Where the table is: the calling module's schema (the module's id with `-` → `_`) and the table's name. [DB-8] */
export interface CursorTableOptions {
  readonly schema: string;
  readonly table: string;
}

/** A cursor table of one module (see the module comment). */
export interface CursorTable {
  readonly schema: string;
  readonly table: string;
  /** The migration that creates the table, with the id the module gives it; put it in the module's `migrations`. */
  migration(id: string): Migration;
  /**
   * The value of `key`, or `undefined` if no committed write (or, through a block write handle, no write of the block
   * so far) gave it one: through a read handle, as of the height it sees; through the block write handle, with the
   * block's own writes.
   */
  read(handle: Pick<ReadHandle, "query">, key: string): Promise<CursorValue | undefined>;
  /**
   * Sets `key` to `value`, through the block write handle of the module's `on-db-write`: inside the block's
   * transaction, under the module's role. The last write of a key wins. Rejects with the database API's errors:
   * `invalid-parameter` for a value JSON cannot hold (nothing sent), `database-error` for one the table refuses (a
   * number that is not a 64-bit integer, SQLSTATE `23514`; another module's table, `42501`), `handle-closed` after the
   * callback ended.
   */
  write(handle: BlockWriteHandle, key: string, value: CursorValue): Promise<void>;
}

/** A schema or table name the helper accepts: a lowercase identifier (quoted in its SQL, so a reserved word is one). */
const NAME = /^[a-z_][a-z0-9_]*$/;

/** PostgreSQL's longest identifier, in bytes (`NAMEDATALEN` − 1); the names are ASCII, so bytes are characters. */
const NAME_MAX_BYTES = 63;

function checkName(what: "schema" | "table", name: unknown): string {
  if (typeof name !== "string" || !NAME.test(name) || name.length > NAME_MAX_BYTES) {
    throw new TypeError(
      `cursorTable: the ${what} ${JSON.stringify(name)} is not a lowercase identifier ([a-z_][a-z0-9_]*) of at most ` +
        `${NAME_MAX_BYTES} bytes`,
    );
  }
  return name;
}

/**
 * The cursor table `options.table` in the calling module's schema `options.schema` (see the module comment). Throws a
 * `TypeError` for a name that is not a lowercase identifier of at most 63 bytes. [SH-1]
 */
export function cursorTable(options: CursorTableOptions): CursorTable {
  const schema = checkName("schema", options.schema);
  const table = checkName("table", options.table);
  const name = `"${schema}"."${table}"`;
  const createSql =
    `CREATE TABLE ${name} (key text PRIMARY KEY, value jsonb NOT NULL) WITH (fillfactor = 90)`;
  const readSql = `SELECT value FROM ${name} WHERE key = $1`;
  // The value goes as the member `value` of an object, so that the API's parameter mapping sends every JSON value —
  // a scalar, an array, null — as JSON text (it sends a bare string as itself and an array as a PostgreSQL array).
  const writeSql =
    `INSERT INTO ${name} (key, value) VALUES ($1, ($2::jsonb) -> 'value') ` +
    "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value";
  return Object.freeze({
    schema,
    table,
    migration: (id: string): Migration => Object.freeze({ id, sql: createSql }),
    async read(handle: Pick<ReadHandle, "query">, key: string): Promise<CursorValue | undefined> {
      // `value` is NOT NULL (JSON null is a value), so only a missing row reads as undefined.
      const [row] = await handle.query(readSql, [key]);
      return row?.value as CursorValue | undefined;
    },
    async write(handle: BlockWriteHandle, key: string, value: CursorValue): Promise<void> {
      await handle.execute(writeSql, [key, { value }]);
    },
  });
}
