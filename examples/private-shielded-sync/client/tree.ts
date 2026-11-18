/**
 * The client's view of the Zswap commitment tree (spec §2.2, FR-121–123), from what the server publishes: the PIR
 * record's lower path, the snapshot's block roots, and the tail's commitments, outputs and block roots. It holds no
 * tree; it assembles one coin's 32 siblings and serializes the collapsed updates the ledger's local state takes.
 *
 * Rules (ledger `transient-crypto/src/merkle_tree.rs`, `zswap/src/ledger.rs`; checked on Preprod by the transfer spike):
 * - height 32; output i of the chain is leaf i; a leaf is `degrade_to_transient(commitment)` (the kernel's `leaf`);
 * - an inner node is Poseidon of its two children (the kernel's `hash2`); a subtree holding no leaf is 0 and is never
 *   hashed; a node with one empty child is hashed with 0 in its place;
 * - every value is a field element as 32 bytes, little-endian.
 *
 * Collapsed updates (`MerkleTreeCollapsedUpdate`, ported from the transfer spike's `merkle.ts`, proven byte-equal to
 * the ledger's serialization over 11,484 ranges):
 *   "midnight:merkle-tree-collapsed-update[v1]:" compact(start) compact(end) compact(count) compact(hash)…
 * where compact is midnight-serialize's `ScaleBigInt` (SCALE compact), used for u32, u64 and field elements alike.
 *
 * Nothing here imports the server's code (spec FR-004).
 */

export const TREE_DEPTH = 32;
export const NODE_BYTES = 32;
export const ZERO_NODE: Uint8Array = new Uint8Array(NODE_BYTES);

/** Poseidon of two field elements, 32 bytes little-endian each. */
export type Hash2 = (left: Uint8Array, right: Uint8Array) => Uint8Array;

/** The levels of a tree of `depth` over `leaves` (all later positions empty): `levels[h]` holds the nodes formed. */
export function treeLevels(leaves: readonly Uint8Array[], depth: number, hash: Hash2): Uint8Array[][] {
  const levels: Uint8Array[][] = [leaves.slice()];
  for (let h = 0; h < depth; h++) {
    const below = levels[h]!;
    const next: Uint8Array[] = new Array(Math.ceil(below.length / 2));
    for (let j = 0; j < next.length; j++) next[j] = hash(below[2 * j]!, below[2 * j + 1] ?? ZERO_NODE);
    levels.push(next);
  }
  return levels;
}

/** The root of `levels` (0 for an empty tree). */
export function levelsRoot(levels: readonly Uint8Array[][]): Uint8Array {
  return levels[levels.length - 1]![0] ?? ZERO_NODE;
}

/** The siblings of node `index` at the bottom of `levels`, bottom up (0 where absent). */
export function siblingsOf(levels: readonly Uint8Array[][], index: number): Uint8Array[] {
  const out: Uint8Array[] = [];
  for (let h = 0; h < levels.length - 1; h++) {
    const node = Math.floor(index / 2 ** h);
    out.push(levels[h]![node % 2 === 0 ? node + 1 : node - 1] ?? ZERO_NODE);
  }
  return out;
}

/** The root from a leaf, its index and its siblings (bottom up): `MerklePath::root`. */
export function rootFromPath(leaf: Uint8Array, index: number, siblings: readonly Uint8Array[], hash: Hash2): Uint8Array {
  let node = leaf;
  for (let h = 0; h < siblings.length; h++) {
    node = Math.floor(index / 2 ** h) % 2 === 0 ? hash(node, siblings[h]!) : hash(siblings[h]!, node);
  }
  return node;
}

// ── field elements and the ledger's compact encoding ────────────────────────────────────────────────────────────

export function leToBigInt(bytes: Uint8Array): bigint {
  let v = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(bytes[i]!);
  return v;
}

/** Little-endian bytes of a non-negative integer, without trailing zero bytes (zero gives no bytes). */
export function leBytesTrimmed(v: bigint): Uint8Array {
  if (v < 0n) throw new Error("negative integer");
  const out: number[] = [];
  while (v > 0n) {
    out.push(Number(v & 0xffn));
    v >>= 8n;
  }
  return Uint8Array.from(out);
}

/** 32 little-endian bytes of a field element. */
export function bigIntToLe32(v: bigint): Uint8Array {
  const out = new Uint8Array(32);
  const b = leBytesTrimmed(v);
  if (b.length > 32) throw new Error("value does not fit 32 bytes");
  out.set(b);
  return out;
}

/** midnight-serialize `ScaleBigInt` (SCALE compact) of u32, u64 or a field element. */
export function scaleCompact(v: bigint): Uint8Array {
  if (v < 0n) throw new Error("negative integer");
  if (v < 1n << 6n) return Uint8Array.of(Number(v << 2n));
  if (v < 1n << 14n) {
    const x = Number((v << 2n) | 1n);
    return Uint8Array.of(x & 0xff, x >>> 8);
  }
  if (v < 1n << 30n) {
    const x = (v << 2n) | 2n;
    return Uint8Array.of(Number(x & 0xffn), Number((x >> 8n) & 0xffn), Number((x >> 16n) & 0xffn), Number((x >> 24n) & 0xffn));
  }
  const le = leBytesTrimmed(v);
  if (le.length > 67) throw new Error("too large for ScaleBigInt");
  const out = new Uint8Array(1 + le.length);
  out[0] = ((le.length - 4) << 2) | 3;
  out.set(le, 1);
  return out;
}

/** Decodes one `ScaleBigInt` at `at`; returns the value and the offset after it. Refuses non-canonical encodings. */
export function decodeScaleCompact(b: Uint8Array, at: number): [bigint, number] {
  const first = b[at];
  if (first === undefined) throw new Error("truncated SCALE integer");
  switch (first & 3) {
    case 0:
      return [BigInt(first >> 2), at + 1];
    case 1: {
      if (at + 2 > b.length || b[at + 1] === 0) throw new Error("non-canonical or truncated SCALE integer");
      return [BigInt((first >> 2) | (b[at + 1]! << 6)), at + 2];
    }
    case 2: {
      if (at + 4 > b.length || (b[at + 2] === 0 && b[at + 3] === 0)) throw new Error("non-canonical or truncated SCALE integer");
      return [BigInt(((first >> 2) | (b[at + 1]! << 6) | (b[at + 2]! << 14)) + b[at + 3]! * 2 ** 22), at + 4];
    }
    default: {
      const n = (first >> 2) + 4;
      const le = b.subarray(at + 1, at + 1 + n);
      if (le.length !== n || le[n - 1] === 0) throw new Error("non-canonical or truncated SCALE integer");
      return [leToBigInt(le), at + 1 + n];
    }
  }
}

// ── collapsed updates (FR-122, FR-123) ──────────────────────────────────────────────────────────────────────────

export const COLLAPSED_UPDATE_PREFIX = "midnight:merkle-tree-collapsed-update[v1]:";
const PREFIX_BYTES = new TextEncoder().encode(COLLAPSED_UPDATE_PREFIX);

export interface CollapsedUpdate {
  readonly start: bigint;
  /** Inclusive. */
  readonly end: bigint;
  readonly hashes: readonly bigint[];
}

export function serializeCollapsedUpdate(u: CollapsedUpdate): Uint8Array {
  const parts = [PREFIX_BYTES, scaleCompact(u.start), scaleCompact(u.end), scaleCompact(BigInt(u.hashes.length)), ...u.hashes.map(scaleCompact)];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

export function parseCollapsedUpdate(b: Uint8Array): CollapsedUpdate {
  for (let i = 0; i < PREFIX_BYTES.length; i++) if (b[i] !== PREFIX_BYTES[i]) throw new Error("not a collapsed update");
  let at = PREFIX_BYTES.length;
  let start: bigint, end: bigint, n: bigint;
  [start, at] = decodeScaleCompact(b, at);
  [end, at] = decodeScaleCompact(b, at);
  [n, at] = decodeScaleCompact(b, at);
  const hashes: bigint[] = [];
  for (let i = 0n; i < n; i++) {
    let h: bigint;
    [h, at] = decodeScaleCompact(b, at);
    hashes.push(h);
  }
  if (at !== b.length) throw new Error("trailing bytes after a collapsed update");
  return { start, end, hashes };
}

/** `MerkleTreeCollapsedUpdate::step_sizes(a, b)`: heights of the aligned subtrees covering a … b − 1, in order. */
export function stepSizes(a: bigint, b: bigint): number[] {
  const x = b ^ a;
  if (x === 0n) throw new Error("empty range");
  const msbDiff = x.toString(2).length - 1;
  const res: number[] = [];
  for (let bit = 0; bit < msbDiff; bit++) {
    const shifted = 1n << BigInt(bit);
    if ((a & shifted) !== 0n) {
      a += shifted;
      res.push(bit);
    }
  }
  if ((a & (1n << BigInt(msbDiff))) === 0n) res.push(msbDiff);
  for (let bit = msbDiff - 1; bit >= 0; bit--) if ((b & (1n << BigInt(bit))) !== 0n) res.push(bit);
  return res;
}

/**
 * The collapsed updates a one-use local state needs around leaf `i` (FR-122, decision Q23), from its 32 siblings:
 * `left`, one update over 0 … i − 1 whose hashes are the left siblings, highest first (absent when i = 0); `right`,
 * one single-hash update per non-empty right sibling, lowest first. An untouched subtree of the local tree is already
 * 0, so empty right siblings need no update.
 */
export function spendUpdatesFromPath(i: number, siblings: readonly Uint8Array[]): { left: CollapsedUpdate | null; right: CollapsedUpdate[] } {
  if (siblings.length !== TREE_DEPTH) throw new Error(`a path has ${TREE_DEPTH} siblings, got ${siblings.length}`);
  const index = BigInt(i);
  const values = siblings.map(leToBigInt);
  const leftHashes: bigint[] = [];
  const right: CollapsedUpdate[] = [];
  for (let h = TREE_DEPTH - 1; h >= 0; h--) if (((index >> BigInt(h)) & 1n) === 1n) leftHashes.push(values[h]!);
  for (let h = 0; h < TREE_DEPTH; h++) {
    if (((index >> BigInt(h)) & 1n) === 0n && values[h] !== 0n) {
      const start = ((index >> BigInt(h)) ^ 1n) << BigInt(h);
      right.push({ start, end: start + (1n << BigInt(h)) - 1n, hashes: [values[h]!] });
    }
  }
  return { left: index > 0n ? { start: 0n, end: index - 1n, hashes: leftHashes } : null, right };
}
