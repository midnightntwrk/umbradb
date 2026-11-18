import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { WRITER_LOCK_CLASS, WRITER_LOCK_KEY } from "../../src/db/writer-lock.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { startTrace, stopTrace, type TraceSink } from "../../src/trace/trace.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";

/**
 * The copy of the counts and child lists that `core-ledger-state` keeps between settles
 * (`src/backbone/core-ledger-state/counts-copy.ts`), through the real process on PostgreSQL 18 and PGlite 0.5.10, on
 * the extended DAG fixture (`./refcount-process.ts`):
 * - four runs, with no copy (`reclamationCache.keys` 0), with the copy (the default), verifying, and verifying with a
 *   copy of 30 keys (emptied by its bound at many heights): every `core_ledger_state` table after every block is the
 *   same in the four, and the reference's (`runProblems`). Each height's trace shows the copy asked exactly the keys
 *   the `counts` and `references` reads ask with no copy (`copyHits` and `copyMisses`), the database asked only the
 *   missed ones, and, verifying, every one;
 * - a verifying run stopped at 40 and started again (a new process context, with an empty copy) stores what an
 *   uninterrupted run stores;
 * - on PostgreSQL, the writer's session replaced after 40's `COMMIT` answered, another writer taking the writer lock
 *   and writing in between: 41 does not continue the block before, so the copy is emptied at 41's `on-compute` and
 *   answers nothing at 41's settle; verifying, nothing differs, and the tables are a run's with no copy. The control,
 *   a loop that tells every block it continues, has 41 answer from the copy.
 *
 * The runs through a lost connection and a lost `COMMIT` answer, verifying, are in `stored-keys.test.ts`. The negative
 * controls (the copy not updated from the net write; a root count answered without the run's change) are in
 * `ledger-refcount-copy.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The tables of every height as text, for comparing two runs. */
const tablesText = (run: DagRun, from = 0n): string =>
  JSON.stringify(
    [...run.tables]
      .filter(([h]) => h >= from)
      .map(([h, t]) => [`${h}`, [...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue], [...t.digests]]),
  );

/** A run of the extended DAG on `db`, traced in memory. */
async function traced(db: ProcessDatabase, options: Omit<DagRunOptions, "dag"> = {}): Promise<{ readonly run: DagRun; readonly lines: Record<string, unknown>[] }> {
  let blocks = "";
  const sink: TraceSink = { blocks: (text) => void (blocks += text), statements: () => undefined, worker: () => undefined };
  startTrace(sink);
  let run: DagRun;
  try {
    run = await runDag(db, { dag: "extended", ...options });
  } finally {
    stopTrace();
  }
  return { run, lines: blocks === "" ? [] : blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>) };
}

/** The keys a height's `counts` and `references` reads asked the database. */
const keysAsked = (line: Record<string, unknown>): number =>
  ((line.reads ?? []) as [string, number, number, number][]).filter(([kind]) => kind === "counts" || kind === "references").reduce((sum, [, keys]) => sum + keys, 0);

const VERIFYING = { verify: true } as const;

/** What another writer runs while it holds the writer lock: it rewrites the count rows as they are. */
const REWRITE = "UPDATE core_ledger_state.ref_counts SET count = count";

/**
 * Another writer between two of the loop's transactions: the session holding the writer lock is ended, and once the
 * loop's database saw it, the test's own session takes the lock, runs `change` and releases the lock.
 */
async function anotherWriter(db: ProcessDatabase, loopDb: Database, change: string): Promise<void> {
  await (db.terminateWriter as () => Promise<number>)();
  const session = (): number | null | undefined => (loopDb as Partial<Pick<Database, "writerSession">>).writerSession?.();
  for (let attempt = 0; attempt < 200 && session() !== null; attempt++) await new Promise((resolve) => setTimeout(resolve, 25));
  if (!(await (db.takeWriterLock as () => Promise<boolean>)())) throw new Error("the test's writer could not take the writer lock");
  await db.query(change);
  await db.query(`SELECT pg_advisory_unlock(${WRITER_LOCK_CLASS}, hashtext('${WRITER_LOCK_KEY}'))`);
}

/**
 * The loop of a run on `db` whose writer's session another writer replaces once `at`'s `COMMIT` answered; with
 * `continuing`, every block but a run's first is told it continues the one before (the negative control's seam).
 */
function replacingLoop(db: ProcessDatabase, at: bigint, continuing: boolean): new (input: LoopInput) => FinalizedLoop {
  let acted = false;
  return class extends FinalizedLoop {
    protected override async commit(run: HeightRun): Promise<void> {
      await super.commit(run);
      if (run.height !== at || acted) return;
      acted = true;
      await anotherWriter(db, this.input.db, REWRITE);
    }

    protected override continues(run: HeightRun): boolean {
      return continuing ? run.previous !== null : super.continues(run);
    }
  };
}

describe.each(PROCESS_BACKENDS)("the copy of the counts and child lists through the process, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("with no copy, the copy, verifying, and a copy of 30 keys: every table after every block is the same in the four and the reference's; the copy is asked what no copy asks the database, which is asked only what it lacks", async () => {
    const modes = [
      ["no copy", { keys: 0 }],
      // Not verifying even with UMBRADB_TEST_VERIFY_RECLAMATION=1 (`test/runner/process-build.ts`).
      ["the copy", { verify: false }],
      ["verifying", VERIFYING],
      ["a copy of 30 keys, verifying", { keys: 30, verify: true }],
    ] as const;
    const runs: { readonly name: string; readonly run: DagRun; readonly lines: Record<string, unknown>[] }[] = [];
    for (const [name, cache] of modes) {
      const { run, lines } = await traced(await backend.database(), { settings: { reclamationCache: cache } });
      expect(run.status, name).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(runProblems(run, "extended"), name).toEqual([]);
      expect(lines.map((line) => line.h), name).toEqual(Array.from({ length: LAST + 1 }, (_, h) => h));
      runs.push({ name, run, lines });
    }
    const [none, copy, verifying, small] = runs as [(typeof runs)[number], (typeof runs)[number], (typeof runs)[number], (typeof runs)[number]];
    for (const { name, run } of runs.slice(1)) expect(tablesText(run), name).toBe(tablesText(none.run));

    // With no copy, no line has the copy's keys.
    expect(none.lines.filter((line) => line.copyHits !== undefined || line.copyMisses !== undefined || line.copyEmptied !== undefined)).toEqual([]);
    for (const { name, lines } of [copy, verifying, small]) {
      for (const [at, line] of lines.entries()) {
        const plain = none.lines[at] as Record<string, unknown>;
        const asked = (line.copyHits as number) + (line.copyMisses as number);
        // The copy is asked the keys no copy asks the database.
        expect(asked, `${name} at ${String(line.h)}`).toBe(keysAsked(plain));
        // The database is asked those the copy lacks; verifying, every one.
        expect(keysAsked(line), `${name} at ${String(line.h)}`).toBe(name === "the copy" ? line.copyMisses : asked);
      }
    }
    const total = (lines: readonly Record<string, unknown>[], key: string): number => lines.reduce((sum, line) => sum + ((line[key] as number | undefined) ?? 0), 0);
    // Not vacuous: the copy answers most of what the heights ask, so the database is asked far fewer keys.
    expect(total(copy.lines, "copyHits")).toBeGreaterThan(total(copy.lines, "copyMisses"));
    expect(copy.lines.reduce((sum, line) => sum + keysAsked(line), 0)).toBeLessThan(none.lines.reduce((sum, line) => sum + keysAsked(line), 0) / 2);
    // Emptied at the process's first height only; the small copy by its bound at other heights too.
    expect(copy.lines.filter((line) => line.copyEmptied !== undefined).map((line) => line.h)).toEqual([0]);
    expect(small.lines.filter((line) => line.copyEmptied !== undefined).length).toBeGreaterThan(10);
  }, PATIENCE_MS * 8);

  it("a verifying run stopped at 40 and started again stores what an uninterrupted one stores: the new process starts with an empty copy", async () => {
    const whole = await runDag(await backend.database(), { dag: "extended", settings: { reclamationCache: VERIFYING } });
    expect(whole.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const db = await backend.database();
    const before = await runDag(db, { dag: "extended", last: 40, settings: { reclamationCache: VERIFYING } });
    expect(before.status).toMatchObject({ cursor: 40n, reason: null });
    const after = await traced(db, { resume: 40n, settings: { reclamationCache: VERIFYING } });
    expect(after.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(tablesText(before)).toBe(tablesText({ ...whole, tables: new Map([...whole.tables].filter(([h]) => h <= 40n)) }));
    expect(tablesText(after.run, 41n)).toBe(tablesText(whole, 41n));
    // The started process's first height read everything: the copy was empty.
    const first = after.lines[0] as Record<string, unknown>;
    expect([first.h, first.copyHits, first.copyEmptied]).toEqual([41, 0, 1]);
  }, PATIENCE_MS * 6);
});

describe("the copy and another writer between two heights, through the process on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  const AT = 40;

  /** A verifying run whose writer's session another writer replaces after `AT`'s `COMMIT`. */
  async function replaced(continuing: boolean) {
    const db = await backend.database();
    return traced(db, { settings: { reclamationCache: VERIFYING }, loop: replacingLoop(db, BigInt(AT), continuing) });
  }

  it("the writer's session replaced after 40's COMMIT, another writer in between: 41 does not continue, the copy is emptied before 41's settle and answers nothing there; verifying, nothing differs, and the tables are a run's with no copy", async () => {
    const { run, lines } = await replaced(false);
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(run, "extended")).toEqual([]);
    const next = lines.find((line) => line.h === AT + 1) as Record<string, unknown>;
    expect([next.copyHits, next.copyEmptied, next.knownEmptied]).toEqual([0, 1, 1]);
    expect(next.copyMisses as number).toBeGreaterThan(0);
    expect(lines.filter((line) => line.copyEmptied !== undefined).map((line) => line.h)).toEqual([0, AT + 1]);
    const none = await runDag(await backend.database(), { dag: "extended", settings: { reclamationCache: { keys: 0 } } });
    expect(tablesText(run)).toBe(tablesText(none));
  }, PATIENCE_MS * 4);

  it("control: with the loop telling every block it continues, 41 answers from the copy what 40's settle left in it", async () => {
    const { run, lines } = await replaced(true);
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const next = lines.find((line) => line.h === AT + 1) as Record<string, unknown>;
    expect(next.copyHits as number).toBeGreaterThan(0);
    expect(next.copyEmptied).toBeUndefined();
    expect(lines.filter((line) => line.copyEmptied !== undefined).map((line) => line.h)).toEqual([0]);
  }, PATIENCE_MS * 4);
});

