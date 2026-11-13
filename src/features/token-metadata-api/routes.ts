/**
 * The routes of `token-metadata-api`, the core's typed routes (`../../helpers/typed-routes.ts`), each with its method,
 * path, input and answer schemas (`./schemas.ts`) and its handler (`./handlers.ts`). They are served under the
 * module's namespace, `/token-metadata-api/`.
 */

import { typedRoute } from "../../helpers/typed-routes.js";
import { selectTokens } from "./handlers.js";
import { TokensRequest, TokensResponse } from "./schemas.js";

/** The module's routes: one, `POST /v1/tokens`. */
export const ROUTES = [typedRoute({ method: "POST", path: "/v1/tokens", input: TokensRequest, response: TokensResponse, handle: selectTokens })];
