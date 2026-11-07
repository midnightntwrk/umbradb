/**
 * The private backbone: the backbone parts a private process runs besides `core-chain`. On a private process,
 * `core-chain` holds the configuration history and the process items `config`, `db` and `ledger-table`. There is no
 * node client, because a private process never talks to the node. [PP-1, RN-3; CORE-ARCH §4.11; design §6, §8; Q95]
 *
 * The parts:
 * - `core-private-source` (`./core-private-source/`): the process's heights, read from the public database, and its
 *   binding to that database.
 * - `core-digest` (`./core-digest/`): the digests of the module tables. Every database follows the same determinism
 *   rules, and every module table has digests. It is the same part as on the public side, but it requires the cursor
 *   table a private database has (`core-private-source`'s `private-cursor`) instead of `core-block-commit`'s
 *   `blocks`, so it runs after `core-private-source` in the fixed backbone order. [RN-3, Q75, Q84]
 *
 * There is no `core-block-fetch` and no `core-block-commit`: a private process takes no block from the node and keeps
 * no `core_block_commit.blocks`; its cursor is `core_private_source.cursor`. No backbone part takes a private module's
 * private inputs, such as keys: those belong to each module. [Q154 A2]
 */

import { CORE_DIGEST } from "./core-digest/index.js";
import type { PrivateIntake } from "./core-private-source/index.js";
import type { ModuleDeclaration } from "../modules/declaration.js";

/** `core-digest` on a private process (see the module comment): the core's part, requiring `private-cursor`. */
export const PRIVATE_CORE_DIGEST: ModuleDeclaration = Object.freeze({
  ...CORE_DIGEST,
  side: "private",
  requires: ["private-cursor"],
});

/**
 * The private backbone of one private process start, after its `core-chain`: `intake`'s `core-private-source`, then
 * `core-digest`, in the fixed backbone order. [RN-3]
 */
export function privateBackbone(intake: PrivateIntake): ModuleDeclaration[] {
  return [intake.part, PRIVATE_CORE_DIGEST];
}
