import { createServer, type Server, type Socket } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { finalizedHeight } from "../../src/library/finalized-height.js";
import { TapeNode } from "../../tools/tape/index.js";
import { type ChainBlock, chainOf, headRead } from "../backbone/fetch-fixtures.js";
import { freePort } from "../runner/process-harness.js";

/**
 * `finalizedHeight` (`src/library/finalized-height.ts`), the height a host gives as S for a new database.
 *
 * - Against a node — a tape node whose finalized head is block 7 of a synthetic chain — it answers 7n, asking exactly
 *   `chain_getFinalizedHead` and `chain_getHeader` of that hash, and leaves no connection open.
 * - Against a node that never answers (a TCP server that accepts and says nothing) and one that cannot be reached (a
 *   closed port), it rejects `node-unreachable` (`reason: timeout`) once `timeoutMs` passed — not before.
 * - With its `signal` aborted, while it waits or before the call, it rejects with the signal's reason itself.
 * - Its errors never name the node's URL; a `node` that is no WebSocket URL, and malformed options, are refused
 *   `invalid-configuration`.
 */

const CHAIN: readonly ChainBlock[] = chainOf(7n);
const HEAD = CHAIN[7] as ChainBlock;

/** A TCP server that accepts every connection and never answers (its WebSocket handshake never completes). */
async function silentNode(): Promise<{ readonly url: string; readonly accepted: () => number; close(): Promise<void> }> {
  const sockets: Socket[] = [];
  const server: Server = createServer((socket) => {
    sockets.push(socket);
    socket.on("error", () => undefined);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { readonly port: number };
  return {
    url: `ws://user:s3cr3t-node@127.0.0.1:${port}/node`,
    accepted: () => sockets.length,
    async close() {
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}

/** What `promise` rejected with; fails if it resolved. */
async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    (value) => {
      throw new Error(`resolved with ${String(value)}; the test expected a rejection`);
    },
    (error: unknown) => error,
  );
}

describe("finalizedHeight answers against a node", () => {
  let node: TapeNode;
  beforeAll(async () => {
    node = await TapeNode.start({ records: headRead(HEAD) });
  });
  afterAll(async () => {
    await node.close();
  });

  it("is the node's finalized head's height, read with chain_getFinalizedHead and chain_getHeader", async () => {
    expect(await finalizedHeight(node.url)).toBe(7n);
    expect(node.calls.map((call) => call.method)).toEqual(["chain_getFinalizedHead", "chain_getHeader"]);
    expect(node.count("chain_getHeader", [HEAD.hex])).toBe(1);
    expect(node.connections).toBe(1);
  });
});

describe("finalizedHeight rejects node-unreachable after timeoutMs, and with the abort reason", () => {
  let silent: Awaited<ReturnType<typeof silentNode>>;
  beforeAll(async () => {
    silent = await silentNode();
  });
  afterAll(async () => {
    await silent.close();
  });

  it("a node that never answers: node-unreachable (timeout) once timeoutMs passed, naming no URL", async () => {
    const from = performance.now();
    const error = await rejectionOf(finalizedHeight(silent.url, { timeoutMs: 400 }));
    const took = performance.now() - from;
    expect(error).toMatchObject({ code: "node-unreachable", details: { reason: "timeout", timeoutMs: 400 } });
    expect(took).toBeGreaterThanOrEqual(399);
    expect(silent.accepted()).toBeGreaterThan(0);
    expect(String((error as Error).message)).not.toContain("s3cr3t-node");
    expect(JSON.stringify((error as { details?: unknown }).details)).not.toContain("127.0.0.1");
  });

  it("a node that cannot be reached (a closed port): node-unreachable (timeout) once timeoutMs passed", async () => {
    const url = `ws://127.0.0.1:${await freePort()}/node`;
    const from = performance.now();
    const error = await rejectionOf(finalizedHeight(url, { timeoutMs: 1_500 }));
    expect(error).toMatchObject({ code: "node-unreachable", details: { reason: "timeout", timeoutMs: 1_500 } });
    expect(performance.now() - from).toBeGreaterThanOrEqual(1_499);
  });

  it("its signal aborted while it waits: rejects with the signal's reason at once", async () => {
    const controller = new AbortController();
    const asked = finalizedHeight(silent.url, { signal: controller.signal, timeoutMs: 60_000 });
    for (let tries = 0; silent.accepted() === 0 && tries < 500; tries++) await new Promise((resolve) => setTimeout(resolve, 10));
    const reason = new Error("the host gave up");
    const from = performance.now();
    controller.abort(reason);
    expect(await rejectionOf(asked)).toBe(reason);
    expect(performance.now() - from).toBeLessThan(5_000);
  });

  it("a signal aborted before the call: rejects with its reason, connecting to nothing", async () => {
    const before = silent.accepted();
    const reason = new Error("aborted before");
    expect(await rejectionOf(finalizedHeight(silent.url, { signal: AbortSignal.abort(reason) }))).toBe(reason);
    expect(silent.accepted()).toBe(before);
  });
});

describe("finalizedHeight's refusals of what it is given", () => {
  it("a node that is no WebSocket URL, and malformed options, are refused invalid-configuration", async () => {
    await expect(finalizedHeight("http://127.0.0.1:9")).rejects.toMatchObject({
      code: "invalid-configuration",
      details: { reason: "not-a-websocket-url" },
    });
    await expect(finalizedHeight("not a url")).rejects.toMatchObject({ code: "invalid-configuration", details: { reason: "not-a-url" } });
    for (const [options, option] of [
      [{ timeoutMs: 0 }, "timeoutMs"],
      [{ timeoutMs: 1.5 }, "timeoutMs"],
      [{ timeoutMs: 2 ** 31 }, "timeoutMs"],
      [{ signal: {} }, "signal"],
      [null, "options"],
    ] as const) {
      await expect(finalizedHeight("ws://127.0.0.1:9", options as never)).rejects.toMatchObject({
        code: "invalid-configuration",
        details: { reason: "invalid-option", option },
      });
    }
  });
});
