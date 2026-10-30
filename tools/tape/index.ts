/**
 * The test tape: a recording of a Midnight node's JSON-RPC interactions that replaces the node in tests.
 * [TT-1 to TT-4; design §1]
 * - the tape reader and writer (`./tape.ts`, the records of `./records.ts`);
 * - the tape node that serves a tape over WebSocket JSON-RPC (`./node.ts`, its frames `./frames.ts`);
 * - the recording builder that records a client's session with a node as a tape (`./builder.ts`, `./recording.ts`);
 * - the variant transforms (`./transforms.ts`);
 * - the record-and-replay check (`./replay-check.ts`) [A71];
 * - the recording driver of real ranges (`./range.ts`, its storage keys `./twox.ts`) and their completeness check
 *   (`./completeness.ts`);
 * - the replay of a whole tape (`./replay-tape.ts`);
 * - the boundary reader of the built-in ledger tables (`./boundaries.ts`);
 * - the command that runs them (`./command.ts`, `./main.ts`).
 *
 * For tests and tooling only: nothing here is part of the package, and nothing in `src/` imports it. Tests import it as
 * `tools/tape/index.js`. [design §12]
 */

export * from "./boundaries.js";
export { isWebSocketUrl, TapeBuilder, type TapeBuilderOptions } from "./builder.js";
export * from "./command.js";
export * from "./completeness.js";
export * from "./errors.js";
export * from "./frames.js";
export { type Json, jsonText, NotJsonError, parseJsonText, sortedJsonText } from "./json.js";
export * from "./node.js";
export * from "./range.js";
export * from "./records.js";
export { type Answer, joinSessions, type SessionEnd, SessionRecording } from "./recording.js";
export * from "./replay-check.js";
export * from "./replay-tape.js";
export { answerDelay, type Entry, entryFor, mayPass } from "./rules.js";
export {
  type CallSelection,
  liveSubscriptions,
  notificationLines,
  notificationRange,
  selectedCalls,
} from "./select.js";
export { requestKey } from "./session.js";
export * from "./tape.js";
export * from "./transforms.js";
export * from "./twox.js";
