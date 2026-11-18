import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  type CopyFault,
  CountsCopy,
  RECLAMATION_CACHE_DEFAULT,
  reclamationCacheOf,
  withCountsCopy,
} from "../../src/backbone/core-ledger-state/counts-copy.js";
import { keyText, type RunFault, type RunOutcome, RunReclaim, type RunTables } from "../../src/backbone/core-ledger-state/run-reclaim.js";
import { UmbraError } from "../../src/db/errors.js";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { encodeChildren, hex } from "../ledger/node-format.js";
import { type HistoryScript, historyScripts } from "./refcount-model.js";
import { applied, embedded, flushOf, haltReason, made, type MadeNode, type ModelBlock, modelBlocks, NO_TABLES, type NodeTables, ref, runsOf, runTables } from "./run-reclaim.js";

/**
 * The copy of the counts and child lists that `core-ledger-state` keeps between settles
 * (`src/backbone/core-ledger-state/counts-copy.ts`), and the run computation over it, with no database:
 * - **On its own**: a read's counts held below its bound and answered without being held above it; a key held updated
 *   by the net write as the tables are (its count's and its root count's changes, a new node entering with its list, a
 *   rewritten node's list replaced, a deleted key leaving); an update that would pass the bound empties it first, so it
 *   never holds more; emptied by a block that does not continue the one before and by a failed settle, and a settle
 *   that started from an emptied copy says so once. It owns what it holds: the keys, child-list buffers (views at a
 *   nonzero offset among them), count objects and root changes it was given, changed after the update, and the counts
 *   and lists it answered, changed before the next read, change none of its answers (a build that keeps a caller's
 *   buffer or count object fails this).
 * - **Its reads** (`withCountsCopy`): every read of a hand-made run with its keys, with no copy, with a copy the runs
 *   before filled, and with a verifying copy: the copy answers the counts and the child lists it holds, the database
 *   is asked the others, and the outcome is the same. A candidate that is no row is held from its counts read, leaves
 *   when its run evicts it unwritten, and is held again, a row with its list, once a later run writes it. A held list
 *   is answered as its references by reference, for
 *   each form of a list's length. A root count is held as after the last settle and answered with
 *   the run's change added; a verifying copy also reads every key it holds and halts with `copy-mismatch` on any
 *   difference: a row flag, a count, a root count, a child list, a list held for a key that is no row, a key the
 *   database leaves out.
 * - **The generated histories**, with no fault and with each fault of the computation, in runs of one and of three
 *   blocks: the outcome with a copy kept from run to run, and with a verifying one, is the outcome without a copy at
 *   every run, and, with no fault, after each run every count and list the copy holds is the tables' (whether a later
 *   read asks for it or not); the keys the `counts` and `children` reads ask the database fall to the numbers below, measured on a copy
 *   no verifying run filled. Negative controls: a copy emptied at every run reads what no copy reads; a copy the net
 *   write does not update (`net-not-applied`) or that answers a root count without the run's change
 *   (`roots-not-added`) gives another outcome, and its verifying form halts with `copy-mismatch`.
 *
 * The copy through the module's callbacks (each event that empties it) is in `stored-keys.test.ts`; through the process,
 * `ledger-refcount-copy.test.ts`.
 */

const SEED = 20261118;
/** Histories per family: the reads below are pinned for this many at {@link SEED}. */
const HISTORIES = 40;
/** Histories per family for the faults of the computation, each run with every fault. */
const FAULT_HISTORIES = 8;

/** A 32-byte key holding `n` in its last six bytes, and its text. */
function keyOf(n: number): Uint8Array {
  const key = Buffer.alloc(32);
  key.writeUIntBE(n, 26, 6);
  return new Uint8Array(key.buffer, key.byteOffset, 32);
}
const text = (n: number): string => keyText(keyOf(n));

/** Every read logged with its keys, each named after the node of `names` it is. */
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

/** The `copy-mismatch` a call threw, its details; undefined when it threw nothing. */
async function mismatchOf(call: () => Promise<unknown>): Promise<Record<string, unknown> | undefined> {
  try {
    await call();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("ledger-refcount-invalid");
    return (error as UmbraError).details as Record<string, unknown>;
  }
  return undefined;
}

describe("the copy on its own", () => {
  it("holds the counts a read found while below its bound, a key it holds taking the new value; refuses a bound below one key", () => {
    const copy = new CountsCopy({ keys: 2, verify: false });
    expect([copy.max, copy.verify]).toEqual([2, false]);
    copy.learnCounts(text(1), { row: true, refs: 1, roots: 0 });
    copy.learnCounts(text(2), { row: false, refs: 0, roots: 0 });
    // Full: a third key is not held.
    copy.learnCounts(text(3), { row: true, refs: 4, roots: 1 });
    expect([copy.counts(text(3)), copy.size]).toEqual([undefined, { counts: 2, lists: 0 }]);
    copy.learnCounts(text(1), { row: true, refs: 2, roots: 0 });
    expect([copy.counts(text(1)), copy.counts(text(2))]).toEqual([
      { row: true, refs: 2, roots: 0 },
      { row: false, refs: 0, roots: 0 },
    ]);
    expect(copy.emptied).toBe(0);
    for (const keys of [0, -1, 1.5, Number.NaN]) expect(() => new CountsCopy({ keys, verify: false }), `${keys}`).toThrow(RangeError);
  });

  it("the net write's changes, by hand: counts and root counts of the keys held, a new node entering with its list, a rewritten node's list replaced, the deleted keys leaving", () => {
    const [a, b, c, d, x] = ["a", "b", "c", "d", "x"].map((name) => made(name)) as [MadeNode, MadeNode, MadeNode, MadeNode, MadeNode];
    const n = made("n", [ref(a), ref(b), embedded(made("inner", [ref(a)]))]);
    // e in its two forms, one key: d referenced, then embedded.
    const [e0, e1] = [made("e", [ref(b), ref(d)]), made("e", [ref(b), embedded(d)])];
    const t = (node: MadeNode): string => keyText(node.keyBytes);
    const copy = new CountsCopy({ keys: 100, verify: false });
    copy.learnCounts(t(a), { row: true, refs: 2, roots: 1 });
    copy.learnCounts(t(b), { row: true, refs: 1, roots: 0 });
    // c was read while it was no row; the run writes it new.
    copy.learnCounts(t(c), { row: false, refs: 0, roots: 0 });
    copy.learnCounts(t(d), { row: true, refs: 1, roots: 0 });
    // d's and e's lists, as an earlier run wrote them.
    const earlier = { net: { deltas: [], inserts: [d, e0].map((node) => ({ key: node.keyBytes, data: node.data, children: node.children })) }, evict: [], newKeys: [] };
    copy.apply(earlier as unknown as RunOutcome, new Map());
    // The run: a's count -1 and root count -1, b's count +2, n new (its count +1, raised), c new (raised), e
    // rewritten to embed d, d and x deleted (x new and deleted, never written).
    const outcome = {
      net: {
        inserts: [c, n, e1].map((node) => ({ key: node.keyBytes, data: node.data, children: node.children })),
        deltas: [
          { key: a.keyBytes, delta: -1 },
          { key: b.keyBytes, delta: 2 },
          { key: n.keyBytes, delta: 1 },
        ],
      },
      evict: [d.keyBytes, x.keyBytes],
      newKeys: [c.keyBytes, n.keyBytes, x.keyBytes],
    };
    copy.apply(outcome as unknown as RunOutcome, new Map([[t(a), -1], [t(n), 1], [t(c), 1]]));
    expect([a, b, c, n, d, x].map((node) => copy.counts(t(node)))).toEqual([
      { row: true, refs: 1, roots: 0 },
      { row: true, refs: 3, roots: 0 },
      { row: true, refs: 0, roots: 1 },
      { row: true, refs: 1, roots: 1 },
      undefined,
      undefined,
    ]);
    // n's references, through its embedded child too, in its list's order; e's new list; c's empty one; none for d.
    expect([n, e1, c, d].map((node) => copy.references(t(node))?.map((key) => hex(Buffer.from(key, "latin1"))))).toEqual([
      [a.key, b.key, a.key],
      [b.key],
      [],
      undefined,
    ]);
    // A rewritten node not held keeps no counts: its count before the run is not known.
    expect(copy.counts(t(e1))).toBeUndefined();
    expect(copy.size).toEqual({ counts: 4, lists: 3 });
  });

  it("owns what it holds: the keys, child-list buffers, count objects and root changes it was given, changed after apply, and the counts and lists it answered, changed before the next read, change none of its answers", async () => {
    const [a, b] = [made("a"), made("b")];
    const n = made("n", [ref(a), ref(b)]);
    // n's key and child list as views at a nonzero offset into larger buffers, as a driver's rows are.
    const listBuffer = new Uint8Array(n.children.length + 9);
    listBuffer.set(n.children, 5);
    const children = listBuffer.subarray(5, 5 + n.children.length);
    const keyBuffer = new Uint8Array(40);
    keyBuffer.set(n.keyBytes, 3);
    const key = keyBuffer.subarray(3, 35);
    const deltaKey = Uint8Array.from(a.keyBytes);
    const freshKey = Uint8Array.from(n.keyBytes);
    const counts = { row: true, refs: 2, roots: 1 };
    const copy = new CountsCopy({ keys: 10, verify: false });
    copy.learnCounts(keyText(a.keyBytes), counts);
    const rootChanges = new Map([[keyText(n.keyBytes), 1]]);
    const outcome = { net: { deltas: [{ key: deltaKey, delta: 1 }], inserts: [{ key, data: n.data, children }] }, evict: [], newKeys: [freshKey] };
    copy.apply(outcome as unknown as RunOutcome, rootChanges);
    /** What the copy answers of a and n, through its reads and directly. */
    const answers = async () => {
      const tables = withCountsCopy(runTables(NO_TABLES, new Map()), copy, { height: 1n, rootChanges: new Map() });
      const held = (await tables.counts([a.keyBytes, n.keyBytes])).map(({ key: k, row, refs, roots }) => [hex(k), { row, refs, roots }]);
      const lists = (await tables.children([n.keyBytes])).map(({ key: k, children: list }) => [hex(k), childRefKeys(list).map(hex)]);
      return { held, lists, direct: [copy.counts(keyText(a.keyBytes)), copy.references(keyText(n.keyBytes))?.map((text) => hex(Buffer.from(text, "latin1")))] };
    };
    const before = await answers();
    expect(before).toEqual({
      held: [
        [a.key, { row: true, refs: 3, roots: 1 }],
        [n.key, { row: true, refs: 0, roots: 1 }],
      ],
      lists: [[n.key, [a.key, b.key]]],
      direct: [{ row: true, refs: 3, roots: 1 }, [a.key, b.key]],
    });
    // What it was given, changed after apply.
    listBuffer.fill(0xdd);
    keyBuffer.fill(0);
    deltaKey.fill(0);
    freshKey.fill(0);
    counts.row = false;
    counts.refs = 99;
    rootChanges.set(keyText(n.keyBytes), 50);
    outcome.net.deltas[0] = { key: deltaKey, delta: 7 };
    expect(await answers()).toEqual(before);
    // What it answered, changed before the next read.
    const direct = copy.counts(keyText(a.keyBytes)) as { refs: number };
    direct.refs = 42;
    const listed = copy.references(keyText(n.keyBytes)) as string[];
    listed[0] = "x".repeat(32);
    const tables = withCountsCopy(runTables(NO_TABLES, new Map()), copy, { height: 1n, rootChanges: new Map() });
    const [answered] = await tables.counts([a.keyBytes]);
    (answered as { refs: number }).refs = 41;
    const [list] = await tables.children([n.keyBytes]);
    (list as { children: Uint8Array }).children.fill(0xcc);
    expect(await answers()).toEqual(before);
  });

  it("an update that would take it past its bound, of counts or of lists, empties it first; it never holds more than its bound", () => {
    const nodes = Array.from({ length: 6 }, (_, i) => made(`m${i}`));
    const inserts = (list: readonly MadeNode[]) => list.map((node) => ({ key: node.keyBytes, data: node.data, children: node.children }));
    // New nodes enter with their counts and their lists; rewritten ones with their lists only.
    const written = (...list: readonly MadeNode[]) => ({ net: { deltas: [], inserts: inserts(list) }, evict: [], newKeys: list.map((node) => node.keyBytes) }) as unknown as RunOutcome;
    const rewritten = (...list: readonly MadeNode[]) => ({ net: { deltas: [], inserts: inserts(list) }, evict: [], newKeys: [] }) as unknown as RunOutcome;
    const copy = new CountsCopy({ keys: 3, verify: false });
    let most = 0;
    const apply = (outcome: RunOutcome): void => {
      copy.apply(outcome, new Map());
      most = Math.max(most, copy.size.counts, copy.size.lists);
    };
    apply(written(nodes[0] as MadeNode, nodes[1] as MadeNode));
    expect([copy.size, copy.emptied]).toEqual([{ counts: 2, lists: 2 }, 0]);
    apply(written(nodes[2] as MadeNode));
    expect([copy.size, copy.emptied]).toEqual([{ counts: 3, lists: 3 }, 0]);
    // A fourth new node: its counts would pass the bound, so the copy is emptied first, then it enters.
    apply(written(nodes[3] as MadeNode));
    expect([copy.size, copy.emptied, copy.counts(keyText((nodes[3] as MadeNode).keyBytes))]).toEqual([{ counts: 1, lists: 1 }, 1, { row: true, refs: 0, roots: 0 }]);
    // Lists up to the bound, then one more: a list that would pass it empties the copy too.
    apply(rewritten(nodes[4] as MadeNode, nodes[5] as MadeNode));
    expect([copy.size, copy.emptied]).toEqual([{ counts: 1, lists: 3 }, 1]);
    apply(rewritten(nodes[0] as MadeNode));
    expect([copy.size, copy.emptied]).toEqual([{ counts: 0, lists: 1 }, 2]);
    // A list it holds, written again, takes no room.
    apply(rewritten(nodes[0] as MadeNode));
    expect([copy.size, copy.emptied]).toEqual([{ counts: 0, lists: 1 }, 2]);
    expect(most).toBe(3);
    // Emptied while it holds something counts; an empty copy emptied does not.
    copy.clear();
    copy.clear();
    expect([copy.size, copy.emptied]).toEqual([{ counts: 0, lists: 0 }, 3]);
  });

  it("emptied by a block that does not continue the one before and by a failed settle; a settle says once that it started from an emptied copy", () => {
    const copy = new CountsCopy({ keys: 10, verify: false });
    copy.learnCounts(text(1), { row: true, refs: 1, roots: 0 });
    copy.begin(true);
    expect([copy.size.counts, copy.settled(copy.emptied)]).toEqual([1, false]);
    copy.begin(false);
    expect(copy.size.counts).toBe(0);
    // A process's first block: an empty copy, and the settle still did not start from earlier heights.
    expect(copy.settled(copy.emptied)).toBe(true);
    expect(copy.settled(copy.emptied)).toBe(false);
    copy.learnCounts(text(1), { row: true, refs: 1, roots: 0 });
    copy.begin(true);
    copy.failed();
    expect(copy.size.counts).toBe(0);
    // The bound emptying it while a settle runs.
    const small = new CountsCopy({ keys: 1, verify: false });
    small.begin(true);
    const before = small.emptied;
    small.learnCounts(text(1), { row: true, refs: 1, roots: 0 });
    small.apply({ net: { deltas: [], inserts: [{ key: keyOf(2), data: Uint8Array.of(1), children: Uint8Array.of(0) }] }, evict: [], newKeys: [keyOf(2)] } as unknown as RunOutcome, new Map());
    expect(small.settled(before)).toBe(true);
  });

  it("the setting: the defaults, and the latest core revision of the build's version, each field defaulted alone", () => {
    expect(RECLAMATION_CACHE_DEFAULT).toEqual({ keys: 100_000, verify: false });
    const entry = (start: number, buildVersion: boolean, settings: Record<string, unknown>) => ({ id: "core", start, buildVersion, settings });
    const of = (...entries: ReturnType<typeof entry>[]) => reclamationCacheOf({ entries } as never);
    expect(of()).toEqual(RECLAMATION_CACHE_DEFAULT);
    expect(of(entry(0, true, {}))).toEqual(RECLAMATION_CACHE_DEFAULT);
    expect(of(entry(0, true, { reclamationCache: { keys: 0 } }))).toEqual({ keys: 0, verify: false });
    expect(of(entry(0, true, { reclamationCache: { verify: true } }))).toEqual({ keys: 100_000, verify: true });
    // The latest revision by start of the build's version; not one of another version, not an earlier one.
    expect(
      of(entry(0, true, { reclamationCache: { keys: 5, verify: true } }), entry(9, true, { reclamationCache: { keys: 7, verify: false } }), entry(20, false, { reclamationCache: { keys: 1 } })),
    ).toEqual({ keys: 7, verify: false });
  });
});

describe("the reads with a copy: what the database is asked, every key named", () => {
  const data = Uint8Array.of(7);
  const over = (name: string, ...children: readonly MadeNode[]) => made(name, children.map(ref));
  const flushed = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, data, children: node.children }));
  const raise = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, delta: 1 }));
  const release = (...nodes: readonly MadeNode[]) => nodes.map((node) => ({ key: node.keyBytes, delta: -1 }));
  const rowsOf = (...nodes: readonly MadeNode[]): Map<string, Uint8Array> => new Map(nodes.map((node) => [node.key, node.children]));
  // Stored: q over k and m, queued; k over l. Run 1, blocks 1 to 3: s over l written and persisted, s released, p over
  // m written and persisted; it deletes q, s, k and l. Run 2, block 4: p released, kept queued. Run 3, block 5: nothing;
  // p is deleted, then m.
  const [l, m] = [made("l"), made("m")];
  const k = over("k", l);
  const [q, s, p] = [over("q", k, m), over("s", l), over("p", m)];
  const names = new Map([q, k, l, m, s, p].map((node) => [node.key, Buffer.from(node.data).toString("utf8")]));
  const found: NodeTables = { rows: rowsOf(q, k, l, m), refs: new Map([[k.key, 1], [l.key, 1], [m.key, 1]]), queue: new Set([q.key]) };
  const runs: readonly { readonly first: bigint; readonly blocks: readonly NodeBatch[]; readonly roots: ReadonlyMap<string, number> }[] = [
    {
      first: 1n,
      blocks: [
        { inserts: flushed(s), rootCounts: raise(s) },
        { inserts: [], rootCounts: release(s) },
        { inserts: flushed(p), rootCounts: raise(p) },
      ],
      roots: new Map([[p.key, 1]]),
    },
    { first: 4n, blocks: [{ inserts: [], rootCounts: release(p) }], roots: new Map() },
    { first: 5n, blocks: [{ inserts: [], rootCounts: [] }], roots: new Map() },
  ];

  /** The three runs, each from the tables the one before left, over `copy` when given: each run's reads and outcome. */
  async function threeRuns(copy: CountsCopy | null) {
    let tables = found;
    const seen: { log: string[]; outcome: RunOutcome; hits: number; misses: number }[] = [];
    for (const run of runs) {
      const reclaim = new RunReclaim({ first: run.first, on: true });
      run.blocks.forEach((block, at) => reclaim.collect(run.first + BigInt(at), block, true));
      const { tables: read, log } = logged(runTables(tables, run.roots), names);
      const counted = { hits: 0, misses: 0 };
      const rootChanges = reclaim.rootChanges;
      const last = run.first + BigInt(run.blocks.length - 1);
      const outcome = await reclaim.compute(copy === null ? read : withCountsCopy(read, copy, { height: last, rootChanges, counted }));
      copy?.apply(outcome, rootChanges);
      const next = applied(tables, outcome.net);
      expect(next.problems).toEqual([]);
      tables = next.tables;
      seen.push({ log, outcome, ...counted });
    }
    return seen;
  }

  it("with no copy, a copy, and a verifying copy: the copy answers the counts and child lists the runs before read or wrote; the outcomes are the same", async () => {
    const none = await threeRuns(null);
    expect(none.map((run) => run.log)).toEqual([
      ["rows p s", "missing l m", "queue", "counts p q s", "children q", "counts k", "children k", "counts l", "children l"],
      ["queue", "counts p"],
      ["queue", "counts p", "children p", "counts m", "children m"],
    ]);
    const copy = new CountsCopy({ keys: 100, verify: false });
    const kept = await threeRuns(copy);
    expect(kept.map((run) => run.log)).toEqual([
      // An empty copy: run 1 reads as with none.
      ["rows p s", "missing l m", "queue", "counts p q s", "children q", "counts k", "children k", "counts l", "children l"],
      // p's counts were read by run 1 (it was then no row) and p entered as a new node: its root count is answered as
      // held plus run 2's change.
      ["queue"],
      // p's counts and its list (written by run 1) from the copy; m's, never read or written, from the database.
      ["queue", "counts m", "children m"],
    ]);
    expect(kept.map((run) => [run.hits, run.misses])).toEqual([
      [0, 8],
      [1, 0],
      [2, 2],
    ]);
    // A verifying copy: the database is asked every key, as with none; the copy's answers are compared with it.
    const verifying = await threeRuns(new CountsCopy({ keys: 100, verify: true }));
    expect(verifying.map((run) => run.log)).toEqual(none.map((run) => run.log));
    expect(verifying.map((run) => [run.hits, run.misses])).toEqual(kept.map((run) => [run.hits, run.misses]));
    for (const runsOf_ of [kept, verifying]) expect(runsOf_.map((run) => run.outcome)).toEqual(none.map((run) => run.outcome));
    // After run 3, p and m are gone from the copy; s and q never stayed.
    expect([p, m, s, q, k, l].map((node) => copy.counts(keyText(node.keyBytes)))).toEqual([undefined, undefined, undefined, undefined, undefined, undefined]);
    expect(copy.size).toEqual({ counts: 0, lists: 0 });
  });

  it("a candidate that is no row: held from its counts read, gone once its run evicts it unwritten, and held again, a row with its list, once a later run writes it", async () => {
    // Stored: c, persisted. Run 1, blocks 1 to 3: x over c written and persisted, then released, then nothing: x is
    // a new node of the run, its counts read (no row), and the cascade deletes it, never written. Run 2, block 4: x
    // written and persisted again.
    const c = made("c");
    const x = made("x", [ref(c)]);
    const t = keyText(x.keyBytes);
    const copy = new CountsCopy({ keys: 10, verify: true });
    let tables: NodeTables = { rows: new Map([[c.key, c.children]]), refs: new Map(), queue: new Set() };
    const settle = async (first: bigint, blocks: readonly NodeBatch[], roots: ReadonlyMap<string, number>) => {
      const reclaim = new RunReclaim({ first, on: true });
      blocks.forEach((block, at) => reclaim.collect(first + BigInt(at), block, true));
      const rootChanges = reclaim.rootChanges;
      const outcome = await reclaim.compute(withCountsCopy(runTables(tables, roots), copy, { height: first + BigInt(blocks.length - 1), rootChanges }));
      const held = copy.counts(t);
      copy.apply(outcome, rootChanges);
      const next = applied(tables, outcome.net);
      expect(next.problems).toEqual([]);
      tables = next.tables;
      return { outcome, held };
    };
    const write = { inserts: [{ key: x.keyBytes, data: x.data, children: x.children }], rootCounts: [{ key: x.keyBytes, delta: 1 }] };
    const one = await settle(1n, [write, { inserts: [], rootCounts: [{ key: x.keyBytes, delta: -1 }] }, { inserts: [], rootCounts: [] }], new Map([[c.key, 1]]));
    // Held after its read, before the update; evicted, never a row, and gone after it.
    expect(one.held).toEqual({ row: false, refs: 0, roots: 0 });
    expect([one.outcome.evict.map(hex), one.outcome.net.deleted.map(hex), one.outcome.net.inserts.length]).toEqual([[x.key], [], 0]);
    expect([copy.counts(t), copy.references(t)]).toEqual([undefined, undefined]);
    // Written again: read again (the copy lacks it), then held as a row, with its root count and its list.
    const two = await settle(4n, [write], new Map([[c.key, 1], [x.key, 1]]));
    expect(two.held).toEqual({ row: false, refs: 0, roots: 0 });
    expect([copy.counts(t), copy.references(t)?.map((ref_) => hex(Buffer.from(ref_, "latin1")))]).toEqual([{ row: true, refs: 0, roots: 1 }, [c.key]]);
    expect(tables.rows.has(x.key)).toBe(true);
  });

  it("a root count is held as after the last settle and answered with the run's change added; the database's is learned less the change", async () => {
    const copy = new CountsCopy({ keys: 10, verify: false });
    const tables = runTables({ rows: new Map([[hex(keyOf(1)), Uint8Array.of(0)]]), refs: new Map(), queue: new Set() }, new Map([[hex(keyOf(1)), 3]]));
    const first = withCountsCopy(tables, copy, { height: 1n, rootChanges: new Map([[text(1), 1]]) });
    expect((await first.counts([keyOf(1)])).map(({ row, refs, roots }) => ({ row, refs, roots }))).toEqual([{ row: true, refs: 0, roots: 3 }]);
    expect(copy.counts(text(1))).toEqual({ row: true, refs: 0, roots: 2 });
    // Answered from the copy at the next run, whose change is −2: no read.
    const asked: number[] = [];
    const second = withCountsCopy({ ...tables, counts: async (keys) => (asked.push(keys.length), tables.counts(keys)) }, copy, { height: 2n, rootChanges: new Map([[text(1), -2]]) });
    expect((await second.counts([keyOf(1)])).map(({ roots }) => roots)).toEqual([0]);
    expect(asked).toEqual([]);
  });

  it("a held list is answered as a list of its references by reference, in order, whatever their number: each form of the list's length", async () => {
    const copy = new CountsCopy({ keys: 10, verify: false });
    const counts = [0, 63, 64, 16_383, 16_384];
    const lists = counts.map((count) => ({ key: keyOf(count + 1), refs: Array.from({ length: count }, (_, i) => keyOf(1_000_000 + i)) }));
    const writing = lists.map(({ key, refs }) => ({ key, data: Uint8Array.of(1), children: encodeChildren(refs.map((ref_) => ({ ref: ref_ }))) }));
    copy.apply({ net: { deltas: [], inserts: writing }, evict: [], newKeys: [] } as unknown as RunOutcome, new Map());
    const none = runTables(NO_TABLES, new Map());
    const answered = await withCountsCopy(none, copy, { height: 1n, rootChanges: new Map() }).children(lists.map(({ key }) => key));
    expect(answered.map(({ key, children }) => [hex(key), childRefKeys(children).map(hex)])).toEqual(lists.map(({ key, refs }) => [hex(key), refs.map(hex)]));
  });

  it("a read of no key the copy lacks sends nothing; a read above its bound is answered and not held", async () => {
    const copy = new CountsCopy({ keys: 1, verify: false });
    copy.learnCounts(text(1), { row: true, refs: 1, roots: 0 });
    const asked: string[] = [];
    const tables = runTables({ rows: new Map([[hex(keyOf(1)), Uint8Array.of(0)], [hex(keyOf(2)), Uint8Array.of(0)]]), refs: new Map([[hex(keyOf(2)), 5]]), queue: new Set() }, new Map());
    const read: RunTables = {
      ...tables,
      counts: async (keys) => (asked.push(`counts ${keys.length}`), tables.counts(keys)),
      children: async (keys) => (asked.push(`children ${keys.length}`), tables.children(keys)),
    };
    const counted = { hits: 0, misses: 0 };
    const over = withCountsCopy(read, copy, { height: 1n, rootChanges: new Map(), counted });
    expect((await over.counts([keyOf(1)])).length).toBe(1);
    expect(await over.children([])).toEqual([]);
    expect(asked).toEqual([]);
    expect((await over.counts([keyOf(2)])).map(({ refs }) => refs)).toEqual([5]);
    expect([asked, copy.counts(text(2)), counted]).toEqual([["counts 1"], undefined, { hits: 1, misses: 1 }]);
  });
});

describe("the verifying copy halts on any difference from the database", () => {
  const k = keyOf(7);
  const rows = (...keys: readonly Uint8Array[]): Map<string, Uint8Array> => new Map(keys.map((key) => [hex(key), Uint8Array.of(0)]));
  const tables = runTables({ rows: rows(k), refs: new Map([[hex(k), 2]]), queue: new Set() }, new Map([[hex(k), 1]]));

  for (const [field, held] of [
    ["the row flag", { row: false, refs: 2, roots: 1 }],
    ["the count", { row: true, refs: 3, roots: 1 }],
    ["the root count", { row: true, refs: 2, roots: 0 }],
  ] as const) {
    it(`counts: ${field} held wrong; the same copy not verifying answers it without a read`, async () => {
      const make = (verify: boolean): CountsCopy => {
        const copy = new CountsCopy({ keys: 10, verify });
        copy.learnCounts(keyText(k), held);
        return copy;
      };
      const details = await mismatchOf(() => withCountsCopy(tables, make(true), { height: 9n, rootChanges: new Map() }).counts([k]));
      expect(details).toMatchObject({ reason: "copy-mismatch", height: 9n, key: `0x${hex(k)}`, what: "counts", held, stored: { row: true, refs: 2, roots: 1 } });
      const asked: number[] = [];
      const quiet = withCountsCopy({ ...tables, counts: async (keys) => (asked.push(keys.length), tables.counts(keys)) }, make(false), { height: 9n, rootChanges: new Map() });
      expect((await quiet.counts([k])).map(({ row, refs, roots }) => ({ row, refs, roots }))).toEqual([held]);
      expect(asked).toEqual([]);
    });
  }

  it("counts: a key held that the database leaves out is compared with none", async () => {
    const copy = new CountsCopy({ keys: 10, verify: true });
    copy.learnCounts(keyText(k), { row: false, refs: 0, roots: 0 });
    const leaving: RunTables = { ...tables, counts: async () => [] };
    expect(await mismatchOf(() => withCountsCopy(leaving, copy, { height: 1n, rootChanges: new Map() }).counts([k]))).toBeUndefined();
    copy.learnCounts(keyText(k), { row: true, refs: 0, roots: 0 });
    expect(await mismatchOf(() => withCountsCopy(leaving, copy, { height: 1n, rootChanges: new Map() }).counts([k]))).toMatchObject({
      what: "counts",
      held: { row: true, refs: 0, roots: 0 },
      stored: { row: false, refs: 0, roots: 0 },
    });
  });

  it("child lists: another list, the same keys fewer times, and a list held for a key that is no row", async () => {
    const [a, b] = [made("a"), made("b")];
    const node = made("w", [ref(a), ref(a)]);
    const stored = runTables({ rows: new Map([[node.key, node.children]]), refs: new Map(), queue: new Set() }, new Map());
    const holding = (list: readonly MadeNode[], key: Uint8Array = node.keyBytes): CountsCopy => {
      const copy = new CountsCopy({ keys: 10, verify: true });
      const written = made("w", list.map(ref));
      copy.apply({ net: { deltas: [], inserts: [{ key, data: written.data, children: written.children }] }, evict: [], newKeys: [] } as unknown as RunOutcome, new Map());
      return copy;
    };
    const ask = (copy: CountsCopy, key: Uint8Array = node.keyBytes) => mismatchOf(() => withCountsCopy(stored, copy, { height: 3n, rootChanges: new Map() }).children([key]));
    expect(await ask(holding([a, a]))).toBeUndefined();
    const x = (node_: MadeNode): string => `0x${node_.key}`;
    expect(await ask(holding([a, b]))).toMatchObject({ reason: "copy-mismatch", key: x(node), what: "references", held: [x(a), x(b)], stored: [x(a), x(a)] });
    expect(await ask(holding([a]))).toMatchObject({ what: "references", held: [x(a)], stored: [x(a), x(a)] });
    expect(await ask(holding([a], b.keyBytes), b.keyBytes)).toMatchObject({ key: x(b), what: "references", held: [x(a)], stored: null });
  });

  it("roots-not-added (a fault): a held root count answered without the run's change differs, and the verifying copy halts", async () => {
    const copy = (verify: boolean): CountsCopy => {
      const made_ = new CountsCopy({ keys: 10, verify });
      made_.learnCounts(keyText(k), { row: true, refs: 2, roots: 0 });
      return made_;
    };
    const fault: CopyFault = "roots-not-added";
    const answer = async (verify: boolean, given?: CopyFault) =>
      (await withCountsCopy(tables, copy(verify), { height: 4n, rootChanges: new Map([[keyText(k), 1]]), ...(given === undefined ? {} : { fault: given }) }).counts([k]))[0]?.roots;
    expect([await answer(false), await answer(true)]).toEqual([1, 1]);
    expect(await answer(false, fault)).toBe(0);
    expect(await mismatchOf(() => answer(true, fault))).toMatchObject({ what: "counts", held: { roots: 0 }, stored: { roots: 1 } });
  });
});

/** The faults of the computation, each run with and without a copy. */
const RUN_FAULTS: readonly RunFault[] = [
  "second-occurrence-not-decremented",
  "unchanged-counted",
  "increment-once-per-parent",
  "released-in-block",
  "referenced-queued-deleted",
  "first-round-only",
  "roots-read-as-before",
  "first-list-kept",
  "run-as-one-block",
  "dropped-unprotected",
  "old-queue-only",
  "queue-change-dropped",
  "judged-at-end",
  "deleted-kept-known",
];

/** How a history is run with a copy. */
interface WithCopy {
  readonly size: number;
  readonly fault?: RunFault;
  /** The copy kept from run to run; none for no copy. */
  readonly copy: CountsCopy | null;
  /** Emptied after every run (a negative control). */
  readonly emptied?: boolean;
  /** The net write not applied to it (`net-not-applied`, a negative control). */
  readonly unapplied?: boolean;
  readonly copyFault?: CopyFault;
  /** After each run's update, every count and list the copy holds compared with the tables ({@link heldProblems}). */
  readonly checkHeld?: boolean;
}

/** What a history run with a copy gave: each run's outcome or halt, and the keys the reads asked the database. */
interface Copied {
  readonly outcomes: string[];
  counts: number;
  children: number;
  hits: number;
  misses: number;
  /** With `checkHeld`: where a held count or list differed from the tables after a run, and how many were compared. */
  readonly problems: string[];
  compared: number;
}

/**
 * Where what `copy` holds differs from `tables` and `roots` (the root counts after the run's last block) after the run
 * that ended at `height`, every key the history met (`met`, as hex) looked up: each held count against the tables'
 * row, count and root count, each held list against the row's references. The copy must hold no key outside `met`.
 */
function heldProblems(copy: CountsCopy, met: ReadonlySet<string>, tables: NodeTables, roots: ReadonlyMap<string, number>, height: number, seen: Copied): string[] {
  const problems: string[] = [];
  let counts = 0;
  let lists = 0;
  for (const key of met) {
    const text = keyText(Uint8Array.from(Buffer.from(key, "hex")));
    const held = copy.counts(text);
    if (held !== undefined) {
      counts += 1;
      const want = { row: tables.rows.has(key), refs: tables.refs.get(key) ?? 0, roots: roots.get(key) ?? 0 };
      if (held.row !== want.row || held.refs !== want.refs || held.roots !== want.roots) {
        problems.push(`after ${height}: the copy holds the counts of ${key.slice(0, 12)} as ${JSON.stringify(held)}, the tables ${JSON.stringify(want)}`);
      }
    }
    const list = copy.references(text);
    if (list !== undefined) {
      lists += 1;
      const stored = tables.rows.get(key);
      const want = stored === undefined ? null : childRefKeys(stored).map(hex);
      const got = list.map((ref_) => hex(Buffer.from(ref_, "latin1")));
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`after ${height}: the copy holds the list of ${key.slice(0, 12)} as ${got.length} references, the tables ${want === null ? "no row" : want.length}`);
    }
  }
  if (counts !== copy.size.counts || lists !== copy.size.lists) {
    problems.push(`after ${height}: the copy holds ${copy.size.counts} counts and ${copy.size.lists} lists, of which ${counts} and ${lists} are of keys the history met`);
  }
  seen.compared += counts + lists;
  return problems;
}

/** A run's outcome as text, for comparing two ways of running it. */
const outcomeText = (outcome: RunOutcome): string =>
  JSON.stringify({
    inserts: outcome.net.inserts.map((node) => [hex(node.key), hex(node.children)]),
    deltas: outcome.net.deltas.map(({ key, delta }) => [hex(key), delta]),
    counted: outcome.net.counted,
    unqueued: outcome.net.unqueued.map(hex),
    queued: outcome.net.queued.map(hex),
    deleted: outcome.net.deleted.map(hex),
    evict: outcome.evict.map(hex),
    rounds: outcome.rounds,
    kinds: [outcome.newNodes, outcome.rewrittenNodes, outcome.unchangedNodes, outcome.keptByReplaced],
  });

/**
 * `blocks` in runs of `how.size` from no tables, each run's tables those the run before left as its net write changes
 * them, with `how.copy` kept from run to run. A halt, or a net write that would not apply, ends the history.
 */
async function withCopy(blocks: readonly ModelBlock[], how: WithCopy): Promise<Copied> {
  const seen: Copied = { outcomes: [], counts: 0, children: 0, hits: 0, misses: 0, problems: [], compared: 0 };
  let mine: NodeTables = NO_TABLES;
  /** Every key the history's flushes named so far, as hex: no other key can enter the copy. */
  const met = new Set<string>();
  for (const run of runsOf(blocks, how.size)) {
    for (const block of run) {
      for (const node of block.flushed.inserts) {
        met.add(node.key);
        for (const ref_ of childRefKeys(node.children)) met.add(hex(ref_));
      }
      for (const { key } of block.flushed.rootCounts) met.add(key);
    }
    const first = run[0] as ModelBlock;
    const last = run.at(-1) as ModelBlock;
    const reclaim = new RunReclaim({ first: BigInt(first.height), on: first.on, ...(how.fault === undefined ? {} : { fault: how.fault }) });
    const tables = runTables(mine, last.step.after.roots);
    const read: RunTables = {
      ...tables,
      counts: async (keys) => ((seen.counts += keys.length), tables.counts(keys)),
      children: async (keys) => ((seen.children += keys.length), tables.children(keys)),
    };
    const counted = { hits: 0, misses: 0 };
    let rootChanges: ReadonlyMap<string, number> = new Map();
    let outcome: RunOutcome;
    try {
      // The flush rule halts a block of a longer run when it is handed over.
      for (const block of run) reclaim.collect(BigInt(block.height), flushOf(block.flushed), block.on);
      rootChanges = reclaim.rootChanges;
      outcome = await reclaim.compute(
        how.copy === null
          ? read
          : withCountsCopy(read, how.copy, { height: BigInt(last.height), rootChanges, counted, ...(how.copyFault === undefined ? {} : { fault: how.copyFault }) }),
      );
    } catch (error) {
      const reason = haltReason(error);
      if (reason === undefined) throw error;
      seen.outcomes.push(`halt ${reason}: ${(error as Error).message}`);
      return seen;
    } finally {
      seen.hits += counted.hits;
      seen.misses += counted.misses;
    }
    seen.outcomes.push(outcomeText(outcome));
    const next = applied(mine, outcome.net);
    if (next.problems.length > 0) {
      seen.outcomes.push(`the net write does not apply: ${next.problems.join("; ")}`);
      return seen;
    }
    if (how.copy !== null && how.unapplied !== true) how.copy.apply(outcome, rootChanges);
    if (how.emptied === true) how.copy?.clear();
    if (how.checkHeld === true && how.copy !== null) seen.problems.push(...heldProblems(how.copy, met, next.tables, last.step.after.roots, last.height, seen));
    mine = next.tables;
  }
  return seen;
}

const sweepingOrNot = historyScripts({ oneForm: true });
const twoForms = historyScripts({ oneForm: false, flushRule: true });

describe("the generated histories with a copy kept from run to run", () => {
  /**
   * `blocks` in runs of 1 and of 3, `fault` given or not: the outcomes with a copy, with a verifying copy and (with
   * `small`) with a verifying copy of 5 keys equal to those without one, and the keys each asks the database. How many
   * runs and halts it saw.
   */
  async function alike(blocks: readonly ModelBlock[], fault: RunFault | undefined, small: boolean): Promise<{ runs: number; halts: number; compared: number }> {
    let runs = 0;
    let halts = 0;
    let compared = 0;
    for (const size of [1, 3]) {
      // Without a fault, every count and list held is compared with the tables after each run.
      const base = { size, ...(fault === undefined ? { checkHeld: true } : { fault }) };
      const where = `runs of ${size}, ${fault ?? "no fault"}`;
      const none = await withCopy(blocks, { ...base, copy: null });
      const kept = await withCopy(blocks, { ...base, copy: new CountsCopy({ keys: 100_000, verify: false }) });
      const verifying = await withCopy(blocks, { ...base, copy: new CountsCopy({ keys: 100_000, verify: true }) });
      expect(kept.outcomes, where).toEqual(none.outcomes);
      expect(verifying.outcomes, `${where}, verifying`).toEqual(none.outcomes);
      expect([kept.problems, verifying.problems], where).toEqual([[], []]);
      compared += kept.compared;
      if (small) {
        const five = await withCopy(blocks, { ...base, copy: new CountsCopy({ keys: 5, verify: true }) });
        expect(five.outcomes, `${where}, a copy of 5 keys`).toEqual(none.outcomes);
        expect(five.problems, `${where}, a copy of 5 keys`).toEqual([]);
      }
      // The verifying copy asks the database every key, as no copy does; the copy asks only those it lacks.
      expect([verifying.counts + verifying.children, verifying.hits + verifying.misses], where).toEqual([none.counts + none.children, none.counts + none.children]);
      expect(kept.counts + kept.children, where).toBe(kept.misses);
      runs += none.outcomes.length;
      halts += none.outcomes.filter((outcome) => outcome.startsWith("halt")).length;
    }
    return { runs, halts, compared };
  }

  for (const [family, histories] of [
    ["in one form", sweepingOrNot],
    ["in two forms", twoForms],
  ] as const) {
    it(`${family}, no fault: in runs of 1 and 3, the outcome with a copy, a verifying copy and a verifying copy of 5 keys is the outcome without one at every run, and after each run every count and list each holds is the tables' (seed ${SEED}, ${HISTORIES} histories)`, async () => {
      let runs = 0;
      let compared = 0;
      await fc.assert(
        fc.asyncProperty(histories, async (script: HistoryScript) => {
          const seen = await alike(modelBlocks(script), undefined, true);
          runs += seen.runs;
          compared += seen.compared;
        }),
        { seed: SEED, numRuns: HISTORIES },
      );
      expect(runs).toBeGreaterThan(800);
      // Not vacuous: many held entries compared.
      expect(compared).toBeGreaterThan(10_000);
    }, 300_000);

    it(`${family}, each fault of the computation: in runs of 1 and 3, the outcome with a copy and with a verifying copy is the outcome without one at every run (seed ${SEED}, ${FAULT_HISTORIES} histories)`, async () => {
      let runs = 0;
      let halts = 0;
      await fc.assert(
        fc.asyncProperty(histories, async (script: HistoryScript) => {
          const blocks = modelBlocks(script);
          for (const fault of RUN_FAULTS) {
            const seen = await alike(blocks, fault, false);
            runs += seen.runs;
            halts += seen.halts;
          }
        }),
        { seed: SEED, numRuns: FAULT_HISTORIES },
      );
      // Not vacuous: many runs, and the faults halt some histories.
      expect(runs).toBeGreaterThan(1_000);
      expect(halts).toBeGreaterThan(0);
    }, 300_000);
  }

  /** The keys the reads asked the database over the histories, runs of one block, with no fault. */
  async function readsOver(how: Omit<WithCopy, "size" | "copy"> & { readonly copy: () => CountsCopy | null }) {
    const total = { counts: 0, children: 0 };
    await fc.assert(
      fc.asyncProperty(sweepingOrNot, async (script: HistoryScript) => {
        const seen = await withCopy(modelBlocks(script), { ...how, size: 1, copy: how.copy() });
        total.counts += seen.counts;
        total.children += seen.children;
      }),
      { seed: SEED, numRuns: HISTORIES },
    );
    return total;
  }

  it(`the keys the counts and children reads ask the database, runs of one block, fall with a copy no verifying run filled (seed ${SEED}, ${HISTORIES} histories in one form)`, async () => {
    const none = await readsOver({ copy: () => null });
    const kept = await readsOver({ copy: () => new CountsCopy({ keys: 100_000, verify: false }) });
    expect(none).toEqual(READS_WITHOUT);
    expect(kept).toEqual(READS_WITH);
  }, 300_000);

  it("control: a copy emptied after every run reads what no copy reads: the reads do not fall", async () => {
    const emptied = await readsOver({ copy: () => new CountsCopy({ keys: 100_000, verify: false }), emptied: true });
    expect(emptied).toEqual(READS_WITHOUT);
    expect(emptied).not.toEqual(READS_WITH);
  }, 300_000);

  for (const [control, how] of [
    ["the net write not applied to the copy (net-not-applied)", { unapplied: true }],
    ["a root count answered without the run's change (roots-not-added)", { copyFault: "roots-not-added" as const }],
  ] as const) {
    it(`control: ${control}: the outcome differs from no copy's in some histories, and the verifying copy halts with copy-mismatch`, async () => {
      let differs = 0;
      let mismatches = 0;
      await fc.assert(
        fc.asyncProperty(sweepingOrNot, async (script: HistoryScript) => {
          const blocks = modelBlocks(script);
          const none = await withCopy(blocks, { size: 1, copy: null });
          const kept = await withCopy(blocks, { size: 1, copy: new CountsCopy({ keys: 100_000, verify: false }), ...how });
          const verifying = await withCopy(blocks, { size: 1, copy: new CountsCopy({ keys: 100_000, verify: true }), ...how });
          if (JSON.stringify(kept.outcomes) !== JSON.stringify(none.outcomes)) differs += 1;
          if (verifying.outcomes.some((outcome) => outcome.startsWith("halt copy-mismatch"))) mismatches += 1;
        }),
        { seed: SEED, numRuns: HISTORIES },
      );
      expect(differs).toBeGreaterThan(0);
      expect(mismatches).toBeGreaterThanOrEqual(differs);
    }, 300_000);
  }
});

/**
 * The keys the `counts` and `children` reads asked the database over {@link HISTORIES} histories in one form at
 * {@link SEED}, in runs of one block, without a copy and with one kept from run to run (measured). The histories start
 * from no tables, so every row was written by an earlier run and its list is held when the cascade deletes it: no list
 * is read. The counts read are those of keys the copy does not hold: keys no earlier run read or wrote, or deleted
 * since (a node a run writes new and raises among them: its counts are read before it is written).
 */
const READS_WITHOUT = { counts: 2_353, children: 711 };
const READS_WITH = { counts: 473, children: 0 };
