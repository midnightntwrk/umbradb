import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { extendedCases, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import type { TableSnapshot } from "./ledger-graph-tapes.js";
import { type DagRun, runDag, runProblems } from "./refcount-process.js";
import { rowProblems } from "./refcount-rewrite.js";

/**
 * The committed negative controls, on PostgreSQL 18 and PGlite 0.5.10: each runs the extended DAG fixture through the
 * process with one fault, and the check it controls must fail for that fault's own reason.
 * - The first copy kept: the node writes through `core-ledger-state`'s `nodeWriter` seam with `ON CONFLICT (node_key)
 *   DO NOTHING` in place of the replacing write, so `rewrite to-ref` keeps the child list embedding its small child at
 *   TO_REF. The node writes' count check is left out (`refcountUnchecked: "row-count-mismatch"`), as the earlier build
 *   had none, so the block commits and the row check is what finds the first copy; with the count check in, the block
 *   halts with `ledger-refcount-invalid` instead.
 * - The key only the old list referenced deleted in the block of the rewrite: `small to-embedded`'s row deleted inside
 *   TO_EMBEDDED's transaction (the `refcountWriter` seam), so R3 (c) finds a row of `R_{h−1}` gone.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The problems of `run` at `height` alone, by clause: `"(a)"`, `"(b)"`, `"(c)"`, `"(d)"`. */
function clausesAt(run: DagRun, height: number): Map<string, string[]> {
  const clauses = new Map<string, string[]>();
  for (const problem of runProblems(run, "extended")) {
    const match = /^after (\d+): (\([a-d]\)) (.*)$/.exec(problem);
    if (match === null || Number(match[1]) !== height) continue;
    clauses.set(match[2] as string, [...(clauses.get(match[2] as string) ?? []), match[3] as string]);
  }
  return clauses;
}

/** The first height at which R3 finds a problem in `run`. */
function firstProblem(run: DagRun): number | null {
  const first = runProblems(run, "extended")[0];
  return first === undefined ? null : Number(/^after (\d+):/.exec(first)?.[1]);
}

/** The replacing node write's conflict clause, and the first copy's. */
const REPLACING = /ON CONFLICT \(node_key\) DO UPDATE SET children = EXCLUDED\.children WHERE nodes\.children IS DISTINCT FROM EXCLUDED\.children$/;
const FIRST_COPY = "ON CONFLICT (node_key) DO NOTHING";

describe.each(PROCESS_BACKENDS)("negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("control: keeping the first copy (ON CONFLICT DO NOTHING) fails the row check at TO_REF: the row keeps the list embedding the small child", async () => {
    let replaced = 0;
    let unmatched = 0;
    const firstCopy = (w: Pick<BlockWriteHandle, "execute">): Pick<BlockWriteHandle, "execute"> => ({
      execute(sql, params) {
        if (!sql.startsWith("INSERT INTO core_ledger_state.nodes")) return w.execute(sql, params);
        if (!REPLACING.test(sql)) unmatched += 1;
        else replaced += 1;
        return w.execute(sql.replace(REPLACING, FIRST_COPY), params);
      },
    });
    const run = await runDag(await backend.database(), {
      dag: "extended",
      core: { nodeWriter: firstCopy, refcountUnchecked: "row-count-mismatch" },
      last: TO_REF,
    });
    expect(run.status).toMatchObject({ cursor: BigInt(TO_REF), reason: null });
    expect([replaced > 0, unmatched]).toEqual([true, 0]);
    const before = extendedCases(TO_REF - 1).toRef.node;
    const after = extendedCases(TO_REF).toRef.node;
    expect(run.batches.get(BigInt(TO_REF))?.inserts.map((node) => hex(node.key))).toContain(hex(after.key));
    expect(rowProblems(run.tables.get(BigInt(TO_REF - 1)) as TableSnapshot, before)).toEqual([]);
    expect(rowProblems(run.tables.get(BigInt(TO_REF)) as TableSnapshot, after, before)).toEqual([
      `the row of ${hex(after.key)} holds the child list written before, not ${hex(after.children)}`,
    ]);
  }, PATIENCE_MS * 2);

  it("control: deleting the key only the old list referenced in the block of the rewrite fails R3 (c)'s R_{h−1} ⊆ S_h at TO_EMBEDDED", async () => {
    const small = extendedCases(TO_EMBEDDED).toEmbedded.small;
    let deleted = -1;
    const writer = (w: Pick<BlockWriteHandle, "execute">, height: bigint): Pick<BlockWriteHandle, "execute"> =>
      height !== BigInt(TO_EMBEDDED)
        ? w
        : {
            async execute(sql, params) {
              if (deleted < 0) deleted = await w.execute("DELETE FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])", [[small.key]]);
              return w.execute(sql, params);
            },
          };
    const run = await runDag(await backend.database(), { dag: "extended", core: { refcountWriter: writer }, last: TO_EMBEDDED });
    expect(run.status).toMatchObject({ cursor: BigInt(TO_EMBEDDED), reason: null });
    expect(deleted).toBe(1);
    expect(firstProblem(run)).toBe(TO_EMBEDDED);
    expect(clausesAt(run, TO_EMBEDDED).get("(c)")).toContain(`${hex(small.key)} of R_{h−1} is not stored`);
  }, PATIENCE_MS * 2);
});
