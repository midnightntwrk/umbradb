/**
 * The tests' whole-table reads of `token-metadata`'s state: every identity with its served fields (each row through
 * the API's own `fieldOf`, so cut where it is served), and the symbol groups, as the pure `MetadataState` (`state.ts`)
 * gives them, for the comparisons with the reference model and the vectors. The API's own reads are bounded and paged.
 */

import type { ReadHandle } from "../../../src/db/api.js";
import { SCHEMA } from "../../../src/features/token-metadata/schema.js";
import { type Field, type IdentityState, type SymbolGroup, symbolGroups } from "../../../src/features/token-metadata/state.js";
import { toHex } from "../../../src/features/token-metadata/codec/index.js";
import { fieldOf } from "../../../src/features/token-metadata-api/api.js";

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
    identity.fields.set(toHex(row.key as Uint8Array), fieldOf(row));
  }
  return [...byIdentity.values()].map((identity) => ({ network, ...identity }));
}

/** The symbol groups of the served identities (two or more members each). */
export function servedGroups(identities: readonly IdentityState[]): SymbolGroup[] {
  return symbolGroups(identities);
}
