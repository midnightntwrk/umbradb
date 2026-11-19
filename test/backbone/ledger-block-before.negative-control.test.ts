import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { KeptBlock } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { beforeRun, changedRowProblems, keyOf, loadedKeys, readsAt, readsOf, storedKeys } from "./block-before.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runProblems } from "./refcount-process.js";

/**
 * The negative controls of `ledger-block-before.test.ts`, through the real process on PostgreSQL 18 and PGlite 0.5.10
 * with the extended DAG fixture (`./block-before.ts`):
 * - A build whose `core-ledger-state` and `core-block-commit` are told the block before continues at every height
 *   above 0, so that they use what they kept whenever the kept block is h − 1. After a `COMMIT` of h − 1 lost after it
 *   landed, with the state key stored at h − 1 changed while the process was away, the test's check fails: h, the run's
 *   first height, reads nothing of the block before, has the worker hold the key kept in memory, which the database no
 *   longer holds, and the run goes on to its last height on it. So `continues` is what makes a run's first height read
 *   the database.
 * - The checking option off, with a kept value changed (the block's hash, which the apply does not take, and its time,
 *   which the test package's apply does not use): nothing fails, the run reaches its last height, and the worker got
 *   the changed time. So the option is what catches a kept value that differs from the database.
 */

const LAST = 6;
const H = 3n;

describe.each(PROCESS_BACKENDS)("the negative controls of the block before kept in memory, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a build that uses the memory whenever the kept block is h − 1: after h − 1's state key changed while the process was away, h reads nothing and applies on the old key", async () => {
    const at = H - 1n;
    const before = await beforeRun(await backend.database(), {
      last: LAST,
      lose: { at, how: "landed", then: keyOf(at, at - 1n) },
      halts: true,
      ignoring: true,
    });
    const changed = storedKeys(before.run).get(at - 1n) as string;
    // The database holds the key of the state after h − 2 at h − 1 now; the run took the one it kept.
    expect(storedKeys(before.run).get(at)).toBe(changed);
    const kept = loadedKeys(before.loads.filter((load) => load.height === at)).at(-1);
    expect(kept).not.toBe(`${at} ${changed}`);
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(changedRowProblems(before, at, changed)).toEqual([
      `the reads of the block before were ${JSON.stringify(readsAt([]))}, not ${JSON.stringify({ ...readsAt([]), state: [`ledger on-compute@${H}#1`] })}`,
      `the last load of ${at} asked for ${String(kept)}, not the key the database holds now (${changed})`,
      `the process ended following at ${LAST} (null), not halted at ${H} in core-ledger-state's on-compute`,
    ]);
  }, PATIENCE_MS * 4);

  it("the checking option off: the block's hash and time changed in memory fail nothing, and the worker gets the changed time", async () => {
    const reference = await beforeRun(await backend.database(), { last: LAST });
    const change = (kept: KeptBlock): KeptBlock => ({ ...kept, hash: new Uint8Array(32).fill(0xee), timestampMs: kept.timestampMs + 1n });
    const before = await beforeRun(await backend.database(), { last: LAST, core: { keep: change } });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(before.run.errors).toEqual([]);
    expect(runProblems(before.run, "extended")).toEqual([]);
    // Above 1 the apply is given the parent's time (block 0's is the block's own, by the replay rules): one more ms.
    const times = (run: typeof before) => run.applies.filter((apply) => apply.height > 1n).map((apply) => apply.parentTimestampMs);
    expect(times(before)).toEqual(times(reference).map((ms) => ms + 1n));
  }, PATIENCE_MS * 4);
});
