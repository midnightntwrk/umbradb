import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AGAIN, extendedCases, LAST, REVERT, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag, runProblems } from "./refcount-process.js";
import { sweepComparisonOf, WHOLE_CYCLE } from "./sweep-tapes.js";

/**
 * The counting run against the sweep's reference model on the DAG fixture, through the real process on PostgreSQL 18
 * and PGlite 0.5.10.
 *
 * The input is the DAG fixture without its rewrite cases (`test/ledger/fixtures/sweep-fixture.ts`, `"one-form"`): wide
 * trees, a new root every block, content reused after a deletion (subtree 0 at REVERT), children shared between
 * versions, a child repeated in one child list, embedded children holding references, and a stored node written again
 * unchanged (`again` at AGAIN), every key written with one child list throughout. The counting run's batches are fed,
 * after every block, to the sweep's reference model (`./sweep-model.ts`), whose node set is compared with the counting
 * run's rows' (`./sweep-tapes.ts` `SweepComparison`):
 * - with a budget that fits each cycle in one block (every cycle checked to end in its block), the two node sets are
 *   equal at every height;
 * - with a budget of 50, which no state's marking fits, the counted node set is a subset of the swept one at every
 *   height, and the sweep holds more at some.
 * The run is also held to the check after every block.
 *
 * The recorded tapes' half is in `ledger-refcount-sweep-tape-*.test.ts`; the committed negative control (the cascade
 * stopped after its first round) in `ledger-refcount-sweep.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe.each(PROCESS_BACKENDS)("on $name: the counting run's batches fed to the sweep's reference model, on the DAG fixture without its rewrite cases", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("the node sets are equal at every height with a budget that fits each cycle in one block, and the counted one is a subset of the swept one at every height with a budget of 50", async () => {
    const run = await runDag(await backend.database(), { dag: "one-form" });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(run.errors).toEqual([]);

    const whole = sweepComparisonOf(run.batches, run.tables, LAST, WHOLE_CYCLE, "equal");
    expect(whole.problems).toEqual([]);
    expect([whole.seen.heights, whole.seen.first, whole.seen.last]).toEqual([LAST + 1, 0n, BigInt(LAST)]);
    const fifty = sweepComparisonOf(run.batches, run.tables, LAST, 50, "subset");
    expect(fifty.problems).toEqual([]);
    expect([fifty.seen.heights, fifty.seen.first, fifty.seen.last]).toEqual([LAST + 1, 0n, BigInt(LAST)]);
    expect(runProblems(run, "one-form")).toEqual([]);

    // Not vacuous: rows deleted in every block from 2 on, subtree 0's first version and `again` written again; with 50,
    // cycles spanning blocks and the sweep holding more at some heights.
    for (let h = 2n; h <= BigInt(LAST); h++) expect(run.evicted.get(h)?.length ?? 0, `${h}`).toBeGreaterThan(0);
    const written = (h: number): string[] => (run.batches.get(BigInt(h))?.inserts ?? []).map((node) => hex(node.key));
    expect(written(REVERT)).toEqual(expect.arrayContaining(stateNodes(0).slice(1, 2).map((node) => hex(node.key))));
    expect(written(AGAIN)).toContain(hex(extendedCases(AGAIN).again.node.key));
    expect(whole.seen.writtenAgain).toBeGreaterThan(5);
    expect(whole.seen.sweptDeleted).toBeGreaterThan(1_000);
    expect(fifty.seen.cycleUnfinished).toBeGreaterThan(10);
    expect(fifty.seen.strictSubset).toBeGreaterThan(10);
  }, PATIENCE_MS * 4);
});
