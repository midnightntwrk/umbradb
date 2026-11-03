import { Worker } from "node:worker_threads";
import { nodeKey } from "../../src/ledger/node-key.js";
import type { StoredNode } from "./fresh-instance.js";
import { type Child, decodeChildren, encodeChildren, hex } from "./node-format.js";

// The key the ledger package gives a node embedded in a stored node, asked of the package itself. A package reading a
// node from its node store hashes the node's payload and its children's keys and refuses the node (it panics, which
// aborts the module) unless that hash is the key it asked for (`vendor/ledger/*/patches/0001-…` `get_from_node_source`,
// the check LG-11 makes on every read). So stored nodes are given to the package with every embedded child moved out
// into a node of its own, stored under the key `src/ledger/node-key.ts` gives it, and referenced by that key: the
// package then reads each embedded node by that key and accepts it only if its own hash of the node is that key, and it
// accepts the parent only if its hash over the parent's children's keys — that key among them — is the parent's key.
// A node's key does not depend on how its children are kept, so the store answers every read of the value
// (`./stored-values.ts` `nodesOfTagged` serves values the same way). The structure is read with the independent format
// (`./node-format.ts`); only the keys come from `node-key.ts`, each embedded node's from its payload and its children
// by reference (innermost first), so each node is hashed once per place it is embedded. [R29, LG-11]

/** Stored nodes with every embedded child moved out into a node of its own (see the module comment). */
export interface ByReference {
  /** The stored nodes and every node they embed, each once, each with all its children by reference. */
  readonly nodes: StoredNode[];
  /** The keys, as hex, `node-key.ts` gives the embedded nodes, each once. */
  readonly embedded: ReadonlySet<string>;
  /** How many embedded nodes the stored nodes hold, counted once per place they are embedded. */
  readonly occurrences: number;
}

/** A node's key as the store is built with it: `node-key.ts`'s by default, another for a negative control. */
export type KeyOf = (data: Uint8Array, children: Uint8Array) => Uint8Array;

/** `stored`, every embedded child moved out under the key `keyOf` gives it (see the module comment). */
export function byReference(stored: Iterable<StoredNode>, keyOf: KeyOf = nodeKey): ByReference {
  const nodes = new Map<string, StoredNode>();
  const embedded = new Set<string>();
  let occurrences = 0;
  const refer = (children: readonly Child[]): Child[] =>
    children.map((child): Child => {
      if ("ref" in child) return child;
      const { data, children: inner } = child.direct;
      const referred = encodeChildren(refer(inner));
      const key = keyOf(data, referred);
      const id = hex(key);
      occurrences += 1;
      embedded.add(id);
      if (!nodes.has(id)) nodes.set(id, { key, data, children: referred });
      return { ref: key };
    });
  for (const node of stored) {
    nodes.set(hex(node.key), { key: node.key, data: node.data, children: encodeChildren(refer(decodeChildren(node.children))) });
  }
  return { nodes: [...nodes.values()], embedded, occurrences };
}

/** A {@link KeyOf} that gives `node-key.ts`'s keys but one: `wrong`'s, with its first byte flipped. */
export function oneWrongKey(wrong: string): KeyOf {
  return (data, children) => {
    const key = Uint8Array.from(nodeKey(data, children));
    if (hex(key) === wrong) key[0] = key[0]! ^ 0xff;
    return key;
  };
}

/** What a walk ({@link walkInFreshInstance}) did. */
export interface Walk {
  /** How many of the states it loaded and serialized. */
  readonly walked: number;
  /** Every key the package asked the store for, as hex, each once. */
  readonly requested: string[];
  /** The last key it asked for: on a refusal, the node it refused. */
  readonly last: string | null;
  /** Why the walk stopped early (the module aborts on a refused node); none when it walked every state. */
  readonly error?: string;
}

/**
 * Loads the states whose keys `keys` lists, in order, in a fresh instance of the package at `packagePath`, from a store
 * serving `nodes`, and serializes each (`fixtures/package-keys-walk.mjs`): the package reads, and checks against its
 * key, every node of each state it does not hold already.
 */
export function walkInFreshInstance(request: { packagePath: string; keys: Uint8Array[]; nodes: StoredNode[] }): Promise<Walk> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./fixtures/package-keys-walk.mjs", import.meta.url), { workerData: request });
    let settled = false;
    worker.once("message", (message: Walk) => {
      settled = true;
      resolve(message);
      void worker.terminate();
    });
    worker.once("error", (error) => {
      if (!settled) reject(error);
    });
    worker.once("exit", (code) => {
      if (!settled) reject(new Error(`the worker exited with code ${code} before answering`));
    });
  });
}
