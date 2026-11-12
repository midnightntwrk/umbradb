/**
 * The `token-metadata` module: MIP-0018 token metadata from the `contract-logs` item, kept in its tables. A public
 * module, not one of the core's: a configuration enables it with `TOKEN_METADATA.entry(...)`. It creates, fills and
 * guards the tables; `token-metadata-api` (`../token-metadata-api/`) serves them.
 *
 * - **Requires** `contract-logs` only, so it runs with either logs provider (`core-contract-logs-full`, or the
 *   development-only `core-contract-logs-fast` from any height). It has no ledger task, so it loads in the browser
 *   build like any user module.
 * - **Starts every new database early enough** to hold every MIP-0018 event: its `latestStarts` are
 *   {@link FIRST_CONTRACT_LOG_HEIGHTS}, so a new database on mainnet, preprod or preview configured above that height
 *   starts there (the core's resolver moves S and the entries starting with it) and backfills from the public chain;
 *   any start at or below it gives the same rows. A custom network is not moved.
 * - **Starts with its database**. Its rows are materialized state, so they depend on where it
 *   started: it declares `startsMidChain: true`, so a database started at any S accepts it, and refuses in
 *   `on-start-db` an entry starting above S. The process refuses with `callback-error` at `on-start-db` of
 *   `token-metadata`; the error itself is a {@link TokenMetadataStartAfterDatabase}, whose code is
 *   `token-metadata-start-after-database`. For the same reason it refuses revisions with a gap between them (a stop
 *   below the next start minus one): `token-metadata-revision-gap`, a {@link TokenMetadataRevisionGap}.
 * - **Provides** its tables as two `table` items (`./schema.ts`): `token-metadata-events` (append-only) and
 *   `token-metadata-state` (mutable), which `token-metadata-api` and any other module may require to read them.
 * - **Per block** it writes in `on-db-write` (`./apply.ts`): its accepted events' effect on `tokens` and
 *   `token_fields`, and its rejected events and unresolved log sites (from `core-contract-logs-fast`, never applied) as
 *   `token_events` rows, in chain order, reading its own rows inside the block transaction. A v8 block has no contract logs, so nothing.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { CONTRACT_LOGS_ITEM, contractLogsItemOf, unresolvedLogSitesOf } from "../../backbone/contract-logs/contract-logs.js";
import { defineModule } from "../../modules/declaration.js";
import { type LogReader, writeBlock } from "./apply.js";
import { miscAtom } from "./log-reader.js";
import { EVENTS_ITEM, STATE_ITEM } from "./schema.js";
import { databaseStart, MIGRATIONS, SCHEMA } from "./sql.js";


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

/** The module refused a configuration that stops it and starts it again later: its state would miss the gap. */
export class TokenMetadataRevisionGap extends Error {
  override readonly name = "TokenMetadataRevisionGap";
  readonly code = "token-metadata-revision-gap";
  constructor(
    readonly stop: bigint,
    readonly nextStart: bigint,
  ) {
    super(
      `token-metadata-revision-gap: token-metadata stops at ${stop} and starts again at ${nextStart}; its state is ` +
        `built from every block, so the heights between would be missing for good: end the stop at ${nextStart - 1n} ` +
        `or later, or start a new database`,
    );
  }
}

/** The first gap between `revisions` (in start order): a stop below the next start minus one, or `undefined`. */
export function revisionGap(revisions: readonly { readonly start: bigint; readonly stop: bigint | null }[]): TokenMetadataRevisionGap | undefined {
  for (let i = 1; i < revisions.length; i++) {
    const stop = revisions[i - 1]!.stop;
    if (stop !== null && stop + 1n < revisions[i]!.start) return new TokenMetadataRevisionGap(stop, revisions[i]!.start);
  }
  return undefined;
}

/**
 * The first block with contract logs on each official network: the first block of ledger v9 (runtime 2,001,100), the
 * delayed upgrade's first block (mainnet 3,346,139, preprod 3,348,434; preview 1,572 after its restart from genesis).
 * No MIP-0018 event exists before it, so a database started at or before it holds every one, and every such database
 * the same rows: the module's latest start on each network.
 */
export const FIRST_CONTRACT_LOG_HEIGHTS: Readonly<Record<string, number>> = Object.freeze({
  mainnet: 3_346_139,
  preprod: 3_348_434,
  preview: 1_572,
});

/**
 * The module's declaration with `reader` reading each `Misc` log's value and `latestStarts` as its latest starts:
 * {@link TOKEN_METADATA} is the one with the log reader and {@link FIRST_CONTRACT_LOG_HEIGHTS}; a negative control
 * gives another reader, a test other heights.
 */
export function tokenMetadataWith(reader: LogReader, latestStarts: Readonly<Record<string, number>> = FIRST_CONTRACT_LOG_HEIGHTS) {
  return defineModule({
    id: TOKEN_METADATA_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: [CONTRACT_LOGS_ITEM],
    provides: [
      { name: EVENTS_ITEM, lifetimes: ["table"], table: { schema: SCHEMA, tables: ["token_events"], kind: "append-only" } },
      {
        name: STATE_ITEM,
        lifetimes: ["table"],
        table: { schema: SCHEMA, tables: ["tokens", "token_fields"], kind: "mutable" },
      },
    ],
    startsMidChain: true,
    latestStarts,
    configSchema: z.object({}),
    migrations: MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-start-db"(p, w) {
        // The first revision is where the module started; a later one (a new version, new settings) continues it.
        const start = await databaseStart(w);
        const first = p.revisions[0];
        const gap = revisionGap(p.revisions);
        if (gap !== undefined) throw gap;
        if (start === null || first === undefined) return;
        if (first.start > start) throw new TokenMetadataStartAfterDatabase(first.start, start);
      },
      async "on-db-write"(_p, b, w) {
        await writeBlock(w, b.height, contractLogsItemOf(b, TOKEN_METADATA_ID), reader, unresolvedLogSitesOf(b, TOKEN_METADATA_ID));
      },
    },
  });
}

/** The `token-metadata` module. */
export const TOKEN_METADATA = tokenMetadataWith(miscAtom);
