import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { STATE } from "../../src/db/block-end.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { HeightFailure } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { losingCommits } from "./block-continues-harness.js";
import { recordingStatements } from "./loop-chunk-harness.js";
import { type CaseOutcome, runCase, tablesCompared, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * A chunk holds only blocks whose transaction's end has nothing to do but make their writes durable
 * (`src/runner/loop.ts`, fast-sync mode; `src/db/block-end.ts`), on PostgreSQL 18 and PGlite 0.5.10: heights 1 to 10
 * in chunks of 5 (1..5, 6..10) against the mode off, module `c` writing through deferred constraints, deferred
 * triggers, temporary tables and cursors.
 * - A database that has a deferrable constraint or a constraint trigger when the run starts never forms a chunk: one
 *   transaction per block, with the statements of the mode off and one read more per block. So a block that leaves a
 *   deferred constraint violated fails at its own `COMMIT`, and a deferred trigger fires there, as with the mode off.
 * - What a block makes or leaves open ends the chunk at that block with its `COMMIT`: a temporary table, a cursor
 *   (with or without hold), a deferrable constraint. A failure of that `COMMIT` is that block's, and its callbacks are
 *   not called again.
 * - While the read finds something, every block is stored alone; chunks form again once it finds nothing.
 */

const HEAD = 10n;

/** What `c` does at a height's `on-db-write`. */
type Write = (w: BlockWriteHandle, height: bigint) => Promise<void>;

/** Module `c`: its tables from `sql`, and `write` at each `on-db-write` after its own row; its calls there in `calls`. */
function constrained(sql: string, tables: readonly string[], write: Write, calls: bigint[] = []): ModuleDeclaration {
  return declaration("c", {
    provides: [{ name: "c-rows", lifetimes: ["block", "table"], table: { schema: "c", tables: ["rows", ...tables], kind: "mutable" } }],
    migrations: [{ id: "001", sql: `CREATE TABLE c.rows (height bigint PRIMARY KEY); ${sql}` }],
    points: {
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        calls.push(b.height);
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

/** How many transactions `outcome`'s run asked for. */
const transactions = (outcome: CaseOutcome): number => outcome.order.filter((mark) => mark === "BEGIN").length;

/** Both runs of a case: the mode off, and chunks of 5. */
async function both(backend: (typeof RUNNER_BACKENDS)[number], module: () => ModuleDeclaration, tables: readonly string[]): Promise<{ off: CaseOutcome; on: CaseOutcome }> {
  const off = await runCase(backend, { head: HEAD, modules: [module()], tables: ["c.rows", ...tables] });
  const on = await runCase(backend, { head: HEAD, modules: [module()], tables: ["c.rows", ...tables], blocks: 5 });
  return { off, on };
}

/** Checks that `on` failed, or did not, as `off` did: the same halt, the same error of the database, the same cursor, the same tables. */
function sameAsOff(on: CaseOutcome, off: CaseOutcome): void {
  expect(on.failures.map(where)).toEqual(off.failures.map(where));
  expect(on.failures.map(databaseError)).toEqual(off.failures.map(databaseError));
  expect(on.cursor).toBe(off.cursor);
  const tables = tablesCompared(on, off);
  expect(tables.differing).toEqual([]);
  expect(tables.compared).toBeGreaterThan(0);
}

describe.each(RUNNER_BACKENDS)("what a transaction's end does for a block, with chunks, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a database with a deferrable constraint never forms a chunk: one transaction per block, the statements of the mode off and one read more per block", async () => {
    const statements = async (blocks: number | undefined): Promise<{ outcome: CaseOutcome; sent: string[] }> => {
      const sent: string[] = [];
      const outcome = await runCase(backend, {
        head: HEAD,
        modules: [constrained(DEFERRED_KEY, ["parents", "children"], async () => undefined)],
        database: (raw) => recordingStatements(raw, sent),
        ...(blocks === undefined ? {} : { blocks }),
      });
      return { outcome, sent };
    };
    const off = await statements(undefined);
    const on = await statements(5);
    expect(on.outcome.failures).toEqual([]);
    expect(on.outcome.cursor).toBe(HEAD);
    const read = `sql tx ${STATE.replace(/\s+/g, " ").trim()} [""]`;
    // The read: once before the first chunk would form, then at the end of each block where one would (1 to 9: at 10,
    // the head, none starts). Nothing else differs, in text, parameters or order.
    expect(on.sent.filter((line) => line === read)).toHaveLength(Number(HEAD));
    expect(off.sent.filter((line) => line === read)).toEqual([]);
    expect(on.sent.filter((line) => line !== read)).toEqual(off.sent);
    // The points and the transactions in the mode off's order, after the transaction of the first read: no block is taken ahead.
    expect(on.outcome.order).toEqual([off.outcome.order[0], "BEGIN", "COMMIT", ...off.outcome.order.slice(1)]);
    expect(transactions(on.outcome)).toBe(Number(HEAD) + 1);
    expect(transactions(off.outcome)).toBe(Number(HEAD));
  }, 120_000);

  it("the read before the first chunk fails with a lost connection: the run fails at that height, retryable, and the next run asks again and forms its chunks", async () => {
    const on = await runCase(backend, {
      head: HEAD,
      blocks: 5,
      // The loop's first transaction, the read's, fails before it begins.
      database: (raw) => {
        const losing = losingCommits(raw);
        losing.state.failNext = true;
        return losing.db;
      },
    });
    expect(on.failures.map(where)).toEqual([{ height: 1n, point: undefined, module: undefined, committed: false }]);
    expect(databaseError(on.failures[0])).toEqual({ code: "connection-lost", sqlstate: undefined });
    expect(on.cursor).toBe(HEAD);
    // The second run: the read, then 1..5 and 6..10.
    expect(transactions(on)).toBe(3);
    expect(on.facts).toEqual(Array.from({ length: Number(HEAD) }, (_, i) => `told committed ${i + 1}`));
  }, 120_000);

  for (const at of [6n, 8n, 9n, 10n]) {
    it(`a deferred foreign key violated at block ${at} (and repaired by the next block): the halt, the error and the cursor of the mode off, the block called once`, async () => {
      const calls: bigint[] = [];
      const module = () =>
        constrained(
          DEFERRED_KEY,
          ["parents", "children"],
          async (w, height) => {
            if (height === at) await child(w, height, 100n);
            if (height === at + 1n) await parent(w, height, 100n);
          },
          calls,
        );
      const { off, on } = await both(backend, module, KEY_TABLES);
      // With the mode off the block's COMMIT fails: no point, no module, the foreign key's SQLSTATE.
      expect(off.failures.map(where)).toEqual([{ height: at, point: undefined, module: undefined, committed: false }]);
      expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "23503" });
      expect(off.cursor).toBe(at - 1n);
      sameAsOff(on, off);
      // Once in each run.
      expect(calls.filter((height) => height === at)).toHaveLength(2);
      expect(on.facts).toEqual(off.facts);
    }, 120_000);
  }

  it("a block that inserts the child before its parent is stored, every block in a transaction of its own", async () => {
    const module = () =>
      constrained(DEFERRED_KEY, ["parents", "children"], async (w, height) => {
        await child(w, height, height);
        await parent(w, height, height);
      });
    const { off, on } = await both(backend, module, KEY_TABLES);
    expect(off.failures).toEqual([]);
    sameAsOff(on, off);
    expect(on.cursor).toBe(HEAD);
    expect(transactions(on)).toBe(Number(HEAD) + 1);
  }, 120_000);

  it("a deferred constraint trigger fires at its block's COMMIT: the next block reads the row it wrote", async () => {
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
    sameAsOff(on, off);
    const expected = Array.from({ length: Number(HEAD) }, (_, i) => `${i + 1}:${i === 0 ? "none" : i}`);
    expect(seen).toEqual([...expected, ...expected]);
    expect(transactions(on)).toBe(Number(HEAD) + 1);
  }, 120_000);

  it("a deferred trigger that inserts a child row and then its parent, through a foreign key deferred too: every block is stored, as with the mode off", async () => {
    const sql =
      `${DEFERRED_KEY}; ` +
      "CREATE FUNCTION c.pair() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN " +
      "INSERT INTO c.children (height, parent) VALUES (NEW.height, NEW.height); " +
      "INSERT INTO c.parents (height, id) VALUES (NEW.height, NEW.height); RETURN NULL; END $$; " +
      "CREATE CONSTRAINT TRIGGER paired AFTER INSERT ON c.rows DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION c.pair()";
    const module = () => constrained(sql, ["parents", "children"], async () => undefined);
    const { off, on } = await both(backend, module, KEY_TABLES);
    // The mode off: each COMMIT runs the trigger to its end, then checks the key, which holds.
    expect(off.failures).toEqual([]);
    expect(off.cursor).toBe(HEAD);
    sameAsOff(on, off);
    expect(transactions(on)).toBe(Number(HEAD) + 1);
  }, 120_000);

  it("a constraint that is deferrable and initially immediate: a block that breaks it for one statement halts as with the mode off", async () => {
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
    expect(off.cursor).toBe(7n);
    sameAsOff(on, off);
    // The read before the first chunk, then 1 to 8 each in a transaction of its own.
    expect(transactions(on)).toBe(9);
  }, 120_000);

  it("a deferrable constraint a block makes keeps its declared mode: made initially immediate at 8 and broken for one statement, it halts there as with the mode off", async () => {
    const sql = `${DEFERRED_KEY}; CREATE TABLE c.once (height bigint PRIMARY KEY, k bigint NOT NULL)`;
    const module = () =>
      constrained(sql, ["parents", "children", "once"], async (w, height) => {
        if (height === 8n) await w.execute("ALTER TABLE c.once ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY IMMEDIATE");
        await w.execute("INSERT INTO c.once (height, k) VALUES ($1, $2)", [height, height]);
        if (height === 8n) {
          await w.execute("UPDATE c.once SET k = 7 WHERE height = 8");
          await w.execute("UPDATE c.once SET k = 70 WHERE height = 7");
        }
      });
    const { off, on } = await both(backend, module, ["c.once"]);
    expect(off.failures.map(where)).toEqual([{ height: 8n, point: "on-db-write", module: "c", committed: false }]);
    expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "23505" });
    sameAsOff(on, off);
  }, 120_000);

  for (const at of [8n, 10n]) {
    it(`a deferred constraint block ${at} makes and leaves violated, in the chunk 6..10: the chunk commits at ${at}, the COMMIT's failure is ${at}'s, and ${at} is not called again`, async () => {
      const calls: bigint[] = [];
      const module = () =>
        constrained(
          "CREATE TABLE c.once (height bigint PRIMARY KEY, k bigint NOT NULL)",
          ["once"],
          async (w, height) => {
            await w.execute("INSERT INTO c.once (height, k) VALUES ($1, $2)", [height, height]);
            if (height !== at) return;
            await w.execute("ALTER TABLE c.once ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED");
            await w.execute("UPDATE c.once SET k = $1 WHERE height = $2", [at - 1n, at]);
          },
          calls,
        );
      const { off, on } = await both(backend, module, ["c.once"]);
      expect(off.failures.map(where)).toEqual([{ height: at, point: undefined, module: undefined, committed: false }]);
      expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "23505" });
      expect(off.cursor).toBe(at - 1n);
      sameAsOff(on, off);
      expect(calls.filter((height) => height === at)).toHaveLength(2);
      // The chunk 6..at rolled back with its COMMIT; the blocks below at are stored again, one per transaction.
      const below = Array.from({ length: Number(at - 6n) }, (_, i) => 6n + BigInt(i));
      expect(on.facts).toEqual([
        ...[1n, 2n, 3n, 4n, 5n].map((h) => `told committed ${h}`),
        ...[...below, at].map((h) => `told rolledBack ${h}`),
        ...below.map((h) => `told committed ${h}`),
      ]);
    }, 120_000);
  }

  it("a cursor WITH HOLD whose query fails, declared at 6 and closed unfetched at 7: block 6's COMMIT fails as with the mode off, and 6 is not called again", async () => {
    const calls: bigint[] = [];
    const module = () =>
      constrained(
        "CREATE TABLE c.denominators (d bigint PRIMARY KEY); INSERT INTO c.denominators (d) VALUES (0)",
        ["denominators"],
        async (w, height) => {
          if (height === 6n) await w.execute("DECLARE held CURSOR WITH HOLD FOR SELECT 10 / d FROM c.denominators");
          if (height === 7n) await w.execute("CLOSE held");
        },
        calls,
      );
    const { off, on } = await both(backend, module, []);
    // The mode off: the COMMIT of 6 runs the cursor's query to its end, which divides by zero.
    expect(off.failures.map(where)).toEqual([{ height: 6n, point: undefined, module: undefined, committed: false }]);
    expect(databaseError(off.failures[0])).toEqual({ code: "database-error", sqlstate: "22012" });
    expect(off.cursor).toBe(5n);
    sameAsOff(on, off);
    expect(calls.filter((height) => height === 6n)).toHaveLength(2);
    expect(calls.filter((height) => height === 7n)).toEqual([]);
    expect(on.facts).toEqual(off.facts);
  }, 120_000);

  it("a temporary table emptied at each COMMIT: from the block that makes it every block is committed alone and reads it empty, as with the mode off", async () => {
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
    sameAsOff(on, off);
    const expected = Array.from({ length: Number(HEAD) }, (_, i) => `${i + 1}:0`);
    expect(seen).toEqual([...expected, ...expected]);
    expect(transactions(on)).toBe(Number(HEAD) + 1);
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
    sameAsOff(on, off);
    expect(on.cursor).toBe(HEAD);
    expect(transactions(on)).toBe(Number(HEAD) + 1);
  }, 120_000);

  it("chunks form again once the read finds nothing: a temporary table made at 3 and dropped at 6 gives 1..3, then 4, 5 and 6 alone, then 7..10", async () => {
    const module = () =>
      constrained("CREATE TABLE c.counted (height bigint PRIMARY KEY, kept bigint)", ["counted"], async (w, height) => {
        if (height === 3n) await w.execute("CREATE TEMPORARY TABLE scratch (height bigint)");
        if (height >= 3n && height <= 6n) await w.execute("INSERT INTO scratch (height) VALUES ($1)", [height]);
        const kept = height >= 3n && height <= 6n ? (await w.query("SELECT count(*)::bigint AS n FROM scratch"))[0]?.n : null;
        await w.execute("INSERT INTO c.counted (height, kept) VALUES ($1, $2)", [height, kept]);
        if (height === 6n) await w.execute("DROP TABLE scratch");
      });
    const { off, on } = await both(backend, module, ["c.counted"]);
    expect(off.failures).toEqual([]);
    sameAsOff(on, off);
    expect(on.cursor).toBe(HEAD);
    // The transactions, by the heights r wrote in each: the read before the first chunk, 1..3, 4, 5, 6, 7..10.
    const held: string[] = [];
    let open: string[] | undefined;
    for (const mark of on.order) {
      if (mark === "BEGIN") open = [];
      else if (mark === "COMMIT") held.push((open ?? []).join(","));
      else if (mark.startsWith("on-db-write@")) open?.push(mark.slice("on-db-write@".length));
    }
    expect(held).toEqual(["", "1,2,3", "4", "5", "6", "7,8,9,10"]);
  }, 120_000);
});
