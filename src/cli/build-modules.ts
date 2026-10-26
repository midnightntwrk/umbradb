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
 * source and the block items, task 10.3), `core-block-commit` (the blocks table, tasks 5.2 and 10.2), `core-digest`
 * (task 7.1), and the admin parts `core-health`, `core-status` and `core-config` (tasks 8.2–8.4). Its core modules —
 * off unless a configuration enables them — are `core-chain-events`, `core-block-parsed` and `core-tx-results` (task
 * 11.1) and `core-ledger-state` (task 12.3); the others come with task 13.x, each adding its declaration here, in
 * `design.md` §6's fixed order and the decision record's table of core modules.
 */

import { CORE_BLOCK_COMMIT } from "../backbone/core-block-commit/core-block-commit.js";
import { CORE_BLOCK_FETCH } from "../backbone/core-block-fetch/core-block-fetch.js";
import { CORE_BLOCK_PARSED } from "../backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN } from "../backbone/core-chain/index.js";
import { CORE_CHAIN_EVENTS } from "../backbone/core-chain-events/core-chain-events.js";
import { CORE_CONFIG } from "../backbone/core-config/core-config.js";
import { CORE_DIGEST } from "../backbone/core-digest/index.js";
import { CORE_HEALTH } from "../backbone/core-health/core-health.js";
import { CORE_LEDGER_STATE } from "../backbone/core-ledger-state/core-ledger-state.js";
import { CORE_STATUS } from "../backbone/core-status/core-status.js";
import { CORE_TX_RESULTS } from "../backbone/core-tx-results/core-tx-results.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";

/** The declarations of the command's build, validated (MD-2): its backbone parts and core modules; no user module. */
export function buildDeclarations(): DeclarationSet<ModuleDeclaration> {
  return validateDeclarations({
    backbone: [CORE_CHAIN, CORE_BLOCK_FETCH, CORE_BLOCK_COMMIT, CORE_DIGEST, CORE_HEALTH, CORE_STATUS, CORE_CONFIG],
    core: [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE],
    user: [],
  });
}
