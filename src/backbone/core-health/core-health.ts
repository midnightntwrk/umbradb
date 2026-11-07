/**
 * The backbone part `core-health`. It provides `GET /health/live` and `GET /health/ready` (`./endpoints.ts`), which
 * the admin worker runs on the snapshot the runner publishes. It has no point, requires no item and provides none.
 * [AE-1, AE-2, AE-4, Q70; CORE-ARCH §4.11, §4.18]
 *
 * Its declaration ({@link CORE_HEALTH}) makes it a part of the build like every backbone part. It is validated as one,
 * placed after `core-digest` in the fixed backbone order, and included in the command's build
 * (`../../cli/build-modules.ts`). Like any part of the graph that is not one of UmbraDB's own (`OWN_PARTS`), it gets
 * an empty schema and role in the database, as `core-block-fetch` does; nothing runs under it.
 * [RN-2, RN-3, MD-2, DB-6, DB-8]
 *
 * The admin route table always serves the four admin endpoints, whatever the build carries, so this declaration is
 * what the build and the graph know of the part, not what serves it. [AE-1]
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
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis. [Q96]
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {},
  }),
);
