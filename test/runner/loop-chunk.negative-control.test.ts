import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { startTrace, stopTrace, traceEndBlock } from "../../src/trace/trace.js";
import { declaration } from "../modules/declarations.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { CHECKED_BACKBONE, marking, runChunks } from "./loop-chunk-harness.js";
import { cursorOf } from "./loop-harness.js";
import { heightsIn, InMemoryBlockSource, RUNNER_BACKENDS, startWith } from "./loop-harness.js";
import { entry } from "../modules/graph-fixtures.js";

/**
 * The negative controls of `loop-chunk.test.ts`, on PostgreSQL 18 and PGlite 0.5.10, each turning one rule of a chunk
 * off through a protected seam of the loop and failing the check the real loop passes:
 * - a later block's `on-compute` given the transaction itself, not a read-only view of it: a write through its read
 *   is stored;
 * - `continues` true after a rollback (whenever the height has a block before it, as
 *   `block-continues.negative-control.test.ts`'s): a module that keeps the block before and trusts `continues` finds
 *   its kept value differs from the database's;
 * - a pause hold not read inside a chunk: a hold asked during block 3's writes is reached only at the chunk's planned
 *   end, 7, not at 3;
 * - a block's trace line written when its writes end, not held for the `COMMIT`: a chunk that rolls back leaves lines,
 *   and the blocks stored again have a second line each.
 */

/** The transaction itself as a later block's read. */
class NoView extends FinalizedLoop {
  protected override openView<T>(tx: Transaction, height: bigint | null, body: (read: ReadHandle) => Promise<T>): Promise<T> {
    return body({ height, query: (sql, params) => tx.query(sql, params) });
  }
}

/** A block's trace line written when its writes end. */
class WritesLinesEarly extends FinalizedLoop {
  protected override holdTrace(run: HeightRun): void {
    traceEndBlock(run.height);
  }
}

/** A pause hold not read inside a chunk. */
class IgnoresHold extends FinalizedLoop {
  protected override pauseHeld(): boolean {
    return false;
  }
}

/** `continues` true whenever the height has a block before it. */
class KeepsContinuing extends FinalizedLoop {
  protected override continues(run: HeightRun): boolean {
    return run.previous !== null;
  }
}

/**
 * Module `trust`: it writes its height at `on-db-write` and keeps it, and at `on-compute`, when told the block before
 * continues, compares what it kept with the database's highest row (a difference fails the block); `on-db-write` of
 * `failAt` fails once with a lost connection, after its write.
 */
function trusting(failAt: bigint): ModuleDeclaration {
  let kept: bigint | null = null;
  let failed = false;
  return declaration("trust", {
    points: {
      async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
        if (!b.continues) return;
        const [row] = await read.query("SELECT max(height) AS h FROM trust.rows");
        const stored = (row?.h as bigint | null | undefined) ?? null;
        if (stored !== kept) throw new Error(`the kept value differs at height ${b.height}: kept ${kept}, stored ${stored}`);
      },
      async "on-db-write"(_p, b: BlockContext, w) {
        await w.execute("INSERT INTO trust.rows (height) VALUES ($1)", [b.height]);
        kept = b.height;
        if (b.height === failAt && !failed) {
          failed = true;
          throw new UmbraError("connection-lost", "the connection was lost (the test's module)");
        }
      },
    },
  });
}

/** Module `once`: at `on-db-write` of `at`, after its write, fails once (not retryable). */
function failingOnce(at: bigint): ModuleDeclaration {
  let failed = false;
  return declaration("once", {
    points: {
      async "on-db-write"(_p, b: BlockContext, w) {
        await w.execute("INSERT INTO once.rows (height) VALUES ($1)", [b.height]);
        if (b.height !== at || failed) return;
        failed = true;
        throw new Error(`once failed at ${b.height}`);
      },
    },
  });
}

describe.each(RUNNER_BACKENDS)("the negative controls of chunks on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs `modules` over heights 1 to `head` in chunks of `blocks` with a loop of `Loop`, again after each failure; the failures. */
  async function run(
    Loop: typeof FinalizedLoop,
    modules: readonly ModuleDeclaration[],
    head: bigint,
    blocks: number,
  ): Promise<{ readonly failures: unknown[]; readonly db: Awaited<ReturnType<typeof backend.database>>["db"] }> {
    const { db } = await backend.database();
    const started = await startWith(db, modules, modules.map((part) => entry(part.id, 1)), { backbone: CHECKED_BACKBONE });
    const source = new InMemoryBlockSource({ head });
    const controller = new AbortController();
    const loop = new Loop({
      db: marking(db, []),
      graph: started.graph,
      plan: started.plan,
      source,
      contextOf: (id) => started.contexts.of(id),
      signal: controller.signal,
      fastSync: { blocks, distance: 0 },
    });
    const failures: unknown[] = [];
    for (let runs = 0; runs < 3; runs++) {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(head).then(() => "waiting" as const), running])) === "waiting") {
        controller.abort();
        await running;
        return { failures, db };
      }
      failures.push(await running);
    }
    return { failures, db };
  }

  /** Module `w`: at a later block's `on-compute` it writes through its read, an error caught. */
  const writer = (): ModuleDeclaration =>
    declaration("w", {
      points: {
        async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
          await read.query("INSERT INTO w.rows (height) VALUES ($1)", [b.height]).catch(() => undefined);
        },
      },
    });

  it("a later block's on-compute given the transaction itself: the write through its read is stored", async () => {
    const real = await run(FinalizedLoop, [writer()], 6n, 3);
    expect(real.failures).toEqual([]);
    expect(await heightsIn(real.db, "w.rows")).toEqual([]);
    const control = await run(NoView, [writer()], 6n, 3);
    expect(control.failures).toEqual([]);
    // The chunks 1..3 and 4..6: the blocks after each chunk's first wrote through their reads.
    expect(await heightsIn(control.db, "w.rows")).toEqual([2n, 3n, 5n, 6n]);
  }, 120_000);

  it("continues true after a rollback: a module that keeps the block before finds its kept value differs", async () => {
    // Chunks 1..5 and 6..10; 9's writes fail once with a lost connection, so 6..9 roll back and the loop runs again.
    const real = await run(FinalizedLoop, [trusting(9n)], 10n, 5);
    expect(real.failures.map((failure) => (failure as Error).message)).toEqual([expect.stringMatching(/height 9 .*connection was lost/)]);
    expect(await heightsIn(real.db, "trust.rows")).toEqual([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n]);
    const control = await run(KeepsContinuing, [trusting(9n)], 10n, 5);
    expect((control.failures[1] as Error).message).toMatch(/the kept value differs at height 6: kept 9, stored 5/);
  }, 120_000);

  it("a pause hold not read inside a chunk: a hold asked during block 3's writes is reached at 7, the planned end, not at 3", async () => {
    /** The cursor when a hold asked at block 3's on-db-write is reached, with a loop of `Loop`. */
    const reachedAt = async (Loop: typeof FinalizedLoop): Promise<bigint | null> => {
      const pauses = new LoopPauses();
      let hold: PauseHold | undefined;
      let cursor: Promise<bigint | null> | undefined;
      let db: Parameters<typeof cursorOf>[0] | undefined;
      const run = await runChunks(backend, {
        head: 14n,
        blocks: 7,
        pause: pauses,
        loop: Loop,
        recorder: {
          async at(point, height, handle) {
            if (point !== "on-db-write" || height !== 3n || hold !== undefined) return;
            void handle;
            hold = pauses.hold();
            void hold.reached.then(() => {
              cursor = db === undefined ? Promise.resolve(null) : cursorOf(db);
              hold?.release();
            });
          },
        },
        onDatabase: (given) => {
          db = given;
        },
      });
      void run;
      return (await cursor) ?? null;
    };
    expect(await reachedAt(FinalizedLoop)).toBe(3n);
    expect(await reachedAt(IgnoresHold)).toBe(7n);
  }, 120_000);

  it("a trace line written when a block's writes end: a chunk that rolls back leaves lines", async () => {
    /** The heights of the trace's lines of a run whose block 8 fails in its writes, chunks of 5 to 10, with `Loop`. */
    const lines = async (Loop: typeof FinalizedLoop): Promise<number[]> => {
      const texts: string[] = [];
      startTrace({ blocks: (text) => void texts.push(text), statements: () => undefined, worker: () => undefined });
      try {
        await run(Loop, [failingOnce(8n)], 10n, 5);
      } finally {
        stopTrace();
      }
      return texts.flatMap((text) => text.trimEnd().split("\n")).map((line) => (JSON.parse(line) as { h: number }).h);
    };
    // 8 fails once: the loop runs again after it (this file's runs), and 8 passes alone.
    expect(await lines(FinalizedLoop)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // Each block's line at its writes' end, and an empty one after its commit; the rolled-back chunk's 6 and 7 have
    // lines before those of 6 and 7 stored again.
    expect(await lines(WritesLinesEarly)).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 6, 7, 8, 9, 10, 9, 10]);
  }, 120_000);
});
