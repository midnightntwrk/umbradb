import {
  type NetWrite,
  type RunCheck,
  type RunFault,
  type RunOutcome,
  RunReclaim,
  type RunTables,
} from "../../src/backbone/core-ledger-state/run-reclaim.js";
import { refcountStep, type RefcountTables } from "./refcount-step.js";
import { UmbraError } from "../../src/db/errors.js";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type Child, childKey, encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import {
  type BlockScript,
  driveHistory,
  type GeneratedBlock,
  GraphWorld,
  type HistoryScript,
  nodeSet,
  reach,
  type RefcountBatch,
  RefcountModel,
  type RefcountModelStep,
  type RefcountTables as ModelTables,
} from "./refcount-model.js";

/**
 * What the tests of the reclamation of a run of blocks (`src/backbone/core-ledger-state/run-reclaim.ts`) share: the
 * node tables in memory behind the computation's reads, a net write applied to them, and the generated histories run
 * in runs against the reference model (`./refcount-model.ts`). Imports nothing of Vitest: every finding is a line of
 * text, so the tests require none and the negative controls require one.
 *
 * A history is run in runs with its flushes made two ways ({@link Feed}):
 * - `"per-block"`: the flushes of the model's own history, whose package was told of every block's deletions, so a
 *   node deleted and needed again inside a run is flushed again;
 * - `"per-run"`: a second package over the same history, told of deletions at a run's end only: such a node is not
 *   flushed again.
 */

/** `nodes`, `ref_counts` and `unreferenced` in memory, keys as hex. */
export interface NodeTables {
  readonly rows: ReadonlyMap<string, Uint8Array>;
  readonly refs: ReadonlyMap<string, number>;
  readonly queue: ReadonlySet<string>;
}

/** The node tables of a database before its first block. */
export const NO_TABLES: NodeTables = Object.freeze({ rows: new Map(), refs: new Map(), queue: new Set<string>() });

const bytes = (key: string): Uint8Array => Uint8Array.from(Buffer.from(key, "hex"));
const same = (a: Uint8Array, b: Uint8Array): boolean => Buffer.compare(a, b) === 0;
const sorted = (keys: Iterable<string>): string[] => [...keys].sort();
const short = (key: string): string => key.slice(0, 12);

/** How often the computation asked each read, and for how many keys. */
export interface Reads {
  rows: number;
  changed: number;
  missing: number;
  queue: number;
  queued: number;
  counts: number;
  children: number;
  keys: number;
}

/** No read yet. */
export const noReads = (): Reads => ({ rows: 0, changed: 0, missing: 0, queue: 0, queued: 0, counts: 0, children: 0, keys: 0 });

/**
 * The computation's reads over `nodes` (the node tables as the block before the run left them) and `roots` (the root
 * counts after the run's last block: the computation runs after that block's own rows are written). Each key comes
 * back as a view into a larger buffer, as a driver's rows do.
 */
export function runTables(nodes: NodeTables, roots: ReadonlyMap<string, number>, reads: Reads = noReads()): RunTables {
  const back = (key: string): Uint8Array => {
    const padded = new Uint8Array(40);
    padded.set(bytes(key), 5);
    return padded.subarray(5, 37);
  };
  const asked = (name: Exclude<keyof Reads, "keys">, keys: number): void => {
    reads[name] += 1;
    reads.keys += keys;
  };
  return {
    async rows(keys) {
      asked("rows", keys.length);
      return keys.map(hex).filter((key) => nodes.rows.has(key)).map(back);
    },
    async changed(given) {
      asked("changed", given.length);
      return given
        .map((node) => ({ key: hex(node.key), stored: nodes.rows.get(hex(node.key)), children: node.children }))
        .filter(({ stored, children }) => stored !== undefined && !same(stored, children))
        .map(({ key, stored }) => ({ key: back(key), children: stored as Uint8Array }));
    },
    async missing(keys) {
      asked("missing", keys.length);
      return keys.map(hex).filter((key) => !nodes.rows.has(key)).map(back);
    },
    async queue() {
      asked("queue", 0);
      return sorted(nodes.queue).map(back);
    },
    async queued(keys) {
      asked("queued", keys.length);
      return keys.map(hex).filter((key) => nodes.queue.has(key)).map(back);
    },
    async counts(keys) {
      asked("counts", keys.length);
      return keys
        .map(hex)
        .map((key) => ({ key: back(key), row: nodes.rows.has(key), refs: nodes.refs.get(key) ?? 0, roots: roots.get(key) ?? 0 }));
    },
    async children(keys) {
      asked("children", keys.length);
      return keys
        .map(hex)
        .filter((key) => nodes.rows.has(key))
        .map((key) => ({ key: back(key), children: nodes.rows.get(key) as Uint8Array }));
    },
  };
}

/** The per-block step's reads over the same tables (`./refcount-step.ts`'s seam), the root counts after the block before. */
export function stepTables(nodes: NodeTables, roots: ReadonlyMap<string, number>): RefcountTables {
  return {
    async rows(keys) {
      return new Set(keys.map(hex).filter((key) => nodes.rows.has(key)));
    },
    async changed(given) {
      const found = new Map<string, Uint8Array[]>();
      for (const node of given) {
        const stored = nodes.rows.get(hex(node.key));
        if (stored !== undefined && !same(stored, node.children)) found.set(hex(node.key), childRefKeys(stored));
      }
      return found;
    },
    async queue() {
      return sorted(nodes.queue).map(bytes);
    },
    async counts(keys) {
      return new Map(
        keys
          .map(hex)
          .filter((k) => nodes.rows.has(k) || nodes.refs.has(k) || roots.has(k))
          .map((k) => [k, { row: nodes.rows.has(k), refs: nodes.refs.get(k) ?? 0, roots: roots.get(k) ?? 0 }]),
      );
    },
    async references(keys) {
      const found = new Map<string, Uint8Array[]>();
      for (const key of keys) {
        const stored = nodes.rows.get(hex(key));
        if (stored !== undefined) found.set(hex(key), childRefKeys(stored));
      }
      return found;
    },
  };
}

/** The payload the tests give the node of key `key` (hex): its own, so a payload written under another key shows. */
export const payloadOf = (key: string): Uint8Array => Uint8Array.from(Buffer.from(`payload of ${key}`, "utf8"));

/** A model block's flush as a block hands it over, each node with its payload ({@link payloadOf}). */
export const flushOf = (flushed: RefcountBatch): NodeBatch => ({
  inserts: flushed.inserts.map(({ key, children }) => ({ key: bytes(key), data: payloadOf(key), children })),
  rootCounts: flushed.rootCounts.map(({ key, delta }) => ({ key: bytes(key), delta })),
});

/**
 * `before` after `net`, as `writeNet`'s statements change the tables, and the statements that would not affect the
 * rows `net` names (`row-count-mismatch`), or that would take a count below 0.
 */
export function applied(before: NodeTables, net: NetWrite): { readonly tables: NodeTables; readonly problems: string[] } {
  const rows = new Map(before.rows);
  const refs = new Map(before.refs);
  const queue = new Set(before.queue);
  const problems: string[] = [];
  let written = 0;
  for (const node of net.inserts) {
    const stored = rows.get(hex(node.key));
    if (stored === undefined || !same(stored, node.children)) written += 1;
    rows.set(hex(node.key), node.children);
  }
  if (written !== net.written) problems.push(`write-nodes affects ${written} rows where ${net.written} were computed`);
  let counted = 0;
  for (const { key, delta } of net.deltas) {
    const next = (refs.get(hex(key)) ?? 0) + delta;
    if (next < 0) problems.push(`the count of ${short(hex(key))} falls to ${next}`);
    if (next <= 0) refs.delete(hex(key));
    else {
      refs.set(hex(key), next);
      counted += 1;
    }
  }
  if (counted !== net.counted) problems.push(`merge-ref-counts affects ${counted} rows where ${net.counted} were computed`);
  for (const key of net.unqueued) if (!queue.delete(hex(key))) problems.push(`delete-unreferenced: ${short(hex(key))} is not queued`);
  for (const key of net.queued) {
    if (queue.has(hex(key))) problems.push(`insert-unreferenced: ${short(hex(key))} is queued already`);
    queue.add(hex(key));
  }
  for (const key of net.deleted) if (!rows.delete(hex(key))) problems.push(`delete-nodes: ${short(hex(key))} is no row`);
  return { tables: { rows, refs, queue }, problems };
}

/** Where two sets of node tables differ, by table; none when they hold the same bytes. */
export function tableDifferences(got: NodeTables, want: NodeTables): string[] {
  const rows = (tables: NodeTables): string[] => sorted([...tables.rows].map(([key, children]) => `${key}:${hex(children)}`));
  const counts = (tables: NodeTables): string[] => sorted([...tables.refs].map(([key, count]) => `${key}:${count}`));
  const differences: string[] = [];
  const compare = (table: string, a: string[], b: string[]): void => {
    if (a.length === b.length && a.every((line, at) => line === b[at])) return;
    const extra = a.filter((line) => !b.includes(line)).map((line) => short(line));
    const absent = b.filter((line) => !a.includes(line)).map((line) => short(line));
    differences.push(`${table} differs: ${extra.length} rows the model lacks (${extra.slice(0, 3).join(", ")}), ${absent.length} it has and these lack (${absent.slice(0, 3).join(", ")})`);
  };
  compare("nodes", rows(got), rows(want));
  compare("ref_counts", counts(got), counts(want));
  compare("unreferenced", sorted(got.queue), sorted(want.queue));
  return differences;
}

/** What `tables` break of closure, roots are rows, counts and queue, each recomputed from the rows; none when sound. */
export function inconsistencies(tables: NodeTables, roots: ReadonlyMap<string, number>): string[] {
  const problems: string[] = [];
  const counted = new Map<string, number>();
  for (const [key, children] of tables.rows) {
    for (const ref of childRefKeys(children).map(hex)) {
      counted.set(ref, (counted.get(ref) ?? 0) + 1);
      if (!tables.rows.has(ref)) problems.push(`closure: ${short(key)} references ${short(ref)}, which is no row`);
    }
  }
  for (const key of roots.keys()) if (!tables.rows.has(key)) problems.push(`roots: ${short(key)} has a root count and is no row`);
  for (const key of new Set([...counted.keys(), ...tables.refs.keys()])) {
    if ((counted.get(key) ?? 0) !== (tables.refs.get(key) ?? 0)) {
      problems.push(`counts: ${short(key)} is counted ${tables.refs.get(key) ?? 0} and referenced ${counted.get(key) ?? 0} times`);
    }
  }
  for (const key of new Set([...tables.rows.keys(), ...tables.queue])) {
    const owed = tables.rows.has(key) && !counted.has(key) && !roots.has(key);
    if (owed !== tables.queue.has(key)) problems.push(`queue: ${short(key)} is ${owed ? "not queued" : "queued"}`);
  }
  return problems;
}

/**
 * Whether a block's flush follows the ledger package's flush rule on the rows `before`: each of its nodes that is new,
 * or written with another child list than its row's, is reached from a key whose root count it raises through its own
 * nodes. Written apart from the computation, which checks the same.
 */
export function followsFlushRule(before: ReadonlyMap<string, Uint8Array>, flushed: RefcountBatch): boolean {
  const lists = new Map(flushed.inserts.map(({ key, children }) => [key, childRefKeys(children).map(hex)]));
  const reached = new Set<string>();
  const stack = flushed.rootCounts.filter(({ delta }) => delta > 0).map(({ key }) => key);
  for (let key = stack.pop(); key !== undefined; key = stack.pop()) {
    const refs = lists.get(key);
    if (refs === undefined || reached.has(key)) continue;
    reached.add(key);
    stack.push(...refs);
  }
  return flushed.inserts.every(({ key, children }) => {
    const stored = before.get(key);
    return reached.has(key) || (stored !== undefined && same(stored, children));
  });
}

/** One block of a history the model ran: the tables before it, what the model's package flushed for it, its step. */
export interface ModelBlock {
  readonly height: number;
  /** What the block was generated from; none for a block made by hand. */
  readonly script?: BlockScript;
  readonly on: boolean;
  readonly before: ModelTables;
  readonly flushed: RefcountBatch;
  readonly step: RefcountModelStep;
}

/** `script` run through the reference model, block by block. */
export function modelBlocks(script: HistoryScript): ModelBlock[] {
  return [...driveHistory(script)].map((block) => ({
    height: block.height,
    script: block.script,
    on: block.script.on,
    before: block.tables,
    flushed: block.batch,
    step: block.step,
  }));
}

/** A node made by hand: its key from its payload (its name) and its children's keys, as the node format gives it. */
export interface MadeNode {
  readonly key: string;
  readonly keyBytes: Uint8Array;
  readonly data: Uint8Array;
  readonly tree: readonly Child[];
  readonly children: Uint8Array;
}

/** The node named `name` over `tree`: each child referenced ({@link ref}) or embedded ({@link embedded}). */
export function made(name: string, tree: readonly Child[] = []): MadeNode {
  const data = Uint8Array.from(Buffer.from(name, "utf8"));
  const keyBytes = nodeKey(data, tree.map(childKey));
  return { key: hex(keyBytes), keyBytes, data, tree, children: encodeChildren([...tree]) };
}

/** `node` as a child by reference, and as a child embedded with its own children. */
export const ref = (node: MadeNode): Child => ({ ref: node.keyBytes });
export const embedded = (node: MadeNode): Child => ({ direct: { data: node.data, children: [...node.tree] } });

/** One block made by hand: the nodes it flushes, the keys it persists and releases, its `sweep` (on unless said). */
export interface MadeBlock {
  readonly inserts: readonly MadeNode[];
  readonly persist?: readonly MadeNode[];
  readonly release?: readonly MadeNode[];
  readonly on?: boolean;
}

/** `blocks` run through the reference model from empty tables, block by block; a halt of the model throws. */
export function madeBlocks(blocks: readonly MadeBlock[]): ModelBlock[] {
  const model = new RefcountModel();
  return blocks.map((block, height) => {
    const before = model.tables;
    const flushed: RefcountBatch = {
      inserts: sorted(block.inserts.map((node) => node.key)).map((key) => ({ key, children: (block.inserts.find((node) => node.key === key) as MadeNode).children })),
      rootCounts: sorted([...(block.persist ?? []), ...(block.release ?? [])].map((node) => node.key)).map((key) => ({
        key,
        delta: (block.persist ?? []).some((node) => node.key === key) ? 1 : -1,
      })),
    };
    const on = block.on !== false;
    return { height, on, before, flushed, step: model.block(flushed, on) };
  });
}

/**
 * `blocks` in runs of at most `size`, a run ending where the next block's `sweep` differs (unless `cutAtSweep` is
 * false, which a negative control asks).
 */
export function runsOf<B extends { readonly on: boolean }>(blocks: readonly B[], size: number, cutAtSweep = true): B[][] {
  const runs: B[][] = [];
  for (const block of blocks) {
    const open = runs.at(-1);
    if (open === undefined || open.length >= size || (cutAtSweep && (open[0] as B).on !== block.on)) runs.push([block]);
    else open.push(block);
  }
  return runs;
}

/** How a history's flushes are made (see the module comment). */
export type Feed = "per-block" | "per-run";

/** How a history is cut into runs and computed, beyond the history itself. */
export interface InRuns {
  readonly size: number;
  readonly feed: Feed;
  readonly fault?: RunFault;
  readonly unchecked?: RunCheck;
  readonly cutAtSweep?: boolean;
}

/** What a history run in runs saw, to show it was not vacuous. */
export interface Seen {
  runs: number;
  blocks: number;
  /** The runs that do not sweep. */
  off: number;
  /** The nodes the blocks handed over, each key once per run, and those the net writes wrote. */
  handed: number;
  written: number;
  /** The rows the net writes deleted, and the keys deleted, rows or not. */
  deleted: number;
  evicted: number;
  /** The nodes written over a row with another child list. */
  replaced: number;
  reads: Reads;
}

/** Nothing seen yet. */
export const nothingSeen = (): Seen => ({ runs: 0, blocks: 0, off: 0, handed: 0, written: 0, deleted: 0, evicted: 0, replaced: 0, reads: noReads() });

/** The reason of a `ledger-refcount-invalid`, or undefined for any other error. */
export const haltReason = (error: unknown): string | undefined =>
  error instanceof UmbraError && error.code === "ledger-refcount-invalid" ? String((error.details as { reason?: unknown }).reason) : undefined;

/** What a run's outcome must hold whatever the history; the findings as text. */
export function outcomeProblems(found: NodeTables, after: NodeTables, outcome: RunOutcome, on: boolean): string[] {
  const problems: string[] = [];
  const evicted = new Set(outcome.evict.map(hex));
  for (const key of outcome.net.deleted.map(hex)) if (!evicted.has(key)) problems.push(`the deleted row ${short(key)} is not in the deleted keys`);
  for (const key of evicted) {
    if (after.rows.has(key)) problems.push(`the deleted key ${short(key)} is a row after the run`);
    if (found.rows.has(key) !== outcome.net.deleted.map(hex).includes(key)) problems.push(`the deleted key ${short(key)} is a row the net write does not delete, or the other way`);
  }
  if (!on && (evicted.size > 0 || outcome.rounds > 0)) problems.push("a run that does not sweep deletes");
  for (const node of outcome.net.inserts) {
    if (!same(node.data, payloadOf(hex(node.key)))) problems.push(`the inserted ${short(hex(node.key))} carries another node's payload`);
  }
  return problems;
}

/**
 * Runs `script` in runs against the reference model: at every run's end, `nodes`, `ref_counts` and `unreferenced`
 * computed by the run computation, from the tables it left at the end of the run before, must be the model's after
 * the run's last block, in bytes. The findings, each with its run's end; a halt of the computation is one, and ends
 * the history.
 */
export async function againstModel(script: HistoryScript, cut: InRuns, seen: Seen = nothingSeen()): Promise<string[]> {
  return inRuns(modelBlocks(script), cut, seen, cut.feed === "per-run" ? new GraphWorld(script) : null);
}

/**
 * The same for blocks the model already ran ({@link modelBlocks}, {@link madeBlocks}), in runs as `cut` says; with
 * `world`, a second package over the same history that is told of deletions at a run's end only.
 */
export async function inRuns(blocks: readonly ModelBlock[], cut: InRuns, seen: Seen = nothingSeen(), world: GraphWorld | null = null): Promise<string[]> {
  let mine: NodeTables = NO_TABLES;
  for (const run of runsOf(blocks, cut.size, cut.cutAtSweep)) {
    const first = run[0] as ModelBlock;
    const last = run.at(-1) as ModelBlock;
    const where = `after ${last.height}, runs of ${cut.size}, ${cut.feed}`;
    const reclaim = new RunReclaim({
      first: BigInt(first.height),
      on: first.on,
      ...(cut.fault === undefined ? {} : { fault: cut.fault }),
      ...(cut.unchecked === undefined ? {} : { unchecked: cut.unchecked }),
    });
    let outcome: RunOutcome;
    let generated: GeneratedBlock | null = null;
    try {
      for (const block of run) {
        let flushed = block.flushed;
        if (world !== null) {
          // The same history: the second package is aimed at the queue the model holds, as the first was.
          generated = world.build(block.script as BlockScript, block.before.queue);
          flushed = { inserts: generated.inserts.map(({ key, children }) => ({ key, children })), rootCounts: generated.rootCounts };
          if (JSON.stringify(flushed.rootCounts) !== JSON.stringify(block.flushed.rootCounts)) return [`${where}: the two packages built different states at ${block.height}`];
          if (block !== last) world.commit(generated, []);
        }
        // A run not cut at a change of sweep is given as its first block's setting throughout.
        reclaim.collect(BigInt(block.height), flushOf(flushed), cut.cutAtSweep === false ? first.on : block.on);
      }
      outcome = await reclaim.compute(runTables(mine, last.step.after.roots, seen.reads));
    } catch (error) {
      const reason = haltReason(error);
      if (reason === undefined) throw error;
      return [`${where}: halt ${reason}: ${(error as Error).message}`];
    }
    const next = applied(mine, outcome.net);
    if (world !== null) world.commit(generated as GeneratedBlock, outcome.evict.map(hex));
    const problems = [...next.problems, ...outcomeProblems(mine, next.tables, outcome, first.on), ...tableDifferences(next.tables, last.step.after)];
    if (problems.length > 0) return problems.map((problem) => `${where}: ${problem}`);
    seen.runs += 1;
    seen.blocks += run.length;
    seen.off += first.on ? 0 : 1;
    seen.handed += outcome.handed;
    seen.written += outcome.net.inserts.length;
    seen.deleted += outcome.net.deleted.length;
    seen.evicted += outcome.evict.length;
    seen.replaced += outcome.net.inserts.filter((node) => mine.rows.has(hex(node.key))).length;
    mine = next.tables;
  }
  return [];
}

/** What a history run in runs made shorter saw. */
export interface Remade {
  runs: number;
  /** The times a run was made one block shorter, and the nodes the longer runs would have kept. */
  remade: number;
  kept: number;
  /** The most times one run was made shorter. */
  longest: number;
  /** The runs of one block committed though their block's replaced lists alone keep a node. */
  oneBlockKept: number;
  /** The nodes written over a row with another child list. */
  replaced: number;
}

/**
 * Runs blocks the model already ran in runs of at most `size` (a run ending where `sweep` changes), made shorter as
 * the note's Theorem 5 states: while a run of more than one block has a last block whose replaced lists alone keep a
 * node (`RunOutcome.keptByReplaced` above 0), it is computed again without that block, as many times as that takes;
 * a run of one block is committed as computed. The blocks taken off open the next run. With `remakes` false (a
 * negative control) every run is committed as computed. At every run's end the tables must be the model's in bytes.
 * The findings, as {@link inRuns}'s.
 */
export async function remadeAgainstModel(blocks: readonly ModelBlock[], size: number, seen: Remade, remakes = true): Promise<string[]> {
  let mine: NodeTables = NO_TABLES;
  for (let start = 0; start < blocks.length; ) {
    const on = (blocks[start] as ModelBlock).on;
    let end = Math.min(start + size, blocks.length) - 1;
    for (let at = start + 1; at <= end; at++) if ((blocks[at] as ModelBlock).on !== on) end = Math.min(end, at - 1);
    let cuts = 0;
    for (;;) {
      const last = blocks[end] as ModelBlock;
      const where = `after ${last.height}, runs of ${size}`;
      const reclaim = new RunReclaim({ first: BigInt(start), on });
      let outcome: RunOutcome;
      try {
        for (const block of blocks.slice(start, end + 1)) reclaim.collect(BigInt(block.height), flushOf(block.flushed), on);
        outcome = await reclaim.compute(runTables(mine, last.step.after.roots));
      } catch (error) {
        const reason = haltReason(error);
        if (reason === undefined) throw error;
        return [`${where}: halt ${reason}: ${(error as Error).message}`];
      }
      if (outcome.keptByReplaced > 0 && end > start && remakes) {
        seen.remade += 1;
        seen.kept += outcome.keptByReplaced;
        cuts += 1;
        end -= 1;
        continue;
      }
      seen.longest = Math.max(seen.longest, cuts);
      if (outcome.keptByReplaced > 0 && end === start) seen.oneBlockKept += 1;
      const next = applied(mine, outcome.net);
      const problems = [...next.problems, ...outcomeProblems(mine, next.tables, outcome, on), ...tableDifferences(next.tables, last.step.after)];
      if (problems.length > 0) return problems.map((problem) => `${where}: ${problem}`);
      seen.runs += 1;
      seen.replaced += outcome.net.inserts.filter((node) => mine.rows.has(hex(node.key))).length;
      mine = next.tables;
      start = end + 1;
      break;
    }
  }
  return [];
}

/**
 * The tables after each of `blocks` as the per-block step of `src/` (`refcountStep`) computes them from the tables the
 * block before left, applied in memory as `writeRefcount` and the node writes change them; with the root counts after
 * each block.
 */
export async function stepped(blocks: readonly ModelBlock[]): Promise<{ readonly tables: NodeTables; readonly roots: ReadonlyMap<string, number> }[]> {
  let tables: NodeTables = NO_TABLES;
  let roots: ReadonlyMap<string, number> = new Map();
  const after: { tables: NodeTables; roots: ReadonlyMap<string, number> }[] = [];
  for (const block of blocks) {
    const flush = flushOf(block.flushed);
    const step = await refcountStep(stepTables(tables, roots), flush, { height: BigInt(block.height), on: block.on });
    const rows = new Map(tables.rows);
    const written = new Set([...step.newNodes, ...step.rewritten].map(hex));
    for (const node of flush.inserts) if (written.has(hex(node.key))) rows.set(hex(node.key), node.children);
    for (const key of step.deleted) rows.delete(hex(key));
    const refs = new Map(tables.refs);
    for (const { key, delta } of step.deltas) {
      const count = (refs.get(hex(key)) ?? 0) + delta;
      if (count === 0) refs.delete(hex(key));
      else refs.set(hex(key), count);
    }
    const queue = new Set(tables.queue);
    for (const key of step.unqueued) queue.delete(hex(key));
    for (const key of step.queued) queue.add(hex(key));
    roots = withChanges(roots, block.flushed.rootCounts);
    tables = { rows, refs, queue };
    after.push({ tables, roots });
  }
  return after;
}

/** `roots` with a block's root-count changes added: the root counts after that block. */
export function withChanges(roots: ReadonlyMap<string, number>, changes: readonly { readonly key: string; readonly delta: number }[]): Map<string, number> {
  const after = new Map(roots);
  for (const { key, delta } of changes) {
    const count = (after.get(key) ?? 0) + delta;
    if (count === 0) after.delete(key);
    else after.set(key, count);
  }
  return after;
}

/** The node set under `starts`: the keys they reach through `lists`, and the nodes those keys' child lists embed. */
function nodeSetUnder(starts: Iterable<string>, lists: ReadonlyMap<string, readonly Child[]>): Set<string> {
  const reached = reach(starts, (key) => lists.get(key));
  return nodeSet([...reached].filter((key) => lists.has(key)).map((key) => [key, encodeChildren([...(lists.get(key) as readonly Child[])])] as const));
}

/**
 * Runs `script` in runs with one package told of deletions at a run's end only, and no model beside it: for the
 * histories whose nodes take two forms, where the run computation's bytes need not be the per-block step's. At every
 * run's end the tables must be sound (closure, roots are rows, counts, queue), and after a run that sweeps their node
 * set must be the nodes under the keys with a root count after the block before the last and after the last.
 */
export async function onItsOwn(script: HistoryScript, cut: Omit<InRuns, "feed">, seen: Seen = nothingSeen()): Promise<string[]> {
  const world = new GraphWorld(script);
  let mine: NodeTables = NO_TABLES;
  let height = -1;
  for (const run of runsOf(script.blocks, cut.size, cut.cutAtSweep)) {
    const on = (run[0] as BlockScript).on;
    const first = height + 1;
    const last = height + run.length;
    const where = `after ${last}, runs of ${cut.size}`;
    const reclaim = new RunReclaim({
      first: BigInt(first),
      on,
      ...(cut.fault === undefined ? {} : { fault: cut.fault }),
      ...(cut.unchecked === undefined ? {} : { unchecked: cut.unchecked }),
    });
    // The generator aims some of a block's cases at queued keys: those queued when the run began.
    const aim = mine.queue;
    let rootsBefore: ReadonlyMap<string, number> = new Map();
    let generated: GeneratedBlock | null = null;
    let outcome: RunOutcome;
    try {
      for (const block of run) {
        height += 1;
        rootsBefore = world.state().roots;
        generated = world.build(block, aim);
        reclaim.collect(BigInt(height), flushOf({ inserts: generated.inserts.map(({ key, children }) => ({ key, children })), rootCounts: generated.rootCounts }), on);
        if (height !== last) world.commit(generated, []);
      }
      outcome = await reclaim.compute(runTables(mine, withChanges(rootsBefore, (generated as GeneratedBlock).rootCounts), seen.reads));
    } catch (error) {
      const reason = haltReason(error);
      if (reason === undefined) throw error;
      return [`${where}: halt ${reason}: ${(error as Error).message}`];
    }
    const next = applied(mine, outcome.net);
    world.commit(generated as GeneratedBlock, outcome.evict.map(hex));
    const state = world.state();
    const problems = [...next.problems, ...outcomeProblems(mine, next.tables, outcome, on), ...inconsistencies(next.tables, state.roots)];
    if (on) {
      const want = sorted(nodeSetUnder([...rootsBefore.keys(), ...state.roots.keys()], state.lists));
      const got = sorted(nodeSet(next.tables.rows));
      if (got.length !== want.length || got.some((key, at) => key !== want[at])) {
        problems.push(`the node set holds ${got.length} nodes where the roots after ${last - 1} and ${last} hold ${want.length}`);
      }
    }
    if (problems.length > 0) return problems.map((problem) => `${where}: ${problem}`);
    seen.runs += 1;
    seen.blocks += run.length;
    seen.off += on ? 0 : 1;
    seen.handed += outcome.handed;
    seen.written += outcome.net.inserts.length;
    seen.deleted += outcome.net.deleted.length;
    seen.evicted += outcome.evict.length;
    seen.replaced += outcome.net.inserts.filter((node) => mine.rows.has(hex(node.key))).length;
    mine = next.tables;
  }
  return [];
}
