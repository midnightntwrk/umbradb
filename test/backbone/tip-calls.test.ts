import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { SHADOW_SCHEMA } from "../../src/db/change-capture.js";
import { NodeClient } from "../../src/node/client.js";
import type { NodeCallCounts } from "../../src/node/counts.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { processBackend } from "../runner/process-backends.js";
import { eventsRead, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, content, finalizedHead, headRead, newHead, opening } from "./fetch-fixtures.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";
import type { ProcessDatabase } from "../runner/process-backends.js";

/**
 * The node call budget through the real process on PGlite, with `core-chain-events` (so each block's
 * `System::Events` is read), over synthetic tapes:
 * - following the tip (SC-004): 1,000 blocks, each announced as a best block, fetched, then finalized one step at a
 *   time; the process's own counts (`NodeClient.calls`, FR-015) show at most 2.1 calls per block: `chain_getBlock` and
 *   `state_getStorage`, no `chain_getBlockHash` (the hashes come from the notifications) and no runtime version after
 *   each cache's first block; and with batches (`nodeBatchBlocks` 8, the default, FR-016–FR-017) each block's two calls
 *   in one frame, where `nodeBatchBlocks: 1` sends each alone, the two runs storing the same tables;
 * - the core's stop (task 4.4): a process stopping at 99 below a head of 120 asks the node nothing for a height above
 *   99, though the head is announced there and its prefetch window reaches past it.
 */

const backend = processBackend("pglite");
beforeAll(() => backend.start(), 180_000);
afterAll(() => backend.stop(), 60_000);

describe("the node calls at the tip and at the stop", () => {
  /** Every module table of `db` as the MD5 of its rows' text in order, by `schema.table`. */
  async function storedTables(db: ProcessDatabase): Promise<Record<string, string>> {
    const tables = await db.query(`SELECT n.nspname AS s, c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND left(n.nspname, 3) <> 'pg_'
        AND n.nspname NOT IN ('information_schema', 'public', '${SHADOW_SCHEMA}') ORDER BY 1, 2`);
    const digests = await db.query(
      tables
        .map(({ s: schema, t: table }) => `SELECT '${schema}.${table}' AS k, md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM "${schema}"."${table}" r`)
        .join(" UNION ALL "),
    );
    return Object.fromEntries(digests.map((row) => [row.k as string, row.d as string]));
  }

  /** Follows a tip of 1,000 blocks with one-step finality (see the test below) with `settings`. */
  async function followTip(settings: Readonly<Record<string, unknown>>) {
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
      settings,
      nodeClient: (options) => (client = new NodeClient(options)),
    });
    try {
      await committed(run, BigInt(LAST), PATIENCE_MS * 2);
    } finally {
      await run.close();
    }
    const calls: NodeCallCounts = client?.calls ?? {};
    return { calls, frames: client?.frames ?? 0, blocks: LAST - S + 1, node: run.node, stored: await storedTables(db) };
  }

  it("follows a 1,000-block tip with one-step finality at no more than 2.1 calls per block, a block's in one frame", async () => {
    const { calls, frames, blocks, node, stored } = await followTip({});
    const total = Object.values(calls).reduce((n, counts) => n + (counts?.attempts ?? 0), 0);
    expect(total / blocks).toBeLessThanOrEqual(2.1);
    // The per-block calls: one block and one events read each; the hashes from the notifications.
    expect(calls.chain_getBlock?.attempts).toBe(blocks);
    expect(calls.state_getStorage?.attempts).toBe(blocks);
    expect(calls.chain_getBlockHash?.attempts).toBe(1);
    expect(node.calls.filter((call) => call.method === "chain_getBlockHash").map((call) => call.params)).toEqual([[0]]);
    // One runtime check per cache: the finalized blocks' at S, the best blocks' at S + 1.
    expect(calls.state_getRuntimeVersion?.attempts).toBe(2);
    // The counts are the tape node's log.
    expect(total).toBe(node.calls.length);
    // With batches (nodeBatchBlocks 8 by default) each block's events go with the block: one frame per block, about.
    expect(frames / blocks).toBeLessThanOrEqual(1.05);
    expect(new Set(node.calls.map((call, index) => (call.frame === undefined ? `s${index}` : `b${call.frame}`))).size).toBe(frames);
    // nodeBatchBlocks 1: the same calls, each in a frame of its own, and the same tables stored.
    const single = await followTip({ nodeBatchBlocks: 1 });
    expect(single.frames).toBe(total);
    expect(single.node.batches).toBe(0);
    expect(Object.keys(single.calls)).toEqual(Object.keys(calls));
    for (const [method, counts] of Object.entries(single.calls)) {
      const batched = calls[method as keyof NodeCallCounts];
      expect(counts?.frames, method).toBe(counts?.attempts);
      expect([counts?.calls, counts?.attempts], method).toEqual([batched?.calls, batched?.attempts]);
    }
    expect(Object.keys(stored).length).toBeGreaterThan(5);
    expect(single.stored).toEqual(stored);
  }, PATIENCE_MS * 5);

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
