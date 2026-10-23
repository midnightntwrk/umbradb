import { createHash } from "node:crypto";

// Task 0.2 of `openspec/changes/core-arch` (design.md §5.1-§5.3): an independent implementation of the ledger's node
// format, written from the upstream sources rather than from the vendored packages, so that the tests of the vendored
// packages have an oracle of their own:
//
// - a node's key is SHA-256 over the payload length as a 4-byte little-endian integer, the payload, and each child's
//   key (`midnight-ledger` `storage-core/src/arena.rs` `hash`);
// - a child is `ArenaKey::Ref(key)` (discriminant 0, then the 32-byte key) or `ArenaKey::Direct(node)` (discriminant 1,
//   then the embedded node's payload as `Vec<u8>` and its own children as `Vec<ArenaKey>`), and an embedded child's key
//   is its node's key (`arena.rs` `ArenaKey`, `DirectChildNode`);
// - a `Vec<T>` is its length as a SCALE-compact integer followed by the items, `u32` and `u64` are SCALE-compact
//   integers, `u8` is one byte (`serialize/src/serializable.rs`, `serialize/src/util.rs`);
// - a tagged serialization is `midnight:<tag>:` followed by the value; a stored value serializes as `TopoSortedNodes`,
//   a `Vec` of nodes `{ child_indices: Vec<u64>, data: Vec<u8> }` whose children precede them, the root last
//   (`arena.rs` `TopoSortedNodes`).

export type Child = { ref: Uint8Array } | { direct: { data: Uint8Array; children: Child[] } };

export const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/**
 * Frees a ledger object's WebAssembly memory now. wasm-bindgen gives every exported class `free()`; the packages'
 * hand-written declarations leave it out.
 */
export function free(object: object): void {
  (object as { free(): void }).free();
}

class Reader {
  private offset = 0;
  constructor(private readonly bytes: Uint8Array) {}

  get done(): boolean {
    return this.offset === this.bytes.length;
  }

  u8(): number {
    if (this.offset >= this.bytes.length) throw new Error("unexpected end of input");
    return this.bytes[this.offset++]!;
  }

  take(length: number): Uint8Array {
    if (this.offset + length > this.bytes.length) throw new Error("unexpected end of input");
    const out = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return out;
  }

  scale(): bigint {
    const first = this.u8();
    switch (first & 0b11) {
      case 0b00:
        return BigInt(first >> 2);
      case 0b01:
        return BigInt((first | (this.u8() << 8)) >> 2);
      case 0b10: {
        const rest = this.take(3);
        return BigInt((first | (rest[0]! << 8) | (rest[1]! << 16) | (rest[2]! << 24)) >>> 2);
      }
      default: {
        const bytes = this.take((first >> 2) + 4);
        let value = 0n;
        for (let i = bytes.length - 1; i >= 0; i--) value = (value << 8n) | BigInt(bytes[i]!);
        return value;
      }
    }
  }

  length(): number {
    const n = this.scale();
    if (n > BigInt(this.bytes.length)) throw new Error(`implausible length ${n}`);
    return Number(n);
  }

  vecU8(): Uint8Array {
    return this.take(this.length());
  }
}

function readChild(reader: Reader): Child {
  const discriminant = reader.u8();
  if (discriminant === 0) return { ref: reader.take(32) };
  if (discriminant === 1) {
    const data = reader.vecU8();
    return { direct: { data, children: readChildList(reader) } };
  }
  throw new Error(`unknown child discriminant ${discriminant}`);
}

function readChildList(reader: Reader): Child[] {
  const count = reader.length();
  const children: Child[] = [];
  for (let i = 0; i < count; i++) children.push(readChild(reader));
  return children;
}

/** Decodes a serialized child list (`Vec<ArenaKey>`), refusing trailing bytes. */
export function decodeChildren(bytes: Uint8Array): Child[] {
  const reader = new Reader(bytes);
  const children = readChildList(reader);
  if (!reader.done) throw new Error("bytes left after the child list");
  return children;
}

/** Decodes one serialized `ArenaKey` (a state root as the node reports it), refusing trailing bytes. */
export function decodeChild(bytes: Uint8Array): Child {
  const reader = new Reader(bytes);
  const child = readChild(reader);
  if (!reader.done) throw new Error("bytes left after the key");
  return child;
}

function scale(value: number): Uint8Array {
  if (value < 1 << 6) return Uint8Array.of(value << 2);
  if (value < 1 << 14) return Uint8Array.of(((value << 2) | 0b01) & 0xff, value >> 6);
  if (value < 1 << 30) {
    const v = (value << 2) | 0b10;
    return Uint8Array.of(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
  }
  throw new Error("lengths of 2^30 or more are not needed here");
}

function concat(parts: Uint8Array[]): Uint8Array {
  return Uint8Array.from(Buffer.concat(parts));
}

function encodeChild(child: Child): Uint8Array {
  if ("ref" in child) return concat([Uint8Array.of(0), child.ref]);
  const { data, children } = child.direct;
  return concat([Uint8Array.of(1), scale(data.length), data, encodeChildren(children)]);
}

/** Serializes a child list (`Vec<ArenaKey>`). */
export function encodeChildren(children: Child[]): Uint8Array {
  return concat([scale(children.length), ...children.map(encodeChild)]);
}

/** A node's key: SHA-256 of the payload length (u32, little-endian), the payload, and the children's keys. */
export function nodeKey(data: Uint8Array, childKeys: Uint8Array[]): Uint8Array {
  const hash = createHash("sha256");
  const length = Buffer.alloc(4);
  length.writeUInt32LE(data.length);
  hash.update(length);
  hash.update(data);
  for (const key of childKeys) hash.update(key);
  return Uint8Array.from(hash.digest());
}

/** A child's key: the referenced key, or the embedded node's key. */
export function childKey(child: Child): Uint8Array {
  if ("ref" in child) return child.ref;
  return nodeKey(child.direct.data, child.direct.children.map(childKey));
}

/** The key of a stored node given its payload and serialized child list. */
export function storedNodeKey(data: Uint8Array, children: Uint8Array): Uint8Array {
  return nodeKey(data, decodeChildren(children).map(childKey));
}

/** The by-reference keys in a child list, through embedded children. */
export function refsOf(children: Child[]): Uint8Array[] {
  return children.flatMap((child) => ("ref" in child ? [child.ref] : refsOf(child.direct.children)));
}

/** Whether a child list embeds at least one child. */
export function hasEmbeddedChild(children: Child[]): boolean {
  return children.some((child) => "direct" in child);
}

/** Splits a tagged serialization into its tag and its value. */
export function untag(serialized: Uint8Array): { tag: string; value: Uint8Array } {
  const text = Buffer.from(serialized.subarray(0, Math.min(serialized.length, 512))).toString("latin1");
  if (!text.startsWith("midnight:")) throw new Error("not a tagged serialization");
  const end = text.indexOf(":", "midnight:".length);
  if (end < 0) throw new Error("unterminated tag");
  return { tag: text.slice("midnight:".length, end), value: serialized.subarray(end + 1) };
}

/** The key of the root of a stored value's tagged serialization (`TopoSortedNodes`). */
export function taggedRootKey(serialized: Uint8Array): { tag: string; key: Uint8Array } {
  const { tag, value } = untag(serialized);
  const reader = new Reader(value);
  const count = reader.length();
  const keys: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    const childIndices: number[] = [];
    const childCount = reader.length();
    for (let j = 0; j < childCount; j++) childIndices.push(Number(reader.scale()));
    const data = reader.vecU8();
    keys.push(
      nodeKey(
        data,
        childIndices.map((index) => {
          if (index >= keys.length) throw new Error(`child index ${index} does not precede node ${i}`);
          return keys[index]!;
        }),
      ),
    );
  }
  if (!reader.done) throw new Error("bytes left after the nodes");
  const key = keys.at(-1);
  if (!key) throw new Error("no nodes");
  return { tag, key };
}
