import { describe, expect } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { CONVERSION_LAST, conversionR3, conversionRun, DEVNET_F, loadProblems, releaseProblems } from "./refcount-conversion.js";

/**
 * The v8 → v9 conversion on the recorded devnet tape (`devnet-v8-v9-0-235`, F = 103; `UMBRADB_TAPES`, skipped by
 * name without it), through the real process with `core-contract-states` active, with `retainStates` 0 and then 2, on
 * PostgreSQL 18 and on PGlite 0.5.10. Each run goes from genesis to F + 4 and records the tables after every height
 * and each block's batch (`./refcount-conversion.ts`).
 * - The clauses (a)–(d) pass after every block from F − 3 to F + 4, `R_{h−1}`, `R_h` and `K_h` from the stored rows;
 *   the rows outside `R_{h−1} ∪ R_h` are reported.
 * - Each v8 state (after 0 … F − 1) is released by the block b its window sets (h + 1 + `retainStates`), none of its
 *   rows is deleted before b + 1, and at b + 1 every row of it outside `K_{b+1}` is deleted: for the state after F − 1,
 *   the converted state's predecessor, that is the block after the conversion's release.
 * - Every contract state and zswap state stored below F (the contracts the tape deploys and calls at 11, 16 and 23)
 *   loads from its stored key after F + 4: rebuilt from the stored nodes, deserialized by ledger v8's package, its key
 *   the stored one.
 */

const RETAIN = [0, 2] as const;
const R3_HEIGHTS = Array.from({ length: 8 }, (_, i) => DEVNET_F - 3n + BigInt(i));

describe("the v8 → v9 conversion on the recorded devnet, on PostgreSQL and on PGlite", () => {
  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    tapeTest(
      "devnet-v8-v9-0-235",
      `on ${backend.name}: with core-contract-states and retainStates 0, then 2, R3 passes after every block from F − 3 to F + 4; each v8 state is released by the block b its window sets, none of its rows deleted before b + 1, those outside K_{b+1} deleted at b + 1; every contract and zswap state stored below F loads from its key after F + 4`,
      async (found) => {
        await backend.start();
        try {
          for (const retainStates of RETAIN) {
            const run = await conversionRun(await backend.database(), found, retainStates);
            const at = `${backend.name}, retainStates ${retainStates}`;
            expect(R3_HEIGHTS.at(-1)).toBe(CONVERSION_LAST);
            const r3 = conversionR3(run, R3_HEIGHTS);
            expect(r3.problems, at).toEqual([]);
            const released = releaseProblems(run);
            expect(released.problems, at).toEqual([]);
            // The state after F − 1 is released at F + retainStates; the block after deletes its rows the v9 state does not use.
            expect(released.last.released, at).toBe(DEVNET_F + BigInt(retainStates));
            expect(released.last.deleted, at).toBeGreaterThan(0);
            const loads = loadProblems(run);
            expect(loads.problems, at).toEqual([]);
            expect(loads.loaded.map((row) => row.split(" ")[0]), at).toEqual(["11", "16", "23"]);
            console.info(
              `R22 on ${at}: R3 passed after ${R3_HEIGHTS[0]} … ${CONVERSION_LAST}; rows outside R_{h−1} ∪ R_h ` +
                `${[...r3.outside].map(([h, n]) => `${h}: ${n}`).join(", ")}; the state after ${DEVNET_F - 1n} released at ` +
                `${released.last.released} with ${released.last.rows} rows, ${released.last.deleted} deleted at ` +
                `${released.last.released + 1n}; ${run.tables.get(CONVERSION_LAST)?.rows.size} rows after ${CONVERSION_LAST}; ` +
                `loaded after ${CONVERSION_LAST}: ${loads.loaded.join(", ")}`,
            );
          }
        } finally {
          await backend.stop();
        }
      },
      { timeoutMs: 1_800_000 },
    );
  }
});
