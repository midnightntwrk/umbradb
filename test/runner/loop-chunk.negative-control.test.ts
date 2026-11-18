import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { CHECKED_BACKBONE, marking } from "./loop-chunk-harness.js";
import { heightsIn, InMemoryBlockSource, RUNNER_BACKENDS, startWith } from "./loop-harness.js";
import { entry } from "../modules/graph-fixtures.js";

/**
 * The negative controls of `loop-chunk.test.ts`, on PostgreSQL 18 and PGlite 0.5.10, each turning one rule of a chunk
 * off through a protected seam of the loop and failing the check the real loop passes:
 * - a later block's `on-compute` given the transaction itself, not a read-only view of it: a write through its read
 *   is stored;
 * - `continues` true after a rollback (whenever the height has a block before it, as
 *   `block-continues.negative-control.test.ts`'s): a module that keeps the block before and trusts `continues` finds
 *   its kept value differs from the database's.
 */

/** The transaction itself as a later block's read. */
class NoView extends FinalizedLoop {
  protected override openView<T>(tx: Transaction, height: bigint | null, body: (read: ReadHandle) => Promise<T>): Promise<T> {
    return body({ height, query: (sql, params) => tx.query(sql, params) });
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
});
