/**
 * The backbone part `core-config`'s admin endpoint (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-5, AE-6; CORE-ARCH §4.18; decision record Q70): `GET /config`, a function of the snapshot the runner publishes,
 * which the admin worker runs (`../../admin/`).
 *
 * It answers 200 with the published configuration: the process's `core` revision (Q102) — its start, and its settings
 * with every `secret` field and every credential in a URL as `[redacted]` (CF-4, AE-6) —, null before the configuration
 * is validated. Task 8.1 mounts it with this minimal body; task 8.4 completes the part: AE-5's other fields (the entries
 * in effect and the history, the modules, the chain identity, the ledger table, the database, the build), its JSON
 * schema (A66), A29 and A140, and its declaration.
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /config` (AE-5). */
const CONFIG: AdminEndpoint = {
  path: "/config",
  answer: ({ snapshot }) => ({ status: 200, body: snapshot.config }),
};

/** `core-config`'s endpoint. */
export const CORE_CONFIG: AdminPart = Object.freeze({ id: "core-config", endpoints: Object.freeze([Object.freeze(CONFIG)]) });
