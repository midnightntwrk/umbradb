/**
 * The serving side's reads of `token-metadata`'s state: the identities with their served fields, and the symbol groups,
 * as the proof of concept's pure `MetadataState` gives them. A name or symbol is cut to its first 64 or 12 characters
 * here, where it is served, never where it is stored (TM-9, TM-14), so this file — the serving code — is where `Intl`
 * may run (through `state.ts`'s `lengthLimited`). [TM-6 … TM-10; design D3, D5]
 *
 * These reads are whole-table: the API's bounded, paged reads replace them in task 4.x. They serve the module's tests
 * and the comparison with the reference model.
 */

import type { ReadHandle } from "../../db/api.js";
import { SCHEMA } from "./sql.ts";
import { type Field, type IdentityState, lengthLimited, type SymbolGroup, symbolGroups } from "./state.ts";
import { toHex } from "./vendor/mip0018/codec/src/index.ts";

/** Every existing identity of the database (at least one defined field), with its served fields, in identity order. */
export async function servedIdentities(read: Pick<ReadHandle, "query">, network: string): Promise<IdentityState[]> {
  const rows = await read.query(
    `SELECT contract_address, domain_sep, kind, key, val_type, value, uint_value::text AS uint_value, usable,
       set_height, set_tx, set_event, set_record
     FROM ${SCHEMA}.fields WHERE defined ORDER BY contract_address, domain_sep, kind, key`,
  );
  const byIdentity = new Map<string, { contractAddress: string; domainSep: string; kind: number; fields: Map<string, Field> }>();
  for (const row of rows) {
    const contractAddress = toHex(row.contract_address as Uint8Array);
    const domainSep = toHex(row.domain_sep as Uint8Array);
    const kind = Number(row.kind);
    const id = `${contractAddress}/${domainSep}/${kind}`;
    let identity = byIdentity.get(id);
    if (identity === undefined) {
      identity = { contractAddress, domainSep, kind, fields: new Map() };
      byIdentity.set(id, identity);
    }
    const key = row.key as Uint8Array;
    const keyHex = toHex(key);
    const valType = Number(row.val_type);
    const field: Field = {
      key,
      valType,
      value: lengthLimited(keyHex, valType, row.value as Uint8Array),
      position: { block: Number(row.set_height), tx: Number(row.set_tx), event: Number(row.set_event), record: Number(row.set_record) },
    };
    if (row.uint_value !== null) field.integer = BigInt(row.uint_value as string);
    if (row.usable !== null) field.usable = row.usable === true;
    identity.fields.set(keyHex, field);
  }
  return [...byIdentity.values()].map((identity) => ({ network, ...identity }));
}

/** The symbol groups of the served identities (two or more members each). */
export function servedGroups(identities: readonly IdentityState[]): SymbolGroup[] {
  return symbolGroups(identities);
}
