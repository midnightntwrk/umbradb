import type { TapeNode } from "../../tools/tape/index.js";
import { outsideIn8 } from "../node/in8.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { type ChainBlock, hex } from "./fetch-fixtures.js";
import type { Watched } from "./ingest-harness.js";

/**
 * The oracles of task 10.3's criteria (`openspec/changes/core-arch/acceptance.md` A76, A79–A81, A83, A89), shared by
 * their tests (`ingest.test.ts`, `ingest-crash.test.ts`) and their committed negative controls
 * (`ingest.negative-control.test.ts`): each returns the problems it finds, so a control shows the very check failing.
 */

/** The blocks table's heights and transaction ids, in height order. */
async function blockRows(db: ProcessDatabase): Promise<{ readonly height: bigint; readonly xid: bigint; readonly hash: string }[]> {
  const rows = await db.query(
    "SELECT height::text AS h, xmin::text AS x, encode(hash, 'hex') AS hash FROM core_block_commit.blocks ORDER BY height",
  );
  return rows.map((row) => ({ height: BigInt(row.h as string), xid: BigInt(row.x as string), hash: `0x${row.hash as string}` }));
}

/**
 * Heights `from` to `to` committed once each, in order, each in a transaction of its own (RN-6, IN-4, IN-5): the blocks
 * table holds exactly them, with the chain's hashes, their transaction ids distinct and ascending, and the watching
 * module wrote each once, in order.
 */
export async function committedOnce(
  db: ProcessDatabase,
  seen: Watched,
  chain: readonly ChainBlock[],
  from: bigint,
  to: bigint,
): Promise<string[]> {
  const problems: string[] = [];
  const rows = await blockRows(db);
  const heights = rows.map((row) => row.height);
  const expected: bigint[] = [];
  for (let height = from; height <= to; height++) expected.push(height);
  if (heights.join(",") !== expected.join(",")) {
    problems.push(`the blocks table holds heights ${heights.join(",") || "none"}, not ${from}–${to}`);
  }
  for (const row of rows) {
    const block = chain.find((candidate) => candidate.height === row.height);
    if (block !== undefined && block.hex !== row.hash) problems.push(`height ${row.height} holds ${row.hash}, not ${block.hex}`);
  }
  for (let index = 1; index < rows.length; index++) {
    const [before, after] = [rows[index - 1], rows[index]] as [(typeof rows)[number], (typeof rows)[number]];
    if (after.xid <= before.xid) problems.push(`heights ${before.height} and ${after.height} share a transaction or commit out of order`);
  }
  if (seen.written.join(",") !== expected.join(",")) {
    problems.push(`the module wrote heights ${seen.written.join(",") || "none"}, not ${from}–${to} once each in order`);
  }
  return problems;
}

/** A79's main clause: 11–20 committed once each in order over the jumping, repeating, reconnecting subscription. */
export function a79Problems(db: ProcessDatabase, seen: Watched, chain: readonly ChainBlock[]): Promise<string[]> {
  return committedOnce(db, seen, chain, 11n, 20n);
}

/** One fetch the prefetch began: the height asked (`chain_getBlockHash`) and the process's cursor then. */
export interface FetchSeen {
  readonly height: bigint;
  readonly cursor: bigint;
}

/**
 * A80: no height fetched more than `window` above the cursor at its fetch — so none fetched or held above that —, and
 * commits one per height in order from `from` to `to`.
 */
export async function a80Problems(
  db: ProcessDatabase,
  seen: Watched,
  chain: readonly ChainBlock[],
  fetches: readonly FetchSeen[],
  window: bigint,
  from: bigint,
  to: bigint,
): Promise<string[]> {
  const problems: string[] = [];
  const over = fetches.filter((fetch) => fetch.height - fetch.cursor > window);
  if (over.length > 0) {
    const worst = over.reduce((a, b) => (b.height - b.cursor > a.height - a.cursor ? b : a));
    problems.push(
      `${over.length} fetches were more than ${window} heights above the cursor, the farthest ${worst.height} at cursor ${worst.cursor}`,
    );
  }
  const asked = new Set(fetches.map((fetch) => fetch.height));
  for (let height = from; height <= to; height++) if (!asked.has(height)) problems.push(`height ${height} was never fetched`);
  return [...problems, ...(await committedOnce(db, seen, chain, from, to))];
}

/** A83: every request the tape node received is one of IN-8's methods, and none was answered `not-on-tape`. */
export function a83Problems(node: TapeNode): string[] {
  const problems: string[] = [];
  const methods = node.calls.map((call) => call.method ?? "(not a request)");
  for (const method of outsideIn8(methods)) problems.push(`the node received ${method}, which IN-8 does not list`);
  for (const call of node.calls) {
    if (call.outcome === "not-on-tape" || call.outcome === "invalid-request") {
      problems.push(`the node answered ${call.method} ${JSON.stringify(call.params)} ${call.outcome}`);
    }
  }
  return problems;
}

/**
 * A81's switch: `on-rollback` once, naming `dropped` (101–103) lowest first; 101′ (`used`) fetched once
 * (`chain_getBlock`), so used at finality without being fetched again; and committed.
 */
export async function a81Problems(
  db: ProcessDatabase,
  seen: Watched,
  node: TapeNode,
  dropped: readonly ChainBlock[],
  used: ChainBlock,
): Promise<string[]> {
  const problems: string[] = [];
  const named = seen.rollbacks.map((list) => list.map((block) => `${block.height}:${hex(block.hash)}`).join(","));
  const expected = dropped.map((block) => `${block.height}:${block.hex}`).join(",");
  if (named.length !== 1 || named[0] !== expected) {
    problems.push(`on-rollback fired ${named.length} times, naming [${named.join("] [")}], not once naming ${expected}`);
  }
  const fetched = node.count("chain_getBlock", [used.hex]);
  if (fetched !== 1) problems.push(`101′ was fetched ${fetched} times (chain_getBlock), not once`);
  const [row] = await db.query(`SELECT encode(hash, 'hex') AS hash FROM core_block_commit.blocks WHERE height = ${used.height}`);
  if (row === undefined || `0x${row.hash as string}` !== used.hex) problems.push(`height ${used.height} is not 101′ in the blocks table`);
  return problems;
}

/** What A89 expects the module to read at a height: the metadata's spec version and the body's calls. */
export interface Decoded {
  readonly height: bigint;
  readonly specVersion: number;
  readonly calls: readonly string[];
}

/**
 * A89: at each height the module requiring `block-body` read the extrinsics fetched for it, decoded with the metadata of
 * its parent's state — the spec version and the calls `expected` gives —, once.
 */
export function a89Problems(seen: Watched, chain: readonly ChainBlock[], expected: readonly Decoded[]): string[] {
  const problems: string[] = [];
  for (const want of expected) {
    const got = seen.parsed.filter((parsed) => parsed.height === want.height);
    const block = chain.find((candidate) => candidate.height === want.height) as ChainBlock;
    if (got.length !== 1) {
      problems.push(`the module read height ${want.height} ${got.length} times, not once`);
      continue;
    }
    const [one] = got as [(typeof got)[number]];
    if (one.hash !== block.hex) problems.push(`the module read another block at ${want.height}`);
    if (one.specVersion !== want.specVersion) {
      problems.push(`height ${want.height} was decoded with the metadata of spec_version ${one.specVersion}, not ${want.specVersion}`);
    }
    if (one.calls.join(",") !== want.calls.join(",")) {
      problems.push(`height ${want.height}'s calls read ${one.calls.join(",")}, not ${want.calls.join(",")}`);
    }
  }
  return problems;
}

/**
 * A76: no row of a block above the finalized head `finalized` in the blocks and hashes tables, the watching module's
 * table, or a digest; the identity's anchor the anchor's.
 */
export async function a76Problems(db: ProcessDatabase, finalized: bigint): Promise<string[]> {
  const problems: string[] = [];
  const above = async (table: string, column = "height"): Promise<number> => {
    const [present] = await db.query(`SELECT to_regclass('${table}') IS NOT NULL AS present`);
    if (present?.present !== true) return 0;
    const [row] = await db.query(`SELECT count(*)::int AS n FROM ${table} WHERE ${column} > ${finalized}`);
    return Number(row?.n ?? 0);
  };
  for (const table of ["core_block_commit.blocks", "core_block_commit.hashes", "watch.rows", "core_digest.tables"]) {
    const n = await above(table);
    if (n > 0) problems.push(`${table} holds ${n} rows above the finalized head ${finalized}`);
  }
  return problems;
}
