import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import {
  FLUSH_LINES,
  OTHER_STATEMENTS,
  STATEMENT_TEXTS,
  startTrace,
  stopTrace,
  traceEndBlock,
  tracing,
  type TraceSink,
} from "../../src/trace/trace.js";
import { buildContentsHash, byteHashedTables, dagOptedOut, type ReadableDatabase } from "../backbone/refcount-contents.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "../backbone/refcount-process.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";

/**
 * The block trace when something fails or overflows (`src/trace/trace.ts`), on PostgreSQL 18. Through the database API:
 * - reads that differ by a comment, more texts than the statements' totals keep by name: the first texts by name, every
 *   other statement in one last entry, none lost;
 * - a statement that fails is counted with its time, and fails as it does untraced.
 *
 * Through the real process, on the extended DAG fixture of `./traced-process.test.ts` (its blocks carry no
 * transaction):
 * - a height whose block transaction fails after its reclamation step, and which the process makes again, adds its
 *   step to the chain of step outputs once: every height's `sh` is a clean run's (negative control: a run whose step
 *   differs from one height on);
 * - a sink that fails during the sync stops the trace with one line in the log, and the sync goes on to store what a
 *   clean run stores. That the worker's thread then stops its own trace is seen in its messages
 *   (`test/ledger/worker-messages.test.ts`).
 */

const postgres = BACKUP_BACKENDS.find((backend) => backend.kind === "postgres") as BackupBackend;

/** Every height of the fixture, once each, in order. */
const EVERY_HEIGHT = Array.from({ length: LAST + 1 }, (_, h) => h);

/** The whole database at the last height: the build's contents hash and each table it takes by its bytes. */
async function databaseOf(db: ReadableDatabase): Promise<{ readonly hash: string; readonly tables: [string, string][] }> {
  const optedOut = dagOptedOut();
  return { hash: await buildContentsHash(db, optedOut), tables: [...(await byteHashedTables(db, optedOut))] };
}

/** A traced run of the extended DAG on a new database, with `options`: the run, its lines and its database. */
async function tracedRun(options: DagRunOptions = {}) {
  const trace = memorySink();
  startTrace(trace.sink);
  const db = await postgres.database();
  let run: DagRun;
  try {
    run = await runDag(db, { dag: "extended", ...options });
  } finally {
    stopTrace();
  }
  return { run, lines: trace.blocks(), db };
}

/** What a promise rejects with, or "resolved". */
const outcome = (running: Promise<unknown>): Promise<unknown> =>
  running.then(
    () => "resolved",
    (error: unknown) => error,
  );

/** What a sink was given, as lines and the statements' last totals. */
function memorySink() {
  const kept = { blocks: "", statements: "[]" };
  const sink: TraceSink = {
    blocks: (text) => void (kept.blocks += text),
    statements: (json) => void (kept.statements = json),
    worker: () => undefined,
  };
  return {
    sink,
    blocks: (): Record<string, unknown>[] =>
      kept.blocks === "" ? [] : kept.blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>),
    statements: () => JSON.parse(kept.statements) as { q: string; n: number; ms: number; max: number }[],
  };
}

describe("the block trace when something fails or overflows, on PostgreSQL", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);
  afterEach(() => stopTrace());

  /** The clean traced run, made once for the tests that compare with it. */
  let clean: ReturnType<typeof tracedRun> | undefined;
  const cleanRun = () => (clean ??= tracedRun());

  it(`reads that differ by a comment, over ${STATEMENT_TEXTS} texts: the first texts by name, the others in one last entry, across a flush, none lost`, async () => {
    const db = await postgres.database();
    const trace = memorySink();
    startTrace(trace.sink);
    const sent = STATEMENT_TEXTS + 100;
    const read = (from: number) =>
      db.read(async (handle) => {
        for (let i = from; i < from + sent; i++) await handle.query(`SELECT 1 /* ${i} */`);
      });
    await read(0);
    // A flush, then as many new texts again.
    for (let height = 1; height <= FLUSH_LINES; height++) traceEndBlock(BigInt(height));
    const atFlush = trace.statements();
    await read(sent);
    traceEndBlock(BigInt(FLUSH_LINES + 1));
    stopTrace();
    const statements = trace.statements();
    for (const totals of [atFlush, statements]) {
      expect(totals).toHaveLength(STATEMENT_TEXTS + 1);
      expect(totals.at(-1)?.q).toBe(OTHER_STATEMENTS);
    }
    // The first texts sent are kept by name, the read's own statements among them; the last are not.
    const names = new Set(statements.map((statement) => statement.q));
    expect(names.has("SELECT 1 /* 0 */")).toBe(true);
    expect(names.has(`SELECT 1 /* ${2 * sent - 1} */`)).toBe(false);
    expect(statements.at(-1)?.n).toBeGreaterThanOrEqual(sent + 100);
    // Every statement the session sent is in the totals: as many as the lines counted.
    const lines = trace.blocks();
    const counted = lines.reduce((sum, line) => sum + ((line.sqlN as number | undefined) ?? 0), 0);
    expect(statements.reduce((sum, statement) => sum + statement.n, 0)).toBe(counted);
    expect(counted).toBeGreaterThanOrEqual(2 * sent);
  }, 120_000);

  it("a statement that fails is counted under its text with its time, and its error is the one an untraced read gets", async () => {
    const db = await postgres.database();
    // It fails once it has slept: the division by zero is met when the row is computed, after the sleep.
    const failing = "SELECT 1 / (count(*) - 1) FROM pg_sleep(0.3)";
    const untraced = await outcome(db.query(failing));
    expect(untraced).toBeInstanceOf(UmbraError);
    const trace = memorySink();
    startTrace(trace.sink);
    const traced = await outcome(db.query(failing));
    traceEndBlock(1n);
    stopTrace();
    const shape = (error: unknown) => {
      const { name, message, code, retryable, details } = error as UmbraError;
      return { name, message, code, retryable, details };
    };
    expect(shape(traced)).toEqual(shape(untraced));
    const [entry] = trace.statements().filter((statement) => statement.q === failing);
    expect(entry?.n).toBe(1);
    expect(entry?.ms).toBeGreaterThanOrEqual(290);
    const [line] = trace.blocks();
    expect(line?.sqlMs as number).toBeGreaterThanOrEqual(290);
    // The same statement that succeeds after its sleep is counted alike.
    const passing = "SELECT 1 / count(*) FROM pg_sleep(0.3)";
    const second = memorySink();
    startTrace(second.sink);
    await db.query(passing);
    stopTrace();
    expect(second.statements().find((statement) => statement.q === passing)?.n).toBe(1);
  }, 60_000);

  it("a height whose block transaction fails after its step, made again by the process, adds that step to the chain once: every height's sh is a clean run's", async () => {
    const { run: cleanDag, lines: cleanLines } = await cleanRun();
    expect(cleanDag.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(cleanLines.map((line) => line.h)).toEqual(EVERY_HEIGHT);
    // A height whose step deletes nodes, and the next such height above it.
    const deleting = [...cleanDag.evicted].filter(([, keys]) => keys.length > 0).map(([height]) => height);
    const failed = deleting.find((height) => height >= 10n) as bigint;
    const differs = deleting.find((height) => height > failed) as bigint;
    expect(failed).toBeDefined();
    expect(differs).toBeDefined();

    // The step's first write at that height fails once, as a lost connection does: the process rolls the block back
    // and makes it again from on-compute, which computes and chains the same step again.
    let faults = 0;
    const failOnce = (w: Pick<BlockWriteHandle, "execute">, height: bigint): Pick<BlockWriteHandle, "execute"> =>
      height !== failed || faults > 0
        ? w
        : {
            execute: async () => {
              faults += 1;
              throw new UmbraError("connection-lost", "the writer's connection was lost (the test's fault)");
            },
          };
    const retried = await tracedRun({ core: { refcountWriter: failOnce }, settings: { backoffCeilingMs: 20 } });
    expect(faults).toBe(1);
    expect(retried.run.lines.filter((line) => line.includes("retries in"))).toHaveLength(1);
    expect(retried.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(retried.run, "extended")).toEqual([]);
    // One line per committed height: the failed run of the height has none.
    expect(retried.lines.map((line) => line.h)).toEqual(EVERY_HEIGHT);
    const chainOf = (lines: readonly Record<string, unknown>[]) => lines.map((line) => [line.h, line.sh ?? null]);
    expect(chainOf(retried.lines)).toEqual(chainOf(cleanLines));

    // Negative control: a run whose step differs from one height on (it deletes nothing there) has the clean chain
    // below that height and another one from it.
    const other = await tracedRun({ revisions: [{ start: differs, settings: { sweep: "off" } }] });
    expect(other.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const below = (lines: readonly Record<string, unknown>[]) => chainOf(lines.filter((line) => BigInt(line.h as number) < differs));
    expect(below(other.lines)).toEqual(below(cleanLines));
    expect(other.lines.find((line) => line.h === Number(differs))?.sh).not.toBe(cleanLines.find((line) => line.h === Number(differs))?.sh);
  }, 600_000);

  it("a sink that fails during the sync stops the trace at its flush, with one line in its log; the sync goes on and stores what a clean run stores", async () => {
    const { db: cleanDb } = await cleanRun();
    const log: string[] = [];
    const failing: TraceSink = {
      blocks: () => {
        throw new Error("no space left on device");
      },
      statements: () => undefined,
      worker: () => undefined,
    };
    startTrace(failing, { log: (line) => log.push(line) });
    // The trace holds all but 40 of a flush's lines when the process starts: its first flush is at the 40th height
    // committed, and fails.
    const failsAt = 40;
    for (let line = 0; line < FLUSH_LINES - failsAt; line++) traceEndBlock(BigInt(1_000_000 + line));
    const db = await postgres.database();
    let stoppedAt: number | null = null;
    const run = await runDag(db, {
      dag: "extended",
      // Whether the trace is still on, read at each height once it is committed (its worker's commit, which comes
      // before the height's line).
      worker: (host) =>
        Object.create(host, {
          commit: {
            value: (block: Parameters<LedgerHost["commit"]>[0]) => {
              if (stoppedAt === null && !tracing()) stoppedAt = Number(block.height);
              return host.commit(block);
            },
          },
        }) as LedgerHost,
    });
    expect(log).toEqual(["block trace stopped, the process goes on untraced: writing it failed: no space left on device"]);
    expect(tracing()).toBe(false);
    // It stopped within the sync, at the flush after height 39's line: height 40 is the first committed untraced.
    expect(stoppedAt).toBe(failsAt);
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(run, "extended")).toEqual([]);
    expect(await databaseOf(db)).toEqual(await databaseOf(cleanDb));
  }, 600_000);
});
