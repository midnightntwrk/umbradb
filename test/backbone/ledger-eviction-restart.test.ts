import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { refusalHalt, refusalHeight, runFixture, tableDifferences } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import { modelOfFixture, modelProblems } from "./sweep-tapes.js";

/**
 * `[FAULT]` A refused eviction restarts the ledger worker, on PostgreSQL 18 and PGlite 0.5.10. [A160 FAULT, LG-14, Q144 B]
 * - A test package refuses one eviction at block h, on every try, so also after the worker freed what it can. The
 *   worker thread ends and a new one starts, which loads the state at h − 1 from the database and applies h again.
 *   The process does not halt, and its stored rows and state roots equal an uninterrupted run's.
 * - A package that refuses again on that retry fails the block with `callback-error`.
 *
 * The runs use the sweep's DAG fixture through the real process (`./eviction-restart.ts`); h is its first block whose
 * sweep step deletes nodes. The committed negative controls (a halt without a restart; a retry without the state at
 * h − 1) are in `ledger-eviction-restart.negative-control.test.ts`. [A160 FAULT]
 */

describe.each(PROCESS_BACKENDS)("A160 (LG-14, Q144 B): a refused eviction restarts the ledger worker, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A160: refused at h by the first thread, a new thread loads the state at h − 1 from the database and applies h again; no halt, and the rows and roots are an uninterrupted run's", async () => {
    const h = refusalHeight();
    const uninterrupted = await runFixture(await backend.database());
    expect(uninterrupted.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(uninterrupted.counters).toMatchObject({ threads: 1, refusals: 0, storeLoads: 0 });
    expect(uninterrupted.restarts).toBe(0);
    // The uninterrupted run matches the sweep's reference model: its tables after every block are the model's. [A105]
    expect(modelProblems(uninterrupted.tables, modelOfFixture())).toEqual([]);

    const db = await backend.database();
    const restarted = await runFixture(db, { refuse: { at: h, threads: 1 } });
    // No halt: the fixture's last height reached.
    expect(restarted.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(restarted.failure).toBeNull();
    // The first thread refused both tries of h's eviction (the second after freeing every kept parse); the host ended
    // it and started one more, which loaded the state at h − 1 from the database (the node store) and evicted.
    expect(restarted.restarts).toBe(1);
    expect(restarted.counters).toMatchObject({ threads: 2, refusals: 2, storeLoads: 1, storeLoadHeight: Number(h - 1n) });
    expect(restarted.counters.evictions).toBe(uninterrupted.counters.evictions);
    // Its stored rows and state roots are the uninterrupted run's: the sweep's tables and the nodes after every block,
    // and every `states` row (key and root).
    expect(tableDifferences(restarted.tables, uninterrupted.tables)).toEqual([]);
    expect(restarted.states).toEqual(uninterrupted.states);
    expect(restarted.states).toHaveLength(LAST + 1);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("A160: a package that refuses again on the retry fails block h with callback-error in core-ledger-state's on-compute; nothing of h is stored", async () => {
    const h = refusalHeight();
    const db = await backend.database();
    const run = await runFixture(db, { refuse: { at: h, threads: 2 }, halts: true });
    expect(run.status).toMatchObject(refusalHalt(h));
    expect(run.lines.some((line) => /processing halted \(callback-error\).*refuses to forget/.test(line))).toBe(true);
    // One restart: the second thread loaded the state at h − 1 and refused both its tries too; no third thread.
    expect(run.restarts).toBe(1);
    expect(run.counters).toMatchObject({ threads: 2, refusals: 4, storeLoads: 1, storeLoadHeight: Number(h - 1n) });
    expect(run.states).toHaveLength(Number(h));
    expect(run.states.at(-1)?.startsWith(`${h - 1n} `)).toBe(true);
  }, PATIENCE_MS * 4);
});
