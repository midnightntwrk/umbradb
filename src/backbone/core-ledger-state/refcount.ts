/**
 * Reclamation of stored ledger nodes by reference counting: each block deletes the stored nodes that nothing stored
 * references and no root count persists, and every node only they referenced, while keeping, for one block, what the
 * state after h − 1 may still reach.
 *
 * **The tables** (`./sql.ts`): `nodes`, each stored node with the child list the ledger last wrote for it;
 * `ref_counts`, the number of references to each key in the stored child lists, a row only while it is above 0;
 * `root_counts`; and `unreferenced`, the queue: the stored nodes with neither a reference nor a root count. A
 * reference is one occurrence of a key in a child list, through embedded children (`../../ledger/node-refs.ts`): a key
 * listed twice is two references.
 *
 * **One block's step** ({@link refcountStep}) is computed in `core-ledger-state`'s `on-compute`, from the tables as
 * committed at h − 1 ({@link RefcountTables}, read through on-compute's read) and the block's batch (its flushed nodes
 * and root count changes, held in memory). It keeps nothing between blocks. Its rules, for block h:
 * 1. The batch's nodes are classified: **new** (no row at h − 1), **rewritten** (a row with another child list, which
 *    the database compares) or written again unchanged, which changes nothing.
 * 2. Each reference in the batch's child list of a new or rewritten node adds 1 to its key's count.
 * 3. Each reference in a rewritten node's stored child list subtracts 1, and its key is protected in the block: the
 *    state after h − 1, which the worker still holds during h, may reach it through the old list.
 * 4. A key with a root count after h − 1 or after h, or of a new node, is protected too: a new node is never deleted
 *    in the block that writes it. A rewritten node is not protected for being rewritten.
 * 5. With the `core` entry's `sweep` on, the cascade: starting from the queue at h − 1, in rounds, every candidate not
 *    protected whose count reaches 0 is deleted, and each reference in its child list as stored after the block's
 *    writes (the batch's for a rewritten node) subtracts 1 and makes its key a candidate, until a round deletes none.
 *    No limit bounds it. With `sweep` off nothing is deleted.
 * 6. The counts after h: each count plus its block's change.
 * 7. The queue after h: the rows after h with no reference and no root count, over the keys whose membership can
 *    change (the queue at h − 1, the new nodes, the keys whose count or root count changes).
 * 8. The checks, before the eviction: a count below 0 (`negative-count`), and a reference in the batch's child list
 *    of a new or rewritten node, or a key whose root count rises, that is not a row after the block
 *    (`missing-reference`), halt the block with `ledger-refcount-invalid`. Nothing is repaired.
 *
 * The deleted nodes are then evicted from the ledger worker (`LedgerHost.evict`) by the caller, before the block's
 * transaction. {@link writeRefcount} writes the step in `on-db-write`, after the batch's node writes (`writeBlock`): a
 * rewritten node can be deleted, and deleting it first would store it again. Each of its statements, like each read,
 * runs over at most {@link KEYS_PER_STATEMENT} keys, and must affect the rows the step computed, else the block halts
 * (`row-count-mismatch`) and its transaction rolls back.
 *
 * {@link RefcountFault} is the seam through which a negative control puts a fault into the step, and
 * {@link RefcountCheck} names the check one leaves out.
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { childRefKeys } from "../../ledger/node-refs.js";
import type { NodeBatch, StoredNode } from "../../ledger/types.js";
import {
  addRefCounts,
  changedNodes,
  deleteNodes,
  deleteUnreferenced,
  insertUnreferenced,
  keyCounts,
  nodeChildren,
  storedKeys,
  unreferencedKeys,
} from "./sql.js";

/** The keys (or nodes) one statement of the step reads or writes at most: a long list is sent in chunks. */
export const KEYS_PER_STATEMENT = 1_000;

/**
 * A fault a negative control puts into the step through its tables seam; a build's tables carry none:
 * - `second-occurrence-not-decremented`: a child repeated in a child list loses only one reference when the list is
 *   subtracted (rule 3, the cascade), so it leaks;
 * - `unchanged-counted`: the references of a node written again unchanged are counted again;
 * - `increment-once-per-parent`: a child repeated in a child list gains one reference per list (rule 2) but loses one
 *   per occurrence, so its count reaches 0 early;
 * - `released-in-block`: the root conditions of rule 4 removed, and the cascade started also from every key whose root
 *   count falls to 0 in the block, so a released state's rows are deleted in the block that releases it;
 * - `referenced-queued-deleted`: a queued key loses, in the cascade's test, the references new nodes give it, so a
 *   queued key a new node references is deleted in that block;
 * - `first-round-only`: the cascade stops after its first round.
 */
export type RefcountFault =
  | "second-occurrence-not-decremented"
  | "unchanged-counted"
  | "increment-once-per-parent"
  | "released-in-block"
  | "referenced-queued-deleted"
  | "first-round-only";

/**
 * The checks of the step, by the reason they halt with: rule 8's two, and the affected rows of
 * {@link writeRefcount}'s statements. A negative control leaves one out to show what it catches; a build runs every
 * one.
 */
export type RefcountCheck = "negative-count" | "missing-reference" | "row-count-mismatch";

/** A key at h − 1: whether it is a row, its reference count and its root count (0 where its table has no row). */
export interface KeyCounts {
  readonly row: boolean;
  readonly refs: number;
  readonly roots: number;
}

/** The entries of a key that has none. */
const NOTHING: KeyCounts = Object.freeze({ row: false, refs: 0, roots: 0 });

/**
 * What the step reads of the tables as committed at h − 1. Keys come back by `0x`-less hex; child lists come back as
 * their references, in list order, so their bytes are dropped once read.
 */
export interface RefcountTables {
  /** Those of `keys` that `nodes` holds. */
  rows(keys: readonly Uint8Array[]): Promise<ReadonlySet<string>>;
  /** Those of `nodes` that `nodes` holds with another child list, each with its stored one's references. */
  changed(nodes: readonly Pick<StoredNode, "key" | "children">[]): Promise<ReadonlyMap<string, readonly Uint8Array[]>>;
  /** Every key of `unreferenced`. */
  queue(): Promise<readonly Uint8Array[]>;
  /** For each of `keys`, its {@link KeyCounts}; a key left out has no row and no count. */
  counts(keys: readonly Uint8Array[]): Promise<ReadonlyMap<string, KeyCounts>>;
  /** For those of `keys` that `nodes` holds, their stored child lists' references; a key that is no row has none. */
  references(keys: readonly Uint8Array[]): Promise<ReadonlyMap<string, readonly Uint8Array[]>>;
  /** The fault a negative control puts into the step; none in a build. */
  readonly fault?: RefcountFault;
}

/** One block's step (see the module comment): every key list in byte order. */
export interface RefcountStep {
  readonly height: bigint;
  /** The batch's new nodes. */
  readonly newNodes: readonly Uint8Array[];
  /** The batch's rewritten nodes. */
  readonly rewritten: readonly Uint8Array[];
  /** The batch's nodes written again with their stored child list. */
  readonly unchanged: readonly Uint8Array[];
  /** Each key's change of its count in the block, for the keys where it is not 0. */
  readonly deltas: readonly { readonly key: Uint8Array; readonly delta: number }[];
  /** How many of those keys have a count above 0 after the block: the rows the merge of the counts writes. */
  readonly counted: number;
  /** The rows deleted, which the worker evicts. */
  readonly deleted: readonly Uint8Array[];
  /** The cascade's rounds that deleted rows. */
  readonly rounds: number;
  /** The queued keys that leave the queue. */
  readonly unqueued: readonly Uint8Array[];
  /** The keys that enter the queue. */
  readonly queued: readonly Uint8Array[];
}

/** The statements whose affected rows {@link writeRefcount} checks; `write-nodes` is the batch's node writes. */
export type RefcountStatement =
  | "write-nodes"
  | "merge-ref-counts"
  | "delete-unreferenced"
  | "insert-unreferenced"
  | "delete-nodes";

const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytesOf = (hex: string): Uint8Array => Uint8Array.from(Buffer.from(hex, "hex"));
const sorted = (keys: Iterable<string>): string[] => [...keys].sort();
/** Each key once, in its first place. */
const once = (keys: readonly Uint8Array[]): Uint8Array[] => [...new Map(keys.map((key) => [hexOf(key), key])).values()];

/** `ledger-refcount-invalid` for block `height`. */
function invalid(height: bigint, reason: string, message: string, details: Record<string, unknown>): UmbraError {
  return new UmbraError("ledger-refcount-invalid", `block ${height}: ${message} (${reason})`, {
    reason,
    height,
    ...details,
  });
}

/**
 * Block `height`'s step (see the module comment): `tables` as committed at h − 1, `batch` the block's, `on` whether
 * the `core` entry's `sweep` is on at h. Throws `ledger-refcount-invalid` when a check fails; a negative control's
 * `unchecked` check is left out.
 */
export async function refcountStep(
  tables: RefcountTables,
  batch: NodeBatch,
  options: { readonly height: bigint; readonly on: boolean; readonly unchecked?: RefcountCheck },
): Promise<RefcountStep> {
  const { height, on, unchecked } = options;
  const fault = tables.fault;
  const inserts = new Map<string, Pick<StoredNode, "key" | "children">>();
  for (const node of batch.inserts) {
    const k = hexOf(node.key);
    if (inserts.has(k)) throw new Error(`block ${height}: the batch writes 0x${k} twice`);
    inserts.set(k, node);
  }
  const rootChange = new Map<string, number>();
  for (const { key, delta } of batch.rootCounts) {
    const k = hexOf(key);
    if (rootChange.has(k)) throw new Error(`block ${height}: the batch changes the root count of 0x${k} twice`);
    if (delta !== 0) rootChange.set(k, delta);
  }

  /** What is known of each key at h − 1: whether it is a row, and its counts. */
  const isRow = new Map<string, boolean>();
  const counts = new Map<string, KeyCounts>();
  const learnRows = async (keys: Iterable<string>): Promise<void> => {
    const fresh = sorted(new Set([...keys].filter((k) => !isRow.has(k))));
    if (fresh.length === 0) return;
    const found = await tables.rows(fresh.map(bytesOf));
    for (const k of fresh) isRow.set(k, found.has(k));
  };
  const learnCounts = async (keys: Iterable<string>): Promise<void> => {
    const fresh = sorted(new Set([...keys].filter((k) => !counts.has(k))));
    if (fresh.length === 0) return;
    const found = await tables.counts(fresh.map(bytesOf));
    for (const k of fresh) {
      const entry = found.get(k) ?? NOTHING;
      counts.set(k, entry);
      isRow.set(k, entry.row);
    }
  };

  // (1) The batch classified.
  await learnRows(inserts.keys());
  const stored = [...inserts.values()].filter((node) => isRow.get(hexOf(node.key)) === true);
  const changed = stored.length === 0 ? new Map<string, readonly Uint8Array[]>() : await tables.changed(stored);
  const newNodes = sorted([...inserts.keys()].filter((k) => isRow.get(k) !== true));
  const rewritten = sorted([...inserts.keys()].filter((k) => changed.has(k)));
  const unchanged = sorted([...inserts.keys()].filter((k) => isRow.get(k) === true && !changed.has(k)));
  const newKeys = new Set(newNodes);
  /** The references of the batch's child list of `k`. */
  const batchRefs = (k: string): Uint8Array[] =>
    childRefKeys((inserts.get(k) as Pick<StoredNode, "children">).children);
  const written = new Map([...newNodes, ...rewritten].map((k) => [k, batchRefs(k)]));

  const delta = new Map<string, number>();
  const change = (k: string, by: number): void => {
    const next = (delta.get(k) ?? 0) + by;
    if (next === 0) delta.delete(k);
    else delta.set(k, next);
  };
  /** A child list's references as rule 2 or rule 3 and the cascade count them, with the fault's change if any. */
  const added = (refs: readonly Uint8Array[]): readonly Uint8Array[] =>
    fault === "increment-once-per-parent" ? once(refs) : refs;
  const subtracted = (refs: readonly Uint8Array[]): readonly Uint8Array[] =>
    fault === "second-occurrence-not-decremented" ? once(refs) : refs;
  // (2) Increments; the new nodes' own, for a fault that leaves them out of the queue's test.
  const fromNew = new Map<string, number>();
  for (const [k, refs] of written) {
    for (const ref of added(refs)) {
      change(hexOf(ref), 1);
      if (newKeys.has(k)) fromNew.set(hexOf(ref), (fromNew.get(hexOf(ref)) ?? 0) + 1);
    }
  }
  if (fault === "unchanged-counted") for (const k of unchanged) for (const ref of batchRefs(k)) change(hexOf(ref), 1);
  // (3) Rewrites.
  const dropped = new Set<string>();
  for (const k of rewritten) {
    for (const ref of subtracted(changed.get(k) as readonly Uint8Array[])) {
      change(hexOf(ref), -1);
      dropped.add(hexOf(ref));
    }
  }
  // Whether the references of the batch's new and rewritten child lists are rows, for the checks.
  await learnRows(
    [...written.values()].flatMap((refs) => refs.map(hexOf)).filter((k) => !newKeys.has(k)),
  );
  const queueBefore = new Set((await tables.queue()).map(hexOf));
  await learnCounts([...queueBefore, ...rootChange.keys(), ...dropped]);

  // (4) Protection.
  const rootsBefore = (k: string): number => counts.get(k)?.roots ?? 0;
  const rootsAfter = (k: string): number => rootsBefore(k) + (rootChange.get(k) ?? 0);
  const byRoots = fault !== "released-in-block";
  const protectedInBlock = (k: string): boolean =>
    dropped.has(k) || newKeys.has(k) || (byRoots && (rootsBefore(k) > 0 || rootsAfter(k) > 0));
  /** A key's count after the block's changes so far (a key whose count was not read gained only: its sign is exact). */
  const count = (k: string): number => (counts.get(k)?.refs ?? 0) + (delta.get(k) ?? 0);
  const left = (k: string): number =>
    fault === "referenced-queued-deleted" && queueBefore.has(k) ? count(k) - (fromNew.get(k) ?? 0) : count(k);

  // (5) The cascade.
  const deleted = new Set<string>();
  let rounds = 0;
  if (on) {
    const candidates = new Set(queueBefore);
    if (fault === "released-in-block") {
      for (const [k, by] of rootChange) if (by < 0 && rootsAfter(k) === 0) candidates.add(k);
    }
    for (;;) {
      const round = sorted(candidates).filter((k) => !deleted.has(k) && !protectedInBlock(k) && left(k) === 0);
      if (round.length === 0) break;
      rounds += 1;
      for (const k of round) deleted.add(k);
      // A new node is protected, so never here; a rewritten one's list after the block is the batch's. A queued key
      // that is no row has no list: its deletion then affects no row, which the node delete's row count finds.
      const unread = round.filter((k) => !changed.has(k));
      const lists =
        unread.length === 0 ? new Map<string, readonly Uint8Array[]>() : await tables.references(unread.map(bytesOf));
      const reached: string[] = [];
      for (const k of round) {
        const refs = changed.has(k) ? (written.get(k) as Uint8Array[]) : (lists.get(k) ?? []);
        for (const ref of subtracted(refs)) {
          change(hexOf(ref), -1);
          candidates.add(hexOf(ref));
          reached.push(hexOf(ref));
        }
      }
      await learnCounts(reached);
      if (fault === "first-round-only") break;
    }
  }

  // (8) The checks, before the eviction.
  for (const k of sorted(delta.keys())) {
    if (count(k) < 0 && unchecked !== "negative-count") {
      throw invalid(height, "negative-count", `the reference count of 0x${k} would fall below 0`, { key: `0x${k}` });
    }
  }
  const rowAfter = (k: string): boolean => newKeys.has(k) || (isRow.get(k) === true && !deleted.has(k));
  const referencesChecked = unchecked !== "missing-reference";
  for (const k of sorted(written.keys())) {
    for (const ref of written.get(k) as Uint8Array[]) {
      const r = hexOf(ref);
      if (!rowAfter(r) && referencesChecked) {
        const message = `0x${k}, which the block writes, references 0x${r}, which is not stored after it`;
        throw invalid(height, "missing-reference", message, { key: `0x${r}` });
      }
    }
  }
  for (const k of sorted(rootChange.keys())) {
    if ((rootChange.get(k) as number) > 0 && !rowAfter(k) && referencesChecked) {
      const message = `the block persists 0x${k}, which is not stored after it`;
      throw invalid(height, "missing-reference", message, { key: `0x${k}` });
    }
  }

  // (6) The counts; (7) the queue.
  const deltas = sorted(delta.keys()).map((k) => ({ key: bytesOf(k), delta: delta.get(k) as number }));
  const counted = sorted(delta.keys()).filter((k) => count(k) > 0).length;
  const unqueued: string[] = [];
  const queued: string[] = [];
  for (const k of sorted(new Set([...queueBefore, ...newKeys, ...delta.keys(), ...rootChange.keys()]))) {
    const after = rowAfter(k) && count(k) === 0 && rootsAfter(k) === 0;
    if (queueBefore.has(k) && !after) unqueued.push(k);
    if (!queueBefore.has(k) && after) queued.push(k);
  }
  return Object.freeze({
    height,
    newNodes: newNodes.map(bytesOf),
    rewritten: rewritten.map(bytesOf),
    unchanged: unchanged.map(bytesOf),
    deltas,
    counted,
    deleted: sorted(deleted).map(bytesOf),
    rounds,
    unqueued: unqueued.map(bytesOf),
    queued: queued.map(bytesOf),
  });
}

/** `items` in lists of at most {@link KEYS_PER_STATEMENT}. */
function* chunksOf<T>(items: readonly T[]): Generator<T[]> {
  for (let at = 0; at < items.length; at += KEYS_PER_STATEMENT) yield items.slice(at, at + KEYS_PER_STATEMENT);
}

/**
 * The {@link RefcountTables} of a read at h − 1 (`core-ledger-state`'s on-compute read), with no fault. Each read runs
 * in statements of {@link KEYS_PER_STATEMENT} keys, none for no key; child lists are parsed chunk by chunk.
 */
export function sqlRefcountTables(read: Pick<ReadHandle, "query">): RefcountTables {
  return {
    async rows(keys) {
      const found = new Set<string>();
      for (const chunk of chunksOf(keys)) for (const key of await storedKeys(read, chunk)) found.add(hexOf(key));
      return found;
    },
    async changed(nodes) {
      const found = new Map<string, Uint8Array[]>();
      for (const chunk of chunksOf(nodes)) {
        for (const { key, children } of await changedNodes(read, chunk)) found.set(hexOf(key), childRefKeys(children));
      }
      return found;
    },
    queue: () => unreferencedKeys(read),
    async counts(keys) {
      const found = new Map<string, KeyCounts>();
      for (const chunk of chunksOf(keys)) {
        for (const { key, ...entry } of await keyCounts(read, chunk)) found.set(hexOf(key), entry);
      }
      return found;
    },
    async references(keys) {
      const found = new Map<string, Uint8Array[]>();
      for (const chunk of chunksOf(keys)) {
        for (const { key, children } of await nodeChildren(read, chunk)) found.set(hexOf(key), childRefKeys(children));
      }
      return found;
    },
  };
}

/**
 * Writes block `step.height`'s step, in its transaction after the batch's node writes (see the module comment), which
 * affected `written` rows: the counts' changes merged into `ref_counts`, the queue's changes, then the deleted rows.
 * Each statement must affect the rows the step computed (the node writes: its new and rewritten nodes), summed over its
 * chunks; otherwise it throws `ledger-refcount-invalid` (`row-count-mismatch`), naming the statement. A negative
 * control's `unchecked` `row-count-mismatch` leaves that check out.
 */
export async function writeRefcount(
  w: Pick<BlockWriteHandle, "execute">,
  step: RefcountStep,
  written: number,
  options: { readonly unchecked?: RefcountCheck } = {},
): Promise<void> {
  const check = (statement: RefcountStatement, expected: number, actual: number): void => {
    if (actual === expected || options.unchecked === "row-count-mismatch") return;
    throw invalid(
      step.height,
      "row-count-mismatch",
      `${statement} affected ${actual} rows where ${expected} were computed`,
      { statement, expected, actual },
    );
  };
  const run = async <T>(items: readonly T[], statement: (chunk: T[]) => Promise<number>): Promise<number> => {
    let rows = 0;
    for (const chunk of chunksOf(items)) rows += await statement(chunk);
    return rows;
  };
  check("write-nodes", step.newNodes.length + step.rewritten.length, written);
  check("merge-ref-counts", step.counted, await run(step.deltas, (chunk) => addRefCounts(w, chunk)));
  check("delete-unreferenced", step.unqueued.length, await run(step.unqueued, (chunk) => deleteUnreferenced(w, chunk)));
  check("insert-unreferenced", step.queued.length, await run(step.queued, (chunk) => insertUnreferenced(w, chunk)));
  check("delete-nodes", step.deleted.length, await run(step.deleted, (chunk) => deleteNodes(w, chunk)));
}
