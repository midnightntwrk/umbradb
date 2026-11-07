import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  type RefcountFault,
  type RefcountStep,
  refcountStep,
  type RefcountTables,
} from "../../src/backbone/core-ledger-state/refcount.js";
import { UmbraError } from "../../src/db/errors.js";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type Child, encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import {
  driveHistory,
  historyScripts,
  type RefcountBatch,
  type RefcountModelStep,
  RefcountModelHalt,
  refcountModelStep,
  type RefcountTables as ModelTables,
} from "./refcount-model.js";

/**
 * `core-ledger-state`'s reclamation step (`src/backbone/core-ledger-state/refcount.ts`) against the reference model
 * (`./refcount-model.ts`), through a tables seam that answers the step's reads from the model's tables at h − 1 as the
 * database would. [LG-14, R1, R11, R12]
 *
 * - The property (fast-check, seed 20261105): on the generated histories of R1, after every block the step gives the
 *   model's new, rewritten and unchanged nodes, count changes and counts, deleted set and rounds, queue and rows.
 * - Two of R12's faults have a counterpart in the model (`released-in-block`, `first-round-only`): with the fault put
 *   into the tables seam, the step gives the faulty model's block, halts included, at every block of the histories.
 * - The checks fire at the step's level: `negative-count` on a lowered count, `missing-reference` on a new node, a
 *   rewritten node and a rising root naming a key that is not stored after the block, each as the model halts.
 * - Each of R12's six faults, by hand, does what it names. The statements, their row counts and `row-count-mismatch`
 *   are `./refcount-tables.test.ts`'s, on both backends.
 */

/** The fast-check seed and run count of the properties here. */
const SEED = 20261105;
const RUNS = 200;

const bytes = (key: string): Uint8Array => Uint8Array.from(Buffer.from(key, "hex"));
const sorted = (keys: Iterable<string>): string[] => [...keys].sort();

/**
 * The tables seam over tables at h − 1 as the model holds them (hex keys): each read answers what the database's
 * statement would, the child lists parsed to their references, and the counts leave out a key with no row and no count
 * (which the seam allows). `fault` is put into the step through it.
 */
function memoryTables(tables: ModelTables, fault?: RefcountFault): RefcountTables {
  return {
    ...(fault === undefined ? {} : { fault }),
    async rows(keys) {
      return new Set(keys.map(hex).filter((key) => tables.rows.has(key)));
    },
    async changed(nodes) {
      const found = new Map<string, Uint8Array[]>();
      for (const node of nodes) {
        const stored = tables.rows.get(hex(node.key));
        if (stored !== undefined && Buffer.compare(stored, node.children) !== 0) {
          found.set(hex(node.key), childRefKeys(stored));
        }
      }
      return found;
    },
    async queue() {
      return [...tables.queue].map(bytes);
    },
    async counts(keys) {
      return new Map(
        keys
          .map(hex)
          .filter((k) => tables.rows.has(k) || tables.refs.has(k) || tables.roots.has(k))
          .map((k) => [k, { row: tables.rows.has(k), refs: tables.refs.get(k) ?? 0, roots: tables.roots.get(k) ?? 0 }]),
      );
    },
    async references(keys) {
      const found = new Map<string, Uint8Array[]>();
      for (const key of keys) {
        const stored = tables.rows.get(hex(key));
        if (stored !== undefined) found.set(hex(key), childRefKeys(stored));
      }
      return found;
    },
  };
}

/** The model's batch as the step takes it (`NodeBatch`); the payload plays no part in the step. */
function nodeBatchOf(batch: RefcountBatch): NodeBatch {
  return {
    inserts: batch.inserts.map(({ key, children }) => ({ key: bytes(key), data: new Uint8Array(0), children })),
    rootCounts: batch.rootCounts.map(({ key, delta }) => ({ key: bytes(key), delta })),
  };
}

/** What a block's step decides, as the model's tables and hex keys say it. */
interface Outcome {
  readonly newNodes: readonly string[];
  readonly rewritten: readonly string[];
  readonly unchanged: readonly string[];
  readonly deltas: readonly (readonly [string, number])[];
  readonly counts: readonly (readonly [string, number])[];
  /** The rows the merge of the counts writes: the keys whose count changes and stays above 0. */
  readonly counted: number;
  readonly deleted: readonly string[];
  readonly rounds: number;
  readonly queue: readonly string[];
  readonly rows: readonly (readonly [string, string])[];
}

/** The step's outcome over the tables at h − 1 it was computed from (its writes applied to them). */
function stepOutcome(step: RefcountStep, before: ModelTables, batch: RefcountBatch): Outcome {
  const deltas = step.deltas.map(({ key, delta }) => [hex(key), delta] as const);
  const counts = new Map(before.refs);
  for (const [key, delta] of deltas) {
    const next = (counts.get(key) ?? 0) + delta;
    if (next === 0) counts.delete(key);
    else counts.set(key, next);
  }
  // The queue's writes delete only queued keys and insert only keys not queued.
  for (const key of step.unqueued) expect(before.queue.has(hex(key))).toBe(true);
  for (const key of step.queued) expect(before.queue.has(hex(key))).toBe(false);
  const queue = new Set(before.queue);
  for (const key of step.unqueued) queue.delete(hex(key));
  for (const key of step.queued) queue.add(hex(key));
  const rows = new Map(before.rows);
  const written = new Set([...step.newNodes, ...step.rewritten].map(hex));
  for (const node of batch.inserts) if (written.has(node.key)) rows.set(node.key, node.children);
  for (const key of step.deleted) rows.delete(hex(key));
  return {
    newNodes: step.newNodes.map(hex),
    rewritten: step.rewritten.map(hex),
    unchanged: step.unchanged.map(hex),
    deltas,
    counts: sorted(counts.keys()).map((key) => [key, counts.get(key) as number] as const),
    counted: step.counted,
    deleted: step.deleted.map(hex),
    rounds: step.rounds,
    queue: sorted(queue),
    rows: sorted(rows.keys()).map((key) => [key, hex(rows.get(key) as Uint8Array)] as const),
  };
}

/** The model's outcome for the same block. */
function modelOutcome(step: RefcountModelStep): Outcome {
  const { rows, refs, queue } = step.after;
  return {
    newNodes: step.newNodes,
    rewritten: step.rewritten,
    unchanged: step.unchanged,
    deltas: [...step.deltas],
    counts: sorted(refs.keys()).map((key) => [key, refs.get(key) as number] as const),
    counted: [...step.deltas.keys()].filter((key) => (refs.get(key) ?? 0) > 0).length,
    deleted: step.deleted,
    rounds: step.rounds,
    queue: sorted(queue),
    rows: sorted(rows.keys()).map((key) => [key, hex(rows.get(key) as Uint8Array)] as const),
  };
}

/** A halt as both sides report it: its reason and its key (`0x`-less hex). */
type Halt = { readonly reason: string; readonly key: string };

/** The step's outcome, or its halt (`ledger-refcount-invalid`, with the height it was given). */
async function stepOrHalt(
  tables: ModelTables,
  batch: RefcountBatch,
  options: { readonly height: bigint; readonly on: boolean; readonly fault?: RefcountFault },
): Promise<Outcome | Halt> {
  try {
    const step = await refcountStep(memoryTables(tables, options.fault), nodeBatchOf(batch), options);
    return stepOutcome(step, tables, batch);
  } catch (error) {
    if (!(error instanceof UmbraError) || error.code !== "ledger-refcount-invalid") throw error;
    expect(error.details.height).toBe(options.height);
    const key = String(error.details.key);
    expect(key).toMatch(/^0x[0-9a-f]{64}$/);
    return { reason: String(error.details.reason), key: key.slice(2) };
  }
}

/** The model's outcome, or its halt. */
function modelOrHalt(
  tables: ModelTables,
  batch: RefcountBatch,
  options: { readonly on: boolean; readonly fault?: "released-in-block" | "first-round-only" },
): Outcome | Halt {
  try {
    return modelOutcome(refcountModelStep(tables, batch, options));
  } catch (error) {
    if (!(error instanceof RefcountModelHalt)) throw error;
    return { reason: error.reason, key: error.key };
  }
}

describe("the reclamation step against the reference model (LG-14)", () => {
  it(
    `gives the model's new and rewritten nodes, counts, queue and deleted set after every block of R1's histories ` +
      `(seed ${SEED}, ${RUNS} runs)`,
    async () => {
      const shown = { blocks: 0, rewritten: 0, unchanged: 0, deleted: 0, cascades: 0, queued: 0, unqueued: 0, off: 0 };
      await fc.assert(
        fc.asyncProperty(historyScripts({ oneForm: false }), async (script) => {
          for (const block of driveHistory(script)) {
            const height = BigInt(block.height);
            const on = block.script.on;
            const step = await refcountStep(memoryTables(block.tables), nodeBatchOf(block.batch), { height, on });
            expect(stepOutcome(step, block.tables, block.batch)).toEqual(modelOutcome(block.step));
            expect(step.height).toBe(height);
            shown.blocks += 1;
            if (step.rewritten.length > 0) shown.rewritten += 1;
            if (step.unchanged.length > 0) shown.unchanged += 1;
            if (step.deleted.length > 0) shown.deleted += 1;
            if (step.rounds > 1) shown.cascades += 1;
            if (step.queued.length > 0) shown.queued += 1;
            if (step.unqueued.length > 0) shown.unqueued += 1;
            if (!on) shown.off += 1;
          }
        }),
        { seed: SEED, numRuns: RUNS },
      );
      // Not vacuous: the histories rewrite, write again unchanged, delete in cascades, queue and unqueue, and turn
      // `sweep` off (R1's own test shows every case of R1 on these generators).
      for (const [what, blocks] of Object.entries(shown)) expect(blocks, what).toBeGreaterThan(20);
    },
    300_000,
  );

  for (const fault of ["released-in-block", "first-round-only"] as const) {
    it(
      `with ${fault} in its tables seam, gives the model with the same fault at every block, halts included ` +
        `(seed ${SEED}, ${RUNS} runs)`,
      async () => {
        let differs = 0;
        await fc.assert(
          fc.asyncProperty(historyScripts({ oneForm: false }), async (script) => {
            for (const block of driveHistory(script)) {
              const height = BigInt(block.height);
              const on = block.script.on;
              const faulty = modelOrHalt(block.tables, block.batch, { on, fault });
              expect(await stepOrHalt(block.tables, block.batch, { height, on, fault })).toEqual(faulty);
              if (JSON.stringify(faulty) !== JSON.stringify(modelOutcome(block.step))) differs += 1;
            }
          }),
          { seed: SEED, numRuns: RUNS },
        );
        // The fault changes what the step does on these histories.
        expect(differs).toBeGreaterThan(20);
      },
      300_000,
    );
  }
});

// ── Hand-made blocks ─────────────────────────────────────────────────────────────────────────────────────────────────

/** A child given to {@link node}: a key, referenced, or a node, embedded. */
type Given = Uint8Array | { readonly tree: Child[]; readonly data: Uint8Array };

const childKeys = (tree: readonly Child[]): Uint8Array[] =>
  tree.map((child) => ("ref" in child ? child.ref : nodeKey(child.direct.data, childKeys(child.direct.children))));

/** A node over `children`, its key the format's. */
function node(label: string, children: readonly Given[] = []) {
  const data = Uint8Array.from(Buffer.from(label));
  const tree: Child[] = children.map((child) =>
    child instanceof Uint8Array ? { ref: child } : { direct: { data: child.data, children: child.tree } },
  );
  const keyBytes = nodeKey(
    data,
    children.map((child) => (child instanceof Uint8Array ? child : nodeKey(child.data, childKeys(child.tree)))),
  );
  return { key: hex(keyBytes), keyBytes, data, tree, children: encodeChildren(tree) };
}

/** Tables at h − 1 as given. */
function tables(
  rows: readonly { readonly key: string; readonly children: Uint8Array }[],
  refs: Readonly<Record<string, number>>,
  queue: readonly string[],
  roots: Readonly<Record<string, number>> = {},
): ModelTables {
  return {
    rows: new Map(rows.map((row) => [row.key, row.children])),
    refs: new Map(Object.entries(refs)),
    roots: new Map(Object.entries(roots)),
    queue: new Set(queue),
  };
}

/** A batch of `inserts` and root count changes. */
const batchOf = (
  inserts: readonly { readonly key: string; readonly children: Uint8Array }[],
  rootCounts: Readonly<Record<string, number>> = {},
): RefcountBatch => ({
  inserts: inserts.map(({ key, children }) => ({ key, children })),
  rootCounts: Object.entries(rootCounts).map(([key, delta]) => ({ key, delta })),
});

const H = 7n;

describe("the reclamation step's checks fire at the step's level (LG-14)", () => {
  it("negative-count: a stored count lowered so that a deletion takes it below 0 halts with the key", async () => {
    const c = node("c");
    const p = node("p", [c.keyBytes]);
    // c's count lowered from 1 to none: deleting the queued p takes it to −1.
    const before = tables([p, c], {}, [p.key]);
    const batch = batchOf([]);
    expect(await stepOrHalt(before, batch, { height: H, on: true })).toEqual({ reason: "negative-count", key: c.key });
    expect(modelOrHalt(before, batch, { on: true })).toEqual({ reason: "negative-count", key: c.key });
  });

  it("missing-reference: a new node referencing a key not stored halts with that key", async () => {
    const x = node("x");
    const n = node("n", [x.keyBytes]);
    const before = tables([], {}, []);
    const batch = batchOf([n], { [n.key]: 1 });
    const halt = { reason: "missing-reference", key: x.key };
    expect(await stepOrHalt(before, batch, { height: H, on: true })).toEqual(halt);
    expect(modelOrHalt(before, batch, { on: true })).toEqual(halt);
  });

  it("missing-reference: a stored node rewritten with a child list referencing a key not stored halts", async () => {
    const x = node("x");
    const stored = node("w", [x]); // x embedded, so not a row
    const rewritten = node("w", [x.keyBytes]);
    expect(rewritten.key).toBe(stored.key);
    const before = tables([stored], {}, [], { [stored.key]: 1 });
    const batch = batchOf([rewritten]);
    const halt = { reason: "missing-reference", key: x.key };
    expect(await stepOrHalt(before, batch, { height: H, on: true })).toEqual(halt);
    expect(modelOrHalt(before, batch, { on: true })).toEqual(halt);
  });

  it("missing-reference: a root count raised for a key neither flushed nor stored halts with that key", async () => {
    const y = node("y");
    const before = tables([], {}, []);
    const batch = batchOf([], { [y.key]: 1 });
    const halt = { reason: "missing-reference", key: y.key };
    expect(await stepOrHalt(before, batch, { height: H, on: true })).toEqual(halt);
    expect(modelOrHalt(before, batch, { on: true })).toEqual(halt);
  });

  it("missing-reference: a deleted rewritten node's new list naming a key the cascade deletes halts", async () => {
    // Every reference of a rewritten node's batch child list is checked, the node deleted or not: x, which the queued
    // w embedded and now references, has no other reference, so the cascade deletes it after w.
    const x = node("x");
    const stored = node("w", [x]);
    const rewritten = node("w", [x.keyBytes]);
    const before = tables([stored, x], {}, [stored.key, x.key]);
    const batch = batchOf([rewritten]);
    const halt = { reason: "missing-reference", key: x.key };
    expect(await stepOrHalt(before, batch, { height: H, on: true })).toEqual(halt);
    expect(modelOrHalt(before, batch, { on: true })).toEqual(halt);
  });

  it("the halts carry the code, the reason, the height and the key as 0x hex, and the message names them", async () => {
    const c = node("c");
    const p = node("p", [c.keyBytes]);
    const error = await refcountStep(memoryTables(tables([p, c], {}, [p.key])), nodeBatchOf(batchOf([])), {
      height: H,
      on: true,
    }).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({
      code: "ledger-refcount-invalid",
      retryable: false,
      details: { reason: "negative-count", height: H, key: `0x${c.key}` },
    });
    expect((error as Error).message).toContain(`block ${H}`);
    expect((error as Error).message).toContain(`0x${c.key}`);
  });
});

describe("the reclamation step by hand (LG-14)", () => {
  it("classifies the batch, counts, deletes the queue's cascade and queues what a block releases", async () => {
    const l = node("l");
    const a = node("a", [l.keyBytes]);
    const b = node("b");
    const s0 = node("s0", [a.keyBytes, b.keyBytes]);
    const m = node("m");
    const q = node("q", [m.keyBytes]);
    const u = node("u");
    const x = node("x");
    const y = node("y");
    const w0 = node("w", [x.keyBytes, { tree: [], data: y.data }]);
    const w1 = node("w", [x.keyBytes, y.keyBytes]);
    const c = node("c");
    const s1 = node("s1", [b.keyBytes, c.keyBytes, u.keyBytes]);
    const before = tables(
      [s0, a, l, b, q, m, u, w0, x],
      { [a.key]: 1, [b.key]: 1, [l.key]: 1, [m.key]: 1, [x.key]: 1 },
      [q.key, u.key],
      { [s0.key]: 1, [w0.key]: 1 },
    );
    // s1 persisted (new, with c), s0 released; w rewritten to reference y, written new; a written again unchanged.
    const batch = batchOf([s1, c, w1, y, a], { [s0.key]: -1, [s1.key]: 1 });
    const step = await refcountStep(memoryTables(before), nodeBatchOf(batch), { height: H, on: true });
    expect(step.newNodes.map(hex)).toEqual(sorted([s1.key, c.key, y.key]));
    expect(step.rewritten.map(hex)).toEqual([w0.key]);
    expect(step.unchanged.map(hex)).toEqual([a.key]);
    expect(Object.fromEntries(step.deltas.map(({ key, delta }) => [hex(key), delta]))).toEqual({
      [b.key]: 1,
      [c.key]: 1,
      [u.key]: 1,
      [y.key]: 1,
      [m.key]: -1,
    });
    // q goes in round 1, m in round 2; the released s0 waits in the queue (it had a root count at h − 1).
    expect([step.deleted.map(hex), step.rounds]).toEqual([sorted([q.key, m.key]), 2]);
    expect(step.unqueued.map(hex)).toEqual(sorted([q.key, u.key]));
    expect(step.queued.map(hex)).toEqual([s0.key]);
    expect(step.counted).toBe(4);
    expect(stepOutcome(step, before, batch)).toEqual(modelOutcome(refcountModelStep(before, batch, { on: true })));
  });

  it("with sweep off deletes nothing, and the queue keeps every row with no reference and no root", async () => {
    const m = node("m");
    const q = node("q", [m.keyBytes]);
    const n = node("n");
    const before = tables([q, m], { [m.key]: 1 }, [q.key]);
    const batch = batchOf([n]);
    const step = await refcountStep(memoryTables(before), nodeBatchOf(batch), { height: H, on: false });
    expect([step.deleted, step.rounds, step.unqueued]).toEqual([[], 0, []]);
    expect(step.queued.map(hex)).toEqual([n.key]);
    expect(stepOutcome(step, before, batch)).toEqual(modelOutcome(refcountModelStep(before, batch, { on: false })));
  });

  it("deletes a queued key that is no row, with nothing to subtract (the node delete's count finds it)", async () => {
    const ghost = node("ghost");
    const before: ModelTables = { rows: new Map(), refs: new Map(), roots: new Map(), queue: new Set([ghost.key]) };
    const step = await refcountStep(memoryTables(before), nodeBatchOf(batchOf([])), { height: H, on: true });
    expect([step.deleted.map(hex), step.deltas, step.unqueued.map(hex), step.queued]).toEqual([
      [ghost.key],
      [],
      [ghost.key],
      [],
    ]);
  });

  it("refuses a batch that writes a key twice or changes a root count twice, and ignores a change of 0", async () => {
    const n = node("n");
    const empty = tables([], {}, []);
    const twice: NodeBatch = { ...nodeBatchOf(batchOf([n, n])) };
    await expect(refcountStep(memoryTables(empty), twice, { height: H, on: true })).rejects.toThrow(
      `block ${H}: the batch writes 0x${n.key} twice`,
    );
    const rootsTwice = nodeBatchOf(batchOf([n]));
    rootsTwice.rootCounts.push({ key: n.keyBytes, delta: 1 }, { key: n.keyBytes, delta: -1 });
    await expect(refcountStep(memoryTables(empty), rootsTwice, { height: H, on: true })).rejects.toThrow(
      `block ${H}: the batch changes the root count of 0x${n.key} twice`,
    );
    const zero = nodeBatchOf(batchOf([n]));
    zero.rootCounts.push({ key: n.keyBytes, delta: 0 });
    const step = await refcountStep(memoryTables(empty), zero, { height: H, on: true });
    expect(step.queued.map(hex)).toEqual([n.key]);
  });
});

describe("R12's six faults, put into the step through its tables seam, by hand (LG-14)", () => {
  /** The step with and without `fault` on the same tables and batch. */
  async function both(before: ModelTables, batch: RefcountBatch, fault: RefcountFault, on = true) {
    const options = { height: H, on };
    const right = await refcountStep(memoryTables(before), nodeBatchOf(batch), options);
    const faulty = await refcountStep(memoryTables(before, fault), nodeBatchOf(batch), options);
    return { right: stepOutcome(right, before, batch), faulty: stepOutcome(faulty, before, batch) };
  }

  it("(a) the second occurrence of a repeated child not decremented: the child outlives its parent", async () => {
    const c = node("c");
    const p = node("p", [c.keyBytes, c.keyBytes]);
    const before = tables([p, c], { [c.key]: 2 }, [p.key]);
    const { right, faulty } = await both(before, batchOf([]), "second-occurrence-not-decremented");
    expect(right.deleted).toEqual(sorted([p.key, c.key]));
    expect(faulty.deleted).toEqual([p.key]);
    expect(faulty.counts).toEqual([[c.key, 1]]);
    expect(faulty.queue).toEqual([]);
  });

  it("(a) also in a rewrite: a dropped repeated child keeps one count it no longer has", async () => {
    const c = node("c");
    const w0 = node("w", [c.keyBytes, c.keyBytes]);
    const w1 = node("w", [{ tree: [], data: c.data }, { tree: [], data: c.data }]);
    const before = tables([w0, c], { [c.key]: 2 }, [], { [w0.key]: 1 });
    const { right, faulty } = await both(before, batchOf([w1]), "second-occurrence-not-decremented");
    expect([right.counts, right.queue]).toEqual([[], [c.key]]);
    expect([faulty.counts, faulty.queue]).toEqual([[[c.key, 1]], []]);
  });

  it("(b) a node written again unchanged counted: its references counted a second time", async () => {
    const c = node("c");
    const p = node("p", [c.keyBytes]);
    const before = tables([p, c], { [c.key]: 1 }, [], { [p.key]: 1 });
    const { right, faulty } = await both(before, batchOf([p]), "unchanged-counted");
    expect([right.unchanged, right.deltas]).toEqual([[p.key], []]);
    expect([faulty.unchanged, faulty.deltas, faulty.counts]).toEqual([[p.key], [[c.key, 1]], [[c.key, 2]]]);
  });

  it("(c) a repeated child counted once per parent on increment, per occurrence on decrement", async () => {
    const c = node("c");
    const p = node("p", [c.keyBytes, c.keyBytes]);
    const before = tables([c], {}, [c.key]);
    const { right, faulty } = await both(before, batchOf([p], { [p.key]: 1 }), "increment-once-per-parent");
    expect(right.counts).toEqual([[c.key, 2]]);
    expect(faulty.counts).toEqual([[c.key, 1]]);
    // Its parent deleted later, the count reaches 0 early and then below it.
    const after = tables([p, c], { [c.key]: 1 }, [p.key]);
    expect(await stepOrHalt(after, batchOf([]), { height: H, on: true, fault: "increment-once-per-parent" })).toEqual({
      reason: "negative-count",
      key: c.key,
    });
  });

  it("(d) a released state's rows deleted in the block that releases it", async () => {
    const l = node("l");
    const a = node("a", [l.keyBytes]);
    const s0 = node("s0", [a.keyBytes]);
    const s1 = node("s1");
    const before = tables([s0, a, l], { [a.key]: 1, [l.key]: 1 }, [], { [s0.key]: 1 });
    const { right, faulty } = await both(before, batchOf([s1], { [s0.key]: -1, [s1.key]: 1 }), "released-in-block");
    expect([right.deleted, right.queue]).toEqual([[], [s0.key]]);
    expect(faulty.deleted).toEqual(sorted([s0.key, a.key, l.key]));
  });

  it("(e) a queued key that a new node references deleted in the same block: missing-reference halts", async () => {
    const q = node("q");
    const other = node("other"); // queued too, which no new node references: deleted either way
    const n = node("n", [q.keyBytes]);
    const before = tables([q, other], {}, [q.key, other.key]);
    const batch = batchOf([n], { [n.key]: 1 });
    const right = await stepOrHalt(before, batch, { height: H, on: true });
    expect(right).toMatchObject({ deleted: [other.key], counts: [[q.key, 1]], queue: [] });
    expect(await stepOrHalt(before, batch, { height: H, on: true, fault: "referenced-queued-deleted" })).toEqual({
      reason: "missing-reference",
      key: q.key,
    });
  });

  it("(f) the cascade stopped after its first round: the rows only the deleted ones referenced wait", async () => {
    const c = node("c");
    const q = node("q", [c.keyBytes]);
    const { right, faulty } = await both(tables([q, c], { [c.key]: 1 }, [q.key]), batchOf([]), "first-round-only");
    expect([right.deleted, right.rounds]).toEqual([sorted([q.key, c.key]), 2]);
    expect([faulty.deleted, faulty.rounds, faulty.queue]).toEqual([[q.key], 1, [c.key]]);
  });

  it("without sweep on, a fault of the cascade deletes nothing", async () => {
    const c = node("c");
    const q = node("q", [c.keyBytes]);
    const { faulty } = await both(tables([q, c], { [c.key]: 1 }, [q.key]), batchOf([]), "first-round-only", false);
    expect(faulty.deleted).toEqual([]);
  });
});
