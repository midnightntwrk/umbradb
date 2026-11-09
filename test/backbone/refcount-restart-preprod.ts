import fc from "fast-check";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { jobFor, type ObservedRun, observedDifferences, observedRun, type RunPlan, runSegment, summaryDifferences } from "./refcount-restart.js";

/**
 * R13 on the recorded preprod 0–10,000 tape, one backend per test file (`ledger-refcount-restart-preprod-*.test.ts`), so
 * that the longest file is one backend's runs.
 *
 * Two runs on the backend, side by side (the second started once the first committed a block), each through
 * `./refcount-restart.ts`: one uninterrupted, and one stopped after the `COMMIT` of 20 seeded heights and restarted
 * there, a new process each that reads back only the database, each stop reported where it was reached. After every
 * block the restarted run has the uninterrupted run's node set, `root_counts`, `states` row and number of rows, and
 * `core_digest.tables` (the running digest of every byte-hashed table, so equal digests mean equal changes of each at
 * every block); at every 100th height (10,000 the last), at each stop and at the block after it, its contents hash and
 * the rows of every `core_ledger_state` table that is not content-defined; and R3 passes at every 100th height, run in
 * the segment from the stored rows, with the rows outside `R_{h−1} ∪ R_h` reported. The contents hash reads every row
 * of the database, so after every one of 10,001 blocks it would cost hours a run; the node set and the running
 * digests stand for it between the hashed heights. The bytes of the content-defined tables are not compared
 *.
 */

/** The seed of the 20 stops. */
export const PREPROD_SEED = 4413;
const LAST = 10_000;
/**
 * The 20 stops: distinct heights from 1 to 9,999, drawn uniformly (without fast-check's bias to small values) with
 * {@link PREPROD_SEED}, in order.
 */
export const PREPROD_STOPS: readonly number[] = (
  fc.sample(fc.noBias(fc.uniqueArray(fc.integer({ min: 1, max: LAST - 1 }), { minLength: 20, maxLength: 20 })), { seed: PREPROD_SEED, numRuns: 1 })[0] as number[]
).sort((a, b) => a - b);
/** The heights: every 100th, 10,000 the last. */
const CHECKED = Array.from({ length: LAST / 100 }, (_, i) => 100 * (i + 1));
/** The heights whose tables the runs read: The, each stop and the block after it. */
const FULL = [...new Set([...CHECKED, ...PREPROD_STOPS.flatMap((h) => [h, h + 1])])].sort((a, b) => a - b);
/** Two whole replays side by side, one with 20 restarts, on a loaded machine. */
const TAPE_MS = 6 * 3_600_000;

/** Registers the preprod test on the backend of `kind` (see the module comment). */
export function preprodRestartTest(kind: ProcessBackend["kind"]): void {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === kind) as ProcessBackend;
  describe(`on the recorded preprod 0–10,000 tape, on ${backend.name}`, () => {
    let directory: string;
    beforeAll(async () => {
      directory = mkdtempSync(join(tmpdir(), "umbradb-refcount-restart-preprod-"));
      await backend.start();
    }, 180_000);
    afterAll(async () => {
      await backend.stop();
      rmSync(directory, { recursive: true, force: true });
    }, 60_000);

    tapeTest(
      "preprod-0-10000",
      `stopped after the COMMIT of 20 heights (seed ${PREPROD_SEED}: ${PREPROD_STOPS.join(", ")}) and restarted, each stop reported, the run has after every block an uninterrupted run's node set, root_counts, states and byte-hashed tables' running digests, its contents hash and tables at every 100th height and around each stop, and R3 passing at every 100th height`,
      async (found) => {
        const run = async (name: string, stops: readonly number[]): Promise<ObservedRun> => {
          const db = await backend.database();
          const plan: RunPlan = {
            chain: { tape: found.path, settings: { network: found.tape.network } },
            last: LAST,
            observe: join(directory, `${name}.jsonl`),
            full: FULL,
            checked: CHECKED,
          };
          for (const stop of stops) {
            const outcome = await runSegment(db, await jobFor(db, plan, { hold: { point: "after-commit", height: stop, then: "stop" } }), TAPE_MS);
            expect({ reached: outcome.reached, ended: outcome.ended }, `the stop at ${stop}: ${JSON.stringify(outcome.ended)}`).toMatchObject({
              reached: { event: "reached", point: "after-commit", height: stop },
              ended: { why: "stopped", cursor: `${stop}`, reason: null },
            });
          }
          const last = await runSegment(db, await jobFor(db, plan), TAPE_MS);
          expect(last.ended, `${name}: ${JSON.stringify(last.ended)}`).toMatchObject({ why: "last", cursor: `${LAST}`, reason: null });
          return observedRun(plan.observe);
        };
        // The second run starts once the first committed a block: two first starts at one instant on one PostgreSQL
        // server race on creating the module roles, which belong to the server.
        const first = run("uninterrupted", []);
        const begun = join(directory, "uninterrupted.jsonl");
        for (let at = Date.now(); !existsSync(begun); ) {
          if (Date.now() - at > 600_000) throw new Error("the uninterrupted run committed no block in 10 minutes");
          await Promise.race([first, sleep(500)]);
        }
        const [expected, restarted] = await Promise.all([first, run("restarted", PREPROD_STOPS)]);
        const r3 = CHECKED.flatMap((h) => restarted.after.get(h)?.r3?.problems ?? [`after ${h}: R3 did not run`]);
        // R3 (c) on the tapes reports the rows outside R_{h−1} ∪ R_h.
        const outside = CHECKED.map((h) => `${h}: ${restarted.after.get(h)?.r3?.outside ?? "-"}`).join(", ");
        console.info(`R13 on ${found.tape.name} (${backend.name}): rows outside R_{h−1} ∪ R_h at ${outside}`);
        expect([
          ...expected.problems,
          ...restarted.problems,
          ...observedDifferences(restarted, expected, 0, LAST),
          ...summaryDifferences(restarted, expected),
          ...r3,
        ]).toEqual([]);
      },
      { timeoutMs: TAPE_MS },
    );
  });
}
