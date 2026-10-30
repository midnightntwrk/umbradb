import { AsyncLocalStorage } from "node:async_hooks";
import { expect } from "vitest";
import type { CommittedHeight } from "../../src/db/api.js";
import { TEST_SCHEMA } from "./backends.js";
import type { PgliteTestDatabase } from "./pglite-server.js";

/**
 * The instrumented run of the no-outside-read test: on PGlite, under a constant read load, blocks commit one after
 * another through the database API while every statement that reaches the engine is traced. [A11, DB-4]
 *
 * **The trace.** The engine's `query` and `exec` are wrapped, so every statement the database API sends is recorded
 * in the order it was sent, with *who asked for it*: the test runs each read and each block transaction inside an
 * `AsyncLocalStorage` scope of its own (`read`, or `block h`), and the wrapper records the scope the statement was
 * sent from — the database API runs a read's or a transaction's statements, its own `BEGIN`, `RESET`, cursor read,
 * `COMMIT` and `ROLLBACK` included, in the async context of the code that asked for it. PGlite runs statements one at a
 * time in the order they were sent (each `query` waits for its FIFO mutexes, `async-mutex`), so the trace is the order
 * the engine ran them. A block's *window* is the part of the trace from its first statement (its `BEGIN`) to its last
 * (its `COMMIT`); an *outside read* is a statement asked for by a read inside some block's window.
 *
 * **The blocks.** One writer commits blocks 1 to {@link A11_BLOCKS} through `db.transaction`, as the runner will: a row
 * in `t.blocks`, then — after yielding to the event loop twice, so that a read could run if anything let it — a row in
 * `t.rows`, then two more yields, then the API's `COMMIT`.
 *
 * **The reads.** {@link READERS} loops keep a read asked for at all times until the last block has committed. Each
 * read's own statements — its committed height and one query — start with the marker `/* read *\/`, so the trace shows
 * that it holds them. The query also brings back evidence from inside the database, independent of the trace: how many
 * heights have a `t.blocks` row but no `t.rows` row (a block half written), and the id of the transaction it runs in
 * if one was assigned (a read-only transaction has none; a block's transaction has one from its first write).
 */

/** How many blocks the run commits ("over 200 blocks"). [A11] */
export const A11_BLOCKS = 200;

/** How many loops keep a read asked for at all times. */
const READERS = 4;

const READ_MARKER = "/* read */";

/** One statement sent to the engine, and who asked for it (`read`, `block h`, or nobody: opening the database). */
export interface Traced {
  readonly sql: string;
  readonly by: string | undefined;
}

/** What one run gave. */
export interface LoadOutcome {
  /** Every statement sent to the engine from opening the database to the end of the load, in order. */
  readonly trace: readonly Traced[];
  /** Blocks whose transaction committed, and the errors of those that failed. */
  readonly committed: number;
  readonly failedBlocks: readonly unknown[];
  /** Reads that completed, and the errors of those that failed. */
  readonly reads: number;
  readonly failedReads: readonly unknown[];
  /** For each committed block, how many reads were asked for and not yet started in the middle of its transaction. */
  readonly waitingAtMidBlock: readonly number[];
  /** The evidence each completed read brought back from inside the database. */
  readonly evidence: readonly { readonly halfWritten: bigint; readonly transactionId: string | null }[];
  /** The heights in `t.blocks` and in `t.rows` after the run. */
  readonly blockHeights: readonly bigint[];
  readonly rowHeights: readonly bigint[];
}

/** A read's statement found inside a block's window. */
export interface OutsideRead {
  readonly block: string;
  readonly statement: string;
}

const turn = () => new Promise<void>((resolve) => setImmediate(resolve));

/** Runs the load on `database` (fresh, empty), opened through the database API's PGlite backend. */
export async function runUnderReadLoad(database: PgliteTestDatabase): Promise<LoadOutcome> {
  await database.exec(TEST_SCHEMA);
  const asker = new AsyncLocalStorage<string>();
  const trace: Traced[] = [];
  const engine = database.engine;
  const query = engine.query.bind(engine);
  const exec = engine.exec.bind(engine);
  engine.query = ((sql: string, ...rest: unknown[]) => {
    trace.push({ sql, by: asker.getStore() });
    return (query as (...args: unknown[]) => unknown)(sql, ...rest);
  }) as typeof engine.query;
  engine.exec = ((sql: string, ...rest: unknown[]) => {
    trace.push({ sql, by: asker.getStore() });
    return (exec as (...args: unknown[]) => unknown)(sql, ...rest);
  }) as typeof engine.exec;

  const cursor: CommittedHeight = async (read) => {
    const [row] = await read.query(`${READ_MARKER} SELECT max(height) AS height FROM t.blocks`);
    return (row?.height ?? null) as bigint | null;
  };
  const db = await database.open({ committedHeight: cursor });

  let writing = true;
  let asked = 0;
  let started = 0;
  let reads = 0;
  const failedReads: unknown[] = [];
  const evidence: { halfWritten: bigint; transactionId: string | null }[] = [];
  const reader = async () => {
    while (writing) {
      asked++;
      let bodyStarted = false;
      try {
        await asker.run("read", () =>
          db.read(async (read) => {
            bodyStarted = true;
            started++;
            const [row] = await read.query(
              `${READ_MARKER} SELECT (SELECT count(*) FROM t.blocks b WHERE NOT EXISTS
                                        (SELECT 1 FROM t.rows r WHERE r.height = b.height)) AS half_written,
                                     pg_current_xact_id_if_assigned()::text AS transaction_id`,
            );
            evidence.push({
              halfWritten: row?.half_written as bigint,
              transactionId: (row?.transaction_id ?? null) as string | null,
            });
          }),
        );
        reads++;
      } catch (error) {
        // A read that failed before its body started is no longer waiting.
        if (!bodyStarted) started++;
        failedReads.push(error);
      }
    }
  };

  let committed = 0;
  const failedBlocks: unknown[] = [];
  const waitingAtMidBlock: number[] = [];
  const writer = async () => {
    for (let height = 1; height <= A11_BLOCKS; height++) {
      try {
        await asker.run(`block ${height}`, () =>
          db.transaction(async (tx) => {
            await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
            await turn();
            await turn();
            waitingAtMidBlock.push(asked - started);
            await tx.execute("INSERT INTO t.rows VALUES ($1, 'row')", [height]);
            await turn();
            await turn();
          }),
        );
        committed++;
      } catch (error) {
        failedBlocks.push(error);
      }
    }
    writing = false;
  };

  await Promise.all([writer(), ...Array.from({ length: READERS }, reader)]);
  engine.query = query;
  engine.exec = exec;
  const heights = async (table: string) =>
    (await db.read((read) => read.query(`SELECT height FROM t.${table} ORDER BY height`))).map(
      (row) => row.height as bigint,
    );
  return {
    trace,
    committed,
    failedBlocks,
    reads,
    failedReads,
    waitingAtMidBlock,
    evidence,
    blockHeights: await heights("blocks"),
    rowHeights: await heights("rows"),
  };
}

/** The window of each block in the trace: the index of its first and its last statement. */
function windows(trace: readonly Traced[]): Map<string, { first: number; last: number }> {
  const found = new Map<string, { first: number; last: number }>();
  trace.forEach(({ by }, index) => {
    if (by === undefined || !by.startsWith("block ")) return;
    const seen = found.get(by);
    if (seen === undefined) found.set(by, { first: index, last: index });
    else seen.last = index;
  });
  return found;
}

/** Every statement asked for by a read inside a block's window (see the module comment). */
export function outsideReads(trace: readonly Traced[]): OutsideRead[] {
  const found: OutsideRead[] = [];
  for (const [block, { first, last }] of windows(trace)) {
    for (let index = first; index <= last; index++) {
      const { sql, by } = trace[index] as Traced;
      if (by === "read") found.push({ block, statement: sql });
    }
  }
  return found;
}

/**
 * The no-outside-read assertions: every block committed; no statement of a read ran inside a block's window; and the
 * run was not vacuous — reads were waiting in the middle of every block, every statement after opening is attributed
 * to a read or a block, every completed read's own statements are traced, and the evidence from inside the database
 * agrees (no read saw a half-written block or ran in a transaction that had written). [A11]
 */
export function expectNoOutsideReads(outcome: LoadOutcome): void {
  expect(outcome.failedBlocks).toEqual([]);
  expect(outcome.failedReads).toEqual([]);
  expect(outcome.committed).toBe(A11_BLOCKS);
  const heights = Array.from({ length: A11_BLOCKS }, (_, index) => BigInt(index + 1));
  expect(outcome.blockHeights).toEqual(heights);
  expect(outcome.rowHeights).toEqual(heights);

  expect(outsideReads(outcome.trace)).toEqual([]);

  // Each block is one exclusive job: its window is exactly its BEGIN, its two statements and its COMMIT.
  const blocks = windows(outcome.trace);
  expect(blocks.size).toBe(A11_BLOCKS);
  for (const [block, { first, last }] of blocks) {
    expect(
      outcome.trace.slice(first, last + 1).map(({ sql, by }) => [by, sql.trim().split(/\s+/)[0]?.toUpperCase()]),
      block,
    ).toEqual([
      [block, "BEGIN"],
      [block, "INSERT"],
      [block, "INSERT"],
      [block, "COMMIT"],
    ]);
  }

  // Not vacuous: a constant read load, every statement attributed, the database's own evidence clean.
  expect(outcome.waitingAtMidBlock).toHaveLength(A11_BLOCKS);
  expect(outcome.waitingAtMidBlock.every((waiting) => waiting > 0)).toBe(true);
  expect(outcome.reads).toBeGreaterThanOrEqual(A11_BLOCKS);
  const afterOpening = outcome.trace.slice(outcome.trace.findIndex(({ by }) => by !== undefined));
  expect(afterOpening.filter(({ by }) => by === undefined)).toEqual([]);
  const marked = outcome.trace.filter(({ sql }) => sql.startsWith(READ_MARKER));
  expect(marked).toHaveLength(2 * outcome.reads);
  expect(marked.every(({ by }) => by === "read")).toBe(true);
  expect(outcome.evidence).toHaveLength(outcome.reads);
  expect(outcome.evidence.every((e) => e.halfWritten === 0n && e.transactionId === null)).toBe(true);
}
