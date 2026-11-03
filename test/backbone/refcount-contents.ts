import { declaredOptOuts } from "../../src/cli/configured.js";
import type { ReadHandle } from "../../src/db/api.js";
import { SHADOW_SCHEMA } from "../../src/db/change-capture.js";
import { contentsHash as hashByBytes } from "../../src/determinism/contents-hash.js";
import { contentsHash } from "../../src/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { chainDeclarations } from "./chain-build.js";
import { watched, watcher } from "./ingest-harness.js";
import { nodeSet } from "./refcount-model.js";
import { seenTables, sweepCore, sweepWatcher, type TableSnapshot } from "./sweep-tapes.js";

/**
 * What the reclamation tests compare between databases the DAG fixture's process wrote (`./refcount-process.ts`): the
 * contents hash as the build computes it (the exported `contentsHash`, which takes `core-ledger-state`'s node tables
 * by their content), the tables it takes by their bytes, each read whole through this file's own queries, and a
 * table snapshot's node set. Imports nothing of Vitest. [R15, R17, DT-3, LG-11]
 */

/** A database read through the database API: a backup test's database (`../backup/backup-fixtures.ts`). */
export interface ReadableDatabase {
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
}

/** `core-ledger-state`'s content-defined tables. */
export const CONTENT_DEFINED_TABLES: readonly string[] = ["nodes", "ref_counts", "unreferenced"];

/**
 * The tables declared `deterministic: false` by the DAG fixture's process — the ledger's core modules, the ingest's
 * watcher, the fixture's watcher and `user` — which the contents hash records by name only. [DT-3, MD-1]
 */
export function dagOptedOut(user: readonly ModuleDeclaration[] = []): { schema: string; table: string }[] {
  const modules = [watcher(watched()), sweepWatcher(seenTables()), ...user];
  return declaredOptOuts(validateDeclarations(chainDeclarations(modules, { core: sweepCore() })));
}

const hexOf = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** The contents hash of `db` as the build computes it (the package's export), `0x` hex. [DT-3, LG-11] */
export function buildContentsHash(db: ReadableDatabase, optedOut: readonly { schema: string; table: string }[]): Promise<string> {
  return db.read(async (read) => hexOf(await contentsHash(read, { optedOut })));
}

/** The contents hash of `db` with every table taken by its bytes (no content-defined table), `0x` hex. [DT-3] */
export function bytesContentsHash(db: ReadableDatabase, optedOut: readonly { schema: string; table: string }[]): Promise<string> {
  return db.read(async (read) => hexOf(await hashByBytes(read, { optedOut })));
}

/**
 * Every ordinary or partitioned table of the module schemas (not PostgreSQL's own, `information_schema`, `public` or
 * change capture's scratch schema), a partition counted with its table, by name.
 */
const MODULE_TABLES_SQL = `SELECT n.nspname AS s, c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND left(n.nspname, 3) <> 'pg_'
    AND n.nspname NOT IN ('information_schema', 'public', '${SHADOW_SCHEMA}')
  ORDER BY 1, 2`;

/**
 * The tables the contents hash takes by their bytes — every module table but `core-ledger-state`'s content-defined
 * ones and those `optedOut` names — each as the MD5 of its rows' text in order, by `schema.table`. [R15, DT-3]
 */
export function byteHashedTables(db: ReadableDatabase, optedOut: readonly { schema: string; table: string }[]): Promise<Map<string, string>> {
  return db.read(async (read) => {
    const digests = new Map<string, string>();
    for (const { s, t } of await read.query(MODULE_TABLES_SQL)) {
      const [schema, table] = [s as string, t as string];
      if (schema === "core_ledger_state" && CONTENT_DEFINED_TABLES.includes(table)) continue;
      if (optedOut.some((out) => out.schema === schema && out.table === table)) continue;
      const [row] = await read.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM "${schema}"."${table}" r`);
      digests.set(`${schema}.${table}`, row?.d as string);
    }
    return digests;
  });
}

/** A snapshot's node set (its rows' keys and the keys of every node they embed), sorted. [design §1] */
export const nodeSetOf = (tables: TableSnapshot): string[] => [...nodeSet(tables.rows)].sort();

/** A snapshot's `core_ledger_state` tables that are not content-defined, by name, each its rows' MD5. [R15, DT-3] */
export const byteDigestsOf = (tables: TableSnapshot): [string, string][] =>
  [...tables.digests].filter(([table]) => !CONTENT_DEFINED_TABLES.includes(table));
