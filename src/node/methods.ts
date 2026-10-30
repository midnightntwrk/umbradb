/**
 * The node methods the indexer may call. The node client sends these and nothing else: no `rpc_methods` probe, no
 * `system_chain`, and no `chain_unsubscribe…` call. A subscription is cancelled on the client's side, and closing the
 * connection ends every subscription on the node (`./client.ts`). `test/node/methods.test.ts` binds this list to the
 * spec's list of node calls. [IN-8]
 */

/** The allowed node methods, in the order the spec names them. [IN-8] */
export const NODE_METHODS = Object.freeze([
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
] as const);

/** An allowed node method. [IN-8] */
export type NodeMethod = (typeof NODE_METHODS)[number];

/** The two head subscriptions, which only the client's `subscribe…` methods send. */
export type SubscribeMethod = "chain_subscribeNewHeads" | "chain_subscribeFinalizedHeads";

/** An allowed node method that is a plain call: one request, one answer. */
export type NodeCallMethod = Exclude<NodeMethod, SubscribeMethod>;

/** Whether `method` is an allowed plain call (a subscription method is not). */
export function isNodeCallMethod(method: unknown): method is NodeCallMethod {
  return (
    (NODE_METHODS as readonly unknown[]).includes(method) &&
    method !== "chain_subscribeNewHeads" &&
    method !== "chain_subscribeFinalizedHeads"
  );
}
