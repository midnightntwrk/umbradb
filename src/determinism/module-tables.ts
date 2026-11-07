/**
 * A database's module tables and their rows in primary-key order, read through a read handle of the database API. This
 * is the table list the contents hash covers, and the row order it uses. [DT-2, DT-3]
 *
 * **Which tables count.** The contents hash covers every schema of a database, the core's database or a private
 * process's, under the same rules. It leaves out [DT-3, Q75, Q101]:
 * - PostgreSQL's own schemas (`pg_catalog`, `pg_toast`, the temporary schemas: every name starting with `pg_`);
 * - `information_schema`;
 * - `public`, where extensions install their tables;
 * - `core_digest_shadow`, change capture's scratch schema (`src/db/change-capture.ts`). Its shadow tables are empty
 *   whenever no block is open, and their layout is UmbraDB's own, so a release that changes the capture keeps contents
 *   hashes comparable. Whatever that schema holds, the hash neither reads nor refuses it.
 *
 * Those it hashes are the module schemas: the backbone's (`core_chain`, `core_block_commit`, `core_digest`, …, so the
 * digests are covered), the core modules', the user modules', the shared items', and any schema an operator created.
 * "Module tables" and "module schemas" below mean these, never the schema named `public`, which is left out.
 *
 * A table is an ordinary or a partitioned table (`relkind` `r` or `p`). A partition is part of its partitioned table,
 * whose rows it holds, not a table of its own, so the storage layout of a height-partitioned table never reaches the
 * hash. Views, materialized views, sequences, composite types and foreign tables hold no rows of their own and are not
 * tables. An ordinary table is read with `ONLY`, so a table inheriting from it is listed once, as itself.
 * [design §10]
 *
 * **How the catalog is read.** By name, never by OID or creation order:
 * - schemas and tables are sorted by the bytes of their names' UTF-8 encoding [DT-3];
 * - a table's columns are in column order: its attribute numbers with dropped columns skipped, which the table's
 *   migrations fix and every database built by them shares [DT-1, DB-9];
 * - column types are `format_type(atttypid, NULL)`'s names, the column types of the canonical encoding (`integer`,
 *   `bigint[]`, …) [DT-1];
 * - the primary key's columns are in the order the key declares them (`pg_index.indkey`), which may differ from column
 *   order.
 *
 * The catalog is read by the `deterministic_postgresql` component (`catalogTables` and `catalogRelations` of
 * `src/deterministic-postgresql/catalog.ts`), as its column-type rules take it, so the check at migration time reads
 * the same facts.
 *
 * **One snapshot.** Every statement goes through one handle, which must see exactly one committed height: on
 * PostgreSQL one `REPEATABLE READ READ ONLY` transaction, on PGlite one queued job. So the catalog, the row counts and
 * the rows are read from the same state. [DB-2]
 *
 * **Streaming.** Rows are read a page at a time with keyset pagination over the primary key (`WHERE (key) > (last
 * key) ORDER BY key LIMIT n`), so a large table is never held in memory and only the handle's `query` is needed.
 *
 * A database this cannot read deterministically fails with a {@link ModuleContentsError}. It carries the code and the
 * message of the component's rules (`src/deterministic-postgresql/column-rules.ts`), the same ones startup gives. The
 * faults are: a table without a primary key, a key column whose type has no defined order, a column whose type the
 * canonical encoding does not cover, an identity or `serial` column, a default that is not immutable, or a module
 * schema holding a sequence or an unlogged table. They apply in every schema it hashes, including a table no module
 * declared. [DT-1, DT-2, DT-6, Q58, Q61]
 */

import {
  type CatalogTable,
  type ColumnType,
  type ConsistentRead,
  catalogRelations,
  catalogTables,
  databaseRefusals,
  describeLocation,
  explainRefusal,
  keyOrderTerm,
  optOut,
  quoteIdentifier,
  type RefusalCode,
  type RefusalPlace,
  type TableName,
  UmbraError,
} from "../deterministic-postgresql/index.js";

/** The handle the contents are read through: the `deterministic_postgresql` component's (`catalog.ts`). */
export type { ConsistentRead } from "../deterministic-postgresql/index.js";

/** A column of a module table: its name, its column type, and its type as declared (for messages). [DT-1] */
export interface ModuleColumn {
  readonly name: string;
  readonly type: ColumnType;
  /** `format_type(atttypid, atttypmod)`: `numeric(38,0)`, `character varying(32)`, … */
  readonly declaredType: string;
}

/** A module table as the primary-key order and the contents hash see it. [DT-2, DT-3] */
export interface ModuleTable {
  readonly schema: string;
  readonly name: string;
  /**
   * `false` for a table declared `deterministic: false`, and absent otherwise. The contents hash records such a table's
   * schema and name only, `[schema, table, null, null]`, and nothing below describes it (`columns` and `key` are
   * empty), since its columns need not follow the rules. [MD-1, DT-3, Q76]
   */
  readonly deterministic?: false;
  /** A partitioned table, read whole across its partitions; an ordinary table is read with `ONLY`. */
  readonly partitioned: boolean;
  /** In column order. */
  readonly columns: readonly ModuleColumn[];
  /** The primary key: indexes into {@link columns}, in the key's declared order. */
  readonly key: readonly number[];
}

/** Options of a streaming read. */
export interface PageOptions {
  /** Rows read per statement (default 1,000). It bounds memory and never changes the rows or their order. */
  readonly pageSize?: number;
}

/** Which tables the module tables' readers skip. */
export interface ModuleTableOptions {
  /**
   * The tables declared `deterministic: false` (the schema plan's `optedOut`). The rules do not refuse them, their
   * partitions or the sequences their columns own (the component's `optOut`), and they are listed by name only
   * ({@link ModuleTable.deterministic} `false`). Every other table is read as without it. [MD-1, Q76]
   */
  readonly optedOut?: readonly TableName[];
}

/** Why a database's module contents could not be read in canonical form. */
export type ModuleContentsFailure =
  /**
   * What the rules refuse, with the code startup gives it (`src/deterministic-postgresql/column-rules.ts`): no primary
   * key, a key column whose type has no defined order, a column type the canonical encoding does not cover, a
   * floating-point, identity or `serial` column or a default that is not immutable (`non-deterministic-column`), a
   * sequence or an unlogged table (`non-deterministic-table`). [DT-1, DT-2, DT-6]
   */
  | RefusalCode
  /** A row that cannot be encoded canonically (the cause is the encoder's error). [DT-1] */
  | "unencodable-row"
  /** A table's rows, read after its row count, were not as many: the handle did not read one snapshot. */
  | "row-count-changed";

/**
 * A failure to read module contents: `reason` says why; `schema`, `table` or `sequence` (the other null), `column` and
 * its `declaredType` (null for the table or sequence itself) say where. The message is the code, the location, and an
 * explanation: for a refusal, exactly what `refusalMessage` of the component's rules gives, the message startup gives.
 * It is an `UmbraError` (the package exports `UmbraError`, not this class): its code is its `reason`, it is not
 * retryable, and its details hold where it is. [design §12]
 */
export class ModuleContentsError extends UmbraError {
  override readonly name = "ModuleContentsError";
  readonly schema: string;
  readonly table: string | null;
  readonly sequence: string | null;
  readonly column: string | null;
  readonly declaredType: string | null;

  constructor(
    readonly reason: ModuleContentsFailure,
    place: RefusalPlace,
    column: { readonly name: string; readonly declaredType: string } | null,
    detail: string,
    options?: ErrorOptions,
  ) {
    const where = {
      schema: place.schema,
      table: "table" in place ? place.table : null,
      sequence: "sequence" in place ? place.sequence : null,
      column: column?.name ?? null,
      declaredType: column?.declaredType ?? null,
    };
    super(reason, `${reason}: ${describeLocation(place, column)}: ${detail}`, where, options);
    this.schema = where.schema;
    this.table = where.table;
    this.sequence = where.sequence;
    this.column = where.column;
    this.declaredType = where.declaredType;
  }
}

/**
 * The module tables of the database `read` sees, in the contents hash's order (by the bytes of their names). A
 * database the rules refuse fails with its first refusal, with the code and the message startup gives
 * (`databaseRefusals` of the component's rules: the tables' refusals in that order, then the sequences' and unlogged
 * tables'). [DT-2, DT-3, DT-6]
 */
export async function moduleTables(read: ConsistentRead, options: ModuleTableOptions = {}): Promise<ModuleTable[]> {
  const tables = await catalogTables(read);
  const optedOut = options.optedOut ?? [];
  const [first] = databaseRefusals(tables, await catalogRelations(read), { optedOut });
  if (first !== undefined) {
    const { refusal, place } = first;
    throw new ModuleContentsError(refusal.code, place, refusal.column, explainRefusal(refusal));
  }
  const out = optOut(optedOut);
  return tables.map((table) =>
    out.covers({ schema: table.schema, table: table.name })
      ? { schema: table.schema, name: table.name, deterministic: false, partitioned: table.partitioned, columns: [], key: [] }
      : describeTable(table),
  );
}

/** The number of rows of `table`, from the state `read` sees. */
export async function countRows(read: ConsistentRead, table: ModuleTable): Promise<number> {
  const [row] = await read.query(`SELECT count(*) AS n FROM ${fromClause(table)}`);
  return Number((row as Record<string, unknown>).n);
}

/**
 * The rows of `table` in primary-key order: the key's columns in order, integers numerically, `boolean` with `false`
 * first, `bytea`, `text`, `varchar` and `uuid` by their bytes (`COLLATE "C"` for `text` and `varchar`). Each row is its
 * column values in column order, read `pageSize` rows per statement. [DT-2]
 */
export async function* rowsInKeyOrder(
  read: ConsistentRead,
  table: ModuleTable,
  options: PageOptions = {},
): AsyncGenerator<unknown[], void, undefined> {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError(`pageSize must be a positive integer, got ${pageSize}`);
  }
  const keyColumns = table.key.map((index) => table.columns[index] as ModuleColumn);
  const select = table.columns.map((column, index) => `${quoteIdentifier(column.name)} AS c${index}`).join(", ");
  const order = keyColumns.map((column) => keyOrderTerm(column.name, column.type)).join(", ");
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

function fromClause(table: ModuleTable): string {
  return `${table.partitioned ? "" : "ONLY "}${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
}

/**
 * The table as the primary-key order and the contents hash read it; every table reaching it passed the rules.
 * [DT-2, DT-3]
 */
function describeTable(table: CatalogTable): ModuleTable {
  const key = table.columns
    .map((column, index) => ({ index, position: column.keyPosition }))
    .filter((entry): entry is { index: number; position: number } => entry.position !== null)
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.index);
  // Every column passed the rules, so its type is one the canonical encoding covers, and the encoder takes it as named.
  const columns = table.columns.map(
    ({ name, type, declaredType }): ModuleColumn => ({ name, type: type as ColumnType, declaredType }),
  );
  return { schema: table.schema, name: table.name, partitioned: table.partitioned, columns, key };
}
