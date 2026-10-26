/**
 * The backbone part `core-config`'s admin endpoint (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1,
 * AE-5, AE-6; CORE-ARCH §4.18; decision record Q70): `GET /config`, a function of the snapshot the runner publishes,
 * which the admin worker runs (`../../admin/`). It reads nothing else and imports nothing at run time, so the worker
 * runs it, and so can the browser build's.
 *
 * It answers 200 with the published configuration (`ConfigSnapshot`, built on the main thread by `configOf`,
 * `../../admin/configuration.ts`): the process's `core` revision (Q102) and every entry in effect, each secret field
 * and each credential in a URL as `[redacted]` (CF-4, AE-6); the configuration history as recorded; the parts of the
 * database with their declarations, without callbacks; the chain identity; the ledger version table in effect with
 * the build's package identities; the database's backend, version and writer lock; the build — null where nothing is
 * known yet (before the configuration is validated, the build only). The body's JSON schema is
 * `test/backbone/core-config/config.schema.json` (A66).
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /config` (AE-5). */
const CONFIG: AdminEndpoint = {
  path: "/config",
  answer: ({ snapshot }) => ({ status: 200, body: snapshot.config }),
};

/** `core-config`'s endpoint, which the admin route table mounts (`../../admin/routes.ts`). */
export const CORE_CONFIG_ENDPOINTS: AdminPart = Object.freeze({
  id: "core-config",
  endpoints: Object.freeze([Object.freeze(CONFIG)]),
});
