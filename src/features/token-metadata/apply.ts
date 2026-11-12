/**
 * The write path of `token-metadata`: a block's `contract-logs` become `events` rows, and each accepted event's records
 * are applied to `fields` in chain order.
 *
 * - **Candidates.** Only a `Misc` log whose value the log reader gives as one atom of at most 288 bytes;
 *   its name and payload are the atom zero-extended to 288 bytes, split 32 + 256 (`splitMiscData`). An unknown
 *   serialization halts the block with an error naming the height, transaction, log and tag.
 * - **Classification.** `classifyMip0018Event` (the codec plus the UTF-8 key rule); `ignore` (another
 *   name) stores nothing, `accept` and `reject` store an event row.
 * - **Records.** A non-Null record sets its key's row (latest
 *   wins), a Null record deletes it (nothing for a key without a row); a key is `defined` when it is a common-field key
 *   or a key of a declared standard (`isDefinedKey`); a record after which the identity has no defined row records its
 *   withdrawal. Values are stored whole: nothing here cuts a name or symbol, so nothing here uses `Intl`.
 * - **Positions.** `event_index` is the log's position among its transaction's log sites, unresolved ones included
 *   (`eventIndex` in the API): `contract-logs` numbers a block's logs and unresolved sites by one count in emission
 *   order, transaction by transaction.
 *
 * The registry of standard-defined keys is empty (no MIP defines any): with keys in it, a `standards` change would
 * re-flag the identity's rows, which this path does not do, so it refuses to load with a non-empty registry.
 */

import type { ContractLog, UnresolvedLogSite } from "../../backbone/contract-logs/contract-logs.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { classifyMip0018Event } from "./classify.js";
import { miscAtom, UnknownLogSerialization } from "./log-reader.js";
import {
  deleteField,
  type EventRow,
  hasDefinedField,
  type IdentityKey,
  insertEvent,
  type Position,
  recordWithdrawal,
  setField,
} from "./sql.js";
import { fieldUsable, isDefinedKey, STANDARD_KEYS } from "./state.js";
import { type DecodedRecord, splitMiscData, toHex, ValType } from "./codec/index.js";

if (STANDARD_KEYS.size !== 0) {
  throw new Error("token-metadata's write path does not re-flag keys on a standards change; the registry must be empty");
}

/** The most bytes of a log's entry point an event row keeps. */
export const ENTRY_POINT_KEPT = 128;

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

/** One candidate of a block, classified: what its event row holds, and an accepted event's records. */
export interface Candidate {
  /** Its event row but the transaction's hash, which `writeBlock` adds. */
  readonly row: Omit<EventRow, "txHash">;
  readonly records: readonly DecodedRecord[];
}

/** What reads a `Misc` log's value: {@link miscAtom}, or a negative control's. */
export type LogReader = (data: Uint8Array) => Uint8Array | null;

/**
 * The MIP-0018 candidates of block `height`'s logs and its unresolved log sites, classified, in chain order: logs of
 * other types, other values and other names give none; every unresolved site gives an `unresolved` event with the
 * provider's reason (its value is unknown, so it may be a MIP-0018 event; it is never applied). A site's `event_index`
 * is its position among its transaction's log sites, unresolved ones included, as `contract-logs` numbers them.
 */
export function candidatesOf(
  height: bigint,
  logs: readonly ContractLog[],
  reader: LogReader = miscAtom,
  unresolved: readonly UnresolvedLogSite[] = [],
): Candidate[] {
  const first = new Map<number, number>();
  for (const site of [...logs, ...unresolved]) first.set(site.transaction, Math.min(first.get(site.transaction) ?? site.index, site.index));
  const positionOf = (transaction: number, index: number) => ({ height, tx: transaction, event: index - first.get(transaction)! });
  const out: Candidate[] = unresolved.map((site) => ({
    row: {
      ...positionOf(site.transaction, site.index),
      contract: site.address,
      entryPoint: site.entryPoint.slice(0, ENTRY_POINT_KEPT),
      classification: "unresolved",
      reason: site.reason,
      domainSep: null,
      kind: null,
    },
    records: [],
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
    const classified = classifyMip0018Event({ type: "Misc", name: split.name, payload: split.payload });
    if (classified.result === "ignore") continue;
    const at = positionOf(log.transaction, log.index);
    const common = { ...at, contract: log.address, entryPoint: log.entryPoint.slice(0, ENTRY_POINT_KEPT) };
    out.push(
      classified.result === "accept"
        ? {
            row: { ...common, classification: "accept", reason: null, domainSep: classified.header.domainSep, kind: classified.header.kind },
            records: classified.records,
          }
        : { row: { ...common, classification: "reject", reason: classified.reason, domainSep: null, kind: null }, records: [] },
    );
  }
  return out.sort((x, y) => x.row.tx - y.row.tx || x.row.event - y.row.event);
}

/** Applies an accepted event's records to its identity's rows, in record order. */
async function applyRecords(w: Pick<BlockWriteHandle, "execute" | "query">, id: IdentityKey, at: Position, records: readonly DecodedRecord[]): Promise<void> {
  let exists = await hasDefinedField(w, id);
  for (const [index, record] of records.entries()) {
    const keyHex = toHex(record.key);
    if (record.valType === ValType.Null) {
      const deleted = await deleteField(w, id, record.key);
      if (deleted === null) continue; // a Null for a key without a value changes nothing
      if (exists && deleted.defined && !(await hasDefinedField(w, id))) {
        exists = false;
        await recordWithdrawal(w, id, at, index);
      }
      continue;
    }
    const defined = isDefinedKey(keyHex, [], STANDARD_KEYS);
    await setField(w, id, at, {
      key: record.key,
      valType: record.valType,
      value: record.value,
      uint: record.integer ?? null,
      usable: fieldUsable(keyHex, record.valType, record.value) ?? null,
      defined,
      record: index,
    });
    if (defined) exists = true;
  }
}

/** A block's transactions' hashes by their index (`block-parsed`'s). */
export type TransactionHashes = (transaction: number) => Uint8Array | undefined;

/**
 * Writes block `height`'s candidates, each with its transaction's hash from `hashes`, and applies the accepted ones, in
 * chain order. A candidate (or unresolved site) of a transaction `hashes` does not know throws: the providers of `contract-logs` and
 * `block-parsed` disagree on the block.
 */
export async function writeBlock(
  w: Pick<BlockWriteHandle, "execute" | "query">,
  height: bigint,
  logs: readonly ContractLog[],
  hashes: TransactionHashes,
  reader: LogReader = miscAtom,
  unresolved: readonly UnresolvedLogSite[] = [],
): Promise<number> {
  const candidates = candidatesOf(height, logs, reader, unresolved);
  for (const { row: candidate, records } of candidates) {
    const txHash = hashes(candidate.tx);
    if (txHash === undefined) {
      throw new Error(
        `token-metadata: the log of transaction ${candidate.tx} at height ${height} has no transaction of that index in ` +
          "block-parsed: its contract-logs and block-parsed providers disagree",
      );
    }
    const row: EventRow = { ...candidate, txHash };
    await insertEvent(w, row);
    if (row.classification === "accept") {
      await applyRecords(w, { contract: row.contract, domainSep: row.domainSep!, kind: row.kind! }, row, records);
    }
  }
  return candidates.length;
}
