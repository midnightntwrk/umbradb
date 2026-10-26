import { afterEach, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { NODE_METHODS, NodeClient } from "../../src/node/index.js";
import { FakeNode } from "./fake-node.js";
import { in8Methods, outsideIn8 } from "./in8.js";
import { ManualTimers, turns } from "./manual-timers.js";

/**
 * IN-8 ("Only these node calls"), the client's half of A83: the node client's method list is exactly the twelve
 * methods IN-8 names, read from the spec's own text, in its order; and its low-level `call` refuses any other method —
 * and the two subscription methods, which only `subscribeNewHeads` and `subscribeFinalizedHeads` send — before
 * anything reaches the node. The other suites check every request their fake nodes received against the same list
 * (`client.test.ts`, `refactored-node-rpc-client.test.ts`), so a client that sent any other method — an
 * `rpc_methods` probe on connecting, a `chain_unsubscribe…` on cancelling — fails there.
 */

const nodes: FakeNode[] = [];
const clients: NodeClient[] = [];

afterEach(async () => {
  for (const client of clients.splice(0)) await client.close();
  for (const node of nodes.splice(0)) await node.stop();
});

describe("IN-8: the node client's methods", () => {
  it("are exactly the methods IN-8 names, in its order", () => {
    expect(in8Methods()).toEqual([
      "chain_subscribeNewHeads",
      "chain_subscribeFinalizedHeads",
      "chain_getFinalizedHead",
      "chain_getBlockHash",
      "chain_getBlock",
      "chain_getHeader",
      "state_getStorage",
      "state_getKeysPaged",
      "state_getMetadata",
      "state_getRuntimeVersion",
      "midnight_ledgerStateRoot",
      "system_properties",
    ]);
    expect([...NODE_METHODS]).toEqual(in8Methods());
    expect(Object.isFrozen(NODE_METHODS)).toBe(true);
  });

  it("refuses through call() every method outside IN-8 and the subscription methods, sending nothing", async () => {
    const node = await FakeNode.start();
    nodes.push(node);
    const client = new NodeClient({ url: node.url(), timers: new ManualTimers() });
    clients.push(client);
    const refused = [
      "rpc_methods",
      "chain_unsubscribeNewHeads",
      "chain_unsubscribeFinalizedHeads",
      "author_submitExtrinsic",
      "system_chain",
      "midnight_contractState",
      "chain_subscribeNewHeads",
      "chain_subscribeFinalizedHeads",
      "",
      "constructor",
    ];
    for (const method of refused) {
      let error: unknown;
      try {
        await client.call(method as never, []);
      } catch (thrown) {
        error = thrown;
      }
      expect(error, method).toBeInstanceOf(UmbraError);
      expect(error, method).toMatchObject({
        code: "node-error",
        retryable: false,
        details: { method, reason: "method-not-allowed" },
      });
    }
    await turns();
    expect(node.upgrades).toBe(0);
    expect(node.received).toEqual([]);
  });

  it("negative control: the request check names every method outside IN-8, once each", () => {
    expect(outsideIn8(["chain_getHeader", "rpc_methods", "chain_unsubscribeNewHeads", "rpc_methods"])).toEqual([
      "rpc_methods",
      "chain_unsubscribeNewHeads",
    ]);
    expect(outsideIn8(in8Methods())).toEqual([]);
  });
});
