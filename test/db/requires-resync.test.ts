import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaModule, type SchemaMigration } from "../../src/db/roles.js";
import { BACKENDS } from "./backends.js";

/**
 * On both backends, a module version declaring `requiresResync: true` is accepted only while no committed height of
 * the database is covered by a revision of that module with another version. Otherwise startup refuses with
 * `requires-resync`, naming the module and the version, before any migration runs. It is accepted on an empty
 * database, and still accepted after that database committed blocks and restarted. [A72 DOC, DB-10]
 *
 * Which versions cover committed heights is the runner's input `committedVersions`, read from the configuration
 * history (`core_chain.config`) and the cursor, which do not exist yet (OUTDATED). So each test gives it as that
 * history would: empty for an empty database, the module's versions once blocks committed.
 *
 * `[DOC]`: the module guide states the additive-only rule for upgrade migrations and when to declare `requiresResync`.
 */

type TestPart = MigrationPart & SchemaModule;

function module(id: string, version: string, migrations: readonly SchemaMigration[], requiresResync?: true): TestPart {
  return {
    id,
    version,
    ...(requiresResync === undefined ? {} : { requiresResync }),
    requires: [],
    provides: [{ name: `${id}-rows`, table: { schema: id, tables: ["t"] } }],
    migrations,
  };
}

const M_001 = "CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL)";
/** Version 2.0.0 changes stored values, so it requires a resync. */
const M_002 = "UPDATE m.t SET v = upper(v)";
const N_001 = "CREATE TABLE n.t (k bigint PRIMARY KEY)";

const M1 = module("m", "1.0.0", [{ id: "001", sql: M_001 }]);
const M2 = module("m", "2.0.0", [{ id: "001", sql: M_001 }, { id: "002", sql: M_002 }], true);
const N = module("n", "1.0.0", [{ id: "001", sql: N_001 }]);

function startup(db: Database, parts: readonly TestPart[], committed: Record<string, readonly string[]>) {
  return startDatabase(db, { plan: planSchemas(parts), parts, committedVersions: new Map(Object.entries(committed)), handles: { height: null } });
}

async function migrations(db: Database): Promise<string[]> {
  const rows = await db.read((read) =>
    read.query("SELECT module || '/' || migration_id AS m FROM core_chain.migrations ORDER BY 1"),
  );
  return rows.map((row) => row.m as string);
}

function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

describe.each(BACKENDS)("A72: a version that requires a resync, on $name (DB-10)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  async function builtWithVersion1(): Promise<Database> {
    const { db } = await backend.database("SELECT 1");
    await startup(db, [M1], {});
    await db.transaction((tx) => tx.execute("INSERT INTO m.t (k, v) VALUES (1, 'one')"));
    return db;
  }

  it("is refused with requires-resync, the module and the version, before any migration runs, where another version's heights committed", async () => {
    const db = await builtWithVersion1();
    // n comes first and has a pending migration: it must not run either.
    const result = await outcome(startup(db, [N, M2], { m: ["1.0.0"] }));
    expect(result).toBeInstanceOf(UmbraError);
    const error = result as UmbraError;
    expect(error.code).toBe("requires-resync");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ module: "m", version: "2.0.0", committedVersions: ["1.0.0"] });
    for (const text of ["m", "2.0.0", "1.0.0"]) expect(error.message).toContain(text);
    expect(await migrations(db)).toEqual(["m/001"]);
    const [row] = await db.read((read) =>
      read.query("SELECT v, to_regclass('n.t') IS NULL AS no_n, to_regnamespace('n') IS NULL AS no_schema FROM m.t"),
    );
    // Nothing of the bootstrap stayed either: n's schema was never created.
    expect(row).toEqual({ v: "one", no_n: true, no_schema: true });
  });

  it("is refused when the history also holds the version itself after another one", async () => {
    const db = await builtWithVersion1();
    const result = (await outcome(startup(db, [M2], { m: ["1.0.0", "2.0.0"] }))) as UmbraError;
    expect(result.code).toBe("requires-resync");
    expect(result.details.committedVersions).toEqual(["1.0.0"]);
  });

  it("control: the same history accepts a version that does not declare requiresResync (an upgrade that only adds)", async () => {
    const db = await builtWithVersion1();
    const additive = module("m", "1.1.0", [{ id: "001", sql: M_001 }, { id: "002", sql: "ALTER TABLE m.t ADD COLUMN note text" }]);
    expect(await startup(db, [additive], { m: ["1.0.0"] })).toEqual([{ module: "m", migration: "002", position: 2 }]);
  });

  it("is accepted on an empty database, and still after that database committed blocks and restarted", async () => {
    const { db } = await backend.database("SELECT 1");
    expect(await startup(db, [M2], {})).toEqual([
      { module: "m", migration: "001", position: 1 },
      { module: "m", migration: "002", position: 2 },
    ]);
    // Blocks commit with 2.0.0 (its rows); the history then shows 2.0.0 covering the committed heights.
    await db.transaction((tx) => tx.execute("INSERT INTO m.t (k, v) VALUES (1, 'ONE')"));
    expect(await startup(db, [M2], { m: ["2.0.0"] })).toEqual([]);
    expect(await migrations(db)).toEqual(["m/001", "m/002"]);
  });

  it("is accepted where the module has no committed heights yet, though other modules have", async () => {
    const { db } = await backend.database("SELECT 1");
    await startup(db, [N], {});
    expect((await startup(db, [N, M2], { n: ["1.0.0"] })).map((row) => `${row.module}/${row.migration}`)).toEqual([
      "m/001",
      "m/002",
    ]);
  });
});

describe("A72 [DOC]: the module guide", () => {
  const guide = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "docs", "module-guide.md"), "utf8");
  // A section's text with its line breaks and indentation as single spaces, so a phrase may wrap.
  const section = (heading: string): string => {
    const start = guide.indexOf(`\n## ${heading}\n`);
    expect(start, heading).toBeGreaterThan(-1);
    const end = guide.indexOf("\n## ", start + 1);
    return guide.slice(start, end === -1 ? undefined : end).replace(/\s+/g, " ");
  };

  it("states the additive-only rule for upgrade migrations, and when a version declares requiresResync", () => {
    const upgrades = section("16. Upgrades");
    for (const allowed of ["tables", "nullable columns", "columns with defaults", "indexes", "constraints", "functions"]) {
      expect(upgrades, allowed).toContain(allowed);
    }
    for (const never of ["drop a table or a column", "change a column's type", "change a stored value"]) {
      expect(upgrades, never).toContain(never);
    }
    expect(upgrades).toContain("requiresResync: true");
    expect(upgrades).toContain("requires-resync");
  });

  it("states how migrations run: in order, once, each with its record, never edited, under the module's role", () => {
    const migrationsSection = section("15. Migrations");
    const facts = ["migration-checksum-changed", "migration-missing", "migration-failed", "SHA-256", "on-start-db", "schema"];
    for (const text of facts) {
      expect(migrationsSection, text).toContain(text);
    }
    // The guide states TRUNCATE in the table rules and provider functions in "Providing items".
    expect(section("4. Deterministic PostgreSQL"), "TRUNCATE").toContain("`TRUNCATE` only in a migration");
    const providing = section("13. Providing items to other modules");
    for (const text of ["SECURITY DEFINER", "SET search_path = pg_catalog"]) expect(providing, text).toContain(text);
  });
});
