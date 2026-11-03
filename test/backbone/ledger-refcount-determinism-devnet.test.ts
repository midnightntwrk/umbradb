import { describe, expect } from "vitest";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { cappedAt } from "./ledger-restart.js";
import { historyDifferences, tapeDeterminism, tapeRunProblems } from "./refcount-histories.js";

/**
 * `[DIFF]` Determinism across worker histories on the recorded devnet v8 → v9 tape (0–235, the v8 state converted
 * before F = 103), on PostgreSQL 18 and PGlite 0.5.10, skipped by name without the tape. [R28, DT-3, LG-11; design
 * §4.4]
 *
 * Two runs from genesis with the ledger's core modules and the real packages, side by side
 * (`./refcount-histories.ts`): one that never restarts, and one stopped at 20 heights drawn from {@link SEED} and
 * started again there, a new process with a new worker thread each, which loads the state at its cursor from the
 * database. After every block they hold the same node set, `root_counts`, rows of `states`, `segment_results` and
 * `events`, `core_digest.tables` and contents hash. [R28]
 */

/** The seed the restart heights are drawn from. */
const SEED = 20261103;

/** The devnet's `core` settings: a custom network, its genesis from the manifest, its table v8 then v9 (as A99's). */
const devnetSettings = (notes: unknown): Readonly<Record<string, unknown>> => ({
  network: "custom",
  genesisHash: (notes as { genesis: { hash: string } }).genesis.hash,
  ledgerTable: { rows: [{ specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" }, { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" }] },
});

describe(`R28 (DT-3, LG-11) on the recorded devnet v8 → v9 tape (restart heights from seed ${SEED}; skipped by name without the tape)`, () => {
  for (const backend of PROCESS_BACKENDS) {
    tapeTest(
      "devnet-v8-v9-0-235",
      `R28 on ${backend.name}: a run restarted at 20 seeded heights (seed ${SEED}), a new process each reading back only the database, holds after every block the node set, root_counts, rows of states, segment_results and events, core_digest.tables and contents hash of a run that never restarts`,
      async (found) => {
        const to = BigInt(found.tape.to);
        const records = cappedAt(found.read().records, to);
        await backend.start();
        try {
          const run = await tapeDeterminism(() => backend.database(), records, { to, settings: devnetSettings(found.tape.notes), seed: SEED, whole: () => true });
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
