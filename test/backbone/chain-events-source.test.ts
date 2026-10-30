import { setTimeout as sleep } from "node:timers/promises";
import { afterEach, describe, expect, it } from "vitest";
import { isBlockEventSource } from "../../src/backbone/core-block-fetch/events.js";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/node-source.js";
import { type ConnectSocket, connectWebSocket, type NodeCallOptions, NodeClient } from "../../src/node/index.js";
import { BlockItems } from "../../src/runner/block-context.js";
import type { BlockRef, QueueRunner } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { outsideIn8 } from "../node/in8.js";
import { ev, SYSTEM_EVENTS_STORAGE, eventsRead, eventsValue } from "./events-fixtures.js";
import { type ChainBlock, chainOf, headRead, hex, newHead, subscriptions } from "./fetch-fixtures.js";

/**
 * Where a block's chain events come from. The node source reads `System::Events` with `state_getStorage` at the
 * block's own hash: for a finalized height with the client's retries, for a queued best block without them. The
 * in-memory source gives none. [CD-4, IN-8, IN-10]
 */

const quiet: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });
const PATIENCE_MS = 30_000;

/** A node client recording each `state_getStorage`'s key, block and options. */
class RecordingClient extends NodeClient {
  readonly storageCalls: { key: string; at: string; options: NodeCallOptions | undefined }[] = [];

  override async storage(key: Uint8Array, at: Uint8Array, options?: NodeCallOptions): Promise<Uint8Array | null> {
    this.storageCalls.push({ key: hex(key), at: hex(at), options });
    return super.storage(key, at, options);
  }
}

/** A queue runner whose `prepare` reads the block's events through the source, as `core-chain-events`' on-fetch does. */
class EventsRunner implements QueueRunner {
  readonly read = new Map<string, Uint8Array | null>();
  constructor(readonly source: NodeBlockSource) {}
  async prepare(block: BlockRef): Promise<BlockItems> {
    this.read.set(hex(block.hash), await this.source.blockEvents(block));
    return new BlockItems(block.height);
  }
  async bestBlock(): Promise<void> {}
  async rollback(): Promise<void> {}
  async storedHash(): Promise<Uint8Array | null> {
    return null;
  }
}

const closing: (() => Promise<void>)[] = [];
afterEach(async () => {
  for (const close of closing.splice(0).reverse()) await close();
});

async function open(records: readonly TapeRecord[]) {
  const node = await TapeNode.start({ records });
  const client = new RecordingClient({ url: node.url, connect: quiet });
  const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap: 600 });
  closing.push(() => node.close(), () => client.close(), () => source.close());
  return { node, client, source };
}

async function until(check: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await sleep(5);
  }
}

const chain = chainOf(101n);
const at = (h: number): ChainBlock => chain[h] as ChainBlock;
const cursorAt = (block: ChainBlock) => ({
  query: async (sql: string) =>
    sql.includes("to_regclass") ? [{ present: true }] : [{ height: block.height, hash: block.hash, parent_hash: block.parentHash }],
});
const fetched = (block: ChainBlock): TapeRecord => ({ method: "chain_getBlock", params: [block.hex], result: block.block });

describe("a block's chain events from the block source", () => {
  it("the node source reads System::Events with state_getStorage at a finalized block's hash, with retries", async () => {
    const events = eventsValue([ev.success(0)]);
    const { node, client, source } = await open([
      ...subscriptions(),
      ...headRead(at(101)),
      { method: "chain_getBlockHash", params: [101], result: at(101).hex },
      fetched(at(101)),
      eventsRead(at(101), events),
    ]);
    const runner = new EventsRunner(source);
    await source.cursor(cursorAt(at(100)));
    source.attach(runner);
    await source.finalizedHead();
    await source.prepared(101n);
    expect(runner.read.get(at(101).hex)).toEqual(events);
    expect(client.storageCalls).toEqual([{ key: SYSTEM_EVENTS_STORAGE, at: at(101).hex, options: undefined }]);
    expect(outsideIn8(node.calls.map((call) => call.method as string))).toEqual([]);
    expect(isBlockEventSource(source)).toBe(true);
  }, PATIENCE_MS);

  it("reads a queued best block's events without retries (IN-10), and null where the state holds none", async () => {
    const { client, source } = await open([
      ...subscriptions(),
      ...headRead(at(100)),
      newHead(at(101)),
      fetched(at(101)),
      eventsRead(at(101), null),
    ]);
    const runner = new EventsRunner(source);
    await source.cursor(cursorAt(at(100)));
    source.attach(runner);
    await source.finalizedHead();
    await until(() => runner.read.has(at(101).hex), "the best block prepared");
    await source.idle();
    expect(runner.read.get(at(101).hex)).toBeNull();
    expect(client.storageCalls).toEqual([{ key: SYSTEM_EVENTS_STORAGE, at: at(101).hex, options: { retry: false } }]);
  }, PATIENCE_MS);

  it("the in-memory source gives no events", async () => {
    const source = new InMemoryBlockSource({ head: 3n });
    expect(isBlockEventSource(source)).toBe(true);
    expect(await source.blockEvents(await source.block(2n))).toBeNull();
    expect(isBlockEventSource({ blockItems: async () => ({}) })).toBe(false);
    expect(isBlockEventSource(null)).toBe(false);
  });
});
