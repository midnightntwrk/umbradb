/**
 * Configuration (`openspec/changes/core-arch/specs/configuration/spec.md`, `design.md` §1, §7): the build's core version
 * (`./build.ts`), the builders `defineConfig`, `coreEntry`, `versionEntry` and the module `entry` builder, with the
 * configuration's types (`./entries.ts`), the plain-data check (`./plain-data.ts`) and the loader (`./load.ts`). Schema
 * validation (task 4.2), the configuration history and the version check (task 4.3) and `umbradb config check` (task
 * 4.4) come next.
 */

export * from "./build.js";
export * from "./entries.js";
export * from "./load.js";
export * from "./plain-data.js";
