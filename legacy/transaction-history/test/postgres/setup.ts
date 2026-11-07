import { afterAll, beforeAll } from "vitest";
import type { UmbraDBSql } from "../../../../src/postgres/client.js";
import { runMigrations } from "../../../../src/postgres/migrate.js";
import * as migration000 from "../../../../src/postgres/migrations/000_schema.js";
import {
  getTestContainer, startTestDatabase as startTier1Database, stopTestDatabase, TEST_SCHEMA,
} from "../../../../test/postgres/setup.js";
import * as migration004 from "../../src/postgres/migrations/004_transaction_history.js";

/**
 * The moved tests' database (core-arch task 17.1, LS-3): the repository's `test/postgres/setup.ts` container and
 * 0.9.5's `tier1_wallet` migrations, plus TransactionHistory's own table. Migration 004 left that lineage with the
 * source (`src/postgres/migrate.ts`), so a database started for the moved tests applies it after the lineage, through
 * the same runner and its `migrations` option: the lineage's `000_schema` (already applied) and then
 * `004_transaction_history`, recorded in `<schema>._migrations` as before. The moved tests import this file at the
 * relative path they always used (`./setup.js`, `../postgres/setup.js`), so they are unchanged.
 */

export { stopTestDatabase, TEST_SCHEMA };

export async function startTestDatabase(): Promise<UmbraDBSql> {
  const sql = await startTier1Database();
  await runMigrations(sql, { schema: TEST_SCHEMA, migrations: [migration000, migration004] });
  return sql;
}

/** As `test/postgres/setup.ts`'s `registerSuiteLifecycle`, on a database that has TransactionHistory's table. */
export function registerSuiteLifecycle(): { sql: () => UmbraDBSql; connectionUri: () => string } {
  let sql: UmbraDBSql;
  beforeAll(async () => {
    sql = await startTestDatabase();
  }, 120_000);
  afterAll(async () => {
    await stopTestDatabase();
  }, 60_000);
  return { sql: () => sql, connectionUri: () => getTestContainer().getConnectionUri() };
}
