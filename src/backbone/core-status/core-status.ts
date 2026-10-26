/**
 * The backbone part `core-status`'s admin endpoint (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-3, AE-5, AE-6; CORE-ARCH §4.18; decision record Q70): `GET /status`, a function of the snapshot the runner
 * publishes, which the admin worker runs (`../../admin/`).
 *
 * It answers 200 with the published status — the state (AE-3), readiness, the conditions, the cursor, the head, the
 * lag (heights as decimal text) and, for `refused` and `halted`, the reason as a sanitized error (its code, height,
 * module and point; no raw exception message, AE-6). Task 8.1 mounts it with this minimal body; task 8.3 completes the
 * part: AE-5's other fields, its JSON schema (A66), A67 and A140, and its declaration.
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /status` (AE-5). */
const STATUS: AdminEndpoint = {
  path: "/status",
  answer: ({ snapshot }) => ({ status: 200, body: snapshot.status }),
};

/** `core-status`'s endpoint. */
export const CORE_STATUS: AdminPart = Object.freeze({ id: "core-status", endpoints: Object.freeze([Object.freeze(STATUS)]) });
