import { describe, expect, it } from "vitest";
import type { StoredNode } from "../../src/ledger/types.js";
import {
  BRIDGE_LAYOUT,
  bridgeMemory,
  BridgeServer,
  bridgeStore,
  decodeNodes,
  encodeNodes,
  NODES_SQL,
} from "../../src/ledger/worker/node-bridge.js";
import { encodeChildren, hex } from "./node-format.js";

// The node-store bridge's two sides in one thread:
// - the worker's store, whose request this test answers at once inside `ask`, as the main thread would (the protocol
//   is written out here from the layout);
// - the main thread's server, given a reader.
// `worker-host.test.ts` runs them in two threads over a database. [LG-11; design §5.3]

const { STATE, LENGTH, STATUS, HEADER_BYTES, KEY_BYTES, ASKED, ANSWERED, NODES, ERROR, IDLE } = BRIDGE_LAYOUT;
const key = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const node = (byte: number, refs: number[] = [], size = 3): StoredNode => ({
  key: key(byte),
  data: new Uint8Array(size).fill(byte),
  children: encodeChildren(refs.map((ref) => ({ ref: key(ref) }))),
});

/** Answers the store's request at once with `nodes` (or `error`), as the main thread does. */
function answering(memory: SharedArrayBuffer, answer: (asked: Uint8Array) => StoredNode[] | string) {
  const control = new Int32Array(memory, 0, 4);
  const asked: string[] = [];
  return {
    asked,
    ask() {
      expect(Atomics.load(control, STATE)).toBe(ASKED);
      const wanted = new Uint8Array(memory, HEADER_BYTES, KEY_BYTES).slice();
      asked.push(hex(wanted));
      const result = answer(wanted);
      if (typeof result === "string") {
        const bytes = new TextEncoder().encode(result);
        new Uint8Array(memory, HEADER_BYTES).set(bytes);
        Atomics.store(control, STATUS, ERROR);
        Atomics.store(control, LENGTH, bytes.length);
      } else {
        Atomics.store(control, STATUS, NODES);
        Atomics.store(control, LENGTH, encodeNodes(result, new Uint8Array(memory), HEADER_BYTES));
      }
      Atomics.store(control, STATE, ANSWERED);
    },
  };
}

describe("the node-store bridge's two sides (design §5.3)", () => {
  it("encodes and decodes a node list, empty included", () => {
    const nodes = [node(1, [2, 3]), node(2, [], 0), node(3, [], 2000)];
    const target = new Uint8Array(10_000);
    const written = encodeNodes(nodes, target, 16);
    expect(decodeNodes(target, 16)).toEqual(nodes);
    expect(written).toBe(4 + nodes.reduce((sum, n) => sum + 32 + 8 + n.data.length + n.children.length, 0));
    encodeNodes([], target);
    expect(decodeNodes(target)).toEqual([]);
  });

  it("the store asks for a node, serves the referenced nodes sent with it without asking, and drops them at the next request", () => {
    const memory = bridgeMemory(4096);
    const side = answering(memory, (wanted) => (wanted[0] === 1 ? [node(1, [2, 3]), node(2), node(3)] : [node(wanted[0] as number)]));
    const store = bridgeStore(memory, side.ask);
    store.begin();
    expect(store.get(key(1))).toEqual({ data: node(1).data, children: node(1, [2, 3]).children });
    expect(store.get(key(2))).toEqual({ data: node(2).data, children: node(2).children });
    expect(store.get(key(3))?.data).toEqual(node(3).data);
    expect(side.asked).toEqual([hex(key(1))]);
    // A node served once is served from the store's side no more: asked again.
    expect(store.get(key(2))?.data).toEqual(node(2).data);
    expect(side.asked).toEqual([hex(key(1)), hex(key(2))]);
    expect(Atomics.load(new Int32Array(memory, 0, 4), STATE)).toBe(IDLE);
    // A new request drops what the last one was sent and did not use.
    store.get(key(1));
    store.begin();
    store.get(key(2));
    expect(side.asked.at(-1)).toBe(hex(key(2)));
    expect(store.lastError).toBeNull();
  });

  it("the store serves first the nodes the database does not hold yet (the pending block's), without asking", () => {
    const memory = bridgeMemory();
    const side = answering(memory, () => [node(5)]);
    const pending = new Map([[hex(key(4)), node(4)]]);
    const store = bridgeStore(memory, side.ask, (k) => pending.get(hex(k)));
    expect(store.get(key(4))?.data).toEqual(node(4).data);
    expect(side.asked).toEqual([]);
    expect(store.get(key(5))?.data).toEqual(node(5).data);
    expect(side.asked).toEqual([hex(key(5))]);
  });

  it("the store answers no node for a missing one, and for a failed read, whose error it keeps for the request", () => {
    const memory = bridgeMemory();
    let fail = false;
    const store = bridgeStore(memory, answering(memory, () => (fail ? "the read failed" : [])).ask);
    store.begin();
    expect(store.get(key(9))).toBeNull();
    expect(store.lastError).toBeNull();
    fail = true;
    expect(store.get(key(9))).toBeNull();
    expect(store.lastError).toBe("the read failed");
    store.begin();
    expect(store.lastError).toBeNull();
  });

  describe("the server", () => {
    /** A reader over `stored`, recording each statement's keys. */
    const reader = (stored: StoredNode[], rows?: (keys: Uint8Array[]) => Record<string, unknown>[]) => {
      const queries: string[][] = [];
      return {
        queries,
        async query(sql: string, params: unknown[] = []) {
          expect(sql).toBe(NODES_SQL);
          const keys = params[0] as Uint8Array[];
          queries.push(keys.map(hex));
          if (rows !== undefined) return rows(keys);
          return stored
            .filter((n) => keys.some((k) => hex(k) === hex(n.key)))
            .reverse()
            .map((n) => ({ node_key: n.key, data: n.data, children: n.children }));
        },
      };
    };
    const ask = (memory: SharedArrayBuffer, wanted: Uint8Array): void => {
      new Uint8Array(memory, HEADER_BYTES, KEY_BYTES).set(wanted);
      Atomics.store(new Int32Array(memory, 0, 4), STATE, ASKED);
    };
    const answerOf = (memory: SharedArrayBuffer) => {
      const control = new Int32Array(memory, 0, 4);
      expect(Atomics.load(control, STATE)).toBe(ANSWERED);
      const length = Atomics.load(control, LENGTH);
      const bytes = new Uint8Array(memory, HEADER_BYTES, length).slice();
      return Atomics.load(control, STATUS) === ERROR ? new TextDecoder().decode(bytes) : decodeNodes(bytes);
    };

    it("answers a node and its referenced nodes, in the child list's order, each key once, and counts", async () => {
      const memory = bridgeMemory();
      const server = new BridgeServer(memory);
      const read = reader([node(1, [3, 2, 3, 7]), node(2), node(3)]);
      ask(memory, key(1));
      await server.answer(read);
      expect((answerOf(memory) as StoredNode[]).map((n) => n.key[0])).toEqual([1, 3, 2]);
      expect(read.queries).toEqual([[hex(key(1))], [hex(key(3)), hex(key(2)), hex(key(7))]]);
      expect(server.stats).toEqual({ requests: 1, nodes: 3 });
      // A node with no references: one statement; a missing node: an empty answer.
      ask(memory, key(2));
      await server.answer(read);
      expect(answerOf(memory)).toEqual([node(2)]);
      ask(memory, key(5));
      await server.answer(read);
      expect(answerOf(memory)).toEqual([]);
      expect(read.queries).toHaveLength(4);
    });

    it("does nothing unless asked", async () => {
      const memory = bridgeMemory();
      const server = new BridgeServer(memory);
      await server.answer(reader([]));
      expect(Atomics.load(new Int32Array(memory, 0, 4), STATE)).toBe(IDLE);
      expect(server.stats.requests).toBe(0);
    });

    it("answers an error for a request given no read, rows that are not bytes and a failed statement", async () => {
      const memory = bridgeMemory();
      const server = new BridgeServer(memory);
      ask(memory, key(1));
      await server.answer(null);
      expect(answerOf(memory)).toMatch(/^no read is open for the ledger worker's request: node 0101/);
      ask(memory, key(1));
      await server.answer(reader([], () => [{ node_key: "x", data: new Uint8Array(1), children: new Uint8Array(1) }]));
      expect(answerOf(memory)).toMatch(/node_key is not bytes/);
      ask(memory, key(1));
      await server.answer({ query: async () => Promise.reject(new Error("connection-lost")) });
      expect(answerOf(memory)).toBe("connection-lost");
      ask(memory, key(1));
      await server.answer({ query: async () => Promise.reject("a string") });
      expect(answerOf(memory)).toBe("a string");
    });

    it("grows for an answer larger than its memory, leaves out referenced nodes over its largest size, refuses a node over it", async () => {
      const memory = bridgeMemory(64, 8_192);
      const server = new BridgeServer(memory);
      const read = reader([node(1, [2, 3], 3_000), node(2, [], 3_000), node(3, [], 3_000), node(4, [], 9_000)]);
      ask(memory, key(1));
      await server.answer(read);
      expect((answerOf(memory) as StoredNode[]).map((n) => n.key[0])).toEqual([1, 2]);
      expect(memory.byteLength).toBeGreaterThan(6_000);
      ask(memory, key(4));
      await server.answer(read);
      expect(answerOf(memory)).toMatch(/is larger than the bridge's 8192 bytes/);
    });
  });
});
