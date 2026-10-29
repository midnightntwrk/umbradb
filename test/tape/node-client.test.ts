import { performance } from "node:perf_hooks";
import { afterAll, describe, expect, it } from "vitest";
import {
  type ConnectSocket,
  connectWebSocket,
  NodeClient,
  type NodeClientOptions,
  type NodeHeader,
  type NodeRetry,
} from "../../src/node/index.js";
import { type Json, type TapeCall, TapeNode, type TapeRecord } from "../../tools/tape/index.js";
import { outsideIn8 } from "../node/in8.js";
import { ManualTimers, until } from "../node/manual-timers.js";
import { manualClock } from "./checks.js";

/**
 * The tape node's rules through the node client of `src/node/`, unchanged, so that the tape node and the client cannot
 * drift apart: answers by occurrence, `not-on-tape` read as a `node-error` that is never retried, `delayMs`, headers
 * delivered after the calls recorded before them, a `disconnect` followed by the client's reconnect and new
 * subscription, and both kinds of `fault`. The client's clock is moved by hand (`ManualTimers`, shared with the tape
 * node where a delay is checked), and its WebSocket transport is the real one with its heartbeat moved out of the way
 * (the transport's own tests cover it). [A69, A70 CI, TT-1 to TT-3; acceptance §9]
 *
 * Last, every request the tape nodes of this file received is checked to be one of the allowed node calls. [IN-8]
 */

const HOUR = 3_600_000;
const TEST_TIMEOUT_MS = 60_000;

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 1_000_000 * HOUR });

/** Every request every tape node of this file received. */
const received: TapeCall[] = [];

const hash = (n: number): string => `0x${n.toString(16).padStart(64, "0")}`;
const bytes = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text.slice(2), "hex"));

function headerJson(n: number): Json {
  return {
    parentHash: hash(n + 1000),
    number: `0x${n.toString(16)}`,
    stateRoot: hash(n + 2000),
    extrinsicsRoot: hash(n + 3000),
    digest: { logs: [] },
  };
}

/** Runs `body` with a tape node serving `records` and a node client of it, closing both and keeping the node's log. */
async function withClient(
  records: readonly TapeRecord[],
  body: (client: NodeClient, node: TapeNode, timers: ManualTimers) => Promise<void>,
  options: { readonly shareClock?: boolean; readonly client?: Partial<NodeClientOptions> } = {},
): Promise<void> {
  const timers = new ManualTimers();
  const node = await TapeNode.start(options.shareClock ? { records, clock: manualClock(timers) } : { records });
  const client = new NodeClient({ url: node.url, timers, connect: quietConnect, ...options.client });
  try {
    await body(client, node, timers);
  } finally {
    await client.close();
    await node.close();
    received.push(...node.calls);
  }
}

afterAll(() => {
  // The client sends only the allowed node calls, so a tape node never sees another (the CI half of the sync's check,
  // for these sessions). [IN-8, A83]
  expect(received.length).toBeGreaterThan(20);
  expect(outsideIn8(received.map((call) => call.method as string))).toEqual([]);
});

describe("A69 through the node client", { timeout: TEST_TIMEOUT_MS }, () => {
  it("TT-2's scenario: heads A, B, C recorded, four finalizedHead() calls read A, B, C, C", async () => {
    const records: TapeRecord[] = [1, 2, 3].map((n) => ({
      method: "chain_getFinalizedHead",
      params: [],
      result: hash(n),
    }));
    await withClient(records, async (client) => {
      const heads: Uint8Array[] = [];
      for (let call = 0; call < 4; call++) heads.push(await client.finalizedHead());
      expect(heads).toEqual([bytes(hash(1)), bytes(hash(2)), bytes(hash(3)), bytes(hash(3))]);
    });
  });

  it("answers blockHash(h) by the occurrence of each height", async () => {
    const records: TapeRecord[] = [
      { method: "chain_getBlockHash", params: [1], result: hash(11) },
      { method: "chain_getBlockHash", params: [2], result: hash(21) },
      { method: "chain_getBlockHash", params: [1], result: hash(12) },
    ];
    await withClient(records, async (client, node) => {
      const read = [1n, 2n, 1n, 1n, 2n].map((height) => client.blockHash(height));
      expect(await Promise.all(read)).toEqual([hash(11), hash(21), hash(12), hash(12), hash(21)].map(bytes));
      const outcomes = node.calls.map((call) => call.outcome);
      expect(outcomes).toEqual(["answered", "answered", "answered", "repeated", "repeated"]);
    });
  });

  it("reads not-on-tape as a node-error naming the method, and never retries it", async () => {
    await withClient([{ method: "chain_getBlockHash", params: [1], result: hash(1) }], async (client, node, timers) => {
      const error = await client.blockHash(7n).catch((caught: unknown) => caught);
      expect(error).toMatchObject({
        code: "node-error",
        retryable: false,
        details: {
          method: "chain_getBlockHash",
          reason: "rpc-error",
          rpcCode: -32090,
          rpcMessage: "not-on-tape: chain_getBlockHash",
        },
      });
      await timers.advance(HOUR);
      expect(node.count("chain_getBlockHash", [7])).toBe(1);
      expect(client.retrying).toBe(false);
    });
  });

  it("answers a delayed record when the shared clock reaches its delay, and the next record at once", async () => {
    const records: TapeRecord[] = [
      { method: "chain_getFinalizedHead", params: [], result: hash(1), delayMs: 2000 },
      { method: "chain_getBlockHash", params: [5], result: hash(5) },
    ];
    await withClient(
      records,
      async (client, node, timers) => {
        let head: Uint8Array | undefined;
        void client.finalizedHead().then((value) => {
          head = value;
        });
        await until(() => node.calls.length === 1, "the delayed call");
        expect(await client.blockHash(5n)).toEqual(bytes(hash(5)));
        await expect(client.blockHash(99n)).rejects.toMatchObject({ code: "node-error" });
        expect(head).toBeUndefined();
        await timers.advance(1999);
        await expect(client.blockHash(99n)).rejects.toMatchObject({ code: "node-error" });
        expect(head).toBeUndefined();
        await timers.advance(1);
        await until(() => head !== undefined, "the delayed answer");
        expect(head).toEqual(bytes(hash(1)));
      },
      { shareClock: true },
    );
  });

  it("on the real clock, a 2000 ms record is read no earlier than 2000 ms after the call", async () => {
    const records: TapeRecord[] = [{ method: "chain_getFinalizedHead", params: [], result: hash(1), delayMs: 2000 }];
    const node = await TapeNode.start({ records });
    const client = new NodeClient({ url: node.url });
    try {
      const sent = performance.now();
      expect(await client.finalizedHead()).toEqual(bytes(hash(1)));
      expect(performance.now() - sent).toBeGreaterThanOrEqual(2000);
    } finally {
      await client.close();
      await node.close();
      received.push(...node.calls);
    }
  });

  it("reads a recorded 'state already discarded' error as IN-9's node-requirement, unretried", async () => {
    const error = { code: 4003, message: `Client error: UnknownBlock: State already discarded for ${hash(9)}` };
    const records: TapeRecord[] = [
      { method: "state_getStorage", params: ["0x01", hash(9)], error },
      { method: "chain_getBlockHash", params: [3], result: null },
    ];
    await withClient(records, async (client, node, timers) => {
      await expect(client.storage(Uint8Array.of(1), bytes(hash(9)))).rejects.toMatchObject({
        code: "node-requirement",
        details: { reason: "state-unavailable" },
      });
      await expect(client.blockHash(3n)).rejects.toMatchObject({ code: "node-requirement" });
      await timers.advance(HOUR);
      expect(node.calls).toHaveLength(2);
    });
  });
});

describe("A70 through the node client", { timeout: TEST_TIMEOUT_MS }, () => {
  it("delivers headers in file order, each only after the calls recorded before it", async () => {
    const records: TapeRecord[] = [
      { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
      { method: "chain_getFinalizedHead", params: [], result: hash(1) },
      { notify: "s", result: headerJson(1) },
      { method: "chain_getBlockHash", params: [1], result: hash(1) },
      { notify: "s", result: headerJson(2) },
      { notify: "s", result: headerJson(3) },
    ];
    await withClient(records, async (client) => {
      const heights: bigint[] = [];
      await client.subscribeNewHeads({ header: (header: NodeHeader) => heights.push(header.number) });
      await expect(client.blockHash(99n)).rejects.toMatchObject({ code: "node-error" });
      expect(heights).toEqual([]);
      await client.finalizedHead();
      await until(() => heights.length === 1, "the first header");
      await expect(client.blockHash(99n)).rejects.toMatchObject({ code: "node-error" });
      expect(heights).toEqual([1n]);
      await client.blockHash(1n);
      await until(() => heights.length === 3, "the other headers");
      expect(heights).toEqual([1n, 2n, 3n]);
    });
  });

  it("TT-3's scenario: two headers, the drop, the client's reconnect and new subscription, two more", async () => {
    const records: TapeRecord[] = [
      { subscribe: "a", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: "a", result: headerJson(1) },
      { notify: "a", result: headerJson(2) },
      { disconnect: true },
      { subscribe: "b", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: "b", result: headerJson(3) },
      { notify: "b", result: headerJson(4) },
    ];
    const retries: NodeRetry[] = [];
    await withClient(
      records,
      async (client, node, timers) => {
        const events: string[] = [];
        await client.subscribeFinalizedHeads({
          header: (header) => events.push(`header ${header.number}`),
          restarted: () => events.push("restarted"),
          error: (error) => events.push(`error ${String(error)}`),
        });
        await until(() => retries.length === 1, "the dropped connection");
        expect(events).toEqual(["header 1", "header 2"]);
        expect(retries[0]).toMatchObject({ operation: "connect", attempt: 1, delayMs: 1000 });
        expect(retries[0]?.error).toMatchObject({ code: "node-unreachable", details: { reason: "connection-closed" } });
        await timers.advance(1000);
        await until(() => events.length === 5, "the second session's headers");
        expect(events).toEqual(["header 1", "header 2", "restarted", "header 3", "header 4"]);
        expect(node.calls.map((call) => [call.session, call.method, call.outcome])).toEqual([
          [1, "chain_subscribeFinalizedHeads", "subscribed"],
          [2, "chain_subscribeFinalizedHeads", "subscribed"],
        ]);
      },
      { client: { onRetry: (retry) => retries.push(retry) } },
    );
  });

  it("an outage is a run of disconnects: each connection dropped at once, the client waits 1 s then 2 s", async () => {
    const records: TapeRecord[] = [
      { disconnect: true },
      { disconnect: true },
      { method: "chain_getFinalizedHead", params: [], result: hash(1) },
    ];
    const retries: NodeRetry[] = [];
    await withClient(
      records,
      async (client, node, timers) => {
        let head: Uint8Array | undefined;
        void client.finalizedHead().then((value) => {
          head = value;
        });
        const connects = () => retries.filter((retry) => retry.operation === "connect");
        await until(() => connects().length === 1, "the first drop");
        await timers.advance(1000);
        await until(() => connects().length === 2, "the second drop");
        await timers.advance(2000);
        await until(() => head !== undefined, "the answer after the outage");
        expect(head).toEqual(bytes(hash(1)));
        expect(connects().map((retry) => retry.delayMs)).toEqual([1000, 2000]);
        expect(node.connections).toBe(3);
        expect(node.calls.filter((call) => call.outcome === "answered")).toHaveLength(1);
      },
      { client: { onRetry: (retry) => retries.push(retry) } },
    );
  });

  it("a timeout fault: the try times out, and the retry 1 s later reads the next record", async () => {
    const records: TapeRecord[] = [
      { fault: "timeout", method: "chain_getFinalizedHead", params: [] },
      { method: "chain_getFinalizedHead", params: [], result: hash(4) },
    ];
    const retries: NodeRetry[] = [];
    await withClient(
      records,
      async (client, node, timers) => {
        let head: Uint8Array | undefined;
        void client.finalizedHead().then((value) => {
          head = value;
        });
        await until(() => node.calls.length === 1, "the first try");
        await timers.advance(4999);
        expect(retries).toEqual([]);
        await timers.advance(1);
        await until(() => retries.length === 1, "the timeout");
        expect(retries[0]).toMatchObject({ operation: "chain_getFinalizedHead", attempt: 1, delayMs: 1000 });
        expect(retries[0]?.error).toMatchObject({ code: "node-unreachable", details: { reason: "timeout" } });
        await timers.advance(1000);
        await until(() => head !== undefined, "the retried answer");
        expect(head).toEqual(bytes(hash(4)));
        expect(node.calls.map((call) => call.outcome)).toEqual(["fault-timeout", "answered"]);
        expect(node.connections).toBe(1);
      },
      { client: { callTimeoutMs: 5000, onRetry: (retry) => retries.push(retry) } },
    );
  });

  it("an error fault fails the call with its code: a node-error halts, the rate limit is retried", async () => {
    const records: TapeRecord[] = [
      { fault: "error", method: "chain_getBlockHash", params: [5], code: -32000 },
      { fault: "error", method: "chain_getBlockHash", params: [6], code: -32999 },
      { method: "chain_getBlockHash", params: [6], result: hash(6) },
    ];
    await withClient(records, async (client, node, timers) => {
      await expect(client.blockHash(5n)).rejects.toMatchObject({
        code: "node-error",
        details: { reason: "rpc-error", rpcCode: -32000, rpcMessage: "tape fault: chain_getBlockHash" },
      });
      let six: Uint8Array | undefined;
      void client.blockHash(6n).then((value) => {
        six = value;
      });
      await until(() => client.retrying, "the rate-limited retry");
      await timers.advance(1000);
      await until(() => six !== undefined, "the answer after the rate limit");
      expect(six).toEqual(bytes(hash(6)));
      await timers.advance(HOUR);
      expect(node.count("chain_getBlockHash", [5])).toBe(1);
      expect(node.count("chain_getBlockHash", [6])).toBe(2);
    });
  });
});
