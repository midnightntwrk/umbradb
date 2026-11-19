/**
 * The `token-metadata` module: MIP-0018 token metadata from the `contract-logs` item, kept in its tables. A public
 * module, not one of the core's: a configuration enables it with `TOKEN_METADATA.entry(...)`. It creates, fills and
 * guards the tables; `token-metadata-api` (`../token-metadata-api/`) serves them.
 *
 * - **Requires** `contract-logs` only, so it runs with either logs provider (`core-contract-logs-full`, or the
 *   development-only `core-contract-logs-fast` from any height). It has no ledger task, so it loads in the browser
 *   build like any user module.
 * - **Starts every new database early enough** to hold every MIP-0018 event: its `latestStarts` are
 *   {@link FIRST_CONTRACT_LOG_HEIGHTS}, so a new database on mainnet, preprod, preview or undeployed configured above
 *   that height starts there (the core's resolver moves S and the entries starting with it) and backfills from the
 *   chain; any start at or below it gives the same rows. A custom network is not moved.
 * - **Starts with its database, or later when that loses nothing**. Its rows are materialized state, so they depend
 *   on where it started: it declares `startsMidChain: true`, so a database started at any S accepts it. Added to a
 *   database that already ran (a first entry above S), it starts only when the stored contract logs show that no
 *   MIP-0018 event lies below its start ({@link laterStartRefusal}): it then holds what a run from S would hold.
 *   Otherwise the process refuses with `callback-error` at `on-start-db` of `token-metadata`; the error itself is a
 *   {@link TokenMetadataStartAfterDatabase}, whose code is `token-metadata-start-after-database` and whose `why` says
 *   what lies below. For the same reason it refuses revisions with a gap between them (a stop below the next start
 *   minus one): `token-metadata-revision-gap`, a {@link TokenMetadataRevisionGap}.
 * - **Provides** its tables as one `table` item (`./schema.ts`): `token-metadata-state` (mutable), which
 *   `token-metadata-api` requires and any other module may.
 * - **Per block** it writes in `on-db-write` (`./apply.ts`): its accepted events' effect on `tokens` and `fields`,
 *   in chain order, reading its own rows inside the block transaction. A rejected event changes nothing and leaves
 *   nothing, and neither does a log site `core-contract-logs-fast` could not read. A v8 block has no contract logs,
 *   so nothing.
 * - **Files by role**: `./schema.ts` the tables (migration `001`) and items, `./sql.ts` every statement the write path
 *   sends, `./apply.ts` the write path, `./log-reader.ts` a log's bytes, `./codec/` the MIP-0018 event codec,
 *   `./rules.ts` the rules the indexer and the API share, and `./color.ts` a token's color.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { CONTRACT_LOGS_ITEM, contractLogsItemOf, unresolvedLogSitesOf } from "../../backbone/contract-logs/contract-logs.js";
import { cursorHeight } from "../../backbone/core-block-commit/sql.js";
import type { SchemaWriteHandle } from "../../db/api.js";
import { defineModule } from "../../modules/declaration.js";
import { type LogReader, writeTokenMetadata } from "./apply.js";
import { classifyEvent, EVENT_NAME_TEXT, splitMiscData } from "./codec/index.js";
import { miscAtom, UnknownLogSerialization } from "./log-reader.js";
import { MIGRATIONS, TOKEN_METADATA_SCHEMA, TOKEN_METADATA_STATE_ITEM } from "./schema.js";
import { databaseStart, earlierNamedLogs, earlierUnresolvedSite, providerRevisions } from "./sql.js";


/** The module's id. */
export const TOKEN_METADATA_ID = "token-metadata";

/**
 * The module refused a first start above its database's first height: something it would have applied lies, or may
 * lie, below that start (`why` says what).
 */
export class TokenMetadataStartAfterDatabase extends Error {
  override readonly name = "TokenMetadataStartAfterDatabase";
  readonly code = "token-metadata-start-after-database";
  constructor(
    readonly entryStart: bigint,
    readonly databaseStart: bigint,
    readonly why: string,
  ) {
    super(
      `token-metadata-start-after-database: token-metadata starts at ${entryStart}, above this database's first height ` +
        `${databaseStart}, and ${why}; its state is built from every MIP-0018 event since the database's first block, ` +
        `so start it with a new database (from ${databaseStart}) instead`,
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

/** The first height of `from`..`to` that no revision of `revisions` covers, or undefined when they cover them all. */
export function firstUncovered(revisions: readonly { readonly start: bigint; readonly stop: bigint | null }[], from: bigint, to: bigint): bigint | undefined {
  let next = from;
  for (const r of [...revisions].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))) {
    if (next > to) break;
    if (r.start > next) return next;
    if (r.stop === null) return undefined;
    if (r.stop >= next) next = r.stop + 1n;
  }
  return next > to ? undefined : next;
}

/** The event name's text as bytes: what a stored log's data holds when its value starts with the name. */
const EVENT_NAME_BYTES = new TextEncoder().encode(EVENT_NAME_TEXT);

/**
 * Why the module may not start at `entryStart`, above its database's first height `start`, or undefined when that
 * start loses nothing: the module then holds what a run from `start` would hold. It loses nothing when
 * - `contract-logs` was provided at every height from `start` to `entryStart` - 1, so every earlier log is stored;
 * - none of those stored logs is a MIP-0018 event the module would have applied (a rejected one changes nothing);
 * - and no log site of those heights is unresolved (`core-contract-logs-fast`): such a site may have been one.
 */
export async function laterStartRefusal(
  read: Pick<SchemaWriteHandle, "query">,
  entryStart: bigint,
  start: bigint,
  reader: LogReader,
): Promise<string | undefined> {
  const missing = firstUncovered(await providerRevisions(read, CONTRACT_LOGS_ITEM), start, entryStart - 1n);
  if (missing !== undefined) return `the database stored no contract logs at height ${missing} (no provider of ${CONTRACT_LOGS_ITEM} was configured there)`;
  const unresolved = await earlierUnresolvedSite(read, entryStart);
  if (unresolved !== null) return `height ${unresolved} has a log site core-contract-logs-fast could not read, which may be a MIP-0018 event`;
  for await (const stored of earlierNamedLogs(read, entryStart, EVENT_NAME_BYTES)) {
    const where = `the stored log ${stored.index} of transaction ${stored.transaction} at height ${stored.height}`;
    let atom: Uint8Array | null;
    try {
      atom = reader(stored.data);
    } catch (error) {
      if (error instanceof UnknownLogSerialization) return `${where} is in a serialization this build cannot read`;
      throw error;
    }
    const split = atom === null ? undefined : splitMiscData(atom);
    if (split === undefined) continue;
    if (classifyEvent({ type: "Misc", name: split.name, payload: split.payload }).result === "accept") {
      return `${where} is a MIP-0018 event the module did not apply`;
    }
  }
  return undefined;
}

/**
 * This is only for core-contract-logs-fast.
 *
 * The first block with contract logs on each official network: the first block of ledger v9 (runtime 2,001,100), the
 * delayed upgrade's first block (mainnet 3,346,139, preprod 3,348,434; preview 1,572 after its restart from genesis);
 * and 0 on `undeployed`, the local standalone network, whose chains each start anew. No MIP-0018 event exists before
 * it, so a database started at or before it holds every one, and every such database the same rows: the module's
 * latest start on each network.
 */
export const FIRST_CONTRACT_LOG_HEIGHTS: Readonly<Record<string, number>> = Object.freeze({
  mainnet: 3_346_139,
  preprod: 3_348_434,
  preview: 1_572,
  undeployed: 0,
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
      {
        name: TOKEN_METADATA_STATE_ITEM,
        lifetimes: ["table"],
        table: { schema: TOKEN_METADATA_SCHEMA, tables: ["tokens", "fields"], kind: "mutable" },
      },
    ],
    /** This is only for core-contract-logs-fast */
    startsMidChain: true,
    /** This is only for core-contract-logs-fast */
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
        if (start === null || first === undefined || first.start <= start) return;
        // Added to a database that already ran. Once its first block has committed, that start was checked.
        const cursor = await cursorHeight(w);
        if (cursor !== null && cursor >= first.start) return;
        const why = await laterStartRefusal(w, first.start, start, reader);
        if (why !== undefined) throw new TokenMetadataStartAfterDatabase(first.start, start, why);
      },
      async "on-db-write"(_p, b, w) {
        await writeTokenMetadata(w, b.height, contractLogsItemOf(b, TOKEN_METADATA_ID), reader, unresolvedLogSitesOf(b, TOKEN_METADATA_ID));
      },
    },
  });
}

/** The `token-metadata` module. */
export const TOKEN_METADATA = tokenMetadataWith(miscAtom);
