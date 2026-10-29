/**
 * The variant transforms: pure functions from a tape's records to a new tape's records, which make rare situations of a
 * recorded session on demand — a subscription that goes quiet, jumps or repeats, a dropped connection, a slow answer, a
 * pruned state, a best-chain switch. Each checks its input as a tape (`checkTape`: `bad-tape-record` at the first bad
 * record), refuses what it cannot do with {@link TransformError} (`bad-transform` and a reason), changes no record it
 * was given (records it leaves alone are the same values in the output), and returns a frozen list checked as a tape
 * again. They compose: the output of one is the input of the next. [TT-4, A71]
 *
 * Lines count from 1 and sessions from 1, as the tape node serves them; a subscription is named by its session and its
 * id, compared as a JSON value (`./select.ts`); a subscription's notifications are counted from 1 in its session.
 *
 * - {@link dropNotifications}: the subscription goes quiet — its notifications from the `from`-th on are removed.
 * - {@link skipNotifications}: the head jumps — `count` of its notifications from the `from`-th are removed.
 * - {@link repeatNotification}: a notification sent again — `times` copies right after the `nth`.
 * - {@link insertDisconnect}: the node drops the connection after a record — `count` `disconnect`s after line `after`
 *   (more than one: an outage, each further connection dropped as it opens), the records after it moved to the next
 *   session, and a `subscribe` record there for each subscription live at the cut, in the order they were made and with
 *   their ids, because the node client makes each live subscription again when it reconnects. Occurrences are counted
 *   per session, so a call the client makes again in the new session needs a record there.
 * - {@link delayAnswers}: a slow answer — `delayMs` set on exactly the selected call records.
 * - {@link replaceWithError}: the selected calls answered with `error` instead.
 * - {@link stateUnavailable}: the selected calls answered as Substrate answers for a state it discarded,
 *   `{ code: 4003, message: "Client error: UnknownBlock: State already discarded for <block>" }`, which the node client
 *   reads as a `node-requirement` error; the block is the call's last parameter, or `block` [IN-9].
 * - {@link spliceNotifications}: a best-chain switch — a range of a subscription's notifications replaced by a range of
 *   another tape's (a fork recorded on a devnet), one for one under the target's id; the source's surplus follows the
 *   last replaced one, the target's surplus is removed. The calls the client makes for the new branch's blocks are not
 *   notifications: they are records of their own, which belong after the notification that makes the client ask (before
 *   it, they would hold that notification back until they are answered).
 */

import { TransformError } from "./errors.js";
import { type Json, jsonText } from "./json.js";
import {
  type CallRecord,
  checkTape,
  MAX_DELAY_MS,
  type NotifyRecord,
  type SubscriptionId,
  type TapeRecord,
} from "./records.js";
import {
  type CallSelection,
  liveSubscriptions,
  notificationLines,
  notificationRange,
  selectedCalls,
} from "./select.js";

export type { CallSelection } from "./select.js";

/** A range of a subscription's notifications in a session: `count` of them from the `from`-th. */
export interface NotificationRange {
  readonly session: number;
  readonly subscription: SubscriptionId;
  readonly from: number;
  readonly count: number;
}

/** The output of a transform: frozen, and checked as a tape. */
function output(records: TapeRecord[]): readonly TapeRecord[] {
  checkTape(records);
  return Object.freeze(records);
}

function positiveCount(count: number, what: string): void {
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new TransformError("bad-argument", `${what} is an integer of at least 1, not ${count}`);
  }
}

/** The records without the lines `removed`. */
function without(records: readonly TapeRecord[], removed: readonly number[]): readonly TapeRecord[] {
  const lines = new Set(removed);
  return output(records.filter((_record, index) => !lines.has(index + 1)));
}

/** Each selected call record replaced by `change(record, line)`. */
function changeCalls(
  records: readonly TapeRecord[],
  select: CallSelection,
  change: (record: CallRecord, line: number) => CallRecord,
): readonly TapeRecord[] {
  checkTape(records);
  const lines = selectedCalls(records, select);
  const changed = (record: TapeRecord, index: number): TapeRecord =>
    lines.has(index + 1) ? change(record as CallRecord, index + 1) : record;
  return output(records.map(changed));
}

/** A call record answered with `error`, its method, params and delay kept. */
function withError(record: CallRecord, error: Json): CallRecord {
  const answered: CallRecord = { method: record.method, params: record.params, error };
  return record.delayMs === undefined ? answered : { ...answered, delayMs: record.delayMs };
}

/** A subscription goes quiet: its notifications in `session` from the `from`-th on are removed. */
export function dropNotifications(
  records: readonly TapeRecord[],
  options: { readonly session: number; readonly subscription: SubscriptionId; readonly from: number },
): readonly TapeRecord[] {
  checkTape(records);
  const { from } = options;
  const total = notificationLines(records, options.session, options.subscription).length;
  // Every notification from the `from`-th on; a `from` the subscription lacks is refused by the range.
  const count = Number.isSafeInteger(from) && from >= 1 ? Math.max(total - from + 1, 1) : 1;
  return without(records, notificationRange(records, { ...options, count }));
}

/** The head jumps: `count` notifications of the subscription in `session` from the `from`-th are removed. */
export function skipNotifications(records: readonly TapeRecord[], range: NotificationRange): readonly TapeRecord[] {
  checkTape(records);
  return without(records, notificationRange(records, range));
}

/** A notification sent again: `times` (1 by default) copies of the subscription's `nth` notification right after it. */
export function repeatNotification(
  records: readonly TapeRecord[],
  options: {
    readonly session: number;
    readonly subscription: SubscriptionId;
    readonly nth: number;
    readonly times?: number;
  },
): readonly TapeRecord[] {
  checkTape(records);
  const times = options.times ?? 1;
  positiveCount(times, "a number of repeats");
  const [line] = notificationRange(records, { ...options, from: options.nth, count: 1 }) as [number];
  const repeated = records[line - 1] as NotifyRecord;
  const copies = Array.from({ length: times }, () => repeated);
  return output([...records.slice(0, line), ...copies, ...records.slice(line)]);
}

/**
 * The node drops the connection after line `after` (0: as the first session opens): `count` (1 by default)
 * `disconnect` records there, then a `subscribe` record for each subscription live at the cut.
 */
export function insertDisconnect(
  records: readonly TapeRecord[],
  options: { readonly after: number; readonly count?: number },
): readonly TapeRecord[] {
  checkTape(records);
  const { after } = options;
  if (!Number.isSafeInteger(after) || after < 0 || after > records.length) {
    const detail = `a disconnect goes after a line from 0 to ${records.length}, not ${after}`;
    throw new TransformError("no-such-line", detail);
  }
  const count = options.count ?? 1;
  positiveCount(count, "a number of disconnects");
  const disconnects: TapeRecord[] = Array.from({ length: count }, () => ({ disconnect: true }));
  const again: TapeRecord[] = liveSubscriptions(records, after).map((record) => ({
    subscribe: record.subscribe,
    method: record.method,
    params: record.params,
  }));
  return output([...records.slice(0, after), ...disconnects, ...again, ...records.slice(after)]);
}

/** A slow answer: `delayMs` (0 to 2^31 − 1) set on exactly the selected call records. */
export function delayAnswers(
  records: readonly TapeRecord[],
  options: { readonly select: CallSelection; readonly delayMs: number },
): readonly TapeRecord[] {
  const { delayMs } = options;
  if (!Number.isSafeInteger(delayMs) || delayMs < 0 || delayMs > MAX_DELAY_MS) {
    throw new TransformError("bad-argument", `delayMs is an integer from 0 to ${MAX_DELAY_MS}, not ${delayMs}`);
  }
  return changeCalls(records, options.select, (record) => ({ ...record, delayMs }));
}

/** The selected calls answered with the JSON-RPC `error` (any JSON value) instead of what was recorded. */
export function replaceWithError(
  records: readonly TapeRecord[],
  options: { readonly select: CallSelection; readonly error: Json },
): readonly TapeRecord[] {
  const { error } = options;
  try {
    // `undefined` too: the tape's JSON form refuses what `JSON.stringify` would leave out.
    jsonText(error);
  } catch {
    throw new TransformError("bad-argument", "the error is not a JSON value");
  }
  return changeCalls(records, options.select, (record) => withError(record, error));
}

/** Substrate's answer for a state it discarded at `block`, which the node client reads as `node-requirement`. */
export function stateUnavailableError(block: string): { readonly code: 4003; readonly message: string } {
  return { code: 4003, message: `Client error: UnknownBlock: State already discarded for ${block}` };
}

/** The selected calls answered "state unavailable" for their block: their last parameter, or `block` when given. */
export function stateUnavailable(
  records: readonly TapeRecord[],
  options: { readonly select: CallSelection; readonly block?: string },
): readonly TapeRecord[] {
  return changeCalls(records, options.select, (record, line) => {
    const last = Array.isArray(record.params) ? record.params.at(-1) : undefined;
    const block = options.block ?? last;
    if (typeof block !== "string") {
      throw new TransformError(
        "no-block-hash",
        `the call at line ${line} names no block as its last parameter; give the block`,
      );
    }
    return withError(record, stateUnavailableError(block));
  });
}

/**
 * A best-chain switch: the `target` range of a subscription's notifications replaced by the `source` range of another
 * tape's, one for one, under the target subscription's id; the source's surplus follows the last replaced
 * notification, and the target's surplus is removed.
 */
export function spliceNotifications(
  records: readonly TapeRecord[],
  options: NotificationRange & { readonly source: NotificationRange & { readonly records: readonly TapeRecord[] } },
): readonly TapeRecord[] {
  checkTape(records);
  const { source } = options;
  checkTape(source.records);
  const targets = notificationRange(records, options);
  const results = notificationRange(source.records, source).map(
    (line) => (source.records[line - 1] as NotifyRecord).result,
  );
  const places = new Map(targets.map((line, index) => [line, index]));
  const out: TapeRecord[] = [];
  records.forEach((record, index) => {
    const place = places.get(index + 1);
    if (place === undefined) {
      out.push(record);
      return;
    }
    const notify = (record as NotifyRecord).notify;
    if (place < results.length) out.push({ notify, result: results[place] as Json });
    if (place === targets.length - 1) {
      for (const result of results.slice(targets.length)) out.push({ notify, result });
    }
  });
  return output(out);
}
