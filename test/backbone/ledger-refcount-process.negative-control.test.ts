import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { RefcountFault } from "../../src/backbone/core-ledger-state/refcount.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { AGAIN, extendedCases, type FixtureNode, REQUEUE, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { type DagRun, runDag, runProblems } from "./refcount-process.js";

/**
 * The committed negative controls of A105 and R3, on PostgreSQL 18 and PGlite 0.5.10: each runs the extended DAG
 * fixture through the process with one fault, and the check it controls must fail for that fault's own reason. [A105
 * NEG, R3 NEG, R12]
 *
 * R12's six faults, each put into the reclamation step through its tables seam (`core-ledger-state`'s `refcountFault`):
 * - (a) the second occurrence of a repeated child not decremented: `repeat leaf 0`, which `repeat 0` lists twice, keeps
 *   a count when `repeat 0` is deleted (at 6), and is not deleted with `repeat 1` (at 16): R3 (a) and (d);
 * - (b) the references of a node written again unchanged counted: `again`'s leaves at AGAIN: R3 (a);
 * - (c) a repeated child counted once per parent on increment, per occurrence on decrement: `repeat leaf 0` reaches 0
 *   at 6 while `repeat 1` still lists it, and is deleted: R3 (b) and (c);
 * - (d) a released state's rows deleted in the block that releases it: the state after 0's own rows at 1: R3 (c);
 * - (e) a queued key that a new node references deleted in that block: `requeued` at REQUEUE + 1: R11's
 *   `missing-reference` halt;
 * - (f) the cascade stopped after its first round: the rows only the state after 0 reached are left at 2: R3 (d).
 *
 * R3's own: a test seam that, at one block, deletes the state's newly persisted root and the rows only it reaches,
 * inside the block's transaction, makes (b) and (c) fail at that block.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** Runs the extended DAG to `last` with `fault`. */
const faulty = (backend: ProcessBackend, fault: RefcountFault, last: number, halts = false): Promise<DagRun> =>
  backend.database().then((db) => runDag(db, { dag: "extended", core: { refcountFault: fault }, last, halts }));

/** R3's problems of `run` at `height` alone, by clause: `"(a)"`, `"(b)"`, `"(c)"`, `"(d)"`. */
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

describe.each(PROCESS_BACKENDS)("A105's and R3's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const leaf0 = hex(extendedCases(0).repeated.leaf.key);

  it("R12 (a): skipping the decrement of a repeated child's second occurrence leaks it: R3 (a) at 6, R3 (d) at 16", async () => {
    const run = await faulty(backend, "second-occurrence-not-decremented", 17);
    expect(run.status).toMatchObject({ cursor: 17n, reason: null });
    expect(firstProblem(run)).toBe(6);
    expect(clausesAt(run, 6).get("(a)")).toContain(`I2: ${leaf0} is counted 3, and the stored child lists reference it 2 times`);
    expect(clausesAt(run, 16).get("(d)")).toContain(`I5: ${leaf0}, whose referencing rows at h − 1 were all deleted, is still stored`);
  }, PATIENCE_MS * 2);

  it("R12 (b): counting the references of a node written again unchanged fails R3 (a) at that block", async () => {
    const run = await faulty(backend, "unchanged-counted", AGAIN);
    expect(run.status).toMatchObject({ cursor: BigInt(AGAIN), reason: null });
    expect(firstProblem(run)).toBe(AGAIN);
    const leaves = extendedCases(AGAIN).again.leaves.map((leaf: FixtureNode) => hex(leaf.key));
    const found = clausesAt(run, AGAIN).get("(a)") ?? [];
    for (const leaf of leaves) expect(found).toContain(`I2: ${leaf} is counted 2, and the stored child lists reference it 1 times`);
  }, PATIENCE_MS * 2);

  it("R12 (c): a repeated child counted once per parent on increment and per occurrence on decrement is deleted while live: R3 (b) and (c) at 6", async () => {
    const run = await faulty(backend, "increment-once-per-parent", 6);
    expect(run.status).toMatchObject({ cursor: 6n, reason: null });
    // Its counts are short from block 0 (R3 (a)); no live row is gone before 6.
    for (let h = 0; h < 6; h++) expect([...clausesAt(run, h).keys()].filter((clause) => clause !== "(a)"), `at ${h}`).toEqual([]);
    const found = clausesAt(run, 6);
    expect(found.get("(b)")).toContain(`the state key of 6 reaches ${leaf0}, which is not stored`);
    expect(found.get("(c)")).toContain(`${leaf0} of R_{h−1} is not stored`);
  }, PATIENCE_MS * 2);

  it("R12 (d): a released state's rows deleted in the block that releases it fail R3 (c)'s R_{h−1} ⊆ S_h at 1", async () => {
    const run = await faulty(backend, "released-in-block", 2);
    expect(firstProblem(run)).toBe(1);
    const root0 = hex(stateNodes(0, "extended")[0]?.key as Uint8Array);
    expect(clausesAt(run, 1).get("(c)")).toContain(`${root0} of R_{h−1} is not stored`);
  }, PATIENCE_MS * 2);

  it("R12 (e): deleting a queued key that a new node references in the same block halts with ledger-refcount-invalid (missing-reference)", async () => {
    const run = await faulty(backend, "referenced-queued-deleted", REQUEUE + 1, true);
    const requeued = `0x${hex(extendedCases(REQUEUE).requeue.requeued.key)}`;
    expect(run.status).toMatchObject({
      state: "halted",
      cursor: BigInt(REQUEUE),
      reason: { code: "ledger-refcount-invalid", height: BigInt(REQUEUE + 1), module: "core-ledger-state", point: "on-compute" },
    });
    const error = run.errors.at(-1);
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).details).toMatchObject({ reason: "missing-reference", height: BigInt(REQUEUE + 1), key: requeued });
  }, PATIENCE_MS * 2);

  it("R12 (f): a cascade stopped after its first round leaves the rows only the deleted ones referenced: R3 (d) at 2", async () => {
    const run = await faulty(backend, "first-round-only", 2);
    expect(run.status).toMatchObject({ cursor: 2n, reason: null });
    expect(firstProblem(run)).toBe(2);
    const found = clausesAt(run, 2).get("(d)") ?? [];
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((problem) => problem.endsWith("whose referencing rows at h − 1 were all deleted, is still stored"))).toBe(true);
  }, PATIENCE_MS * 2);

  it("R3's control: deleting the newly persisted root of the state after 20 and the rows only it reaches, in that block's transaction, fails R3 (b) and (c) at 20", async () => {
    const at = 20;
    const reach = (h: number): Set<string> => {
      const nodes = new Map(stateNodes(h, "extended").map((node) => [hex(node.key), node]));
      const reached = new Set<string>();
      const frontier = [hex(stateNodes(h, "extended")[0]?.key as Uint8Array)];
      while (frontier.length > 0) {
        const key = frontier.pop() as string;
        if (reached.has(key)) continue;
        reached.add(key);
        frontier.push(...(nodes.get(key)?.refs ?? []).map(hex));
      }
      return reached;
    };
    const before = reach(at - 1);
    const only = [...reach(at)].filter((key) => !before.has(key));
    let deleted = 0;
    const writer = (w: Pick<BlockWriteHandle, "execute">, height: bigint): Pick<BlockWriteHandle, "execute"> =>
      height !== BigInt(at)
        ? w
        : {
            async execute(sql, params) {
              if (deleted === 0) {
                deleted = await w.execute("DELETE FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])", [
                  only.map((key) => Uint8Array.from(Buffer.from(key, "hex"))),
                ]);
              }
              return w.execute(sql, params);
            },
          };
    const run = await runDag(await backend.database(), { dag: "extended", core: { refcountWriter: writer }, last: at });
    expect(run.status).toMatchObject({ cursor: BigInt(at), reason: null });
    expect(deleted).toBe(only.length);
    expect(firstProblem(run)).toBe(at);
    const found = clausesAt(run, at);
    const root = hex(stateNodes(at, "extended")[0]?.key as Uint8Array);
    expect(found.get("(b)")).toContain(`I4: ${root} has root count 1 and is not a row`);
    expect(found.get("(c)")).toContain(`S_h ≠ K_h: ${root} of K_h is not stored`);
  }, PATIENCE_MS * 2);
});
