/**
 * The `token-metadata` module: MIP-0018 token metadata from the `contract-logs` item. A public module, not one of the
 * core's: a configuration enables it with `TOKEN_METADATA.entry(...)`. [TM-1; design D1, D2, D4]
 *
 * - **Requires** only `contract-logs`, so it runs with either provider (`core-contract-logs-full`, or the
 *   development-only `core-contract-logs-fast` from any height). It has no ledger task, so it loads in the browser
 *   build like any user module.
 * - **Starts with its database** (TM-1, design D2). Its rows are materialized state, so they depend on where it
 *   started: it declares `startsMidChain: true`, so a database started at any S accepts it, and refuses in
 *   `on-start-db` an entry starting above S. The process refuses with `callback-error` at `on-start-db` of
 *   `token-metadata`; the error itself is a {@link TokenMetadataStartAfterDatabase}, whose code is
 *   `token-metadata-start-after-database`.
 * - **Per block** it writes in `on-db-write` (`./apply.ts`): the block's candidates and their effect on the fields, in
 *   chain order, reading its own rows inside the block transaction. A v8 block has no contract logs, so nothing.
 */

import { z } from "zod";
import { CONTRACT_LOGS_ITEM, contractLogsItemOf } from "../../backbone/contract-logs/contract-logs.js";
import { defineModule } from "../../modules/declaration.js";
import { type LogReader, writeBlock } from "./apply.ts";
import { miscAtom } from "./log-reader.ts";
import { databaseStart, MIGRATIONS, SCHEMA } from "./sql.ts";

/** The module's id. */
export const TOKEN_METADATA_ID = "token-metadata";

/** The module refused to start above its database's first height. [TM-1] */
export class TokenMetadataStartAfterDatabase extends Error {
  override readonly name = "TokenMetadataStartAfterDatabase";
  readonly code = "token-metadata-start-after-database";
  constructor(
    readonly entryStart: bigint,
    readonly databaseStart: bigint,
  ) {
    super(
      `token-metadata-start-after-database: token-metadata starts at ${entryStart}, above this database's first height ` +
        `${databaseStart}; its state is built from the database's first block, so start it with a new database ` +
        `(from ${databaseStart}) instead`,
    );
  }
}

/**
 * The module's declaration with `reader` reading each `Misc` log's value: {@link TOKEN_METADATA} is the one with the log
 * reader; a negative control gives another reader.
 */
export function tokenMetadataWith(reader: LogReader) {
  return defineModule({
    id: TOKEN_METADATA_ID,
    version: "0.1.0",
    side: "public",
    requires: [CONTRACT_LOGS_ITEM],
    provides: [
      { name: "token-metadata-events", lifetimes: ["table"], table: { schema: SCHEMA, tables: ["events"], kind: "append-only" } },
      {
        name: "token-metadata-state",
        lifetimes: ["table"],
        table: { schema: SCHEMA, tables: ["fields", "withdrawals"], kind: "mutable" },
      },
    ],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-start-db"(p, w) {
        // The first revision is where the module started; a later one (a new version, new settings) continues it.
        const start = await databaseStart(w);
        const first = p.revisions[0];
        if (start === null || first === undefined) return;
        if (first.start > start) throw new TokenMetadataStartAfterDatabase(first.start, start);
      },
      async "on-db-write"(_p, b, w) {
        await writeBlock(w, b.height, contractLogsItemOf(b, TOKEN_METADATA_ID), reader);
      },
    },
  });
}

/** The `token-metadata` module. */
export const TOKEN_METADATA = tokenMetadataWith(miscAtom);
