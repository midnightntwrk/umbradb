/**
 * The admin route table (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1; `design.md` §1; CORE-ARCH
 * §4.18; decision record Q70): the endpoints of the backbone parts `core-health` (`/health/live`, `/health/ready`),
 * `core-status` (`/status`) and `core-config` (`/config`), mounted by their exact paths. Only backbone parts provide
 * admin endpoints ({@link adminRoutes} refuses any other part: a module's endpoints are on the module API listener,
 * RN-15). A request is answered by {@link answerAdmin}: `GET` of a mounted path — its query aside — runs that endpoint's
 * function of the snapshot; any other method or path is 404 `not-found` ({@link NOT_FOUND}); an endpoint that throws is
 * 500 `internal-error` with a fixed message, nothing of the error (AE-6).
 *
 * Imports nothing of Node.js, so the admin worker runs it, and so can the browser build's worker over its message
 * channel (task 16.x).
 */

import { CORE_CONFIG } from "../backbone/core-config/core-config.js";
import { CORE_HEALTH_ENDPOINTS } from "../backbone/core-health/endpoints.js";
import { CORE_STATUS } from "../backbone/core-status/core-status.js";
import { BACKBONE_ORDER } from "../modules/graph.js";
import type { AdminAnswer, AdminEndpoint, AdminPart, AdminView } from "./types.js";

/** Mounted endpoints by path. */
export type AdminRoutes = ReadonlyMap<string, AdminEndpoint>;

/** The backbone parts that provide the admin endpoints, in `BACKBONE_ORDER`'s order. */
export const ADMIN_PARTS: readonly AdminPart[] = Object.freeze([CORE_HEALTH_ENDPOINTS, CORE_STATUS, CORE_CONFIG]);

/** A frozen map: `set`, `delete` and `clear` throw. */
function frozenMap<K, V>(entries: Iterable<readonly [K, V]>): ReadonlyMap<K, V> {
  const map = new Map(entries);
  const refuse = (): never => {
    throw new TypeError("the admin route table cannot change");
  };
  return Object.freeze(Object.assign(map, { set: refuse, delete: refuse, clear: refuse }));
}

/**
 * The route table of `parts`: each part's endpoints by path. Throws a `TypeError` for a part that is no backbone part
 * (AE-1, Q70), for a path two endpoints give, and for a path that does not start with `/`.
 */
export function adminRoutes(parts: readonly AdminPart[]): AdminRoutes {
  const routes = new Map<string, { readonly part: string; readonly endpoint: AdminEndpoint }>();
  for (const part of parts) {
    if (!BACKBONE_ORDER.includes(part.id)) {
      throw new TypeError(`admin endpoints come from backbone parts only (AE-1, Q70): ${part.id} is not a backbone part`);
    }
    for (const endpoint of part.endpoints) {
      if (!endpoint.path.startsWith("/")) {
        throw new TypeError(`${part.id}'s admin endpoint path ${JSON.stringify(endpoint.path)} does not start with /`);
      }
      const earlier = routes.get(endpoint.path);
      if (earlier !== undefined) {
        throw new TypeError(`the admin endpoint ${endpoint.path} is given twice: by ${earlier.part} and by ${part.id}`);
      }
      routes.set(endpoint.path, { part: part.id, endpoint });
    }
  }
  return frozenMap([...routes].map(([path, { endpoint }]) => [path, endpoint] as const));
}

/** The admin endpoints the admin worker serves: {@link ADMIN_PARTS}'. */
export const ADMIN_ROUTES: AdminRoutes = adminRoutes(ADMIN_PARTS);

/** The answer to any method or path that is no admin endpoint (AE-1). */
export const NOT_FOUND: AdminAnswer = Object.freeze({
  status: 404,
  body: Object.freeze({ error: Object.freeze({ code: "not-found", message: "no admin endpoint has this method and path" }) }),
});

/** The answer of an endpoint that threw: a fixed message, nothing of the error (AE-6). */
export const FAILED: AdminAnswer = Object.freeze({
  status: 500,
  body: Object.freeze({ error: Object.freeze({ code: "internal-error", message: "the admin endpoint failed" }) }),
});

/** The answer of `routes` to `method url` (its path, the query aside) from `view` (see the module comment). */
export function answerAdmin(routes: AdminRoutes, method: string, url: string, view: AdminView): AdminAnswer {
  const query = url.indexOf("?");
  const endpoint = method === "GET" ? routes.get(query < 0 ? url : url.slice(0, query)) : undefined;
  if (endpoint === undefined) return NOT_FOUND;
  try {
    return endpoint.answer(view);
  } catch {
    return FAILED;
  }
}
