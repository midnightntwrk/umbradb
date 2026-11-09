import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extendedCases, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { UNKNOWN_KEY } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { damageAt, haltProblems, LOWERED, MISSING, NEGATIVE, ONE_ROW_FEWER, runFault } from "./ledger-refcount-halts.js";

/**
 * The committed negative controls, on PostgreSQL 18 and PGlite 0.5.10: each runs one of the faults with the check
 * that catches it left out (`core-ledger-state`'s `refcountUnchecked`), and the assertion fails for it:
 * - without `negative-count`, the count's merge meets `ref_counts`' `CHECK (count > 0)`: the block halts with
 *   `database-error`;
 * - without `missing-reference`, each package's block commits, and R3 reports the damage: a stored child list
 *   referencing a key that is no row, a root count of a key that is no row;
 * - without `row-count-mismatch`, the block commits with the queue short of the released root, and R3 reports it.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe.each(PROCESS_BACKENDS)("negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("control: without the negative-count check, the lowered count halts its block with database-error from ref_counts' CHECK", async () => {
    const { run, db, lowered, close } = await runFault(await backend.database(), NEGATIVE, true);
    try {
      expect(run.status).toMatchObject({
        state: "halted",
        cursor: BigInt(LOWERED.at),
        reason: { code: "database-error", height: BigInt(NEGATIVE.height), point: "on-db-write" },
      });
      // The assertion fails: another code.
      expect(await haltProblems(db, run, NEGATIVE, lowered)).toContainEqual(expect.stringMatching(/^the process is .*database-error/));
    } finally {
      await close();
    }
  }, PATIENCE_MS * 3);

  it("control: without the missing-reference check, each package's block commits and R3 finds the reference or root that is no row", async () => {
    const expected = [
      `(a) I1: ${hex(extendedCases(10).shared.node.key)} references ${hex(extendedCases(10).shared.leaves[1].key)}, which is not a row`,
      `(a) I1: ${hex(extendedCases(TO_REF).toRef.node.key)} references ${hex(extendedCases(TO_REF).toRef.small.key)}, which is not a row`,
      `(b) I4: ${hex(UNKNOWN_KEY)} has root count 1 and is not a row`,
    ];
    for (const [i, fault] of MISSING.entries()) {
      const { run } = await runFault(await backend.database(), fault, true);
      // The assertion fails: the block commits.
      expect(run.status, fault.name).toMatchObject({ cursor: BigInt(fault.height), reason: null });
      expect(damageAt(run, fault.height), fault.name).toContain(`after ${fault.height}: ${expected[i] as string}`);
    }
  }, PATIENCE_MS * 4);

  it("control: without the row-count-mismatch check, the block commits with the queue short of the released root, which R3 finds", async () => {
    const { run } = await runFault(await backend.database(), ONE_ROW_FEWER, true);
    expect(run.status).toMatchObject({ cursor: BigInt(ONE_ROW_FEWER.height), reason: null });
    const released = run.tables.get(BigInt(ONE_ROW_FEWER.height - 1))?.states.get(BigInt(ONE_ROW_FEWER.height - 1)) as string;
    expect(damageAt(run, ONE_ROW_FEWER.height)).toContain(`after ${ONE_ROW_FEWER.height}: (a) I3: ${released} has no reference and no root count, and is not queued`);
  }, PATIENCE_MS * 3);
});
