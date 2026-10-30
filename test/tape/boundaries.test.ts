import { afterEach, describe, expect, it } from "vitest";
import { networksFileProblems, NETWORKS_FORMAT } from "../../src/ledger/networks.js";
import { type ConnectSocket, connectWebSocket } from "../../src/node/index.js";
import { readBoundaries } from "../../tools/tape/index.js";
import { ScriptedNode, type Script } from "./scripted-node.js";
import { syntheticChain } from "./synthetic-chain.js";

/**
 * The boundary reader (`tools/tape/boundaries.ts`): a network's genesis — the hash of block 0 and its runtime, the
 * `MNSV` of block 0's header agreeing with `state_getRuntimeVersion` there — and every runtime upgrade from genesis to
 * the finalized head, found by sampling `state_getRuntimeVersion` every `step` blocks and bisecting each change to its
 * enactment block U (the first block whose state has the new runtime; F = U + 1), each U and F checked against their
 * headers' `MNSV` digests. It returns the record the built-in tables cite — the node's answers `chain_getBlockHash`,
 * `chain_getHeader` and `state_getRuntimeVersion` for block 0, and for each boundary U − 1, U and F — in
 * `test/node/fixtures/mainnet-answers.json`'s form. [LG-3]
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

describe("readBoundaries", () => {
  it("finds the genesis and every upgrade — two in one sampling step, one in the last partial step — with their record", async () => {
    const chain = syntheticChain({
      length: 287,
      upgrades: [
        { height: 37, specVersion: 1_000_000 },
        { height: 38, specVersion: 1_000_300 },
        { height: 260, specVersion: 2_000_000 },
      ],
    });
    const node = await started(chain.script);
    const reading = await readBoundaries({ node: node.url, step: 50, concurrency: 2, connect: quietConnect });
    const block = (height: number, specVersion: number) => ({ height, hash: chain.hashes[height], specVersion });
    expect(reading.genesis).toEqual({ hash: chain.hashes[0], specVersion: 22_000 });
    expect(reading.head).toEqual({ height: 286, hash: chain.hashes[286] });
    expect(reading.boundaries).toEqual([
      { u: block(37, 22_000), f: block(38, 1_000_000) },
      { u: block(38, 1_000_000), f: block(39, 1_000_300) },
      { u: block(260, 1_000_300), f: block(261, 2_000_000) },
    ]);
    // The record: block 0's answers, then each boundary's, as the node sent them.
    const methods = reading.calls.map((call) => `${call.method} ${JSON.stringify(call.params)}`);
    expect(methods.slice(0, 3)).toEqual([
      "chain_getBlockHash [0]",
      `chain_getHeader ["${chain.hashes[0]}"]`,
      `state_getRuntimeVersion ["${chain.hashes[0]}"]`,
    ]);
    for (const height of [36, 37, 38, 39, 259, 260, 261]) expect(methods).toContain(`chain_getBlockHash [${height}]`);
    for (const height of [37, 38, 39, 260, 261]) expect(methods).toContain(`chain_getHeader ["${chain.hashes[height]}"]`);
    for (const height of [36, 37, 38, 259, 260]) expect(methods).toContain(`state_getRuntimeVersion ["${chain.hashes[height]}"]`);
    expect(new Set(methods).size).toBe(methods.length);
    const header37 = reading.calls.find((call) => call.method === "chain_getHeader" && call.params[0] === chain.hashes[37]);
    expect((header37?.result as { number: string }).number).toBe("0x25");
    expect(reading.requests).toBeGreaterThan(0);
    // What the reading gives is what the built-in tables' format takes (src/ledger/networks.ts).
    const source = { node: node.url, read: "2026-10-26", record: "test/x.json" };
    const file = {
      format: NETWORKS_FORMAT,
      version: 1,
      about: "x",
      networks: [
        {
          network: "preview",
          genesis: { ...reading.genesis, source },
          rows: [
            { specVersionMin: 22_000, specVersionMax: 22_999, ledger: "v8" },
            { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
            { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
          ],
          boundaries: reading.boundaries.map((boundary) => ({ ...boundary, source })),
        },
      ],
    };
    expect(networksFileProblems(file)).toEqual([]);
  });

  it("gives no boundary for a chain that never upgraded, and reads a chain shorter than its step", async () => {
    const chain = syntheticChain({ length: 12, genesisSpecVersion: 2_000_000 });
    const node = await started(chain.script);
    const reading = await readBoundaries({ node: node.url, step: 1_000, connect: quietConnect });
    expect(reading.genesis).toEqual({ hash: chain.hashes[0], specVersion: 2_000_000 });
    expect(reading.boundaries).toEqual([]);
    expect(reading.calls).toHaveLength(3);
  });

  it("refuses a block 0 whose MNSV is not the runtime its state reports", async () => {
    const chain = syntheticChain({ length: 5, upgrades: [{ height: 0, specVersion: 1_000_000 }] });
    const node = await started(chain.script);
    await expect(readBoundaries({ node: node.url, connect: quietConnect })).rejects.toThrow(
      "block 0's MNSV digest names spec_version 22000, where state_getRuntimeVersion at block 0 reports 1000000",
    );
  });

  it("refuses an upgrade whose U or F header does not carry the runtime the states say", async () => {
    const zero = `0x${"00".repeat(32)}`;
    const chain = syntheticChain({ length: 40, upgrades: [{ height: 20, specVersion: 1_000_000 }] });
    const lying = syntheticChain({
      length: 40,
      upgrades: [{ height: 20, specVersion: 1_000_000 }],
      fault: (method, params) =>
        method === "chain_getHeader" && params[0] === chain.hashes[21]
          ? {
              result: {
                parentHash: chain.hashes[20],
                number: "0x15",
                stateRoot: zero,
                extrinsicsRoot: zero,
                digest: { logs: ["0x044d4e53561040420f00".replace("40420f00", "a0860100")] },
              },
            }
          : undefined,
    });
    const node = await started(lying.script);
    await expect(readBoundaries({ node: node.url, step: 10, connect: quietConnect })).rejects.toThrow(
      "the upgrade enacted at 20 (state 22000 → 1000000): F = 21's MNSV digest names spec_version 100000, not 1000000",
    );
  });

  it("refuses options it cannot read with", async () => {
    await expect(readBoundaries({ node: "https://x" })).rejects.toThrow("the node must be a ws:// or wss:// URL");
    await expect(readBoundaries({ node: "ws://127.0.0.1:1", step: 0 })).rejects.toThrow("step must be a positive integer");
    await expect(readBoundaries({ node: "ws://127.0.0.1:1", concurrency: 0 })).rejects.toThrow(
      "concurrency must be a positive integer",
    );
  });
});
