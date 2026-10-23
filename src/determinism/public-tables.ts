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
 * column order. {@link catalogTables} gives each column as the column-type rules take it (`./column-rules.ts`): also
 * its declared type, its type modifier and the kind of its type (and of an array's element), so task 7.1's
 * migration-time check can read the same facts.
 *
 * **One snapshot.** Every statement goes through one handle, which DB-2 requires to see exactly one committed height:
 * on PostgreSQL one `REPEATABLE READ READ ONLY` transaction, on PGlite one queued job. The catalog, the row counts
 * and the rows are therefore read from the same state.
 *
 * **Streaming.** Rows are read a page at a time with keyset pagination over the primary key (`WHERE (key) > (last
 * key) ORDER BY key LIMIT n`), so a large table is never held in memory and only the handle's `query` is needed.
 *
 * A database this cannot read deterministically fails with a {@link PublicContentsError} carrying the code and the
 * message of the rules (`./column-rules.ts`, owner decisions Q58 and Q61), the ones startup gives (DT-6): a table
 * without a primary key, a key column whose type DT-2 does not order, a column whose type DT-1 does not encode, an
 * identity or `serial` column, a default that is not immutable, or a public schema holding a sequence or an unlogged
 * table — in any public schema, a table no module declared included.
 */

import { UmbraError } from "../db/errors.js";
import type { ColumnType } from "./cbor.js";
import {
  type CatalogFunction,
  type CatalogType,
  type ColumnFacts,
  catalogNeeds,
  type DefaultCatalog,
  type DefaultReference,
  databaseRefusals,
  defaultReferences,
  describeLocation,
  explainRefusal,
  keyOrder,
  notImmutableParts,
  parseExpressionTree,
  quoteIdentifier,
  type RefusalCode,
  type RefusalPlace,
  type RelationFacts,
  type TableFacts,
} from "./column-rules.js";

/**
 * The part of the database API's read handle (`ReadHandle`, CORE-ARCH §4.10 and `design.md` §4) that reading public
 * contents needs: `query`, every call of which sees the same committed state (DB-2). Results are mapped as DB-2 maps
 * them: `bigint` to `bigint`, `bytea` to `Uint8Array`, `numeric` to its decimal text, `jsonb` parsed without loss.
 * A `ReadHandle` and a `BlockWriteHandle` are both one.
 */
export interface ConsistentRead {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/** A column of a public table: its name, its DT-1 type, and its type as declared (for messages). */
export interface PublicColumn {
  readonly name: string;
  readonly type: ColumnType;
  /** `format_type(atttypid, atttypmod)`: `numeric(38,0)`, `character varying(32)`, … */
  readonly declaredType: string;
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

/** A column as the catalog describes it (the column-type rules' input), and its place in the primary key. */
export interface CatalogColumn extends ColumnFacts {
  /** Its position in the primary key's declared order (from 1, `pg_index.indkey`), or null outside the key. */
  readonly keyPosition: number | null;
}

/** A public table as the catalog describes it: the column-type rules' input, before any of them is applied. */
export interface CatalogTable extends TableFacts {
  /** A partitioned table, read whole across its partitions; an ordinary table is read with `ONLY`. */
  readonly partitioned: boolean;
  /** In column order. */
  readonly columns: readonly CatalogColumn[];
}

/** Options of a streaming read. */
export interface PageOptions {
  /** Rows read per statement (default 1,000). It bounds memory and never changes the rows or their order. */
  readonly pageSize?: number;
}

/** Why a database's public contents could not be read in canonical form. */
export type PublicContentsFailure =
  /**
   * What the rules refuse, with the code startup gives it (DT-6, `./column-rules.ts`): no primary key, a key column
   * DT-2 does not order, a column type DT-1 does not encode, a floating-point, identity or `serial` column or a default
   * that is not immutable (`non-deterministic-column`), a sequence or an unlogged table (`non-deterministic-table`).
   */
  | RefusalCode
  /** A row DT-1 cannot encode (the cause is the encoder's error). */
  | "unencodable-row"
  /** A table's rows, read after its row count, were not as many: the handle did not read one snapshot. */
  | "row-count-changed";

/**
 * A failure to read public contents: `reason` says why; `schema`, `table` or `sequence` (the other null), `column` and
 * its `declaredType` (null for the table or sequence itself) say where. The message is the code, the location, and an
 * explanation: for a refusal, exactly what `refusalMessage` of `./column-rules.ts` gives, the message startup gives. It
 * is an `UmbraError` (`design.md` §12 exports `UmbraError`, not this class): its code is its `reason`, it is not
 * retryable, and its details hold where it is.
 */
export class PublicContentsError extends UmbraError {
  override readonly name = "PublicContentsError";
  readonly schema: string;
  readonly table: string | null;
  readonly sequence: string | null;
  readonly column: string | null;
  readonly declaredType: string | null;

  constructor(
    readonly reason: PublicContentsFailure,
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
 * The public tables of the database `read` sees, as the catalog describes them, in DT-3's order (by schema name, then
 * table name, as bytes), each with its columns in column order: their types, identity, and what in their defaults is
 * not immutable (read from the defaults' expression trees and one more catalog read, `./column-rules.ts`). Nothing is
 * refused here: this is the rules' input.
 */
export async function catalogTables(read: ConsistentRead): Promise<CatalogTable[]> {
  const tableRows = await read.query(TABLES_SQL);
  const columnRows = await read.query(COLUMNS_SQL);
  const references = columnRows.map((row): DefaultReference[] =>
    row.default_tree === null ? [] : defaultReferences(parseExpressionTree(row.default_tree as string)),
  );
  const catalog = await defaultCatalog(read, references.flat());

  const columnsOf = new Map<string, { readonly number: number; readonly column: CatalogColumn }[]>();
  for (const [index, row] of columnRows.entries()) {
    const id = tableId(row.schema_name as string, row.table_name as string);
    const columns = columnsOf.get(id) ?? [];
    const keyPosition = row.key_position as number | null;
    columns.push({
      number: row.column_number as number,
      column: {
        name: row.column_name as string,
        type: row.column_type as string,
        declaredType: row.declared_type as string,
        typeModifier: row.type_modifier as number,
        typeKind: row.type_kind as string,
        elementKind: row.element_kind as string | null,
        inPrimaryKey: keyPosition !== null,
        identity: IDENTITY[row.identity as string] ?? null,
        notImmutable: notImmutableParts(references[index] as DefaultReference[], catalog),
        keyPosition,
      },
    });
    columnsOf.set(id, columns);
  }

  const tables = tableRows.map((row): CatalogTable => {
    const schema = row.schema_name as string;
    const name = row.table_name as string;
    const columns = [...(columnsOf.get(tableId(schema, name)) ?? [])].sort((a, b) => a.number - b.number);
    return { schema, name, partitioned: row.partitioned as boolean, columns: columns.map((entry) => entry.column) };
  });
  return tables.sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
}

/**
 * The relations of the public schemas that DT-6 refuses whatever they hold (owner decision Q61), as the catalog
 * describes them, in DT-3's order (by schema name, then name, as bytes): every sequence (`relkind = 'S'`, an identity
 * or `serial` column's own included), and every unlogged table, partitioned table or partition
 * (`relpersistence = 'u'`; a partition holds rows of its partitioned table, so it counts too).
 */
export async function catalogRelations(read: ConsistentRead): Promise<RelationFacts[]> {
  const relations = (await read.query(RELATIONS_SQL)).map(
    (row): RelationFacts => ({
      schema: row.schema_name as string,
      name: row.relation_name as string,
      kind: row.kind as string,
      persistence: row.persistence as string,
    }),
  );
  return relations.sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
}

/**
 * The public tables of the database `read` sees, in DT-3's order, as DT-2 and DT-3 read them. A database the rules
 * refuse fails with its first refusal (`databaseRefusals` of `./column-rules.ts`: the tables' refusals in DT-3's order,
 * then the sequences' and unlogged tables'): the code and the message startup gives (DT-6).
 */
export async function publicTables(read: ConsistentRead): Promise<PublicTable[]> {
  const tables = await catalogTables(read);
  const [first] = databaseRefusals(tables, await catalogRelations(read));
  if (first !== undefined) {
    const { refusal, place } = first;
    throw new PublicContentsError(refusal.code, place, refusal.column, explainRefusal(refusal));
  }
  return tables.map(describeTable);
}

/** The number of rows of `table`, from the state `read` sees. */
export async function countRows(read: ConsistentRead, table: PublicTable): Promise<number> {
  const [row] = await read.query(`SELECT count(*) AS n FROM ${fromClause(table)}`);
  return Number((row as Record<string, unknown>).n);
}

/**
 * The rows of `table` in DT-2's order — the key's columns in order, integers numerically, `boolean` with `false` first,
 * `bytea`, `text`, `varchar` and `uuid` by their bytes (`COLLATE "C"` for `text` and `varchar`) — each as its column
 * values in column order, read `pageSize` rows per statement.
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
    .map((column) => {
      const collate = keyOrder(column.type) === "by-bytes-collate-c" ? ' COLLATE "C"' : "";
      return `${quoteIdentifier(column.name)}${collate}`;
    })
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

/**
 * A column's facts (`ColumnFacts` of `./column-rules.ts`): `format_type` without and with the type modifier, the type
 * modifier, `typtype` of the type and — for a true array, the condition under which `format_type` prints `[]`
 * (`IsTrueArrayType` and not plain storage, PostgreSQL's format_type.c) — of its element; its key position;
 * `attidentity`; and its default's expression tree (`pg_attrdef.adbin`), unless the column is generated, whose
 * expression `pg_attrdef` holds too but which is no default (`attgenerated`, PostgreSQL requires it to be immutable).
 */
const COLUMNS_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS table_name, a.attname::text AS column_name,
       a.attnum::integer AS column_number, pg_catalog.format_type(a.atttypid, NULL) AS column_type,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS declared_type, a.atttypmod::integer AS type_modifier,
       t.typtype::text AS type_kind, e.typtype::text AS element_kind,
       (SELECT k.position::integer
          FROM unnest(i.indkey::smallint[]) WITH ORDINALITY AS k(attnum, position)
         WHERE k.attnum = a.attnum) AS key_position,
       a.attidentity::text AS identity,
       CASE WHEN a.attgenerated = '' THEN d.adbin::text END AS default_tree
FROM pg_catalog.pg_attribute AS a
JOIN pg_catalog.pg_class AS c ON c.oid = a.attrelid
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
JOIN pg_catalog.pg_type AS t ON t.oid = a.atttypid
LEFT JOIN pg_catalog.pg_type AS e
  ON e.oid = t.typelem AND t.typsubscript = 'pg_catalog.array_subscript_handler'::pg_catalog.regproc
 AND t.typstorage <> 'p'
LEFT JOIN pg_catalog.pg_index AS i ON i.indrelid = c.oid AND i.indisprimary
LEFT JOIN pg_catalog.pg_attrdef AS d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE ${PUBLIC_TABLE_FILTER} AND a.attnum > 0 AND NOT a.attisdropped`;

/** `attidentity`: `a` for GENERATED ALWAYS AS IDENTITY, `d` for BY DEFAULT, empty for no identity. */
const IDENTITY: Readonly<Record<string, "always" | "by default">> = { a: "always", d: "by default" };

/** Sequences and unlogged tables (partitions included) of the public schemas: `design.md` §4's detection. */
const RELATIONS_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS relation_name, c.relkind::text AS kind,
       c.relpersistence::text AS persistence
FROM pg_catalog.pg_class AS c
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
WHERE (c.relkind = 'S' OR (c.relkind IN ('r', 'p') AND c.relpersistence = 'u'))
  AND n.nspname NOT IN ('information_schema', 'public') AND left(n.nspname::text, 3) <> 'pg_'`;

/** A function's name for a message, `name()`, qualified by its schema outside `pg_catalog`. */
const FUNCTION_NAME = (alias: string, schema: string): string =>
  `CASE WHEN ${schema}.nspname = 'pg_catalog' THEN '' ELSE ${schema}.nspname::text || '.' END ` +
  `|| ${alias}.proname::text || '()'`;

/**
 * What the catalog says about the functions, operators and types a set of defaults refers to (`catalogNeeds` of
 * `./column-rules.ts`): each function's name and `provolatile` and whether it is `nextval(regclass)`, each operator's
 * function (`oprcode`), each type's name and input and output functions. One statement on the same handle, so the
 * same snapshot as the trees; none when no default refers to anything. The OIDs are written in as literals: they are
 * decimal digits, checked when read from the trees.
 */
async function defaultCatalog(read: ConsistentRead, references: readonly DefaultReference[]): Promise<DefaultCatalog> {
  const needs = catalogNeeds(references);
  const catalog = { functions: new Map<string, CatalogFunction>(), operators: new Map<string, CatalogFunction>() };
  const types = new Map<string, CatalogType>();
  if (needs.functions.length + needs.operators.length + needs.types.length === 0) return { ...catalog, types };
  const oids = (list: readonly string[]): string => `'{${list.join(",")}}'::pg_catalog.oid[]`;
  const fn = (alias: string, schema: string): string =>
    `${FUNCTION_NAME(alias, schema)} AS function_name, ${alias}.provolatile::text AS volatility, ` +
    `${alias}.oid = 'pg_catalog.nextval(pg_catalog.regclass)'::pg_catalog.regprocedure AS nextval`;
  const rows = await read.query(`
SELECT 'function' AS entry, p.oid::text AS oid, NULL::text AS type_name, ${fn("p", "pn")},
       NULL::text AS output_name, NULL::text AS output_volatility
FROM pg_catalog.pg_proc AS p JOIN pg_catalog.pg_namespace AS pn ON pn.oid = p.pronamespace
WHERE p.oid = ANY (${oids(needs.functions)})
UNION ALL
SELECT 'operator', o.oid::text, NULL, ${fn("p", "pn")}, NULL, NULL
FROM pg_catalog.pg_operator AS o JOIN pg_catalog.pg_proc AS p ON p.oid = o.oprcode
JOIN pg_catalog.pg_namespace AS pn ON pn.oid = p.pronamespace
WHERE o.oid = ANY (${oids(needs.operators)})
UNION ALL
SELECT 'type', t.oid::text, pg_catalog.format_type(t.oid, NULL), ${fn("p", "pn")},
       ${FUNCTION_NAME("q", "qn")} AS output_name, q.provolatile::text AS output_volatility
FROM pg_catalog.pg_type AS t
JOIN pg_catalog.pg_proc AS p ON p.oid = t.typinput JOIN pg_catalog.pg_namespace AS pn ON pn.oid = p.pronamespace
JOIN pg_catalog.pg_proc AS q ON q.oid = t.typoutput JOIN pg_catalog.pg_namespace AS qn ON qn.oid = q.pronamespace
WHERE t.oid = ANY (${oids(needs.types)})`);
  for (const row of rows) {
    const named: CatalogFunction = {
      name: row.function_name as string,
      volatility: row.volatility as string,
      nextval: row.nextval as boolean,
    };
    const oid = row.oid as string;
    if (row.entry === "function") catalog.functions.set(oid, named);
    if (row.entry === "operator") catalog.operators.set(oid, named);
    if (row.entry === "type") {
      const output = { name: row.output_name as string, volatility: row.output_volatility as string, nextval: false };
      types.set(oid, { name: row.type_name as string, input: named, output });
    }
  }
  return { ...catalog, types };
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

function fromClause(table: PublicTable): string {
  return `${table.partitioned ? "" : "ONLY "}${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
}

/** The table as DT-2 and DT-3 read it; every table reaching it passed the rules. */
function describeTable(table: CatalogTable): PublicTable {
  const key = table.columns
    .map((column, index) => ({ index, position: column.keyPosition }))
    .filter((entry): entry is { index: number; position: number } => entry.position !== null)
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.index);
  // Every column passed the rules, so its type is one of DT-1's, which the encoder takes as it is named.
  const columns = table.columns.map(
    ({ name, type, declaredType }): PublicColumn => ({ name, type: type as ColumnType, declaredType }),
  );
  return { schema: table.schema, name: table.name, partitioned: table.partitioned, columns, key };
}
