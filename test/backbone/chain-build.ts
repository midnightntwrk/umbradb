import { CORE_BLOCK_COMMIT } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_CHAIN } from "../../src/backbone/core-chain/index.js";
import { CORE_DIGEST } from "../../src/backbone/core-digest/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import { blockFetchStandIn, type StandInOptions } from "./block-fetch-stand-in.js";

/**
 * The build of the chain's tests (task 10.2; IN-2, IN-3, CD-1, CD-3): UmbraDB's real backbone parts — `core-chain`,
 * `core-block-commit` and `core-digest` — with the stand-in `core-block-fetch` (`./block-fetch-stand-in.ts`; task 10.3
 * builds the real one), in RN-3's order, and the test's user modules. A negative control replaces one part.
 *
 * Imports nothing of Vitest, so that a worker process (`chain-bootstrap.worker.ts`) builds the same declarations, with
 * the same migration checksums, as the test that restarts after it.
 */

/** What a test may replace in the backbone. */
export interface ChainBuildOptions {
  /** What the stand-in `core-block-fetch` puts per block. */
  readonly fetch?: StandInOptions;
  /** A `core-chain` in place of the real one (a negative control's). */
  readonly chain?: ModuleDeclaration;
  /** A `core-block-commit` in place of the real one (a negative control's). */
  readonly commit?: ModuleDeclaration;
}

/** The backbone: `core-chain`, the stand-in `core-block-fetch`, `core-block-commit`, `core-digest`. */
export function chainBackbone(options: ChainBuildOptions = {}): ModuleDeclaration[] {
  return [
    options.chain ?? CORE_CHAIN,
    blockFetchStandIn(options.fetch),
    options.commit ?? CORE_BLOCK_COMMIT,
    CORE_DIGEST,
  ];
}

/** The build's declarations: the backbone and `user`, no core module. */
export function chainDeclarations(user: readonly ModuleDeclaration[], options: ChainBuildOptions = {}): DeclarationSet {
  return { backbone: chainBackbone(options), core: [], user: [...user] };
}
