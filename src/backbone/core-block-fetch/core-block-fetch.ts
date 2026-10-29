/**
 * The backbone part `core-block-fetch`: the node-backed block source (`./node-source.ts`), and for each block, at
 * `on-fetch`, the `block` items `block-header`, `block-body`, `runtime-metadata` and `ledger-version` (`./items.ts`).
 * [CD-2, RN-14; CORE-ARCH §4.11; design §3]
 *
 * **Its `on-fetch`** asks the block source that the runner bound to its process context ({@link bindCoreBlockFetch})
 * for the block's items, and puts them, so every later callback of the block sees them. [RN-5]
 * - The node source reads them from the node. It decodes them with the metadata of the runtime in the parent block's
 *   state, and takes the ledger version from the `ledger-table` item. [LG-1, LG-4]
 * - The in-memory source builds them from its own blocks (`src/runner/in-memory-source.ts`, for tests and module
 *   authors).
 *
 * A failure there is the part's callback error. At a finalized height it halts, with the code of a ledger-selection
 * or metadata halt when it is one; in the best-block queue it drops the block. [RN-8, IN-10; design §11]
 *
 * With the node source each block is fetched once, ahead of time, by the prefetch or the queue; its `on-fetch` and
 * every module's callbacks then run on that one fetch. [IN-5, IN-6]
 *
 * The declaration ({@link CORE_BLOCK_FETCH}) is a constant, as `CORE_CHAIN` is: the source is found through the process
 * context (a `WeakMap`), so one build's declarations serve every process.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { LedgerTable } from "../../ledger/version-table.js";
import { type BlockContext, defineModule, type ItemSink, type ProcessContext } from "../../modules/declaration.js";
import { type BlockItemSource, CORE_BLOCK_ITEMS } from "./items.js";

/** The part's id: second in the fixed backbone order (`BACKBONE_ORDER`). [RN-3] */
export const CORE_BLOCK_FETCH_ID = "core-block-fetch";

const BOUND = new WeakMap<ProcessContext, BlockItemSource>();

/** Whether `source` gives `core-block-fetch` its items (the node source, the in-memory source). */
export function isBlockItemSource(source: unknown): source is BlockItemSource {
  return typeof (source as Partial<BlockItemSource> | null)?.blockItems === "function";
}

/**
 * Binds `core-block-fetch` to its process context `context` with the process's block source, before the loop runs.
 * Throws when `context` is bound already.
 */
export function bindCoreBlockFetch(context: ProcessContext, source: BlockItemSource): void {
  if (BOUND.has(context)) throw new Error("bindCoreBlockFetch: core-block-fetch is bound once per process context");
  BOUND.set(context, source);
}

/** `core-block-fetch`'s `on-fetch` (see the module comment). */
export async function coreBlockFetchOnFetch(p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void> {
  const source = BOUND.get(p);
  if (source === undefined) {
    throw new Error(
      "core-block-fetch's on-fetch ran with a process context the runner did not bind to a block source that gives " +
        "block items (bindCoreBlockFetch): the node source and the in-memory source do",
    );
  }
  const table = p.items.get("ledger-table") as LedgerTable | undefined;
  const items = await source.blockItems({ height: b.height, hash: b.hash, parentHash: b.parentHash }, table);
  for (const name of CORE_BLOCK_ITEMS) out.put(name, items[name]);
}

/**
 * `core-block-fetch` (see the module comment): a backbone part that requires the `process` items `node-client` and
 * `ledger-table` (both from `core-chain`) and provides the four `block` items. Every backbone part starts at the start
 * height S, which is a mid-chain start when S is above 0. [Q96]
 */
export const CORE_BLOCK_FETCH = defineModule({
  id: CORE_BLOCK_FETCH_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["node-client", "ledger-table"],
  provides: CORE_BLOCK_ITEMS.map((name) => ({ name, lifetimes: ["block" as const] })),
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {
    async "on-fetch"(p, b, out) {
      await coreBlockFetchOnFetch(p, b, out);
    },
  },
});
