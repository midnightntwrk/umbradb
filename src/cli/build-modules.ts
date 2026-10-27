/**
 * The modules the `umbradb` command's build carries (`openspec/changes/core-arch/specs/modules/spec.md` MD-1,
 * `specs/configuration/spec.md` CF-1, `specs/library-surface/spec.md` LS-6; CORE-ARCH §4.10: "the host program (the
 * CLI, a test, the browser build) imports the modules it ships"; owner decision Q106 B, task 4.4a): UmbraDB's own — its
 * backbone parts and core modules — and the user modules the configuration file exports (`export const modules =
 * [stats]`, `src/config/load.ts`'s `LoadedConfig.modules`). For the command the configuration file is MD-1's host
 * program: it imports the modules it ships, and nothing is loaded by name at run time.
 *
 * **How the file's modules join the build** ({@link commandBuild}): they are the build's user modules, in the order the
 * file lists them, after UmbraDB's own backbone parts and core modules; they are validated with them, as every host's
 * user modules are (MD-2, `validateDeclarations`), so a fault names the user module by its position — a list element
 * that is no declaration (`invalid-declaration`), a module listed twice or with the id of another (`duplicate-id`), and
 * a user module with an id of UmbraDB's own (`core`, `core-…`: `reserved-prefix`, which user modules are refused). The
 * command never drops or merges a listed module: what the file lists is what runs.
 *
 * **The backbone by side.** A public (core) process's: `core-chain` (task 10.2), `core-block-fetch` (the node source and
 * the block items, task 10.3), `core-block-commit` (tasks 5.2, 10.2), `core-digest` (task 7.1) and the admin parts
 * `core-health`, `core-status`, `core-config` (tasks 8.2–8.4); its core modules — off unless a configuration enables
 * them — `core-chain-events`, `core-block-parsed` and `core-tx-results` (task 11.1), `core-ledger-state` (task 12.3),
 * and `core-contract-states`, `core-contract-logs-full` and the development-only `core-contract-logs-fast` (task 13.1),
 * in the decision record's table of core modules' order. A private process's (PP-1, task 14.1): `core-chain`, then the private backbone of one private start
 * (`src/backbone/private.ts`: `core-private-source` from its intake, `core-key-registry`, `core-digest`), then the admin
 * parts; no core module (they are public).
 */

import { CORE_BLOCK_COMMIT } from "../backbone/core-block-commit/core-block-commit.js";
import { CORE_BLOCK_FETCH } from "../backbone/core-block-fetch/core-block-fetch.js";
import { CORE_BLOCK_PARSED } from "../backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN } from "../backbone/core-chain/index.js";
import { CORE_CHAIN_EVENTS } from "../backbone/core-chain-events/core-chain-events.js";
import { CORE_CONFIG } from "../backbone/core-config/core-config.js";
import { CORE_CONTRACT_LOGS_FAST } from "../backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { CORE_CONTRACT_LOGS_FULL } from "../backbone/core-contract-logs-full/core-contract-logs-full.js";
import { CORE_CONTRACT_STATES } from "../backbone/core-contract-states/core-contract-states.js";
import { CORE_DIGEST } from "../backbone/core-digest/index.js";
import { CORE_HEALTH } from "../backbone/core-health/core-health.js";
import { CORE_LEDGER_STATE } from "../backbone/core-ledger-state/core-ledger-state.js";
import { type PrivateIntake, privateIntake } from "../backbone/core-private-source/index.js";
import { privateBackbone } from "../backbone/private.js";
import { CORE_STATUS } from "../backbone/core-status/core-status.js";
import { CORE_TX_RESULTS } from "../backbone/core-tx-results/core-tx-results.js";
import type { ProcessSide } from "../config/core-settings.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";

/** The admin endpoints' parts, on either side (AE-1; tasks 8.2–8.4). */
const ADMIN_PARTS: readonly ModuleDeclaration[] = Object.freeze([CORE_HEALTH, CORE_STATUS, CORE_CONFIG]);

/** A public (core) process's backbone parts (see the module comment). */
export const PUBLIC_BACKBONE: readonly ModuleDeclaration[] = Object.freeze([
  CORE_CHAIN,
  CORE_BLOCK_FETCH,
  CORE_BLOCK_COMMIT,
  CORE_DIGEST,
  ...ADMIN_PARTS,
]);

/** The core modules the command's build ships, each off unless a configuration enables it (tasks 11.1, 12.3, 13.1). */
export const CORE_MODULES: readonly ModuleDeclaration[] = Object.freeze([
  CORE_CHAIN_EVENTS,
  CORE_BLOCK_PARSED,
  CORE_TX_RESULTS,
  CORE_LEDGER_STATE,
  CORE_CONTRACT_STATES,
  CORE_CONTRACT_LOGS_FULL,
  CORE_CONTRACT_LOGS_FAST,
]);

/** What {@link commandBuild} takes besides the user modules. */
export interface CommandBuildOptions {
  /** The process's side; public unless given. */
  readonly side?: ProcessSide;
  /** A private process's intake (its `core-private-source`); a new one unless given. */
  readonly intake?: PrivateIntake;
}

/**
 * The command's build for a process of `options.side`, with `user` — the configuration file's `modules` — as its user
 * modules, not validated (the runner validates it at startup, MD-2): see the module comment.
 */
export function commandBuild(user: readonly unknown[] = [], options: CommandBuildOptions = {}): DeclarationSet {
  if (options.side === "private") {
    const intake = options.intake ?? privateIntake();
    return { backbone: [CORE_CHAIN, ...privateBackbone(intake), ...ADMIN_PARTS], core: [], user: [...user] };
  }
  return { backbone: [...PUBLIC_BACKBONE], core: [...CORE_MODULES], user: [...user] };
}

/**
 * The declarations of the command's build, validated (MD-2): its backbone parts and core modules, and `user` as its user
 * modules (the configuration file's, CF-1; none unless given). Throws the first fault, an `UmbraError` naming the module.
 */
export function buildDeclarations(
  user: readonly unknown[] = [],
  options: CommandBuildOptions = {},
): DeclarationSet<ModuleDeclaration> {
  return validateDeclarations(commandBuild(user, options));
}
