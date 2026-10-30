/**
 * The SQL of `core-ledger-state` (`./core-ledger-state.ts`, `./sweep.ts`): its tables, its migrations, the statements
 * it writes each block's batch, state, results, events and sweep step with, and the reads of the stored state and of
 * the sweep's sets. [LG-11, LG-14, LG-16; design §10]
 *
 * **The tables**, created by its migrations under the part's role: [design §10]
 * - `001`: `core_ledger_state.nodes (node_key) → data, children` and
 *   `core_ledger_state.root_counts (node_key) → count`, the stored nodes and the positive root counts (keys are 32
 *   bytes); `core_ledger_state.states (height)`, the state after each block (its key and root, and the first free
 *   index and root of the zswap tree and of the DUST commitment and generation trees);
 *   `core_ledger_state.segment_results (height, tx_index, segment) → success` and
 *   `core_ledger_state.events (height, tx_index, event_index)`, whose `kind` is one of {@link EVENT_KINDS}. The last
 *   three are range-partitioned by height (`../height-partitions.ts`). [LG-11, LG-16]
 * - `002`: the mark-and-sweep's (`./sweep.ts`): `core_ledger_state.sweep`, its one row (the cycle, the phase and the
 *   sweep position), inserted `idle` by the migration; `core_ledger_state.grey` and `core_ledger_state.marks`, its
 *   grey set and its marks, one key per row. [LG-14]
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import type { LedgerEvent, LedgerName, NodeBatch, StateSummary } from "../../ledger/types.js";
import { BLOCKS_TABLE } from "../core-block-commit/sql.js";
import { heightPartitionsSql } from "../height-partitions.js";
import type { SweepPhase, SweepState } from "./sweep.js";

/** Its tables. [design §10] */
export const NODES_TABLE = "core_ledger_state.nodes";
export const ROOT_COUNTS_TABLE = "core_ledger_state.root_counts";
export const STATES_TABLE = "core_ledger_state.states";
export const SEGMENT_RESULTS_TABLE = "core_ledger_state.segment_results";
export const EVENTS_TABLE = "core_ledger_state.events";

/** The mark-and-sweep's tables (`./sweep.ts`). [design §10] */
export const SWEEP_TABLE = "core_ledger_state.sweep";
export const GREY_TABLE = "core_ledger_state.grey";
export const MARKS_TABLE = "core_ledger_state.marks";

/** The kinds of `core_ledger_state.events`, including `contract-deploy`, which is stored too. [LG-16; design §10] */
export const EVENT_KINDS = Object.freeze([
  "zswap-input",
  "zswap-output",
  "contract-deploy",
  "dust-initial-utxo",
  "dust-generation-dtime-update",
  "dust-spend-processed",
  "param-change",
] as const);

const kinds = EVENT_KINDS.map((kind) => `'${kind}'`).join(", ");

/** `core-ledger-state`'s migrations: applied once, recorded under `core-ledger-state`, never changed. [DB-9] */
export const CORE_LEDGER_STATE_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${NODES_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  data bytea NOT NULL,
  children bytea NOT NULL,
  PRIMARY KEY (node_key)
);
CREATE TABLE ${ROOT_COUNTS_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (node_key)
);
CREATE TABLE ${STATES_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  state_key bytea NOT NULL CHECK (octet_length(state_key) = 32),
  state_root bytea NOT NULL,
  zswap_first_free bigint NOT NULL CHECK (zswap_first_free >= 0),
  zswap_root bytea NOT NULL,
  dust_commitment_first_free bigint NOT NULL CHECK (dust_commitment_first_free >= 0),
  dust_commitment_root bytea NOT NULL,
  dust_generation_first_free bigint NOT NULL CHECK (dust_generation_first_free >= 0),
  dust_generation_root bytea NOT NULL,
  PRIMARY KEY (height)
) PARTITION BY RANGE (height);
${heightPartitionsSql(STATES_TABLE)}
CREATE TABLE ${SEGMENT_RESULTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  segment integer NOT NULL CHECK (segment >= 0),
  success boolean NOT NULL,
  PRIMARY KEY (height, tx_index, segment)
) PARTITION BY RANGE (height);
${heightPartitionsSql(SEGMENT_RESULTS_TABLE)}
CREATE TABLE ${EVENTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  event_index bigint NOT NULL CHECK (event_index >= 0),
  kind text NOT NULL CHECK (kind IN (${kinds})),
  logical_segment integer NOT NULL CHECK (logical_segment >= 0),
  physical_segment integer NOT NULL CHECK (physical_segment >= 0),
  bytes bytea NOT NULL,
  nullifier bytea,
  commitment bytea,
  tree_index bigint CHECK (tree_index >= 0),
  contract_address bytea,
  PRIMARY KEY (height, tx_index, event_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(EVENTS_TABLE)}`,
  },
  {
    // The mark-and-sweep (`./sweep.ts`): its row, its grey set and its marks. [LG-14]
    id: "002",
    sql: `CREATE TABLE ${SWEEP_TABLE} (
  id smallint NOT NULL CHECK (id = 1),
  cycle bigint NOT NULL CHECK (cycle >= 0),
  phase text NOT NULL CHECK (phase IN ('idle', 'mark', 'sweep')),
  sweep_after bytea CHECK (octet_length(sweep_after) = 32),
  PRIMARY KEY (id)
);
INSERT INTO ${SWEEP_TABLE} (id, cycle, phase, sweep_after) VALUES (1, 0, 'idle', NULL);
CREATE TABLE ${GREY_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  PRIMARY KEY (node_key)
);
CREATE TABLE ${MARKS_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  PRIMARY KEY (node_key)
);`,
  },
]);

const PARENT_TIME_SQL =
  `SELECT (extract(epoch FROM block_time) * 1000)::bigint AS ms FROM ${BLOCKS_TABLE} WHERE height = $1`;
/** The state stored after a block, with the block's hash and ledger. [LG-11, LG-12] */
const STATE_AT_SQL = `SELECT s.state_key, s.state_root, b.hash, b.ledger_version FROM ${STATES_TABLE} s
  JOIN ${BLOCKS_TABLE} b ON b.height = s.height WHERE s.height = $1`;
/** The contracts deployed below height `$1`: every contract a state there holds, which all get a row at F. [CC-1] */
const DEPLOYED_SQL =
  `SELECT DISTINCT contract_address FROM ${EVENTS_TABLE} WHERE kind = 'contract-deploy' AND height < $1`;
/** The keys of the states stored after the blocks `$1` to `$2` − 1, in height order: a block's releases. [LG-12] */
const KEYS_SQL =
  `SELECT height, state_key FROM ${STATES_TABLE} WHERE height >= $1 AND height < $2 ORDER BY height`;
const NODES_SQL = `INSERT INTO ${NODES_TABLE} (node_key, data, children)
  SELECT n.node_key, n.data, n.children FROM unnest($1::bytea[], $2::bytea[], $3::bytea[]) AS n (node_key, data, children)
  ON CONFLICT (node_key) DO NOTHING`;
const ROOT_COUNTS_SQL = `WITH d AS (SELECT * FROM unnest($1::bytea[], $2::integer[]) AS d (node_key, delta)),
  merged AS (SELECT d.node_key, coalesce(r.count, 0) + d.delta AS count FROM d LEFT JOIN ${ROOT_COUNTS_TABLE} r USING (node_key)),
  gone AS (DELETE FROM ${ROOT_COUNTS_TABLE} r USING merged m WHERE r.node_key = m.node_key AND m.count = 0)
  INSERT INTO ${ROOT_COUNTS_TABLE} (node_key, count) SELECT node_key, count FROM merged WHERE count <> 0
  ON CONFLICT (node_key) DO UPDATE SET count = EXCLUDED.count`;
const STATES_SQL = `INSERT INTO ${STATES_TABLE} (height, state_key, state_root, zswap_first_free, zswap_root,
  dust_commitment_first_free, dust_commitment_root, dust_generation_first_free, dust_generation_root)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const SEGMENTS_SQL = `INSERT INTO ${SEGMENT_RESULTS_TABLE} (height, tx_index, segment, success)
  SELECT $1::bigint, s.tx_index, s.segment, s.success FROM unnest($2::bigint[], $3::integer[], $4::boolean[])
    AS s (tx_index, segment, success)`;
const EVENTS_SQL = `INSERT INTO ${EVENTS_TABLE} (height, tx_index, event_index, kind, logical_segment, physical_segment, bytes,
  nullifier, commitment, tree_index, contract_address)
  SELECT $1::bigint, e.tx_index, e.event_index, e.kind, e.logical_segment, e.physical_segment, e.bytes, e.nullifier,
    e.commitment, e.tree_index, e.contract_address
  FROM unnest($2::bigint[], $3::bigint[], $4::text[], $5::integer[], $6::integer[], $7::bytea[], $8::bytea[], $9::bytea[],
    $10::bigint[], $11::bytea[])
    AS e (tx_index, event_index, kind, logical_segment, physical_segment, bytes, nullifier, commitment, tree_index,
      contract_address)`;

/** The mark-and-sweep's reads, of the tables as committed at h − 1, and its writes. [LG-14] */
const SWEEP_ROW_SQL = `SELECT cycle, phase, sweep_after FROM ${SWEEP_TABLE} WHERE id = 1`;
const ROOT_KEYS_SQL = `SELECT node_key FROM ${ROOT_COUNTS_TABLE} ORDER BY node_key`;
const SMALLEST_GREY_SQL = `SELECT node_key FROM ${GREY_TABLE} ORDER BY node_key LIMIT $1`;
const ALL_GREY_SQL = `SELECT node_key FROM ${GREY_TABLE} ORDER BY node_key`;
const FLAGS_SQL = `SELECT k.node_key, EXISTS (SELECT 1 FROM ${GREY_TABLE} g WHERE g.node_key = k.node_key) AS grey,
           EXISTS (SELECT 1 FROM ${MARKS_TABLE} m WHERE m.node_key = k.node_key) AS marked
         FROM unnest($1::bytea[]) AS k (node_key)`;
const CHILDREN_SQL = `SELECT node_key, children FROM ${NODES_TABLE} WHERE node_key = ANY($1::bytea[])`;
const MARKED = `EXISTS (SELECT 1 FROM ${MARKS_TABLE} m WHERE m.node_key = n.node_key) AS marked`;
const SCAN_SQL = `SELECT n.node_key, ${MARKED} FROM ${NODES_TABLE} n ORDER BY n.node_key LIMIT $1`;
const SCAN_AFTER_SQL =
  `SELECT n.node_key, ${MARKED} FROM ${NODES_TABLE} n WHERE n.node_key > $1 ORDER BY n.node_key LIMIT $2`;
const CLEAR_GREY_SQL = `DELETE FROM ${GREY_TABLE}`;
const DELETE_GREY_SQL = `DELETE FROM ${GREY_TABLE} WHERE node_key = ANY($1::bytea[])`;
const INSERT_GREY_SQL = `INSERT INTO ${GREY_TABLE} (node_key) SELECT unnest($1::bytea[])`;
const CLEAR_MARKS_SQL = `DELETE FROM ${MARKS_TABLE}`;
const INSERT_MARKS_SQL = `INSERT INTO ${MARKS_TABLE} (node_key) SELECT unnest($1::bytea[])`;
const DELETE_NODES_SQL = `DELETE FROM ${NODES_TABLE} WHERE node_key = ANY($1::bytea[])`;
const UPDATE_SWEEP_SQL = `UPDATE ${SWEEP_TABLE} SET cycle = $1, phase = $2, sweep_after = $3 WHERE id = 1`;

const bytesOf = (value: unknown, what: string): Uint8Array => {
  if (!(value instanceof Uint8Array)) throw new TypeError(`${what} is not bytes`);
  return value;
};

/** The time of the block stored at `height`, in milliseconds since 1970, or `undefined` if none is. [LG-8] */
export async function blockTimeMsAt(read: Pick<ReadHandle, "query">, height: bigint): Promise<bigint | undefined> {
  const [row] = await read.query(PARENT_TIME_SQL, [height]);
  return row === undefined ? undefined : BigInt(row.ms as bigint | number | string);
}

/** A state stored after a block, as {@link stateAt} reads it, with the block's hash and ledger. [LG-11, LG-12] */
export interface StoredState {
  readonly stateKey: Uint8Array;
  readonly stateRoot: Uint8Array;
  readonly hash: Uint8Array;
  readonly ledger: LedgerName;
}

/** The state stored after block `height` (see {@link STATE_AT_SQL}); throws naming the height when none is. */
export async function stateAt(read: Pick<ReadHandle, "query">, height: bigint): Promise<StoredState> {
  const [row] = await read.query(STATE_AT_SQL, [height]);
  if (row === undefined) throw new Error(`${STATES_TABLE} holds no state after block ${height}`);
  return {
    stateKey: bytesOf(row.state_key, `${STATES_TABLE}.state_key`),
    stateRoot: bytesOf(row.state_root, `${STATES_TABLE}.state_root`),
    hash: bytesOf(row.hash, `${BLOCKS_TABLE}.hash`),
    ledger: row.ledger_version as LedgerName,
  };
}

/** The keys of the states stored after the blocks `from` to `to` − 1, in height order (see {@link KEYS_SQL}). */
export async function stateKeysBetween(
  read: Pick<ReadHandle, "query">,
  from: bigint,
  to: bigint,
): Promise<Uint8Array[]> {
  const rows = await read.query(KEYS_SQL, [from, to]);
  return rows.map((row) => bytesOf(row.state_key, `${STATES_TABLE}.state_key`));
}

/** The contracts deployed below `height` (see {@link DEPLOYED_SQL}), read at h − 1. */
export async function deployedBelow(read: Pick<ReadHandle, "query">, height: bigint): Promise<Uint8Array[]> {
  const rows = await read.query(DEPLOYED_SQL, [height]);
  return rows.map((row) => bytesOf(row.contract_address, `${EVENTS_TABLE}.contract_address`));
}

/** Inserts `nodes` into the nodes table in one statement; a key already there is left as it is. [LG-11] */
export async function insertNodes(w: Pick<BlockWriteHandle, "execute">, nodes: NodeBatch["inserts"]): Promise<void> {
  await w.execute(NODES_SQL, [nodes.map((n) => n.key), nodes.map((n) => n.data), nodes.map((n) => n.children)]);
}

/** Adds each signed change of `counts` to the stored root count, deleting a count that reaches 0. [LG-11] */
export async function addRootCounts(
  w: Pick<BlockWriteHandle, "execute">,
  counts: NodeBatch["rootCounts"],
): Promise<void> {
  await w.execute(ROOT_COUNTS_SQL, [counts.map((c) => c.key), counts.map((c) => c.delta)]);
}

/** One row of the states table, as {@link insertStateRow} writes it. */
export interface StateRow extends Readonly<StateSummary> {
  readonly height: bigint;
  readonly stateKey: Uint8Array;
  readonly stateRoot: Uint8Array;
}

/** Inserts one row of the states table. */
export async function insertStateRow(w: Pick<BlockWriteHandle, "execute">, row: StateRow): Promise<void> {
  await w.execute(STATES_SQL, [
    row.height,
    row.stateKey,
    row.stateRoot,
    row.zswapFirstFree,
    row.zswapRoot,
    row.dustCommitmentFirstFree,
    row.dustCommitmentRoot,
    row.dustGenerationFirstFree,
    row.dustGenerationRoot,
  ]);
}

/** Inserts block `height`'s segment results, each with the index of its transaction `tx`. */
export async function insertSegmentResults(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  segments: readonly { readonly tx: number; readonly segment: number; readonly success: boolean }[],
): Promise<void> {
  await w.execute(SEGMENTS_SQL, [
    height,
    segments.map((s) => BigInt(s.tx)),
    segments.map((s) => s.segment),
    segments.map((s) => s.success),
  ]);
}

/** Inserts block `height`'s ledger events, `indexes` holding each one's number in its transaction. */
export async function insertEvents(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  events: readonly LedgerEvent[],
  indexes: readonly bigint[],
): Promise<void> {
  await w.execute(EVENTS_SQL, [
    height,
    events.map((e) => BigInt(e.transaction)),
    indexes,
    events.map((e) => e.kind),
    events.map((e) => e.logicalSegment),
    events.map((e) => e.physicalSegment),
    events.map((e) => e.bytes),
    events.map((e) => e.nullifier),
    events.map((e) => e.commitment),
    events.map((e) => e.treeIndex),
    events.map((e) => e.contractAddress),
  ]);
}

/** The sweep's row, or `undefined` when the table holds none. [LG-14] */
export async function readSweepRow(read: Pick<ReadHandle, "query">): Promise<SweepState | undefined> {
  const [row] = await read.query(SWEEP_ROW_SQL);
  if (row === undefined) return undefined;
  return {
    cycle: BigInt(row.cycle as bigint | number | string),
    phase: row.phase as SweepPhase,
    sweepAfter: row.sweep_after === null ? null : bytesOf(row.sweep_after, `${SWEEP_TABLE}.sweep_after`),
  };
}

const keysOf = (rows: Record<string, unknown>[], table: string): Uint8Array[] =>
  rows.map((row) => bytesOf(row.node_key, `${table}.node_key`));

/** The keys of `root_counts` (each count positive), in byte order. */
export async function rootKeys(read: Pick<ReadHandle, "query">): Promise<Uint8Array[]> {
  return keysOf(await read.query(ROOT_KEYS_SQL), ROOT_COUNTS_TABLE);
}

/** The `limit` smallest keys of `grey`, in byte order. */
export async function smallestGreyKeys(read: Pick<ReadHandle, "query">, limit: number): Promise<Uint8Array[]> {
  return keysOf(await read.query(SMALLEST_GREY_SQL, [limit]), GREY_TABLE);
}

/** Every key of `grey`, in byte order. */
export async function allGreyKeys(read: Pick<ReadHandle, "query">): Promise<Uint8Array[]> {
  return keysOf(await read.query(ALL_GREY_SQL), GREY_TABLE);
}

/** Each of `keys` with whether it is in `grey` and whether it is in `marks`, in one statement. */
export async function keyFlags(
  read: Pick<ReadHandle, "query">,
  keys: readonly Uint8Array[],
): Promise<{ readonly key: Uint8Array; readonly grey: boolean; readonly marked: boolean }[]> {
  const rows = await read.query(FLAGS_SQL, [[...keys]]);
  return rows.map((row) => ({
    key: bytesOf(row.node_key, "a key"),
    grey: row.grey === true,
    marked: row.marked === true,
  }));
}

/** The child lists of those of `keys` that `nodes` holds. */
export async function nodeChildren(
  read: Pick<ReadHandle, "query">,
  keys: readonly Uint8Array[],
): Promise<{ readonly key: Uint8Array; readonly children: Uint8Array }[]> {
  const rows = await read.query(CHILDREN_SQL, [[...keys]]);
  return rows.map((row) => ({
    key: bytesOf(row.node_key, `${NODES_TABLE}.node_key`),
    children: bytesOf(row.children, `${NODES_TABLE}.children`),
  }));
}

/**
 * The keys of `nodes` after `after` (all of them for null), in byte order, at most `limit`, each with whether it is in
 * `marks`, in one statement.
 */
export async function scanNodes(
  read: Pick<ReadHandle, "query">,
  after: Uint8Array | null,
  limit: number,
): Promise<{ readonly key: Uint8Array; readonly marked: boolean }[]> {
  const rows =
    after === null ? await read.query(SCAN_SQL, [limit]) : await read.query(SCAN_AFTER_SQL, [after, limit]);
  return rows.map((row) => ({ key: bytesOf(row.node_key, `${NODES_TABLE}.node_key`), marked: row.marked === true }));
}

/** Empties `grey`. */
export async function clearGrey(w: Pick<BlockWriteHandle, "execute">): Promise<void> {
  await w.execute(CLEAR_GREY_SQL);
}

/** Deletes `keys` from `grey`. */
export async function deleteGrey(w: Pick<BlockWriteHandle, "execute">, keys: readonly Uint8Array[]): Promise<void> {
  await w.execute(DELETE_GREY_SQL, [[...keys]]);
}

/** Inserts `keys` into `grey`. */
export async function insertGrey(w: Pick<BlockWriteHandle, "execute">, keys: readonly Uint8Array[]): Promise<void> {
  await w.execute(INSERT_GREY_SQL, [[...keys]]);
}

/** Empties `marks`. */
export async function clearMarks(w: Pick<BlockWriteHandle, "execute">): Promise<void> {
  await w.execute(CLEAR_MARKS_SQL);
}

/** Inserts `keys` into `marks`. */
export async function insertMarks(w: Pick<BlockWriteHandle, "execute">, keys: readonly Uint8Array[]): Promise<void> {
  await w.execute(INSERT_MARKS_SQL, [[...keys]]);
}

/** Deletes the nodes of `keys` from `nodes`. */
export async function deleteNodes(w: Pick<BlockWriteHandle, "execute">, keys: readonly Uint8Array[]): Promise<void> {
  await w.execute(DELETE_NODES_SQL, [[...keys]]);
}

/** Sets the sweep's row to `state`. */
export async function updateSweepRow(w: Pick<BlockWriteHandle, "execute">, state: SweepState): Promise<void> {
  await w.execute(UPDATE_SWEEP_SQL, [state.cycle, state.phase, state.sweepAfter]);
}
