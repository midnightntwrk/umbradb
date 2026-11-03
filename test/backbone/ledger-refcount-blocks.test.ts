import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { NodeBatch } from "../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { AGAIN, CHANGE, extendedCases, LAST, LEAVES, REQUEUE, REVERT, rootOf, stateNodes, TO_EMBEDDED } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { fixtureProblems, fixtureReach, type Reach, reachIn, referencesOf } from "./refcount-checks.js";
import { type DagRun, runDag, runProblems } from "./refcount-process.js";
import { modelOfBatches, modelProblems, type TableSnapshot } from "./sweep-tapes.js";

/**
 * The reclamation step's rules seen block by block through the real process, on PostgreSQL 18 and PGlite 0.5.10, on
 * the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`) and its test package: [R5, R6, R7, R8, R9; LG-11,
 * LG-12, LG-14]
 * - a row written again with its stored child list, by the package (`again` at AGAIN) and by a restarted worker's first
 *   block (`requeued` at REQUEUE + 1: the new worker loads the state after REQUEUE, which embeds `requeued`, so it does
 *   not know that row stored): no count changes, the row keeps its transaction id (`xmin`: no write touched it, so no
 *   change is captured for it), and the rows the block's transaction wrote are its new and rewritten nodes;
 * - a queued key referenced again by one new node (`requeued`, queued at REQUEUE, referenced by `requeue holder`);
 * - the one-block lag with `retainStates` 0 (the package refusing to forget a node a live state holds, as the v9
 *   package does) and 2;
 * - a row deleted and needed again (subtree 0's first version, back at REVERT), and a fresh worker loading that state;
 * - a revision lowering `retainStates` from 5 to 0 at REQUEUE, with `requeued` held again by the state after it.
 * Each run is also checked against R3's database check and R1's model.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The rows of `nodes` with each one's transaction id, and the id of the block's own `states` row, at one cursor. */
interface Touches {
  readonly block: string;
  readonly rows: ReadonlyMap<string, string>;
}

/**
 * A user module recording, at each height's `on-compute`, the transaction id (`xmin`) of every row of `nodes` and of
 * the `states` row as committed at the cursor h − 1. A row the block's transaction inserted or replaced carries that
 * block's id, the one its `states` row carries; a row it left as it was keeps its own. [R5]
 */
function touchWatcher(seen: Map<bigint, Touches>): ModuleDeclaration {
  return {
    id: "touch-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "touch-watch-rows", lifetimes: ["table"], table: { schema: "touch_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE touch_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height === 0n) return;
        const at = b.height - 1n;
        const [state] = await read.query(`SELECT xmin::text AS x FROM core_ledger_state.states WHERE height = ${at}`);
        const rows = await read.query("SELECT encode(node_key, 'hex') AS k, xmin::text AS x FROM core_ledger_state.nodes");
        seen.set(at, { block: state?.x as string, rows: new Map(rows.map((row) => [row.k as string, row.x as string])) });
      },
    },
  };
}

/** The tables after `h` in `tables`; throws when none were recorded. */
function after(tables: ReadonlyMap<bigint, TableSnapshot>, h: number): TableSnapshot {
  const found = tables.get(BigInt(h));
  if (found === undefined) throw new Error(`no tables recorded after ${h}`);
  return found;
}

/** The batch of `h` in `batches`; throws when none was recorded. */
function batchOf(batches: ReadonlyMap<bigint, NodeBatch>, h: number): NodeBatch {
  const found = batches.get(BigInt(h));
  if (found === undefined) throw new Error(`no batch recorded for ${h}`);
  return found;
}

/** A batch's nodes by how they stand to the rows `before`: new, rewritten (another child list), or written again unchanged. */
function classify(before: TableSnapshot, batch: NodeBatch): { readonly fresh: string[]; readonly rewritten: string[]; readonly unchanged: string[] } {
  const fresh: string[] = [];
  const rewritten: string[] = [];
  const unchanged: string[] = [];
  for (const node of batch.inserts) {
    const stored = before.rows.get(hex(node.key));
    if (stored === undefined) fresh.push(hex(node.key));
    else if (Buffer.compare(stored, node.children) !== 0) rewritten.push(hex(node.key));
    else unchanged.push(hex(node.key));
  }
  return { fresh: fresh.sort(), rewritten: rewritten.sort(), unchanged: unchanged.sort() };
}

/**
 * What differs from R5 for `key` at block `h`: the batch writes it with the child list stored after h − 1; the counts
 * of the keys it references are those after h − 1; its row keeps its transaction id; and the rows block h's transaction
 * wrote are the batch's new and rewritten nodes that are rows after h, without it. Empty when R5 holds. [R5]
 */
function writtenAgainProblems(
  tables: ReadonlyMap<bigint, TableSnapshot>,
  batches: ReadonlyMap<bigint, NodeBatch>,
  touches: ReadonlyMap<bigint, Touches>,
  h: number,
  key: string,
): string[] {
  const problems: string[] = [];
  const [before, now, batch] = [after(tables, h - 1), after(tables, h), batchOf(batches, h)];
  const { fresh, rewritten, unchanged } = classify(before, batch);
  if (!unchanged.includes(key)) problems.push(`block ${h} does not write ${key} again with its stored child list`);
  for (const ref of new Set(referencesOf(before.rows.get(key) ?? new Uint8Array([0])))) {
    if (now.refs.get(ref) !== before.refs.get(ref)) problems.push(`${ref}, which ${key} references, is counted ${now.refs.get(ref)} after ${h}, ${before.refs.get(ref)} before`);
  }
  const [then, later] = [touches.get(BigInt(h - 1)), touches.get(BigInt(h))];
  if (then === undefined || later === undefined) return [...problems, `no transaction ids recorded after ${h - 1} and ${h}`];
  if (later.block === then.block) problems.push(`blocks ${h - 1} and ${h} have one transaction id`);
  if (later.rows.get(key) !== then.rows.get(key)) problems.push(`block ${h} wrote the row ${key}`);
  const wrote = [...later.rows].filter(([, id]) => id === later.block).map(([k]) => k).sort();
  const expected = [...fresh, ...rewritten].filter((k) => now.rows.has(k)).sort();
  if (JSON.stringify(wrote) !== JSON.stringify(expected)) problems.push(`block ${h} wrote the rows ${wrote.join(", ")}, not its new and rewritten nodes ${expected.join(", ")}`);
  return problems;
}

/** The tables of a snapshot as text: rows with their child lists, counts, root counts, queue, and every table's digest. */
const snapshotText = (t: TableSnapshot): string =>
  JSON.stringify([[...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue].sort(), [...t.digests]]);

/** The root key of the state after `h` of the extended DAG, hex. */
const rootKey = (h: number): string => hex(rootOf(h, "extended").slice(1));

/** After each height 0 to `last`, every key's child list as the batches last wrote it (a deleted row's included). */
function listsByHeight(batches: ReadonlyMap<bigint, NodeBatch>, last: number): Map<number, ReadonlyMap<string, Uint8Array>> {
  const byHeight = new Map<number, ReadonlyMap<string, Uint8Array>>();
  let lists = new Map<string, Uint8Array>();
  for (let h = 0; h <= last; h++) {
    lists = new Map([...lists, ...batchOf(batches, h).inserts.map((node) => [hex(node.key), node.children] as const)]);
    byHeight.set(h, lists);
  }
  return byHeight;
}

/**
 * The rows of the state after `s` as stored after `c`: those its root reaches through the child lists written up to `c`.
 * A rewrite of one of its nodes after `s` changes them (a small child it then embeds is no longer a row of it).
 */
function rowsOfStateAt(lists: ReadonlyMap<number, ReadonlyMap<string, Uint8Array>>, s: number, c: number): string[] {
  const written = lists.get(c);
  if (written === undefined) throw new Error(`no child lists after ${c}`);
  return [...reachIn(written, [rootKey(s)]).reached].sort();
}

/** The test package's counter `name` in `memory`. */
const counter = (memory: SharedArrayBuffer, name: keyof typeof COUNTERS): number => Atomics.load(new Int32Array(memory), COUNTERS[name]);

describe.each(PROCESS_BACKENDS)("R5–R9 (LG-14): the reclamation step's rules through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R5: a row written again with its stored child list — `again` by the test package at AGAIN, `requeued` in a restarted worker's first block at REQUEUE + 1 — changes no count, its row is untouched (same xmin, no change captured), and the node write's affected rows exclude it", async () => {
    // The package's memory drops `again` before AGAIN, so it writes `again` again unchanged there.
    const db = await backend.database();
    const touches = new Map<bigint, Touches>();
    const run = await runDag(db, { dag: "extended", last: AGAIN + 1, user: [touchWatcher(touches)] });
    expect(run.status).toMatchObject({ cursor: BigInt(AGAIN + 1), reason: null });
    expect(writtenAgainProblems(run.tables, run.batches, touches, AGAIN, hex(extendedCases(AGAIN).again.node.key))).toEqual([]);
    expect(modelProblems(run.tables, modelOfBatches(run.batches, AGAIN + 1))).toEqual([]);
    expect(runProblems(run, "extended")).toEqual([]);
    // The node tables are content-defined: no block captures a change of them, so none is digested.
    expect(await db.query(`SELECT "table" FROM core_digest.tables WHERE "schema" = 'core_ledger_state' AND "table" IN ('nodes', 'ref_counts', 'unreferenced')`)).toEqual([]);

    // A restarted worker's first block: the process stopped at REQUEUE and started again on the same database. Its new
    // worker loads the state after REQUEUE from the database; there `requeue` embeds `requeued`, so the worker does not
    // know the row `requeued` stored and writes it again with `requeue holder`, which references it. The run that never
    // restarted does not write it.
    const requeued = hex(extendedCases(REQUEUE).requeue.requeued.key);
    expect(batchOf(run.batches, REQUEUE + 1).inserts.map((node) => hex(node.key))).not.toContain(requeued);
    const restartedDb = await backend.database();
    const restartTouches = new Map<bigint, Touches>();
    const first = await runDag(restartedDb, { dag: "extended", last: REQUEUE, user: [touchWatcher(restartTouches)] });
    expect(first.status).toMatchObject({ cursor: BigInt(REQUEUE), reason: null });
    const memory = countersMemory();
    const restarted = await runDag(restartedDb, {
      dag: "extended",
      last: REQUEUE + 2,
      resume: BigInt(REQUEUE),
      data: { counters: memory },
      user: [touchWatcher(restartTouches)],
    });
    expect(restarted.status).toMatchObject({ cursor: BigInt(REQUEUE + 2), reason: null });
    // A new worker thread, which read the state after REQUEUE from the database.
    expect([counter(memory, "threads"), counter(memory, "storeLoads"), counter(memory, "storeLoadHeight")]).toEqual([1, 1, REQUEUE]);
    const tables = new Map([...first.tables, ...restarted.tables]);
    const batches = new Map([...first.batches, ...restarted.batches]);
    expect(writtenAgainProblems(tables, batches, restartTouches, REQUEUE + 1, requeued)).toEqual([]);
    // Its tables after that block are those of the run that never restarted.
    expect(snapshotText(after(tables, REQUEUE + 1))).toBe(snapshotText(after(run.tables, REQUEUE + 1)));
    expect(modelProblems(tables, modelOfBatches(batches, REQUEUE + 2))).toEqual([]);
    expect(fixtureProblems("extended", tables, batches, REQUEUE + 2)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("R6: `requeued`, queued at REQUEUE and referenced once by one new node of REQUEUE + 1 (`requeue holder`), is not deleted there, leaves the queue, is counted 1, and its children's counts do not change", async () => {
    const run = await runDag(await backend.database(), { dag: "extended", last: REQUEUE + 1 });
    expect(run.status).toMatchObject({ cursor: BigInt(REQUEUE + 1), reason: null });
    const h = REQUEUE + 1;
    const key = hex(extendedCases(REQUEUE).requeue.requeued.key);
    const [before, now, batch] = [after(run.tables, h - 1), after(run.tables, h), batchOf(run.batches, h)];
    // Queued at h − 1: a row nothing references or persists (`requeue` embeds it from REQUEUE on).
    expect(before.queue.has(key)).toBe(true);
    expect(before.rows.has(key)).toBe(true);
    // One new node of block h references it, once: `requeue holder`.
    const { fresh } = classify(before, batch);
    const referencing = batch.inserts.filter((node) => fresh.includes(hex(node.key))).flatMap((node) => referencesOf(node.children).filter((ref) => ref === key).map(() => hex(node.key)));
    expect(referencing).toEqual([hex(extendedCases(h).requeue.holder?.key ?? new Uint8Array(0))]);
    // Not deleted, out of the queue, counted 1; its children's counts as they were.
    expect(now.rows.get(key)).toEqual(before.rows.get(key));
    expect(run.evicted.get(BigInt(h)) ?? []).not.toContain(key);
    expect(now.queue.has(key)).toBe(false);
    expect(now.refs.get(key)).toBe(1);
    const children = referencesOf(before.rows.get(key) as Uint8Array);
    expect(children).toEqual([hex(extendedCases(REQUEUE).requeue.leaf.key)]);
    for (const child of children) expect(now.refs.get(child)).toBe(before.refs.get(child));
    expect(modelProblems(run.tables, modelOfBatches(run.batches, h))).toEqual([]);
    expect(runProblems(run, "extended")).toEqual([]);
  }, PATIENCE_MS * 2);

  it("R7 with retainStates 0: the state released by block h has its root queued at h, none of its rows deleted at h, every row of it outside K_{h+1} deleted at h + 1, and the worker's eviction at h + 1 not refused (the package refusing to forget a node a live state holds), every h from 1 to TO_EMBEDDED − 1", async () => {
    // The package holding by reference refuses an eviction naming a node a live state reaches; it diverges from the
    // other packages only after TO_EMBEDDED, where the run stops.
    const memory = countersMemory();
    const last = TO_EMBEDDED;
    const run = await runDag(await backend.database(), { dag: "extended", data: { keeping: "holds-by-reference", counters: memory }, last });
    expect(run.status).toMatchObject({ cursor: BigInt(last), reason: null });
    expect([run.restarts, run.failure, counter(memory, "refusals")]).toEqual([0, null, 0]);
    const reach = fixtureReach("extended", run.batches, last);
    const lists = listsByHeight(run.batches, last);
    const problems: string[] = [];
    for (let h = 1; h < last; h++) {
      const [at, next] = [after(run.tables, h), after(run.tables, h + 1)];
      if (!at.queue.has(rootKey(h - 1))) problems.push(`the root of the state after ${h - 1} is not queued at ${h}`);
      for (const key of rowsOfStateAt(lists, h - 1, h - 1)) if (!at.rows.has(key)) problems.push(`${key} of the state after ${h - 1} is deleted at ${h}`);
      // Its rows as stored after h − 1 and after h, outside K_{h+1}: every one stored after h, deleted and evicted at h + 1.
      const released = [...new Set([...rowsOfStateAt(lists, h - 1, h - 1), ...rowsOfStateAt(lists, h - 1, h)])];
      const kept = (reach.get(BigInt(h + 1)) as Reach).kept;
      const outside = released.filter((key) => !kept.has(key));
      if (!outside.includes(rootKey(h - 1))) problems.push(`the root of the state after ${h - 1} is in K_${h + 1}`);
      const evicted = new Set(run.evicted.get(BigInt(h + 1)) ?? []);
      for (const key of outside) {
        if (next.rows.has(key)) problems.push(`${key} of the state after ${h - 1}, outside K_${h + 1}, is stored after ${h + 1}`);
        if (!evicted.has(key)) problems.push(`${key} of the state after ${h - 1} is not evicted at ${h + 1}`);
      }
    }
    expect(problems).toEqual([]);
    expect(modelProblems(run.tables, modelOfBatches(run.batches, last))).toEqual([]);
    expect(runProblems(run, "extended")).toEqual([]);
  }, PATIENCE_MS * 2);

  it("R7 with retainStates 2: the state after h − 1 is released at h + 2, none of its rows deleted before h + 3, and at h + 3 every row of it outside K_{h+3} deleted, every h from 1 to LAST − 3", async () => {
    const run = await runDag(await backend.database(), { dag: "extended", settings: { retainStates: 2 } });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const reach = fixtureReach("extended", run.batches, LAST, { retainStates: 2 });
    const lists = listsByHeight(run.batches, LAST);
    const problems: string[] = [];
    for (let h = 1; h + 3 <= LAST; h++) {
      const root = rootKey(h - 1);
      if (!after(run.tables, h + 1).roots.has(root)) problems.push(`the state after ${h - 1} is not persisted after ${h + 1}`);
      if (after(run.tables, h + 2).roots.has(root)) problems.push(`the state after ${h - 1} is still persisted after ${h + 2}`);
      if (!after(run.tables, h + 2).queue.has(root)) problems.push(`the root of the state after ${h - 1} is not queued at ${h + 2}`);
      // Block c deletes none of its rows as stored after c − 1 (a rewrite in between can make a row no longer one of its).
      for (const c of [h, h + 1, h + 2]) {
        for (const key of rowsOfStateAt(lists, h - 1, c - 1)) if (!after(run.tables, c).rows.has(key)) problems.push(`${key} of the state after ${h - 1} is gone after ${c}`);
      }
      // Its rows as stored after h − 1 … h + 2, outside K_{h+3}: none stored after h + 3.
      const released = [...new Set([h - 1, h, h + 1, h + 2].flatMap((c) => rowsOfStateAt(lists, h - 1, c)))];
      const kept = (reach.get(BigInt(h + 3)) as Reach).kept;
      const outside = released.filter((key) => !kept.has(key));
      if (!outside.includes(root)) problems.push(`the root of the state after ${h - 1} is in K_${h + 3}`);
      for (const key of outside) if (after(run.tables, h + 3).rows.has(key)) problems.push(`${key} of the state after ${h - 1}, outside K_${h + 3}, is stored after ${h + 3}`);
    }
    expect(problems).toEqual([]);
    expect(modelProblems(run.tables, modelOfBatches(run.batches, LAST))).toEqual([]);
    expect(fixtureProblems("extended", run.tables, run.batches, LAST, { retainStates: 2 })).toEqual([]);
  }, PATIENCE_MS * 2);

  it("R8: subtree 0's first version, deleted at h1 after CHANGE and needed again at REVERT, is inserted again at REVERT with its references counted again, and a fresh worker loads the state after REVERT from the database", async () => {
    const db = await backend.database();
    const first = await runDag(db, { dag: "extended", last: REVERT });
    expect(first.status).toMatchObject({ cursor: BigInt(REVERT), reason: null });
    const again = stateNodes(0, "extended").slice(1, 2 + LEAVES);
    expect(again.map((node) => Buffer.from(node.data).toString("utf8"))).toEqual(["subtree 0 0", ...Array.from({ length: LEAVES }, (_, j) => `leaf 0 0 ${j}`)]);
    const keys = again.map((node) => hex(node.key));
    const present = (h: number): boolean[] => keys.map((key) => after(first.tables, h).rows.has(key));
    // Deleted at one block h1 between CHANGE and REVERT, and not stored again before REVERT.
    const h1 = Array.from({ length: REVERT }, (_, h) => h).find((h) => h > 0 && present(h - 1).every(Boolean) && !present(h).some(Boolean));
    expect(h1).toBeGreaterThan(CHANGE);
    for (let h = h1 as number; h < REVERT; h++) expect(present(h), `after ${h}`).toEqual(keys.map(() => false));
    // Inserted again at REVERT, every one of them in its batch, each counted again: the subtree's node by the new root,
    // each leaf by the subtree's node.
    expect(present(REVERT)).toEqual(keys.map(() => true));
    const written = batchOf(first.batches, REVERT).inserts.map((node) => hex(node.key));
    for (const key of keys) expect(written).toContain(key);
    const [before, now] = [after(first.tables, REVERT - 1), after(first.tables, REVERT)];
    for (const key of keys) expect(before.refs.has(key), key).toBe(false);
    expect(keys.map((key) => now.refs.get(key))).toEqual(keys.map(() => 1));
    expect(referencesOf(now.rows.get(rootKey(REVERT)) as Uint8Array)).toContain(keys[0]);
    expect(referencesOf(now.rows.get(keys[0] as string) as Uint8Array)).toEqual(keys.slice(1));
    expect(runProblems(first, "extended")).toEqual([]);

    // A fresh worker (a new process on the same database) loads the state after REVERT from the database: the test
    // package reads every row it reaches, checks each key against its content and the keys against the fixture's state.
    const memory = countersMemory();
    const fresh: DagRun = await runDag(db, { dag: "extended", last: REVERT + 1, resume: BigInt(REVERT), data: { counters: memory } });
    expect(fresh.status).toMatchObject({ cursor: BigInt(REVERT + 1), reason: null });
    expect(fresh.failure).toBeNull();
    expect([counter(memory, "threads"), counter(memory, "storeLoads"), counter(memory, "storeLoadHeight")]).toEqual([1, 1, REVERT]);
  }, PATIENCE_MS * 3);

  it("R9: with the window full, a revision lowering retainStates from 5 to 0 at REQUEUE releases the six states after REQUEUE − 6 … REQUEUE − 1 there; at REQUEUE + 1, in that one block, every row of theirs outside K is deleted, and `requeued`, which the state after REQUEUE + 1 holds again, stays", async () => {
    const h = REQUEUE;
    const last = h + 2;
    const run = await runDag(await backend.database(), {
      dag: "extended",
      settings: { retainStates: 5 },
      revisions: [{ start: BigInt(h), settings: { retainStates: 0 } }],
      last,
    });
    expect(run.status).toMatchObject({ cursor: BigInt(last), reason: null });
    const retainedFrom = (c: number): number => (c < h ? Math.max(0, c - 5) : c);
    const reach = fixtureReach("extended", run.batches, last, { retainedFrom });
    const six = Array.from({ length: 6 }, (_, i) => rootKey(h - 6 + i));
    // The window full after h − 1: the six states persisted, once each.
    expect([...after(run.tables, h - 1).roots].sort()).toEqual(six.map((key) => [key, 1]).sort());
    // Released at h, all six: only the state after h persisted, their roots queued, none of their rows deleted.
    expect([...after(run.tables, h).roots.keys()]).toEqual([rootKey(h)]);
    for (const key of six) expect(after(run.tables, h).queue.has(key), key).toBe(true);
    const theirs = (reach.get(BigInt(h)) as Reach).before;
    for (const key of six) expect(theirs.has(key)).toBe(true);
    for (const key of theirs) expect(after(run.tables, h).rows.has(key), key).toBe(true);
    // At h + 1, in that one block, every row of theirs (as stored after h − 1 and after h) outside K_{h+1} deleted and
    // evicted: rows only the earlier five states reached among them.
    const lists = listsByHeight(run.batches, last);
    const kept = (reach.get(BigInt(h + 1)) as Reach).kept;
    const all = new Set([...theirs, ...six.flatMap((_, i) => rowsOfStateAt(lists, h - 6 + i, h))]);
    const outside = [...all].filter((key) => !kept.has(key));
    const lastOfThem = new Set(rowsOfStateAt(lists, h - 1, h - 1));
    expect(outside.filter((key) => !lastOfThem.has(key)).length).toBeGreaterThan(0);
    const evicted = new Set(run.evicted.get(BigInt(h + 1)) ?? []);
    for (const key of outside) {
      expect(after(run.tables, h + 1).rows.has(key), key).toBe(false);
      expect(evicted.has(key), key).toBe(true);
    }
    // `requeued`: a row of theirs (the state after h − 1 references it), which the state after h does not hold (it embeds
    // it) and the state after h + 1 holds again (`requeue holder` references it): it stays.
    const requeued = hex(extendedCases(h).requeue.requeued.key);
    expect(theirs.has(requeued)).toBe(true);
    expect((reach.get(BigInt(h)) as Reach).reached.has(requeued)).toBe(false);
    expect((reach.get(BigInt(h + 1)) as Reach).reached.has(requeued)).toBe(true);
    expect(after(run.tables, h + 1).rows.has(requeued)).toBe(true);
    expect(modelProblems(run.tables, modelOfBatches(run.batches, last))).toEqual([]);
    expect(fixtureProblems("extended", run.tables, run.batches, last, { retainedFrom })).toEqual([]);
  }, PATIENCE_MS * 2);
});
