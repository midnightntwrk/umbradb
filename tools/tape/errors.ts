/**
 * The test tape's two errors (TT-1, TT-2; task 9.1). Neither is an `UmbraError` code: the tape is test tooling, not
 * part of the package (`openspec/changes/core-arch/design.md` §1: `tools/tape/`, unexported), and `ERROR_CODES` is the
 * vocabulary of the exported `ErrorCode` (§12), which §11's refusals and halts draw on; neither error is a refusal or a
 * halt of the indexer.
 *
 * - **`bad-tape-record`** ({@link TapeError}): a tape the reader cannot read, or records the writer or the tape node
 *   cannot take, with the line it is at (counting from 1) and why (`reason`).
 * - **`not-on-tape`**: the tape node's JSON-RPC error for a call no record answers ({@link NOT_ON_TAPE_RPC_CODE}). The
 *   node client (`src/node/`) reads it as a `node-error` (`reason: rpc-error`), which it never retries; it halts the
 *   part that made the call (IN-9 and RN-8), so a test whose indexer calls something its tape lacks fails at once,
 *   naming the method, instead of hanging on retries.
 */

/** Why a line is not a tape record (`TapeError.reason`). */
export type TapeProblem =
  /** The line's bytes are not UTF-8. */
  | "not-utf8"
  /** The file's last record has no newline after it. */
  | "no-final-newline"
  /** A line holds nothing. */
  | "empty-line"
  /** The line is not JSON. */
  | "not-json"
  /** The line is JSON but not an object. */
  | "not-a-record"
  /** The object has no field naming a record kind (`method`, `subscribe`, `notify`, `disconnect`, `fault`). */
  | "unknown-kind"
  /** A field its kind does not have. */
  | "unexpected-field"
  /** A field its kind needs is missing. */
  | "missing-field"
  /** `method` is not a non-empty string. */
  | "bad-method"
  /** `params` is not an array or an object. */
  | "bad-params"
  /** A call has both `result` and `error`. */
  | "result-and-error"
  /** `delayMs` is not an integer from 0 to 2^31 − 1 (the longest timer Node.js keeps). */
  | "bad-delay"
  /** A `subscribe` or `notify` id is not a string or a safe integer. */
  | "bad-subscription-id"
  /** `disconnect` is not `true`. */
  | "bad-disconnect"
  /** `fault` is not `"timeout"` or `"error"`. */
  | "bad-fault"
  /** A fault's `code` is not a safe integer. */
  | "bad-code"
  /** A value JSON cannot hold, or nested deeper than the writer writes. */
  | "not-json-value"
  /** A notification whose id no earlier `subscribe` record of the same session holds. */
  | "unknown-subscription"
  /** A `subscribe` record whose id an earlier one of the same session holds. */
  | "duplicate-subscription"
  /** A record written otherwise than the writer writes it (fields out of order, spaces, another spelling). */
  | "not-canonical";

/** `bad-tape-record`: a line that is not a tape record, or a record the tape tools cannot take. */
export class TapeError extends Error {
  readonly code = "bad-tape-record";

  constructor(
    /** The line, counting from 1 (for records given as values: their place in the list, counting from 1). */
    readonly line: number,
    readonly reason: TapeProblem,
    detail: string,
  ) {
    super(`bad-tape-record at line ${line}: ${detail}`);
    this.name = "TapeError";
  }
}

/**
 * The JSON-RPC error code of `not-on-tape`, in JSON-RPC 2.0's range for implementation-defined server errors (−32000 to
 * −32099). The node client gives a meaning only to −32999 (the node's rate limit, retried) and to Substrate's "State
 * already discarded" text (`src/node/errors.ts`), and `not-on-tape` carries neither: it reads as a plain error answer.
 */
export const NOT_ON_TAPE_RPC_CODE = -32090;

/** The code of a `fault: "error"` record without one: JSON-RPC 2.0's "Internal error". */
export const FAULT_RPC_CODE = -32603;
