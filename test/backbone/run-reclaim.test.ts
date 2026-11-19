import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { keyBytes, keyText, KnownKeySet, type NetWrite, RunReclaim, type RunTables, sqlRunTables, writeNet } from "../../src/backbone/core-ledger-state/run-reclaim.js";
import { NODES_TABLE, REF_COUNTS_TABLE, UNREFERENCED_TABLE } from "../../src/backbone/core-ledger-state/sql.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { refcountStep } from "./refcount-step.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type FixtureDag, LAST, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import { type HistoryScript, historyScripts, nodeSet, type RefcountBatch, RefcountModel } from "./refcount-model.js";
import {
  applied,
  embedded,
  flushOf,
  followsFlushRule,
  haltReason,
  inconsistencies,
  inRuns,
  made,
  madeBlocks,
  type MadeNode,
  type ModelBlock,
  modelBlocks,
  NO_TABLES,
  type NodeTables,
  noReads,
  ref,
  type Remade,
  remadeAgainstModel,
  runsOf,
  runTables,
  stepped,
  stepTables,
  tableDifferences,
  withChanges,
} from "./run-reclaim.js";

/**
 * The reclamation of a run of blocks (`src/backbone/core-ledger-state/run-reclaim.ts`) against the per-block step
 * (`refcountStep`, `./refcount-step.ts`) and the reference model (`./refcount-model.ts`), the
 * computation on its own: nothing here runs the process. These are the cases the mutation run takes for each mutant
 * of the computation (`vitest.mutation.config.ts`); the long cases on the generated histories, in runs of many
 * lengths, are in `./run-reclaim-histories.test.ts`.
 * - **T1.** At every run's end the node tables are the model's after the run's last block, on the fixture DAGs: in
 *   bytes while each key has one child list, and for a run of one block.
 * - **T2.** A run of one block gives the per-block step's result (`refcountStep`'s outputs and the model's tables)
 *   for every block of every generated history that follows the ledger package's flush rule, rewrites included; a
 *   block that does not follow it halts with `unreached-node`.
 * - **T4.** A run that does not sweep deletes nothing and does not read the queue whole, and the record refuses a
 *   block of another setting.
 * - **What each read asks for:** on a few hand-made runs, every read with its keys, in order: each step asks for the
 *   keys it needs, and no read is made for no key.
 * - **The net write's statements** (`writeNet`), on a handle that records them: lists in statements of 1,000 keys,
 *   and a statement whose rows differ from the computed halts.
 * - **By hand:** the cases a rule turns on, each a few blocks: the last child list written wins; a key that a list
 *   replaced by the last block referenced is kept and queued, one replaced earlier is not; the flush rule and what
 *   it lets through; the checks that halt, a reference and a count judged at each block, so that the run halts
 *   naming the block at which the per-block step halts, and of several, the key it names; damaged tables where the
 *   run is the per-block step.
 *
 * The negative controls are in `./run-reclaim.negative-control.test.ts`.
 */

const SEED = 20261115;
const RUNS = 120;

const bytes = (key: string): Uint8Array => Uint8Array.from(Buffer.from(key, "hex"));
const same = (a: Uint8Array, b: Uint8Array): boolean => Buffer.compare(a, b) === 0;

describe("T1: the run computation's tables are the reference model's at every run's end", () => {
  for (const dag of ["original", "extended", "one-form"] as const satisfies readonly FixtureDag[]) {
    it(`on the ${dag} fixture DAG: in bytes while each key has one child list, and for a run of one block; the same node set otherwise`, async () => {
      // Each block's flush is what a package storing exactly the model's rows flushes: the state's nodes the model
      // does not hold with that child list, the new root persisted and the one before released.
      const model = new RefcountModel();
      const blocks: { height: number; on: boolean; before: NodeTables; flushed: RefcountBatch; after: NodeTables; afterRoots: ReadonlyMap<string, number> }[] = [];
      const lists = new Map<string, Uint8Array>();
      let twoFormsFrom: number | null = null;
      let previous: string | null = null;
      for (let h = 0; h <= LAST; h++) {
        const nodes = stateNodes(h, dag);
        const root = hex((nodes[0] as { key: Uint8Array }).key);
        const before = model.tables;
        const inserts = nodes
          .filter((node) => {
            const stored = before.rows.get(hex(node.key));
            return stored === undefined || !same(stored, node.children);
          })
          .map((node) => ({ key: hex(node.key), children: node.children }));
        for (const { key, children } of inserts) {
          const first = lists.get(key);
          if (first === undefined) lists.set(key, children);
          else if (!same(first, children)) twoFormsFrom ??= h;
        }
        const flushed: RefcountBatch = {
          inserts,
          rootCounts: [{ key: root, delta: 1 }, ...(previous === null || previous === root ? [] : [{ key: previous, delta: -1 }])],
        };
        const step = model.block(flushed, true);
        blocks.push({ height: h, on: true, before, flushed, after: step.after, afterRoots: step.after.roots });
        previous = root;
      }
      // The extended DAG alone rewrites a node in its other form.
      expect(twoFormsFrom === null).toBe(dag !== "extended");
      for (const size of [1, 4, 10, 50, 1_000]) {
        let mine: NodeTables = NO_TABLES;
        let inserted = 0;
        let handed = 0;
        // From the first run that holds a key in two forms, the bytes may differ from the per-block step's.
        let exact = true;
        for (const run of runsOf(blocks, size)) {
          const first = run[0] as (typeof blocks)[number];
          const last = run.at(-1) as (typeof blocks)[number];
          const reclaim = new RunReclaim({ first: BigInt(first.height), on: true });
          for (const block of run) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
          const outcome = await reclaim.compute(runTables(mine, last.afterRoots));
          const next = applied(mine, outcome.net);
          const where = `after ${last.height}, runs of ${size}`;
          expect(next.problems, where).toEqual([]);
          if (size > 1 && twoFormsFrom !== null && last.height >= twoFormsFrom) exact = false;
          if (exact) expect(tableDifferences(next.tables, last.after), where).toEqual([]);
          else {
            expect(inconsistencies(next.tables, last.afterRoots), where).toEqual([]);
            expect([...nodeSet(next.tables.rows)].sort(), where).toEqual([...nodeSet(last.after.rows)].sort());
          }
          inserted += outcome.net.inserts.length;
          handed += outcome.handed;
          mine = next.tables;
        }
        // Every block brings a new root and deletes the root two blocks before: inside a run they are never written.
        if (size === 1) expect(inserted).toBe(handed);
        if (size >= 10) expect(inserted).toBeLessThan(handed * 0.9);
      }
    }, 120_000);
  }
});

describe("T2: a run of one block is the per-block step", () => {
  for (const [name, options] of [
    ["in one form", { oneForm: true }],
    ["with every case of the model", { oneForm: false }],
    ["in two forms under the flush rule", { oneForm: false, flushRule: true }],
  ] as const) {
    it(`on the generated histories ${name}: the step's outputs and the model's tables where the block follows the flush rule, a halt where it does not (seed ${SEED}, ${RUNS} runs)`, async () => {
      const seen = { followed: 0, rewrites: 0, deletions: 0, off: 0, halted: 0 };
      await fc.assert(
        fc.asyncProperty(historyScripts(options), async (script) => {
          for (const block of modelBlocks(script)) {
            const where = `block ${block.height}`;
            const reclaim = new RunReclaim({ first: BigInt(block.height), on: block.on });
            const compute = async () => {
              reclaim.collect(BigInt(block.height), flushOf(block.flushed), block.on);
              return reclaim.compute(runTables(block.before, block.step.after.roots));
            };
            if (!followsFlushRule(block.before.rows, block.flushed)) {
              const reason = await compute().then(
                () => "no halt",
                (error: unknown) => haltReason(error) ?? String(error),
              );
              expect(reason, where).toBe("unreached-node");
              seen.halted += 1;
              continue;
            }
            const outcome = await compute();
            // The model's tables after the block.
            const next = applied(block.before, outcome.net);
            expect(next.problems, where).toEqual([]);
            expect(tableDifferences(next.tables, block.step.after), where).toEqual([]);
            expect(outcome.evict.map(hex), where).toEqual(block.step.deleted);
            // The per-block step's own outputs.
            const step = await refcountStep(stepTables(block.before, block.before.roots), flushOf(block.flushed), { height: BigInt(block.height), on: block.on });
            const gone = new Set(step.deleted.map(hex));
            expect(outcome.net.inserts.map((node) => hex(node.key)), where).toEqual(
              [...step.newNodes, ...step.rewritten].map(hex).filter((key) => !gone.has(key)).sort(),
            );
            expect(outcome.net.deltas.map(({ key, delta }) => [hex(key), delta]), where).toEqual(step.deltas.map(({ key, delta }) => [hex(key), delta]));
            expect(outcome.net.counted, where).toBe(step.counted);
            expect(outcome.net.unqueued.map(hex), where).toEqual(step.unqueued.map(hex));
            expect(outcome.net.queued.map(hex), where).toEqual(step.queued.map(hex));
            expect(outcome.evict.map(hex), where).toEqual(step.deleted.map(hex));
            expect(outcome.rounds, where).toBe(step.rounds);
            expect([outcome.newNodes, outcome.rewrittenNodes, outcome.unchangedNodes], where).toEqual([step.newNodes.length, step.rewritten.length, step.unchanged.length]);
            expect(outcome.newKeys.map(hex), where).toEqual(step.newNodes.map(hex));
            seen.followed += 1;
            seen.rewrites += step.rewritten.length;
            seen.deletions += step.deleted.length;
            seen.off += block.on ? 0 : 1;
          }
        }),
        { seed: SEED, numRuns: RUNS },
      );
      expect(seen.followed).toBeGreaterThan(500);
      expect(seen.deletions).toBeGreaterThan(1_000);
      expect(seen.off).toBeGreaterThan(50);
      // Rewrites are in the comparison wherever the history has them, and the blocks outside the flush rule halt.
      if (options.oneForm) expect([seen.rewrites, seen.halted]).toEqual([0, 0]);
      else expect(seen.rewrites).toBeGreaterThan(100);
      if (name === "with every case of the model") expect(seen.halted).toBeGreaterThan(50);
      if (name === "in two forms under the flush rule") expect(seen.halted).toBe(0);
    }, 900_000);
  }
});

describe("T4: sweep off, and a change of sweep", () => {
  it("a run that does not sweep keeps every node, counts and queues, reads no queue whole, and deletes nothing", async () => {
    // A state over two leaves, then a second state over one of them: with sweep off the first state stays, queued.
    const leaf = (name: string) => ({ key: nodeKey(Buffer.from(name), []), children: encodeChildren([]) });
    const over = (name: string, children: readonly { key: Uint8Array }[]) => ({
      key: nodeKey(Buffer.from(name), children.map((child) => child.key)),
      children: encodeChildren(children.map((child) => ({ ref: child.key }))),
    });
    const [a, b] = [leaf("a"), leaf("b")];
    const one = over("state 1", [a, b]);
    const two = over("state 2", [a]);
    const data = Uint8Array.of(7);
    const reads = noReads();
    const reclaim = new RunReclaim({ first: 5n, on: false });
    reclaim.collect(5n, { inserts: [a, b, one].map((node) => ({ ...node, data })), rootCounts: [{ key: one.key, delta: 1 }] }, false);
    reclaim.collect(6n, { inserts: [{ ...two, data }], rootCounts: [{ key: two.key, delta: 1 }, { key: one.key, delta: -1 }] }, false);
    const outcome = await reclaim.compute(runTables(NO_TABLES, new Map([[hex(two.key), 1]]), reads));
    expect([outcome.evict, outcome.net.deleted, outcome.rounds]).toEqual([[], [], 0]);
    expect(outcome.net.inserts.map((node) => hex(node.key)).sort()).toEqual([a, b, one, two].map((node) => hex(node.key)).sort());
    expect(outcome.net.queued.map(hex)).toEqual([hex(one.key)]);
    expect(new Map(outcome.net.deltas.map(({ key, delta }) => [hex(key), delta]))).toEqual(new Map([[hex(a.key), 2], [hex(b.key), 1]]));
    expect([reads.queue, reads.queued]).toEqual([0, 1]);
    // The same two blocks in a run that sweeps: the first state is still stored (the last block released it), queued.
    const sweepingRun = new RunReclaim({ first: 5n, on: true });
    sweepingRun.collect(5n, { inserts: [a, b, one].map((node) => ({ ...node, data })), rootCounts: [{ key: one.key, delta: 1 }] }, true);
    sweepingRun.collect(6n, { inserts: [{ ...two, data }], rootCounts: [{ key: two.key, delta: 1 }, { key: one.key, delta: -1 }] }, true);
    const swept = await sweepingRun.compute(runTables(NO_TABLES, new Map([[hex(two.key), 1]])));
    expect([swept.evict, swept.net.queued.map(hex)]).toEqual([[], [hex(one.key)]]);
  });

  it("the record takes the heights from its first one at a time, knows its last only as the last handed over, and refuses a block whose sweep is not the run's, a computation of no block, and a second one", async () => {
    const reclaim = new RunReclaim({ first: 10n, on: true });
    const empty = { inserts: [], rootCounts: [] };
    // Nothing handed over: no heights, and nothing to compute.
    expect([reclaim.first, reclaim.heights, reclaim.blocks, reclaim.next]).toEqual([10n, undefined, 0, 10n]);
    await expect(reclaim.compute(runTables(NO_TABLES, new Map()))).rejects.toThrow(/the run from block 10 has no block handed over/);
    // Each block is the one after the block before, from the first: any other height is refused.
    for (const height of [9n, 11n]) expect(() => reclaim.collect(height, empty, true)).toThrow(RangeError);
    expect(() => reclaim.collect(11n, empty, true)).toThrow(/block 11: the run from block 10 expects block 10/);
    reclaim.collect(10n, empty, true);
    expect(reclaim.heights).toEqual({ first: 10n, last: 10n });
    for (const height of [10n, 12n]) expect(() => reclaim.collect(height, empty, true)).toThrow(RangeError);
    expect(() => reclaim.collect(11n, empty, false)).toThrow(/block 11: the run from block 10 sweeps and the block does not: a run holds one setting of sweep/);
    expect(() => new RunReclaim({ first: 0n, on: false }).collect(0n, empty, true)).toThrow(/does not sweep and the block does: a run holds one setting of sweep/);
    reclaim.collect(11n, empty, true);
    reclaim.collect(12n, empty, true);
    expect([reclaim.heights, reclaim.blocks, reclaim.next]).toEqual([{ first: 10n, last: 12n }, 3, 13n]);
    const outcome = await reclaim.compute(runTables(NO_TABLES, new Map()));
    expect([outcome.net.height, outcome.net.inserts, outcome.net.deltas, outcome.evict, outcome.handed]).toEqual([12n, [], [], [], 0]);
    await expect(reclaim.compute(runTables(NO_TABLES, new Map()))).rejects.toThrow(/computed already/);
    expect(() => reclaim.collect(13n, empty, true)).toThrow(/computed already/);
    expect(reclaim.heights).toEqual({ first: 10n, last: 12n });
    // A flush that is not one: a key written twice, a root count changed twice, a key that is not 32 bytes.
    const key = new Uint8Array(32).fill(3);
    const node = { key, data: Uint8Array.of(7), children: Uint8Array.of(0) };
    const refuses = (flushed: Parameters<RunReclaim["collect"]>[1]): (() => void) => () => new RunReclaim({ first: 0n, on: true }).collect(0n, flushed, true);
    expect(refuses({ inserts: [node, { ...node }], rootCounts: [] })).toThrow(/writes 0x0303\w+ twice/);
    expect(refuses({ inserts: [], rootCounts: [{ key, delta: 1 }, { key: key.slice(), delta: -1 }] })).toThrow(/changes the root count of 0x0303\w+ twice/);
    expect(refuses({ inserts: [{ ...node, key: key.subarray(0, 31) }], rootCounts: [] })).toThrow(/a node key is 32 bytes, not 31/);
    // A root-count change of 0 is none: the key's counts are not read.
    const still = new RunReclaim({ first: 0n, on: true });
    still.collect(0n, { inserts: [], rootCounts: [{ key, delta: 0 }] }, true);
    const reads = noReads();
    expect((await still.compute(runTables(NO_TABLES, new Map(), reads))).net.queued).toEqual([]);
    expect([reads.queue, reads.counts]).toEqual([1, 0]);
  });
});

describe("the run's record and its reads", () => {
  it(`reads the same keys whatever else the database stores: a run on its tables, and on those tables with 3,000 rows more (seed ${SEED})`, async () => {
    // The rows more: a root over leaves no history references, with their counts and the root's root count.
    const leaves = Array.from({ length: 2_999 }, (_, n) => nodeKey(Buffer.from(`elsewhere ${n}`), []));
    const top = { key: nodeKey(Buffer.from("elsewhere"), leaves), children: encodeChildren(leaves.map((ref) => ({ ref }))) };
    const more = (found: NodeTables): NodeTables => ({
      rows: new Map([...found.rows, [hex(top.key), top.children], ...leaves.map((leaf) => [hex(leaf), encodeChildren([])] as const)]),
      refs: new Map([...found.refs, ...leaves.map((leaf) => [hex(leaf), 1] as const)]),
      queue: found.queue,
    });
    let runs = 0;
    await fc.assert(
      fc.asyncProperty(historyScripts({ oneForm: true }), async (script) => {
        const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
        const run = blocks.slice(Math.floor(blocks.length / 2));
        const first = run[0] as ModelBlock;
        const last = run.at(-1) as ModelBlock;
        const ask = async (found: NodeTables, roots: ReadonlyMap<string, number>) => {
          const reads = noReads();
          const reclaim = new RunReclaim({ first: BigInt(first.height), on: true });
          for (const block of run) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
          const outcome = await reclaim.compute(runTables(found, roots, reads));
          return { reads, outcome };
        };
        const small = await ask(first.before, last.step.after.roots);
        const large = await ask(more(first.before), new Map([...last.step.after.roots, [hex(top.key), 1]]));
        expect(large.reads).toEqual(small.reads);
        expect(large.outcome.evict.map(hex)).toEqual(small.outcome.evict.map(hex));
        expect(large.outcome.net.deltas.length).toBe(small.outcome.net.deltas.length);
        expect(tableDifferences(applied(first.before, small.outcome.net).tables, last.step.after)).toEqual([]);
        runs += 1;
      }),
      { seed: SEED, numRuns: 40 },
    );
    expect(runs).toBe(40);
  }, 300_000);

  it("keeps a key's text as its bytes, one character each, in the bytes' order", () => {
    const keys = [0, 0x7f, 0x80, 0x9f, 0xa0, 0xff].map((byte) => new Uint8Array(32).fill(byte));
    expect(keys.map((key) => hex(keyBytes(keyText(key))))).toEqual(keys.map(hex));
    expect(keys.map(keyText).every((text) => text.length === 32)).toBe(true);
    expect([...keys].reverse().map(keyText).sort()).toEqual(keys.map(keyText));
    // A view into a larger buffer reads the view's bytes only.
    const padded = new Uint8Array(40).fill(1);
    padded.set(keys[3] as Uint8Array, 4);
    expect(keyText(padded.subarray(4, 36))).toBe(keyText(keys[3] as Uint8Array));
  });

  it("reads the database in statements of 1,000 keys at most, none for no key, and the queue in one", async () => {
    const asked: { sql: string; keys: number }[] = [];
    const tables = sqlRunTables({
      query: async (sql, params) => {
        asked.push({ sql, keys: ((params ?? [])[0] as readonly unknown[] | undefined)?.length ?? 0 });
        return [];
      },
    });
    const keys = Array.from({ length: 2_500 }, (_, n) => nodeKey(Buffer.from(`key ${n}`), []));
    const nodes = keys.map((key) => ({ key, children: Uint8Array.of(0) }));
    for (const read of [() => tables.rows(keys), () => tables.missing(keys), () => tables.queued(keys), () => tables.counts(keys), () => tables.children(keys), () => tables.changed(nodes)]) {
      asked.length = 0;
      expect(await read()).toEqual([]);
      expect(asked.map((statement) => statement.keys)).toEqual([1_000, 1_000, 500]);
      expect(new Set(asked.map((statement) => statement.sql)).size).toBe(1);
    }
    asked.length = 0;
    for (const read of [tables.rows([]), tables.missing([]), tables.queued([]), tables.counts([]), tables.children([]), tables.changed([])]) expect(await read).toEqual([]);
    expect(asked).toEqual([]);
    await tables.queue();
    expect(asked.map((statement) => statement.sql)).toEqual(["SELECT node_key FROM core_ledger_state.unreferenced"]);
    // Which keys the queue holds, by key: the read of a run that does not sweep.
    asked.length = 0;
    await tables.queued(keys.slice(0, 3));
    expect(asked).toEqual([{ sql: "SELECT node_key FROM core_ledger_state.unreferenced WHERE node_key = ANY($1::bytea[])", keys: 3 }]);
  });

  it("keeps the keys known to be rows in a set of the run's own: after the run it holds rows of the tables after it only, none the run deleted", async () => {
    const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED, numRuns: 30 }).find((sample) => sample.blocks.length >= 15) as HistoryScript;
    const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
    let mine: NodeTables = NO_TABLES;
    let learned = 0;
    let deleted = 0;
    for (const run of runsOf(blocks, 3)) {
      const last = run.at(-1) as ModelBlock;
      const reclaim = new RunReclaim({ first: BigInt((run[0] as ModelBlock).height), on: true });
      for (const block of run) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
      const known = new KnownKeySet();
      const outcome = await reclaim.compute(runTables(mine, last.step.after.roots), known);
      const next = applied(mine, outcome.net);
      expect(tableDifferences(next.tables, last.step.after)).toEqual([]);
      // What it learned is rows the run found; each key it holds is a row after the run, and no row the run deleted.
      const held = [...mine.rows.keys()].filter((key) => known.has(keyText(bytes(key))));
      expect(held.length).toBe(known.size);
      for (const key of held) expect(next.tables.rows.has(key), key).toBe(true);
      for (const key of outcome.net.deleted) expect(known.has(keyText(key))).toBe(false);
      learned += held.length;
      deleted += outcome.net.deleted.length;
      mine = next.tables;
    }
    expect(learned).toBeGreaterThan(0);
    expect(deleted).toBeGreaterThan(0);
  });

  it("asks the database about no key the set it is given holds, and stores the same tables", async () => {
    const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED, numRuns: 30 }).find((sample) => sample.blocks.length >= 15) as HistoryScript;
    const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
    let mine: NodeTables = NO_TABLES;
    let asked = 0;
    let unasked = 0;
    for (const run of runsOf(blocks, 3)) {
      const last = run.at(-1) as ModelBlock;
      const outcomes = [];
      for (const given of [new KnownKeySet(), new KnownKeySet()]) {
        // The second set holds every row of the tables before the run.
        if (outcomes.length === 1) for (const key of mine.rows.keys()) given.learn(keyText(bytes(key)));
        const reclaim = new RunReclaim({ first: BigInt((run[0] as ModelBlock).height), on: true });
        for (const block of run) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
        const tables = runTables(mine, last.step.after.roots);
        let missing = 0;
        outcomes.push(await reclaim.compute({ ...tables, missing: async (wanted) => ((missing += wanted.length), tables.missing(wanted)) }, given));
        if (outcomes.length === 1) asked += missing;
        else unasked += missing;
      }
      const [plain, told] = outcomes as [Awaited<ReturnType<RunReclaim["compute"]>>, Awaited<ReturnType<RunReclaim["compute"]>>];
      expect(tableDifferences(applied(mine, told.net).tables, applied(mine, plain.net).tables)).toEqual([]);
      mine = applied(mine, plain.net).tables;
    }
    // With an empty set the rows a run's lists reference are asked; with the rows held, only keys that are no row.
    expect(asked).toBeGreaterThan(0);
    expect(unasked).toBeLessThan(asked);
  });

  it("the set of keys known to be rows learns, forgets and counts its keys", () => {
    const known = new KnownKeySet();
    known.learn("a");
    known.learn("b");
    known.learn("a");
    expect([known.has("a"), known.has("b"), known.has("c"), known.size]).toEqual([true, true, false, 2]);
    known.forget("a");
    known.forget("c");
    expect([known.has("a"), known.has("b"), known.size]).toEqual([false, true, 1]);
  });

  it("hands over many replacements of one key's list with work that grows with them, not with their square", async () => {
    // One parent flushed in every block, its list referencing and embedding a child by turns, its root count raised
    // at every block; the child persisted once.
    const blockCount = 2_000;
    const child = made("child");
    const [referencing, embedding] = [made("parent", [ref(child)]), made("parent", [embedded(child)])];
    const blocks = madeBlocks(
      Array.from({ length: blockCount }, (_, height) =>
        height === 0 ? { inserts: [child, referencing], persist: [child, referencing] } : { inserts: [height % 2 === 1 ? embedding : referencing], persist: [referencing] },
      ),
    );
    const reclaim = new RunReclaim({ first: 0n, on: true });
    for (const block of blocks) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
    // One entry per replaced list.
    expect(reclaim.historyWrites).toBe(blockCount - 1);
    const last = blocks.at(-1) as ModelBlock;
    const outcome = await reclaim.compute(runTables(NO_TABLES, last.step.after.roots));
    expect(tableDifferences(applied(NO_TABLES, outcome.net).tables, last.step.after)).toEqual([]);
    expect([outcome.newNodes, outcome.handed]).toEqual([2, 2]);
  });

  it("gives back no inserted node's key as a view into a buffer it was given", async () => {
    // Each key handed over is 32 bytes inside a 4,096-byte buffer, as a driver's or a package's pool would give it:
    // in its middle, and at its start.
    const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED + 1, numRuns: 30 }).find((sample) => sample.blocks.length >= 15) as HistoryScript;
    const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
    const last = blocks.at(-1) as ModelBlock;
    for (const at of [1_000, 0]) {
      const viewOf = (key: Uint8Array): Uint8Array => {
        const pool = new Uint8Array(4_096);
        pool.set(key, at);
        return pool.subarray(at, at + 32);
      };
      const reclaim = new RunReclaim({ first: 0n, on: true });
      for (const block of blocks) {
        const flush = flushOf(block.flushed);
        reclaim.collect(
          BigInt(block.height),
          { inserts: flush.inserts.map((node) => ({ ...node, key: viewOf(node.key) })), rootCounts: flush.rootCounts.map((change) => ({ ...change, key: viewOf(change.key) })) },
          true,
        );
      }
      const outcome = await reclaim.compute(runTables(NO_TABLES, last.step.after.roots));
      expect(outcome.net.inserts.length).toBeGreaterThan(0);
      for (const node of outcome.net.inserts) expect([node.key.byteOffset, node.key.buffer.byteLength], `at ${at}`).toEqual([0, 32]);
      expect(tableDifferences(applied(NO_TABLES, outcome.net).tables, last.step.after)).toEqual([]);
    }
  });

  it("keeps a key handed over as an array of its own: each inserted node's key is an array it was given, not a copy", async () => {
    const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED + 1, numRuns: 30 }).find((sample) => sample.blocks.length >= 15) as HistoryScript;
    const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
    const handed = new Set<Uint8Array>();
    const reclaim = new RunReclaim({ first: 0n, on: true });
    for (const block of blocks) {
      const flush = flushOf(block.flushed);
      for (const { key } of [...flush.inserts, ...flush.rootCounts]) handed.add(key);
      reclaim.collect(BigInt(block.height), flush, true);
    }
    const outcome = await reclaim.compute(runTables(NO_TABLES, (blocks.at(-1) as ModelBlock).step.after.roots));
    expect(outcome.net.inserts.length).toBeGreaterThan(0);
    for (const node of outcome.net.inserts) expect(handed.has(node.key), hex(node.key)).toBe(true);
  });

  it("gives back no key as a view into a buffer it was given", async () => {
    const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED + 1, numRuns: 30 }).find((sample) => sample.blocks.length >= 15) as HistoryScript;
    const blocks = modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
    const last = blocks.at(-1) as ModelBlock;
    const reclaim = new RunReclaim({ first: 0n, on: true });
    for (const block of blocks) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
    const outcome = await reclaim.compute(runTables(NO_TABLES, last.step.after.roots));
    const given = [...outcome.evict, ...outcome.net.deleted, ...outcome.net.queued, ...outcome.net.unqueued, ...outcome.net.deltas.map(({ key }) => key)];
    expect(given.length).toBeGreaterThan(0);
    for (const key of given) expect([key.byteOffset, key.buffer.byteLength]).toEqual([0, 32]);
    expect(bytes(hex(given[0] as Uint8Array))).toEqual(given[0]);
  });
});

/**
 * `tables` with each read logged as it is asked: the read's name and the names of its keys (`names`, by key; else the
 * key's first bytes), sorted.
 */
function logged(tables: RunTables, names: ReadonlyMap<string, string>): { readonly tables: RunTables; readonly log: string[] } {
  const log: string[] = [];
  const note = (read: string, keys: readonly Uint8Array[]): void => {
    log.push([read, ...keys.map((key) => names.get(hex(key)) ?? hex(key).slice(0, 12)).sort()].join(" "));
  };
  return {
    log,
    tables: {
      rows: (keys) => (note("rows", keys), tables.rows(keys)),
      changed: (nodes) => (note("changed", nodes.map((node) => node.key)), tables.changed(nodes)),
      missing: (keys) => (note("missing", keys), tables.missing(keys)),
      queue: () => (note("queue", []), tables.queue()),
      queued: (keys) => (note("queued", keys), tables.queued(keys)),
      counts: (keys) => (note("counts", keys), tables.counts(keys)),
      children: (keys) => (note("children", keys), tables.children(keys)),
    },
  };
}

describe("what each read asks for: the keys its step needs, and no read for no key", () => {
  const data = Uint8Array.of(7);
  const over = (name: string, ...children: readonly MadeNode[]) => made(name, children.map(ref));
  const flushed = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, data, children: node.children }));
  const raise = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, delta: 1 }));
  const release = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, delta: -1 }));
  const rowsOf = (...nodes: readonly MadeNode[]): Map<string, Uint8Array> => new Map(nodes.map((node) => [node.key, node.children]));
  /**
   * A run of `blocks` from block 1 on `found`, `roots` the root counts after its last block: its reads, each key named
   * after the node of `nodes` it is, and its outcome.
   */
  const readsOf = async (found: NodeTables, roots: ReadonlyMap<string, number>, blocks: readonly NodeBatch[], on: boolean, nodes: readonly MadeNode[]) => {
    const reclaim = new RunReclaim({ first: 1n, on });
    blocks.forEach((block, at) => reclaim.collect(BigInt(at + 1), block, on));
    const { tables, log } = logged(runTables(found, roots), new Map(nodes.map((node) => [node.key, Buffer.from(node.data).toString("utf8")])));
    const outcome = await reclaim.compute(tables);
    return { log, outcome };
  };
  const [c, d] = [made("c"), made("d")];

  it("an empty block: the queue alone when the run sweeps, and no read when it does not", async () => {
    expect((await readsOf(NO_TABLES, new Map(), [{ inserts: [], rootCounts: [] }], true, [])).log).toEqual(["queue"]);
    expect((await readsOf(NO_TABLES, new Map(), [{ inserts: [], rootCounts: [] }], false, [])).log).toEqual([]);
  });

  it("a block that writes a stored node in another form under a new root, and releases the old root", async () => {
    // Stored: r0 over w, whose list references c and d. The block writes w in a form that references c and embeds d,
    // under a new root r1, and releases r0.
    const [w1, w2] = [made("w", [ref(c), ref(d)]), made("w", [ref(c), embedded(d)])];
    const [r0, r1] = [over("r0", w1), over("r1", w2)];
    const found: NodeTables = { rows: rowsOf(r0, w1, c, d), refs: new Map([[w1.key, 1], [c.key, 1], [d.key, 1]]), queue: new Set() };
    const block = { inserts: flushed(w2, r1), rootCounts: [...raise(r1), ...release(r0)] };
    const nodes = [c, d, w1, r0, r1];
    const sweeping = await readsOf(found, new Map([[r1.key, 1]]), [block], true, nodes);
    expect(sweeping.log).toEqual([
      // Step 1: which of the run's nodes are rows, and which of those hold another list.
      "rows r1 w",
      "changed w",
      // Step 3: what the lists it checks reference that is no node of the run (r1 references w, a node of the run).
      "missing c",
      // Step 3's counts block by block: d, which the replaced list referenced and the new one does not; not c, which
      // both reference.
      "counts d",
      // Step 5: the queue, and the counts of the keys whose root count changed (d's are known).
      "queue",
      "counts r0 r1",
    ]);
    // r0 and d are queued: r0 released by the block, d kept by the list it replaced alone.
    expect(sweeping.outcome.net.queued.map(hex)).toEqual([d.key, r0.key].sort());
    expect(sweeping.outcome.keptByReplaced).toBe(1);
    // Without sweep: no queue read whole; the membership and the counts of the keys whose place in it can change.
    const off = await readsOf(found, new Map([[r1.key, 1]]), [block], false, nodes);
    expect(off.log).toEqual(["rows r1 w", "changed w", "missing c", "counts d", "queued d r0 r1 w", "counts r0 r1"]);
    expect(off.outcome.net.queued.map(hex)).toEqual([d.key, r0.key].sort());
    expect(off.outcome.keptByReplaced).toBe(0);
  });

  it("a cascade over rows and over the run's own nodes: lists read for rows only, counts for keys whose count falls", async () => {
    // Stored: q over k and m, queued; k over l. Block 1 writes s over l and persists it, block 2 releases s, block 3
    // writes p over m and persists it. The cascade deletes q and s, then k, then l; m keeps p's reference.
    const [l, m] = [made("l"), made("m")];
    const k = over("k", l);
    const [q, s, p] = [over("q", k, m), over("s", l), over("p", m)];
    const found: NodeTables = { rows: rowsOf(q, k, l, m), refs: new Map([[k.key, 1], [l.key, 1], [m.key, 1]]), queue: new Set([q.key]) };
    const roots = new Map([[p.key, 1]]);
    const blocks = [
      { inserts: flushed(s), rootCounts: raise(s) },
      { inserts: [], rootCounts: release(s) },
      { inserts: flushed(p), rootCounts: raise(p) },
    ];
    const { log, outcome } = await readsOf(found, roots, blocks, true, [q, k, l, m, s, p]);
    expect(log).toEqual([
      // No node of the run is a row: no list of one is compared.
      "rows p s",
      "missing l m",
      "queue",
      "counts p q s",
      // Round 1 deletes q and s: q's list is read, s's is the run's.
      "children q",
      // k's count falls; l's and m's do not (s's and p's references).
      "counts k",
      "children k",
      "counts l",
      "children l",
    ]);
    expect(outcome.rounds).toBe(3);
    expect(outcome.evict.map(hex)).toEqual([q, s, k, l].map((node) => node.key).sort());
    expect(outcome.net.deleted.map(hex)).toEqual([q, k, l].map((node) => node.key).sort());
    const next = applied(found, outcome.net);
    expect(next.problems).toEqual([]);
    expect(inconsistencies(next.tables, roots)).toEqual([]);
  });

  it("a stored node written again: unchanged, its list is not checked; replaced, its first list is not when it is the row's; in another form and back, the counts of what it referenced are followed", async () => {
    const [wReferencing, wEmbedding] = [made("w", [ref(c)]), made("w", [embedded(c)])];
    const r0 = over("r0", wReferencing);
    const found: NodeTables = { rows: rowsOf(r0, wReferencing, c), refs: new Map([[wReferencing.key, 1], [c.key, 1]]), queue: new Set() };
    // Written again with its row's list, under nothing: c is asked about by no read.
    const unchanged = await readsOf(found, new Map([[r0.key, 1]]), [{ inserts: flushed(wReferencing), rootCounts: [] }], true, [c, wReferencing, r0]);
    expect(unchanged.log).toEqual(["rows w", "changed w", "queue"]);
    // Written again with its row's list, then in its other form under s2: the run replaces the row's list, and c,
    // which only that list referenced, is followed block by block, not asked whether it is stored.
    const s2 = over("s2", wEmbedding);
    const replaced = await readsOf(
      found,
      new Map([[r0.key, 1], [s2.key, 1]]),
      [{ inserts: flushed(wReferencing), rootCounts: [] }, { inserts: flushed(wEmbedding, s2), rootCounts: raise(s2) }],
      true,
      [c, wReferencing, r0, s2],
    );
    expect(replaced.log).toEqual(["rows s2 w", "changed w", "counts c", "queue", "counts s2"]);
    // In its other form under r1, then back in its row's form under r2: the row's list stays. c, which the first list
    // dropped and the second took back, is followed block by block, and asked whether it is stored: the second list
    // replaced one the run held.
    const [r1, r2] = [over("r1", wEmbedding), over("r2", wReferencing)];
    const back = await readsOf(
      found,
      new Map([[r2.key, 1]]),
      [
        { inserts: flushed(wEmbedding, r1), rootCounts: [...raise(r1), ...release(r0)] },
        { inserts: flushed(wReferencing, r2), rootCounts: [...raise(r2), ...release(r1)] },
      ],
      true,
      [c, wReferencing, r0, r1, r2],
    );
    expect(back.log).toEqual(["rows r1 r2 w", "changed w", "missing c", "counts c", "queue", "counts r0 r1 r2", "children r0"]);
    expect([back.outcome.unchangedNodes, back.outcome.evict.map(hex)]).toEqual([1, [r0.key]]);
  });
});

describe("by hand", () => {
  const c = made("c");
  const wEmbedding = made("w", [embedded(c)]);
  const wReferencing = made("w", [ref(c)]);
  const over = (name: string, ...children: readonly ReturnType<typeof made>[]) => made(name, children.map(ref));
  const data = Uint8Array.of(7);
  const flushed = (...nodes: readonly ReturnType<typeof made>[]) => nodes.map((node) => ({ key: node.keyBytes, data, children: node.children }));
  const raise = (...nodes: readonly ReturnType<typeof made>[]) => nodes.map((node) => ({ key: node.keyBytes, delta: 1 }));
  /** The reason a computation halts with, or what it gave. */
  const reasonOf = (work: Promise<unknown>): Promise<unknown> => work.then((given) => given, (error: unknown) => haltReason(error) ?? error);
  /** What `refcountStep` gives for one block on `tables`: "no halt", or its halt's reason. */
  const stepOf = (tables: NodeTables, roots: ReadonlyMap<string, number>, flush: Parameters<typeof refcountStep>[1], height: bigint): Promise<unknown> =>
    refcountStep(stepTables(tables, roots), flush, { height, on: true }).then(
      () => "no halt",
      (error: unknown) => haltReason(error) ?? error,
    );
  /** The reason and the block a computation halts with, or "commits". */
  const haltOf = (work: Promise<unknown>): Promise<unknown> =>
    work.then(
      () => "commits",
      (error: unknown) => (haltReason(error) === undefined ? error : `${haltReason(error)} at ${String((error as { details: { height: bigint } }).details.height)}`),
    );
  /** The halt of `work`: its reason, block and key, and its message; none of them when it commits. */
  const haltIn = async (work: Promise<unknown>) => {
    const error = await work.then(() => undefined, (thrown: unknown) => thrown);
    const details = (error as { details?: { height?: bigint; key?: string } } | undefined)?.details;
    return { reason: haltReason(error), height: details?.height, key: details?.key, message: (error as Error | undefined)?.message ?? "" };
  };

  it("the two forms of a node have one key", () => {
    expect(wEmbedding.key).toBe(wReferencing.key);
    expect(same(wEmbedding.children, wReferencing.children)).toBe(false);
  });

  it("is computed after the last block's own rows: root_counts holds the counts after that block, and a state the last block releases is kept one block more, queued, as the per-block step keeps it", async () => {
    const leafNode = made("leaf");
    const [s0, s1] = [over("s0", leafNode), over("s1", leafNode)];
    const blocks = madeBlocks([
      { inserts: [leafNode, s0], persist: [s0] },
      { inserts: [s1], persist: [s1], release: [s0] },
      { inserts: [] },
    ]);
    const releasing = blocks[1] as ModelBlock;
    // The per-block step keeps s0 at the block that releases it, queued, and deletes it at the next.
    expect([releasing.step.after.rows.has(s0.key), releasing.step.after.queue.has(s0.key), (blocks[2] as ModelBlock).step.deleted]).toEqual([true, true, [s0.key]]);
    // A run of that one block, given root_counts as that block's own rows left them: s0 has no root count there.
    expect(releasing.step.after.roots.has(s0.key)).toBe(false);
    const reclaim = new RunReclaim({ first: 1n, on: true });
    reclaim.collect(1n, flushOf(releasing.flushed), true);
    const outcome = await reclaim.compute(runTables(releasing.before, releasing.step.after.roots));
    expect([outcome.evict.map(hex), outcome.net.queued.map(hex)]).toEqual([[], [s0.key]]);
    expect(tableDifferences(applied(releasing.before, outcome.net).tables, releasing.step.after)).toEqual([]);
    // In runs of 1, 2 and 3, every run's end holds the model's tables.
    for (const size of [1, 2, 3]) expect(await inRuns(blocks, { size, feed: "per-block" }), `runs of ${size}`).toEqual([]);
  });

  it("a run's last block is the last one handed over: the same blocks computed after two and after three are the model's tables after each", async () => {
    const leafNode = made("leaf");
    const [s0, s1] = [over("s0", leafNode), over("s1", leafNode)];
    const blocks = madeBlocks([
      { inserts: [leafNode, s0], persist: [s0] },
      { inserts: [s1], persist: [s1], release: [s0] },
      { inserts: [] },
    ]);
    for (const count of [2, 3]) {
      const last = blocks[count - 1] as ModelBlock;
      const reclaim = new RunReclaim({ first: 0n, on: true });
      for (const block of blocks.slice(0, count)) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
      expect(reclaim.heights).toEqual({ first: 0n, last: BigInt(count - 1) });
      const outcome = await reclaim.compute(runTables(NO_TABLES, last.step.after.roots));
      expect(outcome.net.height).toBe(BigInt(count - 1));
      expect(tableDifferences(applied(NO_TABLES, outcome.net).tables, last.step.after), `after ${count} blocks`).toEqual([]);
      // After two, s0 is what the last block released: kept and queued. After three it was never written.
      expect([outcome.net.queued.map(hex), outcome.evict.map(hex)]).toEqual(count === 2 ? [[s0.key], []] : [[], [s0.key]]);
    }
  });

  it("says how it classified the run's nodes against the database: new, rewritten and unchanged, as the per-block step classifies them, with the new nodes' keys", async () => {
    // Stored: r0 over w, which references c. The block writes w with c embedded under a new root r1, and c again
    // with the list its row holds.
    const r0 = over("r0", wReferencing);
    const r1 = over("r1", wEmbedding);
    const found: NodeTables = {
      rows: new Map([[r0.key, r0.children], [wReferencing.key, wReferencing.children], [c.key, c.children]]),
      refs: new Map([[wReferencing.key, 1], [c.key, 1]]),
      queue: new Set(),
    };
    const flush = { inserts: flushed(wEmbedding, r1, c), rootCounts: raise(r1) };
    const reclaim = new RunReclaim({ first: 1n, on: true });
    reclaim.collect(1n, flush, true);
    const outcome = await reclaim.compute(runTables(found, new Map([[r0.key, 1], [r1.key, 1]])));
    expect([outcome.newNodes, outcome.rewrittenNodes, outcome.unchangedNodes, outcome.handed]).toEqual([1, 1, 1, 3]);
    const step = await refcountStep(stepTables(found, new Map([[r0.key, 1]])), flush, { height: 1n, on: true });
    expect([step.newNodes.map(hex), step.rewritten.map(hex), step.unchanged.map(hex)]).toEqual([[r1.key], [wReferencing.key], [c.key]]);
    // The new nodes' keys: r1, not the rewritten w nor the unchanged c.
    expect(outcome.newKeys.map(hex)).toEqual([r1.key]);
    // Only the new and rewritten nodes are written; c lost w's reference and keeps none, kept by the list w had.
    expect(outcome.net.inserts.map((node) => hex(node.key)).sort()).toEqual([r1.key, wEmbedding.key].sort());
    expect(outcome.net.queued.map(hex)).toEqual([c.key]);
    // Over two blocks the counts are of the nodes the run holds at its end: r1 is new, w is rewritten once, and c is
    // unchanged though two blocks flush it.
    const two = new RunReclaim({ first: 1n, on: true });
    two.collect(1n, flush, true);
    two.collect(2n, { inserts: flushed(c), rootCounts: [] }, true);
    const both = await two.compute(runTables(found, new Map([[r0.key, 1], [r1.key, 1]])));
    expect([both.newNodes, both.rewrittenNodes, both.unchangedNodes, both.handed]).toEqual([1, 1, 1, 3]);
    expect(both.newKeys.map(hex)).toEqual([r1.key]);
  });

  it("the last child list written for a key inside a run is the one stored", async () => {
    const [r1, r2] = [over("r1", wEmbedding), over("r2", wReferencing)];
    const blocks = madeBlocks([
      { inserts: [wEmbedding, r1], persist: [r1] },
      { inserts: [c, wReferencing, r2], persist: [r2], release: [r1] },
    ]);
    expect(blocks[1]?.step.rewritten).toEqual([wReferencing.key]);
    for (const size of [1, 2]) expect(await inRuns(blocks, { size, feed: "per-block" })).toEqual([]);
    expect(same(blocks[1]?.step.after.rows.get(wReferencing.key) as Uint8Array, wReferencing.children)).toBe(true);
  });

  it("a key that only a replaced list referenced is kept and queued when the last block replaced the list, and deleted when an earlier one did", async () => {
    const [r1, r2, r3] = [over("r1", wReferencing), over("r2", wEmbedding), over("r3", wEmbedding)];
    const blocks = madeBlocks([
      { inserts: [] },
      { inserts: [c, wReferencing, r1], persist: [r1] },
      { inserts: [wEmbedding, r2], persist: [r2], release: [r1] },
      { inserts: [r3], persist: [r3], release: [r2] },
    ]);
    // The per-block step: the dropped child is queued by the block of the rewrite, and deleted by the next.
    expect([blocks[2]?.step.after.queue.has(c.key), blocks[3]?.step.deleted.includes(c.key)]).toEqual([true, true]);
    // Runs ending at the rewrite (0 to 2), after it with the list replaced in the run (0 to 3) or in the database
    // (2 to 3), and of one block.
    for (const size of [1, 2, 3, 4]) expect(await inRuns(blocks, { size, feed: "per-block" }), `runs of ${size}`).toEqual([]);
  });

  it("one block taken off is not always enough: a run is made shorter until its last block's replaced lists alone keep no node, or one block remains, and then holds the per-block step's tables", async () => {
    // A over x and B over y, both persisted; block 1 releases both; the per-block step deletes A, B, x and y at 2;
    // blocks 3 and 4 write A and B again in their other forms (x and y embedded) and persist them.
    const [x, y] = [made("x"), made("y")];
    const [aRef, aEmb, bRef, bEmb] = [made("A", [ref(x)]), made("A", [embedded(x)]), made("B", [ref(y)]), made("B", [embedded(y)])];
    const blocks = madeBlocks([
      { inserts: [x, aRef, y, bRef], persist: [aRef, bRef] },
      { inserts: [], release: [aRef, bRef] },
      { inserts: [] },
      { inserts: [aEmb], persist: [aEmb] },
      { inserts: [bEmb], persist: [bEmb] },
    ]);
    // The per-block step of src/, applied block by block, is the model at every block.
    const steps = await stepped(blocks);
    const at = (height: number) => steps[height] as (typeof steps)[number];
    for (const block of blocks) expect(tableDifferences(at(block.height).tables, block.step.after), `block ${block.height}`).toEqual([]);
    expect([...at(2).tables.rows.keys()]).toEqual([]);
    const runOf = async (first: number, last: number) => {
      const reclaim = new RunReclaim({ first: BigInt(first), on: true });
      for (const block of blocks.slice(first, last + 1)) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
      return reclaim.compute(runTables(at(first - 1).tables, at(last).roots));
    };
    const extra = (key: string) => [
      `nodes differs: 1 rows the model lacks (${key.slice(0, 12)}), 0 it has and these lack ()`,
      `unreferenced differs: 1 rows the model lacks (${key.slice(0, 12)}), 0 it has and these lack ()`,
    ];
    // 1 to 4: block 4 replaces the list B's row holds, so y, which only that list referenced, is kept and queued.
    const four = await runOf(1, 4);
    expect(four.keptByReplaced).toBe(1);
    expect(tableDifferences(applied(at(0).tables, four.net).tables, at(4).tables)).toEqual(extra(y.key));
    // 1 to 3, one block off: block 3 replaces the list A's row holds, and x is kept the same way.
    const three = await runOf(1, 3);
    expect(three.keptByReplaced).toBe(1);
    expect(tableDifferences(applied(at(0).tables, three.net).tables, at(3).tables)).toEqual(extra(x.key));
    // 1 to 2, a second block off: nothing is replaced, and the tables are the step's.
    const two = await runOf(1, 2);
    expect(two.keptByReplaced).toBe(0);
    expect(tableDifferences(applied(at(0).tables, two.net).tables, at(2).tables)).toEqual([]);
    // The blocks taken off open the next run, from the step's tables after 2: A and B are new there.
    const rest = await runOf(3, 4);
    expect(rest.keptByReplaced).toBe(0);
    expect(tableDifferences(applied(at(2).tables, rest.net).tables, at(4).tables)).toEqual([]);
    // The test helper's procedure from block 0, in runs of 5: the first run is made shorter twice, then 3 to 4.
    const seen: Remade = { runs: 0, remade: 0, kept: 0, replaced: 0, longest: 0, oneBlockKept: 0 };
    expect(await remadeAgainstModel(blocks, 5, seen)).toEqual([]);
    expect([seen.runs, seen.remade, seen.longest]).toEqual([2, 2, 2]);
  });

  it("a node a run's last block writes in another form, after a block of the run released what reached it, keeps what only its old list referenced; the run made again without that block stores the model's tables", async () => {
    const [r0, r3] = [over("r0", wReferencing), over("r3", wEmbedding)];
    const blocks = madeBlocks([
      { inserts: [c, wReferencing, r0], persist: [r0] },
      { inserts: [], release: [r0] },
      { inserts: [] },
      { inserts: [wEmbedding, r3], persist: [r3] },
      { inserts: [] },
      { inserts: [] },
    ]);
    // The per-block step deletes r0, w and c at 2, and takes w's other form at 3 for a new node.
    expect([(blocks[2] as ModelBlock).step.deleted, (blocks[3] as ModelBlock).step.newNodes]).toEqual([[r0.key, c.key, wReferencing.key].sort(), [wEmbedding.key, r3.key].sort()]);
    // As one run from 1 to 3, w's form at 3 replaces the row the run found, and c, which only that row's list
    // referenced, is kept and queued.
    const found = (blocks[0] as ModelBlock).step.after;
    const reclaim = new RunReclaim({ first: 1n, on: true });
    for (const block of blocks.slice(1, 4)) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
    const outcome = await reclaim.compute(runTables(found, (blocks[3] as ModelBlock).step.after.roots));
    expect(outcome.keptByReplaced).toBe(1);
    expect(tableDifferences(applied(found, outcome.net).tables, (blocks[3] as ModelBlock).step.after)).toEqual([
      `nodes differs: 1 rows the model lacks (${c.key.slice(0, 12)}), 0 it has and these lack ()`,
      `unreferenced differs: 1 rows the model lacks (${c.key.slice(0, 12)}), 0 it has and these lack ()`,
    ]);
    // Made shorter, every run stores the model's tables; the runs ending at 3 are made shorter once.
    for (const [size, remade] of [[2, 1], [3, 0], [4, 1], [6, 0]] as const) {
      const seen: Remade = { runs: 0, remade: 0, kept: 0, replaced: 0, longest: 0, oneBlockKept: 0 };
      expect(await remadeAgainstModel(blocks, size, seen), `runs of ${size}`).toEqual([]);
      expect(seen.remade, `runs of ${size}`).toBe(remade);
    }
  });

  it("the flush rule: a new node nothing reaches halts the run, naming its block; a node written again with its row's list may be anywhere, and be rewritten later under a root", async () => {
    const [a, orphan] = [made("a"), made("orphan")];
    const r1 = over("r1", a);
    const reclaim = new RunReclaim({ first: 0n, on: true });
    reclaim.collect(0n, { inserts: flushed(a, orphan, r1), rootCounts: raise(r1) }, true);
    reclaim.collect(1n, { inserts: [], rootCounts: [] }, true);
    const halt = await reclaim.compute(runTables(NO_TABLES, new Map([[r1.key, 1]]))).catch((error: unknown) => error);
    expect(haltReason(halt)).toBe("unreached-node");
    expect((halt as { details: { height: bigint; key: string } }).details).toMatchObject({ height: 0n, key: `0x${orphan.key}` });
    expect((halt as Error).message).toMatch(new RegExp(`0x${orphan.key}, a new node, and no key it persists reaches the node`));
    // A stored node written in another form under nothing, at the run's first block: judged once the database says
    // it is a row.
    const rooted = over("rooted", wReferencing);
    const stored: NodeTables = { rows: new Map([[rooted.key, rooted.children], [wReferencing.key, wReferencing.children], [c.key, c.children]]), refs: new Map([[wReferencing.key, 1], [c.key, 1]]), queue: new Set() };
    const rewritten = new RunReclaim({ first: 4n, on: true });
    rewritten.collect(4n, { inserts: flushed(wEmbedding), rootCounts: [] }, true);
    rewritten.collect(5n, { inserts: [], rootCounts: [] }, true);
    const unreachedRow = await rewritten.compute(runTables(stored, new Map([[rooted.key, 1]]))).catch((error: unknown) => error);
    expect((unreachedRow as { details: { reason: string; height: bigint; key: string } }).details).toMatchObject({ reason: "unreached-node", height: 4n, key: `0x${wEmbedding.key}` });
    expect((unreachedRow as Error).message).toMatch(new RegExp(`0x${wEmbedding.key}, with another child list than its row's, and no key it persists reaches the node`));

    // Written again unchanged, under nothing; then in its other form under a root, in the same run.
    const [s1, s2] = [over("s1", wReferencing), over("s2", wEmbedding)];
    const blocks = madeBlocks([
      { inserts: [] },
      { inserts: [c, wReferencing, s1], persist: [s1] },
      { inserts: [wReferencing] },
      { inserts: [wEmbedding, s2], persist: [s2], release: [s1] },
    ]);
    expect([blocks[2]?.step.unchanged, blocks[3]?.step.rewritten]).toEqual([[wReferencing.key], [wEmbedding.key]]);
    for (const size of [1, 2, 4]) expect(await inRuns(blocks, { size, feed: "per-block" }), `runs of ${size}`).toEqual([]);

    // Another child list for a key the run holds, under nothing: the block that writes it halts at once.
    const stray = new RunReclaim({ first: 0n, on: true });
    stray.collect(0n, { inserts: flushed(c, wReferencing, s1), rootCounts: raise(s1) }, true);
    let refused: unknown;
    try {
      stray.collect(1n, { inserts: flushed(wEmbedding), rootCounts: [] }, true);
    } catch (error) {
      refused = error;
    }
    expect(haltReason(refused)).toBe("unreached-node");
    expect((refused as { details: { height: bigint; key: string } }).details).toMatchObject({ height: 1n, key: `0x${wEmbedding.key}` });
    expect((refused as Error).message).toMatch(new RegExp(`the block writes 0x${wEmbedding.key} with another child list, and no key it persists reaches the node`));
    // Left out (a negative control's seam), the check lets that block through.
    const unchecked = new RunReclaim({ first: 0n, on: true, unchecked: "unreached-node" });
    unchecked.collect(0n, { inserts: flushed(c, wReferencing, s1), rootCounts: raise(s1) }, true);
    expect(() => unchecked.collect(1n, { inserts: flushed(wEmbedding), rootCounts: [] }, true)).not.toThrow();
  });

  it("a reference to a key stored nowhere, and a persisted key stored nowhere, halt with missing-reference", async () => {
    const [x, r] = [made("x"), over("r", made("x"))];
    const nowhere = "which is neither stored when the run began nor flushed by the run";
    const referencing = new RunReclaim({ first: 0n, on: true });
    referencing.collect(0n, { inserts: flushed(r), rootCounts: raise(r) }, true);
    const known = new KnownKeySet();
    const referenced = await haltIn(referencing.compute(runTables(NO_TABLES, new Map([[r.key, 1]])), known));
    expect(referenced).toMatchObject({ reason: "missing-reference", height: 0n, key: `0x${x.key}` });
    expect(referenced.message).toContain(`0x${r.key}, which the block writes, references 0x${x.key}, ${nowhere}`);
    // The set of keys known to be rows learns no key the read finds absent.
    expect([known.has(keyText(x.keyBytes)), known.size]).toEqual([false, 0]);
    const persisting = new RunReclaim({ first: 0n, on: true });
    persisting.collect(0n, { inserts: [], rootCounts: raise(x) }, true);
    const persisted = await haltIn(persisting.compute(runTables(NO_TABLES, new Map([[x.key, 1]]))));
    expect(persisted).toMatchObject({ reason: "missing-reference", height: 0n, key: `0x${x.key}` });
    expect(persisted.message).toContain(`the block persists 0x${x.key}, ${nowhere}`);
    // A reference of a list the run replaced is checked too: every list a block flushed is. The halt names the key
    // whose list it is, and the block of that list: the replaced one's, or the one that replaced it.
    for (const [first, second, height] of [
      [made("p", [ref(x)]), made("p", [embedded(x)]), 0n],
      [made("p", [embedded(x)]), made("p", [ref(x)]), 1n],
    ] as const) {
      const top = over("top", first);
      const replaced = new RunReclaim({ first: 0n, on: true });
      replaced.collect(0n, { inserts: flushed(first, top), rootCounts: raise(top) }, true);
      const again = over("again", second);
      replaced.collect(1n, { inserts: flushed(second, again), rootCounts: raise(again) }, true);
      const listed = await haltIn(replaced.compute(runTables(NO_TABLES, new Map([[top.key, 1], [again.key, 1]]))));
      expect(listed).toMatchObject({ reason: "missing-reference", height, key: `0x${x.key}` });
      expect(listed.message).toContain(`0x${first.key}, which the block writes, references 0x${x.key}, ${nowhere}`);
    }
    // A stored node written in another form whose list references a key stored nowhere.
    const [vEmbedding, vReferencing] = [made("v", [embedded(x)]), made("v", [ref(x)])];
    const [r0, r1] = [over("r0", vEmbedding), over("r1", vReferencing)];
    const found: NodeTables = { rows: new Map([[r0.key, r0.children], [vEmbedding.key, vEmbedding.children]]), refs: new Map([[vEmbedding.key, 1]]), queue: new Set() };
    const flush = { inserts: flushed(vReferencing, r1), rootCounts: raise(r1) };
    expect(await stepOf(found, new Map([[r0.key, 1]]), flush, 1n)).toBe("missing-reference");
    const rewriting = new RunReclaim({ first: 1n, on: true });
    rewriting.collect(1n, flush, true);
    const rewrote = await haltIn(rewriting.compute(runTables(found, new Map([[r0.key, 1], [r1.key, 1]]))));
    expect(rewrote).toMatchObject({ reason: "missing-reference", height: 1n, key: `0x${x.key}` });
    expect(rewrote.message).toContain(`0x${vReferencing.key}, which the block writes, references 0x${x.key}, ${nowhere}`);
  });

  it("a reference, or a persisted key, that only a later block of the run flushes halts the run at the block that needs it, as the per-block step halts that block", async () => {
    const x = made("x");
    const [r1, r2] = [over("r1", x), over("r2", x)];
    // Block 1 writes r1 over x and persists it; block 2 flushes x, writes r2 over it, persists r2 and releases r1.
    expect(await stepOf(NO_TABLES, new Map(), { inserts: flushed(r1), rootCounts: raise(r1) }, 1n)).toBe("missing-reference");
    const later = "which is not stored when the run began, and first flushed by block 2";
    const referencing = new RunReclaim({ first: 1n, on: true });
    referencing.collect(1n, { inserts: flushed(r1), rootCounts: raise(r1) }, true);
    referencing.collect(2n, { inserts: flushed(x, r2), rootCounts: [...raise(r2), { key: r1.keyBytes, delta: -1 }] }, true);
    const referenced = await haltIn(referencing.compute(runTables(NO_TABLES, new Map([[r2.key, 1]]))));
    expect(referenced).toMatchObject({ reason: "missing-reference", height: 1n, key: `0x${x.key}` });
    expect(referenced.message).toContain(`0x${r1.key}, which the block writes, references 0x${x.key}, ${later}`);
    // Block 1 persists x, which block 2 first flushes, under r2.
    expect(await stepOf(NO_TABLES, new Map(), { inserts: [], rootCounts: raise(x) }, 1n)).toBe("missing-reference");
    const persisting = new RunReclaim({ first: 1n, on: true });
    persisting.collect(1n, { inserts: [], rootCounts: raise(x) }, true);
    persisting.collect(2n, { inserts: flushed(x, r2), rootCounts: raise(r2) }, true);
    const persisted = await haltIn(persisting.compute(runTables(NO_TABLES, new Map([[x.key, 1], [r2.key, 1]]))));
    expect(persisted).toMatchObject({ reason: "missing-reference", height: 1n, key: `0x${x.key}` });
    expect(persisted.message).toContain(`the block persists 0x${x.key}, ${later}`);
    // Referenced at block 1, then flushed and persisted by block 2: the reference needs it first.
    const raised = new RunReclaim({ first: 1n, on: true });
    raised.collect(1n, { inserts: flushed(r1), rootCounts: raise(r1) }, true);
    raised.collect(2n, { inserts: flushed(x), rootCounts: raise(x) }, true);
    expect(await haltOf(raised.compute(runTables(NO_TABLES, new Map([[r1.key, 1], [x.key, 1]]))))).toBe("missing-reference at 1");
    // Referenced by a key's list at block 1, and again by the list that replaces it at block 2, which flushes x: the
    // first list needs it first.
    const z = made("z");
    const [p1, p2] = [made("p", [ref(x), embedded(z)]), made("p", [ref(x), ref(z)])];
    const [top1, top2] = [over("top1", p1), over("top2", p2)];
    expect(await stepOf(NO_TABLES, new Map(), { inserts: flushed(p1, top1), rootCounts: raise(top1) }, 1n)).toBe("missing-reference");
    const relisted = new RunReclaim({ first: 1n, on: true });
    relisted.collect(1n, { inserts: flushed(p1, top1), rootCounts: raise(top1) }, true);
    relisted.collect(2n, { inserts: flushed(x, z, p2, top2), rootCounts: raise(top2) }, true);
    expect(await haltOf(relisted.compute(runTables(NO_TABLES, new Map([[top1.key, 1], [top2.key, 1]]))))).toBe("missing-reference at 1");
    // Flushed by the block that references it, or by one before, it passes; so does a row the run found, which a
    // later block flushes again.
    const pairs: [NodeBatch, NodeBatch][] = [
      [{ inserts: flushed(x, r1), rootCounts: raise(r1) }, { inserts: flushed(r2), rootCounts: [...raise(r2), { key: r1.keyBytes, delta: -1 }] }],
      [{ inserts: flushed(x), rootCounts: raise(x) }, { inserts: flushed(r1), rootCounts: raise(r1) }],
    ];
    for (const [first, second] of pairs) {
      const reclaim = new RunReclaim({ first: 1n, on: true });
      reclaim.collect(1n, first, true);
      reclaim.collect(2n, second, true);
      const roots = withChanges(new Map(), [...first.rootCounts, ...second.rootCounts].map(({ key, delta }) => ({ key: hex(key), delta })));
      expect(await haltOf(reclaim.compute(runTables(NO_TABLES, roots)))).toBe("commits");
    }
    const stored = applied(NO_TABLES, (await (async () => {
      const reclaim = new RunReclaim({ first: 0n, on: true });
      reclaim.collect(0n, { inserts: flushed(x), rootCounts: raise(x) }, true);
      return reclaim.compute(runTables(NO_TABLES, new Map([[x.key, 1]])));
    })()).net).tables;
    const again = new RunReclaim({ first: 1n, on: true });
    again.collect(1n, { inserts: flushed(r1), rootCounts: raise(r1) }, true);
    again.collect(2n, { inserts: flushed(x), rootCounts: [] }, true);
    expect(await haltOf(again.compute(runTables(stored, new Map([[x.key, 1], [r1.key, 1]]))))).toBe("commits");
  });

  it("a count below 0 at one block of the run halts the run there, though a later block brings it back, as the per-block step halts that block", async () => {
    // Tables whose count of c is 0 though w's stored list references it once. Block 1 writes w with c embedded under a
    // new root, which takes c's reference: its count is -1 after block 1. Block 2 writes p over c: back to 0.
    const r0 = over("r0", wReferencing);
    const [r1, p] = [over("r1", wEmbedding), over("p", c)];
    const found: NodeTables = { rows: new Map([[r0.key, r0.children], [wReferencing.key, wReferencing.children], [c.key, c.children]]), refs: new Map([[wReferencing.key, 1]]), queue: new Set([c.key]) };
    const roots = new Map([[r0.key, 1]]);
    expect(await stepOf(found, roots, { inserts: flushed(wEmbedding, r1), rootCounts: raise(r1) }, 1n)).toBe("negative-count");
    const reclaim = new RunReclaim({ first: 1n, on: true });
    reclaim.collect(1n, { inserts: flushed(wEmbedding, r1), rootCounts: raise(r1) }, true);
    reclaim.collect(2n, { inserts: flushed(p), rootCounts: raise(p) }, true);
    expect(await haltOf(reclaim.compute(runTables(found, new Map([...roots, [r1.key, 1], [p.key, 1]]))))).toBe("negative-count at 1");
    // On sound tables (c counted once) the same blocks commit.
    const sound = new RunReclaim({ first: 1n, on: true });
    sound.collect(1n, { inserts: flushed(wEmbedding, r1), rootCounts: raise(r1) }, true);
    sound.collect(2n, { inserts: flushed(p), rootCounts: raise(p) }, true);
    expect(await haltOf(sound.compute(runTables({ ...found, refs: new Map([...found.refs, [c.key, 1]]), queue: new Set() }, new Map([...roots, [r1.key, 1], [p.key, 1]]))))).toBe("commits");
    // With the count check left out (a negative control's seam), the cascade deletes c, queued with a count of 0 after
    // the run, and the run halts at its last block for p's reference to it.
    const unchecked = new RunReclaim({ first: 1n, on: true, unchecked: "negative-count" });
    unchecked.collect(1n, { inserts: flushed(wEmbedding, r1), rootCounts: raise(r1) }, true);
    unchecked.collect(2n, { inserts: flushed(p), rootCounts: raise(p) }, true);
    expect(await haltOf(unchecked.compute(runTables(found, new Map([...roots, [r1.key, 1], [p.key, 1]]))))).toBe("missing-reference at 2");
  });

  it("of the blocks whose check fails, the first halts the run, a count before a reference at one block", async () => {
    // On the tables of the test above: the block that writes w with c embedded takes c below 0, the block that writes
    // r2 references x before block 3 flushes it, and block 3 also brings c back.
    const x = made("x");
    const r0 = over("r0", wReferencing);
    const [r1, r2, r3] = [over("r1", wEmbedding), over("r2", x), over("r3", c, x)];
    const found: NodeTables = { rows: new Map([[r0.key, r0.children], [wReferencing.key, wReferencing.children], [c.key, c.children]]), refs: new Map([[wReferencing.key, 1]]), queue: new Set([c.key]) };
    const roots = new Map([[r0.key, 1], [r1.key, 1], [r2.key, 1], [r3.key, 1]]);
    const compute = (heights: { readonly count: bigint; readonly reference: bigint }) => {
      const reclaim = new RunReclaim({ first: 1n, on: true });
      for (const height of [1n, 2n, 3n]) {
        const inserts = [...(height === heights.count ? flushed(wEmbedding, r1) : []), ...(height === heights.reference ? flushed(r2) : []), ...(height === 3n ? flushed(x, r3) : [])];
        const rootCounts = [...(height === heights.count ? raise(r1) : []), ...(height === heights.reference ? raise(r2) : []), ...(height === 3n ? raise(r3) : [])];
        reclaim.collect(height, { inserts, rootCounts }, true);
      }
      return haltOf(reclaim.compute(runTables(found, roots)));
    };
    expect(await compute({ count: 1n, reference: 2n })).toBe("negative-count at 1");
    expect(await compute({ count: 2n, reference: 1n })).toBe("missing-reference at 1");
    expect(await compute({ count: 1n, reference: 1n })).toBe("negative-count at 1");
  });

  it("of several references stored nowhere, the halt names the one the earliest block needs, at one block the first in byte order, and the node whose list references it", async () => {
    const [y, x] = [made("y"), made("x")];
    expect(y.key < x.key).toBe(true);
    const nowhere = "which is neither stored when the run began nor flushed by the run";
    // At one block, one list references both: y, as the per-block step names it.
    const p = made("p", [ref(y), ref(x)]);
    const top = over("top", p);
    const flush = { inserts: flushed(p, top), rootCounts: raise(top) };
    const step = await refcountStep(stepTables(NO_TABLES, new Map()), flush, { height: 0n, on: true }).catch((error: unknown) => error);
    expect((step as { details: { reason: string; key: string } }).details).toMatchObject({ reason: "missing-reference", key: `0x${y.key}` });
    const both = new RunReclaim({ first: 0n, on: true });
    both.collect(0n, flush, true);
    expect(await haltIn(both.compute(runTables(NO_TABLES, new Map([[top.key, 1]]))))).toMatchObject({ reason: "missing-reference", height: 0n, key: `0x${y.key}` });
    // q references x at block 1; at block 2, p2 references y and p3 x. The halt is x's at block 1, through q, the
    // last of the run's nodes in byte order: no other node's list at block 1 references x.
    const [q, p2, p3] = [over("q", x), over("p2", y), over("p3", x)];
    const [top1, top2] = [over("top1", q), over("top2", p2, p3)];
    expect([top1, top2, p2, p3].every((node) => node.key < q.key)).toBe(true);
    const two = new RunReclaim({ first: 1n, on: true });
    two.collect(1n, { inserts: flushed(q, top1), rootCounts: raise(top1) }, true);
    two.collect(2n, { inserts: flushed(p2, p3, top2), rootCounts: raise(top2) }, true);
    const halt = await haltIn(two.compute(runTables(NO_TABLES, new Map([[top1.key, 1], [top2.key, 1]]))));
    expect(halt).toMatchObject({ reason: "missing-reference", height: 1n, key: `0x${x.key}` });
    expect(halt.message).toContain(`0x${q.key}, which the block writes, references 0x${x.key}, ${nowhere}`);
  });

  it("of several counts that fall below 0, the halt names the one at the earliest block, and at one block the first in byte order, as the per-block step names it", async () => {
    // Tables that count y and x 0 though stored lists reference them, both queued.
    const [y, x] = [made("y"), made("x")];
    expect(y.key < x.key).toBe(true);
    // At one block: u's list referencing both is replaced by one that embeds both.
    const [u, uEmbedding] = [made("u", [ref(y), ref(x)]), made("u", [embedded(y), embedded(x)])];
    const [r0, r1] = [over("r0", u), over("r1", uEmbedding)];
    const found: NodeTables = { rows: new Map([r0, u, y, x].map((node) => [node.key, node.children])), refs: new Map([[u.key, 1]]), queue: new Set([y.key, x.key]) };
    const flush = { inserts: flushed(uEmbedding, r1), rootCounts: raise(r1) };
    const step = await refcountStep(stepTables(found, new Map([[r0.key, 1]])), flush, { height: 1n, on: true }).catch((error: unknown) => error);
    expect((step as { details: { reason: string; key: string } }).details).toMatchObject({ reason: "negative-count", key: `0x${y.key}` });
    const one = new RunReclaim({ first: 1n, on: true });
    one.collect(1n, flush, true);
    const tie = await haltIn(one.compute(runTables(found, new Map([[r0.key, 1], [r1.key, 1]]))));
    expect(tie).toMatchObject({ reason: "negative-count", height: 1n, key: `0x${y.key}` });
    expect(tie.message).toContain(`the reference count of 0x${y.key} would fall below 0`);
    // At two blocks: u's list referencing x is replaced at block 1, v's referencing y at block 2.
    const [ux, uxEmbedding, vy, vyEmbedding] = [made("u", [ref(x)]), made("u", [embedded(x)]), made("v", [ref(y)]), made("v", [embedded(y)])];
    const [s0, s1, s2] = [over("s0", ux, vy), over("s1", uxEmbedding), over("s2", vyEmbedding)];
    const tables: NodeTables = { rows: new Map([s0, ux, vy, y, x].map((node) => [node.key, node.children])), refs: new Map([[ux.key, 1], [vy.key, 1]]), queue: new Set([y.key, x.key]) };
    const two = new RunReclaim({ first: 1n, on: true });
    two.collect(1n, { inserts: flushed(uxEmbedding, s1), rootCounts: raise(s1) }, true);
    two.collect(2n, { inserts: flushed(vyEmbedding, s2), rootCounts: raise(s2) }, true);
    expect(await haltIn(two.compute(runTables(tables, new Map([[s0.key, 1], [s1.key, 1], [s2.key, 1]]))))).toMatchObject({ reason: "negative-count", height: 1n, key: `0x${x.key}` });
  });

  it("counts as kept by the last block's replaced lists only a node they alone keep: not one that block also releases, not one another list still references, and none without sweep", async () => {
    // Stored: r0 over w, whose list references c and d; d is also a root. The block writes w in a form that references
    // c and embeds d, under r1, and releases r0 and d: d is queued, released by the block.
    const d = made("d");
    const [w1, w2] = [made("w", [ref(c), ref(d)]), made("w", [ref(c), embedded(d)])];
    const [r0, r1] = [over("r0", w1), over("r1", w2)];
    const found: NodeTables = { rows: new Map([r0, w1, c, d].map((node) => [node.key, node.children])), refs: new Map([[w1.key, 1], [c.key, 1], [d.key, 1]]), queue: new Set() };
    const released = { inserts: flushed(w2, r1), rootCounts: [...raise(r1), { key: r0.keyBytes, delta: -1 }, { key: d.keyBytes, delta: -1 }] };
    const outcome = async (flush: NodeBatch, roots: ReadonlyMap<string, number>, on: boolean) => {
      const reclaim = new RunReclaim({ first: 1n, on });
      reclaim.collect(1n, flush, on);
      return reclaim.compute(runTables(found, roots));
    };
    const both = await outcome(released, new Map([[r1.key, 1]]), true);
    expect(both.net.queued.map(hex)).toEqual([d.key, r0.key].sort());
    expect(both.keptByReplaced).toBe(0);
    // d no root: the replaced list alone keeps it; c, which the new list references, is not queued.
    const kept = { ...released, rootCounts: [...raise(r1), { key: r0.keyBytes, delta: -1 }] };
    const roots = new Map([[r1.key, 1]]);
    const one = await outcome(kept, roots, true);
    expect([one.net.queued.map(hex), one.keptByReplaced]).toEqual([[d.key, r0.key].sort(), 1]);
    // Without sweep nothing is deleted, so nothing is kept for it.
    const off = await outcome(kept, roots, false);
    expect([off.net.queued.map(hex), off.keptByReplaced]).toEqual([[d.key, r0.key].sort(), 0]);
  });

  it("a count that would fall below 0 halts with negative-count", async () => {
    // Tables that hold a reference without its count: p references c, and c has no count.
    const p = over("p", c);
    const found: NodeTables = { rows: new Map([[p.key, p.children], [c.key, c.children]]), refs: new Map(), queue: new Set([c.key]) };
    const next = made("next");
    const reclaim = new RunReclaim({ first: 8n, on: true });
    reclaim.collect(8n, { inserts: flushed(next), rootCounts: [...raise(next), { key: p.keyBytes, delta: -1 }] }, true);
    reclaim.collect(9n, { inserts: [], rootCounts: [] }, true);
    const halt = await haltIn(reclaim.compute(runTables(found, new Map([[next.key, 1]]))));
    expect(halt).toMatchObject({ reason: "negative-count", height: 9n, key: `0x${c.key}` });
    expect(halt.message).toContain(`the reference count of 0x${c.key} would fall below 0`);
  });

  it("a reference to a key that the block's own cascade deletes halts with missing-reference, as the per-block step halts that block", async () => {
    // Tables whose count of k is 0 though q's stored list references it, q and k queued. The block writes a new root
    // p over k: the cascade deletes q, which takes back the reference p gave k, and then k, which p references.
    const k = made("k");
    const [q, p] = [over("q", k), over("p", k)];
    const found: NodeTables = { rows: new Map([[q.key, q.children], [k.key, k.children]]), refs: new Map(), queue: new Set([q.key, k.key]) };
    const flush = { inserts: flushed(p), rootCounts: raise(p) };
    expect(await stepOf(found, new Map(), flush, 1n)).toBe("missing-reference");
    const halt = await (async () => {
      const reclaim = new RunReclaim({ first: 1n, on: true });
      reclaim.collect(1n, flush, true);
      return reclaim.compute(runTables(found, new Map([[p.key, 1]]))).catch((error: unknown) => error);
    })();
    expect(haltReason(halt)).toBe("missing-reference");
    expect((halt as { details: { height: bigint; key: string } }).details).toMatchObject({ height: 1n, key: `0x${k.key}` });
    expect((halt as Error).message).toMatch(new RegExp(`0x${p.key}, which the run writes, references 0x${k.key}, which the run deletes`));
    // On sound tables (k counted once, not queued) the block commits and k stays.
    const sound = new RunReclaim({ first: 1n, on: true });
    sound.collect(1n, flush, true);
    const outcome = await sound.compute(runTables({ ...found, refs: new Map([[k.key, 1]]), queue: new Set([q.key]) }, new Map([[p.key, 1]])));
    expect(outcome.evict.map(hex)).toEqual([q.key]);
    // The same when the list that references k is a stored node's, written in another form under a new root.
    const [vEmbedding, vReferencing] = [made("v", [embedded(k)]), made("v", [ref(k)])];
    const [r0, r1] = [over("r0", vEmbedding), over("r1", vReferencing)];
    const stored: NodeTables = {
      rows: new Map([[r0.key, r0.children], [vEmbedding.key, vEmbedding.children], ...found.rows]),
      refs: new Map([[vEmbedding.key, 1]]),
      queue: found.queue,
    };
    const rewrite = { inserts: flushed(vReferencing, r1), rootCounts: raise(r1) };
    expect(await stepOf(stored, new Map([[r0.key, 1]]), rewrite, 1n)).toBe("missing-reference");
    const rewriting = new RunReclaim({ first: 1n, on: true });
    rewriting.collect(1n, rewrite, true);
    const rewrote = await haltIn(rewriting.compute(runTables(stored, new Map([[r0.key, 1], [r1.key, 1]]))));
    expect(rewrote).toMatchObject({ reason: "missing-reference", height: 1n, key: `0x${k.key}` });
    expect(rewrote.message).toContain(`0x${vReferencing.key}, which the run writes, references 0x${k.key}, which the run deletes`);
  });

  it("a block with both a reference stored nowhere and a count its cascade takes below 0 halts with negative-count, as the per-block step names it", async () => {
    // Tables whose count of c is 0 though q's stored list references it; q is queued, c is not. The block writes a
    // new root r over x, which is stored nowhere: the cascade deletes q, and c's count falls to -1.
    const x = made("x");
    const q = over("q", c);
    const r = over("r", x);
    const found: NodeTables = { rows: new Map([[q.key, q.children], [c.key, c.children]]), refs: new Map(), queue: new Set([q.key]) };
    const flush = { inserts: flushed(r), rootCounts: raise(r) };
    expect(await stepOf(found, new Map(), flush, 1n)).toBe("negative-count");
    const one = new RunReclaim({ first: 1n, on: true });
    one.collect(1n, flush, true);
    expect(await haltOf(one.compute(runTables(found, new Map([[r.key, 1]]))))).toBe("negative-count at 1");
    // With no count below 0 the same block halts for the reference.
    const sound = new RunReclaim({ first: 1n, on: true });
    sound.collect(1n, flush, true);
    expect(await haltOf(sound.compute(runTables({ ...found, refs: new Map([[c.key, 1]]) }, new Map([[r.key, 1]]))))).toBe("missing-reference at 1");
    // When the reference is an earlier block's, the run halts at that block for it, before its cascade: the run's
    // cascade runs once, after its last block, and cannot say at which block a count it takes below 0 fell. The
    // per-block step halts at the same block, for the count.
    const longer = new RunReclaim({ first: 1n, on: true });
    longer.collect(1n, flush, true);
    longer.collect(2n, { inserts: [], rootCounts: [] }, true);
    expect(await haltOf(longer.compute(runTables(found, new Map([[r.key, 1]]))))).toBe("missing-reference at 1");
  });

  it("a state made and released inside a run is never written, and is deleted", async () => {
    const leafNode = made("leaf");
    const states = [0, 1, 2, 3].map((n) => over(`state ${n}`, leafNode));
    const blocks = madeBlocks(states.map((state, n) => ({ inserts: n === 0 ? [leafNode, state] : [state], persist: [state], ...(n === 0 ? {} : { release: [states[n - 1] as (typeof states)[number]] }) })));
    expect(await inRuns(blocks, { size: 4, feed: "per-block" })).toEqual([]);
    const reclaim = new RunReclaim({ first: 0n, on: true });
    for (const block of blocks) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
    const reads = noReads();
    const outcome = await reclaim.compute(runTables(NO_TABLES, (blocks[3] as ModelBlock).step.after.roots, reads));
    expect(outcome.evict.map(hex)).toEqual([states[0], states[1]].map((state) => (state as (typeof states)[number]).key).sort());
    // The run's own nodes have their lists in memory: none is read.
    expect(reads.children).toBe(0);
    expect(outcome.net.deleted).toEqual([]);
    expect(outcome.net.inserts.map((node) => hex(node.key))).toEqual([leafNode, states[2], states[3]].map((node) => (node as (typeof states)[number]).key).sort());
    expect(outcome.net.queued.map(hex)).toEqual([(states[2] as (typeof states)[number]).key]);
    expect(outcome.handed).toBe(5);
  });

  it("on damaged tables, as the per-block step: a queued key that is no row is deleted, and the net write's delete names it; with sweep off, a root count released for a key that is no row queues nothing", async () => {
    const g = made("g");
    // Queued, and no row.
    const queued: NodeTables = { rows: new Map(), refs: new Map(), queue: new Set([g.key]) };
    const empty = { inserts: [], rootCounts: [] };
    const step = await refcountStep(stepTables(queued, new Map()), empty, { height: 1n, on: true });
    expect(step.deleted.map(hex)).toEqual([g.key]);
    const sweeping = new RunReclaim({ first: 1n, on: true });
    sweeping.collect(1n, empty, true);
    const outcome = await sweeping.compute(runTables(queued, new Map()));
    expect([outcome.evict.map(hex), outcome.net.deleted.map(hex), outcome.net.unqueued.map(hex)]).toEqual([[g.key], [g.key], [g.key]]);
    // The net write's delete affects no row: writeNet then halts with row-count-mismatch.
    expect(applied(queued, outcome.net).problems).toEqual([`delete-nodes: ${g.key.slice(0, 12)} is no row`]);
    // A root count of a key that is no row, released by a block that does not sweep.
    const released = { inserts: [], rootCounts: [{ key: g.keyBytes, delta: -1 }] };
    const stepOff = await refcountStep(stepTables(NO_TABLES, new Map([[g.key, 1]])), released, { height: 1n, on: false });
    expect(stepOff.queued).toEqual([]);
    const off = new RunReclaim({ first: 1n, on: false });
    off.collect(1n, released, false);
    expect((await off.compute(runTables(NO_TABLES, new Map()))).net.queued).toEqual([]);
  });

  it("the check of the queue after the run names the key left queued and the run's last block: a guard a build does not trip, tripped by a fault that cuts the cascade short", async () => {
    // w over c persisted at block 0 and released at 1: the cascade deletes w, then c. Cut after its first round, it
    // leaves c with no reference, queued, which no block released and no replaced list referenced.
    const blocks = madeBlocks([{ inserts: [c, wReferencing], persist: [wReferencing] }, { inserts: [], release: [wReferencing] }, { inserts: [] }]);
    const reclaim = new RunReclaim({ first: 0n, on: true, fault: "first-round-only" });
    for (const block of blocks) reclaim.collect(BigInt(block.height), flushOf(block.flushed), true);
    const halt = await haltIn(reclaim.compute(runTables(NO_TABLES, (blocks[2] as ModelBlock).step.after.roots)));
    expect(halt).toMatchObject({ reason: "unexpected-queued", height: 2n, key: `0x${c.key}` });
    expect(halt.message).toContain(`0x${c.key} is left stored with no reference and no root count`);
  });
});

describe("writeNet's statements", () => {
  const keys = Array.from({ length: 2_500 }, (_, n) => nodeKey(Buffer.from(`key ${n}`), []));
  const net: NetWrite = {
    height: 9n,
    inserts: keys.map((key) => ({ key, data: Uint8Array.of(7), children: Uint8Array.of(0) })),
    written: 2_500,
    deltas: keys.map((key) => ({ key, delta: 1 })),
    counted: 2_500,
    unqueued: keys,
    queued: keys,
    deleted: keys,
  };
  /** A handle that answers each statement with the keys it was given, less `less` for the statements `which` picks. */
  const answering = (ran: { sql: string; keys: number }[], which: (sql: string) => boolean = () => false, less = 0): Pick<BlockWriteHandle, "execute"> => ({
    async execute(sql, params) {
      const given = ((params ?? [])[0] as readonly unknown[]).length;
      ran.push({ sql, keys: given });
      return which(sql) ? given - less : given;
    },
  });

  it("sends each list in statements of 1,000 keys, in its order of statements, and none for an empty list", async () => {
    const ran: { sql: string; keys: number }[] = [];
    await writeNet(answering(ran), net);
    expect(ran.map((statement) => statement.keys)).toEqual(Array.from({ length: 5 }, () => [1_000, 1_000, 500]).flat());
    const kinds = ran.map(({ sql }) => (sql.includes(`INTO ${NODES_TABLE}`) ? "nodes" : sql.includes(REF_COUNTS_TABLE) ? "counts" : sql.startsWith(`DELETE FROM ${UNREFERENCED_TABLE}`) ? "unqueue" : sql.includes(`INTO ${UNREFERENCED_TABLE}`) ? "queue" : "delete"));
    expect([...new Set(kinds)]).toEqual(["nodes", "counts", "unqueue", "queue", "delete"]);
    ran.length = 0;
    await writeNet(answering(ran), { height: 9n, inserts: [], written: 0, deltas: [], counted: 0, unqueued: [], queued: [], deleted: [] });
    expect(ran).toEqual([]);
  });

  it("halts with row-count-mismatch naming a statement whose rows, summed over its statements, differ from the computed; unless left out", async () => {
    for (const [statement, which] of [
      ["write-nodes", (sql: string) => sql.includes(`INTO ${NODES_TABLE}`)],
      ["merge-ref-counts", (sql: string) => sql.includes(REF_COUNTS_TABLE)],
      ["delete-unreferenced", (sql: string) => sql.startsWith(`DELETE FROM ${UNREFERENCED_TABLE}`)],
      ["insert-unreferenced", (sql: string) => sql.includes(`INTO ${UNREFERENCED_TABLE}`)],
      ["delete-nodes", (sql: string) => sql.startsWith(`DELETE FROM ${NODES_TABLE}`)],
    ] as const) {
      const halt = await writeNet(answering([], which, 1), net).catch((error: unknown) => error);
      expect(halt, statement).toMatchObject({
        code: "ledger-refcount-invalid",
        details: { reason: "row-count-mismatch", height: 9n, statement, expected: 2_500, actual: 2_497 },
      });
      expect((halt as Error).message).toMatch(new RegExp(`^the run ending at block 9: ${statement} affected 2497 rows where 2500 were computed`));
      await writeNet(answering([], which, 1), net, { unchecked: "row-count-mismatch" });
    }
  });
});
