import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { REQUEUE, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { dagHistory, historyDifferences, RAW_HASH } from "./refcount-histories.js";

/**
 * The committed negative control of determinism across worker histories, on PostgreSQL 18 and PGlite 0.5.10: the runs
 * of `ledger-refcount-determinism.test.ts` (the extended DAG fixture, `keeps-old-copy`, one run that never restarts and
 * one restarted before each rewrite), with `nodes` hashed by its raw rows (the contents hash's rule before nodes were
 * content-defined; `ref_counts` and `unreferenced` still checked): their contents hashes differ, from the first block
 * that wrote a stored node again in its other form. [R28, DT-3]
 */

describe.each(PROCESS_BACKENDS)("R28's negative control on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R28 control: with nodes hashed by its raw rows, the never-restarted and the restarted runs of the DAG fixture's case have different contents hashes, from TO_REF on", async () => {
    const never = await dagHistory(await backend.database(), "keeps-old-copy");
    const restarted = await dagHistory(await backend.database(), "keeps-old-copy", [TO_REF - 1, TO_EMBEDDED - 1, REQUEUE - 1]);
    const differing = historyDifferences(restarted.facets, never.facets, [RAW_HASH]);
    expect(differing.length).toBeGreaterThan(0);
    expect(differing[0]).toBe(`after ${TO_REF}: ${RAW_HASH} differ`);
    // The difference is the raw rule's: hashed by content (the build's rule), the same databases agree.
    expect(historyDifferences(restarted.facets, never.facets, ["contents hash"])).toEqual([]);
  }, PATIENCE_MS * 8);
});
