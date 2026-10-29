import { afterEach, describe, expect, it } from "vitest";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import {
  checkTape,
  completenessProblems,
  EVENTS_KEY,
  KEYS_PAGE,
  recordRange,
  type RangeOptions,
  REGISTRATION_PREFIXES,
  TapeNode,
  type TapeRecord,
  writeTape,
} from "../../tools/tape/index.js";
import { ScriptedNode, type Script } from "./scripted-node.js";
import { EVENTS_STORAGE as EVENTS, MAPPING_PREFIX, MAPPINGS_PREFIX, syntheticChain } from "./synthetic-chain.js";

/**
 * The recording driver (`tools/tape/range.ts`): through the recording builder, the node client of `src/node/` makes
 * every allowed node call for every height of a range — `chain_getBlockHash(h)`, then `chain_getHeader`,
 * `chain_getBlock`, `state_getRuntimeVersion`, `state_getStorage(System.Events)` and `midnight_ledgerStateRoot` at its
 * hash —, `state_getMetadata` at the range's first block and wherever the state's runtime changes, block 0's
 * `system_properties` and cNight registrations, and then, for a live window, the finalized head and both head
 * subscriptions; in chunks of heights, each one connection (one session) recorded again after a back-off when it fails,
 * so the tape is one session that any client making any subset of those calls replays. Every node here is a synthetic
 * chain on the scripted node (`./synthetic-chain.ts`); no Midnight node. [Q123, IN-7, IN-8]
 */

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

const nodes: ScriptedNode[] = [];
afterEach(async () => {
  for (const node of nodes.splice(0)) await node.stop();
});

async function started(script: Script): Promise<ScriptedNode> {
  const node = await ScriptedNode.start(script);
  nodes.push(node);
  return node;
}

/** A sleep that waits for nothing and remembers what it was asked. */
function noSleep(): { readonly waits: number[]; sleep: (ms: number) => Promise<void> } {
  const waits: number[] = [];
  return { waits, sleep: async (ms) => void waits.push(ms) };
}

const calls = (records: readonly TapeRecord[], method: string) =>
  records.filter((record) => "method" in record && !("subscribe" in record) && !("fault" in record) && record.method === method) as {
    method: string;
    params: unknown[];
    result: unknown;
  }[];

describe("recordRange: every IN-8 call of every height, through the builder (Q123)", () => {
  it("records each height's calls, metadata where the runtime changes, block 0's calls and the live window, in one session", async () => {
    const chain = syntheticChain({
      length: 40,
      upgrades: [
        { height: 17, specVersion: 1_000_300 },
        { height: 18, specVersion: 2_000_000 },
      ],
      registrations: 5,
    });
    const node = await started(chain.script);
    const lines: string[] = [];
    const { records, stats } = await recordRange({
      node: node.url,
      from: 0,
      to: 30,
      chunkHeights: 8,
      concurrency: 3,
      liveWindowMs: 50,
      keysPage: 2,
      connect: quietConnect,
      log: (line) => lines.push(line),
    });
    checkTape(records);
    expect(() => writeTape(records)).not.toThrow();
    expect(completenessProblems(records, { from: 0, to: 30, keysPage: 2 })).toEqual([]);
    // One session: no disconnect, no fault, no error answer.
    expect(records.some((record) => "disconnect" in record || "fault" in record || "error" in record)).toBe(false);
    // Each height once, as the node client spells it: the height a JSON number, hashes lowercase 0x hex.
    expect(calls(records, "chain_getBlockHash").map((call) => call.params)).toEqual(
      expect.arrayContaining(Array.from({ length: 31 }, (_, height) => [height])),
    );
    expect(calls(records, "chain_getBlockHash")).toHaveLength(31);
    for (const method of ["chain_getBlock", "state_getRuntimeVersion", "midnight_ledgerStateRoot"]) {
      expect(calls(records, method).map((call) => call.params).sort(), method).toEqual(
        chain.hashes.slice(0, 31).map((hash) => [hash]).sort(),
      );
    }
    // chain_getHeader: every height of the range, and the finalized head of the live window (height 39).
    expect(calls(records, "chain_getHeader").map((call) => call.params[0]).sort()).toEqual(
      [...chain.hashes.slice(0, 31), chain.hashes[39]].sort(),
    );
    const events = calls(records, "state_getStorage").filter((call) => call.params[0] === EVENTS);
    expect(events.map((call) => call.params[1]).sort()).toEqual([...chain.hashes.slice(0, 31)].sort());
    // Metadata at the range's first state and where the state's runtime changes: 0, 17 and 18.
    expect(calls(records, "state_getMetadata").map((call) => call.params)).toEqual([
      [chain.hashes[0]],
      [chain.hashes[17]],
      [chain.hashes[18]],
    ]);
    // Block 0: system_properties; both registration prefixes paged with the page size, then each key's value.
    expect(calls(records, "system_properties").map((call) => call.params)).toEqual([[]]);
    const pages = calls(records, "state_getKeysPaged").map((call) => call.params);
    const keys = chain.registrationKeys;
    expect(pages).toEqual([
      [MAPPINGS_PREFIX, 2, null, chain.hashes[0]],
      [MAPPINGS_PREFIX, 2, keys[1], chain.hashes[0]],
      [MAPPINGS_PREFIX, 2, keys[3], chain.hashes[0]],
      [MAPPING_PREFIX, 2, null, chain.hashes[0]],
    ]);
    const values = calls(records, "state_getStorage").filter((call) => call.params[0] !== EVENTS);
    expect(values.map((call) => call.params)).toEqual(keys.map((key) => [key, chain.hashes[0]]));
    // The live window: the finalized head read, both subscriptions and their notifications, last.
    const tail = records.slice(-8);
    expect(tail.filter((record) => "subscribe" in record).map((record) => (record as { method: string }).method).sort()).toEqual([
      "chain_subscribeFinalizedHeads",
      "chain_subscribeNewHeads",
    ]);
    expect(records.filter((record) => "notify" in record)).toHaveLength(4);
    expect(calls(records, "chain_getFinalizedHead")).toHaveLength(1);
    // Every request the node received is on the tape (the driver made no call outside the builder).
    const received = [...chain.requests.values()].reduce((total, list) => total + list.length, 0);
    expect(stats.requests).toBe(received);
    expect(records.filter((record) => !("notify" in record))).toHaveLength(received);
    expect(stats).toMatchObject({
      chunks: 4,
      retries: 0,
      runtimes: [
        { height: 0, specVersion: 22_000 },
        { height: 17, specVersion: 1_000_300 },
        { height: 18, specVersion: 2_000_000 },
      ],
      metadataHeights: [0, 17, 18],
      concurrency: 3,
    });
    expect(stats.requestsPerSecond).toBeGreaterThan(0);
    expect(stats.elapsedMs).toBeGreaterThan(0);
    expect(lines.some((line) => line.startsWith("heights 0–7: "))).toBe(true);
    expect(lines.some((line) => line.startsWith("live window: "))).toBe(true);
  });

  it("starts mid-chain: metadata at the range's first block, no block 0 calls, the parent link checked across chunks", async () => {
    const chain = syntheticChain({ length: 60, upgrades: [{ height: 33, specVersion: 1_000_000 }] });
    const node = await started(chain.script);
    const { records, stats } = await recordRange({
      node: node.url,
      from: 25,
      to: 40,
      chunkHeights: 5,
      liveWindowMs: 0,
      connect: quietConnect,
    });
    expect(completenessProblems(records, { from: 25, to: 40 })).toEqual([]);
    expect(calls(records, "state_getMetadata").map((call) => call.params)).toEqual([[chain.hashes[25]], [chain.hashes[33]]]);
    expect(calls(records, "system_properties")).toEqual([]);
    expect(calls(records, "state_getKeysPaged")).toEqual([]);
    expect(stats.chunks).toBe(4);
    expect(stats.concurrency).toBe(8);
  });

  it("gives a tape that a client making any subset of its calls, in any order, replays from the tape node", async () => {
    const chain = syntheticChain({ length: 30, upgrades: [{ height: 12, specVersion: 1_000_000 }], registrations: 2 });
    const node = await started(chain.script);
    const { records } = await recordRange({ node: node.url, from: 0, to: 20, chunkHeights: 6, liveWindowMs: 0, connect: quietConnect });
    const tape = await TapeNode.start({ records });
    const client = new NodeClient({ url: tape.url, connect: quietConnect });
    try {
      for (const height of [20, 3, 15, 12, 0]) {
        const hash = await client.blockHash(BigInt(height));
        expect(`0x${Buffer.from(hash).toString("hex")}`).toBe(chain.hashes[height]);
        const parent = (await client.header(hash)).parentHash;
        if (height > 0) expect(`0x${Buffer.from(parent).toString("hex")}`).toBe(chain.hashes[height - 1]);
        await client.block(hash);
        await client.runtimeVersion(height > 0 ? parent : hash);
        await client.storage(Buffer.from(EVENTS_KEY.slice(2), "hex"), hash);
        await client.ledgerStateRoot(hash);
      }
      await client.metadata(Buffer.from(chain.hashes[12]!.slice(2), "hex"));
      await client.systemProperties();
      await client.storageKeys(Buffer.from(MAPPINGS_PREFIX.slice(2), "hex"), KEYS_PAGE, null, Buffer.from(chain.hashes[0]!.slice(2), "hex"));
      await client.finalizedHead();
      expect(tape.calls.map((call) => call.outcome).filter((outcome) => outcome !== "answered")).toEqual([]);
    } finally {
      await client.close();
      await tape.close();
    }
  });

  it("names IN-8's storage keys by their twox128 prefixes", () => {
    expect(EVENTS_KEY).toBe(EVENTS);
    expect(REGISTRATION_PREFIXES).toEqual([MAPPINGS_PREFIX, MAPPING_PREFIX]);
    expect(KEYS_PAGE).toBe(1000);
  });
});

describe("recordRange: gentle with the node — a fixed concurrency, retries with back-off", () => {
  it("never has more requests in flight than its concurrency, and uses it", async () => {
    const chain = syntheticChain({ length: 30, registrations: 1 });
    let inFlight = 0;
    let most = 0;
    const holder: { node?: ScriptedNode } = {};
    const node = await started((request) => {
      inFlight += 1;
      most = Math.max(most, inFlight);
      const steps = chain.script(request);
      setTimeout(() => {
        inFlight -= 1;
        for (const step of steps) {
          if ("notify" in step) {
            const params = { subscription: step.subscription, result: step.result };
            holder.node!.send(request.connection, JSON.stringify({ jsonrpc: "2.0", method: step.notify, params }));
          } else if ("result" in step) {
            holder.node!.send(request.connection, JSON.stringify({ jsonrpc: "2.0", id: request.id, result: step.result }));
          }
        }
      }, 3);
      return [];
    });
    holder.node = node;
    const { records } = await recordRange({ node: node.url, from: 0, to: 25, chunkHeights: 13, concurrency: 3, liveWindowMs: 20, connect: quietConnect });
    expect(completenessProblems(records, { from: 0, to: 25 })).toEqual([]);
    expect(most).toBe(3);
  });

  it("records a chunk again, after a back-off, when the node drops its connection; the tape stays one session", async () => {
    const chain = syntheticChain({ length: 30 });
    const dropAt = chain.hashes[11];
    const dropping = syntheticChain({
      length: 30,
      fault: (method, params, occurrence) =>
        method === "chain_getBlock" && params[0] === dropAt && occurrence === 1 ? { drop: true } : undefined,
    });
    const node = await started(dropping.script);
    const { waits, sleep } = noSleep();
    const lines: string[] = [];
    const { records, stats } = await recordRange({
      node: node.url,
      from: 0,
      to: 20,
      chunkHeights: 7,
      liveWindowMs: 0,
      backoffMs: 1_000,
      sleep,
      connect: quietConnect,
      log: (line) => lines.push(line),
    });
    expect(completenessProblems(records, { from: 0, to: 20 })).toEqual([]);
    expect(records.some((record) => "disconnect" in record || "fault" in record)).toBe(false);
    expect(stats.retries).toBe(1);
    expect(waits).toEqual([1_000]);
    expect(lines.find((line) => line.includes("again in 1 s"))).toMatch(/^heights 7–13: attempt 1 failed: .+; again in 1 s$/);
    expect(stats.waitedMs).toBe(1_000);
  });

  it("records a chunk again when the node answers its rate limit (-32999) or an answer never comes, keeping no error", async () => {
    const hashes = syntheticChain({ length: 20 }).hashes;
    const chain = syntheticChain({
      length: 20,
      fault: (method, params, occurrence) => {
        if (occurrence !== 1) return undefined;
        if (method === "state_getRuntimeVersion" && params[0] === hashes[2]) {
          return { error: { code: -32999, message: "RPC rate limit exceeded" } };
        }
        return method === "midnight_ledgerStateRoot" && params[0] === hashes[14] ? { silent: true } : undefined;
      },
    });
    const node = await started(chain.script);
    const { waits, sleep } = noSleep();
    const { records, stats } = await recordRange({
      node: node.url,
      from: 0,
      to: 19,
      chunkHeights: 10,
      liveWindowMs: 0,
      backoffMs: 500,
      callTimeoutMs: 300,
      sleep,
      connect: quietConnect,
    });
    expect(completenessProblems(records, { from: 0, to: 19 })).toEqual([]);
    expect(records.some((record) => "error" in record || "fault" in record)).toBe(false);
    expect(stats.retries).toBe(2);
    expect(waits).toEqual([500, 500]);
  });

  it("doubles the back-off up to its ceiling, and gives up after its attempts, naming the chunk and the last error", async () => {
    const chain = syntheticChain({ length: 10, fault: (method) => (method === "chain_getBlockHash" ? { drop: true } : undefined) });
    const node = await started(chain.script);
    const { waits, sleep } = noSleep();
    await expect(
      recordRange({
        node: node.url,
        from: 0,
        to: 3,
        liveWindowMs: 0,
        attempts: 4,
        backoffMs: 1_000,
        backoffCeilingMs: 3_000,
        sleep,
        connect: quietConnect,
      }),
    ).rejects.toThrow(/^heights 0–3: gave up after 4 attempts: .*node-unreachable/);
    expect(waits).toEqual([1_000, 2_000, 3_000]);
  });

  it("gives up at once, without a retry, on a height the node does not have (node-requirement)", async () => {
    const chain = syntheticChain({ length: 10 });
    const node = await started(chain.script);
    const { waits, sleep } = noSleep();
    await expect(
      recordRange({ node: node.url, from: 5, to: 12, liveWindowMs: 0, sleep, connect: quietConnect }),
    ).rejects.toThrow(/^heights 5–12: .*node-requirement/);
    expect(waits).toEqual([]);
  });

  it("gives up at once on a chain whose blocks do not link, naming the height", async () => {
    const chain = syntheticChain({ length: 20, unlinkedAt: 9 });
    const node = await started(chain.script);
    const { waits, sleep } = noSleep();
    await expect(
      recordRange({ node: node.url, from: 0, to: 15, chunkHeights: 4, liveWindowMs: 0, sleep, connect: quietConnect }),
    ).rejects.toThrow("heights 8–11: block 9's parent hash is not the hash of block 8: the node's chain does not link");
    expect(waits).toEqual([]);
  });

  it("gives up at once on a header whose number is not its height", async () => {
    const zero = `0x${"00".repeat(32)}`;
    const hashes = syntheticChain({ length: 10 }).hashes;
    const wrong = { parentHash: zero, number: "0x9", stateRoot: zero, extrinsicsRoot: zero, digest: { logs: [] } };
    const chain = syntheticChain({
      length: 10,
      fault: (method, params) => (method === "chain_getHeader" && params[0] === hashes[1] ? { result: wrong } : undefined),
    });
    const node = await started(chain.script);
    await expect(
      recordRange({ node: node.url, from: 0, to: 1, liveWindowMs: 0, concurrency: 1, connect: quietConnect }),
    ).rejects.toThrow("heights 0–1: the header of block 1 has the number 9");
  });

  it("records the live window again when a subscription sends nothing, and gives up after its attempts", async () => {
    const chain = syntheticChain({ length: 10, notifications: 0 });
    const node = await started(chain.script);
    const { waits, sleep } = noSleep();
    await expect(
      recordRange({ node: node.url, from: 0, to: 2, liveWindowMs: 10, attempts: 2, backoffMs: 100, sleep, connect: quietConnect }),
    ).rejects.toThrow(
      "live window: gave up after 2 attempts: no notification of chain_subscribeNewHeads came in the live window",
    );
    expect(waits.filter((ms) => ms === 100)).toEqual([100]);
  });

  it("refuses options it cannot record with", async () => {
    const base: RangeOptions = { node: "ws://127.0.0.1:1", from: 0, to: 1 };
    const rows: readonly [Partial<RangeOptions>, string][] = [
      [{ node: "http://x" }, "the node must be a ws:// or wss:// URL"],
      [{ from: -1 }, "from must be a height (a safe integer from 0)"],
      [{ from: 1.5 }, "from must be a height (a safe integer from 0)"],
      [{ to: Number.MAX_SAFE_INTEGER + 1 }, "to must be a height (a safe integer from 0)"],
      [{ from: 3, to: 2 }, "from (3) is above to (2)"],
      [{ concurrency: 0 }, "concurrency must be a positive integer"],
      [{ chunkHeights: 0 }, "chunkHeights must be a positive integer"],
      [{ attempts: 0 }, "attempts must be a positive integer"],
      [{ keysPage: 1001 }, "keysPage must be an integer from 1 to 1000"],
      [{ liveWindowMs: -1 }, "liveWindowMs must be an integer from 0"],
      [{ backoffMs: -1 }, "backoffMs must be an integer from 0"],
      [{ backoffCeilingMs: -1 }, "backoffCeilingMs must be an integer from 0"],
    ];
    for (const [change, message] of rows) {
      await expect(recordRange({ ...base, ...change }), message).rejects.toThrow(message);
    }
  });
});
