/**
 * The write path of `token-metadata`: a block's `contract-logs` become changes to `tokens` and `fields`, applied
 * in chain order (`./sql.ts`). Nothing is stored of an event that is not applied.
 *
 * - **Candidates.** Only a `Misc` log whose value the log reader gives as one atom of at most 288 bytes;
 *   its name and payload are the atom zero-extended to 288 bytes, split 32 + 256 (`splitMiscData`). An unknown
 *   serialization halts the block with an error naming the height, transaction, log and tag.
 * - **Classification.** The codec's `classifyEvent` (`./codec/`): `accept` applies its records; `ignore` (another
 *   name) and `reject` (a payload MIP-0018 refuses: none of its records applies) change nothing and store nothing.
 * - **Records.** Only a defined key's record is kept (`isDefinedKey`; MIP "Keys"): a non-Null record sets its field
 *   (latest wins), creating the token's row with its first field; a Null record deletes it (nothing for a key without
 *   a field), and the token's row with its last field (a withdrawal: a later record starts it afresh). The token's
 *   `symbol` follows its usable `symbol` field. Values are stored whole: nothing here cuts a name or symbol, so nothing
 *   here uses `Intl`.
 * - **Positions.** A field's `set_event` is its log's position among its transaction's log sites, unresolved ones
 *   included (`eventIndex` in the API): `contract-logs` numbers a block's logs and unresolved sites by one count in emission
 *   order, transaction by transaction.
 *
 * The registry of standard-defined keys is empty (no MIP defines any): with keys in it, a `standards` change would
 * change which keys a token keeps, which this path does not do, so it refuses to load with a non-empty registry.
 */

import type { ContractLog, UnresolvedLogSite } from "../../backbone/contract-logs/contract-logs.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { miscAtom, UnknownLogSerialization } from "./log-reader.js";
import { tokenColor } from "./color.js";
import {
  deleteField,
  deleteToken,
  insertToken,
  type Position,
  setField,
  setTokenSymbol,
  type TokenRef,
  tokenHasFields,
} from "./sql.js";
import { COMMON_KEY_HEX, fieldUsable, isDefinedKey, STANDARD_KEYS } from "./rules.js";
import { classifyEvent, type DecodedRecord, splitMiscData, toHex, ValType } from "./codec/index.js";

if (STANDARD_KEYS.size !== 0) {
  throw new Error("token-metadata's write path does not re-flag keys on a standards change; the registry must be empty");
}

/** A log the module cannot read: its block halts, naming where it is. */
export class TokenMetadataLogError extends Error {
  override readonly name = "TokenMetadataLogError";
  constructor(
    readonly height: bigint,
    readonly transaction: number,
    readonly log: number,
    readonly tag: string | null,
    options: { cause: unknown },
  ) {
    super(
      `token-metadata cannot read the Misc log ${log} of transaction ${transaction} at height ${height}: ` +
        (tag === null ? "its data is not a tagged serialization" : `its data has the unknown tag ${tag}`),
      options,
    );
  }
}

/**
 * One candidate of a block, classified: an accepted event (its token and records), or what is not applied and
 * leaves nothing (a rejected event, with the codec's reason, or an unresolved log site, with the provider's).
 */
export type Candidate =
  | { readonly at: Position; readonly contract: Uint8Array; readonly classification: "accept"; readonly domainSep: Uint8Array; readonly kind: number; readonly records: readonly DecodedRecord[] }
  | { readonly at: Position; readonly contract: Uint8Array; readonly classification: "reject" | "unresolved"; readonly reason: string };

/** What reads a `Misc` log's value: {@link miscAtom}, or a negative control's. */
export type LogReader = (data: Uint8Array) => Uint8Array | null;

/**
 * The MIP-0018 candidates of block `height`'s logs and its unresolved log sites, classified, in chain order: logs of
 * other types, other values and other names give none; every unresolved site gives an `unresolved` candidate with the
 * provider's reason (its value is unknown, so it may be a MIP-0018 event; it is never applied). A candidate's position
 * is its place among its transaction's log sites, unresolved ones included, as `contract-logs` numbers them.
 */
export function candidatesOf(
  height: bigint,
  logs: readonly ContractLog[],
  reader: LogReader = miscAtom,
  /** This is only for core-contract-logs-fast */
  unresolved: readonly UnresolvedLogSite[] = [],
): Candidate[] {
  const first = new Map<number, number>();
  for (const site of [...logs, ...unresolved]) first.set(site.transaction, Math.min(first.get(site.transaction) ?? site.index, site.index));
  const positionOf = (transaction: number, index: number) => ({ height, tx: transaction, event: index - first.get(transaction)! });
  const out: Candidate[] = unresolved.map((site) => ({
    at: positionOf(site.transaction, site.index),
    contract: site.address,
    classification: "unresolved" as const,
    reason: site.reason,
  }));
  for (const log of logs) {
    if (log.eventType !== "Misc") continue;
    let atom: Uint8Array | null;
    try {
      atom = reader(log.data);
    } catch (error) {
      if (error instanceof UnknownLogSerialization) {
        throw new TokenMetadataLogError(height, log.transaction, log.index, error.tag, { cause: error });
      }
      throw error;
    }
    if (atom === null) continue;
    const split = splitMiscData(atom);
    if (split === undefined) continue;
    const classified = classifyEvent({ type: "Misc", name: split.name, payload: split.payload });
    if (classified.result === "ignore") continue;
    const at = positionOf(log.transaction, log.index);
    out.push(
      classified.result === "accept"
        ? { at, contract: log.address, classification: "accept", domainSep: classified.header.domainSep, kind: classified.header.kind, records: classified.records }
        : { at, contract: log.address, classification: "reject", reason: classified.reason },
    );
  }
  return out.sort((x, y) => x.at.tx - y.at.tx || x.at.event - y.at.event);
}

/** The symbol key, whose usable value the token's row keeps for its group. */
const SYMBOL_HEX = COMMON_KEY_HEX.symbol;

/** Applies an accepted event's records to its token, in record order. */
async function applyRecords(w: Pick<BlockWriteHandle, "execute" | "query">, token: TokenRef, at: Position, records: readonly DecodedRecord[]): Promise<void> {
  for (const [index, record] of records.entries()) {
    const keyHex = toHex(record.key);
    if (!isDefinedKey(keyHex, [], STANDARD_KEYS)) continue; // not stored (MIP "Keys")
    if (record.valType === ValType.Null) {
      if (!(await deleteField(w, token, record.key))) continue; // a Null for a key without a value changes nothing
      if (!(await tokenHasFields(w, token))) await deleteToken(w, token);
      else if (keyHex === SYMBOL_HEX) await setTokenSymbol(w, token, null);
      continue;
    }
    const usable = fieldUsable(keyHex, record.valType, record.value) ?? null;
    await insertToken(w, token);
    await setField(w, token, at, { key: record.key, valType: record.valType, value: record.value, uint: record.integer ?? null, usable, record: index });
    if (keyHex === SYMBOL_HEX) await setTokenSymbol(w, token, usable === true ? record.value : null);
  }
}

/** Applies block `height`'s accepted events, in chain order; resolves with how many it applied. */
export async function writeTokenMetadata(
  w: Pick<BlockWriteHandle, "execute" | "query">,
  height: bigint,
  logs: readonly ContractLog[],
  reader: LogReader = miscAtom,
  /** This is only for core-contract-logs-fast */
  unresolved: readonly UnresolvedLogSite[] = [],
): Promise<number> {
  let applied = 0;
  for (const c of candidatesOf(height, logs, reader, unresolved)) {
    if (c.classification !== "accept") continue; // rejected, or unreadable: nothing applies and nothing is kept
    const token = { id: tokenColor(c.domainSep, c.contract), kind: c.kind, contract: c.contract, domainSep: c.domainSep };
    await applyRecords(w, token, c.at, c.records);
    applied++;
  }
  return applied;
}
