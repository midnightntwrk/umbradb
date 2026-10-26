import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";

/**
 * The module of A48's SIGTERM tests (task 5.3; RN-13): `w` writes `rows` rows per height in its `on-db-write`, one
 * statement at a time; at height `at` it reports that its block's transaction is open after the first row, then waits
 * for `hold` — the SIGTERM — before it writes the others. Shared by the worker process (`sigterm.worker.ts`) and the
 * test's restart in its own process, so both run the same declaration (the same migration checksums).
 */

/** What `w` reports. */
export type WorkEvent =
  | { readonly event: "fetch"; readonly height: number }
  | { readonly event: "in-db-write"; readonly height: number }
  | { readonly event: "db-write-end"; readonly height: number }
  | { readonly event: "after-write"; readonly height: number };

/** How `w` behaves. */
export interface WorkOptions {
  readonly rows: number;
  /** The height whose `on-db-write` waits for `hold` after its first row; none: it never waits. */
  readonly at?: number;
  readonly hold?: Promise<void>;
  readonly report: (event: WorkEvent) => void;
}

/** The module `w` (see the module comment). */
export function workModule(options: WorkOptions): ModuleDeclaration {
  return {
    id: "w",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "w-rows", lifetimes: ["table"], table: { schema: "w", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE w.rows (height bigint, part integer, PRIMARY KEY (height, part))" }],
    points: {
      async "on-fetch"(_p, b) {
        options.report({ event: "fetch", height: Number(b.height) });
      },
      async "on-db-write"(_p, b, w) {
        const height = Number(b.height);
        for (let part = 1; part <= options.rows; part++) {
          await w.execute("INSERT INTO w.rows (height, part) VALUES ($1, $2)", [b.height, part]);
          if (part === 1 && height === options.at) {
            options.report({ event: "in-db-write", height });
            await options.hold;
          } else {
            await sleep(2);
          }
        }
        options.report({ event: "db-write-end", height });
      },
      async "on-after-db-write"(_p, b) {
        options.report({ event: "after-write", height: Number(b.height) });
      },
    },
  };
}
