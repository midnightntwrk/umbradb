/**
 * Sets and maps of ledger node keys sized for a whole chain's ledger state. A JavaScript `Set` or `Map` holds at most
 * 2^24 entries (V8 refuses the next with `RangeError: Set maximum size exceeded`), and a Preprod ledger state at height
 * 3.5 million already gives more node keys than that, so {@link KeySet} and {@link KeyMap} spread their keys over 256
 * shards by the key's first byte: up to 2^32 keys, which node keys (hashes) fill evenly.
 *
 * A key is held as a {@link NodeKey}: its bytes as a `latin1` string, one character per byte, half the memory of hex.
 * Strings compare by their UTF-16 code units, which here are the bytes, so `<` and the default sort are byte order;
 * iterating the shards in order, each one sorted, gives every key in byte order without sorting them all at once.
 */

/** A node key's bytes as a `latin1` string (one character per byte); `<` on two of them is their byte order. */
export type NodeKey = string;

/** The {@link NodeKey} of `bytes`, without copying them. */
export function nodeKeyOf(bytes: Uint8Array): NodeKey {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("latin1");
}

/** `key` in lowercase hex, as messages name it. */
export function hexOfKey(key: NodeKey): string {
  return Buffer.from(key, "latin1").toString("hex");
}

/** `key`'s bytes, a new array. */
export function bytesOfKey(key: NodeKey): Uint8Array {
  return Uint8Array.from(Buffer.from(key, "latin1"));
}

/** The number of shards: one per value of a key's first byte. */
const SHARDS = 256;

/** The shard of `key`: its first byte (the empty key goes with byte 0, before every other key of that shard). */
const shardOf = (key: NodeKey): number => (key.length === 0 ? 0 : key.charCodeAt(0));

/** A set of node keys with no limit below 2^32 on its size; {@link KeySet.sorted} gives them in byte order. */
export class KeySet {
  readonly #shards: Set<NodeKey>[] = Array.from({ length: SHARDS }, () => new Set<NodeKey>());
  #size = 0;

  get size(): number {
    return this.#size;
  }

  add(key: NodeKey): void {
    const shard = this.#shards[shardOf(key)] as Set<NodeKey>;
    const before = shard.size;
    shard.add(key);
    this.#size += shard.size - before;
  }

  has(key: NodeKey): boolean {
    return (this.#shards[shardOf(key)] as Set<NodeKey>).has(key);
  }

  /** Every key, in no particular order. */
  *keys(): IterableIterator<NodeKey> {
    for (const shard of this.#shards) yield* shard;
  }

  /** Every key in byte order: the shards in order, each sorted on its own. */
  *sorted(): IterableIterator<NodeKey> {
    for (const shard of this.#shards) yield* [...shard].sort();
  }
}

/** A map from node keys to `V` with no limit below 2^32 on its size. */
export class KeyMap<V> {
  readonly #shards: Map<NodeKey, V>[] = Array.from({ length: SHARDS }, () => new Map<NodeKey, V>());

  get(key: NodeKey): V | undefined {
    return (this.#shards[shardOf(key)] as Map<NodeKey, V>).get(key);
  }

  set(key: NodeKey, value: V): void {
    (this.#shards[shardOf(key)] as Map<NodeKey, V>).set(key, value);
  }

  has(key: NodeKey): boolean {
    return (this.#shards[shardOf(key)] as Map<NodeKey, V>).has(key);
  }

  /** Every key, in no particular order. */
  *keys(): IterableIterator<NodeKey> {
    for (const shard of this.#shards) yield* shard.keys();
  }
}
