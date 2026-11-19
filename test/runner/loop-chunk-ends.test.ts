import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, ReadHandle, ReadOnlyDatabase, Transaction } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import type { Revision } from "../../src/modules/declaration.js";
import { isBackbonePart } from "../../src/runner/dispatch.js";
import { loggingFollower } from "./block-continues-harness.js";
import { Contexts } from "./fixtures.js";
import { byPoint, chunksOf, orderOf, runChunks } from "./loop-chunk-harness.js";
import { cursorOf, RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * Where a chunk of blocks in one transaction ends (`src/runner/loop.ts`, fast-sync mode), on PostgreSQL 18 and PGlite
 * 0.5.10, through the in-memory source:
 * - a pause hold or the loop's signal asked during block k's writes ends the chunk at k with a `COMMIT`; its callbacks
 *   after the commit are delivered; the loop pauses or returns; the blocks taken above k are not fetched again;
 * - the bounds of `chunkEnd`: a head lower than a full chunk, `distance` 0 and 5, a range's end, the loop's last
 *   height; `on-start-height` only at a chunk's first block, `on-stop-height` only at its last;
 * - `blockBeforeCommitted()`: at once with the mode off and at a chunk's first block; at a later block the chunk
 *   commits at the block before, the callback goes on with that block committed and visible to another reader, every
 *   callback runs once, in decision order; called after a read through the callback's handle, that read ends first
 *   and the callback's later reads see the block before committed; a programming error outside `on-compute`.
 */

/**
 * The order of `r`'s points for a chunk `first`..`last` whose blocks `takes` are taken before its `BEGIN` (the others
 * taken earlier), `first` at 1 starting `r`.
 */
function chunkOrder(first: bigint, last: bigint, takes: readonly bigint[]): string[] {
  const order = takes.flatMap((h) => [`on-fetch@${h}`, `on-parse@${h}`]);
  if (first === 1n) order.push("on-start-height@1");
  order.push(`on-compute@${first}`, "BEGIN");
  for (let h = first; h <= last; h++) {
    if (h > first) order.push(`on-compute@${h}`);
    order.push(`on-db-write@${h}`, `on-settle@${h}`);
  }
  order.push("COMMIT");
  for (let h = first; h <= last; h++) order.push(`on-after-db-write@${h}`);
  return order;
}

const range = (from: bigint, to: bigint): bigint[] => Array.from({ length: Number(to - from + 1n) }, (_, i) => from + BigInt(i));

describe.each(RUNNER_BACKENDS)("where a chunk ends on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a pause hold asked during block 3's writes: the chunk commits at 3, its callbacks run, the loop pauses, and 4 to 7 are not fetched again", async () => {
    const pauses = new LoopPauses();
    let hold: PauseHold | undefined;
    let pausedOrder: string[] = [];
    let pausedCursor: Promise<bigint | null> | undefined;
    let db: Database | undefined;
    const order: string[] = [];
    await runChunks(backend, {
      head: 14n,
      blocks: 7,
      order,
      pause: pauses,
      onDatabase: (given) => {
        db = given;
      },
      recorder: {
        async at(point, height) {
          if (point !== "on-db-write" || height !== 3n || hold !== undefined) return;
          hold = pauses.hold();
          void hold.reached.then(() => {
            pausedOrder = [...order];
            pausedCursor = cursorOf(db as Database);
            hold?.release();
          });
        },
      },
    });
    expect(pausedOrder).toEqual(["on-finalized@14", "BEGIN", "COMMIT", ...chunkOrder(1n, 3n, range(1n, 7n))]);
    expect(await pausedCursor).toBe(3n);
    // After the pause: 4 to 7, taken before it, are not fetched or parsed again.
    expect(order).toEqual([
      "on-finalized@14",
      ...["BEGIN", "COMMIT"],
      ...chunkOrder(1n, 3n, range(1n, 7n)),
      ...chunkOrder(4n, 10n, range(8n, 10n)),
      ...chunkOrder(11n, 14n, range(11n, 14n)),
    ]);
  }, 120_000);

  it("the loop's signal asked during block 3's writes: the chunk commits at 3, its callbacks run, and the loop returns", async () => {
    const controller = new AbortController();
    const run = await runChunks(backend, {
      head: 14n,
      blocks: 7,
      controller,
      recorder: {
        async at(point, height) {
          if (point === "on-db-write" && height === 3n) controller.abort();
        },
      },
    });
    expect(run.order).toEqual(["on-finalized@14", "BEGIN", "COMMIT", ...chunkOrder(1n, 3n, range(1n, 7n))]);
    expect(await cursorOf(run.db)).toBe(3n);
  }, 120_000);

  it("a head lower than a full chunk, and distance 0 and 5: the chunks chunkEnd gives, the heights near the head alone", async () => {
    const low = await runChunks(backend, { head: 10n, blocks: 7 });
    expect(low.order).toEqual(orderOf([[1n, 7n], [8n, 10n]], 10n));
    const near = await runChunks(backend, { head: 20n, blocks: 7, distance: 5 });
    expect(near.order).toEqual(orderOf(chunksOf(7, 20n, 5n), 20n));
    expect(chunksOf(7, 20n, 5n)).toEqual([[1n, 7n], [8n, 14n], [15n, 15n], [16n, 16n], [17n, 17n], [18n, 18n], [19n, 19n], [20n, 20n]]);
  }, 120_000);

  it("a range's end and the loop's last height end a chunk; on-start-height only at a first block, on-stop-height only at a last", async () => {
    const boundaries: string[] = [];
    const s = declaration("s", {
      points: {
        async "on-start-height"(_p, started) {
          boundaries.push(`s on-start-height@${started.height}`);
        },
      },
    });
    const run = await runChunks(backend, {
      head: 20n,
      blocks: 7,
      modules: [s],
      coreStop: 12n,
      entries: (id) => (id === "r" ? entry("r", 1, 5) : entry("s", 6)),
    });
    // r stops at 5 and s starts at 6: the ranges 1..5 and 6 on; the loop's last height is 12. One transaction for each
    // chunk: 1..5 with r, 6..12 without it.
    expect(run.order).toEqual([...orderOf([[1n, 5n]], 20n), "on-stop-height@5", "BEGIN", "COMMIT"]);
    expect(boundaries).toEqual(["s on-start-height@6"]);
    expect(await cursorOf(run.db)).toBe(12n);
    expect(byPoint(run.seen).get("on-stop-height@5")).toEqual([{ point: "on-stop-height", height: 5n, readHeight: 5n }]);
  }, 120_000);

  it("a revision of the core entry ends a chunk: its last height is a chunk's last", async () => {
    /** The backbone's revisions: the core entry's, a second from 6 (its settings are what the backbone reads at h). */
    class TwoCoreRevisions extends Contexts {
      readonly #made = new Map<string, ReturnType<Contexts["of"]>>();
      override of(id: string) {
        const context = super.of(id);
        if (!isBackbonePart({ id })) return context;
        const revisions: Revision[] = [
          { start: 1n, stop: 5n, version: "core", settings: {} },
          { start: 6n, stop: null, version: "core", settings: {} },
        ];
        const made = this.#made.get(id) ?? Object.freeze({ ...context, revisions: Object.freeze(revisions) });
        this.#made.set(id, made);
        return made;
      }
    }
    const run = await runChunks(backend, { head: 14n, blocks: 7, contexts: new TwoCoreRevisions() });
    expect(run.order).toEqual(orderOf([[1n, 5n], [6n, 12n], [13n, 14n]], 14n));
  }, 120_000);

  describe("blockBeforeCommitted()", () => {
    /**
     * Module `bb`: at `on-compute` of each height `at` names it calls `blockBeforeCommitted()`, and for `call-and-read`
     * then reads the cursor's height through its own `db` item; at its other points of those heights it calls it too.
     * It records each outcome in `log`.
     */
    function asking(log: string[], at: (height: bigint) => "call" | "call-and-read" | undefined): ModuleDeclaration {
      const outside = async (label: string, b: BlockContext): Promise<void> => {
        try {
          await b.blockBeforeCommitted();
          log.push(`${label}@${b.height} resolved`);
        } catch (error) {
          log.push(`${label}@${b.height} ${(error as Error).message.includes("on-compute") ? "refused" : "other"}`);
        }
      };
      return declaration("bb", {
        points: {
          async "on-fetch"(_p, b: BlockContext) {
            if (at(b.height) !== undefined) await outside("on-fetch", b);
          },
          async "on-compute"(p: ProcessContext, b: BlockContext) {
            const how = at(b.height);
            if (how === undefined) return;
            await b.blockBeforeCommitted();
            if (how !== "call-and-read") {
              log.push(`on-compute@${b.height} resolved`);
              return;
            }
            const db = p.items.get("db") as ReadOnlyDatabase;
            const cursor = await db.read(async (other) => other.height);
            log.push(`on-compute@${b.height} resolved, cursor ${cursor}`);
          },
          async "on-db-write"(_p, b: BlockContext) {
            if (at(b.height) !== undefined) await outside("on-db-write", b);
          },
          async "on-after-db-write"(_p, b: BlockContext) {
            if (at(b.height) !== undefined) await outside("on-after-db-write", b);
          },
        },
      });
    }

    it("resolves at once with the mode off, and at a chunk's first block", async () => {
      for (const blocks of [undefined, 7]) {
        const log: string[] = [];
        const firsts = new Set([1n, 8n, 15n]);
        const run = await runChunks(backend, {
          head: 20n,
          modules: [asking(log, (h) => (firsts.has(h) ? "call" : undefined))],
          dbItem: "bb",
          ...(blocks === undefined ? {} : { blocks }),
        });
        expect(run.order, `blocks ${blocks}`).toEqual(orderOf(blocks === undefined ? chunksOf(1, 20n) : chunksOf(7, 20n), 20n));
        expect(log.filter((line) => line.startsWith("on-compute"))).toEqual(["on-compute@1 resolved", "on-compute@8 resolved", "on-compute@15 resolved"]);
      }
    }, 120_000);

    it("at a later block: the chunk commits at the block before, the callback goes on with it committed and visible, each callback once", async () => {
      const log: string[] = [];
      const run = await runChunks(backend, {
        head: 14n,
        blocks: 7,
        modules: [asking(log, (h) => (h === 4n ? "call-and-read" : undefined))],
        dbItem: "bb",
      });
      expect(log.filter((line) => line.startsWith("on-compute"))).toEqual(["on-compute@4 resolved, cursor 3"]);
      // bb's on-compute@4 runs before r's (its id comes first): the COMMIT at 3, then r's on-compute@4 with its own read
      // at 3, then the callbacks after the commit of 1..3, then 4 as the first block of the chunk 4..10.
      const first = chunkOrder(1n, 3n, range(1n, 7n));
      expect(run.order).toEqual([
        "on-finalized@14",
        ...["BEGIN", "COMMIT"],
        ...first.slice(0, first.indexOf("COMMIT")),
        "COMMIT",
        "on-compute@4",
        ...first.slice(first.indexOf("COMMIT") + 1),
        ...range(8n, 10n).flatMap((h) => [`on-fetch@${h}`, `on-parse@${h}`]),
        "BEGIN",
        ...range(4n, 10n).flatMap((h) => [...(h > 4n ? [`on-compute@${h}`] : []), `on-db-write@${h}`, `on-settle@${h}`]),
        "COMMIT",
        ...range(4n, 10n).map((h) => `on-after-db-write@${h}`),
        ...chunkOrder(11n, 14n, range(11n, 14n)),
      ]);
      const points = byPoint(run.seen);
      for (const [key, entries] of points) expect(entries, key).toHaveLength(1);
      expect(points.get("on-compute@4")?.[0]).toMatchObject({ readHeight: 3n, sees: 3n, continues: true });
      expect(await cursorOf(run.db)).toBe(14n);
    }, 120_000);

    it("a failure after the commit of the blocks below a block carried over: the halt there, and the carried block told rolled back", async () => {
      const log: string[] = [];
      const facts: string[] = [];
      const late = declaration("late", {
        points: {
          async "on-after-db-write"(_p, b: BlockContext) {
            if (b.height === 2n) throw new Error("late failed at 2");
          },
        },
      });
      const failure = await runChunks(backend, {
        head: 14n,
        blocks: 7,
        modules: [asking(log, (h) => (h === 4n ? "call-and-read" : undefined)), late],
        dbItem: "bb",
        follower: loggingFollower(facts),
      }).then(
        () => undefined,
        (error: unknown) => error,
      );
      expect(failure).toMatchObject({ height: 2n, point: "on-after-db-write", module: "late", committed: true });
      expect(facts.filter((fact) => !fact.startsWith("told written"))).toEqual([
        "told committed 1",
        "told committed 2",
        "told committed 3",
        "told rolledBack 4",
      ]);
    }, 120_000);

    it("a programming error outside on-compute, in both modes", async () => {
      for (const blocks of [undefined, 3]) {
        const log: string[] = [];
        await runChunks(backend, {
          head: 3n,
          modules: [asking(log, (h) => (h === 2n ? "call" : undefined))],
          dbItem: "bb",
          ...(blocks === undefined ? {} : { blocks }),
        });
        expect(log, `blocks ${blocks}`).toEqual(["on-fetch@2 refused", "on-compute@2 resolved", "on-db-write@2 refused", "on-after-db-write@2 refused"]);
      }
    }, 120_000);

    /**
     * Module `bb` at `on-compute` of block 4: reads the last block stored through its read handle and calls
     * `blockBeforeCommitted()`, in the order `steps` gives; after its first call it reads the cursor through its own
     * `db` item when `outside` (another reader's view, asked while the callback's handle has no read open). It records
     * each step in `log`.
     */
    function reading(log: string[], steps: readonly ("read" | "call")[], outside: boolean): ModuleDeclaration {
      return declaration("bb", {
        points: {
          async "on-compute"(p: ProcessContext, b: BlockContext, read: ReadHandle) {
            if (b.height !== 4n) return;
            const db = p.items.get("db") as ReadOnlyDatabase;
            let called = false;
            for (const step of steps) {
              if (step === "read") {
                const [row] = await read.query("SELECT max(height) AS h FROM core_block_commit.blocks");
                log.push(`read ${row?.h} at ${read.height}`);
              } else {
                await b.blockBeforeCommitted();
                log.push(outside && !called ? `resolved, cursor ${await db.read(async (other) => other.height)}` : "resolved");
                called = true;
              }
            }
          },
        },
      });
    }

    for (const steps of [
      ["read", "call", "read"],
      ["call", "read", "call", "read"],
      ["read", "call", "call", "read"],
    ] as const) {
      it(`called after a read through the callback's handle (${steps.join(", ")}): resolves in both modes; at a later block the chunk commits at the block before, and the later reads see it`, async () => {
        const firstCall = steps.indexOf("call");
        const expected = (outside: boolean): string[] =>
          steps.map((step, index) => (step === "read" ? "read 3 at 3" : outside && index === firstCall ? "resolved, cursor 3" : "resolved"));
        // The mode off: the block before is committed already, and nothing ends.
        const offLog: string[] = [];
        const off = await runChunks(backend, { head: 14n, modules: [reading(offLog, steps, false)], dbItem: "bb" });
        expect(offLog).toEqual(expected(false));
        expect(off.order).toEqual(orderOf(chunksOf(1, 14n), 14n));
        // A later block of the chunk 1..7: the commit at 3, seen by another reader once the call resolved.
        const log: string[] = [];
        const run = await runChunks(backend, { head: 14n, blocks: 7, modules: [reading(log, steps, true)], dbItem: "bb" });
        expect(log).toEqual(expected(true));
        const writes = (from: bigint, to: bigint): string[] => range(from, to).map((h) => `on-db-write@${h}`);
        expect(run.order.filter((mark) => mark === "BEGIN" || mark === "COMMIT" || mark.startsWith("on-db-write@"))).toEqual([
          ...["BEGIN", "COMMIT"],
          ...["BEGIN", ...writes(1n, 3n), "COMMIT"],
          ...["BEGIN", ...writes(4n, 10n), "COMMIT"],
          ...["BEGIN", ...writes(11n, 14n), "COMMIT"],
        ]);
        for (const [key, entries] of byPoint(run.seen)) expect(entries, key).toHaveLength(1);
        expect(await cursorOf(run.db)).toBe(14n);
      }, 120_000);
    }

    it("called after a read whose view then fails to close: the chunk still commits at the block before, the call rejects with the close's failure, and the block fails as its own", async () => {
      /** The view a callback of block 4 reads through closes, then reports a failure of its close. */
      class FailingClose extends FinalizedLoop {
        protected override async openView<T>(tx: Transaction, height: bigint | null, body: (read: ReadHandle) => Promise<T>): Promise<T> {
          const result = await super.openView(tx, height, body);
          if (height === 3n) throw new Error("the view's close failed (the test's loop)");
          return result;
        }
      }
      const log: string[] = [];
      const bb = declaration("bb", {
        points: {
          async "on-compute"(_p: ProcessContext, b: BlockContext, read: ReadHandle) {
            if (b.height !== 4n) return;
            await read.query("SELECT 1");
            try {
              await b.blockBeforeCommitted();
              log.push("resolved");
            } catch (error) {
              log.push(`rejected: ${(error as Error).message}`);
              throw error;
            }
          },
        },
      });
      const facts: string[] = [];
      const failure = await runChunks(backend, { head: 14n, blocks: 7, modules: [bb], loop: FailingClose, follower: loggingFollower(facts) }).then(
        () => undefined,
        (error: unknown) => error,
      );
      expect(log).toEqual(["rejected: the view's close failed (the test's loop)"]);
      // 1..3 committed by the chunk; 4's on-compute failed before its first write, and the loop halts there.
      expect(failure).toMatchObject({ height: 4n, point: "on-compute", module: "bb", committed: false });
      expect(facts.filter((fact) => !fact.startsWith("told written"))).toEqual(["told committed 1", "told committed 2", "told committed 3", "told rolledBack 4"]);
    }, 120_000);

    it("called twice by one callback of a later block: both calls resolve once the block before committed, the second not before the first", async () => {
      const log: string[] = [];
      const twice = declaration("bb", {
        points: {
          async "on-compute"(p: ProcessContext, b: BlockContext) {
            if (b.height !== 4n) return;
            let firstSettled = false;
            const first = b.blockBeforeCommitted();
            void first.then(() => {
              firstSettled = true;
            });
            await b.blockBeforeCommitted();
            log.push(`the second call resolved with the first ${firstSettled ? "resolved" : "pending"}`);
            await first;
            const db = p.items.get("db") as ReadOnlyDatabase;
            log.push(`cursor ${await db.read(async (other) => other.height)}`);
            // Once it resolved, a later call of the same callback resolves too: the block before is committed.
            await b.blockBeforeCommitted();
            log.push("a third call resolved");
          },
        },
      });
      const run = await runChunks(backend, { head: 14n, blocks: 7, modules: [twice], dbItem: "bb" });
      expect(log).toEqual(["the second call resolved with the first resolved", "cursor 3", "a third call resolved"]);
      // The read before the first chunk, one commit at 3, then 4 as the first block of the chunk 4..10, then 11..14.
      expect(run.order.filter((mark) => mark === "COMMIT")).toHaveLength(4);
      expect(await cursorOf(run.db)).toBe(14n);
    }, 120_000);

    it("kept and called after its callback returned: refused in both modes, from the module's later point and from another module's on-compute of the block, and no chunk ends by it", async () => {
      for (const blocks of [undefined, 7]) {
        const log: string[] = [];
        const kept = new Map<bigint, BlockContext>();
        const call = async (label: string, height: bigint): Promise<void> => {
          try {
            await (kept.get(height) as BlockContext).blockBeforeCommitted();
            log.push(`${label}@${height} resolved`);
          } catch (error) {
            log.push(`${label}@${height} ${(error as Error).message.includes("after its callback returned") ? "refused" : "other"}`);
          }
        };
        // aa's on-compute keeps its context; zz's uses it once aa's has returned, for the same block.
        const aa = declaration("aa", {
          points: {
            async "on-compute"(_p, b: BlockContext) {
              kept.set(b.height, b);
            },
            async "on-db-write"(_p, b: BlockContext) {
              if (b.height === 4n) await call("aa on-db-write", b.height);
            },
          },
        });
        const zz = declaration("zz", {
          points: {
            async "on-compute"(_p, b: BlockContext) {
              if (b.height !== 4n) return;
              // With the mode off both callbacks run at once: wait until aa's has returned.
              while (!kept.has(b.height)) await sleep(1);
              await sleep(20);
              await call("zz on-compute", b.height);
            },
          },
        });
        const run = await runChunks(backend, { head: 14n, modules: [aa, zz], ...(blocks === undefined ? {} : { blocks }) });
        expect(log, `blocks ${blocks}`).toEqual(["zz on-compute@4 refused", "aa on-db-write@4 refused"]);
        expect(run.order, `blocks ${blocks}`).toEqual(orderOf(blocks === undefined ? chunksOf(1, 14n) : chunksOf(7, 14n), 14n));
      }
    }, 120_000);
  });
});
