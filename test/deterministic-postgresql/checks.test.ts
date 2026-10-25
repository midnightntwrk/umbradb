import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaModule, type SchemaPlan } from "../../src/db/roles.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import {
  CHECK_FUNCTIONS_SQL,
  checkFunctionsSql,
  INTEGER_CHECK_PREFIX,
  INTEGER_RULES,
  integerCheckName,
  type IntegerRules,
  numericOkPredicate,
  refusedNumbersPath,
} from "../../src/deterministic-postgresql/index.js";
import { BACKENDS } from "../db/backends.js";

/**
 * A58's write half (DT-6, owner decision Q57; task 7.1), on both backends: the database API adds to every `jsonb` and
 * `numeric` column of a module table not declared `deterministic: false`, and to every array of either, a `CHECK`
 * backed by `core_chain.jsonb_numbers_ok` or `core_chain.numeric_ok` (`src/deterministic-postgresql/checks.ts`,
 * `design.md` §4): a JSON number must be an integer within the signed 64-bit range written without a fraction (`1.0`
 * refused: its `jsonpath` `.string()` is `"1.0"`), and a `numeric` must have no fraction and be neither `NaN` nor an
 * infinity, while NULL stays allowed. A module writing a refused value in `on-db-write` fails the block, which rolls
 * back. The block is played by module `m`'s `on-db-write` through the real block write handle (`src/db/write-handles.ts`);
 * the halt is the runner's (task 5.x).
 *
 * Every case and its verdict is written by hand from DT-6, A58 and Q57; the committed negative controls build the two
 * functions without one rule each and show that exactly that rule's cases change verdict.
 */

const MODULE: SchemaModule = {
  id: "m",
  requires: [],
  provides: [
    { name: "m-values", table: { schema: "m", tables: ["v", "p"] } },
    { name: "m-free", table: { schema: "m", tables: ["free"], deterministic: false } },
  ],
  migrations: [],
};

const TABLES = `
  CREATE TABLE m.v (
    k bigint PRIMARY KEY, j jsonb, aj jsonb[], n numeric, an numeric[], n0 numeric(38,0), t text
  );
  CREATE TABLE m.p (height bigint PRIMARY KEY, n numeric) PARTITION BY RANGE (height);
  CREATE TABLE m.p_low PARTITION OF m.p FOR VALUES FROM (0) TO (1000);
  CREATE TABLE m.free (k bigint PRIMARY KEY, j jsonb, n numeric);`;

/** A value written to one column, and whether DT-6 lets it be stored. */
interface Case {
  readonly column: "j" | "aj" | "n" | "an" | "n0";
  /** The value as SQL text, cast to the column's type. */
  readonly value: string | null;
  readonly stored: boolean;
  /** For a refused value: the rule of `INTEGER_RULES` that refuses it. */
  readonly rule?: string;
  /** For a stored value: what the column reads back, when PostgreSQL normalizes it. */
  readonly readsBack?: unknown;
}

const CASES: readonly Case[] = [
  // jsonb (Q57): integers within 64 bits, written without a fraction.
  { column: "j", value: '{"x": 1.5}', stored: false, rule: "integer-text" },
  { column: "j", value: '{"x": 1.0}', stored: false, rule: "integer-text" },
  { column: "j", value: '{"x": 100.00}', stored: false, rule: "integer-text" },
  { column: "j", value: '{"x": 1e-2}', stored: false, rule: "integer-text" },
  { column: "j", value: '[1, {"a": [2, 2.5]}]', stored: false, rule: "integer-text" },
  { column: "j", value: '{"x": 9223372036854775808}', stored: false, rule: "at-most-int64-max" },
  { column: "j", value: '{"x": 1e400}', stored: false, rule: "at-most-int64-max" },
  { column: "j", value: '{"x": -9223372036854775809}', stored: false, rule: "at-least-int64-min" },
  { column: "j", value: '{"x": 2}', stored: true },
  { column: "j", value: '{"x": 1e2}', stored: true, readsBack: { x: 100 } },
  { column: "j", value: '{"x": 9223372036854775807}', stored: true, readsBack: { x: 9223372036854775807n } },
  { column: "j", value: '{"x": -9223372036854775808}', stored: true, readsBack: { x: -9223372036854775808n } },
  { column: "j", value: '{"x": -0, "y": "1.5", "z": [true, null]}', stored: true, readsBack: { x: 0, y: "1.5", z: [true, null] } },
  { column: "j", value: null, stored: true },
  // jsonb[]: the same rule for every element.
  { column: "aj", value: '{"{\\"x\\": 1.5}"}', stored: false, rule: "integer-text" },
  { column: "aj", value: '{"{\\"x\\": 1}","{\\"x\\": 9223372036854775808}"}', stored: false, rule: "at-most-int64-max" },
  { column: "aj", value: '{"{\\"x\\": 1}","{\\"y\\": [2]}"}', stored: true },
  { column: "aj", value: '{NULL,"{\\"x\\": 1}"}', stored: true },
  // numeric: no fraction, no NaN, no infinity; NULL allowed.
  { column: "n", value: "100.00", stored: false, rule: "no-fraction" },
  { column: "n", value: "1.5", stored: false, rule: "no-fraction" },
  { column: "n", value: "NaN", stored: false, rule: "not-a-number" },
  { column: "n", value: "Infinity", stored: false, rule: "not-a-number" },
  { column: "n", value: "-Infinity", stored: false, rule: "not-a-number" },
  { column: "n", value: "100", stored: true, readsBack: "100" },
  { column: "n", value: "1e2", stored: true, readsBack: "100" },
  { column: "n", value: "-123456789012345678901234567890", stored: true, readsBack: "-123456789012345678901234567890" },
  { column: "n", value: null, stored: true, rule: "null-allowed" },
  // numeric[]: every element, in any dimension; a NULL element allowed.
  { column: "an", value: "{1.5}", stored: false, rule: "no-fraction" },
  { column: "an", value: "{{1},{2.5}}", stored: false, rule: "no-fraction" },
  { column: "an", value: "{1,NaN}", stored: false, rule: "not-a-number" },
  { column: "an", value: "{1,2}", stored: true },
  { column: "an", value: "{{1,2},{3,4}}", stored: true },
  { column: "an", value: "{1,NULL}", stored: true, rule: "null-allowed" },
  // numeric(38,0): PostgreSQL rounds on write, so what is stored is an integer (DT-6 allows the declared scale 0).
  { column: "n0", value: "1.5", stored: true, readsBack: "2" },
];

const TYPE_OF: Readonly<Record<Case["column"], string>> = {
  j: "jsonb",
  aj: "jsonb[]",
  n: "numeric",
  an: "numeric[]",
  n0: "numeric",
};

function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "stored",
    (error: unknown) => error,
  );
}

describe("the CHECKs' predicates, as text", () => {
  it("finds, at any depth, a JSON number some rule refuses; none with no rule; numeric_ok as design.md §4 writes it", () => {
    expect(refusedNumbersPath()).toBe(
      'strict $.** ? (@.type() == "number" && ((!(@.string() like_regex "^-?[0-9]+$")) || ' +
        "(@ < -9223372036854775808) || (@ > 9223372036854775807)))",
    );
    expect(refusedNumbersPath([])).toBe('strict $.** ? (@.type() == "number" && (false))');
    expect(numericOkPredicate()).toBe("c IS NULL OR coalesce(pg_catalog.scale(c) = 0, false)");
  });
});

describe.each(BACKENDS)("A58: the jsonb and numeric CHECKs, on $name (DT-6, Q57)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  const part = (onStartDb?: MigrationPart["onStartDb"]): MigrationPart => ({
    id: "m",
    version: "1.0.0",
    migrations: [{ id: "001", sql: TABLES }],
    ...(onStartDb === undefined ? {} : { onStartDb }),
  });

  async function started(): Promise<{ readonly db: Database; readonly plan: SchemaPlan }> {
    const { db } = await backend.database("SELECT 1");
    const plan = planSchemas([MODULE]);
    await startDatabase(db, { plan, parts: [part()], committedVersions: new Map(), handles: { height: null } });
    return { db, plan };
  }

  /** Writes one value in module `m`'s `on-db-write`, in a block of its own: "stored", or the error the block failed with. */
  function write(db: Database, plan: SchemaPlan, k: bigint, c: Case): Promise<unknown> {
    return outcome(
      db.transaction((tx) =>
        openBlockWrites(tx, plan, { height: null }).write("m", (w) =>
          w.execute(`INSERT INTO m.v (k, ${c.column}) VALUES ($1, $2::${TYPE_OF[c.column]})`, [k, c.value]),
        ),
      ),
    );
  }

  it("re-checks Q57's fact: jsonpath .string() keeps a JSON number's scale, and PostgreSQL stores 1e2 as 100", async () => {
    const { db } = await started();
    const [row] = await db.read((read) =>
      read.query(`SELECT jsonb_path_query('{"x": 1.0}', '$.x.string()') AS a, jsonb_path_query('{"x": 100.00}', '$.x.string()') AS b,
                         jsonb_path_query('{"x": 1e2}', '$.x.string()') AS c, '{"x": 1e2}'::jsonb::text AS d`),
    );
    expect(row).toEqual({ a: "1.0", b: "100.00", c: "100", d: '{"x": 100}' });
  });

  it("creates the two functions and their array forms in core_chain, immutable, executable by every role", async () => {
    const { db } = await started();
    const functions = await db.read((read) =>
      read.query(`SELECT p.oid::regprocedure::text AS signature, p.provolatile AS volatility,
                         has_function_privilege('public', p.oid, 'EXECUTE') AS public_executes
                    FROM pg_proc p WHERE p.pronamespace = 'core_chain'::regnamespace
                     AND p.proname IN ('jsonb_numbers_ok', 'numeric_ok') ORDER BY 1`),
    );
    expect(functions).toEqual([
      { signature: "core_chain.jsonb_numbers_ok(jsonb)", volatility: "i", public_executes: true },
      { signature: "core_chain.jsonb_numbers_ok(jsonb[])", volatility: "i", public_executes: true },
      { signature: "core_chain.numeric_ok(numeric)", volatility: "i", public_executes: true },
      { signature: "core_chain.numeric_ok(numeric[])", volatility: "i", public_executes: true },
    ]);
    expect(CHECK_FUNCTIONS_SQL).toEqual(checkFunctionsSql());
  });

  it("adds one CHECK to every jsonb, numeric and array-of-either column, named for it, and none elsewhere", async () => {
    const { db } = await started();
    const checks = await db.read((read) =>
      read.query(`SELECT c.conrelid::regclass::text AS "table", c.conname AS name, pg_get_constraintdef(c.oid) AS definition
                    FROM pg_constraint c JOIN pg_class r ON r.oid = c.conrelid
                   WHERE c.contype = 'c' AND r.relnamespace = 'm'::regnamespace ORDER BY 1, 2`),
    );
    const byTableAndName = (a: Record<string, unknown>, b: Record<string, unknown>): number =>
      `${a.table as string} ${a.name as string}` < `${b.table as string} ${b.name as string}` ? -1 : 1;
    expect([...checks].sort(byTableAndName)).toEqual(
      [
        { table: "m.p", name: integerCheckName("n"), definition: "CHECK (core_chain.numeric_ok(n))" },
        // A partition inherits its partitioned table's CHECK (a row written to the partition directly is checked too).
        { table: "m.p_low", name: integerCheckName("n"), definition: "CHECK (core_chain.numeric_ok(n))" },
        { table: "m.v", name: integerCheckName("aj"), definition: "CHECK (core_chain.jsonb_numbers_ok(aj))" },
        { table: "m.v", name: integerCheckName("an"), definition: "CHECK (core_chain.numeric_ok(an))" },
        { table: "m.v", name: integerCheckName("j"), definition: "CHECK (core_chain.jsonb_numbers_ok(j))" },
        { table: "m.v", name: integerCheckName("n"), definition: "CHECK (core_chain.numeric_ok(n))" },
        { table: "m.v", name: integerCheckName("n0"), definition: "CHECK (core_chain.numeric_ok(n0))" },
      ].sort(byTableAndName),
    );
    expect(integerCheckName("n")).toBe(`${INTEGER_CHECK_PREFIX}n`);
    // A column whose name would make the constraint's name too long for PostgreSQL gets a hashed name, still unique.
    const long = "a".repeat(60);
    expect(integerCheckName(long)).toMatch(new RegExp(`^${INTEGER_CHECK_PREFIX}[0-9a-f]{32}$`));
    expect(integerCheckName(long)).not.toBe(integerCheckName(`${long}b`));
    expect(Buffer.byteLength(integerCheckName(long))).toBeLessThanOrEqual(63);
  });

  it("drops its CHECKs from a table a later build declares deterministic: false (Q76), and keeps the others'", async () => {
    const { db } = await started();
    const later = planSchemas([
      {
        ...MODULE,
        provides: [
          { name: "m-values", table: { schema: "m", tables: ["p"] } },
          { name: "m-free", table: { schema: "m", tables: ["free", "v"], deterministic: false } },
        ],
      },
    ]);
    await startDatabase(db, { plan: later, parts: [part()], committedVersions: new Map(), handles: { height: null } });
    const tables = await db.read((read) =>
      read.query(
        "SELECT DISTINCT conrelid::regclass::text AS t FROM pg_constraint WHERE contype = 'c' AND conname LIKE 'umbradb\\_integers\\_%'",
      ),
    );
    expect(tables.map((row) => row.t).sort()).toEqual(["m.p", "m.p_low"]);
    expect(await write(db, later, 1n, { column: "n", value: "1.5", stored: false })).toBe("stored");
  });

  it("is idempotent: a second startup adds nothing and keeps every CHECK", async () => {
    const { db, plan } = await started();
    const count = () =>
      db.read((read) => read.query("SELECT count(*)::int AS n FROM pg_constraint WHERE contype = 'c' AND conname LIKE 'umbradb\\_integers\\_%'"));
    const before = await count();
    await startDatabase(db, { plan, parts: [part()], committedVersions: new Map(), handles: { height: null } });
    expect(await count()).toEqual(before);
  });

  for (const [index, c] of CASES.entries()) {
    const label = `${c.value === null ? "NULL" : c.value} in a ${TYPE_OF[c.column]} column (${c.column})`;
    it(`A58: ${c.stored ? "stores" : "fails the block for"} ${label}`, async () => {
      const { db, plan } = await started();
      const k = BigInt(index + 1);
      const result = await write(db, plan, k, c);
      if (c.stored) {
        expect(result).toBe("stored");
        if (c.readsBack !== undefined) {
          const [row] = await db.read((read) => read.query(`SELECT ${c.column} AS v FROM m.v WHERE k = $1`, [k]));
          expect(row?.v).toEqual(c.readsBack);
        }
        return;
      }
      expect(result).toBeInstanceOf(UmbraError);
      const error = result as UmbraError;
      expect(error.code).toBe("database-error");
      expect(error.details).toMatchObject({ sqlstate: "23514", constraint: integerCheckName(c.column) });
      // The block rolled back: nothing of it is stored.
      expect(await db.read((read) => read.query("SELECT k FROM m.v WHERE k = $1", [k]))).toEqual([]);
    });
  }

  it("A58: checks a row written to a partition directly, and a table a later startup's migration added, before its on-start-db", async () => {
    const { db, plan } = await started();
    const direct = await outcome(
      db.transaction((tx) =>
        openBlockWrites(tx, plan, { height: null }).write("m", (w) =>
          w.execute("INSERT INTO m.p_low (height, n) VALUES (1, 1.5)"),
        ),
      ),
    );
    expect((direct as UmbraError).details).toMatchObject({ sqlstate: "23514", constraint: integerCheckName("n") });

    const later: MigrationPart = {
      ...part(async (w: SchemaWriteHandle) => {
        await w.execute("INSERT INTO m.later (k, n) VALUES (1, 2.5)");
      }),
      migrations: [{ id: "001", sql: TABLES }, { id: "002", sql: "CREATE TABLE m.later (k bigint PRIMARY KEY, n numeric)" }],
    };
    const laterPlan = planSchemas([{ ...MODULE, provides: [...MODULE.provides, { name: "m-later", table: { schema: "m", tables: ["later"] } }] }]);
    const refused = await outcome(
      startDatabase(db, { plan: laterPlan, parts: [later], committedVersions: new Map(), handles: { height: null } }),
    );
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).details).toMatchObject({ sqlstate: "23514", constraint: integerCheckName("n") });
    // Refused as the setup's own write, which the CHECK met: it was there before on-start-db ran.
    expect((refused as UmbraError).message).toContain("new row for relation");
  });

  it("negative control: without the CHECKs, every refused value of the table would be stored", async () => {
    const { db, plan } = await started();
    await db.transaction(async (tx) => {
      const names = await tx.query(
        "SELECT conname FROM pg_constraint WHERE conrelid = 'm.v'::regclass AND contype = 'c' ORDER BY conname",
      );
      for (const row of names) await tx.execute(`ALTER TABLE m.v DROP CONSTRAINT "${row.conname as string}"`);
    });
    for (const [index, c] of CASES.entries()) {
      if (c.stored) continue;
      expect(await write(db, plan, BigInt(1000 + index), c), `${c.column} ${c.value}`).toBe("stored");
    }
  });

  describe("negative controls: each function built without one of its rules lets exactly that rule's cases through", () => {
    /**
     * The cases the functions decide alone: every one but the `numeric(38,0)` column's, whose value PostgreSQL rounds
     * before the CHECK sees it.
     */
    const DECIDED = CASES.filter((c) => c.column !== "n0");

    /** The verdict of the functions built from `rules` in the schema `nc` on every decided case, in order. */
    async function verdicts(db: Database, rules: IntegerRules): Promise<boolean[]> {
      await db.transaction(async (tx) => {
        await tx.execute("DROP SCHEMA IF EXISTS nc CASCADE");
        await tx.execute("CREATE SCHEMA nc");
        for (const statement of checkFunctionsSql({ schema: "nc", rules })) await tx.execute(statement);
      });
      const out: boolean[] = [];
      for (const c of DECIDED) {
        const type = TYPE_OF[c.column];
        const fn = type.startsWith("jsonb") ? "jsonb_numbers_ok" : "numeric_ok";
        const [row] = await db.read((read) => read.query(`SELECT nc.${fn}($1::${type}) AS ok`, [c.value]));
        // A CHECK passes on true and on NULL.
        out.push(row?.ok !== false);
      }
      return out;
    }

    it("with every rule, the functions give each case its verdict", async () => {
      const { db } = await started();
      expect(await verdicts(db, INTEGER_RULES)).toEqual(DECIDED.map((c) => c.stored));
    });

    for (const [kind, rules] of Object.entries(INTEGER_RULES) as [keyof IntegerRules, readonly { id: string }[]][]) {
      for (const rule of rules) {
        it(`without ${kind}'s rule ${rule.id}`, async () => {
          const { db } = await started();
          const all = await verdicts(db, INTEGER_RULES);
          const without = await verdicts(db, {
            ...INTEGER_RULES,
            [kind]: rules.filter((other) => other.id !== rule.id),
          } as IntegerRules);
          const changed = DECIDED.filter((_, i) => all[i] !== without[i]);
          // Not vacuous: the rule decides at least one case — and exactly its own cases.
          expect(changed.length).toBeGreaterThan(0);
          expect(changed).toEqual(DECIDED.filter((c) => c.rule === rule.id));
        });
      }
    }
  });
});
