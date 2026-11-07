/**
 * The SQL of `core-chain-events` (`./core-chain-events.ts`): its table, its migration, and the statement it writes each
 * block's events with.
 *
 * **The table** `core_chain_events.events (height, event_index) → phase, extrinsic_index, pallet, name, bytes,
 * fields` has one row per event:
 * - the phase as `initialization`, `apply-extrinsic` or `finalization`;
 * - the extrinsic index under `apply-extrinsic` only (enforced by a `CHECK`);
 * - the record's SCALE bytes, and its fields as canonical JSON (`./scale-value.ts`).
 *
 * The table is append-only and range-partitioned by height (`../height-partitions.ts`). [design §10]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import { heightPartitionsSql } from "../height-partitions.js";
import type { ChainEvent } from "./events.js";
import { canonicalJson } from "./scale-value.js";

/** Its table: one row per chain event. */
export const EVENTS_TABLE = "core_chain_events.events";

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

/** Inserts `events`, block `height`'s, as rows of the events table, in one statement. */
export async function insertEventRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  events: readonly ChainEvent[],
): Promise<void> {
  await w.execute(INSERT_SQL, [
    height,
    events.map((event) => BigInt(event.index)),
    events.map((event) => event.phase),
    events.map((event) => event.extrinsicIndex),
    events.map((event) => event.pallet),
    events.map((event) => event.name),
    events.map((event) => event.bytes),
    events.map((event) => canonicalJson(event.fields)),
  ]);
}
