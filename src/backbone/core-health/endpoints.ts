/**
 * The backbone part `core-health`'s admin endpoints (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-2, AE-4; CORE-ARCH §4.18; decision record Q70): `GET /health/live` and `GET /health/ready`, functions of the
 * snapshot the runner publishes and of the heartbeat's age, which the admin worker runs (`../../admin/`). They read
 * nothing else — no database, nothing of the main thread —, and import nothing at run time but `./readiness.ts`, so
 * the worker runs them, and so can the browser build's.
 *
 * - `/health/live` (AE-2): 200 while the runner's last heartbeat tick is within the liveness timeout, in every state —
 *   a refused or halted process stays live, since a restart would meet the same condition —; 503 once the main thread
 *   has not ticked for longer (stuck by definition: computation blocks it, awaiting does not). The body says so, with
 *   the tick's age in whole milliseconds and the timeout: `{ "live": true, "heartbeatAgeMs": 412, "livenessTimeoutMs":
 *   30000 }`.
 * - `/health/ready` (AE-4): 200 or 503 as {@link readinessOf} decides — AE-4's order: not while `starting`, `refused`,
 *   `halted` or `stopping`; always while `stopped`; otherwise within the readiness lag, if one is set — from the
 *   published state and lag and the process revision's `readinessLag`; the body shows what it decided from:
 *   `{ "ready": false, "state": "syncing", "lag": "500", "readinessLag": 10 }` (the lag as decimal text, as `/status`).
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";
import { readinessOf } from "./readiness.js";

/** `GET /health/live` (AE-2). */
const LIVE: AdminEndpoint = {
  path: "/health/live",
  answer: ({ snapshot, beatAgeMs }) => {
    const { livenessTimeoutMs } = snapshot;
    const live = beatAgeMs <= livenessTimeoutMs;
    // A tick written after the worker read its clock makes a tiny negative age: shown as 0.
    const heartbeatAgeMs = Math.max(0, Math.round(beatAgeMs));
    return { status: live ? 200 : 503, body: { live, heartbeatAgeMs, livenessTimeoutMs } };
  },
};

/** `GET /health/ready` (AE-4). */
const READY: AdminEndpoint = {
  path: "/health/ready",
  answer: ({ snapshot }) => {
    const { readinessLag } = snapshot;
    const { state, lag } = snapshot.status;
    const ready = readinessOf({ state, lag: lag === null ? null : BigInt(lag), readinessLag });
    return { status: ready ? 200 : 503, body: { ready, state, lag, readinessLag } };
  },
};

/** `core-health`'s endpoints, which the admin route table mounts (`../../admin/routes.ts`). */
export const CORE_HEALTH_ENDPOINTS: AdminPart = Object.freeze({
  id: "core-health",
  endpoints: Object.freeze([Object.freeze(LIVE), Object.freeze(READY)]),
});
