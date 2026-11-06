/**
 * The write path of `token-metadata`: a block's `contract-logs` become `events` rows, and each accepted event's records
 * are applied to `fields` in chain order. [TM-2 … TM-10, TM-14; design D4, D6, D7]
 *
 * - **Candidates (TM-2, TM-3).** Only a `Misc` log whose value the log reader gives as one atom of at most 288 bytes;
 *   its name and payload are the atom zero-extended to 288 bytes, split 32 + 256 (`splitMiscData`). An unknown
 *   serialization halts the block with an error naming the height, transaction, log and tag.
 * - **Classification (TM-4).** `classifyMip0018Event` (the vendored codec plus the UTF-8 key rule); `ignore` (another
 *   name) stores nothing, `accept` and `reject` store an event row.
 * - **Records (TM-6 … TM-10).** As the proof of concept's `fields.ts`: a non-Null record sets its key's row (latest
 *   wins), a Null record deletes it (nothing for a key without a row); a key is `defined` when it is a common-field key
 *   or a key of a declared standard (`isDefinedKey`); a record after which the identity has no defined row records its
 *   withdrawal. Values are stored whole: nothing here cuts a name or symbol, so nothing here uses `Intl` (TM-14).
 * - **Positions.** `event_index` is the log's position among its transaction's logs (the proof of concept's
 *   `eventIndex`): `contract-logs` numbers a block's logs in emission order, transaction by transaction.
 *
 * The registry of standard-defined keys is empty (no MIP defines any): with keys in it, a `standards` change would
 * re-flag the identity's rows, which this path does not do, so it refuses to load with a non-empty registry.
 */

import type { ContractLog } from "../../backbone/contract-logs/contract-logs.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { classifyMip0018Event } from "./classify.ts";
import { miscAtom, UnknownLogSerialization } from "./log-reader.ts";
import {
  deleteField,
  type EventRow,
  hasDefinedField,
  type IdentityKey,
  insertEvent,
  type Position,
  recordWithdrawal,
  setField,
} from "./sql.ts";
import { fieldUsable, isDefinedKey, STANDARD_KEYS } from "./state.ts";
import { type DecodedRecord, splitMiscData, toHex, ValType } from "./vendor/mip0018/codec/src/index.ts";

if (STANDARD_KEYS.size !== 0) {
  throw new Error("token-metadata's write path does not re-flag keys on a standards change; the registry must be empty");
}

/** The most bytes of a log's entry point an event row keeps. */
export const ENTRY_POINT_KEPT = 128;

/** A log the module cannot read: its block halts, naming where it is. [TM-3] */
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
  readonly row: EventRow;
  readonly records: readonly DecodedRecord[];
}

/** What reads a `Misc` log's value: {@link miscAtom}, or a negative control's. */
export type LogReader = (data: Uint8Array) => Uint8Array | null;

/**
 * The MIP-0018 candidates of block `height`'s logs, classified, in chain order; logs of other types, other values and
 * other names give none.
 */
export function candidatesOf(height: bigint, logs: readonly ContractLog[], reader: LogReader = miscAtom): Candidate[] {
  const out: Candidate[] = [];
  let transaction = -1;
  let first = 0;
  for (const log of logs) {
    if (log.transaction !== transaction) {
      transaction = log.transaction;
      first = log.index;
    }
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
    const at = { height, tx: log.transaction, event: log.index - first };
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
  return out;
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

/** Writes block `height`'s candidates and applies the accepted ones, in chain order. */
export async function writeBlock(
  w: Pick<BlockWriteHandle, "execute" | "query">,
  height: bigint,
  logs: readonly ContractLog[],
  reader: LogReader = miscAtom,
): Promise<number> {
  const candidates = candidatesOf(height, logs, reader);
  for (const { row, records } of candidates) {
    await insertEvent(w, row);
    if (row.classification === "accept") {
      await applyRecords(w, { contract: row.contract, domainSep: row.domainSep!, kind: row.kind! }, row, records);
    }
  }
  return candidates.length;
}
