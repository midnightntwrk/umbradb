import { z } from "zod";
import type { BlockHeaderItem } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { IN_MEMORY_LEDGER, IN_MEMORY_SPEC_VERSION, IN_MEMORY_START_MS } from "../../src/runner/in-memory-source.js";

/**
 * A stand-in for the backbone part `core-block-fetch` (CD-2), for the tests that run the finalized loop by itself, with
 * no process to bind the real part (`src/backbone/core-block-fetch/`, task 10.3) to a block source: the loop's own
 * tests (`test/runner/loop-harness.ts`) and `core-block-commit`'s. The process's tests run the real part. Its
 * declaration is the one CORE-ARCH §4.11 gives — it requires `node-client` and `ledger-table`, and provides the `block`
 * items `block-header`, `block-body`, `runtime-metadata` and `ledger-version` — and an `on-fetch` that puts what
 * `core-block-commit` reads of two of them: the block's spec version and its own time in milliseconds
 * (`block-header`), and its ledger version (`ledger-version`).
 *
 * By default every block has the spec version {@link STAND_IN_SPEC_VERSION}, the ledger {@link STAND_IN_LEDGER} and the
 * time {@link STAND_IN_START_MS} + height × 6,000 ms (a chain of 6-second blocks); a test gives its own per block.
 */

/** The spec version of every stand-in block: the in-memory source's, runtime 2.0's (CORE-ARCH §4.8), ledger v9. */
export const STAND_IN_SPEC_VERSION = IN_MEMORY_SPEC_VERSION;

/** The ledger version of every stand-in block: the in-memory source's. */
export const STAND_IN_LEDGER = IN_MEMORY_LEDGER;

/** The time of the stand-in block at height 0, in milliseconds since 1970: the in-memory source's. */
export const STAND_IN_START_MS = IN_MEMORY_START_MS;

/** The `block-header` item of the stand-in block at `height`. */
export function standInHeader(height: bigint): BlockHeaderItem {
  return Object.freeze({ specVersion: STAND_IN_SPEC_VERSION, timestampMs: STAND_IN_START_MS + height * 6_000n });
}

/** The two `block` items the stand-in puts for the block at `height`, as a block context holds them. */
export function standInItems(height: bigint): ReadonlyMap<string, unknown> {
  return new Map<string, unknown>([
    ["block-header", standInHeader(height)],
    ["ledger-version", STAND_IN_LEDGER],
  ]);
}

/** What the stand-in puts, per block; each function may give a value core-block-commit refuses. */
export interface StandInOptions {
  readonly header?: (b: BlockContext) => unknown;
  readonly ledger?: (b: BlockContext) => unknown;
}

/** The `core-block-fetch` stand-in (see the module comment). */
export function blockFetchStandIn(options: StandInOptions = {}): ModuleDeclaration {
  return {
    id: "core-block-fetch",
    version: "0.10.0",
    side: "public",
    requires: ["node-client", "ledger-table"],
    provides: ["block-header", "block-body", "runtime-metadata", "ledger-version"].map((name) => ({
      name,
      lifetimes: ["block"],
    })),
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-fetch"(_p, b, out) {
        out.put("block-header", options.header?.(b) ?? standInHeader(b.height));
        out.put("ledger-version", options.ledger?.(b) ?? STAND_IN_LEDGER);
      },
    },
  };
}
