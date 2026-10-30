/**
 * The fixed-budget mark-and-sweep that deletes stored ledger nodes no live state reaches. It is the ledger's `gc-v1`
 * (`midnight-ledger` `storage-core/src/gc.rs`) run over `core_ledger_state`'s tables, with three changes so that every
 * machine deletes the same nodes at the same block:
 * - the wall-clock budget is replaced by a fixed budget of {@link SWEEP_BUDGET} node units per block;
 * - the grey and mark sets are tables;
 * - each round takes keys in byte order.
 * [LG-14, Q31 C; CORE-ARCH §4.9; design §5.4, §10]
 *
 * **One block's step** ({@link sweepStep}) is computed in `core-ledger-state`'s `on-compute`, from the tables as
 * committed at h − 1 ({@link SweepTables}, read through on-compute's read) and the block's own batch (its inserted nodes
 * and root count changes, held in memory over the tables). It is written in the block's `on-db-write`
 * ({@link writeSweep}), after the batch. The step runs in this order: [LG-14]
 * 1. When no cycle runs (`idle`), the cycle number rises, every key with a positive root count becomes grey, and the
 *    phase becomes `mark`. These are the counts as committed at h − 1, before the block's batch: the state after h − 1
 *    is still alive in the ledger worker while block h is computed, so it must be marked in a cycle that starts at h.
 *    (The package refuses to forget a node that a live object holds.) [`docs/issues/00019`]
 * 2. Every key whose count rose in the block, and that is neither marked nor grey, becomes grey.
 * 3. While budget remains and the grey set is not empty, the smallest grey keys in byte order, as many as the budget
 *    left at the round's start, are visited one by one. Each is removed from the grey set, marked, and costs one unit;
 *    each key its stored node references (`../../ledger/node-refs.ts`) that is neither marked nor grey becomes grey. A
 *    key with no stored node is marked and adds nothing.
 * 4. Only when the grey set is empty and budget remains, the phase is `sweep`. The stored nodes after the sweep
 *    position (`sweep_after`) are scanned in key order, as many as the budget left, one unit each. Each unmarked one is
 *    deleted, and the position moves to the last one scanned.
 * 5. A scan that returned fewer nodes than its budget has passed the last node. The marks and the position are cleared
 *    and the phase becomes `idle`; the rest of the budget is unused, and the next block starts a new cycle.
 *
 * "Stored" means what the tables hold at h − 1 plus the block's inserted nodes: the step sees the database as the block
 * leaves it, before its deletions.
 *
 * **`sweep: off`** (development only): no step runs and nothing is deleted. The first block whose revision has it off,
 * after one with it on, clears the grey set, the marks and the position and sets the phase to `idle`
 * ({@link sweepReset}). So when the sweep is turned on again it starts a new cycle: the roots that rose while it was off
 * were never made grey, and a cycle begun earlier could delete their nodes. [CF-9]
 *
 * **Deleted nodes** are evicted from the ledger worker's caches (`LedgerHost.evict`), in `on-compute`, before the
 * block's transaction. A node forgotten but still stored is merely written again; a node deleted but not forgotten would
 * never be written again. So a later block that needs a deleted node again inserts it (`layout-v2` writes every created
 * node). [LG-14]
 *
 * {@link GreyPicker} is the seam a negative control replaces, using insertion order instead of byte order. [A105]
 *
 * Its tables and every statement are in `./sql.ts`.
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { childRefKeys } from "../../ledger/node-refs.js";
import type { NodeBatch } from "../../ledger/types.js";
import {
  allGreyKeys,
  clearGrey,
  clearMarks,
  deleteGrey,
  deleteNodes,
  insertGrey,
  insertMarks,
  keyFlags,
  nodeChildren,
  readSweepRow,
  rootKeys,
  scanNodes,
  smallestGreyKeys,
  SWEEP_TABLE,
  updateSweepRow,
} from "./sql.js";

/** K: the node units each block's step may spend, a constant of the UmbraDB version. [LG-14] */
export const SWEEP_BUDGET = 10_000;

/** The sweep's phase (`core_ledger_state.sweep.phase`). */
export type SweepPhase = "idle" | "mark" | "sweep";

/** The sweep's row (`core_ledger_state.sweep`). [design §10] */
export interface SweepState {
  /** The cycles started so far. */
  readonly cycle: bigint;
  readonly phase: SweepPhase;
  /** The last node scanned in this cycle's sweep; null before the scan. */
  readonly sweepAfter: Uint8Array | null;
}

/** What the step reads of the tables as committed at h − 1. */
export interface SweepTables {
  state(): Promise<SweepState>;
  /** The keys of `root_counts` (each count positive), in byte order. */
  roots(): Promise<Uint8Array[]>;
  /** The `limit` smallest keys of `grey`, in byte order. */
  smallestGrey(limit: number): Promise<Uint8Array[]>;
  /** Every key of `grey`, in byte order (a picker's other than byte order). */
  allGrey(): Promise<Uint8Array[]>;
  /** For each of `keys`, by `0x`-less hex: whether it is in `grey`, and whether it is in `marks` (one statement). */
  flags(keys: readonly Uint8Array[]): Promise<Map<string, { readonly grey: boolean; readonly marked: boolean }>>;
  /** The child lists of those of `keys` that `nodes` holds, by `0x`-less hex key. */
  children(keys: readonly Uint8Array[]): Promise<Map<string, Uint8Array>>;
  /**
   * The keys of `nodes` after `after` (all of them for null), in byte order, at most `limit`, each with whether it is
   * in `marks` (one statement).
   */
  scan(after: Uint8Array | null, limit: number): Promise<{ readonly key: Uint8Array; readonly marked: boolean }[]>;
}

/** The grey set as the block's step sees it: the table's at h − 1 with the block's changes. */
export interface GreyView {
  /** The `count` smallest grey keys, in byte order. */
  smallest(count: number): Promise<Uint8Array[]>;
  /** Every grey key, in byte order. */
  all(): Promise<Uint8Array[]>;
}

/**
 * Which grey keys a marking round visits: `count` of them (fewer only when the set is smaller), each a key of the view
 * (the step counts every key it returns as grey before the round).
 */
export type GreyPicker = (grey: GreyView, count: number) => Promise<readonly Uint8Array[]>;

/** The default picker: the smallest grey keys in byte order. [LG-14] */
export const BYTE_ORDER: GreyPicker = (grey, count) => grey.smallest(count);

/** What one block's step writes (see {@link writeSweep}). */
export interface SweepWrites {
  readonly before: SweepState;
  readonly after: SweepState;
  /** Keys that become grey (not in `grey` at h − 1). */
  readonly greyInserted: readonly Uint8Array[];
  /** Keys of `grey` at h − 1 that leave it. */
  readonly greyDeleted: readonly Uint8Array[];
  /** The whole grey set cleared (`sweep: off`'s reset). */
  readonly greyAll: boolean;
  /** Keys newly marked (none when the marks are cleared). */
  readonly marksInserted: readonly Uint8Array[];
  /** The marks cleared: the cycle ended, or the reset. */
  readonly marksCleared: boolean;
  /** The nodes deleted. */
  readonly deleted: readonly Uint8Array[];
  /** The units spent. */
  readonly units: number;
}

const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The two key lists merged in byte order, each key once, the first `limit`. */
function merged(a: readonly Uint8Array[], b: readonly Uint8Array[], limit: number): Uint8Array[] {
  const byHex = new Map<string, Uint8Array>();
  for (const key of [...a, ...b]) byHex.set(hexOf(key), key);
  return [...byHex.keys()].sort().slice(0, limit).map((key) => byHex.get(key) as Uint8Array);
}

/** Block h's step (see the module comment): `tables` as committed at h − 1, `batch` the block's. */
export async function sweepStep(
  tables: SweepTables,
  batch: NodeBatch,
  options: { readonly budget: number; readonly picker?: GreyPicker },
): Promise<SweepWrites> {
  const picker = options.picker ?? BYTE_ORDER;
  const before = await tables.state();
  let { cycle, phase, sweepAfter } = before;
  const inserts = new Map(batch.inserts.map((node) => [hexOf(node.key), node]));
  /** Keys made grey in this block (not grey at h − 1), and grey keys of h − 1 that left the set. */
  const added = new Map<string, Uint8Array>();
  const removed = new Set<string>();
  /** Keys marked in this block. */
  const marked = new Map<string, Uint8Array>();
  /** The table's answers for keys already asked, so a key is asked once per block. */
  const tableGrey = new Map<string, boolean>();
  const tableMarks = new Map<string, boolean>();
  const known = async (keys: readonly Uint8Array[]): Promise<void> => {
    const fresh = [...new Map(keys.filter((key) => !tableGrey.has(hexOf(key))).map((key) => [hexOf(key), key])).values()];
    if (fresh.length === 0) return;
    const flags = await tables.flags(fresh);
    for (const key of fresh) {
      const flag = flags.get(hexOf(key));
      tableGrey.set(hexOf(key), flag?.grey === true);
      tableMarks.set(hexOf(key), flag?.marked === true);
    }
  };
  const isGrey = (k: string): boolean => added.has(k) || (tableGrey.get(k) === true && !removed.has(k));
  const isMarked = (k: string): boolean => marked.has(k) || tableMarks.get(k) === true;
  // A key of `removed` was visited in this block, so it is marked: a key that is neither grey nor marked is not grey in
  // the table either. So no branch takes a key back out of `removed`: no key would reach it.
  const makeGrey = (key: Uint8Array): void => {
    const k = hexOf(key);
    if (isGrey(k) || isMarked(k)) return;
    added.set(k, key);
  };
  const view: GreyView = {
    async smallest(count) {
      const fromTable = (await tables.smallestGrey(count + removed.size)).filter((key) => !removed.has(hexOf(key)));
      return merged(fromTable, [...added.values()], count);
    },
    async all() {
      const fromTable = (await tables.allGrey()).filter((key) => !removed.has(hexOf(key)));
      return merged(fromTable, [...added.values()], Number.MAX_SAFE_INTEGER);
    },
  };

  // (1) A cycle starts: the roots as committed at h − 1.
  if (phase === "idle") {
    cycle += 1n;
    phase = "mark";
    const roots = await tables.roots();
    await known(roots);
    for (const key of roots) makeGrey(key);
  }
  // (2) The roots that rose in this block.
  const rose = batch.rootCounts.filter((count) => count.delta > 0).map((count) => count.key);
  await known(rose);
  for (const key of rose) makeGrey(key);

  // (3) Marking rounds.
  let budget = options.budget;
  let units = 0;
  while (budget > 0) {
    const round = await picker(view, budget);
    if (round.length === 0) break;
    const unread = round.filter((key) => !inserts.has(hexOf(key)));
    const stored = unread.length === 0 ? new Map<string, Uint8Array>() : await tables.children(unread);
    const childrenOf = (k: string): Uint8Array | undefined => inserts.get(k)?.children ?? stored.get(k);
    const refs = round.flatMap((key) => {
      const children = childrenOf(hexOf(key));
      return children === undefined ? [] : childRefKeys(children);
    });
    await known([...round, ...refs]);
    for (const key of round) {
      const k = hexOf(key);
      if (added.has(k)) added.delete(k);
      else removed.add(k);
      marked.set(k, key);
      budget -= 1;
      units += 1;
      const children = childrenOf(k);
      if (children !== undefined) for (const ref of childRefKeys(children)) makeGrey(ref);
    }
  }

  // (4) The sweep, when the grey set is empty — the rounds above end with budget left only once it is —; (5) the cycle's
  // end.
  const deleted: Uint8Array[] = [];
  let marksCleared = false;
  if (budget > 0) {
    phase = "sweep";
    const after = sweepAfter === null ? null : hexOf(sweepAfter);
    const fromInserts = [...inserts.values()].map((node) => node.key).filter((key) => after === null || hexOf(key) > after);
    const fromTable = await tables.scan(sweepAfter, budget);
    for (const { key, marked } of fromTable) if (!tableMarks.has(hexOf(key))) tableMarks.set(hexOf(key), marked);
    const scanned = merged(
      fromTable.map((row) => row.key),
      fromInserts,
      budget,
    );
    await known(scanned.filter((key) => !tableMarks.has(hexOf(key))));
    for (const key of scanned) {
      units += 1;
      if (!isMarked(hexOf(key))) deleted.push(key);
    }
    const last = scanned.at(-1);
    if (last !== undefined) sweepAfter = last;
    if (scanned.length < budget) {
      marksCleared = true;
      sweepAfter = null;
      phase = "idle";
    }
  }

  // Every key of `removed` left the table's grey set: a round's keys are grey (`GreyPicker`), and one not added in this
  // block is the table's.
  const greyDeleted = [...removed].sort();
  return Object.freeze({
    before,
    after: Object.freeze({ cycle, phase, sweepAfter }),
    greyInserted: [...added.keys()].sort().map((k) => added.get(k) as Uint8Array),
    greyDeleted: greyDeleted.map((k) => Uint8Array.from(Buffer.from(k, "hex"))),
    greyAll: false,
    marksInserted: marksCleared ? [] : [...marked.keys()].sort().map((k) => marked.get(k) as Uint8Array),
    marksCleared,
    deleted,
    units,
  });
}

/** The first block with `sweep: off` after one with it on (see the module comment): every set cleared, the phase idle. */
export function sweepReset(state: SweepState): SweepWrites {
  return Object.freeze({
    before: state,
    after: Object.freeze({ cycle: state.cycle, phase: "idle" as const, sweepAfter: null }),
    greyInserted: [],
    greyDeleted: [],
    greyAll: true,
    marksInserted: [],
    marksCleared: true,
    deleted: [],
    units: 0,
  });
}

/** The {@link SweepTables} of a read at h − 1 (`core-ledger-state`'s on-compute read). */
export function sqlSweepTables(read: Pick<ReadHandle, "query">): SweepTables {
  return {
    async state() {
      const row = await readSweepRow(read);
      if (row === undefined) throw new Error(`${SWEEP_TABLE} holds no row (its migration inserts it)`);
      return row;
    },
    roots: () => rootKeys(read),
    smallestGrey: (limit) => smallestGreyKeys(read, limit),
    allGrey: () => allGreyKeys(read),
    async flags(wanted) {
      if (wanted.length === 0) return new Map();
      const rows = await keyFlags(read, wanted);
      return new Map(rows.map(({ key, grey, marked }) => [hexOf(key), { grey, marked }]));
    },
    async children(wanted) {
      if (wanted.length === 0) return new Map();
      const rows = await nodeChildren(read, wanted);
      return new Map(rows.map(({ key, children }) => [hexOf(key), children]));
    },
    scan: (after, limit) => scanNodes(read, after, limit),
  };
}

/** Writes one block's step, in its transaction after its batch (see the module comment). */
export async function writeSweep(w: Pick<BlockWriteHandle, "execute">, writes: SweepWrites): Promise<void> {
  if (writes.greyAll) await clearGrey(w);
  else if (writes.greyDeleted.length > 0) await deleteGrey(w, writes.greyDeleted);
  if (writes.greyInserted.length > 0) await insertGrey(w, writes.greyInserted);
  if (writes.marksCleared) await clearMarks(w);
  else if (writes.marksInserted.length > 0) await insertMarks(w, writes.marksInserted);
  if (writes.deleted.length > 0) await deleteNodes(w, writes.deleted);
  await updateSweepRow(w, writes.after);
}
