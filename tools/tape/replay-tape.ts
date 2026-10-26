/**
 * The replay of a whole tape through the node client (task 0.3's acceptance, "each tape replays against the tape
 * node"): `src/node/`'s `NodeClient` sends every call record's call as recorded — so each recorded spelling is one the
 * client sends unchanged — to a tape node serving the tape (or to `url`), and must receive the record's answer (for an
 * error record, that error's code and message); then it makes both head subscriptions and must receive every recorded
 * notification of each, in order. Against a tape node, every request must have been answered from its record: none
 * `not-on-tape`, `repeated` or a fault. Each difference is a sentence naming the record's line.
 */

import { UmbraError } from "../../src/db/errors.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { isNodeCallMethod } from "../../src/node/methods.js";
import { notificationMethod } from "./frames.js";
import { type Json, jsonText, parseJsonText } from "./json.js";
import { TapeNode, type TapeOutcome } from "./node.js";
import type { TapeRecord } from "./records.js";
import { errorText } from "./replay-check.js";

export interface ReplayTapeOptions {
  readonly records: readonly TapeRecord[];
  /** Replays against this node instead of a tape node serving `records` (a check of the check). */
  readonly url?: string;
  /** Calls in flight at most; 32 by default. */
  readonly concurrency?: number;
  readonly connect?: ConnectSocket;
  /** How long to wait for the recorded notifications once subscribed; 30 s by default. */
  readonly notificationTimeoutMs?: number;
}

export interface TapeReplay {
  /** Call records replayed. */
  readonly calls: number;
  readonly subscriptions: number;
  /** Notifications received. */
  readonly notifications: number;
  /** Every difference, in the tape's line order; none when the tape replays. */
  readonly differences: readonly string[];
  /** What the tape node did with the requests, counted by outcome (empty against another node). */
  readonly outcomes: Readonly<Partial<Record<TapeOutcome, number>>>;
}

const SHOWN = 120;
const shown = (value: unknown): string => {
  const text = jsonText(value);
  return text.length > SHOWN ? `${text.slice(0, SHOWN)}…` : text;
};

/** Replays `options.records` (see the module comment). */
export async function replayTape(options: ReplayTapeOptions): Promise<TapeReplay> {
  const tapeNode = options.url === undefined ? await TapeNode.start({ records: options.records }) : undefined;
  const url = options.url ?? (tapeNode as TapeNode).url;
  const received: { method: string; result: Json }[] = [];
  const base = options.connect ?? connectWebSocket;
  const connect: ConnectSocket = (target, events, timers) =>
    base(
      target,
      {
        ...events,
        message: (text) => {
          const frame = parseJsonText(text) as { method?: string; params?: { result: Json } };
          if (typeof frame.method === "string" && frame.params !== undefined) {
            received.push({ method: frame.method, result: frame.params.result });
          }
          events.message(text);
        },
      },
      timers,
    );
  const client = new NodeClient({ url, connect });
  const differences: { line: number; text: string }[] = [];
  let calls = 0;
  try {
    const concurrency = options.concurrency ?? 32;
    const queue = options.records.flatMap((record, index) =>
      "method" in record && !("subscribe" in record) && !("fault" in record) ? [{ record, line: index + 1 }] : [],
    );
    let next = 0;
    const worker = async (): Promise<void> => {
      while (next < queue.length) {
        const { record, line } = queue[next] as (typeof queue)[number];
        next += 1;
        calls += 1;
        const where = `line ${line}: ${record.method} ${shown(record.params)}`;
        if (!isNodeCallMethod(record.method)) {
          differences.push({ line, text: `${where} is not a call the node client makes (IN-8)` });
          continue;
        }
        try {
          const result = await client.call(record.method, record.params as unknown[], { retry: false });
          if (!("result" in record)) {
            differences.push({ line, text: `${where} answered ${shown(result)}, where the tape records the error ${shown(record.error)}` });
          } else if (jsonText(result) !== jsonText(record.result)) {
            differences.push({ line, text: `${where} answered ${shown(result)}, where the tape records ${shown(record.result)}` });
          }
        } catch (error) {
          const details = error instanceof UmbraError ? (error.details as { rpcCode?: number; rpcMessage?: string }) : {};
          const expected = "error" in record ? (record.error as { code?: number; message?: string }) : undefined;
          if (expected === undefined || details.rpcCode !== expected.code || details.rpcMessage !== expected.message) {
            differences.push({ line, text: `${where} failed: ${errorText(error)}, where the tape records ${"error" in record ? `the error ${shown(record.error)}` : shown(record.result)}` });
          }
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(queue.length, 1)) }, worker));

    // Then the subscriptions, in the order the tape makes them, and their notifications.
    const expected = new Map<string, Json[]>();
    const methods: string[] = [];
    const byId = new Map<string, string>();
    for (const record of options.records) {
      if ("subscribe" in record) {
        methods.push(record.method);
        byId.set(jsonText(record.subscribe), record.method);
        expected.set(record.method, expected.get(record.method) ?? []);
      } else if ("notify" in record) {
        const method = byId.get(jsonText(record.notify)) as string;
        (expected.get(method) as Json[]).push(record.result);
      }
    }
    const total = [...expected.values()].reduce((sum, list) => sum + list.length, 0);
    for (const method of methods) {
      const quiet = { header: () => undefined };
      if (method === "chain_subscribeNewHeads") await client.subscribeNewHeads(quiet);
      else await client.subscribeFinalizedHeads(quiet);
    }
    const timeoutMs = options.notificationTimeoutMs ?? 30_000;
    const deadline = performance.now() + timeoutMs;
    while (received.length < total && performance.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 10));
    for (const [method, results] of expected) {
      const name = notificationMethod(method);
      const got = received.filter((frame) => frame.method === name).map((frame) => frame.result);
      results.forEach((result, index) => {
        if (index < got.length && jsonText(got[index]) !== jsonText(result)) {
          differences.push({
            line: Number.MAX_SAFE_INTEGER,
            text: `${method}'s notification ${index + 1} was ${shown(got[index])}, where the tape records ${shown(result)}`,
          });
        }
      });
    }
    if (received.length < total) {
      differences.push({
        line: Number.MAX_SAFE_INTEGER,
        text: `notifications: received ${received.length} of the ${total} recorded within ${timeoutMs} ms`,
      });
    }
    const outcomes: Partial<Record<TapeOutcome, number>> = {};
    for (const call of tapeNode?.calls ?? []) outcomes[call.outcome] = (outcomes[call.outcome] ?? 0) + 1;
    for (const [outcome, count] of Object.entries(outcomes)) {
      if (outcome !== "answered" && outcome !== "subscribed") {
        differences.push({ line: Number.MAX_SAFE_INTEGER, text: `the tape node answered ${count} requests ${outcome}` });
      }
    }
    differences.sort((a, b) => a.line - b.line);
    return {
      calls,
      subscriptions: methods.length,
      notifications: received.length,
      differences: differences.map((difference) => difference.text),
      outcomes,
    };
  } finally {
    await client.close();
    await tapeNode?.close();
  }
}
