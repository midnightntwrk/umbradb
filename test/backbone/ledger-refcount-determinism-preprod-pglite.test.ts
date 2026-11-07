import { describe, expect } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { cappedAt } from "./ledger-restart.js";
import { historyDifferences, tapeDeterminism, tapeRunProblems } from "./refcount-histories.js";

/**
 * `[DIFF]` Determinism across worker histories on the recorded preprod 0–10,000 tape, on PGlite 0.5.10 (PostgreSQL's
 * case is `ledger-refcount-determinism-preprod-postgres.test.ts`, so the two run in separate workers), skipped by name
 * without the tape. [R28, DT-3, LG-11; design §4.4]
 *
 * Two runs from genesis with the ledger's core modules and the real packages, side by side
 * (`./refcount-histories.ts`): one that never restarts, and one stopped at 20 heights drawn from {@link SEED} and
 * started again there, a new process with a new worker thread each, which loads the state at its cursor from the
 * database. After every block they hold the same node set, `root_counts`, rows of `states`, `segment_results` and
 * `events` written at the block, and `core_digest.tables` (whose running digests equal at every block mean equal
 * changes of every captured table); the contents hash and every row of `states`, `segment_results` and `events` at
 * every 100th height, at each restart height and at 10,000. [R28]
 */

/** The seed the restart heights are drawn from. */
const SEED = 20261103;

/** One run of the tape may take six hours on a loaded machine, as the replay of A99 does. */
const REPLAY_MS = 6 * 3_600_000;

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

describe(`R28 (DT-3, LG-11) on the recorded preprod 0–10,000 tape, on ${backend.name} (restart heights from seed ${SEED}; skipped by name without the tape)`, () => {
  tapeTest(
    "preprod-0-10000",
    `R28 on ${backend.name}: a run restarted at 20 seeded heights (seed ${SEED}), a new process each reading back only the database, holds after every block the node set, root_counts, the block's rows of states, segment_results and events, and core_digest.tables of a run that never restarts, and its contents hash at every 100th height, every restart height and the last`,
    async (found) => {
      const to = BigInt(found.tape.to);
      const records = cappedAt(found.read().records, to);
      const whole = (height: bigint, restarts: readonly bigint[]): boolean => height % 100n === 0n || restarts.includes(height) || height === to;
      await backend.start();
      try {
        const run = await tapeDeterminism(() => backend.database(), records, { to, settings: { network: found.tape.network }, seed: SEED, whole, patience: REPLAY_MS });
        expect(tapeRunProblems(run.never, { to, restarts: [], whole: run.whole })).toEqual([]);
        expect(tapeRunProblems(run.restarted, { to, restarts: run.restarts, whole: run.whole })).toEqual([]);
        expect(historyDifferences(run.restarted.facets, run.never.facets)).toEqual([]);
      } finally {
        await backend.stop();
      }
    },
    { timeoutMs: REPLAY_MS + 600_000 },
  );
});
