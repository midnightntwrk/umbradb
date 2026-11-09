import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/index.js";
import { type MetadataBlock, RuntimeMetadata, type RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import type { NodeClient } from "../../src/node/client.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import {
  branchOf,
  type ChainBlock,
  chainOf,
  content,
  finalized,
  finalizedHead,
  newHead,
  opening,
  RUNTIME,
} from "./fetch-fixtures.js";
import { a79Problems, a80Problems, a81Problems, a89Problems, type FetchSeen } from "./ingest-checks.js";
import { committed, halted, ingest, PATIENCE_MS, slow, until } from "./ingest-harness.js";
import { a79Tape, upgradeTape } from "./ingest-tapes.js";

/**
 * The committed negative controls of the ingest tests; the crash test's control is in `ingest-crash.test.ts`. Each is a
 * wrong node source, a subclass through the node source's seams. It runs through the test's own oracle
 * (`./ingest-checks.ts`) on PostgreSQL 18 and PGlite 0.5.10, and fails it. The real source passes the same oracles in
 * `ingest.test.ts`.
 */

/** The reconnect control: trusts the notifications after a reconnect, without reading the head again. */
class TrustsNotifications extends NodeBlockSource {
  protected override restarted(): void {
    // The lost notifications are not made up for: the next one is awaited.
  }
}

/** The window control: a prefetch without a window, up to the head. */
class NoWindow extends NodeBlockSource {
  protected override windowEnd(_cursor: bigint, head: bigint): bigint {
    return head;
  }
}

/** The best-chain control: a queued block with the finalized hash is fetched again at finality. */
class Refetches extends NodeBlockSource {
  protected override usesQueued(): boolean {
    return false;
  }
}

/** The upgrade control: a block decoded with the metadata of its own state, not its parent's. */
class OwnStateMetadata extends NodeBlockSource {
  readonly #own = new RuntimeMetadata(this.client);

  protected override metadataOf(block: MetadataBlock): Promise<RuntimeMetadataEntry> {
    return this.#own.forState(block.hash);
  }
}

describe.each(PROCESS_BACKENDS)("the negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const chain = chainOf(20n);

  it("a source that trusts the notifications without reading the head again misses the heights after the disconnect", async () => {
    const db = await backend.database();
    const run = await ingest(db, a79Tape(chain), { start: 11n, Source: TrustsNotifications });
    try {
      await committed(run, 13n);
      // Connected again and subscribed again; the head read that would let the next notification out never comes.
      await until(run, () => run.node.calls.some((c) => c.session === 2 && c.method === "chain_subscribeNewHeads"), "the reconnect");
      await sleep(3_000);
      expect(run.node.calls.filter((c) => c.session === 2).map((c) => c.method)).not.toContain("chain_getFinalizedHead");
    } finally {
      await run.close();
    }
    expect(await a79Problems(db, run.seen, chain)).toEqual([
      "the blocks table holds heights 11,12,13, not 11–20",
      "the module wrote heights 11,12,13, not 11–20 once each in order",
    ]);
  }, PATIENCE_MS * 2);

  it("a prefetch without a window fails", async () => {
    const db = await backend.database();
    const long = chainOf(200n);
    const records = [
      ...opening(long[0] as ChainBlock, long[200] as ChainBlock),
      ...long.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
    ];
    const fetches: FetchSeen[] = [];
    let cursor: (() => bigint | null) | undefined;
    const watch = (client: NodeClient): NodeClient =>
      new Proxy(client, {
        get(target, property) {
          if (property === "blockHash") {
            return (height: bigint, options?: unknown) => {
              fetches.push({ height, cursor: cursor?.() ?? 0n });
              return target.blockHash(height, options as never);
            };
          }
          const value = Reflect.get(target, property, target) as unknown;
          return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
        },
      });
    const run = await ingest(db, records, { start: 1n, settings: { prefetchWindow: 64 }, Source: NoWindow, client: watch, user: [slow(2)] });
    cursor = () => run.handle.status().cursor;
    try {
      await committed(run, 200n, PATIENCE_MS * 2);
    } finally {
      await run.close();
    }
    const problems = await a80Problems(db, run.seen, long, fetches.filter((fetch) => fetch.height > 0n), 64n, 1n, 200n);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^\d+ fetches were more than 64 heights above the cursor, the farthest \d+ at cursor \d+$/);
  }, PATIENCE_MS * 3);

  it("a switch that fetches 101′ again at finality fails the call counts", async () => {
    const db = await backend.database();
    const head = chainOf(100n);
    const b100 = head[100] as ChainBlock;
    const A = branchOf(b100, 103n, "a2");
    const B = branchOf(b100, 104n, "b");
    const records: TapeRecord[] = [
      ...opening(head[0] as ChainBlock, b100),
      ...finalized(b100, RUNTIME, true),
      ...[...A, ...B].flatMap((block, index) => [newHead(block), ...content(block, RUNTIME, index === 0)]),
      finalizedHead(B[0] as ChainBlock),
      { method: "chain_getBlockHash", params: [101], result: (B[0] as ChainBlock).hex },
    ];
    const run = await ingest(db, records, { start: 100n, Source: Refetches });
    try {
      await committed(run, 101n);
    } finally {
      await run.close();
    }
    expect(await a81Problems(db, run.seen, run.node, A, B[0] as ChainBlock)).toEqual([
      "101′ was fetched 2 times (chain_getBlock), not once",
    ]);
  }, PATIENCE_MS * 2);

  it("a decode with the block's own metadata instead of its parent's fails at the upgrade", async () => {
    const db = await backend.database();
    const { records, upgrade, expected } = upgradeTape();
    const run = await ingest(db, records, { start: 1n, Source: OwnStateMetadata });
    try {
      await halted(run);
      // U's Timestamp::set (pallet 1) read with the new runtime's metadata, where pallet 1 is Preimage: no time.
      expect(run.handle.status().reason).toEqual({ code: "callback-error", height: 3n, module: "core-block-fetch", point: "on-fetch" });
    } finally {
      await run.close();
    }
    const problems = a89Problems(run.seen, upgrade, expected);
    expect(problems.slice(0, 1)).toEqual(["the module read height 3 0 times, not once"]);
    expect(run.lines.join("\n")).toMatch(/block 3 has no Timestamp::set calls/);
  }, PATIENCE_MS * 2);
});
