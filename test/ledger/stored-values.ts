import { type Child, childKey, decodeChildren, encodeChildren, hex, nodeKey, untag } from "./node-format.js";

// Task 12.4 of `openspec/changes/core-arch` (LG-11, LG-13; A100, A104): a stored value's nodes and its tagged
// serialization, each made from the other without the vendored packages, written from the upstream sources — the
// independent route by which the tests take a value out of `core_ledger_state.nodes` and put one in.
//
// - A tagged serialization of a stored value is `midnight:<tag>:` and its `TopoSortedNodes` (`./node-format.ts`); the
//   package deserializes it only in the arena's normal form (`midnight-ledger` `storage-core/src/arena.rs`
//   `serialize_to_node_list_bounded`, "deserialized storage graph not in normal form"): the nodes walked from the root
//   with a stack, each child counted once per parent that lists it; then Kahn's algorithm with a stack from the root,
//   a child taken once its count reaches 0; then the list reversed, so that children precede their parents and the root
//   is last. {@link rebuildTagged} follows it, reading the nodes as the database stores them (by-reference children
//   from the table, embedded ones from their parent's child list).
// - {@link nodesOfTagged} goes the other way: every node of a serialization as a stored node whose children are all
//   by reference — the key does not depend on how a child is kept (a node's key hashes its children's keys), so a
//   store serving these answers every read of the value.

/** A node as `core_ledger_state.nodes` holds it. */
export interface TableNode {
  readonly key: Uint8Array;
  readonly data: Uint8Array;
  readonly children: Uint8Array;
}

/** A SCALE compact integer (below 2^30, which every count and index here is). */
function compact(value: number): number[] {
  if (value < 1 << 6) return [value << 2];
  if (value < 1 << 14) return [((value << 2) | 0b01) & 0xff, value >> 6];
  if (value < 1 << 30) {
    const v = (value << 2) | 0b10;
    return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
  }
  throw new RangeError(`${value} is beyond the compact integers these tests write`);
}

/** A reader of SCALE compact integers and bytes. */
class Reader {
  #at = 0;
  constructor(private readonly bytes: Uint8Array) {}
  get done(): boolean {
    return this.#at === this.bytes.length;
  }
  byte(): number {
    const value = this.bytes[this.#at];
    if (value === undefined) throw new Error("the bytes end");
    this.#at += 1;
    return value;
  }
  compact(): number {
    const first = this.byte();
    switch (first & 0b11) {
      case 0b00:
        return first >>> 2;
      case 0b01:
        return (first | (this.byte() << 8)) >>> 2;
      case 0b10:
        return (first | (this.byte() << 8) | (this.byte() << 16) | (this.byte() << 24)) >>> 2;
      default:
        throw new Error("a compact integer of 2^30 or more");
    }
  }
  take(length: number): Uint8Array {
    if (this.#at + length > this.bytes.length) throw new Error(`${length} bytes are announced`);
    const out = this.bytes.slice(this.#at, this.#at + length);
    this.#at += length;
    return out;
  }
}

/** Every node of the tagged serialization `serialized`, its children by reference (see the module comment). */
export function nodesOfTagged(serialized: Uint8Array): { readonly tag: string; readonly root: Uint8Array; readonly nodes: TableNode[] } {
  const { tag, value } = untag(serialized);
  const reader = new Reader(value);
  const count = reader.compact();
  const keys: Uint8Array[] = [];
  const nodes: TableNode[] = [];
  for (let i = 0; i < count; i++) {
    const indices: number[] = [];
    const children = reader.compact();
    for (let j = 0; j < children; j++) indices.push(reader.compact());
    const data = reader.take(reader.compact());
    const childKeys = indices.map((index) => {
      const key = keys[index];
      if (key === undefined) throw new Error(`child index ${index} does not precede node ${i}`);
      return key;
    });
    const key = nodeKey(data, childKeys);
    keys.push(key);
    nodes.push({ key, data, children: encodeChildren(childKeys.map((ref) => ({ ref }))) });
  }
  if (!reader.done) throw new Error("bytes left after the nodes");
  const root = keys.at(-1);
  if (root === undefined) throw new Error("no nodes");
  return { tag, root, nodes };
}

/** A node read for {@link rebuildTagged}: its payload and its children. */
interface Readable {
  readonly data: Uint8Array;
  readonly children: readonly Child[];
}

/**
 * The tagged serialization, under `tag`, of the value whose root node is `key`, rebuilt in the arena's normal form from
 * the stored nodes `stored` gives (see the module comment); throws naming the first node it lacks.
 */
export function rebuildTagged(tag: string, key: Uint8Array, stored: (key: string) => { data: Uint8Array; children: Uint8Array } | undefined): Uint8Array {
  const read = (k: string): Readable => {
    const node = stored(k);
    if (node === undefined) throw new Error(`node ${k} is not stored`);
    return { data: node.data, children: decodeChildren(node.children) };
  };
  const rootKey = hex(key);
  const objects = new Map<string, Readable>();
  const incoming = new Map<string, number>();
  const frontier: { readonly key: string; readonly node: () => Readable }[] = [{ key: rootKey, node: () => read(rootKey) }];
  while (frontier.length > 0) {
    const { key: k, node } = frontier.pop() as (typeof frontier)[number];
    if (objects.has(k)) continue;
    const object = node();
    for (const child of object.children) {
      const childHex = hex(childKey(child));
      incoming.set(childHex, (incoming.get(childHex) ?? 0) + 1);
      frontier.push({ key: childHex, node: "ref" in child ? () => read(childHex) : () => child.direct });
    }
    objects.set(k, object);
  }
  const index = new Map<string, number>();
  const empty = [rootKey];
  while (empty.length > 0) {
    const k = empty.pop() as string;
    if (index.has(k)) continue;
    index.set(k, index.size);
    for (const child of (objects.get(k) as Readable).children) {
      const childHex = hex(childKey(child));
      const left = (incoming.get(childHex) as number) - 1;
      incoming.set(childHex, left);
      if (left === 0) empty.push(childHex);
    }
  }
  const length = index.size;
  const list = new Array<Readable>(length);
  for (const [k, i] of index) list[length - 1 - i] = objects.get(k) as Readable;
  const out: number[] = [...Buffer.from(`midnight:${tag}:`, "latin1"), ...compact(length)];
  for (const node of list) {
    out.push(...compact(node.children.length));
    for (const child of node.children) out.push(...compact(length - 1 - (index.get(hex(childKey(child))) as number)));
    out.push(...compact(node.data.length), ...node.data);
  }
  return Uint8Array.from(out);
}
