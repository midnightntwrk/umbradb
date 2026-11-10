/**
 * The `token-metadata-api` module: the `/v1` API of `docs/token-metadata-api.md` over `token-metadata`'s tables. A
 * public module, not one of the core's: a configuration enables it with `TOKEN_METADATA_API.entry(...)`, beside
 * `TOKEN_METADATA`'s entry.
 *
 * - **Requires** `token-metadata`'s two `table` items (`../token-metadata/schema.ts`), so startup refuses it in a
 *   configuration without `token-metadata` at its heights, and it reads those tables as they are at each answer's
 *   committed height.
 * - **Holds no state**: no tables, no migrations, nothing per block. Its routes (`./api.ts`) are registered in
 *   `on-start-api`. Added to a database whose indexer already ran (from a height above the cursor, as any added
 *   entry), it answers as if it had run from S: each answer depends only on `token-metadata`'s rows.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";
import { EVENTS_ITEM, STATE_ITEM } from "../token-metadata/schema.js";
import { registerMetadataApi } from "./api.js";

/** The module's id. */
export const TOKEN_METADATA_API_ID = "token-metadata-api";

/** The `token-metadata-api` module. */
export const TOKEN_METADATA_API = defineModule({
  id: TOKEN_METADATA_API_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: [EVENTS_ITEM, STATE_ITEM],
  provides: [],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {
    async "on-start-api"(_p, api) {
      registerMetadataApi(api);
    },
  },
});
