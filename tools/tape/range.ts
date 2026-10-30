/**
 * The recording driver of the real tapes. Through the recording builder (`./builder.ts`), the node client of
 * `src/node/` makes **every allowed node call for every height of a range**, spelled as the node client spells it. So
 * any client making any subset of those calls (the core's sync among them) replays against the one tape. The tape node
 * answers by method and params, so the order of different calls does not matter. [Q123, IN-8, TT-2]
 *
 * **Per height h** of `from`–`to`: `chain_getBlockHash [h]`, then at its hash H:
 * - `chain_getHeader`, `chain_getBlock`;
 * - `state_getRuntimeVersion`: the runtime of h's own state, which is also the runtime h + 1 is decoded with [LG-4];
 * - `state_getStorage [System.Events, H]` [CD-4];
 * - `midnight_ledgerStateRoot` [LG-15].
 *
 * **Metadata** (`state_getMetadata`) is read at the range's first block and wherever the state's runtime changes (the
 * first block of each runtime's state: an upgrade's U), not at every height. A runtime's metadata is about 200 KB, the
 * same bytes at every block of the runtime; at every height it would make a 10,000-block tape about 2 GB instead of
 * about 40 MB. [Q135]
 *
 * **Block 0**, when the range holds it: `system_properties` (its `genesis_state`), and the cNight registrations. Those
 * are every page of `state_getKeysPaged` under `CNightObservation.Mappings` (runtimes 0.22 and 1.0) and
 * `CNightObservation.Mapping` (2.x), {@link KEYS_PAGE} keys a page, the next page starting after the last key, then
 * each key's value (`state_getStorage [key, H0]`). [IN-7]
 *
 * **The live window**, last: both head subscriptions, the finalized head (`chain_getFinalizedHead`) with its header,
 * then `liveWindowMs` of notifications. On replay those notifications come only after every record before them is
 * answered, so a client replaying a part of the range gets quiet subscriptions and the head as the node reported it at
 * recording time. [TT-3]
 *
 * **One session.** A tape node serves a connection one session, so the tape is one: the range is recorded in chunks of
 * `chunkHeights` heights, each on a builder and a connection of its own, with every call made once and without the
 * client's retries (`retry: false`). A chunk whose connection drops, whose call fails or times out, or whose node
 * answers an error (its rate limit, −32999, among them) is recorded again from its start after a back-off —
 * `backoffMs`, doubling, up to `backoffCeilingMs` — up to `attempts` times; the chunks' records, each one session of
 * calls only, are joined into one session, the live window's last. Nothing is retried that cannot change: a block the
 * node does not have (`node-requirement`), a chain that does not link, a frame the builder cannot record. [TT-3]
 *
 * **Gentle with the node:** one connection at a time, at most `concurrency` requests in flight on it, each request
 * counted; the rate is reported (`stats`), and the waits are the back-offs only.
 */

import { UmbraError } from "../../src/db/errors.js";
import {
  type ConnectSocket,
  connectWebSocket,
  type HeadSubscriber,
  NodeClient,
  type NodeSubscription,
} from "../../src/node/index.js";
import { toHex } from "../../src/node/decode.js";
import { isWebSocketUrl, TapeBuilder } from "./builder.js";
import { RecordingError } from "./errors.js";
import { checkTape, type TapeRecord } from "./records.js";
import { errorText } from "./replay-check.js";
import { storagePrefix } from "./twox.js";

/** `System.Events`: the block's runtime events. [CD-4] */
export const EVENTS_KEY = toHex(storagePrefix("System", "Events"));

/** Block 0's cNight registrations: `CNightObservation.Mappings` (runtimes 0.22, 1.0), `.Mapping` (2.x). [IN-7] */
export const REGISTRATION_PREFIXES: readonly string[] = Object.freeze([
  toHex(storagePrefix("CNightObservation", "Mappings")),
  toHex(storagePrefix("CNightObservation", "Mapping")),
]);

/** The keys a `state_getKeysPaged` page asks for: Substrate's most. */
export const KEYS_PAGE = 1000;

export const DEFAULT_CONCURRENCY = 8;
export const DEFAULT_CHUNK_HEIGHTS = 500;
export const DEFAULT_LIVE_WINDOW_MS = 60_000;
export const DEFAULT_ATTEMPTS = 8;
export const DEFAULT_BACKOFF_MS = 5_000;
export const DEFAULT_BACKOFF_CEILING_MS = 120_000;

export interface RangeOptions {
  /** The node's WebSocket URL (`ws://` or `wss://`); never shown. */
  readonly node: string;
  /** The range's first and last heights, inclusive. */
  readonly from: number;
  readonly to: number;
  /** Requests in flight at most; {@link DEFAULT_CONCURRENCY}. */
  readonly concurrency?: number;
  /** Heights a chunk (a connection) records; {@link DEFAULT_CHUNK_HEIGHTS}. */
  readonly chunkHeights?: number;
  /** How long the live window listens to the head subscriptions; {@link DEFAULT_LIVE_WINDOW_MS}. */
  readonly liveWindowMs?: number;
  /** A `state_getKeysPaged` page's size; {@link KEYS_PAGE}. */
  readonly keysPage?: number;
  /** Tries of a chunk (and of the live window) before giving up; {@link DEFAULT_ATTEMPTS}. */
  readonly attempts?: number;
  /** The first back-off, doubled after each failure of the same chunk; {@link DEFAULT_BACKOFF_MS}. */
  readonly backoffMs?: number;
  readonly backoffCeilingMs?: number;
  /** A call's timeout (the node client's `callTimeoutMs`); the client's default, 30 s. */
  readonly callTimeoutMs?: number;
  /** Opens the client's connections; `ws` by default. */
  readonly connect?: ConnectSocket;
  /** Waits between attempts; a timer by default. */
  readonly sleep?: (ms: number) => Promise<void>;
  /** Receives a line per chunk, per retry and for the live window. */
  readonly log?: (line: string) => void;
}

export interface RangeStats {
  /** Requests sent to the node, every attempt counted. */
  readonly requests: number;
  readonly chunks: number;
  /** Chunks (or live windows) recorded again. */
  readonly retries: number;
  readonly elapsedMs: number;
  /** Time spent in back-offs. */
  readonly waitedMs: number;
  /** `requests` over the whole recording's time, back-offs included. */
  readonly requestsPerSecond: number;
  readonly concurrency: number;
  /** The state's runtime from each height where it changes (the first: the range's first block). */
  readonly runtimes: readonly { readonly height: number; readonly specVersion: number }[];
  /** The heights whose state's metadata is on the tape. */
  readonly metadataHeights: readonly number[];
}

export interface RangeRecording {
  readonly records: readonly TapeRecord[];
  readonly stats: RangeStats;
}

/** A failure that recording again cannot change: given up at once. */
class Final extends Error {}

const isHeight = (value: number): boolean => Number.isSafeInteger(value) && value >= 0;
const isPositive = (value: number): boolean => Number.isSafeInteger(value) && value >= 1;

function checkOptions(options: RangeOptions): void {
  const problems: [boolean, string][] = [
    [isWebSocketUrl(options.node), "the node must be a ws:// or wss:// URL"],
    [isHeight(options.from), "from must be a height (a safe integer from 0)"],
    [isHeight(options.to), "to must be a height (a safe integer from 0)"],
    [!(options.from > options.to), `from (${options.from}) is above to (${options.to})`],
    [isPositive(options.concurrency ?? 1), "concurrency must be a positive integer"],
    [isPositive(options.chunkHeights ?? 1), "chunkHeights must be a positive integer"],
    [isPositive(options.attempts ?? 1), "attempts must be a positive integer"],
    [isKeysPage(options.keysPage ?? KEYS_PAGE), "keysPage must be an integer from 1 to 1000"],
  ];
  for (const name of ["liveWindowMs", "backoffMs", "backoffCeilingMs"] as const) {
    problems.push([isHeight(options[name] ?? 0), `${name} must be an integer from 0`]);
  }
  const problem = problems.find(([ok]) => !ok);
  if (problem !== undefined) throw new TypeError(problem[1]);
}

/** Whether `value` is a page size Substrate answers: 1 to {@link KEYS_PAGE}. */
export function isKeysPage(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1 && value <= KEYS_PAGE;
}

/**
 * A gate that lets at most `size` calls run at once, in the order they asked: a call that ends hands its place to the
 * first waiting one, so no newcomer takes it in between.
 */
export function limiter(size: number): <T>(run: () => Promise<T>) => Promise<T> {
  let running = 0;
  const waiting: (() => void)[] = [];
  return async (run) => {
    if (running < size) running += 1;
    else await new Promise<void>((resolve) => waiting.push(resolve));
    try {
      return await run();
    } finally {
      const next = waiting.shift();
      if (next === undefined) running -= 1;
      else next();
    }
  };
}

const ONCE = { retry: false } as const;

/** A recorded session that is not one session of answers: a reason to record it again. */
function sessionProblem(records: readonly TapeRecord[]): string | undefined {
  for (const record of records) {
    if ("disconnect" in record) return "the connection ended before the chunk was done";
    if ("fault" in record) return `a ${record.method} call had no answer when the connection ended`;
    if ("error" in record) return `${record.method} answered an error: ${JSON.stringify(record.error)}`;
  }
  return undefined;
}

interface Height {
  readonly height: number;
  readonly hash: Uint8Array;
  readonly parent: Uint8Array;
  readonly specVersion: number;
}

const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i]);

/** Records `from`–`to` (see the module comment). */
export async function recordRange(options: RangeOptions): Promise<RangeRecording> {
  checkOptions(options);
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const chunkHeights = options.chunkHeights ?? DEFAULT_CHUNK_HEIGHTS;
  const attempts = options.attempts ?? DEFAULT_ATTEMPTS;
  const keysPage = options.keysPage ?? KEYS_PAGE;
  const backoffMs = options.backoffMs ?? DEFAULT_BACKOFF_MS;
  const ceilingMs = options.backoffCeilingMs ?? DEFAULT_BACKOFF_CEILING_MS;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const log = options.log ?? (() => undefined);
  const connect = options.connect ?? connectWebSocket;
  const started = performance.now();
  let requests = 0;
  let retries = 0;
  let waitedMs = 0;
  const runtimes: { height: number; specVersion: number }[] = [];
  const metadataHeights: number[] = [];

  /** One connection through a new builder; `body` makes the calls, through `call`, counted and limited. */
  async function session<T>(
    body: (client: NodeClient, call: <R>(run: () => Promise<R>) => Promise<R>) => Promise<T>,
  ): Promise<{ readonly value: T; readonly records: readonly TapeRecord[] }> {
    const builder = await TapeBuilder.start({ node: options.node });
    const client = new NodeClient({
      url: builder.url,
      connect,
      ...(options.callTimeoutMs === undefined ? {} : { callTimeoutMs: options.callTimeoutMs }),
    });
    const gate = limiter(concurrency);
    const call = <R>(run: () => Promise<R>): Promise<R> =>
      gate(() => {
        requests += 1;
        return run();
      });
    let value: T;
    try {
      // A recording the builder voided ends the session at once: the client would otherwise wait for a connection
      // the builder no longer accepts.
      const voided = builder.failed.then((error): never => {
        throw error;
      });
      value = await Promise.race([body(client, call), voided]);
    } catch (error) {
      await client.close();
      // A frame the builder could not record is the cause of whatever the client then saw.
      const failure = builder.failure;
      await builder.stop().catch(() => undefined);
      throw failure ?? error;
    }
    await client.close();
    const records = await builder.stop();
    const problem = sessionProblem(records);
    if (problem !== undefined) throw new Error(problem);
    return { value, records };
  }

  /** Runs `record` until it succeeds, backing off between tries; gives up after `attempts` or at a final failure. */
  async function attempt<T>(label: string, record: () => Promise<T>): Promise<T> {
    for (let tries = 1; ; tries++) {
      try {
        return await record();
      } catch (error) {
        const text = errorText(error);
        const final =
          error instanceof Final ||
          error instanceof RecordingError ||
          (error instanceof UmbraError && error.code === "node-requirement");
        if (final) throw new Error(`${label}: ${text}`, { cause: error });
        if (tries >= attempts) throw new Error(`${label}: gave up after ${tries} attempts: ${text}`, { cause: error });
        const delay = Math.min(backoffMs * 2 ** (tries - 1), ceilingMs);
        log(`${label}: attempt ${tries} failed: ${text}; again in ${delay / 1000} s`);
        retries += 1;
        waitedMs += delay;
        await sleep(delay);
      }
    }
  }

  const records: TapeRecord[] = [];
  let previous: Height | undefined;
  let chunks = 0;
  for (let first = options.from; first <= options.to; first += chunkHeights) {
    const last = Math.min(options.to, first + chunkHeights - 1);
    const label = `heights ${first}–${last}`;
    const before = requests;
    const at = performance.now();
    const chunk = await attempt(label, () =>
      session(async (client, call) => {
        const heights = await recordHeights(client, call, first, last, previous, concurrency);
        const metadata: number[] = [];
        for (const height of heights) {
          const before = height.height === first ? previous : heights[height.height - first - 1];
          if (height.height === options.from || before === undefined || before.specVersion !== height.specVersion) {
            metadata.push(height.height);
            await call(() => client.metadata(height.hash, ONCE));
          }
        }
        if (first === 0) await recordBlockZero(client, call, (heights[0] as Height).hash, keysPage);
        return { heights, metadata };
      }),
    );
    for (const height of chunk.value.metadata) {
      metadataHeights.push(height);
      const specVersion = (chunk.value.heights[height - first] as Height).specVersion;
      runtimes.push({ height, specVersion });
    }
    previous = chunk.value.heights.at(-1);
    records.push(...chunk.records);
    chunks += 1;
    const seconds = (performance.now() - at) / 1000;
    log(
      `${label}: ${chunk.records.length} records, ${requests - before} requests in ${seconds.toFixed(1)} s ` +
        `(${((requests - before) / Math.max(seconds, 0.001)).toFixed(1)} requests/s)`,
    );
  }

  const live = await attempt("live window", () =>
    session(async (client, call) => {
      const counts = new Map<string, number>();
      const subscriptions: NodeSubscription[] = [];
      const listen = (method: string): HeadSubscriber => ({
        header: () => counts.set(method, (counts.get(method) ?? 0) + 1),
      });
      subscriptions.push(await call(() => client.subscribeNewHeads(listen("chain_subscribeNewHeads"))));
      subscriptions.push(await call(() => client.subscribeFinalizedHeads(listen("chain_subscribeFinalizedHeads"))));
      const head = await call(() => client.finalizedHead(ONCE));
      await call(() => client.header(head, ONCE));
      await new Promise<void>((resolve) => setTimeout(resolve, options.liveWindowMs ?? DEFAULT_LIVE_WINDOW_MS));
      for (const subscription of subscriptions) subscription.cancel();
      for (const method of ["chain_subscribeNewHeads", "chain_subscribeFinalizedHeads"]) {
        if ((counts.get(method) ?? 0) === 0) throw new Error(`no notification of ${method} came in the live window`);
      }
      return counts;
    }),
  );
  records.push(...live.records);
  log(
    `live window: ${live.records.length} records (${live.value.get("chain_subscribeNewHeads")} new heads, ` +
      `${live.value.get("chain_subscribeFinalizedHeads")} finalized heads)`,
  );
  checkTape(records);
  const elapsedMs = performance.now() - started;
  return {
    records: Object.freeze(records),
    stats: Object.freeze({
      requests,
      chunks,
      retries,
      elapsedMs,
      waitedMs,
      requestsPerSecond: requests / Math.max(elapsedMs / 1000, 0.001),
      concurrency,
      runtimes: Object.freeze(runtimes),
      metadataHeights: Object.freeze(metadataHeights),
    }),
  };
}

/** Every height's calls of `first`–`last`, `concurrency` heights at a time; the heights in order. */
async function recordHeights(
  client: NodeClient,
  call: <R>(run: () => Promise<R>) => Promise<R>,
  first: number,
  last: number,
  previous: Height | undefined,
  concurrency: number,
): Promise<Height[]> {
  const events = Buffer.from(EVENTS_KEY.slice(2), "hex");
  const heights: Height[] = [];
  let next = first;
  let failed: unknown;
  const worker = async (): Promise<void> => {
    while (failed === undefined && next <= last) {
      const height = next;
      next += 1;
      try {
        const hash = await call(() => client.blockHash(BigInt(height), ONCE));
        const [header, , version] = await Promise.all([
          call(() => client.header(hash, ONCE)),
          call(() => client.block(hash, ONCE)),
          call(() => client.runtimeVersion(hash, ONCE)),
          call(() => client.storage(events, hash, ONCE)),
          call(() => client.ledgerStateRoot(hash, ONCE)),
        ]);
        if (header.number !== BigInt(height)) {
          throw new Final(`the header of block ${height} has the number ${header.number}`);
        }
        heights[height - first] = { height, hash, parent: header.parentHash, specVersion: version.specVersion };
      } catch (error) {
        failed ??= error;
      }
    }
  };
  // Twice as many heights as the gate lets requests through, so that while some wait for their block hash others'
  // five calls keep the gate full; the gate alone bounds what is in flight.
  await Promise.all(Array.from({ length: Math.min(2 * concurrency, last - first + 1) }, worker));
  if (failed !== undefined) throw failed;
  for (const height of heights) {
    const before = height.height === first ? previous : heights[height.height - first - 1];
    if (before !== undefined && !sameBytes(before.hash, height.parent)) {
      throw new Final(
        `block ${height.height}'s parent hash is not the hash of block ${height.height - 1}: the node's chain does not link`,
      );
    }
  }
  return heights;
}

/** Block 0's calls: `system_properties`; every page of each registration prefix, and each key's value. [IN-7] */
async function recordBlockZero(
  client: NodeClient,
  call: <R>(run: () => Promise<R>) => Promise<R>,
  hash: Uint8Array,
  page: number,
): Promise<void> {
  await call(() => client.systemProperties(ONCE));
  for (const prefix of REGISTRATION_PREFIXES) {
    const bytes = Buffer.from(prefix.slice(2), "hex");
    let start: Uint8Array | null = null;
    for (;;) {
      const after = start;
      const keys = await call(() => client.storageKeys(bytes, page, after, hash, ONCE));
      await Promise.all(keys.map((key) => call(() => client.storage(key, hash, ONCE))));
      if (keys.length < page) break;
      start = keys.at(-1) as Uint8Array;
    }
  }
}
