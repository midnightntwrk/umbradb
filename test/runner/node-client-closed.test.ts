import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { nodeClientClosed } from "../../src/runner/process.js";

/**
 * Mutation-pass tests of `nodeClientClosed`, which maps a loop's failure after the stop
 * closed the node client to the stop: `handle-closed` of the node client itself or as a cause, eight levels deep at
 * most; nothing else.
 */

const closed = (): UmbraError => new UmbraError("handle-closed", "the node client was used after it was closed", { handle: "node-client" });

/** `inner` wrapped `depth` times as the cause of a plain error. */
function wrapped(inner: unknown, depth: number): unknown {
  let error = inner;
  for (let i = 0; i < depth; i++) error = new Error(`level ${i}`, { cause: error });
  return error;
}

describe("nodeClientClosed (task 17.5b)", () => {
  it("finds the node client's handle-closed itself and as a cause up to the eighth level", () => {
    expect(nodeClientClosed(closed())).toBe(true);
    expect(nodeClientClosed(wrapped(closed(), 1))).toBe(true);
    expect(nodeClientClosed(wrapped(closed(), 7))).toBe(true);
    expect(nodeClientClosed(wrapped(closed(), 8))).toBe(false);
  });

  it("takes nothing else: another handle, another code, a plain error with the same fields, a cause not an error", () => {
    expect(nodeClientClosed(new UmbraError("handle-closed", "closed", { handle: "database" }))).toBe(false);
    expect(nodeClientClosed(new UmbraError("connection-lost", "lost", { handle: "node-client" }))).toBe(false);
    expect(nodeClientClosed(Object.assign(new Error("closed"), { code: "handle-closed", details: { handle: "node-client" } }))).toBe(false);
    expect(nodeClientClosed(new Error("outer", { cause: { code: "handle-closed", details: { handle: "node-client" } } }))).toBe(false);
    expect(nodeClientClosed(wrapped("handle-closed", 2))).toBe(false);
    expect(nodeClientClosed(undefined)).toBe(false);
    expect(nodeClientClosed(null)).toBe(false);
  });
});
