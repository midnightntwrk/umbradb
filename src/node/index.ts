/**
 * The node client (`openspec/changes/core-arch/design.md` §1 `src/node/`, §3; task 10.1): JSON-RPC over WebSocket to
 * the Midnight node, with the calls of IN-8 only, head subscriptions, reconnects, timeouts and IN-10's back-off
 * (`./client.ts`); its errors (`./errors.ts`), its typed answers (`./decode.ts`) and its transport (`./socket.ts`,
 * `./ws-socket.ts`). Internal: `design.md` §12's surface exports none of it.
 */

export * from "./backoff.js";
export * from "./client.js";
export type { NodeBlock, NodeHeader, NodeRuntimeVersion } from "./decode.js";
export * from "./errors.js";
export * from "./methods.js";
export * from "./socket.js";
export * from "./ws-socket.js";
