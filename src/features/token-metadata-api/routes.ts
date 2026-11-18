/**
 * The routes of `token-metadata-api` (`../../modules/route.ts`): each an operation with a name, its input and output
 * schemas (`./schemas.ts`) and its handler (`./handlers.ts`), and no transport. The module registers them with the
 * core from `on-start-api` (`api.route`); `http` only says where HTTP serves each, under `/token-metadata-api`.
 */

import { defineRoute } from "../../modules/route.js";
import { selectTokens } from "./handlers.js";
import { TokensRequest, TokensResponse } from "./schemas.js";

/** `token-metadata-api.getTokens`, over HTTP `POST /token-metadata-api/v1/tokens`. */
export const getTokens = defineRoute({
  name: "getTokens",
  description: "The described tokens a selector names (colors, a contract, a contract and domain separator, or one token), each with its fields, symbol group and mark.",
  input: TokensRequest,
  output: TokensResponse,
  http: { method: "POST", path: "/v1/tokens" },
  handle: (input, { read }) => selectTokens(input, read),
});

/** The module's routes: one. */
export const ROUTES = [getTokens] as const;
