/**
 * A tape's sessions and the state of one being served (`openspec/changes/core-arch/specs/test-tape/spec.md` TT-2,
 * TT-3; task 9.1).
 *
 * **Sessions.** A tape's records up to and including each `disconnect` form a session, and the records after the last
 * one the last session (empty when the tape ends with a `disconnect`): "the records after it belong to the next
 * session". The tape node serves the k-th connection it accepts the k-th session, and a connection beyond the last an
 * empty one (`./node.ts`).
 *
 * **Answers by occurrence** ({@link Session.take}): each session counts the requests of each method and params pair
 * from 1 — parameters compared as JSON values ({@link requestKey}) — and the k-th takes the k-th record of the pair
 * (`./rules.ts`, `entryFor`). The counts are the session's own: a pair recorded in another session is not on this one.
 *
 * **File order** ({@link Session.advance}): one walk through the session, in file order, passes each call,
 * subscription and fault record once it has been answered and acts on each notification and disconnect as it reaches
 * it (`./rules.ts`, `mayPass`), so a notification is sent once every record before it is done, and the disconnect
 * last.
 */

import { type Json, jsonText, sortedJsonText } from "./json.js";
import { recordKind, type SubscribeRecord, type TapeRecord } from "./records.js";
import { type Entry, entryFor, mayPass } from "./rules.js";

/** A session of a tape: fixed, and shared by every connection served it. */
export interface SessionPlan {
  /** Its place among the tape's sessions, counting from 1. */
  readonly number: number;
  readonly entries: readonly Entry[];
  /** The call, subscription and fault records of each method and params pair ({@link requestKey}), in file order. */
  readonly byKey: ReadonlyMap<string, readonly Entry[]>;
  /** The method of each subscription, by the JSON text of its id. */
  readonly subscriptions: ReadonlyMap<string, string>;
}

/** The key of a request: its method and its parameters as a JSON value (object keys in any order, 2.0 equal to 2). */
export function requestKey(method: string, params: Json): string {
  return sortedJsonText([method, params]);
}

function plan(number: number, entries: readonly Entry[]): SessionPlan {
  const byKey = new Map<string, Entry[]>();
  const subscriptions = new Map<string, string>();
  for (const entry of entries) {
    if (entry.kind === "notify" || entry.kind === "disconnect") continue;
    const record = entry.record as { readonly method: string; readonly params: Json };
    const key = requestKey(record.method, record.params);
    byKey.set(key, [...(byKey.get(key) ?? []), entry]);
    if (entry.kind !== "subscribe") continue;
    subscriptions.set(jsonText((entry.record as SubscribeRecord).subscribe), record.method);
  }
  return Object.freeze({ number, entries: Object.freeze([...entries]), byKey, subscriptions });
}

/** A session with no records: every request is `not-on-tape`. */
export function emptySession(number: number): SessionPlan {
  return plan(number, []);
}

/** The sessions of a tape whose records were checked (`checkTape`, `./records.ts`), each record with its line. */
export function planSessions(records: readonly TapeRecord[]): readonly SessionPlan[] {
  const plans: SessionPlan[] = [];
  let entries: Entry[] = [];
  records.forEach((record, index) => {
    const kind = recordKind(record);
    entries.push({ line: index + 1, kind, record });
    if (kind !== "disconnect") return;
    plans.push(plan(plans.length + 1, entries));
    entries = [];
  });
  plans.push(plan(plans.length + 1, entries));
  return Object.freeze(plans);
}

/** What answers a request: its occurrence for its pair, and the record that answers it (none: `not-on-tape`). */
export interface Taken {
  readonly occurrence: number;
  readonly entry: Entry | undefined;
  /** The record answered an earlier occurrence already: the last call record, repeated. */
  readonly repeat: boolean;
}

/** One connection's progress through its session. */
export class Session {
  readonly plan: SessionPlan;
  readonly #counts = new Map<string, number>();
  readonly #consumed = new Set<Entry>();
  #next = 0;

  constructor(plan: SessionPlan) {
    this.plan = plan;
  }

  /** Counts the request `method(params)` and finds the record answering it. */
  take(method: string, params: Json): Taken {
    const key = requestKey(method, params);
    const occurrence = (this.#counts.get(key) ?? 0) + 1;
    this.#counts.set(key, occurrence);
    const found = entryFor(this.plan.byKey.get(key) ?? [], occurrence);
    return { occurrence, entry: found?.entry, repeat: found?.repeat ?? false };
  }

  /** Marks a record answered. */
  consume(entry: Entry): void {
    this.#consumed.add(entry);
  }

  /** Walks on in file order as far as it may, returning the notifications and the disconnect it reached, in order. */
  advance(): Entry[] {
    const reached: Entry[] = [];
    for (;;) {
      const entry = this.plan.entries[this.#next];
      if (entry === undefined || !mayPass(entry, this.#consumed.has(entry))) return reached;
      this.#next += 1;
      if (entry.kind === "notify" || entry.kind === "disconnect") reached.push(entry);
    }
  }
}
