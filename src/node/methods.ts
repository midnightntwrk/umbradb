/**
 * The node methods the indexer may call (`openspec/changes/core-arch/specs/ingest/spec.md` IN-8, "Only these node
 * calls"): the node client sends these and nothing else — no `rpc_methods` probe, no `system_chain`, and no
 * `chain_unsubscribe…` call either: a subscription is cancelled on the client's side, and closing the connection ends
 * every subscription on the node (`./client.ts`). `test/node/methods.test.ts` binds this list to IN-8's text.
 */

/** IN-8's methods, in the order IN-8 names them. */
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

/** A method of IN-8. */
export type NodeMethod = (typeof NODE_METHODS)[number];

/** The two head subscriptions, which only the client's `subscribe…` methods send. */
export type SubscribeMethod = "chain_subscribeNewHeads" | "chain_subscribeFinalizedHeads";

/** A method of IN-8 that is a plain call: one request, one answer. */
export type NodeCallMethod = Exclude<NodeMethod, SubscribeMethod>;

/** Whether `method` is a plain call of IN-8 (a subscription method is not). */
export function isNodeCallMethod(method: unknown): method is NodeCallMethod {
  return (
    (NODE_METHODS as readonly unknown[]).includes(method) &&
    method !== "chain_subscribeNewHeads" &&
    method !== "chain_subscribeFinalizedHeads"
  );
}
