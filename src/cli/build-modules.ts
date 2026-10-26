/**
 * The modules the `umbradb` command's build carries (`openspec/changes/core-arch/specs/modules/spec.md` MD-1,
 * `specs/library-surface/spec.md` LS-6; CORE-ARCH §4.10: "the host program (the CLI, a test, the browser build)
 * imports the modules it ships"): the command is a host program, and it ships UmbraDB's own modules only — the backbone
 * parts and the core modules — since nothing is loaded by name at run time (MD-1). A configuration that lists a user
 * module is therefore refused by `umbradb config check` as naming no module of this build (CF-3); a host program that
 * ships user modules checks its configuration with `configCheck` (`./config-check.ts`), giving its own declarations
 * (an open question for the owner: how an operator checks a configuration that lists user modules).
 *
 * Today the build's backbone parts with a declaration are `core-chain` (task 10.2), `core-block-fetch` (the node
 * source and the block items, task 10.3), `core-block-commit` (the blocks table, tasks 5.2 and 10.2) and `core-digest`
 * (task 7.1); the admin parts' come with tasks 8.x, the core modules with tasks 11.x–13.x — each adds its declaration
 * here, in `design.md` §6's fixed order.
 */

import { CORE_BLOCK_COMMIT } from "../backbone/core-block-commit/core-block-commit.js";
import { CORE_BLOCK_FETCH } from "../backbone/core-block-fetch/core-block-fetch.js";
import { CORE_CHAIN } from "../backbone/core-chain/index.js";
import { CORE_DIGEST } from "../backbone/core-digest/index.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";

/** The declarations of the command's build, validated (MD-2): its backbone parts and core modules; no user module. */
export function buildDeclarations(): DeclarationSet<ModuleDeclaration> {
  return validateDeclarations({ backbone: [CORE_CHAIN, CORE_BLOCK_FETCH, CORE_BLOCK_COMMIT, CORE_DIGEST], core: [], user: [] });
}
