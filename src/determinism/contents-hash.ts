/**
 * The contents hash: SHA-256 of one canonical CBOR array. For each module schema, and then each table, in name order
 * (byte order), it holds the array `[schema, table, [column names], [rows in primary-key order]]`, each row in its
 * canonical encoding (`encodeRow`). [DT-1, DT-3]
 *
 * Which tables count, how the catalog is read and why one handle reads one snapshot: `./module-tables.ts`. The array
 * is never built in memory: each table's row count is read first (the same snapshot), so the head of its row array
 * can be written before its rows, and the rows are hashed as they stream from the database.
 */

import { createHash } from "node:crypto";
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

/**
 * The contents hash (32 bytes) of the database `read` sees. [DT-3]
 *
 * The tables that `options.optedOut` names (those declared `deterministic: false`, the schema plan's `optedOut`) are
 * recorded by name only, as `[schema, table, null, null]`. So two databases that differ only in such a table's rows
 * hash equal, and one without the table hashes differently. Without the list, every table is read, and the rules refuse
 * such a table as any other. [MD-1, Q76]
 */
export async function contentsHash(
  read: ConsistentRead,
  options: PageOptions & ModuleTableOptions = {},
): Promise<Uint8Array> {
  const tables = await moduleTables(read, options);
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
