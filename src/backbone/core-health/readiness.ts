/**
 * Readiness: whether a process should receive API traffic. Both `GET /health/ready` (the backbone part `core-health`'s,
 * `./endpoints.ts`) and the runner's `status().ready` (`../../runner/process.ts`, `statusOf`) take it from
 * {@link readinessOf}, so the two never disagree. [AE-4; CORE-ARCH §4.18]
 *
 * The rules, each applied only when the ones before it did not decide: [AE-4]
 * 1. not ready while `starting`, `refused`, `halted` or `stopping`, whatever the lag;
 * 2. ready while `stopped`, whatever the lag (a stopped process serves its height by design);
 * 3. otherwise (`syncing` or `following`), ready when no readiness lag is set or the lag is at or below it; not ready
 *    when the lag exceeds it or is not known yet (no head read). `following` is no exception: a following threshold
 *    above the readiness lag leaves a following process not ready. [A65]
 *
 * The process's conditions are not a rule: a retry, a stall or an upgrade boundary changes the state or the lag, or
 * nothing. The function is pure and imports nothing at run time, so the admin worker can run it, and so can the
 * browser build.
 */

import type { ProcessState } from "../../runner/process.js";

/** What readiness is decided from: the state, the lag (the head minus the cursor), the readiness lag set, if any. */
export interface ReadinessFacts {
  readonly state: ProcessState;
  readonly lag: bigint | null;
  /** `readinessLag` of the process's `core` revision; null when none is set. [CF-4] */
  readonly readinessLag: number | null;
}

/** The states in which a process is never ready (rule 1). [AE-4] */
export const NOT_READY_STATES: readonly ProcessState[] = Object.freeze(["starting", "refused", "halted", "stopping"]);

/** Whether a process with `facts` is ready, by the rules in the module comment. [AE-4] */
export function readinessOf({ state, lag, readinessLag }: ReadinessFacts): boolean {
  if (NOT_READY_STATES.includes(state)) return false;
  if (state === "stopped") return true;
  return readinessLag === null || (lag !== null && lag <= BigInt(readinessLag));
}
