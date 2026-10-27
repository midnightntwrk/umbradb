import { setTimeout as sleep } from "node:timers/promises";
import { afterEach, describe, expect, it } from "vitest";
import { NodeBlockSource, nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { UmbraError } from "../../src/db/errors.js";
import { ledgerTableOf } from "../../src/ledger/networks.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { BlockItems } from "../../src/runner/block-context.js";
import type { BlockRef, QueueRunner } from "../../src/runner/block-source.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import {
  branchOf,
  type ChainBlock,
  chainOf,
  content,
  FINALIZED,
  NEW_HEADS,
  finalizedHead,
  headRead,
  hex,
  newHead,
  RUNTIME,
  subscriptions,
} from "./fetch-fixtures.js";

/**
 * The node source of `core-block-fetch` (task 10.3; IN-4 to IN-6, IN-10) on its own, against a tape node, with a
 * recording queue runner in place of the finalized loop's (`QueueRunner`): the head and its notifications, IN-4's
 * finality conflicts, the prefetch's window and concurrency, the best-block queue — appends, switches, the walk,
 * `tipCap`, errors —, its runs, and its items. The process-level criteria (A79–A81, A83, A89) are
 * `test/backbone/ingest.test.ts`'s.
 */

const quiet: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });
const PATIENCE_MS = 30_000;

/** A queue runner that records what the source asks of it; `fail` makes a point fail for a block. */
class Recorder implements QueueRunner {
  readonly calls: string[] = [];
  readonly stored = new Map<bigint, Uint8Array>();
  fail: (point: "prepare" | "best" | "rollback", block: BlockRef) => Error | undefined = () => undefined;
  /** Held prepares: resolved by the test. */
  hold: ((block: BlockRef) => Promise<void>) | undefined;
  #inFlight = 0;
  maxInFlight = 0;

  name(block: BlockRef): string {
    return `${block.height}${this.labels.get(hex(block.hash)) ?? ""}`;
  }

  readonly labels = new Map<string, string>();

  async prepare(block: BlockRef): Promise<BlockItems> {
    this.calls.push(`prepare ${this.name(block)}`);
    this.#inFlight += 1;
    this.maxInFlight = Math.max(this.maxInFlight, this.#inFlight);
    try {
      await this.hold?.(block);
      const error = this.fail("prepare", block);
      if (error !== undefined) throw error;
      return new BlockItems(block.height);
    } finally {
      this.#inFlight -= 1;
    }
  }

  async bestBlock(block: BlockRef): Promise<void> {
    this.calls.push(`best ${this.name(block)}`);
    const error = this.fail("best", block);
    if (error !== undefined) throw error;
  }

  async rollback(dropped: readonly BlockRef[]): Promise<void> {
    this.calls.push(`rollback ${dropped.map((block) => this.name(block)).join(",")}`);
    const error = this.fail("rollback", dropped[0] as BlockRef);
    if (error !== undefined) throw error;
  }

  async storedHash(height: bigint): Promise<Uint8Array | null> {
    return this.stored.get(height) ?? null;
  }
}

/** What a test opens: a tape node, a client of it and the source; all closed after the test, and what it adds. */
interface Opened {
  readonly node: TapeNode;
  readonly client: NodeClient;
  readonly source: NodeBlockSource;
  /** Another client and source of the test's, closed with the rest. */
  push(client: NodeClient, source: NodeBlockSource): void;
}

const opened: Opened[] = [];
const extra: { readonly client: NodeClient; readonly source: NodeBlockSource }[] = [];
afterEach(async () => {
  for (const { client, source } of extra.splice(0)) {
    await source.close();
    await client.close();
  }
  for (const { node, client, source } of opened.splice(0)) {
    await source.close();
    await client.close();
    await node.close();
  }
});

async function open(
  records: readonly TapeRecord[],
  options: { readonly prefetchWindow?: number; readonly tipCap?: number; readonly concurrency?: number } = {},
  Source: typeof NodeBlockSource = NodeBlockSource,
): Promise<Opened> {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url, connect: quiet });
  const source = new Source({
    client,
    prefetchWindow: options.prefetchWindow ?? 64,
    tipCap: options.tipCap ?? 600,
    ...(options.concurrency === undefined ? {} : { concurrency: options.concurrency }),
  });
  const result: Opened = { node, client, source, push: (c, s) => void extra.push({ client: c, source: s }) };
  opened.push(result);
  return result;
}

/** A read that answers `readCursor` with `cursor` (null: no blocks table). */
function cursorRead(cursor: ChainBlock | null): { query(sql: string): Promise<Record<string, unknown>[]> } {
  return {
    query: async (sql) => {
      if (sql.includes("to_regclass")) return [{ present: cursor !== null }];
      return cursor === null ? [] : [{ height: cursor.height, hash: cursor.hash, parent_hash: cursor.parentHash }];
    },
  };
}

/** Waits until `check` holds, or fails after a while. */
async function until(check: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await sleep(5);
  }
}

/** What `run` rejects with. */
async function rejection(run: Promise<unknown>): Promise<unknown> {
  try {
    await run;
  } catch (error) {
    return error;
  }
  throw new Error("expected a rejection");
}

const never = new AbortController().signal;
const sameHash = (a: Uint8Array, b: Uint8Array): boolean => hex(a) === hex(b);

/**
 * A call record the test itself makes, through the client, to let the notifications after it go out (TT-3: a
 * notification waits for every record before it): so the test sees the source before them.
 */
const FENCE: TapeRecord = { method: "chain_getBlockHash", params: [999_999], result: hex(new Uint8Array(32).fill(9)) };
const passFence = (client: NodeClient) => client.blockHash(999_999n);
const chain = chainOf(120n);
const at = (height: number): ChainBlock => chain[height] as ChainBlock;

/** A finalized height's `chain_getBlockHash` and `chain_getBlock`. */
const hashAndBlock = (block: ChainBlock): TapeRecord[] => [
  { method: "chain_getBlockHash", params: [Number(block.height)], result: block.hex },
  { method: "chain_getBlock", params: [block.hex], result: block.block },
];

describe("the finalized head (IN-4)", () => {
  it("reads the head at start, after subscribing, and lets notifications only raise it", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(10)),
      FENCE,
      finalizedHead(at(13)),
      finalizedHead(at(13)),
      finalizedHead(at(12)),
      finalizedHead(at(14)),
    ];
    const { source, node, client } = await open(records);
    expect((await source.finalizedHead()).height).toBe(10n);
    await passFence(client);
    await source.waitForHead(13n, never);
    expect(await source.finalizedHead()).toEqual({ height: 14n, hash: at(14).hash, parentHash: at(13).hash });
    // The subscriptions first, then the head read: nothing between them is lost.
    expect(node.calls.map((call) => call.method)).toEqual([
      "chain_subscribeFinalizedHeads",
      "chain_subscribeNewHeads",
      "chain_getFinalizedHead",
      "chain_getHeader",
      "chain_getBlockHash",
    ]);
  }, PATIENCE_MS);

  it("waits for a head above the height asked, at once when it is already, and stops on the signal", async () => {
    const { source } = await open([...subscriptions(), ...headRead(at(10)), finalizedHead(at(11))]);
    await source.waitForHead(9n, never);
    await source.waitForHead(10n, never);
    const controller = new AbortController();
    const waiting = source.waitForHead(11n, controller.signal);
    controller.abort(new Error("stopped"));
    expect(await rejection(waiting)).toMatchObject({ message: "stopped" });
    const aborted = new AbortController();
    aborted.abort(new Error("before"));
    expect(await rejection(source.waitForHead(1n, aborted.signal))).toMatchObject({ message: "before" });
  }, PATIENCE_MS);

  it("reads the head again after a reconnect instead of trusting the lost notifications", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(10)),
      finalizedHead(at(11)),
      { disconnect: true },
      ...subscriptions(),
      ...headRead(at(15)),
    ];
    const { source, node } = await open(records);
    await source.finalizedHead();
    await source.waitForHead(14n, never);
    expect((await source.finalizedHead()).height).toBe(15n);
    expect(node.calls.filter((call) => call.method === "chain_getFinalizedHead").map((call) => call.session)).toEqual([1, 2]);
  }, PATIENCE_MS);

  it("takes notifications that came before the head was read, after it", async () => {
    // The node notifies the new subscription at once, before it answers the head read.
    const records: TapeRecord[] = [...subscriptions(), finalizedHead(at(12)), ...headRead(at(10))];
    const { source } = await open(records);
    await source.finalizedHead();
    await source.waitForHead(11n, never);
    expect((await source.finalizedHead()).height).toBe(12n);
  }, PATIENCE_MS);

  it("wakes each wait only once the head passes its height", async () => {
    const { source, client } = await open([...subscriptions(), ...headRead(at(10)), FENCE, finalizedHead(at(11)), FENCE, finalizedHead(at(13))]);
    await source.finalizedHead();
    const woken: bigint[] = [];
    const low = source.waitForHead(10n, never).then(() => woken.push(10n));
    const high = source.waitForHead(12n, never).then(() => woken.push(12n));
    await passFence(client);
    await low;
    expect(woken).toEqual([10n]);
    await passFence(client);
    await high;
    expect(woken).toEqual([10n, 12n]);
  }, PATIENCE_MS);

  it("fails when the head cannot be read again after a reconnect, or a finalized notification cannot be read", async () => {
    const reread = await open([
      ...subscriptions(),
      ...headRead(at(10)),
      { disconnect: true },
      ...subscriptions(),
      { method: "chain_getFinalizedHead", params: [], error: { code: -32_000, message: "unavailable" } },
    ]);
    await reread.source.finalizedHead();
    expect(await rejection(reread.source.waitForHead(10n, never))).toMatchObject({ code: "node-error" });
    // A notification the client cannot read: the finalized subscription's error fails the source; the new heads' does not.
    const unreadable = await open([
      ...subscriptions(),
      ...headRead(at(10)),
      FENCE,
      { notify: NEW_HEADS, result: { bogus: true } },
      { notify: FINALIZED, result: { bogus: true } },
      finalizedHead(at(11)),
    ]);
    await unreadable.source.finalizedHead();
    const waiting = unreadable.source.waitForHead(10n, never);
    await passFence(unreadable.client);
    expect(await rejection(waiting)).toMatchObject({ code: "node-error" });
  }, PATIENCE_MS);

  it("starts again after a start that failed, and refuses to start once closed", async () => {
    const { source } = await open([
      { fault: "error", method: "chain_subscribeFinalizedHeads", params: [], code: -32_000 },
      ...subscriptions(),
      ...headRead(at(10)),
    ]);
    expect(await rejection(source.finalizedHead())).toMatchObject({ code: "node-error" });
    expect((await source.finalizedHead()).height).toBe(10n);
    const closed = await open([]);
    await closed.source.close();
    expect(await rejection(closed.source.finalizedHead())).toMatchObject({ message: expect.stringMatching(/closed/) });
    // A started source's close ends a pending wait, and every later call, with the same error.
    const wait = source.waitForHead(10n, never);
    await source.close();
    const ended = await rejection(wait);
    expect(ended).toMatchObject({ message: expect.stringMatching(/the node source is closed/) });
    expect(await rejection(source.finalizedHead())).toBe(ended);
  }, PATIENCE_MS);

  it("gives the finalized block at a height: chain_getBlockHash, then chain_getHeader", async () => {
    const { source } = await open([
      { method: "chain_getBlockHash", params: [0], result: at(0).hex },
      { method: "chain_getHeader", params: [at(0).hex], result: at(0).header },
      { method: "chain_getBlockHash", params: [5], result: at(5).hex },
      { method: "chain_getHeader", params: [at(5).hex], result: at(6).header },
    ]);
    expect(await source.block(0n)).toEqual({ height: 0n, hash: at(0).hash, parentHash: new Uint8Array(32) });
    const wrong = await rejection(source.block(5n));
    expect(wrong).toBeInstanceOf(UmbraError);
    expect(wrong).toMatchObject({ code: "node-error", details: { method: "chain_getHeader", height: 5n, number: 6n } });
  }, PATIENCE_MS);
});

describe("finality conflicts (IN-4)", () => {
  const other = branchOf(at(11), 14n, "b");
  const b = (height: number): ChainBlock => other[height - 12] as ChainBlock;

  it("fails with finality-conflict when the head's height is notified with another hash", async () => {
    const { source, client } = await open([...subscriptions(), ...headRead(at(13)), FENCE, finalizedHead(b(13))]);
    await source.finalizedHead();
    await passFence(client);
    const halt = await rejection(source.waitForHead(13n, never));
    expect(halt).toBeInstanceOf(UmbraError);
    expect(halt).toMatchObject({
      code: "finality-conflict",
      retryable: false,
      details: { height: 13n, hash: b(13).hex, stored: at(13).hex },
    });
    // Every later call rejects with it.
    expect(await rejection(source.finalizedHead())).toBe(halt);
    expect(await rejection(source.waitForHead(20n, never))).toBe(halt);
  }, PATIENCE_MS);

  it("keeps the finalized hashes it knows above the cursor as the loop goes on: a conflict at the head still fails", async () => {
    // The loop prepares 1 and 2 (window 2); the head's hash at 13 is still known, so 13 notified with another hash
    // fails the source, and the head notified at 14 after it raises nothing.
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(13)),
      ...chain.slice(1, 4).flatMap(hashAndBlock),
      FENCE,
      finalizedHead(b(13)),
      finalizedHead(at(14)),
    ];
    const { source, client } = await open(records, { prefetchWindow: 2 });
    source.attach(new Recorder());
    await source.finalizedHead();
    await source.prepared(1n);
    await source.prepared(2n);
    await passFence(client);
    const halt = await rejection(source.waitForHead(13n, never));
    expect(halt).toMatchObject({ code: "finality-conflict", details: { height: 13n, hash: b(13).hex, stored: at(13).hex } });
  }, PATIENCE_MS);

  it("compares one at or below the loop's cursor with the database's block there", async () => {
    // Two conflicting notifications: the first failure is the one kept.
    const eleven = branchOf(at(10), 11n, "c")[0] as ChainBlock;
    const records: TapeRecord[] = [...subscriptions(), ...headRead(at(13)), FENCE, finalizedHead(b(12)), finalizedHead(eleven)];
    const { source, client } = await open(records);
    const runner = new Recorder();
    runner.stored.set(12n, at(12).hash);
    runner.stored.set(11n, at(11).hash);
    await source.cursor(cursorRead(at(13)));
    source.attach(runner);
    await source.finalizedHead();
    await passFence(client);
    const halt = await rejection(source.waitForHead(13n, never));
    expect(halt).toMatchObject({ code: "finality-conflict", details: { height: 12n, hash: b(12).hex, stored: at(12).hex } });
  }, PATIENCE_MS);

  it("lets one at or below the cursor pass when the database holds that block, or none there", async () => {
    const records: TapeRecord[] = [...subscriptions(), ...headRead(at(13)), finalizedHead(at(12)), finalizedHead(at(9)), finalizedHead(at(14))];
    const { source } = await open(records);
    const runner = new Recorder();
    runner.stored.set(12n, at(12).hash);
    await source.cursor(cursorRead(at(13)));
    source.attach(runner);
    await source.finalizedHead();
    await source.waitForHead(13n, never);
    expect((await source.finalizedHead()).height).toBe(14n);
  }, PATIENCE_MS);
});

describe("the finalized prefetch (IN-5)", () => {
  /**
   * The tape of a catch-up from S = 1 to `head`: per height `chain_getBlockHash` and `chain_getBlock`, in height order
   * (the recording runner reads no item, so no metadata is asked).
   */
  const catchUp = (head: number): TapeRecord[] => [
    ...subscriptions(),
    ...headRead(at(head)),
    ...chain.slice(1, head + 1).flatMap(hashAndBlock),
  ];

  it("prepares each height through the runner, in order, never more than the window above the cursor", async () => {
    const { source, node } = await open(catchUp(100), { prefetchWindow: 8, concurrency: 3 });
    const runner = new Recorder();
    source.attach(runner);
    await source.finalizedHead();
    const highest = () => Math.max(0, ...node.calls.filter((c) => c.method === "chain_getBlockHash").map((c) => (c.params as number[])[0] as number));
    for (let height = 1n; height <= 100n; height++) {
      const prepared = await source.prepared(height);
      expect(prepared.block).toEqual({ height, hash: at(Number(height)).hash, parentHash: at(Number(height) - 1).hash });
      expect(prepared.items).toBeInstanceOf(BlockItems);
      // The cursor is height − 1 while the loop holds height: heights up to height − 1 + 8 at most were asked.
      expect(highest()).toBeLessThanOrEqual(Number(height) - 1 + 8);
    }
    expect(runner.calls).toHaveLength(100);
    expect(new Set(runner.calls).size).toBe(100);
    expect(runner.maxInFlight).toBeLessThanOrEqual(3);
    // One chain_getBlockHash and one chain_getBlock a height, no more.
    expect(node.count("chain_getBlockHash")).toBe(100);
    expect(node.count("chain_getBlock")).toBe(100);
  }, PATIENCE_MS * 2);

  it("fetches ahead with bounded concurrency: at most `concurrency` heights at once", async () => {
    const { source } = await open(catchUp(20), { prefetchWindow: 16, concurrency: 4 });
    const runner = new Recorder();
    const gates: (() => void)[] = [];
    runner.hold = (block) => (block.height === 1n ? Promise.resolve() : new Promise<void>((resolve) => gates.push(resolve)));
    source.attach(runner);
    await source.finalizedHead();
    await source.prepared(1n);
    await until(() => gates.length === 4, "four held prepares");
    await sleep(50);
    expect(gates).toHaveLength(4);
    expect(runner.maxInFlight).toBe(4);
    for (;;) {
      const gate = gates.shift();
      if (gate !== undefined) {
        gate();
        continue;
      }
      if (runner.calls.length === 16) break;
      await sleep(5);
    }
    expect(runner.maxInFlight).toBe(4);
  }, PATIENCE_MS);

  it("prefetches only up to the head the loop last read, so its on-finalized comes first", async () => {
    const records: TapeRecord[] = [...catchUp(10), finalizedHead(at(12)), ...hashAndBlock(at(11)), ...hashAndBlock(at(12))];
    const { source, node } = await open(records, { prefetchWindow: 64 });
    const runner = new Recorder();
    source.attach(runner);
    expect((await source.finalizedHead()).height).toBe(10n);
    for (let height = 1n; height <= 10n; height++) await source.prepared(height);
    // The head rose to 12 meanwhile; the loop has not read it: nothing above 10 asked.
    await source.waitForHead(11n, never);
    expect(node.count("chain_getBlockHash", [11])).toBe(0);
    expect((await source.finalizedHead()).height).toBe(12n);
    await source.prepared(11n);
    await source.prepared(12n);
    expect(node.count("chain_getBlockHash", [12])).toBe(1);
  }, PATIENCE_MS);

  it("bounds the prefetch by the head the loop read, not by one a notification raised meanwhile", async () => {
    // The notification goes out once heights 1–5 are answered; the loop then prepares 6–10 without reading the head.
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(10)),
      ...chain.slice(1, 6).flatMap(hashAndBlock),
      finalizedHead(at(12)),
      ...chain.slice(6, 13).flatMap(hashAndBlock),
    ];
    const { source, node } = await open(records, { prefetchWindow: 64 });
    source.attach(new Recorder());
    expect((await source.finalizedHead()).height).toBe(10n);
    for (let height = 1n; height <= 5n; height++) await source.prepared(height);
    await source.waitForHead(11n, never);
    for (let height = 6n; height <= 10n; height++) await source.prepared(height);
    expect(node.count("chain_getBlockHash", [11]) + node.count("chain_getBlockHash", [12])).toBe(0);
    expect((await source.finalizedHead()).height).toBe(12n);
    await source.prepared(11n);
    await source.prepared(12n);
    expect(node.count("chain_getBlockHash", [11])).toBe(1);
  }, PATIENCE_MS);

  it("fails the height when the node answers chain_getBlock with a block of another height", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(3)),
      { method: "chain_getBlockHash", params: [1], result: at(1).hex },
      { method: "chain_getBlock", params: [at(1).hex], result: at(2).block },
    ];
    const { source } = await open(records, { prefetchWindow: 1 });
    source.attach(new Recorder());
    await source.finalizedHead();
    const wrong = await rejection(source.prepared(1n));
    expect(wrong).toBeInstanceOf(UmbraError);
    expect(wrong).toMatchObject({ code: "node-error", details: { method: "chain_getBlock", height: 1n, number: 2n } });
  }, PATIENCE_MS);

  it("rejects the loop's height with its failure: a node's, or the runner's", async () => {
    const records: TapeRecord[] = [...subscriptions(), ...headRead(at(3)), ...hashAndBlock(at(1)), ...hashAndBlock(at(2))];
    const { source } = await open(records, { prefetchWindow: 2 });
    const runner = new Recorder();
    runner.fail = (point, block) => (point === "prepare" && block.height === 2n ? new Error("on-parse failed at 2") : undefined);
    source.attach(runner);
    await source.finalizedHead();
    await source.prepared(1n);
    expect(await rejection(source.prepared(2n))).toMatchObject({ message: "on-parse failed at 2" });
    // Height 3 is not on the tape: the node's not-on-tape answer is a node-error, never retried.
    expect(await rejection(source.prepared(3n))).toMatchObject({ code: "node-error" });
  }, PATIENCE_MS);

  it("refuses to prepare outside a run, and drops a run's work when the run ends", async () => {
    const records: TapeRecord[] = [...subscriptions(), ...headRead(at(5)), ...chain.slice(1, 6).flatMap(hashAndBlock)];
    const { source } = await open(records, { prefetchWindow: 4 });
    expect(await rejection(source.prepared(1n))).toMatchObject({ message: expect.stringMatching(/only while the loop runs/) });
    const first = new Recorder();
    const detach = source.attach(first);
    await source.finalizedHead();
    await source.prepared(1n);
    detach();
    detach();
    const prepared = first.calls.length;
    await sleep(100);
    expect(first.calls.length).toBe(prepared);
    const second = new Recorder();
    source.attach(second);
    await source.finalizedHead();
    // The new run starts afresh: height 2 is prepared through the new runner.
    expect((await source.prepared(2n)).block.height).toBe(2n);
    expect(second.calls).toContain("prepare 2");
    expect(first.calls.length).toBe(prepared);
  }, PATIENCE_MS);

  it("prefetches nothing in a new run until the loop reads the head in it: the last run's head is not the bound", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(10)),
      ...chain.slice(1, 11).flatMap(hashAndBlock),
      ...hashAndBlock(at(1)),
    ];
    const { source, node } = await open(records, { prefetchWindow: 64 });
    const detach = source.attach(new Recorder());
    await source.finalizedHead();
    await source.prepared(1n);
    await until(() => node.count("chain_getBlock") === 10, "the first run's prefetch of 1–10");
    detach();
    // The next run asks for height 1 before it reads the head: 1 alone is fetched, not the first run's window.
    source.attach(new Recorder());
    await source.prepared(1n);
    await sleep(200);
    expect(node.count("chain_getBlockHash", [1])).toBe(2);
    expect(node.count("chain_getBlockHash", [2])).toBe(1);
  }, PATIENCE_MS);

  it("drops a height whose answer comes after the run ended, running none of its points", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(at(3)),
      ...hashAndBlock(at(1)),
      { ...(hashAndBlock(at(2))[0] as TapeRecord), delayMs: 300 },
      ...hashAndBlock(at(2)).slice(1),
    ];
    const { source, node } = await open(records, { prefetchWindow: 2 });
    const first = new Recorder();
    const detach = source.attach(first);
    await source.finalizedHead();
    await source.prepared(1n);
    detach();
    await until(() => node.calls.some((call) => call.method === "chain_getBlockHash" && call.outcome === "answered" && (call.params as number[])[0] === 2), "height 2's hash");
    await sleep(400);
    expect(first.calls).toEqual(["prepare 1"]);
    expect(node.count("chain_getBlock", [at(2).hex])).toBe(0);
  }, PATIENCE_MS);

  it("prepares the loop's height even when the prefetch has not begun it", async () => {
    // No head read in this run (the loop reads it first): the window has no bound, and the height is begun when asked.
    const { source } = await open(hashAndBlock(at(1)));
    const runner = new Recorder();
    source.attach(runner);
    expect((await source.prepared(1n)).block.height).toBe(1n);
    expect(runner.calls).toEqual(["prepare 1"]);
  }, PATIENCE_MS);

  it("checks its options and makes itself from a core revision and the process's client", async () => {
    const client = new NodeClient({ url: "ws://127.0.0.1:9/node", connect: quiet });
    try {
      for (const bad of [{ prefetchWindow: 0, tipCap: 1 }, { prefetchWindow: 1, tipCap: 1.5 }, { prefetchWindow: 1, tipCap: 1, concurrency: -1 }]) {
        expect(() => new NodeBlockSource({ client, ...bad })).toThrow(RangeError);
      }
      expect(nodeSourceOf({ settings: { prefetchWindow: 64, tipCap: 600 } }, { nodeClient: client })).toBeInstanceOf(NodeBlockSource);
      const refused = (() => {
        try {
          nodeSourceOf({ settings: {} }, { nodeClient: null });
        } catch (error) {
          return error;
        }
        return undefined;
      })();
      expect(refused).toMatchObject({ code: "invalid-configuration", details: { field: "node" } });
    } finally {
      await client.close();
    }
  });
});

describe("the best-block queue (IN-6)", () => {
  const head = at(100);
  const a = branchOf(head, 106n, "a2");
  const b = branchOf(head, 106n, "b");
  const A = (h: number) => a[h - 101] as ChainBlock;
  const B = (h: number) => b[h - 101] as ChainBlock;
  /** Extra labels a test adds for blocks of other branches. */
  const runnerLabel = new Map<string, string>();
  const label = (runner: Recorder) => {
    for (const block of a) runner.labels.set(block.hex, "A");
    for (const block of b) runner.labels.set(block.hex, "B");
    for (const [key, value] of runnerLabel) runner.labels.set(key, value);
  };
  /** A best block's calls: chain_getBlock (no retry) — its content is core-block-fetch's, not the runner's here. */
  const fetched = (block: ChainBlock): TapeRecord => ({ method: "chain_getBlock", params: [block.hex], result: block.block });

  /** A source following at cursor 100 = head 100 with `records` after its opening. */
  async function following(records: readonly TapeRecord[], options: { readonly tipCap?: number } = {}) {
    const opened = await open([...subscriptions(), ...headRead(head), ...records], options);
    const runner = new Recorder();
    label(runner);
    await opened.source.cursor(cursorRead(head));
    opened.source.attach(runner);
    await opened.source.finalizedHead();
    return { ...opened, runner };
  }

  it("fires on-best-block, fetches and parses each block, and appends it when its parent is the top", async () => {
    const { source, runner } = await following([newHead(A(101)), fetched(A(101)), newHead(A(102)), fetched(A(102))]);
    await until(() => runner.calls.length === 4, "two best blocks");
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 102A", "prepare 102A"]);
    expect(source.conditions()).toEqual([]);
  }, PATIENCE_MS);

  it("on a best-chain switch fires on-rollback once naming 101–103, and uses 101′ at finality without fetching it again", async () => {
    const records: TapeRecord[] = [
      ...[101, 102, 103].flatMap((h) => [newHead(A(h)), fetched(A(h))]),
      ...[101, 102, 103, 104].flatMap((h) => [newHead(B(h)), fetched(B(h))]),
      finalizedHead(B(101)),
      { method: "chain_getBlockHash", params: [101], result: B(101).hex },
    ];
    const { source, runner, node } = await following(records);
    await until(() => runner.calls.includes("prepare 104B"), "the new branch queued");
    await source.idle();
    expect(runner.calls).toEqual([
      "best 101A",
      "prepare 101A",
      "best 102A",
      "prepare 102A",
      "best 103A",
      "prepare 103A",
      "best 101B",
      "prepare 101B",
      "rollback 101A,102A,103A",
      "best 102B",
      "prepare 102B",
      "best 103B",
      "prepare 103B",
      "best 104B",
      "prepare 104B",
    ]);
    await source.waitForHead(100n, never);
    expect((await source.finalizedHead()).height).toBe(101n);
    const prepared = await source.prepared(101n);
    expect(prepared.block).toEqual({ height: 101n, hash: B(101).hash, parentHash: head.hash });
    expect(node.count("chain_getBlock", [B(101).hex])).toBe(1);
    expect(runner.calls.filter((call) => call.startsWith("prepare 101"))).toEqual(["prepare 101A", "prepare 101B"]);
  }, PATIENCE_MS);

  it("walks a block's parents back to a queued block, and fetches the branch between", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      newHead(B(103)),
      fetched(B(103)),
      { method: "chain_getHeader", params: [B(102).hex], result: B(102).header },
      { method: "chain_getHeader", params: [B(101).hex], result: B(101).header },
      fetched(B(101)),
      fetched(B(102)),
      finalizedHead(B(103)),
      ...[101, 102, 103].map((h): TapeRecord => ({ method: "chain_getBlockHash", params: [h], result: B(h).hex })),
    ];
    const { source, runner, node } = await following(records);
    await until(() => runner.calls.includes("prepare 102B"), "the branch fetched");
    await source.idle();
    // 103′'s parents walked to the finalized head 100: 101 dropped, 101′ and 102′ fetched and parsed, then 103′ queued.
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 103B", "prepare 103B", "rollback 101A", "prepare 101B", "prepare 102B"]);
    // Finalized, the queued branch is used as it is, lowest first: nothing fetched again.
    await source.waitForHead(100n, never);
    await source.finalizedHead();
    for (const h of [101n, 102n, 103n]) expect((await source.prepared(h)).block.hash).toEqual(B(Number(h)).hash);
    expect([101, 102, 103].map((h) => node.count("chain_getBlock", [B(h).hex]))).toEqual([1, 1, 1]);
    expect(runner.calls).toHaveLength(7);
  }, PATIENCE_MS);

  it("queues a best block the finalized head reached while it was prepared, and uses it at finality, unfetched", async () => {
    // Task 11.1 (A92: each transaction parsed once): the head's notification of 101 comes while 101's prepare runs.
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      finalizedHead(A(101)),
      { method: "chain_getBlockHash", params: [101], result: A(101).hex },
    ];
    let release: () => void = () => undefined;
    const { source, runner, node } = await following(records);
    runner.hold = () => new Promise<void>((resolve) => (release = resolve));
    await until(() => runner.calls.includes("prepare 101A"), "101 being prepared");
    await source.waitForHead(100n, never);
    expect((await source.finalizedHead()).height).toBe(101n);
    release();
    await source.idle();
    const prepared = await source.prepared(101n);
    expect(prepared.block.hash).toEqual(A(101).hash);
    expect(node.count("chain_getBlock", [A(101).hex])).toBe(1);
    expect(runner.calls).toEqual(["best 101A", "prepare 101A"]);
  }, PATIENCE_MS);

  it("drops such a block with on-rollback when the head reached its height with another hash, and fetches that one", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      finalizedHead(B(101)),
      { method: "chain_getBlockHash", params: [101], result: B(101).hex },
      fetched(B(101)),
    ];
    let release: () => void = () => undefined;
    const { source, runner, node } = await following(records);
    runner.hold = (block) => (sameHash(block.hash, A(101).hash) ? new Promise<void>((resolve) => (release = resolve)) : Promise.resolve());
    await until(() => runner.calls.includes("prepare 101A"), "101 being prepared");
    await source.waitForHead(100n, never);
    release();
    await source.idle();
    expect((await source.prepared(101n)).block.hash).toEqual(B(101).hash);
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "rollback 101A", "prepare 101B"]);
    expect(node.count("chain_getBlock", [B(101).hex])).toBe(1);
  }, PATIENCE_MS);

  it("does not queue a competing block at a height the head reached while it was prepared, when the queue holds one there", async () => {
    // 101 queued; 101′ announced and held in its prepare; the head reaches 101 (101's hash): 101′ is not queued beside
    // it, so the next best block, 102 over 101, is appended with no on-rollback of 101′.
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      newHead(B(101)),
      fetched(B(101)),
      finalizedHead(A(101)),
      { method: "chain_getBlockHash", params: [101], result: A(101).hex },
      newHead(A(102)),
      fetched(A(102)),
    ];
    let release: () => void = () => undefined;
    const { source, runner } = await following(records);
    runner.hold = (block) => (sameHash(block.hash, B(101).hash) ? new Promise<void>((resolve) => (release = resolve)) : Promise.resolve());
    await until(() => runner.calls.includes("prepare 101B"), "101′ being prepared");
    await source.waitForHead(100n, never);
    release();
    await source.idle();
    expect((await source.prepared(101n)).block.hash).toEqual(A(101).hash);
    await until(() => runner.calls.includes("prepare 102A"), "102 prepared");
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 101B", "prepare 101B", "best 102A", "prepare 102A"]);
  }, PATIENCE_MS);

  it("holds at most tipCap blocks: while full the next best block is not queued, and finality-stall is reported", async () => {
    const records: TapeRecord[] = [...[101, 102, 103, 104, 105].flatMap((h) => [newHead(A(h)), fetched(A(h))]), newHead(A(106))];
    const { source, runner, node } = await following(records, { tipCap: 5 });
    await until(() => source.conditions()[0]?.height === 106n, "the sixth best block");
    await source.idle();
    expect(source.conditions()).toEqual([{ code: "finality-stall", tipCap: 5, height: 106n }]);
    expect(runner.calls.filter((call) => call.startsWith("best"))).toEqual(["best 101A", "best 102A", "best 103A", "best 104A", "best 105A"]);
    expect(node.count("chain_getBlock", [A(106).hex])).toBe(0);
  }, PATIENCE_MS);

  it("drops a best block on any error — its fetch, on-best-block, on-fetch or on-parse — without retrying it", async () => {
    // 101's chain_getBlock is not on the tape: a node error, not retried.
    const records: TapeRecord[] = [newHead(A(101)), newHead(A(102)), fetched(A(102)), newHead(A(103)), fetched(A(103))];
    const { source, runner, node } = await following(records);
    runner.fail = (point, block) => (point === "prepare" && block.height === 103n ? new Error("on-parse failed") : undefined);
    await until(() => runner.calls.includes("prepare 103A"), "the third best block");
    await source.idle();
    expect(node.count("chain_getBlock", [A(101).hex])).toBe(1);
    // 102's parent is not queued: the walk reaches the head and finds no 101 to connect it, its header not on the tape.
    expect(runner.calls).toEqual(["best 101A", "best 102A", "prepare 102A", "best 103A", "prepare 103A"]);
  }, PATIENCE_MS);

  it("ignores best blocks at or below the finalized head, repeats, and every one while the loop catches up", async () => {
    const records: TapeRecord[] = [newHead(at(100)), newHead(A(101)), fetched(A(101)), newHead(A(101))];
    const { source, runner } = await following(records);
    await until(() => runner.calls.length === 2, "one best block");
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A"]);
    // A catch-up: the cursor 0, the head 100 — more than the window above it (Q129).
    const behind = await open([...subscriptions(), ...headRead(head), newHead(A(101))], { prefetchWindow: 64 });
    const quiet = new Recorder();
    await behind.source.cursor(cursorRead(at(0)));
    behind.source.attach(quiet);
    await behind.source.finalizedHead();
    await sleep(200);
    await behind.source.idle();
    expect(quiet.calls).toEqual([]);
    expect(behind.source.conditions()).toEqual([]);
  }, PATIENCE_MS);

  it("ignores a best block at the finalized head's height with the cursor below it, and at or below a cursor ahead", async () => {
    // Following at the cursor 98 with the head at 100: the head's own block announced as a best block is no best block.
    const below = await open([...subscriptions(), ...headRead(head), newHead(head), newHead(A(101)), fetched(A(101))]);
    const runner = new Recorder();
    label(runner);
    await below.source.cursor(cursorRead(at(98)));
    below.source.attach(runner);
    await below.source.finalizedHead();
    await until(() => runner.calls.includes("prepare 101A"), "101A");
    await below.source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A"]);
    // A cursor ahead of the head the node reports (100): a block above the head but at or below the cursor is stored.
    const ahead = await open([...subscriptions(), ...headRead(head), newHead(A(103)), FENCE]);
    const quiet = new Recorder();
    await ahead.source.cursor(cursorRead(at(105)));
    ahead.source.attach(quiet);
    await ahead.source.finalizedHead();
    await passFence(ahead.client);
    await ahead.source.idle();
    expect(quiet.calls).toEqual([]);
  }, PATIENCE_MS);

  it("runs no callback once it failed: a head rising after a finality conflict drops nothing", async () => {
    // A finalized notification at the head's height with another hash fails the source; the next one, which would
    // drop 102A, comes after it. The fence after them, asked last on the same connection, shows both were received.
    const fork = branchOf(at(99), 100n, "x")[0] as ChainBlock;
    const fence: TapeRecord = { method: "chain_getBlockHash", params: [999_998], result: hex(new Uint8Array(32).fill(8)) };
    const records: TapeRecord[] = [
      ...[101, 102].flatMap((h) => [newHead(A(h)), fetched(A(h))]),
      finalizedHead(fork),
      finalizedHead(B(102)),
      fence,
    ];
    const { source, runner, client } = await following(records);
    const halt = await rejection(source.waitForHead(100n, never));
    expect(halt).toMatchObject({ code: "finality-conflict", details: { height: 100n } });
    await client.blockHash(999_998n);
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 102A", "prepare 102A"]);
  }, PATIENCE_MS);

  it("starts each run with an empty queue: a block queued in an earlier run is fetched again at finality", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      FENCE,
      finalizedHead(A(101)),
      { method: "chain_getBlockHash", params: [101], result: A(101).hex },
      fetched(A(101)),
    ];
    const { source, client } = await open([...subscriptions(), ...headRead(head), ...records]);
    const first = new Recorder();
    label(first);
    await source.cursor(cursorRead(head));
    const detach = source.attach(first);
    await source.finalizedHead();
    await until(() => first.calls.includes("prepare 101A"), "101A queued");
    await source.idle();
    // The run ends (a retry, say) and the next begins: what the first queued is not the second's.
    detach();
    const second = new Recorder();
    label(second);
    source.attach(second);
    await passFence(client);
    await source.waitForHead(100n, never);
    expect((await source.finalizedHead()).height).toBe(101n);
    expect((await source.prepared(101n)).block.hash).toEqual(A(101).hash);
    expect(first.calls).toEqual(["best 101A", "prepare 101A"]);
    expect(second.calls).toEqual(["prepare 101A"]);
  }, PATIENCE_MS);

  it("drops the queue from a height the finalized head names with another hash, and checks a queued block at finality", async () => {
    const records: TapeRecord[] = [
      ...[101, 102].flatMap((h) => [newHead(A(h)), fetched(A(h))]),
      finalizedHead(B(102)),
      { method: "chain_getBlockHash", params: [101], result: B(101).hex },
      fetched(B(101)),
      { method: "chain_getBlockHash", params: [102], result: B(102).hex },
      fetched(B(102)),
    ];
    const { source, runner } = await following(records);
    // As the loop waits, at its cursor 100.
    await source.waitForHead(100n, never);
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 102A", "prepare 102A", "rollback 102A"]);
    await source.finalizedHead();
    // 101 is queued with A's hash; the finalized hash is B's: dropped (on-rollback), and B's block fetched.
    expect((await source.prepared(101n)).block.hash).toEqual(B(101).hash);
    expect((await source.prepared(102n)).block.hash).toEqual(B(102).hash);
    const finality = runner.calls.slice(5);
    expect([...finality].sort()).toEqual(["prepare 101B", "prepare 102B", "rollback 101A"]);
    expect(finality.indexOf("rollback 101A")).toBeLessThan(finality.indexOf("prepare 101B"));
  }, PATIENCE_MS);

  it("walks back to a queued block: a fork above it drops only the blocks above the ancestor", async () => {
    const c = branchOf(A(102), 103n, "c")[0] as ChainBlock;
    runnerLabel.set(c.hex, "C");
    const records: TapeRecord[] = [...[101, 102, 103].flatMap((h) => [newHead(A(h)), fetched(A(h))]), newHead(c), fetched(c)];
    const { source, runner } = await following(records);
    await until(() => runner.calls.includes("rollback 103A"), "the fork");
    await source.idle();
    expect(runner.calls.slice(6)).toEqual(["best 103C", "prepare 103C", "rollback 103A"]);
  }, PATIENCE_MS);

  it("walks back to the head with nothing queued: no on-rollback, and the branch fetched below the new block", async () => {
    const records: TapeRecord[] = [
      newHead(A(102)),
      fetched(A(102)),
      { method: "chain_getHeader", params: [A(101).hex], result: A(101).header },
      fetched(A(101)),
    ];
    const { source, runner } = await following(records);
    await until(() => runner.calls.includes("prepare 101A"), "the branch");
    await source.idle();
    expect(runner.calls).toEqual(["best 102A", "prepare 102A", "prepare 101A"]);
  }, PATIENCE_MS);

  it("drops a best block that does not descend from the finalized head, and one whose branch exceeds tipCap", async () => {
    const stray = branchOf(chain[99] as ChainBlock, 102n, "stray");
    runnerLabel.set((stray[2] as ChainBlock).hex, "S");
    const records: TapeRecord[] = [
      newHead(stray[2] as ChainBlock),
      fetched(stray[2] as ChainBlock),
      { method: "chain_getHeader", params: [(stray[1] as ChainBlock).hex], result: (stray[1] as ChainBlock).header },
      newHead(A(101)),
      fetched(A(101)),
      newHead(B(103)),
      fetched(B(103)),
      { method: "chain_getHeader", params: [B(102).hex], result: B(102).header },
      { method: "chain_getHeader", params: [B(101).hex], result: B(101).header },
      // Last, so nothing waits for it: the stray branch's 101, which a source taking the stray block as a descendant
      // of the head would fetch and queue.
      fetched(stray[1] as ChainBlock),
    ];
    const { source, runner, node } = await following(records, { tipCap: 2 });
    await until(() => runner.calls.includes("prepare 103B"), "the long branch");
    await source.idle();
    // The stray block's parents reach height 100 at another block than the head: dropped. 103′ would need 101′–103′
    // in a queue of 2: not queued, nothing dropped.
    expect(runner.calls).toEqual(["best 102S", "prepare 102S", "best 101A", "prepare 101A", "best 103B", "prepare 103B"]);
    expect(node.count("chain_getBlock", [(stray[1] as ChainBlock).hex])).toBe(0);
    expect(source.conditions()).toEqual([]);
  }, PATIENCE_MS);

  it("fails the height when on-rollback fails at finality, and drops queued blocks whatever on-rollback does on a head rise", async () => {
    const records: TapeRecord[] = [
      ...[101, 102].flatMap((h) => [newHead(A(h)), fetched(A(h))]),
      finalizedHead(B(102)),
      { method: "chain_getBlockHash", params: [101], result: B(101).hex },
    ];
    const { source, runner } = await following(records);
    runner.fail = (point) => (point === "rollback" ? new Error("on-rollback failed") : undefined);
    // As the loop waits, at its cursor 100.
    await source.waitForHead(100n, never);
    await source.idle();
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 102A", "prepare 102A", "rollback 102A"]);
    await source.finalizedHead();
    expect(await rejection(source.prepared(101n))).toMatchObject({ message: "on-rollback failed" });
    expect(runner.calls.at(-1)).toBe("rollback 101A");
  }, PATIENCE_MS);

  it("makes a best block's calls without retries: a timeout drops it at once, never asked again", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      { fault: "timeout", method: "chain_getBlock", params: [A(101).hex] },
      newHead(B(101)),
      fetched(B(101)),
    ];
    const opened = await open([...subscriptions(), ...headRead(head), ...records]);
    // A client whose calls time out after 300 ms (a retried call would be sent again 1 s later).
    const client = new NodeClient({ url: opened.node.url, connect: quiet, callTimeoutMs: 300 });
    const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap: 600 });
    opened.push(client, source);
    const runner = new Recorder();
    label(runner);
    await source.cursor(cursorRead(head));
    source.attach(runner);
    await source.finalizedHead();
    await until(() => runner.calls.includes("prepare 101B"), "the next best block");
    expect(opened.node.count("chain_getBlock", [A(101).hex])).toBe(1);
    expect(runner.calls).toEqual(["best 101A", "best 101B", "prepare 101B"]);
  }, PATIENCE_MS);

  it("reads a best block's runtime without retries too: a runtime version that times out drops it, asked once", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      { fault: "timeout", method: "state_getRuntimeVersion", params: [head.hex] },
    ];
    const opened = await open([...subscriptions(), ...headRead(head), ...records]);
    // Calls time out after 300 ms; a retried one would be sent again 1 s later.
    const client = new NodeClient({ url: opened.node.url, connect: quiet, callTimeoutMs: 300 });
    const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap: 600 });
    opened.push(client, source);
    // A runner whose on-fetch is core-block-fetch's: the block's items from the source.
    const table = ledgerTableOf("preprod", undefined);
    class Fetching extends Recorder {
      override async prepare(block: BlockRef): Promise<BlockItems> {
        this.calls.push(`prepare ${this.name(block)}`);
        await source.blockItems(block, table);
        return new BlockItems(block.height);
      }
    }
    const runner = new Fetching();
    label(runner);
    await source.cursor(cursorRead(head));
    source.attach(runner);
    await source.finalizedHead();
    await until(() => runner.calls.includes("prepare 101A"), "101A fetched");
    await source.idle();
    expect(opened.node.count("state_getRuntimeVersion", [head.hex])).toBe(1);
  }, PATIENCE_MS);

  it("appends a best block only on the top's own hash: a child of another block at that height is walked", async () => {
    const records: TapeRecord[] = [
      newHead(A(101)),
      fetched(A(101)),
      newHead(B(102)),
      fetched(B(102)),
      { method: "chain_getHeader", params: [B(101).hex], result: B(101).header },
      fetched(B(101)),
    ];
    const { source, runner } = await following(records);
    await until(() => runner.calls.includes("prepare 102B"), "102B");
    await source.idle();
    // 102B's parent is 101B, not the queued 101A: 101A dropped, 101B fetched below it.
    expect(runner.calls).toEqual(["best 101A", "prepare 101A", "best 102B", "prepare 102B", "rollback 101A", "prepare 101B"]);
  }, PATIENCE_MS);

  it("drops, at finality, the queued blocks from the lowest one the finalized chain replaced, with one on-rollback", async () => {
    // Queued 101A–103A; the finalized head jumps to 103B, which drops 103A; then at 101 and 102 the finalized hashes are
    // B's: one on-rollback from 101, whatever order the prefetch's hash reads come back in.
    const records: TapeRecord[] = [
      ...[101, 102, 103].flatMap((h) => [newHead(A(h)), fetched(A(h))]),
      finalizedHead(B(103)),
      ...[101, 102, 103].flatMap((h) => [
        { method: "chain_getBlockHash", params: [h], result: B(h).hex, ...(h === 101 ? { delayMs: 200 } : {}) },
        fetched(B(h)),
      ]),
    ];
    const { source, runner } = await following(records);
    await source.waitForHead(102n, never);
    await source.idle();
    expect((await source.finalizedHead()).height).toBe(103n);
    for (const h of [101n, 102n, 103n]) expect((await source.prepared(h)).block.hash).toEqual(B(Number(h)).hash);
    expect(runner.calls.filter((call) => call.startsWith("rollback"))).toEqual(["rollback 103A", "rollback 101A,102A"]);
  }, PATIENCE_MS);

  it("walks without retries too: a parent header that times out drops the best block, asked once", async () => {
    const records: TapeRecord[] = [
      newHead(A(102)),
      fetched(A(102)),
      { fault: "timeout", method: "chain_getHeader", params: [A(101).hex] },
      newHead(B(101)),
      fetched(B(101)),
    ];
    const opened = await open([...subscriptions(), ...headRead(head), ...records]);
    // Calls time out after 300 ms; a retried one would be sent again 1 s later, before the next best block's turn.
    const client = new NodeClient({ url: opened.node.url, connect: quiet, callTimeoutMs: 300 });
    const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap: 600 });
    opened.push(client, source);
    const runner = new Recorder();
    label(runner);
    await source.cursor(cursorRead(head));
    source.attach(runner);
    await source.finalizedHead();
    await until(() => runner.calls.includes("prepare 101B"), "the next best block");
    expect(opened.node.count("chain_getHeader", [A(101).hex])).toBe(1);
    expect(runner.calls).toEqual(["best 102A", "prepare 102A", "best 101B", "prepare 101B"]);
  }, PATIENCE_MS);

  it("drops a best block whose fetch is answered after the run ended, running none of its points", async () => {
    const records: TapeRecord[] = [newHead(A(101)), { ...fetched(A(101)), delayMs: 300 }];
    const opened = await open([...subscriptions(), ...headRead(head), ...records]);
    const runner = new Recorder();
    label(runner);
    await opened.source.cursor(cursorRead(head));
    const detach = opened.source.attach(runner);
    await opened.source.finalizedHead();
    await until(() => runner.calls.includes("best 101A"), "the best block announced");
    detach();
    await until(() => opened.node.calls.some((call) => call.method === "chain_getBlock" && call.outcome === "answered"), "the answer");
    await sleep(400);
    await opened.source.idle();
    expect(runner.calls).toEqual(["best 101A"]);
  }, PATIENCE_MS);

  it("runs no callback outside a run: a best block after the run ended is not announced", async () => {
    const opened = await open([...subscriptions(), ...headRead(head), newHead(A(101)), fetched(A(101))]);
    const runner = new Recorder();
    await opened.source.cursor(cursorRead(head));
    const detach = opened.source.attach(runner);
    detach();
    await opened.source.finalizedHead();
    await sleep(200);
    await opened.source.idle();
    expect(runner.calls).toEqual([]);
  }, PATIENCE_MS);
});

describe("core-block-fetch's items from the node (CD-2, LG-1, LG-4)", () => {
  const table = ledgerTableOf("preprod", undefined);
  const block = (h: number): BlockRef => ({ height: BigInt(h), hash: at(h).hash, parentHash: at(h).parentHash });

  it("gives the header, the body decoded with the parent's runtime, that runtime's metadata and the ledger version", async () => {
    const { source, node } = await open([...content(at(7), RUNTIME, true), ...content(at(8), RUNTIME, false)]);
    const items = await source.blockItems(block(7), table);
    expect(items["block-header"]).toMatchObject({
      height: 7n,
      hash: at(7).hash,
      parentHash: at(6).hash,
      specVersion: 2_000_000,
      timestampMs: at(7).timestampMs,
    });
    expect(items["block-body"].specVersion).toBe(2_000_000);
    expect(items["block-body"].extrinsics.map((e) => `${e.call?.pallet}.${e.call?.call}`)).toEqual(["Timestamp.set"]);
    expect(items["runtime-metadata"]).toEqual({ specVersion: 2_000_000, metadata: RUNTIME.metadata });
    // Preprod's built-in table: runtime 2.0's ledger is v9 as it built it, the rc.3 package (task 12.2a, Q139 A).
    expect(items["ledger-version"]).toBe("v9-rc3");
    expect(Object.isFrozen(items)).toBe(true);
    // The runtime read at the parent's state; its metadata once for the runtime.
    expect(node.calls.map((call) => [call.method, call.params])).toEqual([
      ["chain_getBlock", [at(7).hex]],
      ["state_getRuntimeVersion", [at(6).hex]],
      ["state_getMetadata", [at(6).hex]],
    ]);
    await source.blockItems(block(8), table);
    expect(node.count("state_getMetadata")).toBe(1);
  }, PATIENCE_MS);

  it("reads block 0's runtime and metadata at block 0 itself, its time 0 without Timestamp::set (IN-7)", async () => {
    const genesis = chainOf(0n, () => ({ timestampMs: null }))[0] as ChainBlock;
    const { source, node } = await open(content(genesis, RUNTIME, true));
    const items = await source.blockItems({ height: 0n, hash: genesis.hash, parentHash: new Uint8Array(32) }, table);
    expect(items["block-header"]).toMatchObject({ height: 0n, specVersion: 2_000_000, timestampMs: 0n });
    expect(node.calls.map((call) => call.params)).toEqual([[genesis.hex], [genesis.hex], [genesis.hex]]);
  }, PATIENCE_MS);

  it("refuses a block without a ledger table, another parent, a runtime the table lacks, or metadata it cannot read", async () => {
    const { source } = await open([...content(at(7), RUNTIME, false)]);
    expect(await rejection(source.blockItems(block(7), undefined))).toMatchObject({ message: expect.stringMatching(/no ledger-table item/) });
    expect(await rejection(source.blockItems({ ...block(7), parentHash: at(5).hash }, table))).toMatchObject({ message: expect.stringMatching(/another parent/) });
    const unknown = { rows: [{ specVersionMin: 1, specVersionMax: 2, ledger: "v8" as const }], pins: [] };
    expect(await rejection(source.blockItems(block(7), unknown))).toMatchObject({ code: "unknown-runtime", details: { height: 7n } });
    const broken = await open([...content(at(9), { specVersion: 2_000_000, metadata: Uint8Array.of(1, 2, 3) }, true)]);
    expect(await rejection(broken.source.blockItems(block(9), table))).toMatchObject({
      message: expect.stringMatching(/the runtime metadata block 9 is decoded with cannot be read/),
    });
  }, PATIENCE_MS);
});
