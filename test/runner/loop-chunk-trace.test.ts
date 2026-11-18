import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, ReadHandle } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startTrace, stopTrace, traceAdd, traceChain, traceMark, type TraceSink } from "../../src/trace/trace.js";
import { declaration } from "../modules/declarations.js";
import { chunksOf, runChunks } from "./loop-chunk-harness.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "./process-backends.js";
import { core, entryOf, startProcess, testBuild } from "./process-build.js";

/**
 * The block trace, the slow windows and the process's view of the cursor with chunks of blocks in one transaction
 * (fast-sync mode):
 * - through the loop, on PostgreSQL 18 and PGlite 0.5.10, chunks of 1, 2 and 7 over heights 1 to 20 against the mode
 *   off: one line per height, in order, each with its own block's work and the same `sh`, `chunk` on every line of a
 *   chunk of two blocks or more, `beginMs` on its first line only, `txMs` on every line, `commitMs` (PostgreSQL) on its
 *   last only; no line for a chunk that rolled back, a block stored again chained once; a slow window of a block of a
 *   chunk told `ended` at the `COMMIT`;
 * - through the process: while a chunk is open, the status's cursor and a module API route answer the last committed
 *   height on PostgreSQL, and on PGlite the route answers once the chunk committed; a chunk that rolled back is never
 *   seen.
 */

/** A sink that keeps the block lines. */
function memorySink(): { readonly sink: TraceSink; lines(): Record<string, unknown>[] } {
  const texts: string[] = [];
  return {
    sink: { blocks: (text) => void texts.push(text), statements: () => undefined, worker: () => undefined },
    lines: () => texts.flatMap((text) => text.trimEnd().split("\n")).map((line) => JSON.parse(line) as Record<string, unknown>),
  };
}

/**
 * Module `tr`: chains its step outputs at `on-compute` and `on-settle`, marks its height there and after the commit,
 * and fails at `on-db-write` of `failAt` once (not retryable).
 */
function tracing(failAt?: bigint): ModuleDeclaration {
  let failed = false;
  return declaration("tr", {
    points: {
      async "on-compute"(_p, b: BlockContext) {
        traceChain(["compute", String(b.height)]);
        traceMark("computed", Number(b.height));
      },
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        await w.execute("INSERT INTO tr.rows (height) VALUES ($1)", [b.height]);
        if (b.height === failAt && !failed) {
          failed = true;
          throw new Error(`tr failed at ${b.height}`);
        }
      },
      async "on-settle"(_p, run) {
        traceChain(["settle", String(run.first)]);
      },
      async "on-after-db-write"(_p, b: BlockContext) {
        traceMark("after", Number(b.height));
        traceAdd("afterN", 1);
      },
    },
  });
}

afterEach(() => stopTrace());

describe.each(RUNNER_BACKENDS)("the trace of chunks through the loop on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  const postgres = backend.name.startsWith("PostgreSQL");

  /** The lines of a traced run of `tr` over heights 1 to `head`; the run's failure, if any. */
  async function traced(head: bigint, blocks: number | undefined, failAt?: bigint): Promise<{ lines: Record<string, unknown>[]; failure: unknown }> {
    const memory = memorySink();
    startTrace(memory.sink);
    let failure: unknown;
    try {
      await runChunks(backend, { head, modules: [tracing(failAt)], ...(blocks === undefined ? {} : { blocks }) });
    } catch (error) {
      failure = error;
    } finally {
      stopTrace();
    }
    return { lines: memory.lines(), failure };
  }

  for (const blocks of [1, 2, 7]) {
    it(`chunks of ${blocks}: a line per height with its own work and the same sh as the mode off; chunk, beginMs, txMs and commitMs as a chunk sets them`, async () => {
      const off = await traced(20n, undefined);
      const on = await traced(20n, blocks);
      expect(on.lines.map((line) => line.h)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
      const same = (line: Record<string, unknown>) => ({ h: line.h, sh: line.sh, computed: line.computed, after: line.after, afterN: line.afterN });
      expect(on.lines.map(same)).toEqual(off.lines.map(same));
      const chunks = chunksOf(blocks, 20n);
      for (const [first, last] of chunks) {
        for (let h = first; h <= last; h++) {
          const line = on.lines[Number(h) - 1] as Record<string, unknown>;
          const at = `height ${h}`;
          if (last > first) expect(line.chunk, at).toEqual([Number(first), Number(last)]);
          else expect(line, at).not.toHaveProperty("chunk");
          if (h === first) expect(line.beginMs, at).toBeGreaterThanOrEqual(0);
          else expect(line, at).not.toHaveProperty("beginMs");
          expect(line.txMs, at).toBeGreaterThanOrEqual(0);
          // The run's first line also holds the startup's statements, its COMMITs among them.
          if (postgres && h === last) expect(line.commitMs, at).toBeGreaterThanOrEqual(0);
          else if (h !== last && h !== 1n) expect(line, at).not.toHaveProperty("commitMs");
          if (postgres) expect(line.sqlN, at).toBeGreaterThan(0);
        }
      }
    }, 120_000);
  }

  it("no line for a chunk that rolled back, and a block stored again chained once", async () => {
    const off = await traced(10n, undefined, 8n);
    const on = await traced(10n, 5, 8n);
    expect(on.failure).toBeDefined();
    expect(on.lines.map((line) => line.h)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(on.lines.map((line) => line.sh)).toEqual(off.lines.map((line) => line.sh));
    // 6 and 7, stored again one per transaction, have lines of their own, as the mode off's.
    expect(on.lines.slice(5).map((line) => line.chunk)).toEqual([undefined, undefined]);
  }, 120_000);

  it("a slow window of a block of a chunk is told ended at the COMMIT", async () => {
    const order: string[] = [];
    const hold = declaration("hold", {
      points: {
        async "on-compute"(_p, b: BlockContext) {
          if (b.height === 2n) await sleep(400);
        },
      },
    });
    await runChunks(backend, {
      head: 7n,
      blocks: 7,
      order,
      modules: [hold],
      slowBlockMs: 100,
      observer: {
        slow: (event) =>
          void order.push(event.kind === "raised" ? `raised ${event.activity.height}` : `ended ${event.height} ${String(event.completed)}`),
      },
    });
    // Raised while block 2's on-compute holds (hold's callback runs before r's), after block 1's writes.
    expect(order.indexOf("raised 2")).toBeGreaterThan(order.indexOf("on-settle@1"));
    expect(order.indexOf("raised 2")).toBeLessThan(order.indexOf("on-db-write@2"));
    expect(order.indexOf("ended 2 true")).toBeGreaterThan(order.indexOf("COMMIT"));
    expect(order.indexOf("ended 2 true")).toBeLessThan(order.indexOf("on-after-db-write@1"));
  }, 120_000);
});

describe("the cursor and a module API route while a chunk is open, through the process", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  /**
   * Module `m`: writes its height at `on-db-write`, where block 4's waits for `gate` after saying it is there; fails
   * there at `failAt` (not retryable). Its route `GET /max` answers the highest height of its table.
   */
  function apiModule(gate: Promise<void> | undefined, reached: () => void, failAt?: bigint): ModuleDeclaration {
    return declaration("m", {
      points: {
        async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
          await w.execute("INSERT INTO m.rows (height) VALUES ($1)", [b.height]);
          if (b.height === 4n && gate !== undefined) {
            reached();
            await gate;
          }
          if (b.height === failAt) throw new Error(`m failed at ${b.height}`);
        },
        async "on-start-api"(_p, api) {
          api.http("GET", "/max", async (_request, read: ReadHandle) => {
            const [row] = await read.query("SELECT max(height) AS h FROM m.rows");
            return { status: 200, body: { max: row?.h === null || row?.h === undefined ? null : String(row.h) } };
          });
        },
      },
    });
  }

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    const pglite = backend.name.startsWith("PGlite");
    it(`on ${backend.name}: ${pglite ? "the route answers once the open chunk committed" : "the cursor and the route answer the last committed height while a chunk is open"}; a chunk that rolled back is never seen`, async () => {
      for (const failAt of [undefined, 6n]) {
        const db = await backend.database();
        let release!: () => void;
        const gate = failAt === undefined ? new Promise<void>((resolve) => (release = resolve)) : undefined;
        let reached!: () => void;
        const there = new Promise<void>((resolve) => (reached = resolve));
        const m = apiModule(gate, reached, failAt);
        const build = testBuild([m]);
        const source = new InMemoryBlockSource({ head: 10n });
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting, 1, { extra: { listen: { api: "127.0.0.1:0" }, fastSync: { blocks: 7, distance: 0 } } }), entryOf(m, 1, { pollMs: 1 })] } },
          source,
          log: () => undefined,
        });
        try {
          const { api } = await handle.started;
          const max = async (): Promise<string | null> => {
            const response = await fetch(`http://${api?.host}:${api?.port}/max`);
            return ((await response.json()) as { max: string | null }).max;
          };
          if (failAt === undefined) {
            await there;
            // The chunk 1..7 is open at block 4's writes: nothing of it is committed.
            expect(handle.status().cursor).toBeNull();
            const asked = max();
            const early = await Promise.race([asked, sleep(500, "waiting" as const)]);
            if (pglite) expect(early).toBe("waiting");
            else expect(early).toBeNull();
            release();
            if (pglite) expect(await asked).toBe("7");
            await source.waiting(10n);
            expect(handle.status().cursor).toBe(10n);
            expect(await max()).toBe("10");
          } else {
            // The chunk 1..7 rolls back at 6; 1..5 are stored again, then 6's failure halts.
            await handle.ended;
            expect(handle.status().cursor).toBe(5n);
            expect(await max()).toBe("5");
          }
        } finally {
          await handle.stop();
        }
      }
    }, 120_000);
  }
});
