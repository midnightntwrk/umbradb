/**
 * The catalog reads of the `deterministic_postgresql` component: what PostgreSQL's catalog says about the module
 * tables, their columns and the relations of the module schemas, in the form the column-type rules
 * (`./column-rules.ts`) take. This is the rules' input, before any rule is applied. The contents hash
 * (`src/determinism/module-tables.ts`) and the migration-time check read the same facts here, so both give the same
 * verdicts. [DT-2, DT-3, DT-6, Q69; design §4]
 *
 * **Which tables count.** Every schema of the database counts (these are the schemas the contents hash covers), except:
 *
 * - PostgreSQL's own: `pg_catalog`, `pg_toast`, the temporary schemas, and every name starting with `pg_`;
 * - `information_schema`;
 * - `public`, where extensions install their tables;
 * - `core_digest_shadow`, change capture's scratch schema, whose tables are empty whenever no block is open. [Q101]
 *
 * Of the other reserved schema names, `core_chain` and `core_digest` count. A table is an ordinary or a partitioned
 * table (`relkind` `r` or `p`). A partition is part of its partitioned table, whose rows it holds, not a table of its
 * own. Views, materialized views, sequences, composite types and foreign tables hold no rows of their own and are not
 * tables. (Why these schemas and tables: `src/determinism/module-tables.ts`.) [DT-3, DB-8]
 *
 * **How the catalog is read.** By name, never by OID or creation order:
 *
 * - schemas and tables are sorted by the bytes of their names' UTF-8 encoding [DT-3];
 * - a table's columns are in column order: its attribute numbers with dropped columns skipped, which the table's
 *   migrations fix and every database built by them shares [DT-1, DB-9];
 * - column types are the names `format_type(atttypid, NULL)` gives, the column types the value encoding knows
 *   (`integer`, `bigint[]`, …) [DT-1];
 * - the primary key's columns are in the order the key declares them (`pg_index.indkey`), which may differ from column
 *   order.
 *
 * Each column also carries its declared type, its type modifier, the kind of its type (and of an array's element), its
 * identity, and what in its default is not immutable. Every statement goes through one handle, so the catalog is read
 * from one committed state. [DB-2]
 */

import {
  type CatalogFunction,
  type CatalogType,
  type ColumnFacts,
  catalogNeeds,
  type DefaultCatalog,
  type DefaultReference,
  defaultReferences,
  notImmutableParts,
  parseExpressionTree,
  type RelationFacts,
  type TableFacts,
} from "./column-rules.js";

/**
 * A handle whose every call sees the same committed state: exactly the `query` of the database API's read handle
 * (`ReadHandle`). Its results are mapped as the database API maps them (`bigint` to `bigint`, `bytea` to `Uint8Array`,
 * `numeric` to its decimal text, `jsonb` parsed without loss; `./mapping.ts`). A `ReadHandle` and a `BlockWriteHandle`
 * are both one. [DB-2; CORE-ARCH §4.10; design §4]
 *
 * It is declared here, not taken from `src/db/api.ts`, so that the component imports nothing else from `src/`; the
 * database API and the contents hash take it from here. [A138]
 */
export interface ConsistentRead {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/** A column as the catalog describes it (the column-type rules' input), and its place in the primary key. */
export interface CatalogColumn extends ColumnFacts {
  /** Its position in the primary key's declared order (from 1, `pg_index.indkey`), or null outside the key. */
  readonly keyPosition: number | null;
}

/** A module table as the catalog describes it: the column-type rules' input, before any of them is applied. */
export interface CatalogTable extends TableFacts {
  /** A partitioned table, read whole across its partitions; an ordinary table is read with `ONLY`. */
  readonly partitioned: boolean;
  /** In column order. */
  readonly columns: readonly CatalogColumn[];
}

/**
 * The module tables of the database `read` sees, as the catalog describes them, sorted by schema name, then table
 * name, as bytes. Each has its columns in column order: their types, identity, and what in their defaults is not
 * immutable (read from the defaults' expression trees and one more catalog read, `./column-rules.ts`). Nothing is
 * refused here: this is the rules' input. [DT-3]
 */
export async function catalogTables(read: ConsistentRead, options: CatalogOptions = {}): Promise<CatalogTable[]> {
  const [filter, params] = schemaFilter(options);
  const tableRows = await read.query(`${TABLES_SQL}${filter}`, params);
  const columnRows = await read.query(`${COLUMNS_SQL}${filter}`, params);
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
 * The relations of the module schemas that are refused whatever they hold, as the catalog describes them, sorted by
 * schema name, then name, as bytes. [DT-3, DT-6, Q61]
 *
 * - Every sequence (`relkind = 'S'`), including an identity or `serial` column's own.
 * - Every unlogged table, partitioned table or partition (`relpersistence = 'u'`); a partition holds rows of its
 *   partitioned table, so it counts too.
 *
 * Each comes with the table it belongs to, whose `deterministic: false` declaration would cover it (`./opt-out.ts`).
 * [Q76]
 */
export async function catalogRelations(read: ConsistentRead, options: CatalogOptions = {}): Promise<RelationFacts[]> {
  const [filter, params] = schemaFilter(options);
  const relations = (await read.query(`${RELATIONS_SQL}${filter}`, params)).map(
    (row): RelationFacts => ({
      schema: row.schema_name as string,
      name: row.relation_name as string,
      kind: row.kind as string,
      persistence: row.persistence as string,
      belongsTo:
        row.belongs_table === null
          ? null
          : { schema: row.belongs_schema as string, table: row.belongs_table as string },
    }),
  );
  return relations.sort((a, b) => compareUtf8(a.schema, b.schema) || compareUtf8(a.name, b.name));
}

/** Which schemas a catalog read covers. */
export interface CatalogOptions {
  /**
   * Only these schemas (the startup check reads a module's own); every module schema when absent. A name outside the
   * module schemas (`public`, `pg_*`, `information_schema`, `core_digest_shadow`) still gives nothing. [DT-6]
   */
  readonly schemas?: readonly string[];
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The condition {@link CatalogOptions.schemas} adds to a catalog read (on `n`, the relation's schema), and its parameters. */
function schemaFilter(options: CatalogOptions): [string, unknown[] | undefined] {
  if (options.schemas === undefined) return ["", undefined];
  return ["\n  AND n.nspname = ANY($1::text[])", [options.schemas]];
}

/**
 * The module schemas (the schemas the contents hash covers), as a condition on `n`, a relation's schema. Every schema
 * counts except PostgreSQL's own (`pg_*`), `information_schema`, the reserved `public`, and change capture's scratch
 * schema `core_digest_shadow`. Its shadow tables are empty at rest and their layout is UmbraDB's, so a release that
 * changes it keeps contents hashes comparable. This holds for the core's database and a private process's alike.
 * [DT-3, Q75, Q101]
 *
 * `core_chain` and `core_digest` are module schemas here: the hash covers the digests. Both catalog reads take their
 * schemas from this condition, so the tables and the relations the rules see come from the same schemas.
 */
const MODULE_SCHEMA_FILTER = `n.nspname NOT IN ('core_digest_shadow', 'information_schema', 'public')
  AND left(n.nspname::text, 3) <> 'pg_'`;

/** Module tables: ordinary or partitioned tables that are not partitions, in the module schemas. */
const MODULE_TABLE_FILTER = `
  c.relkind IN ('r', 'p') AND NOT c.relispartition
  AND ${MODULE_SCHEMA_FILTER}`;

const TABLES_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS table_name, c.relkind = 'p' AS partitioned
FROM pg_catalog.pg_class AS c
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
WHERE ${MODULE_TABLE_FILTER}`;

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
WHERE ${MODULE_TABLE_FILTER} AND a.attnum > 0 AND NOT a.attisdropped`;

/** `attidentity`: `a` for GENERATED ALWAYS AS IDENTITY, `d` for BY DEFAULT, empty for no identity. */
const IDENTITY: Readonly<Record<string, "always" | "by default">> = { a: "always", d: "by default" };

/**
 * Sequences and unlogged tables (partitions included) of the module schemas. Each comes with the table it belongs to:
 * a table's own, or the sequence's owning table (the column dependency that an identity column, `deptype` `i`, or
 * `serial` and `OWNED BY`, `a`, records in `pg_depend`), taken at the root of its partition tree (`pg_partition_root`,
 * null for a table in none). [design §4]
 */
const RELATIONS_SQL = `
SELECT n.nspname::text AS schema_name, c.relname::text AS relation_name, c.relkind::text AS kind,
       c.relpersistence::text AS persistence, bn.nspname::text AS belongs_schema, bc.relname::text AS belongs_table
FROM pg_catalog.pg_class AS c
JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
CROSS JOIN LATERAL (
  SELECT CASE WHEN c.relkind = 'S' THEN (
           SELECT d.refobjid FROM pg_catalog.pg_depend AS d
            WHERE d.classid = 'pg_catalog.pg_class'::pg_catalog.regclass AND d.objid = c.oid
              AND d.refclassid = 'pg_catalog.pg_class'::pg_catalog.regclass AND d.refobjsubid > 0
              AND d.deptype IN ('a', 'i'))
         ELSE c.oid END AS owner) AS o
LEFT JOIN pg_catalog.pg_class AS bc ON bc.oid = coalesce(pg_catalog.pg_partition_root(o.owner), o.owner)
LEFT JOIN pg_catalog.pg_namespace AS bn ON bn.oid = bc.relnamespace
WHERE (c.relkind = 'S' OR (c.relkind IN ('r', 'p') AND c.relpersistence = 'u'))
  AND ${MODULE_SCHEMA_FILTER}`;

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

/**
 * Orders strings by the bytes of their UTF-8 encodings (JavaScript's `<` compares UTF-16 code units instead). This is
 * the order of schemas and tables in the contents hash, which change capture and the digests follow too. [DT-3]
 */
export function compareUtf8(a: string, b: string): number {
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
