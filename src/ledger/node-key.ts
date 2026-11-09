/**
 * A ledger node's key, computed on the main thread without the ledger package, as the package computes it: SHA-256 over
 * the payload's length as a 4-byte little-endian integer, the payload, and each child's key in the child list's order
 * (`midnight-ledger` `storage-core/src/arena.rs` `hash`). A child by reference has the key it holds; an embedded child's
 * key is its own node's, computed the same way from its payload and its children (`arena.rs` `DirectChildNode::new`), so
 * a node's key is the same whichever of its children are embedded. The child list is read by `./node-refs.ts`.
 *
 * {@link nodeKeys} gives a stored node's key and the keys of the nodes its child list embeds, which are nodes the
 * database holds as much as its rows are; {@link nodeKey} gives the key alone. A child list that is not one refuses as
 * `./node-refs.ts` refuses it.
 */

import { createHash } from "node:crypto";
import { readChildList } from "./node-refs.js";

/** A node's key from its payload and its children's keys (see the module comment). */
function hashNode(data: Uint8Array, childKeys: readonly Uint8Array[]): Uint8Array {
  const length = new Uint8Array(4);
  new DataView(length.buffer).setUint32(0, data.length, true);
  const hash = createHash("sha256").update(length).update(data);
  for (const key of childKeys) hash.update(key);
  return Uint8Array.from(hash.digest());
}

/** A stored node's key and the keys of the nodes it embeds. */
export interface NodeKeys {
  readonly key: Uint8Array;
  /** The key of every node its child list embeds, at any depth, each after the nodes it embeds itself: once per place. */
  readonly embedded: readonly Uint8Array[];
}

/** The key of the node with payload `data` and serialized child list `children`, and of each node it embeds. */
export function nodeKeys(data: Uint8Array, children: Uint8Array): NodeKeys {
  const embedded: Uint8Array[] = [];
  const childKeys = readChildList(children, {
    ref: (key) => key,
    embedded: (payload, keys) => {
      const key = hashNode(payload, keys);
      embedded.push(key);
      return key;
    },
  });
  return { key: hashNode(data, childKeys), embedded };
}

/** The key of the node with payload `data` and serialized child list `children`. */
export function nodeKey(data: Uint8Array, children: Uint8Array): Uint8Array {
  return nodeKeys(data, children).key;
}
