import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { snapshotOf } from "../../src/admin/snapshot.js";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/index.js";
import type { NodeClient } from "../../src/node/client.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import {
  blockRef,
  branchOf,
  chainBlock,
  type ChainBlock,
  chainOf,
  content,
  finalized,
  finalizedHead,
  headRead,
  hex,
  newHead,
  opening,
  RUNTIME,
  subscriptions,
} from "./fetch-fixtures.js";
import { a79Problems, a80Problems, a81Problems, a83Problems, a89Problems, type FetchSeen } from "./ingest-checks.js";
import { committed, FENCE, fenceAt, halted, ingest, PATIENCE_MS, slow, until } from "./ingest-harness.js";
import { a79Tape, upgradeTape } from "./ingest-tapes.js";

/**
 * Ingest through the real process and the node source (task 10.3; `openspec/changes/core-arch/acceptance.md` A79, A80,
 * A81, A83, A89; IN-4 to IN-8, CD-2), on PostgreSQL 18 and PGlite 0.5.10, against a tape node serving synthetic tapes in
 * the node's own answer shapes (`./fetch-fixtures.ts`; task 0.3's real tapes replace them, 18.2). Each process is
 * `startProcess` with UmbraDB's backbone and the real `core-block-fetch` over `nodeSourceOf` — what `umbradb run`
 * passes — and the watching module of `./ingest-harness.ts`.
 *
 * - A79 (IN-4): finalized notifications 10, 13, 13, 12, a disconnect, then 20 — heights 11–20 commit once each in order;
 *   a block whose parent differs from the cursor halts with `parent-mismatch`; a notification at or below the cursor with
 *   another hash halts with `finality-conflict`.
 * - A80 (IN-5) and A83 (IN-8): a catch-up of 1,000 heights (on PGlite; 200 on PostgreSQL) with `prefetchWindow` 64
 *   never fetches a height more than 64 above the cursor and commits one per height in order; the tape node received
 *   only IN-8's methods.
 * - A81 (IN-6): 101–103 queued, then 101′–104′: `on-rollback` once naming 101–103, 101′ used at finality without being
 *   fetched again; with `tipCap` 5 and finality stalled, the sixth best block is not queued and `finality-stall` shows in
 *   `status()` (what `/status` serves, tasks 8.1–8.3).
 * - A89 (CD-2, LG-4): at an upgrade, a module requiring `block-body` reads at U the extrinsics decoded with the metadata of
 *   U's parent's state — the old runtime's —, at F the new one's.
 * - IN-7's fetch path: block 0's runtime and metadata at its own state, its time 0 without `Timestamp::set`.
 */

describe.each(PROCESS_BACKENDS)("ingest over the node source on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  // ── A79 ────────────────────────────────────────────────────────────────────────────────────────────────────────

  const chain = chainOf(20n);
  const at = (height: number): ChainBlock => chain[height] as ChainBlock;

  it("A79: with finalized notifications 10, 13, 13, 12, a disconnect, then 20, heights 11–20 commit once each in order", async () => {
    const db = await backend.database();
    const run = await ingest(db, a79Tape(chain), { start: 11n });
    try {
      await committed(run, 20n);
      expect(run.seen.finalized).toEqual([13n, 16n, 20n]);
      // Two sessions: the reconnect; the head read once in each.
      expect(run.node.calls.filter((c) => c.method === "chain_getFinalizedHead").map((c) => c.session)).toEqual([1, 2]);
    } finally {
      await run.close();
    }
    expect(await a79Problems(db, run.seen, chain)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A79: a block whose parent hash differs from the cursor's halts with parent-mismatch, nothing of it kept", async () => {
    const db = await backend.database();
    const good = chainOf(1n);
    const stray = chainBlock(2n, good[1] as ChainBlock, { parentHash: at(5).hash });
    const after = chainBlock(3n, stray);
    const records = [
      ...blockRef(good[0] as ChainBlock),
      ...subscriptions(),
      ...headRead(after),
      ...finalized(good[1] as ChainBlock, RUNTIME, true),
      ...finalized(stray),
      ...finalized(after),
    ];
    const run = await ingest(db, records, { start: 1n });
    try {
      await halted(run);
      expect(run.handle.status()).toMatchObject({
        state: "halted",
        cursor: 1n,
        reason: { code: "parent-mismatch", height: 2n, module: "core-block-commit", point: "on-db-write" },
      });
      expect(run.seen.written).toEqual([1n]);
    } finally {
      await run.close();
    }
    expect(await db.query("SELECT height::int AS h FROM watch.rows ORDER BY height")).toEqual([{ h: 1 }]);
  }, PATIENCE_MS * 2);

  it("A79: a finalized notification at or below the cursor with another hash halts with finality-conflict", async () => {
    const db = await backend.database();
    // Another block at height 1, notified once 3 has committed (the fence module's call after 3's commit lets it out).
    const other = branchOf(at(0), 1n, "b")[0] as ChainBlock;
    const records = [
      ...opening(at(0), at(3)),
      ...finalized(at(1), RUNTIME, true),
      ...finalized(at(2)),
      ...finalized(at(3)),
      FENCE,
      finalizedHead(other),
    ];
    const run = await ingest(db, records, { start: 1n, user: [fenceAt(3n)] });
    try {
      await halted(run);
      expect(run.handle.status()).toMatchObject({
        state: "halted",
        cursor: 3n,
        reason: { code: "finality-conflict", height: 4n, module: null, point: null },
      });
      expect(run.lines.join("\n")).toMatch(/processing halted \(finality-conflict\)/);
      // Compared with the database's block at 1, which the cursor had passed.
      expect(run.lines.join("\n")).toMatch(new RegExp(`${other.hex} at height 1, but the database's block is ${at(1).hex}`));
    } finally {
      await run.close();
    }
  }, PATIENCE_MS * 2);

  // ── A80, A83 ───────────────────────────────────────────────────────────────────────────────────────────────────

  // A80's catch-up of 1,000 heights runs on PGlite; on PostgreSQL one of 200 (three windows and more): the window is the
  // node source's alone, the same over either backend, and 1,000 one-transaction heights on PostgreSQL in Docker did not
  // commit within 960 s under the conformance gate's load (777 had, 2026-10-26).
  const catchUp = backend.kind === "pglite" ? 1_000 : 200;
  it(`A80, A83: a catch-up of ${catchUp.toLocaleString("en-US")} heights with prefetchWindow 64 fetches nothing more than 64 above the cursor, commits one per height in order, and asks the node only IN-8's methods`, async () => {
    const db = await backend.database();
    const long = chainOf(BigInt(catchUp));
    const records = [
      ...opening(long[0] as ChainBlock, long[catchUp] as ChainBlock),
      ...long.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
    ];
    const fetches: FetchSeen[] = [];
    let status: (() => bigint | null) | undefined;
    // The process's own node client, its block-hash calls watched: each a height's fetch beginning (IN-4, IN-5).
    const watch = (client: NodeClient): NodeClient =>
      new Proxy(client, {
        get(target, property) {
          if (property === "blockHash") {
            return (height: bigint, options?: unknown) => {
              fetches.push({ height, cursor: status?.() ?? 0n });
              return target.blockHash(height, options as never);
            };
          }
          const value = Reflect.get(target, property, target) as unknown;
          return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
        },
      });
    // A slow on-compute (2 ms a height) keeps the loop behind the prefetch, so the window is reached on both backends.
    const run = await ingest(db, records, { start: 1n, settings: { prefetchWindow: 64 }, client: watch, user: [slow(2)] });
    status = () => run.handle.status().cursor;
    try {
      // On a loaded machine PGlite's 1,000 commits and PostgreSQL's 200 have each taken minutes.
      await committed(run, BigInt(catchUp), PATIENCE_MS * 4);
    } finally {
      await run.close();
    }
    // Height 0 is startup's genesis read (IN-2), not the prefetch's.
    const prefetched = fetches.filter((fetch) => fetch.height > 0n);
    expect(prefetched).toHaveLength(catchUp);
    // Fetched ahead of the cursor up to the window, never beyond it.
    expect(Math.max(...prefetched.map((fetch) => Number(fetch.height - fetch.cursor)))).toBe(64);
    expect(await a80Problems(db, run.seen, long, prefetched, 64n, 1n, BigInt(catchUp))).toEqual([]);
    expect(a83Problems(run.node)).toEqual([]);
    expect(new Set(run.node.calls.map((call) => call.method))).toEqual(
      new Set([
        "chain_getBlockHash",
        "chain_getHeader",
        "chain_subscribeFinalizedHeads",
        "chain_subscribeNewHeads",
        "chain_getFinalizedHead",
        "chain_getBlock",
        "state_getRuntimeVersion",
        "state_getMetadata",
      ]),
    );
  }, PATIENCE_MS * 5);

  // ── A81 ────────────────────────────────────────────────────────────────────────────────────────────────────────

  const head = chainOf(100n);
  const b100 = head[100] as ChainBlock;
  const A = branchOf(b100, 106n, "a2");
  const B = branchOf(b100, 104n, "b");
  const a = (h: number) => A[h - 101] as ChainBlock;
  const b = (h: number) => B[h - 101] as ChainBlock;
  /** A process following at S = 100 = the head, then the best blocks of `best` with their content's calls. */
  const following = (best: readonly ChainBlock[], rest: readonly TapeRecord[] = []): TapeRecord[] => [
    ...opening(head[0] as ChainBlock, b100),
    ...finalized(b100, RUNTIME, true),
    ...best.flatMap((block, index) => [newHead(block), ...content(block, RUNTIME, index === 0)]),
    ...rest,
  ];

  it("A81: a best-chain switch replacing queued 101–103 by 101′–104′ fires on-rollback once naming 101–103, and 101′ is not fetched again at finality", async () => {
    const db = await backend.database();
    const records = following(
      [a(101), a(102), a(103), b(101), b(102), b(103), b(104)],
      [finalizedHead(b(101)), { method: "chain_getBlockHash", params: [101], result: b(101).hex }],
    );
    const run = await ingest(db, records, { start: 100n });
    try {
      await committed(run, 101n);
    } finally {
      await run.close();
    }
    expect(await a81Problems(db, run.seen, run.node, [a(101), a(102), a(103)], b(101))).toEqual([]);
    const short = (block: ChainBlock) => block.hex.slice(0, 10);
    expect(run.seen.queue).toEqual([
      ...[a(101), a(102), a(103), b(101)].map((block) => `best ${block.height} ${short(block)}`),
      `rollback ${[a(101), a(102), a(103)].map((block) => `${block.height} ${short(block)}`).join(",")}`,
      ...[b(102), b(103), b(104)].map((block) => `best ${block.height} ${short(block)}`),
    ]);
    // 101′'s items are the queue's: parsed once, when it was queued, and written at finality.
    expect(run.seen.parsed.filter((parsed) => parsed.height === 101n).map((parsed) => parsed.hash)).toEqual([a(101).hex, b(101).hex]);
    expect(run.seen.written).toEqual([100n, 101n]);
  }, PATIENCE_MS * 2);

  it("A81: with tipCap 5 and finality stalled, the sixth best block is not queued and status() shows finality-stall", async () => {
    const db = await backend.database();
    const best = [101, 102, 103, 104, 105, 106].map(a);
    const records = following(best.slice(0, 5), [newHead(best[5] as ChainBlock)]);
    const run = await ingest(db, records, { start: 100n, settings: { tipCap: 5 } });
    try {
      await committed(run, 100n);
      await until(run, () => run.handle.status().conditions.some((c) => c.code === "finality-stall" && c.height === 106n), "the stall");
      expect(run.handle.status()).toMatchObject({
        state: "following",
        cursor: 100n,
        conditions: [{ code: "finality-stall", tipCap: 5, height: 106n }],
      });
      // As the admin endpoints publish it (task 8.1's snapshot): the height as decimal text.
      const published = snapshotOf(run.handle.status(), { livenessTimeoutMs: 1, readinessLag: null, redactor: null, config: { core: null } });
      expect(published.status.conditions).toEqual([{ code: "finality-stall", tipCap: 5, height: "106" }]);
      expect(run.seen.queue).toEqual(best.slice(0, 5).map((block) => `best ${block.height} ${block.hex.slice(0, 10)}`));
      expect(run.node.count("chain_getBlock", [a(106).hex])).toBe(0);
    } finally {
      await run.close();
    }
  }, PATIENCE_MS * 2);

  // ── A89 ────────────────────────────────────────────────────────────────────────────────────────────────────────

  it("A89: a module requiring block-body reads at U the extrinsics decoded with the metadata of U's parent's state", async () => {
    const db = await backend.database();
    const { records, upgrade, expected } = upgradeTape();
    const run = await ingest(db, records, { start: 1n });
    try {
      await committed(run, 5n);
    } finally {
      await run.close();
    }
    expect(a89Problems(run.seen, upgrade, expected)).toEqual([]);
    const rows = await db.query(
      "SELECT height::int AS h, spec_version AS s, ledger_version AS l, to_char(block_time AT TIME ZONE 'UTC', " +
        "'YYYY-MM-DD\"T\"HH24:MI:SS.MS') AS t FROM core_block_commit.blocks ORDER BY height",
    );
    expect(rows).toEqual(
      upgrade.slice(1).map((block) => ({
        h: Number(block.height),
        s: block.specVersion,
        l: block.height <= 3n ? "v8" : "v9",
        t: new Date(Number(block.timestampMs)).toISOString().slice(0, 23),
      })),
    );
  }, PATIENCE_MS * 2);

  // ── IN-7: block 0's fetch path ─────────────────────────────────────────────────────────────────────────────────

  it.each([
    ["without Timestamp::set, at the time 0", null, "1970-01-01T00:00:00.000"],
    ["with Timestamp::set, at its time", 1_700_000_000_000n, "2023-11-14T22:13:20.000"],
  ] as const)("processes block 0 %s, its runtime and metadata read at its own state (IN-7)", async (_name, time, text) => {
    const db = await backend.database();
    const genesis = chainOf(2n, (h) => (h === 0n ? { timestampMs: time } : {}));
    const g = genesis[0] as ChainBlock;
    const records = [
      ...opening(g, genesis[2] as ChainBlock),
      ...finalized(g, RUNTIME, true),
      ...finalized(genesis[1] as ChainBlock),
      ...finalized(genesis[2] as ChainBlock),
    ];
    const run = await ingest(db, records, { start: 0n });
    try {
      await committed(run, 2n);
    } finally {
      await run.close();
    }
    const [zero] = await db.query(
      "SELECT encode(hash, 'hex') AS hash, encode(parent_hash, 'hex') AS parent, spec_version AS s, ledger_version AS l, " +
        "to_char(block_time AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS') AS t FROM core_block_commit.blocks WHERE height = 0",
    );
    expect(zero).toEqual({ hash: g.hex.slice(2), parent: "00".repeat(32), s: 2_000_000, l: "v9", t: text });
    const [identity] = await db.query(
      "SELECT encode(genesis_hash, 'hex') AS g, start_height::int AS s, encode(anchor_hash, 'hex') AS a FROM core_chain.identity",
    );
    expect(identity).toEqual({ g: g.hex.slice(2), s: 0, a: g.hex.slice(2) });
    // Block 0's runtime and metadata at block 0 itself (LG-4's contentStateOf); block 1's runtime there too.
    expect(run.node.calls.filter((c) => c.method === "state_getMetadata").map((c) => c.params)).toEqual([[g.hex]]);
    const runtimes = run.node.calls.filter((c) => c.method === "state_getRuntimeVersion").map((c) => JSON.stringify(c.params));
    expect(runtimes.sort()).toEqual([[g.hex], [g.hex], [hex((genesis[1] as ChainBlock).hash)]].map((p) => JSON.stringify(p)).sort());
    expect(run.seen.parsed.find((parsed) => parsed.height === 0n)?.calls).toEqual(time === null ? [] : ["Timestamp.set"]);
  }, PATIENCE_MS * 2);

  // ── the stop ────────────────────────────────────────────────────────────────────────────────────────────────────

  it("closes the process's node client and then, after the database, the node source when it stops", async () => {
    const db = await backend.database();
    const short = chainOf(3n);
    const records = [
      ...opening(short[0] as ChainBlock, short[3] as ChainBlock),
      ...short.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
    ];
    const closes: string[] = [];
    class Watched extends NodeBlockSource {
      override async close(): Promise<void> {
        closes.push("source");
        await super.close();
      }
    }
    // The process's one client: its close recorded on the instance the process closes.
    const watchClose = (client: NodeClient): NodeClient => {
      const close = client.close.bind(client);
      client.close = async () => {
        closes.push("client");
        await close();
      };
      return client;
    };
    const run = await ingest(db, records, { start: 1n, Source: Watched, client: watchClose });
    try {
      await committed(run, 3n);
      expect(closes).toEqual([]);
    } finally {
      await run.close();
    }
    expect(closes).toEqual(["client", "source"]);
  }, PATIENCE_MS * 2);
});
