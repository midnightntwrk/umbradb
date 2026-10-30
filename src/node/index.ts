/**
 * The node client:
 * - JSON-RPC over WebSocket to the Midnight node (`./client.ts`), with only the allowed node calls
 *   (`./methods.ts`), head subscriptions, reconnects, timeouts and back-off (`./backoff.ts`) [IN-8, IN-10];
 * - its errors (`./errors.ts`), its typed answers (`./decode.ts`) and its transport (`./socket.ts`,
 *   `./ws-socket.ts`).
 *
 * Internal: the package's public surface exports none of it. [design §1, §3, §12]
 */

export * from "./backoff.js";
export * from "./client.js";
export type { NodeBlock, NodeHeader, NodeRuntimeVersion } from "./decode.js";
export * from "./errors.js";
export * from "./methods.js";
export * from "./socket.js";
export * from "./ws-socket.js";
