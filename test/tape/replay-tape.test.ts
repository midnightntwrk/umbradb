import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type ConnectSocket, connectWebSocket } from "../../src/node/index.js";
import { recordRange, replayTape, type TapeRecord } from "../../tools/tape/index.js";
import { ScriptedNode } from "./scripted-node.js";
import { type SyntheticChain, syntheticChain } from "./synthetic-chain.js";

/**
 * The replay of a whole tape (`tools/tape/replay-tape.ts`), which shows that each tape replays against the tape node:
 * the node client of `src/node/` sends every call record's call, as recorded, to a tape node serving the tape — so
 * every recorded spelling is one the client sends unchanged —, receives each answer the record holds (an error record:
 * that error), then makes both head subscriptions and receives every recorded notification in order; the tape node
 * answered every request from its record (none `not-on-tape`, `repeated` or a fault). Each difference is named.
 */

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

let node: ScriptedNode;
let chain: SyntheticChain;
let records: readonly TapeRecord[] = [];

beforeAll(async () => {
  chain = syntheticChain({ length: 25, upgrades: [{ height: 4, specVersion: 1_000_000 }], registrations: 2 });
  node = await ScriptedNode.start(chain.script);
  ({ records } = await recordRange({ node: node.url, from: 0, to: 15, chunkHeights: 5, liveWindowMs: 20, connect: quietConnect }));
});
afterAll(async () => {
  await node.stop();
});

describe("replayTape", () => {
  it("replays every call and notification of a recorded tape through the node client, from the tape node", async () => {
    const replay = await replayTape({ records, concurrency: 4, connect: quietConnect });
    expect(replay.differences).toEqual([]);
    const callRecords = records.filter((record) => "method" in record && !("subscribe" in record));
    expect(replay.calls).toBe(callRecords.length);
    expect(replay.notifications).toBe(records.filter((record) => "notify" in record).length);
    expect(replay.subscriptions).toBe(2);
    expect(replay.outcomes).toEqual({ answered: callRecords.length, subscribed: 2 });
  });

  it("checks an error record's answer as the client reads it: its code and message", async () => {
    const error = { code: 4003, message: "Client error: UnknownBlock: State already discarded for 0x00" };
    const withError = records.map((record) =>
      "method" in record && record.method === "midnight_ledgerStateRoot" && (record.params as string[])[0] === chain.hashes[3]
        ? ({ method: record.method, params: record.params, error } as TapeRecord)
        : record,
    );
    const replay = await replayTape({ records: withError, connect: quietConnect });
    expect(replay.differences).toEqual([]);
  });

  it("names every answer that differs, when replayed against a node that answers otherwise", async () => {
    const other = syntheticChain({ length: 25, upgrades: [{ height: 4, specVersion: 1_000_000 }], registrations: 2, genesisSpecVersion: 22_001 });
    const elsewhere = await ScriptedNode.start(other.script);
    try {
      const replay = await replayTape({ records, url: elsewhere.url, connect: quietConnect });
      expect(replay.differences.length).toBeGreaterThan(0);
      expect(replay.differences[0]).toMatch(/^line \d+: chain_getHeader \["0x[0-9a-f]{64}"\] answered .+, where the tape records .+$/);
      expect(replay.outcomes).toEqual({});
    } finally {
      await elsewhere.stop();
    }
  });

  it("names a recorded notification that never came", async () => {
    const extra: TapeRecord[] = [...records];
    const subscribe = extra.find((record) => "subscribe" in record) as { subscribe: string };
    const h0 = chain.hashes[0] as string;
    extra.push({ notify: subscribe.subscribe, result: { parentHash: h0, number: "0x1", stateRoot: h0, extrinsicsRoot: h0, digest: { logs: [] } } });
    const quiet = await ScriptedNode.start(chain.script);
    try {
      const replay = await replayTape({ records: extra, url: quiet.url, notificationTimeoutMs: 500, connect: quietConnect });
      expect(replay.differences.at(-1)).toMatch(/^notifications: received \d+ of the \d+ recorded within 500 ms$/);
    } finally {
      await quiet.stop();
    }
  });

  it("names a call the client cannot make, a recorded error answered with a result, and a call that failed", async () => {
    const h0 = chain.hashes[0] as string;
    const failing = syntheticChain({
      length: 25,
      fault: (method) => (method === "chain_getBlock" ? { error: { code: -32001, message: "boom" } } : undefined),
    });
    const node = await ScriptedNode.start(failing.script);
    try {
      const replay = await replayTape({
        records: [
          { method: "system_version", params: [], result: "0.0.0" },
          { method: "chain_getBlockHash", params: [0], error: { code: -32000, message: "gone" } },
          { method: "chain_getBlock", params: [h0], result: { block: {} } },
        ],
        url: node.url,
        connect: quietConnect,
      });
      expect(replay.differences).toEqual([
        "line 1: system_version [] is not a call the node client makes",
        `line 2: chain_getBlockHash [0] answered "${h0}", where the tape records the error {"code":-32000,"message":"gone"}`,
        `line 3: chain_getBlock ["${h0}"] failed: node-error: chain_getBlock: the node answered with an error: -32001 boom, where the tape records {"block":{}}`,
      ]);
    } finally {
      await node.stop();
    }
  });

  it("names a notification that differs from the recorded one", async () => {
    const other = syntheticChain({ length: 25, notifications: 2, unlinkedAt: 24 });
    const node = await ScriptedNode.start(other.script);
    try {
      const live = records.filter((record) => "subscribe" in record || "notify" in record);
      const replay = await replayTape({ records: live, url: node.url, connect: quietConnect });
      expect(replay.differences.some((text) => /^chain_subscribe(New|Finalized)Heads's notification \d+ was .+, where the tape records .+$/.test(text))).toBe(
        true,
      );
    } finally {
      await node.stop();
    }
  });

  it("names requests the tape node did not answer from a call record (a fault the pair meets first)", async () => {
    const h1 = chain.hashes[1] as string;
    const replay = await replayTape({
      records: [
        { fault: "error", method: "chain_getBlockHash", params: [1], code: -32603 },
        { method: "chain_getBlockHash", params: [1], result: h1 },
      ],
      connect: quietConnect,
    });
    expect(replay.differences).toEqual([
      `line 2: chain_getBlockHash [1] failed: node-error: chain_getBlockHash: the node answered with an error: -32603 tape fault: chain_getBlockHash, where the tape records "${h1}"`,
      "the tape node answered 1 requests fault-error",
    ]);
    expect(replay.outcomes).toEqual({ "fault-error": 1 });
  });
});

