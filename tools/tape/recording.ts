/**
 * What the recording builder records for one connection (`openspec/changes/core-arch/specs/test-tape/spec.md` TT-4;
 * acceptance A71; task 9.2): the session's records, from the frames the client and the node exchanged on it, placed
 * so that the tape node (`./node.ts`) replays them — no sockets here; `./builder.ts` carries the frames.
 *
 * **Records** (the forms 9.1's note (a) gives): a **call** `{ method, params, result | error }` with the params the
 * client sent (absent: `[]`, as the tape node reads them); a **subscription** `{ subscribe: <the id the node
 * answered>, method, params }` for an answer to one of the head subscriptions (`isSubscribeMethod`, `./frames.ts`);
 * each **notification** `{ notify: id, result }` as it came; and, when the connection ended, each request still
 * waiting for its answer as a **`timeout` fault** `{ fault: "timeout", method, params }` — on replay the tape node then
 * answers nothing and drops the connection once that request comes, and the client sends it again on its next
 * connection, as it did when recorded. A recording holds no delay: `delayAnswers` adds them (`./transforms.ts`).
 *
 * **Order.** Records are written in the order the node's frames came — so a notification is replayed after the
 * answers that came before it, as TT-3 sends it —, with one exception the tape's rule of answers by occurrence (TT-2)
 * needs: the answers to the requests of one method and params are written in the order of those requests. An answer
 * that comes before an earlier request of its pair is answered waits, and is written right after that earlier one's
 * record (or its fault). A notification of a subscription whose answer waits so cannot be placed (`out-of-order`).
 *
 * **Byte for byte.** Each answer and notification from the node must be the very text the tape node will write for
 * its record (`./frames.ts`: the tape's JSON form, the fields in `jsonrpsee`'s order); any other spelling is refused
 * (`not-replayable`) instead of being recorded into a tape whose replay would differ from the session.
 *
 * **Refusals** throw {@link RecordingError} (`cannot-record`) with the frame and the reason: a client frame that is
 * not a request the tape node answers (`bad-request`) or reuses an id still waiting (`duplicate-id`); a node frame
 * that is not a JSON-RPC 2.0 answer or notification (`not-json-rpc`), answers no waiting request
 * (`unknown-answer`), notifies a subscription not made on the connection (`unknown-subscription`) or under another
 * name than the tape node uses (`notification-method`), gives a record the tape cannot hold (`bad-record`), or is
 * spelled otherwise (`not-replayable`).
 */

import { RecordingError, type RecordingProblem, TapeError } from "./errors.js";
import {
  errorFrame,
  isSubscribeMethod,
  notificationFrame,
  notificationMethod,
  readRequest,
  type RequestId,
  resultFrame,
} from "./frames.js";
import { type Json, jsonText, parseJsonText } from "./json.js";
import { checkTape, recordLine, type SubscriptionId, type TapeRecord } from "./records.js";
import { requestKey } from "./session.js";

/** How a connection ended: the node (or its handshake) ended it, the client did, or the builder stopped. */
export type SessionEnd = "node" | "client" | "builder";

/** A node's answer: a result or an error. */
export type Answer = { readonly result: Json } | { readonly error: Json };

interface Request {
  /** Its place among the connection's requests. */
  readonly seq: number;
  readonly id: RequestId;
  readonly method: string;
  readonly params: Json;
  /** Its method and params (`requestKey`). */
  readonly key: string;
  /** Which request of its pair it is, counting from 1. */
  readonly occurrence: number;
}

interface Held {
  readonly seq: number;
  readonly record: TapeRecord;
}

/** The longest part of the tape node's text a message shows. */
const SHOWN = 200;

const brief = (text: string): string => (text.length > SHOWN ? `${text.slice(0, SHOWN)}…` : text);

/** The records of one connection the builder accepted: its session of the tape. */
export class SessionRecording {
  /** The session's place among the builder's, counting from 1. */
  readonly number: number;
  readonly #records: TapeRecord[] = [];
  readonly #pending = new Map<string, Request>();
  readonly #counts = new Map<string, number>();
  readonly #written = new Map<string, number>();
  readonly #held = new Map<string, Map<number, Held>>();
  /**
   * Each subscription id answered on the connection, by its JSON text: its method once its record is written, null
   * while its answer waits for an earlier request of its pair.
   */
  readonly #subscriptions = new Map<string, string | null>();
  #seq = 0;
  #end: SessionEnd | undefined;

  constructor(number: number) {
    this.number = number;
  }

  /** How the connection ended, or undefined while it is open. */
  get end(): SessionEnd | undefined {
    return this.#end;
  }

  /** The session's records so far. */
  get records(): readonly TapeRecord[] {
    return [...this.#records];
  }

  #refuse(from: "client" | "node", reason: RecordingProblem, detail: string, frame: string): never {
    throw new RecordingError(this.number, from, reason, detail, frame);
  }

  /** A frame from the client (`binary`: a binary frame, `text` describing it). */
  fromClient(text: string, binary: boolean): void {
    if (binary) this.#refuse("client", "bad-request", "a request is a text frame", text);
    const request = readRequest(text);
    if (!request.valid) {
      this.#refuse("client", "bad-request", "not a JSON-RPC 2.0 request the tape node answers", text);
    }
    if (request.method === "") this.#refuse("client", "bad-request", "a request's method is not empty", text);
    this.request(request.id, request.method, request.params, text);
  }

  /** A request of the client, waiting for its answer. */
  request(id: RequestId, method: string, params: Json, text: string): void {
    const idText = jsonText(id);
    if (this.#pending.has(idText)) {
      this.#refuse("client", "duplicate-id", `the id ${idText} is already waiting for an answer`, text);
    }
    const key = requestKey(method, params);
    const occurrence = (this.#counts.get(key) ?? 0) + 1;
    this.#counts.set(key, occurrence);
    this.#seq += 1;
    this.#pending.set(idText, { seq: this.#seq, id, method, params, key, occurrence });
  }

  /** A frame from the node (`binary`: a binary frame, `text` describing it). */
  fromNode(text: string, binary: boolean): void {
    const notJsonRpc = (detail: string): never => this.#refuse("node", "not-json-rpc", detail, text);
    if (binary) notJsonRpc("an answer or a notification is a text frame");
    let message: unknown;
    try {
      message = parseJsonText(text);
    } catch {
      notJsonRpc("the frame is not JSON");
    }
    // A JSON value other than null has properties to read; only an object can hold `"jsonrpc": "2.0"`.
    if (message === null || (message as { jsonrpc?: unknown }).jsonrpc !== "2.0") {
      notJsonRpc("the frame is not a JSON-RPC 2.0 object");
    }
    const frame = message as Record<string, Json>;
    if (Object.hasOwn(frame, "id")) {
      const result = Object.hasOwn(frame, "result");
      if (result === Object.hasOwn(frame, "error")) notJsonRpc("an answer holds a result or an error");
      this.answer(frame.id as Json, result ? { result: frame.result as Json } : { error: frame.error as Json }, text);
      return;
    }
    const params = frame.params;
    if (
      typeof frame.method !== "string" ||
      typeof params !== "object" ||
      params === null ||
      !Object.hasOwn(params, "subscription") ||
      !Object.hasOwn(params, "result")
    ) {
      notJsonRpc("the frame is neither an answer nor a subscription's notification");
    }
    const { subscription, result } = params as { subscription: Json; result: Json };
    this.notification(frame.method as string, subscription, result, text);
  }

  /** The node's answer to the request `id`. */
  answer(id: Json, answer: Answer, text: string): void {
    const idText = jsonText(id);
    const request = this.#pending.get(idText);
    if (request === undefined) {
      this.#refuse("node", "unknown-answer", `no request with the id ${idText} is waiting for an answer`, text);
    }
    const { method, params } = request;
    const subscribe = "result" in answer && isSubscribeMethod(method);
    const record: TapeRecord = subscribe
      ? { subscribe: (answer as { result: SubscriptionId }).result, method, params: params as never }
      : { method, params: params as never, ...answer };
    try {
      recordLine(record, this.#records.length + 1);
    } catch (error) {
      const detail = `the record would not be a tape record: ${(error as TapeError).message}`;
      this.#refuse("node", "bad-record", detail, text);
    }
    const subscriptionText = subscribe ? jsonText((record as { subscribe: Json }).subscribe) : "";
    if (subscribe && this.#subscriptions.has(subscriptionText)) {
      this.#refuse("node", "bad-record", `the subscription id ${subscriptionText} is in use on this connection`, text);
    }
    const expected = "result" in answer ? resultFrame(request.id, answer.result) : errorFrame(request.id, answer.error);
    if (text !== expected) {
      this.#refuse("node", "not-replayable", `the tape node would answer it as ${brief(expected)}`, text);
    }
    this.#pending.delete(idText);
    const written = this.#written.get(request.key) ?? 0;
    if (request.occurrence === written + 1) {
      this.#append(record, request.key);
      this.#flush(request.key);
      return;
    }
    const held = this.#held.get(request.key) ?? new Map<number, Held>();
    held.set(request.occurrence, { seq: request.seq, record });
    this.#held.set(request.key, held);
    if (subscribe) this.#subscriptions.set(subscriptionText, null);
  }

  /** A notification from the node. */
  notification(method: string, subscription: Json, result: Json, text: string): void {
    const idText = jsonText(subscription);
    const subscribed = this.#subscriptions.get(idText);
    if (subscribed === undefined) {
      this.#refuse("node", "unknown-subscription", `no subscription of this connection has the id ${idText}`, text);
    }
    if (subscribed === null) {
      this.#refuse(
        "node",
        "out-of-order",
        `the subscription ${idText} was answered before an earlier request of its method and params`,
        text,
      );
    }
    const expectedMethod = notificationMethod(subscribed);
    if (method !== expectedMethod) {
      this.#refuse(
        "node",
        "notification-method",
        `the tape node notifies a ${subscribed} subscription as ${expectedMethod}, not ${method}`,
        text,
      );
    }
    const expected = notificationFrame(method, subscription as SubscriptionId, result);
    if (text !== expected) {
      this.#refuse("node", "not-replayable", `the tape node would send it as ${brief(expected)}`, text);
    }
    this.#append({ notify: subscription as SubscriptionId, result });
  }

  /**
   * The connection ended: each request still waiting for its answer becomes a `timeout` fault, and each answer
   * waiting for one of them is written after it, in the order of the requests.
   */
  close(end: SessionEnd): void {
    if (this.#end !== undefined) return;
    this.#end = end;
    const left: { readonly seq: number; readonly key: string; readonly record: TapeRecord }[] = [];
    for (const request of this.#pending.values()) {
      const record: TapeRecord = { fault: "timeout", method: request.method, params: request.params as never };
      left.push({ seq: request.seq, key: request.key, record });
    }
    for (const [key, held] of this.#held) {
      for (const { seq, record } of held.values()) left.push({ seq, key, record });
    }
    left.sort((a, b) => a.seq - b.seq);
    for (const { key, record } of left) this.#append(record, key);
    this.#pending.clear();
    this.#held.clear();
  }

  /** Writes the answers that waited for the record just written of their pair. */
  #flush(key: string): void {
    const held = this.#held.get(key);
    if (held === undefined) return;
    for (;;) {
      // The record just written of this pair set its count.
      const occurrence = (this.#written.get(key) as number) + 1;
      const next = held.get(occurrence);
      if (next === undefined) return;
      held.delete(occurrence);
      this.#append(next.record, key);
    }
  }

  #append(record: TapeRecord, key?: string): void {
    this.#records.push(record);
    if (key !== undefined) this.#written.set(key, (this.#written.get(key) ?? 0) + 1);
    if ("subscribe" in record) this.#subscriptions.set(jsonText(record.subscribe), record.method);
  }
}

/**
 * The tape of the builder's sessions, in the order it accepted their connections (the tape node serves the k-th
 * connection the k-th session): each session's records, and a `disconnect` after each but the last — and after the
 * last too when the node ended it, so the replay drops that connection as the node did. Checked as a tape.
 */
export function joinSessions(recordings: readonly SessionRecording[]): readonly TapeRecord[] {
  const records: TapeRecord[] = [];
  recordings.forEach((recording, index) => {
    records.push(...recording.records);
    if (index < recordings.length - 1 || recording.end === "node") records.push({ disconnect: true });
  });
  checkTape(records);
  return Object.freeze(records);
}
