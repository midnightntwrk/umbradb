import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { buildContentsHash, byteHashedTables, dagOptedOut, type ReadableDatabase } from "../backbone/refcount-contents.js";
import { type DagRun, runDag, runProblems } from "../backbone/refcount-process.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import { startTrace, stopTrace, type TraceSink } from "../../src/trace/trace.js";
import { addingUpProblems, unaccountedOfBusy, type WorkerLine } from "./worker-time.js";

/**
 * The block trace through the real process (`src/trace/trace.ts`), on PostgreSQL 18: the extended DAG fixture of
 * `test/backbone/ledger-refcount-process.test.ts`, run once without the trace and twice with it.
 * - Traced, the process stores what it stores untraced: the ledger state's tables at every height, and at the last
 *   the whole database, by the build's contents hash and by each table's digest. (The fixture's blocks carry no
 *   transaction.)
 * - The trace has one line per committed height, with the stages' times, the step's sizes and reads, and the chain of
 *   step outputs; one worker line per applied block, posted by the worker's thread; and the statements' totals.
 * - Two traced runs end with the same chain of step outputs.
 * - The worker's lines say where the thread's whole time went: the parts of each add up to its span, and the main
 *   thread's lines hold each request type's round trips.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The ledger state's tables of every height as text, for comparing two runs. */
const tablesText = (run: DagRun): string =>
  JSON.stringify([...run.tables].map(([h, t]) => [`${h}`, [...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue], [...t.digests]]));

/**
 * The whole database at the last height: the build's contents hash, and each table it takes by its bytes as the MD5 of
 * its rows (`../backbone/refcount-contents.ts`), the tables of the fixture's watchers left out as the hash leaves them.
 */
async function databaseOf(db: ReadableDatabase): Promise<{ readonly hash: string; readonly tables: [string, string][] }> {
  const optedOut = dagOptedOut();
  return { hash: await buildContentsHash(db, optedOut), tables: [...(await byteHashedTables(db, optedOut))] };
}

function memorySink() {
  const kept = { blocks: "", statements: "[]", worker: "" };
  const sink: TraceSink = {
    blocks: (text) => void (kept.blocks += text),
    statements: (json) => void (kept.statements = json),
    worker: (text) => void (kept.worker += text),
  };
  const lines = (text: string): Record<string, unknown>[] =>
    text === "" ? [] : text.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
  return {
    sink,
    blocks: () => lines(kept.blocks),
    worker: () => lines(kept.worker),
    statements: () => JSON.parse(kept.statements) as { q: string; n: number; ms: number }[],
  };
}

const postgres = BACKUP_BACKENDS.find((backend) => backend.kind === "postgres") as BackupBackend;

describe("the block trace through the process, on PostgreSQL", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);
  afterEach(() => stopTrace());

  it("a traced run stores what an untraced run stores, and its trace has every height, the worker's applies and the statements", async () => {
    const plainDb = await postgres.database();
    const plain = await runDag(plainDb, { dag: "extended" });
    expect(plain.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const plainDatabase = await databaseOf(plainDb);
    // The comparison below takes in more than the ledger state: among others the committed blocks (the cursor), the
    // chain's configuration and events, and the digests.
    expect(plainDatabase.tables.map(([table]) => table)).toEqual(
      expect.arrayContaining(["core_block_commit.blocks", "core_chain.config", "core_chain_events.events", "core_digest.tables"]),
    );

    const traces = [memorySink(), memorySink()];
    const traced: DagRun[] = [];
    for (const [index, trace] of traces.entries()) {
      // The second with the steps' detail, which changes neither the chain nor what is stored.
      startTrace(trace.sink, { steps: index === 1 });
      const db = await postgres.database();
      const run = await runDag(db, { dag: "extended" });
      stopTrace();
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(runProblems(run, "extended")).toEqual([]);
      expect(await databaseOf(db)).toEqual(plainDatabase);
      traced.push(run);
    }
    for (const run of traced) expect(tablesText(run)).toBe(tablesText(plain));

    const [first, second] = traces.map((trace) => trace.blocks()) as [Record<string, unknown>[], Record<string, unknown>[]];
    // One line per committed height, in order.
    expect(first.map((line) => line.h)).toEqual(Array.from({ length: LAST + 1 }, (_, h) => h));
    for (const line of first.slice(1)) {
      for (const stage of ["beginMs", "prepareMs", "applyMs", "rootWaitMs", "stepMs", "evictMs", "txMs", "writeBlockMs", "writeRefcountMs", "commitMs", "sqlMs", "encMs", "decMs"]) {
        expect(line[stage], `${stage} at ${String(line.h)}`).toBeGreaterThanOrEqual(0);
      }
      expect(line.sqlN).toBeGreaterThan(0);
      expect(line.sh).toMatch(/^[0-9a-f]{16}$/);
      expect(line.st).toHaveLength(9);
      // The step's reads, by their names; the queue is read in every block.
      const kinds = (line.reads as [string, number, number, number][]).map(([kind]) => kind);
      expect(kinds).toContain("queue");
      for (const kind of kinds) expect(["rows", "changed", "queue", "counts", "references"]).toContain(kind);
    }
    // The step's sizes are the run's: the deleted nodes of each height are those the worker was told to evict.
    for (const line of first) {
      const sizes = line.st as number[] | undefined;
      if (sizes !== undefined) expect(sizes[4], `deleted at ${String(line.h)}`).toBe((traced[0]?.evicted.get(BigInt(line.h as number)) ?? []).length);
    }
    // The same heights give the same chain, and so the same last link.
    expect(second.map((line) => line.sh)).toEqual(first.map((line) => line.sh));
    expect(new Set(first.slice(1).map((line) => line.sh)).size).toBe(LAST);

    // Only the trace asked for the steps' detail has it: as many count changes, new nodes and deleted nodes as `st` says.
    for (const line of first) expect(line.d).toBeUndefined();
    for (const line of second.slice(1)) {
      const sizes = line.st as number[];
      expect((line.d as unknown[]).length).toBe(sizes[3]);
      expect((line.nn as unknown[]).length).toBe(sizes[0]);
      expect((line.del as unknown[]).length).toBe(sizes[4]);
      for (const [key, change] of line.d as [string, number][]) {
        expect(key).toMatch(/^[0-9a-f]{12}$/);
        expect(Number.isInteger(change) && change !== 0).toBe(true);
      }
    }

    // The worker's thread posted one entry per applied block, with its phases.
    const worker = traces[0]?.worker() ?? [];
    expect(worker.map((line) => line.h)).toEqual(Array.from({ length: LAST }, (_, h) => h + 1));
    for (const line of worker) {
      for (const phase of ["adapterApply", "settle", "stateKey", "stateRoot", "summary", "persist", "contracts", "release", "flush"]) {
        expect(line[phase], `${phase} at ${String(line.h)}`).toBeGreaterThanOrEqual(0);
      }
    }

    // The worker's whole time: each line's requests and idle time add up to its span, in both traced runs.
    for (const trace of traces) expect(addingUpProblems(trace.worker())).toEqual([]);
    // This worker waits for the main thread most of the time, so its lines are also held to the time it was not idle:
    // over the run, under a tenth of that is unaccounted. Negative control: with a request type (the apply) left out
    // of the lines, far more is.
    expect(unaccountedOfBusy(worker)).toBeLessThan(0.1);
    expect(unaccountedOfBusy(worker.map(({ "rq.apply": _apply, ...rest }) => rest))).toBeGreaterThan(0.2);
    for (const line of worker) {
      expect(line.spanMs, `the span at ${String(line.h)}`).toBeGreaterThan(0);
      expect(line["rq.apply"]).toBeGreaterThan(0);
      for (const part of ["idleMs", "transitMs", "queuedMs"]) expect(line[part], `${part} at ${String(line.h)}`).toBeGreaterThanOrEqual(0);
      expect(line.transitMs as number).toBeLessThanOrEqual((line.idleMs as number) + 0.001);
    }
    // Every request type the process sends for a block is counted, in the worker's lines and, as round trips, in the
    // main thread's (the fixture's blocks carry no transaction, so nothing is parsed).
    const counted = (lines: readonly WorkerLine[], prefix: string): string[] =>
      [...new Set(lines.flatMap((line) => Object.keys(line).filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length))))].sort();
    expect(counted(worker, "rqN.")).toEqual(expect.arrayContaining(["apply", "commit", "evict", "load", "release"]));
    expect(counted(first, "rtN.")).toEqual(expect.arrayContaining(["apply", "commit", "evict", "load", "release"]));
    const sumAll = (lines: readonly WorkerLine[], key: string): number => lines.reduce((total, line) => total + ((line[key] as number | undefined) ?? 0), 0);
    // An apply's round trip holds its run in the worker; every answer came back.
    expect(sumAll(first, "rtN.apply")).toBeGreaterThanOrEqual(LAST);
    expect(sumAll(first, "rt.apply")).toBeGreaterThanOrEqual(sumAll(worker, "adapterApply") + sumAll(worker, "settle"));
    expect(sumAll(first, "backMs")).toBeGreaterThan(0);

    // The statements' totals: every COMMIT of the run, and the step's count merge.
    const statements = traces[0]?.statements() ?? [];
    expect(statements.find((statement) => statement.q === "COMMIT")?.n).toBeGreaterThanOrEqual(LAST + 1);
    expect(statements.some((statement) => statement.q.includes("core_ledger_state.ref_counts"))).toBe(true);
    expect(first.reduce((sum, line) => sum + ((line.sqlN as number | undefined) ?? 0), 0)).toBeLessThanOrEqual(statements.reduce((sum, statement) => sum + statement.n, 0));
  }, 600_000);
});
