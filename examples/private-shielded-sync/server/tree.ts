/**
 * The Zswap commitment tree, as the ledger computes it (spec §2.2, FR-040–043), cut into blocks of 2^k leaves.
 *
 * - Height 32; output i of the chain is leaf i.
 * - A leaf's value is `degrade_to_transient(commitment)` (the kernel's `leaf`): the field element whose little-endian
 *   bytes are the commitment's bytes 0 … 30.
 * - An inner node is Poseidon of its two children (the kernel's `hash2`). A subtree that holds no leaf is 0 at every
 *   height and is never hashed; a node with one empty child is hashed with 0 in its place.
 * - Every value is a field element as 32 bytes, little-endian.
 *
 * The ledger stores a tree's root (`core_ledger_state.states.zswap_root`) in its untagged serialization: a
 * `ScaleBigInt` of the element's little-endian bytes ({@link rootFromStored}).
 */

import { decodeScaleBigInt } from "../kernel/secret-key.ts";

/** Height of the Zswap commitment tree. */
export const TREE_DEPTH = 32;
/** Bytes of a field element, a node, a leaf. */
export const NODE_BYTES = 32;
/** The value of an empty subtree, and of an empty child. */
export const ZERO_NODE: Uint8Array = new Uint8Array(NODE_BYTES);

/** Poseidon of two field elements, 32 bytes little-endian each. */
export type Hash2 = (left: Uint8Array, right: Uint8Array) => Uint8Array;

/** The largest tree cut the server accepts: a full block's levels take 2^(k+1) × 32 bytes (64 MiB at k = 20). */
export const MAX_PATH_SPLIT = 20;

/** A tree's root as 32 little-endian bytes, from the ledger's untagged serialization (`ScaleBigInt`). */
export function rootFromStored(stored: Uint8Array): Uint8Array {
  const { value, consumed } = decodeScaleBigInt(stored);
  if (consumed !== stored.length) throw new Error(`a stored root has ${stored.length - consumed} trailing bytes`);
  if (value.length > NODE_BYTES) throw new Error(`a stored root has ${value.length} value bytes`);
  const out = new Uint8Array(NODE_BYTES);
  out.set(value);
  return out;
}

/** Counts the hashes made through it. */
export function countingHash(hash: Hash2): { readonly hash: Hash2; count(): number } {
  let count = 0;
  return {
    hash: (left, right) => {
      count++;
      return hash(left, right);
    },
    count: () => count,
  };
}

/** The serializable state of an {@link IncrementalTree}. */
export interface IncrementalTreeState {
  readonly depth: number;
  readonly size: number;
  /** `depth + 1` nodes of 32 bytes; a slot never set is zero. */
  readonly branch: Uint8Array;
}

/**
 * An append-only tree of fixed depth with the ledger's rules, holding one node per level (the left frontier): an
 * append costs one hash on average, a root `depth` hashes at most.
 *
 * `branch[l]`, for every bit l set in `size`, is the complete subtree of 2^l leaves just left of the first free
 * position at level l; `branch[depth]` is the root once the tree is full.
 */
export class IncrementalTree {
  readonly depth: number;
  readonly #hash: Hash2;
  readonly #branch: Uint8Array[];
  #size: number;

  constructor(depth: number, hash: Hash2, state?: IncrementalTreeState) {
    if (!Number.isInteger(depth) || depth < 0 || depth > TREE_DEPTH) throw new Error(`tree depth out of range: ${depth}`);
    this.depth = depth;
    this.#hash = hash;
    this.#branch = Array.from({ length: depth + 1 }, () => ZERO_NODE);
    this.#size = 0;
    if (state !== undefined) {
      if (state.depth !== depth) throw new Error(`a tree state of depth ${state.depth}, not ${depth}`);
      if (state.branch.length !== (depth + 1) * NODE_BYTES) throw new Error("a tree state's branch has the wrong length");
      if (!Number.isSafeInteger(state.size) || state.size < 0 || state.size > 2 ** depth) throw new Error("a tree state's size is out of range");
      for (let l = 0; l <= depth; l++) this.#branch[l] = state.branch.slice(l * NODE_BYTES, (l + 1) * NODE_BYTES);
      this.#size = state.size;
    }
  }

  /** How many leaves it holds. */
  get size(): number {
    return this.#size;
  }

  /** Whether it holds 2^depth leaves. */
  get full(): boolean {
    return this.#size === 2 ** this.depth;
  }

  /** Appends a leaf at the first free position. */
  append(leaf: Uint8Array): void {
    if (this.full) throw new Error(`the tree of depth ${this.depth} is full`);
    this.#size++;
    let node = leaf;
    let s = this.#size;
    for (let l = 0; l <= this.depth; l++) {
      if (s % 2 === 1) {
        this.#branch[l] = node;
        return;
      }
      node = this.#hash(this.#branch[l]!, node);
      s = Math.floor(s / 2);
    }
  }

  /**
   * The root of the leaves it holds, or, with `extra`, of those leaves and `extra` as one more leaf at the first free
   * position (not appended). An empty tree's root is 0.
   */
  root(extra?: Uint8Array): Uint8Array {
    if (this.full) {
      if (extra !== undefined) throw new Error("no position is free for an extra leaf");
      return this.#branch[this.depth]!;
    }
    let node: Uint8Array | null = extra ?? null;
    let s = this.#size;
    for (let l = 0; l < this.depth; l++) {
      if (s % 2 === 1) node = this.#hash(this.#branch[l]!, node ?? ZERO_NODE);
      else if (node !== null) node = this.#hash(node, ZERO_NODE);
      s = Math.floor(s / 2);
    }
    return node ?? ZERO_NODE;
  }

  state(): IncrementalTreeState {
    const branch = new Uint8Array((this.depth + 1) * NODE_BYTES);
    this.#branch.forEach((node, l) => branch.set(node, l * NODE_BYTES));
    return { depth: this.depth, size: this.#size, branch };
  }
}

/**
 * The levels of one full block of 2^k leaves (`leaves`, 2^k × 32 bytes): level 0 is the leaves, level k the block's
 * root (one node). 2^k − 1 hashes.
 */
export function blockLevels(leaves: Uint8Array, k: number, hash: Hash2): Uint8Array[] {
  if (leaves.length !== 2 ** k * NODE_BYTES) throw new Error(`a full block of depth ${k} has ${2 ** k} leaves`);
  const levels: Uint8Array[] = [leaves];
  for (let l = 1; l <= k; l++) {
    const below = levels[l - 1]!;
    const count = below.length / NODE_BYTES / 2;
    const level = new Uint8Array(count * NODE_BYTES);
    for (let j = 0; j < count; j++) {
      const left = below.subarray(2 * j * NODE_BYTES, (2 * j + 1) * NODE_BYTES);
      const right = below.subarray((2 * j + 1) * NODE_BYTES, (2 * j + 2) * NODE_BYTES);
      level.set(hash(left, right), j * NODE_BYTES);
    }
    levels.push(level);
  }
  return levels;
}

/** Writes the k lower siblings of leaf `i` of a full block (leaf upward) into `out` at `offset`. */
export function writeLowerPath(levels: readonly Uint8Array[], i: number, out: Uint8Array, offset: number): void {
  const k = levels.length - 1;
  for (let l = 0; l < k; l++) {
    const sibling = (i >>> l) ^ 1;
    out.set(levels[l]!.subarray(sibling * NODE_BYTES, (sibling + 1) * NODE_BYTES), offset + l * NODE_BYTES);
  }
}

/** What {@link buildTree} computes for `n` leaves cut at k. */
export interface BuiltTree {
  readonly pathSplit: number;
  readonly leaves: number;
  /** One root per block that holds a leaf, in block order (FR-042): `blocks × 32` bytes. */
  readonly blockRoots: Uint8Array;
  readonly blocks: number;
  /** Leaves in full blocks: those with a lower path (FR-043). */
  readonly fullLeaves: number;
  /** The k lower siblings of each leaf in a full block, leaf upward: `fullLeaves × k × 32` bytes. */
  readonly paths: Uint8Array;
  /** The whole tree's root (32 bytes LE). */
  readonly root: Uint8Array;
  /** The upper tree over the full blocks' roots, and the partial block's leaves: where the tail starts (FR-070). */
  readonly upper: IncrementalTreeState;
  readonly partial: IncrementalTreeState;
}

/**
 * The tree of `n` leaves (`leafAt(i)` gives leaf i's value) cut at `k` levels above the leaves: every block's root,
 * the lower path of every leaf in a full block, and the whole root (FR-041–043).
 */
export function buildTree(n: number, k: number, leafAt: (i: number) => Uint8Array, hash: Hash2): BuiltTree {
  if (!Number.isInteger(k) || k < 0 || k > MAX_PATH_SPLIT) throw new Error(`path split out of range: ${k}`);
  const blockSize = 2 ** k;
  const fullBlocks = Math.floor(n / blockSize);
  const fullLeaves = fullBlocks * blockSize;
  const partialLeaves = n - fullLeaves;
  const blocks = fullBlocks + (partialLeaves > 0 ? 1 : 0);
  const blockRoots = new Uint8Array(blocks * NODE_BYTES);
  const paths = new Uint8Array(fullLeaves * k * NODE_BYTES);
  const upper = new IncrementalTree(TREE_DEPTH - k, hash);
  const leaves = new Uint8Array(blockSize * NODE_BYTES);
  for (let b = 0; b < fullBlocks; b++) {
    for (let j = 0; j < blockSize; j++) leaves.set(leafAt(b * blockSize + j), j * NODE_BYTES);
    const levels = blockLevels(leaves, k, hash);
    for (let j = 0; j < blockSize; j++) writeLowerPath(levels, j, paths, (b * blockSize + j) * k * NODE_BYTES);
    const root = levels[k]!;
    blockRoots.set(root, b * NODE_BYTES);
    upper.append(root.slice());
  }
  const partial = new IncrementalTree(k, hash);
  for (let i = fullLeaves; i < n; i++) partial.append(leafAt(i));
  let root: Uint8Array;
  if (partialLeaves > 0) {
    const partialRoot = partial.root();
    blockRoots.set(partialRoot, fullBlocks * NODE_BYTES);
    root = upper.root(partialRoot);
  } else {
    root = upper.root();
  }
  return { pathSplit: k, leaves: n, blockRoots, blocks, fullLeaves, paths, root, upper: upper.state(), partial: partial.state() };
}
