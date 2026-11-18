import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { type Fault, haltProblems, MISSING, NEGATIVE, ONE_ROW_FEWER, REFERENCED_AGAIN, runFault, UNREACHED } from "./ledger-refcount-halts.js";

/**
 * `[CI]` Each check of the reclamation step halts its block with `ledger-refcount-invalid`, on PostgreSQL 18 and PGlite
 * 0.5.10, through the real process on the extended DAG fixture: the halt names the reason, the block's height and the
 * key or statement in its details, and nothing of the block is stored, the database left at h − 1. The faults are
 * those of `./ledger-refcount-halts.ts`: a stored count lowered so that a deletion takes it below 0
 * (`negative-count`); three test packages, flushing a new node that references a key not stored, rewriting a stored
 * node with a child list that references a key not stored, and raising the root count of a key they neither flush nor
 * have stored (`missing-reference`); a test package whose flush also writes a node no raised key reaches
 * (`unreached-node`); a seam making one of the step's statements affect one row fewer (`row-count-mismatch`). And a
 * key the process found stored, which a later run deleted, referenced again by a new node without being flushed: the
 * set of keys found stored that `core-ledger-state` keeps between runs no longer holds it, so the check halts that
 * block too (`missing-reference`). A check of the computation halts before the block's eviction: no eviction is sent
 * at its block.
 *
 * The committed negative controls (each check left out: the block commits and R3 reports the damage, or another code
 * halts it) are in `ledger-refcount-halts.negative-control.test.ts`.
 */

/** The fault's halt, as the process and the database show it: none of `haltProblems`. */
async function expectHalt(backend: ProcessBackend, fault: Fault): Promise<void> {
  const { run, db, lowered, close } = await runFault(await backend.database(), fault);
  try {
    expect(run.status.reason?.code, fault.name).toBe("ledger-refcount-invalid");
    expect(await haltProblems(db, run, fault, lowered), fault.name).toEqual([]);
  } finally {
    await close();
  }
}

describe.each(PROCESS_BACKENDS)("each reclamation check halts its block with ledger-refcount-invalid, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a stored count lowered in a copy of the database so that a deletion takes it below 0 halts at that block with ledger-refcount-invalid (negative-count), naming the key and the height; nothing of the block is stored", async () => {
    expect(NEGATIVE.reason).toBe("negative-count");
    await expectHalt(backend, NEGATIVE);
  }, PATIENCE_MS * 3);

  it("a test package flushing a new node that references a key not stored, one rewriting a stored node with a child list that references a key not stored, and one raising the root count of a key it neither flushes nor has stored each halt at that block with ledger-refcount-invalid (missing-reference), naming the key and the height; nothing of the block is stored", async () => {
    for (const fault of MISSING) {
      expect(fault.reason, fault.name).toBe("missing-reference");
      await expectHalt(backend, fault);
    }
  }, PATIENCE_MS * 4);

  it("a key found stored by an earlier run's missing read, deleted by a run since, and referenced again by a new node that the package does not flush with it halts at that block with ledger-refcount-invalid (missing-reference), naming the key and the height; nothing of the block is stored", async () => {
    expect(REFERENCED_AGAIN.reason).toBe("missing-reference");
    await expectHalt(backend, REFERENCED_AGAIN);
  }, PATIENCE_MS * 6);

  it("a test package whose flush writes a node no key the block raises reaches halts at that block with ledger-refcount-invalid (unreached-node), naming the key and the height; nothing is sent to the worker and nothing of the block is stored", async () => {
    expect(UNREACHED.reason).toBe("unreached-node");
    await expectHalt(backend, UNREACHED);
  }, PATIENCE_MS * 3);

  it("a test seam making one of the step's statements affect one row fewer halts at that block with ledger-refcount-invalid (row-count-mismatch), naming the statement, the rows computed and affected, and the height; the block's transaction rolls back", async () => {
    expect(ONE_ROW_FEWER.reason).toBe("row-count-mismatch");
    await expectHalt(backend, ONE_ROW_FEWER);
  }, PATIENCE_MS * 3);
});
