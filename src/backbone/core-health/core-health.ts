/**
 * The backbone part `core-health`'s admin endpoints (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-2, AE-4; CORE-ARCH §4.18; decision record Q70): `GET /health/live` and `GET /health/ready`, functions of the
 * snapshot the runner publishes, which the admin worker runs (`../../admin/`).
 *
 * - `/health/live` (AE-2): 200 `{ "live": true }` while the runner's last heartbeat tick is within the liveness
 *   timeout, in every state — a refused or halted process stays live, since a restart would meet the same condition —;
 *   503 `{ "live": false }` once the main thread has not ticked for longer (stuck by definition).
 * - `/health/ready` (AE-4): 200 `{ "ready": true }` when the published status is ready, else 503 `{ "ready": false }`;
 *   AE-4's order (503 while `starting`, `refused`, `halted` or `stopping`; 200 while `stopped`; then the readiness lag)
 *   is the runner's `status()` (`../../runner/process.ts`), published as it decides it.
 *
 * Task 8.1 mounts them with these minimal bodies; task 8.2 completes the part (its declaration, its bodies, A63, A65,
 * A140).
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /health/live` (AE-2). */
const LIVE: AdminEndpoint = {
  path: "/health/live",
  answer: ({ snapshot, beatAgeMs }) => {
    const live = beatAgeMs <= snapshot.livenessTimeoutMs;
    return { status: live ? 200 : 503, body: { live } };
  },
};

/** `GET /health/ready` (AE-4). */
const READY: AdminEndpoint = {
  path: "/health/ready",
  answer: ({ snapshot }) => {
    const { ready } = snapshot.status;
    return { status: ready ? 200 : 503, body: { ready } };
  },
};

/** `core-health`'s endpoints. */
export const CORE_HEALTH: AdminPart = Object.freeze({
  id: "core-health",
  endpoints: Object.freeze([Object.freeze(LIVE), Object.freeze(READY)]),
});
