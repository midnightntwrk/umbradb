import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getHeapSpaceStatistics } from "node:v8";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fileTraceSink, TRACE_VARIABLE } from "../../src/trace/file-sink.js";
import {
  FLUSH_LINES,
  STATEMENT_KEY_LENGTH,
  startTrace,
  stopTrace,
  traceAdd,
  traceChain,
  tracedRead,
  traceDropBlock,
  traceEndBlock,
  traceMark,
  tracePush,
  traceStatement,
  traceSteps,
  traceWorker,
  tracing,
  type TraceSink,
} from "../../src/trace/trace.js";
import {
  endApply,
  nodeAsked,
  nodeGot,
  nodeWaited,
  nodeWaitFrom,
  posting,
  requestArrived,
  requestEnded,
  requestStarted,
  startWorkerTrace,
  stopWorkerTrace,
  timed,
  traceClock,
  workerTracing,
  type WorkerTraceEntry,
} from "../../src/trace/worker-trace.js";
import { addingUpProblems, unaccountedMs } from "./worker-time.js";

// The block trace (`src/trace/`): off unless started, and what it hands its sink once started.

/** A sink that keeps what it is given. */
function memorySink() {
  const kept = { blocks: [] as string[], statements: [] as string[], worker: [] as string[] };
  const sink: TraceSink = {
    blocks: (text) => kept.blocks.push(text),
    statements: (json) => kept.statements.push(json),
    worker: (text) => kept.worker.push(text),
  };
  const lines = (texts: readonly string[]): Record<string, unknown>[] =>
    texts.flatMap((text) => text.trimEnd().split("\n")).map((line) => JSON.parse(line) as Record<string, unknown>);
  return {
    sink,
    kept,
    blockLines: () => lines(kept.blocks),
    workerLines: () => lines(kept.worker),
    statements: () => JSON.parse(kept.statements.at(-1) ?? "[]") as { q: string; n: number; ms: number; max: number }[],
  };
}

afterEach(() => {
  stopTrace();
  stopWorkerTrace();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("the block trace, not started", () => {
  it("is off, and every call does nothing", async () => {
    expect(tracing()).toBe(false);
    traceAdd("applyMs", 1);
    traceMark("tx", 2);
    tracePush("reads", ["rows", 1, 0.1, 1]);
    traceStatement("SELECT 1", 0.5);
    traceChain(["1"]);
    traceWorker({ h: 1 });
    traceEndBlock(1n);
    traceDropBlock();
    stopTrace();
    // A read wrapped for the trace still answers.
    expect(await tracedRead("rows", async (keys: readonly number[]) => new Set(keys))([1, 2])).toEqual(new Set([1, 2]));
    // A trace started afterwards holds nothing of the calls made while it was off.
    const memory = memorySink();
    startTrace(memory.sink);
    traceEndBlock(7n);
    stopTrace();
    const [line] = memory.blockLines();
    expect(Object.keys(line as object).sort()).toEqual(["h", "mem", "t"]);
    expect(memory.statements()).toEqual([]);
    expect(memory.kept.worker).toEqual([]);
  });
});

describe("the block trace, started", () => {
  it("writes one line per ended height with what the height added, marked and pushed", () => {
    const memory = memorySink();
    startTrace(memory.sink);
    expect(tracing()).toBe(true);
    traceAdd("applyMs", 1.5);
    traceAdd("applyMs", 2);
    traceMark("tx", 3);
    traceMark("tx", 4);
    tracePush("reads", ["rows", 2, 0.1, 1]);
    tracePush("reads", ["counts", 5, 0.2, 5]);
    traceEndBlock(10n);
    traceAdd("stepMs", 4);
    traceEndBlock(11n);
    // Nothing reaches the sink before the flush.
    expect(memory.kept.blocks).toEqual([]);
    stopTrace();
    expect(tracing()).toBe(false);
    const lines = memory.blockLines();
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({ h: 10, applyMs: 3.5, tx: 4, reads: [["rows", 2, 0.1, 1], ["counts", 5, 0.2, 5]] });
    // The second height starts empty.
    expect(Object.keys(lines[1] as object).sort()).toEqual(["h", "mem", "stepMs", "t"]);
    // Each line carries the main thread's memory when the height ended: heap in use, outside the heap, resident, in MiB.
    for (const line of lines) {
      const mem = line?.mem as number[];
      expect(mem).toHaveLength(3);
      for (const value of mem) expect(value).toBeGreaterThan(0);
      expect(mem[2] as number).toBeGreaterThan(mem[0] as number);
    }
    expect(lines[1]).toMatchObject({ h: 11, stepMs: 4 });
    expect(lines[1]?.t as number).toBeGreaterThanOrEqual(lines[0]?.t as number);
    // Every block text is whole lines.
    for (const text of memory.kept.blocks) expect(text.endsWith("\n")).toBe(true);
  });

  it("records the steps' detail only when asked", () => {
    expect(traceSteps()).toBe(false);
    startTrace(memorySink().sink);
    expect(traceSteps()).toBe(false);
    startTrace(memorySink().sink, { steps: false });
    expect(traceSteps()).toBe(false);
    startTrace(memorySink().sink, { steps: true });
    expect(traceSteps()).toBe(true);
    stopTrace();
    expect(traceSteps()).toBe(false);
  });

  it("drops a height that did not commit", () => {
    const memory = memorySink();
    startTrace(memory.sink);
    traceAdd("applyMs", 9);
    traceDropBlock();
    traceAdd("applyMs", 1);
    traceEndBlock(5n);
    stopTrace();
    expect(memory.blockLines()).toEqual([expect.objectContaining({ h: 5, applyMs: 1 })]);
  });

  it("counts each statement under its text, whitespace collapsed and cut, and in its height", () => {
    const memory = memorySink();
    startTrace(memory.sink);
    traceStatement("SELECT  a\n  FROM t", 1);
    traceStatement("SELECT a FROM t", 3);
    traceStatement("COMMIT", 0.6);
    const long = `SELECT ${"x".repeat(400)}`;
    traceStatement(long, 2);
    traceEndBlock(1n);
    traceStatement("COMMIT", 0.4);
    traceEndBlock(2n);
    stopTrace();
    expect(memory.statements()).toEqual([
      { q: "SELECT a FROM t", n: 2, ms: 4, max: 3 },
      { q: "COMMIT", n: 2, ms: 1, max: 0.6 },
      { q: long.slice(0, STATEMENT_KEY_LENGTH), n: 1, ms: 2, max: 2 },
    ]);
    const [first, second] = memory.blockLines();
    expect(first).toMatchObject({ sqlN: 4, sqlMs: 6.6, commitMs: 0.6 });
    expect(second).toMatchObject({ sqlN: 1, sqlMs: 0.4, commitMs: 0.4 });
  });

  it("chains the step outputs: each height's sh is the SHA-256 over every value so far", () => {
    const memory = memorySink();
    startTrace(memory.sink);
    const values = [["1", ["aa"]], ["2", []], ["3", ["bb", 1]]];
    for (const [index, value] of values.entries()) {
      traceChain(value);
      traceEndBlock(BigInt(index + 1));
    }
    stopTrace();
    const expected = createHash("sha256");
    const chain = values.map((value) => expected.update(JSON.stringify(value)).copy().digest("hex").slice(0, 16));
    expect(memory.blockLines().map((line) => line.sh)).toEqual(chain);
    // Another order of the same values ends elsewhere.
    const other = memorySink();
    startTrace(other.sink);
    for (const value of [values[1], values[0], values[2]]) traceChain(value);
    traceEndBlock(3n);
    stopTrace();
    expect(other.blockLines()[0]?.sh).not.toBe(chain[2]);
  });

  it("starts each trace's chain and totals anew", () => {
    const first = memorySink();
    startTrace(first.sink);
    traceChain(["1"]);
    traceStatement("SELECT 1", 1);
    traceEndBlock(1n);
    // Started again without a stop: the first is stopped, and flushed.
    const second = memorySink();
    startTrace(second.sink);
    traceChain(["1"]);
    traceEndBlock(1n);
    stopTrace();
    expect(first.blockLines()).toHaveLength(1);
    expect(second.blockLines()[0]?.sh).toBe(first.blockLines()[0]?.sh);
    expect(second.statements()).toEqual([]);
  });

  it(`hands the sink its lines every ${FLUSH_LINES} heights, the worker's with them`, () => {
    const memory = memorySink();
    startTrace(memory.sink);
    traceWorker({ h: 1, tx: 0, flush: 1.25 });
    for (let height = 1; height < FLUSH_LINES; height++) traceEndBlock(BigInt(height));
    expect(memory.kept.blocks).toEqual([]);
    expect(memory.kept.worker).toEqual([]);
    traceEndBlock(BigInt(FLUSH_LINES));
    expect(memory.blockLines()).toHaveLength(FLUSH_LINES);
    expect(memory.workerLines()).toEqual([{ h: 1, tx: 0, flush: 1.25 }]);
    expect(memory.kept.statements).toHaveLength(1);
    traceEndBlock(BigInt(FLUSH_LINES + 1));
    stopTrace();
    expect(memory.blockLines()).toHaveLength(FLUSH_LINES + 1);
    // Nothing is handed over twice.
    expect(memory.workerLines()).toHaveLength(1);
  });

  it("records a traced read: its kind, the keys asked, its time and the entries answered", async () => {
    const memory = memorySink();
    startTrace(memory.sink);
    const rows = tracedRead("rows", async (keys: readonly string[]) => new Set(keys.slice(0, 2)));
    const counts = tracedRead("counts", async (keys: readonly string[]) => new Map(keys.map((key) => [key, 1])));
    const queue = tracedRead("queue", async () => ["a", "b", "c"]);
    const nothing = tracedRead("other", async (_height: number) => null);
    expect(await rows(["a", "b", "c"])).toEqual(new Set(["a", "b"]));
    expect((await counts(["a"])).get("a")).toBe(1);
    expect(await queue()).toEqual(["a", "b", "c"]);
    expect(await nothing(1)).toBeNull();
    traceEndBlock(1n);
    stopTrace();
    const reads = memory.blockLines()[0]?.reads as [string, number, number, number][];
    expect(reads.map(([kind, asked, , answered]) => [kind, asked, answered])).toEqual([
      ["rows", 3, 2],
      ["counts", 1, 1],
      ["queue", 0, 3],
      ["other", 0, 0],
    ]);
    for (const [, , ms] of reads) expect(ms).toBeGreaterThanOrEqual(0);
  });
});

describe("the block trace's files", () => {
  it(`${TRACE_VARIABLE} names the file; the statements and the worker's lines go beside it`, () => {
    expect(TRACE_VARIABLE).toBe("UMBRADB_TRACE");
    const directory = mkdtempSync(join(tmpdir(), "umbradb-trace-"));
    try {
      const file = join(directory, "trace.jsonl");
      startTrace(fileTraceSink(file));
      traceStatement("SELECT 1", 1);
      traceWorker({ h: 1, tx: 0 });
      traceEndBlock(1n);
      stopTrace();
      startTrace(fileTraceSink(file));
      traceStatement("SELECT 2", 1);
      traceWorker({ h: 2, tx: 1 });
      traceEndBlock(2n);
      stopTrace();
      // Lines are appended; the statements' totals are the last trace's.
      expect(readFileSync(file, "utf8").trimEnd().split("\n").map((line) => (JSON.parse(line) as { h: number }).h)).toEqual([1, 2]);
      expect(readFileSync(`${file}.worker.jsonl`, "utf8")).toBe('{"h":1,"tx":0}\n{"h":2,"tx":1}\n');
      expect(JSON.parse(readFileSync(`${file}.stmts.json`, "utf8"))).toEqual([{ q: "SELECT 2", n: 1, ms: 1, max: 1 }]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("are opened when the sink is built: each missing one created empty, an existing one left as it is; a folder that does not exist throws", () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-trace-"));
    try {
      const file = join(directory, "trace.jsonl");
      writeFileSync(file, '{"h":1}\n');
      fileTraceSink(file);
      expect(readFileSync(file, "utf8")).toBe('{"h":1}\n');
      expect(readFileSync(`${file}.stmts.json`, "utf8")).toBe("");
      expect(readFileSync(`${file}.worker.jsonl`, "utf8")).toBe("");
      expect(() => fileTraceSink(join(directory, "missing", "trace.jsonl"))).toThrow(/ENOENT/);
      expect(existsSync(join(directory, "missing"))).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe("the block trace, when its sink fails", () => {
  it("stops at the flush that failed, with one line in its log; the heights after it and the stop record nothing and throw nothing", () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-trace-"));
    const folder = join(directory, "run");
    /** A trace into `folder`, removed after the start when `remove`: one more height than a flush holds, then the stop. */
    const traced = (remove: boolean): { readonly log: string[]; readonly afterFlush: boolean } => {
      mkdirSync(folder, { recursive: true });
      const log: string[] = [];
      startTrace(fileTraceSink(join(folder, "trace.jsonl")), { log: (line) => log.push(line) });
      if (remove) rmSync(folder, { recursive: true, force: true });
      for (let height = 1; height <= FLUSH_LINES; height++) traceEndBlock(BigInt(height));
      const afterFlush = tracing();
      traceAdd("applyMs", 1);
      traceEndBlock(BigInt(FLUSH_LINES + 1));
      stopTrace();
      return { log, afterFlush };
    };
    try {
      // Negative control: with the folder kept, the same heights are written and the trace goes on past the flush.
      expect(traced(false)).toEqual({ log: [], afterFlush: true });
      expect(readFileSync(join(folder, "trace.jsonl"), "utf8").trimEnd().split("\n")).toHaveLength(FLUSH_LINES + 1);
      rmSync(folder, { recursive: true, force: true });
      // The folder removed once the trace started: the first flush cannot write, and the trace stops there.
      const failed = traced(true);
      expect(failed.afterFlush).toBe(false);
      expect(failed.log).toEqual([expect.stringMatching(/^block trace stopped, the process goes on untraced: writing it failed: ENOENT/)]);
      expect(tracing()).toBe(false);
      expect(existsSync(folder)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("stops without throwing when the stop's own flush fails, says what the sink threw, and says nothing without a log", () => {
    const log: string[] = [];
    const failing = (thrown: unknown): TraceSink => ({
      blocks: () => undefined,
      statements: () => {
        throw thrown;
      },
      worker: () => undefined,
    });
    startTrace(failing(new RangeError("no space left")), { log: (line) => log.push(line) });
    traceEndBlock(1n);
    expect(() => stopTrace()).not.toThrow();
    expect(tracing()).toBe(false);
    startTrace(failing("no room"), { log: (line) => log.push(line) });
    stopTrace();
    expect(log).toEqual([
      "block trace stopped, the process goes on untraced: writing it failed: no space left",
      "block trace stopped, the process goes on untraced: writing it failed: no room",
    ]);
    // Without a log, the same failure at a flush stops the trace and says nothing.
    startTrace(failing(new RangeError("no space left")));
    for (let height = 1; height <= FLUSH_LINES; height++) traceEndBlock(BigInt(height));
    expect(tracing()).toBe(false);
    expect(log).toHaveLength(2);
  });
});

describe("the ledger worker's trace", () => {
  it("not started, runs the work and posts nothing", () => {
    expect(workerTracing()).toBe(false);
    expect(timed("flush", () => 7)).toBe(7);
    expect(() =>
      timed("flush", () => {
        throw new RangeError("no");
      }),
    ).toThrow(RangeError);
    // A request's arrival, start and end, its answer's post and a node wait record nothing; the post still happens.
    const arrival = requestArrived(traceClock());
    expect(arrival).toBeNull();
    requestStarted("apply", arrival);
    let posted = 0;
    posting(() => void (posted += 1));
    expect(posted).toBe(1);
    nodeAsked();
    expect(nodeWaitFrom()).toBe(0);
    nodeWaited(0);
    nodeGot(3);
    requestEnded();
    endApply(1n, 0);
    // A trace started afterwards holds nothing of it.
    const entries: WorkerTraceEntry[] = [];
    startWorkerTrace((entry) => entries.push(entry));
    endApply(2n, 0);
    expect(Object.keys(entries[0] as object).sort()).toEqual(["ext", "h", "heap", "rss", "spanMs", "tx"]);
  });

  it("started, posts one entry per applied block with each phase's time, summed, and starts over", () => {
    const entries: WorkerTraceEntry[] = [];
    startWorkerTrace((entry) => entries.push(entry));
    expect(timed("parse", () => "parsed")).toBe("parsed");
    timed("stateApply", () => undefined);
    timed("stateApply", () => undefined);
    // A phase that throws is still counted.
    expect(() =>
      timed("wellFormed", () => {
        throw new RangeError("no");
      }),
    ).toThrow(RangeError);
    endApply(12n, 2);
    timed("flush", () => undefined);
    endApply(13n, 0);
    expect(entries.map((entry) => Object.keys(entry).sort())).toEqual([
      ["ext", "h", "heap", "parse", "rss", "spanMs", "stateApply", "tx", "wellFormed"],
      ["ext", "flush", "h", "heap", "rss", "spanMs", "tx"],
    ]);
    // The thread's memory when the block was applied, in MiB: the resident set holds the heap.
    for (const entry of entries) expect(entry.rss as number).toBeGreaterThan(entry.heap as number);
    expect(entries[0]).toMatchObject({ h: 12, tx: 2 });
    expect(entries[1]).toMatchObject({ h: 13, tx: 0 });
    for (const entry of entries) for (const value of Object.values(entry)) expect(value).toBeGreaterThanOrEqual(0);
    // Stopped: nothing more is posted, and what a block recorded since is dropped.
    timed("flush", () => undefined);
    stopWorkerTrace();
    endApply(14n, 0);
    expect(entries).toHaveLength(2);
    startWorkerTrace((entry) => entries.push(entry));
    endApply(15n, 0);
    expect(Object.keys(entries[2] as object).sort()).toEqual(["ext", "h", "heap", "rss", "spanMs", "tx"]);
  });

  /** The thread's clock, set by the test: `performance.now()` answers `clock.at`. */
  function fakeClock(start: number): { at: number } {
    const clock = { at: start };
    vi.spyOn(performance, "now").mockImplementation(() => clock.at);
    return clock;
  }
  /** The shared clock's value when this thread's `performance.now()` is `at`: what the main thread posts. */
  const sentAt = (at: number): number => performance.timeOrigin + at;

  it("accounts for the thread's whole time between two applied blocks: each request by type, the idle time and of it the transit, cut at the entry's end", () => {
    const entries: WorkerTraceEntry[] = [];
    const clock = fakeClock(100);
    startWorkerTrace((entry) => entries.push(entry));
    expect(workerTracing()).toBe(true);

    // A parse posted at 105 reaches the thread, free since 100, at 110: 10 ms idle, 5 of them with the parse on its way.
    clock.at = 110;
    const parse = requestArrived(sentAt(105));
    requestStarted("parse", parse);
    timed("parse", () => void (clock.at = 113));
    posting(() => void (clock.at = 114));
    requestEnded();

    // An apply posted at 106, while the parse ran: handled once the parse ended, at 114.5. It waited 8 ms behind the
    // parse and was 0.5 ms on its way to a free thread.
    clock.at = 114.5;
    const apply = requestArrived(sentAt(106));
    requestStarted("apply", apply);
    clock.at = 115;
    timed("adapterApply", () => {
      timed("stateApply", () => {
        // Three nodes asked of the store: two served without a wait, one read by the main thread in 2 ms with 3 more.
        nodeAsked();
        nodeAsked();
        nodeAsked();
        clock.at = 116;
        const from = nodeWaitFrom();
        expect(from).toBe(116);
        clock.at = 118;
        nodeWaited(from);
        nodeGot(4);
      });
      clock.at = 120;
    });
    timed("settle", () => {
      nodeAsked();
      clock.at = 120.25;
      const from = nodeWaitFrom();
      clock.at = 120.75;
      nodeWaited(from);
      nodeGot(1);
      clock.at = 121;
    });
    clock.at = 122;
    endApply(7n, 3);

    // The apply goes on after its entry: its answer's post and its end are the next entry's.
    posting(() => void (clock.at = 123.5));
    clock.at = 124;
    requestEnded();
    // A commit posted at 123, handled at 124.25: 1 ms behind the apply, 0.25 ms on its way.
    clock.at = 124.25;
    const commit = requestArrived(sentAt(123));
    requestStarted("commit", commit);
    clock.at = 125;
    posting(() => undefined);
    requestEnded();
    // An apply whose message does not say when it was posted (a main thread that is not traced): no transit, no wait.
    clock.at = 130;
    const second = requestArrived(undefined);
    requestStarted("apply", second);
    // A load arrives while the apply awaits: the thread is not idle, and the load waits for the apply's end.
    clock.at = 131;
    const load = requestArrived(sentAt(130.5));
    clock.at = 133;
    endApply(8n, 0);
    clock.at = 134;
    requestEnded();
    requestStarted("load", load);
    // A node wait under no phase is its request's alone.
    const from = nodeWaitFrom();
    clock.at = 135;
    nodeWaited(from);
    requestEnded();
    // An apply right after: no idle time before it but the turn of the event loop.
    clock.at = 135.5;
    requestStarted("apply", requestArrived(sentAt(135.25)));
    clock.at = 136;
    endApply(9n, 0);

    const [first, next, last] = entries as [WorkerTraceEntry, WorkerTraceEntry, WorkerTraceEntry];
    expect(first).toMatchObject({
      h: 7,
      tx: 3,
      spanMs: 22,
      "rq.parse": 4,
      "rqN.parse": 1,
      "post.parse": 1,
      parse: 3,
      "rq.apply": 7.5,
      "rqN.apply": 1,
      adapterApply: 5,
      stateApply: 3,
      settle: 1,
      nodeGets: 4,
      nodeWaits: 2,
      nodeGot: 5,
      nodeWaitMs: 2.5,
      "node.adapterApply": 2,
      "node.stateApply": 2,
      "node.settle": 0.5,
      "node.rq.apply": 2.5,
      idleMs: 10.5,
    });
    expect(first.transitMs).toBeCloseTo(5.5, 2);
    expect(first.queuedMs).toBeCloseTo(8, 2);
    expect(first["post.apply"]).toBeUndefined();
    expect(next).toMatchObject({
      h: 8,
      tx: 0,
      spanMs: 11,
      "rq.apply": 5,
      "rqN.apply": 1,
      "post.apply": 1.5,
      "rq.commit": 0.75,
      "rqN.commit": 1,
      "post.commit": 0,
      idleMs: 5.25,
    });
    expect(next.transitMs).toBeCloseTo(0.25, 2);
    expect(next.queuedMs).toBeCloseTo(1, 2);
    expect(last).toMatchObject({
      h: 9,
      spanMs: 3,
      "rq.apply": 1.5,
      "rq.load": 1,
      "rqN.load": 1,
      "rqN.apply": 1,
      nodeWaitMs: 1,
      nodeWaits: 1,
      "node.rq.load": 1,
      idleMs: 0.5,
    });
    // The load waited 3.5 ms from its post to its start, none of it on its way to a free thread.
    expect(last.queuedMs).toBeCloseTo(3.5, 2);
    expect(last.transitMs).toBeCloseTo(0.25, 2);
    expect(Object.keys(last).filter((key) => key.startsWith("node."))).toEqual(["node.rq.load"]);

    // The parts add up to each span.
    for (const entry of entries) expect(unaccountedMs(entry)).toBeCloseTo(0, 6);
    expect(addingUpProblems(entries, 0, 0.001)).toEqual([]);
    // Negative control: with a request type left out of an entry, its parts no longer add up.
    const { "rq.commit": _commit, ...withoutCommit } = next;
    expect(addingUpProblems([first, withoutCommit, last])).toEqual(["the entry of 8: 0.750 ms of its 11 ms are not accounted for"]);
    const { spanMs: _span, ...withoutSpan } = first;
    expect(addingUpProblems([withoutSpan])).toEqual(["the entry of 7 has no spanMs"]);
  });

  it("stopped while a request runs, records nothing of it afterwards", () => {
    const entries: WorkerTraceEntry[] = [];
    startWorkerTrace((entry) => entries.push(entry));
    const arrival = requestArrived(traceClock());
    requestStarted("apply", arrival);
    stopWorkerTrace();
    // A trace started while that request still runs knows no request: its end and its post are not recorded.
    startWorkerTrace((entry) => entries.push(entry));
    let posted = 0;
    posting(() => void (posted += 1));
    requestEnded();
    requestStarted("commit", null);
    endApply(1n, 0);
    expect(posted).toBe(1);
    expect(Object.keys(entries[0] as object).filter((key) => /^(rq|rqN|post)\./.test(key))).toEqual([]);
  });

  /** The bytes in use in the young generation of this thread's heap, which a collection of it empties. */
  const youngBytes = (): number => getHeapSpaceStatistics().find((space) => space.space_name === "new_space")?.space_used_size ?? 0;

  /** Makes garbage until the runtime has collected the young generation at least once: its bytes in use fell. */
  const collect = (): void => {
    let before = youngBytes();
    for (let round = 0; round < 100_000; round++) {
      const kept: { readonly text: string }[] = [];
      for (let i = 0; i < 2_000; i++) kept.push({ text: `garbage ${round} ${i}` });
      const now = youngBytes();
      if (now < before) return;
      before = now;
    }
    throw new Error("the runtime collected nothing");
  };

  it("counts the thread's garbage collections in the span they began in, also when the runtime reports them after the span's entry", async () => {
    // The runtime reports a collection once the thread is back in its event loop, to every observer in one turn: the
    // test's own observer says when the trace's has been told.
    const began: number[] = [];
    const own = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) began.push(entry.startTime);
    });
    own.observe({ entryTypes: ["gc"] });
    const reported = async (since: number): Promise<void> => {
      for (let turn = 0; turn < 4_000 && !began.some((at) => at >= since); turn++) await new Promise((resolve) => setTimeout(resolve, 5));
      expect(began.some((at) => at >= since)).toBe(true);
      await new Promise((resolve) => setImmediate(resolve));
    };
    try {
      const entries: WorkerTraceEntry[] = [];
      startWorkerTrace((entry) => entries.push(entry));
      // Collections reported before the entry is posted are the entry's.
      const firstFrom = performance.now();
      collect();
      await reported(firstFrom);
      endApply(21n, 0);
      // Collections of a span reported after its entry (22) and the one after it (23) were posted are in the entry of
      // 24, under the height they belong to.
      const secondFrom = performance.now();
      collect();
      endApply(22n, 0);
      endApply(23n, 0);
      await reported(secondFrom);
      endApply(24n, 0);
      const [first, second, third, fourth] = entries as [WorkerTraceEntry, WorkerTraceEntry, WorkerTraceEntry, WorkerTraceEntry];
      expect(first.gcN).toBeGreaterThan(0);
      expect(first.gcMs).toBeGreaterThan(0);
      expect(first.gcMs as number).toBeLessThan(first.spanMs as number);
      for (const entry of [second, third]) expect(Object.keys(entry).filter((key) => key.startsWith("gc"))).toEqual([]);
      expect(fourth["gcNOf.22"]).toBeGreaterThan(0);
      expect(fourth["gcOf.22"]).toBeGreaterThan(0);
      // Stopped, the observer is gone: later collections reach no entry.
      stopWorkerTrace();
      const lastFrom = performance.now();
      collect();
      await reported(lastFrom);
      expect(entries).toHaveLength(4);
    } finally {
      own.disconnect();
    }
  });

  it("records no collection where the runtime reports none", async () => {
    vi.stubGlobal("PerformanceObserver", undefined);
    const entries: WorkerTraceEntry[] = [];
    startWorkerTrace((entry) => entries.push(entry));
    collect();
    await new Promise((resolve) => setTimeout(resolve, 20));
    endApply(1n, 0);
    expect(Object.keys(entries[0] as object).sort()).toEqual(["ext", "h", "heap", "rss", "spanMs", "tx"]);
  });
});
