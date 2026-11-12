/**
 * The tests' whole-table reads of `token-metadata`'s state: every identity with its served fields (each row through
 * the API's own `fieldOf`, so cut where it is served), and the symbol groups, as the pure `MetadataState` (`state.ts`)
 * gives them, for the comparisons with the reference model and the vectors. The API's own reads are bounded and paged.
 */

import type { ReadHandle } from "../../../src/db/api.js";
import { SCHEMA } from "../../../src/features/token-metadata/schema.js";
import { type Field, type IdentityState, type SymbolGroup, symbolGroups } from "../../../src/features/token-metadata/state.js";
import { toHex } from "../../../src/features/token-metadata/codec/index.js";
import { fieldOf } from "../../../src/features/token-metadata-api/sql.js";

/** Every token of the database (a row of `tokens`, which has a field), with its served fields, in identity order. */
export async function servedIdentities(read: Pick<ReadHandle, "query">, network: string): Promise<IdentityState[]> {
  const rows = await read.query(
    `SELECT t.contract_address, t.domain_sep, t.kind, f.key, f.val_type, f.value, f.uint_value::text AS uint_value, f.usable,
       f.set_height, f.set_tx, f.set_event, f.set_record
     FROM ${SCHEMA}.tokens t JOIN ${SCHEMA}.token_fields f ON f.token_id = t.id AND f.kind = t.kind
     ORDER BY t.contract_address, t.domain_sep, t.kind, f.key`,
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
