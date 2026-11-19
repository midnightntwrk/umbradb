import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { FAMILIES, preparedOnWriter, preparedProblems, RUNS_AT_LEAST } from "./repeated-statements-checks.js";

/**
 * The engine's repeated statements without parameters through the real process, on PostgreSQL 18: after a short run
 * the writer's session holds each of the five families prepared, once per text, and ran it by name at every block. The
 * families are the head read, the queue read of a run that sweeps, the digest read, and the shadow tables' probe and
 * drains (`src/db/repeated-statements.ts`); the run and the checks are in `./repeated-statements-checks.ts`.
 *
 * A family whose call site passes its text unmarked runs unnamed, and is then missing here. The negative control
 * (`./repeated-statements-process.negative-control.test.ts`) takes the mark from one family at a time.
 */

const postgres = PROCESS_BACKENDS.find((backend) => backend.kind === "postgres") as ProcessBackend;

describe("the engine's repeated statements through the process, on PostgreSQL", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);

  it("the writer's session holds each of the five families prepared, once per text, and ran it by name at every block", async () => {
    const prepared = await preparedOnWriter(await postgres.database());
    expect(preparedProblems(prepared)).toEqual([]);
    // The head, queue and digest reads are one text each; the probe is one text while the captured tables stay.
    for (const family of FAMILIES.slice(0, 4)) {
      const own = prepared.filter((row) => family.is(row.statement));
      expect(own, family.name).toHaveLength(1);
      expect(own[0]?.runs, family.name).toBeGreaterThanOrEqual(RUNS_AT_LEAST);
    }
  }, PATIENCE_MS * 4);
});
