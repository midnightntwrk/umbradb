/**
 * The node client's back-off. A retried failure (a node connection error, a timeout, HTTP 429 or a 5xx status) is
 * tried again after an exponential back-off: 1 s, doubling up to `backoffCeilingMs` (30 s by default), without limit.
 * The node client waits {@link backoffDelay} before each new connection attempt, counting the failed connections since
 * the node last answered on one. It also waits before each new try of a call, counting that call's failed tries.
 * [IN-10]
 */

/** The first delay: 1 s. */
export const BACKOFF_BASE_MS = 1_000;

/** The delay before retry number `attempt` (1 for the first retry): 1 s, 2 s, 4 s, … and at most `ceilingMs`. */
export function backoffDelay(attempt: number, ceilingMs: number): number {
  return Math.min(BACKOFF_BASE_MS * 2 ** (attempt - 1), ceilingMs);
}
