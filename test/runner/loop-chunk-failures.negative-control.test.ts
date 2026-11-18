import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightFailure } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { CHECKED_BACKBONE, marking } from "./loop-chunk-harness.js";
import { cursorOf, InMemoryBlockSource, RUNNER_BACKENDS, startWith } from "./loop-harness.js";

/**
 * The negative controls of `loop-chunk-failures.test.ts`, on PostgreSQL 18 and PGlite 0.5.10, each turning one part of
 * the failure rule off through a protected seam of the loop:
 * - a failed chunk formed again as a chunk (the highest height of a chunk that did not commit ignored): with block 8
 *   failing retryably in its writes every time, the cursor never reaches 7 within twice the chunk's length of
 *   transactions, where the real loop reaches it within 5;
 * - the failing block called again alone (its failure not kept): a callback that fails once passes, and the sync goes
 *   on to the head, where the real loop halts at 8.
 */

/** No chunk is kept from forming again over a chunk that did not commit. */
class FormsAgain extends FinalizedLoop {
  protected override aloneUpTo(): bigint | null {
    return null;
  }
}

/** The block whose writes failed is stored again alone, its failure not kept. */
class CallsAgain extends FinalizedLoop {
  protected override keptFailure(): HeightFailure | undefined {
    return undefined;
  }
}

/** Module `f`: at `on-db-write` of 8, after its write, fails (`always`: every time, retryably; else once, not). */
function failing(always: boolean): ModuleDeclaration {
  let failed = false;
  return declaration("f", {
    points: {
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        await w.execute("INSERT INTO f.rows (height) VALUES ($1)", [b.height]);
        if (b.height !== 8n || (!always && failed)) return;
        failed = true;
        if (always) throw new UmbraError("connection-lost", "the connection was lost (the test's module)");
        throw new Error("f failed once at 8");
      },
    },
  });
}

describe.each(RUNNER_BACKENDS)("the negative controls of the failure rule on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /**
   * Runs `f` over heights 1 to 10 in chunks of 5 with a loop of `Loop`, again after each retryable failure, at most
   * `runs` runs; the cursor after each run, the transactions asked for, and the last failure.
   */
  async function run(Loop: typeof FinalizedLoop, f: ModuleDeclaration, runs: number) {
    const { db } = await backend.database();
    const started = await startWith(db, [f], [entry("f", 1)], { backbone: CHECKED_BACKBONE });
    const source = new InMemoryBlockSource({ head: 10n });
    const controller = new AbortController();
    const order: string[] = [];
    const loop = new Loop({
      db: marking(db, order),
      graph: started.graph,
      plan: started.plan,
      source,
      contextOf: (id) => started.contexts.of(id),
      signal: controller.signal,
      fastSync: { blocks: 5, distance: 0 },
    });
    /** The cursor after each transaction asked for, in order. */
    const cursors: (bigint | null)[] = [];
    let failure: unknown;
    for (let attempt = 0; attempt < runs; attempt++) {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(10n).then(() => "waiting" as const), running])) === "waiting") {
        controller.abort();
        await running;
        failure = undefined;
        break;
      }
      failure = await running;
      cursors.push(await cursorOf(db));
    }
    return { cursor: await cursorOf(db), transactions: order.filter((mark) => mark === "BEGIN").length, cursors, failure };
  }

  it("a failed chunk formed again as a chunk: with 8 failing retryably every time, the cursor never reaches 7", async () => {
    const real = await run(FinalizedLoop, failing(true), 4);
    // Run 1: chunk 1..5, then 6..10 fails at 8 and is held; run 2: 6 and 7 stored again, 8 fails alone.
    expect(real.cursor).toBe(7n);
    expect(real.cursors[1]).toBe(7n);
    const control = await run(FormsAgain, failing(true), 4);
    expect(control.cursor).toBe(5n);
    // Two chunk lengths of transactions and more were asked for, none passing 5.
    expect(control.transactions).toBeGreaterThanOrEqual(5);
    expect(control.cursors).toEqual([5n, 5n, 5n, 5n]);
  }, 120_000);

  it("the failing block called again alone: a callback that fails once passes, and the sync goes on where the loop halts", async () => {
    // One run each: a failure that is not retryable halts the process.
    const real = await run(FinalizedLoop, failing(false), 1);
    expect(real.cursor).toBe(7n);
    expect((real.failure as HeightFailure).height).toBe(8n);
    const control = await run(CallsAgain, failing(false), 1);
    expect(control.failure).toBeUndefined();
    expect(control.cursor).toBe(10n);
  }, 120_000);
});
