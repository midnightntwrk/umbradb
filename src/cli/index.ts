/**
 * The `umbradb` command.
 * - Its commands and usage: `./command.ts`.
 * - `config check`: `./config-check.ts`, with its type check (`./type-check.ts`) and its read-only database read
 *   (`./database.ts`).
 * - The modules the command's build carries: `./build-modules.ts`.
 * - The `bin` entry: `./main.ts`.
 *
 * None of it is part of the package's exported surface; a host program with user modules would call `configCheck` with
 * its declarations.
 */

export * from "./build-modules.js";
export * from "./command.js";
export * from "./config-check.js";
export * from "./database.js";
export * from "./type-check.js";
