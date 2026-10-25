/**
 * Migrations and setup at startup (DB-9, DB-10; `openspec/changes/core-arch/design.md` §4 "Migrations and setup", §10,
 * §11; CORE-ARCH §4.7 and §4.12), refactored from 0.9.5's `src/postgres/migrate.ts`: each migration once, in its
 * module's order, in a transaction of its own together with its record, and a run that stops at the first failure
 * with the migrations before it kept. What changed: the record is `core_chain.migrations` with a SHA-256 checksum and
 * a position, checked before anything runs; the SQL runs under the module's role; and there is no migration advisory
 * lock — the writer lock (DB-11, task 2.5) is taken before any migration, so one process migrates a database at a time.
 *
 * **The input.** {@link startDatabase} takes the schema plan of the database's modules (`./roles.ts`, `planSchemas`),
 * the backbone parts and modules in RN-3's order ({@link MigrationPart}: what the declarations give; task 3.2 computes
 * the order) and, for DB-10, the versions of each part whose revisions cover a committed height (task 4.3 reads them
 * from the configuration history and the cursor). The plan and the parts come from the same declarations.
 *
 * **Who runs a part's SQL.** A module of the plan runs its migrations and its `on-start-db` under its write role (DB-6;
 * a shared item's provider under the item's role, Q89). UmbraDB's own parts whose schemas are reserved
 * ({@link OWN_PARTS}: `core_chain`, `core_digest`) run as the writer's login, which owns those schemas. No
 * `search_path` is set: module SQL names its schema (the module guide).
 *
 * **Order (DB-9).**
 * 1. One bootstrap transaction: `prepareSchemas` (`core_chain`, the roles, the schemas, their grants), the table
 *    `core_chain.migrations`, `USAGE` and `SELECT` on `core_chain` for every role of the plan, the `TRUNCATE` guard
 *    (`./truncate-guard.ts`), and then every check, for every part, before any migration runs: `requires-resync`
 *    (DB-10), `migration-checksum-changed`, `migration-missing` (also for a pending migration declared before an
 *    applied one, `reason: out-of-order`, decision record Q91). A refusal rolls the whole bootstrap back.
 * 2. For each part, in order: each pending migration in its own transaction — the migration mark first
 *    (`markMigration`, which lets `TRUNCATE` through in this transaction only, A73), the part's role, the SQL through
 *    the multi-statement path (`./multi-statement.ts`), a check that the SQL did not end the transaction, the login's
 *    role again, and the record last; then, when it applied any, the `TRUNCATE` guard again, so its new tables are
 *    guarded; then its `on-start-db` in a further transaction under its role, unmarked, with a schema write handle
 *    that closes when it returns (`./write-handles.ts`).
 *
 * A migration that fails rolls back with its record: the ones before it stay applied, its part's `on-start-db` and
 * every later part do not run, and startup refuses with `migration-failed`. A lost connection is passed on as it is
 * (`connection-lost`, retryable): a migration and its record commit together, so a retried startup finds either both
 * or neither.
 */

import { quoteIdentifier } from "../deterministic-postgresql/index.js";
import type { Database, SchemaWriteHandle, Transaction } from "./api.js";
import { UmbraError } from "./errors.js";
import { runMultiStatement } from "./multi-statement.js";
import {
  migrationChecksum,
  OWN_PARTS,
  type PlannedSchema,
  prepareSchemas,
  type SchemaMigration,
  type SchemaPlan,
  setModuleRole,
} from "./roles.js";
import { guardTables, markMigration, stillMarked } from "./truncate-guard.js";
import { runOnStartDb, type WriteHandleOptions } from "./write-handles.js";

/** UmbraDB's own parts, which run as the writer's login (`./roles.ts`); re-exported for the runner. */
export { OWN_PARTS };

/** What the runner needs of one backbone part or module (MD-1, DB-9, DB-10). */
export interface MigrationPart {
  readonly id: string;
  /** The version this build carries (semver). */
  readonly version: string;
  /** True when this version may run only on a database no other version of the part wrote (DB-10). */
  readonly requiresResync?: boolean;
  /** Cumulative: every migration of the versions before, then this version's (CORE-ARCH §4.12). */
  readonly migrations: readonly SchemaMigration[];
  /**
   * `on-start-db`: idempotent setup after the part's migrations, at every startup, in a transaction of its own under
   * the part's role, with a schema write handle that closes when it returns (DB-3, DB-9, RN-4; `./write-handles.ts`).
   * Its error is passed on as it is.
   */
  readonly onStartDb?: (w: SchemaWriteHandle) => Promise<void>;
}

/** The input of {@link startDatabase}. */
export interface StartupInput {
  /** The schemas and roles of the database's modules (`planSchemas`). */
  readonly plan: SchemaPlan;
  /** Every backbone part and module, in RN-3's order. */
  readonly parts: readonly MigrationPart[];
  /**
   * For each part's id, the versions of its revisions that cover at least one committed height (DB-10); a part not in
   * the map has none, as on an empty database.
   */
  readonly committedVersions: ReadonlyMap<string, readonly string[]>;
  /**
   * What each `on-start-db`'s schema write handle reports as `height` — the cursor at startup, null before any height
   * commits — and whom it tells of a use after its callback ended (`./write-handles.ts`).
   */
  readonly handles: WriteHandleOptions;
}

/** A migration applied by this startup, under the name it is recorded with. */
export interface AppliedMigration {
  /** The module's id, or a shared item's name for its providers' migrations (DB-8). */
  readonly module: string;
  readonly migration: string;
  /** Its place in the part's list, from 1. */
  readonly position: number;
}

const MIGRATIONS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS core_chain.migrations (
  module text NOT NULL,
  migration_id text NOT NULL,
  checksum bytea NOT NULL CHECK (octet_length(checksum) = 32),
  position integer NOT NULL CHECK (position >= 1),
  PRIMARY KEY (module, migration_id),
  UNIQUE (module, position)
)`;

const APPLIED_SQL = `SELECT module, migration_id, encode(checksum, 'hex') AS checksum, position
  FROM core_chain.migrations ORDER BY module, position`;

const RECORD_SQL = `INSERT INTO core_chain.migrations (module, migration_id, checksum, position)
  VALUES ($1, $2, decode($3, 'hex'), $4::integer)`;

/** A row of `core_chain.migrations`, its checksum in hex. */
interface AppliedRow {
  readonly module: string;
  readonly migration_id: string;
  readonly checksum: string;
  readonly position: number;
}

/** A part as the runner runs it. */
interface Runnable {
  readonly part: MigrationPart;
  /** The name its migrations are recorded under. */
  readonly name: string;
  /** How refusals name it. */
  readonly label: string;
  /** False for UmbraDB's own parts, which run as the login. */
  readonly underRole: boolean;
}

function runnable(part: MigrationPart, plan: SchemaPlan): Runnable {
  const own = plan.schemas.find((schema) => "module" in schema.of && schema.of.module === part.id);
  if (own === undefined) {
    if (!OWN_PARTS.includes(part.id)) {
      throw new Error(
        `startDatabase: the part ${part.id} is neither in the schema plan nor one of UmbraDB's own parts (` +
          `${OWN_PARTS.join(", ")})`,
      );
    }
    return { part, name: part.id, label: `module ${part.id}`, underRole: false };
  }
  const written = plan.schemas.find((schema) => schema.name === plan.writeSchema(part.id)) as PlannedSchema;
  if ("item" in written.of) {
    const item = written.of.item;
    return { part, name: item, label: `the shared item ${item} (provided by ${part.id})`, underRole: true };
  }
  return { part, name: part.id, label: `module ${part.id}`, underRole: true };
}

/** DB-10: a part that requires a resync, on a database whose committed heights another of its versions covers. */
function checkResync(part: MigrationPart, committed: readonly string[]): void {
  if (part.requiresResync !== true) return;
  const others = committed.filter((version) => version !== part.version);
  if (others.length === 0) return;
  throw new UmbraError(
    "requires-resync",
    `module ${part.id} ${part.version} requires a resync (requiresResync: true), and committed heights of this ` +
      `database are covered by its version ${others.join(", ")}: a version that changes stored values runs only on a ` +
      "database built with it from its first revision; sync it into a new database (DB-10)",
    { module: part.id, version: part.version, committedVersions: others },
  );
}

/** DB-9: a migration recorded as applied that the build does not declare, under `name` (`label` in the message). */
function missing(label: string, name: string, row: AppliedRow): UmbraError {
  return new UmbraError(
    "migration-missing",
    `${label}: the database applied migration ${row.migration_id} (position ${row.position}, checksum ` +
      `${row.checksum}), which the build does not declare: migrations are forward-only and cumulative, so a build ` +
      "declares every migration a database applied (DB-9); restore it to the build",
    { module: name, migration: row.migration_id, position: row.position, applied: row.checksum, build: null },
  );
}

/**
 * DB-9 and Q91: the rows recorded under a name must be exactly the first migrations of the build's list, at their
 * positions and with their checksums.
 */
function checkApplied(runner: Runnable, rows: readonly AppliedRow[]): void {
  const declared = runner.part.migrations;
  for (const [index, row] of rows.entries()) {
    const at = { module: runner.name, migration: row.migration_id, position: row.position, applied: row.checksum };
    const same = declared.find((migration) => migration.id === row.migration_id);
    if (same === undefined) throw missing(runner.label, runner.name, row);
    const build = migrationChecksum(same.sql);
    if (build !== row.checksum) {
      throw new UmbraError(
        "migration-checksum-changed",
        `${runner.label}: migration ${row.migration_id} (position ${row.position}) was applied with checksum ` +
          `${row.checksum}, and the build declares it with checksum ${build}: an applied migration never changes ` +
          "(DB-9); restore its SQL exactly, and put the change in a new migration at the end of the list",
        { ...at, build },
      );
    }
    const expected = declared[index] as SchemaMigration;
    if (expected.id !== row.migration_id || row.position !== index + 1) {
      throw new UmbraError(
        "migration-missing",
        `${runner.label}: the database applied migration ${row.migration_id} at position ${row.position}, where the ` +
          `build's migration ${index + 1} is ${expected.id}: the applied migrations must be the first of the build's ` +
          "list, in its order — a build adds migrations at the end of its list only, so that every database applies " +
          "them in one order (DB-9, decision record Q91)",
        { ...at, build: migrationChecksum(expected.sql), reason: "out-of-order", declared: expected.id },
      );
    }
  }
}

/** Grants every role of the plan `USAGE` on `core_chain` and `SELECT` on its tables, now and later (DB-6). */
async function grantCoreChain(tx: Transaction, plan: SchemaPlan): Promise<void> {
  if (plan.schemas.length === 0) return;
  const to = plan.schemas.map((schema) => quoteIdentifier(schema.role)).join(", ");
  await tx.execute(`GRANT USAGE ON SCHEMA core_chain TO ${to}`);
  await tx.execute(`GRANT SELECT ON ALL TABLES IN SCHEMA core_chain TO ${to}`);
  await tx.execute(`ALTER DEFAULT PRIVILEGES IN SCHEMA core_chain GRANT SELECT ON TABLES TO ${to}`);
}

/** Runs one migration and writes its record, in one transaction (DB-9). */
async function apply(
  db: Database,
  input: StartupInput,
  runner: Runnable,
  migration: SchemaMigration,
  position: number,
): Promise<void> {
  const at = { module: runner.name, migration: migration.id, position };
  try {
    await db.transaction(async (tx) => {
      await markMigration(tx);
      if (runner.underRole) await setModuleRole(tx, input.plan, runner.part.id);
      await runMultiStatement(tx, migration.sql);
      if (!(await stillMarked(tx))) {
        throw new UmbraError(
          "migration-failed",
          `${runner.label}: migration ${migration.id} (position ${position}) ended its own transaction (a COMMIT or ` +
            "ROLLBACK in its SQL), so it cannot be recorded together with its changes (DB-9); remove the " +
            "transaction control from its SQL",
          { ...at, reason: "transaction-ended" },
        );
      }
      if (runner.underRole) await tx.execute("RESET ROLE");
      await tx.execute(RECORD_SQL, [runner.name, migration.id, migrationChecksum(migration.sql), position]);
    });
  } catch (error) {
    if (error instanceof UmbraError && (error.code === "database-error" || error.code === "truncate-not-allowed")) {
      // The database's error is the cause; its details (SQLSTATE, and the names the server gave) are kept.
      throw new UmbraError(
        "migration-failed",
        `${runner.label}: migration ${migration.id} (position ${position}) failed and was rolled back; the ` +
          `migrations before it stay applied, and startup stops (DB-9): ${error.message}`,
        { ...error.details, ...at },
        { cause: error },
      );
    }
    throw error;
  }
}

/**
 * Bootstraps the database, checks every part's applied migrations, then migrates and sets up each part in order (see
 * the module comment). Resolves with the migrations this startup applied; rejects with the first refusal or failure,
 * with the error of an `on-start-db` as it is, or with `connection-lost`.
 */
export async function startDatabase(db: Database, input: StartupInput): Promise<readonly AppliedMigration[]> {
  const runners = input.parts.map((part) => runnable(part, input.plan));
  const ids = new Set<string>();
  for (const { part } of runners) {
    if (ids.has(part.id)) throw new Error(`startDatabase: the part ${part.id} is given twice`);
    ids.add(part.id);
  }
  // The build's list for each record name: its first part's (a shared item's providers declare the same, DB-8).
  const byName = new Map<string, Runnable>();
  for (const runner of runners) if (!byName.has(runner.name)) byName.set(runner.name, runner);

  const applied = await db.transaction(async (tx) => {
    await prepareSchemas(tx, input.plan);
    await tx.execute(MIGRATIONS_TABLE_SQL);
    await grantCoreChain(tx, input.plan);
    await guardTables(tx, input.plan);
    const rows = (await tx.query(APPLIED_SQL)) as unknown as AppliedRow[];
    const recorded = new Map<string, AppliedRow[]>();
    for (const row of rows) recorded.set(row.module, [...(recorded.get(row.module) ?? []), row]);
    for (const runner of runners) {
      checkResync(runner.part, input.committedVersions.get(runner.part.id) ?? []);
      if (byName.get(runner.name) === runner) checkApplied(runner, recorded.get(runner.name) ?? []);
    }
    // Recorded under a name no part of the build has: a module (or shared item) the build dropped (DB-9).
    for (const [name, list] of recorded) {
      if (!byName.has(name)) throw missing(`the module or shared item ${name}`, name, list[0] as AppliedRow);
    }
    return new Map([...recorded].map(([name, list]) => [name, list.length]));
  });

  const done: AppliedMigration[] = [];
  for (const runner of runners) {
    const { part } = runner;
    let any = false;
    for (let index = applied.get(runner.name) ?? 0; index < part.migrations.length; index++) {
      const migration = part.migrations[index] as SchemaMigration;
      await apply(db, input, runner, migration, index + 1);
      applied.set(runner.name, index + 1);
      done.push({ module: runner.name, migration: migration.id, position: index + 1 });
      any = true;
    }
    if (any) await db.transaction((tx) => guardTables(tx, input.plan));
    if (part.onStartDb !== undefined) await runOnStartDb(db, input.plan, part.id, input.handles, part.onStartDb);
  }
  return done;
}
