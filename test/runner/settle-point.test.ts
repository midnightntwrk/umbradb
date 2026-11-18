import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { FinalizedLoop, HeightFailure } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  cursorOf,
  failureOf,
  heightsIn,
  InMemoryBlockSource,
  type LoopClass,
  loopInput,
  RUNNER_BACKENDS,
  runUntilWaiting,
  type Started,
  startWith,
} from "./loop-harness.js";
import {
  type Faults,
  HEAD,
  heightLog,
  loggingTransactions,
  orderProblems,
  seen as newSeen,
  settlingModules,
} from "./settle-point-harness.js";

/**
 * The `on-settle` point through the finalized loop (`src/runner/loop.ts`), on PostgreSQL 18 and PGlite 0.5.10. The loop
 * calls it once per height, for the run `{ first: h, last: h }`, inside the block transaction after every `on-db-write`
 * callback and before the cursor check and the `COMMIT`, in `on-db-write`'s order, each callback with a block write
 * handle:
 * - the order of a height's callbacks and its `COMMIT`, and the run each callback is given;
 * - a row written through its handle is stored with the block, and `on-after-db-write` reads it;
 * - it reads the rows the block's `on-db-write` callbacks wrote;
 * - a failure in it stores nothing of the block, leaves the cursor, and names the module and the point; the height is
 *   processed again, `on-settle` included, by the next run after a retryable failure (from `on-compute`) and by a
 *   restart after a halt;
 * - its handle, kept and used after its callback ended, fails naming `on-settle`;
 * - a loop whose modules declare no `on-settle` sends, per block, the statements of a loop without the point.
 * The negative control of the order (the point called after the `COMMIT`) is `settle-point.negative-control.test.ts`.
 */

const HEIGHTS = [1n, 2n, 3n];

/** The tables the two modules write, each with one row per height that committed. */
const TABLES = ["alpha.rows", "beta.rows", "alpha.settled", "beta.settled"];

/** One run of `loop`: its failure, or — once it waits for a head above HEAD, stopped — undefined. */
async function runOnce(loop: FinalizedLoop, source: InMemoryBlockSource, stop: AbortController): Promise<unknown> {
  const running = loop.run().then(
    () => undefined,
    (error: unknown) => error,
  );
  const outcome = await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running]);
  if (outcome === "waiting") stop.abort();
  return running;
}

/** A parameter of a statement as text: a byte string in hex, anything else as `String` gives it. */
const shown = (value: unknown): string => (value instanceof Uint8Array ? Buffer.from(value).toString("hex") : String(value));

/**
 * `db`, recording each statement sent through a transaction's handle (its text, whitespace collapsed, and its
 * parameters), one list per transaction.
 */
function recordingStatements(db: Database): { readonly db: Database; readonly transactions: string[][] } {
  const transactions: string[][] = [];
  const record = (sent: string[], sql: string, params: unknown[] = []) =>
    sent.push(`${sql.replace(/\s+/g, " ").trim()} [${params.map(shown).join(", ")}]`);
  return {
    transactions,
    db: {
      read: (body, options) => db.read(body, options),
      transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
        const sent: string[] = [];
        transactions.push(sent);
        return db.transaction((tx) =>
          body({
            query: (sql, params) => (record(sent, sql, params), tx.query(sql, params)),
            execute: (sql, params) => (record(sent, sql, params), tx.execute(sql, params)),
          }),
        );
      },
      close: () => db.close(),
    },
  };
}

/** The loop without the `on-settle` point: as it was before the point existed. */
class WithoutSettle extends FinalizedLoop {
  protected override async settlePoint(): Promise<void> {}
}

describe.each(RUNNER_BACKENDS)("the on-settle point on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A new database with `alpha` and `beta` from 1, each transaction logged in `seen.log`; the source's head HEAD. */
  async function setUp(faults: Faults = new Map()) {
    const { db } = await backend.database();
    const seen = newSeen();
    const started = await startWith(db, settlingModules(seen, faults), [entry("alpha", 1), entry("beta", 1)]);
    const logged: Started = { ...started, db: loggingTransactions(started.db, seen.log) };
    return { db, seen, started: logged, source: new InMemoryBlockSource({ head: HEAD }) };
  }

  it("calls on-settle once per height with { first: h, last: h }: after every on-db-write, before the COMMIT, in on-db-write's order", async () => {
    const { seen, started, source } = await setUp();
    await runUntilWaiting(started, source, HEAD);
    expect(orderProblems(seen, HEIGHTS)).toEqual([]);
  }, 60_000);

  it("stores a row written through on-settle's handle with the block, and on-after-db-write reads it", async () => {
    const { db, seen, started, source } = await setUp();
    await runUntilWaiting(started, source, HEAD);
    for (const table of TABLES) expect(await heightsIn(db, table), table).toEqual(HEIGHTS);
    // Each on-after-db-write read its own on-settle's row of the height, committed with the block.
    expect(seen.settled).toEqual(HEIGHTS.flatMap((h) => [`alpha read settled@${h}: 1`, `beta read settled@${h}: 2`]));
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("reads at on-settle the rows the block's on-db-write callbacks wrote, its own and an earlier module's", async () => {
    const { db, started, source } = await setUp();
    await runUntilWaiting(started, source, HEAD);
    const counts = (schema: string) =>
      db.read(async (read) =>
        (await read.query(`SELECT height, block_rows FROM ${schema}.settled ORDER BY height`)).map(
          (row) => `${String(row.height)}: ${String(row.block_rows)}`,
        ),
      );
    // alpha counted its row of the run, beta alpha's and its own: neither was committed yet when they were counted.
    expect(await counts("alpha")).toEqual(["1: 1", "2: 1", "3: 1"]);
    expect(await counts("beta")).toEqual(["1: 2", "2: 2", "3: 2"]);
  }, 60_000);

  it("a failure in on-settle stores nothing of the block, leaves the cursor and names the module and the point", async () => {
    const error = new Error("beta's settle failed (the test's fault)");
    const { db, seen, started, source } = await setUp(new Map([["beta on-settle@2..2", error]]));
    const failure = await failureOf(started, source, HEAD);
    expect(failure).toBeInstanceOf(HeightFailure);
    expect(failure).toMatchObject({ height: 2n, point: "on-settle", module: "beta", committed: false });
    expect((failure as HeightFailure).message).toContain("processing stopped at height 2 in on-settle of beta");
    const cause = (failure as HeightFailure).cause;
    expect(cause).toBeInstanceOf(CallbackFailure);
    expect((cause as CallbackFailure).message).toBe(`the on-settle callback of beta failed: ${error.message}`);
    expect((cause as CallbackFailure).cause).toBe(error);
    // Neither module's on-db-write row of 2 nor alpha's on-settle row of 2 is stored; 1 is.
    for (const table of TABLES) expect(await heightsIn(db, table), table).toEqual([1n]);
    expect(await cursorOf(db)).toBe(1n);
    // Height 2 went as far as beta's on-settle, then its transaction rolled back: no COMMIT, no on-after-db-write.
    const two = heightLog(2n);
    expect(seen.log).toEqual([...heightLog(1n), ...two.slice(0, two.indexOf("COMMIT")), "ROLLBACK"]);
  }, 60_000);

  it("a retryable failure in on-settle: the next run processes the height again from on-compute, on-settle included", async () => {
    const lost = new UmbraError("connection-lost", "the writer's connection was lost (the test's fault)");
    const { db, seen, started, source } = await setUp(new Map([["beta on-settle@2..2", lost]]));
    const stop = new AbortController();
    const loop = new FinalizedLoop(loopInput(started, source, stop));
    expect(await runOnce(loop, source, stop)).toMatchObject({
      height: 2n,
      point: "on-settle",
      module: "beta",
      committed: false,
    });
    expect(await cursorOf(db)).toBe(1n);
    const mark = seen.log.length;
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    // The next run reads the cursor in a transaction of its own, then takes 2 again from on-compute (its on-parse items
    // kept): on-compute, on-db-write and on-settle run again, each once more.
    expect(seen.log.slice(mark)).toEqual(["BEGIN", "COMMIT", ...heightLog(2n).slice(2), ...heightLog(3n)]);
    for (const id of ["alpha", "beta"]) {
      expect(seen.log.filter((line) => line === `${id} on-parse@2`), id).toHaveLength(1);
      for (const call of [`${id} on-compute@2`, `${id} on-db-write@2`, `${id} on-settle@2..2`]) {
        expect(seen.log.filter((line) => line === call), call).toHaveLength(2);
      }
    }
    expect(seen.runs.filter(({ run }) => run.first === 2n).map(({ run }) => ({ ...run }))).toEqual(
      Array(4).fill({ first: 2n, last: 2n }),
    );
    for (const table of TABLES) expect(await heightsIn(db, table), table).toEqual(HEIGHTS);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("after a halt in on-settle, a restart processes the height again, on-settle included", async () => {
    const { db, seen, started, source } = await setUp(new Map([["beta on-settle@2..2", new Error("once (the test's fault)")]]));
    expect(await failureOf(started, source, HEAD)).toMatchObject({ height: 2n, point: "on-settle", module: "beta" });
    const mark = seen.log.length;
    await runUntilWaiting(started, source, HEAD);
    // A new loop: the cursor's on-after-db-write is delivered again, then 2 is fetched and processed again whole.
    expect(seen.log.slice(mark)).toEqual([
      "alpha on-after-db-write@1",
      "beta on-after-db-write@1",
      ...heightLog(2n),
      ...heightLog(3n),
    ]);
    for (const table of TABLES) expect(await heightsIn(db, table), table).toEqual(HEIGHTS);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("an on-settle handle kept and used after its callback ended fails the height, naming the module and on-settle", async () => {
    const { db } = await backend.database();
    let kept: BlockWriteHandle | undefined;
    const keeper = declaration("keeper", {
      points: {
        async "on-settle"(_p, _run, w) {
          kept = w;
        },
        async "on-after-db-write"() {
          // The module catches the refusal: it is still the module's error.
          await kept?.query("SELECT 1").catch(() => undefined);
        },
      },
    });
    const started = await startWith(db, [keeper], [entry("keeper", 1)]);
    const failure = await failureOf(started, new InMemoryBlockSource({ head: HEAD }), HEAD);
    expect(failure).toMatchObject({ height: 1n, point: "on-settle", module: "keeper", committed: true });
    const refusal = (failure as HeightFailure).cause;
    expect(refusal).toBeInstanceOf(UmbraError);
    expect(refusal).toMatchObject({
      code: "handle-closed",
      details: { handle: "block-write", module: "keeper", point: "on-settle" },
    });
    expect((refusal as UmbraError).message).toContain("used after its on-settle callback ended");
    expect(await cursorOf(db)).toBe(1n);
  }, 60_000);

  it("a loop whose modules declare no on-settle sends per block the statements of a loop without the point", async () => {
    /** The statements of each block transaction of `kind` over a new database with the module `plain`. */
    async function statementsOf(kind: LoopClass): Promise<string[][]> {
      const { db } = await backend.database();
      const plain = declaration("plain", {
        points: {
          async "on-db-write"(_p, b, w) {
            await w.execute("INSERT INTO plain.rows (height) VALUES ($1)", [b.height]);
          },
        },
      });
      const started = await startWith(db, [plain], [entry("plain", 1)]);
      const recording = recordingStatements(started.db);
      await runUntilWaiting({ ...started, db: recording.db }, new InMemoryBlockSource({ head: HEAD }), HEAD, kind);
      expect(await heightsIn(db, "plain.rows")).toEqual(HEIGHTS);
      return recording.transactions;
    }
    const withPoint = await statementsOf(FinalizedLoop);
    const without = await statementsOf(WithoutSettle);
    // Each block: core-block-commit's role and rows (and from 2 on its parent check), plain's role and row, the reset
    // to the login, and the cursor check's two reads. The texts and parameters are the same without the point.
    expect(withPoint.map((sent) => sent.length)).toEqual([8, 9, 9]);
    expect(withPoint).toEqual(without);
    for (const sent of withPoint) {
      expect(sent.filter((statement) => statement.startsWith("SET LOCAL ROLE") || statement.startsWith("RESET ROLE"))).toEqual([
        'SET LOCAL ROLE "umbradb_m_core_block_commit" []',
        'SET LOCAL ROLE "umbradb_m_plain" []',
        "RESET ROLE []",
      ]);
    }
  }, 60_000);
});
