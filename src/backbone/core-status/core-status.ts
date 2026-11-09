/**
 * The backbone part `core-status`. It provides `GET /status` (`./endpoints.ts`), which the admin worker runs on the
 * snapshot the runner publishes. It has no point, requires no item and provides none.
 *
 * Its declaration ({@link CORE_STATUS}) makes it a part of the build like every backbone part, as `core-health`'s does
 * (`../core-health/core-health.ts`). It is validated as one, placed after `core-health` in the fixed backbone order,
 * and included in the command's build (`../../cli/build-modules.ts`). The database gets its empty schema and role, and
 * nothing runs under it.
 *
 * The admin route table mounts the endpoint whatever the build carries, so this declaration is what the build and the
 * graph know of the part, not what serves it.
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
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis.
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {},
  }),
);
