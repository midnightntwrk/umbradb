import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { UmbraError } from "../../src/db/errors.js";
import { rootOf } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tableDifferences } from "./eviction-restart.js";
import { chunked, faultAt, notTellingRollbacks, type ParseProbe, parsingLoop, PLAIN, probing, ReadsOnItsOwn, restartingBefore } from "./fast-sync-worker.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The negative controls of `fast-sync-worker.test.ts`, through the real process on the DAG fixture, on PostgreSQL 18
 * and PGlite 0.5.10:
 * - the restart rule off (the worker's host never told a rollback): after the chunk 3..5 fails retryably at its third
 *   block, block 3, applied again, flushes none of the nodes its first apply flushed, and its settle halts the run
 *   with `ledger-refcount-invalid` (`missing-reference`) at 3, the cursor at 2;
 * - the ledger host's database left on the database's own read (the loop's read never a view of the open
 *   transaction): a parse given no read of a node the chunk wrote waits past 15 s on PGlite (its read waits for the
 *   transaction's `COMMIT`, which waits for the block behind the parse), and finds the node not stored on PostgreSQL.
 */

describe("the negative controls of the worker across chunks, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    it(`on ${backend.name}, the restart rule off: the blocks stored again lack nodes`, async () => {
      const reference = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: PLAIN,
        user: [faultAt(5n)],
        worker: (host) => restartingBefore(host, 2n),
      });
      const control = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: chunked(3),
        user: [faultAt(5n)],
        worker: notTellingRollbacks,
        halts: true,
      });
      expect(control.restarts).toBe(0);
      // The reference stores every block. The control's chunk 3..5 rolled back with its worker led past 3 and 4: block 3,
      // applied again on a thread that counts its nodes as stored, flushes none of them, and its settle refuses the block
      // for a node that is neither stored nor in its batch.
      expect(reference.status.state).not.toBe("halted");
      expect(runProblems(reference)).toEqual([]);
      expect(control.status).toMatchObject({
        state: "halted",
        cursor: 2n,
        reason: { code: "ledger-refcount-invalid", height: 3n, module: CORE_LEDGER_STATE_ID, point: "on-settle" },
      });
      const missing = control.errors.filter((error) => error instanceof UmbraError && error.code === "ledger-refcount-invalid");
      expect(missing).toHaveLength(1);
      expect((missing[0] as UmbraError).message).toMatch(/at block 3: the block persists 0x[0-9a-f]{64}, which is neither stored when the run began nor flushed by the run \(missing-reference\)/);
      // Up to the rollback the two runs stored the same.
      expect(tableDifferences(control.tables, reference.tables).filter((line) => !line.startsWith("no tables after "))).toEqual([]);
    }, PATIENCE_MS * 4);

    it(`on ${backend.name}, the host's database on the database's own read: the parse of a node the chunk wrote ${backend.name.startsWith("PGlite") ? "waits past 15 s" : "finds it not stored"}`, async () => {
      const probe: ParseProbe = { ledger: undefined, host: undefined, outcome: undefined };
      // The root of the state after 0, written by the chunk's first block: not in the pending block's batch (1's), which
      // the worker serves itself, so its read reaches the main thread.
      const node = Buffer.from(rootOf(0, "extended").slice(1)).toString("hex");
      await runDag(await backend.database(), {
        dag: "extended",
        core: { checkKept: true },
        settings: chunked(3),
        data: { parseReads: node },
        loop: parsingLoop(probe, 2n, 15_000, ReadsOnItsOwn),
        worker: (host) => probing(host, probe),
        halts: true,
      });
      if (backend.name.startsWith("PGlite")) expect(probe.outcome).toBe("timeout");
      else expect(probe.outcome).toContain(`(it read ${node}: not stored)`);
    }, PATIENCE_MS * 2);
  }
});
