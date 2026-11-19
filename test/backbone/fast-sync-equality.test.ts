import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { equalityWatcher, hashDifferences, hashed, SPLITTER } from "./fast-sync-equality.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * Equality of fast-sync mode with the mode off, through the real process on the DAG fixtures of
 * `./refcount-process.ts` (the original, and the extended one that writes nodes again in their other form), on
 * PostgreSQL 18 and PGlite 0.5.10: chunks of 2 (from 0, and from 1, a module starting at 1 splitting the ranges there),
 * of 7, of 40, and of the whole range (101 blocks), each against the mode off. Every table of every schema is hashed
 * at each block's `on-compute` (inside the open transaction, after the block before's cursor check, for a block after
 * a chunk's first) and at every committed height (`./fast-sync-equality.ts`): equal at every height, digests and
 * checkpoints among the tables; the fixture's checks pass.
 */

const SETTINGS = [
  { name: "chunks of 2 from 0", blocks: 2, offset: false },
  { name: "chunks of 2 from 1", blocks: 2, offset: true },
  { name: "chunks of 7", blocks: 7, offset: false },
  { name: "chunks of 40", blocks: 40, offset: false },
  { name: "one chunk of the whole range", blocks: LAST + 1, offset: false },
] as const;

describe("fast-sync mode stores what the mode off stores, through the process, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    for (const dag of ["original", "extended"] as const) {
      it(`on ${backend.name}, the ${dag} DAG: every table of every schema equal at every height, inside the transaction and committed`, async () => {
        /** One run with the watcher (and the splitter from 1 for `offset`), chunks of `blocks` or the mode off. */
        const run = async (blocks: number | null, offset: boolean) => {
          const seen = hashed();
          const done = await runDag(await backend.database(), {
            dag,
            settings: blocks === null ? {} : { fastSync: { blocks, distance: 0 } },
            user: [equalityWatcher(seen), ...(offset ? [SPLITTER] : [])],
            ...(offset ? { startOf: (id: string) => (id === SPLITTER.id ? 1 : 0) } : {}),
          });
          expect(done.cursor).toBe(BigInt(LAST));
          expect(runProblems(done, dag)).toEqual([]);
          return seen;
        };
        const off = await run(null, false);
        const offSplit = await run(null, true);
        expect(off.inside.size).toBe(LAST);
        for (const setting of SETTINGS) {
          const on = await run(setting.blocks, setting.offset);
          const reference = setting.offset ? offSplit : off;
          const at = `${backend.name}, ${dag}, ${setting.name}`;
          expect(hashDifferences(on.inside, reference.inside), at).toEqual([]);
          expect(hashDifferences(on.committed, reference.committed), at).toEqual([]);
          expect(on.inside.size, at).toBe(LAST);
        }
      }, PATIENCE_MS * 12);
    }
  }
});
