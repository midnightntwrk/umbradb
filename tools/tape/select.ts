/**
 * How the variant transforms (`./transforms.ts`; task 9.2) find the records they change, each a small function of its
 * own, which the transforms apply and the negative controls replace: the call records a selection names, a
 * subscription's notifications in a session, and the subscriptions live at a place in the tape.
 *
 * **Lines** count from 1, as the reader's errors and the tape node's call log count them. **Sessions** count from 1
 * as the tape node serves them: the records up to and including each `disconnect`, then the records after the last
 * (`./session.ts`). **Subscription ids** are compared as JSON values, so the string `"7"` is not the number `7`.
 */

import { TransformError } from "./errors.js";
import { jsonText } from "./json.js";
import {
  type CallRecord,
  type NotifyRecord,
  recordKind,
  type SubscribeRecord,
  type SubscriptionId,
  type TapeRecord,
} from "./records.js";

/** Which call records a transform changes: their lines, or a test on each call record and its line. */
export type CallSelection = readonly number[] | ((record: CallRecord, line: number) => boolean);

/** The lines of the call records `select` names; refuses a line outside the tape or not a call, and nothing. */
export function selectedCalls(records: readonly TapeRecord[], select: CallSelection): ReadonlySet<number> {
  const lines = new Set<number>();
  if (typeof select === "function") {
    records.forEach((record, index) => {
      if (recordKind(record) === "call" && select(record as CallRecord, index + 1)) lines.add(index + 1);
    });
  } else {
    for (const line of select) {
      if (!Number.isSafeInteger(line) || line < 1 || line > records.length) {
        throw new TransformError("no-such-line", `the tape has no line ${line}: it has ${records.length}`);
      }
      const kind = recordKind(records[line - 1] as TapeRecord);
      if (kind !== "call") throw new TransformError("not-a-call", `line ${line} is a ${kind} record, not a call`);
      lines.add(line);
    }
  }
  if (lines.size === 0) throw new TransformError("selects-nothing", "the selection names no call record");
  return lines;
}

/** The number of the session each record is in, from 1 (a `disconnect` is in the session it ends). */
export function sessionsOf(records: readonly TapeRecord[]): readonly number[] {
  let session = 1;
  return records.map((record) => {
    const current = session;
    if (recordKind(record) === "disconnect") session += 1;
    return current;
  });
}

/** How many sessions the tape has: one more than its `disconnect` records. */
function sessionCount(records: readonly TapeRecord[]): number {
  return records.filter((record) => recordKind(record) === "disconnect").length + 1;
}

/**
 * The lines of the notifications of `subscription` in `session`, in file order; refuses a session the tape lacks and
 * a subscription no `subscribe` record of that session holds.
 */
export function notificationLines(
  records: readonly TapeRecord[],
  session: number,
  subscription: SubscriptionId,
): readonly number[] {
  const count = sessionCount(records);
  if (!Number.isSafeInteger(session) || session < 1 || session > count) {
    throw new TransformError("no-such-session", `the tape has no session ${session}: it has ${count}`);
  }
  const id = jsonText(subscription);
  const sessions = sessionsOf(records);
  let subscribed = false;
  const lines: number[] = [];
  records.forEach((record, index) => {
    if (sessions[index] !== session) return;
    const kind = recordKind(record);
    if (kind === "subscribe" && jsonText((record as SubscribeRecord).subscribe) === id) subscribed = true;
    if (kind === "notify" && jsonText((record as NotifyRecord).notify) === id) lines.push(index + 1);
  });
  if (!subscribed) {
    throw new TransformError("no-such-subscription", `no subscribe record of session ${session} has the id ${id}`);
  }
  return lines;
}

/**
 * The lines of the `count` notifications of `subscription` in `session` from its `from`-th (counting from 1); refuses
 * a count below 1 and notifications the subscription does not have.
 */
export function notificationRange(
  records: readonly TapeRecord[],
  range: {
    readonly session: number;
    readonly subscription: SubscriptionId;
    readonly from: number;
    readonly count: number;
  },
): readonly number[] {
  const { session, subscription, from, count } = range;
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new TransformError("bad-argument", `a count of notifications is an integer of at least 1, not ${count}`);
  }
  const lines = notificationLines(records, session, subscription);
  if (!Number.isSafeInteger(from) || from < 1 || from + count - 1 > lines.length) {
    throw new TransformError(
      "no-such-notification",
      `subscription ${jsonText(subscription)} of session ${session} has ${lines.length} notifications, ` +
        `not the ${count} from the ${from}th`,
    );
  }
  return lines.slice(from - 1, from - 1 + count);
}

/**
 * The subscriptions live just after line `after` (0: before the first record): the `subscribe` records of that place's
 * session up to it, in the order they were made. None after a `disconnect`.
 */
export function liveSubscriptions(records: readonly TapeRecord[], after: number): readonly SubscribeRecord[] {
  let live: SubscribeRecord[] = [];
  for (const record of records.slice(0, after)) {
    const kind = recordKind(record);
    if (kind === "disconnect") live = [];
    if (kind === "subscribe") live.push(record as SubscribeRecord);
  }
  return live;
}
