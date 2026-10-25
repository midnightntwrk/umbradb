import { isDeepStrictEqual } from "node:util";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as mini from "zod/mini";
import { UmbraError } from "../../src/db/errors.js";
import { planSchemas } from "../../src/db/roles.js";
import { schemaModules } from "../../src/modules/adapters.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import {
  DECLARATION_RULES,
  type DeclarationRule,
  type DeclarationSet,
  validateDeclarations,
  validateWith,
} from "../../src/modules/validation.js";
import { declaration, userModules } from "./declarations.js";

/**
 * A21 (MD-2; task 3.1): declarations are validated at startup, and each cause MD-2 names refuses with its code, naming
 * the module and what is wrong — a duplicate id, a user module's id that is `core` (the `core` entry's, task 4.1) or
 * starts with `core-` or `on-`, no requirement, an item without a lifetime, a `table` item without a kind, a settings
 * field without a kind. MD-2's other causes are checked by the same validation (`bad-id`, below) or by the schema plan
 * it feeds (`schema-collision` and `shared-item-migrations-differ`, `planSchemas`, task 2.3, A15). Everything else the
 * declaration's type forbids is refused as well (`invalid-declaration`), so a module built without types is held to the
 * same declaration (A20). "Startup refuses" is the runner's (task 5.x); here the validation is called directly.
 */

/** The refusal `run` throws, or undefined when it returns. */
function thrown(run: () => unknown): UmbraError | undefined {
  try {
    run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return undefined;
}

/** The refusal `run` throws; fails the test if it returns. */
function refusal(run: () => unknown): UmbraError {
  return thrown(run) ?? expect.unreachable("expected a refusal");
}

/** A declaration as a plain record, to change or remove what the type requires. */
function loose(id: string, change: (d: Record<string, unknown>) => void = () => {}): Record<string, unknown> {
  const d = { ...declaration(id) } as unknown as Record<string, unknown>;
  change(d);
  return d;
}

/** The first item of a loose declaration, copied so that it can be changed. */
function firstItem(d: Record<string, unknown>): Record<string, unknown> {
  const item = { ...(d.provides as Record<string, unknown>[])[0] } as Record<string, unknown>;
  d.provides = [item];
  return item;
}

/** One cause of MD-2 triggered alone: the declarations, and the refusal's code, names and words. */
interface Case {
  readonly name: string;
  readonly set: DeclarationSet;
  readonly code: string;
  readonly details: Record<string, unknown>;
  /** Words the message must hold: the cause and its fix. */
  readonly says: readonly string[];
}

const A21: readonly Case[] = [
  {
    name: "duplicate id: two user modules",
    set: userModules([declaration("stats"), declaration("stats")]),
    code: "duplicate-id",
    details: { module: "stats", first: { origin: "user", index: 0 }, second: { origin: "user", index: 1 } },
    says: ["the user module stats (position 2)", "the user module at position 1", "an id of its own", "rename"],
  },
  {
    name: "duplicate id: a backbone part and a core module",
    set: { backbone: [declaration("core-block-fetch")], core: [declaration("core-block-fetch")], user: [] },
    code: "duplicate-id",
    details: {
      module: "core-block-fetch",
      first: { origin: "backbone", index: 0 },
      second: { origin: "core", index: 0 },
    },
    says: ["the core module core-block-fetch (position 1)", "the backbone part at position 1"],
  },
  {
    name: "core- prefix",
    set: userModules([declaration("core-stats")]),
    code: "reserved-prefix",
    details: { module: "core-stats", prefix: "core-" },
    says: ['user module core-stats has an id starting with "core-"', "UmbraDB's own", "choose an id"],
  },
  {
    name: "on- prefix",
    set: userModules([declaration("on-chain-stats")]),
    code: "reserved-prefix",
    details: { module: "on-chain-stats", prefix: "on-" },
    says: ['user module on-chain-stats has an id starting with "on-"', "point names", "choose an id"],
  },
  {
    name: "the id core, the core entry's (docs/issues/00012)",
    set: userModules([declaration("core")]),
    code: "reserved-prefix",
    details: { module: "core" },
    says: ['user module core has the id "core"', "the core's own configuration entries", "choose another id"],
  },
  {
    name: "no requirement: a user module",
    set: userModules([declaration("stats", { requires: [] })]),
    code: "no-requirement",
    details: { module: "stats" },
    says: ["module stats requires no item", "at least one", "requires"],
  },
  {
    name: "no requirement: a core module",
    set: { backbone: [], core: [declaration("core-stats", { requires: [] })], user: [] },
    code: "no-requirement",
    details: { module: "core-stats" },
    says: ["module core-stats requires no item"],
  },
  {
    name: "item without lifetime: an empty list",
    set: userModules([loose("stats", (d) => void (firstItem(d).lifetimes = []))]),
    code: "item-no-lifetime",
    details: { module: "stats", item: "stats-rows" },
    says: ["module stats provides the item stats-rows without a lifetime", "process", "block", "table", "lifetimes"],
  },
  {
    name: "item without lifetime: none given",
    set: userModules([loose("stats", (d) => void delete firstItem(d).lifetimes)]),
    code: "item-no-lifetime",
    details: { module: "stats", item: "stats-rows" },
    says: ["module stats provides the item stats-rows without a lifetime"],
  },
  {
    name: "table item without kind: no kind in its table",
    set: userModules([
      loose("stats", (d) => {
        const item = firstItem(d);
        item.table = { schema: "stats", tables: ["rows"] };
      }),
    ]),
    code: "table-item-no-kind",
    details: { module: "stats", item: "stats-rows" },
    says: ["module stats declares the table item stats-rows without a kind", '"append-only"', '"mutable"', "kind"],
  },
  {
    name: "table item without kind: no table at all",
    set: userModules([loose("stats", (d) => void delete firstItem(d).table)]),
    code: "table-item-no-kind",
    details: { module: "stats", item: "stats-rows" },
    says: ["module stats declares the table item stats-rows without a kind", "no table"],
  },
  {
    name: "field without kind: no metadata",
    set: userModules([declaration("stats", { configSchema: z.object({ pollMs: z.number().int() }) })]),
    code: "field-no-kind",
    details: { module: "stats", field: "pollMs", kind: null },
    says: ['the setting "pollMs" of module stats has no kind', "data", "operational", "secret", ".meta({ kind"],
  },
  {
    name: "field without kind: the kind set before .default(), which hides it",
    set: userModules([
      declaration("stats", { configSchema: z.object({ limit: z.number().int().meta({ kind: "data" }).default(10) }) }),
    ]),
    code: "field-no-kind",
    details: { module: "stats", field: "limit", kind: null },
    says: ['the setting "limit" of module stats has no kind', "after .default()"],
  },
  {
    name: "field without kind: a field schema that cannot carry metadata (zod/mini)",
    set: userModules([declaration("stats", { configSchema: z.object({ pollMs: mini.number() }) })]),
    code: "field-no-kind",
    details: { module: "stats", field: "pollMs", kind: null },
    says: ['the setting "pollMs" of module stats has no kind'],
  },
  {
    name: "field without kind: a kind that is none of the three",
    set: userModules([declaration("stats", { configSchema: z.object({ pollMs: z.number().meta({ kind: "public" }) }) })]),
    code: "field-no-kind",
    details: { module: "stats", field: "pollMs", kind: "public" },
    says: ['the setting "pollMs" of module stats has the kind "public"'],
  },
];

/** The rule each case of A21 is about, by its code. */
function ruleOf(c: Case): DeclarationRule {
  const rule = DECLARATION_RULES.find((candidate) => candidate.code === c.code);
  if (rule === undefined) throw new Error(`no rule refuses with ${c.code}`);
  return rule;
}

/** The cases of A21 that `rules` do not refuse as the case says: each with what went wrong. */
function failures(rules: readonly DeclarationRule[]): string[] {
  const out: string[] = [];
  for (const c of A21) {
    const error = thrown(() => validateWith(c.set, rules));
    if (error === undefined) out.push(`${c.name}: accepted`);
    else if (error.code !== c.code) out.push(`${c.name}: ${error.code}`);
    else if (!isDeepStrictEqual({ ...error.details }, c.details)) out.push(`${c.name}: details`);
  }
  return out;
}

describe("A21: each refusal of MD-2, with its code and names", () => {
  for (const c of A21) {
    it(c.name, () => {
      const error = refusal(() => validateDeclarations(c.set));
      expect(error.code).toBe(c.code);
      expect(error.retryable).toBe(false);
      expect(error.details).toEqual(c.details);
      for (const text of c.says) expect(error.message, text).toContain(text);
      // Every message gives the requirement it applies.
      expect(error.message).toMatch(/\((MD-1|MD-2|CF-4|DB-8)[,)]/);
    });
  }

  it("covers every cause A21 names, and each rule of MD-2 is triggered", () => {
    expect([...new Set(A21.map((c) => c.code))].sort()).toEqual([
      "duplicate-id",
      "field-no-kind",
      "item-no-lifetime",
      "no-requirement",
      "reserved-prefix",
      "table-item-no-kind",
    ]);
    expect(DECLARATION_RULES.map((rule) => rule.code)).toEqual([
      "bad-id",
      "reserved-prefix",
      "duplicate-id",
      "no-requirement",
      "item-no-lifetime",
      "table-item-no-kind",
      "field-no-kind",
      "unknown-point",
    ]);
    expect(failures(DECLARATION_RULES)).toEqual([]);
  });

  it("negative control: a validation that skips one rule of MD-2 fails exactly that rule's cases", () => {
    for (const rule of DECLARATION_RULES) {
      const without = DECLARATION_RULES.filter((other) => other !== rule);
      const expected = A21.filter((c) => ruleOf(c) === rule).map((c) => c.name);
      expect(
        failures(without).map((failure) => failure.slice(0, failure.lastIndexOf(":"))),
        rule.code,
      ).toEqual(expected);
    }
  });

  it("controls: the exemptions and the near misses are accepted", () => {
    const set: DeclarationSet = {
      // A backbone part may require nothing (core-chain, core-health, core-status, core-config).
      backbone: [declaration("core-chain", { requires: [] })],
      // UmbraDB's own core modules carry the core- prefix.
      core: [declaration("core-chain-events")],
      // Only the id "core" and the prefixes "core-" and "on-" are reserved: "cores", "corelog", "online-stats" and
      // "on" are user ids like any.
      user: [declaration("cores"), declaration("corelog"), declaration("online-stats"), declaration("on")],
    };
    const validated = validateDeclarations(set);
    expect(validated).toEqual(set);
    expect(validated.backbone[0]).toBe(set.backbone[0]);
    expect(validated.user[3]).toBe(set.user[3]);
  });

  it("refuses a duplicate id as such, where the schema plan would call it a schema collision (DB-8)", () => {
    const twice = [declaration("stats"), declaration("stats")];
    expect(refusal(() => planSchemas(schemaModules(twice))).code).toBe("schema-collision");
    expect(refusal(() => validateDeclarations(userModules(twice))).code).toBe("duplicate-id");
  });

  it("names the first refusal by rule, whatever the order of the declarations", () => {
    const set = userModules([declaration("stats", { requires: [] }), declaration("core-stats")]);
    expect(refusal(() => validateDeclarations(set)).code).toBe("reserved-prefix");
  });
});

describe("MD-2: ids and item names match DB-8's pattern (bad-id, the schema plan's check)", () => {
  const cases: readonly (readonly [string, ModuleDeclaration, Record<string, unknown>])[] = [
    ["an id with a capital", declaration("Stats"), { id: "Stats", of: "module" }],
    ["an id with an underscore", declaration("core_chain"), { id: "core_chain", of: "module" }],
    ["an id of 41 bytes", declaration(`m${"a".repeat(40)}`), { id: `m${"a".repeat(40)}`, of: "module", bytes: 41 }],
    [
      "a provided item's name",
      declaration("stats", { provides: [{ name: "Rows", lifetimes: ["block"] }] }),
      { id: "Rows", of: "item", module: "stats" },
    ],
    [
      "a required item's name",
      declaration("stats", { requires: ["block_header"] }),
      { id: "block_header", of: "item", module: "stats" },
    ],
  ];
  for (const [name, d, details] of cases) {
    it(name, () => {
      const error = refusal(() => validateDeclarations(userModules([d])));
      expect(error.code).toBe("bad-id");
      expect(error.details).toMatchObject({ ...details, limit: 40 });
    });
  }

  it("checks the id before the prefix: core_x is a bad id, core-x a reserved prefix", () => {
    expect(refusal(() => validateDeclarations(userModules([declaration("core_x")]))).code).toBe("bad-id");
    expect(refusal(() => validateDeclarations(userModules([declaration("core-x")]))).code).toBe("reserved-prefix");
  });
});

/** A shape the declaration's type forbids: the change, and the field the refusal names. */
interface ShapeCase {
  readonly name: string;
  readonly build: () => unknown;
  readonly field: string;
  /** Words the message must hold. */
  readonly says?: readonly string[];
}

const SHAPES: readonly ShapeCase[] = [
  { name: "null", build: () => null, field: "", says: ["the user module at position 1", "is not an object"] },
  { name: "an array", build: () => [declaration("stats")], field: "", says: ["is not an object"] },
  { name: "a string", build: () => "stats", field: "" },
  {
    name: "an unknown property (a misspelled one)",
    build: () => loose("stats", (d) => void (d.requireResync = true)),
    field: "requireResync",
    says: ["requireResync", "requiresResync"],
  },
  { name: "no id", build: () => loose("stats", (d) => void delete d.id), field: "id" },
  { name: "an id that is a number", build: () => loose("stats", (d) => void (d.id = 7)), field: "id" },
  {
    name: "a version that is not semver",
    build: () => loose("stats", (d) => void (d.version = "1.0")),
    field: "version",
    says: ["semver"],
  },
  { name: "no version", build: () => loose("stats", (d) => void delete d.version), field: "version" },
  {
    name: "a side that is neither public nor private",
    build: () => loose("stats", (d) => void (d.side = "both")),
    field: "side",
    says: ['"public" or "private"'],
  },
  { name: "no requires", build: () => loose("stats", (d) => void delete d.requires), field: "requires" },
  { name: "requires not a list", build: () => loose("stats", (d) => void (d.requires = "block-header")), field: "requires" },
  {
    name: "requires given as a function",
    build: () => loose("stats", (d) => void (d.requires = () => ["block-header"])),
    field: "requires",
    says: ["requires is a function"],
  },
  { name: "a required item that is not a string", build: () => loose("stats", (d) => void (d.requires = [1])), field: "requires[0]" },
  { name: "provides not a list", build: () => loose("stats", (d) => void (d.provides = {})), field: "provides" },
  { name: "an item that is not an object", build: () => loose("stats", (d) => void (d.provides = ["rows"])), field: "provides[0]" },
  {
    name: "an item with an unknown property",
    build: () => loose("stats", (d) => void (firstItem(d).lifetime = ["block"])),
    field: "provides[0].lifetime",
  },
  { name: "an item without a name", build: () => loose("stats", (d) => void delete firstItem(d).name), field: "provides[0].name" },
  {
    name: "lifetimes not a list",
    build: () => loose("stats", (d) => void (firstItem(d).lifetimes = "block")),
    field: "provides[0].lifetimes",
  },
  {
    name: "a lifetime that does not exist",
    build: () => loose("stats", (d) => void (firstItem(d).lifetimes = ["block", "forever"])),
    field: "provides[0].lifetimes[1]",
    says: ['"process", "block" or "table"'],
  },
  {
    name: "a table that is not an object",
    build: () => loose("stats", (d) => void (firstItem(d).table = "rows")),
    field: "provides[0].table",
  },
  {
    name: "a table with an unknown property",
    build: () =>
      loose("stats", (d) => {
        const item = firstItem(d);
        item.table = { ...(item.table as object), name: "x" };
      }),
    field: "provides[0].table.name",
  },
  {
    name: "a table without a schema",
    build: () => loose("stats", (d) => void (firstItem(d).table = { tables: ["rows"], kind: "mutable" })),
    field: "provides[0].table.schema",
  },
  {
    name: "tables not a list",
    build: () => loose("stats", (d) => void (firstItem(d).table = { schema: "stats", tables: "rows", kind: "mutable" })),
    field: "provides[0].table.tables",
  },
  {
    name: "a table name that is not a string",
    build: () => loose("stats", (d) => void (firstItem(d).table = { schema: "stats", tables: [null], kind: "mutable" })),
    field: "provides[0].table.tables[0]",
  },
  {
    name: "a kind that does not exist",
    build: () => loose("stats", (d) => void (firstItem(d).table = { schema: "stats", tables: ["rows"], kind: "append" })),
    field: "provides[0].table.kind",
    says: ['"append-only" or "mutable"'],
  },
  {
    name: "deterministic: true (only false may be declared)",
    build: () =>
      loose("stats", (d) => {
        firstItem(d).table = { schema: "stats", tables: ["rows"], kind: "mutable", deterministic: true };
      }),
    field: "provides[0].table.deterministic",
    says: ["omit it", "deterministic: false"],
  },
  {
    name: "deterministic as a string",
    build: () =>
      loose("stats", (d) => {
        firstItem(d).table = { schema: "stats", tables: ["rows"], kind: "mutable", deterministic: "false" };
      }),
    field: "provides[0].table.deterministic",
  },
  {
    name: "a table on an item without the table lifetime",
    build: () => loose("stats", (d) => void (firstItem(d).lifetimes = ["block"])),
    field: "provides[0].table",
    says: ["the lifetime table"],
  },
  {
    name: "an item provided twice",
    build: () =>
      declaration("stats", {
        provides: [
          { name: "stats-rows", lifetimes: ["block"] },
          { name: "stats-rows", lifetimes: ["process"] },
        ],
      }),
    field: "provides[1].name",
    says: ["provides the item stats-rows twice"],
  },
  {
    name: "a table listed by two items",
    build: () =>
      declaration("stats", {
        provides: [
          { name: "stats-rows", lifetimes: ["table"], table: { schema: "stats", tables: ["rows"], kind: "mutable" } },
          {
            name: "stats-times",
            lifetimes: ["table"],
            table: { schema: "stats", tables: ["rows"], kind: "mutable", deterministic: false },
          },
        ],
      }),
    field: "provides[1].table.tables[0]",
    says: ["stats.rows", "stats-rows and stats-times", "one item"],
  },
  { name: "keyKinds not a list", build: () => loose("stats", (d) => void (d.keyKinds = "viewing")), field: "keyKinds" },
  {
    name: "a key kind that is not a string",
    build: () => loose("stats", (d) => Object.assign(d, { keyKinds: [7], validateKey: () => true })),
    field: "keyKinds[0]",
  },
  {
    name: "keyKinds without validateKey",
    build: () => loose("stats", (d) => void (d.keyKinds = ["viewing"])),
    field: "validateKey",
    says: ["required when keyKinds is set"],
  },
  {
    name: "validateKey that is not a function",
    build: () => loose("stats", (d) => Object.assign(d, { keyKinds: ["viewing"], validateKey: true })),
    field: "validateKey",
  },
  { name: "no startsMidChain", build: () => loose("stats", (d) => void delete d.startsMidChain), field: "startsMidChain" },
  { name: "needsLockstep not a boolean", build: () => loose("stats", (d) => void (d.needsLockstep = "yes")), field: "needsLockstep" },
  { name: "developmentOnly not a boolean", build: () => loose("stats", (d) => void (d.developmentOnly = 1)), field: "developmentOnly" },
  {
    name: "requiresResync not a boolean",
    build: () => loose("stats", (d) => void (d.requiresResync = "true")),
    field: "requiresResync",
  },
  { name: "no configSchema", build: () => loose("stats", (d) => void delete d.configSchema), field: "configSchema" },
  {
    name: "a configSchema that is a plain object",
    build: () => loose("stats", (d) => void (d.configSchema = { pollMs: { kind: "data" } })),
    field: "configSchema",
    says: ["z.object"],
  },
  {
    name: "a configSchema that is a zod record, not an object",
    build: () => loose("stats", (d) => void (d.configSchema = z.record(z.string(), z.string()))),
    field: "configSchema",
  },
  {
    name: "a configSchema from zod/mini",
    build: () => loose("stats", (d) => void (d.configSchema = mini.object({ pollMs: mini.number() }))),
    field: "configSchema",
  },
  { name: "migrations not a list", build: () => loose("stats", (d) => void (d.migrations = "001")), field: "migrations" },
  {
    name: "a migration that is not an object",
    build: () => loose("stats", (d) => void (d.migrations = ["CREATE TABLE stats.rows ()"])),
    field: "migrations[0]",
  },
  {
    name: "a migration without its SQL",
    build: () => loose("stats", (d) => void (d.migrations = [{ id: "001" }])),
    field: "migrations[0].sql",
  },
  {
    name: "a migration id that is not a string",
    build: () => loose("stats", (d) => void (d.migrations = [{ id: 1, sql: "SELECT 1" }])),
    field: "migrations[0].id",
  },
  {
    name: "a migration with an unknown property",
    build: () => loose("stats", (d) => void (d.migrations = [{ id: "001", sql: "SELECT 1", checksum: "x" }])),
    field: "migrations[0].checksum",
  },
  { name: "no points", build: () => loose("stats", (d) => void delete d.points), field: "points" },
  {
    name: "a point that is not a function",
    build: () => loose("stats", (d) => void (d.points = { "on-fetch": "fetch" })),
    field: 'points["on-fetch"]',
    says: ["a function"],
  },
];

describe("MD-1: a declaration of a shape its type forbids is refused (invalid-declaration)", () => {
  for (const c of SHAPES) {
    it(c.name, () => {
      const error = refusal(() => validateDeclarations(userModules([c.build()])));
      expect(error.code).toBe("invalid-declaration");
      expect(error.retryable).toBe(false);
      expect(error.details).toMatchObject({ origin: "user", index: 0, field: c.field });
      for (const text of c.says ?? []) expect(error.message, text).toContain(text);
      expect(error.message).toContain("(MD-1)");
    });
  }

  it("names the module by its id when it has one, and by its place when it has none", () => {
    const named = refusal(() => validateDeclarations(userModules([loose("stats", (d) => void (d.side = "x"))])));
    expect(named.details).toEqual({
      module: "stats",
      origin: "user",
      index: 0,
      field: "side",
      expected: '"public" or "private"',
    });
    expect(named.message).toBe(
      'the user module stats: side is "x", where a module declaration has "public" or "private" (MD-1)',
    );
    const placed = refusal(() => validateDeclarations({ backbone: [], core: [declaration("core-a"), 7], user: [] }));
    expect(placed.details).toMatchObject({ module: null, origin: "core", index: 1, field: "" });
    expect(placed.message).toContain("the core module at position 2");
  });

  it("accepts every optional property absent, or set to undefined, and every one present", () => {
    const optional = {
      keyKinds: ["viewing"],
      validateKey: () => true,
      needsLockstep: true,
      developmentOnly: false,
      requiresResync: true,
    };
    const withUndefined = Object.fromEntries(Object.keys(optional).map((key) => [key, undefined]));
    const d = declaration("stats", { side: "private", ...optional });
    const undefinedOnes = { ...declaration("other"), ...withUndefined };
    const item = { name: "plain", lifetimes: ["process" as const], table: undefined };
    const items = declaration("third", { provides: [item] });
    expect(validateDeclarations(userModules([d, undefinedOnes, items])).user).toEqual([d, undefinedOnes, items]);
  });

  it("accepts a table listed twice by one item: its one flag decides for both", () => {
    const twice = declaration("stats", {
      provides: [
        { name: "stats-rows", lifetimes: ["table"], table: { schema: "stats", tables: ["rows", "rows"], kind: "mutable" } },
      ],
    });
    expect(validateDeclarations(userModules([twice])).user).toEqual([twice]);
  });

  it("accepts a declaration made by a class, reading its properties as given", () => {
    class Stats {
      readonly id = "stats";
      readonly version = "2.1.0-rc.1+build.5";
      readonly side = "public";
      readonly requires = ["block-header"];
      readonly provides = [];
      readonly startsMidChain = false;
      readonly configSchema = z.strictObject({});
      readonly migrations = [];
      readonly points = { "on-db-write": async () => {} };
    }
    const instance = new Stats();
    expect(validateDeclarations(userModules([instance])).user[0]).toBe(instance);
  });
});
