import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { FLIP, LAST } from "../ledger/fixtures/sweep-fixture.js";
import { countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { AHEAD, aheadTrace, restartAfterAheads, windowRaisedAt } from "./ledger-apply-ahead.js";
import { runDag } from "./refcount-process.js";

/**
 * The committed negative controls of `ledger-apply-ahead.test.ts` and `ledger-apply-ahead-failures.test.ts`, on
 * PostgreSQL 18 and PGlite 0.5.10, each with one rule of `core-ledger-state`'s blocks applied ahead broken:
 * - `aheadSentBeforeEviction` (the rule that no block above a settle point is applied before that settle's eviction is
 *   sent): FLIP + 2's apply is sent at the start of FLIP + 1's `on-settle`, before FLIP + 1's eviction of the nodes
 *   FLIP + 2 brings back, so its flush leaves them out as stored, and FLIP + 2 halts with `ledger-refcount-invalid`
 *   (`missing-reference`).
 * - `aheadChecksInput: false` (rule 1): with the retention window raised at block 30's turn, the result of 30 applied
 *   ahead, which released the state before it, is used; block 31 releases that state again, and its transaction fails
 *   on the root counts' check constraint (`database-error` in `on-db-write`).
 * - `aheadChecksThread: false` (rule 2): the package of the first thread refuses FLIP + 1's eviction, and the worker's
 *   restart waits until FLIP + 2's apply ahead, sent after that eviction, was answered by the thread that refused it
 *   (so it still counts the nodes FLIP + 1 deleted stored); that result is used in the new thread, and FLIP + 2 halts
 *   with `missing-reference`.
 * Nothing of the halted block is stored, and no run reaches the fixture's last height.
 */

describe.each(PROCESS_BACKENDS)("negative control on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("control: the apply of the next block sent before the settle's eviction leaves out the nodes the settle deleted, and the block halts with ledger-refcount-invalid (missing-reference)", async () => {
    const run = await runDag(await backend.database(), { dag: "flip", settings: AHEAD, core: { aheadSentBeforeEviction: true }, halts: true });
    expect(run.status.state).toBe("halted");
    expect(run.status.reason).toMatchObject({ code: "ledger-refcount-invalid", height: BigInt(FLIP + 2), point: "on-settle" });
    expect(run.status.cursor).toBe(BigInt(FLIP + 1));
    expect(Number(run.status.cursor)).toBeLessThan(LAST);
    const error = run.errors.at(-1) as { details?: Record<string, unknown> };
    expect(error.details).toMatchObject({ reason: "missing-reference" });
    expect(run.restarts).toBe(0);
  }, PATIENCE_MS * 4);

  it("control: used without the input check, a result whose block releases another state at its turn halts the next block's transaction on the root counts' check", async () => {
    const at = 30n;
    const window = windowRaisedAt(at);
    const trace = aheadTrace();
    startTrace(trace.sink, { steps: false });
    const run = await runDag(await backend.database(), { settings: AHEAD, core: { ...window.core, aheadChecksInput: false }, user: window.user, halts: true });
    stopTrace();
    expect(run.status.state).toBe("halted");
    expect(run.status.reason).toMatchObject({ code: "database-error", height: at + 1n, module: "core-ledger-state", point: "on-db-write" });
    expect(run.status.cursor).toBe(at);
    expect((run.errors.at(-1) as Error).message).toMatch(/root_counts_count_check/);
    // The result whose input differed was used, not dropped.
    expect(trace.used()).toContain(Number(at));
    expect(trace.dropped()).toEqual([]);
    expect(run.restarts).toBe(0);
  }, PATIENCE_MS * 4);

  it("control: used without the thread check, a result applied ahead in a thread a refused eviction ended halts its block with ledger-refcount-invalid (missing-reference)", async () => {
    const run = await runDag(await backend.database(), {
      dag: "flip",
      settings: AHEAD,
      core: { aheadChecksThread: false },
      data: { counters: countersMemory(), refuseAt: `${FLIP + 1}`, threads: 1 },
      worker: restartAfterAheads,
      halts: true,
    });
    expect(run.status.state).toBe("halted");
    expect(run.status.reason).toMatchObject({ code: "ledger-refcount-invalid", height: BigInt(FLIP + 2), point: "on-settle" });
    expect(run.status.cursor).toBe(BigInt(FLIP + 1));
    const error = run.errors.at(-1) as { details?: Record<string, unknown> };
    expect(error.details).toMatchObject({ reason: "missing-reference" });
    expect(run.restarts).toBe(1);
  }, PATIENCE_MS * 4);
});
