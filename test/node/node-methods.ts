import { NODE_METHODS } from "../../src/node/methods.js";

/**
 * The check the suites run on every request their fake or tape nodes received: each is one of the allowed node methods
 * (`NODE_METHODS`, which `./methods.test.ts` pins to the twelve methods written out there). A client or a block source
 * that sent any other method fails it, for example an `rpc_methods` probe on connecting, a `chain_unsubscribe…` on
 * cancelling, or a `state_getKeys`.
 */

/** The methods of `methods` that are not allowed node methods, each once, in first-seen order. */
export function outsideNodeMethods(methods: readonly string[]): string[] {
  const allowed = new Set<string>(NODE_METHODS);
  return [...new Set(methods.filter((method) => !allowed.has(method)))];
}
