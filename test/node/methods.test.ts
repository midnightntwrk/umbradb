import { afterEach, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { NODE_METHODS, NodeClient } from "../../src/node/index.js";
import { FakeNode } from "./fake-node.js";
import { ManualTimers, turns } from "./manual-timers.js";

/**
 * Only the allowed node calls, checked on the client's side:
 * - The node client's method list is exactly the twelve allowed methods, written out below, in their order.
 * - Its low-level `call` refuses any other method before anything reaches the node. It also refuses the two
 *   subscription methods, which only `subscribeNewHeads` and `subscribeFinalizedHeads` send.
 */

const nodes: FakeNode[] = [];
const clients: NodeClient[] = [];

afterEach(async () => {
  for (const client of clients.splice(0)) await client.close();
  for (const node of nodes.splice(0)) await node.stop();
});

describe("the node client's methods", () => {
  it("are exactly the twelve allowed methods, in their order, frozen", () => {
    expect([...NODE_METHODS]).toEqual([
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
    expect(Object.isFrozen(NODE_METHODS)).toBe(true);
  });

  it("refuses through call() every method outside the allowed ones and the subscription methods, sending nothing", async () => {
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
});
