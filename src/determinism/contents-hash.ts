/**
 * The contents hash of DT-3 (`openspec/changes/core-arch/specs/determinism/spec.md`): SHA-256 of one canonical CBOR
 * array holding, for each public schema and then each table in name order (byte order), the array
 * `[schema, table, [column names], [rows in primary-key order]]`, each row encoded as DT-1 encodes it.
 *
 * Which tables count, how the catalog is read and why one handle reads one snapshot: `./public-tables.ts`. The array
 * is never built in memory: each table's row count is read first (the same snapshot), so the head of its row array
 * can be written before its rows, and the rows are hashed as they stream from the database.
 */

import { createHash } from "node:crypto";
import { CanonicalEncodingError, type ColumnType, encodeArrayHead, encodeCanonical, encodeRow } from "./cbor.js";
import {
  type ConsistentRead,
  countRows,
  type PageOptions,
  type PublicColumn,
  PublicContentsError,
  type PublicTable,
  publicTables,
  rowsInKeyOrder,
} from "./public-tables.js";

/** The contents hash (32 bytes) of the database `read` sees, as DT-3 defines it. */
export async function contentsHash(read: ConsistentRead, options: PageOptions = {}): Promise<Uint8Array> {
  const tables = await publicTables(read);
  const hash = createHash("sha256");
  hash.update(encodeArrayHead(tables.length));
  for (const table of tables) {
    const count = await countRows(read, table);
    hash.update(encodeArrayHead(4));
    hash.update(encodeCanonical(table.schema));
    hash.update(encodeCanonical(table.name));
    hash.update(encodeCanonical(table.columns.map((column) => column.name)));
    hash.update(encodeArrayHead(count));
    const types = table.columns.map((column) => column.type);
    let rows = 0;
    for await (const row of rowsInKeyOrder(read, table, options)) {
      hash.update(encodeTableRow(table, types, row, rows));
      rows++;
    }
    if (rows !== count) {
      throw new PublicContentsError(
        "row-count-changed",
        table.schema,
        table.name,
        null,
        `counted ${count} rows, then read ${rows}: the handle did not read one snapshot (DB-2)`,
      );
    }
  }
  return new Uint8Array(hash.digest());
}

function encodeTableRow(table: PublicTable, types: readonly ColumnType[], row: unknown[], index: number): Uint8Array {
  try {
    return encodeRow(row, types);
  } catch (cause) {
    if (!(cause instanceof CanonicalEncodingError)) throw cause;
    // A row's values and types are equally many here, so the path starts with the failing column's index (`$[2]…`).
    const column = table.columns[Number.parseInt(cause.path.slice(2), 10)] as PublicColumn;
    throw new PublicContentsError(
      "unencodable-row",
      table.schema,
      table.name,
      column.name,
      `row ${index} in primary-key order: ${cause.message}`,
      { cause },
    );
  }
}
