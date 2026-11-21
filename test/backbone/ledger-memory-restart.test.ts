import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { runFixture, tableDifferences } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import { fixtureProblems } from "./refcount-checks.js";

/**
 * `[FAULT]` The ledger worker is restarted on its memory limit, on PostgreSQL 18 and PGlite 0.5.10
 * (`core-ledger-state`'s `restartOverMemoryLimit`).
 * - Every answer of the worker reports its thread's memory, so with a limit of 1 byte every settle finds the worker
 *   over it. The span holds the restarts back: one at the first settle, at block 0, then one at the first settle at
 *   least the span above the last. Each happens after the run's eviction, before its `COMMIT`, as after a refused
 *   eviction: the block commits as computed, and the next block loads the state after it from the database. The
 *   process does not halt, and its stored rows of the tables that are not content-defined, its node set, the checks
 *   and its state roots equal an uninterrupted run's. Each restart is logged.
 * - At the hard limit the span holds nothing back: a restart after every block, and still the uninterrupted run's rows.
 * - A limit of 0 never restarts, at the hard limit too.
 *
 * The runs use the DAG fixture through the real process (`./eviction-restart.ts`).
 */

const SPAN = 25n;
/** The heights after which a run restarts, with the span {@link SPAN}: 0, 25, 50, 75 and 100. */
const RESTARTS = Array.from({ length: Number(BigInt(LAST) / SPAN) + 1 }, (_, i) => BigInt(i) * SPAN);
const logged = (lines: readonly string[]): string[] => lines.filter((line) => /ledger worker restarted after block/.test(line));

describe.each(PROCESS_BACKENDS)("the ledger worker restarts on its memory limit, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("over the limit at every settle: a restart at block 0 and then once per span, each logged; no halt, and the rows of the tables that are not content-defined, the node set, the checks and the roots are an uninterrupted run's", async () => {
    const uninterrupted = await runFixture(await backend.database(), { core: { memoryLimitBytes: 0 } });
    expect(uninterrupted.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(uninterrupted.restarts).toBe(0);
    expect(uninterrupted.counters).toMatchObject({ threads: 1, storeLoads: 0 });

    const db = await backend.database();
    const run = await runFixture(db, { core: { memoryLimitBytes: 1, memoryRestartSpan: SPAN } });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(run.failure).toBeNull();
    expect(run.restarts).toBe(RESTARTS.length);
    // A new thread per restart. Each but the last one (started after the fixture's last block, which loads no package)
    // loaded the package and the state after its restart's block from the node store, the last of them after 75.
    expect(run.counters).toMatchObject({ threads: RESTARTS.length, storeLoads: RESTARTS.length - 1, storeLoadHeight: 75, refusals: 0 });
    const lines = logged(run.lines);
    expect(lines.map((line) => /after block (\d+):/.exec(line)?.[1])).toEqual(RESTARTS.map(String));
    expect(lines[1]).toMatch(/at or over its limit of 0 MiB; the new thread loads the state after 25 from the database/);
    expect(tableDifferences(run.tables, uninterrupted.tables)).toEqual([]);
    expect(fixtureProblems("original", run.tables, run.batches, LAST)).toEqual([]);
    expect(run.states).toEqual(uninterrupted.states);
    expect(run.states).toHaveLength(LAST + 1);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("at the hard limit, a restart after every block whatever the span; with the limit at 0, none at the hard limit either", async () => {
    const uninterrupted = await runFixture(await backend.database(), { core: { memoryLimitBytes: 0, memoryHardLimitBytes: 1 } });
    expect(uninterrupted.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(uninterrupted.restarts).toBe(0);
    expect(logged(uninterrupted.lines)).toEqual([]);

    const db = await backend.database();
    const run = await runFixture(db, { core: { memoryLimitBytes: 1, memoryHardLimitBytes: 1 } });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(run.restarts).toBe(LAST + 1);
    // The thread started after the last block loads no package.
    expect(run.counters).toMatchObject({ threads: LAST + 1, storeLoads: LAST, storeLoadHeight: LAST - 1 });
    expect(tableDifferences(run.tables, uninterrupted.tables)).toEqual([]);
    expect(fixtureProblems("original", run.tables, run.batches, LAST)).toEqual([]);
    expect(run.states).toEqual(uninterrupted.states);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 6);
});
