/**
 * The contents hash: SHA-256 of one canonical CBOR array. For each module schema, and then each table, in name order
 * (byte order), it holds the array `[schema, table, [column names], [rows in primary-key order]]`, each row in its
 * canonical encoding (`encodeRow`). [DT-1, DT-3]
 *
 * Which tables count, how the catalog is read and why one handle reads one snapshot: `./module-tables.ts`. The array
 * is never built in memory: each table's row count is read first (the same snapshot), so the head of its row array
 * can be written before its rows, and the rows are hashed as they stream from the database.
 *
 * **Content-defined tables** take part by what they hold rather than by their bytes: a table the build declares so
 * ({@link ContentDefinedTables}, the schema plan's `contentDefined`) appears as its content function gives it, in the
 * place its name gives it among the others. The function reads, through the hash's own handle, whatever it needs of
 * the snapshot, and can fail the computation; it is called once per hash for all the tables it gives. Such a table
 * still follows the determinism rules, which `./module-tables.ts` applies to every table that is not opted out.
 * [DT-3, LG-11]
 */

import { createHash, type Hash } from "node:crypto";
import { type ColumnType, explain, valueFailureBecause } from "../deterministic-postgresql/index.js";
import { CanonicalEncodingError, encodeArrayHead, encodeCanonical, encodeRow } from "./cbor.js";
import {
  type ConsistentRead,
  countRows,
  type PageOptions,
  type ModuleColumn,
  ModuleContentsError,
  type ModuleTableOptions,
  type ModuleTable,
  moduleTables,
  rowsInKeyOrder,
} from "./module-tables.js";

/** A content-defined table's part of the contents hash: its columns, then its rows in the order given. [DT-3] */
export interface TableContent {
  /** The columns, by the names the hash records and the column types the canonical encoding takes for them. */
  readonly columns: readonly { readonly name: string; readonly type: ColumnType }[];
  /** Each row's values, in column order. */
  readonly rows: readonly (readonly unknown[])[];
}

/**
 * Gives the content of a group of content-defined tables, read through `read` alone (the hash's snapshot): for each
 * table, its {@link TableContent}, or null for a table recorded by name only, `[schema, table, null, null]`. It may
 * throw, which fails the computation; `options.pageSize` is the hash's. [DT-3]
 */
export type ContentFunction = (
  read: ConsistentRead,
  options: PageOptions,
) => Promise<ReadonlyMap<string, TableContent | null>>;

/** Tables of one schema that take part in the contents hash by their content, and the function that gives it. [DT-3] */
export interface ContentDefinedTables {
  readonly schema: string;
  readonly tables: readonly string[];
  readonly content: ContentFunction;
}

/** Which tables the contents hash takes by their content. */
export interface ContentOptions {
  /**
   * The content-defined tables (the schema plan's `contentDefined`); a table no group names is read by its rows, and a
   * group whose tables the database does not hold changes nothing. [DT-3, LG-11]
   */
  readonly contentDefined?: readonly ContentDefinedTables[];
}

/**
 * The contents hash (32 bytes) of the database `read` sees. [DT-3]
 *
 * The tables that `options.optedOut` names (those declared `deterministic: false`, the schema plan's `optedOut`) are
 * recorded by name only, as `[schema, table, null, null]`. So two databases that differ only in such a table's rows
 * hash equal, and one without the table hashes differently. Without the list, every table is read, and the rules refuse
 * such a table as any other. [MD-1, Q76]
 *
 * The tables that `options.contentDefined` names appear as their content functions give them (see the module
 * comment); a table also opted out is recorded by name only. [DT-3, LG-11]
 */
export async function contentsHash(
  read: ConsistentRead,
  options: PageOptions & ModuleTableOptions & ContentOptions = {},
): Promise<Uint8Array> {
  const tables = await moduleTables(read, options);
  const groups = new Map<string, ContentDefinedTables>();
  for (const group of options.contentDefined ?? []) {
    for (const table of group.tables) {
      const key = JSON.stringify([group.schema, table]);
      if (!groups.has(key)) groups.set(key, group);
    }
  }
  const contents = new Map<ContentDefinedTables, ReadonlyMap<string, TableContent | null>>();
  const page: PageOptions = options.pageSize === undefined ? {} : { pageSize: options.pageSize };
  const hash = createHash("sha256");
  hash.update(encodeArrayHead(tables.length));
  for (const table of tables) {
    hash.update(encodeArrayHead(4));
    hash.update(encodeCanonical(table.schema));
    hash.update(encodeCanonical(table.name));
    if (table.deterministic === false) {
      hash.update(encodeCanonical(null));
      hash.update(encodeCanonical(null));
      continue;
    }
    const group = groups.get(JSON.stringify([table.schema, table.name]));
    if (group !== undefined) {
      let content = contents.get(group);
      if (content === undefined) {
        content = await group.content(read, page);
        contents.set(group, content);
      }
      hashContent(hash, group, table, content);
      continue;
    }
    const count = await countRows(read, table);
    hash.update(encodeCanonical(table.columns.map((column) => column.name)));
    hash.update(encodeArrayHead(count));
    const types = table.columns.map((column) => column.type);
    let rows = 0;
    for await (const row of rowsInKeyOrder(read, table, options)) {
      hash.update(encodeTableRow(table, types, row));
      rows++;
    }
    if (rows !== count) {
      throw new ModuleContentsError(
        "row-count-changed",
        { schema: table.schema, table: table.name },
        null,
        `counted ${count} rows, then read ${rows}: the handle did not read one snapshot`,
      );
    }
  }
  return new Uint8Array(hash.digest());
}

/** Hashes a content-defined table as its group's content gives it (see the module comment). [DT-3] */
function hashContent(
  hash: Hash,
  group: ContentDefinedTables,
  table: ModuleTable,
  content: ReadonlyMap<string, TableContent | null>,
): void {
  const given = content.get(table.name);
  if (given === undefined) {
    const named = group.tables.map((name) => `${group.schema}.${name}`).join(", ");
    throw new Error(`the content function of ${named} gave nothing for ${table.schema}.${table.name}`);
  }
  if (given === null) {
    hash.update(encodeCanonical(null));
    hash.update(encodeCanonical(null));
    return;
  }
  hash.update(encodeCanonical(given.columns.map((column) => column.name)));
  hash.update(encodeArrayHead(given.rows.length));
  const types = given.columns.map((column) => column.type);
  for (const row of given.rows) hash.update(encodeRow(row, types));
}

/**
 * A row's canonical encoding. A value that cannot be encoded fails naming the table, the column and its declared type,
 * the row by its primary key, and what is wrong. For a number a stored value can hold (a `numeric` fraction or `NaN`,
 * a `jsonb` number outside the 64-bit integers), it also says why, and what to store instead (the
 * `deterministic_postgresql` component's `valueFailureBecause`). [DT-1]
 */
function encodeTableRow(table: ModuleTable, types: readonly ColumnType[], row: unknown[]): Uint8Array {
  try {
    return encodeRow(row, types);
  } catch (cause) {
    if (!(cause instanceof CanonicalEncodingError)) throw cause;
    // A row's values and types are equally many here, so the path starts with the failing column's index (`$[2]…`).
    const column = table.columns[Number.parseInt(cause.path.slice(2), 10)] as ModuleColumn;
    const keyNames = table.key.map((index) => (table.columns[index] as ModuleColumn).name).join(", ");
    const keyValues = table.key.map((index) => renderKeyValue(row[index])).join(", ");
    const because = valueFailureBecause(column.type, cause.reason);
    const detail =
      `the row with primary key (${keyNames}) = (${keyValues}) cannot be encoded: ${cause.message}` +
      (because === null ? "" : `. ${explain(because)}`);
    const place = { schema: table.schema, table: table.name };
    throw new ModuleContentsError("unencodable-row", place, column, detail, { cause });
  }
}

/** A key value for a message: text quoted as JSON, bytes as PostgreSQL's `\x…` hex, numbers and booleans as such. */
function renderKeyValue(value: unknown): string {
  if (value instanceof Uint8Array) {
    return `\\x${Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}
