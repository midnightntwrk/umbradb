import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaPlan } from "../../src/db/roles.js";
import {
  catalogRelations,
  catalogTables,
  databaseRefusals,
  optOut,
  type PlacedRefusal,
  type RelationFacts,
  type TableFacts,
} from "../../src/deterministic-postgresql/index.js";
import { migrationPart, schemaModules } from "../../src/modules/adapters.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { BACKENDS } from "../db/backends.js";
import { declaration, userModules } from "../modules/declarations.js";

/**
 * The opt-out of `design.md` §4's component table, row 9 (MD-1, DT-6; owner decision Q76; task 3.1): a `table` item
 * declared `deterministic: false` opts its tables out of the determinism rules. The declaration is the module's
 * (`src/modules/`); the skip is the component's, written once — {@link optOut}, which DT-6's refusals
 * ({@link databaseRefusals}, given the opted-out tables) and the `TRUNCATE` guard (`truncateGuardStatements`, task
 * 2.3) both use, and which task 7.1's startup check, `CHECK`s and change capture call: an opted-out table, the
 * partitions of an opted-out partitioned table, the sequences their columns own and such a table when unlogged are
 * skipped; every other table and sequence of the module is still refused as before. Shown here from a declaration,
 * through the schema plan (`plan.optedOut`, task 2.3) and the migrations that create the tables (task 2.4), on both
 * backends. The startup check that refuses (DT-6 at migration time), the `CHECK`s, the contents hash's
 * `[schema, table, null, null]` and the digests are task 7.1's.
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

  /** Starts a fresh database with `module` and returns its plan and the module schema's refusals. */
  async function started(module: ModuleDeclaration): Promise<{ db: Database; plan: SchemaPlan }> {
    const { db } = await backend.database("SELECT 1");
    const set = validateDeclarations(userModules([module]));
    const plan = planSchemas(schemaModules(set.user));
    const parts = set.user.map((d) => migrationPart(d, { items: new Map(), revisions: [], publish: () => {} }));
    await startDatabase(db, { plan, parts, committedVersions: new Map(), handles: { height: null } });
    return { db, plan };
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
});
