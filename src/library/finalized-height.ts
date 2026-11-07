/**
 * `finalizedHeight`: the height of a node's finalized head, which a host program gives as S — the start of a new
 * database — when it starts UmbraDB at the chain's head. [LM-1, D-8; design §4]
 *
 * It asks the node at `node` (a `ws://` or `wss://` URL) for its finalized head and that block's header
 * (`chain_getFinalizedHead`, `chain_getHeader`), over one connection of its own (`../node/client.ts`), closed before it
 * settles. The node client retries an unreachable node with its back-off; `finalizedHeight` bounds the whole answer by
 * `timeoutMs` (30 s unless given) and then rejects with `node-unreachable` (`reason: timeout`). Aborting `signal` ends
 * it at once with the signal's reason, as `fetch` does. Neither its errors nor its messages name the node's URL, which
 * is a `secret` setting. [LM-1, IN-10, CF-4]
 */

import { UmbraError } from "../db/errors.js";
import { NodeClient } from "../node/client.js";

/** `finalizedHeight`'s `timeoutMs` unless given: the node client's own call timeout. */
export const FINALIZED_HEIGHT_TIMEOUT_MS = 30_000;

/** The longest timer Node.js and the browsers keep: 2^31 − 1 ms. */
const MAX_TIMEOUT_MS = 2_147_483_647;

/** What {@link finalizedHeight} takes besides the node. [LM-1] */
export interface FinalizedHeightOptions {
  /** Ends the request at once, rejecting with its reason. */
  readonly signal?: AbortSignal;
  /** How long the whole answer may take, in milliseconds, from 1 to 2^31 − 1; 30 000 unless given. */
  readonly timeoutMs?: number;
}

/** The refusal of a malformed option of {@link finalizedHeight}, naming it, as `startUmbraDB`'s options are refused. */
function invalidOption(option: "options" | "signal" | "timeoutMs", message: string): UmbraError {
  return new UmbraError("invalid-configuration", `finalizedHeight's ${option} ${message}`, {
    reason: "invalid-option",
    option,
  });
}

/** The rejection once `timeoutMs` passed without the node's answer. [IN-10] */
function timedOut(timeoutMs: number): UmbraError {
  return new UmbraError("node-unreachable", `finalizedHeight: the node did not answer within ${timeoutMs} ms`, {
    reason: "timeout",
    timeoutMs,
  });
}

/**
 * The height of the finalized head of the node at `node` (see the module comment). Rejects with `node-unreachable`
 * after `timeoutMs`, with the signal's reason when `signal` aborts, with `invalid-configuration` for a `node` that is no
 * WebSocket URL (`reason: not-a-url`, `not-a-websocket-url`) or a malformed option (`reason: invalid-option`), and with
 * the node's own failure when it answers with an error. [LM-1, L53]
 */
export async function finalizedHeight(node: string, options: FinalizedHeightOptions = {}): Promise<bigint> {
  if (typeof options !== "object" || options === null) throw invalidOption("options", "is an object of signal and timeoutMs");
  const { signal, timeoutMs = FINALIZED_HEIGHT_TIMEOUT_MS } = options;
  if (signal !== undefined && !(signal instanceof AbortSignal)) throw invalidOption("signal", "is an AbortSignal");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_TIMEOUT_MS) {
    throw invalidOption("timeoutMs", `is a whole number of milliseconds from 1 to ${MAX_TIMEOUT_MS}`);
  }
  signal?.throwIfAborted();
  const client = new NodeClient({ url: node, callTimeoutMs: timeoutMs });
  const ends = new AbortController();
  const timer = setTimeout(() => ends.abort(timedOut(timeoutMs)), timeoutMs);
  const aborted = (): void => ends.abort(signal?.reason);
  signal?.addEventListener("abort", aborted, { once: true });
  try {
    const hash = await client.finalizedHead({ signal: ends.signal });
    const header = await client.header(hash, { signal: ends.signal });
    return header.number;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", aborted);
    await client.close();
  }
}
