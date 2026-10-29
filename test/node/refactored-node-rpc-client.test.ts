import { createServer } from "node:http";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { connectWebSocket, type ConnectSocket, NodeClient } from "../../src/node/index.js";
import { closeServer, FakeNode, listenOnRandomPort, MAINNET_BLOCK, RECEIVED_BY_ANY_NODE, recorded } from "./fake-node.js";
import { outsideIn8 } from "./in8.js";
import { ManualTimers, until } from "./manual-timers.js";

/**
 * 0.9.5's `chain-archive-sync/node-rpc-client.test.ts` ("Fix 3"), refactored onto the node client of `src/node/`.
 * The 0.9.5 client made one HTTP POST per call; the node client speaks JSON-RPC over WebSocket. Each 0.9.5 test is
 * kept where its assertion still applies. [design §13]
 *
 * 1. "a request that never resolves is aborted once the configured timeout elapses, instead of hanging forever" —
 *    kept, now exact: the call fails at its timeout, not a millisecond before, with a typed error (it bounded the
 *    time loosely, `< 5000` ms of wall-clock time, as it had no clock of its own).
 * 2. "fetch is called with an AbortSignal reflecting the configured timeout, not left unbounded" — its subject, the
 *    `AbortSignal` handed to `fetch`, no longer exists (no `fetch` over WebSocket); what it guarded, that the
 *    configured timeout bounds every call, is kept: a call with a 12,345 ms timeout is pending at 12,344 ms and ended
 *    at 12,345 ms.
 * 3. "an HTTP 200 response with a non-JSON body (e.g. a proxy's HTML error page) throws a typed NodeRpcParseError
 *    carrying the URL and method, not a bare SyntaxError" — over WebSocket a proxy's page answers the handshake: kept
 *    as a typed `node-error` (`handshake-refused`, status 200) naming the method; "carrying the URL" is now the
 *    opposite rule, since the node URL is a `secret` field that no error may show. [CF-4]
 * 4. and 5. "getHeightOf throws a typed NodeRpcInvalidHeightError instead of silently returning NaN when header.number
 *    is malformed / missing entirely" — kept on the header the node client decodes (`header(hash).number`, a
 *    `bigint`): a typed `node-error` (`bad-answer`) holding the raw value, never NaN.
 * 6. "getHeightOf still returns a real number for a well-formed response" — kept: `0x2a` is 42.
 *
 * Dropped with the 0.9.5 code, not carried over: `getHeightOf` itself (a header's height is `header.number`) and the
 * error classes `NodeRpcError`, `NodeRpcParseError` and `NodeRpcInvalidHeightError` (the node client throws
 * `UmbraError`s with codes, as the rest of UmbraDB does).
 */

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

const nodes: FakeNode[] = [];
const clients: NodeClient[] = [];

afterEach(async () => {
  for (const client of clients.splice(0)) await client.close();
  for (const node of nodes.splice(0)) await node.stop();
});

afterAll(() => {
  expect(outsideIn8(RECEIVED_BY_ANY_NODE.map((request) => request.method))).toEqual([]);
});

async function setUp(timeoutMs?: number): Promise<{ node: FakeNode; client: NodeClient; timers: ManualTimers }> {
  const node = await FakeNode.start();
  nodes.push(node);
  const timers = new ManualTimers();
  const client = new NodeClient({
    url: node.url(),
    timers,
    connect: quietConnect,
    ...(timeoutMs === undefined ? {} : { callTimeoutMs: timeoutMs }),
  });
  clients.push(client);
  return { node, client, timers };
}

function caught(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error("expected the call to fail");
    },
    (error: unknown) => error,
  );
}

const header = (number: unknown): Record<string, unknown> => {
  const recordedHeader = recorded("chain_getHeader").result as Record<string, unknown>;
  const changed: Record<string, unknown> = { ...recordedHeader, number };
  if (number === undefined) delete changed.number;
  return changed;
};

describe("the node client, refactored from 0.9.5's node-rpc-client tests (Fix 3)", () => {
  it("a call that never gets an answer is ended once the configured timeout elapses, instead of hanging forever", async () => {
    const { node, client, timers } = await setUp(50);
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    let settled = false;
    const call = caught(client.finalizedHead({ retry: false })).finally(() => {
      settled = true;
    });
    await until(() => node.count("chain_getFinalizedHead") === 1, "the call");
    await timers.advance(49);
    expect(settled).toBe(false);
    await timers.advance(1);
    const error = await call;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({ code: "node-unreachable", details: { reason: "timeout", timeoutMs: 50 } });
  });

  it("the configured timeout bounds every call: 12,345 ms is pending at 12,344 and ended at 12,345", async () => {
    const { node, client, timers } = await setUp(12_345);
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    let settled = false;
    const call = caught(client.finalizedHead({ retry: false })).finally(() => {
      settled = true;
    });
    await until(() => node.count("chain_getFinalizedHead") === 1, "the call");
    await timers.advance(12_344);
    expect(settled).toBe(false);
    await timers.advance(1);
    expect(await call).toMatchObject({ details: { timeoutMs: 12_345 } });
  });

  it("a proxy's HTML page (HTTP 200) for the handshake is a typed node-error naming the method, never the URL", async () => {
    const proxy = createServer((_request, response) => {
      response.writeHead(200, { "content-type": "text/html" });
      response.end("<html><body>502 Bad Gateway</body></html>");
    });
    const port = await listenOnRandomPort(proxy);
    try {
      const client = new NodeClient({ url: `ws://user:pass@127.0.0.1:${port}/node`, timers: new ManualTimers() });
      clients.push(client);
      const error = await caught(client.finalizedHead());
      expect(error).toBeInstanceOf(UmbraError);
      const typed = error as UmbraError;
      expect(typed).toMatchObject({
        code: "node-error",
        retryable: false,
        details: { method: "chain_getFinalizedHead", reason: "handshake-refused", status: 200 },
      });
      expect(`${typed.message} ${JSON.stringify(typed.details)}`).not.toMatch(/127\.0\.0\.1|user|pass|\/node/);
    } finally {
      await closeServer(proxy);
    }
  });

  it("a malformed header number is a typed bad answer holding the raw value, not a silent NaN", async () => {
    const { node, client } = await setUp();
    node.on("chain_getHeader", () => ({ result: header("not-hex!") }));
    let result: unknown;
    let error: unknown;
    try {
      result = await client.header(Uint8Array.from(Buffer.from(MAINNET_BLOCK.slice(2), "hex")));
    } catch (thrown) {
      error = thrown;
    }
    expect(result).toBeUndefined();
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({
      code: "node-error",
      details: { method: "chain_getHeader", reason: "bad-answer", path: "result.number", found: "string", value: "not-hex!" },
    });
  });

  it("a header number missing entirely is a typed bad answer", async () => {
    const { node, client } = await setUp();
    node.on("chain_getHeader", () => ({ result: header(undefined) }));
    const error = await caught(client.header(Uint8Array.from(Buffer.from(MAINNET_BLOCK.slice(2), "hex"))));
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({ details: { reason: "bad-answer", path: "result.number", found: "missing" } });
  });

  it("a well-formed header number is decoded (no false positives from the checks)", async () => {
    const { node, client } = await setUp();
    node.on("chain_getHeader", () => ({ result: header("0x2a") }));
    const decoded = await client.header(Uint8Array.from(Buffer.from(MAINNET_BLOCK.slice(2), "hex")));
    expect(decoded.number).toBe(42n);
  });
});
