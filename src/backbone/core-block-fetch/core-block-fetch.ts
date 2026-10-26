/**
 * The backbone part `core-block-fetch` (`openspec/changes/core-arch/specs/chain-data/spec.md` CD-2,
 * `specs/runner/spec.md` RN-14; `design.md` §3; CORE-ARCH §4.11; task 10.3): the node-backed block source
 * (`./node-source.ts`), and per block, at `on-fetch`, the `block` items `block-header`, `block-body`,
 * `runtime-metadata` and `ledger-version` (`./items.ts`).
 *
 * **Its `on-fetch`** asks the block source the runner bound to its process context ({@link bindCoreBlockFetch}) for
 * the block's items — the node source's from the node, decoded with the metadata of the runtime in the block's parent's
 * state (LG-4), its ledger version from the `ledger-table` item (LG-1); the in-memory source's from its own blocks
 * (`src/runner/in-memory-source.ts`, for tests and module authors) — and puts them, so every later callback of the
 * block sees them (RN-5). A failure there is the part's callback error: a halt at a finalized height (RN-8, with the
 * code of a ledger-selection or metadata halt when it is one, `design.md` §11), a dropped block in the best-block queue
 * (IN-10). With the node source the block is fetched once — ahead, by the prefetch or the queue —, and its `on-fetch`
 * and every module's run then too (IN-5, IN-6).
 *
 * The declaration ({@link CORE_BLOCK_FETCH}) is a constant, as `CORE_CHAIN` is: the source is found through the process
 * context (a `WeakMap`), so one build's declarations serve every process.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { LedgerTable } from "../../ledger/version-table.js";
import { type BlockContext, defineModule, type ItemSink, type ProcessContext } from "../../modules/declaration.js";
import { type BlockItemSource, CORE_BLOCK_ITEMS } from "./items.js";

/** The part's id: second of RN-3's fixed order (`BACKBONE_ORDER`). */
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
 * `ledger-table` (`core-chain`'s) and provides the four `block` items; every backbone part starts at S, a mid-chain
 * start when S is above 0 (Q96).
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
