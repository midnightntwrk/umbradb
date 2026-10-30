import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, OWN_PARTS, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaModule } from "../../src/db/roles.js";
import { migrationPart, schemaModule, schemaModules } from "../../src/modules/adapters.js";
import type { ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { BACKENDS } from "../db/backends.js";
import { declaration, userModules } from "./declarations.js";

/**
 * The adapters from validated declarations to the database API's inputs:
 * - {@link schemaModule} gives `planSchemas` what it reads of a declaration: id, requirements, items with their tables
 *   and `deterministic` flag, and migrations.
 * - {@link schemaModules} leaves out UmbraDB's own parts, whose schemas are reserved (`OWN_PARTS`: `core-chain`,
 *   `core-digest`).
 * - {@link migrationPart} gives `startDatabase` the part's id, version, `requiresResync`, migrations and its
 *   `on-start-db` callback, called with the module's process context and the schema write handle.
 *
 * Each is checked against the real function it feeds, on both backends. Resolving the graph and the order, and the
 * runner's own startup, are not exercised here: the parts are given in the order written. [MD-1, DB-6, DB-8, DB-9, DB-10]
 */

/** A process context for one module, as the runner builds it. */
function context(revisions: ProcessContext["revisions"] = []): ProcessContext & { published: [string, unknown][] } {
  const published: [string, unknown][] = [];
  return {
    items: new Map([["config", { network: "preview" }]]),
    revisions,
    publish: (item, value) => void published.push([item, value]),
    published,
  };
}

/** Two providers of the shared table item `contract-logs` and a consumer. [CORE-ARCH §4.11] */
function contractLogs(id: string): ModuleDeclaration {
  return declaration(id, {
    requires: ["vm-logs"],
    provides: [
      {
        name: "contract-logs",
        lifetimes: ["block", "table"],
        table: { schema: "contract_logs", tables: ["logs"], kind: "append-only" },
      },
    ],
    migrations: [{ id: "001", sql: "CREATE TABLE contract_logs.logs (height bigint PRIMARY KEY)" }],
  });
}

/** A module with a deterministic table and one declared `deterministic: false`. */
const KEYS = declaration("keys", {
  provides: [
    { name: "key-counts", lifetimes: ["table"], table: { schema: "keys", tables: ["counts"], kind: "mutable" } },
    {
      name: "key-requests",
      lifetimes: ["table"],
      table: { schema: "keys", tables: ["requests", "notes"], kind: "append-only", deterministic: false },
    },
  ],
});

describe("schemaModule: what planSchemas reads of a declaration (DB-8, MD-1)", () => {
  it("gives the id, the requirements, each item's name and table with its deterministic flag, and the migrations", () => {
    expect(schemaModule(KEYS)).toEqual({
      id: "keys",
      requires: ["block-header"],
      provides: [
        { name: "key-counts", table: { schema: "keys", tables: ["counts"] } },
        { name: "key-requests", table: { schema: "keys", tables: ["requests", "notes"], deterministic: false } },
      ],
      migrations: [{ id: "001", sql: "CREATE TABLE keys.rows (height bigint PRIMARY KEY)" }],
    } satisfies SchemaModule);
    const plain = declaration("plain", { provides: [{ name: "plain-client", lifetimes: ["process"] }] });
    expect(schemaModule(plain).provides).toEqual([{ name: "plain-client" }]);
  });

  it("feeds planSchemas: schemas and roles per module, the opted-out tables, a shared item's role", () => {
    const set = validateDeclarations(userModules([KEYS, contractLogs("logs-full"), contractLogs("logs-fast")]));
    const plan = planSchemas(schemaModules(set.user));
    expect(plan.schemas.map((schema) => [schema.name, schema.role])).toEqual([
      ["keys", "umbradb_m_keys"],
      ["logs_full", "umbradb_m_logs_full"],
      ["logs_fast", "umbradb_m_logs_fast"],
      ["contract_logs", "umbradb_i_contract_logs"],
    ]);
    expect(plan.optedOut).toEqual([
      { schema: "keys", table: "requests" },
      { schema: "keys", table: "notes" },
    ]);
    expect(plan.writeRole("logs-fast")).toBe("umbradb_i_contract_logs");
    expect(plan.writeRole("keys")).toBe("umbradb_m_keys");
  });

  it("feeds planSchemas the deterministic flag that two providers of a shared item must agree on (DB-8, Q76)", () => {
    const fast = contractLogs("logs-fast");
    const optedOut: ModuleDeclaration = {
      ...fast,
      provides: [{ ...(fast.provides[0] as ModuleDeclaration["provides"][number]), table: { schema: "contract_logs", tables: ["logs"], kind: "append-only", deterministic: false } }],
    };
    const set = validateDeclarations(userModules([contractLogs("logs-full"), optedOut]));
    const error = (() => {
      try {
        planSchemas(schemaModules(set.user));
      } catch (caught) {
        return caught;
      }
      return undefined;
    })();
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("shared-item-migrations-differ");
    expect((error as UmbraError).details).toMatchObject({ item: "contract-logs", deterministic: [true, false] });
  });

  it("leaves out UmbraDB's own parts whose schemas are reserved, and keeps every other part", () => {
    expect(OWN_PARTS).toEqual(["core-chain", "core-digest"]);
    const backbone = [
      declaration("core-chain", { requires: [], provides: [{ name: "db", lifetimes: ["process"] }], migrations: [] }),
      declaration("core-block-commit"),
      declaration("core-digest", { provides: [], migrations: [] }),
    ];
    const set = validateDeclarations({ backbone, core: [declaration("core-chain-events")], user: [KEYS] });
    expect(schemaModules([...set.backbone, ...set.core, ...set.user]).map((module) => module.id)).toEqual([
      "core-block-commit",
      "core-chain-events",
      "keys",
    ]);
    // Given to the plan, an own part would be refused: its schema is reserved. [DB-8]
    expect(() => planSchemas([schemaModule(backbone[0] as ModuleDeclaration)])).toThrowError(
      /reserved schema core_chain/,
    );
  });
});

describe("migrationPart: what startDatabase runs of a declaration (DB-9, DB-10)", () => {
  it("gives the id, the version, requiresResync as declared, the migrations, and on-start-db only when declared", () => {
    const part = migrationPart(declaration("stats"), context());
    expect(part).toEqual({
      id: "stats",
      version: "1.0.0",
      migrations: [{ id: "001", sql: "CREATE TABLE stats.rows (height bigint PRIMARY KEY)" }],
    } satisfies MigrationPart);
    expect("requiresResync" in part).toBe(false);
    expect("onStartDb" in part).toBe(false);
    expect(migrationPart(declaration("stats", { requiresResync: true }), context()).requiresResync).toBe(true);
    expect(migrationPart(declaration("stats", { requiresResync: false }), context()).requiresResync).toBe(false);
  });

  it("calls on-start-db with the module's process context and the handle, as a method of its points", async () => {
    const calls: unknown[][] = [];
    const points: ModuleDeclaration["points"] = {
      async "on-start-db"(p, w) {
        calls.push([this, p, w]);
        p.publish("stats-client", { ready: true });
      },
    };
    const own = context();
    const part = migrationPart(declaration("stats", { points }), own);
    const handle = { height: null } as unknown as SchemaWriteHandle;
    await part.onStartDb?.(handle);
    expect(calls).toEqual([[points, own, handle]]);
    expect(calls[0]?.[0]).toBe(points);
    expect(calls[0]?.[1]).toBe(own);
    expect(calls[0]?.[2]).toBe(handle);
    expect(own.published).toEqual([["stats-client", { ready: true }]]);
  });

  it("passes the callback's error on unchanged", async () => {
    const failure = new Error("setup failed");
    const part = migrationPart(
      declaration("stats", { points: { "on-start-db": () => Promise.reject(failure) } }),
      context(),
    );
    await expect(part.onStartDb?.({} as SchemaWriteHandle)).rejects.toBe(failure);
  });
});

describe.each(BACKENDS)("the adapters through startDatabase on $name (DB-6, DB-8, DB-9, DB-10)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** Starts the database with `declarations` as the user modules, in their order. */
  async function start(
    db: Database,
    declarations: readonly ModuleDeclaration[],
    committed: Record<string, readonly string[]> = {},
    contexts: ReadonlyMap<string, ProcessContext> = new Map(),
  ) {
    const set = validateDeclarations(userModules(declarations));
    return startDatabase(db, {
      plan: planSchemas(schemaModules(set.user)),
      parts: set.user.map((d) => migrationPart(d, contexts.get(d.id) ?? context())),
      committedVersions: new Map(Object.entries(committed)),
      handles: { height: null },
    });
  }

  it("migrates each module under its role, records its migrations, and runs its on-start-db under that role", async () => {
    const { db } = await backend.database("SELECT 1");
    const own = context([{ start: 1n, stop: null, version: "1.0.0", settings: { limit: 10 } }]);
    const stats = declaration("stats", {
      migrations: [
        { id: "001", sql: "CREATE TABLE stats.rows (height bigint PRIMARY KEY)" },
        { id: "002", sql: "CREATE TABLE stats.setup (k text PRIMARY KEY, written_by text NOT NULL)" },
      ],
      points: {
        async "on-start-db"(p, w) {
          await w.execute(
            "INSERT INTO stats.setup (k, written_by) VALUES ('revisions', current_user || ':' || $1::text) " +
              "ON CONFLICT (k) DO NOTHING",
            [String(p.revisions.length)],
          );
        },
      },
    });
    const applied = await start(db, [KEYS, stats], {}, new Map([["stats", own]]));
    expect(applied).toEqual([
      { module: "keys", migration: "001", position: 1 },
      { module: "stats", migration: "001", position: 1 },
      { module: "stats", migration: "002", position: 2 },
    ]);
    const rows = await db.read(async (read) => ({
      owners: await read.query(
        "SELECT n.nspname || '.' || c.relname AS name, pg_get_userbyid(c.relowner) AS owner FROM pg_class c " +
          "JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname IN ('keys', 'stats') AND c.relkind = 'r' " +
          "ORDER BY 1",
      ),
      setup: await read.query("SELECT k, written_by FROM stats.setup"),
      records: await read.query("SELECT module, migration_id, position FROM core_chain.migrations ORDER BY module, position"),
    }));
    expect(rows.owners).toEqual([
      { name: "keys.rows", owner: "umbradb_m_keys" },
      { name: "stats.rows", owner: "umbradb_m_stats" },
      { name: "stats.setup", owner: "umbradb_m_stats" },
    ]);
    expect(rows.setup).toEqual([{ k: "revisions", written_by: "umbradb_m_stats:1" }]);
    expect(rows.records).toEqual([
      { module: "keys", migration_id: "001", position: 1 },
      { module: "stats", migration_id: "001", position: 1 },
      { module: "stats", migration_id: "002", position: 2 },
    ]);
    // A second start applies nothing and runs on-start-db again (idempotent setup).
    expect(await start(db, [KEYS, stats], {}, new Map([["stats", own]]))).toEqual([]);
  }, 60_000);

  it("records a shared item's migrations under the item, written by its providers under the item's role", async () => {
    const { db } = await backend.database("SELECT 1");
    expect(await start(db, [contractLogs("logs-full"), contractLogs("logs-fast")])).toEqual([
      { module: "contract-logs", migration: "001", position: 1 },
    ]);
    const [owner] = await db.read((read) =>
      read.query("SELECT pg_get_userbyid(relowner) AS owner FROM pg_class WHERE oid = 'contract_logs.logs'::regclass"),
    );
    expect(owner).toEqual({ owner: "umbradb_i_contract_logs" });
  }, 60_000);

  it("passes requiresResync to the runner, which refuses the version where another one's heights committed", async () => {
    const { db } = await backend.database("SELECT 1");
    await start(db, [declaration("stats")]);
    const v2 = declaration("stats", { version: "2.0.0", requiresResync: true });
    const refused = await start(db, [v2], { stats: ["1.0.0"] }).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).code).toBe("requires-resync");
    expect((refused as UmbraError).details).toEqual({ module: "stats", version: "2.0.0", committedVersions: ["1.0.0"] });
    // Control: the same history accepts the version without the flag.
    expect(await start(db, [declaration("stats", { version: "2.0.0" })], { stats: ["1.0.0"] })).toEqual([]);
  }, 60_000);
});
