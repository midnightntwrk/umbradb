/**
 * The block trace: where each height's time goes, for measuring a sync. Core.
 *
 * **Off unless started.** Nothing here runs until {@link startTrace} is called, and only `umbradb run` calls it, when
 * its environment sets `UMBRADB_TRACE` (`src/cli/run.ts`). While it is off every function below that records returns
 * at its first line ({@link tracedRead}'s wrapper times its read whatever the state, and its callers build it only
 * while tracing), so a process that is not traced computes, reads and writes exactly what it did before the trace
 * existed. The trace never changes what is stored: it only measures.
 *
 * **What it records**, on the main thread:
 * - one line per committed height ({@link traceEndBlock}): its height `h`, the clock `t` (ms) when it ended, and
 *   whatever the height's code added in between with {@link traceAdd} (a duration in ms, summed), {@link traceMark} (a
 *   value) and {@link tracePush} (an item of a list);
 * - `sh`, the chain of step outputs ({@link traceChain}): a SHA-256 over what every height so far gave, 16 hex digits
 *   of it, a height's outputs joining it when the height ends and dropped with a height that does not. Two runs of the
 *   same heights whose last `sh` are equal computed the same thing at every height;
 * - each statement text's count and client time, from send to answer or failure ({@link traceStatement}): the first
 *   {@link STATEMENT_TEXTS} texts by name, the statements of any other text together under {@link OTHER_STATEMENTS};
 * - the ledger worker as this thread sees it, added to the height being processed when a message of the worker is
 *   handled (`src/ledger/worker/host.ts`): each request type's round trips (`rt.<type>`, `rtN.<type>`), the answers'
 *   way back (`backMs`) and the node requests' times (`nodeNoticeMs`, `nodeReadMs`, `nodeReads`);
 * - the ledger worker's lines, one per applied block, which the worker posts to this thread ({@link traceWorker},
 *   `./worker-trace.ts`): what its thread's time went to since the line before.
 *
 * **Where it goes.** A {@link TraceSink}, which the command builds over a file (`./file-sink.ts`). This module imports
 * no file API, so the browser build bundles it as it is. Lines are kept in memory and handed to the sink every
 * {@link FLUSH_LINES} heights and at {@link stopTrace}. A sink that throws (a full disk) stops the trace: what it held
 * is dropped, {@link TraceOptions.log} gets one line, and the process goes on untraced.
 *
 * **One trace per process.** The state is this module's, since the trace is the process's: one `umbradb run` is one
 * process with one database. A program that runs several processes in one Node.js process does not start it.
 */

import { createHash, type Hash } from "node:crypto";
import { threadMemory } from "./memory.js";

/** Where a trace is written. Each `text` is whole lines, the last one ended. */
export interface TraceSink {
  /** Appends the lines of committed heights. */
  blocks(text: string): void;
  /** Replaces the statements' totals (a JSON array). */
  statements(json: string): void;
  /** Appends the ledger worker's lines. */
  worker(text: string): void;
}

/** One statement text's totals. */
interface StatementTotals {
  n: number;
  ms: number;
  max: number;
}

/** What a trace records beyond the default. */
export interface TraceOptions {
  /**
   * Also each height's step in detail ({@link traceSteps}): its count changes, new nodes and deleted nodes, by the
   * first bytes of their keys. It makes a line several kB long, so it is asked for only by the analyses that need it.
   */
  readonly steps?: boolean;
  /** Where the one line that says the sink failed, and the trace stopped, goes; nowhere unless given. */
  readonly log?: (line: string) => void;
}

/** A started trace. */
interface Active {
  readonly sink: TraceSink;
  readonly steps: boolean;
  readonly log: ((line: string) => void) | undefined;
  readonly statements: Map<string, StatementTotals>;
  /** The statements of the texts not in {@link Active.statements}: those after the first {@link STATEMENT_TEXTS}. */
  readonly other: StatementTotals;
  /** The chain of step outputs of the heights ended so far. */
  chain: Hash;
  /** The chain with the current height's step outputs, which replaces it when the height ends; null before any. */
  pending: Hash | null;
  block: Record<string, unknown>;
  lines: string[];
  worker: string[];
}

/** How many heights' lines are kept before the sink gets them. */
export const FLUSH_LINES = 200;

/** How much of a statement's text names it in the totals, its whitespace collapsed. */
export const STATEMENT_KEY_LENGTH = 260;

/**
 * How many statement texts the totals keep by name: the first sent. With {@link STATEMENT_KEY_LENGTH} it bounds what
 * they hold, whatever texts a client sends (reads that differ by a comment): at most 266,240 characters of text, and
 * for texts in ASCII a file of at most about 0.3 MB at each flush. A sync of Preprod sends 120 to 230 texts.
 */
export const STATEMENT_TEXTS = 1_024;

/**
 * The name the totals give the statements of every text not kept by name ({@link STATEMENT_TEXTS}), in the last entry.
 * A statement whose own text is this name is counted there too, so the name stands for nothing else.
 */
export const OTHER_STATEMENTS = "(other statement texts)";

let active: Active | null = null;

/** Starts the trace into `sink`; a trace already started is stopped first. */
export function startTrace(sink: TraceSink, options: TraceOptions = {}): void {
  stopTrace();
  active = {
    sink,
    steps: options.steps === true,
    log: options.log,
    statements: new Map(),
    other: { n: 0, ms: 0, max: 0 },
    chain: createHash("sha256"),
    pending: null,
    block: {},
    lines: [],
    worker: [],
  };
}

/** Stops the trace and hands the sink what is still in memory; nothing when none is started. */
export function stopTrace(): void {
  const trace = active;
  if (trace === null) return;
  active = null;
  flush(trace);
}

/** Whether a trace is started: the guard of any work done only for the trace. */
export function tracing(): boolean {
  return active !== null;
}

/** Whether a started trace also records each step in detail ({@link TraceOptions.steps}). */
export function traceSteps(): boolean {
  return active?.steps === true;
}

/**
 * Hands the sink the lines in memory and the statements' totals. If the sink throws, the trace stops (the process goes
 * on: the trace only measures) and its `log` gets one line.
 */
function flush(trace: Active): void {
  const { lines, worker } = trace;
  trace.lines = [];
  trace.worker = [];
  try {
    if (lines.length > 0) trace.sink.blocks(`${lines.join("\n")}\n`);
    if (worker.length > 0) trace.sink.worker(`${worker.join("\n")}\n`);
    const entries = [...trace.statements].map(([q, totals]) => ({ q, ...totals }));
    if (trace.other.n > 0) entries.push({ q: OTHER_STATEMENTS, ...trace.other });
    trace.sink.statements(JSON.stringify(entries));
  } catch (error) {
    if (active === trace) active = null;
    const reason = error instanceof Error ? error.message : String(error);
    trace.log?.(`block trace stopped, the process goes on untraced: writing it failed: ${reason}`);
  }
}

/** Adds `ms` to the current height's `key`. */
export function traceAdd(key: string, ms: number): void {
  if (active === null) return;
  active.block[key] = ((active.block[key] as number | undefined) ?? 0) + ms;
}

/** Sets the current height's `key`. */
export function traceMark(key: string, value: unknown): void {
  if (active === null) return;
  active.block[key] = value;
}

/** Appends `item` to the current height's list `key`. */
export function tracePush(key: string, item: unknown): void {
  if (active === null) return;
  const list = (active.block[key] as unknown[] | undefined) ?? [];
  list.push(item);
  active.block[key] = list;
}

/**
 * The totals the statements of the text `key` are counted in: its own, made while fewer than {@link STATEMENT_TEXTS}
 * are kept, else the others'.
 */
function totalsOf(trace: Active, key: string): StatementTotals {
  const kept = trace.statements.get(key);
  if (kept !== undefined) return kept;
  if (key === OTHER_STATEMENTS || trace.statements.size >= STATEMENT_TEXTS) return trace.other;
  const totals = { n: 0, ms: 0, max: 0 };
  trace.statements.set(key, totals);
  return totals;
}

/**
 * One statement's client time, from send to its answer or its failure: counted under its text (see
 * {@link STATEMENT_TEXTS}) and in the current height's `sqlN` and `sqlMs`; a `COMMIT`'s time is also the height's
 * `commitMs`.
 */
export function traceStatement(text: string, ms: number): void {
  if (active === null) return;
  const key = text.replace(/\s+/g, " ").slice(0, STATEMENT_KEY_LENGTH);
  const totals = totalsOf(active, key);
  totals.n += 1;
  totals.ms += ms;
  if (ms > totals.max) totals.max = ms;
  traceAdd("sqlN", 1);
  traceAdd("sqlMs", ms);
  if (key === "COMMIT") traceMark("commitMs", ms);
}

/**
 * Extends the chain of step outputs with `value` (JSON) and sets the current height's `sh` to the chain so far. The
 * caller builds `value` only while {@link tracing}. The height's values join the chain when it ends
 * ({@link traceEndBlock}) and are dropped with it ({@link traceDropBlock}), so a height made again after a failure is
 * chained once.
 */
export function traceChain(value: unknown): void {
  if (active === null) return;
  active.pending ??= active.chain.copy();
  active.pending.update(JSON.stringify(value));
  active.block.sh = active.pending.copy().digest("hex").slice(0, 16);
}

/**
 * Ends the current height as `height`, committed: its line is kept and the next height starts empty. The line also
 * gets the main thread's memory then (`./memory.ts`), `mem`: its JavaScript heap in use, what it holds outside the
 * heap and the process's resident set, in MiB. Each number of the line is rounded to 0.001, as the worker's lines are:
 * its times are in ms, and its counts are whole.
 */
export function traceEndBlock(height: bigint): void {
  if (active === null) return;
  const memory = threadMemory();
  if (memory !== null) active.block.mem = [memory.heap, memory.external, memory.rss];
  const line: Record<string, unknown> = { h: Number(height), t: performance.now(), ...active.block };
  for (const [key, value] of Object.entries(line)) if (typeof value === "number") line[key] = +value.toFixed(3);
  active.lines.push(JSON.stringify(line));
  active.block = {};
  if (active.pending !== null) active.chain = active.pending;
  active.pending = null;
  if (active.lines.length >= FLUSH_LINES) flush(active);
}

/**
 * Drops what the current height recorded, its step outputs included: it did not commit, and is recorded again when it
 * runs again.
 */
export function traceDropBlock(): void {
  if (active === null) return;
  active.block = {};
  active.pending = null;
}

/** Keeps one line of the ledger worker (`./worker-trace.ts`'s entry for an applied block). */
export function traceWorker(entry: unknown): void {
  if (active === null) return;
  active.worker.push(JSON.stringify(entry));
}

/**
 * `read` with each of its calls recorded in the current height's `reads` as `[kind, keys asked, ms, entries
 * answered]`: the number asked is the first argument's length when it is a list (else 0), and the number answered the
 * result's `size` or `length` (0 for a result with neither).
 */
export function tracedRead<A extends readonly unknown[], R>(
  kind: string,
  read: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  return async (...args) => {
    const from = performance.now();
    const result = await read(...args);
    const [first] = args;
    const sized = result as { readonly size?: unknown; readonly length?: unknown } | null | undefined;
    const answered = typeof sized?.size === "number" ? sized.size : typeof sized?.length === "number" ? sized.length : 0;
    tracePush("reads", [kind, Array.isArray(first) ? first.length : 0, +(performance.now() - from).toFixed(3), answered]);
    return result;
  };
}
