import { CORE_BLOCK_COMMIT } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_BLOCK_FETCH } from "../../src/backbone/core-block-fetch/index.js";
import { CORE_CHAIN } from "../../src/backbone/core-chain/index.js";
import { CORE_DIGEST } from "../../src/backbone/core-digest/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";

/**
 * The build of the chain's tests (tasks 10.2, 10.3; IN-2, IN-3, CD-1, CD-3): UmbraDB's real backbone parts —
 * `core-chain`, `core-block-fetch` (whose `on-fetch` puts the items its block source gives: the in-memory source's
 * here, a block's own given by the source's `items` option), `core-block-commit` and `core-digest` —, in RN-3's order,
 * and the test's user modules. A negative control replaces one part.
 *
 * Imports nothing of Vitest, so that a worker process (`chain-bootstrap.worker.ts`) builds the same declarations, with
 * the same migration checksums, as the test that restarts after it.
 */

/** What a test may replace in the backbone, and the core modules it builds with. */
export interface ChainBuildOptions {
  /** A `core-chain` in place of the real one (a negative control's). */
  readonly chain?: ModuleDeclaration;
  /** A `core-block-commit` in place of the real one (a negative control's). */
  readonly commit?: ModuleDeclaration;
  /** The build's core modules (task 11.1's `core-chain-events`, `core-block-parsed`, `core-tx-results`); none unless given. */
  readonly core?: readonly ModuleDeclaration[];
}

/** The backbone: `core-chain`, `core-block-fetch`, `core-block-commit`, `core-digest`. */
export function chainBackbone(options: ChainBuildOptions = {}): ModuleDeclaration[] {
  return [options.chain ?? CORE_CHAIN, CORE_BLOCK_FETCH, options.commit ?? CORE_BLOCK_COMMIT, CORE_DIGEST];
}

/** The build's declarations: the backbone, the core modules given (none by default) and `user`. */
export function chainDeclarations(user: readonly ModuleDeclaration[], options: ChainBuildOptions = {}): DeclarationSet {
  return { backbone: chainBackbone(options), core: [...(options.core ?? [])], user: [...user] };
}
