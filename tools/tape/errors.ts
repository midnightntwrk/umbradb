/**
 * The test tape's errors. None is an `UmbraError` code: the tape is test tooling, not part of the package
 * (`tools/tape/` is unexported), and `ERROR_CODES` is the vocabulary of the exported `ErrorCode`, which the indexer's
 * refusals and halts draw on. None of these is a refusal or a halt of the indexer. [TT-1 to TT-4; design §1, §11, §12]
 *
 * - **`bad-tape-record`** ({@link TapeError}): a tape the reader cannot read, or records the writer or the tape node
 *   cannot take, with the line it is at (counting from 1) and why (`reason`).
 * - **`not-on-tape`**: the tape node's JSON-RPC error for a call no record answers ({@link NOT_ON_TAPE_RPC_CODE}). The
 *   node client (`src/node/`) reads it as a `node-error` (`reason: rpc-error`), which it never retries; it halts the
 *   part that made the call, so a test whose indexer calls something its tape lacks fails at once, naming the method,
 *   instead of hanging on retries [IN-9, RN-8].
 * - **`cannot-record`** ({@link RecordingError}): a frame the recording builder cannot record so that the tape node
 *   replays it byte for byte, with the session, the side it came from and why (`reason`); the recording is void [TT-4].
 * - **`bad-transform`** ({@link TransformError}): a variant transform asked for what the tape lacks or cannot hold.
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

/** Why the recording builder cannot record a frame (`RecordingError.reason`). */
export type RecordingProblem =
  /** A frame from the client that is not a JSON-RPC 2.0 request the tape node answers. */
  | "bad-request"
  /** A request whose id an earlier request of the connection, still unanswered, holds. */
  | "duplicate-id"
  /** A frame from the node that is not a JSON-RPC 2.0 answer or subscription notification the tape can hold. */
  | "not-json-rpc"
  /** An answer whose id names no request of the connection waiting for one. */
  | "unknown-answer"
  /** A notification of a subscription not made on the connection. */
  | "unknown-subscription"
  /** A notification under another method than the tape node sends for its subscription. */
  | "notification-method"
  /**
   * A notification of a subscription whose answer came before an earlier request of the same method and params was
   * answered: the tape, which answers by occurrence, cannot place it.
   */
  | "out-of-order"
  /** The record the frame gives is not a tape record (a subscription id the tape cannot hold, or one in use). */
  | "bad-record"
  /** A frame whose bytes differ from those the tape node sends for its record, so a replay could not equal it. */
  | "not-replayable";

/** The longest part of a frame an error shows. */
const SHOWN = 200;

/** `cannot-record`: a frame the recording builder cannot record; the recording is void. */
export class RecordingError extends Error {
  readonly code = "cannot-record";

  constructor(
    /** The session (the connection the builder accepted), counting from 1. */
    readonly session: number,
    /** Which side sent the frame. */
    readonly from: "client" | "node",
    readonly reason: RecordingProblem,
    detail: string,
    /** The frame's text (or a description of a binary frame). */
    frame: string,
  ) {
    const shown = frame.length > SHOWN ? `${frame.slice(0, SHOWN)}…` : frame;
    super(`cannot-record in session ${session}, a frame from the ${from} (${reason}): ${detail}; the frame: ${shown}`);
    this.name = "RecordingError";
  }
}

/** Why a variant transform refuses (`TransformError.reason`). */
export type TransformProblem =
  /** A line outside the tape. */
  | "no-such-line"
  /** A selected line that is not a call record. */
  | "not-a-call"
  /** A selection of no record. */
  | "selects-nothing"
  /** A session the tape does not have. */
  | "no-such-session"
  /** A subscription no `subscribe` record of the session holds. */
  | "no-such-subscription"
  /** A notification the subscription does not have in its session. */
  | "no-such-notification"
  /** A count, a delay or an error value out of range. */
  | "bad-argument"
  /** A call that names no block for "state unavailable", without a block given. */
  | "no-block-hash";

/** `bad-transform`: a variant transform asked for something the tape lacks or cannot hold. */
export class TransformError extends Error {
  readonly code = "bad-transform";

  constructor(
    readonly reason: TransformProblem,
    detail: string,
  ) {
    super(`bad-transform: ${detail}`);
    this.name = "TransformError";
  }
}
