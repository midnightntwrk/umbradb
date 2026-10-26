/**
 * The backbone part `core-status`'s admin endpoint (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-3, AE-5, AE-6; CORE-ARCH §4.18; decision record Q70): `GET /status`, a function of the snapshot the runner
 * publishes and of the clock at the request, which the admin worker runs (`../../admin/`). It reads nothing else and
 * imports nothing at run time, so the worker runs it, and so can the browser build's.
 *
 * It answers 200 with the published status (`StatusSnapshot`, built on the main thread by `snapshotOf`,
 * `../../admin/snapshot.ts`) and the uptime at the request: the state (AE-3), readiness, the conditions, the cursor, the
 * finalized head and the lag (heights as decimal text), for `refused` and `halted` the reason as a sanitized error (its
 * code, height, module and point, a message from those alone and allowlisted details; never a raw exception message,
 * AE-6), the instance's role, the last commit's wall-clock time as RFC 3339 UTC text (Q68), the node as the core sees
 * it, every part of the database with its tables' digest rows (DT-5), the ledger, the private instances and the public
 * side — null where nothing reports a value yet (AE-5) — and `uptimeMs`, the milliseconds since the process started by
 * the monotonic clock every thread reads alike (`process.hrtime.bigint()`), computed here at each request rather than
 * published every second. The body's JSON schema is `test/backbone/core-status/status.schema.json` (A66).
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /status` (AE-5). */
const STATUS: AdminEndpoint = {
  path: "/status",
  answer: ({ snapshot, nowNs }) => {
    // A clock read before the start was published (never on one thread's clock): shown as 0.
    const uptimeMs = Math.max(0, Number((nowNs - BigInt(snapshot.startedNs)) / 1_000_000n));
    return { status: 200, body: { ...snapshot.status, uptimeMs } };
  },
};

/** `core-status`'s endpoint, which the admin route table mounts (`../../admin/routes.ts`). */
export const CORE_STATUS_ENDPOINTS: AdminPart = Object.freeze({
  id: "core-status",
  endpoints: Object.freeze([Object.freeze(STATUS)]),
});
