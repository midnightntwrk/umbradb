/** Constants shared by the server module and the client (spec §5.7, FR-081). */

/**
 * The version of every wire format and of the manifest. A change to any layout below changes it. 3: the manifest names
 * the PIR scheme, and a call body after its header is the scheme's bytes (spec 00058 FR-003, FR-022).
 */
export const FORMAT_VERSION = 3;

/** Route prefix of the module's HTTP API. */
export const ROUTE_PREFIX = "/pss/v1";

export const ROUTES = Object.freeze({
  manifest: `${ROUTE_PREFIX}/manifest`,
  /** Followed by the artifact's SHA-256 digest in lower-case hex. */
  blob: `${ROUTE_PREFIX}/blob/`,
  tail: `${ROUTE_PREFIX}/tail`,
  queryRead: `${ROUTE_PREFIX}/query/read`,
  queryNullifier: `${ROUTE_PREFIX}/query/nullifier`,
  /** Lower Merkle paths, read only to spend (Q58). */
  queryPath: `${ROUTE_PREFIX}/query/path`,
  adminSnapshot: `${ROUTE_PREFIX}/admin/snapshot`,
  /** The Dust file's manifest, JSON (spec 00062 FR-011). */
  dustManifest: `${ROUTE_PREFIX}/dust/manifest`,
  /** Followed by the chunk's number. */
  dustChunk: `${ROUTE_PREFIX}/dust/chunk/`,
  /** `GET …/dust/chunks?from=<first chunk>&entries=<the manifest's entry count>`: those chunks, one after another. */
  dustChunks: `${ROUTE_PREFIX}/dust/chunks`,
  /** With `?owner=<Dust public key, decimal>`: that owner's first coins and generation updates, JSON. */
  dustCoins: `${ROUTE_PREFIX}/dust/coins`,
  /** The Dust parameters in force, JSON. */
  dustParameters: `${ROUTE_PREFIX}/dust/parameters`,
  /** The Dust check table's manifest (`./dust-check.ts`), canonical JSON. */
  dustCheckManifest: `${ROUTE_PREFIX}/dust/check/manifest`,
  /** Followed by the SHA-256 of one of the Dust check table's files: its public artifact. */
  dustCheckBlob: `${ROUTE_PREFIX}/dust/check/blob/`,
  /** A query call to the Dust check table, the check's identifier in place of the snapshot's. */
  dustCheckQuery: `${ROUTE_PREFIX}/dust/check/query`,
  /** A query call to the Dust path table (each position's lower Merkle path), read only to spend (phase 9). */
  dustPathQuery: `${ROUTE_PREFIX}/dust/check/path`,
});

/** Default vectors per query call (FR-065). */
export const DEFAULT_QUERIES_PER_CALL = 32;

/** Default tree cut, `k` levels above the leaves (FR-040). */
export const DEFAULT_PATH_SPLIT = 16;

/** Height of the Zswap commitment tree. */
export const TREE_HEIGHT = 32;

/** Content type of every binary body. */
export const OCTET_STREAM = "application/octet-stream";
