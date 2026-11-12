/**
 * The routes of `token-metadata-api`, each with its method, path, body and answer schemas (`./schemas.ts`) and its
 * handler (`./handlers.ts`). They are served under the module's namespace, `/token-metadata-api/`.
 */

import { route } from "./router.js";
import { selectTokens } from "./handlers.js";
import { TokensRequest, TokensResponse } from "./schemas.js";

/** The module's routes: one, `POST /v1/tokens`. */
export const ROUTES = [route({ method: "POST", path: "/v1/tokens", body: TokensRequest, response: TokensResponse, handle: selectTokens })];
