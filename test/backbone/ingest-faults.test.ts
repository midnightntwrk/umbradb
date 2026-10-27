import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { NodeBlockSource } from "../../src/backbone/core-block-fetch/index.js";
import { UmbraError } from "../../src/db/errors.js";
import { DEFAULT_CALL_TIMEOUT_MS, NodeClient, type NodeClientOptions } from "../../src/node/client.js";
import { type NodeTimers, SYSTEM_TIMERS } from "../../src/node/socket.js";
import { connectWebSocket } from "../../src/node/ws-socket.js";
import type { ProcessCondition, ProcessStatus } from "../../src/runner/process.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { eventsRead, RUNTIME_2_0, SYSTEM_EVENTS_STORAGE } from "./events-fixtures.js";
import {
  type ChainBlock,
  chainOf,
  content,
  finalized,
  finalizedHead,
  headRead,
  newHead,
  opening,
  RUNTIME,
  subscriptions,
} from "./fetch-fixtures.js";
import { committed, halted, type Ingest, ingest, PATIENCE_MS } from "./ingest-harness.js";

/**
 * The node's errors through the real process and the node source (task 10.4; IN-9, IN-10; A84, A85's node clauses), on
 * PostgreSQL 18 and PGlite 0.5.10, against a tape node serving synthetic tapes in the node's answer shapes:
 *
 * - A84 (IN-9): a "state unavailable" answer — Substrate's `State already discarded`, a pruned node's — for a finalized
 *   height halts processing with `node-requirement` and that height, the call asked once (the tape node's call log):
 *   for the height's events (`state_getStorage` of `System::Events`, `core-chain-events`), for the state its runtime is
 *   read at (`state_getRuntimeVersion` at the parent, `core-block-fetch`), and for a block the node does not have
 *   (`chain_getBlockHash` answering `null`); with the committed negative control, a client that asks again.
 * - A85 (IN-10): the node's connection dropped for 2 minutes — the tape's sessions dropped one after another as they
 *   open — makes the process retry with the node client's back-off reaching `backoffCeilingMs` (30 s, the default) and
 *   report `node-retrying` (the client's retries, which the process logs and shows), then go on with no height skipped
 *   or repeated; the two minutes are on the client's clock, which runs 100 times faster here ({@link FAST}), so the
 *   test waits about 1.2 s; with the committed negative control, a process whose client does not report its retries.
 *   During startup the same retries show `node-retrying` at no height. An error on a queued best block drops it
 *   without a retry, the block fetched again at finality.
 */

/** Substrate's answer for a state the node pruned (`substrate/client/db/src/lib.rs`, the node client's `rpcFailure`). */
const discarded = (block: ChainBlock) => ({ code: 4003, message: `Client error: UnknownBlock: State already discarded for ${block.hex}` });

/** How an A84 run went: the status once halted, the calls of the failing request, what was stored, the log. */
interface A84Observation {
  readonly status: unknown;
  readonly asked: number;
  readonly written: readonly bigint[];
  readonly cursor: unknown;
  readonly lines: readonly string[];
}

/** A84's oracle: halted with `node-requirement` at `height` (`module`, `point`), the request asked once, nothing of it kept. */
function a84Problems(
  observed: A84Observation,
  expected: { readonly height: bigint; readonly module: string | null; readonly point: string | null },
): string[] {
  const problems: string[] = [];
  const text = (value: unknown) => JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? `${v}` : v));
  const reason = { code: "node-requirement", height: expected.height, module: expected.module, point: expected.point };
  const status = observed.status as { readonly state?: unknown; readonly reason?: unknown } | null;
  if (status?.state !== "halted") problems.push(`the state is ${text(status?.state)}, not halted`);
  if (text(status?.reason) !== text(reason)) problems.push(`the reason is ${text(status?.reason)}`);
  if (observed.asked !== 1) problems.push(`the node was asked ${observed.asked} times for the unavailable state`);
  if (observed.cursor !== expected.height - 1n) problems.push(`the cursor is ${text(observed.cursor)}`);
  if (observed.written.some((height) => height >= expected.height)) problems.push(`heights ${text(observed.written)} were written`);
  if (observed.lines.some((line) => line.includes("retries in"))) problems.push("the process retried");
  return problems;
}

/** A client over `client` that asks again once when the node answers `node-requirement` (A84's negative control). */
function askingAgain(client: NodeClient): NodeClient {
  const again =
    <A extends unknown[], R>(call: (...args: A) => Promise<R>) =>
    async (...args: A): Promise<R> => {
      try {
        return await call(...args);
      } catch (error) {
        if (!(error instanceof UmbraError) || error.code !== "node-requirement") throw error;
        return call(...args);
      }
    };
  return new Proxy(client, {
    get(target, property) {
      const value = Reflect.get(target, property, target) as unknown;
      if (typeof value !== "function") return value;
      const bound = (value as (...args: unknown[]) => unknown).bind(target);
      return property === "storage" || property === "runtimeVersion" || property === "blockHash"
        ? again(bound as (...args: unknown[]) => Promise<unknown>)
        : bound;
    },
  });
}

describe.each(PROCESS_BACKENDS)("the node's errors through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const chain = chainOf(4n);
  const at = (height: number): ChainBlock => chain[height] as ChainBlock;

  /** The first two finalized heights, then height 3's records up to the one `failing` answers in its place. */
  function a84Tape(failing: "events" | "runtime" | "block"): TapeRecord[] {
    const records: TapeRecord[] = [
      ...opening(at(0), at(3)),
      ...finalized(at(1), RUNTIME_2_0, true),
      eventsRead(at(1), null),
      ...finalized(at(2), RUNTIME_2_0),
      eventsRead(at(2), null),
    ];
    if (failing === "block") return [...records, { method: "chain_getBlockHash", params: [3], result: null }];
    if (failing === "runtime") {
      return [
        ...records,
        { method: "chain_getBlockHash", params: [3], result: at(3).hex },
        { method: "chain_getBlock", params: [at(3).hex], result: at(3).block },
        { method: "state_getRuntimeVersion", params: [at(2).hex], error: discarded(at(2)) },
      ];
    }
    return [
      ...records,
      ...finalized(at(3), RUNTIME_2_0),
      { method: "state_getStorage", params: [SYSTEM_EVENTS_STORAGE, at(3).hex], error: discarded(at(3)) },
    ];
  }

  /** The request of `failing`, as the tape node logs its method and params. */
  const failingCall = (failing: "events" | "runtime" | "block"): { readonly method: string; readonly params: unknown } =>
    failing === "events"
      ? { method: "state_getStorage", params: [SYSTEM_EVENTS_STORAGE, at(3).hex] }
      : failing === "runtime"
        ? { method: "state_getRuntimeVersion", params: [at(2).hex] }
        : { method: "chain_getBlockHash", params: [3] };

  async function a84Run(failing: "events" | "runtime" | "block", client?: (client: NodeClient) => NodeClient): Promise<A84Observation> {
    const db = await backend.database();
    const run = await ingest(db, a84Tape(failing), {
      start: 1n,
      core: [CORE_CHAIN_EVENTS],
      ...(client === undefined ? {} : { Source: NodeBlockSource, client }),
    });
    let status: unknown = null;
    try {
      await halted(run);
      status = run.handle.status();
    } finally {
      await run.close();
    }
    const call = failingCall(failing);
    const asked = run.node.calls.filter((c) => c.method === call.method && JSON.stringify(c.params) === JSON.stringify(call.params)).length;
    const [row] = await db.query("SELECT max(height)::text AS h FROM core_block_commit.blocks");
    return { status, asked, written: run.seen.written, cursor: row?.h === null ? null : BigInt(row?.h as string), lines: run.lines };
  }

  it(
    "A84: a 'state unavailable' answer for a finalized height's events halts with node-requirement and that height, " +
      "asked once",
    async () => {
      const observed = await a84Run("events");
      expect(a84Problems(observed, { height: 3n, module: "core-chain-events", point: "on-fetch" })).toEqual([]);
      expect(observed.lines.join("\n")).toMatch(/processing halted \(node-requirement\): .*State already discarded/);
      expect(observed.status).toMatchObject({ reason: { code: "node-requirement" } });
    },
    PATIENCE_MS * 2,
  );

  it("A84: so does one for the state the height's runtime is read at, and a block the node does not have", async () => {
    expect(a84Problems(await a84Run("runtime"), { height: 3n, module: "core-block-fetch", point: "on-fetch" })).toEqual([]);
    expect(a84Problems(await a84Run("block"), { height: 3n, module: null, point: null })).toEqual([]);
  }, PATIENCE_MS * 3);

  it("A84 negative control: a client that asks the node again after a 'state unavailable' answer fails A84", async () => {
    expect(a84Problems(await a84Run("events", askingAgain), { height: 3n, module: "core-chain-events", point: "on-fetch" })).toEqual([
      "the node was asked 2 times for the unavailable state",
    ]);
  }, PATIENCE_MS * 2);

  it("A85: an error on a queued best block drops it without a retry; the block is fetched again at finality and commits once", async () => {
    const db = await backend.database();
    // The node's rate limit: retryable on the finalized path, which would ask again; a best block's call is not retried.
    const limited = { code: -32999, message: "RPC rate limit exceeded" };
    const records: TapeRecord[] = [
      ...opening(at(0), at(2)),
      ...finalized(at(1), RUNTIME, true),
      ...finalized(at(2)),
      newHead(at(3)),
      { method: "chain_getBlock", params: [at(3).hex], error: limited },
      finalizedHead(at(3)),
      ...finalized(at(3)),
    ];
    const run = await ingest(db, records, { start: 1n });
    try {
      await committed(run, 3n);
      const fetches = run.node.calls.filter((c) => c.method === "chain_getBlock" && JSON.stringify(c.params) === JSON.stringify([at(3).hex]));
      // The best block's one call (its error, not retried), then the finalized height's own.
      expect(fetches).toHaveLength(2);
      const hashReads = run.node.calls.findIndex((c) => c.method === "chain_getBlockHash" && JSON.stringify(c.params) === "[3]");
      const second = run.node.calls.indexOf(fetches[1] as (typeof run.node.calls)[number]);
      expect(hashReads).toBeGreaterThan(run.node.calls.indexOf(fetches[0] as (typeof run.node.calls)[number]));
      expect(second).toBeGreaterThan(hashReads);
      // on-best-block fired for 3, which was then not queued: no on-rollback, 3 committed once.
      expect(run.seen.queue.filter((line) => line.startsWith("best 3 "))).toHaveLength(1);
      expect(run.seen.rollbacks).toEqual([]);
      expect(run.seen.written).toEqual([1n, 2n, 3n]);
      expect(run.lines.filter((line) => line.includes("retries in"))).toEqual([]);
      expect(run.handle.status()).toMatchObject({ state: "following", reason: null });
    } finally {
      await run.close();
    }
  }, PATIENCE_MS * 2);
});

/**
 * The node client's clock in A85's outages: SPEED times the real one, so IN-10's two minutes of back-off take about
 * 1.2 s. Only the client's own timers run on it — its back-off, its reconnects and each try's timeout, the timeout
 * multiplied by SPEED so that a try still waits 30 real seconds —; the transport's heartbeat keeps the real clock.
 */
const SPEED = 100;
const FAST: NodeTimers = Object.freeze({
  setTimeout: (run: () => void, ms: number): unknown => setTimeout(run, ms / SPEED),
  clearTimeout: (handle: unknown): void => clearTimeout(handle as Parameters<typeof clearTimeout>[0]),
});

/** The process's node client on {@link FAST}, from the options the process gives (its retry reports among them). */
const fastClient = (options: NodeClientOptions): NodeClient =>
  new NodeClient({
    ...options,
    timers: FAST,
    callTimeoutMs: DEFAULT_CALL_TIMEOUT_MS * SPEED,
    connect: (url, events) => connectWebSocket(url, events, SYSTEM_TIMERS),
  });

/** The node client's retries as the process logs them: the operation, the attempt and the delay on its clock. */
interface LoggedRetry {
  readonly operation: string;
  readonly attempt: number;
  readonly delayMs: number;
}

function retriesIn(lines: readonly string[]): LoggedRetry[] {
  return lines
    .map((line) => /^node retries in (\d+) ms \(node-retrying, (\S+), attempt (\d+)\): /.exec(line))
    .filter((match) => match !== null)
    .map((match) => ({ operation: match[2] as string, attempt: Number(match[3]), delayMs: Number(match[1]) }));
}

/** The connections refused after the first drop: with it, eight failures, so the back-off reaches its 30 s ceiling. */
const REFUSED_SESSIONS = 7;

/** IN-10's back-off for those eight failures, with the default `backoffCeilingMs` (30 s): 121 s in all. */
const OUTAGE_BACKOFF = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000, 30_000];

/** A85's 2-minute tape over `chain` (0–20): 1–10, a drop, {@link REFUSED_SESSIONS} sessions dropped at once, 11–20. */
function outageTape(chain: readonly ChainBlock[]): TapeRecord[] {
  const at = (height: number): ChainBlock => chain[height] as ChainBlock;
  const heights = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return [
    ...opening(at(0), at(10)),
    ...heights(1, 10).flatMap((h) => finalized(at(h), RUNTIME, h === 1)),
    { disconnect: true },
    ...Array.from({ length: REFUSED_SESSIONS }, () => ({ disconnect: true }) as const),
    // The node is back: the subscriptions made again, the head read again (20).
    ...subscriptions(),
    ...headRead(at(20)),
    ...heights(11, 20).flatMap((h) => finalized(at(h))),
  ];
}

/** The process's status right after the node client reported a retry: the retry, the state, the cursor, the conditions. */
interface RetrySample {
  readonly retry: LoggedRetry;
  readonly state: string;
  readonly cursor: bigint | null;
  readonly conditions: readonly ProcessCondition[];
}

/**
 * {@link fastClient}, and where the process's status is sampled right after each retry the client reports (`status`
 * is set once the process exists): what the process shows while the client retries, whatever the machine's load.
 */
function sampledClient(samples: RetrySample[], status: { current?: () => ProcessStatus }) {
  return (options: NodeClientOptions): NodeClient =>
    fastClient({
      ...options,
      onRetry: (retry) => {
        options.onRetry?.(retry);
        const now = status.current?.();
        if (now === undefined) return;
        const { operation, attempt, delayMs } = retry;
        samples.push({ retry: { operation, attempt, delayMs }, state: now.state, cursor: now.cursor, conditions: now.conditions });
      },
    });
}

/** What A85's outage run observed. */
interface OutageObservation {
  /** The status after each of the client's retries. */
  readonly samples: readonly RetrySample[];
  /** The conditions once 20 committed. */
  readonly after: readonly ProcessCondition[];
  readonly retries: readonly LoggedRetry[];
  readonly written: readonly bigint[];
  readonly parsed: readonly bigint[];
  readonly blocks: readonly number[];
}

/** A85's oracle for the outage (IN-10's scenario "A flapping node"). */
function outageProblems(observed: OutageObservation): string[] {
  const problems: string[] = [];
  const text = (value: unknown) => JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? `${v}` : v));
  const heights = Array.from({ length: 20 }, (_, i) => i + 1);
  if (observed.samples.length === 0) problems.push("the client reported no retry while the process ran");
  let most = 0;
  for (const { retry, state, cursor, conditions } of observed.samples) {
    // node-retrying with the most attempts so far, at the height the loop processes or waits for — the cursor + 1,
    // S (1) before the first block —, none during startup.
    most = Math.max(most, retry.attempt);
    const height = state === "starting" ? null : cursor === null ? 1n : cursor + 1n;
    const expected = [{ code: "node-retrying", attempts: most, height }];
    if (text(conditions) !== text(expected)) {
      problems.push(`after ${retry.operation}'s retry ${retry.attempt} (${state}, cursor ${cursor}): ${text(conditions)}`);
    }
  }
  if (most !== OUTAGE_BACKOFF.length) problems.push(`node-retrying counted up to ${most} attempts, not ${OUTAGE_BACKOFF.length}`);
  if (observed.after.length !== 0) problems.push(`conditions after the outage: ${text(observed.after)}`);
  const connects = observed.retries.filter((retry) => retry.operation === "connect");
  if (text(connects.map((retry) => retry.delayMs)) !== text(OUTAGE_BACKOFF)) {
    problems.push(`the connection's back-off was ${text(connects.map((retry) => retry.delayMs))}, not ${text(OUTAGE_BACKOFF)}`);
  }
  if (text(connects.map((retry) => retry.attempt)) !== text(OUTAGE_BACKOFF.map((_, i) => i + 1))) {
    problems.push(`the connection's attempts were ${text(connects.map((retry) => retry.attempt))}`);
  }
  const away = connects.reduce((sum, retry) => sum + retry.delayMs, 0);
  if (away < 120_000) problems.push(`the node was away ${away} ms on the client's clock, not about 2 minutes`);
  if (text(observed.written.map(Number)) !== text(heights)) problems.push(`written ${observed.written}`);
  if (text(observed.parsed.map(Number)) !== text(heights)) problems.push(`parsed ${observed.parsed}`);
  if (text(observed.blocks) !== text(heights)) problems.push(`blocks ${observed.blocks}`);
  return problems;
}

/** One backend's outage run. */
async function outageRun(db: ProcessDatabase): Promise<OutageObservation> {
  const chain = chainOf(20n);
  const samples: RetrySample[] = [];
  const status: { current?: () => ProcessStatus } = {};
  const run: Ingest = await ingest(db, outageTape(chain), { start: 1n, nodeClient: sampledClient(samples, status) });
  status.current = () => run.handle.status();
  let after: readonly ProcessCondition[] = [];
  try {
    await committed(run, 20n);
    after = run.handle.status().conditions;
  } finally {
    await run.close();
  }
  const blocks = (await db.query("SELECT height::int AS h FROM core_block_commit.blocks ORDER BY height")).map((row) => Number(row.h));
  return {
    samples,
    after,
    retries: retriesIn(run.lines),
    written: run.seen.written,
    parsed: run.seen.parsed.map((parsed) => parsed.height),
    blocks,
  };
}

describe.each(PROCESS_BACKENDS)("A85: a node away for 2 minutes (IN-10, the scenario 'A flapping node') on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("retries with back-off reaching backoffCeilingMs and node-retrying, then resumes with no height skipped or repeated", async () => {
    expect(outageProblems(await outageRun(await backend.database()))).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A85 negative control: a process whose node client does not report its retries fails A85", async () => {
    // The process's own report dropped: the client still retries, but nothing shows it.
    const silent = (options: NodeClientOptions): NodeClient => {
      const { onRetry: _onRetry, onRetryingChange: _onRetryingChange, ...rest } = options;
      return fastClient(rest);
    };
    const chain = chainOf(20n);
    const db = await backend.database();
    const run = await ingest(db, outageTape(chain), { start: 1n, nodeClient: silent });
    try {
      await committed(run, 20n);
      expect(retriesIn(run.lines)).toEqual([]);
      expect(run.handle.status().conditions).toEqual([]);
    } finally {
      await run.close();
    }
  }, PATIENCE_MS * 2);

  it("during startup: the node's connection refused while startup asks for block 0 shows node-retrying at no height, starting", async () => {
    const chain = chainOf(2n);
    const at = (height: number): ChainBlock => chain[height] as ChainBlock;
    const records: TapeRecord[] = [
      { disconnect: true },
      { disconnect: true },
      { disconnect: true },
      ...opening(at(0), at(2)),
      ...finalized(at(1), RUNTIME, true),
      ...finalized(at(2)),
    ];
    const db = await backend.database();
    const samples: RetrySample[] = [];
    const status: { current?: () => ProcessStatus } = {};
    const run = await ingest(db, records, { start: 1n, nodeClient: sampledClient(samples, status) });
    status.current = () => run.handle.status();
    try {
      await committed(run, 2n);
      expect(run.handle.status()).toMatchObject({ state: "following", conditions: [] });
    } finally {
      await run.close();
    }
    const connects = retriesIn(run.lines).filter((retry) => retry.operation === "connect");
    expect(connects.map((retry) => retry.delayMs)).toEqual([1_000, 2_000, 4_000]);
    // Every retry came while startup asked for block 0: starting, node-retrying at no height, the most attempts so far.
    expect(samples.length).toBeGreaterThanOrEqual(3);
    let most = 0;
    for (const sample of samples) {
      most = Math.max(most, sample.retry.attempt);
      expect(sample).toMatchObject({ state: "starting", cursor: null });
      expect(sample.conditions).toEqual([{ code: "node-retrying", attempts: most, height: null }]);
    }
    expect(run.seen.written).toEqual([1n, 2n]);
  }, PATIENCE_MS * 2);
});
