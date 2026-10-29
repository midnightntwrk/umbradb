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

/** A node of the fixture: its key, payload and serialized child list, and its children's keys. */
export interface FixtureNode {
  readonly key: Uint8Array;
  readonly data: Uint8Array;
  readonly children: Uint8Array;
  readonly refs: readonly Uint8Array[];
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

/** The state after height `h`: its root node first, then every node it reaches. */
export function stateNodes(h: number): FixtureNode[] {
  const parts = Array.from({ length: WIDTH }, (_, i) => subtree(i, versionOf(i, h)));
  const root = node(utf8(`state ${h}`), parts.map((part) => (part[0] as FixtureNode).key));
  return [root, ...parts.flat()];
}

/** The root the node reports for the state after `h` (`midnight_ledgerStateRoot`): a reference to its root node. */
export function rootOf(h: number): Uint8Array {
  return Uint8Array.from([0, ...(stateNodes(h)[0] as FixtureNode).key]);
}
