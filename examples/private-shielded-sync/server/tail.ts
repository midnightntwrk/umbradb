/**
 * The tail (spec FR-070, FR-071): what is newer than the snapshot, served in full to every client.
 *
 * With the snapshot at S, `first_free(S)` = F and `T0 = floor(F / 2^k) × 2^k`, the tail at the current committed
 * height H holds: H's height, block hash, `first_free` and root (the core's `zswap_root`); the commitments at
 * positions `T0 … F − 1`; the full record of every output at positions `≥ F`; every nullifier spent above S with its
 * height; and the current root of every tree block from block `T0 / 2^k` on.
 *
 * {@link TailTree} keeps those block roots and the whole root as outputs are appended after each committed height:
 * an incremental tree over the full blocks' roots, and one over the current block's leaves.
 */

import { COMMITMENT_BYTES, encodeTailOutput, TAIL_OUTPUT_BYTES } from "../shared/records.ts";
import { encodeTailHeader, TAIL_HEADER_BYTES } from "../shared/wire.ts";
import { encodeNullifierRecord, NULLIFIER_RECORD_BYTES } from "../pir/buckets.ts";
import { type Hash2, IncrementalTree, type IncrementalTreeState, NODE_BYTES, TREE_DEPTH } from "./tree.ts";
import type { ZswapIndex } from "./zswap-index.ts";

/** The tree from block `T0 / 2^k` on, appended to after each committed height. */
export class TailTree {
  readonly pathSplit: number;
  /** The first position of the tail's first block. */
  readonly t0: number;
  readonly #hash: Hash2;
  readonly #upper: IncrementalTree;
  #block: IncrementalTree;
  /** Roots of the tail's blocks that filled up, in order. */
  readonly #completed: Uint8Array[] = [];
  #next: number;

  private constructor(k: number, hash: Hash2, upper: IncrementalTree, block: IncrementalTree, t0: number) {
    this.pathSplit = k;
    this.#hash = hash;
    this.#upper = upper;
    this.#block = block;
    this.t0 = t0;
    this.#next = t0 + block.size;
  }

  /** From a build's states: the upper tree over the full blocks below T0, and the partial block's leaves. */
  static fromStates(k: number, hash: Hash2, upper: IncrementalTreeState, partial: IncrementalTreeState): TailTree {
    const up = new IncrementalTree(TREE_DEPTH - k, hash, upper);
    const block = new IncrementalTree(k, hash, partial);
    if (block.full) throw new Error("a partial block state that is full");
    return new TailTree(k, hash, up, block, up.size * 2 ** k);
  }

  /**
   * From a snapshot on disk: its block roots (the full blocks' go into the upper tree) and the leaves of its partial
   * block, `leafAt(i)` for positions T0 … F − 1.
   */
  static fromSnapshot(k: number, hash: Hash2, blockRoots: Uint8Array, firstFree: number, leafAt: (i: number) => Uint8Array): TailTree {
    const size = 2 ** k;
    const fullBlocks = Math.floor(firstFree / size);
    if (blockRoots.length !== Math.ceil(firstFree / size) * NODE_BYTES) throw new Error("block roots do not match first_free");
    const upper = new IncrementalTree(TREE_DEPTH - k, hash);
    for (let b = 0; b < fullBlocks; b++) upper.append(blockRoots.slice(b * NODE_BYTES, (b + 1) * NODE_BYTES));
    const block = new IncrementalTree(k, hash);
    const t0 = fullBlocks * size;
    for (let i = t0; i < firstFree; i++) block.append(leafAt(i));
    return new TailTree(k, hash, upper, block, t0);
  }

  /** The next position to append: every position below it is in the tree. */
  get next(): number {
    return this.#next;
  }

  append(leaf: Uint8Array): void {
    this.#block.append(leaf);
    this.#next++;
    if (this.#block.full) {
      const root = this.#block.root();
      this.#completed.push(root);
      this.#upper.append(root);
      this.#block = new IncrementalTree(this.pathSplit, this.#hash);
    }
  }

  /** The current root of every block from T0's on that holds a leaf (32 bytes each). */
  blockRoots(): Uint8Array {
    const partial = this.#block.size > 0 ? [this.#block.root()] : [];
    const roots = [...this.#completed, ...partial];
    const out = new Uint8Array(roots.length * NODE_BYTES);
    roots.forEach((root, i) => out.set(root, i * NODE_BYTES));
    return out;
  }

  /** The whole tree's root now. */
  root(): Uint8Array {
    return this.#upper.root(this.#block.size > 0 ? this.#block.root() : undefined);
  }
}

/** What the tail's header names: the current committed height. */
export interface TailTip {
  readonly height: number;
  readonly blockHash: Uint8Array;
  readonly firstFree: number;
  /** The core's `zswap_root` at the height, 32 bytes little-endian. */
  readonly root: Uint8Array;
}

/**
 * The tail's body (wire layout in `../shared/wire.ts`): for the snapshot `snapshotId` at a first free index of
 * `snapshotFirstFree` and `snapshotNullifiers` nullifiers, from the index and the tail's tree, at `tip`.
 */
export function encodeTail(args: {
  readonly snapshotId: Uint8Array;
  readonly snapshotFirstFree: number;
  readonly snapshotNullifiers: number;
  readonly tip: TailTip;
  readonly index: ZswapIndex;
  readonly tree: TailTree;
}): Uint8Array {
  const { snapshotId, snapshotFirstFree: f, snapshotNullifiers, tip, index, tree } = args;
  if (index.outputs !== tip.firstFree) throw new Error(`the index holds ${index.outputs} outputs, the tip's first_free is ${tip.firstFree}`);
  const outputs = tip.firstFree - f;
  const nullifiers = index.nullifiers - snapshotNullifiers;
  const blockRoots = tree.blockRoots();
  const sections = {
    commitments: (f - tree.t0) * COMMITMENT_BYTES,
    outputs: outputs * TAIL_OUTPUT_BYTES,
    nullifiers: nullifiers * NULLIFIER_RECORD_BYTES,
    blockRoots: blockRoots.length,
  };
  const body = new Uint8Array(TAIL_HEADER_BYTES + sections.commitments + sections.outputs + sections.nullifiers + sections.blockRoots);
  body.set(encodeTailHeader({ snapshotId, height: tip.height, blockHash: tip.blockHash, firstFree: tip.firstFree, root: tip.root, sections }), 0);
  let off = TAIL_HEADER_BYTES;
  for (let i = tree.t0; i < f; i++, off += COMMITMENT_BYTES) body.set(index.commitment(i), off);
  for (let i = f; i < tip.firstFree; i++, off += TAIL_OUTPUT_BYTES) {
    body.set(encodeTailOutput({ commitment: index.commitment(i), ciphertext: index.ciphertext(i) }), off);
  }
  for (let i = snapshotNullifiers; i < index.nullifiers; i++, off += NULLIFIER_RECORD_BYTES) {
    body.set(encodeNullifierRecord(index.nullifier(i)), off);
  }
  body.set(blockRoots, off);
  return body;
}
