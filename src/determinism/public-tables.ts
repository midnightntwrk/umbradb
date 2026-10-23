/**
 * A database's public tables and their rows in primary-key order: DT-2 and the table list of DT-3
 * (`openspec/changes/core-arch/specs/determinism/spec.md`), read through a read handle of the database API.
 *
 * **Which tables count.** DT-3 hashes "each public schema and then each table". The public database holds only
 * public-side schemas — the backbone's (`core_chain`, `core_block_commit`, `core_digest`, …), the core modules', the
 * public user modules' and the shared items' — because each private process owns a database of its own (PP-1). So
 * every schema of the database counts except those no part or module can own (DB-8's reserved names): PostgreSQL's
 * own (`pg_catalog`, `pg_toast`, the temporary schemas — every name starting with `pg_`), `information_schema`, and
 * `public`, where extensions install their tables. A table is an ordinary or a partitioned table (`relkind` `r` or
 * `p`); a partition is part of its partitioned table, whose rows it holds, not a table of its own, so the storage
 * layout of a height-partitioned table (`design.md` §10) never reaches the hash. Views, materialized views,
 * sequences, composite types and foreign tables hold no rows of their own and are not tables. An ordinary table is
 * read with `ONLY`, so a table inheriting from it is listed once, as itself.
 *
 * **How the catalog is read.** By name, never by OID or creation order: schemas and tables are sorted by the bytes of
 * their names' UTF-8 encoding (DT-3's byte order); a table's columns are in column order (DT-1), its attribute
 * numbers with dropped columns skipped, which the table's migrations fix (DB-9) and every database built by them
 * shares; column types are `format_type(atttypid, NULL)`'s names, the column types of DT-1 (`integer`, `bigint[]`,
 * …); the primary key's columns are in the order the key declares them (`pg_index.indkey`), which may differ from
 * column order.
 *
 * **One snapshot.** Every statement goes through one handle, which DB-2 requires to see exactly one committed height:
 * on PostgreSQL one `REPEATABLE READ READ ONLY` transaction, on PGlite one queued job. The catalog, the row counts
 * and the rows are therefore read from the same state.
 *
 * **Streaming.** Rows are read a page at a time with keyset pagination over the primary key (`WHERE (key) > (last
 * key) ORDER BY key LIMIT n`), so a large table is never held in memory and only the handle's `query` is needed.
 *
 * A table this cannot read deterministically fails with a {@link PublicContentsError}: one without a primary key, a
 * key column whose type DT-2 does not order, or a column whose type DT-1 does not encode.
 */

import { type ColumnType, SCALAR_COLUMN_TYPES } from "./cbor.js";

/**
 * The part of the database API's read handle (`ReadHandle`, CORE-ARCH §4.10 and `design.md` §4) that reading public
 * contents needs: `query`, every call of which sees the same committed state (DB-2). Results are mapped as DB-2 maps
 * them: `bigint` to `bigint`, `bytea` to `Uint8Array`, `numeric` to its decimal text, `jsonb` parsed without loss.
 * A `ReadHandle` and a `BlockWriteHandle` are both one.
 */
export interface ConsistentRead {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/** A column of a public table: its name and its DT-1 type. */
export interface PublicColumn {
  readonly name: string;
  readonly type: ColumnType;
}

/** A public table as DT-2 and DT-3 see it. */
export interface PublicTable {
  readonly schema: string;
  readonly name: string;
  /** A partitioned table, read whole across its partitions; an ordinary table is read with `ONLY`. */
  readonly partitioned: boolean;
  /** In column order. */
  readonly columns: readonly PublicColumn[];
  /** The primary key: indexes into {@link columns}, in the key's declared order. */
  readonly key: readonly number[];
}

/** Options of a streaming read. */
export interface PageOptions {
  /** Rows read per statement (default 1,000). It bounds memory and never changes the rows or their order. */
  readonly pageSize?: number;
}

/** Why a database's public contents could not be read in canonical form. */
export type PublicContentsFailure =
  /** A public table without a primary key: DT-2 cannot order its rows. */
  | "no-primary-key"
  /** A primary-key column of a type DT-2 does not order (only integers, `bytea` and `text` are). */
  | "unsupported-key-type"
  /** A column of a type DT-1 does not encode. */
  | "unsupported-column-type"
  /** A row DT-1 cannot encode (the cause is the encoder's error). */
  | "unencodable-row"
  /** A table's rows, read after its row count, were not as many: the handle did not read one snapshot. */
  | "row-count-changed";

/** A failure to read public contents: `reason` says why; `schema`, `table` and `column` (or null) say where. */
export class PublicContentsError extends Error {
  override readonly name = "PublicContentsError";

  constructor(
    readonly reason: PublicContentsFailure,
    readonly schema: string,
    readonly table: string,
    readonly column: string | null,
    detail: string,
    options?: ErrorOptions,
  ) {
    const where = [schema, table, ...(column === null ? [] : [column])].map(quoteIdentifier).join(".");
    super(`${where}: ${reason}: ${detail}`, options);
  }
}

/** The public tables of the database `read` sees, in DT-3's order: by schema name, then table name, as bytes. */
export async function publicTables(read: ConsistentRead): Promise<PublicTable[]> {
  const tableRows = await read.query(TABLES_SQL);
  const columnRows = await read.query(COLUMNS_SQL);

  const columnsOf = new Map<string, CatalogColumn[]>();
  for (const row of columnRows) {
    const id = tableId(row.schema_name as string, row.table_name as string);
    const columns = columnsOf.get(id) ?? [];
    columns.push({
      name: row.column_name as string,
      number: row.column_number as number,
      type: row.column_type as string,
      keyPosition: row.key_position as number | null,
    });
    columnsOf.set(id, columns);
  }

  const tables = tableRows.map((row) => {
    const schema = row.schema_name as string;
    const name = row.table_name as string;
    return {
      schema,
      name,
      partitioned: row.partitioned as boolean,
      catalogColumns: columnsOf.get(tableId(schema, name)) ?? [],
    };
  });
  tables.sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
  return tables.map(({ schema, name, partitioned, catalogColumns }) =>
    describeTable(schema, name, partitioned, catalogColumns),
  );
}

/** The number of rows of `table`, from the state `read` sees. */
export async function countRows(read: ConsistentRead, table: PublicTable): Promise<number> {
  const [row] = await read.query(`SELECT count(*) AS n FROM ${fromClause(table)}`);
  return Number((row as Record<string, unknown>).n);
}

/**
 * The rows of `table` in DT-2's order — the key's columns in order, integers numerically, `bytea` and `text` by their
 * bytes (`COLLATE "C"`) — each as its column values in column order, read `pageSize` rows per statement.
 */
export async function* rowsInKeyOrder(
  read: ConsistentRead,
  table: PublicTable,
  options: PageOptions = {},
): AsyncGenerator<unknown[], void, undefined> {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError(`pageSize must be a positive integer, got ${pageSize}`);
  }
  const keyColumns = table.key.map((index) => table.columns[index] as PublicColumn);
  const select = table.columns.map((column, index) => `${quoteIdentifier(column.name)} AS c${index}`).join(", ");
  const order = keyColumns
    .map((column) => `${quoteIdentifier(column.name)}${column.type === "text" ? ' COLLATE "C"' : ""}`)
    .join(", ");
  const lastKey = keyColumns.map((column, position) => `$${position + 1}::${column.type}`).join(", ");
  const head = `SELECT ${select} FROM ${fromClause(table)}`;
  const tail = `ORDER BY ${order} LIMIT ${pageSize}`;
  const firstPage = `${head} ${tail}`;
  const nextPage = `${head} WHERE (${order}) > (${lastKey}) ${tail}`;

  let after: unknown[] | undefined;
  for (;;) {
    const rows = await read.query(after === undefined ? firstPage : nextPage, after);
    for (const row of rows) yield table.columns.map((_, index) => row[`c${index}`]);
    if (rows.length < pageSize) return;
    // The next page starts after the last key read, taken from the handle's row, not from the array the caller got.
    const last = rows[rows.length - 1] as Record<string, unknown>;
    after = table.key.map((index) => last[`c${index}`]);
  }
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 1_000;

/**
 * Public tables: ordinary or partitioned tables that are not partitions, outside PostgreSQL's own schemas (`pg_*`),
 * `information_schema` and the reserved `public`.
 */
const PUBLIC_TABLE_FILTER = `
  c.relkind IN ('r', 'p') AND NOT c.relispartition
  AND n.nspname NOT IN ('information_schema', 'public') AND left(n.nspname::text, 3) <> 'pg_'`;

const TABLES_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS table_name, c.relkind = 'p' AS partitioned
FROM pg_catalog.pg_class AS c
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
WHERE ${PUBLIC_TABLE_FILTER}`;

const COLUMNS_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS table_name, a.attname::text AS column_name,
       a.attnum::integer AS column_number, pg_catalog.format_type(a.atttypid, NULL) AS column_type,
       (SELECT k.position::integer
          FROM unnest(i.indkey::smallint[]) WITH ORDINALITY AS k(attnum, position)
         WHERE k.attnum = a.attnum) AS key_position
FROM pg_catalog.pg_attribute AS a
JOIN pg_catalog.pg_class AS c ON c.oid = a.attrelid
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
LEFT JOIN pg_catalog.pg_index AS i ON i.indrelid = c.oid AND i.indisprimary
WHERE ${PUBLIC_TABLE_FILTER} AND a.attnum > 0 AND NOT a.attisdropped`;

/** DT-2's key types: integers, compared numerically, and `bytea` and `text`, compared by their bytes. */
const KEY_TYPES: ReadonlySet<string> = new Set(["smallint", "integer", "bigint", "bytea", "text"]);

const COLUMN_TYPES: ReadonlySet<string> = new Set([
  ...SCALAR_COLUMN_TYPES,
  ...SCALAR_COLUMN_TYPES.map((type) => `${type}[]`),
]);

interface CatalogColumn {
  readonly name: string;
  readonly number: number;
  readonly type: string;
  readonly keyPosition: number | null;
}

const utf8 = new TextEncoder();

/** Orders strings by the bytes of their UTF-8 encodings (JavaScript's `<` compares UTF-16 code units instead). */
function compareUtf8(a: string, b: string): number {
  const x = utf8.encode(a);
  const y = utf8.encode(b);
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i++) {
    const d = (x[i] as number) - (y[i] as number);
    if (d !== 0) return d;
  }
  return x.length - y.length;
}

function tableId(schema: string, table: string): string {
  return JSON.stringify([schema, table]);
}

function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function fromClause(table: PublicTable): string {
  return `${table.partitioned ? "" : "ONLY "}${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
}

function describeTable(
  schema: string,
  name: string,
  partitioned: boolean,
  catalogColumns: readonly CatalogColumn[],
): PublicTable {
  const ordered = [...catalogColumns].sort((a, b) => a.number - b.number);
  const key = ordered
    .map((column, index) => ({ index, position: column.keyPosition }))
    .filter((entry): entry is { index: number; position: number } => entry.position !== null)
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.index);
  if (key.length === 0) {
    throw new PublicContentsError("no-primary-key", schema, name, null, "DT-2 orders rows by their primary key");
  }
  const columns = ordered.map((column): PublicColumn => {
    if (!COLUMN_TYPES.has(column.type)) {
      throw new PublicContentsError(
        "unsupported-column-type",
        schema,
        name,
        column.name,
        `DT-1 does not encode ${JSON.stringify(column.type)}`,
      );
    }
    return { name: column.name, type: column.type as ColumnType };
  });
  for (const index of key) {
    const column = columns[index] as PublicColumn;
    if (!KEY_TYPES.has(column.type)) {
      throw new PublicContentsError(
        "unsupported-key-type",
        schema,
        name,
        column.name,
        `DT-2 orders integer, bytea and text keys, not ${JSON.stringify(column.type)}`,
      );
    }
  }
  return { schema, name, partitioned, columns, key };
}
