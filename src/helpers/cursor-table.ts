/**
 * The cursor-table helper (`openspec/changes/core-arch/specs/storage-helpers/spec.md` SH-1; `design.md` §1, §10, §12;
 * CORE-ARCH §4.11a; owner decisions Q27, Q30), refactored from 0.9.5's Watermarks (`src/postgres/watermarks.ts`): a
 * table with one row per key, `key text` → `value jsonb`, where the last write of a key wins — for example a private
 * module's per-key cursors.
 *
 * **A library, not a module (Q30).** {@link cursorTable} names a table in the calling module's own schema and gives its
 * migration, which the module puts in its own `migrations` list, and the functions that read and write it through the
 * handles the module's callbacks are given: `write` through the block write handle of its `on-db-write`, so the write
 * runs inside the block's one transaction, under the module's role (DB-3, DB-6, RN-4); `read` through any handle's
 * `query`. The helper registers nothing, takes no point, and opens no connection or transaction of its own: this file
 * imports types only. Since the table is the module's, stopping, digests (change capture, DT-4), backups and dropping
 * treat it as any other table of the module; other modules may read it (DB-6's `SELECT`), and the role refuses their
 * writes. Writing it from `on-db-write` only is the module's obligation — modules are trusted code (Q46), and a schema
 * write handle has the same shape as a block write handle.
 *
 * **Last write wins (SH-1, Law W1 of `Formal/STORAGE_ALGEBRA.md` §3).** A write is one upsert, so a key written again
 * — in a later block, or in the same one — holds the last value; a write of a block that rolls back is gone with it.
 * SH-3's one write per key per block is the height-versioned table's rule (task 6.2), not this table's, which keeps no
 * history: a second write of a key in one block replaces the first, as 0.9.5's Watermarks did.
 *
 * **Deterministic (DT-1, DT-2, DT-6).** The key is `text`, an allowed key type: its uniqueness is by bytes (the
 * database's collation is a deterministic one), and DT-2's byte order is the `deterministic_postgresql` component's to
 * apply where rows are read in key order (`keyOrderTerm`, the contents hash and digests), so the table names no
 * collation of its own (A138: the component alone writes DT-2's collation, owner decision Q69); the value is `jsonb`,
 * which the database API's module rules give the `CHECK` of Q57
 * (`umbradb_integers_value`): a JSON number must be an integer within the signed 64-bit range, else the write fails the
 * block (`database-error`, SQLSTATE `23514`). No column holds a time: 0.9.5's `updated_at DEFAULT now()` is gone (a
 * non-immutable default is refused by DT-6, and no table stores wall-clock time, `design.md` §10), and so is its
 * `kind`: SH-1 has one key, and a module wanting several kinds uses several tables or composite keys. `fillfactor =
 * 90` stays (0.9.5's reason: a cursor is updated in place often, and the free space lets an update stay on its page,
 * heap-only); so does its rule never to index `value`.
 *
 * **Values.** A value is any JSON value, sent as JSON text by the database API's parameter mapping (`parameterText` of
 * the `deterministic_postgresql` component, which writes a `bigint` exactly and refuses what JSON cannot hold —
 * `undefined`, `NaN`, a `Date`, a `Map`, … — with `invalid-parameter` before anything is sent); JSON `null` is stored
 * as a value, never as SQL NULL. A read gives it back through the API's lossless reader (DB-2): an integer beyond
 * ±(2^53 − 1) as a `bigint`, exactly — 0.9.5 asked for decimal strings there, because its driver's `JSON.parse` rounded
 * them. A key never written reads as `undefined`.
 *
 * **The migration's SQL is fixed.** Its checksum is part of each module's migration record (DB-9), so another text in a
 * later build would make every database that applied it refuse to start (`migration-checksum-changed`); a change to the
 * table is a new migration of the module, after this one. `test/helpers/cursor-table.test.ts` pins the text.
 */

import type { BlockWriteHandle, ReadHandle } from "../db/api.js";
import type { Migration } from "../modules/declaration.js";

/** A JSON value a cursor holds (DT-1: numbers must be integers within the signed 64-bit range). */
export type CursorValue =
  | null
  | boolean
  | number
  | bigint
  | string
  | readonly CursorValue[]
  | { readonly [key: string]: CursorValue };

/** Where the table is: the calling module's schema (the module's id with `-` → `_`, DB-8) and the table's name. */
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
 * The cursor table `options.table` in the calling module's schema `options.schema` (SH-1; see the module comment).
 * Throws a `TypeError` for a name that is not a lowercase identifier of at most 63 bytes.
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
