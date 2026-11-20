/**
 * The statements of `token-metadata`, by name ({@link STATEMENTS}), and the functions that bind them: its write path,
 * whose tables are `./schema.ts`'s, and the reads its start makes of the core's and the `contract-logs` item's tables.
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
  /** The revisions of every entry that provides the item `$1`, in start order (the core's configuration history). */
  providerRevisions: 'SELECT start, stop FROM core_chain.config WHERE $1 = ANY(provides) ORDER BY start',
  /**
   * A page of the stored `Misc` logs below height `$1` whose data holds the bytes `$2`, in chain order: the first `$6`
   * after the log (`$3`, `$4`, `$5`). It reads the stored logs below `$1` once over its pages; a start runs it once.
   */
  earlierNamedLogs: `SELECT height, tx_index, log_index, data FROM contract_logs.logs
     WHERE (height, tx_index, log_index) > ($3::bigint, $4::int, $5::int) AND height < $1 AND event_type = 'Misc'
       AND position($2::bytea in data) > 0
     ORDER BY height, tx_index, log_index LIMIT $6`,
  /** The first stored unresolved log site below height `$1`. */
  earlierUnresolvedSite: "SELECT height FROM contract_logs.unresolved WHERE height < $1 ORDER BY height LIMIT 1",
});

const tokenParams = (t: TokenRef): unknown[] => [t.id, t.kind];

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

/** The revisions of every entry that provides `item`, in start order. */
export async function providerRevisions(read: Pick<SchemaWriteHandle, "query">, item: string): Promise<{ start: bigint; stop: bigint | null }[]> {
  return (await read.query(STATEMENTS.providerRevisions, [item])).map((r) => ({ start: r.start as bigint, stop: (r.stop as bigint | null) ?? null }));
}

/** One stored log, as a later start reads it. */
export interface StoredLog {
  readonly height: bigint;
  readonly transaction: number;
  readonly index: number;
  readonly data: Uint8Array;
}

/** How many stored logs one read of {@link earlierNamedLogs} takes. */
export const EARLIER_LOGS_PAGE = 500;

/** The stored `Misc` logs below `height` whose data holds `bytes`, in chain order, read a page at a time. */
export async function* earlierNamedLogs(read: Pick<SchemaWriteHandle, "query">, height: bigint, bytes: Uint8Array, page = EARLIER_LOGS_PAGE): AsyncGenerator<StoredLog> {
  let after: readonly [bigint, number, number] = [-1n, 0, 0];
  for (;;) {
    const rows = await read.query(STATEMENTS.earlierNamedLogs, [height, bytes, ...after, page]);
    for (const r of rows) yield { height: BigInt(r.height as bigint | string), transaction: Number(r.tx_index), index: Number(r.log_index), data: r.data as Uint8Array };
    const last = rows.at(-1);
    if (last === undefined || rows.length < page) return;
    after = [BigInt(last.height as bigint | string), Number(last.tx_index), Number(last.log_index)];
  }
}

/** The height of the first stored unresolved log site below `height`, or null. */
export async function earlierUnresolvedSite(read: Pick<SchemaWriteHandle, "query">, height: bigint): Promise<bigint | null> {
  const [row] = await read.query(STATEMENTS.earlierUnresolvedSite, [height]);
  return row === undefined ? null : (row.height as bigint);
}
