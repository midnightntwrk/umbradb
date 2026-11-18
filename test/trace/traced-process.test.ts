import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { buildContentsHash, byteHashedTables, dagOptedOut, type ReadableDatabase } from "../backbone/refcount-contents.js";
import { type DagRun, runDag, runProblems } from "../backbone/refcount-process.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import { fileTraceSink } from "../../src/trace/file-sink.js";
import { startTrace, stopTrace, type TraceSink } from "../../src/trace/trace.js";
import { addingUpProblems, sumOf, unaccountedMs, unaccountedOfBusy, type WorkerLine } from "./worker-time.js";

/**
 * The block trace through the real process (`src/trace/trace.ts`), on PostgreSQL 18: the extended DAG fixture of
 * `test/backbone/ledger-refcount-process.test.ts`, run once without the trace and twice with it.
 * - Traced, the process stores what it stores untraced: the ledger state's tables at every height, and at the last
 *   the whole database, by the build's contents hash and by each table's digest. (The fixture's blocks carry no
 *   transaction.)
 * - The trace has one line per committed height, with the stages' times, the step's sizes and reads, and the chain of
 *   step outputs; one worker line per applied block, posted by the worker's thread; and the statements' totals.
 * - Two traced runs end with the same chain of step outputs.
 * - The `missing` read records, at each height, the keys asked of the database once the set of keys found stored that
 *   `core-ledger-state` keeps between runs answered the others, and `knownHits` those it answered: exactly as a model of
 *   the set gives.
 * - The worker's lines say where the thread's whole time went: the parts of each add up to its span, the node waits
 *   are the node-store bridge's requests, and the main thread's lines hold each request type's round trips. The
 *   range bench's reader (`bench/range/worker-time.mjs`) reads the files such a run writes.
 */

/** The height the second test's first process stops at; the traced one goes on from there. */
const RESUMED = 40;

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The ledger state's tables of every height as text, for comparing two runs. */
const tablesText = (run: DagRun): string =>
  JSON.stringify([...run.tables].map(([h, t]) => [`${h}`, [...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue], [...t.digests]]));

/**
 * The `missing` reads each height of `run` should record, as `[keys asked, keys answered missing]`, and its
 * `knownHits`. A height's settle needs the references of the nodes its block flushed with another child list than the
 * row's after the height before (a list that is the row's own is not checked), and the keys it raised, less the keys
 * it flushed; it asks the database about those the set lacks, at most one read a height and none when the set
 * holds them all, and the set answers the others. The set learns the keys asked that the tables after the height
 * before hold, and forgets the keys the height deleted (the keys it had the worker evict). Every key asked here is
 * stored, so none is answered missing. Also how many keys the heights needed, and how many of them the set answered.
 */
function missingReads(run: DagRun): {
  readonly reads: Map<number, [number, number][]>;
  readonly hits: Map<number, number>;
  readonly needed: number;
  readonly answeredByTheSet: number;
} {
  const known = new Set<string>();
  const reads = new Map<number, [number, number][]>();
  const hits = new Map<number, number>();
  let needed = 0;
  let answeredByTheSet = 0;
  for (let h = 0n; h <= run.cursor; h++) {
    const rows = run.tables.get(h - 1n)?.rows ?? new Map<string, Uint8Array>();
    const flush = run.batches.get(h);
    const inserts = flush?.inserts ?? [];
    const flushed = new Set(inserts.map((node) => hex(node.key)));
    const referenced = inserts
      .filter((node) => {
        const row = rows.get(hex(node.key));
        return row === undefined || Buffer.compare(row, node.children) !== 0;
      })
      .flatMap((node) => childRefKeys(node.children).map(hex));
    const raised = (flush?.rootCounts ?? []).filter((change) => change.delta > 0).map((change) => hex(change.key));
    const wanted = new Set([...referenced, ...raised].filter((key) => !flushed.has(key)));
    const asked = [...wanted].filter((key) => !known.has(key));
    const absent = asked.filter((key) => !rows.has(key));
    reads.set(Number(h), asked.length === 0 ? [] : [[asked.length, absent.length]]);
    hits.set(Number(h), wanted.size - asked.length);
    needed += wanted.size;
    answeredByTheSet += wanted.size - asked.length;
    for (const key of asked) if (rows.has(key)) known.add(key);
    for (const key of run.evicted.get(h) ?? []) known.delete(key);
  }
  return { reads, hits, needed, answeredByTheSet };
}

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
      for (const stage of ["beginMs", "prepareMs", "applyMs", "rootWaitMs", "collectMs", "stepMs", "evictMs", "knownHits", "txMs", "writeBlockMs", "writeRefcountMs", "commitMs", "sqlMs", "encMs", "decMs"]) {
        expect(line[stage], `${stage} at ${String(line.h)}`).toBeGreaterThanOrEqual(0);
      }
      expect(line.sqlN).toBeGreaterThan(0);
      expect(line.sh).toMatch(/^[0-9a-f]{16}$/);
      expect(line.st).toHaveLength(9);
      // The reclamation's reads, by their names; the queue is read in every block.
      const kinds = (line.reads as [string, number, number, number][]).map(([kind]) => kind);
      expect(kinds).toContain("queue");
      for (const kind of kinds) expect(["rows", "changed", "missing", "queue", "queued", "counts", "references"]).toContain(kind);
    }
    // The step's sizes are the run's: the deleted nodes of each height are those the worker was told to evict.
    for (const line of first) {
      const sizes = line.st as number[] | undefined;
      if (sizes !== undefined) expect(sizes[4], `deleted at ${String(line.h)}`).toBe((traced[0]?.evicted.get(BigInt(line.h as number)) ?? []).length);
    }
    // The `missing` read records, at each height, the keys the database is asked about once the set of keys found
    // stored answered the others, and how many it answered missing (none here); `knownHits` the keys the set answered:
    // exactly as a model of the set gives. `knownEmptied` is on the process's first height only: its block does not
    // continue a block before, and no later block fails.
    const expected = missingReads(traced[0] as DagRun);
    // Not vacuous: the set answers most keys the heights need, and most heights still ask about a few (a new root
    // references the subtrees the height before wrote new, which no read found stored).
    expect(expected.answeredByTheSet).toBeGreaterThan(expected.needed / 2);
    expect([...expected.reads.values()].filter((reads) => reads.length > 0).length).toBeGreaterThan(LAST / 2);
    for (const line of first) {
      const missing = ((line.reads as [string, number, number, number][] | undefined) ?? []).filter(([kind]) => kind === "missing");
      expect(missing.map(([, asked, , answered]) => [asked, answered]), `missing at ${String(line.h)}`).toEqual(expected.reads.get(line.h as number));
    }
    for (const line of first) {
      expect(line.knownHits, `knownHits at ${String(line.h)}`).toBe(expected.hits.get(line.h as number));
      expect(line.knownEmptied, `knownEmptied at ${String(line.h)}`).toBe(line.h === 0 ? 1 : undefined);
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

  it("a worker that reads stored nodes: the waits its lines record are the bridge's requests, and the bench's reader reads the run's files", async () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-worker-time-"));
    try {
      // A process stops at RESUMED and a traced one goes on from its database. The second one's worker holds nothing
      // of the state: it reads it from the database through the bridge, when it loads it and at every block that
      // reaches a stored node it does not hold.
      const db = await postgres.database();
      const before = await runDag(db, { dag: "extended", last: RESUMED });
      expect(before.status).toMatchObject({ cursor: BigInt(RESUMED), reason: null });
      let host: LedgerHost | undefined;
      startTrace(fileTraceSink(join(directory, "trace.jsonl")));
      const run = await runDag(db, { dag: "extended", resume: BigInt(RESUMED), worker: (started) => (host = started) });
      stopTrace();
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(run.failure).toBeNull();
      const applied = LAST - RESUMED;
      const lines = (file: string): WorkerLine[] => readFileSync(join(directory, file), "utf8").trimEnd().split("\n").map((line) => JSON.parse(line) as WorkerLine);
      const worker = lines("trace.jsonl.worker.jsonl");
      const blocks = lines("trace.jsonl");
      const total = (rows: readonly WorkerLine[], key: string): number => rows.reduce((sum, line) => sum + ((line[key] as number | undefined) ?? 0), 0);
      const bridge = (host as LedgerHost).bridge();

      // One line per applied block, by the thread that applied it; their parts add up.
      expect(worker.map((line) => line.h)).toEqual(Array.from({ length: applied }, (_, h) => RESUMED + 1 + h));
      expect(blocks.map((line) => line.h)).toEqual(worker.map((line) => line.h));
      expect(addingUpProblems(worker)).toEqual([]);
      expect(unaccountedOfBusy(worker)).toBeLessThan(0.1);
      // The node waits are those the bridge answered, and the nodes those its answers carried.
      expect(bridge.requests).toBeGreaterThan(0);
      expect(total(worker, "nodeWaits")).toBe(bridge.requests);
      expect(total(worker, "nodeGot")).toBe(bridge.nodes);
      expect(total(worker, "nodeGets")).toBeGreaterThanOrEqual(bridge.requests);
      expect(total(worker, "nodeWaitMs")).toBeGreaterThan(0);
      // Each wait fell inside a request, and the thread was blocked for less than the request ran.
      for (const line of worker) {
        expect(sumOf(line, "node.rq.")).toBeCloseTo((line.nodeWaitMs as number | undefined) ?? 0, 1);
        expect((line.nodeWaitMs as number | undefined) ?? 0).toBeLessThanOrEqual(sumOf(line, "rq.") + 0.01);
      }
      // The main thread answered as many node requests, and noticed each while the worker was blocked on it.
      expect(total(blocks, "nodeReads")).toBe(bridge.requests);
      expect(total(blocks, "nodeNoticeMs")).toBeGreaterThan(0);
      expect(total(blocks, "nodeNoticeMs")).toBeLessThanOrEqual(total(worker, "nodeWaitMs") + 0.01 * bridge.requests);
      expect(total(blocks, "nodeReadMs")).toBeGreaterThan(0);

      // The reader's table of the worker's time adds up to the span, and says whether the worker had work.
      const script = fileURLToPath(new URL("../../bench/range/worker-time.mjs", import.meta.url));
      const { FROM: _from, TO: _to, ...env } = process.env;
      const read = spawnSync(process.execPath, [script, directory], { encoding: "utf8", env: { ...env, SKIP: "0" } });
      expect(read.status, read.stderr).toBe(0);
      const [ofWorker, ofMain] = read.stdout.split("the main thread, ms per committed block") as [string, string];
      const row = (text: string, name: string): number[] =>
        (text.split("\n").find((line) => line.trimStart().startsWith(name)) ?? "").slice(32).trim().split(/\s+/).map((cell) => Number.parseFloat(cell));
      // The fixture's blocks carry no transaction: every block is an empty one.
      expect(row(ofWorker, "blocks")).toEqual([applied, applied, 0]);
      const span = total(worker, "spanMs") / applied;
      expect(row(ofWorker, "span")[0]).toBeCloseTo(span, 2);
      // The table's lines: the apply's parts, every other request type the thread ran, and what is not a request.
      const types = [...new Set(worker.flatMap((line) => Object.keys(line).filter((key) => key.startsWith("rq.")).map((key) => key.slice(3))))];
      expect(types).toEqual(expect.arrayContaining(["apply", "commit", "evict", "load", "release"]));
      const others = types.filter((type) => !["apply", "genesis", "parse"].includes(type));
      const parts = ["adapterApply", "settle", "apply, rest", "parse, the phase", "parse, rest", ...others, "posting answers", "node waits", "transit", "idle", "unaccounted"];
      expect(parts.reduce((sum, name) => sum + (row(ofWorker, name)[0] as number), 0)).toBeCloseTo(span, 1);
      expect(row(ofWorker, "node waits")[0]).toBeCloseTo(total(worker, "nodeWaitMs") / applied, 2);
      expect(row(ofWorker, "unaccounted")[0]).toBeCloseTo(worker.reduce((sum, line) => sum + unaccountedMs(line), 0) / applied, 2);
      expect(ofWorker).toMatch(/the worker is waiting for work: it had no request to run for [\d.]+% of its span/);
      expect(ofWorker).toMatch(/unaccounted: [\d.-]+% of the span over all blocks \([\d.-]+% of the time it was not idle\), at most [\d.]+% of one block's/);
      expect(ofWorker).toMatch(new RegExp(`node waits: ${bridge.requests} of [\\d.]+ ms each`));
      // The main thread's side: the run's first line only dates the second.
      expect(row(ofMain, "blocks")).toEqual([applied - 1, applied - 1, 0]);
      expect(row(ofMain, "wait for the worker's apply")[0]).toBeCloseTo((total(blocks.slice(1), "applyMs") - total(blocks.slice(1), "rootWaitMs")) / (applied - 1), 2);
      expect(row(ofMain, "node requests ")[0]).toBeCloseTo(total(blocks.slice(1), "nodeReads") / (applied - 1), 2);
    } finally {
      stopTrace();
      rmSync(directory, { recursive: true, force: true });
    }
  }, 600_000);
});
