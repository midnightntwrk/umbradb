/**
 * The tape node's three rules, each a small function of its own, which `./session.ts` and `./node.ts` apply and the
 * negative controls replace. [TT-1 to TT-3]
 */

import type { CallRecord, RecordKind, TapeRecord } from "./records.js";

/** A record of a session, with its line in the tape. */
export interface Entry {
  readonly line: number;
  readonly kind: RecordKind;
  readonly record: TapeRecord;
}

/**
 * The record answering the `occurrence`-th request (counting from 1) of one method and params in a session, from
 * `entries`, the session's call, subscription and fault records of that pair in file order: the `occurrence`-th of
 * them; after the last, the last call record of the pair again (`repeat`). None when the pair has no call record to
 * repeat: a subscription is not repeated (its id would name a second live subscription), and a fault is not an answer.
 * [TT-2]
 */
export function entryFor(
  entries: readonly Entry[],
  occurrence: number,
): { readonly entry: Entry; readonly repeat: boolean } | undefined {
  const entry = entries[occurrence - 1];
  if (entry !== undefined) return { entry, repeat: false };
  const last = entries.findLast((candidate) => candidate.kind === "call");
  return last === undefined ? undefined : { entry: last, repeat: true };
}

/** How long after a call the tape node sends a call record's answer: its `delayMs`, or at once. [TT-1] */
export function answerDelay(record: CallRecord): number {
  return record.delayMs ?? 0;
}

/**
 * Whether the tape node's walk through a session in file order may pass `entry` yet. A call, subscription or fault
 * record is passed once it has been answered (`consumed`; a timeout fault when its call came). A notification is sent,
 * and a disconnect done, when the walk reaches it, so each comes after every record before it. [TT-3]
 */
export function mayPass(entry: Entry, consumed: boolean): boolean {
  return consumed || entry.kind === "notify" || entry.kind === "disconnect";
}
