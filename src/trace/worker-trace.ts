/**
 * The ledger worker's side of the block trace (`./trace.ts`): what the worker thread's time goes to, between one
 * applied block and the next. Core.
 *
 * **Off unless started.** {@link startWorkerTrace} is called by the worker thread's main (`src/ledger/worker/run.ts`)
 * only when the main thread started a trace before it started the thread, and {@link stopWorkerTrace} by the same at
 * the first request that does not say when it was posted: the main thread's trace has stopped (its file could not be
 * written). While it is off, {@link timed} only calls its work and the others return at their first line: one
 * comparison with null each.
 *
 * **One entry per applied block.** {@link endApply} posts it and starts over. The main thread keeps the entry
 * (`src/ledger/worker/host.ts`, `traceWorker`), so the worker writes no file. What ran since the apply before is in
 * this apply's entry. So a block's `parse`, which the worker runs ahead of the loop, is counted in the entry of the
 * block applied next, not in its own, and so is every other request, wait and idle time below.
 *
 * **What an entry holds.** Its height `h`, its number of transactions `tx`, and, in ms unless said otherwise:
 * - `spanMs`: the thread's wall time since the entry before (since the trace started, for a thread's first entry).
 *   The requests' time and the idle time below add up to it; what is left is not accounted for.
 * - `rq.<type>`: the time the thread ran requests of that type (`src/ledger/worker/protocol.ts`), each from its start
 *   to its answer posted, node waits included. A request running when the entry ends (the apply itself) is cut there:
 *   what it runs afterwards is in the next entry. `rqN.<type>`: how many started.
 * - `post.<type>`: of `rq.<type>`, the time posting the answers: their structured clone.
 * - The phases the engine and the adapter wrap in {@link timed}, each under its name, nested ones inside their outer
 *   one: `parse`; `adapterApply` and, in it, `deserialize`, `segments`, `wellFormed`, `cost`, `stateApply`,
 *   `applySystem`, `events`, `postBlockUpdate`; `settle` and, in it, `stateKey`, `stateRoot`, `summary`, `persist`,
 *   `contracts`, `release`, `flush`. A phase's time includes its node waits.
 * - `nodeWaitMs`: the time the thread was blocked while the main thread read stored nodes for it
 *   (`src/ledger/worker/node-bridge.ts`), from asking to being woken; `nodeWaits`: how many times; `nodeGets`: how
 *   many nodes the package asked the store for, those served without a wait included; `nodeGot`: how many nodes the
 *   answers carried. `node.<phase>`: of `nodeWaitMs`, what fell inside that phase (every phase open then, so
 *   `node.adapterApply` holds `node.stateApply`); `node.rq.<type>`: what fell inside a request of that type.
 * - `idleMs`: the time no request ran: the thread had nothing to do. `transitMs`: of it, the time a request the main
 *   thread had already posted had not reached this thread.
 * - `queuedMs`: what the requests started waited between their post by the main thread and their start, less their
 *   transit above. It is the requests' time, not the thread's: it overlaps the requests that ran before them, and is
 *   not a part of `spanMs`. A request's message is handled only when the request before has ended, so its wait is
 *   known from the main thread's clock and not from when it was handled.
 * - `gcMs`, `gcN`: the garbage collections of the thread's JavaScript heap that began in the span, and of them
 *   `gcMajorMs`, the major ones. They overlap everything above. The runtime reports a collection only once the thread
 *   is back in its event loop, so one reported after its span's entry was posted is in a later entry as
 *   `gcOf.<height>` and `gcNOf.<height>`, named by the height of the entry it belongs to (`gcOf.0`, in the thread's
 *   first entry, for one that began before the trace started).
 * - The thread's memory when the block was applied (`./memory.ts`), in MiB: `ext`, what the thread holds outside its
 *   JavaScript heap, which is its ledger packages' WebAssembly memory; `heap`, its JavaScript heap in use; and `rss`,
 *   the process's resident set.
 *
 * **The clock both threads share** is {@link traceClock}. A traced main thread posts each request with the clock's
 * value then, and a traced worker its answers and node requests alike (`at`), so the receiver knows how long the
 * message took to be handled.
 *
 * The state is this module's, one per thread: a worker thread runs one engine.
 */

import { threadMemory } from "./memory.js";

/** One applied block's entry: numbers by name (see the module comment). */
export type WorkerTraceEntry = Readonly<Record<string, number>>;

/** A request's arrival, from {@link requestArrived} to {@link requestStarted}. */
export interface RequestArrival {
  /** When the main thread posted it, on this thread's `performance.now()`; when it arrived, if the message says not. */
  readonly sent: number;
  /** How long it was on its way while the thread was free. */
  readonly transit: number;
}

/** How many entries' ends are kept, to place a garbage collection reported late. */
const KEPT_ENDS = 4096;

/** The kind of a major collection (`perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`). */
const GC_MAJOR = 4;

let post: ((entry: WorkerTraceEntry) => void) | null = null;
/** What the current entry holds so far, by name. */
let sums: Record<string, number> = {};
/** The phases open now, the outermost first. */
let open: string[] = [];
/** When the entry before was posted (`performance.now()`). */
let spanFrom = 0;
/** The request running now: its type and since when (or since the entry before, if it was cut there). */
let running: { readonly type: string; from: number } | null = null;
/** The requests arrived and not ended. */
let arrived = 0;
/** Since when no request runs. */
let freeFrom = 0;
/** The posted entries' ends and heights, the oldest first. */
let ends: { readonly at: number; readonly h: number }[] = [];
let gc: { disconnect(): void } | null = null;

const add = (key: string, value: number): void => {
  sums[key] = (sums[key] ?? 0) + value;
};

/**
 * The clock the main thread and the worker share, in ms: a thread's `performance.now()` counts from its own origin,
 * and the origin is on one clock for every thread of the process.
 */
export function traceClock(): number {
  return performance.timeOrigin + performance.now();
}

/** Whether this thread's worker trace is started. */
export function workerTracing(): boolean {
  return post !== null;
}

/** One collection the runtime reported: counted in the current entry, or under the entry it began in. */
function collected(startTime: number, duration: number, kind: unknown): void {
  if (post === null) return;
  if (startTime >= spanFrom) {
    add("gcMs", duration);
    add("gcN", 1);
    if (kind === GC_MAJOR) add("gcMajorMs", duration);
    return;
  }
  let at = ends.length - 1;
  while (at > 0 && (ends[at - 1] as { at: number }).at > startTime) at--;
  const h = ends[at]?.h ?? 0;
  add(`gcOf.${h}`, duration);
  add(`gcNOf.${h}`, 1);
}

/** Starts observing this thread's garbage collections; null where the runtime has no such report. */
function observeCollections(): { disconnect(): void } | null {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        collected(entry.startTime, entry.duration, (entry as { readonly detail?: { readonly kind?: unknown } }).detail?.kind);
      }
    });
    observer.observe({ entryTypes: ["gc"] });
    return observer;
  } catch {
    return null;
  }
}

/** Starts the worker's trace: each applied block's entry goes to `send`. */
export function startWorkerTrace(send: (entry: WorkerTraceEntry) => void): void {
  stopWorkerTrace();
  post = send;
  spanFrom = performance.now();
  freeFrom = spanFrom;
  gc = observeCollections();
}

/** Stops the worker's trace and drops what the current block recorded. */
export function stopWorkerTrace(): void {
  post = null;
  sums = {};
  open = [];
  running = null;
  arrived = 0;
  ends = [];
  gc?.disconnect();
  gc = null;
}

/** Runs `work` and resolves with its result; while tracing, its time is added to phase `key`, also when it throws. */
export function timed<T>(key: string, work: () => T): T {
  if (post === null) return work();
  const from = performance.now();
  open.push(key);
  try {
    return work();
  } finally {
    open.pop();
    add(key, performance.now() - from);
  }
}

/**
 * A request's message reached the thread; `sentAt` is the main thread's {@link traceClock} when it posted it, if the
 * message says. The time the thread was free until now is idle time. Null while not tracing.
 */
export function requestArrived(sentAt: number | undefined): RequestArrival | null {
  if (post === null) return null;
  const now = performance.now();
  const sent = sentAt === undefined ? now : sentAt - performance.timeOrigin;
  let transit = 0;
  if (arrived === 0) {
    add("idleMs", now - freeFrom);
    transit = Math.max(0, now - Math.max(sent, freeFrom));
    add("transitMs", transit);
  }
  arrived += 1;
  return { sent, transit };
}

/** The request of `type` that arrived as `arrival` starts running. */
export function requestStarted(type: string, arrival: RequestArrival | null): void {
  if (post === null || arrival === null) return;
  const now = performance.now();
  add("queuedMs", Math.max(0, now - arrival.sent - arrival.transit));
  add(`rqN.${type}`, 1);
  running = { type, from: now };
}

/** The running request ended, its answer posted. */
export function requestEnded(): void {
  if (post === null || running === null) return;
  const now = performance.now();
  add(`rq.${running.type}`, now - running.from);
  running = null;
  arrived = Math.max(0, arrived - 1);
  if (arrived === 0) freeFrom = now;
}

/** Runs `send`, which posts the running request's answer; while tracing, its time is the request's `post.<type>`. */
export function posting(send: () => void): void {
  if (post === null || running === null) return send();
  const { type } = running;
  const from = performance.now();
  try {
    send();
  } finally {
    add(`post.${type}`, performance.now() - from);
  }
}

/** The package asked the node store for a node. */
export function nodeAsked(): void {
  if (post === null) return;
  add("nodeGets", 1);
}

/** The time a node wait starts at; 0 while not tracing. */
export function nodeWaitFrom(): number {
  return post === null ? 0 : performance.now();
}

/** A node wait that started at `from` ({@link nodeWaitFrom}) ended: the thread was woken. */
export function nodeWaited(from: number): void {
  if (post === null || from === 0) return;
  const ms = performance.now() - from;
  add("nodeWaitMs", ms);
  add("nodeWaits", 1);
  for (const phase of open) add(`node.${phase}`, ms);
  if (running !== null) add(`node.rq.${running.type}`, ms);
}

/** A node wait's answer carried `nodes` nodes. */
export function nodeGot(nodes: number): void {
  if (post === null) return;
  add("nodeGot", nodes);
}

/** Posts the entry of the block applied at `height` with `transactions` transactions, and starts the next one. */
export function endApply(height: bigint, transactions: number): void {
  if (post === null) return;
  const now = performance.now();
  // The request applying the block still runs: what it ran up to here is this entry's, the rest the next one's.
  if (running !== null) {
    add(`rq.${running.type}`, now - running.from);
    running.from = now;
  }
  const entry: Record<string, number> = { h: Number(height), tx: transactions, spanMs: +(now - spanFrom).toFixed(3) };
  for (const [key, value] of Object.entries(sums)) entry[key] = +value.toFixed(3);
  const memory = threadMemory();
  if (memory !== null) {
    entry.ext = memory.external;
    entry.heap = memory.heap;
    entry.rss = memory.rss;
  }
  sums = {};
  spanFrom = now;
  ends.push({ at: now, h: entry.h as number });
  if (ends.length > KEPT_ENDS) ends.shift();
  post(entry);
}
