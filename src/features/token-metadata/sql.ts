/**
 * The statements of `token-metadata`'s write path, by name ({@link STATEMENTS}), and the functions that bind them. The
 * tables they write are `./schema.ts`'s.
 */

import type { BlockWriteHandle, SchemaWriteHandle } from "../../db/api.js";
import { TOKEN_METADATA_SCHEMA } from "./schema.js";

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

/** One `events` row: a rejected event or an unresolved log site of a contract. */
export interface EventRow extends Position {
  readonly contract: Uint8Array;
  readonly classification: "reject" | "unresolved";
  readonly reason: string;
}

/** One `fields` row's value and where it was set. */
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
  insertEvent: `INSERT INTO ${TOKEN_METADATA_SCHEMA}.events (height, tx_index, event_index, contract_address, classification, reason)
     VALUES ($1, $2, $3, $4, $5, $6)`,
  /** A token's row, if it has none. */
  insertToken: `INSERT INTO ${TOKEN_METADATA_SCHEMA}.tokens (id, kind, contract_address, domain_sep) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id, kind) DO NOTHING`,
  /** A token's current usable symbol, or null. */
  setTokenSymbol: `UPDATE ${TOKEN_METADATA_SCHEMA}.tokens SET symbol = $3 WHERE id = $1 AND kind = $2`,
  /** Deletes a token (its fields are gone already). */
  deleteToken: `DELETE FROM ${TOKEN_METADATA_SCHEMA}.tokens WHERE id = $1 AND kind = $2`,
  /** Whether a token has a field. */
  tokenHasFields: `SELECT 1 AS one FROM ${TOKEN_METADATA_SCHEMA}.fields WHERE token_id = $1 AND kind = $2 LIMIT 1`,
  /** Sets one field's current value, inserting or replacing its row. */
  setField: `INSERT INTO ${TOKEN_METADATA_SCHEMA}.fields (token_id, kind, key, val_type, value, uint_value, usable, set_height, set_tx,
      set_event, set_record) VALUES ($1, $2, $3, $4, $5, $6::numeric, $7, $8, $9, $10, $11)
     ON CONFLICT (token_id, kind, key) DO UPDATE SET val_type = EXCLUDED.val_type, value = EXCLUDED.value,
      uint_value = EXCLUDED.uint_value, usable = EXCLUDED.usable, set_height = EXCLUDED.set_height,
      set_tx = EXCLUDED.set_tx, set_event = EXCLUDED.set_event, set_record = EXCLUDED.set_record`,
  /** Deletes one field. */
  deleteField: `DELETE FROM ${TOKEN_METADATA_SCHEMA}.fields WHERE token_id = $1 AND kind = $2 AND key = $3`,
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
