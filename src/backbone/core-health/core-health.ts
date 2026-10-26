/**
 * The backbone part `core-health` (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1, AE-2, AE-4;
 * `specs/runner/spec.md` RN-2, RN-3; CORE-ARCH §4.11, §4.18; decision record Q70): it provides `GET /health/live` and
 * `GET /health/ready` (`./endpoints.ts`), which the admin worker runs on the snapshot the runner publishes, and has no
 * point, requires no item and provides none (CORE-ARCH §4.11's backbone table: "None; the admin worker runs its
 * endpoints on the published state"). Its declaration ({@link CORE_HEALTH}) makes it a part of the build like every
 * backbone part: validated as one (MD-2), in RN-3's fixed order after `core-digest`, in the command's build
 * (`../../cli/build-modules.ts`). Like any part of the graph that is not one of UmbraDB's own (`OWN_PARTS`), the
 * database gets its empty schema and role (DB-6, DB-8), as `core-block-fetch` does; nothing runs under it.
 *
 * The admin route table mounts the endpoints whatever the build carries (AE-1: the four endpoints are always served),
 * so this declaration is what the build and the graph know of the part, not what serves it.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";

/** `core-health` (see the module comment): no points, no items, no migrations; it starts with the core, at S. */
export const CORE_HEALTH = Object.freeze(
  defineModule({
    id: "core-health",
    version: UMBRADB_VERSION,
    side: "public",
    requires: [],
    provides: [],
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis (task 3.2's note (e), Q96).
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {},
  }),
);
