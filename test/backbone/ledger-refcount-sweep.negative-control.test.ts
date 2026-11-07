import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag } from "./refcount-process.js";
import { sweepComparisonOf, WHOLE_CYCLE } from "./sweep-tapes.js";

/**
 * R4's committed negative control, on PostgreSQL 18 and PGlite 0.5.10: a counting step with its cascade stopped after
 * the first round (`core-ledger-state`'s `refcountFault: "first-round-only"`) makes the equality with the sweep's
 * reference model fail on the DAG fixture without its rewrite cases. At 2 the state after 0's root is deleted, but the
 * rows only it reached are not: the counting run holds them, and the sweep's model, whose cycle fits the block, does
 * not. [R4 NEG, LG-14]
 */

describe.each(PROCESS_BACKENDS)("R4's negative control on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R4 NEG: with the cascade stopped after its first round, the counting run holds rows the sweep's model deleted, from 2 on", async () => {
    const run = await runDag(await backend.database(), { dag: "one-form", core: { refcountFault: "first-round-only" }, last: 10 });
    expect(run.status).toMatchObject({ cursor: 10n, reason: null });
    const { problems } = sweepComparisonOf(run.batches, run.tables, 10, WHOLE_CYCLE, "equal");
    expect(problems[0]).toMatch(/^node sets differ at height 2: only counting holds \[\w+, .*\], only the sweep \[\]$/);
    expect(problems.length).toBeGreaterThan(5);
  }, PATIENCE_MS * 2);
});
