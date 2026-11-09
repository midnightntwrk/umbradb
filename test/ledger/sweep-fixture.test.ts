import { createHash } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { ApplyInput, LedgerPackage, NodeBatch, NodeStore, StateHandle, StoredNode } from "../../src/ledger/types.js";
import type { ApplyBlock, BlockId } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import {
  AGAIN,
  contentOf,
  extendedCases,
  type FixtureNode,
  LAST,
  REQUEUE,
  rootOf,
  stateKeys,
  stateNodes,
  TO_EMBEDDED,
  TO_REF,
} from "./fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory, type FixtureData, loadLedger } from "./fixtures/sweep-test-loader.js";
import { type Child, childKey, decodeChildren, storedNodeKey } from "./node-format.js";

/**
 * The DAG fixture (`./fixtures/sweep-fixture.ts`) and its test package (`./fixtures/sweep-test-loader.ts`), extended
 * for the reference-counting tests.
 *
 * - The original DAG and package, which the sweep's tests run, are unchanged: their states and batches hash as at the
 *   base build, with no selection and with `dag: "original"`.
 * - The extended DAG's nodes are the ledger's (keys, references and embedded keys checked against
 *   `./node-format.ts` and `src/ledger/node-refs.ts`), and its batches carry each new case: children shared between
 *   versions, a child repeated in one child list, embedded children holding references, a stored node written again
 *   with its small child in the other form (both directions), a stored node written again unchanged, and a child a
 *   rewrite stops referencing that a new node references at the next block.
 * - The three ways the package keeps nodes: `writes-again` (the default) writes the fixture's child list, restarted or
 *   not; `keeps-old-copy` keeps the old child list in a thread that never restarted while a fresh package writes the
 *   new one; `holds-by-reference` writes what `writes-again` writes, but its live state still holds by reference the
 *   child its parent's stored child list now embeds, so it refuses to forget that child, in this thread and in the
 *   ledger worker, until a new worker loads the state from the node store.
 */

const LOADER = new URL("./fixtures/sweep-test-loader.ts", import.meta.url);
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const keysOf = (batch: NodeBatch | undefined): string[] => (batch?.inserts ?? []).map((node) => hex(node.key));
const T0 = 1_760_000_000_000;
const blockHash = (height: number): Uint8Array => new Uint8Array(32).fill(height + 1);
const at = (height: number): BlockId => ({ height: BigInt(height), hash: blockHash(height) });

/** Block `height` as a package applies it: the fixture's blocks carry no transaction. */
function applyInput(height: number): ApplyInput {
  return {
    transactions: [],
    height: BigInt(height),
    hash: blockHash(height),
    parentHash: blockHash(height - 1),
    timestampMs: BigInt(T0 + height * 6_000),
    parentTimestampMs: BigInt(T0 + (height - 1) * 6_000),
    firstRegularAtParentTime: false,
  };
}

/** The key of the extended DAG's state after `height`: the root the node reports, without its `ArenaKey::Ref` byte. */
const rootKey = (height: number): Uint8Array => rootOf(height, "extended").slice(1);

/** The test package, loaded in this thread. */
const packageOf = (data: FixtureData | null): Promise<LedgerPackage> => loadLedger("v9", { networkId: "undeployed" }, data);

/** A node store over `rows`. */
const storeOf = (rows: ReadonlyMap<string, StoredNode>): NodeStore => ({
  get(key) {
    const node = rows.get(hex(key));
    return node === undefined ? null : { data: node.data, children: node.children };
  },
});

/** The keys of the nodes `children` embeds, nested ones included, in the list's order (`./node-format.ts`). */
const embeddedOf = (children: readonly Child[]): string[] =>
  children.flatMap((child) => ("ref" in child ? [] : [hex(childKey(child)), ...embeddedOf(child.direct.children)]));

/** A child list's children, each `ref <key>` or `direct <key>` (`./node-format.ts`). */
const shape = (children: Uint8Array): string[] =>
  decodeChildren(children).map((child) => ("ref" in child ? `ref ${hex(child.ref)}` : `direct ${hex(childKey(child))}`));

/** Every key `rows` holds as a row or embedded in a row: the database's node set. */
const nodeSetOf = (rows: ReadonlyMap<string, StoredNode>): string[] =>
  [...new Set([...rows.values()].flatMap((node) => [hex(node.key), ...embeddedOf(decodeChildren(node.children))]))].sort();

/** Whether a stored child list of `rows` references `key`. */
const referenced = (rows: ReadonlyMap<string, StoredNode>, key: Uint8Array): boolean =>
  [...rows.values()].some((node) => childRefKeys(node.children).some((ref) => hex(ref) === hex(key)));

/** A batch as text: its inserts (key, payload, child list) and its root-count changes. */
const batchText = (batch: NodeBatch | undefined): string =>
  JSON.stringify([
    (batch?.inserts ?? []).map((node) => [hex(node.key), hex(node.data), hex(node.children)]),
    (batch?.rootCounts ?? []).map((change) => [hex(change.key), change.delta]),
  ]);

/** A package driven block by block (see {@link driver}). */
interface Driver {
  readonly pkg: LedgerPackage;
  /** The rows written so far, by key: a write replaces a stored row's child list, as the node's back-ends do. */
  readonly rows: Map<string, StoredNode>;
  /** Each height's batch. */
  readonly batches: Map<number, NodeBatch>;
  /** The rows after each height {@link Driver.to} was asked to keep. */
  readonly kept: Map<number, Map<string, StoredNode>>;
  /** Applies the blocks after the last one up to `to`, keeping the rows after each height of `keep`. */
  to(to: number, keep?: readonly number[]): Driver;
}

/**
 * Drives `pkg` as the ledger worker does with `retainStates` 0: each block applied to the state before it, the new
 * state persisted and the one before released, the batch flushed and written. The state before a block stays live
 * until the next block is applied (the worker's committed and pending states). It starts at block 0, or after the
 * state at `loaded.height` read from `loaded.rows` (a restarted worker's first step). Nothing is deleted: the rows hold
 * every node written.
 */
function driver(pkg: LedgerPackage, loaded?: { readonly height: number; readonly rows: ReadonlyMap<string, StoredNode> }): Driver {
  const rows = new Map(loaded?.rows ?? []);
  const batches = new Map<number, NodeBatch>();
  const kept = new Map<number, Map<string, StoredNode>>();
  let height = loaded === undefined ? -1 : loaded.height;
  let older: StateHandle | null = null;
  let state = loaded === undefined ? pkg.emptyState() : pkg.load(rootKey(loaded.height), storeOf(rows));
  let previous = loaded === undefined ? null : pkg.stateKey(state);
  const self: Driver = {
    pkg,
    rows,
    batches,
    kept,
    to(to, keep = []) {
      for (let h = height + 1; h <= to; h++) {
        const { state: after } = pkg.apply(state, applyInput(h));
        const key = pkg.stateKey(after);
        pkg.persist(key);
        if (previous !== null) pkg.release(previous);
        const batch = pkg.flush();
        for (const node of batch.inserts) rows.set(hex(node.key), node);
        batches.set(h, batch);
        if (older !== null) pkg.dispose(older);
        older = state;
        state = after;
        previous = key;
        height = h;
        if (keep.includes(h)) kept.set(h, new Map(rows));
      }
      return self;
    },
  };
  return self;
}

/** The heights that wrote `node`, each with the child list written. */
const writesOf = (run: Driver, node: FixtureNode): [number, string][] =>
  [...run.batches].flatMap(([h, batch]) => batch.inserts.filter((n) => hex(n.key) === hex(node.key)).map((n): [number, string] => [h, hex(n.children)]));

/** The package's shared counters, by name. */
const countersOf = (memory: SharedArrayBuffer): Record<keyof typeof COUNTERS, number> => {
  const shared = new Int32Array(memory);
  return Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
};

/** A read over `rows`, as the node-store bridge queries `core_ledger_state.nodes`. */
const readerOf = (rows: ReadonlyMap<string, StoredNode>) => ({
  async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
    return (params[0] as Uint8Array[]).flatMap((key) => {
      const node = rows.get(hex(key));
      return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
    });
  },
});

/** Block `height`'s apply input in the ledger worker. */
const workerInput = (height: number): ApplyBlock => ({
  ledger: "v9",
  ...at(height),
  parentHash: blockHash(height - 1),
  timestampMs: BigInt(T0 + height * 6_000),
  parentTimestampMs: BigInt(T0 + (height - 1) * 6_000),
  firstRegularAtParentTime: false,
  transactions: 0,
});

let host: LedgerHost | undefined;
afterEach(async () => {
  await host?.close();
  host = undefined;
});

describe("the DAG fixture extended for reference counting, and its test packages", () => {
  it("the original DAG and package are unchanged: states and batches over heights 0–100 hash as at the base build, with no selection and with dag: original", async () => {
    const states = (pick: (h: number) => FixtureNode[], root: (h: number) => Uint8Array): string => {
      const hash = createHash("sha256");
      for (let h = 0; h <= LAST; h++) {
        for (const n of pick(h)) hash.update(`${h} ${hex(n.key)} ${hex(n.data)} ${hex(n.children)} ${n.refs.map(hex).join(",")}\n`);
        hash.update(`root ${hex(root(h))}\n`);
      }
      return hash.digest("hex");
    };
    // The digests of `5bcffec`'s fixture, before the extension.
    const STATES = "d8b550cf8f67cde3e81b873fac18a42037560e28b57722d593591c825efccd7f";
    const BATCHES = "f1d456109f635b16b897d273182405984f5fddc1d29f2dd0f4697ddebad6a066";
    expect(states((h) => stateNodes(h), (h) => rootOf(h))).toBe(STATES);
    expect(states((h) => stateNodes(h, "original"), (h) => rootOf(h, "original"))).toBe(STATES);
    for (const data of [null, {}, { dag: "original" }] satisfies (FixtureData | null)[]) {
      const pkg = await packageOf(data);
      const hash = createHash("sha256");
      let state = pkg.genesisState(new Uint8Array());
      let previous: Uint8Array | null = null;
      let inserts = 0;
      for (let h = 0; h <= LAST; h++) {
        state = pkg.apply(state, applyInput(h)).state;
        const key = pkg.stateKey(state);
        pkg.persist(key);
        if (previous !== null) pkg.release(previous);
        previous = key;
        const batch = pkg.flush();
        inserts += batch.inserts.length;
        hash.update(
          `${h} ${batch.inserts.map((n) => `${hex(n.key)}:${hex(n.data)}:${hex(n.children)}`).join(";")} | ${batch.rootCounts.map((c) => `${hex(c.key)}:${c.delta}`).join(";")}\n`,
        );
      }
      expect([hash.digest("hex"), inserts], JSON.stringify(data)).toEqual([BATCHES, 1871]);
    }
  });

  it("every node of the extended DAG is the ledger's (key, references, embedded keys); each state holds the original's subtrees and every case, and its node set is its rows and their embedded nodes", () => {
    const problems: string[] = [];
    for (let h = 0; h <= LAST; h++) {
      const nodes = stateNodes(h, "extended");
      const rows = new Set(nodes.map((node) => hex(node.key)));
      if (rows.size !== nodes.length) problems.push(`${h}: a row listed twice`);
      const embedded = new Set<string>();
      for (const node of nodes) {
        const children = decodeChildren(node.children);
        const content = contentOf(node.data, node.children);
        const facts = [hex(content.key), content.refs.map(hex), content.embedded.map(hex)];
        // The key is the ledger's hash of the payload and the children's keys; the references are what
        // `childRefKeys` reads through embedded children; the embedded keys are those of the child list.
        if (hex(storedNodeKey(node.data, node.children)) !== hex(node.key)) problems.push(`${h}: ${hex(node.key)}'s key is not its content's`);
        if (JSON.stringify(childRefKeys(node.children).map(hex)) !== JSON.stringify(node.refs.map(hex))) problems.push(`${h}: ${hex(node.key)}'s references`);
        if (JSON.stringify((node.embedded ?? []).map(hex)) !== JSON.stringify(embeddedOf(children))) problems.push(`${h}: ${hex(node.key)}'s embedded keys`);
        if (JSON.stringify(facts) !== JSON.stringify([hex(node.key), node.refs.map(hex), embeddedOf(children)])) problems.push(`${h}: contentOf(${hex(node.key)})`);
        for (const ref of node.refs) if (!rows.has(hex(ref))) problems.push(`${h}: ${hex(node.key)} references ${hex(ref)}, no row`);
        for (const key of embeddedOf(children)) embedded.add(key);
      }
      const root = nodes[0] as FixtureNode;
      const original = stateNodes(h);
      if (hex(rootOf(h, "extended")) !== `00${hex(root.key)}`) problems.push(`${h}: rootOf`);
      // The original's 24 subtrees, as the original DAG has them, are the first children of the root.
      if (JSON.stringify(root.refs.slice(0, 24).map(hex)) !== JSON.stringify((original[0] as FixtureNode).refs.map(hex))) problems.push(`${h}: the original subtrees`);
      for (const node of original.slice(1)) if (!rows.has(hex(node.key))) problems.push(`${h}: original node ${hex(node.key)} missing`);
      // Each case's rows and embedded nodes at h.
      const c = extendedCases(h);
      const expectRow = (node: FixtureNode, row: boolean, name: string): void => {
        if (rows.has(hex(node.key)) !== row) problems.push(`${h}: ${name} ${row ? "is not" : "is"} a row`);
        if (!row && !embedded.has(hex(node.key))) problems.push(`${h}: ${name} is neither a row nor embedded`);
      };
      for (const [node, name] of [
        [c.shared.node, "shared"],
        [c.shared.leaves[0], "shared leaf 0"],
        [c.shared.leaves[1], "shared leaf 1"],
        [c.repeated.node, "repeat"],
        [c.repeated.leaf, "repeat leaf"],
        [c.embedded.node, "embed"],
        [c.toRef.node, "rewrite to-ref"],
        [c.toEmbedded.node, "rewrite to-embedded"],
        [c.requeue.node, "requeue"],
        [c.requeue.leaf, "requeued leaf"],
        [c.again.node, "again"],
      ] as const) {
        expectRow(node, true, name);
      }
      for (const leaf of c.embedded.leaves) expectRow(leaf, true, "embed leaf");
      expectRow(c.embedded.inner, false, "embed inner");
      expectRow(c.embedded.core, false, "embed core");
      expectRow(c.toRef.small, h >= TO_REF, "small to-ref");
      expectRow(c.toEmbedded.small, h < TO_EMBEDDED, "small to-embedded");
      expectRow(c.requeue.requeued, h !== REQUEUE, "requeued");
      if ((c.requeue.holder !== null) !== h > REQUEUE) problems.push(`${h}: requeue holder`);
      if (c.requeue.holder !== null) expectRow(c.requeue.holder, true, "requeue holder");
      if (JSON.stringify(stateKeys(h, "extended")) !== JSON.stringify([...new Set([...rows, ...embedded])].sort())) problems.push(`${h}: stateKeys`);
      if (JSON.stringify(stateKeys(h)) !== JSON.stringify(original.map((node) => hex(node.key)).sort())) problems.push(`${h}: stateKeys of the original`);
    }
    expect(problems).toEqual([]);
  });

  it("writes-again: the batches carry each case — shared children, a repeated child, embedded children holding references, the rewrite each way, a node written again unchanged, a queued child referenced again", async () => {
    const run = driver(await packageOf({ dag: "extended" })).to(LAST, [TO_EMBEDDED, REQUEUE]);
    const batch = (h: number): NodeBatch => run.batches.get(h) as NodeBatch;
    // Children shared between versions: version k of `shared` references its first leaf, which version k − 1 wrote
    // as its second; the batch at 10k writes the new version and its new leaf only.
    for (let h = 10; h <= LAST; h += 10) {
      const now = extendedCases(h).shared;
      const before = extendedCases(h - 1).shared;
      expect(now.node.refs.map(hex), `${h}`).toEqual(now.leaves.map((leaf) => hex(leaf.key)));
      expect(hex(before.leaves[1].key), `${h}`).toBe(hex(now.leaves[0].key));
      expect(keysOf(batch(h)), `${h}`).toEqual(expect.arrayContaining([hex(now.node.key), hex(now.leaves[1].key)]));
      expect(keysOf(batch(h)), `${h}`).not.toContain(hex(now.leaves[0].key));
      expect(writesOf(run, now.leaves[0]).map(([written]) => written), `${h}`).toEqual([h - 10]);
    }
    // A child repeated in one child list: each version of `repeat` references its leaf twice; versions 2k and 2k + 1
    // share it, so the batch writes the leaf (once) with the even versions only.
    for (let v = 0; v <= 10; v++) {
      const h = v === 0 ? 0 : 10 * v - 5;
      const { node, leaf } = extendedCases(h).repeated;
      expect(node.refs.map(hex), `${h}`).toEqual([hex(leaf.key), hex(leaf.key)]);
      expect(childRefKeys(batch(h).inserts.find((n) => hex(n.key) === hex(node.key))?.children ?? new Uint8Array()).map(hex), `${h}`).toEqual([hex(leaf.key), hex(leaf.key)]);
      expect(keysOf(batch(h)).filter((key) => key === hex(leaf.key)), `${h}`).toEqual(v % 2 === 0 ? [hex(leaf.key)] : []);
    }
    // Embedded children holding references: `embed v` embeds `embed inner v`, which references a leaf and embeds
    // `embed core v`, which references another; the batch writes `embed v` and its leaves, never the embedded nodes.
    const inBatches = new Set([...run.batches.values()].flatMap(keysOf));
    for (let v = 0; v <= 10; v++) {
      const h = v === 0 ? 0 : 10 * v - 2;
      const { node, inner, core, leaves } = extendedCases(h).embedded;
      const written = batch(h).inserts.find((n) => hex(n.key) === hex(node.key));
      expect(written, `${h}`).toBeDefined();
      const children = decodeChildren(written?.children ?? new Uint8Array());
      expect(shape(written?.children ?? new Uint8Array()), `${h}`).toEqual([`direct ${hex(inner.key)}`, `ref ${hex(leaves[2].key)}`]);
      const direct = children[0] as Extract<Child, { direct: unknown }>;
      expect(direct.direct.children.map((child) => ("ref" in child ? `ref ${hex(child.ref)}` : `direct ${hex(childKey(child))}`)), `${h}`).toEqual([
        `ref ${hex(leaves[0].key)}`,
        `direct ${hex(core.key)}`,
      ]);
      expect(shape(core.children), `${h}`).toEqual([`ref ${hex(leaves[1].key)}`]);
      expect(childRefKeys(written?.children ?? new Uint8Array()).map(hex), `${h}`).toEqual(leaves.map((leaf) => hex(leaf.key)));
      expect(keysOf(batch(h)), `${h}`).toEqual(expect.arrayContaining(leaves.map((leaf) => hex(leaf.key))));
      expect([inBatches.has(hex(inner.key)), inBatches.has(hex(core.key))], `${h}`).toEqual([false, false]);
    }
    // Embedded → referenced at TO_REF: the stored node is written again with its small child referenced, and the
    // child is written as a row of its own.
    const toRef = extendedCases(TO_REF).toRef;
    const toRefWrites = writesOf(run, toRef.node);
    expect(toRefWrites.map(([h]) => h)).toEqual([0, TO_REF]);
    expect(shape(Buffer.from(toRefWrites[0]?.[1] ?? "", "hex"))).toEqual([`direct ${hex(toRef.small.key)}`]);
    expect(shape(Buffer.from(toRefWrites[1]?.[1] ?? "", "hex"))).toEqual([`ref ${hex(toRef.small.key)}`]);
    expect(writesOf(run, toRef.small).map(([h]) => h)).toEqual([TO_REF]);
    // Referenced → embedded at TO_EMBEDDED: the stored node is written again embedding its small child, which keeps
    // its row (written at 0) and no stored reference: no stored child list names it, and it is no state's root.
    const toEmbedded = extendedCases(TO_EMBEDDED).toEmbedded;
    const toEmbeddedWrites = writesOf(run, toEmbedded.node);
    expect(toEmbeddedWrites.map(([h]) => h)).toEqual([0, TO_EMBEDDED]);
    expect(shape(Buffer.from(toEmbeddedWrites[0]?.[1] ?? "", "hex"))).toEqual([`ref ${hex(toEmbedded.small.key)}`]);
    expect(shape(Buffer.from(toEmbeddedWrites[1]?.[1] ?? "", "hex"))).toEqual([`direct ${hex(toEmbedded.small.key)}`]);
    expect(writesOf(run, toEmbedded.small).map(([h]) => h)).toEqual([0]);
    const afterRewrite = run.kept.get(TO_EMBEDDED) as Map<string, StoredNode>;
    expect(afterRewrite.has(hex(toEmbedded.small.key))).toBe(true);
    expect(referenced(afterRewrite, toEmbedded.small.key)).toBe(false);
    expect(Array.from({ length: LAST + 1 }, (_, h) => hex(rootKey(h)))).not.toContain(hex(toEmbedded.small.key));
    // A queued child referenced again: `requeue` is rewritten to embed `requeued` at REQUEUE, which leaves `requeued`
    // with its row and no stored reference; at REQUEUE + 1 a new node, `requeue holder`, references it.
    const { requeue } = extendedCases(REQUEUE + 1);
    const requeueWrites = writesOf(run, requeue.node);
    expect(requeueWrites.map(([h]) => h)).toEqual([0, REQUEUE]);
    expect(shape(Buffer.from(requeueWrites[0]?.[1] ?? "", "hex"))).toEqual([`ref ${hex(requeue.requeued.key)}`]);
    expect(shape(Buffer.from(requeueWrites[1]?.[1] ?? "", "hex"))).toEqual([`direct ${hex(requeue.requeued.key)}`]);
    expect(referenced(run.kept.get(REQUEUE) as Map<string, StoredNode>, requeue.requeued.key)).toBe(false);
    expect(writesOf(run, requeue.holder as FixtureNode).map(([h]) => h)).toEqual([REQUEUE + 1]);
    expect(requeue.holder?.refs.map(hex)).toEqual([hex(requeue.requeued.key)]);
    expect(writesOf(run, requeue.requeued).map(([h]) => h)).toEqual([0]);
    // Written again unchanged at AGAIN: the same child list as at 0, its children not written again.
    const { again } = extendedCases(AGAIN);
    expect(writesOf(run, again.node)).toEqual([
      [0, hex(again.node.children)],
      [AGAIN, hex(again.node.children)],
    ]);
    for (const leaf of again.leaves) expect(keysOf(batch(AGAIN))).not.toContain(hex(leaf.key));
    // No other batch writes a stored node again; every batch is admissible (each insert reached from a key whose
    // root count rose, through the batch's own nodes).
    const seen = new Set<string>();
    const writtenAgain: Record<number, string[]> = {};
    for (const [h, b] of run.batches) {
      const rewritten = keysOf(b).filter((key) => seen.has(key));
      if (rewritten.length > 0) writtenAgain[h] = rewritten;
      for (const key of keysOf(b)) seen.add(key);
      const byKey = new Map(b.inserts.map((n) => [hex(n.key), n]));
      const reached = new Set<string>();
      const frontier = b.rootCounts.filter((change) => change.delta > 0).map((change) => hex(change.key));
      while (frontier.length > 0) {
        const key = frontier.pop() as string;
        const node = byKey.get(key);
        if (reached.has(key) || node === undefined) continue;
        reached.add(key);
        for (const ref of childRefKeys(node.children)) frontier.push(hex(ref));
      }
      expect(keysOf(b).filter((key) => !reached.has(key)), `${h}`).toEqual([]);
    }
    expect(writtenAgain).toEqual({
      [TO_REF]: [hex(toRef.node.key)],
      [TO_EMBEDDED]: [hex(toEmbedded.node.key)],
      [REQUEUE]: [hex(requeue.node.key)],
      [AGAIN]: [hex(again.node.key)],
    });
  });

  it("writes-again: a fresh package that loads the state before a block from the node store writes that block's batch, and at REQUEUE + 1 also the queued row it reaches again, unchanged", async () => {
    const heights = [TO_REF, 41, TO_EMBEDDED, REQUEUE, REQUEUE + 1, AGAIN];
    const run = driver(await packageOf({ dag: "extended" })).to(LAST, heights.map((h) => h - 1));
    for (const h of heights) {
      const memory = countersMemory();
      const fresh = driver(await packageOf({ dag: "extended", counters: memory }), { height: h - 1, rows: run.kept.get(h - 1) as Map<string, StoredNode> }).to(h);
      expect(countersOf(memory), `${h}`).toMatchObject({ threads: 1, storeLoads: 1, storeLoadHeight: h - 1 });
      if (h !== REQUEUE + 1) {
        expect(batchText(fresh.batches.get(h)), `${h}`).toBe(batchText(run.batches.get(h)));
        continue;
      }
      // The fresh package read the state at REQUEUE, in which `requeued` is embedded: it does not know the row is
      // stored, so it writes it again, unchanged, with the new node that references it.
      const { requeued } = extendedCases(h).requeue;
      const got = fresh.batches.get(h) as NodeBatch;
      const want = run.batches.get(h) as NodeBatch;
      expect(keysOf(got).sort()).toEqual([...keysOf(want), hex(requeued.key)].sort());
      expect(hex(got.inserts.find((n) => hex(n.key) === hex(requeued.key))?.children ?? new Uint8Array())).toBe(hex(requeued.children));
      expect(batchText({ inserts: got.inserts.filter((n) => hex(n.key) !== hex(requeued.key)), rootCounts: got.rootCounts })).toBe(batchText(want));
    }
  });

  it("keeps-old-copy: a never-restarted package keeps the old child list when it creates a node again; a fresh package that loaded the state before writes the new one, and every new one the old run kept; the two databases hold different rows of one node set", async () => {
    const rewrites = [TO_REF, TO_EMBEDDED, REQUEUE];
    const writesAgain = driver(await packageOf({ dag: "extended" })).to(LAST);
    const keeps = driver(await packageOf({ dag: "extended", keeping: "keeps-old-copy" })).to(LAST, rewrites.map((h) => h - 1));
    const c = extendedCases(LAST);
    const skipped: Record<number, string[]> = {
      [TO_REF]: [hex(c.toRef.node.key), hex(c.toRef.small.key)],
      [TO_EMBEDDED]: [hex(c.toEmbedded.node.key)],
      [REQUEUE]: [hex(c.requeue.node.key)],
    };
    for (let h = 0; h <= LAST; h++) {
      const want = writesAgain.batches.get(h) as NodeBatch;
      const leave = new Set(skipped[h] ?? []);
      const expected = { inserts: want.inserts.filter((n) => !leave.has(hex(n.key))), rootCounts: want.rootCounts };
      expect(batchText(keeps.batches.get(h)), `${h}`).toBe(batchText(expected));
    }
    // After the run: the rewritten nodes keep the child lists of height 0, the small child of `rewrite to-ref` has
    // no row, and the node sets are equal.
    const row = (run: Driver, node: FixtureNode): string => hex(run.rows.get(hex(node.key))?.children ?? new Uint8Array());
    const first = extendedCases(0);
    expect([row(keeps, c.toRef.node), row(keeps, c.toEmbedded.node), row(keeps, c.requeue.node)]).toEqual([
      hex(first.toRef.node.children),
      hex(first.toEmbedded.node.children),
      hex(first.requeue.node.children),
    ]);
    expect([row(writesAgain, c.toRef.node), row(writesAgain, c.toEmbedded.node), row(writesAgain, c.requeue.node)]).toEqual([
      hex(c.toRef.node.children),
      hex(c.toEmbedded.node.children),
      hex(c.requeue.node.children),
    ]);
    expect(keeps.rows.has(hex(c.toRef.small.key))).toBe(false);
    expect(writesAgain.rows.has(hex(c.toRef.small.key))).toBe(true);
    expect(nodeSetOf(keeps.rows)).toEqual(nodeSetOf(writesAgain.rows));
    // A fresh keeps-old-copy package, restarted before each rewrite's block, writes the new child list: its batch is
    // writes-again's, plus the new child list of each earlier rewrite that the never-restarted run kept old (with
    // `small to-ref`, which that rewrite makes a row).
    for (const h of rewrites) {
      const memory = countersMemory();
      const fresh = driver(await packageOf({ dag: "extended", keeping: "keeps-old-copy", counters: memory }), {
        height: h - 1,
        rows: keeps.kept.get(h - 1) as Map<string, StoredNode>,
      }).to(h);
      expect(countersOf(memory), `${h}`).toMatchObject({ storeLoads: 1, storeLoadHeight: h - 1 });
      const now = extendedCases(h);
      const caughtUp = [...(h > TO_REF ? [now.toRef.node, now.toRef.small] : []), ...(h > TO_EMBEDDED ? [now.toEmbedded.node] : [])];
      const want = writesAgain.batches.get(h) as NodeBatch;
      const inserts = [...want.inserts, ...caughtUp.map((node) => ({ key: node.key, data: node.data, children: node.children }))];
      inserts.sort((a, b) => (hex(a.key) < hex(b.key) ? -1 : 1));
      expect(batchText(fresh.batches.get(h)), `${h}`).toBe(batchText({ inserts, rootCounts: want.rootCounts }));
    }
    // A state loads from either database, whichever child list it holds.
    for (const run of [keeps, writesAgain]) {
      const fresh = await packageOf({ dag: "extended", keeping: "keeps-old-copy" });
      expect(hex(fresh.stateRoot(fresh.load(rootKey(LAST), storeOf(run.rows))))).toBe(hex(rootOf(LAST, "extended")));
    }
  });

  it("holds-by-reference: writes writes-again's batches, but its live state holds small to-embedded by reference after its parent was written embedding it, so it refuses to forget it; a fresh package and writes-again forget it at once", async () => {
    const h = TO_EMBEDDED + 1;
    const { small } = extendedCases(TO_EMBEDDED).toEmbedded;
    const writesAgain = driver(await packageOf({ dag: "extended" })).to(h, [TO_EMBEDDED]);
    const memory = countersMemory();
    const holds = driver(await packageOf({ dag: "extended", keeping: "holds-by-reference", counters: memory })).to(h);
    for (let height = 0; height <= h; height++) {
      expect(batchText(holds.batches.get(height)), `${height}`).toBe(batchText(writesAgain.batches.get(height)));
    }
    // The stored parent embeds the child, and no stored child list references it.
    const stored = writesAgain.kept.get(TO_EMBEDDED) as Map<string, StoredNode>;
    const parent = stored.get(hex(extendedCases(TO_EMBEDDED).toEmbedded.node.key)) as StoredNode;
    expect(embeddedOf(decodeChildren(parent.children))).toEqual([hex(small.key)]);
    expect(referenced(stored, small.key)).toBe(false);
    // The live state still holds it by reference: the package refuses, and refuses again; a key no live state holds
    // (the state released at TO_EMBEDDED − 1's root) it forgets.
    const refusal = new RegExp(`refuses to forget ${hex(small.key)} after ${h}: still held by a live object`);
    expect(() => holds.pkg.evict([small.key])).toThrow(refusal);
    expect(() => holds.pkg.evict([small.key])).toThrow(refusal);
    expect(() => holds.pkg.evict([rootKey(TO_EMBEDDED - 1)])).not.toThrow();
    expect(countersOf(memory)).toMatchObject({ threads: 1, refusals: 2, evictions: 1 });
    // A fresh package that loaded the state at TO_EMBEDDED from the node store writes the same batch at h and forgets
    // the child; so does writes-again.
    const fresh = driver(await packageOf({ dag: "extended", keeping: "holds-by-reference" }), { height: TO_EMBEDDED, rows: stored }).to(h);
    expect(batchText(fresh.batches.get(h))).toBe(batchText(writesAgain.batches.get(h)));
    expect(() => fresh.pkg.evict([small.key])).not.toThrow();
    expect(() => writesAgain.pkg.evict([small.key])).not.toThrow();
  });

  it("holds-by-reference in the ledger worker: the eviction at TO_EMBEDDED + 1 is refused on both tries (EvictionRefused); a new worker loads the state at TO_EMBEDDED from the node store, applies the block again with the same batch, and evicts the child", { timeout: 120_000 }, async () => {
    const h = TO_EMBEDDED + 1;
    const { small } = extendedCases(TO_EMBEDDED).toEmbedded;
    const memory = countersMemory();
    host = startLedgerWorker({ loader: LOADER, loaderData: { dag: "extended", keeping: "holds-by-reference", counters: memory } satisfies FixtureData });
    const worker = host;
    const rows = new Map<string, StoredNode>();
    const read = readerOf(rows);
    const write = (batch: NodeBatch): void => {
      for (const node of batch.inserts) rows.set(hex(node.key), node);
    };
    write(
      (
        await worker.genesis(
          { ledger: "v9", ...at(0), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: Uint8Array.of(0), includesBlockZero: false },
          read,
        )
      ).batch,
    );
    expect(await worker.commit(at(0))).toBe(true);
    for (let height = 1; height <= TO_EMBEDDED; height++) {
      write((await worker.apply(workerInput(height), read)).batch);
      expect(await worker.commit(at(height))).toBe(true);
    }
    const first = await worker.apply(workerInput(h), read);
    // One eviction, two tries: the second after the worker freed its kept parses.
    const refused = (await worker.evict([small.key]).then(
      () => null,
      (error: unknown) => error,
    )) as Error | null;
    expect([refused?.name, refused?.message]).toEqual([
      "EvictionRefused",
      expect.stringMatching(new RegExp(`refuses to forget ${hex(small.key)} after ${h}: still held by a live object`)),
    ]);
    expect(countersOf(memory)).toMatchObject({ threads: 1, refusals: 2, storeLoads: 0 });
    await worker.restart();
    const loaded = await worker.load({ ledger: "v9", ...at(TO_EMBEDDED), stateKey: rootKey(TO_EMBEDDED) }, read);
    expect([hex(loaded.stateRoot), loaded.loaded]).toEqual([hex(rootOf(TO_EMBEDDED, "extended")), true]);
    const again = await worker.apply(workerInput(h), read);
    expect(batchText(again.batch)).toBe(batchText(first.batch));
    expect(await worker.evict([small.key])).toBe(1);
    expect(countersOf(memory)).toMatchObject({ threads: 2, refusals: 2, storeLoads: 1, storeLoadHeight: TO_EMBEDDED, evictions: 1 });
    expect(worker.failure).toBeNull();
  });

  it("one-form (the DAG): each state is the extended one without the rewrite cases, and the package writes every key with one child list throughout, only `again` written again", async () => {
    const problems: string[] = [];
    const gone = (h: number): FixtureNode[] => {
      const c = extendedCases(h);
      return [c.toRef.node, c.toRef.small, c.toEmbedded.node, c.toEmbedded.small, c.requeue.node, c.requeue.requeued, c.requeue.leaf];
    };
    for (let h = 0; h <= LAST; h++) {
      const nodes = stateNodes(h, "one-form");
      const rows = new Set(nodes.map((node) => hex(node.key)));
      const embedded = new Set(nodes.flatMap((node) => embeddedOf(decodeChildren(node.children))));
      for (const node of nodes) {
        if (hex(storedNodeKey(node.data, node.children)) !== hex(node.key)) problems.push(`${h}: ${hex(node.key)}'s key is not its content's`);
        for (const ref of node.refs) if (!rows.has(hex(ref))) problems.push(`${h}: ${hex(node.key)} references ${hex(ref)}, no row`);
      }
      const root = nodes[0] as FixtureNode;
      if (hex(rootOf(h, "one-form")) !== `00${hex(root.key)}`) problems.push(`${h}: rootOf`);
      // The extended DAG's rows but the rewrite cases', the original's subtrees first under the root.
      const extended = stateNodes(h, "extended").slice(1).map((node) => hex(node.key));
      const without = new Set(gone(h).map((node) => hex(node.key)));
      const holder = extendedCases(h).requeue.holder;
      if (holder !== null) without.add(hex(holder.key));
      const expected = extended.filter((key) => !without.has(key)).sort();
      if (JSON.stringify(nodes.slice(1).map((node) => hex(node.key)).sort()) !== JSON.stringify(expected)) problems.push(`${h}: the rows are not the extended DAG's without its rewrite cases`);
      if (JSON.stringify(root.refs.slice(0, 24).map(hex)) !== JSON.stringify((stateNodes(h)[0] as FixtureNode).refs.map(hex))) problems.push(`${h}: the original subtrees`);
      for (const key of without) if (rows.has(key) || embedded.has(key)) problems.push(`${h}: a rewrite case's node ${key} is in the state`);
      if (JSON.stringify(stateKeys(h, "one-form")) !== JSON.stringify([...new Set([...rows, ...embedded])].sort())) problems.push(`${h}: stateKeys`);
    }
    expect(problems).toEqual([]);
    // Through the package: each key one child list in every batch that writes it; written again only `again`, at
    // AGAIN, unchanged; each case's nodes written; every batch admissible.
    const run = driver(await packageOf({ dag: "one-form" })).to(LAST);
    const forms = new Map<string, Set<string>>();
    const writtenAgain: Record<number, string[]> = {};
    for (const [h, b] of run.batches) {
      for (const node of b.inserts) {
        const key = hex(node.key);
        if (forms.has(key)) (writtenAgain[h] ??= []).push(key);
        (forms.get(key) ?? forms.set(key, new Set()).get(key)!).add(hex(node.children));
      }
      expect(hex(run.pkg.stateRoot(run.pkg.load(rootOf(h, "one-form").slice(1), storeOf(run.rows)))), `${h}`).toBe(hex(rootOf(h, "one-form")));
      const byKey = new Map(b.inserts.map((n) => [hex(n.key), n]));
      const reached = new Set<string>();
      const frontier = b.rootCounts.filter((change) => change.delta > 0).map((change) => hex(change.key));
      while (frontier.length > 0) {
        const key = frontier.pop() as string;
        const node = byKey.get(key);
        if (reached.has(key) || node === undefined) continue;
        reached.add(key);
        for (const ref of childRefKeys(node.children)) frontier.push(hex(ref));
      }
      expect(keysOf(b).filter((key) => !reached.has(key)), `${h}`).toEqual([]);
    }
    expect([...forms].filter(([, lists]) => lists.size > 1).map(([key]) => key)).toEqual([]);
    expect(writtenAgain).toEqual({ [AGAIN]: [hex(extendedCases(AGAIN).again.node.key)] });
    const c = extendedCases(LAST);
    for (const node of [c.shared.node, c.repeated.node, c.embedded.node, ...c.embedded.leaves, c.again.node]) expect(forms.has(hex(node.key))).toBe(true);
    for (const node of gone(LAST)) expect(forms.has(hex(node.key))).toBe(false);
  });

  it("a fresh package refuses a stored state that lacks a row or holds a row whose content is not its key; keeping is refused without the extended DAG", async () => {
    const run = driver(await packageOf({ dag: "extended" })).to(TO_REF, [TO_REF]);
    const rows = run.kept.get(TO_REF) as Map<string, StoredNode>;
    const { leaves } = extendedCases(TO_REF).embedded;
    const lacking = new Map(rows);
    lacking.delete(hex(leaves[1].key));
    await expect(packageOf({ dag: "extended" }).then((pkg) => pkg.load(rootKey(TO_REF), storeOf(lacking)))).rejects.toThrow(
      new RegExp(`lacks node ${hex(leaves[1].key)}`),
    );
    const changed = new Map(rows);
    const leaf = rows.get(hex(leaves[1].key)) as StoredNode;
    const data = Uint8Array.from(leaf.data);
    data[0] = (data[0] ?? 0) ^ 1;
    changed.set(hex(leaf.key), { ...leaf, data });
    await expect(packageOf({ dag: "extended" }).then((pkg) => pkg.load(rootKey(TO_REF), storeOf(changed)))).rejects.toThrow(
      new RegExp(`${hex(leaves[1].key)} .*not its key`),
    );
    await expect(packageOf({ keeping: "keeps-old-copy" })).rejects.toThrow(/keeping .* extended DAG/);
  });
});
