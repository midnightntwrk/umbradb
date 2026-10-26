/**
 * The test tape (`openspec/changes/core-arch/design.md` §1 `tools/tape/`; specs/test-tape TT-1 to TT-4; tasks 9.1,
 * 9.2): a recording of a Midnight node's JSON-RPC interactions that replaces the node in tests. The tape reader and
 * writer (`./tape.ts`, the records of `./records.ts`), the tape node that serves a tape over WebSocket JSON-RPC
 * (`./node.ts`, its frames `./frames.ts`), the recording builder that records a client's session with a node as a tape
 * (`./builder.ts`, `./recording.ts`), the variant transforms (`./transforms.ts`), A71's record-and-replay check
 * (`./replay-check.ts`) and the command that runs the builder and the check (`./command.ts`, `./main.ts`). For tests
 * and tooling only: nothing here is part of the package (`design.md` §12), and nothing in `src/` imports it. Tests
 * import it as `tools/tape/index.js`.
 */

export { isWebSocketUrl, TapeBuilder, type TapeBuilderOptions } from "./builder.js";
export * from "./command.js";
export * from "./errors.js";
export * from "./frames.js";
export { type Json, jsonText, NotJsonError, parseJsonText, sortedJsonText } from "./json.js";
export * from "./node.js";
export * from "./records.js";
export { type Answer, joinSessions, type SessionEnd, SessionRecording } from "./recording.js";
export * from "./replay-check.js";
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
