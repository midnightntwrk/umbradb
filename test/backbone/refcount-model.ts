import fc from "fast-check";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import { type Child, childKey, decodeChildren, encodeChildren, hex, nodeKey, refsOf } from "../ledger/node-format.js";

/**
 * The reference model of the reference counting, its reachability oracle, and the generators of the histories they
 * are checked on. Everything here is test code: the model uses hex keys, maps and sets, no database, and nothing of
 * `src/` but the child-list reader (`childRefKeys`, which `test/ledger/node-refs.test.ts` checks against the ledger
 * package's own `childRefs`).
 *
 * - {@link refcountModelStep} computes one block from the tables at h − 1 and the block's batch, rule by rule, in the
 *   order of the rules: (1) the batch's nodes classified as new, rewritten or written again unchanged; (2) each
 *   reference in the batch's child list of a new or rewritten node counted; (3) each reference in a rewritten node's
 *   stored child list subtracted, its key protected for the block; (4) a key with a root count after h − 1 or after h,
 *   or of a new node, protected too; (5) with `sweep` on, the cascade from the queue: in rounds, every candidate not
 *   protected whose count reaches 0 is deleted, and each reference in its child list as stored after the block's
 *   writes is subtracted and becomes a candidate, until a round deletes none; (6) the counts; (7) the queue, over the
 *   keys whose membership can change; (8) the checks, `negative-count` and `missing-reference`, which halt the block
 *   ({@link RefcountModelHalt}); (10) the rows: the batch's new and rewritten child lists written, then the deleted
 *   keys removed. Rule 9 (the eviction) is the caller's: the deleted keys are given back.
 * - {@link oracle} recomputes, from the state each height was generated with (the persisted keys and the child list
 *   last written for every key), the reachable sets `R_{h−1}`, `R_h` and `K_h`, the counts, the queue and the
 *   protected keys, and checks the model's tables after the block against them: I1–I5 for every batch, I6 for every
 *   admissible one (every new and rewritten node reached from a key whose root count rises), and `R_{h−1} ⊆ S_h` for
 *   every batch. It reads none of the model's sets but the rows, counts, roots, queue and deletions it checks.
 * - {@link historyScripts} and {@link driveHistory} generate the histories: states built over shared subtrees, small
 *   children embedded or referenced, repeated children, rewrites in both directions, nodes written again unchanged,
 *   new nodes nothing reaches, the two rewrites of a queued node, queued keys referenced again, contract keys,
 *   `retainStates` 0 and above, lowered windows and `sweep` turned off and on. A history in one form (`oneForm`) writes
 *   every key with one child list throughout and only admissible batches, as the sweep's model needs.
 *
 * Child lists are the ledger's `layout-v2` bytes, built with `test/ledger/node-format.ts`, an implementation of the
 * node format and its keys of its own.
 */

// ── The model ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** The tables of `core-ledger-state` that reclamation reads and writes, as the model holds them (hex keys). */
export interface RefcountTables {
  /** `nodes`: each row's key and the child list stored for it (`S_h`). */
  readonly rows: ReadonlyMap<string, Uint8Array>;
  /** `ref_counts`: every key with references, with their number (never 0). */
  readonly refs: ReadonlyMap<string, number>;
  /** `root_counts` (never 0). */
  readonly roots: ReadonlyMap<string, number>;
  /** `unreferenced` (`Q_h`). */
  readonly queue: ReadonlySet<string>;
}

/** The tables of a database before its first block. */
export const EMPTY_TABLES: RefcountTables = Object.freeze({
  rows: new Map<string, Uint8Array>(),
  refs: new Map<string, number>(),
  roots: new Map<string, number>(),
  queue: new Set<string>(),
});

/** What the ledger worker flushed for a block (`NodeBatch`, hex keys): each key once, root changes netted. */
export interface RefcountBatch {
  readonly inserts: readonly { readonly key: string; readonly children: Uint8Array }[];
  readonly rootCounts: readonly { readonly key: string; readonly delta: number }[];
}

/**
 * A fault put into the model for a negative control:
 * - `no-root-conditions`: rule 4 without its root conditions. A rooted key whose last reference goes in a cascade is
 *   deleted; a key the block releases is still not deleted in that block, since the cascade starts from the queue.
 * - `released-in-block`: the same, and the cascade also starts from every key whose root count falls to 0 in the
 *   block, so a released state's rows are deleted in the block that releases it. (With the root conditions those keys
 *   are protected, so starting from them would change nothing.)
 * - `first-round-only`: the cascade stops after its first round.
 */
export type RefcountFault = "no-root-conditions" | "released-in-block" | "first-round-only";

/** The reasons of `ledger-refcount-invalid` the step can find before eviction. */
export type RefcountHaltReason = "negative-count" | "missing-reference";

/** A check of rule 8 failed: the block halts with nothing of it stored. */
export class RefcountModelHalt extends Error {
  readonly reason: RefcountHaltReason;
  readonly key: string;
  constructor(reason: RefcountHaltReason, key: string) {
    super(`ledger-refcount-invalid (${reason}) at ${key}`);
    this.name = "RefcountModelHalt";
    this.reason = reason;
    this.key = key;
  }
}

/** One block's step, as the model computes it. Every list is sorted. */
export interface RefcountModelStep {
  /** `N`: the batch's nodes whose key was not a row. */
  readonly newNodes: readonly string[];
  /** `W`: the batch's nodes that were rows with another child list. */
  readonly rewritten: readonly string[];
  /** The batch's nodes written again with their stored child list. */
  readonly unchanged: readonly string[];
  /** `Δ`: each key's netted change of its count in the block, for the keys where it is not 0, in key order. */
  readonly deltas: ReadonlyMap<string, number>;
  /** `D`: the rows deleted (and to evict). */
  readonly deleted: readonly string[];
  /** The rounds of the cascade that deleted rows. */
  readonly rounds: number;
  /** The tables after the block. */
  readonly after: RefcountTables;
}

const sorted = (keys: Iterable<string>): string[] => [...keys].sort();
const refKeysOf = (children: Uint8Array): string[] => childRefKeys(children).map(hex);

/**
 * Block h of the reference counting (see the module comment): `tables` are the tables at h − 1, `batch` the block's
 * batch, `on` whether `sweep` is on at h. Throws {@link RefcountModelHalt} when a check fails.
 */
export function refcountModelStep(
  tables: RefcountTables,
  batch: RefcountBatch,
  options: { readonly on: boolean; readonly fault?: RefcountFault },
): RefcountModelStep {
  const written = new Set<string>();
  for (const { key } of batch.inserts) {
    if (written.has(key)) throw new Error(`the batch writes ${key} twice`);
    written.add(key);
  }
  const rootChange = new Map<string, number>();
  for (const { key, delta } of batch.rootCounts) {
    if (rootChange.has(key) || delta === 0 || !Number.isInteger(delta)) {
      throw new Error(`the batch's root-count changes are not netted at ${key}`);
    }
    rootChange.set(key, delta);
  }
  const rootsBefore = (key: string): number => tables.roots.get(key) ?? 0;
  const rootsAfter = (key: string): number => rootsBefore(key) + (rootChange.get(key) ?? 0);
  for (const key of rootChange.keys()) {
    if (rootsAfter(key) < 0) throw new Error(`the batch releases ${key} more often than it was persisted`);
  }

  // (1) The batch classified; the child lists of its new and rewritten nodes are what the block stores.
  const fresh: string[] = [];
  const rewritten: string[] = [];
  const unchanged: string[] = [];
  const listAfter = new Map<string, Uint8Array>();
  for (const node of batch.inserts) {
    const stored = tables.rows.get(node.key);
    if (stored === undefined) fresh.push(node.key);
    else if (Buffer.compare(stored, node.children) !== 0) rewritten.push(node.key);
    else {
      unchanged.push(node.key);
      continue;
    }
    listAfter.set(node.key, node.children);
  }

  const delta = new Map<string, number>();
  const change = (key: string, by: number): void => {
    const next = (delta.get(key) ?? 0) + by;
    if (next === 0) delta.delete(key);
    else delta.set(key, next);
  };
  // (2) Increments.
  for (const children of listAfter.values()) for (const key of refKeysOf(children)) change(key, 1);
  // (3) Rewrites: the stored child list's references subtracted, each of their keys protected for the block.
  const dropped = new Set<string>();
  for (const key of rewritten) {
    for (const ref of refKeysOf(tables.rows.get(key) as Uint8Array)) {
      change(ref, -1);
      dropped.add(ref);
    }
  }
  // (4) Protection.
  const newKeys = new Set(fresh);
  const byRoots = options.fault !== "no-root-conditions" && options.fault !== "released-in-block";
  const protectedInBlock = (key: string): boolean =>
    dropped.has(key) || newKeys.has(key) || (byRoots && (rootsBefore(key) > 0 || rootsAfter(key) > 0));
  // (5) Deletions, from the queue, round by round.
  const count = (key: string): number => (tables.refs.get(key) ?? 0) + (delta.get(key) ?? 0);
  const deleted = new Set<string>();
  let rounds = 0;
  if (options.on) {
    const candidates = new Set(tables.queue);
    if (options.fault === "released-in-block") {
      for (const [key, by] of rootChange) if (by < 0 && rootsAfter(key) === 0) candidates.add(key);
    }
    for (;;) {
      const round = sorted(candidates).filter((key) => !deleted.has(key) && !protectedInBlock(key) && count(key) === 0);
      if (round.length === 0) break;
      rounds += 1;
      for (const key of round) deleted.add(key);
      for (const key of round) {
        const children = listAfter.get(key) ?? tables.rows.get(key);
        if (children === undefined) throw new Error(`the cascade reaches ${key}, which is not a row`);
        for (const ref of refKeysOf(children)) {
          change(ref, -1);
          candidates.add(ref);
        }
      }
      if (options.fault === "first-round-only") break;
    }
  }

  // (8) Checks, before the eviction.
  for (const key of sorted(delta.keys())) if (count(key) < 0) throw new RefcountModelHalt("negative-count", key);
  const rowAfter = (key: string): boolean => newKeys.has(key) || (tables.rows.has(key) && !deleted.has(key));
  for (const key of sorted(listAfter.keys())) {
    for (const ref of refKeysOf(listAfter.get(key) as Uint8Array)) {
      if (!rowAfter(ref)) throw new RefcountModelHalt("missing-reference", ref);
    }
  }
  for (const key of sorted(rootChange.keys())) {
    if ((rootChange.get(key) as number) > 0 && !rowAfter(key)) throw new RefcountModelHalt("missing-reference", key);
  }

  // (6) Counts, and the root counts.
  const refs = new Map(tables.refs);
  for (const [key, by] of delta) {
    const next = (tables.refs.get(key) ?? 0) + by;
    if (next === 0) refs.delete(key);
    else refs.set(key, next);
  }
  const roots = new Map(tables.roots);
  for (const key of rootChange.keys()) {
    if (rootsAfter(key) === 0) roots.delete(key);
    else roots.set(key, rootsAfter(key));
  }
  // (10) Rows: the node writes first (a rewritten node can be deleted), then the deletions.
  const rows = new Map(tables.rows);
  for (const [key, children] of listAfter) rows.set(key, children);
  for (const key of deleted) rows.delete(key);
  // (7) The queue, over the keys whose membership can change in the block.
  const queue = new Set(tables.queue);
  for (const key of new Set([...tables.queue, ...fresh, ...delta.keys(), ...rootChange.keys()])) {
    if (rows.has(key) && (refs.get(key) ?? 0) === 0 && rootsAfter(key) === 0) queue.add(key);
    else queue.delete(key);
  }

  return {
    newNodes: sorted(fresh),
    rewritten: sorted(rewritten),
    unchanged: sorted(unchanged),
    deltas: new Map(sorted(delta.keys()).map((key) => [key, delta.get(key) as number])),
    deleted: sorted(deleted),
    rounds,
    after: { rows, refs, roots, queue },
  };
}

/** The model across blocks: the tables after the last block, and the next block's step. */
export class RefcountModel {
  readonly #fault: RefcountFault | undefined;
  #tables: RefcountTables = EMPTY_TABLES;

  constructor(fault?: RefcountFault) {
    this.#fault = fault;
  }

  /** The tables after the last block. */
  get tables(): RefcountTables {
    return this.#tables;
  }

  /** Applies one block with `batch`, `on` the `sweep` setting at its height; its tables change only if it commits. */
  block(batch: RefcountBatch, on: boolean): RefcountModelStep {
    const options = this.#fault === undefined ? { on } : { on, fault: this.#fault };
    const step = refcountModelStep(this.#tables, batch, options);
    this.#tables = step.after;
    return step;
  }
}

/**
 * The node set of `rows`: every row's key and the key of every node embedded in a row's child list, at any depth, each
 * computed from its payload and its children's keys. Two forms of one node hold the same node set.
 */
export function nodeSet(rows: Iterable<readonly [string, Uint8Array]>): Set<string> {
  const keys = new Set<string>();
  const walk = (children: readonly Child[]): void => {
    for (const child of children) {
      if ("direct" in child) {
        keys.add(hex(childKey(child)));
        walk(child.direct.children);
      }
    }
  };
  for (const [key, children] of rows) {
    keys.add(key);
    walk(decodeChildren(children));
  }
  return keys;
}

// ── The generators ───────────────────────────────────────────────────────────────────────────────────────────────────

/** What a block does to the ledger state: a new state, the same state again, or no state persisted. */
export type BlockKind = "state" | "same" | "quiet";

/** Which rewrite of a queued node a block attempts: none, a small child embedded → referenced, or the other way. */
export type BoundaryRewrite = "none" | "embed-to-ref" | "ref-to-embed";

/** One block of a generated history, as fast-check draws it; the details come from `seed`. */
export interface BlockScript {
  readonly kind: BlockKind;
  readonly on: boolean;
  /** `retainStates` from this block on, or null to keep it. */
  readonly window: number | null;
  /** Whether the block persists a key of its state as a contract key (never released). */
  readonly contract: boolean;
  /** Stored nodes reached from a rising key, written again with one small child in the other form. */
  readonly rewrites: number;
  /** Stored nodes written again with one small child in the other form, wherever they are. */
  readonly strays: number;
  /** New nodes nothing reaches. */
  readonly orphans: number;
  /** Stored nodes written again with their stored child list. */
  readonly again: number;
  /** A queued node rewritten (only in a block whose root counts do not rise). */
  readonly boundary: BoundaryRewrite;
  readonly seed: number;
}

/** A generated history: its first `retainStates`, whether every key keeps one form, and its blocks. */
export interface HistoryScript {
  readonly retainStates: number;
  readonly oneForm: boolean;
  readonly blocks: readonly BlockScript[];
}

/**
 * Generated histories. With `oneForm`, no node is rewritten, none is written again in another form after its
 * deletion, and every batch is admissible: no new node that a rising key does not reach, no rewrite.
 */
export function historyScripts(options: {
  readonly oneForm: boolean;
  readonly maxBlocks?: number;
}): fc.Arbitrary<HistoryScript> {
  const none = fc.constant(0);
  const rarely = fc.oneof({ weight: 4, arbitrary: none }, { weight: 1, arbitrary: fc.constant(1) });
  const kind: fc.Arbitrary<BlockKind> = fc.oneof(
    { weight: 7, arbitrary: fc.constant("state" as const) },
    { weight: 1, arbitrary: fc.constant("same" as const) },
    { weight: 2, arbitrary: fc.constant("quiet" as const) },
  );
  const boundary: fc.Arbitrary<BoundaryRewrite> = options.oneForm
    ? fc.constant("none" as const)
    : fc.constantFrom("none" as const, "embed-to-ref" as const, "ref-to-embed" as const);
  const block: fc.Arbitrary<BlockScript> = fc.record({
    kind,
    on: fc.integer({ min: 0, max: 7 }).map((n) => n !== 0),
    window: fc.oneof(
      { weight: 6, arbitrary: fc.constant(null) },
      { weight: 1, arbitrary: fc.integer({ min: 0, max: 5 }) },
    ),
    contract: fc.integer({ min: 0, max: 6 }).map((n) => n === 0),
    rewrites: options.oneForm ? none : fc.integer({ min: 0, max: 2 }),
    strays: options.oneForm ? none : rarely,
    orphans: options.oneForm ? none : rarely,
    again: fc.integer({ min: 0, max: 2 }),
    boundary,
    seed: fc.integer({ min: 0, max: 0x7fffffff }),
  });
  return fc.record({
    retainStates: fc.integer({ min: 0, max: 3 }),
    oneForm: fc.constant(options.oneForm),
    blocks: fc.array(block, { minLength: 2, maxLength: options.maxBlocks ?? 30, size: "medium" }),
  });
}

/** The ledger state a height was generated with: what the oracle recomputes everything from. */
export interface GeneratedState {
  readonly height: number;
  readonly retainStates: number;
  /** The persisted keys (retained states and contract keys), each with how often it is persisted. */
  readonly roots: ReadonlyMap<string, number>;
  /** The retained states' root keys, oldest first. */
  readonly states: readonly string[];
  /** The contract keys persisted so far. */
  readonly contracts: readonly string[];
  /** The root key of every state generated so far. */
  readonly stateRoots: ReadonlySet<string>;
  /** The child list last written for each key. */
  readonly lists: ReadonlyMap<string, readonly Child[]>;
  /** The keys the package holds as stored: every key it wrote and was not told to evict. */
  readonly stored: ReadonlySet<string>;
}

/** A generated block: its batch's nodes (child lists as trees and as bytes), its root-count changes, `sweep`. */
export interface GeneratedBlock {
  readonly height: number;
  readonly on: boolean;
  /** Whether `sweep` was on at the block before (true before the first). */
  readonly wasOn: boolean;
  readonly inserts: readonly { readonly key: string; readonly tree: readonly Child[]; readonly children: Uint8Array }[];
  readonly rootCounts: readonly { readonly key: string; readonly delta: number }[];
  /** How many states the block released. */
  readonly releasedStates: number;
}

/** A node of a generated history: its key is the format's, from its payload and its children's keys. */
interface GraphNode {
  readonly key: string;
  readonly keyBytes: Uint8Array;
  readonly data: Uint8Array;
  readonly children: readonly GraphNode[];
  /** Whether the node may be embedded in a parent. */
  readonly small: boolean;
  /** Whether each child is embedded when the node is built afresh (only small children are). */
  readonly embed: boolean[];
}

/** A small deterministic generator of choices, seeded per block (mulberry32). */
class Dice {
  #state: number;
  constructor(seed: number) {
    this.#state = seed >>> 0;
  }
  /** An integer in [0, n). */
  below(n: number): number {
    this.#state = (this.#state + 0x6d2b79f5) >>> 0;
    let t = this.#state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) % n;
  }
  chance(oneIn: number): boolean {
    return this.below(oneIn) === 0;
  }
  pick<T>(items: readonly T[]): T | undefined {
    return items.length === 0 ? undefined : items[this.below(items.length)];
  }
}

const utf8 = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "utf8"));
const treeRefs = (tree: readonly Child[]): string[] => refsOf([...tree]).map(hex);

/**
 * The generated ledger and the package that flushes it. Each block persists a state (a root over subtrees that the
 * previous state's root shares, new ones, queued or older nodes), releases the states outside the window, and flushes,
 * as `flushNodes` does, every node reached from a key whose root count rises down to the nodes the package holds as
 * stored; then the block's script adds rewrites, nodes written again, new nodes nothing reaches and the rewrites of a
 * queued node. The package learns of deletions by their eviction ({@link GraphWorld.commit}).
 */
export class GraphWorld {
  readonly #oneForm: boolean;
  #retainStates: number;
  #height = -1;
  #wasOn = true;
  readonly #nodes: GraphNode[] = [];
  readonly #byKey = new Map<string, GraphNode>();
  readonly #lists = new Map<string, readonly Child[]>();
  readonly #firstBytes = new Map<string, Uint8Array>();
  readonly #stored = new Set<string>();
  #states: GraphNode[] = [];
  readonly #contracts: GraphNode[] = [];
  readonly #stateRoots = new Set<string>();

  constructor(script: HistoryScript) {
    this.#oneForm = script.oneForm;
    this.#retainStates = script.retainStates;
  }

  /** The state after the last block. */
  state(): GeneratedState {
    return {
      height: this.#height,
      retainStates: this.#retainStates,
      roots: this.#rootCounts(),
      states: this.#states.map((node) => node.key),
      contracts: this.#contracts.map((node) => node.key),
      stateRoots: new Set(this.#stateRoots),
      lists: new Map(this.#lists),
      stored: new Set(this.#stored),
    };
  }

  /** The bytes of the child list last written for `key`. */
  bytesOf(key: string): Uint8Array {
    const list = this.#lists.get(key);
    if (list === undefined) throw new Error(`${key} was never written`);
    return encodeChildren([...list]);
  }

  /**
   * The next block's batch, from its script; `queue` is the queue after the previous block, which the script's cases
   * aim at (a queued key referenced again, a queued node rewritten).
   */
  build(script: BlockScript, queue: ReadonlySet<string>): GeneratedBlock {
    this.#height += 1;
    const dice = new Dice(script.seed);
    const queued = sorted(queue)
      .map((key) => this.#byKey.get(key))
      .filter((node): node is GraphNode => node !== undefined);

    // The persisted keys: the state after the block, the window, a contract key.
    const rootsBefore = this.#rootCounts();
    if (script.kind === "state" || (script.kind === "same" && this.#states.length === 0)) {
      const root = this.#newState(dice, queued);
      this.#states.push(root);
      this.#stateRoots.add(root.key);
    } else if (script.kind === "same") this.#states.push(this.#states.at(-1) as GraphNode);
    if (script.window !== null) this.#retainStates = script.window;
    const keep = this.#retainStates + 1;
    const releasedStates = Math.max(0, this.#states.length - keep);
    this.#states = this.#states.slice(-keep);
    const top = this.#states.at(-1);
    if (script.contract && top !== undefined) {
      const target = dice.pick(this.#descendants(top));
      if (target !== undefined) this.#contracts.push(target);
    }
    const rootsAfter = this.#rootCounts();
    const rootCounts = sorted(new Set([...rootsBefore.keys(), ...rootsAfter.keys()]))
      .map((key) => ({ key, delta: (rootsAfter.get(key) ?? 0) - (rootsBefore.get(key) ?? 0) }))
      .filter(({ delta }) => delta !== 0);
    const rising = rootCounts.filter(({ delta }) => delta > 0).map(({ key }) => this.#node(key));

    // The batch.
    const inserts = new Map<string, readonly Child[]>();
    const listAfter = (key: string): readonly Child[] | undefined => inserts.get(key) ?? this.#lists.get(key);
    const write = (node: GraphNode, tree: readonly Child[]): void => {
      inserts.set(node.key, tree);
      for (const ref of treeRefs(tree)) ensure(this.#node(ref));
    };
    const ensure = (node: GraphNode, tree?: readonly Child[]): void => {
      if (this.#stored.has(node.key) || inserts.has(node.key)) return;
      // Needed again after its deletion: the package may build it afresh in another form.
      if (tree === undefined && !this.#oneForm && this.#lists.has(node.key) && dice.chance(3)) this.#reform(node, dice);
      write(node, tree ?? this.#tree(node));
    };
    const reachedFromRising = (): Set<string> => reach(rising.map((node) => node.key), listAfter);
    const parentsOf = (key: string): number => {
      let parents = 0;
      for (const stored of this.#stored) {
        parents += treeRefs(listAfter(stored) ?? []).filter((ref) => ref === key).length;
      }
      return parents;
    };
    /** A stored node written again with one small child in the other form; false when it has none that may change. */
    const toggle = (node: GraphNode, admissible: boolean, direction?: BoundaryRewrite): boolean => {
      const old = this.#lists.get(node.key);
      if (old === undefined || inserts.has(node.key)) return false;
      const positions = old
        .map((child, at) => ({ child, at, of: node.children[at] as GraphNode }))
        .filter(({ of }) => of.small)
        .filter(({ child }) => direction === undefined || (direction === "ref-to-embed") === ("ref" in child))
        // Outside what a rising key reaches, a child becomes referenced only if the block writes it new: a referenced
        // stored child could be deleted with the node in the same block, and the node's list would name a missing key.
        .filter(({ child, of }) => "ref" in child || admissible || !this.#stored.has(of.key));
      const prefer = direction === "ref-to-embed" ? positions.filter(({ of }) => parentsOf(of.key) === 1) : [];
      const chosen = dice.pick(prefer.length > 0 ? prefer : positions);
      if (chosen === undefined) return false;
      const tree = [...old];
      if ("ref" in chosen.child) {
        const inline = listAfter(chosen.of.key);
        if (inline === undefined) return false;
        tree[chosen.at] = { direct: { data: chosen.of.data, children: [...inline] } };
      } else {
        tree[chosen.at] = { ref: chosen.of.keyBytes };
        // The child becomes its own row, with the child list it had inline.
        ensure(chosen.of, chosen.child.direct.children);
      }
      node.embed[chosen.at] = "ref" in chosen.child;
      write(node, tree);
      return true;
    };

    for (const node of rising) ensure(node);
    if (!this.#oneForm) {
      for (let i = 0; i < script.rewrites; i++) {
        const reached = reachedFromRising();
        const candidates = sorted(reached)
          .filter((key) => this.#stored.has(key) && !inserts.has(key))
          .map((key) => this.#node(key))
          .filter((node) => node.children.some((child) => child.small));
        const node = dice.pick(candidates);
        if (node !== undefined) toggle(node, true);
      }
      if (script.boundary !== "none" && rising.length === 0) {
        const targets = queued.filter((node) => this.#stored.has(node.key));
        for (let tries = targets.length; tries > 0; tries--) {
          const target = targets.splice(dice.below(targets.length), 1)[0] as GraphNode;
          if (toggle(target, false, script.boundary)) break;
        }
      }
      for (let i = 0; i < script.strays; i++) {
        const reached = reachedFromRising();
        const candidates = sorted(this.#stored)
          .filter((key) => !inserts.has(key))
          .map((key) => this.#node(key))
          .filter((node) => node.children.some((child) => child.small));
        const node = dice.pick(candidates);
        if (node !== undefined) toggle(node, reached.has(node.key));
      }
      for (let i = 0; i < script.orphans; i++) {
        const children: GraphNode[] = [];
        for (let n = 1 + dice.below(3); n > 0; n--) {
          const roll = dice.below(4);
          const pick =
            roll === 0
              ? dice.pick(queued)
              : roll === 1
                ? dice.pick(sorted(this.#stored).map((key) => this.#node(key)))
                : roll === 2
                  ? dice.pick(this.#nodes)
                  : undefined;
          children.push(pick ?? this.#leaf(dice));
        }
        ensure(this.#create("orphan", children, dice.chance(2), dice));
      }
    }
    for (let i = 0; i < script.again; i++) {
      const key = dice.pick(sorted(this.#stored).filter((stored) => !inserts.has(stored)));
      if (key !== undefined) inserts.set(key, this.#lists.get(key) as readonly Child[]);
    }

    const block: GeneratedBlock = {
      height: this.#height,
      on: script.on,
      wasOn: this.#wasOn,
      inserts: sorted(inserts.keys()).map((key) => {
        const tree = inserts.get(key) as readonly Child[];
        return { key, tree, children: encodeChildren([...tree]) };
      }),
      rootCounts,
      releasedStates,
    };
    return block;
  }

  /** The block committed: its nodes stored with the child lists written, then the deleted keys evicted. */
  commit(block: GeneratedBlock, deleted: readonly string[]): void {
    for (const { key, tree, children } of block.inserts) {
      const first = this.#firstBytes.get(key);
      if (first === undefined) this.#firstBytes.set(key, children);
      else if (this.#oneForm && Buffer.compare(first, children) !== 0) {
        throw new Error(`${key} is written in another form in a history in one form`);
      }
      this.#lists.set(key, tree);
      this.#stored.add(key);
    }
    for (const key of deleted) this.#stored.delete(key);
    this.#wasOn = block.on;
  }

  #node(key: string): GraphNode {
    const node = this.#byKey.get(key);
    if (node === undefined) throw new Error(`no generated node has the key ${key}`);
    return node;
  }

  #rootCounts(): Map<string, number> {
    const roots = new Map<string, number>();
    for (const node of [...this.#states, ...this.#contracts]) roots.set(node.key, (roots.get(node.key) ?? 0) + 1);
    return roots;
  }

  #create(label: string, children: readonly GraphNode[], small: boolean, dice: Dice): GraphNode {
    const data = utf8(`${label} ${this.#nodes.length}`);
    const keyBytes = nodeKey(data, children.map((child) => child.keyBytes));
    const node: GraphNode = {
      key: hex(keyBytes),
      keyBytes,
      data,
      children,
      small,
      embed: children.map((child) => child.small && dice.chance(2)),
    };
    this.#nodes.push(node);
    this.#byKey.set(node.key, node);
    return node;
  }

  #leaf(dice: Dice): GraphNode {
    return this.#create("leaf", [], true, dice);
  }

  /** A small node over a leaf or two and older nodes: embedded, it holds references. */
  #small(dice: Dice): GraphNode {
    const children: GraphNode[] = [];
    for (let n = 1 + dice.below(2); n > 0; n--) {
      children.push(dice.chance(2) ? this.#leaf(dice) : (dice.pick(this.#nodes) ?? this.#leaf(dice)));
    }
    return this.#create("small", children, true, dice);
  }

  /** A subtree of new nodes over leaves, small nodes and older nodes, a child sometimes repeated. */
  #subtree(depth: number, dice: Dice): GraphNode {
    const children: GraphNode[] = [];
    for (let n = 1 + dice.below(3); n > 0; n--) {
      const roll = dice.below(8);
      if (roll < 3) children.push(this.#leaf(dice));
      else if (roll < 4) children.push(this.#small(dice));
      else if (roll < 6) children.push(dice.pick(this.#nodes) ?? this.#leaf(dice));
      else if (roll < 7 && depth > 0) children.push(this.#subtree(depth - 1, dice));
      else children.push(children.at(-1) ?? this.#leaf(dice));
    }
    return this.#create("inner", children, false, dice);
  }

  /** A new state's root: the previous root's children kept or replaced, a queued node or an older one reused. */
  #newState(dice: Dice, queued: readonly GraphNode[]): GraphNode {
    const slots = this.#states.at(-1)?.children ?? [];
    const width = slots.length === 0 ? 2 + dice.below(3) : Math.max(1, slots.length + dice.below(3) - 1);
    const children: GraphNode[] = [];
    for (let at = 0; at < width; at++) {
      const roll = dice.below(10);
      const kept = slots[at];
      if (kept !== undefined && roll < 5) children.push(kept);
      else if (roll < 7) children.push(this.#subtree(2, dice));
      else if (roll < 8) children.push(this.#small(dice));
      else if (roll < 9) children.push(dice.pick(queued) ?? this.#small(dice));
      else children.push(dice.pick(this.#nodes) ?? this.#leaf(dice));
    }
    if (dice.chance(5)) children.push(children[dice.below(children.length)] as GraphNode);
    return this.#create("state", children, false, dice);
  }

  /** Every node under `top`, by its logical children. */
  #descendants(top: GraphNode): GraphNode[] {
    const seen = new Map<string, GraphNode>();
    const stack = [...top.children];
    for (let node = stack.pop(); node !== undefined; node = stack.pop()) {
      if (seen.has(node.key)) continue;
      seen.set(node.key, node);
      stack.push(...node.children);
    }
    return sorted(seen.keys()).map((key) => seen.get(key) as GraphNode);
  }

  /** The node's child list as built afresh: small children embedded where its form says, with their own forms. */
  #tree(node: GraphNode): Child[] {
    return node.children.map((child, at) =>
      node.embed[at] === true ? { direct: { data: child.data, children: this.#tree(child) } } : { ref: child.keyBytes },
    );
  }

  /** One small child of the node switched to the other form, for the next time it is built afresh. */
  #reform(node: GraphNode, dice: Dice): void {
    const positions = node.children.map((child, at) => (child.small ? at : -1)).filter((at) => at >= 0);
    const at = dice.pick(positions);
    if (at !== undefined) node.embed[at] = !node.embed[at];
  }
}

/** One block of a driven history: the step's input, the model's step, and the generated state on both sides. */
export interface DrivenBlock {
  readonly height: number;
  readonly script: BlockScript;
  /** The model's tables at h − 1: the step's input. */
  readonly tables: RefcountTables;
  /** The batch, as the step takes it. */
  readonly batch: RefcountBatch;
  readonly generated: GeneratedBlock;
  /** The generated state after h − 1 and after h. */
  readonly before: GeneratedState;
  readonly after: GeneratedState;
  readonly step: RefcountModelStep;
}

/**
 * Runs `script` through `model`, block by block, the package told of each block's deletions. A failed check throws
 * {@link RefcountModelHalt} from the block that fails.
 */
export function* driveHistory(
  script: HistoryScript,
  model: RefcountModel = new RefcountModel(),
): Generator<DrivenBlock, void, undefined> {
  const world = new GraphWorld(script);
  for (const block of script.blocks) {
    const tables = model.tables;
    const before = world.state();
    const generated = world.build(block, tables.queue);
    const batch: RefcountBatch = {
      inserts: generated.inserts.map(({ key, children }) => ({ key, children })),
      rootCounts: generated.rootCounts,
    };
    const step = model.block(batch, block.on);
    world.commit(generated, step.deleted);
    yield { height: generated.height, script: block, tables, batch, generated, before, after: world.state(), step };
  }
}

// ── The oracle ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The keys reached from `starts` through `listOf`'s child lists (references only, through embedded children). */
export function reach(starts: Iterable<string>, listOf: (key: string) => readonly Child[] | undefined): Set<string> {
  const seen = new Set<string>();
  const stack = [...starts];
  for (let key = stack.pop(); key !== undefined; key = stack.pop()) {
    if (seen.has(key)) continue;
    seen.add(key);
    for (const ref of treeRefs(listOf(key) ?? [])) if (!seen.has(ref)) stack.push(ref);
  }
  return seen;
}

/** The cases of R1 a block can show; the property's runs must show each. */
export const R1_CASES = [
  "admissible",
  "non-admissible",
  "shared-child",
  "repeated-child",
  "embedded-child-with-references",
  "written-again-unchanged",
  "rewrite-embed-to-ref",
  "rewrite-ref-to-embed",
  "queued-rewritten-to-reference-a-new-node",
  "queued-rewritten-to-embed-its-child",
  "queued-key-referenced-again",
  "retain-states-0",
  "retain-states-above-0",
  "contract-key-held-by-its-root-only",
  "window-lowered-releasing-several",
  "sweep-off",
  "sweep-on-after-off",
  "deleted-and-written-again",
  "cascade",
] as const;

/** A case of R1 a block shows. */
export type R1Case = (typeof R1_CASES)[number];

/** The oracle's finding for one block: the properties it found broken (none for a correct model), the cases shown. */
export interface OracleReport {
  readonly problems: readonly string[];
  readonly cases: ReadonlySet<R1Case>;
  readonly admissible: boolean;
}

const same = (a: Iterable<string>, b: Iterable<string>): boolean => {
  const left = sorted(a);
  const right = sorted(b);
  return left.length === right.length && left.every((key, i) => key === right[i]);
};
const short = (key: string): string => key.slice(0, 12);
const listed = (keys: Iterable<string>): string => sorted(keys).map(short).join(", ");

/** Each key's references in the child lists of `rows`, repeats counted. */
function countsOf(rows: Iterable<string>, listOf: (key: string) => readonly Child[] | undefined): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) for (const ref of treeRefs(listOf(row) ?? [])) counts.set(ref, (counts.get(ref) ?? 0) + 1);
  return counts;
}

/** Whether a child list embeds a child that holds a reference. */
const embedsReference = (tree: readonly Child[]): boolean =>
  tree.some(
    (child) =>
      "direct" in child && (treeRefs(child.direct.children).length > 0 || embedsReference(child.direct.children)),
  );

/**
 * Checks the model's step at one block against reachability recomputed from the generated state: `S_{h−1}` is what the
 * package held as stored, the child lists stored at h − 1 and after h are the ones last written, and the persisted keys
 * are the generated roots. The step's rows, counts, roots, queue and deletions are what is checked.
 */
export function oracle(block: DrivenBlock): OracleReport {
  const { before, after, generated, step } = block;
  const h = generated.height;
  const problems: string[] = [];
  const cases = new Set<R1Case>();
  const fail = (property: string, detail: string): void => {
    problems.push(`${property} fails at height ${h}: ${detail}`);
  };

  const batchTrees = new Map(generated.inserts.map(({ key, tree }) => [key, tree]));
  const listBefore = (key: string): readonly Child[] | undefined => before.lists.get(key);
  const listAfter = (key: string): readonly Child[] | undefined => batchTrees.get(key) ?? before.lists.get(key);
  const bytes = (tree: readonly Child[]): Uint8Array => encodeChildren([...tree]);
  const rootsBefore = (key: string): number => before.roots.get(key) ?? 0;
  const rootsAfter = (key: string): number => after.roots.get(key) ?? 0;

  // The batch: new, rewritten, written again unchanged.
  const sBefore = before.stored;
  if (!same(sBefore, block.tables.rows.keys())) {
    fail("package", "the keys the package holds as stored are not the rows");
  }
  const fresh = new Set<string>();
  const rewritten = new Set<string>();
  const unchanged = new Set<string>();
  for (const { key, tree } of generated.inserts) {
    const stored = listBefore(key);
    if (!sBefore.has(key)) fresh.add(key);
    else if (stored === undefined || Buffer.compare(bytes(stored), bytes(tree)) !== 0) rewritten.add(key);
    else unchanged.add(key);
  }
  if (!same(step.newNodes, fresh)) fail("classification", `new nodes ${listed(step.newNodes)}, not ${listed(fresh)}`);
  if (!same(step.rewritten, rewritten)) {
    fail("classification", `rewritten nodes ${listed(step.rewritten)}, not ${listed(rewritten)}`);
  }
  if (!same(step.unchanged, unchanged)) {
    fail("classification", `unchanged nodes ${listed(step.unchanged)}, not ${listed(unchanged)}`);
  }

  // The rows after the block, and what it deleted.
  const sAfter = new Set(step.after.rows.keys());
  const deleted = new Set([...sBefore].filter((key) => !sAfter.has(key)));
  if (!same(step.deleted, deleted)) {
    fail("deletions", `the step reports ${listed(step.deleted)}, the rows lost ${listed(deleted)}`);
  }
  if (!generated.on && deleted.size > 0) fail("sweep off", `rows deleted: ${listed(deleted)}`);
  for (const key of sAfter) {
    if (!sBefore.has(key) && !fresh.has(key)) fail("rows", `${short(key)} is a row the block neither had nor wrote`);
    const list = listAfter(key);
    if (list === undefined || Buffer.compare(step.after.rows.get(key) as Uint8Array, bytes(list)) !== 0) {
      fail("rows", `${short(key)} does not hold the child list last written for it`);
    }
  }
  for (const key of fresh) if (!sAfter.has(key)) fail("rows", `the new node ${short(key)} is not a row`);

  // Roots: the generated persisted keys, which the batch's changes must give.
  for (const key of new Set([...before.roots.keys(), ...after.roots.keys()])) {
    const change = generated.rootCounts.find((c) => c.key === key)?.delta ?? 0;
    if (rootsBefore(key) + change !== rootsAfter(key)) fail("generated roots", `${short(key)}'s change is not netted`);
  }
  if (!same([...step.after.roots].map(([k, v]) => `${k}:${v}`), [...after.roots].map(([k, v]) => `${k}:${v}`))) {
    fail("root counts", "the step's root counts are not the persisted keys'");
  }

  // I1–I4, recomputed from every stored child list.
  const countAfter = countsOf(sAfter, listAfter);
  for (const row of sAfter) {
    for (const ref of treeRefs(listAfter(row) ?? [])) {
      if (!sAfter.has(ref)) fail("I1", `${short(row)} references ${short(ref)}, which is not a row`);
    }
  }
  if (!same([...step.after.refs].map(([k, v]) => `${k}:${v}`), [...countAfter].map(([k, v]) => `${k}:${v}`))) {
    const wrong = sorted(new Set([...step.after.refs.keys(), ...countAfter.keys()])).filter(
      (key) => step.after.refs.get(key) !== countAfter.get(key),
    );
    fail("I2", `counts differ at ${listed(wrong)}`);
  }
  const queueAfter = new Set([...sAfter].filter((key) => (countAfter.get(key) ?? 0) === 0 && rootsAfter(key) === 0));
  if (!same(step.after.queue, queueAfter)) {
    fail("I3", `queue ${listed(step.after.queue)}, not ${listed(queueAfter)}`);
  }
  for (const key of after.roots.keys()) {
    if (!sAfter.has(key)) fail("I4", `the persisted key ${short(key)} is not a row`);
  }

  // Reachability at h − 1 and after h.
  const rBefore = reach(before.roots.keys(), listBefore);
  const rAfter = reach(after.roots.keys(), listAfter);
  const released = new Set<string>();
  for (const key of new Set(before.states)) {
    const held = (states: readonly string[]): number => states.filter((state) => state === key).length;
    if (held(after.states) < held(before.states)) released.add(key);
  }
  const ofReleased = reach(released, listBefore);
  for (const key of rBefore) {
    if (!sAfter.has(key)) {
      const whose = ofReleased.has(key) ? "a row of a state released at h" : "a row reached at h − 1";
      fail("R_{h−1} ⊆ S_h", `${short(key)}, ${whose}, is deleted`);
    }
  }

  // I5, with `sweep` on: what must be gone.
  const dropped = new Set([...rewritten].flatMap((key) => treeRefs(listBefore(key) ?? [])));
  const isProtected = (key: string): boolean =>
    rootsBefore(key) > 0 || rootsAfter(key) > 0 || dropped.has(key) || fresh.has(key);
  const gains = new Set([...fresh, ...rewritten].flatMap((key) => treeRefs(listAfter(key) ?? [])));
  const countBefore = countsOf(sBefore, listBefore);
  const queueBefore = new Set(
    [...sBefore].filter((key) => (countBefore.get(key) ?? 0) === 0 && rootsBefore(key) === 0),
  );
  const parentsBefore = new Map<string, Set<string>>();
  for (const row of sBefore) {
    for (const ref of treeRefs(listBefore(row) ?? [])) {
      const parents = parentsBefore.get(ref) ?? new Set<string>();
      parents.add(row);
      parentsBefore.set(ref, parents);
    }
  }
  if (generated.on) {
    for (const key of queueBefore) {
      if (!isProtected(key) && !gains.has(key) && sAfter.has(key)) {
        fail("I5", `the queued ${short(key)}, neither protected nor referenced again, is kept`);
      }
    }
    for (const key of sBefore) {
      const parents = parentsBefore.get(key);
      if (parents === undefined || ![...parents].every((parent) => deleted.has(parent))) continue;
      if (!isProtected(key) && !gains.has(key) && sAfter.has(key)) {
        fail("I5", `${short(key)}, whose parents were all deleted, is kept`);
      }
    }
  }

  // I6, for an admissible batch: every new and rewritten node reached from a key whose root count rises.
  const rising = generated.rootCounts.filter(({ delta }) => delta > 0).map(({ key }) => key);
  const reachedFromRising = reach(rising, listAfter);
  const admissible = [...fresh, ...rewritten].every((key) => reachedFromRising.has(key));
  if (admissible) {
    const kept = new Set([
      ...rBefore,
      ...reach([...after.roots.keys(), ...fresh, ...rewritten], listAfter),
      ...reach(dropped, listBefore),
    ]);
    for (const key of [...rBefore, ...rAfter]) if (!kept.has(key)) fail("I6", `${short(key)} of R is outside K_h`);
    for (const key of kept) if (!sAfter.has(key)) fail("I6", `${short(key)} of K_h is not a row`);
    if (generated.on) {
      for (const key of sAfter) if (!kept.has(key)) fail("I6", `the row ${short(key)} is outside K_h (S_h = K_h)`);
    }
    if ([...rewritten].every((key) => rBefore.has(key)) && !same(kept, new Set([...rBefore, ...rAfter]))) {
      fail("I6", "K_h is not R_{h−1} ∪ R_h although every rewritten node was in R_{h−1}");
    }
  }

  // The cases the block shows, each with the outcome R1 names.
  cases.add(admissible ? "admissible" : "non-admissible");
  const underStates = new Map<string, number>();
  for (const root of after.stateRoots) {
    if (!sAfter.has(root)) continue;
    for (const ref of new Set(treeRefs(listAfter(root) ?? []))) underStates.set(ref, (underStates.get(ref) ?? 0) + 1);
  }
  if ([...underStates.values()].some((parents) => parents >= 2)) cases.add("shared-child");
  for (const key of [...fresh, ...rewritten]) {
    const tree = listAfter(key) ?? [];
    if (new Set(treeRefs(tree)).size < treeRefs(tree).length) cases.add("repeated-child");
    if (embedsReference(tree)) cases.add("embedded-child-with-references");
  }
  if (unchanged.size > 0) cases.add("written-again-unchanged");
  const keyOf = (child: Child): string => hex(childKey(child));
  for (const key of rewritten) {
    const old = listBefore(key) ?? [];
    const now = listAfter(key) ?? [];
    old.forEach((was, at) => {
      const is = now[at];
      if (is === undefined) return;
      const child = keyOf(was);
      if ("direct" in was && "ref" in is) {
        cases.add("rewrite-embed-to-ref");
        if (queueBefore.has(key) && rootsAfter(key) === 0 && rising.length === 0 && fresh.has(child)) {
          if (!sAfter.has(child)) {
            fail("R1 case", `the new node ${short(child)} a queued node now references is deleted`);
          }
          else if (generated.on && !sAfter.has(key) && queueAfter.has(child) && step.after.queue.has(child)) {
            cases.add("queued-rewritten-to-reference-a-new-node");
          }
        }
      }
      if ("ref" in was && "direct" in is) {
        cases.add("rewrite-ref-to-embed");
        if (queueBefore.has(key) && rootsAfter(key) === 0) {
          if (!sAfter.has(child)) fail("R1 case", `the child ${short(child)} a queued node now embeds is deleted`);
          else if (generated.on && !sAfter.has(key) && step.after.queue.has(child)) {
            cases.add("queued-rewritten-to-embed-its-child");
          }
        }
      }
    });
  }
  for (const key of queueBefore) {
    if (![...fresh].some((node) => treeRefs(listAfter(node) ?? []).includes(key))) continue;
    if (!sAfter.has(key) || step.after.queue.has(key)) {
      fail("R1 case", `the queued ${short(key)} a new node references is deleted or still queued`);
    } else cases.add("queued-key-referenced-again");
  }
  cases.add(after.retainStates === 0 ? "retain-states-0" : "retain-states-above-0");
  for (const key of after.contracts) {
    if ((countBefore.get(key) ?? 0) > 0 && (countAfter.get(key) ?? 0) === 0 && sAfter.has(key)) {
      cases.add("contract-key-held-by-its-root-only");
    }
  }
  if (generated.releasedStates >= 2) cases.add("window-lowered-releasing-several");
  if (!generated.on) cases.add("sweep-off");
  if (generated.on && !generated.wasOn && deleted.size > 0) cases.add("sweep-on-after-off");
  for (const key of fresh) if (before.lists.has(key)) cases.add("deleted-and-written-again");
  for (const key of deleted) {
    if ([...(parentsBefore.get(key) ?? [])].some((parent) => deleted.has(parent))) {
      cases.add("cascade");
      break;
    }
  }

  return { problems, cases, admissible };
}
