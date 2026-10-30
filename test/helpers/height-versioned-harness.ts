import type { ReadHandle } from "../../src/db/api.js";
import {
  type HeightVersionedTable,
  heightVersionedTable,
  type VersionedValue,
} from "../../src/helpers/height-versioned.js";
import type { Migration, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TestBackend } from "../db/backends.js";
import { declaration } from "../modules/declarations.js";
import { type HelperDatabase, helperDatabase, TOKEN_SCAN } from "./cursor-harness.js";

/**
 * What the height-versioned table's tests share. [SH-2, SH-3, A60, A61]
 *
 * A database on each backend, started as the cursor table's is (`cursor-harness.ts`' {@link helperDatabase}:
 * `core-block-commit`, the modules, the real `core-digest`, blocks through the real block write handles). Its test
 * modules are:
 * - `token-metadata`, which keeps a token's metadata as of a height in the helper's tables, as in the spec's example;
 *   [CORE-ARCH §4.11a; FEATURES F4]
 * - `token-scan`, another module, which writes nothing of its own.
 *
 * `token-metadata` also holds three negative controls, each the helper's tables with one change to the migration's SQL,
 * read and written through the helper's own functions:
 * - `overlaps` closes a version one height late, so it overlaps the next;
 * - `gaps` closes it one height early (its `CHECK` relaxed so that the early end is stored), leaving heights where the
 *   key was not deleted yet reads nothing;
 * - `lenient` lets a second change of a key in one block through, overwriting the block's first one: the
 *   one-change-per-block rule left out. [SH-3]
 *
 * The height-versioned property must fail on the first two, and the one-change-per-block check on the third.
 * [A60, A61]
 */

/** The height-versioned table of `token-metadata`, in its own schema. */
export const METADATA: HeightVersionedTable = heightVersionedTable({ schema: "token_metadata", table: "metadata" });

/** The role `token-metadata` writes under. [DB-6] */
export const TOKEN_METADATA_ROLE = "umbradb_m_token_metadata";

/** A negative control: the helper's functions over a table whose migration's SQL had `edits` applied. */
export interface Control {
  readonly table: HeightVersionedTable;
  migration(id: string): Migration;
}

/** `heightVersionedTable` for `table`, its migration's SQL with each edit applied, where each `from` occurs once. */
function control(table: string, edits: readonly (readonly [string | RegExp, string])[]): Control {
  const helper = heightVersionedTable({ schema: "token_metadata", table });
  let sql = helper.migration("001").sql;
  for (const [from, to] of edits) {
    const pattern = typeof from === "string" ? from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : from.source;
    const found = sql.match(new RegExp(pattern, "g")) ?? [];
    if (found.length !== 1) throw new Error(`control ${table}: ${String(from)} occurs ${found.length} times, not once`);
    sql = sql.replace(new RegExp(pattern), () => to);
  }
  return { table: helper, migration: (id) => ({ id, sql }) };
}

/** Where the trigger closes a version: at the height of the change. */
const CLOSES_AT_HEIGHT = "VALUES (k, OLD.from_height, height, OLD.value)";

/** Negative control for the property: a version closes one height after the change, so it overlaps the next. [A60] */
export const OVERLAPS: Control = control("overlaps", [
  [CLOSES_AT_HEIGHT, "VALUES (k, OLD.from_height, height + 1, OLD.value)"],
]);

/**
 * Negative control for the property: a version closes one height before the change, so the key reads nothing in
 * between. [A60]
 */
export const GAPS: Control = control("gaps", [
  [CLOSES_AT_HEIGHT, "VALUES (k, OLD.from_height, height - 1, OLD.value)"],
  ["CHECK (from_height < to_height)", "CHECK (from_height <= to_height)"],
]);

/**
 * Negative control for the one-change-per-block check: a second change of a key in one block overwrites the first,
 * because the refusal is left out. [A61, SH-3]
 */
export const LENIENT: Control = control("lenient", [
  [
    /RAISE EXCEPTION USING ERRCODE = 'unique_violation'[\s\S]*?k, height\);/,
    "IF TG_OP = 'DELETE' THEN RETURN OLD; END IF; RETURN NEW;",
  ],
]);

/** `token-metadata`: a module keeping token metadata as of each height in the helper's tables, and the controls. */
export function tokenMetadata(points: ModuleDeclaration["points"] = {}): ModuleDeclaration {
  return declaration("token-metadata", {
    provides: [
      {
        name: "token-metadata-versions",
        lifetimes: ["table"],
        table: { schema: "token_metadata", tables: [METADATA.table, METADATA.historyTable], kind: "mutable" },
      },
    ],
    migrations: [METADATA.migration("001"), OVERLAPS.migration("002"), GAPS.migration("003"), LENIENT.migration("004")],
    points,
  });
}

/** A database on `backend` started with `token-metadata` and `token-scan`; its blocks run `token-metadata`. */
export async function versionedDatabase(backend: TestBackend): Promise<HelperDatabase> {
  return helperDatabase(backend, [tokenMetadata(), TOKEN_SCAN]);
}

/** One version of a key as the tables hold it: `[from, to)`, `to` null for the current version. */
export interface StoredVersion {
  readonly from: bigint;
  readonly to: bigint | null;
  readonly value: VersionedValue;
}

/** Every version of `key` in `table`'s two tables, by `from`: the closed ones of the history, then the current one. */
export async function versionsOf(
  read: Pick<ReadHandle, "query">,
  table: HeightVersionedTable,
  key: string,
): Promise<StoredVersion[]> {
  const rows = await read.query(
    `SELECT from_height, to_height, value FROM "${table.schema}"."${table.historyTable}" WHERE key = $1 ` +
      `UNION ALL SELECT from_height, NULL::bigint, value FROM "${table.schema}"."${table.table}" WHERE key = $1 ` +
      "ORDER BY 1, 2 NULLS LAST",
    [key],
  );
  return rows.map((row) => ({
    from: row.from_height as bigint,
    to: (row.to_height as bigint | null) ?? null,
    value: row.value as VersionedValue,
  }));
}
