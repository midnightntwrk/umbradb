import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import {
  ID_MAX_BYTES,
  itemRoleName,
  migrationChecksum,
  moduleRoleName,
  planSchemas,
  schemaName,
  type SchemaModule,
} from "../../src/db/roles.js";

/**
 * The schema names and their refusals, decided before anything reaches a database:
 * - schemas are named after module ids (`-` → `_`);
 * - a shared item gets one schema named after it;
 * - ids and item names match the name pattern of `src/db/roles.ts`, within 40 bytes;
 * - schema names never collide with each other or with a reserved schema.
 * [A15, DB-8, MD-2]
 *
 * Refusing at startup is the runner's job: it calls {@link planSchemas} with the real declarations; here the plan is
 * given them directly. The database half (the roles and schemas created, two 40-byte ids as two roles) is in
 * `roles.test.ts`.
 */

/** A module with the given id and, unless `provides` says otherwise, one table item in its own schema. */
function module(id: string, rest: Partial<SchemaModule> = {}): SchemaModule {
  return {
    id,
    requires: [],
    provides: [{ name: `${id}-rows`, table: { schema: schemaName(id), tables: ["rows"] } }],
    migrations: [{ id: "001", sql: `CREATE TABLE ${schemaName(id)}.rows (k bigint PRIMARY KEY)` }],
    ...rest,
  };
}

/** A provider of the shared table item `shared-x`, in its schema `shared_x`, with the given migrations and flag. */
function provider(id: string, sql: string, deterministic?: false): SchemaModule {
  return {
    id,
    requires: [],
    provides: [
      {
        name: "shared-x",
        table: { schema: "shared_x", tables: ["logs"], ...(deterministic === undefined ? {} : { deterministic }) },
      },
    ],
    migrations: [{ id: "001", sql }],
  };
}

const LOGS = "CREATE TABLE shared_x.logs (height bigint PRIMARY KEY)";

/** The error `run` throws; fails the test if it returns. */
function refusal(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a refusal");
}

describe("A15: schemas are named after module ids, roles after schemas (DB-8)", () => {
  it("names a module's schema after its id with - replaced by _, and its role umbradb_m_<schema>", () => {
    expect(schemaName("core-chain-events")).toBe("core_chain_events");
    expect(moduleRoleName("core_chain_events")).toBe("umbradb_m_core_chain_events");
    expect(itemRoleName("contract_logs")).toBe("umbradb_i_contract_logs");
    const plan = planSchemas([module("core-chain-events"), module("token-index")]);
    expect(plan.schemas).toEqual([
      { name: "core_chain_events", role: "umbradb_m_core_chain_events", of: { module: "core-chain-events" } },
      { name: "token_index", role: "umbradb_m_token_index", of: { module: "token-index" } },
    ]);
    expect(plan.writeRole("core-chain-events")).toBe("umbradb_m_core_chain_events");
    expect(plan.writeSchema("token-index")).toBe("token_index");
  });

  it("gives a shared item one schema named after it, owned by umbradb_i_<item>, which each provider writes under", () => {
    const plan = planSchemas([provider("logs-full", LOGS), provider("logs-fast", LOGS), module("reader")]);
    expect(plan.schemas).toEqual([
      { name: "logs_full", role: "umbradb_m_logs_full", of: { module: "logs-full" } },
      { name: "logs_fast", role: "umbradb_m_logs_fast", of: { module: "logs-fast" } },
      { name: "reader", role: "umbradb_m_reader", of: { module: "reader" } },
      { name: "shared_x", role: "umbradb_i_shared_x", of: { item: "shared-x" } },
    ]);
    expect(plan.writeRole("logs-full")).toBe("umbradb_i_shared_x");
    expect(plan.writeRole("logs-fast")).toBe("umbradb_i_shared_x");
    expect(plan.writeSchema("logs-fast")).toBe("shared_x");
    expect(plan.writeRole("reader")).toBe("umbradb_m_reader");
  });

  it("makes an item shared by its declared schema, so one provider in the build already writes the item's schema", () => {
    const plan = planSchemas([provider("logs-full", LOGS)]);
    expect(plan.schemas.map((schema) => schema.name)).toEqual(["logs_full", "shared_x"]);
    expect(plan.writeRole("logs-full")).toBe("umbradb_i_shared_x");
  });

  it("lists the tables declared deterministic: false, which keep no TRUNCATE trigger", () => {
    const plan = planSchemas([
      module("a", {
        provides: [
          { name: "a-rows", table: { schema: "a", tables: ["rows"] } },
          { name: "a-cache", table: { schema: "a", tables: ["cache", "seen"], deterministic: false } },
        ],
      }),
      provider("p1", LOGS, false),
      provider("p2", LOGS, false),
    ]);
    expect(plan.optedOut).toEqual([
      { schema: "a", table: "cache" },
      { schema: "a", table: "seen" },
      { schema: "shared_x", table: "logs" },
    ]);
  });

  it("gives two 40-byte ids differing only in their last character two distinct roles within 63 bytes", () => {
    const first = `${"a".repeat(39)}b`;
    const second = `${"a".repeat(39)}c`;
    expect(Buffer.byteLength(first)).toBe(ID_MAX_BYTES);
    // No items: an item named after a 40-byte id would itself be longer than 40 bytes.
    const plan = planSchemas([module(first, { provides: [] }), module(second, { provides: [] })]);
    const roles = plan.schemas.map((schema) => schema.role);
    expect(new Set(roles).size).toBe(2);
    for (const role of roles) expect(Buffer.byteLength(role)).toBeLessThanOrEqual(63);
    expect(itemRoleName(schemaName(first)).length).toBeLessThanOrEqual(63);
  });

  it("knows only the modules it planned", () => {
    const plan = planSchemas([module("a")]);
    expect(() => plan.writeRole("b")).toThrow("module b is not in the schema plan");
    expect(() => plan.writeSchema("b")).toThrow("module b is not in the schema plan");
  });

  it("takes the checksum of a migration as SHA-256 of its UTF-8 SQL (DB-9), which shared items compare", () => {
    expect(migrationChecksum("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    // `printf '\xc3\xa9' | shasum -a 256`: the UTF-8 bytes of "é" (its Latin-1 byte would give de2e331d…).
    expect(migrationChecksum("é")).toBe("4a99557e4033c3539de2eb65472017cad5f9557f7a0625a09f1c3f6e2ba69c4c");
  });
});

describe("A15: ids and item names that do not match DB-8's pattern fail with bad-id", () => {
  for (const id of ["core_chain", "A-b", "a--b", "-a", `${"a".repeat(40)}b`]) {
    it(`refuses the module id ${JSON.stringify(id.length > 40 ? `${id.length} bytes` : id)}`, () => {
      const error = refusal(() => planSchemas([module("ok"), { ...module("x"), id }]));
      expect(error.code).toBe("bad-id");
      expect(error.retryable).toBe(false);
      expect(error.details).toMatchObject({ id, of: "module", limit: 40, bytes: Buffer.byteLength(id) });
      expect(error.message).toContain(JSON.stringify(id));
      expect(error.message).toContain("40 bytes");
      expect(error.message).toContain("^[a-z][a-z0-9]*(-[a-z0-9]+)*$");
    });
  }

  it("counts an id's bytes in UTF-8, not its characters", () => {
    const error = refusal(() => planSchemas([module("ok"), { ...module("x"), id: "café" }]));
    expect(error.code).toBe("bad-id");
    expect(error.details).toMatchObject({ id: "café", bytes: 5 });
    expect(error.message).toContain("it is 5 bytes long");
  });

  it("says how long a 41-byte id is, and the limit", () => {
    const id = `${"a".repeat(40)}b`;
    const error = refusal(() => planSchemas([module(id)]));
    expect(error.message).toContain("41 bytes");
    expect(error.message).toContain("at most 40 bytes");
  });

  it("refuses an item name, provided or required, that does not match, naming the module that declares it", () => {
    const provided = refusal(() => planSchemas([module("a", { provides: [{ name: "Rows" }] })]));
    expect(provided.code).toBe("bad-id");
    expect(provided.details).toMatchObject({ id: "Rows", of: "item", module: "a" });
    const required = refusal(() => planSchemas([module("a", { requires: ["chain_events"] })]));
    expect(required.code).toBe("bad-id");
    expect(required.details).toMatchObject({ id: "chain_events", of: "item", module: "a" });
  });

  it("accepts ids that match within 40 bytes", () => {
    expect(() =>
      planSchemas([
        module("a"),
        module("a1-b2"),
        module("core-chain-events"),
        module(`x${"-y".repeat(19)}9`, { provides: [{ name: `r${"-y".repeat(19)}9` }] }),
      ]),
    ).not.toThrow();
  });
});

describe("A15: colliding schema names refuse startup, naming both (DB-8, MD-2)", () => {
  it("refuses a module and an item with the same name", () => {
    const error = refusal(() =>
      planSchemas([
        module("token-index", { provides: [] }),
        module("indexer", { provides: [{ name: "token-index" }] }),
      ]),
    );
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({
      schema: "token_index",
      first: "module token-index",
      second: "item token-index (provided by indexer)",
    });
    expect(error.message).toContain("module token-index");
    expect(error.message).toContain("item token-index");
  });

  for (const [id, schema] of [
    ["pg-x", "pg_x"],
    ["public", "public"],
    ["information-schema", "information_schema"],
    ["core-digest", "core_digest"],
    ["core-digest-shadow", "core_digest_shadow"],
    ["core-chain", "core_chain"],
  ] as const) {
    it(`refuses a module named ${id}, whose schema ${schema} is reserved`, () => {
      const error = refusal(() => planSchemas([module(id)]));
      expect(error.code).toBe("schema-collision");
      expect(error.details).toMatchObject({ schema, first: `module ${id}`, second: `reserved schema ${schema}` });
      expect(error.message).toContain(`module ${id}`);
      expect(error.message).toContain(`reserved schema ${schema}`);
    });
  }

  it("refuses an item whose schema name would be reserved", () => {
    const error = refusal(() => planSchemas([module("a", { provides: [{ name: "pg-cache" }] })]));
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({ schema: "pg_cache", second: "reserved schema pg_cache" });
  });

  it("refuses two modules with one id, which would share a schema", () => {
    const error = refusal(() => planSchemas([module("a"), module("a")]));
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({ schema: "a", first: "module a", second: "module a" });
  });

  it("refuses a table item declared in a schema that is neither its module's nor its own (Q89)", () => {
    const error = refusal(() =>
      planSchemas([module("a"), module("b", { provides: [{ name: "b-rows", table: { schema: "a", tables: ["rows"] } }] })]),
    );
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({ schema: "a", module: "b", item: "b-rows", allowed: ["b", "b_rows"] });
    expect(error.message).toContain("b-rows");
  });

  it("refuses a module whose table items name two schemas (Q89)", () => {
    const error = refusal(() =>
      planSchemas([
        module("a", {
          provides: [
            { name: "a-rows", table: { schema: "a", tables: ["rows"] } },
            { name: "shared-x", table: { schema: "shared_x", tables: ["logs"] } },
          ],
        }),
      ]),
    );
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({ module: "a", schemas: ["a", "shared_x"] });
  });
});

describe("A15: the providers of one shared item must declare it alike (DB-8, Q76)", () => {
  it("accepts two providers with identical migrations and flags (a handoff, MD-6)", () => {
    expect(() => planSchemas([provider("p1", LOGS), provider("p2", LOGS)])).not.toThrow();
    expect(() => planSchemas([provider("p1", LOGS, false), provider("p2", LOGS, false)])).not.toThrow();
  });

  it("refuses two providers whose migration 001 differs, naming the item", () => {
    const error = refusal(() =>
      planSchemas([provider("p1", LOGS), provider("p2", `${LOGS};`)]),
    );
    expect(error.code).toBe("shared-item-migrations-differ");
    expect(error.details).toMatchObject({
      item: "shared-x",
      providers: ["p1", "p2"],
      migration: "001",
      checksums: [migrationChecksum(LOGS), migrationChecksum(`${LOGS};`)],
    });
    expect(error.message).toContain("shared-x");
    expect(error.message).toContain("001");
  });

  it("refuses two providers whose migration ids differ, or one with a migration the other lacks", () => {
    const renamed = refusal(() =>
      planSchemas([provider("p1", LOGS), { ...provider("p2", LOGS), migrations: [{ id: "001a", sql: LOGS }] }]),
    );
    expect(renamed.code).toBe("shared-item-migrations-differ");
    expect(renamed.details).toMatchObject({ item: "shared-x", migration: "001" });
    const longer = refusal(() =>
      planSchemas([
        provider("p1", LOGS),
        { ...provider("p2", LOGS), migrations: [{ id: "001", sql: LOGS }, { id: "002", sql: "SELECT 1" }] },
      ]),
    );
    expect(longer.code).toBe("shared-item-migrations-differ");
    expect(longer.details).toMatchObject({ item: "shared-x", migration: "002" });
  });

  it("refuses two providers whose deterministic flags differ, naming the item (Q76, TC-08)", () => {
    const error = refusal(() => planSchemas([provider("p1", LOGS), provider("p2", LOGS, false)]));
    expect(error.code).toBe("shared-item-migrations-differ");
    expect(error.details).toMatchObject({ item: "shared-x", providers: ["p1", "p2"], deterministic: [true, false] });
    expect(error.message).toContain("shared-x");
    expect(error.message).toContain("deterministic");
  });

  it("refuses an item that several modules provide when one declares its table in its own schema (Q89)", () => {
    const error = refusal(() =>
      planSchemas([
        provider("p1", LOGS),
        { ...provider("p2", LOGS), provides: [{ name: "shared-x", table: { schema: "p2", tables: ["logs"] } }] },
      ]),
    );
    expect(error.code).toBe("shared-item-migrations-differ");
    expect(error.details).toMatchObject({ item: "shared-x", providers: ["p1", "p2"], schemas: ["shared_x", "p2"] });
  });
});

describe("DB-8: the items of UmbraDB's own parts share the one namespace (task 3.2)", () => {
  // `core-chain` and `core-digest` are no modules of a plan (their schemas are reserved), yet their items' names are
  // names like any other: a module may not take one as its id.
  const coreChain = { id: "core-chain", provides: [{ name: "db" }, { name: "config" }] };
  const coreDigest = { id: "core-digest", provides: [{ name: "digest-tables" }] };

  it("refuses a module named after an own part's item, naming both", () => {
    for (const [id, own] of [
      ["db", "core-chain"],
      ["config", "core-chain"],
      ["digest-tables", "core-digest"],
    ] as const) {
      const error = refusal(() => planSchemas([module(id, { provides: [] })], [coreChain, coreDigest]));
      expect(error.code).toBe("schema-collision");
      const schema = schemaName(id);
      expect(error.details).toEqual({ schema, first: `module ${id}`, second: `item ${id} (provided by ${own})` });
    }
  });

  it("refuses nothing without the own parts, as before", () => {
    expect(() => planSchemas([module("db", { provides: [] })])).not.toThrow();
  });

  it("names every provider of an item that an own part and a module both provide", () => {
    const both = [module("x", { provides: [{ name: "config" }] }), module("config", { provides: [] })];
    const error = refusal(() => planSchemas(both, [coreChain]));
    expect(error.details).toEqual({
      schema: "config",
      first: "module config",
      second: "item config (provided by x, core-chain)",
    });
    // Alone, the two providers collide with no schema: two providers of one item are the graph's to refuse. [MD-6]
    expect(() => planSchemas([module("x", { provides: [{ name: "config" }] })], [coreChain])).not.toThrow();
  });

  it("checks an own part's item names with bad-id", () => {
    const error = refusal(() => planSchemas([], [{ id: "core-chain", provides: [{ name: "Db" }] }]));
    expect(error.code).toBe("bad-id");
    expect(error.details).toMatchObject({ id: "Db", of: "item", module: "core-chain" });
  });

  it("plans no schema or role for an own part's item", () => {
    const plan = planSchemas([module("a")], [coreChain, coreDigest]);
    expect(plan.schemas.map((schema) => schema.name)).toEqual(["a"]);
  });
});
