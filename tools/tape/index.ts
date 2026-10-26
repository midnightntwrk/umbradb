/**
 * The test tape (`openspec/changes/core-arch/design.md` §1 `tools/tape/`; specs/test-tape TT-1 to TT-3; task 9.1): a
 * recording of a Midnight node's JSON-RPC interactions that replaces the node in tests. The tape reader and writer
 * (`./tape.ts`, the records of `./records.ts`), and the tape node that serves a tape over WebSocket JSON-RPC
 * (`./node.ts`). For tests only: nothing here is part of the package (`design.md` §12), and nothing in `src/` imports
 * it. Tests import it as `tools/tape/index.js`.
 */

export * from "./errors.js";
export { type Json, jsonText, NotJsonError, parseJsonText, sortedJsonText } from "./json.js";
export * from "./node.js";
export * from "./records.js";
export { answerDelay, type Entry, entryFor, mayPass } from "./rules.js";
export { requestKey } from "./session.js";
export * from "./tape.js";
