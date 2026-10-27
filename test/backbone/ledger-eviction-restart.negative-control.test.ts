import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { refusalHalt, refusalHeight, runFixture } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";

/**
 * A160's committed negative controls (task 12.5a; `openspec/changes/core-arch/acceptance.md` A160, LG-14, owner
 * decision Q144 B), on PostgreSQL 18 and PGlite 0.5.10, over the run of `ledger-eviction-restart.test.ts` with the
 * package refusing h's eviction in its first thread only:
 *
 * - **Task 12.5's behaviour** (`restartOnRefusedEviction: false`): the refusal fails block h at once — A160's "the
 *   process does not halt" fails.
 * - **A retry without the state at h − 1** (`loadParent: false`: the new thread is not given the stored state at h − 1
 *   before h's apply): the new thread holds no state and refuses h — A160's "no halt" and "the state at h − 1 loaded
 *   from the database" fail. A retry applying h on any other state could not store another root: LG-15's root check
 *   halts it first (`root-mismatch`).
 */

describe.each(PROCESS_BACKENDS)("A160's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A160 control: a worker that halts on the first refusal (task 12.5's behaviour) halts at h", async () => {
    const h = refusalHeight();
    const run = await runFixture(await backend.database(), { refuse: { at: h, threads: 1 }, core: { restartOnRefusedEviction: false }, halts: true });
    expect(run.status.cursor).not.toBe(BigInt(LAST));
    expect(run.status).toMatchObject(refusalHalt(h));
    expect(run.restarts).toBe(0);
    expect(run.counters).toMatchObject({ threads: 1, refusals: 2, storeLoads: 0 });
  }, PATIENCE_MS * 4);

  it("A160 control: a retry in a new thread without the state at h − 1 loaded from the database halts at h", async () => {
    const h = refusalHeight();
    const run = await runFixture(await backend.database(), { refuse: { at: h, threads: 1 }, core: { loadParent: false }, halts: true });
    expect(run.status.cursor).not.toBe(BigInt(LAST));
    expect(run.status).toMatchObject(refusalHalt(h));
    expect(run.lines.some((line) => /processing halted \(callback-error\).*holds no state/.test(line))).toBe(true);
    expect(run.restarts).toBe(1);
    // The new thread never loaded the package (no state, and blocks without transactions parse nothing).
    expect(run.counters).toMatchObject({ threads: 1, refusals: 2, storeLoads: 0 });
  }, PATIENCE_MS * 4);
});
