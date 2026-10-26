import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { settlesWithin } from "../db/backends.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  countingTransactions,
  cursorOf,
  heightsIn,
  InMemoryBlockSource,
  type LoopClass,
  loopInput,
  type RunnerDatabase,
  RUNNER_BACKENDS,
  runUntilWaiting,
  startWith,
} from "./loop-harness.js";

/**
 * One transaction per finalized height, and none while the loop waits (task 5.2; RN-6, RN-14; A41, A49): a catch-up of
 * 100 heights commits each in its own `BEGIN … COMMIT` with the cursor inside, in ascending order — the transaction ids
 * PostgreSQL recorded on each height's rows (`xmin`) are one per height, the same for the cursor row and the module's
 * row of that height, and ascending — and with the source's head at the cursor no transaction is open (PostgreSQL's
 * `pg_stat_activity`; PGlite's one engine), and processing resumes when the head rises. A41 and A49 name PostgreSQL;
 * both run on PGlite too. Each has its committed negative control: a loop that commits two heights in one transaction,
 * and one that waits inside a read.
 */

/** A module writing one row per height (`tx_probe.rows`). */
const PROBE = declaration("tx-probe", {
  points: {
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO tx_probe.rows (height) VALUES ($1)", [b.height]);
    },
  },
});

/** Per committed height: the transaction ids of its cursor row and of the probe's row. */
async function transactionIds(db: Database): Promise<{ height: bigint; cursor: bigint; probe: bigint }[]> {
  const rows = await db.read((read) =>
    read.query(
      "SELECT b.height, b.xmin::text AS cursor, r.xmin::text AS probe FROM core_block_commit.blocks b " +
        "FULL JOIN tx_probe.rows r USING (height) ORDER BY height",
    ),
  );
  const id = (text: unknown): bigint => (text === null ? -1n : BigInt(text as string));
  return rows.map((row) => ({ height: row.height as bigint, cursor: id(row.cursor), probe: id(row.probe) }));
}

/** A41's oracle: the problems found (none when each height committed alone, in ascending order). */
function oneTransactionPerHeight(ids: readonly { height: bigint; cursor: bigint; probe: bigint }[], heights: number): string[] {
  const problems: string[] = [];
  if (ids.length !== heights) problems.push(`${ids.length} heights committed, not ${heights}`);
  for (const [index, id] of ids.entries()) {
    if (id.cursor !== id.probe) problems.push(`height ${id.height}: the cursor and the module's row are in two transactions`);
    const previous = ids[index - 1];
    if (previous !== undefined && previous.cursor >= id.cursor) {
      problems.push(`heights ${previous.height} and ${id.height} share a transaction or commit out of order`);
    }
  }
  return problems;
}

/** A loop that commits two heights in one transaction: each odd height's block waits for the next height's. */
class Batching extends FinalizedLoop {
  #pending: HeightRun | undefined;

  protected override async commit(run: HeightRun): Promise<void> {
    const pending = this.#pending;
    if (pending === undefined) {
      this.#pending = run;
      return;
    }
    this.#pending = undefined;
    await this.input.db.transaction(async (tx) => {
      await this.write(tx, pending);
      await this.write(tx, run);
    });
  }
}

/** A loop that waits for the source's head inside a read, so a transaction stays open while it waits. */
class WaitingInRead extends FinalizedLoop {
  protected override wait(above: bigint): Promise<void> {
    return this.input.db.read(() => super.wait(above));
  }
}

describe.each(RUNNER_BACKENDS)("one transaction per height, none while waiting, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  async function catchUp(kind?: LoopClass) {
    const opened = await backend.database();
    const counted = countingTransactions(opened.db);
    const finalized: bigint[] = [];
    const announcer = declaration("announcer", {
      points: {
        async "on-finalized"(_p, head) {
          finalized.push(head.height);
        },
      },
    });
    const started = await startWith(counted.db, [PROBE, announcer], [entry("tx-probe", 1), entry("announcer", 1)]);
    const before = counted.count();
    await runUntilWaiting(started, new InMemoryBlockSource({ head: 100n }), 100n, kind);
    return { db: opened.db, transactions: counted.count() - before, finalized };
  }

  it("A41: a catch-up of 100 heights commits 100 transactions, one height each, in ascending order", async () => {
    const { db, transactions, finalized } = await catchUp();
    const ids = await transactionIds(db);
    expect(oneTransactionPerHeight(ids, 100)).toEqual([]);
    expect(ids.map((id) => id.height)).toEqual(Array.from({ length: 100 }, (_, i) => BigInt(i + 1)));
    expect(new Set(ids.map((id) => id.cursor)).size).toBe(100);
    expect(transactions).toBe(100);
    expect(finalized).toEqual([100n]);
    expect(await cursorOf(db)).toBe(100n);
  }, 120_000);

  it("negative control: a loop that commits two heights in one transaction fails A41", async () => {
    const { db, transactions } = await catchUp(Batching);
    const problems = oneTransactionPerHeight(await transactionIds(db), 100);
    expect(problems).toHaveLength(50);
    expect(problems[0]).toBe("heights 1 and 2 share a transaction or commit out of order");
    expect(transactions).toBe(50);
  }, 120_000);

  /** A49's oracle at a wait: the problems found (none when no transaction is open and the queue is free). */
  async function openWhileWaiting(opened: RunnerDatabase): Promise<string[]> {
    const problems: string[] = [];
    const open = await opened.openTransactions();
    if (open !== 0) problems.push(`${open} transactions are open while the loop waits`);
    // Nothing holds the database: a read of it settles at once (on PGlite it would wait in the one queue).
    if (!(await settlesWithin(opened.db.read(async () => undefined), 5_000))) problems.push("a read waits");
    return problems;
  }

  async function waitAndResume(kind: LoopClass): Promise<{ problems: string[]; heights: bigint[] }> {
    const opened = await backend.database();
    const started = await startWith(opened.db, [PROBE], [entry("tx-probe", 1)]);
    const source = new InMemoryBlockSource({ head: 5n });
    const controller = new AbortController();
    const running = new kind(loopInput(started, source, controller)).run();
    const problems: string[] = [];
    try {
      await source.waiting(5n);
      problems.push(...(await openWhileWaiting(opened)));
      source.finalize(8n);
      await source.waiting(8n);
      problems.push(...(await openWhileWaiting(opened)));
    } finally {
      controller.abort();
      await running;
    }
    // Read once the loop stopped: a loop waiting inside a read would hold PGlite's one queue.
    return { problems, heights: await heightsIn(opened.db, "tx_probe.rows") };
  }

  it("A49: with the head at the cursor no transaction is open, and processing resumes when the head rises", async () => {
    const { problems, heights } = await waitAndResume(FinalizedLoop);
    expect(problems).toEqual([]);
    expect(heights).toEqual([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n]);
  }, 60_000);

  it("negative control: a loop that waits inside a read fails A49", async () => {
    const { problems } = await waitAndResume(WaitingInRead);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems[0]).toBe("1 transactions are open while the loop waits");
  }, 60_000);
});
