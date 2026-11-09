/**
 * The backbone part `core-status`'s admin endpoint: `GET /status`, a function of the snapshot the runner publishes and
 * of the clock at the request, run by the admin worker (`../../admin/`). It reads nothing else and imports nothing at
 * run time, so the worker can run it, and so can the browser build.
 *
 * It answers 200 with the published status (`StatusSnapshot`, built on the main thread by `snapshotOf`,
 * `../../admin/snapshot.ts`) and the uptime at the request. Each field is null where nothing reports a value yet:
 * - the process state, readiness and the conditions;
 * - the cursor, the finalized head and the lag, with heights as decimal text;
 * - for `refused` and `halted`, the reason as a sanitized error: its code, height, module and point, a message built
 *   from those alone, and allowlisted details, never a raw exception message;
 * - the instance's role;
 * - the last commit's wall-clock time as RFC 3339 UTC text;
 * - the node as the core sees it;
 * - every part of the database with its tables' digest rows;
 * - the ledger, the private instances and the public side;
 * - `uptimeMs`: the milliseconds since the process started, by the monotonic clock every thread reads alike
 *   (`process.hrtime.bigint()`), computed here at each request rather than published every second.
 *
 * The body's JSON schema is `test/backbone/core-status/status.schema.json`.
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /status`. */
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
