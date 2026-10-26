/**
 * The backbone part `core-status` (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1, AE-5, AE-6;
 * `specs/runner/spec.md` RN-2, RN-3; CORE-ARCH §4.11, §4.18; decision record Q70): it provides `GET /status`
 * (`./endpoints.ts`), which the admin worker runs on the snapshot the runner publishes, and has no point, requires no
 * item and provides none (CORE-ARCH §4.11: "None; as above"). Its declaration ({@link CORE_STATUS}) makes it a part of
 * the build like every backbone part, as `core-health`'s does (`../core-health/core-health.ts`): validated as one
 * (MD-2), in RN-3's fixed order after `core-health`, in the command's build (`../../cli/build-modules.ts`); the
 * database gets its empty schema and role (DB-6, DB-8), and nothing runs under it.
 *
 * The admin route table mounts the endpoint whatever the build carries (AE-1), so this declaration is what the build
 * and the graph know of the part, not what serves it.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";

/** `core-status` (see the module comment): no points, no items, no migrations; it starts with the core, at S. */
export const CORE_STATUS = Object.freeze(
  defineModule({
    id: "core-status",
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
