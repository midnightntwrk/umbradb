import { setTimeout as sleep } from "node:timers/promises";
import { afterEach, describe, expect, it } from "vitest";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/node-source.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { BlockItems } from "../../src/runner/block-context.js";
import type { BlockRef, QueueRunner } from "../../src/runner/block-source.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { branchOf, type ChainBlock, chainOf, finalizedHead, headRead, hex, newHead, subscriptions } from "./fetch-fixtures.js";

/**
 * What the node source reports of the node for `/status`, tested on its own against a tape node. The report is
 * {@link NodeBlockSource.nodeView}:
 * - the best head the node announced last: each new-heads notification's height, whether the queue takes the block or
 *   not, also before the loop runs; a lower one after a higher one is then the best head [AE-5, A168];
 * - the best-block queue's length, as blocks are queued, while the queue is full at `tipCap`, when the loop takes one
 *   at finality, and when a run ends [IN-6, AE-5, A168].
 *
 * The process and `/status` itself are tested in `./core-status/node-fields.test.ts`.
 */

const quiet: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });
const PATIENCE_MS = 30_000;

/** A queue runner that prepares every block with no items and keeps no record. */
const RUNNER: QueueRunner = {
  prepare: async (block: BlockRef) => new BlockItems(block.height),
  bestBlock: async () => undefined,
  rollback: async () => undefined,
  storedHash: async () => null,
};

const opened: { readonly node: TapeNode; readonly client: NodeClient; readonly source: NodeBlockSource }[] = [];
afterEach(async () => {
  for (const { node, client, source } of opened.splice(0)) {
    await source.close();
    await client.close();
    await node.close();
  }
});

async function open(records: readonly TapeRecord[], tipCap = 600) {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url, connect: quiet });
  const source = new NodeBlockSource({ client, prefetchWindow: 64, tipCap });
  opened.push({ node, client, source });
  return { node, client, source };
}

/** Waits until `check` holds, or fails after a while. */
async function until(check: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await sleep(5);
  }
}

/** Call records the test makes through the client itself, so that the notifications after each wait for it. [TT-3] */
const fence = (n: number): TapeRecord => ({ method: "chain_getBlockHash", params: [999_990 + n], result: hex(new Uint8Array(32).fill(n)) });
const pass = (client: NodeClient, n: number) => client.blockHash(BigInt(999_990 + n));

const chain = chainOf(100n);
const head = chain[100] as ChainBlock;
const a = branchOf(head, 103n, "a2");
const b = branchOf(head, 102n, "b");
const A = (h: number) => a[h - 101] as ChainBlock;
const B = (h: number) => b[h - 101] as ChainBlock;
const fetched = (block: ChainBlock): TapeRecord => ({ method: "chain_getBlock", params: [block.hex], result: block.block });

/** A read that answers `readCursor` with `cursor`. */
function cursorRead(cursor: ChainBlock): { query(sql: string): Promise<Record<string, unknown>[]> } {
  return {
    query: async (sql) =>
      sql.includes("to_regclass") ? [{ present: true }] : [{ height: cursor.height, hash: cursor.hash, parent_hash: cursor.parentHash }],
  };
}

describe("the node as the node source reports it to /status (AE-5; task 8.3a)", () => {
  it("bestHead: null before any announcement, then the height announced last — lower after higher too, loop or not", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(head),
      fence(1),
      newHead(A(103)),
      fence(2),
      newHead(B(102)),
      fence(3),
      // The node's best block back at the finalized head: no best block for the queue, the best head all the same.
      newHead(head),
    ];
    const { client, source } = await open(records);
    expect(source.nodeView()).toEqual({ bestHead: null, queueDepth: 0 });
    await source.finalizedHead();
    expect(source.nodeView()).toEqual({ bestHead: null, queueDepth: 0 });
    // No loop runs (nothing attached): nothing is queued, the announcements are taken all the same.
    await pass(client, 1);
    await until(() => source.nodeView().bestHead === 103n, "103 announced");
    await pass(client, 2);
    await until(() => source.nodeView().bestHead === 102n, "102′ announced");
    await pass(client, 3);
    await until(() => source.nodeView().bestHead === 100n, "100 announced");
    expect(source.nodeView()).toEqual({ bestHead: 100n, queueDepth: 0 });
    expect(Object.isFrozen(source.nodeView())).toBe(true);
  }, PATIENCE_MS);

  it("queueDepth: the queue's length as blocks are queued, full at tipCap, after the loop takes one, when a run ends", async () => {
    const records: TapeRecord[] = [
      ...subscriptions(),
      ...headRead(head),
      newHead(A(101)),
      fetched(A(101)),
      newHead(A(102)),
      fetched(A(102)),
      newHead(A(103)),
      fence(1),
      finalizedHead(A(101)),
      { method: "chain_getBlockHash", params: [101], result: A(101).hex },
    ];
    const { client, source } = await open(records, 2);
    await source.cursor(cursorRead(head));
    const detach = source.attach(RUNNER);
    await source.finalizedHead();
    // Full at tipCap 2: 103 is announced and not queued.
    await until(() => source.conditions().length === 1, "the queue full");
    await source.idle();
    expect(source.nodeView()).toEqual({ bestHead: 103n, queueDepth: 2 });
    expect(source.conditions()).toEqual([{ code: "finality-stall", tipCap: 2, height: 103n }]);
    // 101 finalized: the loop takes it from the queue.
    await pass(client, 1);
    await source.waitForHead(100n, new AbortController().signal);
    expect((await source.finalizedHead()).height).toBe(101n);
    expect((await source.prepared(101n)).block.hash).toEqual(A(101).hash);
    await source.idle();
    expect(source.nodeView()).toEqual({ bestHead: 103n, queueDepth: 1 });
    expect(source.conditions()).toEqual([]);
    // The run ends: its queue is dropped; the best head stays the one announced last.
    detach();
    expect(source.nodeView()).toEqual({ bestHead: 103n, queueDepth: 0 });
    await source.close();
    expect(source.nodeView()).toEqual({ bestHead: 103n, queueDepth: 0 });
  }, PATIENCE_MS);
});
