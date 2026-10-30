import { describe, expect, it } from "vitest";
import { z } from "zod";

// Characterization tests of `zod` 4 (installed 4.6.7, kept on major version 4) for module settings schemas. A field's
// kind (`data`, `operational` or `secret`) is carried in its metadata and read back with
// `schema.shape[field].meta().kind`; defaults fill absent fields; issues name the offending field's path;
// `z.toJSONSchema` keeps `kind`. [Q45, CF-4; design §7, §14]
//
// They also check the fix of GHSA-mrhx-c7xc-m3w5 (zod below 4.6.6): a collection longer than its `max` is refused with
// one issue, its elements not parsed. They test zod itself, not UmbraDB code. [docs/issues/00032]

const settings = z.object({
  network: z.enum(["mainnet", "preview"]).meta({ kind: "data" }),
  retainStates: z.number().int().min(0).default(0).meta({ kind: "data" }),
  livenessTimeoutMs: z.number().int().positive().default(30_000).meta({ kind: "operational" }),
  database: z.string().meta({ kind: "secret" }),
  ledgerTable: z
    .object({ rows: z.array(z.object({ from: z.number().int().min(0) })) })
    .default({ rows: [] })
    .meta({ kind: "data" }),
});

describe("zod 4 — per-field kind metadata", () => {
  it("reads each field's kind back with schema.shape[field].meta().kind", () => {
    const kinds = Object.fromEntries(
      Object.entries(settings.shape).map(([field, schema]) => [field, schema.meta()?.kind]),
    );
    expect(kinds).toEqual({
      network: "data",
      retainStates: "data",
      livenessTimeoutMs: "operational",
      database: "secret",
      ledgerTable: "data",
    });
  });

  it("keeps the kind on the field when .meta() is applied after .default()", () => {
    expect(settings.shape.retainStates).toBeInstanceOf(z.ZodDefault);
    expect(settings.shape.retainStates.meta()).toEqual({ kind: "data" });
  });

  it("does not show the kind on the field when .meta() is applied before .default()", () => {
    // Characterization: .default() wraps the schema in a new ZodDefault, and metadata stays on the inner schema,
    // so shape[field].meta() of a field written this way is undefined.
    const field = z.number().int().meta({ kind: "data" }).default(5);
    expect(field.meta()).toBeUndefined();
    expect(field.unwrap().meta()).toEqual({ kind: "data" });
  });

  it("keeps kind in z.toJSONSchema for every field", () => {
    const json = z.toJSONSchema(settings) as { properties: Record<string, { kind?: unknown }> };
    expect(Object.fromEntries(Object.entries(json.properties).map(([field, p]) => [field, p.kind]))).toEqual({
      network: "data",
      retainStates: "data",
      livenessTimeoutMs: "operational",
      database: "secret",
      ledgerTable: "data",
    });
  });
});

describe("zod 4 — defaults", () => {
  it("applies the declared defaults to absent fields and keeps given values", () => {
    expect(settings.parse({ network: "preview", database: "postgres://db" })).toEqual({
      network: "preview",
      retainStates: 0,
      livenessTimeoutMs: 30_000,
      database: "postgres://db",
      ledgerTable: { rows: [] },
    });
    expect(
      settings.parse({ network: "mainnet", database: "pglite:memory", retainStates: 3, livenessTimeoutMs: 5 }),
    ).toMatchObject({ retainStates: 3, livenessTimeoutMs: 5 });
  });
});

describe("zod 4 — issue paths", () => {
  it("reports every invalid field with its path, including nested array positions", () => {
    const result = settings.safeParse({
      network: "stagenet",
      livenessTimeoutMs: "30000",
      database: "postgres://db",
      ledgerTable: { rows: [{ from: 0 }, { from: 1.5 }] },
    });
    expect(result.success).toBe(false);
    const issues = result.error!.issues.map((issue) => ({ path: issue.path, code: issue.code }));
    expect(issues).toEqual([
      { path: ["network"], code: "invalid_value" },
      { path: ["livenessTimeoutMs"], code: "invalid_type" },
      { path: ["ledgerTable", "rows", 1, "from"], code: "invalid_type" },
    ]);
  });

  it("reports a missing required field by its path", () => {
    const result = settings.safeParse({ network: "preview" });
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((issue) => ({ path: issue.path, code: issue.code }))).toEqual([
      { path: ["database"], code: "invalid_type" },
    ]);
  });
});

describe("zod 4 — oversized constrained collections (GHSA-mrhx-c7xc-m3w5, fixed in 4.6.6; task 0.6)", () => {
  // zod 4.4.3 parsed every element of an array or set longer than its `max` and kept one issue per failing element
  // (100,001 issues for the array below): memory grows with the input. From 4.6.6 a collection over its `max` is
  // refused with its `too_big` issue alone, before any element is parsed.
  it("refuses an array longer than its max with one too_big issue, its elements not parsed", () => {
    const result = z.array(z.string()).max(3).safeParse(Array.from({ length: 100_000 }, () => 0));
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((issue) => ({ path: issue.path, code: issue.code }))).toEqual([
      { path: [], code: "too_big" },
    ]);
  });

  it("refuses a set larger than its max with one too_big issue, its elements not parsed", () => {
    const result = z.set(z.string()).max(2).safeParse(new Set([1, 2, 3, 4, 5]));
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((issue) => issue.code)).toEqual(["too_big"]);
  });

  it("still reports every failing element of an array within its max", () => {
    const result = z.array(z.string()).max(3).safeParse([0, "a", 1]);
    expect(result.success).toBe(false);
    expect(result.error!.issues.map((issue) => ({ path: issue.path, code: issue.code }))).toEqual([
      { path: [0], code: "invalid_type" },
      { path: [2], code: "invalid_type" },
    ]);
  });
});
