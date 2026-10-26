/**
 * Readiness (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-4; CORE-ARCH §4.18): whether a process
 * should receive API traffic — `GET /health/ready`, the backbone part `core-health`'s (`./endpoints.ts`), and the
 * runner's `status().ready` (`../../runner/process.ts`, `statusOf`), which take it from {@link readinessOf}, so the two
 * never disagree.
 *
 * AE-4's order, each rule applied only when the ones before it did not decide:
 * 1. not ready while `starting`, `refused`, `halted` or `stopping`, whatever the lag;
 * 2. ready while `stopped`, whatever the lag (a stopped process serves its height by design);
 * 3. otherwise — `syncing` or `following` — ready when no readiness lag is set or the lag is at or below it, and not
 *    ready when it exceeds it (or is not known yet: no head read). `following` is no exception: a following threshold
 *    above the readiness lag leaves a following process not ready (A65).
 * The process's conditions are no rule: a retry, a stall or an upgrade boundary changes the state or the lag, or
 * nothing. Pure, and it imports nothing at run time: the admin worker runs it, and so can the browser build's.
 */

import type { ProcessState } from "../../runner/process.js";

/** What readiness is decided from: the state, the lag (the head minus the cursor), the readiness lag set, if any. */
export interface ReadinessFacts {
  readonly state: ProcessState;
  readonly lag: bigint | null;
  /** `readinessLag` of the process's `core` revision (CF-4); null when none is set. */
  readonly readinessLag: number | null;
}

/** The states rule 1 never finds ready (AE-4). */
export const NOT_READY_STATES: readonly ProcessState[] = Object.freeze(["starting", "refused", "halted", "stopping"]);

/** Whether a process with `facts` is ready, in AE-4's order (see the module comment). */
export function readinessOf({ state, lag, readinessLag }: ReadinessFacts): boolean {
  if (NOT_READY_STATES.includes(state)) return false;
  if (state === "stopped") return true;
  return readinessLag === null || (lag !== null && lag <= BigInt(readinessLag));
}
