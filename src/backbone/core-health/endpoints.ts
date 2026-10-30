/**
 * The backbone part `core-health`'s admin endpoints: `GET /health/live` and `GET /health/ready`, functions of the
 * snapshot the runner publishes and of the heartbeat's age, run by the admin worker (`../../admin/`). They read nothing
 * else (no database, nothing of the main thread) and import nothing at run time but `./readiness.ts`, so the worker
 * can run them, and so can the browser build. [AE-1, AE-2, AE-4, Q70; CORE-ARCH §4.18]
 *
 * - `/health/live` answers 200 while the runner's last heartbeat tick is within the liveness timeout, in every state.
 *   A refused or halted process stays live, since a restart would meet the same condition. It answers 503 once the
 *   main thread has not ticked for longer: it is then stuck by definition, since computation blocks it and awaiting
 *   does not. The body says so, with the tick's age in whole milliseconds and the timeout:
 *   `{ "live": true, "heartbeatAgeMs": 412, "livenessTimeoutMs": 30000 }`. [AE-2]
 * - `/health/ready` answers 200 or 503 as {@link readinessOf} decides, from the published state and lag and the process
 *   revision's `readinessLag`: never ready while `starting`, `refused`, `halted` or `stopping`; always ready while
 *   `stopped`; otherwise ready within the readiness lag, if one is set. The body shows what it decided from:
 *   `{ "ready": false, "state": "syncing", "lag": "500", "readinessLag": 10 }` (the lag as decimal text, as in
 *   `/status`). [AE-4]
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";
import { readinessOf } from "./readiness.js";

/** `GET /health/live`. [AE-2] */
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

/** `GET /health/ready`. [AE-4] */
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
