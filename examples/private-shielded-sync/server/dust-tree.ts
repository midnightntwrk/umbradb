/**
 * The Dust commitment tree (spec 00062 phase 9), built from the commitments by position with the Zswap tree's code
 * (`./tree.ts`): the same height (32), the same leaf (the scan kernel's `leaf` of the commitment's 32 little-endian
 * bytes) and the same node hash and empty-subtree rule, checked on Preprod against the core's `dust_commitment_root`.
 *
 * It adds what a spend of any coin needs and the snapshot's tree does not give: the lower path of every position, the
 * last (partial) block's too, since a Dust snapshot has no tail.
 */

import { buildTree, type BuiltTree, type Hash2, NODE_BYTES, ZERO_NODE } from "./tree.ts";

export interface DustTree {
  readonly tree: BuiltTree;
  /** The k lower siblings of every position, leaf upward: `leaves × k × 32` bytes. */
  readonly paths: Uint8Array;
}

/** The levels of a block's leaves under the ledger's rules: an absent node is 0 and a node with one absent child is hashed with 0. */
function partialLevels(leaves: readonly Uint8Array[], k: number, hash: Hash2): Uint8Array[][] {
  const levels: Uint8Array[][] = [leaves.slice()];
  for (let h = 0; h < k; h++) {
    const below = levels[h]!;
    const next: Uint8Array[] = [];
    for (let j = 0; 2 * j < below.length; j++) next.push(hash(below[2 * j]!, below[2 * j + 1] ?? ZERO_NODE));
    levels.push(next);
  }
  return levels;
}

/** The tree of `n` leaves cut at k, and every position's lower path. */
export function dustTree(n: number, k: number, leafAt: (i: number) => Uint8Array, hash: Hash2): DustTree {
  const tree = buildTree(n, k, leafAt, hash);
  const paths = new Uint8Array(n * k * NODE_BYTES);
  paths.set(tree.paths);
  if (tree.fullLeaves < n && k > 0) {
    const leaves = Array.from({ length: n - tree.fullLeaves }, (_, j) => leafAt(tree.fullLeaves + j));
    const levels = partialLevels(leaves, k, hash);
    const root = levels[k]![0]!;
    const stored = tree.blockRoots.subarray((tree.blocks - 1) * NODE_BYTES, tree.blocks * NODE_BYTES);
    if (!root.every((b, i) => b === stored[i])) throw new Error("the partial block's levels do not give its root");
    for (let j = 0; j < leaves.length; j++) {
      const at = (tree.fullLeaves + j) * k * NODE_BYTES;
      for (let h = 0; h < k; h++) paths.set(levels[h]![(j >>> h) ^ 1] ?? ZERO_NODE, at + h * NODE_BYTES);
    }
  }
  return { tree, paths };
}
