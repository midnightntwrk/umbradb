// The DAG fixture of the sweep tests: the ledger state after each
// height h, as nodes in the node's `layout-v2` format — a node's key is SHA-256 of its payload's length (u32,
// little-endian), its payload and its children's keys; its child list is a SCALE `Vec` of `ArenaKey::Ref` children
// (the byte 0, then the 32-byte key) — built so that one marking round does not fit in a budget of 50: a root with
// {@link WIDTH} subtrees (wide), each a node over {@link LEAVES} leaves; the subtrees change version at interleaved
// heights, so every block brings a new root and new subtrees (interleaved new roots). Subtree 0 goes back at
// {@link REVERT} to the version it had before {@link CHANGE}: its nodes, deleted by the sweep in between, are needed
// again (content reused after a deletion). [A105, LG-14]
// Shared by the test package the ledger worker loads (`sweep-test-loader.ts`) and the tests' reference model
// (`test/backbone/sweep-model.ts`). Erasable TypeScript only: the worker runs it through Node.js's type stripping.
//
// Three DAGs, selected by name ({@link FixtureDag}); every function takes the name, `"original"` unless given:
// - `"original"`: the DAG above, which the sweep's tests run, unchanged.
// - `"extended"`: the same states with more children under each root, the cases of the reference-counting tests
//   ({@link extendedCases}). Their child lists also embed children (`ArenaKey::Direct`: the byte 1, the payload as a
//   `Vec<u8>`, then the embedded node's own child list), and a node keeps its key whichever way a child is listed:
//   - children shared between versions: `shared v` over `shared leaf v` and `shared leaf v + 1`, a new version every
//     10 heights, so each version's first leaf is its predecessor's second;
//   - a child repeated in one child list: `repeat v` references `repeat leaf ⌊v / 2⌋` twice, a new version at heights
//     5, 15, …, so versions 2k and 2k + 1 share that leaf;
//   - embedded children holding references: `embed v` embeds `embed inner v`, which references `embed leaf v 0` and
//     embeds `embed core v`, which references `embed leaf v 1`; then it references `embed leaf v 2`; a new version at
//     heights 8, 18, …;
//   - a stored node written again with a small child in the other form, both ways: `rewrite to-ref` embeds
//     `small to-ref` before {@link TO_REF} and references it from there on (the child then a row of its own);
//     `rewrite to-embedded` references `small to-embedded` before {@link TO_EMBEDDED} and embeds it from there on (the
//     child's row then referenced by no stored child list);
//   - a child a rewrite stops referencing that a new node references at the next block: `requeue` references
//     `requeued` (itself over `requeued leaf`) before {@link REQUEUE} and embeds it from there on, and from
//     REQUEUE + 1 on `requeue holder`, a new child of the root, references it;
//   - a stored node written again unchanged: `again`, over two leaves, in every state, which the test package's
//     memory drops before it builds the state after {@link AGAIN}, so it writes `again` again with the same child
//     list (`sweep-test-loader.ts`).
//   {@link stateKeys} gives a state's node set (its rows and the nodes they embed), the same whichever way a child is
//   listed; {@link contentOf} reads a stored node back (its key from its content, its references, its embedded keys).
//   The tape of the extended DAG carries `rootOf(h, "extended")` as the node's roots. [A105, R27, R28, R30; LG-11,
//   LG-14]
// - `"one-form"`: the extended DAG without its rewrite cases (`rewrite to-ref`, `rewrite to-embedded`, and `requeue`
//   with `requeued`, its leaf and `requeue holder`); every other case as there. Each key is written with one child list
//   throughout, deletions and re-insertions included, which the comparison with the sweep's model needs (the sweep
//   keeps a node's first child list). [R4]

import { createHash } from "node:crypto";

/** The subtrees under each state's root. */
export const WIDTH = 24;
/** The leaves under each subtree. */
export const LEAVES = 4;
/** Subtree 0 changes from version 0 to 1 here … */
export const CHANGE = 8;
/** … and back to version 0 here. */
export const REVERT = 85;
/** The last height of the fixture's chain. */
export const LAST = 100;

/** The extended DAG: `rewrite to-ref` references its small child from this height on (it embedded it before). */
export const TO_REF = 33;
/** The extended DAG: `rewrite to-embedded` embeds its small child from this height on (it referenced it before). */
export const TO_EMBEDDED = 53;
/** The extended DAG: `requeue` embeds `requeued` from this height on; `requeue holder` references it after it. */
export const REQUEUE = 63;
/** The extended DAG: the test package writes `again` again, unchanged, at this height. */
export const AGAIN = 71;

/**
 * Which DAG: the original, which the sweep's tests run; the one extended with the reference-counting cases; or that one
 * without its rewrite cases, every key in one form.
 */
export type FixtureDag = "original" | "extended" | "one-form";

/** A node of the fixture: its key, payload and serialized child list, and its children's keys. */
export interface FixtureNode {
  readonly key: Uint8Array;
  readonly data: Uint8Array;
  readonly children: Uint8Array;
  /**
   * The keys of its by-reference children, through embedded children, in the list's order, a key listed twice given
   * twice: all its children in the original DAG.
   */
  readonly refs: readonly Uint8Array[];
  /** The keys of the nodes its child list embeds, nested ones included, in the list's order (none in the original). */
  readonly embedded?: readonly Uint8Array[];
}

const utf8 = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "utf8"));

function node(data: Uint8Array, refs: readonly Uint8Array[]): FixtureNode {
  const hash = createHash("sha256");
  const length = Buffer.alloc(4);
  length.writeUInt32LE(data.length);
  hash.update(length);
  hash.update(data);
  for (const ref of refs) hash.update(ref);
  if (refs.length >= 64) throw new RangeError("the fixture's child lists stay under 64 children (one compact byte)");
  const children = Uint8Array.from([refs.length << 2, ...refs.flatMap((ref) => [0, ...ref])]);
  return { key: Uint8Array.from(hash.digest()), data, children, refs };
}

/** The version subtree `i` has at height `h`. */
export function versionOf(i: number, h: number): number {
  if (i === 0) return h >= CHANGE && h < REVERT ? 1 : 0;
  return Math.floor((h + 3 * i) / 7);
}

const subtrees = new Map<string, FixtureNode[]>();

/** Subtree `i` at version `v`: the subtree's node first, then its leaves. */
function subtree(i: number, v: number): FixtureNode[] {
  const name = `${i} ${v}`;
  let nodes = subtrees.get(name);
  if (nodes === undefined) {
    const leaves = Array.from({ length: LEAVES }, (_, j) => node(utf8(`leaf ${i} ${v} ${j}`), []));
    nodes = [node(utf8(`subtree ${i} ${v}`), leaves.map((leaf) => leaf.key)), ...leaves];
    subtrees.set(name, nodes);
  }
  return nodes;
}

/** The state after height `h` of `dag`: its root node first, then every node it holds as a row. */
export function stateNodes(h: number, dag: FixtureDag = "original"): FixtureNode[] {
  if (dag !== "original") return extendedStateNodes(h, dag);
  const parts = Array.from({ length: WIDTH }, (_, i) => subtree(i, versionOf(i, h)));
  const root = node(utf8(`state ${h}`), parts.map((part) => (part[0] as FixtureNode).key));
  return [root, ...parts.flat()];
}

/** The root the node reports for the state after `h` (`midnight_ledgerStateRoot`): a reference to its root node. */
export function rootOf(h: number, dag: FixtureDag = "original"): Uint8Array {
  return Uint8Array.from([0, ...(stateNodes(h, dag)[0] as FixtureNode).key]);
}

/** The node set of the state after `h` of `dag`: the keys of its rows and of the nodes they embed, hex, sorted. */
export function stateKeys(h: number, dag: FixtureDag = "original"): string[] {
  const keys = stateNodes(h, dag).flatMap((row) => [row.key, ...(row.embedded ?? [])]);
  return [...new Set(keys.map((key) => Buffer.from(key).toString("hex")))].sort();
}

// ── The extended DAG ───────────────────────────────────────────────────────────────────────────────────────────────

/** A child a node of the extended DAG lists: a node referenced by its key, or embedded in place. */
type Child = { readonly ref: FixtureNode } | { readonly embed: FixtureNode };

/** A SCALE compact integer of a length: one byte under 64, two under 16,384. */
function compact(value: number): number[] {
  if (value < 1 << 6) return [value << 2];
  if (value < 1 << 14) return [((value << 2) | 0b01) & 0xff, value >> 6];
  throw new RangeError("the fixture's lengths stay under 16,384 (two compact bytes)");
}

/** The node `label` over `children`: its key the ledger's hash, an embedded child counted by its own key. */
function nodeOver(label: string, children: readonly Child[]): FixtureNode {
  const data = utf8(label);
  const hash = createHash("sha256");
  const length = Buffer.alloc(4);
  length.writeUInt32LE(data.length);
  hash.update(length);
  hash.update(data);
  const bytes = compact(children.length);
  const refs: Uint8Array[] = [];
  const embedded: Uint8Array[] = [];
  for (const child of children) {
    if ("ref" in child) {
      hash.update(child.ref.key);
      bytes.push(0, ...child.ref.key);
      refs.push(child.ref.key);
    } else {
      const inner = child.embed;
      hash.update(inner.key);
      bytes.push(1, ...compact(inner.data.length), ...inner.data, ...inner.children);
      refs.push(...inner.refs);
      embedded.push(inner.key, ...(inner.embedded ?? []));
    }
  }
  return { key: Uint8Array.from(hash.digest()), data, children: Uint8Array.from(bytes), refs, embedded };
}

const made = new Map<string, FixtureNode>();

/** The node `label` over `children`, made once per `form` (a rewritten node has one per way it lists its child). */
function once(label: string, children: () => readonly Child[], form = ""): FixtureNode {
  const name = `${label}\n${form}`;
  let found = made.get(name);
  if (found === undefined) {
    found = nodeOver(label, children());
    made.set(name, found);
  }
  return found;
}

const leaf = (label: string): FixtureNode => once(label, () => []);

/** The extended DAG's cases at a height: each case's nodes (see the module comment). */
export interface ExtendedCases {
  /** Children shared between versions: `shared v` and its two leaves. */
  readonly shared: { readonly node: FixtureNode; readonly leaves: readonly [FixtureNode, FixtureNode] };
  /** A child repeated in one child list: `repeat v` and the leaf it references twice. */
  readonly repeated: { readonly node: FixtureNode; readonly leaf: FixtureNode };
  /** Embedded children holding references: `embed v`, its two embedded nodes and its three leaves. */
  readonly embedded: {
    readonly node: FixtureNode;
    readonly inner: FixtureNode;
    readonly core: FixtureNode;
    readonly leaves: readonly [FixtureNode, FixtureNode, FixtureNode];
  };
  /** Embedded → referenced at {@link TO_REF}: `rewrite to-ref` in its form at the height, and its small child. */
  readonly toRef: { readonly node: FixtureNode; readonly small: FixtureNode };
  /** Referenced → embedded at {@link TO_EMBEDDED}: `rewrite to-embedded` in its form at the height, and its child. */
  readonly toEmbedded: { readonly node: FixtureNode; readonly small: FixtureNode };
  /** A child a rewrite stops referencing, referenced again by a new node: {@link REQUEUE}'s nodes (no holder before). */
  readonly requeue: {
    readonly node: FixtureNode;
    readonly requeued: FixtureNode;
    readonly leaf: FixtureNode;
    readonly holder: FixtureNode | null;
  };
  /** A stored node written again unchanged at {@link AGAIN}: `again` and its leaves. */
  readonly again: { readonly node: FixtureNode; readonly leaves: readonly [FixtureNode, FixtureNode] };
}

/** The extended DAG's cases at height `h`. */
export function extendedCases(h: number): ExtendedCases {
  const v = Math.floor(h / 10);
  const sharedLeaves = [leaf(`shared leaf ${v}`), leaf(`shared leaf ${v + 1}`)] as const;
  const shared = once(`shared ${v}`, () => sharedLeaves.map((ref) => ({ ref })));
  const r = Math.floor((h + 5) / 10);
  const repeatLeaf = leaf(`repeat leaf ${Math.floor(r / 2)}`);
  const repeated = once(`repeat ${r}`, () => [{ ref: repeatLeaf }, { ref: repeatLeaf }]);
  const e = Math.floor((h + 2) / 10);
  const embedLeaves = [leaf(`embed leaf ${e} 0`), leaf(`embed leaf ${e} 1`), leaf(`embed leaf ${e} 2`)] as const;
  const core = once(`embed core ${e}`, () => [{ ref: embedLeaves[1] }]);
  const inner = once(`embed inner ${e}`, () => [{ ref: embedLeaves[0] }, { embed: core }]);
  const embed = once(`embed ${e}`, () => [{ embed: inner }, { ref: embedLeaves[2] }]);
  const smallToRef = leaf("small to-ref");
  const toRef = h >= TO_REF ? once("rewrite to-ref", () => [{ ref: smallToRef }], "ref") : once("rewrite to-ref", () => [{ embed: smallToRef }], "embed");
  const smallToEmbedded = leaf("small to-embedded");
  const toEmbedded =
    h < TO_EMBEDDED ? once("rewrite to-embedded", () => [{ ref: smallToEmbedded }], "ref") : once("rewrite to-embedded", () => [{ embed: smallToEmbedded }], "embed");
  const requeuedLeaf = leaf("requeued leaf");
  const requeued = once("requeued", () => [{ ref: requeuedLeaf }]);
  const requeue = h < REQUEUE ? once("requeue", () => [{ ref: requeued }], "ref") : once("requeue", () => [{ embed: requeued }], "embed");
  const holder = h > REQUEUE ? once("requeue holder", () => [{ ref: requeued }]) : null;
  const againLeaves = [leaf("again leaf 0"), leaf("again leaf 1")] as const;
  const again = once("again", () => againLeaves.map((ref) => ({ ref })));
  return {
    shared: { node: shared, leaves: sharedLeaves },
    repeated: { node: repeated, leaf: repeatLeaf },
    embedded: { node: embed, inner, core, leaves: embedLeaves },
    toRef: { node: toRef, small: smallToRef },
    toEmbedded: { node: toEmbedded, small: smallToEmbedded },
    requeue: { node: requeue, requeued, leaf: requeuedLeaf, holder },
    again: { node: again, leaves: againLeaves },
  };
}

const extendedStates = new Map<string, FixtureNode[]>();

/**
 * The extended DAG's state after `h` (or the one-form DAG's): its root (the original's subtrees, then the cases'
 * nodes), then its rows.
 */
function extendedStateNodes(h: number, dag: Exclude<FixtureDag, "original">): FixtureNode[] {
  let nodes = extendedStates.get(`${dag} ${h}`);
  if (nodes === undefined) {
    nodes = buildExtendedState(h, dag);
    extendedStates.set(`${dag} ${h}`, nodes);
  }
  return [...nodes];
}

/** {@link extendedStateNodes}, built: the one-form DAG leaves the rewrite cases out of the root. [R4] */
function buildExtendedState(h: number, dag: Exclude<FixtureDag, "original">): FixtureNode[] {
  const parts = Array.from({ length: WIDTH }, (_, i) => subtree(i, versionOf(i, h)));
  const c = extendedCases(h);
  const rewrites = dag === "extended" ? [c.toRef.node, c.toEmbedded.node, c.requeue.node] : [];
  const tops = [c.shared.node, c.repeated.node, c.embedded.node, ...rewrites, c.again.node];
  if (dag === "extended" && c.requeue.holder !== null) tops.push(c.requeue.holder);
  const root = nodeOver(`state ${h}`, [...parts.map((part) => ({ ref: part[0] as FixtureNode })), ...tops.map((top) => ({ ref: top }))]);
  const rows = new Map<string, FixtureNode>();
  const add = (row: FixtureNode): void => {
    rows.set(Buffer.from(row.key).toString("hex"), row);
  };
  add(root);
  for (const row of parts.flat()) add(row);
  for (const top of tops) add(top);
  // Every node a row references is a row: the leaves, and the small children and `requeued` while referenced.
  const byKey = new Map<string, FixtureNode>();
  const everyNode = [...c.shared.leaves, c.repeated.leaf, ...c.embedded.leaves, c.toRef.small, c.toEmbedded.small, c.requeue.requeued, c.requeue.leaf, ...c.again.leaves];
  for (const candidate of everyNode) byKey.set(Buffer.from(candidate.key).toString("hex"), candidate);
  const frontier = [...tops];
  while (frontier.length > 0) {
    const row = frontier.pop() as FixtureNode;
    for (const ref of row.refs) {
      const child = byKey.get(Buffer.from(ref).toString("hex"));
      if (child === undefined) throw new Error(`the extended DAG references ${Buffer.from(ref).toString("hex")}, which it does not make`);
      if (!rows.has(Buffer.from(ref).toString("hex"))) frontier.push(child);
      add(child);
    }
  }
  return [...rows.values()];
}

/** A stored node read back: its key from its content, its by-reference keys and its embedded keys (list order). */
export interface NodeContent {
  readonly key: Uint8Array;
  readonly refs: readonly Uint8Array[];
  readonly embedded: readonly Uint8Array[];
}

/**
 * A node's content read from its payload and serialized child list: its key (the ledger's hash, an embedded child's
 * key computed from its own content), its references through embedded children, and its embedded nodes' keys.
 * Throws for bytes that are no child list.
 */
export function contentOf(data: Uint8Array, children: Uint8Array): NodeContent {
  let at = 0;
  const byte = (): number => {
    const value = children[at];
    if (value === undefined) throw new Error("not a child list: the bytes end");
    at += 1;
    return value;
  };
  const length = (): number => {
    const first = byte();
    if ((first & 0b11) === 0b00) return first >>> 2;
    if ((first & 0b11) === 0b01) return (first | (byte() << 8)) >>> 2;
    throw new Error("not a child list of the fixture: a length of more than two bytes");
  };
  const take = (count: number): Uint8Array => {
    if (at + count > children.length) throw new Error("not a child list: the bytes end");
    at += count;
    return children.slice(at - count, at);
  };
  const refs: Uint8Array[] = [];
  const embedded: Uint8Array[] = [];
  const keyOf = (payload: Uint8Array): Uint8Array => {
    const hash = createHash("sha256");
    const size = Buffer.alloc(4);
    size.writeUInt32LE(payload.length);
    hash.update(size);
    hash.update(payload);
    const count = length();
    for (let i = 0; i < count; i++) {
      const kind = byte();
      if (kind === 0) {
        const ref = take(32);
        refs.push(ref);
        hash.update(ref);
      } else if (kind === 1) {
        const slot = embedded.length;
        embedded.push(new Uint8Array(0));
        const key = keyOf(take(length()));
        embedded[slot] = key;
        hash.update(key);
      } else throw new Error(`not a child list: a child of kind ${kind}`);
    }
    return Uint8Array.from(hash.digest());
  };
  const key = keyOf(data);
  if (at !== children.length) throw new Error("not a child list: bytes are left after it");
  return { key, refs, embedded };
}
