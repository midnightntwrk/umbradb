// The user modules of the library's `modulesFrom` tests, as a host's module file lists them: the main thread and the
// ledger worker both import this file (`modulesFrom`), so the ledger task below runs in the worker and its item reaches
// the module's callbacks on the main thread, which note it in `SEEN`. Erasable TypeScript only: the worker runs it
// through Node.js's type stripping.

import { isMainThread } from "node:worker_threads";
import { z } from "zod";
import type { LedgerTaskBlock } from "../../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";

/** What `task-rows`' callbacks saw, on the main thread: `<height> <where its task ran>`. */
export const SEEN: string[] = [];

/** `task-rows`: its ledger task names the thread it ran in; its `on-compute` notes the item. */
export const TASK_ROWS: ModuleDeclaration = {
  id: "task-rows",
  version: "1.0.0",
  side: "public",
  requires: ["block-parsed"],
  provides: [{ name: "task-thread", lifetimes: ["block"] }],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  ledgerTasks: [
    {
      name: "task-thread",
      needsState: false,
      run: (block: LedgerTaskBlock) => ({ height: String(block.height), thread: isMainThread ? "main" : "worker" }),
    },
  ],
  points: {
    async "on-compute"(_p, b) {
      const item = b.items.get("task-thread") as { readonly height: string; readonly thread: string };
      SEEN.push(`${item.height} ${item.thread}`);
    },
  },
};

export const modules = [TASK_ROWS];
