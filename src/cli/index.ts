/**
 * The `umbradb` command (`openspec/changes/core-arch/specs/library-surface/spec.md` LS-6, `design.md` §1, §12): its
 * commands and usage (`./command.ts`), `config check` (`./config-check.ts`, CF-10) with its type check
 * (`./type-check.ts`) and its read-only database read (`./database.ts`), and the modules the command's build carries
 * (`./build-modules.ts`). The `bin` entry is `./main.ts`. None of it is `design.md` §12's exported surface (task 17.3
 * decides; a host program with user modules would call `configCheck` with its declarations).
 */

export * from "./build-modules.js";
export * from "./command.js";
export * from "./config-check.js";
export * from "./database.js";
export * from "./type-check.js";
