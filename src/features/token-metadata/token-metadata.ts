/**
 * The `token-metadata` module: MIP-0018 token metadata from the `contract-logs` item. A public module, not one of the
 * core's: a configuration enables it with `TOKEN_METADATA.entry(...)`.
 *
 * - **Requires** `contract-logs` and `block-parsed` (each event's transaction hash, for `/v1/events`), so it runs with
 *   either logs provider (`core-contract-logs-full`, or the
 *   development-only `core-contract-logs-fast` from any height). It has no ledger task, so it loads in the browser
 *   build like any user module.
 * - **Starts with its database**. Its rows are materialized state, so they depend on where it
 *   started: it declares `startsMidChain: true`, so a database started at any S accepts it, and refuses in
 *   `on-start-db` an entry starting above S. The process refuses with `callback-error` at `on-start-db` of
 *   `token-metadata`; the error itself is a {@link TokenMetadataStartAfterDatabase}, whose code is
 *   `token-metadata-start-after-database`.
 * - **Its API** (`./api.ts`) is the `/v1` routes of `docs/token-metadata-api.md` on the module API, registered in
 *   `on-start-api`.
 * - **Per block** it writes in `on-db-write` (`./apply.ts`): the block's candidates and their effect on the fields, in
 *   chain order, reading its own rows inside the block transaction. A v8 block has no contract logs, so nothing.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { CONTRACT_LOGS_ITEM, contractLogsItemOf } from "../../backbone/contract-logs/contract-logs.js";
import type { BlockParsed } from "../../backbone/core-block-parsed/core-block-parsed.js";
import { defineModule } from "../../modules/declaration.js";
import { registerMetadataApi } from "./api.js";
import { type LogReader, writeBlock } from "./apply.js";
import { miscAtom } from "./log-reader.js";
import { databaseStart, MIGRATIONS, SCHEMA } from "./sql.js";

/** `core-block-parsed`'s item (named here so the module loads none of that module's code). */
const BLOCK_PARSED_ITEM = "block-parsed";

/** The module's id. */
export const TOKEN_METADATA_ID = "token-metadata";

/** The module refused to start above its database's first height. */
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
    version: UMBRADB_VERSION,
    side: "public",
    requires: [CONTRACT_LOGS_ITEM, BLOCK_PARSED_ITEM],
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
      async "on-start-api"(_p, api) {
        registerMetadataApi(api);
      },
      async "on-db-write"(_p, b, w) {
        const parsed = b.items.get(BLOCK_PARSED_ITEM) as BlockParsed | undefined;
        const hashes = new Map((parsed?.transactions ?? []).map((t) => [t.index, t.hash]));
        await writeBlock(w, b.height, contractLogsItemOf(b, TOKEN_METADATA_ID), (tx) => hashes.get(tx), reader);
      },
    },
  });
}

/** The `token-metadata` module. */
export const TOKEN_METADATA = tokenMetadataWith(miscAtom);
