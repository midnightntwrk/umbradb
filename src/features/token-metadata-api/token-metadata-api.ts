/**
 * The `token-metadata-api` module: `token-metadata`'s tokens over HTTP. A public module, not one of the core's: a
 * configuration enables it with `TOKEN_METADATA_API.entry(...)`, beside `TOKEN_METADATA`'s entry.
 *
 * - **One route**, under the module's namespace: `POST /token-metadata-api/v1/tokens`, whose JSON body selects tokens
 *   by colors, by contract, by contract and domain separator, or by all three with the kind (`./schemas.ts`), and
 *   whose answer gives each token with every defined field (`./tokens.ts`). Its body and answer are checked against
 *   their TypeBox schemas (`./router.ts`); the documentation is `docs/token-metadata-api.md`.
 * - **Requires** `token-metadata`'s two `table` items (`../token-metadata/schema.ts`), so startup refuses it in a
 *   configuration without `token-metadata` at its heights, and it reads those tables at each answer's committed
 *   height (`./queries.ts`).
 * - **Holds no state**: no tables, no migrations, nothing per block, only `on-start-api`. Added to a database whose
 *   indexer already ran (from a height above the cursor, as any added entry), it answers as if it had run from S.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";
import { EVENTS_ITEM, STATE_ITEM } from "../token-metadata/schema.js";
import { registerRoutes, route } from "./router.js";
import { TokensRequest, TokensResponse } from "./schemas.js";
import { selectTokens } from "./tokens.js";

/** The module's id. */
export const TOKEN_METADATA_API_ID = "token-metadata-api";

/** The module's routes, under `/token-metadata-api/`: one, `POST /v1/tokens` (`./tokens.ts`). */
const ROUTES = [route({ method: "POST", path: "/v1/tokens", body: TokensRequest, response: TokensResponse, handle: selectTokens })];

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
      registerRoutes(api, TOKEN_METADATA_API_ID, ROUTES);
    },
  },
});
