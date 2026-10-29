/**
 * The SQL of `stats-module` (`./stats-module.ts`): its migrations, the statements it writes with, and the queries its
 * API serves. Every name is written with its schema: UmbraDB sets no `search_path` (`docs/module-guide.md` §2.2).
 */

import type { BlockWriteHandle, ReadHandle } from "umbradb";

/** The module's table, created once and changed only by a new migration at the end (§2.2). */
export const migrations = [
  {
    id: "001",
    sql: `CREATE TABLE stats_module.blocks (
        height bigint PRIMARY KEY,
        hash bytea NOT NULL,
        tx_count integer NOT NULL,
        failed_count integer NOT NULL,
        total_tx bigint NOT NULL
      )`,
  },
  { id: "002", sql: "CREATE INDEX blocks_with_transactions ON stats_module.blocks (height) WHERE tx_count > 0" },
];

/** One block's row, as `on-db-write` stores it. */
export interface StatsRow {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly txCount: number;
  readonly failedCount: number;
  readonly totalTx: bigint;
}

const SELECT_LAST_TOTAL = "SELECT total_tx FROM stats_module.blocks ORDER BY height DESC LIMIT 1";
const INSERT_ROW =
  "INSERT INTO stats_module.blocks (height, hash, tx_count, failed_count, total_tx) VALUES ($1, $2, $3, $4, $5)";
/** A row with its block's time, from the core's blocks table. */
const SELECT_ROWS = `
  SELECT stats.height, stats.hash, chain.block_time, stats.tx_count, stats.failed_count, stats.total_tx
  FROM stats_module.blocks stats JOIN core_block_commit.blocks chain USING (height)`;
const SELECT_ROW_AT = `${SELECT_ROWS} WHERE stats.height = $1`;
const SELECT_RECENT = `${SELECT_ROWS} WHERE stats.tx_count > 0 ORDER BY stats.height DESC LIMIT $1`;

/** The running total of the last stored height, 0 before the first. */
export async function lastTotal(writer: BlockWriteHandle): Promise<bigint> {
  const [last] = await writer.query(SELECT_LAST_TOTAL);
  return (last?.total_tx as bigint | undefined) ?? 0n;
}

/** Stores one block's row, in the height's transaction. */
export async function insertRow(writer: BlockWriteHandle, row: StatsRow): Promise<void> {
  await writer.execute(INSERT_ROW, [row.height, row.hash, row.txCount, row.failedCount, row.totalTx]);
}

/** The row of `height` with its block's time, or `undefined` if none is stored. */
export async function rowAt(read: ReadHandle, height: bigint): Promise<Record<string, unknown> | undefined> {
  return (await read.query(SELECT_ROW_AT, [height]))[0];
}

/** The latest `limit` rows of blocks that carried transactions, newest first. */
export async function recentRows(read: ReadHandle, limit: number): Promise<Record<string, unknown>[]> {
  return read.query(SELECT_RECENT, [limit]);
}
