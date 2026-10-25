/**
 * DT-6 applied at startup (`openspec/changes/core-arch/specs/determinism/spec.md` DT-6, `design.md` §4 "Column types and
 * stored values" and "Migrations and setup"; owner decisions Q57, Q58, Q61, Q75, Q76): the refusal of module tables the
 * determinism rules refuse, and the `jsonb` and `numeric` `CHECK`s. The rules, their detection and their messages are
 * the `deterministic_postgresql` component's (`../deterministic-postgresql/column-rules.ts`, `catalog.ts`, `checks.ts`,
 * `opt-out.ts`, tasks 1.3, 1.4, 3.1); this file runs them in transactions of the database API, and the migration runner
 * (`./migrate.ts`) decides when:
 *
 * - **In each migration's transaction**, after its SQL and before its record, {@link refuseNonDeterministic} reads the
 *   tables and relations of the schemas the part writes and refuses with the first of their refusals — so a migration
 *   that creates a table the rules refuse rolls back like a migration that fails: nothing of it is applied or recorded,
 *   startup refuses with the rule's code, and the same build with the migration fixed starts, since a migration that
 *   was never recorded has no checksum to keep. Each migration leaves its part's tables deterministic.
 * - **After the part's pending migrations, before its `on-start-db`**, at every startup, the same check over the same
 *   schemas: a table no migration of this startup created — an operator's, or one whose item no longer declares
 *   `deterministic: false` — refuses startup too; then {@link attachIntegerChecks} gives each `jsonb`, `numeric` and
 *   array-of-either column of the part's tables its `CHECK`, and removes them from the tables declared
 *   `deterministic: false`. The functions they call are created first, in the bootstrap ({@link createCheckFunctions}).
 *
 * Which schemas are a part's: the schema its role writes (its own, or a shared item's, Q89) and its own. Every schema
 * of a plan is one of these for some module of it, so each is checked with the part that writes it, after that part's
 * migrations. UmbraDB's own parts (`core-chain`, `core-digest`) write reserved schemas no rule covers. A table the
 * rules skip — declared `deterministic: false`, with its partitions and the sequences its columns own (`optOut`) — is
 * neither refused nor given a `CHECK`.
 */

import {
  CHECK_FUNCTIONS_SQL,
  catalogRelations,
  catalogTables,
  databaseRefusals,
  INTEGER_CHECKS_SQL,
  type IntegerCheckRow,
  integerCheckStatements,
  refusalMessage,
} from "../deterministic-postgresql/index.js";
import type { Transaction } from "./api.js";
import { UmbraError } from "./errors.js";
import type { SchemaPlan } from "./roles.js";

/** The migration whose transaction a check runs in: its id and its place in the part's list, from 1. */
export interface CheckedMigration {
  readonly id: string;
  readonly position: number;
}

/**
 * The schemas whose tables are `part`'s to check: the one its role writes and its own, once each; none for a part that
 * is not a module of the plan (UmbraDB's own parts).
 */
export function partSchemas(plan: SchemaPlan, part: string): string[] {
  const own = plan.schemas.find((schema) => "module" in schema.of && schema.of.module === part);
  if (own === undefined) return [];
  const written = plan.writeSchema(part);
  return written === own.name ? [own.name] : [written, own.name];
}

/** Creates (or replaces) `core_chain`'s `CHECK` functions; run by the writer's login in the bootstrap, at every startup. */
export async function createCheckFunctions(tx: Transaction): Promise<void> {
  for (const statement of CHECK_FUNCTIONS_SQL) await tx.execute(statement);
}

/**
 * Refuses, with the first refusal of the determinism rules (DT-6), the tables and relations of `schemas` that the rules
 * refuse and the plan's opt-out does not cover: the code is the rule's (`no-primary-key`, `unsupported-key-type`,
 * `unsupported-column-type`, `non-deterministic-column`, `non-deterministic-table`; `design.md` §11), the message the
 * contents hash's for the same table with the module `part` named first, and the details say where — and, inside a
 * migration's transaction, which migration. Not retryable.
 */
export async function refuseNonDeterministic(
  tx: Transaction,
  plan: SchemaPlan,
  part: string,
  schemas: readonly string[],
  migration?: CheckedMigration,
): Promise<void> {
  if (schemas.length === 0) return;
  const tables = await catalogTables(tx, { schemas });
  const relations = await catalogRelations(tx, { schemas });
  const [first] = databaseRefusals(tables, relations, { optedOut: plan.optedOut });
  if (first === undefined) return;
  const { refusal, place } = first;
  throw new UmbraError(
    refusal.code,
    refusalMessage(refusal, { module: part, ...place }),
    {
      module: part,
      schema: place.schema,
      table: "table" in place ? place.table : null,
      sequence: "sequence" in place ? place.sequence : null,
      column: refusal.column?.name ?? null,
      declaredType: refusal.column?.declaredType ?? null,
      ...(migration === undefined ? {} : { migration: migration.id, position: migration.position }),
    },
  );
}

/**
 * Gives every `jsonb`, `numeric`, `jsonb[]` and `numeric[]` column of the tables of `schemas` that are not opted out the
 * `CHECK` that backs DT-6 (`integerCheckStatements`), and drops the database API's `CHECK`s from the opted-out ones. Run
 * by the writer's login, which inherits every module role and so may alter their tables. Adding a `CHECK` checks the
 * rows the table holds.
 */
export async function attachIntegerChecks(tx: Transaction, plan: SchemaPlan, schemas: readonly string[]): Promise<void> {
  if (schemas.length === 0) return;
  const tables = await catalogTables(tx, { schemas });
  const existing = (await tx.query(INTEGER_CHECKS_SQL, [schemas])) as unknown as IntegerCheckRow[];
  for (const statement of integerCheckStatements(tables, existing, plan.optedOut)) await tx.execute(statement);
}
