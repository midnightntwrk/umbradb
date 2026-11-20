import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { NodeClient } from "../../src/node/client.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { processBackend } from "../runner/process-backends.js";
import { eventsRead, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, content, finalizedHead, headRead, newHead, opening } from "./fetch-fixtures.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";

/**
 * The node call budget through the real process on PGlite, with `core-chain-events` (so each block's
 * `System::Events` is read), over synthetic tapes:
 * - following the tip (SC-004): 1,000 blocks, each announced as a best block, fetched, then finalized one step at a
 *   time; the process's own counts (`NodeClient.calls`, FR-015) show at most 2.1 calls per block: `chain_getBlock` and
 *   `state_getStorage`, no `chain_getBlockHash` (the hashes come from the notifications) and no runtime version after
 *   each cache's first block;
 * - the core's stop (task 4.4): a process stopping at 99 below a head of 120 asks the node nothing for a height above
 *   99, though the head is announced there and its prefetch window reaches past it.
 */

const backend = processBackend("pglite");
beforeAll(() => backend.start(), 180_000);
afterAll(() => backend.stop(), 60_000);

describe("the node calls at the tip and at the stop", () => {
  it("follows a 1,000-block tip with one-step finality at no more than 2.1 calls per block", async () => {
    const S = 100;
    const LAST = 1_100;
    const chain = chainOf(BigInt(LAST));
    const at = (h: number): ChainBlock => chain[h] as ChainBlock;
    // Exactly what the process asks, in order (a notification waits for every record before it): startup's genesis
    // check and the head read; S's content (its hash is the head's, known); then each block as a best block — fetched
    // and its events read, the best blocks' cache confirming the runtime at the first one — and its finality.
    const records: TapeRecord[] = [
      ...opening(at(0), at(S)),
      ...content(at(S), RUNTIME_2_0, true),
      eventsRead(at(S), null),
      ...Array.from({ length: LAST - S }, (_, i) => S + 1 + i).flatMap((h) => [
        newHead(at(h)),
        ...content(at(h), RUNTIME_2_0, h === S + 1),
        eventsRead(at(h), null),
        finalizedHead(at(h)),
      ]),
    ];
    let client: NodeClient | undefined;
    const db = await backend.database();
    const run = await ingest(db, records, {
      start: BigInt(S),
      core: [CORE_CHAIN_EVENTS],
      nodeClient: (options) => (client = new NodeClient(options)),
    });
    try {
      await committed(run, BigInt(LAST), PATIENCE_MS * 2);
    } finally {
      await run.close();
    }
    const calls = client?.calls ?? {};
    const total = Object.values(calls).reduce((n, counts) => n + (counts?.attempts ?? 0), 0);
    const blocks = LAST - S + 1;
    expect(total / blocks).toBeLessThanOrEqual(2.1);
    // The per-block calls: one block and one events read each; the hashes from the notifications.
    expect(calls.chain_getBlock?.attempts).toBe(blocks);
    expect(calls.state_getStorage?.attempts).toBe(blocks);
    expect(calls.chain_getBlockHash?.attempts).toBe(1);
    expect(run.node.calls.filter((call) => call.method === "chain_getBlockHash").map((call) => call.params)).toEqual([[0]]);
    // One runtime check per cache: the finalized blocks' at S, the best blocks' at S + 1.
    expect(calls.state_getRuntimeVersion?.attempts).toBe(2);
    // The counts are the tape node's log.
    expect(total).toBe(run.node.calls.length);
  }, PATIENCE_MS * 3);

  it("stopping at 99 below a head of 120 asks nothing for a height above 99", async () => {
    const chain = chainOf(120n);
    const at = (h: number): ChainBlock => chain[h] as ChainBlock;
    const records: TapeRecord[] = [
      ...opening(at(0), at(120)),
      ...chain.slice(1).flatMap((block) => [
        { method: "chain_getBlockHash", params: [Number(block.height)], result: block.hex } as TapeRecord,
        ...content(block, RUNTIME_2_0, block.height === 1n),
        eventsRead(block, null),
      ]),
    ];
    const db = await backend.database();
    const run = await ingest(db, records, { start: 1n, stop: 99n, core: [CORE_CHAIN_EVENTS], settings: { prefetchWindow: 64 } });
    try {
      await committed(run, 99n);
    } finally {
      await run.close();
    }
    const heightOf = new Map(chain.map((block) => [block.hex, block.height] as const));
    const above = run.node.calls.filter((call) => {
      if (call.method === "chain_getFinalizedHead" || call.method === "chain_getHeader") return false;
      const first = (call.params as unknown[] | undefined)?.[0];
      const second = (call.params as unknown[] | undefined)?.[1];
      const height = typeof first === "number" ? BigInt(first) : (heightOf.get(first as string) ?? heightOf.get(second as string));
      return height !== undefined && height > 99n;
    });
    expect(above.map((call) => `${call.method} ${JSON.stringify(call.params)}`)).toEqual([]);
  }, PATIENCE_MS * 2);
});
