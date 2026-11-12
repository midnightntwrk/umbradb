/**
 * The SQL of `token-metadata`: its schema, migration `001`, and every statement of its write path, by name
 * ({@link STATEMENTS}).
 *
 * **The tables** (schema `token_metadata`), related by keys and holding only what is read:
 *
 * - `tokens`, mutable: one row per described token, keyed by `(id, kind)`, where `id` is the token's hash
 *   `sha256(pad(32, "midnight:derive_token") ‖ domain_sep ‖ contract_address)` (`./color.ts`): its color for kinds 1
 *   and 2, the same hash for kind 3. `symbol` is the token's current usable `symbol`, whole, or null: what symbol
 *   groups read. A row exists exactly while the token has a field; its last field's deletion deletes it (a withdrawal).
 * - `token_fields`, mutable: one row per defined field of a token (MIP "Keys": keys MIP-0018 does not define are not
 *   stored), holding only its current value, whole (names and symbols are cut when served, never when stored), and
 *   where it was set. `uint_value` is a `UInt` value as a number; `usable` is the common-field rule's answer for a
 *   common key, else null. Its rows belong to their token (`ON DELETE CASCADE`).
 * - `token_events`, append-only: what a token's mark reads of its contract — each rejected MIP-0018 event and each
 *   unresolved log site, at its chain position (`event_index`: its position among its transaction's log sites), with
 *   its reason. Accepted events leave no row: their effect is the fields.
 *
 * There is no `network` column (a database holds one chain) and no raw payload (nothing is recomputed: UmbraDB follows
 * finalized blocks only). Text columns hold only UmbraDB's own vocabulary (CHECKs keep them ASCII); chain bytes are
 * `bytea`.
 */

import type { BlockWriteHandle, SchemaWriteHandle } from "../../db/api.js";
import { SCHEMA } from "./schema.js";

export { SCHEMA };

/** Migration `001`: the three tables and their indexes. Never edited once released; a change is a new migration. */
export const MIGRATION_001 = `CREATE TABLE ${SCHEMA}.tokens (
  id bytea NOT NULL CHECK (octet_length(id) = 32),
  kind smallint NOT NULL CHECK (kind IN (1, 2, 3)),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  domain_sep bytea NOT NULL CHECK (octet_length(domain_sep) = 32),
  symbol bytea CHECK (symbol IS NULL OR octet_length(symbol) <= 255),
  PRIMARY KEY (id, kind)
);
CREATE UNIQUE INDEX tokens_contract_idx ON ${SCHEMA}.tokens (contract_address, domain_sep, kind);
CREATE INDEX tokens_symbol_idx ON ${SCHEMA}.tokens (contract_address, symbol, domain_sep, kind) WHERE symbol IS NOT NULL;
CREATE TABLE ${SCHEMA}.token_fields (
  token_id bytea NOT NULL,
  kind smallint NOT NULL,
  key bytea NOT NULL CHECK (octet_length(key) BETWEEN 1 AND 255),
  val_type smallint NOT NULL CHECK (val_type BETWEEN 0 AND 4),
  value bytea NOT NULL CHECK (octet_length(value) <= 255),
  uint_value numeric(80, 0) CHECK (uint_value IS NULL OR uint_value >= 0),
  usable boolean,
  set_height bigint NOT NULL CHECK (set_height >= 0),
  set_tx integer NOT NULL CHECK (set_tx >= 0),
  set_event integer NOT NULL CHECK (set_event >= 0),
  set_record integer NOT NULL CHECK (set_record >= 0),
  CHECK ((val_type = 2) = (uint_value IS NOT NULL)),
  PRIMARY KEY (token_id, kind, key),
  FOREIGN KEY (token_id, kind) REFERENCES ${SCHEMA}.tokens (id, kind) ON DELETE CASCADE
);
CREATE TABLE ${SCHEMA}.token_events (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index integer NOT NULL CHECK (tx_index >= 0),
  event_index integer NOT NULL CHECK (event_index >= 0),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  classification text NOT NULL CHECK (classification IN ('reject', 'unresolved')),
  reason text NOT NULL CHECK (reason ~ '^[a-z0-9-]{1,64}$'),
  PRIMARY KEY (height, tx_index, event_index)
);
CREATE INDEX token_events_reject_idx ON ${SCHEMA}.token_events (contract_address, height, tx_index, event_index) INCLUDE (reason)
  WHERE classification = 'reject';
CREATE INDEX token_events_unresolved_idx ON ${SCHEMA}.token_events (contract_address, height, tx_index, event_index)
  WHERE classification = 'unresolved';`;

/** The module's migrations, in order. */
export const MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  Object.freeze({ id: "001", sql: MIGRATION_001 }),
]);

/** A token: its id (the hash of domain separator and contract), kind, contract and domain separator. */
export interface TokenRef {
  readonly id: Uint8Array;
  readonly kind: number;
  readonly contract: Uint8Array;
  readonly domainSep: Uint8Array;
}

/** A position on the chain: height, transaction, event within the transaction. */
export interface Position {
  readonly height: bigint;
  readonly tx: number;
  readonly event: number;
}

/** One `token_events` row: a rejected event or an unresolved log site of a contract. */
export interface EventRow extends Position {
  readonly contract: Uint8Array;
  readonly classification: "reject" | "unresolved";
  readonly reason: string;
}

/** One `token_fields` row's value and where it was set. */
export interface FieldRow {
  readonly key: Uint8Array;
  readonly valType: number;
  readonly value: Uint8Array;
  readonly uint: bigint | null;
  readonly usable: boolean | null;
  readonly record: number;
}

type Write = Pick<BlockWriteHandle, "execute" | "query">;

/**
 * Every statement the indexer sends, by name: the catalog `test/features/token-metadata/sql-plans.test.ts` plans on
 * both backends (no scan of a `token_metadata` table, every index used). The functions below only bind and map.
 */
export const STATEMENTS = Object.freeze({
  /** One rejected event or unresolved log site. */
  insertEvent: `INSERT INTO ${SCHEMA}.token_events (height, tx_index, event_index, contract_address, classification, reason)
     VALUES ($1, $2, $3, $4, $5, $6)`,
  /** A token's row, if it has none. */
  insertToken: `INSERT INTO ${SCHEMA}.tokens (id, kind, contract_address, domain_sep) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id, kind) DO NOTHING`,
  /** A token's current usable symbol, or null. */
  setTokenSymbol: `UPDATE ${SCHEMA}.tokens SET symbol = $3 WHERE id = $1 AND kind = $2`,
  /** Deletes a token (its fields are gone already). */
  deleteToken: `DELETE FROM ${SCHEMA}.tokens WHERE id = $1 AND kind = $2`,
  /** Whether a token has a field. */
  tokenHasFields: `SELECT 1 AS one FROM ${SCHEMA}.token_fields WHERE token_id = $1 AND kind = $2 LIMIT 1`,
  /** Sets one field's current value, inserting or replacing its row. */
  setField: `INSERT INTO ${SCHEMA}.token_fields (token_id, kind, key, val_type, value, uint_value, usable, set_height, set_tx,
      set_event, set_record) VALUES ($1, $2, $3, $4, $5, $6::numeric, $7, $8, $9, $10, $11)
     ON CONFLICT (token_id, kind, key) DO UPDATE SET val_type = EXCLUDED.val_type, value = EXCLUDED.value,
      uint_value = EXCLUDED.uint_value, usable = EXCLUDED.usable, set_height = EXCLUDED.set_height,
      set_tx = EXCLUDED.set_tx, set_event = EXCLUDED.set_event, set_record = EXCLUDED.set_record`,
  /** Deletes one field. */
  deleteField: `DELETE FROM ${SCHEMA}.token_fields WHERE token_id = $1 AND kind = $2 AND key = $3`,
  /** S, the database's first height (the core's one-row table). */
  databaseStart: "SELECT start_height FROM core_chain.identity WHERE id = 1",
});

const tokenParams = (t: TokenRef): unknown[] => [t.id, t.kind];

/** Writes one rejected event or unresolved log site. */
export async function insertEvent(w: Write, row: EventRow): Promise<void> {
  await w.execute(STATEMENTS.insertEvent, [row.height, row.tx, row.event, row.contract, row.classification, row.reason]);
}

/** Creates the token's row unless it has one. */
export async function insertToken(w: Write, t: TokenRef): Promise<void> {
  await w.execute(STATEMENTS.insertToken, [t.id, t.kind, t.contract, t.domainSep]);
}

/** Sets the token's current usable symbol (whole), or null. */
export async function setTokenSymbol(w: Write, t: TokenRef, symbol: Uint8Array | null): Promise<void> {
  await w.execute(STATEMENTS.setTokenSymbol, [...tokenParams(t), symbol]);
}

/** Deletes the token's row. */
export async function deleteToken(w: Write, t: TokenRef): Promise<void> {
  await w.execute(STATEMENTS.deleteToken, tokenParams(t));
}

/** Whether the token has a field. */
export async function tokenHasFields(w: Write, t: TokenRef): Promise<boolean> {
  return (await w.query(STATEMENTS.tokenHasFields, tokenParams(t))).length > 0;
}

/** Sets one field's current value (inserting or replacing its row). */
export async function setField(w: Write, t: TokenRef, at: Position, field: FieldRow): Promise<void> {
  await w.execute(STATEMENTS.setField, [
    ...tokenParams(t),
    field.key,
    field.valType,
    field.value,
    field.uint === null ? null : field.uint.toString(),
    field.usable,
    at.height,
    at.tx,
    at.event,
    field.record,
  ]);
}

/** Deletes one field; resolves with whether it was there. */
export async function deleteField(w: Write, t: TokenRef, key: Uint8Array): Promise<boolean> {
  return (await w.execute(STATEMENTS.deleteField, [...tokenParams(t), key])) > 0;
}

/** S, the database's first height, from `core_chain.identity`; null before it is recorded. */
export async function databaseStart(read: Pick<SchemaWriteHandle, "query">): Promise<bigint | null> {
  const [row] = await read.query(STATEMENTS.databaseStart);
  return row === undefined ? null : (row.start_height as bigint);
}
