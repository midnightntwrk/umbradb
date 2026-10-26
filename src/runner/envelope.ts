/**
 * The chain-data envelope's helpers (`openspec/changes/core-arch/specs/runner/spec.md` RN-16; CORE-ARCH §4.4, §4.20):
 * a module that wants its answers to state the view they answer from — `finalized`, the only view of this version
 * (IN-1) — and the height and hash of the committed height its read sees calls them itself, so a client knows what it
 * was told without the body changing: over HTTP as the headers `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash`
 * ({@link chainDataHeaders}, {@link answerChainData}), and in a GraphQL response's `extensions`, its `data` unchanged
 * ({@link withViewExtensions}). The core applies none of them: a module's answer is the module's (owner decisions Q104,
 * Q105; task 5.2b). The `X-Umbra-` prefix holds the headers every module shares: these three, which a module writes
 * with the helpers, and `X-Umbra-Version`, the build's version, which the module API's listener sets on every HTTP
 * answer itself (`./api-server.ts`; owner decision Q131, task 5.2c). Before block S commits there is no committed
 * height, and the read's view ({@link readChainDataView}) fails with `no-committed-height`, which the module API
 * answers with HTTP 503 when the handler does not catch it.
 *
 * Heights are written as decimal strings and hashes as `0x`-prefixed lowercase hex, as the process transport writes
 * them (CORE-ARCH §4.14). The hash is read in the request's own read, so it is the hash of the height that read reports.
 * The module API mounts handlers on `listen.api` and gives each request its read (RN-15, DB-15): tasks 5.2a, 5.2b.
 */

import type { ReadHandle } from "../db/api.js";
import { UmbraError } from "../db/errors.js";

/** The view this version answers from: finalized data only (IN-1, RN-16). */
export const CHAIN_DATA_VIEW = "finalized";

/** The HTTP headers of the envelope (RN-16). */
export const CHAIN_DATA_HEADERS = Object.freeze({
  view: "X-Umbra-View",
  height: "X-Umbra-Height",
  hash: "X-Umbra-Hash",
} as const);

/** The HTTP status of a chain-data read before block S commits (RN-16). */
export const NO_COMMITTED_HEIGHT_STATUS = 503;

/** What a chain-data response answers from: the view, and the height and hash of the read's committed height. */
export interface ChainDataView {
  readonly view: typeof CHAIN_DATA_VIEW;
  readonly height: bigint;
  readonly hash: Uint8Array;
}

/** An HTTP answer, as an `ApiRegistry` handler gives it (CORE-ARCH §4.10). */
export interface ChainDataAnswer {
  readonly status: number;
  readonly headers?: Record<string, string>;
  readonly body: unknown;
}

const HASH_SQL = "SELECT hash FROM core_block_commit.blocks WHERE height = $1";

/** `0x` and the bytes in lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** `no-committed-height` (RN-16): no height has committed yet. */
function noCommittedHeight(): UmbraError {
  return new UmbraError(
    "no-committed-height",
    "no height has committed yet: chain data is answered once block S commits (RN-16)",
  );
}

/**
 * The view of `read`: `finalized`, its committed height, and that block's hash, read through `read` itself. Rejects with
 * `no-committed-height` before any height commits, asking nothing.
 */
export async function readChainDataView(read: ReadHandle): Promise<ChainDataView> {
  const { height } = read;
  if (height === null) throw noCommittedHeight();
  const [row] = await read.query(HASH_SQL, [height]);
  if (row === undefined) {
    throw new Error(
      `the read reports the committed height ${height}, which the cursor table does not hold: a read's committed ` +
        "height comes from the cursor table (cursorHeight)",
    );
  }
  return Object.freeze({ view: CHAIN_DATA_VIEW, height, hash: row.hash as Uint8Array });
}

/** The envelope's HTTP headers for `view`. */
export function chainDataHeaders(view: ChainDataView): Record<string, string> {
  return {
    [CHAIN_DATA_HEADERS.view]: view.view,
    [CHAIN_DATA_HEADERS.height]: String(view.height),
    [CHAIN_DATA_HEADERS.hash]: hex(view.hash),
  };
}

/**
 * A GraphQL response `body` with the view in its `extensions` — `view`, `height` and `hash`, beside the response's own
 * extensions, the view's winning on a name both have — and everything else, `data` included, unchanged. Throws for
 * `extensions` that are not an object.
 */
export function withViewExtensions<B extends object>(
  body: B,
  view: ChainDataView,
): Omit<B, "extensions"> & { readonly extensions: Record<string, unknown> } {
  const own = (body as { readonly extensions?: unknown }).extensions;
  if (own !== undefined && (typeof own !== "object" || own === null || Array.isArray(own))) {
    throw new TypeError("a GraphQL response's extensions must be an object (GraphQL's response format) to carry the view");
  }
  const extensions = { ...(own as object | undefined), view: view.view, height: String(view.height), hash: hex(view.hash) };
  return { ...body, extensions };
}

/**
 * Answers one chain-data HTTP request read through `read`: the view first, then `answer`'s answer with the envelope's
 * headers, which replace any header of the answer with one of their names (in any case). Before any height commits,
 * answers 503 with `no-committed-height` without calling `answer`. Any other error passes on.
 */
export async function answerChainData(
  read: ReadHandle,
  answer: (view: ChainDataView) => Promise<ChainDataAnswer>,
): Promise<ChainDataAnswer> {
  let view: ChainDataView;
  try {
    view = await readChainDataView(read);
  } catch (error) {
    if (!(error instanceof UmbraError && error.code === "no-committed-height")) throw error;
    return {
      status: NO_COMMITTED_HEIGHT_STATUS,
      headers: {},
      body: { error: { code: error.code, message: error.message } },
    };
  }
  const answered = await answer(view);
  const envelope = chainDataHeaders(view);
  const names = new Set(Object.keys(envelope).map((name) => name.toLowerCase()));
  const own = Object.entries(answered.headers ?? {}).filter(([name]) => !names.has(name.toLowerCase()));
  return { ...answered, headers: { ...Object.fromEntries(own), ...envelope } };
}
