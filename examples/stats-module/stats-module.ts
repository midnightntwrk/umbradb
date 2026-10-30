/**
 * `stats-module`, the module guide's example (`docs/module-guide.md` §2). At every height it stores one row — the
 * block's hash, how many Midnight transactions it carried, how many of them failed, and a running total — and serves
 * the rows over the module API, with a subscription that announces each new row.
 */

import { z } from "zod";
import { answerChainData, defineModule, type ParsedTransaction } from "umbradb";
import { insertRow, lastTotal, migrations, recentRows, rowAt } from "./sql.ts";

/** The `tx-results` item: one outcome per transaction, in `block-parsed`'s order. */
type Outcome = "success" | "partial" | "failure";

const subscribers = new Set<{ minTx: number; emit: (value: unknown) => void }>();

export const statsModule = defineModule({
  id: "stats-module", // its schema is stats_module
  version: "1.0.0",
  // "public": it stores only public chain data, no private information (no keys), so its database can be shared.
  side: "public",
  // The items it needs from other modules, all from UmbraDB's core: `blocks`, the core's blocks table (read for each
  // block's time); `block-parsed`, the block's parsed transactions; `tx-results`, each transaction's outcome.
  requires: ["blocks", "block-parsed", "tx-results"],
  // The items it offers other modules: its table, which another module may read by requiring
  // `stats-module-blocks`. "append-only": rows are only added, never changed, so private modules may read it too.
  provides: [
    {
      name: "stats-module-blocks",
      lifetimes: ["table"],
      table: { schema: "stats_module", tables: ["blocks"], kind: "append-only" },
    },
  ],
  startsMidChain: false, // the running total needs every height from 0
  // Its settings, given by its entry in the configuration file and checked at startup. Each field has a kind:
  // "data" changes what is stored, so it is recorded and may change only from a future height; "operational" does
  // not, and may change at any restart.
  configSchema: z.object({
    // Whether system transactions count too, not only regular ones.
    countSystem: z.boolean().default(true).meta({ kind: "data" }),
    // How many rows /stats-module/recent returns when the request gives no ?limit= (1 to 100).
    recentLimit: z.number().int().min(1).max(100).default(10).meta({ kind: "operational" }),
  }),

  // SQL migrations: they create the module's table in its own schema, once each and in order (./sql.ts).
  migrations,

  // The points: where the module's code runs. The runner calls each callback at its point, at startup or for every
  // block: on-db-write inside the block's transaction, on-start-api to register routes, on-after-db-write after the
  // commit.
  points: {
    async "on-db-write"(_processContext, block, writer) {
      const { transactions } = block.items.get("block-parsed") as { transactions: readonly ParsedTransaction[] };
      const outcomes = block.items.get("tx-results") as readonly Outcome[]; // one per transaction, same order
      const counted = outcomes.filter(
        (_outcome, index) => transactions[index]?.kind === "regular" || block.settings.countSystem === true,
      );
      const failed = counted.filter((outcome) => outcome === "failure").length;
      const totalTx = (await lastTotal(writer)) + BigInt(counted.length);
      await insertRow(writer, {
        height: block.height,
        hash: block.hash,
        txCount: counted.length,
        failedCount: failed,
        totalTx,
      });
    },

    async "on-start-api"(processContext, api) {
      const recentLimit = Number(processContext.revisions.at(-1)?.settings.recentLimit ?? 10);

      api.http("GET", "/stats-module/latest", async (_request, read) =>
        answerChainData(read, async (view) => {
          const row = await rowAt(read, view.height);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );

      api.http("GET", "/stats-module/blocks/:height", async (request, read) =>
        answerChainData(read, async (view) => {
          const text = request.params.height ?? "";
          if (!/^\d{1,15}$/.test(text)) {
            return { status: 400, body: { error: "bad-height", message: "a height is a whole number" } };
          }
          const height = BigInt(text);
          const row = height > view.height ? undefined : await rowAt(read, height);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );

      // `?limit=` is a query parameter: a handler gets the query's and the path's parameters in `request.params`.
      api.http("GET", "/stats-module/recent", async (request, read) =>
        answerChainData(read, async () => {
          const asked = Number(request.params.limit ?? recentLimit);
          const limit = Number.isInteger(asked) && asked >= 1 ? Math.min(asked, 100) : recentLimit;
          return { status: 200, body: { blocks: await recentRows(read, limit) } };
        }),
      );

      api.subscription("stats-module-blocks", (args, emit) => {
        const subscriber = { minTx: Number((args as { minTx?: number } | null)?.minTx ?? 0), emit };
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      });
    },

    async "on-after-db-write"(_processContext, block, read) {
      const row = subscribers.size > 0 ? await rowAt(read, block.height) : undefined;
      for (const subscriber of subscribers) {
        if (row !== undefined && Number(row.tx_count) >= subscriber.minTx) subscriber.emit(row);
      }
    },
  },
});
