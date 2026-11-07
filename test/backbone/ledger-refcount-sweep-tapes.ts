import { expect } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { sweepTapeComparison } from "./sweep-tapes.js";

/**
 * R4's case on a recorded tape, registered by each `ledger-refcount-sweep-tape-*.test.ts` for one tape and one backend
 * (a tape's PostgreSQL replay is one file's work). The counting build runs the tape from genesis to its range's end
 * (`./sweep-tapes.ts` `sweepTapeComparison`), and each block's batch is fed to the sweep's reference model with a
 * budget that fits each cycle in one block: the two node sets are equal at every height. No recorded tape writes a key
 * in a form other than an earlier one (the tapes' measured batches), so every height of each tape is compared; the
 * comparison itself refuses a key written in another form. The backend starts inside the case, so a run without the
 * tape starts none (the case is skipped by name). [R4 DIFF, R21, LG-14]
 */

/** Six hours of replay: 10,000 heights on a loaded machine. */
const REPLAY_MS = 6 * 3_600_000;

/** Registers R4's case on the tape `name` (see the module comment), on the backends of `kinds`. */
export function sweepTapeCase(name: string, kinds: readonly ProcessBackend["kind"][]): void {
  for (const backend of PROCESS_BACKENDS.filter((candidate) => kinds.includes(candidate.kind))) {
    tapeTest(
      name,
      `R4 on ${backend.name}: the counting run's batches fed to the sweep's reference model, budget fitting each cycle, give equal node sets at every height of ${name}`,
      async (found) => {
        await backend.start();
        try {
          const to = BigInt(found.tape.to);
          const result = await sweepTapeComparison(await backend.database(), found, REPLAY_MS);
          expect(result.status).toMatchObject({ cursor: to, reason: null });
          expect(result.problems).toEqual([]);
          expect([result.seen.heights, result.seen.first, result.seen.last]).toEqual([Number(to) + 1, 0n, to]);
          // Not vacuous: the counting run deleted rows all along (about what each block wrote).
          expect(result.deleted).toBeGreaterThan(Number(to));
          console.log(
            `R4 on ${name}, ${backend.name}: heights 0–${to} compared (${result.seen.heights}), node sets equal at each; ` +
              `${result.deleted} rows deleted, ${result.rows} stored after ${to}, at most ${result.seen.most} nodes, ` +
              `${result.seen.writtenAgain} batch nodes whose key was written before, ${result.seen.sweptDeleted} rows the sweep's model deleted`,
          );
        } finally {
          await backend.stop();
        }
      },
      { timeoutMs: REPLAY_MS + 600_000 },
    );
  }
}
