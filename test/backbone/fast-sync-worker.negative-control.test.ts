import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { rootOf } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tableDifferences } from "./eviction-restart.js";
import { chunked, faultAt, notTellingRollbacks, type ParseProbe, parsingLoop, PLAIN, probing, ReadsOnItsOwn, restartingBefore } from "./fast-sync-worker.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The negative controls of `fast-sync-worker.test.ts`, through the real process on the DAG fixture, on PostgreSQL 18
 * and PGlite 0.5.10:
 * - the restart rule off (the worker's host never told a rollback): after a chunk fails retryably at its third block,
 *   the blocks stored again lack nodes their first apply flushed, and the tables differ from the reference, or the
 *   check fails, or the run halts;
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
      const broken =
        control.status.state === "halted" || tableDifferences(control.tables, reference.tables).length > 0 || runProblems(control).length > 0;
      expect(broken).toBe(true);
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
