import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { refusalHalt } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { HELD, LIVE_AT, runLiveObject } from "./refcount-live-object.js";
import type { TableSnapshot } from "./sweep-tapes.js";

/**
 * The committed negative control of a live object holding a deleted row, on PostgreSQL 18 and PGlite 0.5.10: the run of
 * `ledger-refcount-live-object.test.ts` with the worker restart disabled (`restartOnRefusedEviction: false`). The
 * package's refusal to forget x fails block h with `callback-error` in `core-ledger-state`'s `on-compute`, and nothing
 * of h is stored: the database is at h − 1, every table of `core_ledger_state` as a run that commits h (its package
 * writing the same batches) held it after h − 1, and x still a row. [R30, LG-14, Q144 B]
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe.each(PROCESS_BACKENDS)("R30's negative control on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R30 control: with the worker restart disabled, the refused eviction of x fails block h with callback-error and nothing of h is stored", async () => {
    const h = LIVE_AT;
    const x = hex(HELD.key);
    // The tables after h − 1 of a run that commits h (its package writes the same batches), read before h was applied.
    const reference = await runLiveObject(await backend.database(), { keeping: "writes-again" });
    expect(reference.run.status).toMatchObject({ cursor: h, reason: null });
    const live = await runLiveObject(await backend.database(), { keeping: "holds-by-reference", core: { restartOnRefusedEviction: false }, halts: true });
    expect(live.run.status).toMatchObject(refusalHalt(h));
    expect(live.run.lines.some((line) => line.includes("processing halted (callback-error)") && line.includes(`refuses to forget ${x}`))).toBe(true);
    // One thread, which refused both tries; no restart.
    expect(live.run.restarts).toBe(0);
    expect(live.counters).toMatchObject({ threads: 1, refusals: 2, storeLoads: 0 });
    // Nothing of h: no state row for it, every table of core_ledger_state (read once the process stopped) as the
    // reference run's after h − 1, x still stored.
    expect(live.states).toHaveLength(Number(h));
    expect(live.run.cursor).toBe(h - 1n);
    const atHalt = live.run.tables.get(h - 1n) as TableSnapshot;
    const before = reference.run.tables.get(h - 1n) as TableSnapshot;
    expect([...atHalt.digests]).toEqual([...before.digests]);
    expect(atHalt.rows.has(x)).toBe(true);
    expect(live.loaded).toBeNull();
  }, PATIENCE_MS * 4);
});
