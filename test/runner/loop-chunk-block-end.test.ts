import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { HeightFailure } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { type CaseOutcome, runCase, tablesCompared, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * What a transaction's end gives a block, kept for a block inside a chunk (`src/runner/loop.ts`, fast-sync mode;
 * `src/db/block-end.ts`), on PostgreSQL 18 and PGlite 0.5.10: heights 1 to 10 in chunks of 5 (1..5, 6..10) against the
 * mode off, module `c` writing through a deferred foreign key, a deferred constraint trigger, a constraint that is
 * deferrable and initially immediate, a temporary table and a cursor.
 * - A deferred constraint a block violates fails that block, also when a later block of the chunk would repair it: the
 *   same halt, error and cursor as with the mode off, whose `COMMIT` fails.
 * - A block that violates and repairs a deferred constraint itself is stored, at every place in a chunk.
 * - A deferred constraint trigger fires at its block's end: the next block reads what it wrote.
 * - With a constraint that is deferrable and initially immediate, a temporary table in the writer's session, or a
 *   cursor a block left open, every block is committed alone, and each halts or is stored as with the mode off.
 */

const HEAD = 10n;

/** What `c` does at a height's `on-db-write`. */
type Write = (w: BlockWriteHandle, height: bigint) => Promise<void>;

/** Module `c`: its tables from `sql`, and `write` at each `on-db-write` after its own row. */
function constrained(sql: string, tables: readonly string[], write: Write): ModuleDeclaration {
  return declaration("c", {
    provides: [{ name: "c-rows", lifetimes: ["block", "table"], table: { schema: "c", tables: ["rows", ...tables], kind: "mutable" } }],
    migrations: [{ id: "001", sql: `CREATE TABLE c.rows (height bigint PRIMARY KEY); ${sql}` }],
    points: {
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        await w.execute("INSERT INTO c.rows (height) VALUES ($1)", [b.height]);
        await write(w, b.height);
      },
    },
  });
}

/** A parent table and a child table whose foreign key is checked at the transaction's end. */
const DEFERRED_KEY =
  "CREATE TABLE c.parents (height bigint PRIMARY KEY, id bigint NOT NULL UNIQUE); " +
  "CREATE TABLE c.children (height bigint PRIMARY KEY, parent bigint NOT NULL, " +
  "CONSTRAINT child_parent FOREIGN KEY (parent) REFERENCES c.parents (id) DEFERRABLE INITIALLY DEFERRED)";
const KEY_TABLES = ["c.parents", "c.children"];

const child = (w: BlockWriteHandle, height: bigint, parent: bigint) =>
  w.execute("INSERT INTO c.children (height, parent) VALUES ($1, $2)", [height, parent]);
const parent = (w: BlockWriteHandle, height: bigint, id: bigint) => w.execute("INSERT INTO c.parents (height, id) VALUES ($1, $2)", [height, id]);

/** The database's error behind `failure`: its code and SQLSTATE. */
function databaseError(failure: HeightFailure | undefined): { code: string; sqlstate: unknown } | undefined {
  let cause: unknown = failure?.cause;
  while (cause instanceof Error && !(cause instanceof UmbraError)) cause = cause.cause;
  return cause instanceof UmbraError ? { code: cause.code, sqlstate: cause.details.sqlstate } : undefined;
}

/** Both runs of a case: the mode off, and chunks of 5. */
async function both(backend: (typeof RUNNER_BACKENDS)[number], module: () => ModuleDeclaration, tables: readonly string[]): Promise<{ off: CaseOutcome; on: CaseOutcome }> {
  const off = await runCase(backend, { head: HEAD, modules: [module()], tables: ["c.rows", ...tables] });
  const on = await runCase(backend, { head: HEAD, modules: [module()], tables: ["c.rows", ...tables], blocks: 5 });
  return { off, on };
}

describe.each(RUNNER_BACKENDS)("a block's end inside a chunk, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  for (const [name, at] of [
    ["the chunk's first block", 6n],
    ["a block in the middle of the chunk", 8n],
    ["the block before the chunk's last", 9n],
  ] as const) {
    it(`a deferred foreign key violated at ${name} and repaired by the next block: the halt, the error and the cursor of the mode off`, async () => {
      const module = () =>
        constrained(DEFERRED_KEY, ["parents", "children"], async (w, height) => {
          if (height === at) await child(w, height, 100n);
          if (height === at + 1n) await parent(w, height, 100n);
        });
      const { off, on } = await both(backend, module, KEY_TABLES);
      // With the mode off the block's COMMIT fails: no point, no module, the foreign key's SQLSTATE.
      expect(off.failures.map(where)).toEqual([{ height: at, point: undefined, module: undefined, committed: false }]);
      expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "23503" });
      expect(off.cursor).toBe(at - 1n);
      expect(on.failures.map(where)).toEqual(off.failures.map(where));
      expect(databaseError(on.failures[0])).toEqual(databaseError(off.failures[0]));
      expect(on.cursor).toBe(off.cursor);
      const tables = tablesCompared(on, off);
      expect(tables.differing).toEqual([]);
      expect(tables.compared).toBeGreaterThan(0);
    }, 120_000);
  }

  it("a deferred foreign key violated at the chunk's last block: the chunk's COMMIT fails, its blocks are stored again, and the last halts", async () => {
    const module = () =>
      constrained(DEFERRED_KEY, ["parents", "children"], async (w, height) => {
        if (height === HEAD) await child(w, height, 100n);
      });
    const { off, on } = await both(backend, module, KEY_TABLES);
    expect(off.failures.map(where)).toEqual([{ height: HEAD, point: undefined, module: undefined, committed: false }]);
    expect(on.failures.map(where)).toEqual(off.failures.map(where));
    expect(databaseError(on.failures[0])).toEqual({ code: "database-error", sqlstate: "23503" });
    expect(on.cursor).toBe(HEAD - 1n);
    expect(off.cursor).toBe(HEAD - 1n);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("a block that inserts the child before its parent is stored at every place in a chunk: the key is deferred again in each block", async () => {
    const module = () =>
      constrained(DEFERRED_KEY, ["parents", "children"], async (w, height) => {
        await child(w, height, height);
        await parent(w, height, height);
      });
    const { off, on } = await both(backend, module, KEY_TABLES);
    expect(off.failures).toEqual([]);
    expect(on.failures).toEqual([]);
    expect(on.cursor).toBe(HEAD);
    // One transaction for each chunk.
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(2);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("a deferred constraint trigger fires at its block's end: the next block reads the row it wrote", async () => {
    const sql =
      "CREATE TABLE c.fired (height bigint PRIMARY KEY, seen bigint); " +
      "CREATE FUNCTION c.note() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN " +
      "INSERT INTO c.fired (height, seen) VALUES (NEW.height, (SELECT max(height) FROM c.fired)); RETURN NULL; END $$; " +
      "CREATE CONSTRAINT TRIGGER noted AFTER INSERT ON c.rows DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION c.note()";
    const seen: string[] = [];
    const module = () =>
      constrained(sql, ["fired"], async (w, height) => {
        // Deferred: the trigger of this block's row has not fired yet, and the block before's has.
        const [row] = await w.query("SELECT max(height) AS h FROM c.fired");
        seen.push(`${height}:${row?.h ?? "none"}`);
      });
    const { off, on } = await both(backend, module, ["c.fired"]);
    expect(off.failures).toEqual([]);
    expect(on.failures).toEqual([]);
    const expected = Array.from({ length: Number(HEAD) }, (_, i) => `${i + 1}:${i === 0 ? "none" : i}`);
    expect(seen).toEqual([...expected, ...expected]);
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(2);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("a constraint that is deferrable and initially immediate: a block that breaks it for one statement halts as with the mode off, every block committed alone", async () => {
    const sql = "CREATE TABLE c.once (height bigint PRIMARY KEY, k bigint NOT NULL, CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY IMMEDIATE)";
    const module = () =>
      constrained(sql, ["once"], async (w, height) => {
        await w.execute("INSERT INTO c.once (height, k) VALUES ($1, $2)", [height, height]);
        // At 8: k taken by 7's row for one statement, then 7's row moved away. Checked at the statement, it fails.
        if (height === 8n) {
          await w.execute("UPDATE c.once SET k = 7 WHERE height = 8");
          await w.execute("UPDATE c.once SET k = 70 WHERE height = 7");
        }
      });
    const { off, on } = await both(backend, module, ["c.once"]);
    expect(off.failures.map(where)).toEqual([{ height: 8n, point: "on-db-write", module: "c", committed: false }]);
    expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "23505" });
    expect(on.failures.map(where)).toEqual(off.failures.map(where));
    expect(databaseError(on.failures[0])).toEqual(databaseError(off.failures[0]));
    expect(on.cursor).toBe(7n);
    expect(off.cursor).toBe(7n);
    // No transaction held two blocks: the first block of each chunk asked for found the constraint, and ended it.
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(7);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("a temporary table emptied at each COMMIT: every block is committed alone and reads it empty, as with the mode off", async () => {
    const seen: string[] = [];
    const module = () =>
      constrained("CREATE TABLE c.counted (height bigint PRIMARY KEY, kept bigint NOT NULL)", ["counted"], async (w, height) => {
        if (height === 1n) await w.execute("CREATE TEMPORARY TABLE scratch (height bigint) ON COMMIT DELETE ROWS");
        const [row] = await w.query("SELECT count(*)::bigint AS n FROM scratch");
        seen.push(`${height}:${row?.n}`);
        await w.execute("INSERT INTO scratch (height) VALUES ($1)", [height]);
        await w.execute("INSERT INTO c.counted (height, kept) VALUES ($1, $2)", [height, row?.n]);
      });
    const { off, on } = await both(backend, module, ["c.counted"]);
    expect(off.failures).toEqual([]);
    expect(on.failures).toEqual([]);
    const expected = Array.from({ length: Number(HEAD) }, (_, i) => `${i + 1}:0`);
    expect(seen).toEqual([...expected, ...expected]);
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(Number(HEAD));
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("a cursor a block leaves open: every block is committed alone, so the next block declares it again", async () => {
    const module = () =>
      constrained("CREATE TABLE c.fetched (height bigint PRIMARY KEY, first bigint)", ["fetched"], async (w, height) => {
        await w.execute("DECLARE walk CURSOR FOR SELECT height FROM c.rows ORDER BY height DESC");
        const [row] = await w.query("FETCH 1 FROM walk");
        await w.execute("INSERT INTO c.fetched (height, first) VALUES ($1, $2)", [height, row?.height]);
      });
    const { off, on } = await both(backend, module, ["c.fetched"]);
    expect(off.failures).toEqual([]);
    expect(on.failures).toEqual([]);
    expect(on.cursor).toBe(HEAD);
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(Number(HEAD));
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);
});
