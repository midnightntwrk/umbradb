/**
 * `stats-module`, the module guide's example (`docs/module-guide.md` §2). At every height it stores one row — the
 * block's hash, how many Midnight transactions it carried, how many of them failed, and a running total — and serves
 * the rows over the module API, with a subscription that announces each new row.
 */

import { z } from "zod";
import { defineModule, defineRoute, hexBytes, type ParsedTransaction, RouteError, uintText } from "umbradb";
import { insertRow, lastTotal, migrations, recentRows, rowAt } from "./sql.ts";

/** The `tx-results` item: one outcome per transaction, in `block-parsed`'s order. */
type Outcome = "success" | "partial" | "failure";

const subscribers = new Set<{ minTx: number; emit: (value: unknown) => void }>();

// A stored row as the API gives it. uintText(64) is a bigint here and digits in a string to a client, which no JSON
// reader rounds; hexBytes() is "0x" and lowercase hex.
const Block = z.strictObject({
  height: uintText(64),
  hash: hexBytes(),
  block_time: z.string(),
  tx_count: z.int(),
  failed_count: z.int(),
  total_tx: uintText(64),
});

// A row of ./sql.ts as a Block: the hash's bytes as hex, the rest as stored. The output schema checks it.
const blockOf = (row: Record<string, unknown>): z.output<typeof Block> => ({
  height: row.height as bigint,
  hash: `0x${Buffer.from(row.hash as Uint8Array).toString("hex")}`,
  block_time: row.block_time as string,
  tx_count: row.tx_count as number,
  failed_count: row.failed_count as number,
  total_tx: row.total_tx as bigint,
});

const noRow = () => new RouteError("not-found", "no-row", "no row at that height");

// The routes. Each is an operation with a name, an input and an output schema, and no transport: `http` only says
// where HTTP serves it, under /stats-module.
const getLatest = defineRoute({
  name: "getLatest",
  description: "The row of the latest committed height.",
  input: z.object({}),
  output: Block,
  http: { method: "GET", path: "/latest" },
  async handle(_input, { read, height }) {
    const row = await rowAt(read, height);
    if (row === undefined) throw noRow();
    return blockOf(row);
  },
});

const getBlock = defineRoute({
  name: "getBlock",
  description: "The row of one height.",
  input: z.object({ height: uintText(64) }), // the path's :height, read as a bigint
  output: Block,
  http: { method: "GET", path: "/blocks/:height" },
  async handle({ height }, { read, height: committed }) {
    const row = height > committed ? undefined : await rowAt(read, height); // nothing is stored above the committed height
    if (row === undefined) throw noRow();
    return blockOf(row);
  },
});

// A route that depends on a setting is made once the setting is known, in on-start-api.
const listRecent = (recentLimit: number) =>
  defineRoute({
    name: "listRecent",
    description: "The latest rows of blocks that carried transactions, newest first.",
    input: z.object({ limit: z.int().min(1).max(100).default(recentLimit) }), // ?limit=, read as a number
    output: z.strictObject({ blocks: z.array(Block) }),
    http: { method: "GET", path: "/recent" },
    async handle({ limit }, { read }) {
      return { blocks: (await recentRows(read, limit)).map(blockOf) };
    },
  });

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

      api.route(getLatest);
      api.route(getBlock);
      api.route(listRecent(recentLimit));

      api.subscription("stats-module-blocks", (args, emit) => {
        const subscriber = { minTx: Number((args as { minTx?: number } | null)?.minTx ?? 0), emit };
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      });
    },

    async "on-after-db-write"(_processContext, block, read) {
      const row = subscribers.size > 0 ? await rowAt(read, block.height) : undefined;
      for (const subscriber of subscribers) {
        if (row !== undefined && Number(row.tx_count) >= subscriber.minTx) subscriber.emit(z.encode(Block, blockOf(row)));
      }
    },
  },
});
