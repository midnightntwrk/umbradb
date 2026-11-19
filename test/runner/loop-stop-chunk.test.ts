import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a169Problems, a169Run, type LoopStopScenario, PATIENCE_MS, restartedProblems, rootScenario } from "./loop-stop-harness.js";

/**
 * `[CI]` A stop while a chunk's block waits for the node's state root (fast-sync mode), through the real process, the
 * node source and `core-ledger-state`, on PostgreSQL 18.6 and PGlite 0.5.10 (`loop-stop-harness.ts`).
 *
 * The v9 ledger chain from genesis to 5 is one chunk, 0..5 (`fastSync: { blocks: 6, distance: 0 }`), the first of the
 * run, so no root was asked ahead by the source's prefetch. The tape node is gone at `midnight_ledgerStateRoot` at 4's
 * hash, and every later connection is refused. The roots of the chunk's blocks are asked before its `BEGIN`: the
 * process waits there, nothing stored, the node client retrying. `ProcessHandle.stop()` then ends the process within
 * 5 s, by the signal, with the node client closed and no connection attempt after; block 0, whose `on-compute` had its
 * root, is stored whole and nothing above it. A restart against a node that answers again goes on from 1.
 */

/** One run: the wait, the bound, the watch, the clean-up and the restart, on a loaded machine. */
const RUN_TIMEOUT_MS = 2 * PATIENCE_MS + 60_000;

describe("a stop while a block of a chunk waits for the node's state root ends the process", () => {
  let scenario: LoopStopScenario;
  beforeAll(async () => {
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.start()));
    const root = await rootScenario();
    scenario = Object.freeze({
      ...root,
      name: "a chunk's state roots",
      // Stored once the process closed: the chunk's first block, committed alone at the stop.
      height: 0n,
      waitsAt: null,
      settings: { fastSync: { blocks: 6, distance: 0 } },
    });
  }, 240_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  for (const backend of PROCESS_BACKENDS) {
    it(`on ${backend.name}: the process closes within 5 s of the stop, ended by the signal, block 0 stored and nothing above it; a restart goes on from 1`, async () => {
      const db = await backend.database();
      const { observed, lines } = await a169Run(backend, db, scenario, "stop");
      const problems = a169Problems(scenario, observed);
      if (problems.length > 0) problems.push(`log: ${lines.slice(-15).join(" | ")}`);
      expect(problems).toEqual([]);
      // The block the stop let finish is stored whole: one row in each table.
      for (const table of scenario.tables) {
        const rows = await db.query(`SELECT height::text AS h FROM ${table} ORDER BY height`);
        expect(rows.map((row) => String(row.h)), table).toEqual(["0"]);
      }
      expect(await restartedProblems(db, scenario)).toEqual([]);
    }, RUN_TIMEOUT_MS);
  }
});
