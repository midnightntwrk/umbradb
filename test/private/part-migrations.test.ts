import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import type { DatabaseParts, PglitePathParts } from "../../src/config/database-parts.js";
import {
  CATALOG_SQL,
  earlierBootstrapSql,
  earlierRefusalProblems,
  earlierRowsSql,
  type FoldedPart,
  MIGRATION_ROWS_SQL,
  THIS_BUILD,
} from "../backbone/earlier-build.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { type PrivateOptions, type PublicCore, refusalOf, startPrivate, startPublicCore } from "./builds.js";

/**
 * `core-private-source`'s one migration, through a private process bound to a public core, on PostgreSQL 18 and PGlite
 * 0.5.10 (the private process reading its public database directly on PostgreSQL, through the core's `db` item on
 * PGlite).
 *
 * - A new private database gets `core_private_source.accepted_config` (and its cursor) from `core-private-source`'s
 *   `001`, and `core_chain.identity` from `core-chain`'s: each part records one migration, `001`.
 * - A private database whose recorded migrations of `core-private-source` are an earlier build's (`001` and `002`,
 *   `../backbone/earlier-build.ts`) refuses startup with `migration-checksum-changed`, naming the part, `001` and both
 *   checksums, and runs no migration: nothing of a database the build wrote changes, and on one holding only those
 *   records no part's migration runs.
 *
 * The public process's parts are `../backbone/part-migrations.test.ts`'s.
 */

/** The private S's head: the public core's. */
const HEAD = 3n;

/** A private start's options against `core`'s public database `publicDb`, its own database `privateDb`. */
function against(backend: PrivateBackend, publicDb: TestDatabase, core: PublicCore, privateDb: TestDatabase): PrivateOptions {
  return backend.kind === "postgres"
    ? { database: privateDb.setting, publicDatabase: publicDb.readerSetting as DatabaseParts }
    : { database: privateDb.setting, direct: () => core.db() };
}

/** Runs each of `statements` on `db` as the server's login (PostgreSQL) or on its directory (PGlite), no process on it. */
async function run(backend: PrivateBackend, db: TestDatabase, statements: readonly string[]): Promise<void> {
  if (backend.kind === "postgres") {
    for (const statement of statements) await (db.exec as (sql: string) => Promise<void>)(statement);
    return;
  }
  const engine = await PGlite.create((db.setting as PglitePathParts).path);
  try {
    for (const statement of statements) await engine.query(statement);
  } finally {
    await engine.close();
  }
}

/** The rows of `core_chain.migrations` and every schema and table of a private database, from outside. */
async function stateOf(db: TestDatabase): Promise<{ readonly rows: string[]; readonly catalog: string[] }> {
  return db.read(async (read) => {
    const [table] = await read.query("SELECT to_regclass('core_chain.migrations') IS NOT NULL AS present");
    const rows = table?.present === true ? (await read.query(MIGRATION_ROWS_SQL)).map((row) => row.row as string) : [];
    const catalog = (await read.query(CATALOG_SQL)).map((row) => row.name as string);
    return { rows, catalog };
  }, privateCursorHeight);
}

/** `part`'s recorded migrations as {@link MIGRATION_ROWS_SQL} shows them. */
const shown = (part: FoldedPart): string[] => THIS_BUILD[part].map((row) => `${part}/${row.id}@${row.position}:${row.checksum}`);

describe.each(PRIVATE_BACKENDS)("core-private-source's one migration, on a private process, on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a new private database gets core_private_source.accepted_config from core-private-source's 001; an earlier " +
      "build's recorded migrations of it refuse startup with migration-checksum-changed, naming the part, 001 and both " +
      "checksums, and no migration runs",
    async () => {
      const publicDb = await backend.database("public");
      const core = await startPublicCore({ database: publicDb.setting, head: HEAD });
      try {
        // A new private database: each part's one migration, 001; the accepted hash's table from it.
        const privateDb = await backend.database("private");
        const first = await startPrivate(against(backend, publicDb, core, privateDb));
        try {
          await first.reach(HEAD);
        } finally {
          await first.stop();
        }
        const created = await stateOf(privateDb);
        for (const part of ["core-chain", "core-private-source"] as const) {
          expect(created.rows.filter((row) => row.startsWith(`${part}/`)), part).toEqual(shown(part));
        }
        expect(created.catalog).toEqual(
          expect.arrayContaining(["core_private_source.accepted_config", "core_private_source.cursor", "core_chain.identity"]),
        );
        const accepted = await privateDb.read(
          (read) => read.query("SELECT count(*)::int AS n FROM core_private_source.accepted_config"),
          privateCursorHeight,
        );
        expect(accepted).toEqual([{ n: 1 }]);

        // Its records of core-private-source an earlier build's: refused, nothing changed.
        await run(backend, privateDb, earlierRowsSql("core-private-source"));
        const rewritten = await stateOf(privateDb);
        const refusal = await refusalOf(against(backend, publicDb, core, privateDb));
        expect(refusal).toMatchObject({ state: "refused", code: "migration-checksum-changed" });
        expect(earlierRefusalProblems(refusal.error, "core-private-source")).toEqual([]);
        expect(await stateOf(privateDb)).toEqual(rewritten);

        // A database holding only an earlier build's records of core-private-source: no part's migration runs.
        const seeded = await backend.database("private");
        await run(backend, seeded, earlierBootstrapSql(["core-private-source"]));
        const before = await stateOf(seeded);
        const pending = await refusalOf(against(backend, publicDb, core, seeded));
        expect(pending).toMatchObject({ state: "refused", code: "migration-checksum-changed" });
        expect(earlierRefusalProblems(pending.error, "core-private-source")).toEqual([]);
        expect(await stateOf(seeded)).toEqual(before);
        expect(before.catalog.filter((name) => name.startsWith("core_"))).toEqual(["core_chain", "core_chain.migrations"]);
      } finally {
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
