/**
 * The reclamation of a run of blocks as one computation: what each block of a run hands over, and the node tables
 * after the run's last block (`docs/research/run-reclamation.md`). Core. `core-ledger-state` hands each block over in
 * its `on-compute` and computes the run in its `on-settle` (`./core-ledger-state.ts`).
 *
 * A run is one or more consecutive blocks settled together. Each block hands its flushed nodes and its root-count
 * changes to the run's record ({@link RunReclaim.collect}), in memory, with no statement, and writes its own rows,
 * `root_counts` among them. After the last block's own rows, {@link RunReclaim.compute} computes `nodes`,
 * `ref_counts` and `unreferenced` as they are after that block, from those tables as the block before the run left
 * them, and gives the net write ({@link NetWrite}, {@link writeNet}) and every key the run deletes.
 *
 * **The rule it computes.** After a block that sweeps, the stored nodes are what these keys reach through the stored
 * child lists: the keys with a root count after the block before, the keys with a root count after the block, and
 * the keys that a child list replaced by the block referenced. A count is the number of references among the stored
 * lists, and the queue is the stored nodes with no reference and no root count. The per-block step keeps this at
 * every block (`test/backbone/refcount-step.ts`, kept as the tests' reference); the run computation computes it for
 * the run's last block only.
 *
 * **What a block hands over** (`collect`):
 * - its nodes join the run's nodes, the last child list written for a key winning; a node flushed again with the list
 *   the run holds changes nothing. Each list is kept with the block that flushed it, and a replaced one with its
 *   block too, for step 3;
 * - its root-count changes: which keys the run changed, and each key's latest change with its block, so that the
 *   last block's own changes are known when the run is computed; each key's first block that raised it, and each
 *   referenced key's first block that referenced it. The record is made with the run's first height only: the run is
 *   the blocks handed over when it is computed, the last of them its last block;
 * - the flush rule: a node that is new, or that replaces a child list, must be reached from a key whose root count
 *   the block raises, through the block's own nodes, as the ledger package walks when it flushes
 *   (`unreached-node`). A node written again with the list already held may be anywhere.
 *
 * **The computation** (`compute`), over the node tables as the block before the run left them (`nodes`,
 * `ref_counts`, `unreferenced`) and `root_counts` as the run's last block left it. So a root count read is the one
 * after the last block, and the one before that block is the read one less the block's own change:
 * 1. The run's nodes are classified against the database: new (no row), replacing (a row with another child list),
 *    or the same as the row. The universe is the rows and the new nodes.
 * 2. Count changes: plus one per reference in the run's lists of the new and replacing nodes, minus one per
 *    reference in the stored lists they replace.
 * 3. Block by block, as the per-block step checks each block: every reference of a list block h flushed, and every
 *    key h raised, is a row when the run began or a node that h or a block before it flushed (`missing-reference`);
 *    and each key's count, from the lists the blocks up to h flushed and replaced, is not below 0
 *    (`negative-count`). The first block that fails halts the run, named; a missing reference of the last block halts
 *    it only after step 7's count check, which the per-block step makes first.
 * 4. Protected: the keys with a root count after the block before the last or after the last, and the keys that a
 *    list replaced by the last block referenced.
 * 5. Candidates: the queue as the run found it, the keys whose root count the run changed, the new nodes, and the
 *    keys whose count change is below 0.
 * 6. The cascade, in rounds: every candidate in the universe, not protected, whose count is 0 is deleted; each
 *    reference of its list subtracts 1 and makes its key a candidate; until a round deletes none.
 * 7. No count is below 0 after the run, its deletions included (`negative-count`); no list the run writes
 *    references a key the cascade deleted (`missing-reference`, as the per-block step requires every reference of a
 *    list the block writes to be a row after it); and every key queued after the run is one the last block released
 *    or dropped from a replaced list (`unexpected-queued`): anything else would be a node kept that the rule deletes.
 * 8. The queue after: the nodes left with no reference and no root count.
 * 9. The net write, and 10. every deleted key, a row or a node the run never writes.
 *
 * With `sweep` off (one setting for a whole run) nothing is deleted, steps 5 and 6 are skipped, and the queue is not
 * read whole: the membership of the keys step 8 evaluates is read by key.
 *
 * **Each key in one form.** A key is made into text once, where it enters (a flushed node's key, a reference in a
 * child list, a root-count change, a row a read returns): its 32 bytes as 32 characters, one per byte, whose order is
 * the bytes'. Each distinct key has one record, found by that text, holding everything the computation knows of it;
 * a node's references are records, so the cascade follows records and converts nothing. Bytes are made again only
 * for what leaves: a read's key list, the net write, the deleted keys.
 *
 * **What the result is, against the per-block step** (the note's section 4.3), for the same flushes: the per-block
 * step's tables for a run of one block, whatever the lists; for a longer run the same bytes when every block follows
 * the flush rule and no node is left stored only because a child list the last block replaced referenced it
 * ({@link RunOutcome.keptByReplaced} is 0). Otherwise the tables are consistent and hold the same node set, and can
 * hold rows more: the per-block step keeps such a node only if it still stored the replaced list's node at the block
 * before, which the run computation cannot tell. The same run made again without its last block keeps none of them.
 *
 * {@link RunFault} is the seam through which a negative control puts a fault into the computation, and
 * {@link RunCheck} names the check one leaves out. A build carries neither.
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { childRefOffsets } from "../../ledger/node-refs.js";
import type { NodeBatch, StoredNode } from "../../ledger/types.js";
import {
  addRefCounts,
  changedNodes,
  deleteNodes,
  deleteUnreferenced,
  insertNodes,
  insertUnreferenced,
  keyCounts,
  missingKeys,
  nodeChildren,
  queuedKeys,
  storedKeys,
  unreferencedKeys,
} from "./sql.js";

/** The keys (or nodes) one statement reads or writes at most: a long list is sent in parts. */
export const KEYS_PER_STATEMENT = 1_000;

/**
 * The six faults of the per-block step, each put into the computation in the step that holds its rule
 * ({@link RunFault} says where).
 */
export type RefcountFault =
  | "second-occurrence-not-decremented"
  | "unchanged-counted"
  | "increment-once-per-parent"
  | "released-in-block"
  | "referenced-queued-deleted"
  | "first-round-only";

/**
 * The checks of the per-block step, by the reason they halt with: two of the computation's ({@link RunCheck}), and the
 * affected rows of {@link writeNet}'s statements. A negative control leaves one out; a build runs every one.
 */
export type RefcountCheck = "negative-count" | "missing-reference" | "row-count-mismatch";

/** The statements whose affected rows {@link writeNet} checks. */
export type RefcountStatement =
  | "write-nodes"
  | "merge-ref-counts"
  | "delete-unreferenced"
  | "insert-unreferenced"
  | "delete-nodes";

/** What a run writes to the node tables after its last block (see the module comment): every key list in byte order. */
export interface NetWrite {
  /** The run's last height, for the errors. */
  readonly height: bigint;
  /** The nodes present after the run that the run wrote. */
  readonly inserts: readonly StoredNode[];
  /** How many of them the database does not hold with that child list: the rows the node write affects. */
  readonly written: number;
  /** Each key's net change of its count in the run, where it is not 0. */
  readonly deltas: readonly { readonly key: Uint8Array; readonly delta: number }[];
  /** How many of those keys have a count above 0 after the run. */
  readonly counted: number;
  /** The keys queued before the run that are not after it. */
  readonly unqueued: readonly Uint8Array[];
  /** The keys queued after the run that were not before it. */
  readonly queued: readonly Uint8Array[];
  /** The rows stored before the run that it deleted. */
  readonly deleted: readonly Uint8Array[];
}

/**
 * Writes a run's net change to the node tables, in its transaction after its last block's own rows: the nodes, the
 * counts' changes, the queue's, then the deleted rows, each statement checked for the rows it must affect, as the
 * per-block step's writes were. A difference throws `ledger-refcount-invalid` (`row-count-mismatch`) naming the
 * statement; a negative control's `unchecked` `row-count-mismatch` leaves the check out. The node statement runs
 * through `nodes` when given (a negative control's handle), the others through `w`.
 */
export async function writeNet(
  w: Pick<BlockWriteHandle, "execute">,
  net: NetWrite,
  options: { readonly unchecked?: RefcountCheck; readonly nodes?: Pick<BlockWriteHandle, "execute"> } = {},
): Promise<void> {
  const check = (statement: RefcountStatement, expected: number, actual: number): void => {
    if (actual === expected || options.unchecked === "row-count-mismatch") return;
    throw new UmbraError(
      "ledger-refcount-invalid",
      `the run ending at block ${net.height}: ${statement} affected ${actual} rows where ${expected} were computed (row-count-mismatch)`,
      { reason: "row-count-mismatch", height: net.height, statement, expected, actual },
    );
  };
  const send = async <T>(items: readonly T[], statement: (part: T[]) => Promise<number>): Promise<number> => {
    let rows = 0;
    for (let at = 0; at < items.length; at += KEYS_PER_STATEMENT) rows += await statement(items.slice(at, at + KEYS_PER_STATEMENT));
    return rows;
  };
  const nodes = options.nodes ?? w;
  check("write-nodes", net.written, await send(net.inserts, (part) => insertNodes(nodes, part)));
  check("merge-ref-counts", net.counted, await send(net.deltas, (part) => addRefCounts(w, part)));
  check("delete-unreferenced", net.unqueued.length, await send(net.unqueued, (part) => deleteUnreferenced(w, part)));
  check("insert-unreferenced", net.queued.length, await send(net.queued, (part) => insertUnreferenced(w, part)));
  check("delete-nodes", net.deleted.length, await send(net.deleted, (part) => deleteNodes(w, part)));
}

/**
 * A fault a negative control puts into the run computation; a build's carries none. The six of the per-block step
 * ({@link RefcountFault}), each in the step of the computation that holds its rule:
 * - `second-occurrence-not-decremented`: a child repeated in a child list loses only one reference when the list is
 *   subtracted (steps 2 and 6);
 * - `unchanged-counted`: the references of a node flushed with the child list its row holds are counted again
 *   (step 1);
 * - `increment-once-per-parent`: a child repeated in a child list gains one reference per list (step 2);
 * - `released-in-block`: the keys with a root count after the block before the last are not protected (step 4), so a
 *   state the last block releases is deleted by its run;
 * - `referenced-queued-deleted`: a queued key loses, in the cascade's test, the references the run's new nodes give
 *   it (step 6);
 * - `first-round-only`: the cascade stops after its first round (step 6).
 *
 * And the run computation's own:
 * - `roots-read-as-before`: the root counts read, which are after the run's last block, taken as those before it
 *   (step 4), so a state the last block releases has no root count before it and is deleted by its run;
 * - `first-list-kept`: the run keeps the first child list flushed for a key, not the last;
 * - `run-as-one-block`: the per-block step's protection and frontier applied to the run as if it were one block:
 *   protected are the keys with a root count before the run or after it, every new node and every key a replaced
 *   list referenced, and the cascade starts from the old queue only;
 * - `dropped-unprotected`: the keys that a list replaced by the last block referenced are not protected (step 4);
 * - `old-queue-only`: the cascade starts from the queue the run found only (step 5);
 * - `queue-change-dropped`: one key's change of the queue is left out of the net write (step 8);
 * - `judged-at-end`: step 3 judges at the run's last block what it judges at each block: a reference, or a raised
 *   key, passes when any block of the run flushes its node, and no block's count is followed.
 */
export type RunFault =
  | RefcountFault
  | "roots-read-as-before"
  | "first-list-kept"
  | "run-as-one-block"
  | "dropped-unprotected"
  | "old-queue-only"
  | "queue-change-dropped"
  | "judged-at-end";

/**
 * The checks of the run computation, by the reason they halt with. A negative control leaves one out to show what it
 * catches; a build runs every one. ({@link writeNet}'s is the step's `row-count-mismatch`.)
 */
export type RunCheck = "unreached-node" | "missing-reference" | "negative-count" | "unexpected-queued";

/**
 * What the computation reads: the node tables as the block before the run left them, and `root_counts` as the run's
 * last block left it. Keys go and come back as bytes; each read is one statement's shape (`./sql.ts`), and the one
 * who gives the tables sends a long key list in parts.
 */
export interface RunTables {
  /** Those of `keys` that `nodes` holds. */
  rows(keys: readonly Uint8Array[]): Promise<readonly Uint8Array[]>;
  /** Those of `nodes` that `nodes` holds with another child list, each with its stored one. */
  changed(
    nodes: readonly Pick<StoredNode, "key" | "children">[],
  ): Promise<readonly { readonly key: Uint8Array; readonly children: Uint8Array }[]>;
  /** Those of `keys` that `nodes` does not hold. */
  missing(keys: readonly Uint8Array[]): Promise<readonly Uint8Array[]>;
  /** Every key of `unreferenced`. */
  queue(): Promise<readonly Uint8Array[]>;
  /** Those of `keys` that `unreferenced` holds: the read of a run that does not sweep. */
  queued(keys: readonly Uint8Array[]): Promise<readonly Uint8Array[]>;
  /** For each of `keys`: whether it is a row, its reference count and its root count; a key left out has none. */
  counts(
    keys: readonly Uint8Array[],
  ): Promise<readonly { readonly key: Uint8Array; readonly row: boolean; readonly refs: number; readonly roots: number }[]>;
  /** The stored child lists of those of `keys` that `nodes` holds. */
  children(keys: readonly Uint8Array[]): Promise<readonly { readonly key: Uint8Array; readonly children: Uint8Array }[]>;
}

/**
 * The {@link RunTables} of a read inside the run's transaction. Each read runs in statements of
 * {@link KEYS_PER_STATEMENT} keys, none for no key.
 */
export function sqlRunTables(read: Pick<ReadHandle, "query">): RunTables {
  const inStatements = async <T, R>(items: readonly T[], statement: (part: T[]) => Promise<R[]>): Promise<R[]> => {
    const found: R[] = [];
    for (let at = 0; at < items.length; at += KEYS_PER_STATEMENT) found.push(...(await statement(items.slice(at, at + KEYS_PER_STATEMENT))));
    return found;
  };
  return {
    rows: (keys) => inStatements(keys, (part) => storedKeys(read, part)),
    changed: (nodes) => inStatements(nodes, (part) => changedNodes(read, part)),
    missing: (keys) => inStatements(keys, (part) => missingKeys(read, part)),
    queue: () => unreferencedKeys(read),
    queued: (keys) => inStatements(keys, (part) => queuedKeys(read, part)),
    counts: (keys) => inStatements(keys, (part) => keyCounts(read, part)),
    children: (keys) => inStatements(keys, (part) => nodeChildren(read, part)),
  };
}

/**
 * Keys known to be rows, by their text ({@link keyText}): step 3 asks the database only about the others, teaches it
 * those found stored, and the keys the run deletes leave it. It only saves a read. The computation reaches it through
 * this interface alone.
 */
export interface KnownKeys {
  has(text: string): boolean;
  learn(text: string): void;
  forget(text: string): void;
}

/**
 * The {@link KnownKeys} of one run: {@link RunReclaim.compute} makes one unless it is given one, and it is dropped
 * with the run. Nothing in the computation needs it to hold a key from before the run.
 */
export class KnownKeySet implements KnownKeys {
  readonly #texts = new Set<string>();

  /** How many keys it holds. */
  get size(): number {
    return this.#texts.size;
  }

  has(text: string): boolean {
    return this.#texts.has(text);
  }

  learn(text: string): void {
    this.#texts.add(text);
  }

  forget(text: string): void {
    this.#texts.delete(text);
  }
}

/** What the computation gives after the run's last block. */
export interface RunOutcome {
  /** What the run writes to the node tables. */
  readonly net: NetWrite;
  /** Every key the run deletes, a row or a node it never writes, in byte order. */
  readonly evict: readonly Uint8Array[];
  /** The cascade's rounds that deleted nodes. */
  readonly rounds: number;
  /** The distinct nodes the run's blocks handed over. */
  readonly handed: number;
  /**
   * How step 1 classified them against the database, each node by the last child list the run holds for it: new (no
   * row), rewritten (a row with another child list) and unchanged (a row with that list). They sum to `handed`.
   */
  readonly newNodes: number;
  readonly rewrittenNodes: number;
  readonly unchangedNodes: number;
  /** The new nodes' keys, in byte order: `newNodes` of them. */
  readonly newKeys: readonly Uint8Array[];
  /**
   * The keys left stored, queued, only because a child list the run's last block replaced referenced them (and no
   * root count after the block before the last): what the per-block step keeps only if it still stored that list's
   * node at the block before. The same run made again without its last block keeps none of them (see the module
   * comment). None for a run that does not sweep.
   */
  readonly keptByReplaced: number;
}

/** A node key's length, in bytes and in characters of its text. */
const KEY_LENGTH = 32;

/** The bytes of `bytes` as a `Buffer` over the same memory. */
const viewOf = (bytes: Uint8Array): Buffer => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);

/** A key's text: its bytes as characters, one per byte. Its order is the bytes' order. */
export const keyText = (key: Uint8Array): string => viewOf(key).toString("latin1");

/** The key a text is of. */
export const keyBytes = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "latin1"));

/** A key as an error names it. */
const shown = (text: string): string => `0x${Buffer.from(text, "latin1").toString("hex")}`;

/** A node of the run: the last one flushed for its key. */
interface RunNode {
  readonly key: Uint8Array;
  readonly data: Uint8Array;
  readonly children: Uint8Array;
  /** Its child list's references, in the list's order. */
  readonly refs: readonly KeyRecord[];
  /** The block that first flushed the key in the run. */
  readonly firstAt: bigint;
  /** The block that flushed this child list. */
  readonly at: bigint;
  /** The child lists the run held for the key before this one, each with the block that flushed it, in order. */
  readonly earlier: readonly { readonly refs: readonly KeyRecord[]; readonly at: bigint }[];
  /**
   * When that block did not reach the node from a key it raises: the block and the child list it flushed, which must
   * be the row's. Null when it reached the node.
   */
  readonly unreached: { readonly at: bigint; readonly children: Uint8Array } | null;
}

/** Everything the computation knows of one key (see the module comment). */
interface KeyRecord {
  readonly text: string;
  /** Its bytes, once something gave or needed them. */
  bytes: Uint8Array | null;
  /** Its node in the run. */
  node: RunNode | null;
  /** Against the database: a node that is no row, one whose list replaces the row's, or one the row already holds. */
  kind: "new" | "replaces" | "same" | null;
  /** Whether `nodes` held it when the run began; undefined until a read says. */
  row: boolean | undefined;
  /** The references of its stored child list, once read. */
  stored: readonly KeyRecord[] | null;
  /** Its reference count when the run began and its root count after the run's last block, once read. */
  counts: { readonly refs: number; readonly roots: number } | null;
  /** Its count's change in the run so far. */
  delta: number;
  /** The references the run's new nodes give it (a fault's). */
  fromNew: number;
  /**
   * The sum of its root-count changes in the run; its latest change, with the block that made it; and the run's last
   * block's own change, set when the run is computed (the record learns which block is the last only then).
   */
  rootChange: number;
  latestRootChange: { readonly at: bigint; readonly delta: number } | null;
  lastRootChange: number;
  /** Whether a block of the run changed its root count; and the first block that raised it, if one did. */
  touched: boolean;
  raisedAt: bigint | null;
  /** The first block that flushed a child list (new to the run, or another than the one it held) referencing it. */
  referencedAt: bigint | null;
  /**
   * Whether a list replaced by the run's last block (set when the run is computed), or by any block of the run,
   * referenced it; and the latest block of the run that replaced a list the run held referencing it.
   */
  droppedLast: boolean;
  dropped: boolean;
  droppedAt: bigint | null;
  /** Whether `unreferenced` held it when the run began; undefined until a read says. */
  queued: boolean | undefined;
  deleted: boolean;
}

/** Sorts records in byte order of their keys. */
const inOrder = (records: Iterable<KeyRecord>): KeyRecord[] =>
  [...records].sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));

/** Each record once, in its first place. */
const once = (records: readonly KeyRecord[]): readonly KeyRecord[] => [...new Set(records)];

/** What a {@link RunReclaim} is made with. Its last height is not among them: it is the last block handed over. */
export interface RunReclaimOptions {
  /** The run's first height. */
  readonly first: bigint;
  /** The `core` entry's `sweep` at the run's heights: one setting for the whole run. */
  readonly on: boolean;
  /** The fault a negative control puts into the computation; none in a build. */
  readonly fault?: RunFault;
  /** A check a negative control leaves out; every check runs in a build. */
  readonly unchecked?: RunCheck;
}

/**
 * One run's record and its computation (see the module comment). One is made per run and dropped with it. It is made
 * with the run's first height; blocks are handed over one at a time, each the one after the block before, and the run
 * is the blocks handed over when it is computed.
 */
export class RunReclaim {
  readonly first: bigint;
  readonly on: boolean;
  readonly #fault: RunFault | undefined;
  readonly #unchecked: RunCheck | undefined;
  readonly #records = new Map<string, KeyRecord>();
  /** The records with a node, in the order their keys were first flushed. */
  readonly #nodes: KeyRecord[] = [];
  #next: bigint;
  #computed = false;

  constructor(options: RunReclaimOptions) {
    this.first = options.first;
    this.on = options.on;
    this.#fault = options.fault;
    this.#unchecked = options.unchecked;
    this.#next = options.first;
  }

  /** How many blocks handed theirs over. */
  get blocks(): number {
    return Number(this.#next - this.first);
  }

  /** The next height it expects. */
  get next(): bigint {
    return this.#next;
  }

  /**
   * The heights handed over: the run's first and the last block handed over, which is the run's last when it is
   * computed. Undefined before the first block, so that a caller can check the record against a run it is given.
   */
  get heights(): { readonly first: bigint; readonly last: bigint } | undefined {
    return this.#next === this.first ? undefined : { first: this.first, last: this.#next - 1n };
  }

  /** `ledger-refcount-invalid` at block `height` of the run that ends, so far, at block `last`. */
  #invalid(reason: RunCheck, height: bigint, last: bigint, message: string, details: Record<string, unknown>): UmbraError {
    return new UmbraError(
      "ledger-refcount-invalid",
      `the run ${this.first} to ${last}, at block ${height}: ${message} (${reason})`,
      { reason, height, first: this.first, last, ...details },
    );
  }

  /** The record of the key whose text is `text`, made at its first meeting. */
  #record(text: string): KeyRecord {
    let record = this.#records.get(text);
    if (record === undefined) {
      record = {
        text,
        bytes: null,
        node: null,
        kind: null,
        row: undefined,
        stored: null,
        counts: null,
        delta: 0,
        fromNew: 0,
        rootChange: 0,
        latestRootChange: null,
        lastRootChange: 0,
        touched: false,
        raisedAt: null,
        referencedAt: null,
        droppedLast: false,
        dropped: false,
        droppedAt: null,
        queued: undefined,
        deleted: false,
      };
      this.#records.set(text, record);
    }
    return record;
  }

  /**
   * The record of the key `key`. It keeps these bytes when they are an array of their own; a view into a larger
   * buffer (a driver's, a pool's) is not kept, so that what leaves the computation never carries that buffer along.
   */
  #recordOf(key: Uint8Array): KeyRecord {
    if (key.byteLength !== KEY_LENGTH) throw new RangeError(`a node key is ${KEY_LENGTH} bytes, not ${key.byteLength}`);
    const record = this.#record(keyText(key));
    if (record.bytes === null && key.byteOffset === 0 && key.buffer.byteLength === KEY_LENGTH) record.bytes = key;
    return record;
  }

  /** The bytes of `record`'s key. */
  #bytes(record: KeyRecord): Uint8Array {
    record.bytes ??= keyBytes(record.text);
    return record.bytes;
  }

  /** The references of a serialized child list, as records: each key's text is made from its bytes in place. */
  #references(children: Uint8Array): KeyRecord[] {
    const view = viewOf(children);
    const refs: KeyRecord[] = [];
    for (const at of childRefOffsets(children)) refs.push(this.#record(view.toString("latin1", at, at + KEY_LENGTH)));
    return refs;
  }

  /**
   * Block `height` hands over what the ledger package flushed for it, `flushed` (see the module comment): the block
   * after the one before, from the run's first height (a `RangeError` otherwise). `on` is the `core` entry's `sweep`
   * at the block, which must be the run's. Throws `ledger-refcount-invalid` (`unreached-node`) for a node that
   * replaces a list the run holds and that no key the block raises reaches; a node the run did not hold is judged when
   * the run is computed, once the database says whether it is new.
   */
  collect(height: bigint, flushed: NodeBatch, on: boolean): void {
    if (this.#computed) throw new Error(`block ${height}: the run from block ${this.first} is computed already`);
    if (height !== this.#next) throw new RangeError(`block ${height}: the run from block ${this.first} expects block ${this.#next}`);
    if (on !== this.on) {
      throw new Error(
        `block ${height}: the run from block ${this.first} ${this.on ? "sweeps" : "does not sweep"} and the block ` +
          `${on ? "does" : "does not"}: a run holds one setting of sweep`,
      );
    }

    // The block's nodes, each with its references. A list the run holds already is not read again.
    const own = new Map<KeyRecord, { readonly node: StoredNode; readonly refs: readonly KeyRecord[]; readonly same: boolean }>();
    for (const node of flushed.inserts) {
      const record = this.#recordOf(node.key);
      if (own.has(record)) throw new Error(`block ${height}: the block writes ${shown(record.text)} twice`);
      const held = record.node;
      const same = held !== null && Buffer.compare(held.children, node.children) === 0;
      own.set(record, { node, refs: same ? held.refs : this.#references(node.children), same });
    }

    // The root-count changes, and the keys the block raises.
    const rising: KeyRecord[] = [];
    const changed = new Set<KeyRecord>();
    for (const { key, delta } of flushed.rootCounts) {
      const record = this.#recordOf(key);
      if (changed.has(record)) throw new Error(`block ${height}: the block changes the root count of ${shown(record.text)} twice`);
      changed.add(record);
      if (delta === 0) continue;
      record.touched = true;
      record.rootChange += delta;
      record.latestRootChange = { at: height, delta };
      if (delta > 0) {
        record.raisedAt ??= height;
        rising.push(record);
      }
    }

    // What the keys the block raises reach through the block's own nodes: the ledger package's walk when it flushes,
    // which stops at a node it holds as stored.
    const reached = new Set<KeyRecord>();
    const stack = [...rising];
    for (let record = stack.pop(); record !== undefined; record = stack.pop()) {
      if (reached.has(record)) continue;
      const mine = own.get(record);
      if (mine === undefined) continue;
      reached.add(record);
      for (const ref of mine.refs) if (!reached.has(ref)) stack.push(ref);
    }

    for (const [record, { node, refs, same }] of own) {
      if (same) continue;
      const held = record.node;
      if (held === null) {
        for (const ref of refs) ref.referencedAt ??= height;
        const unreached = reached.has(record) ? null : { at: height, children: node.children };
        record.node = { key: node.key, data: node.data, children: node.children, refs, firstAt: height, at: height, earlier: [], unreached };
        this.#nodes.push(record);
        continue;
      }
      // Another child list for a key the run holds.
      if (!reached.has(record) && this.#unchecked !== "unreached-node") {
        throw this.#invalid(
          "unreached-node",
          height,
          height,
          `the block writes ${shown(record.text)} with another child list, and no key it persists reaches the node`,
          { key: shown(record.text) },
        );
      }
      if (this.#fault === "first-list-kept") continue;
      for (const ref of refs) ref.referencedAt ??= height;
      for (const ref of held.refs) {
        ref.dropped = true;
        ref.droppedAt = height;
      }
      record.node = {
        key: node.key,
        data: node.data,
        children: node.children,
        refs,
        firstAt: held.firstAt,
        at: height,
        earlier: [...held.earlier, { refs: held.refs, at: held.at }],
        unreached: held.unreached,
      };
    }
    this.#next = height + 1n;
  }

  /** Reads the counts of those of `records` whose counts are not known. */
  async #learnCounts(tables: RunTables, records: Iterable<KeyRecord>): Promise<void> {
    const asked = inOrder(new Set([...records].filter((record) => record.counts === null)));
    if (asked.length === 0) return;
    for (const record of asked) {
      // A key the read leaves out has no row and no count.
      record.counts = { refs: 0, roots: 0 };
      record.row ??= false;
    }
    for (const { key, row, refs, roots } of await tables.counts(asked.map((record) => this.#bytes(record)))) {
      const record = this.#recordOf(key);
      record.counts = { refs, roots };
      record.row = row;
    }
  }

  /**
   * The node tables after the run's last block (see the module comment): `tables` are the node tables as the block
   * before the run left them and `root_counts` as the last block left it, read inside the run's transaction after the
   * last block's own rows; `known` the keys known to be rows, a set made for this run unless one is given. The run is
   * the blocks handed over, at least one; the last of them is its last block. Throws `ledger-refcount-invalid` when a
   * check fails, before anything is written.
   */
  async compute(tables: RunTables, known: KnownKeys = new KnownKeySet()): Promise<RunOutcome> {
    if (this.#computed) throw new Error(`the run from block ${this.first} is computed already`);
    if (this.#next === this.first) throw new Error(`the run from block ${this.first} has no block handed over`);
    this.#computed = true;
    const fault = this.#fault;
    const unchecked = this.#unchecked;
    const last = this.#next - 1n;
    const nodes = this.#nodes;
    // The last block's own root-count changes, and the keys the lists it replaced in the run referenced.
    for (const record of this.#records.values()) {
      record.lastRootChange = record.latestRootChange?.at === last ? record.latestRootChange.delta : 0;
      record.droppedLast = record.droppedAt === last;
    }
    const nodeOf = (record: KeyRecord): RunNode => record.node as RunNode;

    // (1) The run's nodes against the database.
    const rows = new Set(
      (nodes.length === 0 ? [] : await tables.rows(inOrder(nodes).map((record) => this.#bytes(record)))).map((key) => this.#recordOf(key)),
    );
    const held = inOrder(nodes.filter((record) => rows.has(record)));
    const replaced = new Map(
      (held.length === 0 ? [] : await tables.changed(held.map((record) => ({ key: this.#bytes(record), children: nodeOf(record).children })))).map(
        ({ key, children }) => [this.#recordOf(key), children] as const,
      ),
    );
    for (const record of nodes) {
      record.row = rows.has(record);
      const stored = replaced.get(record);
      record.kind = !record.row ? "new" : stored === undefined ? "same" : "replaces";
      if (stored !== undefined) record.stored = this.#references(stored);
    }
    // The flush rule, for the nodes whose first block did not reach them: what that block flushed must be what the
    // row holds. (A later block of the run may have replaced the list since, under a key it raises.)
    if (unchecked !== "unreached-node") {
      for (const record of inOrder(nodes)) {
        const { unreached } = nodeOf(record);
        if (unreached === null) continue;
        const stored = !record.row ? undefined : (replaced.get(record) ?? nodeOf(record).children);
        if (stored !== undefined && Buffer.compare(stored, unreached.children) === 0) continue;
        throw this.#invalid(
          "unreached-node",
          unreached.at,
          last,
          `the block writes ${shown(record.text)}, ${stored === undefined ? "a new node" : "with another child list than its row's"}, and no key it persists reaches the node`,
          { key: shown(record.text) },
        );
      }
    }

    // (2) The count changes.
    const change = (record: KeyRecord, by: number): void => {
      record.delta += by;
    };
    const added = (refs: readonly KeyRecord[]): readonly KeyRecord[] => (fault === "increment-once-per-parent" ? once(refs) : refs);
    const subtracted = (refs: readonly KeyRecord[]): readonly KeyRecord[] => (fault === "second-occurrence-not-decremented" ? once(refs) : refs);
    for (const record of nodes) {
      const node = nodeOf(record);
      if (record.kind === "same") {
        if (fault === "unchanged-counted") for (const ref of node.refs) change(ref, 1);
        continue;
      }
      for (const ref of added(node.refs)) {
        change(ref, 1);
        if (record.kind === "new") ref.fromNew += 1;
      }
      if (record.kind === "replaces") {
        for (const ref of subtracted(record.stored as readonly KeyRecord[])) {
          change(ref, -1);
          ref.dropped = true;
          // The row's list was replaced by the block that first flushed the key in the run.
          if (node.firstAt === last) ref.droppedLast = true;
        }
      }
    }

    // (3) What a block flushed references, and what it raised, is stored by that block: a row when the run began, or
    // a node that block or one before it flushed.
    const atEnd = fault === "judged-at-end";
    const neededAt = (record: KeyRecord): bigint => {
      const { referencedAt: referenced, raisedAt: raised } = record;
      if (atEnd) return last;
      return referenced === null ? (raised as bigint) : raised === null || referenced <= raised ? referenced : raised;
    };
    const needed = [...this.#records.values()].filter((record) => record.referencedAt !== null || record.raisedAt !== null);
    const asked = inOrder(needed.filter((record) => record.node === null && record.row === undefined));
    const unknown = asked.filter((record) => {
      if (!known.has(record.text)) return true;
      record.row = true;
      return false;
    });
    if (unknown.length > 0) {
      const absent = new Set((await tables.missing(unknown.map((record) => this.#bytes(record)))).map((key) => this.#recordOf(key)));
      for (const record of unknown) {
        record.row = !absent.has(record);
        if (record.row) known.learn(record.text);
      }
    }
    let missing: { readonly at: bigint; readonly error: UmbraError } | null = null;
    if (unchecked !== "missing-reference") {
      const late = needed.filter((record) => record.row !== true && (record.node === null || record.node.firstAt > neededAt(record)));
      const first = inOrder(late).reduce<KeyRecord | null>((earliest, record) => (earliest === null || neededAt(record) < neededAt(earliest) ? record : earliest), null);
      if (first !== null) {
        const at = neededAt(first);
        const flushedAt = (list: { readonly refs: readonly KeyRecord[]; readonly at: bigint }): boolean => (atEnd || list.at === at) && list.refs.includes(first);
        const parent = first.referencedAt === null || (!atEnd && first.referencedAt !== at) ? undefined : inOrder(nodes).find((candidate) => [...nodeOf(candidate).earlier, nodeOf(candidate)].some(flushedAt));
        const where = first.node === null ? "neither stored when the run began nor flushed by the run" : `not stored when the run began, and first flushed by block ${first.node.firstAt}`;
        const message =
          parent !== undefined
            ? `${shown(parent.text)}, which the block writes, references ${shown(first.text)}, which is ${where}`
            : first.raisedAt !== null
              ? `the block persists ${shown(first.text)}, which is ${where}`
              : `a child list the block flushed references ${shown(first.text)}, which is ${where}`;
        missing = { at, error: this.#invalid("missing-reference", at, last, message, { key: shown(first.text) }) };
      }
    }

    // Each block's counts, before the deletions, as the per-block step has them after the block's writes: a key's
    // count when the run began, plus the references of the lists the blocks flushed up to that block, less those of
    // the lists they replaced, the database's or the run's. Only a key some block takes a reference from can fall,
    // and only those keys are followed; a count below 0 halts at the first block that has it.
    let below: { readonly at: bigint; readonly error: UmbraError } | null = null;
    if (unchecked !== "negative-count" && !atEnd) {
      type List = { readonly refs: readonly KeyRecord[]; readonly at: bigint };
      /** Visits each list the run flushed for `record`'s key that is not the one held before it, in block order. */
      const eachList = (record: KeyRecord, visit: (list: List, before: readonly KeyRecord[]) => void): void => {
        const node = nodeOf(record);
        let before: readonly KeyRecord[] = record.kind === "replaces" ? (record.stored as readonly KeyRecord[]) : record.kind === "same" ? node.refs : [];
        for (const list of node.earlier) {
          if (list.refs !== before) visit(list, before);
          before = list.refs;
        }
        if (node.refs !== before) visit(node, before);
      };
      const lowered = new Set<KeyRecord>();
      for (const record of nodes) {
        if (record.kind === "replaces" || nodeOf(record).earlier.length > 0) eachList(record, (_list, before) => before.forEach((ref) => lowered.add(ref)));
      }
      if (lowered.size > 0) {
        const steps = new Map<KeyRecord, Map<bigint, number>>();
        const step = (ref: KeyRecord, at: bigint, by: number): void => {
          if (!lowered.has(ref)) return;
          let byBlock = steps.get(ref);
          if (byBlock === undefined) steps.set(ref, (byBlock = new Map()));
          byBlock.set(at, (byBlock.get(at) ?? 0) + by);
        };
        for (const record of nodes) {
          eachList(record, (list, before) => {
            for (const ref of added(list.refs)) step(ref, list.at, 1);
            for (const ref of subtracted(before)) step(ref, list.at, -1);
          });
        }
        // Each key's change at each block, summed in block order; its lowest, below its count when the run began.
        const lows = new Map<KeyRecord, readonly { readonly at: bigint; readonly change: number }[]>();
        for (const [ref, byBlock] of steps) {
          let change = 0;
          const points: { at: bigint; change: number }[] = [];
          for (const at of [...byBlock.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
            change += byBlock.get(at) as number;
            if (change < 0) points.push({ at, change });
          }
          if (points.length > 0) lows.set(ref, points);
        }
        await this.#learnCounts(tables, lows.keys());
        for (const record of inOrder(lows.keys())) {
          const fell = (lows.get(record) as readonly { readonly at: bigint; readonly change: number }[]).find(({ change }) => (record.counts?.refs ?? 0) + change < 0);
          if (fell === undefined || (below !== null && below.at <= fell.at)) continue;
          below = { at: fell.at, error: this.#invalid("negative-count", fell.at, last, `the reference count of ${shown(record.text)} would fall below 0`, { key: shown(record.text) }) };
        }
      }
    }
    // The first block that fails, as the per-block step halts at it; at one block a count is checked first.
    if (below !== null && (missing === null || below.at <= missing.at)) throw below.error;
    // A missing reference of an earlier block halts the run there. One of the last block waits for the cascade and
    // step 7's counts, which are the last block's: the per-block step checks the counts after its cascade before the
    // references.
    if (missing !== null && missing.at < last) throw missing.error;
    const pending = missing;

    // (4) Protection. A candidate's counts are read before it is asked.
    const inUniverse = (record: KeyRecord): boolean => record.node !== null || record.row === true;
    // A root count read is the one after the last block: before that block it is the one read less the block's own
    // change. (A key whose counts were not read is asked neither whether it is protected nor whether it is queued.)
    const rootsBefore = (record: KeyRecord): number =>
      record.counts === null ? 0 : record.counts.roots - (fault === "roots-read-as-before" ? 0 : record.lastRootChange);
    const rootsAfter = (record: KeyRecord): number => rootsBefore(record) + record.lastRootChange;
    const isProtected = (record: KeyRecord): boolean => {
      if (fault === "run-as-one-block") {
        // The root count before the run: the one before the last block, less what the blocks before it added.
        const rootsFound = rootsBefore(record) - (record.rootChange - record.lastRootChange);
        return rootsFound > 0 || rootsAfter(record) > 0 || record.kind === "new" || record.dropped;
      }
      if (fault !== "dropped-unprotected" && record.droppedLast) return true;
      if (fault !== "released-in-block" && rootsBefore(record) > 0) return true;
      return rootsAfter(record) > 0;
    };
    const count = (record: KeyRecord): number => (record.counts?.refs ?? 0) + record.delta;

    const met = [...this.#records.values()];
    const touched = met.filter((record) => record.touched);
    const fell = met.filter((record) => record.delta < 0);
    const fresh = nodes.filter((record) => record.kind === "new");
    // A new node the run did not change the root count of has no row, no count and no root count.
    for (const record of fresh) if (!record.touched) record.counts = { refs: 0, roots: 0 };

    // (5) The candidates and (6) the cascade.
    const deleted: KeyRecord[] = [];
    let rounds = 0;
    let queueFound: KeyRecord[] = [];
    if (this.on) {
      queueFound = (await tables.queue()).map((key) => this.#recordOf(key));
      for (const record of queueFound) record.queued = true;
      await this.#learnCounts(tables, [...queueFound, ...touched, ...fell]);
      const left = (record: KeyRecord): number =>
        fault === "referenced-queued-deleted" && record.queued === true ? count(record) - record.fromNew : count(record);
      let frontier = new Set<KeyRecord>(fault === "old-queue-only" || fault === "run-as-one-block" ? queueFound : [...queueFound, ...touched, ...fresh, ...fell]);
      for (;;) {
        // Which candidates go is settled before any of them goes, so the order within a round does not matter.
        const round = [...frontier].filter(
          (record) => !record.deleted && record.counts !== null && inUniverse(record) && !isProtected(record) && left(record) === 0,
        );
        if (round.length === 0) break;
        rounds += 1;
        for (const record of round) {
          record.deleted = true;
          deleted.push(record);
        }
        // A node of the run has its list in memory; a row the run did not flush is read.
        const unread = inOrder(round.filter((record) => record.node === null && record.stored === null));
        if (unread.length > 0) {
          for (const { key, children } of await tables.children(unread.map((record) => this.#bytes(record)))) {
            this.#recordOf(key).stored = this.#references(children);
          }
        }
        const reached = new Set<KeyRecord>();
        for (const record of round) {
          for (const ref of subtracted(record.node?.refs ?? record.stored ?? [])) {
            change(ref, -1);
            reached.add(ref);
          }
        }
        // A reached key whose change is not below 0 had no reference when the run began, if its count is 0 now: it
        // was queued, or the run changed its root count, or it is new, and its counts are known; or it has a root
        // count the run did not change, and is no candidate.
        // TODO: the stricter read, the counts of every key whose count after the run is not above 0, could be an
        // optional setting. It gives a halt with `missing-reference` on tables that lost a count row. It costs 169
        // count keys read per block against 9.7 on Preprod heights 0 to 10,000. A cheaper form reads that way only at
        // a run's first block after a start.
        await this.#learnCounts(tables, [...reached].filter((record) => record.delta < 0));
        frontier = reached;
        if (fault === "first-round-only") break;
      }
    }

    // (8) The queue after, over the keys whose membership the run can change. The cascade met more keys.
    const all = [...this.#records.values()];
    const domain = inOrder(new Set([...queueFound, ...fresh, ...touched, ...all.filter((record) => record.delta !== 0)]));
    if (!this.on) {
      // No queue was read: the membership of these keys, and the counts of those that can be queued after.
      const found = new Set((domain.length === 0 ? [] : await tables.queued(domain.map((record) => this.#bytes(record)))).map((key) => this.#recordOf(key)));
      for (const record of domain) record.queued = found.has(record);
      await this.#learnCounts(tables, domain.filter((record) => record.delta <= 0));
    }
    // A key whose counts were not read has a change above 0, so a count above 0.
    const countAfter = (record: KeyRecord): number => (record.counts === null ? record.delta : count(record));
    const queuedAfter = (record: KeyRecord): boolean =>
      inUniverse(record) && !record.deleted && record.counts !== null && count(record) === 0 && rootsAfter(record) === 0;

    // (7) The checks, before anything is written.
    if (unchecked !== "negative-count") {
      for (const record of inOrder(all.filter((candidate) => candidate.delta !== 0))) {
        if (countAfter(record) < 0) {
          throw this.#invalid("negative-count", last, last, `the reference count of ${shown(record.text)} would fall below 0`, { key: shown(record.text) });
        }
      }
    }
    if (pending !== null) throw pending.error;
    // No list the run writes references a key the cascade deleted. With counts that hold the stored references none
    // does: a key a kept list references keeps a count above 0. On tables whose count of a key is too low, the
    // cascade can delete it while a list the run writes references it.
    if (unchecked !== "missing-reference") {
      for (const record of inOrder(nodes.filter((node) => (node.kind === "new" || node.kind === "replaces") && !node.deleted))) {
        const gone = nodeOf(record).refs.find((ref) => ref.deleted);
        if (gone === undefined) continue;
        throw this.#invalid(
          "missing-reference",
          last,
          last,
          `${shown(record.text)}, which the run writes, references ${shown(gone.text)}, which the run deletes`,
          { key: shown(gone.text) },
        );
      }
    }
    const unqueued: KeyRecord[] = [];
    const queued: KeyRecord[] = [];
    let keptByReplaced = 0;
    for (const record of domain) {
      const after = queuedAfter(record);
      if (record.queued === true && !after) unqueued.push(record);
      if (record.queued !== true && after) queued.push(record);
      if (after && this.on && record.droppedLast && rootsBefore(record) === 0) keptByReplaced += 1;
      if (after && this.on && unchecked !== "unexpected-queued") {
        const released = rootsBefore(record) > 0 && rootsAfter(record) === 0;
        if (!released && !record.droppedLast) {
          throw this.#invalid(
            "unexpected-queued",
            last,
            last,
            `${shown(record.text)} is left stored with no reference and no root count, and the run's last block neither released it nor replaced a child list that referenced it`,
            { key: shown(record.text) },
          );
        }
      }
    }
    if (fault === "queue-change-dropped") (queued.length > 0 ? queued : unqueued).shift();

    // (9) The net write and (10) the deleted keys.
    const inserts = inOrder(nodes.filter((record) => record.kind !== "same" && !record.deleted)).map((record) => {
      const node = nodeOf(record);
      return { key: node.key, data: node.data, children: node.children };
    });
    const changes = inOrder(all.filter((record) => record.delta !== 0));
    const evicted = inOrder(deleted);
    for (const record of evicted) known.forget(record.text);
    const net: NetWrite = Object.freeze({
      height: last,
      inserts,
      written: inserts.length,
      deltas: changes.map((record) => ({ key: this.#bytes(record), delta: record.delta })),
      counted: changes.filter((record) => countAfter(record) > 0).length,
      unqueued: unqueued.map((record) => this.#bytes(record)),
      queued: queued.map((record) => this.#bytes(record)),
      deleted: evicted.filter((record) => record.row === true).map((record) => this.#bytes(record)),
    });
    return Object.freeze({
      net,
      evict: evicted.map((record) => this.#bytes(record)),
      rounds,
      handed: nodes.length,
      newNodes: fresh.length,
      newKeys: inOrder(fresh).map((record) => nodeOf(record).key),
      rewrittenNodes: nodes.filter((record) => record.kind === "replaces").length,
      unchangedNodes: nodes.filter((record) => record.kind === "same").length,
      keptByReplaced,
    });
  }
}
