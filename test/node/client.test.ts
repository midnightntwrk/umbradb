import { readFileSync } from "node:fs";
import { createServer as createNetServer, type Socket } from "node:net";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import {
  connectWebSocket,
  type ConnectSocket,
  DEFAULT_BACKOFF_CEILING_MS,
  DEFAULT_CALL_TIMEOUT_MS,
  DEFAULT_HEARTBEAT_MS,
  type HeadSubscriber,
  NodeClient,
  type NodeClientOptions,
  type NodeHeader,
  type NodeRetry,
  type NodeSocketEvents,
  type NodeTimers,
} from "../../src/node/index.js";
import { closeServer, FakeNode, listenOnRandomPort, MAINNET_BLOCK, RECEIVED_BY_ANY_NODE, recorded } from "./fake-node.js";
import { outsideIn8 } from "./in8.js";
import { ManualTimers, turns, until } from "./manual-timers.js";

/**
 * The node client (`src/node/`): JSON-RPC 2.0 over WebSocket against a scripted node on the loopback interface
 * (`./fake-node.ts`, a random free port at or above 10000). The client's clock is moved by hand (`./manual-timers.ts`),
 * so back-off delays, timeouts and the heartbeat are checked to the millisecond. [IN-8, IN-9, IN-10; design §1, §3]
 *
 * Covered:
 * - each allowed node call with its parameters and its typed answer, against the real answers of a mainnet node
 *   (`fixtures/mainnet-answers.json`); [IN-8]
 * - the two head subscriptions, cancelled locally and re-established after a reconnect;
 * - reconnecting with back-off (1 s, doubling up to `backoffCeilingMs`, with no limit on attempts); [IN-10]
 * - per-call and connect timeouts; which failures are retried and which halt; [IN-9, IN-10]
 * - the node URL kept out of every error, as it is a `secret` field; [CF-4]
 * - `close()` and abort signals, and the WebSocket transport's heartbeat.
 *
 * After the suite, every request the fake nodes received is checked against the allowed methods. [IN-8]
 */

const HOUR = 3_600_000;
/**
 * The WebSocket transport with its heartbeat out of the way: 2^31 − 1 ms (about 596 hours, the longest a timer holds)
 * is more than any test moves its clock. It has its own tests below.
 */
const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

const nodes: FakeNode[] = [];
const clients: NodeClient[] = [];
const servers: { close(): Promise<void> }[] = [];

afterEach(async () => {
  for (const client of clients.splice(0)) await client.close();
  for (const node of nodes.splice(0)) await node.stop();
  for (const server of servers.splice(0)) await server.close();
});

afterAll(() => {
  // Over whatever ran of the suite, nothing but the allowed methods ever reached a node (the last test checks it too).
  // [IN-8]
  expect(outsideIn8(RECEIVED_BY_ANY_NODE.map((request) => request.method))).toEqual([]);
});

async function startNode(options: { autoPong?: boolean } = {}): Promise<FakeNode> {
  const node = await FakeNode.start(options);
  nodes.push(node);
  return node;
}

function client(url: string, options: Partial<NodeClientOptions> = {}): NodeClient {
  const created = new NodeClient({ url, timers: new ManualTimers(), connect: quietConnect, ...options });
  clients.push(created);
  return created;
}

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;
const bytes = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text.slice(2), "hex"));
const hash = (n: number): string => `0x${n.toString(16).padStart(64, "0")}`;
const MNSV_LOG = "0x044d4e5356106c430f00";

/** A header as the node sends it, at height `n`. */
function headerJson(n: number): Record<string, unknown> {
  return {
    parentHash: hash(n - 1),
    number: `0x${n.toString(16)}`,
    stateRoot: hash(1_000 + n),
    extrinsicsRoot: hash(2_000 + n),
    digest: { logs: [MNSV_LOG] },
  };
}

/** Settles to the promise's rejection reason (attached at once, so no rejection goes unhandled meanwhile). */
function caught(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error("expected the promise to reject");
    },
    (error: unknown) => error,
  );
}

async function umbra(promise: Promise<unknown>): Promise<UmbraError> {
  const error = await caught(promise);
  expect(error).toBeInstanceOf(UmbraError);
  return error as UmbraError;
}

/** The block the mainnet answers were recorded at, as bytes; and the storage key and prefix recorded with them. */
const AT = bytes(MAINNET_BLOCK);
const SYSTEM_NUMBER = recorded("state_getStorage").params[0] as string;
const SYSTEM_PREFIX = recorded("state_getKeysPaged").params[0] as string;

describe("calls: the IN-8 methods with their parameters, and their answers typed", () => {
  it("sends each call as its IN-8 method with the given block and decodes the mainnet node's answers", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    node.on("state_getMetadata", () => ({ result: "0x6d657461" }));
    node.on("state_getStorage", (params) =>
      params[0] === SYSTEM_NUMBER ? { result: recorded("state_getStorage").result } : { result: null },
    );
    node.on("state_getKeysPaged", (params) =>
      params[2] === null ? { result: recorded("state_getKeysPaged").result } : { result: [] },
    );
    const node0 = JSON.parse(readFileSync(new URL("../ledger/fixtures/genesis/node-roots.json", import.meta.url), "utf8"))
      .states.find((state: { network: string }) => state.network === "mainnet") as { block0: string };
    const c = client(node.url());

    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    // The genesis hash, recorded independently (node-roots.json).
    expect(hex(await c.blockHash(0n))).toBe(node0.block0);
    expect(hex(await c.blockHash(3_174_332n))).toBe(MAINNET_BLOCK);

    const header = await c.header(AT);
    const recordedHeader = recorded("chain_getHeader").result as Record<string, unknown> & { digest: { logs: string[] } };
    expect(header.number).toBe(3_174_332n);
    expect(hex(header.parentHash)).toBe(recordedHeader.parentHash);
    expect(hex(header.stateRoot)).toBe(recordedHeader.stateRoot);
    expect(hex(header.extrinsicsRoot)).toBe(recordedHeader.extrinsicsRoot);
    expect(header.digest.map(hex)).toEqual(recordedHeader.digest.logs);
    expect(header.digest.map(hex)).toContain(MNSV_LOG);
    expect(Object.isFrozen(header)).toBe(true);
    expect(Object.isFrozen(header.digest)).toBe(true);

    const block = await c.block(AT);
    const recordedBlock = recorded("chain_getBlock").result as { block: { extrinsics: string[] } };
    expect(block.header).toEqual(header);
    expect(block.extrinsics.map(hex)).toEqual(recordedBlock.block.extrinsics);
    expect(block.extrinsics).toHaveLength(7);

    const version = await c.runtimeVersion(AT);
    expect(version).toMatchObject({ specName: "midnight", specVersion: 1_000_300, implVersion: 0, transactionVersion: 3 });
    expect(version.raw).toEqual(recorded("state_getRuntimeVersion").result);
    expect(Object.isFrozen(version.raw)).toBe(true);
    expect(Object.isFrozen((version.raw as { apis: unknown[] }).apis)).toBe(true);

    const root = await c.ledgerStateRoot(AT);
    expect([...root]).toEqual(recorded("midnight_ledgerStateRoot").result);
    expect(hex(root)).toBe("0x00cb5ec570d69d951d6c4be2636569f9edcfbe7637570b16b8ffb3b35d193e2d7f");

    // System.Number at the block is the block's own height, a little-endian u32.
    const number = (await c.storage(bytes(SYSTEM_NUMBER), AT)) as Uint8Array;
    expect(Buffer.from(number).readUInt32LE(0)).toBe(3_174_332);
    expect(await c.storage(bytes("0x00"), AT)).toBeNull();

    const keys = await c.storageKeys(bytes(SYSTEM_PREFIX), 3, null, AT);
    expect(keys.map(hex)).toEqual(recorded("state_getKeysPaged").result);
    expect(await c.storageKeys(bytes(SYSTEM_PREFIX), 3, keys[2] as Uint8Array, AT)).toEqual([]);

    const properties = await c.systemProperties();
    const genesis = readFileSync(new URL("../ledger/fixtures/genesis/genesis_state_mainnet.mn", import.meta.url));
    expect(properties.genesis_state).toBe(genesis.toString("hex"));
    expect(Object.isFrozen(properties)).toBe(true);

    expect([...(await c.metadata(AT))]).toEqual([0x6d, 0x65, 0x74, 0x61]);

    expect(node.received.map((request) => [request.method, request.params])).toEqual([
      ["chain_getFinalizedHead", []],
      ["chain_getBlockHash", [0]],
      ["chain_getBlockHash", [3_174_332]],
      ["chain_getHeader", [MAINNET_BLOCK]],
      ["chain_getBlock", [MAINNET_BLOCK]],
      ["state_getRuntimeVersion", [MAINNET_BLOCK]],
      ["midnight_ledgerStateRoot", [MAINNET_BLOCK]],
      ["state_getStorage", [SYSTEM_NUMBER, MAINNET_BLOCK]],
      ["state_getStorage", ["0x00", MAINNET_BLOCK]],
      ["state_getKeysPaged", [SYSTEM_PREFIX, 3, null, MAINNET_BLOCK]],
      ["state_getKeysPaged", [SYSTEM_PREFIX, 3, hex(keys[2] as Uint8Array), MAINNET_BLOCK]],
      ["system_properties", []],
      ["state_getMetadata", [MAINNET_BLOCK]],
    ]);
    // JSON-RPC 2.0 requests with distinct numeric ids, all on one connection.
    const ids = node.received.map((request) => request.id);
    expect(ids.every((id) => Number.isSafeInteger(id) && (id as number) > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(node.connections).toBe(1);
  });

  it("matches answers to calls by id, whatever order the node answers in", async () => {
    const node = await startNode();
    let held: unknown;
    node.on("chain_getBlockHash", (params, request) => {
      if (params[0] === 1) {
        held = request.id;
        return { silent: true };
      }
      return { result: hash(2) };
    });
    const c = client(node.url());
    const first = c.blockHash(1n);
    expect(hex(await c.blockHash(2n))).toBe(hash(2));
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: held, result: hash(1) }));
    expect(hex(await first)).toBe(hash(1));
  });

  it("refuses parameters it cannot send, before connecting", async () => {
    const node = await startNode();
    const c = client(node.url());
    const cases: readonly [() => Promise<unknown>, string, string][] = [
      [() => c.header(new Uint8Array(31)), "chain_getHeader", "hash"],
      [() => c.block("0x00" as never), "chain_getBlock", "hash"],
      [() => c.runtimeVersion(new Uint8Array(33)), "state_getRuntimeVersion", "at"],
      [() => c.blockHash(-1n), "chain_getBlockHash", "height"],
      [() => c.blockHash(2n ** 53n), "chain_getBlockHash", "height"],
      [() => c.blockHash(5 as never), "chain_getBlockHash", "height"],
      [() => c.storage([1] as never, AT), "state_getStorage", "key"],
      [() => c.storageKeys(bytes("0x00"), 0, null, AT), "state_getKeysPaged", "count"],
      [() => c.storageKeys(bytes("0x00"), 1.5, null, AT), "state_getKeysPaged", "count"],
      [() => c.storageKeys(bytes("0x00"), 3, "0x01" as never, AT), "state_getKeysPaged", "startKey"],
      [() => c.finalizedHead({ timeoutMs: 0 }), "chain_getFinalizedHead", "timeoutMs"],
      [() => c.finalizedHead({ timeoutMs: 2.5 }), "chain_getFinalizedHead", "timeoutMs"],
    ];
    for (const [run, method, parameter] of cases) {
      const error = await umbra(run());
      expect(error, `${method} ${parameter}`).toMatchObject({
        code: "invalid-parameter",
        retryable: false,
        details: { method, parameter },
      });
    }
    // A height at the edge of what the client sends is sent.
    node.on("chain_getBlockHash", () => ({ result: hash(9) }));
    expect(hex(await c.blockHash(2n ** 53n - 1n))).toBe(hash(9));
    expect(node.received.map((request) => request.params)).toEqual([[2 ** 53 - 1]]);
  });

  it("connects lazily, at its first call, and keeps one connection for every call", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    await timers.advance(HOUR);
    expect(node.upgrades).toBe(0);
    await Promise.all([c.finalizedHead(), c.finalizedHead(), c.finalizedHead()]);
    await c.finalizedHead();
    expect(node.upgrades).toBe(1);
    expect(node.connections).toBe(1);
  });
});

describe("subscriptions: new and finalized heads", () => {
  it("delivers new and finalized heads, decoded, in the order the node sends them", async () => {
    const node = await startNode();
    const c = client(node.url());
    const newHeads: NodeHeader[] = [];
    const finalized: NodeHeader[] = [];
    await c.subscribeNewHeads({ header: (header) => newHeads.push(header) });
    await c.subscribeFinalizedHeads({ header: (header) => finalized.push(header) });
    expect(node.received.map((request) => [request.method, request.params])).toEqual([
      ["chain_subscribeNewHeads", []],
      ["chain_subscribeFinalizedHeads", []],
    ]);
    node.notify("chain_newHead", headerJson(10));
    node.notify("chain_finalizedHead", headerJson(8));
    node.notify("chain_newHead", headerJson(11));
    await until(() => newHeads.length === 2 && finalized.length === 1, "three notifications");
    expect(newHeads.map((header) => header.number)).toEqual([10n, 11n]);
    expect(finalized.map((header) => header.number)).toEqual([8n]);
    expect(hex((newHeads[1] as NodeHeader).parentHash)).toBe(hash(10));
    expect((finalized[0] as NodeHeader).digest.map(hex)).toEqual([MNSV_LOG]);
  });

  it("delivers a notification read together with the subscription's answer, and tells a re-subscription first", async () => {
    // The node may send its answer and the first notification back to back; a socket can hand both over at once.
    const scripted = scriptedSockets();
    const c = client("ws://node.invalid", { connect: scripted.connect, timers: scripted.timers });
    const seen: string[] = [];
    const subscriber: HeadSubscriber = {
      header: (header) => seen.push(`head ${header.number}`),
      restarted: () => seen.push("restarted"),
    };
    const subscribed = c.subscribeFinalizedHeads(subscriber);
    const first = await scripted.next();
    first.events.open();
    await turns();
    const request = JSON.parse(first.sent[0] as string) as { id: number };
    first.events.message(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: "s1" }));
    first.events.message(notification("chain_finalizedHead", "s1", headerJson(5)));
    await subscribed;
    expect(seen).toEqual(["head 5"]);

    first.events.closed({ kind: "closed", code: 1006 });
    await scripted.timers.advance(1_000);
    const second = await scripted.next();
    second.events.open();
    await turns();
    const again = JSON.parse(second.sent[0] as string) as { id: number; method: string };
    expect(again.method).toBe("chain_subscribeFinalizedHeads");
    second.events.message(JSON.stringify({ jsonrpc: "2.0", id: again.id, result: 7 }));
    second.events.message(notification("chain_finalizedHead", 7, headerJson(6)));
    second.events.message(notification("chain_finalizedHead", "s1", headerJson(99)));
    second.events.message(notification("chain_finalizedHead", "7", headerJson(98)));
    await turns();
    expect(seen).toEqual(["head 5", "restarted", "head 6"]);
  });

  it("cancels locally: no more heads, no unsubscribe call (IN-8), and no re-subscription after a reconnect", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const heads: NodeHeader[] = [];
    let restarted = 0;
    const subscription = await c.subscribeNewHeads({ header: (header) => heads.push(header), restarted: () => restarted++ });
    node.notify("chain_newHead", headerJson(1));
    await until(() => heads.length === 1, "the first head");
    subscription.cancel();
    subscription.cancel();
    node.notify("chain_newHead", headerJson(2));
    await c.finalizedHead();
    await turns();
    expect(heads).toHaveLength(1);
    node.drop();
    await until(() => c.retrying, "the lost connection");
    await timers.advance(1_000);
    await c.finalizedHead();
    expect(node.connections).toBe(2);
    expect(node.count("chain_subscribeNewHeads")).toBe(1);
    expect(restarted).toBe(0);
    expect(node.methods().filter((method) => method.includes("unsubscribe"))).toEqual([]);
  });

  it("re-subscribes after the connection drops, says so, and delivers the new subscriptions' heads", async () => {
    const node = await startNode();
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const c = client(node.url(), { timers, onRetry: (retry) => retries.push(retry) });
    const heads: string[] = [];
    let restartedNew = 0;
    let restartedFinalized = 0;
    await c.subscribeNewHeads({ header: (h) => heads.push(`new ${h.number}`), restarted: () => restartedNew++ });
    await c.subscribeFinalizedHeads({ header: (h) => heads.push(`fin ${h.number}`), restarted: () => restartedFinalized++ });
    node.drop();
    await until(() => retries.length === 1, "the reconnect to be scheduled");
    expect(retries[0]).toMatchObject({ operation: "connect", attempt: 1, delayMs: 1_000 });
    await timers.advance(999);
    expect(node.upgrades).toBe(1);
    await timers.advance(1);
    await until(() => restartedNew === 1 && restartedFinalized === 1, "both re-subscriptions");
    expect(node.received.map((request) => [request.method, request.connection])).toEqual([
      ["chain_subscribeNewHeads", 1],
      ["chain_subscribeFinalizedHeads", 1],
      ["chain_subscribeNewHeads", 2],
      ["chain_subscribeFinalizedHeads", 2],
    ]);
    expect(node.notify("chain_newHead", headerJson(12))).toBe(1);
    expect(node.notify("chain_finalizedHead", headerJson(10))).toBe(1);
    await until(() => heads.length === 2, "the heads after the reconnect");
    expect(heads.sort()).toEqual(["fin 10", "new 12"]);
  });

  it("reports a notification it cannot read, and an exception of the subscriber, to the subscriber; and goes on", async () => {
    const node = await startNode();
    const c = client(node.url());
    const errors: unknown[] = [];
    const heads: bigint[] = [];
    await c.subscribeNewHeads({
      header: (header) => {
        heads.push(header.number);
        if (header.number === 2n) throw new Error("the subscriber's own failure");
      },
      error: (error) => errors.push(error),
    });
    node.notify("chain_newHead", { ...headerJson(1), number: "0xzz" });
    node.notify("chain_newHead", headerJson(2));
    node.notify("chain_newHead", headerJson(3));
    await until(() => heads.length === 2 && errors.length === 2, "two heads and two errors");
    expect(heads).toEqual([2n, 3n]);
    expect(errors[0]).toBeInstanceOf(UmbraError);
    expect(errors[0]).toMatchObject({
      code: "node-error",
      details: { method: "chain_subscribeNewHeads", reason: "bad-answer", path: "params.result.number", value: "0xzz" },
    });
    expect((errors[1] as Error).message).toBe("the subscriber's own failure");
    // A subscriber without an error callback loses nothing else: the next head still arrives.
    const quiet: bigint[] = [];
    await c.subscribeFinalizedHeads({ header: (header) => quiet.push(header.number) });
    node.notify("chain_finalizedHead", { number: 1 });
    node.notify("chain_finalizedHead", headerJson(4));
    await until(() => quiet.length === 1, "the good finalized head");
    expect(quiet).toEqual([4n]);
  });

  it("refuses a subscription the node answers with something other than an id, without retrying", async () => {
    const node = await startNode();
    node.on("chain_subscribeNewHeads", () => ({ result: { not: "an id" } }));
    node.on("chain_subscribeFinalizedHeads", () => ({ result: null }));
    const c = client(node.url());
    const error = await umbra(c.subscribeNewHeads({ header: () => undefined }));
    expect(error).toMatchObject({
      code: "node-error",
      retryable: false,
      details: { method: "chain_subscribeNewHeads", reason: "bad-answer", path: "result", found: "object" },
    });
    const other = await umbra(c.subscribeFinalizedHeads({ header: () => undefined }));
    expect(other.details).toMatchObject({ path: "result", found: "null" });
    expect(node.count("chain_subscribeNewHeads")).toBe(1);
  });
});

describe("reconnect and back-off (IN-10)", () => {
  it("re-sends a call cut off by a lost connection on the next one (retry), or fails it at once (no retry)", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", (_params, request) =>
      request.connection === 1 ? { silent: true } : { result: MAINNET_BLOCK },
    );
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const retried = c.finalizedHead();
    const once = umbra(c.finalizedHead({ retry: false }));
    await until(() => node.count("chain_getFinalizedHead") === 2, "both calls sent");
    node.drop();
    const error = await once;
    expect(error).toMatchObject({
      code: "node-unreachable",
      retryable: true,
      details: { method: "chain_getFinalizedHead", reason: "connection-closed", closeCode: 1006 },
    });
    await timers.advance(1_000);
    expect(hex(await retried)).toBe(MAINNET_BLOCK);
    expect(node.received.map((request) => request.connection)).toEqual([1, 1, 2]);
  });

  for (const [ceiling, expected] of [
    [DEFAULT_BACKOFF_CEILING_MS, [0, 1_000, 3_000, 7_000, 15_000, 31_000, 61_000, 91_000]],
    [5_000, [0, 1_000, 3_000, 7_000, 12_000, 17_000, 22_000, 27_000]],
  ] as const) {
    it(`waits 1 s, doubling up to backoffCeilingMs ${ceiling}, between connection attempts, without limit`, async () => {
      const node = await startNode();
      node.refuse = (upgrade) => (upgrade <= 7 ? 503 : undefined);
      node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
      const timers = new ManualTimers();
      const attempts: number[] = [];
      const retries: NodeRetry[] = [];
      const states: boolean[] = [];
      const c = client(node.url(), {
        timers,
        connect: (url, events, t) => {
          attempts.push(timers.now);
          return quietConnect(url, events, t);
        },
        onRetry: (retry) => retries.push(retry),
        onRetryingChange: (retrying) => states.push(retrying),
        ...(ceiling === DEFAULT_BACKOFF_CEILING_MS ? {} : { backoffCeilingMs: ceiling }),
      });
      let settled = false;
      const head = c.finalizedHead().finally(() => {
        settled = true;
      });
      for (let failure = 1; failure <= 7; failure++) {
        await until(() => retries.length === failure, `failure ${failure}`);
        const delay = (expected[failure] as number) - (expected[failure - 1] as number);
        expect(retries[failure - 1]).toMatchObject({ operation: "connect", attempt: failure, delayMs: delay });
        expect(retries[failure - 1]?.error).toMatchObject({
          code: "node-unreachable",
          details: { method: null, reason: "http-status", status: 503 },
        });
        expect(c.retrying).toBe(true);
        expect(settled).toBe(false);
        await timers.advance(delay - 1);
        expect(attempts).toHaveLength(failure);
        await timers.advance(1);
        expect(attempts).toHaveLength(failure + 1);
      }
      expect(hex(await head)).toBe(MAINNET_BLOCK);
      expect(attempts).toEqual(expected);
      expect(node.upgrades).toBe(8);
      expect(node.count("chain_getFinalizedHead")).toBe(1);
      expect(states).toEqual([true, false]);
      expect(c.retrying).toBe(false);
    });
  }

  it("starts again from 1 s after a connection the node answered on, and not after one it only opened", async () => {
    const node = await startNode();
    node.onConnection = (socket) => {
      if (node.connections <= 3) socket.close();
    };
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const c = client(node.url(), { timers, onRetry: (retry) => retries.push(retry) });
    const connects = () => retries.filter((retry) => retry.operation === "connect");
    // The first call starts the client, which then keeps a connection on its own; the node closes the first three.
    const first = caught(c.finalizedHead({ retry: false }));
    for (const [failure, delay] of [[1, 1_000], [2, 2_000], [3, 4_000]] as const) {
      await until(() => connects().length === failure, `closed connection ${failure}`);
      expect(connects()[failure - 1]).toMatchObject({ attempt: failure, delayMs: delay });
      await timers.advance(delay);
    }
    expect(await first).toBeInstanceOf(UmbraError);
    await until(() => node.connections === 4 && node.open === 1, "the fourth connection");
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    node.drop();
    await until(() => connects().length === 4, "the drop after an answer");
    expect(connects()[3]).toMatchObject({ attempt: 1, delayMs: 1_000 });
  });

  it("retries a call that timed out after 1 s, then 2 s, on the same connection, until it is answered", async () => {
    const node = await startNode();
    let calls = 0;
    node.on("chain_getFinalizedHead", () => (++calls <= 2 ? { silent: true } : { result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const c = client(node.url(), { timers, callTimeoutMs: 5_000, onRetry: (retry) => retries.push(retry) });
    const head = c.finalizedHead();
    await until(() => calls === 1, "the first call");
    await timers.advance(4_999);
    expect(retries).toEqual([]);
    await timers.advance(1);
    expect(retries[0]).toMatchObject({ operation: "chain_getFinalizedHead", attempt: 1, delayMs: 1_000 });
    expect(retries[0]?.error).toMatchObject({ code: "node-unreachable", details: { reason: "timeout", timeoutMs: 5_000 } });
    expect(c.retrying).toBe(true);
    await timers.advance(999);
    expect(calls).toBe(1);
    await timers.advance(1);
    await until(() => calls === 2, "the second call");
    await timers.advance(5_000);
    expect(retries[1]).toMatchObject({ attempt: 2, delayMs: 2_000 });
    await timers.advance(2_000);
    expect(hex(await head)).toBe(MAINNET_BLOCK);
    expect(node.connections).toBe(1);
    expect(c.retrying).toBe(false);
  });

  it("retries the node's rate limit (-32999) with the same back-off, and gives the answer", async () => {
    const node = await startNode();
    let calls = 0;
    node.on("chain_getBlockHash", () =>
      ++calls === 1 ? { error: { code: -32999, message: "RPC rate limit exceeded" } } : { result: hash(3) },
    );
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const c = client(node.url(), { timers, onRetry: (retry) => retries.push(retry) });
    const answer = c.blockHash(3n);
    await until(() => retries.length === 1, "the rate-limited answer");
    expect(retries[0]).toMatchObject({ operation: "chain_getBlockHash", attempt: 1, delayMs: 1_000 });
    expect(retries[0]?.error).toMatchObject({
      code: "node-unreachable",
      retryable: true,
      details: { method: "chain_getBlockHash", reason: "rate-limited", rpcCode: -32999, rpcMessage: "RPC rate limit exceeded" },
    });
    await timers.advance(1_000);
    expect(hex(await answer)).toBe(hash(3));
    const once = await umbra(
      (() => {
        calls = 0;
        return c.blockHash(3n, { retry: false });
      })(),
    );
    expect(once.details).toMatchObject({ reason: "rate-limited" });
  });

  it("ignores an answer that comes after its call timed out", async () => {
    const node = await startNode();
    let late: unknown;
    node.on("chain_getFinalizedHead", (_params, request) => {
      if (late === undefined) {
        late = request.id;
        return { silent: true };
      }
      return { result: MAINNET_BLOCK };
    });
    const timers = new ManualTimers();
    const c = client(node.url(), { timers, callTimeoutMs: 1_000 });
    const first = umbra(c.finalizedHead({ retry: false }));
    await until(() => late !== undefined, "the first call");
    await timers.advance(1_000);
    expect((await first).details).toMatchObject({ reason: "timeout" });
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: late, result: hash(1) }));
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    expect(node.connections).toBe(1);
  });
});

describe("timeouts", () => {
  it("ends a call the node does not answer exactly at its timeout: the client's default, or the call's own", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    expect(DEFAULT_CALL_TIMEOUT_MS).toBe(30_000);
    let settled = false;
    const call = umbra(c.finalizedHead({ retry: false })).finally(() => {
      settled = true;
    });
    await until(() => node.count("chain_getFinalizedHead") === 1, "the call");
    await timers.advance(29_999);
    expect(settled).toBe(false);
    await timers.advance(1);
    expect(await call).toMatchObject({
      code: "node-unreachable",
      retryable: true,
      details: { method: "chain_getFinalizedHead", reason: "timeout", timeoutMs: 30_000 },
    });
    const own = umbra(c.finalizedHead({ retry: false, timeoutMs: 250 }));
    await until(() => node.count("chain_getFinalizedHead") === 2, "the second call");
    await timers.advance(250);
    expect((await own).details).toMatchObject({ reason: "timeout", timeoutMs: 250 });
  });

  it("gives up a connection attempt that is not answered within callTimeoutMs, and tries again 1 s later", async () => {
    const sockets: Socket[] = [];
    const silent = createNetServer((socket) => sockets.push(socket));
    const port = await listenOnRandomPort(silent);
    servers.push({
      close: async () => {
        for (const socket of sockets) socket.destroy();
        await closeServer(silent);
      },
    });
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const c = client(`ws://127.0.0.1:${port}`, { timers, callTimeoutMs: 5_000, onRetry: (r) => retries.push(r) });
    const call = umbra(c.finalizedHead({ retry: false }));
    await until(() => sockets.length === 1, "the TCP connection");
    await timers.advance(4_999);
    expect(retries).toEqual([]);
    await timers.advance(1);
    expect(await call).toMatchObject({
      code: "node-unreachable",
      details: { method: "chain_getFinalizedHead", reason: "connect-timeout", timeoutMs: 5_000 },
    });
    expect(retries[0]).toMatchObject({ operation: "connect", attempt: 1, delayMs: 1_000 });
    await timers.advance(1_000);
    await until(() => sockets.length === 2, "the second attempt");
  });
});

describe("errors: what is retried and what halts (IN-9, IN-10)", () => {
  it("retries a handshake refused with 429 or a 5xx status, and halts on any other status", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    for (const [status, retryable] of [
      [429, true],
      [500, true],
      [502, true],
      [503, true],
      [504, true],
      [599, true],
      [400, false],
      [401, false],
      [403, false],
      [404, false],
      [426, false],
    ] as const) {
      node.refuse = () => status;
      const before = node.upgrades;
      const error = await umbra(client(node.url()).finalizedHead({ retry: false }));
      expect(error, String(status)).toMatchObject({
        code: retryable ? "node-unreachable" : "node-error",
        retryable,
        details: { method: "chain_getFinalizedHead", reason: retryable ? "http-status" : "handshake-refused", status },
      });
      if (!retryable) {
        // Retrying is no help: a call that may retry fails on the first refusal too.
        const timers = new ManualTimers();
        const halting = await umbra(client(node.url(), { timers }).finalizedHead());
        expect(halting.code).toBe("node-error");
        expect(node.upgrades - before).toBe(2);
      }
    }
    let refused = false;
    node.refuse = () => {
      if (refused) return undefined;
      refused = true;
      return 503;
    };
    const timers = new ManualTimers();
    const recovering = client(node.url(), { timers });
    const head = recovering.finalizedHead();
    await until(() => refused && recovering.retrying, "the refused handshake");
    await timers.advance(1_000);
    expect(hex(await head)).toBe(MAINNET_BLOCK);
  });

  it("retries a connection the operating system refuses", async () => {
    const free = createNetServer();
    const port = await listenOnRandomPort(free);
    await closeServer(free);
    const c = client(`ws://127.0.0.1:${port}`);
    const error = await umbra(c.finalizedHead({ retry: false }));
    expect(error).toMatchObject({
      code: "node-unreachable",
      retryable: true,
      details: { method: "chain_getFinalizedHead", reason: "connect-failed", cause: "ECONNREFUSED" },
    });
  });

  it("halts, without retrying, when the node says the state at the block is gone (IN-9)", async () => {
    const node = await startNode();
    const message = `Client error: UnknownBlock: State already discarded for ${MAINNET_BLOCK}`;
    for (const method of ["state_getStorage", "state_getRuntimeVersion", "state_getMetadata", "state_getKeysPaged"]) {
      node.on(method, () => ({ error: { code: 4003, message } }));
    }
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const calls: readonly [string, () => Promise<unknown>][] = [
      ["state_getStorage", () => c.storage(bytes(SYSTEM_NUMBER), AT)],
      ["state_getRuntimeVersion", () => c.runtimeVersion(AT)],
      ["state_getMetadata", () => c.metadata(AT)],
      ["state_getKeysPaged", () => c.storageKeys(bytes(SYSTEM_PREFIX), 3, null, AT)],
    ];
    for (const [method, run] of calls) {
      const error = await umbra(run());
      expect(error).toMatchObject({
        code: "node-requirement",
        retryable: false,
        details: { method, reason: "state-unavailable", rpcCode: 4003, rpcMessage: message },
      });
    }
    await timers.advance(HOUR);
    expect(node.methods()).toEqual(calls.map(([method]) => method));
  });

  it("halts, without retrying, on a block the node does not have (IN-9)", async () => {
    const node = await startNode();
    for (const method of ["chain_getBlockHash", "chain_getHeader", "chain_getBlock"]) node.on(method, () => ({ result: null }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    expect(await umbra(c.blockHash(7n))).toMatchObject({
      code: "node-requirement",
      retryable: false,
      details: { method: "chain_getBlockHash", reason: "block-unavailable", height: 7n },
    });
    expect(await umbra(c.header(AT))).toMatchObject({
      code: "node-requirement",
      details: { method: "chain_getHeader", reason: "block-unavailable", block: MAINNET_BLOCK },
    });
    expect(await umbra(c.block(AT))).toMatchObject({
      code: "node-requirement",
      details: { method: "chain_getBlock", reason: "block-unavailable", block: MAINNET_BLOCK },
    });
    await timers.advance(HOUR);
    expect(node.methods()).toEqual(["chain_getBlockHash", "chain_getHeader", "chain_getBlock"]);
  });

  it("halts, without retrying, on any other JSON-RPC error answer", async () => {
    const node = await startNode();
    const answers = [
      { code: -32601, message: "Method not found" },
      { code: -32602, message: "Invalid params", data: "data did not match any variant of untagged enum ListOrValue" },
      { code: -32602, message: "Unable to get requested ledger state root" },
      { code: 4003, message: "Client error: UnknownBlock: Header was not found in the database: 0x00" },
      { code: -32000, message: "anything else" },
    ];
    let index = 0;
    node.on("midnight_ledgerStateRoot", () => ({ error: answers[index++] }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    for (const answer of answers) {
      const error = await umbra(c.ledgerStateRoot(AT));
      expect(error).toMatchObject({
        code: "node-error",
        retryable: false,
        details: { method: "midnight_ledgerStateRoot", reason: "rpc-error", rpcCode: answer.code, rpcMessage: answer.message },
      });
    }
    await timers.advance(HOUR);
    expect(node.count("midnight_ledgerStateRoot")).toBe(answers.length);
  });

  it("halts, without retrying, on an answer of the wrong shape, naming where it is wrong and what it found", async () => {
    const node = await startNode();
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const good = headerJson(4);
    const long = `0x${"ab".repeat(40)}z`;
    const cases: readonly [string, () => Promise<unknown>, unknown, Record<string, unknown>][] = [
      ["chain_getFinalizedHead", () => c.finalizedHead(), "0x1234", { path: "result", found: "string", value: "0x1234" }],
      ["chain_getFinalizedHead", () => c.finalizedHead(), 42, { path: "result", found: "number", value: 42 }],
      ["chain_getFinalizedHead", () => c.finalizedHead(), long, { path: "result", value: `${long.slice(0, 64)}…` }],
      ["chain_getFinalizedHead", () => c.finalizedHead(), `0x${"zz".repeat(32)}`, { path: "result" }],
      ["chain_getBlockHash", () => c.blockHash(1n), true, { path: "result", found: "boolean", value: true }],
      ["chain_getHeader", () => c.header(AT), { ...good, number: "not-hex!" }, { path: "result.number", value: "not-hex!" }],
      ["chain_getHeader", () => c.header(AT), { ...good, number: 4 }, { path: "result.number", found: "number" }],
      ["chain_getHeader", () => c.header(AT), { ...good, number: ["0x2a"] }, { path: "result.number", found: "array" }],
      ["chain_getHeader", () => c.header(AT), { ...good, parentHash: undefined }, { path: "result.parentHash" }],
      ["chain_getHeader", () => c.header(AT), { ...good, parentHash: undefined }, { found: "missing" }],
      // A string of 64 characters is shown whole, a longer one cut at 64 (the case above).
      ["chain_getHeader", () => c.header(AT), { ...good, stateRoot: hash(1).slice(0, 64) }, { value: hash(1).slice(0, 64) }],
      ["chain_getHeader", () => c.header(AT), { ...good, extrinsicsRoot: null }, { found: "null" }],
      ["chain_getHeader", () => c.header(AT), { ...good, extrinsicsRoot: null }, { path: "result.extrinsicsRoot" }],
      ["chain_getHeader", () => c.header(AT), { ...good, digest: {} }, { path: "result.digest.logs", found: "missing" }],
      ["chain_getHeader", () => c.header(AT), { ...good, digest: undefined }, { path: "result.digest.logs", found: "missing" }],
      ["chain_getHeader", () => c.header(AT), { ...good, digest: { logs: ["0x00", "0x0"] } }, { path: "result.digest.logs[1]" }],
      ["chain_getHeader", () => c.header(AT), [good], { path: "result", found: "array" }],
      ["chain_getBlock", () => c.block(AT), { justifications: null }, { path: "result.block", found: "missing" }],
      ["chain_getBlock", () => c.block(AT), { block: { header: good } }, { path: "result.block.extrinsics", found: "missing" }],
      [
        "chain_getBlock",
        () => c.block(AT),
        { block: { header: good, extrinsics: ["0x00", 5] } },
        { path: "result.block.extrinsics[1]" },
      ],
      ["chain_getBlock", () => c.block(AT), { block: { header: {} } }, { path: "result.block.header.parentHash" }],
      ["state_getRuntimeVersion", () => c.runtimeVersion(AT), "v1", { path: "result", found: "string" }],
      ["state_getRuntimeVersion", () => c.runtimeVersion(AT), runtime({ specName: 5 }), { path: "result.specName" }],
      ["state_getRuntimeVersion", () => c.runtimeVersion(AT), runtime({ specVersion: "1" }), { path: "result.specVersion" }],
      ["state_getRuntimeVersion", () => c.runtimeVersion(AT), runtime({ implVersion: -1 }), { path: "result.implVersion" }],
      [
        "state_getRuntimeVersion",
        () => c.runtimeVersion(AT),
        runtime({ transactionVersion: 2.5 }),
        { path: "result.transactionVersion", value: 2.5 },
      ],
      ["midnight_ledgerStateRoot", () => c.ledgerStateRoot(AT), [0, 256], { path: "result[1]", value: 256 }],
      ["midnight_ledgerStateRoot", () => c.ledgerStateRoot(AT), [0, -1], { path: "result[1]" }],
      ["midnight_ledgerStateRoot", () => c.ledgerStateRoot(AT), [0, 1.5], { path: "result[1]" }],
      ["midnight_ledgerStateRoot", () => c.ledgerStateRoot(AT), "0x00", { path: "result", found: "string" }],
      ["state_getKeysPaged", () => c.storageKeys(bytes("0x00"), 1, null, AT), "0x00", { path: "result", found: "string" }],
      ["state_getKeysPaged", () => c.storageKeys(bytes("0x00"), 1, null, AT), ["0x0"], { path: "result[0]" }],
      ["state_getStorage", () => c.storage(bytes("0x00"), AT), 5, { path: "result", found: "number" }],
      ["state_getStorage", () => c.storage(bytes("0x00"), AT), "00", { path: "result", value: "00" }],
      ["state_getMetadata", () => c.metadata(AT), null, { path: "result", found: "null" }],
      ["system_properties", () => c.systemProperties(), [1], { path: "result", found: "array" }],
      ["system_properties", () => c.systemProperties(), null, { path: "result", found: "null" }],
    ];
    for (const [method, run, result, details] of cases) {
      node.on(method, () => ({ result }));
      const before = node.count(method);
      const error = await umbra(run());
      expect(error, `${method} ${JSON.stringify(result)}`).toMatchObject({
        code: "node-error",
        retryable: false,
        details: { method, reason: "bad-answer", ...details },
      });
      await timers.advance(HOUR);
      expect(node.count(method) - before, method).toBe(1);
    }
    const missing = await umbra(
      (() => {
        node.on("chain_getFinalizedHead", (_params, request) => ({ raw: JSON.stringify({ jsonrpc: "2.0", id: request.id }) }));
        return c.finalizedHead();
      })(),
    );
    expect(missing.details).toMatchObject({ reason: "bad-answer", path: "result", found: "missing" });
    const malformed = [
      ["boom", "string"],
      [{ code: 1.5, message: "m" }, "object"],
      [{ code: 1 }, "object"],
    ] as const;
    for (const [error, found] of malformed) {
      node.on("chain_getFinalizedHead", () => ({ error }));
      expect((await umbra(c.finalizedHead())).details).toMatchObject({ reason: "bad-answer", path: "error", found });
    }
    expect(node.connections).toBe(1);
  });

  it("fails every call in flight when the node sends a frame that is not JSON-RPC 2.0, and opens a new connection", async () => {
    const node = await startNode();
    const garbage = [
      "not json",
      "[1,2]",
      "null",
      JSON.stringify({ id: 1, result: 1 }),
      JSON.stringify({ jsonrpc: "1.0", id: 1, result: 1 }),
      JSON.stringify({ jsonrpc: "2.0" }),
      JSON.stringify({ jsonrpc: "2.0", method: "chain_newHead" }),
      JSON.stringify({ jsonrpc: "2.0", method: "chain_newHead", params: { result: {} } }),
      JSON.stringify({ jsonrpc: "2.0", method: "chain_newHead", params: { subscription: "s" } }),
      JSON.stringify({ jsonrpc: "2.0", method: 5, params: { subscription: "s", result: {} } }),
    ];
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    for (const [index, frame] of garbage.entries()) {
      let sent = 0;
      node.on("chain_getBlockHash", () => ({ silent: true }));
      node.on("chain_getFinalizedHead", () => (++sent === 1 ? { raw: frame } : { result: MAINNET_BLOCK }));
      const waiting = umbra(c.blockHash(1n));
      await until(() => node.count("chain_getBlockHash") === index + 1, "the call in flight");
      const error = await umbra(c.finalizedHead());
      expect(error, frame).toMatchObject({
        code: "node-error",
        retryable: false,
        details: { method: "chain_getFinalizedHead", reason: "bad-answer", path: "message" },
      });
      expect((await waiting).details, frame).toMatchObject({
        method: "chain_getBlockHash",
        reason: "bad-answer",
        path: "message",
      });
      await timers.advance(1_000);
      expect(hex(await c.finalizedHead()), frame).toBe(MAINNET_BLOCK);
      expect(node.connections, frame).toBe(index + 2);
    }
  });

  it("never names the node's URL, which may hold credentials, in an error (CF-4: node is a secret)", async () => {
    const node = await startNode();
    const secretUrl = (port: number) => `ws://alice:SECRET-PASSWORD@127.0.0.1:${port}/rpc?token=SECRET-TOKEN`;
    const errors: unknown[] = [];
    const timers = new ManualTimers();
    const c = client(secretUrl(node.port), { timers, callTimeoutMs: 1_000 });
    node.on("chain_getHeader", () => ({ error: { code: -32602, message: "Invalid params" } }));
    node.on("chain_getBlock", () => ({ result: 5 }));
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    errors.push(await caught(c.header(AT)), await caught(c.block(AT)));
    const timeout = caught(c.finalizedHead({ retry: false }));
    await until(() => node.count("chain_getFinalizedHead") === 1, "the silent call");
    await timers.advance(1_000);
    errors.push(await timeout);
    const cut = caught(c.finalizedHead({ retry: false }));
    await until(() => node.count("chain_getFinalizedHead") === 2, "the call to cut");
    node.drop();
    errors.push(await cut, await caught(c.call("rpc_methods" as never, [])), await caught(c.header(new Uint8Array(3))));
    for (const status of [503, 404]) {
      node.refuse = () => status;
      errors.push(await caught(client(secretUrl(node.port)).finalizedHead({ retry: false })));
    }
    const free = createNetServer();
    const port = await listenOnRandomPort(free);
    await closeServer(free);
    errors.push(await caught(client(secretUrl(port)).finalizedHead({ retry: false })));
    await c.close();
    errors.push(await caught(c.finalizedHead()));
    for (const url of [
      "ws://alice:SECRET-PASSWORD@[127.0.0.1/rpc?token=SECRET-TOKEN",
      "http://alice:SECRET-PASSWORD@127.0.0.1/rpc?token=SECRET-TOKEN",
    ]) {
      try {
        new NodeClient({ url });
      } catch (error) {
        errors.push(error);
      }
    }
    expect(errors).toHaveLength(12);
    for (const error of errors) {
      expect(error).toBeInstanceOf(UmbraError);
      const umbraError = error as UmbraError;
      const text = [
        umbraError.message,
        umbraError.stack,
        JSON.stringify(umbraError.details, (_key, value: unknown) => (typeof value === "bigint" ? `${value}` : value)),
        String(umbraError.cause),
      ].join("\n");
      for (const secret of ["SECRET", "alice", "/rpc", "token", "127.0.0.1", `:${node.port}`, `:${port}`]) {
        expect(text, `${umbraError.code} ${umbraError.message}`).not.toContain(secret);
      }
    }
  });

  it("refuses a URL that is not a WebSocket URL, and a timeout or ceiling that is not a positive integer", () => {
    const refusals: readonly [Partial<NodeClientOptions>, Record<string, unknown>][] = [
      [{ url: "not a url" }, { field: "node", reason: "not-a-url" }],
      [{ url: 5 as never }, { field: "node", reason: "not-a-url" }],
      [{ url: "http://127.0.0.1:1/" }, { field: "node", reason: "not-a-websocket-url" }],
      [{ url: "https://127.0.0.1:1/" }, { field: "node", reason: "not-a-websocket-url" }],
      [{ callTimeoutMs: 0 }, { field: "callTimeoutMs", reason: "not-a-positive-integer" }],
      [{ callTimeoutMs: -5 }, { field: "callTimeoutMs", reason: "not-a-positive-integer" }],
      [{ callTimeoutMs: 1.5 }, { field: "callTimeoutMs", reason: "not-a-positive-integer" }],
      [{ callTimeoutMs: Number.NaN }, { field: "callTimeoutMs", reason: "not-a-positive-integer" }],
      [{ backoffCeilingMs: 0 }, { field: "backoffCeilingMs", reason: "not-a-positive-integer" }],
      [{ backoffCeilingMs: Number.POSITIVE_INFINITY }, { field: "backoffCeilingMs", reason: "not-a-positive-integer" }],
    ];
    for (const [options, details] of refusals) {
      let error: unknown;
      try {
        new NodeClient({ url: "ws://127.0.0.1:1", ...options });
      } catch (thrown) {
        error = thrown;
      }
      expect(error, JSON.stringify(options)).toBeInstanceOf(UmbraError);
      expect(error).toMatchObject({ code: "invalid-configuration", retryable: false, details });
    }
    expect(() => new NodeClient({ url: "wss://node.example/ws", callTimeoutMs: 1, backoffCeilingMs: 1 })).not.toThrow();
    expect(DEFAULT_BACKOFF_CEILING_MS).toBe(30_000);
  });
});

describe("close() and abort signals", () => {
  it("ends calls in flight, calls waiting to retry and subscriptions with handle-closed, and connects no more", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    node.on("chain_getBlockHash", () => ({ error: { code: -32999, message: "RPC rate limit exceeded" } }));
    node.on("chain_subscribeNewHeads", () => ({ silent: true }));
    const timers = new ManualTimers();
    const states: boolean[] = [];
    const c = client(node.url(), { timers, onRetryingChange: (retrying) => states.push(retrying) });
    const inFlight = umbra(c.finalizedHead());
    const backingOff = umbra(c.blockHash(1n));
    const subscribing = umbra(c.subscribeNewHeads({ header: () => undefined }));
    await until(() => node.received.length === 3 && c.retrying, "three requests, one backing off");
    await c.close();
    for (const error of [await inFlight, await backingOff, await subscribing, await umbra(c.finalizedHead())]) {
      expect(error).toMatchObject({ code: "handle-closed", retryable: false, details: { handle: "node-client" } });
    }
    expect(await umbra(c.subscribeFinalizedHeads({ header: () => undefined }))).toMatchObject({ code: "handle-closed" });
    expect(c.retrying).toBe(false);
    expect(states).toEqual([true, false]);
    await timers.advance(HOUR);
    expect(node.upgrades).toBe(1);
    expect(node.received).toHaveLength(3);
    await c.close();
    await until(() => node.open === 0, "the connection closed");
  });

  it("cancels the next connection attempt when closed while waiting for it", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    await c.finalizedHead();
    node.drop();
    await until(() => c.retrying, "the lost connection");
    expect(timers.pending()).toContain(1_000);
    await c.close();
    await timers.advance(HOUR);
    await turns();
    expect(node.upgrades).toBe(1);
    expect(timers.pending()).toEqual([]);
  });

  it("ends an open connection with a close frame (1000) when the client closes", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const codes: number[] = [];
    node.onConnection = (socket) => socket.on("close", (code) => codes.push(code));
    const c = client(node.url());
    await c.finalizedHead();
    await c.close();
    await until(() => codes.length === 1, "the node's side closed");
    expect(codes).toEqual([1_000]);
  });

  it("closes while connecting, and a client never used", async () => {
    const node = await startNode();
    node.refuse = () => 503;
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const waiting = umbra(c.finalizedHead());
    await until(() => node.upgrades === 1 && c.retrying, "the refused handshake");
    await timers.advance(1_000);
    await c.close();
    expect(await waiting).toMatchObject({ code: "handle-closed" });
    await client(node.url()).close();
  });

  it("ends a call with its signal's reason: waiting for an answer, for a connection, or for its next try", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ silent: true }));
    node.on("chain_getBlockHash", () => ({ error: { code: -32999, message: "RPC rate limit exceeded" } }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });

    const answer = new AbortController();
    const forAnswer = caught(c.finalizedHead({ signal: answer.signal }));
    await until(() => node.count("chain_getFinalizedHead") === 1, "the unanswered call");
    const reason = new Error("stop waiting for the answer");
    answer.abort(reason);
    expect(await forAnswer).toBe(reason);

    const nextTry = new AbortController();
    const forNextTry = caught(c.blockHash(1n, { signal: nextTry.signal }));
    await until(() => c.retrying, "the back-off");
    nextTry.abort("stop retrying");
    expect(await forNextTry).toBe("stop retrying");

    const before = new AbortController();
    before.abort("already");
    expect(await caught(c.finalizedHead({ signal: before.signal }))).toBe("already");
    expect(await caught(c.storageKeys(bytes("0x00"), 1, null, AT, { signal: before.signal }))).toBe("already");

    node.refuse = () => 503;
    node.drop();
    await until(() => c.retrying, "the lost connection");
    await timers.advance(1_000);
    await until(() => node.upgrades === 2, "the refused reconnect");
    const connection = new AbortController();
    const forConnection = caught(c.finalizedHead({ signal: connection.signal }));
    await turns();
    connection.abort("stop waiting for the node");
    expect(await forConnection).toBe("stop waiting for the node");
    await timers.advance(HOUR);
    expect(node.count("chain_getFinalizedHead")).toBe(1);
  });
});

describe("abort signals at the edges (00033 F1, Codex R2-1)", () => {
  it("sends nothing for a call whose signal aborts after its connection opened, before it was sent", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const controller = new AbortController();
    // The abort runs as a microtask queued while the connection becomes open: after the call's wait for it ended,
    // before the call continues to send.
    const c = client(node.url(), {
      onConnectionChange: (connection) => {
        if (connection === "connected") queueMicrotask(() => controller.abort("aborted at the open"));
      },
    });
    const call = caught(c.finalizedHead({ signal: controller.signal }));
    expect(await call).toBe("aborted at the open");
    await turns();
    expect(node.count("chain_getFinalizedHead")).toBe(0);
  });

  it("ends a retry's sleep at once when its signal aborted before the sleep began", async () => {
    const node = await startNode();
    const controller = new AbortController();
    // The node's error makes the call retry; the abort lands in onRetry, just before the sleep begins.
    node.on("chain_getBlockHash", () => ({ error: { code: -32999, message: "RPC rate limit exceeded" } }));
    const timers = new ManualTimers();
    const c = client(node.url(), { timers, onRetry: () => controller.abort("aborted before the sleep") });
    const call = caught(c.blockHash(1n, { signal: controller.signal }));
    // Settled without advancing the clock: no back-off sleep was left waiting (only the heartbeat's timer is).
    expect(await call).toBe("aborted before the sleep");
    expect(timers.pending()).not.toContain(1_000);
  });
});

describe("the WebSocket transport's heartbeat", () => {
  it("pings every heartbeatMs (30 s by default) once the connection is open", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const c = new NodeClient({ url: node.url(), timers });
    clients.push(c);
    expect(DEFAULT_HEARTBEAT_MS).toBe(30_000);
    expect(timers.pending()).toEqual([]);
    await c.finalizedHead();
    expect(timers.pending()).toEqual([DEFAULT_HEARTBEAT_MS]);
  });

  it("ends a connection whose node answers no ping for two heartbeats, and the client connects again", async () => {
    const node = await startNode({ autoPong: false });
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    const pinged: number[] = [];
    node.onConnection = (socket) => socket.on("ping", () => pinged.push(timers.now));
    const c = client(node.url(), {
      timers,
      connect: (url, events, t) => connectWebSocket(url, events, t, { heartbeatMs: 10_000 }),
      onRetry: (retry) => retries.push(retry),
    });
    await c.finalizedHead();
    await timers.advance(10_000);
    await until(() => pinged.length === 1, "the first ping");
    await timers.advance(9_999);
    expect(retries).toEqual([]);
    await timers.advance(1);
    await until(() => retries.length === 1, "the connection ended");
    expect(retries[0]).toMatchObject({
      operation: "connect",
      error: { details: { reason: "connection-closed", closeCode: 1006 } },
    });
    await timers.advance(1_000);
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    expect(node.connections).toBe(2);
  });

  it("counts any frame from the node as a sign of life, a pong or not", async () => {
    const node = await startNode({ autoPong: false });
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    const pinged: number[] = [];
    node.onConnection = (socket) => socket.on("ping", () => pinged.push(timers.now));
    const retries: NodeRetry[] = [];
    const c = client(node.url(), {
      timers,
      connect: (url, events, t) => connectWebSocket(url, events, t, { heartbeatMs: 10_000 }),
      onRetry: (retry) => retries.push(retry),
    });
    await c.finalizedHead();
    for (let beat = 1; beat <= 3; beat++) {
      await timers.advance(10_000);
      await until(() => pinged.length === beat, `ping ${beat}`);
      // No pong ever comes; an answer between two pings is enough.
      await c.finalizedHead();
    }
    expect(retries).toEqual([]);
    expect(node.connections).toBe(1);
  });

  it("keeps a connection whose node answers its pings", async () => {
    const node = await startNode();
    const timers = new ManualTimers();
    const pinged: number[] = [];
    node.onConnection = (socket) => socket.on("ping", () => pinged.push(timers.now));
    const retries: NodeRetry[] = [];
    const c = client(node.url(), {
      timers,
      connect: (url, events, t) => connectWebSocket(url, events, t, { heartbeatMs: 10_000 }),
      onRetry: (retry) => retries.push(retry),
    });
    await c.subscribeNewHeads({ header: () => undefined });
    for (let beat = 1; beat <= 4; beat++) {
      await timers.advance(10_000);
      await until(() => pinged.length === beat, `ping ${beat}`);
      // The pong is on its way back: give it real time to arrive before the next beat checks for it.
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    expect(pinged).toEqual([10_000, 20_000, 30_000, 40_000]);
    expect(retries).toEqual([]);
    expect(node.connections).toBe(1);
    expect(node.open).toBe(1);
  });

  it("refuses a heartbeatMs a timer cannot hold (Node.js runs a delay above 2^31 − 1 ms after 1 ms), before connecting", async () => {
    const node = await startNode();
    const refusals: readonly [number, string][] = [
      [2 ** 31, "above-timer-limit"],
      [1_000_000 * HOUR, "above-timer-limit"],
      [Number.POSITIVE_INFINITY, "not-a-positive-integer"],
      [0, "not-a-positive-integer"],
      [-1, "not-a-positive-integer"],
      [1.5, "not-a-positive-integer"],
      [Number.NaN, "not-a-positive-integer"],
    ];
    const events: NodeSocketEvents = { open: () => undefined, message: () => undefined, closed: () => undefined };
    for (const [heartbeatMs, reason] of refusals) {
      let error: unknown;
      try {
        connectWebSocket(node.url(), events, new ManualTimers(), { heartbeatMs });
      } catch (thrown) {
        error = thrown;
      }
      expect(error, String(heartbeatMs)).toBeInstanceOf(UmbraError);
      expect(error, String(heartbeatMs)).toMatchObject({
        code: "invalid-configuration",
        retryable: false,
        details: { field: "heartbeatMs", reason },
      });
    }
    // Refused before any connection was made.
    await turns();
    expect(node.connections).toBe(0);
  });
});

describe("edges of the connection's life", () => {
  it("sends nothing on a connection that ends as it opens: the call goes to the next one, or fails without retry", async () => {
    const scripted = scriptedSockets();
    const c = client("ws://node.invalid", { connect: scripted.connect, timers: scripted.timers });
    const retried = c.finalizedHead();
    const once = umbra(c.finalizedHead({ retry: false }));
    const first = await scripted.next();
    first.events.open();
    first.events.closed({ kind: "closed", code: 1006 });
    expect((await once).details).toMatchObject({ method: "chain_getFinalizedHead", reason: "connection-closed" });
    expect(first.sent).toEqual([]);
    await scripted.timers.advance(1_000);
    const second = await scripted.next();
    second.events.open();
    await turns();
    const request = JSON.parse(second.sent[0] as string) as { id: number };
    second.events.message(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: MAINNET_BLOCK }));
    expect(hex(await retried)).toBe(MAINNET_BLOCK);
    // A client closed as its connection opens sends nothing either.
    const other = scriptedSockets();
    const closing = client("ws://node.invalid", { connect: other.connect, timers: other.timers });
    const cut = umbra(closing.finalizedHead());
    const socket = await other.next();
    socket.events.open();
    const closed = closing.close();
    expect(await cut).toMatchObject({ code: "handle-closed" });
    await closed;
    expect(socket.sent).toEqual([]);
  });

  it("fails a call at once, retry or not, while the last connection was refused for good", async () => {
    const node = await startNode();
    node.refuse = () => 404;
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    expect((await umbra(c.finalizedHead())).details).toMatchObject({ reason: "handshake-refused", status: 404 });
    const again = await umbra(c.finalizedHead());
    expect(again).toMatchObject({ code: "node-error", details: { method: "chain_getFinalizedHead", status: 404 } });
    expect(node.upgrades).toBe(1);
    // And the client still tries again later: the address may be fixed (a proxy restarted).
    node.refuse = undefined;
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    await timers.advance(1_000);
    await until(() => !c.retrying, "the new connection");
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
  });

  it("tells subscribers of a connection refused for good, and of a subscription the node no longer makes", async () => {
    const node = await startNode();
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const errors: unknown[] = [];
    let restarted = 0;
    await c.subscribeNewHeads({ header: () => undefined, error: (error) => errors.push(error), restarted: () => restarted++ });
    node.refuse = () => 403;
    node.drop();
    await until(() => c.retrying, "the lost connection");
    expect(errors).toEqual([]);
    await timers.advance(1_000);
    await until(() => errors.length === 1, "the refusal reported");
    expect(errors[0]).toMatchObject({ code: "node-error", details: { method: null, reason: "handshake-refused", status: 403 } });
    node.refuse = undefined;
    node.on("chain_subscribeNewHeads", () => ({ error: { code: -32601, message: "Method not found" } }));
    await timers.advance(2_000);
    await until(() => errors.length === 2, "the failed re-subscription reported");
    expect(errors[1]).toMatchObject({
      code: "node-error",
      details: { method: "chain_subscribeNewHeads", reason: "rpc-error", rpcCode: -32601 },
    });
    expect(restarted).toBe(0);
    expect(node.count("chain_subscribeNewHeads")).toBe(2);
  });
});

describe("races and the default clock", () => {
  it("ignores a connection given up for its connect timeout, whatever it reports later", async () => {
    const scripted = scriptedSockets();
    const retries: NodeRetry[] = [];
    const states: boolean[] = [];
    const c = client("ws://node.invalid", {
      connect: scripted.connect,
      timers: scripted.timers,
      callTimeoutMs: 2_000,
      onRetry: (retry) => retries.push(retry),
      onRetryingChange: (retrying) => states.push(retrying),
    });
    const head = c.finalizedHead();
    const first = await scripted.next();
    await scripted.timers.advance(2_000);
    expect(first.closed).toBe(true);
    // What the given-up socket reports afterwards changes nothing: no call on it, no reset of the back-off.
    first.events.open();
    first.events.message(JSON.stringify({ jsonrpc: "2.0", id: 1, result: hash(1) }));
    first.events.message("not json");
    first.events.closed({ kind: "closed", code: 1000 });
    await turns();
    expect(first.sent).toEqual([]);
    expect(c.retrying).toBe(true);
    await scripted.timers.advance(1_000);
    await scripted.next();
    await scripted.timers.advance(2_000);
    expect(retries.map((retry) => [retry.operation, retry.attempt, retry.delayMs])).toEqual([
      ["connect", 1, 1_000],
      ["connect", 2, 2_000],
    ]);
    await scripted.timers.advance(2_000);
    const third = await scripted.next();
    third.events.open();
    await turns();
    const request = JSON.parse(third.sent[0] as string) as { id: number };
    third.events.message(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: MAINNET_BLOCK }));
    expect(hex(await head)).toBe(MAINNET_BLOCK);
    expect(states).toEqual([true, false]);
  });

  it("counts a connect function that throws as a failed connection, and tries again", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const timers = new ManualTimers();
    let calls = 0;
    const c = client(node.url(), {
      timers,
      connect: (url, events, t) => {
        if (++calls === 1) throw new Error(`cannot open ${url}`);
        return quietConnect(url, events, t);
      },
    });
    const once = await umbra(c.finalizedHead({ retry: false }));
    expect(once).toMatchObject({
      code: "node-unreachable",
      details: { method: "chain_getFinalizedHead", reason: "connect-failed" },
    });
    expect(once.details).not.toHaveProperty("cause");
    expect(once.message).not.toContain("127.0.0.1");
    const head = c.finalizedHead();
    await timers.advance(1_000);
    expect(hex(await head)).toBe(MAINNET_BLOCK);
    expect(calls).toBe(2);
  });

  it("drops answers whose id is not one of its calls' (a string, null), keeping the connection", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () => ({ result: MAINNET_BLOCK }));
    const c = client(node.url());
    await c.finalizedHead();
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: "1", result: hash(1) }));
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }));
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: 99_999, result: hash(1) }));
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    expect(node.connections).toBe(1);
  });

  it("ends a retry that wakes up as the client closes with handle-closed, sending nothing more", async () => {
    const node = await startNode();
    node.on("chain_getBlockHash", () => ({ error: { code: -32999, message: "RPC rate limit exceeded" } }));
    const manual = new ManualTimers();
    let afterRun: (() => void) | undefined;
    const timers: NodeTimers = {
      setTimeout: (run, ms) =>
        manual.setTimeout(() => {
          run();
          afterRun?.();
        }, ms),
      clearTimeout: manual.clearTimeout,
    };
    const c = client(node.url(), { timers });
    const call = umbra(c.blockHash(1n));
    await until(() => c.retrying, "the back-off");
    afterRun = () => {
      afterRun = undefined;
      void c.close();
    };
    await manual.advance(1_000);
    expect(await call).toMatchObject({ code: "handle-closed" });
    expect(node.count("chain_getBlockHash")).toBe(1);
  });

  it("forgets a subscription cancelled, or a client closed, while it is being made again", async () => {
    const node = await startNode();
    const timers = new ManualTimers();
    const c = client(node.url(), { timers });
    const seen: string[] = [];
    const cancelled = await c.subscribeNewHeads({
      header: () => seen.push("cancelled: header"),
      restarted: () => seen.push("cancelled: restarted"),
      error: () => seen.push("cancelled: error"),
    });
    await c.subscribeFinalizedHeads({
      header: () => seen.push("closed: header"),
      restarted: () => seen.push("closed: restarted"),
      error: () => seen.push("closed: error"),
    });
    const held: { method: string; id: unknown }[] = [];
    for (const method of ["chain_subscribeNewHeads", "chain_subscribeFinalizedHeads"]) {
      node.on(method, (_params, request) => {
        held.push({ method, id: request.id });
        return { silent: true };
      });
    }
    node.drop();
    await until(() => c.retrying, "the lost connection");
    await timers.advance(1_000);
    await until(() => held.length === 2, "both subscriptions being made again");
    cancelled.cancel();
    const again = held.find((request) => request.method === "chain_subscribeNewHeads") as { id: unknown };
    node.sendRaw(JSON.stringify({ jsonrpc: "2.0", id: again.id, result: "late" }));
    node.sendRaw(notification("chain_newHead", "late", headerJson(3)));
    await c.finalizedHead().catch(() => undefined);
    await turns();
    await c.close();
    await turns();
    expect(seen).toEqual([]);
  });

  it("works on the global timers and the ws transport when given neither", async () => {
    const node = await startNode();
    node.on("chain_getFinalizedHead", () =>
      node.count("chain_getFinalizedHead") === 1 ? { result: MAINNET_BLOCK } : { silent: true },
    );
    const c = new NodeClient({ url: node.url(), callTimeoutMs: 50 });
    clients.push(c);
    expect(hex(await c.finalizedHead())).toBe(MAINNET_BLOCK);
    const error = await umbra(c.finalizedHead({ retry: false }));
    expect(error.details).toMatchObject({ reason: "timeout", timeoutMs: 50 });
  });
});

describe("IN-8 over the suite", () => {
  it("sent the fake nodes nothing but IN-8's methods, in every test above (run last)", () => {
    expect(outsideIn8(RECEIVED_BY_ANY_NODE.map((request) => request.method))).toEqual([]);
    // Not vacuous: the tests above sent every allowed method, over many requests. [IN-8]
    expect(new Set(RECEIVED_BY_ANY_NODE.map((request) => request.method)).size).toBe(12);
    expect(RECEIVED_BY_ANY_NODE.length).toBeGreaterThan(100);
  });
});

/** A connect function whose sockets the test drives by hand: what the client sent, and its events. */
function scriptedSockets(): {
  connect: ConnectSocket;
  next(): Promise<{ sent: string[]; events: NodeSocketEvents; closed: boolean }>;
  timers: ManualTimers;
} {
  const made: { sent: string[]; events: NodeSocketEvents; closed: boolean }[] = [];
  let taken = 0;
  const timers = new ManualTimers();
  return {
    timers,
    connect: (_url: string, events: NodeSocketEvents, _timers: NodeTimers) => {
      const socket = { sent: [] as string[], events, closed: false };
      made.push(socket);
      return {
        send: (text: string) => socket.sent.push(text),
        close: () => {
          socket.closed = true;
          queueMicrotask(() => events.closed({ kind: "closed", code: 1000 }));
        },
      };
    },
    async next() {
      await until(() => made.length > taken, "the next connection attempt");
      return made[taken++] as { sent: string[]; events: NodeSocketEvents; closed: boolean };
    },
  };
}

function notification(method: string, subscription: unknown, result: unknown): string {
  return JSON.stringify({ jsonrpc: "2.0", method, params: { subscription, result } });
}

function runtime(changes: Record<string, unknown>): Record<string, unknown> {
  return { ...(recorded("state_getRuntimeVersion").result as Record<string, unknown>), ...changes };
}
