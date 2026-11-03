import { describe, expect } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import type { StoredCheck } from "./refcount-checks.js";
import { replayRefcountTape, sampledHeights } from "./refcount-tapes.js";
import type { WorkerRecord } from "./sweep-tapes.js";

/**
 * R3's committed negative control on a recorded tape (the devnet's, `UMBRADB_TAPES`; skipped by name without it), on
 * PostgreSQL 18 and PGlite 0.5.10. At 200 a test seam (`core-ledger-state`'s `refcountWriter`) deletes, inside the
 * block's transaction, the state's newly persisted root and the rows only it reaches: the block's written nodes, which
 * that root, the one key whose root count rises there, reaches (none of them in `R_{h−1}`, as the test checks). The
 * replay stops at 200, a height R3 checks (`./refcount-tapes.ts`). R3's check, with (c)'s sets from the stored rows,
 * passes at every height before it and finds (b) and (c) failing at 200. [R3 NEG, LG-11, LG-14]
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The height of the fault: a sampled height after the conversion, with no contract touched. */
const AT = 200n;

/** The fault's seam, and what it deleted: the persisted root and the written nodes of block `AT`. */
function deletingNewRoot(record: WorkerRecord): {
  readonly writer: (w: Pick<BlockWriteHandle, "execute">, height: bigint) => Pick<BlockWriteHandle, "execute">;
  readonly deleted: { roots: string[]; keys: string[]; rows: number };
} {
  const deleted = { roots: [] as string[], keys: [] as string[], rows: -1 };
  const writer = (w: Pick<BlockWriteHandle, "execute">, height: bigint): Pick<BlockWriteHandle, "execute"> =>
    height !== AT
      ? w
      : {
          async execute(sql, params) {
            const batch = record.batches.get(AT);
            if (deleted.rows < 0 && batch !== undefined) {
              deleted.roots = batch.rootCounts.filter((count) => count.delta > 0).map((count) => hex(count.key));
              deleted.keys = batch.inserts.map((node) => hex(node.key));
              deleted.rows = await w.execute("DELETE FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])", [batch.inserts.map((node) => node.key)]);
            }
            return w.execute(sql, params);
          },
        };
  return { writer, deleted };
}

describe("R3's negative control on devnet-v8-v9-0-235 (UMBRADB_TAPES)", () => {
  for (const backend of PROCESS_BACKENDS) {
    tapeTest(
      "devnet-v8-v9-0-235",
      `R3's control on the devnet tape, ${backend.name}: deleting the newly persisted root after 200 and the rows only it reaches, in that block's transaction, fails R3 (b) and (c) at 200`,
      async (found) => {
        let fault: ReturnType<typeof deletingNewRoot> | undefined;
        const replay = await replayRefcountTape(found, backend, {
          last: AT,
          core: (record) => {
            fault = deletingNewRoot(record);
            return { refcountWriter: fault.writer };
          },
        });
        expect(replay.status).toMatchObject({ cursor: AT, reason: null });
        const { roots, keys, rows } = (fault as ReturnType<typeof deletingNewRoot>).deleted;
        // One root rises at 200, the state's; it is one of the block's written nodes, and every one of them was a row.
        expect(roots).toHaveLength(1);
        const root = roots[0] as string;
        expect(keys).toContain(root);
        expect(rows).toBe(keys.length);
        expect(replay.checks.map((check) => check.height)).toEqual(sampledHeights("devnet-v8-v9-0-235", AT));
        expect(replay.checks.slice(0, -1).flatMap((check) => check.problems)).toEqual([]);
        const at = replay.checks.at(-1) as StoredCheck;
        const clause = (name: string): string[] =>
          at.problems.filter((problem) => problem.startsWith(`after ${AT}: ${name} `)).map((problem) => problem.slice(`after ${AT}: ${name} `.length));
        expect(clause("(b)")).toContain(`I4: ${root} has root count 1 and is not a row`);
        expect(clause("(c)")).toContain(`S_h ≠ K_h: ${root} of K_h is not stored`);
        // Only rows the new root reached went: none of R_{h−1}.
        expect(clause("(c)").filter((problem) => problem.endsWith("of R_{h−1} is not stored"))).toEqual([]);
      },
      { timeoutMs: 1_800_000 },
    );
  }
});
