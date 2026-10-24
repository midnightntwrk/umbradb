/**
 * The `TRUNCATE` refusal of DB-14, applied (`openspec/changes/core-arch/design.md` §4, "`TRUNCATE`"): the
 * `deterministic_postgresql` component holds the trigger, its function, the migration mark and the rule of which tables
 * it guards (`../deterministic-postgresql/block-transactions.ts`); this file runs them in a transaction of the database
 * API. {@link guardTables} runs at every startup after the migrations (task 2.4), because a migration can add tables;
 * {@link markMigration} runs first in each migration's transaction, the only transactions in which `TRUNCATE` of a
 * guarded table is allowed (A73).
 */

import {
  type GuardTableRow,
  MARK_MIGRATION_SQL,
  TRUNCATE_GUARD_FUNCTION_SQL,
  TRUNCATE_GUARD_TABLES_SQL,
  truncateGuardStatements,
} from "../deterministic-postgresql/index.js";
import type { Transaction } from "./api.js";
import type { SchemaPlan } from "./roles.js";

/**
 * Creates (or replaces) the trigger function in `core_chain`, which `prepareSchemas` (`./roles.ts`) creates, then
 * attaches the trigger to every table and partition of the plan's schemas that is not declared `deterministic: false`
 * and lacks it, and removes it from those that are. Run by the writer's login, which owns the function and inherits
 * every module role (`./roles.ts`).
 */
export async function guardTables(tx: Transaction, plan: SchemaPlan): Promise<void> {
  await tx.execute(TRUNCATE_GUARD_FUNCTION_SQL);
  const tables = await tx.query(TRUNCATE_GUARD_TABLES_SQL, [plan.schemas.map((schema) => schema.name)]);
  for (const statement of truncateGuardStatements(tables as unknown as GuardTableRow[], plan.optedOut)) {
    await tx.execute(statement);
  }
}

/** Marks the transaction as a migration's, so that `TRUNCATE` of a guarded table is allowed in it (A73). */
export async function markMigration(tx: Transaction): Promise<void> {
  await tx.query(MARK_MIGRATION_SQL);
}
