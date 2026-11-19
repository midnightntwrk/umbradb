import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockContext } from "../../src/modules/declaration.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { count, type Fault, runCase, tablesCompared, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * A block whose preparation failed while it was taken for a chunk (`src/runner/loop.ts`, fast-sync mode), on
 * PostgreSQL 18 and PGlite 0.5.10: heights 1 to 10 in chunks of 5 (1..5, 6..10), block 8's `on-parse` failing once
 * while 6 to 10 are taken, so the chunk is 6..7 and the failure is kept for 8. Whatever happens to 6 and 7 before the
 * loop reaches 8, the kept failure is 8's: the loop halts at 8 with the cursor at 7, as with the mode off, and 8's
 * `on-parse` is not called a second time:
 * - block 7's writes fail once with a lost connection, and the loop runs again;
 * - a pause asked during block 6 ends the chunk at 6, and the next chunk starts at 7;
 * - block 7's `on-compute` asks that the block before be committed, so 7 is carried over to the next transaction.
 * A kept failure that is retryable is retried once the loop reached its height. It is dropped, and the observer told,
 * only when a block below it stops processing.
 */

const HEAD = 10n;
const PARSE_8: Fault = { at: "on-parse", height: 8n, retryable: false };

describe.each(RUNNER_BACKENDS)("a failure kept for a block taken for a chunk, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("survives a retry of a block below it: block 7's writes fail once, retryably, and the loop still halts at 8", async () => {
    const faults: Fault[] = [PARSE_8, { at: "on-db-write", height: 7n, retryable: true }];
    const off = await runCase(backend, { head: HEAD, faults });
    const on = await runCase(backend, { head: HEAD, faults, blocks: 5 });
    const expected = [
      { height: 7n, point: "on-db-write", module: "f", committed: false },
      { height: 8n, point: "on-parse", module: "f", committed: false },
    ];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(7n);
    expect(on.cursor).toBe(7n);
    expect(count(off.calls, "on-parse@8")).toBe(1);
    expect(count(on.calls, "on-parse@8")).toBe(1);
    expect(on.dropped).toEqual([]);
    const tables = tablesCompared(on, off);
    expect(tables.differing).toEqual([]);
    expect(tables.compared).toBeGreaterThan(0);
  }, 120_000);

  it("ends the chunk planned after a pause: a pause during block 6 commits at 6, the next chunk is 7 alone, and the loop halts at 8", async () => {
    const paused = async (blocks: number | undefined) => {
      const pauses = new LoopPauses();
      let hold: PauseHold | undefined;
      return runCase(backend, {
        head: HEAD,
        faults: [PARSE_8],
        pause: pauses,
        ...(blocks === undefined ? {} : { blocks }),
        async at(point, height) {
          if (point !== "on-db-write" || height !== 6n || hold !== undefined) return;
          hold = pauses.hold();
          void hold.reached.then(() => hold?.release());
        },
      });
    };
    const off = await paused(undefined);
    const on = await paused(5);
    const expected = [{ height: 8n, point: "on-parse", module: "f", committed: false }];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(7n);
    expect(on.cursor).toBe(7n);
    expect(count(on.calls, "on-parse@8")).toBe(1);
    // 6 committed alone at the pause, then 7 alone: 8, whose failure is kept, ends every chunk planned below it.
    expect(on.facts).toEqual([...[1n, 2n, 3n, 4n, 5n, 6n, 7n].map((h) => `told committed ${h}`), "told rolledBack 8"]);
    expect(on.facts).toEqual(off.facts);
    // The read before the first chunk, 1..5, 6, 7.
    expect(on.order.filter((mark) => mark === "COMMIT")).toHaveLength(4);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("ends the chunk of a block carried over: block 7's on-compute asks for 6 committed, 7 is stored alone, and the loop halts at 8", async () => {
    const asking = declaration("bb", {
      points: {
        async "on-compute"(_p, b: BlockContext) {
          if (b.height === 7n) await b.blockBeforeCommitted();
        },
      },
    });
    const off = await runCase(backend, { head: HEAD, faults: [PARSE_8], modules: [asking] });
    const on = await runCase(backend, { head: HEAD, faults: [PARSE_8], modules: [asking], blocks: 5 });
    const expected = [{ height: 8n, point: "on-parse", module: "f", committed: false }];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(7n);
    expect(on.cursor).toBe(7n);
    expect(count(on.calls, "on-parse@8")).toBe(1);
    expect(count(on.calls, "on-compute@7")).toBe(1);
    expect(on.facts).toEqual([...[1n, 2n, 3n, 4n, 5n, 6n, 7n].map((h) => `told committed ${h}`), "told rolledBack 8"]);
    expect(on.facts).toEqual(off.facts);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("is retried once the loop reached its height when it is retryable, also after a retry of a block below it", async () => {
    const faults: Fault[] = [
      { at: "on-parse", height: 8n, retryable: true },
      { at: "on-db-write", height: 7n, retryable: true },
    ];
    const off = await runCase(backend, { head: HEAD, faults });
    const on = await runCase(backend, { head: HEAD, faults, blocks: 5 });
    const expected = [
      { height: 7n, point: "on-db-write", module: "f", committed: false },
      { height: 8n, point: "on-parse", module: "f", committed: false },
    ];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(HEAD);
    expect(on.cursor).toBe(HEAD);
    // Called once, its failure kept until the loop reached 8, then once more by the retry: as often as with the mode off.
    expect(count(on.calls, "on-parse@8")).toBe(count(off.calls, "on-parse@8"));
    expect(count(on.calls, "on-parse@8")).toBe(2);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("is dropped, and the observer told, when a block below it stops processing: block 7's writes fail and the loop halts at 7", async () => {
    const faults: Fault[] = [PARSE_8, { at: "on-db-write", height: 7n, retryable: false }];
    const off = await runCase(backend, { head: HEAD, faults });
    const on = await runCase(backend, { head: HEAD, faults, blocks: 5 });
    const expected = [{ height: 7n, point: "on-db-write", module: "f", committed: false }];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(6n);
    expect(on.cursor).toBe(6n);
    expect(off.dropped).toEqual([]);
    expect(on.dropped).toEqual([8n]);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);
});
