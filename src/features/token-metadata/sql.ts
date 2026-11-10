/**
 * The SQL of `token-metadata`: its schema, migration `001` and the statements of its write path.
 *
 * **The tables** (schema `token_metadata`). There is no `network` column (a database holds one chain), no raw
 * `name`/`payload` (nothing is recomputed: UmbraDB follows finalized blocks only, RN-14), and no activity listing (a
 * later change):
 *
 * - `events`, append-only: one row per MIP-0018 candidate at its chain position — height, the transaction's index in
 *   the block and its hash (from `block-parsed`, indexed for `/v1/events?tx=`), and `event_index`, the log's position among its transaction's logs (`eventIndex`
 *   in the API). Its classification is `accept`, `reject` or `unresolved` (an unresolved site of
 *   `fast-logs-unresolved`; an `ignore`d log is not stored); `reason` is null iff `accept`; an accepted event's identity is its `domain_sep` and `kind`. `entry_point` keeps the first 128 bytes.
 * - `fields`, mutable: one row per field of an identity, holding only its current value, whole (names and
 *   symbols are cut when served, never when stored). `uint_value` is a `UInt` value as a number; `usable` is the
 *   common-field rule's answer for a common key, else null; `defined` says whether the key is served (MIP "Keys").
 * - `withdrawals`, mutable: per identity, the position of the record after which it last had no defined field.
 *
 * Text columns hold only UmbraDB's own vocabulary (CHECKs keep them ASCII); chain bytes are `bytea`.
 */

import type { BlockWriteHandle, SchemaWriteHandle } from "../../db/api.js";
import { COLOR_SQL, SCHEMA } from "./schema.js";

export { COLOR_SQL, SCHEMA };


/** Migration `001`: the three tables and their indexes. Never edited once released; a change is a new migration. */
export const MIGRATION_001 = `CREATE TABLE ${SCHEMA}.events (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index integer NOT NULL CHECK (tx_index >= 0),
  event_index integer NOT NULL CHECK (event_index >= 0),
  tx_hash bytea NOT NULL CHECK (octet_length(tx_hash) = 32),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  entry_point bytea NOT NULL CHECK (octet_length(entry_point) <= 128),
  classification text NOT NULL CHECK (classification IN ('accept', 'reject', 'unresolved')),
  reason text CHECK (reason IS NULL OR reason ~ '^[a-z0-9-]{1,64}$'),
  domain_sep bytea CHECK (domain_sep IS NULL OR octet_length(domain_sep) = 32),
  kind smallint CHECK (kind IS NULL OR kind IN (1, 2, 3)),
  CHECK ((classification = 'accept') = (reason IS NULL)),
  CHECK ((classification = 'accept') = (domain_sep IS NOT NULL AND kind IS NOT NULL)),
  PRIMARY KEY (height, tx_index, event_index)
);
CREATE INDEX events_tx_idx ON ${SCHEMA}.events (tx_hash, height, tx_index, event_index);
CREATE INDEX events_contract_idx ON ${SCHEMA}.events (contract_address, height, tx_index, event_index);
CREATE INDEX events_reject_idx ON ${SCHEMA}.events (contract_address, height, tx_index, event_index) INCLUDE (reason)
  WHERE classification = 'reject';
CREATE INDEX events_unresolved_idx ON ${SCHEMA}.events (contract_address, height, tx_index, event_index)
  WHERE classification = 'unresolved';
CREATE TABLE ${SCHEMA}.fields (
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  domain_sep bytea NOT NULL CHECK (octet_length(domain_sep) = 32),
  kind smallint NOT NULL CHECK (kind IN (1, 2, 3)),
  key bytea NOT NULL CHECK (octet_length(key) BETWEEN 1 AND 255),
  val_type smallint NOT NULL CHECK (val_type BETWEEN 0 AND 4),
  value bytea NOT NULL CHECK (octet_length(value) <= 255),
  uint_value numeric(80, 0) CHECK (uint_value IS NULL OR uint_value >= 0),
  usable boolean,
  defined boolean NOT NULL,
  set_height bigint NOT NULL CHECK (set_height >= 0),
  set_tx integer NOT NULL CHECK (set_tx >= 0),
  set_event integer NOT NULL CHECK (set_event >= 0),
  set_record integer NOT NULL CHECK (set_record >= 0),
  CHECK ((val_type = 2) = (uint_value IS NOT NULL)),
  PRIMARY KEY (contract_address, domain_sep, kind, key)
);
CREATE INDEX fields_defined_idx ON ${SCHEMA}.fields (contract_address, domain_sep, kind, key) WHERE defined;
CREATE INDEX fields_symbol_idx ON ${SCHEMA}.fields (contract_address, value)
  WHERE key = '\\x73796d626f6c'::bytea AND usable;
CREATE INDEX fields_color_idx ON ${SCHEMA}.fields (${COLOR_SQL}, kind)
  WHERE defined AND kind IN (1, 2);
CREATE TABLE ${SCHEMA}.withdrawals (
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  domain_sep bytea NOT NULL CHECK (octet_length(domain_sep) = 32),
  kind smallint NOT NULL CHECK (kind IN (1, 2, 3)),
  height bigint NOT NULL CHECK (height >= 0),
  tx_index integer NOT NULL CHECK (tx_index >= 0),
  event_index integer NOT NULL CHECK (event_index >= 0),
  record_index integer NOT NULL CHECK (record_index >= 0),
  PRIMARY KEY (contract_address, domain_sep, kind)
);`;

/** The module's migrations, in order. */
export const MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  Object.freeze({ id: "001", sql: MIGRATION_001 }),
]);

/** An identity: the contract, its domain separator and kind. */
export interface IdentityKey {
  readonly contract: Uint8Array;
  readonly domainSep: Uint8Array;
  readonly kind: number;
}

/** A position on the chain: height, transaction, event within the transaction. */
export interface Position {
  readonly height: bigint;
  readonly tx: number;
  readonly event: number;
}

/** One `events` row. */
export interface EventRow extends Position {
  /** The transaction's hash, from `block-parsed`. */
  readonly txHash: Uint8Array;
  readonly contract: Uint8Array;
  readonly entryPoint: Uint8Array;
  readonly classification: "accept" | "reject" | "unresolved";
  readonly reason: string | null;
  readonly domainSep: Uint8Array | null;
  readonly kind: number | null;
}

/** One `fields` row's value and where it was set. */
export interface FieldRow {
  readonly key: Uint8Array;
  readonly valType: number;
  readonly value: Uint8Array;
  readonly uint: bigint | null;
  readonly usable: boolean | null;
  readonly defined: boolean;
  readonly record: number;
}

type Write = Pick<BlockWriteHandle, "execute" | "query">;

const IDENTITY = "contract_address = $1 AND domain_sep = $2 AND kind = $3";
const identityParams = (id: IdentityKey): unknown[] => [id.contract, id.domainSep, id.kind];

/** Writes one event row. */
export async function insertEvent(w: Write, row: EventRow): Promise<void> {
  await w.execute(
    `INSERT INTO ${SCHEMA}.events (height, tx_index, event_index, tx_hash, contract_address, entry_point, classification,
      reason, domain_sep, kind) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [row.height, row.tx, row.event, row.txHash, row.contract, row.entryPoint, row.classification, row.reason, row.domainSep, row.kind],
  );
}

/** Whether the identity has a defined field (it exists, MIP "Keys"). */
export async function hasDefinedField(w: Write, id: IdentityKey): Promise<boolean> {
  const rows = await w.query(`SELECT 1 AS one FROM ${SCHEMA}.fields WHERE ${IDENTITY} AND defined LIMIT 1`, identityParams(id));
  return rows.length > 0;
}

/** Deletes one field; resolves with whether it was there and was defined, or null when it was not there. */
export async function deleteField(w: Write, id: IdentityKey, key: Uint8Array): Promise<{ defined: boolean } | null> {
  const params = [...identityParams(id), key];
  const [row] = await w.query(`SELECT defined FROM ${SCHEMA}.fields WHERE ${IDENTITY} AND key = $4`, params);
  if (row === undefined) return null;
  await w.execute(`DELETE FROM ${SCHEMA}.fields WHERE ${IDENTITY} AND key = $4`, params);
  return { defined: row.defined === true };
}

/** Sets one field's current value (inserting or replacing its row). */
export async function setField(w: Write, id: IdentityKey, at: Position, field: FieldRow): Promise<void> {
  await w.execute(
    `INSERT INTO ${SCHEMA}.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
      set_height, set_tx, set_event, set_record) VALUES ($1, $2, $3, $4, $5, $6, $7::numeric, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (contract_address, domain_sep, kind, key) DO UPDATE SET val_type = EXCLUDED.val_type,
      value = EXCLUDED.value, uint_value = EXCLUDED.uint_value, usable = EXCLUDED.usable, defined = EXCLUDED.defined,
      set_height = EXCLUDED.set_height, set_tx = EXCLUDED.set_tx, set_event = EXCLUDED.set_event,
      set_record = EXCLUDED.set_record`,
    [
      ...identityParams(id),
      field.key,
      field.valType,
      field.value,
      field.uint === null ? null : field.uint.toString(),
      field.usable,
      field.defined,
      at.height,
      at.tx,
      at.event,
      field.record,
    ],
  );
}

/** Records the identity's last withdrawal: the record after which it had no defined field. */
export async function recordWithdrawal(w: Write, id: IdentityKey, at: Position, record: number): Promise<void> {
  await w.execute(
    `INSERT INTO ${SCHEMA}.withdrawals (contract_address, domain_sep, kind, height, tx_index, event_index, record_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (contract_address, domain_sep, kind) DO UPDATE SET height = EXCLUDED.height,
      tx_index = EXCLUDED.tx_index, event_index = EXCLUDED.event_index, record_index = EXCLUDED.record_index`,
    [...identityParams(id), at.height, at.tx, at.event, record],
  );
}

/** S, the database's first height, from `core_chain.identity`; null before it is recorded. */
export async function databaseStart(read: Pick<SchemaWriteHandle, "query">): Promise<bigint | null> {
  const [row] = await read.query("SELECT start_height FROM core_chain.identity WHERE id = 1");
  return row === undefined ? null : (row.start_height as bigint);
}
