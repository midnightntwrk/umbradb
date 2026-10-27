/**
 * LG-14's fixed-budget mark-and-sweep (`openspec/changes/core-arch/specs/ledger/spec.md` LG-14; `design.md` §5.4, §10;
 * CORE-ARCH §4.9; decision record Q31 C; task 12.5): the ledger's `gc-v1` (`midnight-ledger`
 * `storage-core/src/gc.rs`) run over `core_ledger_state`'s tables, its wall-clock budget replaced by a fixed budget of
 * {@link SWEEP_BUDGET} node units per block, its grey and mark sets tables, its rounds taking keys in byte order, so that
 * every machine deletes the same nodes at the same block.
 *
 * **One block's step** ({@link sweepStep}) is computed in `core-ledger-state`'s `on-compute` from the tables as committed
 * at h − 1 ({@link SweepTables}, read through on-compute's read) and the block's own batch (its inserted nodes and root
 * count changes, held in memory over the tables), and written in its `on-db-write` ({@link writeSweep}), after the
 * batch. In LG-14's order: (1) when no cycle runs (`idle`), the cycle number rises, every key with a positive root
 * count becomes grey and the phase becomes `mark` — the counts as committed at h − 1, before the block's batch: the
 * state after h − 1 is still alive in the ledger worker while block h is computed, so it must be marked in a cycle
 * that starts at h (the package refuses to forget a node a live object holds; issue 00019); (2) every key whose count
 * rose in the block and is neither marked nor grey becomes grey; (3) while budget remains and the grey set is not
 * empty, the smallest grey keys in byte order, as many as the budget left (fixed at the round's start), are visited one
 * by one: removed from the grey set, marked, one unit spent, and each key its stored node references
 * (`../../ledger/node-refs.ts`) that is neither marked nor grey made grey; a key with no stored node is marked and adds
 * nothing; (4) only when the grey set is empty and budget remains, the phase is `sweep`: the stored nodes after the
 * sweep position (`sweep_after`) are scanned in key order, as many as the budget left, one unit each, each unmarked
 * one deleted, the position moved to the last one scanned; (5) a scan that gave fewer nodes than the budget it had
 * passed the last node: the marks and the position are cleared and the phase is `idle`; the rest of the budget is
 * unused, and the next block starts a new cycle. "Stored" is what the tables hold at h − 1 with the block's inserted
 * nodes: the step sees the database as the block leaves it, before its deletions.
 *
 * **`sweep: off`** (development only, CF-9): no step, nothing deleted. The first block whose revision has it off after
 * one with it on clears the grey set, the marks and the position and makes the phase `idle` ({@link sweepReset}), so
 * that the sweep turned on again starts a new cycle: the roots that rose while it was off were never made grey, and a
 * cycle begun before could delete their nodes.
 *
 * **Deleted nodes** are evicted from the ledger worker's caches (`LedgerHost.evict`, in `on-compute`, before the
 * block's transaction: a node forgotten and still stored is merely written again, a node deleted and not forgotten would
 * never be written again), so a later block that needs one again inserts it (LG-14's "Reused content after a
 * deletion"; `layout-v2` writes every created node).
 *
 * {@link GreyPicker} is the seam a negative control replaces (insertion order instead of byte order, A105).
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { childRefKeys } from "../../ledger/node-refs.js";
import type { NodeBatch } from "../../ledger/types.js";

/** K: the node units each block's step may spend (a constant of the UmbraDB version, LG-14). */
export const SWEEP_BUDGET = 10_000;

/** The sweep's phase (`core_ledger_state.sweep.phase`). */
export type SweepPhase = "idle" | "mark" | "sweep";

/** The sweep's row (`core_ledger_state.sweep`, design §10). */
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

/** Which grey keys a marking round visits: `count` of them (fewer only when the set is smaller). */
export type GreyPicker = (grey: GreyView, count: number) => Promise<readonly Uint8Array[]>;

/** LG-14's: the smallest grey keys in byte order. */
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

const hexOf = (bytes: Uint8Array): string => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const byBytes = (a: Uint8Array, b: Uint8Array): number => (hexOf(a) < hexOf(b) ? -1 : hexOf(a) > hexOf(b) ? 1 : 0);

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
  const makeGrey = (key: Uint8Array): void => {
    const k = hexOf(key);
    if (isGrey(k) || isMarked(k)) return;
    if (tableGrey.get(k) === true) removed.delete(k);
    else added.set(k, key);
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
      fromInserts.sort(byBytes),
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

  const greyDeleted = [...removed].sort().map((k) => (tableGrey.get(k) === true ? (k as string) : null)).filter((k): k is string => k !== null);
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

/** Its tables (`design.md` §10). */
export const SWEEP_TABLE = "core_ledger_state.sweep";
export const GREY_TABLE = "core_ledger_state.grey";
export const MARKS_TABLE = "core_ledger_state.marks";
const NODES = "core_ledger_state.nodes";
const ROOT_COUNTS = "core_ledger_state.root_counts";

const bytes = (value: unknown, what: string): Uint8Array => {
  if (!(value instanceof Uint8Array)) throw new TypeError(`${what} is not bytes`);
  return value;
};

/** The {@link SweepTables} of a read at h − 1 (`core-ledger-state`'s on-compute read). */
export function sqlSweepTables(read: Pick<ReadHandle, "query">): SweepTables {
  const keys = (rows: Record<string, unknown>[], table: string): Uint8Array[] => rows.map((row) => bytes(row.node_key, `${table}.node_key`));
  return {
    async state() {
      const [row] = await read.query(`SELECT cycle, phase, sweep_after FROM ${SWEEP_TABLE} WHERE id = 1`);
      if (row === undefined) throw new Error(`${SWEEP_TABLE} holds no row (its migration inserts it)`);
      return {
        cycle: BigInt(row.cycle as bigint | number | string),
        phase: row.phase as SweepPhase,
        sweepAfter: row.sweep_after === null ? null : bytes(row.sweep_after, `${SWEEP_TABLE}.sweep_after`),
      };
    },
    roots: async () => keys(await read.query(`SELECT node_key FROM ${ROOT_COUNTS} ORDER BY node_key`), ROOT_COUNTS),
    smallestGrey: async (limit) => keys(await read.query(`SELECT node_key FROM ${GREY_TABLE} ORDER BY node_key LIMIT $1`, [limit]), GREY_TABLE),
    allGrey: async () => keys(await read.query(`SELECT node_key FROM ${GREY_TABLE} ORDER BY node_key`), GREY_TABLE),
    async flags(wanted) {
      if (wanted.length === 0) return new Map();
      const rows = await read.query(
        `SELECT k.node_key, EXISTS (SELECT 1 FROM ${GREY_TABLE} g WHERE g.node_key = k.node_key) AS grey,
           EXISTS (SELECT 1 FROM ${MARKS_TABLE} m WHERE m.node_key = k.node_key) AS marked
         FROM unnest($1::bytea[]) AS k (node_key)`,
        [[...wanted]],
      );
      return new Map(rows.map((row) => [hexOf(bytes(row.node_key, "a key")), { grey: row.grey === true, marked: row.marked === true }]));
    },
    async children(wanted) {
      if (wanted.length === 0) return new Map();
      const rows = await read.query(`SELECT node_key, children FROM ${NODES} WHERE node_key = ANY($1::bytea[])`, [[...wanted]]);
      return new Map(rows.map((row) => [hexOf(bytes(row.node_key, `${NODES}.node_key`)), bytes(row.children, `${NODES}.children`)]));
    },
    async scan(after, limit) {
      const marked = `EXISTS (SELECT 1 FROM ${MARKS_TABLE} m WHERE m.node_key = n.node_key) AS marked`;
      const rows =
        after === null
          ? await read.query(`SELECT n.node_key, ${marked} FROM ${NODES} n ORDER BY n.node_key LIMIT $1`, [limit])
          : await read.query(`SELECT n.node_key, ${marked} FROM ${NODES} n WHERE n.node_key > $1 ORDER BY n.node_key LIMIT $2`, [after, limit]);
      return rows.map((row) => ({ key: bytes(row.node_key, `${NODES}.node_key`), marked: row.marked === true }));
    },
  };
}

/** Writes one block's step, in its transaction after its batch (see the module comment). */
export async function writeSweep(w: Pick<BlockWriteHandle, "execute">, writes: SweepWrites): Promise<void> {
  if (writes.greyAll) await w.execute(`DELETE FROM ${GREY_TABLE}`);
  else if (writes.greyDeleted.length > 0) await w.execute(`DELETE FROM ${GREY_TABLE} WHERE node_key = ANY($1::bytea[])`, [[...writes.greyDeleted]]);
  if (writes.greyInserted.length > 0) {
    await w.execute(`INSERT INTO ${GREY_TABLE} (node_key) SELECT unnest($1::bytea[])`, [[...writes.greyInserted]]);
  }
  if (writes.marksCleared) await w.execute(`DELETE FROM ${MARKS_TABLE}`);
  else if (writes.marksInserted.length > 0) {
    await w.execute(`INSERT INTO ${MARKS_TABLE} (node_key) SELECT unnest($1::bytea[])`, [[...writes.marksInserted]]);
  }
  if (writes.deleted.length > 0) await w.execute(`DELETE FROM ${NODES} WHERE node_key = ANY($1::bytea[])`, [[...writes.deleted]]);
  await w.execute(`UPDATE ${SWEEP_TABLE} SET cycle = $1, phase = $2, sweep_after = $3 WHERE id = 1`, [
    writes.after.cycle,
    writes.after.phase,
    writes.after.sweepAfter,
  ]);
}
