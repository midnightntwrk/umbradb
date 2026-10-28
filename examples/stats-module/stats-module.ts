/**
 * `stats-module`, the module guide's example (`docs/module-guide.md` §2). At every height it stores one row — the
 * block's hash, how many Midnight transactions it carried, how many of them failed, and a running total — and serves
 * the rows over the module API, with a subscription that announces each new row.
 */

import { z } from "zod";
import { answerChainData, defineModule, type ParsedTransaction, type ReadHandle } from "umbradb";

/** The `tx-results` item: one outcome per transaction, in `block-parsed`'s order. */
type Outcome = "success" | "partial" | "failure";

const ROW_SQL = `SELECT s.height, s.hash, b.block_time, s.tx_count, s.failed_count, s.total_tx
  FROM stats_module.blocks s JOIN core_block_commit.blocks b USING (height)`;
const rowAt = async (read: ReadHandle, height: bigint) =>
  (await read.query(`${ROW_SQL} WHERE s.height = $1`, [height]))[0];
const subscribers = new Set<{ minTx: number; emit: (value: unknown) => void }>();

export const statsModule = defineModule({
  id: "stats-module", // its schema is stats_module
  version: "1.0.0",
  side: "public",
  requires: ["blocks", "block-parsed", "tx-results"],
  provides: [
    {
      name: "stats-module-blocks",
      lifetimes: ["table"],
      table: { schema: "stats_module", tables: ["blocks"], kind: "append-only" },
    },
  ],
  startsMidChain: false, // the running total needs every height from 0
  configSchema: z.object({
    countSystem: z.boolean().default(true).meta({ kind: "data" }),
    recentLimit: z.number().int().min(1).max(100).default(10).meta({ kind: "operational" }),
  }),

  migrations: [
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
  ],

  points: {
    async "on-db-write"(_p, b, w) {
      const { transactions } = b.items.get("block-parsed") as { transactions: readonly ParsedTransaction[] };
      const outcomes = b.items.get("tx-results") as readonly Outcome[]; // one per transaction, same order
      const counted = outcomes.filter((_, i) => transactions[i]?.kind === "regular" || b.settings.countSystem === true);
      const failed = counted.filter((outcome) => outcome === "failure").length;
      const [last] = await w.query("SELECT total_tx FROM stats_module.blocks ORDER BY height DESC LIMIT 1");
      const total = ((last?.total_tx as bigint | undefined) ?? 0n) + BigInt(counted.length);
      await w.execute(
        "INSERT INTO stats_module.blocks (height, hash, tx_count, failed_count, total_tx) VALUES ($1, $2, $3, $4, $5)",
        [b.height, b.hash, counted.length, failed, total],
      );
    },

    async "on-start-api"(p, api) {
      const recentLimit = Number(p.revisions.at(-1)?.settings.recentLimit ?? 10);

      api.http("GET", "/stats-module/latest", async (_req, read) =>
        answerChainData(read, async (view) => {
          const row = await rowAt(read, view.height);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );

      api.http("GET", "/stats-module/blocks/:height", async (req, read) =>
        answerChainData(read, async (view) => {
          const text = req.params.height ?? "";
          if (!/^\d{1,15}$/.test(text)) {
            return { status: 400, body: { error: "bad-height", message: "a height is a whole number" } };
          }
          const height = BigInt(text);
          const row = height > view.height ? undefined : await rowAt(read, height);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );

      // `?limit=` is a query parameter: a handler gets the query's and the path's parameters in `req.params`.
      api.http("GET", "/stats-module/recent", async (req, read) =>
        answerChainData(read, async () => {
          const asked = Number(req.params.limit ?? recentLimit);
          const limit = Number.isInteger(asked) && asked >= 1 ? Math.min(asked, 100) : recentLimit;
          const rows = await read.query(`${ROW_SQL} WHERE s.tx_count > 0 ORDER BY s.height DESC LIMIT $1`, [limit]);
          return { status: 200, body: { blocks: rows } };
        }),
      );

      api.subscription("stats-module-blocks", (args, emit) => {
        const subscriber = { minTx: Number((args as { minTx?: number } | null)?.minTx ?? 0), emit };
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      });
    },

    async "on-after-db-write"(_p, b, read) {
      const row = subscribers.size > 0 ? await rowAt(read, b.height) : undefined;
      for (const s of subscribers) if (row !== undefined && Number(row.tx_count) >= s.minTx) s.emit(row);
    },
  },
});
