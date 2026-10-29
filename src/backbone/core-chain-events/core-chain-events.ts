/**
 * The core module `core-chain-events`: every chain event of every block, as the `block` item `chain-events` and as one
 * row per event in `core_chain_events.events`. It is off by default and runs where the configuration enables it. It
 * may start mid-chain, since it needs nothing from earlier blocks. [CD-4; CORE-ARCH §4.11; design §10]
 *
 * **At `on-fetch`** it asks the block source that the runner bound to its process context ({@link bindCoreChainEvents})
 * for the block's `System::Events` bytes. The node source reads them with `state_getStorage` at the block's hash, and
 * for a queued best block without retries (`src/backbone/core-block-fetch/events.ts`). [IN-8, IN-10]
 *
 * It decodes them with the `runtime-metadata` item: the metadata of the runtime in the parent block's state. At the
 * block U that enacts a runtime upgrade, that is the old runtime's, which executed U and wrote its events
 * (`./events.ts`). [LG-4]
 *
 * It puts the decoded events as `chain-events` ({@link ChainEvent}, in their order), so `core-block-parsed` and
 * `core-tx-results` can read them at `on-parse`. A block without an `Events` value (block 0) has none, and its metadata
 * is not read. [RN-5]
 *
 * **At `on-db-write`** it writes one row per event, `core_chain_events.events (height, event_index) → phase,
 * extrinsic_index, pallet, name, bytes, fields`, in one statement per block:
 * - the phase as `initialization`, `apply-extrinsic` or `finalization`;
 * - the extrinsic index under `apply-extrinsic` only (enforced by a `CHECK`);
 * - the record's SCALE bytes, and its fields as canonical JSON (`./scale-value.ts`).
 *
 * The table is append-only and range-partitioned by height (`../height-partitions.ts`). [design §10]
 *
 * The declaration ({@link CORE_CHAIN_EVENTS}) is a constant, as `core-block-fetch`'s: the source is found through the
 * process context (a `WeakMap`), so one build's declarations serve every process.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { RuntimeMetadataEntry } from "../../ledger/metadata.js";
import { type BlockContext, defineModule, type ItemSink, type ProcessContext } from "../../modules/declaration.js";
import type { BlockEventSource } from "../core-block-fetch/events.js";
import { readRuntimeMetadata, type RuntimeMetadataView } from "../core-block-fetch/metadata.js";
import { heightPartitionsSql } from "../height-partitions.js";
import { type ChainEvent, decodeChainEvents } from "./events.js";
import { canonicalJson } from "./scale-value.js";

/** The module's id. */
export const CORE_CHAIN_EVENTS_ID = "core-chain-events";

/** The `block` (and `table`) item it provides. */
export const CHAIN_EVENTS_ITEM = "chain-events";

/** Its table: one row per chain event. */
export const EVENTS_TABLE = "core_chain_events.events";

/** The largest extrinsic index the `integer` column holds: 2^31 − 1 (a phase's index is a `u32`). */
const MAX_EXTRINSIC_INDEX = 2_147_483_647;

/** `core-chain-events`' migrations: applied once, recorded under `core-chain-events`, never changed. [DB-9] */
export const CORE_CHAIN_EVENTS_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${EVENTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  event_index bigint NOT NULL CHECK (event_index >= 0),
  phase text NOT NULL CHECK (phase IN ('initialization', 'apply-extrinsic', 'finalization')),
  extrinsic_index integer CHECK (extrinsic_index >= 0),
  pallet text NOT NULL CHECK (pallet <> ''),
  name text NOT NULL CHECK (name <> ''),
  bytes bytea NOT NULL,
  fields jsonb NOT NULL,
  CHECK ((phase = 'apply-extrinsic') = (extrinsic_index IS NOT NULL)),
  PRIMARY KEY (height, event_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(EVENTS_TABLE)}`,
  },
]);

const INSERT_SQL = `INSERT INTO ${EVENTS_TABLE} (height, event_index, phase, extrinsic_index, pallet, name, bytes, fields)
  SELECT $1::bigint, e.event_index, e.phase, e.extrinsic_index, e.pallet, e.name, e.bytes, e.fields
  FROM unnest($2::bigint[], $3::text[], $4::integer[], $5::text[], $6::text[], $7::bytea[], $8::jsonb[])
    AS e (event_index, phase, extrinsic_index, pallet, name, bytes, fields)`;

const BOUND = new WeakMap<ProcessContext, BlockEventSource>();

/**
 * Binds `core-chain-events` to its process context `context` with the process's block source, before the loop runs.
 * Throws when `context` is bound already.
 */
export function bindCoreChainEvents(context: ProcessContext, source: BlockEventSource): void {
  if (BOUND.has(context)) throw new Error("bindCoreChainEvents: core-chain-events is bound once per process context");
  BOUND.set(context, source);
}

/** The block source bound to `p` (see {@link bindCoreChainEvents}); throws when there is none. */
export function boundEventSource(p: ProcessContext): BlockEventSource {
  const source = BOUND.get(p);
  if (source === undefined) {
    throw new Error(
      "core-chain-events ran with a process context the runner did not bind to a block source that gives a block's " +
        "events (bindCoreChainEvents): the node source and the in-memory source do",
    );
  }
  return source;
}

const VIEWS = new WeakMap<Uint8Array, RuntimeMetadataView>();

/** The metadata `bytes` read, once per metadata (the cache keys `RuntimeMetadata`'s one array per runtime). */
export function metadataView(bytes: Uint8Array, height: bigint): RuntimeMetadataView {
  let view = VIEWS.get(bytes);
  if (view === undefined) {
    try {
      view = readRuntimeMetadata(bytes);
    } catch (error) {
      throw new Error(`the runtime metadata block ${height}'s events are decoded with cannot be read: ${(error as Error).message}`, {
        cause: error,
      });
    }
    VIEWS.set(bytes, view);
  }
  return view;
}

/** The `runtime-metadata` item of `b` (`core-block-fetch`'s); throws a `TypeError` when it has none. */
export function runtimeMetadataOf(b: BlockContext, module: string): RuntimeMetadataEntry {
  const metadata = b.items.get("runtime-metadata") as Partial<RuntimeMetadataEntry> | undefined;
  if (!(metadata?.metadata instanceof Uint8Array)) {
    throw new TypeError(
      `the block at height ${b.height} has no runtime-metadata item ${module} can read: core-block-fetch puts the ` +
        "metadata of the runtime in the block's parent's state at on-fetch",
    );
  }
  return metadata as RuntimeMetadataEntry;
}

/** Block `b`'s chain events: its `System::Events` from `source`, decoded with its `runtime-metadata`. [CD-4] */
export async function chainEventsOf(source: BlockEventSource, b: BlockContext): Promise<readonly ChainEvent[]> {
  const bytes = await source.blockEvents({ height: b.height, hash: b.hash, parentHash: b.parentHash });
  if (bytes === null) return Object.freeze([]);
  const metadata = runtimeMetadataOf(b, CORE_CHAIN_EVENTS_ID);
  return decodeChainEvents(metadataView(metadata.metadata, b.height), bytes, b.height);
}

/** `core-chain-events`' `on-fetch` (see the module comment). */
export async function coreChainEventsOnFetch(p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void> {
  out.put(CHAIN_EVENTS_ITEM, await chainEventsOf(boundEventSource(p), b));
}

/** The `chain-events` item of `b`; throws a `TypeError` naming `module` when it has none. */
export function chainEventsItemOf(b: BlockContext, module: string): readonly ChainEvent[] {
  const events = b.items.get(CHAIN_EVENTS_ITEM);
  if (!Array.isArray(events)) {
    throw new TypeError(
      `the block at height ${b.height} has no chain-events item ${module} can read: core-chain-events puts it at on-fetch`,
    );
  }
  return events as readonly ChainEvent[];
}

/** The rows of block `b`'s events, written in one statement (see the module comment). */
export async function writeEventRows(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  const events = chainEventsItemOf(b, CORE_CHAIN_EVENTS_ID);
  if (events.length === 0) return;
  for (const event of events) {
    if (event.extrinsicIndex !== null && event.extrinsicIndex > MAX_EXTRINSIC_INDEX) {
      throw new RangeError(
        `event ${event.index} of block ${b.height} is under the extrinsic index ${event.extrinsicIndex}, above the ` +
          `${MAX_EXTRINSIC_INDEX} the column extrinsic_index holds`,
      );
    }
  }
  await w.execute(INSERT_SQL, [
    b.height,
    events.map((event) => BigInt(event.index)),
    events.map((event) => event.phase),
    events.map((event) => event.extrinsicIndex),
    events.map((event) => event.pallet),
    events.map((event) => event.name),
    events.map((event) => event.bytes),
    events.map((event) => canonicalJson(event.fields)),
  ]);
}

/**
 * `core-chain-events` (see the module comment): a core module that requires the `block` items `block-header` and
 * `runtime-metadata` (`core-block-fetch`'s) and provides `chain-events`, a `block` item and its table.
 */
export const CORE_CHAIN_EVENTS = defineModule({
  id: CORE_CHAIN_EVENTS_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["block-header", "runtime-metadata"],
  provides: [
    {
      name: CHAIN_EVENTS_ITEM,
      lifetimes: ["block", "table"],
      table: { schema: "core_chain_events", tables: ["events"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_CHAIN_EVENTS_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-fetch"(p, b, out) {
      await coreChainEventsOnFetch(p, b, out);
    },
    async "on-db-write"(_p, b, w) {
      await writeEventRows(w, b);
    },
  },
});
