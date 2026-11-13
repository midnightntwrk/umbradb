/** Constants shared by the server module and the client (spec §5.7, FR-081). */

/** The version of every wire format and of the manifest. A change to any layout below changes it. */
export const FORMAT_VERSION = 1;

/** Route prefix of the module's HTTP API. */
export const ROUTE_PREFIX = "/pss/v1";

export const ROUTES = Object.freeze({
  manifest: `${ROUTE_PREFIX}/manifest`,
  /** Followed by the artifact's SHA-256 digest in lower-case hex. */
  blob: `${ROUTE_PREFIX}/blob/`,
  tail: `${ROUTE_PREFIX}/tail`,
  queryRead: `${ROUTE_PREFIX}/query/read`,
  queryNullifier: `${ROUTE_PREFIX}/query/nullifier`,
  adminSnapshot: `${ROUTE_PREFIX}/admin/snapshot`,
});

/** Default vectors per query call (FR-065). */
export const DEFAULT_QUERIES_PER_CALL = 32;

/** Default tree cut, `k` levels above the leaves (FR-040). */
export const DEFAULT_PATH_SPLIT = 16;

/** Height of the Zswap commitment tree. */
export const TREE_HEIGHT = 32;

/** Content type of every binary body. */
export const OCTET_STREAM = "application/octet-stream";
