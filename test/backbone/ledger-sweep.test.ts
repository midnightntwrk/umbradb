import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  BYTE_ORDER,
  type GreyPicker,
  SWEEP_BUDGET,
  type SweepState,
  sweepReset,
  sweepStep,
  type SweepTables,
  type SweepWrites,
  writeSweep,
} from "../../src/backbone/core-ledger-state/sweep.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { encodeChildren, nodeKey } from "../ledger/node-format.js";
import { type ModelBatch, type ModelSnapshot, SweepModel } from "./sweep-model.js";
import { stateNodes } from "../ledger/fixtures/sweep-fixture.js";

/**
 * LG-14's step on its own (task 12.5; `openspec/changes/core-arch/specs/ledger/spec.md` LG-14, acceptance A105):
 * `sweepStep` over tables kept in memory here — what the database holds at h − 1 —, its writes applied as the
 * database applies them, against the reference model of `./sweep-model.ts` after every block: on task 12.5's DAG
 * fixture with K = 50, on hand-made cases, and on random histories (fast-check, seed 20261027: random DAGs, missing
 * nodes, rising and falling root counts, budgets from 1, `sweep` turned off and on). The process tests
 * (`ledger-sweep-process.test.ts`) run the SQL tables on PostgreSQL and PGlite.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const unhex = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));

/** What the database holds at a height, in memory, with the statements' meaning (see the module comment). */
class MemoryTables implements SweepTables {
  sweep: SweepState = { cycle: 0n, phase: "idle", sweepAfter: null };
  readonly nodes = new Map<string, Uint8Array>();
  readonly counts = new Map<string, number>();
  readonly grey = new Set<string>();
  readonly marks = new Set<string>();

  async state(): Promise<SweepState> {
    return this.sweep;
  }
  async roots(): Promise<Uint8Array[]> {
    return [...this.counts.keys()].sort().map(unhex);
  }
  async smallestGrey(limit: number): Promise<Uint8Array[]> {
    return [...this.grey].sort().slice(0, limit).map(unhex);
  }
  async allGrey(): Promise<Uint8Array[]> {
    return [...this.grey].sort().map(unhex);
  }
  async flags(keys: readonly Uint8Array[]): Promise<Map<string, { grey: boolean; marked: boolean }>> {
    return new Map(keys.map(hex).map((k) => [k, { grey: this.grey.has(k), marked: this.marks.has(k) }]));
  }
  async children(keys: readonly Uint8Array[]): Promise<Map<string, Uint8Array>> {
    return new Map(keys.map(hex).filter((k) => this.nodes.has(k)).map((k) => [k, this.nodes.get(k) as Uint8Array]));
  }
  async scan(after: Uint8Array | null, limit: number): Promise<{ key: Uint8Array; marked: boolean }[]> {
    const from = after === null ? null : hex(after);
    const keys = [...this.nodes.keys()].sort().filter((k) => from === null || k > from).slice(0, limit);
    return keys.map((k) => ({ key: unhex(k), marked: this.marks.has(k) }));
  }
  /** The block's batch, then its sweep writes, as `on-db-write` writes them. */
  write(batch: NodeBatch, writes: SweepWrites | null): void {
    for (const node of batch.inserts) if (!this.nodes.has(hex(node.key))) this.nodes.set(hex(node.key), node.children);
    for (const { key, delta } of batch.rootCounts) {
      const count = (this.counts.get(hex(key)) ?? 0) + delta;
      if (count === 0) this.counts.delete(hex(key));
      else this.counts.set(hex(key), count);
    }
    if (writes === null) return;
    if (writes.greyAll) this.grey.clear();
    for (const key of writes.greyDeleted) this.grey.delete(hex(key));
    for (const key of writes.greyInserted) this.grey.add(hex(key));
    if (writes.marksCleared) this.marks.clear();
    for (const key of writes.marksInserted) this.marks.add(hex(key));
    for (const key of writes.deleted) this.nodes.delete(hex(key));
    this.sweep = writes.after;
  }
  snapshot(): Omit<ModelSnapshot, "deleted"> {
    return {
      cycle: this.sweep.cycle,
      phase: this.sweep.phase,
      sweepAfter: this.sweep.sweepAfter === null ? null : hex(this.sweep.sweepAfter),
      grey: [...this.grey].sort(),
      marks: [...this.marks].sort(),
      nodes: [...this.nodes.keys()].sort(),
    };
  }
}

/** One block for both: its batch, and whether `sweep` is on at it. */
interface Block {
  readonly batch: NodeBatch;
  readonly on: boolean;
}

const modelBatch = (batch: NodeBatch): ModelBatch => ({
  inserts: batch.inserts.map((n) => ({ key: hex(n.key), children: n.children })),
  deltas: batch.rootCounts.map((c) => ({ key: hex(c.key), delta: c.delta })),
});

/** Runs `blocks` through the step and the model; the first block whose states differ, or null, and every step's writes. */
async function compare(blocks: readonly Block[], budget: number, picker: GreyPicker = BYTE_ORDER) {
  const tables = new MemoryTables();
  const model = new SweepModel(budget);
  const steps: SweepWrites[] = [];
  let wasOn = true;
  for (const [h, block] of blocks.entries()) {
    let writes: SweepWrites | null = null;
    if (block.on) writes = await sweepStep(tables, block.batch, { budget, picker });
    else if (wasOn) writes = sweepReset(await tables.state());
    wasOn = block.on;
    tables.write(block.batch, writes);
    const expected = model.block(modelBatch(block.batch), block.on);
    const { deleted, ...rest } = expected;
    if (JSON.stringify(tables.snapshot(), bigints) !== JSON.stringify(rest, bigints)) return { differs: h, steps, tables, expected };
    if (writes !== null) {
      steps.push(writes);
      expect(writes.deleted.map(hex).sort()).toEqual(deleted);
    } else expect(deleted).toEqual([]);
  }
  return { differs: null, steps, tables, expected: model.snapshot() };
}

const bigints = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}` : value);

/** The fixture's blocks (task 12.5's DAG, `retainStates` 0), each batch what a package storing exactly the model's nodes flushes. */
function fixtureBlocks(last: number, on: (h: number) => boolean = () => true): Block[] {
  const stored = new Set<string>();
  const blocks: Block[] = [];
  for (let h = 0; h <= last; h++) {
    const nodes = stateNodes(h);
    const root = nodes[0]?.key as Uint8Array;
    const inserts = nodes.filter((n) => !stored.has(hex(n.key))).map((n) => ({ key: n.key, data: n.data, children: n.children }));
    for (const node of inserts) stored.add(hex(node.key));
    const rootCounts = [{ key: root, delta: 1 }, ...(h === 0 ? [] : [{ key: stateNodes(h - 1)[0]?.key as Uint8Array, delta: -1 }])];
    blocks.push({ batch: { inserts, rootCounts }, on: on(h) });
  }
  return blocks;
}

/** A node over `children` (by reference), its key the format's. */
function node(label: string, children: readonly Uint8Array[] = []) {
  const data = Uint8Array.from(Buffer.from(label));
  return { key: nodeKey(data, [...children]), data, children: encodeChildren(children.map((ref) => ({ ref }))) };
}

describe("LG-14's fixed-budget mark-and-sweep step (task 12.5)", () => {
  it("is the reference model's after every block of task 12.5's DAG fixture, K = 50: wide trees, a new root every block", async () => {
    const run = await compare(fixtureBlocks(100), 50);
    expect(run.differs).toBeNull();
    // The fixture is what A105 asks of it: a marking round larger than the budget, cycles that complete, deletions.
    expect(run.steps.some((step) => step.greyInserted.length > 50)).toBe(true);
    expect(run.expected.cycle).toBeGreaterThanOrEqual(4n);
    expect(run.steps.reduce((n, step) => n + step.deleted.length, 0)).toBeGreaterThan(500);
    expect(SWEEP_BUDGET).toBe(10_000);
  });

  it("marks a grey key with no stored node and adds nothing for it; spends one unit per key visited and per node scanned", async () => {
    const leaf = node("leaf");
    const missing = new Uint8Array(32).fill(0xee);
    const root = node("root", [leaf.key, missing]);
    const tables = new MemoryTables();
    const step = await sweepStep(tables, { inserts: [root, leaf], rootCounts: [{ key: root.key, delta: 1 }] }, { budget: 3 });
    // The root (1), then its two children (2): the missing one marked like the leaf; budget gone, no scan.
    expect(step.after).toEqual({ cycle: 1n, phase: "mark", sweepAfter: null });
    expect(step.marksInserted.map(hex).sort()).toEqual([hex(root.key), hex(leaf.key), hex(missing)].sort());
    expect(step.greyInserted).toEqual([]);
    expect(step.units).toBe(3);
    tables.write({ inserts: [root, leaf], rootCounts: [{ key: root.key, delta: 1 }] }, step);
    // Next block: the grey set is empty: the scan takes the two stored nodes, fewer than the budget, and ends the cycle.
    const next = await sweepStep(tables, { inserts: [], rootCounts: [] }, { budget: 3 });
    expect(next.after).toEqual({ cycle: 1n, phase: "idle", sweepAfter: null });
    expect(next.marksCleared).toBe(true);
    expect(next.deleted).toEqual([]);
    expect(next.units).toBe(2);
  });

  it("does not end the cycle when the scan fills the budget exactly; the next block's empty scan ends it with nothing spent", async () => {
    const a = node("a");
    const b = node("b");
    const tables = new MemoryTables();
    const batch = { inserts: [a, b], rootCounts: [{ key: a.key, delta: 1 }] };
    const first = await sweepStep(tables, batch, { budget: 3 });
    // a marked (1 unit), then the scan of both stored nodes (2): b unmarked, deleted; the budget exactly used.
    expect(first.deleted.map(hex)).toEqual([hex(b.key)]);
    expect(first.after.phase).toBe("sweep");
    expect(first.after.sweepAfter).not.toBeNull();
    tables.write(batch, first);
    const second = await sweepStep(tables, { inserts: [], rootCounts: [] }, { budget: 3 });
    expect([second.after.phase, second.units, second.marksCleared]).toEqual(["idle", 0, true]);
  });

  it("marks the roots that rose during the sweep before it scans again", async () => {
    const tables = new MemoryTables();
    const blocks = fixtureBlocks(12);
    const steps: SweepWrites[] = [];
    for (const block of blocks) {
      const step = await sweepStep(tables, block.batch, { budget: 50 });
      steps.push(step);
      tables.write(block.batch, step);
    }
    // In the sweep phase each block's new root is visited (marked) before any node is scanned.
    const sweeping = steps.filter((step, i) => i > 0 && steps[i - 1]?.after.phase === "sweep");
    expect(sweeping.length).toBeGreaterThan(0);
    for (const step of sweeping) expect(step.marksInserted.length + (step.marksCleared ? 1 : 0)).toBeGreaterThan(0);
  });

  it("clears its sets at the first block with sweep off, then changes nothing; on again, a new cycle starts", async () => {
    const run = await compare(fixtureBlocks(40, (h) => h < 5 || h > 20), 50);
    expect(run.differs).toBeNull();
    const off = sweepReset({ cycle: 3n, phase: "sweep", sweepAfter: new Uint8Array(32).fill(1) });
    expect(off).toMatchObject({ after: { cycle: 3n, phase: "idle", sweepAfter: null }, marksCleared: true, greyAll: true, deleted: [] });
  });

  it("is the reference model's on random histories (fast-check, seed 20261027)", async () => {
    const history = fc.array(
      fc.record({
        nodes: fc.array(fc.record({ children: fc.array(fc.nat(), { maxLength: 4 }), missing: fc.boolean() }), { maxLength: 5 }),
        rise: fc.array(fc.nat(), { maxLength: 2 }),
        fall: fc.array(fc.nat(), { maxLength: 2 }),
        on: fc.integer({ min: 0, max: 9 }).map((n) => n !== 0),
      }),
      { minLength: 1, maxLength: 30 },
    );
    await fc.assert(
      fc.asyncProperty(history, fc.integer({ min: 1, max: 12 }), async (blocks, budget) => {
        const universe: ReturnType<typeof node>[] = [];
        const counts = new Map<string, { key: Uint8Array; count: number }>();
        const built: Block[] = blocks.map((block, h) => {
          const inserts = block.nodes.map((spec, i) => {
            const children = spec.children.map((c) => (universe.length === 0 ? new Uint8Array(32).fill(c % 256) : (universe[c % universe.length] as { key: Uint8Array }).key));
            if (spec.missing) children.push(new Uint8Array(32).fill(200 + (i % 50)));
            const made = node(`n ${h} ${i}`, children);
            universe.push(made);
            return made;
          });
          const rootCounts: { key: Uint8Array; delta: number }[] = [];
          for (const r of block.rise) {
            if (universe.length === 0) continue;
            const key = (universe[r % universe.length] as { key: Uint8Array }).key;
            if (rootCounts.some((c) => hex(c.key) === hex(key))) continue;
            rootCounts.push({ key, delta: 1 });
          }
          const held = [...counts.values()];
          for (const f of block.fall) {
            const target = held[f % Math.max(1, held.length)];
            if (target === undefined || rootCounts.some((c) => hex(c.key) === hex(target.key))) continue;
            rootCounts.push({ key: target.key, delta: -1 });
          }
          for (const { key, delta } of rootCounts) {
            const count = (counts.get(hex(key))?.count ?? 0) + delta;
            if (count === 0) counts.delete(hex(key));
            else counts.set(hex(key), { key, count });
          }
          return { batch: { inserts, rootCounts }, on: block.on };
        });
        const run = await compare(built, budget);
        expect(run.differs).toBeNull();
      }),
      { seed: 20261027, numRuns: 400 },
    );
  });

  it("writes its sets, deletions and row in on-db-write: grey and marks, nodes deleted, the row; marks cleared at the cycle's end", async () => {
    const statements: { sql: string; params: unknown[] }[] = [];
    const w = { execute: async (sql: string, params: unknown[] = []) => (statements.push({ sql, params }), 1) };
    const key = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
    await writeSweep(w, {
      before: { cycle: 1n, phase: "mark", sweepAfter: null },
      after: { cycle: 1n, phase: "sweep", sweepAfter: key(9) },
      greyInserted: [key(1)],
      greyDeleted: [key(2)],
      greyAll: false,
      marksInserted: [key(3)],
      marksCleared: false,
      deleted: [key(4)],
      units: 3,
    });
    expect(statements.map((s) => s.sql.split(" ").slice(0, 3).join(" "))).toEqual([
      "DELETE FROM core_ledger_state.grey",
      "INSERT INTO core_ledger_state.grey",
      "INSERT INTO core_ledger_state.marks",
      "DELETE FROM core_ledger_state.nodes",
      "UPDATE core_ledger_state.sweep SET",
    ]);
    expect(statements.map((s) => s.params)).toEqual([[[key(2)]], [[key(1)]], [[key(3)]], [[key(4)]], [1n, "sweep", key(9)]]);
    statements.length = 0;
    await writeSweep(w, { ...sweepReset({ cycle: 2n, phase: "sweep", sweepAfter: key(5) }) });
    expect(statements.map((s) => s.sql)).toEqual([
      "DELETE FROM core_ledger_state.grey",
      "DELETE FROM core_ledger_state.marks",
      "UPDATE core_ledger_state.sweep SET cycle = $1, phase = $2, sweep_after = $3 WHERE id = 1",
    ]);
  });
});
