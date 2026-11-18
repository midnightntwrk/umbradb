/**
 * Whether a ledger worker's trace entries add up (`src/trace/worker-trace.ts`): an entry's `spanMs` is the thread's
 * wall time since the entry before, and the thread spent it running requests (`rq.<type>`) or with none to run
 * (`idleMs`). What is left is not accounted for. Shared by the trace's tests; imports nothing of Vitest.
 */

/** A worker's entry as read from a trace. */
export type WorkerLine = Readonly<Record<string, unknown>>;

const number = (value: unknown): number => (typeof value === "number" ? value : 0);

/** The sum of `entry`'s values whose key starts with `prefix`. */
export function sumOf(entry: WorkerLine, prefix: string): number {
  return Object.entries(entry).reduce((sum, [key, value]) => (key.startsWith(prefix) ? sum + number(value) : sum), 0);
}

/** The ms of `entry`'s span that neither a request nor idle time accounts for. */
export function unaccountedMs(entry: WorkerLine): number {
  return number(entry.spanMs) - sumOf(entry, "rq.") - number(entry.idleMs);
}

/** The share of a span that may go unaccounted. */
export const UNACCOUNTED_SHARE = 0.05;

/**
 * The entries of `entries` whose parts do not add up to their span, each as a sentence: more than `share` of the span
 * and more than `floorMs` (an entry is rounded to 0.001 ms per value, and a span may be a fraction of a ms) is
 * unaccounted, or the parts exceed the span by as much.
 */
export function addingUpProblems(entries: readonly WorkerLine[], share: number = UNACCOUNTED_SHARE, floorMs = 0.05): string[] {
  return entries.flatMap((entry) => {
    if (typeof entry.spanMs !== "number") return [`the entry of ${String(entry.h)} has no spanMs`];
    const rest = unaccountedMs(entry);
    return Math.abs(rest) > Math.max(floorMs, share * entry.spanMs)
      ? [`the entry of ${String(entry.h)}: ${rest.toFixed(3)} ms of its ${entry.spanMs} ms are not accounted for`]
      : [];
  });
}

/**
 * Over `entries`, the share of the thread's time that was not idle which nothing accounts for. A span's bound says
 * little for a worker that mostly waits for the main thread: there the idle time alone makes the parts add up.
 */
export function unaccountedOfBusy(entries: readonly WorkerLine[]): number {
  const busy = entries.reduce((sum, entry) => sum + number(entry.spanMs) - number(entry.idleMs), 0);
  return Math.abs(entries.reduce((sum, entry) => sum + unaccountedMs(entry), 0)) / busy;
}
