/**
 * The process transport between the core and its private processes:
 * - its messages and their zod schemas (`./messages.ts`);
 * - the core's session logic (`./core-transport.ts`) and its socket carrier, the server (`./core-socket.ts`);
 * - the core's lockstep bookkeeping and wait (`./lockstep.ts`);
 * - the core's view of its instances for `/status` (`./instances.ts`);
 * - a private process's client (`./private-transport.ts`) and its socket carrier (`./private-socket.ts`).
 *
 * Node.js only (`ws`, `node:http`, `node:https`): in the browser the transport is `postMessage` between workers.
 * [PP-3, PP-4, PP-6, PP-7, PP-11; design §1, §8]
 */

export * from "./core-socket.js";
export * from "./core-transport.js";
export * from "./instances.js";
export * from "./lockstep.js";
export * from "./messages.js";
export * from "./private-socket.js";
export * from "./private-transport.js";
