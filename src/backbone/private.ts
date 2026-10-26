/**
 * The private backbone (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-1; `specs/runner/spec.md`
 * RN-3; `design.md` §6, §8; CORE-ARCH §4.11; decision records Q75, Q84, Q95): the backbone parts a private process runs
 * besides `core-chain` (task 10.2; on a private process its configuration history and its process items `config`, `db`
 * and `ledger-table` — no node client, as a private process never talks to the node):
 * - `core-private-source` (`./core-private-source/`), its heights from the public database and its binding to it;
 * - `core-key-registry` (`./core-key-registry/`), the keys it admitted;
 * - `core-digest` (`./core-digest/`), the digests of its module tables: one set of determinism rules for every
 *   database (Q75), digests on every module table (Q84). The same part as the core's, with its requirement on the
 *   cursor table a private database has — `core-private-source`'s `private-cursor`, as the core's requires
 *   `core-block-commit`'s `blocks` —, so that it runs after both private parts, as RN-3's fixed order has it.
 * Not `core-block-fetch` nor `core-block-commit`: a private process takes no block from the node and keeps no
 * `core_block_commit.blocks`; its cursor is `core_private_source.cursor`.
 */

import { CORE_DIGEST } from "./core-digest/index.js";
import { CORE_KEY_REGISTRY } from "./core-key-registry/index.js";
import type { PrivateIntake } from "./core-private-source/index.js";
import type { ModuleDeclaration } from "../modules/declaration.js";

/** `core-digest` on a private process (see the module comment): the core's part, requiring `private-cursor`. */
export const PRIVATE_CORE_DIGEST: ModuleDeclaration = Object.freeze({
  ...CORE_DIGEST,
  side: "private",
  requires: ["private-cursor"],
});

/**
 * The private backbone of one private process start, after its `core-chain`: `intake`'s `core-private-source`,
 * `core-key-registry` and `core-digest`, in RN-3's fixed order.
 */
export function privateBackbone(intake: PrivateIntake): ModuleDeclaration[] {
  return [intake.part, CORE_KEY_REGISTRY, PRIVATE_CORE_DIGEST];
}
