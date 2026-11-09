import { describe, expect } from "vitest";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { cappedAt, devnetSettings } from "./ledger-restart.js";
import { historyDifferences, tapeDeterminism, tapeRunProblems } from "./refcount-histories.js";

/**
 * `[DIFF]` Determinism across worker histories on the recorded devnet v8 → v9 tape (0–235, the v8 state converted
 * before F = 103), on PostgreSQL 18 and PGlite 0.5.10, skipped by name without the tape.
 *
 * Two runs from genesis with the ledger's core modules and the real packages, side by side
 * (`./refcount-histories.ts`): one that never restarts, and one stopped at 20 heights drawn from {@link SEED} and
 * started again there, a new process with a new worker thread each, which loads the state at its cursor from the
 * database. After every block they hold the same node set, `root_counts`, rows of `states`, `segment_results` and
 * `events`, `core_digest.tables` and contents hash.
 */

/** The seed the restart heights are drawn from. */
const SEED = 20261103;

describe(`on the recorded devnet v8 → v9 tape (restart heights from seed ${SEED}; skipped by name without the tape)`, () => {
  for (const backend of PROCESS_BACKENDS) {
    tapeTest(
      "devnet-v8-v9-0-235",
      `on ${backend.name}: a run restarted at 20 seeded heights (seed ${SEED}), a new process each reading back only the database, holds after every block the node set, root_counts, rows of states, segment_results and events, core_digest.tables and contents hash of a run that never restarts`,
      async (found) => {
        const to = BigInt(found.tape.to);
        const records = cappedAt(found.read().records, to);
        await backend.start();
        try {
          const run = await tapeDeterminism(() => backend.database(), records, { to, settings: devnetSettings(found), seed: SEED, whole: () => true });
          expect(tapeRunProblems(run.never, { to, restarts: [], whole: run.whole })).toEqual([]);
          expect(tapeRunProblems(run.restarted, { to, restarts: run.restarts, whole: run.whole })).toEqual([]);
          expect(historyDifferences(run.restarted.facets, run.never.facets)).toEqual([]);
        } finally {
          await backend.stop();
        }
      },
      { timeoutMs: PATIENCE_MS * 12 },
    );
  }
});
