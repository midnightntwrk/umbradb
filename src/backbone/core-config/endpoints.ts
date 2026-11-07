/**
 * The backbone part `core-config`'s admin endpoint: `GET /config`, a function of the snapshot the runner publishes,
 * run by the admin worker (`../../admin/`). It reads nothing else and imports nothing at run time, so the worker can
 * run it, and so can the browser build. [AE-1, AE-5, Q70; CORE-ARCH §4.18]
 *
 * It answers 200 with the published configuration (`ConfigSnapshot`, built on the main thread by `configOf`,
 * `../../admin/configuration.ts`). Each part is null where nothing is known yet (before the configuration is
 * validated, only the build is known):
 * - the process's `core` revision and every entry in effect, with each secret field and each credential in a URL shown
 *   as `[redacted]` [Q102, CF-4, AE-6];
 * - the configuration history as recorded;
 * - the parts of the database with their declarations, without callbacks;
 * - the chain identity;
 * - the ledger version table in effect, with the build's package identities;
 * - the database's backend, version and writer lock;
 * - the build.
 *
 * The body's JSON schema is `test/backbone/core-config/config.schema.json`. [A66]
 */

import type { AdminEndpoint, AdminPart } from "../../admin/types.js";

/** `GET /config`. [AE-5] */
const CONFIG: AdminEndpoint = {
  path: "/config",
  answer: ({ snapshot }) => ({ status: 200, body: snapshot.config }),
};

/** `core-config`'s endpoint, which the admin route table mounts (`../../admin/routes.ts`). */
export const CORE_CONFIG_ENDPOINTS: AdminPart = Object.freeze({
  id: "core-config",
  endpoints: Object.freeze([Object.freeze(CONFIG)]),
});
