/**
 * The SQL of `core-ledger-state` (`./core-ledger-state.ts`, `./refcount.ts`): its tables, its migrations, the
 * statements it writes each block's batch, state, results, events and reclamation step with, and the reads of the
 * stored state and of reclamation's counts and queue. [LG-11, LG-14, LG-16; design §10]
 *
 * **The tables**, created by its one migration, `001`, under the part's role: [design §10]
 * - `core_ledger_state.nodes (node_key) → data, children` and `core_ledger_state.root_counts (node_key) → count`, the
 *   stored nodes and the positive root counts (keys are 32 bytes); `core_ledger_state.states (height)`, the state after
 *   each block (its key and root, and the first free index and root of the zswap tree and of the DUST commitment and
 *   generation trees); `core_ledger_state.segment_results (height, tx_index, segment) → success` and
 *   `core_ledger_state.events (height, tx_index, event_index)`, whose `kind` is one of {@link EVENT_KINDS}. The last
 *   three are range-partitioned by height (`../height-partitions.ts`). [LG-11, LG-16]
 * - `core_ledger_state.ref_counts (node_key) → count`, the number of references to each key in the stored nodes' child
 *   lists, a row only while it is above 0, and `core_ledger_state.unreferenced (node_key)`, the stored nodes with
 *   neither a reference nor a root count: reclamation's counts and queue. [LG-11, LG-14]
 *
 * A database an earlier build wrote recorded another `001` (and, before one migration per part, a `002`), so startup
 * refuses it before any migration runs (`migration-checksum-changed`). [DB-9, R16]
 */

import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import type { LedgerEvent, LedgerName, NodeBatch, StateSummary } from "../../ledger/types.js";
import { BLOCKS_TABLE } from "../core-block-commit/sql.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** Its tables. [design §10] */
export const NODES_TABLE = "core_ledger_state.nodes";
export const ROOT_COUNTS_TABLE = "core_ledger_state.root_counts";
export const STATES_TABLE = "core_ledger_state.states";
export const SEGMENT_RESULTS_TABLE = "core_ledger_state.segment_results";
export const EVENTS_TABLE = "core_ledger_state.events";

/** Reclamation's counts and queue. [LG-11, LG-14; design §10] */
export const REF_COUNTS_TABLE = "core_ledger_state.ref_counts";
export const UNREFERENCED_TABLE = "core_ledger_state.unreferenced";

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

/**
 * `core-ledger-state`'s migrations: its one, `001`, which creates every table of the part. Applied once, recorded under
 * `core-ledger-state`, never changed; a later version adds its own after it. [DB-9, R16]
 */
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
${heightPartitionsSql(EVENTS_TABLE)}
CREATE TABLE ${REF_COUNTS_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (node_key)
);
CREATE TABLE ${UNREFERENCED_TABLE} (
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
/**
 * The node write: a new key is inserted; a stored key written with another child list takes it, as the node's own
 * storage replaces a node written again; one written with its stored child list touches no row. A row's `data` never
 * changes (a key is its node's hash). It affects exactly the new and the rewritten nodes. [LG-11, R27]
 */
const NODES_SQL = `INSERT INTO ${NODES_TABLE} (node_key, data, children)
  SELECT n.node_key, n.data, n.children FROM unnest($1::bytea[], $2::bytea[], $3::bytea[]) AS n (node_key, data, children)
  ON CONFLICT (node_key) DO UPDATE SET children = EXCLUDED.children WHERE nodes.children IS DISTINCT FROM EXCLUDED.children`;
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

/**
 * Writes `nodes` into the nodes table in one statement (see {@link NODES_SQL}): a stored key written with another child
 * list takes it, one written with its stored child list is left untouched. Resolves with the rows written: the new
 * and the rewritten nodes. [LG-11]
 */
export async function insertNodes(w: Pick<BlockWriteHandle, "execute">, nodes: NodeBatch["inserts"]): Promise<number> {
  return w.execute(NODES_SQL, [nodes.map((n) => n.key), nodes.map((n) => n.data), nodes.map((n) => n.children)]);
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

/**
 * Reclamation's reads, of the tables as committed at h − 1, and its writes (`./refcount.ts`). Each is one statement
 * over a key list, which the caller sends in chunks. [LG-14]
 */
const STORED_KEYS_SQL = `SELECT node_key FROM ${NODES_TABLE} WHERE node_key = ANY($1::bytea[])`;
const CHILDREN_SQL = `SELECT node_key, children FROM ${NODES_TABLE} WHERE node_key = ANY($1::bytea[])`;
/** The given nodes stored with another child list, with the stored one: the database compares the bytes. */
const CHANGED_SQL = `SELECT b.node_key, n.children FROM unnest($1::bytea[], $2::bytea[]) AS b (node_key, children)
  JOIN ${NODES_TABLE} n USING (node_key) WHERE n.children IS DISTINCT FROM b.children`;
const UNREFERENCED_KEYS_SQL = `SELECT node_key FROM ${UNREFERENCED_TABLE}`;
const KEY_COUNTS_SQL = `SELECT k.node_key,
    EXISTS (SELECT 1 FROM ${NODES_TABLE} n WHERE n.node_key = k.node_key) AS stored,
    coalesce(r.count, 0) AS refs, coalesce(c.count, 0) AS roots
  FROM unnest($1::bytea[]) AS k (node_key)
  LEFT JOIN ${REF_COUNTS_TABLE} r ON r.node_key = k.node_key
  LEFT JOIN ${ROOT_COUNTS_TABLE} c ON c.node_key = k.node_key`;
/** The shape of the root counts' merge: it reports the keys whose count stays above 0 (its `WITH` delete is not). */
const REF_COUNTS_SQL = `WITH d AS (SELECT * FROM unnest($1::bytea[], $2::integer[]) AS d (node_key, delta)),
  merged AS (SELECT d.node_key, coalesce(r.count, 0) + d.delta AS count FROM d LEFT JOIN ${REF_COUNTS_TABLE} r USING (node_key)),
  gone AS (DELETE FROM ${REF_COUNTS_TABLE} r USING merged m WHERE r.node_key = m.node_key AND m.count = 0)
  INSERT INTO ${REF_COUNTS_TABLE} (node_key, count) SELECT node_key, count FROM merged WHERE count <> 0
  ON CONFLICT (node_key) DO UPDATE SET count = EXCLUDED.count`;
const DELETE_NODES_SQL = `DELETE FROM ${NODES_TABLE} WHERE node_key = ANY($1::bytea[])`;
const DELETE_UNREFERENCED_SQL = `DELETE FROM ${UNREFERENCED_TABLE} WHERE node_key = ANY($1::bytea[])`;
/** A key already queued is not inserted again, and not counted. */
const INSERT_UNREFERENCED_SQL =
  `INSERT INTO ${UNREFERENCED_TABLE} (node_key) SELECT unnest($1::bytea[]) ON CONFLICT (node_key) DO NOTHING`;

const keysOf = (rows: Record<string, unknown>[], table: string): Uint8Array[] =>
  rows.map((row) => bytesOf(row.node_key, `${table}.node_key`));

/** Those of `keys` that `nodes` holds. */
export async function storedKeys(read: Pick<ReadHandle, "query">, keys: readonly Uint8Array[]): Promise<Uint8Array[]> {
  return keysOf(await read.query(STORED_KEYS_SQL, [[...keys]]), NODES_TABLE);
}

/** Those of `nodes` that `nodes` holds with another child list, each with its stored one (see {@link CHANGED_SQL}). */
export async function changedNodes(
  read: Pick<ReadHandle, "query">,
  nodes: readonly { readonly key: Uint8Array; readonly children: Uint8Array }[],
): Promise<{ readonly key: Uint8Array; readonly children: Uint8Array }[]> {
  const rows = await read.query(CHANGED_SQL, [nodes.map((n) => n.key), nodes.map((n) => n.children)]);
  return rows.map((row) => ({
    key: bytesOf(row.node_key, `${NODES_TABLE}.node_key`),
    children: bytesOf(row.children, `${NODES_TABLE}.children`),
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

/** Every key of `unreferenced`. */
export async function unreferencedKeys(read: Pick<ReadHandle, "query">): Promise<Uint8Array[]> {
  return keysOf(await read.query(UNREFERENCED_KEYS_SQL), UNREFERENCED_TABLE);
}

/** Each of `keys` with whether `nodes` holds it, its reference count and its root count (0 without a row). */
export async function keyCounts(
  read: Pick<ReadHandle, "query">,
  keys: readonly Uint8Array[],
): Promise<{ readonly key: Uint8Array; readonly row: boolean; readonly refs: number; readonly roots: number }[]> {
  const rows = await read.query(KEY_COUNTS_SQL, [[...keys]]);
  return rows.map((row) => ({
    key: bytesOf(row.node_key, "a key"),
    row: row.stored === true,
    refs: row.refs as number,
    roots: row.roots as number,
  }));
}

/**
 * Adds each signed change of `deltas` to the stored reference count, deleting a count that reaches 0; resolves with
 * the rows written: the keys whose count stays above 0.
 */
export async function addRefCounts(
  w: Pick<BlockWriteHandle, "execute">,
  deltas: readonly { readonly key: Uint8Array; readonly delta: number }[],
): Promise<number> {
  return w.execute(REF_COUNTS_SQL, [deltas.map((d) => d.key), deltas.map((d) => d.delta)]);
}

/** Deletes the nodes of `keys` from `nodes`; resolves with the rows deleted. */
export async function deleteNodes(w: Pick<BlockWriteHandle, "execute">, keys: readonly Uint8Array[]): Promise<number> {
  return w.execute(DELETE_NODES_SQL, [[...keys]]);
}

/** Deletes `keys` from `unreferenced`; resolves with the rows deleted. */
export async function deleteUnreferenced(
  w: Pick<BlockWriteHandle, "execute">,
  keys: readonly Uint8Array[],
): Promise<number> {
  return w.execute(DELETE_UNREFERENCED_SQL, [[...keys]]);
}

/** Inserts `keys` into `unreferenced`; resolves with the rows inserted. */
export async function insertUnreferenced(
  w: Pick<BlockWriteHandle, "execute">,
  keys: readonly Uint8Array[],
): Promise<number> {
  return w.execute(INSERT_UNREFERENCED_SQL, [[...keys]]);
}
