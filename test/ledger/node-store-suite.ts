import { afterEach, describe, expect, it } from "vitest";
import { runInFreshInstance, type StoredNode } from "./fresh-instance.js";
import {
  type Child,
  childKey,
  decodeChild,
  decodeChildren,
  encodeChildren,
  free,
  hasEmbeddedChild,
  hex,
  refsOf,
  storedNodeKey,
  taggedRootKey,
} from "./node-format.js";

// The node-store exports the vendored ledger packages add to the published ones, exercised on the built package the
// same way for every ledger version. Expected keys come from the independent node-format implementation in
// node-format.ts and from the packages' own published serialization (`serialize()`), never from the exports under test.
// [LG-6, LG-11, LG-13, LG-14; design §5.1-§5.3]

export interface NodeBatch {
  inserts: StoredNode[];
  rootCounts: { key: Uint8Array; delta: number }[];
}

/** A ledger object with its published serialization; freed with `free` from node-format.ts. */
export interface Disposable {
  serialize(): Uint8Array;
}

export interface NodeStoreExports<S> {
  stateRoot(state: S): Uint8Array;
  stateKey(state: S): Uint8Array;
  flushNodes(): NodeBatch;
  persistKey(key: Uint8Array): void;
  releaseKey(key: Uint8Array): void;
  childRefs(children: Uint8Array): Uint8Array[];
  evictKeys(keys: Uint8Array[]): void;
  contractStateKey(state: S, address: Uint8Array): Uint8Array | null;
  contractZswapStateKey(state: S, address: Uint8Array): Uint8Array | null;
}

export interface NodeStoreSubject<S extends Disposable> {
  /** The path of the package's Node.js entry, for fresh instances in worker threads. */
  packagePath: string;
  /** The tag of the package's ledger state (`ledger-state[vN]`). */
  stateTag: string;
  api: NodeStoreExports<S>;
  /** A state with one contract, at `contractAddress(seed)`, whose content depends on `seed`. */
  makeState(seed: string): S;
  contractAddress(seed: string): Uint8Array;
  /** The published tagged serialization of the contract's state in `state` (`LedgerState.index(…).serialize()`). */
  contractStateSerialized(state: S, address: Uint8Array): Uint8Array;
  /** The published tagged serialization of an empty zswap state (`new ZswapChainState().serialize()`). */
  emptyZswapStateSerialized(): Uint8Array;
}

const sortedHex = (keys: Uint8Array[]): string[] => keys.map(hex).sort();

export function describeNodeStoreExports<S extends Disposable>(name: string, subject: NodeStoreSubject<S>): void {
  const { api } = subject;
  // Everything this instance flushed so far: the store a caller would have written.
  const store = new Map<string, StoredNode>();
  const live: Disposable[] = [];
  const track = <T extends Disposable>(object: T): T => {
    live.push(object);
    return object;
  };
  const state = (seed: string): S => track(subject.makeState(seed));
  const flush = (): NodeBatch => {
    const batch = api.flushNodes();
    for (const node of batch.inserts) store.set(hex(node.key), node);
    return batch;
  };

  afterEach(() => {
    for (const object of live.splice(0)) free(object);
    flush();
  });

  describe(`${name}: the node-store exports`, () => {
    it("stateRoot is the serialized key of the state's root and stateKey is that key", () => {
      const s = state("root");
      const published = taggedRootKey(s.serialize());
      expect(published.tag).toBe(subject.stateTag);

      const root = api.stateRoot(s);
      expect(hex(childKey(decodeChild(root)))).toBe(hex(published.key));
      expect(hex(api.stateKey(s))).toBe(hex(published.key));
      expect(api.stateKey(s)).toHaveLength(32);

      expect(hex(api.stateRoot(s))).toBe(hex(root));
      expect(hex(api.stateRoot(state("root")))).toBe(hex(root));
      expect(hex(api.stateRoot(state("other")))).not.toBe(hex(root));
    });

    it("flushNodes takes the new nodes a persisted key reaches, each stored under its own key", { timeout: 120_000 }, async () => {
      const s = state("flush");
      const key = api.stateKey(s);
      api.persistKey(key);
      const batch = flush();

      expect(batch.rootCounts.map((c) => [hex(c.key), c.delta])).toEqual([[hex(key), 1]]);
      const insertKeys = batch.inserts.map((node) => hex(node.key));
      expect(insertKeys).toContain(hex(key));
      expect(insertKeys).toEqual([...insertKeys].sort());
      expect(new Set(insertKeys).size).toBe(insertKeys.length);
      for (const node of batch.inserts) {
        expect(hex(storedNodeKey(node.data, node.children))).toBe(hex(node.key));
        for (const ref of refsOf(decodeChildren(node.children))) expect(store.has(hex(ref))).toBe(true);
      }
      const again = flush();
      expect(again.inserts).toEqual([]);
      expect(again.rootCounts).toEqual([]);

      const loaded = await runInFreshInstance({
        packagePath: subject.packagePath,
        op: "load",
        key,
        nodes: [...store.values()],
      });
      expect(loaded.error).toBeUndefined();
      expect(hex(loaded.stateRoot!)).toBe(hex(api.stateRoot(s)));
      expect(hex(loaded.stateKey!)).toBe(hex(key));
      expect(loaded.requested[0]).toBe(hex(key));
      expect(loaded.readsBeforeSerialize).toBe(1);
      expect(hex(loaded.serialized!)).toBe(hex(s.serialize()));
    });

    it("loadState fails on a missing state and on a stored node that does not match its key", { timeout: 120_000 }, async () => {
      const s = state("tamper");
      const key = api.stateKey(s);
      api.persistKey(key);
      const batch = flush();
      const nodes = [...store.values()];

      const missing = await runInFreshInstance({ packagePath: subject.packagePath, op: "load", key, nodes: [] });
      expect(missing.error).toMatch(/has no node/);

      const tamperedRoot = await runInFreshInstance({
        packagePath: subject.packagePath,
        op: "load",
        key,
        nodes,
        tamper: hex(key),
      });
      expect(tamperedRoot.error).toBeDefined();
      expect(tamperedRoot.stateRoot).toBeUndefined();

      const child = batch.inserts.find((node) => hex(node.key) !== hex(key));
      expect(child).toBeDefined();
      const tamperedChild = await runInFreshInstance({
        packagePath: subject.packagePath,
        op: "load",
        key,
        nodes,
        tamper: hex(child!.key),
      });
      expect(tamperedChild.error).toBeDefined();
      expect(tamperedChild.requested).toContain(hex(child!.key));
      expect(tamperedChild.serialized).toBeUndefined();
    });

    it("persistKey and releaseKey report each key's net root-count change", () => {
      const k1 = api.stateKey(state("count-1"));
      const k2 = api.stateKey(state("count-2"));
      const k3 = api.stateKey(state("count-3"));
      api.persistKey(k1);
      api.persistKey(k1);
      api.persistKey(k2);
      api.releaseKey(k2);
      api.releaseKey(k3);
      const batch = flush();

      const expected = [
        [hex(k1), 2],
        [hex(k3), -1],
      ].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      expect(batch.rootCounts.map((c) => [hex(c.key), c.delta])).toEqual(expected);
      const insertKeys = batch.inserts.map((node) => hex(node.key));
      expect(insertKeys).toContain(hex(k1));
      expect(insertKeys).not.toContain(hex(k2));
      expect(insertKeys).not.toContain(hex(k3));

      expect(() => api.persistKey(k1.subarray(0, 31))).toThrow(/32 bytes/);
      expect(() => api.releaseKey(new Uint8Array(33))).toThrow(/32 bytes/);
    });

    it("childRefs lists the by-reference keys of a child list, through embedded children", () => {
      const [a, b, c] = ["a", "b", "c"].map((x) => Uint8Array.from(Buffer.alloc(32, x)));
      const list: Child[] = [
        { ref: a! },
        { direct: { data: Uint8Array.of(1, 2), children: [{ ref: b! }, { direct: { data: Uint8Array.of(), children: [{ ref: c! }] } }] } },
      ];
      const bytes = encodeChildren(list);
      expect(sortedHex(api.childRefs(bytes))).toEqual(sortedHex([a!, b!, c!]));
      expect(api.childRefs(encodeChildren([]))).toEqual([]);
      expect(() => api.childRefs(bytes.subarray(0, bytes.length - 1))).toThrow();
      expect(() => api.childRefs(Uint8Array.from([...bytes, 0]))).toThrow();

      const s = state("refs");
      api.persistKey(api.stateKey(s));
      const batch = flush();
      const embedding = batch.inserts.filter((node) => hasEmbeddedChild(decodeChildren(node.children)));
      expect(embedding.length).toBeGreaterThan(0);
      for (const node of batch.inserts) {
        expect(sortedHex(api.childRefs(node.children))).toEqual(sortedHex(refsOf(decodeChildren(node.children))));
      }
    });

    it("evictKeys makes a node the store deleted be flushed again when it is needed again", () => {
      const s = subject.makeState("evict");
      const key = api.stateKey(s);
      api.persistKey(key);
      const first = flush();
      const firstKeys = first.inserts.map((node) => node.key);
      expect(firstKeys.length).toBeGreaterThan(1);

      // A node a live object holds must not be deleted.
      expect(() => api.evictKeys(firstKeys)).toThrow(/still held by a live object/);
      free(s);

      // Control: without evicting, the same content is known as stored and nothing is flushed again.
      const control = subject.makeState("evict");
      api.persistKey(api.stateKey(control));
      expect(flush().inserts).toEqual([]);
      free(control);

      api.evictKeys(firstKeys);
      const again = subject.makeState("evict");
      api.persistKey(api.stateKey(again));
      const second = flush();
      free(again);
      expect(sortedHex(second.inserts.map((node) => node.key))).toEqual(sortedHex(firstKeys));
      expect(() => api.evictKeys([new Uint8Array(31)])).toThrow(/32 bytes/);
    });

    it("contractStateKey and contractZswapStateKey give stored nodes for a contract's state and zswap state", () => {
      const s = state("contract");
      const address = subject.contractAddress("contract");
      const elsewhere = subject.contractAddress("nowhere");
      expect(api.contractStateKey(s, elsewhere)).toBeNull();
      expect(api.contractZswapStateKey(s, elsewhere)).toBeNull();

      const contractKey = api.contractStateKey(s, address)!;
      const zswapKey = api.contractZswapStateKey(s, address)!;
      expect(hex(contractKey)).toBe(hex(taggedRootKey(subject.contractStateSerialized(s, address)).key));
      expect(hex(zswapKey)).toBe(hex(taggedRootKey(subject.emptyZswapStateSerialized()).key));

      api.persistKey(contractKey);
      api.persistKey(zswapKey);
      const batch = flush();
      expect(batch.rootCounts.map((c) => hex(c.key)).sort()).toEqual(sortedHex([contractKey, zswapKey]));
      expect(store.has(hex(contractKey))).toBe(true);
      expect(store.has(hex(zswapKey))).toBe(true);
      for (const node of batch.inserts) expect(hex(storedNodeKey(node.data, node.children))).toBe(hex(node.key));

      expect(() => api.contractStateKey(s, new Uint8Array(31))).toThrow(/32 bytes/);
      expect(() => api.contractZswapStateKey(s, new Uint8Array(33))).toThrow(/32 bytes/);
    });
  });
}

/** Every stored node this test file's instance flushed, for building fresh-instance stores. */
export function nodesOf(batches: NodeBatch[]): StoredNode[] {
  const nodes = new Map<string, StoredNode>();
  for (const batch of batches) for (const node of batch.inserts) nodes.set(hex(node.key), node);
  return [...nodes.values()];
}
