import { afterEach, describe, expect, it } from "vitest";
import { isBlockLedgerSource } from "../../src/backbone/core-block-fetch/ledger-source.js";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/node-source.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type Json, type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { outsideIn8 } from "../node/in8.js";
import { chainOf, hex } from "./fetch-fixtures.js";

/**
 * What `core-ledger-state` asks the node, through the block source it is bound to: the ledger state root after a block
 * (`midnight_ledgerStateRoot` at its hash) and the genesis state (`system_properties.genesis_state`, hex as the node
 * writes it). The in-memory source gives neither. [IN-7, IN-8, LG-15]
 */

const quiet: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });
const closing: (() => Promise<void>)[] = [];
afterEach(async () => {
  for (const close of closing.splice(0).reverse()) await close();
});

async function open(records: readonly TapeRecord[]) {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url, connect: quiet });
  const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap: 600 });
  closing.push(() => node.close(), () => client.close(), () => source.close());
  return { node, source };
}

describe("the block source's ledger calls (IN-7, IN-8, LG-15)", () => {
  const [, block] = chainOf(1n);
  const root = [0, ...new Array<number>(32).fill(0x5a)];

  it("reads a block's ledger state root at its hash, and the genesis state from system_properties", async () => {
    const { node, source } = await open([
      { method: "midnight_ledgerStateRoot", params: [block!.hex], result: root },
      { method: "system_properties", params: [], result: { genesis_extrinsics: [], genesis_state: "6d69646e69676874" } },
    ]);
    expect(isBlockLedgerSource(source)).toBe(true);
    expect([...(await source.ledgerStateRoot(block!))]).toEqual(root);
    expect(hex(await source.genesisState())).toBe("0x6d69646e69676874");
    expect(outsideIn8(node.calls.map((call) => call.method as string))).toEqual([]);
  });

  it("takes the genesis state with a 0x prefix too, and refuses an answer without one", async () => {
    const prefixed = await open([{ method: "system_properties", params: [], result: { genesis_state: "0x00ff" } }]);
    expect(hex(await prefixed.source.genesisState())).toBe("0x00ff");
    const answers: Json[] = [{}, { genesis_state: 7 }, { genesis_state: "0xzz" }, { genesis_state: "abc" }, { genesis_state: "" }];
    for (const properties of answers) {
      const { source } = await open([{ method: "system_properties", params: [], result: properties }]);
      await expect(source.genesisState()).rejects.toThrow(/genesis_state/);
    }
  });

  it("is no ledger source in memory: the in-memory source has no node", () => {
    expect(isBlockLedgerSource(new InMemoryBlockSource({ head: 1n }))).toBe(false);
    expect(isBlockLedgerSource(null)).toBe(false);
  });
});
