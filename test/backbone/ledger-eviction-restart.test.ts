import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { refusalHalt, refusalHeight, runFixture, tableDifferences } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { modelOfFixture, modelProblems } from "./ledger-graph-tapes.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import { fixtureProblems } from "./refcount-checks.js";

/**
 * `[FAULT]` A refused eviction restarts the ledger worker, on PostgreSQL 18 and PGlite 0.5.10.
 * - A test package refuses one eviction at block h, on every try, so also after the worker freed what it can. The
 *   eviction is sent once, in h's `on-settle`: the worker thread ends and a new one starts, and h commits as computed,
 *   without being applied again. The new thread holds no state, so h + 1 loads the state after h from the database.
 *   The process does not halt, and its stored rows of the tables that are not content-defined, its node set, the
 *   checks and its state roots equal an uninterrupted run's.
 * - A package that refuses in every thread changes nothing of that: the eviction is not sent again, and the new
 *   thread never applies h.
 *
 * The runs use the DAG fixture through the real process (`./eviction-restart.ts`); h is its first block whose
 * reclamation deletes nodes. The committed negative controls (a halt without a restart; the next block without the
 * state after h) are in `ledger-eviction-restart.negative-control.test.ts`.
 */

describe.each(PROCESS_BACKENDS)("a refused eviction restarts the ledger worker, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("refused at h by the first thread, a new thread starts, h commits as computed and h + 1 loads the state after h from the database; no halt, and the rows of the tables that are not content-defined, the node set, the checks and the roots are an uninterrupted run's", async () => {
    const h = refusalHeight();
    const uninterrupted = await runFixture(await backend.database());
    expect(uninterrupted.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(uninterrupted.counters).toMatchObject({ threads: 1, refusals: 0, storeLoads: 0 });
    expect(uninterrupted.restarts).toBe(0);
    // The uninterrupted run matches the model: its tables after every block are the model's, and the check passes.
    expect(modelProblems(uninterrupted.tables, modelOfFixture())).toEqual([]);
    expect(fixtureProblems("original", uninterrupted.tables, uninterrupted.batches, LAST)).toEqual([]);

    const db = await backend.database();
    const restarted = await runFixture(db, { refuse: { at: h, threads: 1 } });
    // No halt: the fixture's last height reached.
    expect(restarted.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(restarted.failure).toBeNull();
    // The first thread refused both tries of h's eviction (the second after freeing every kept parse); the host ended
    // it and started one more, which loaded the state after h from the database (the node store) for h + 1.
    expect(restarted.restarts).toBe(1);
    expect(restarted.counters).toMatchObject({ threads: 2, refusals: 2, storeLoads: 1, storeLoadHeight: Number(h) });
    // h's eviction was taken by no thread; every other one as in the uninterrupted run.
    expect(restarted.counters.evictions).toBe(uninterrupted.counters.evictions - 1);
    const deleted = modelOfFixture()[Number(h)]?.deleted ?? [];
    expect(deleted.length).toBeGreaterThan(0);
    expect(uninterrupted.evicted.get(h)).toEqual(deleted);
    expect(restarted.evicted.get(h)).toBeUndefined();
    // Its rows of the tables that are not content-defined and its node set are the uninterrupted run's after every
    // block, the check passes after every block, and every `states` row (key and root) is the uninterrupted run's.
    expect(tableDifferences(restarted.tables, uninterrupted.tables)).toEqual([]);
    expect(fixtureProblems("original", restarted.tables, restarted.batches, LAST)).toEqual([]);
    expect(restarted.states).toEqual(uninterrupted.states);
    expect(restarted.states).toHaveLength(LAST + 1);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("a package that refuses in every thread: still one restart and no halt, since the eviction is not sent again and the new thread never applies h", async () => {
    const h = refusalHeight();
    const db = await backend.database();
    const run = await runFixture(db, { refuse: { at: h, threads: 2 } });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(run.lines.some((line) => /processing halted/.test(line))).toBe(false);
    expect(run.restarts).toBe(1);
    expect(run.counters).toMatchObject({ threads: 2, refusals: 2, storeLoads: 1, storeLoadHeight: Number(h) });
    expect(run.states).toHaveLength(LAST + 1);
    expect(fixtureProblems("original", run.tables, run.batches, LAST)).toEqual([]);
  }, PATIENCE_MS * 4);
});
