import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaPlan } from "../../src/db/roles.js";
import {
  catalogRelations,
  catalogTables,
  databaseRefusals,
  optOut,
  type PlacedRefusal,
  type Refusal,
  type RefusalPlace,
  type RelationFacts,
  refusalMessage,
  type TableFacts,
} from "../../src/deterministic-postgresql/index.js";
import { migrationPart, schemaModules } from "../../src/modules/adapters.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { CAPTURE_TRIGGER, SHADOW_SCHEMA, shadowTableName } from "../../src/db/change-capture.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { ModuleContentsError } from "../../src/determinism/module-tables.js";
import { type Chain, runBlocks, startChain, testModule } from "../backbone/core-digest/chain.js";
import { BACKENDS } from "../db/backends.js";
import { declaration, userModules } from "../modules/declarations.js";

/**
 * The opt-out, the last row of the design's component table: a `table` item declared `deterministic: false` opts its
 * tables out of the determinism rules. The declaration is the module's (`src/modules/`). The skip is the component's,
 * written once: {@link optOut}. [MD-1, DT-6, Q76; design §4]
 *
 * {@link optOut} is used by the column-type refusals ({@link databaseRefusals}, given the opted-out tables) and the
 * `TRUNCATE` guard (`truncateGuardStatements`), and is called by the startup check, the `CHECK`s and change capture.
 * It skips an opted-out table, the partitions of an opted-out partitioned table, the sequences their columns own, and
 * such a table when unlogged. Every other table and sequence of the module is still refused as before. [DT-6]
 *
 * Shown here from a declaration, through the schema plan (`plan.optedOut`) and the migrations that create the tables,
 * on both backends. The startup check that refuses at migration time, the `CHECK`s, the contents hash's
 * `[schema, table, null, null]` and the digests are tested in the block further down. [DT-6, A147]
 */

const T = (schema: string, table: string) => ({ schema, table });

describe("optOut: which tables and relations a list of opted-out tables covers", () => {
  it("covers a table by schema and name, and nothing else", () => {
    const out = optOut([T("keys", "requests"), T("keys", "parted")]);
    expect(out.covers(T("keys", "requests"))).toBe(true);
    expect(out.covers(T("keys", "parted"))).toBe(true);
    expect(out.covers(T("keys", "counts"))).toBe(false);
    expect(out.covers(T("other", "requests"))).toBe(false);
    expect(out.covers(T("keys.requests", ""))).toBe(false);
    expect(out.covers(null)).toBe(false);
    expect(optOut([]).covers(T("keys", "requests"))).toBe(false);
  });
});

describe("databaseRefusals given the opted-out tables (DT-6, Q76)", () => {
  const column = { declaredType: "integer", typeModifier: -1, typeKind: "b", elementKind: null, notImmutable: [] };
  const identity = { ...column, name: "id", type: "integer", inPrimaryKey: true, identity: "always" as const };
  const tables: TableFacts[] = [
    { schema: "keys", name: "counts", columns: [identity] },
    { schema: "keys", name: "requests", columns: [identity] },
    { schema: "other", name: "requests", columns: [identity] },
  ];
  const relation = (name: string, kind: string, persistence: string, belongsTo: RelationFacts["belongsTo"]) => ({
    schema: "keys",
    name,
    kind,
    persistence,
    belongsTo,
  });
  const relations: RelationFacts[] = [
    relation("counts_id_seq", "S", "p", T("keys", "counts")),
    relation("free", "S", "p", null),
    relation("parted_low", "r", "u", T("keys", "parted")),
    relation("requests_id_seq", "S", "p", T("keys", "requests")),
    relation("scratch", "r", "u", T("keys", "scratch")),
  ];
  const places = (refusals: readonly PlacedRefusal[]) => refusals.map(({ place }) => place);

  it("skips an opted-out table, the sequences its columns own, and its unlogged partitions; keeps the rest", () => {
    const optedOut = [T("keys", "requests"), T("keys", "parted"), T("keys", "scratch")];
    expect(places(databaseRefusals(tables, relations, { optedOut }))).toEqual([
      { schema: "keys", table: "counts" },
      { schema: "other", table: "requests" },
      { schema: "keys", sequence: "counts_id_seq" },
      { schema: "keys", sequence: "free" },
    ]);
  });

  it("refuses everything as before without the option, or with no table opted out", () => {
    const all = databaseRefusals(tables, relations);
    expect(all).toHaveLength(8);
    expect(databaseRefusals(tables, relations, { optedOut: [] })).toEqual(all);
    expect(databaseRefusals(tables, relations, {})).toEqual(all);
  });
});

/** The module of the test: a deterministic item and one declared `deterministic: false` (unless `flag` is absent). */
function keysModule(flag: { readonly deterministic?: false }): ModuleDeclaration {
  return defineModule(
    declaration("keys", {
      provides: [
        {
          name: "key-counts",
          lifetimes: ["table"],
          table: { schema: "keys", tables: ["counts", "log"], kind: "mutable" },
        },
        {
          name: "key-requests",
          lifetimes: ["table"],
          table: { schema: "keys", tables: ["requests", "parted", "scratch"], kind: "append-only", ...flag },
        },
      ],
      migrations: [
        {
          id: "001",
          sql: `
            CREATE TABLE keys.counts (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, n bigint NOT NULL);
            CREATE TABLE keys.log (height bigint PRIMARY KEY) PARTITION BY RANGE (height);
            CREATE UNLOGGED TABLE keys.log_low PARTITION OF keys.log FOR VALUES FROM (0) TO (100);
            CREATE TABLE keys.requests (
              id serial PRIMARY KEY,
              received_at timestamp DEFAULT now(),
              score double precision
            );
            CREATE SEQUENCE keys.extra OWNED BY keys.requests.score;
            CREATE TABLE keys.parted (k bigint NOT NULL, at timestamptz DEFAULT now()) PARTITION BY RANGE (k);
            CREATE UNLOGGED TABLE keys.parted_low PARTITION OF keys.parted FOR VALUES FROM (0) TO (100);
            CREATE UNLOGGED TABLE keys.scratch (k bigint PRIMARY KEY);
            CREATE SEQUENCE keys.free;`,
        },
      ],
    }),
  );
}

describe.each(BACKENDS)("the opt-out from a declaration to the component's rules, on $name (MD-1, DT-6, Q76)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /**
   * A fresh database with `module`'s schema and plan, and the tables its migration declares. Startup refuses a
   * migration that leaves a table the rules refuse, and rolls it back, so the module's tables are made here
   * outside the migration runner, as the module's role, after a startup that applied none of its migrations; the
   * startup check over them is the last test of this block.
   */
  async function started(module: ModuleDeclaration): Promise<{ db: Database; plan: SchemaPlan; parts: MigrationPart[] }> {
    const { db } = await backend.database("SELECT 1");
    const set = validateDeclarations(userModules([module]));
    const plan = planSchemas(schemaModules(set.user));
    const parts = set.user.map((d) => ({
      ...migrationPart(d, { items: new Map(), revisions: [], publish: () => {} }),
      migrations: [],
    }));
    await startDatabase(db, { plan, parts, committedVersions: new Map(), handles: { height: null } });
    await db.transaction(async (tx) => {
      await tx.execute(`SET LOCAL ROLE ${plan.writeRole(module.id)}`);
      for (const { sql } of module.migrations) {
        for (const statement of sql.split(";").map((part) => part.trim())) if (statement !== "") await tx.execute(statement);
      }
    });
    return { db, plan, parts };
  }

  async function refusals(db: Database, optedOut?: SchemaPlan["optedOut"]) {
    const found = await db.read(async (read) =>
      databaseRefusals(await catalogTables(read), await catalogRelations(read), optedOut === undefined ? {} : { optedOut }),
    );
    return found
      .filter(({ place }) => place.schema === "keys")
      .map(({ refusal, place }) => [refusal.code, place, refusal.column?.name ?? null]);
  }

  it("reads which table each sequence and unlogged table belongs to", async () => {
    const { db } = await started(keysModule({ deterministic: false }));
    const relations = await db.read((read) => catalogRelations(read));
    expect(relations.filter((relation) => relation.schema === "keys")).toEqual([
      { schema: "keys", name: "counts_id_seq", kind: "S", persistence: "p", belongsTo: T("keys", "counts") },
      { schema: "keys", name: "extra", kind: "S", persistence: "p", belongsTo: T("keys", "requests") },
      { schema: "keys", name: "free", kind: "S", persistence: "p", belongsTo: null },
      { schema: "keys", name: "log_low", kind: "r", persistence: "u", belongsTo: T("keys", "log") },
      { schema: "keys", name: "parted_low", kind: "r", persistence: "u", belongsTo: T("keys", "parted") },
      { schema: "keys", name: "requests_id_seq", kind: "S", persistence: "p", belongsTo: T("keys", "requests") },
      { schema: "keys", name: "scratch", kind: "r", persistence: "u", belongsTo: T("keys", "scratch") },
    ]);
  }, 60_000);

  it("skips the declared tables, their sequences and unlogged partitions; refuses the module's other tables", async () => {
    const { db, plan } = await started(keysModule({ deterministic: false }));
    expect(plan.optedOut).toEqual([T("keys", "requests"), T("keys", "parted"), T("keys", "scratch")]);
    expect(await refusals(db, plan.optedOut)).toEqual([
      ["non-deterministic-column", { schema: "keys", table: "counts" }, "id"],
      ["non-deterministic-table", { schema: "keys", sequence: "counts_id_seq" }, null],
      ["non-deterministic-table", { schema: "keys", sequence: "free" }, null],
      ["non-deterministic-table", { schema: "keys", table: "log_low" }, null],
    ]);
  }, 60_000);

  it("control: the same tables without the flag are refused — every table, sequence and partition the flag covered", async () => {
    const { db, plan } = await started(keysModule({}));
    expect(plan.optedOut).toEqual([]);
    const all = await refusals(db, plan.optedOut);
    const places = all.map(([, place]) => JSON.stringify(place));
    for (const place of [
      { schema: "keys", table: "requests" },
      { schema: "keys", table: "parted" },
      { schema: "keys", sequence: "extra" },
      { schema: "keys", sequence: "requests_id_seq" },
      { schema: "keys", table: "parted_low" },
      { schema: "keys", table: "scratch" },
    ]) {
      expect(places, JSON.stringify(place)).toContain(JSON.stringify(place));
    }
    expect(all).toContainEqual(["non-deterministic-column", { schema: "keys", table: "requests" }, "id"]);
    expect(all).toContainEqual(["no-primary-key", { schema: "keys", table: "parted" }, null]);
    // The opted-out database without the list given refuses the same: the skip is the list's, nothing else's.
    const { db: flagged, plan: flaggedPlan } = await started(keysModule({ deterministic: false }));
    expect(await refusals(flagged)).toEqual(all);
    expect(await refusals(flagged, flaggedPlan.optedOut)).toHaveLength(4);
  }, 60_000);

  it("7.1: startup refuses with the first refusal the opt-out leaves, naming the module (DT-6 at startup)", async () => {
    const { db, plan, parts } = await started(keysModule({ deterministic: false }));
    const [first] = await db.read(async (read) =>
      databaseRefusals(await catalogTables(read), await catalogRelations(read), { optedOut: plan.optedOut }),
    );
    expect(first?.place).toEqual({ schema: "keys", table: "counts" });
    const refused = await startDatabase(db, { plan, parts, committedVersions: new Map(), handles: { height: null } }).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).code).toBe(first?.refusal.code);
    expect((refused as UmbraError).message).toBe(
      refusalMessage(first?.refusal as Refusal, { module: "keys", ...(first?.place as RefusalPlace) }),
    );
  }, 60_000);
});

/**
 * The core part of the opt-out, on both backends:
 * - a `table` item declared `deterministic: false` with a `now()` default and a `serial` column starts, and so does
 *   its partitioned table without a primary key;
 * - its rows (the times `now()` gave, the values `serial` drew, fractional `jsonb` and `numeric` values, which no
 *   `CHECK` refuses there) are hashed by name only: two databases differing only in them hash equal, and a database
 *   without the tables hashes differently; [DT-3]
 * - the digests skip them: no capture trigger on the table or its partitions, no shadow table, no row of
 *   `core_digest.tables`; [DT-4]
 * - the same tables without the flag refuse startup with `non-deterministic-column`. [DT-6]
 *
 * The chains run through `schemaPlan`, `startDatabase` and the block write handles with the real `core-digest`
 * (`test/backbone/core-digest/chain.ts`). The private-process part is tested in `test/private/determinism.test.ts`,
 * the backup part in `opt-out-backup.test.ts`. [A147, MD-1, Q76]
 */
function requestsModule(flag: { readonly deterministic?: false }, note: string): ModuleDeclaration {
  return testModule("kreq", {
    provides: [
      {
        name: "kreq-requests",
        lifetimes: ["table"],
        table: { schema: "kreq", tables: ["requests", "requests_log"], kind: "append-only", ...flag },
      },
      { name: "kreq-counts", lifetimes: ["table"], table: { schema: "kreq", tables: ["counts"], kind: "mutable" } },
    ],
    migrations: [
      {
        id: "001",
        sql: `CREATE TABLE kreq.requests (
                id serial PRIMARY KEY, received_at timestamptz NOT NULL DEFAULT now(), note jsonb, amount numeric
              );
              CREATE TABLE kreq.requests_log (height bigint NOT NULL, at timestamptz DEFAULT now()) PARTITION BY RANGE (height);
              CREATE TABLE kreq.requests_log_low PARTITION OF kreq.requests_log FOR VALUES FROM (0) TO (1000);
              CREATE TABLE kreq.counts (k bigint PRIMARY KEY, n numeric NOT NULL);`,
      },
    ],
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO kreq.requests (note, amount) VALUES ($1::jsonb, 1.5)", [note]);
        await w.execute("INSERT INTO kreq.requests_log (height) VALUES ($1)", [b.height]);
        await w.execute("INSERT INTO kreq.counts (k, n) VALUES (1, $1) ON CONFLICT (k) DO UPDATE SET n = $1", [b.height]);
      },
    },
  });
}

describe.each(BACKENDS)("A147: a table declared deterministic: false, on $name (core part)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  async function chainWith(module: ModuleDeclaration, to: bigint): Promise<Chain> {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [module]);
    await runBlocks(chain, to);
    return chain;
  }

  const hashOf = (chain: Chain, optedOut?: SchemaPlan["optedOut"]) =>
    chain.db.read((read) => contentsHash(read, optedOut === undefined ? {} : { optedOut }));

  it("starts with a now() default and a serial column, and stores fractional values no CHECK refuses there", async () => {
    const chain = await chainWith(requestsModule({ deterministic: false }, '{"x": 1.5}'), 3n);
    const rows = await chain.db.read((read) => read.query("SELECT id, note, amount FROM kreq.requests ORDER BY id"));
    expect(rows).toEqual([1, 2, 3].map((id) => ({ id, note: { x: 1.5 }, amount: "1.5" })));
    const checks = await chain.db.read((read) =>
      read.query(
        `SELECT conrelid::regclass::text AS "table" FROM pg_constraint
          WHERE contype = 'c' AND conname LIKE 'umbradb\\_integers\\_%' AND connamespace = 'kreq'::regnamespace
          ORDER BY 1`,
      ),
    );
    // Only the deterministic table's numeric column has its CHECK; it refuses there what the opted-out table took.
    expect(checks).toEqual([{ table: "kreq.counts" }]);
    const refused = await chain.db
      .transaction((tx) => tx.execute("INSERT INTO kreq.counts (k, n) VALUES (2, 1.5)"))
      .then(
        () => undefined,
        (error: unknown) => error,
      );
    expect((refused as UmbraError).details).toMatchObject({ sqlstate: "23514" });
  }, 120_000);

  it("hashes the opted-out tables by name only: equal for different rows, different without the tables", async () => {
    const one = await chainWith(requestsModule({ deterministic: false }, '{"x": 1}'), 3n);
    // Another database: other notes, other times (now()), one more row drawn from the sequence.
    const two = await chainWith(requestsModule({ deterministic: false }, '{"y": 2.5}'), 3n);
    await two.db.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_kreq");
      await tx.execute("INSERT INTO kreq.requests (note) VALUES ('{}')");
      await tx.execute("INSERT INTO kreq.requests_log (height) VALUES (999)");
    });
    expect(await hashOf(two, two.plan.optedOut)).toEqual(await hashOf(one, one.plan.optedOut));
    // A third, the same but without the two tables: it hashes differently, for their names alone.
    const three = await chainWith(requestsModule({ deterministic: false }, '{"x": 1}'), 3n);
    await three.db.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_kreq");
      await tx.execute("DROP TABLE kreq.requests, kreq.requests_log");
    });
    expect(await hashOf(three, three.plan.optedOut)).not.toEqual(await hashOf(one, one.plan.optedOut));
    // Control: without the list, the hash reads the tables as any other, and the rules refuse them.
    const unlisted = await hashOf(one).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(unlisted).toBeInstanceOf(ModuleContentsError);
    expect((unlisted as ModuleContentsError).reason).toBe("non-deterministic-column");
    expect([(unlisted as ModuleContentsError).table, (unlisted as ModuleContentsError).column]).toEqual(["requests", "id"]);
  }, 180_000);

  it("records an opted-out table as [schema, table, null, null]: the hash against CBOR written out by hand", async () => {
    const { db } = await backend.database(`
      CREATE SCHEMA o;
      CREATE TABLE o.free (at timestamp DEFAULT now(), n double precision);
      INSERT INTO o.free (n) VALUES (0.5);
      CREATE TABLE o.t (k bigint PRIMARY KEY);
      INSERT INTO o.t VALUES (1);`);
    const hash = await db.read((read) => contentsHash(read, { optedOut: [{ schema: "o", table: "free" }] }));
    const expected = createHash("sha256")
      .update(
        Buffer.from(
          // [["o", "free", null, null], ["o", "t", ["k"], [[1]]]]
          "82" + "84" + "616f" + "6466726565" + "f6" + "f6" + "84" + "616f" + "6174" + "81616b" + "81" + "8101",
          "hex",
        ),
      )
      .digest();
    expect(Buffer.from(hash).toString("hex")).toBe(expected.toString("hex"));
  }, 60_000);

  it("leaves the opted-out tables and their partitions out of the digests; digests the module's other table", async () => {
    const chain = await chainWith(requestsModule({ deterministic: false }, '{"x": 1}'), 3n);
    const [row] = await chain.db.read((read) =>
      read.query(
        `SELECT (SELECT array_agg(tgrelid::regclass::text) FROM pg_trigger
                  WHERE tgname = '${CAPTURE_TRIGGER}' AND tgrelid::regclass::text LIKE 'kreq.%') AS captured,
                (SELECT array_agg(c.relname::text) FROM pg_class c
                  WHERE c.relnamespace = '${SHADOW_SCHEMA}'::regnamespace AND c.relkind = 'r') AS shadows,
                (SELECT array_agg("schema" || '.' || "table") FROM core_digest.tables) AS digested`,
      ),
    );
    const sorted = (list: unknown) => [...(list as string[])].sort();
    expect({ captured: sorted(row?.captured), shadows: sorted(row?.shadows), digested: sorted(row?.digested) }).toEqual({
      captured: ["kreq.counts"],
      shadows: [shadowTableName("core_block_commit", "blocks"), shadowTableName("kreq", "counts")].sort(),
      digested: ["core_block_commit.blocks", "kreq.counts"],
    });
  }, 120_000);

  it("refuses startup with non-deterministic-column for the same tables without the flag", async () => {
    const { db } = await backend.database("SELECT 1");
    const refused = await startChain(db, [requestsModule({}, '{"x": 1}')]).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(refused).toBeInstanceOf(UmbraError);
    const error = refused as UmbraError;
    expect(error.code).toBe("non-deterministic-column");
    expect(error.details).toMatchObject({ module: "kreq", schema: "kreq", table: "requests", column: "id", migration: "001" });
    expect(error.message.startsWith('non-deterministic-column: module "kreq", table "kreq"."requests", column "id" (integer): ')).toBe(true);
    // The migration rolled back with the refusal: none of its tables exists.
    expect(await db.read((read) => read.query("SELECT to_regclass('kreq.requests') AS t, to_regclass('kreq.counts') AS c"))).toEqual([
      { t: null, c: null },
    ]);
  }, 60_000);
});
