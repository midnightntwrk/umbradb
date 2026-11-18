import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, ReadHandle, ReadOnlyDatabase } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
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
 *   callback runs once, in decision order; a programming error after a statement, or outside `on-compute`.
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
    expect(pausedOrder).toEqual(["on-finalized@14", ...chunkOrder(1n, 3n, range(1n, 7n))]);
    expect(await pausedCursor).toBe(3n);
    // After the pause: 4 to 7, taken before it, are not fetched or parsed again.
    expect(order).toEqual([
      "on-finalized@14",
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
    expect(run.order).toEqual(["on-finalized@14", ...chunkOrder(1n, 3n, range(1n, 7n))]);
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

  describe("blockBeforeCommitted()", () => {
    /**
     * Module `bb`: at `on-compute` of each height `at` names it calls `blockBeforeCommitted()` (after a statement through
     * its read for `after-statement`), and for `call-and-read` then reads the cursor's height through its own `db` item;
     * at its other points of those heights it calls it too. It records each outcome in `log`.
     */
    function asking(log: string[], at: (height: bigint) => "call" | "call-and-read" | "after-statement" | undefined): ModuleDeclaration {
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
          async "on-compute"(p: ProcessContext, b: BlockContext, read: ReadHandle) {
            const how = at(b.height);
            if (how === undefined) return;
            if (how === "after-statement") await read.query("SELECT 1");
            try {
              await b.blockBeforeCommitted();
            } catch (error) {
              log.push(`on-compute@${b.height} ${(error as Error).message.includes("statement") ? "refused" : "other"}`);
              return;
            }
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

    it("a programming error after a statement through the callback's read, and outside on-compute, in both modes", async () => {
      for (const blocks of [undefined, 3]) {
        const log: string[] = [];
        await runChunks(backend, {
          head: 3n,
          modules: [asking(log, (h) => (h === 2n ? "after-statement" : undefined))],
          dbItem: "bb",
          ...(blocks === undefined ? {} : { blocks }),
        });
        expect(log, `blocks ${blocks}`).toEqual([
          "on-fetch@2 refused",
          "on-compute@2 refused",
          "on-db-write@2 refused",
          "on-after-db-write@2 refused",
        ]);
      }
    }, 120_000);
  });
});
