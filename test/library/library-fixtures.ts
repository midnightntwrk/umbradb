import { z } from "zod";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { coreEntry } from "../../src/config/entries.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { defineModule } from "../../src/modules/declaration.js";
import type { UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { coreSettings } from "../runner/process-build.js";

/**
 * What the library's tests share: a user module of the command's build, the configuration data of a process on a
 * database, and waits on a handle. The configuration is the tests' network (`coreSettings`: a `custom` network whose
 * genesis is the in-memory chain's block 0, its ledger table, the development opt-in, a node that is never contacted
 * with an in-memory `source`).
 */

/** PGlite in memory, the third database of the library's guarantees. */
export const PGLITE_MEMORY: DatabaseParts = Object.freeze({ kind: "pglite", memory: true }) as DatabaseParts;

/**
 * A user module `id` of the command's build: on `on-db-write` it stores each height in `<id>.rows` and, when `seen` is
 * given, notes it there; `rest` replaces parts of the declaration (its points, its migrations).
 */
export function rowsModule(id: string, seen?: string[], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  const schema = id.replaceAll("-", "_");
  return defineModule({
    id,
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: `${id}-rows`, lifetimes: ["table"], table: { schema, tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY)` }],
    points: {
      async "on-db-write"(_p, b, w) {
        seen?.push(`${id} ${b.height}`);
        await w.execute(`INSERT INTO ${schema}.rows (height) VALUES ($1)`, [b.height]);
      },
    },
    ...rest,
  } as ModuleDeclaration);
}

/**
 * The configuration data of a public process on `database` from `start`, with an entry for each of `modules` from
 * `start`; `extra` adds to the `core` entry's settings.
 */
export function libraryData(
  database: DatabaseParts,
  modules: readonly Pick<ModuleDeclaration, "id" | "version">[] = [],
  extra: Readonly<Record<string, unknown>> = {},
  start = 1,
): { readonly entries: readonly unknown[] } {
  return {
    entries: [
      coreEntry({ start, config: coreSettings(database, extra) as never }),
      ...modules.map((module) => ({ id: module.id, start, version: module.version, config: {} })),
    ],
  };
}

/** Waits until `handle`'s cursor is `height`, or rejects when processing ended first or after `ms`. */
export async function cursorReaches(handle: UmbraDBHandle, height: bigint, ms = 120_000): Promise<void> {
  const until = Date.now() + ms;
  for (;;) {
    const status = handle.status();
    if (status.cursor === height) return;
    if (status.ended !== null) throw new Error(`processing ended (${status.ended.kind}) at ${status.cursor}`);
    if (Date.now() > until) throw new Error(`the cursor is ${status.cursor}, not ${height}, after ${ms} ms`);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
