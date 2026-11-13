/**
 * The `token-metadata-api` module: `token-metadata`'s tokens over HTTP. A public module, not one of the core's: a
 * configuration enables it with `TOKEN_METADATA_API.entry(...)`, beside `TOKEN_METADATA`'s entry.
 *
 * - **One route**, under the module's namespace: `POST /token-metadata-api/v1/tokens`, whose JSON body selects tokens
 *   by colors, by contract, by contract and domain separator, or by all three with the kind, and whose answer gives
 *   each token with every defined field. Its body and answer are checked against their TypeBox schemas; the
 *   documentation is `docs/token-metadata-api.md`.
 * - **Files by role**: `./schemas.ts` the request and answer schemas and their types, `./routes.ts` the routes,
 *   `./handlers.ts` what each route answers, `./sql.ts` every statement it sends, and `./router.ts` the typed router
 *   that registers the routes, checks bodies and answers, and maps errors.
 * - **Requires** `token-metadata`'s two `table` items (`../token-metadata/schema.ts`), so startup refuses it in a
 *   configuration without `token-metadata` at its heights, and it reads those tables at each answer's committed
 *   height (`./sql.ts`).
 * - **Holds no state**: no tables, no migrations, nothing per block, only `on-start-api`. Added to a database whose
 *   indexer already ran (from a height above the cursor, as any added entry), it answers as if it had run from S.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";
import { TOKEN_METADATA_EVENTS_ITEM, TOKEN_METADATA_STATE_ITEM } from "../token-metadata/schema.js";
import { registerRoutes } from "./router.js";
import { ROUTES } from "./routes.js";

/** The module's id. */
export const TOKEN_METADATA_API_ID = "token-metadata-api";

/** The `token-metadata-api` module. */
export const TOKEN_METADATA_API = defineModule({
  id: TOKEN_METADATA_API_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: [TOKEN_METADATA_EVENTS_ITEM, TOKEN_METADATA_STATE_ITEM],
  provides: [],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {
    async "on-start-api"(_p, api) {
      registerRoutes(api, TOKEN_METADATA_API_ID, ROUTES);
    },
  },
});
