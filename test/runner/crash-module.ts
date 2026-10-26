import { z } from "zod";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";

/**
 * The module of A44's and A46's crash tests (task 5.4; RN-5, RN-9, RN-11): `c` logs every point it registers with what
 * its callback was given — the height, and for a block context its hash, its `block` items and its settings —, puts its
 * `block` item `c-note` in `on-parse` and writes one row per height in `on-db-write`. At the point and height to hold
 * it reports that it holds there and waits for ever, so the test kills the process at exactly that point. Shared by the
 * worker process (`crash.worker.ts`) and the test's restart in its own process, so both run the same declaration (the
 * same migration checksum).
 */

/** The points `c` registers. */
export const CRASH_POINTS = [
  "on-fetch",
  "on-parse",
  "on-start-height",
  "on-compute",
  "on-db-write",
  "on-after-db-write",
  "on-stop-height",
] as const satisfies readonly PointName[];

/** One callback of `c`: its point and height; for a block context its hash (hex), item names and settings. */
export interface CrashCall {
  readonly event: "call";
  readonly point: PointName;
  readonly height: number;
  readonly hash?: string;
  readonly items?: readonly string[];
  readonly settings?: Readonly<Record<string, unknown>>;
}

/** What `c` reports: each call, and that it holds. */
export type CrashEvent = CrashCall | { readonly event: "hold"; readonly point: PointName; readonly height: number };

/** How `c` behaves. */
export interface CrashOptions {
  /** Where `c` holds for ever, after its work there (the row written, at `on-db-write`); none: it never holds. */
  readonly hold?: { readonly point: PointName; readonly height: number };
  readonly report: (event: CrashEvent) => void;
}

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The module `c` (see the module comment). */
export function crashModule(options: CrashOptions): ModuleDeclaration {
  const forever = new Promise<void>(() => undefined);
  const called = async (point: PointName, first: { readonly height: bigint }, context?: BlockContext): Promise<void> => {
    const height = Number(first.height);
    options.report({
      event: "call",
      point,
      height,
      ...(context === undefined
        ? {}
        : { hash: hex(context.hash), items: [...context.items.keys()], settings: { ...context.settings } }),
    });
    if (options.hold?.point === point && options.hold.height === height) {
      options.report({ event: "hold", point, height });
      await forever;
    }
  };
  return {
    id: "c",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [
      { name: "c-rows", lifetimes: ["table"], table: { schema: "c", tables: ["rows"], kind: "append-only" } },
      { name: "c-note", lifetimes: ["block"] },
    ],
    startsMidChain: true,
    configSchema: z.object({ k: z.number().int().default(0).meta({ kind: "data" }) }),
    migrations: [{ id: "001", sql: "CREATE TABLE c.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-fetch"(_p, b) {
        await called("on-fetch", b, b);
      },
      async "on-parse"(_p, b, sink) {
        sink.put("c-note", `parsed ${b.height}`);
        await called("on-parse", b, b);
      },
      async "on-start-height"(_p, e) {
        await called("on-start-height", e);
      },
      async "on-compute"(_p, b) {
        await called("on-compute", b, b);
      },
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO c.rows (height) VALUES ($1)", [b.height]);
        await called("on-db-write", b, b);
      },
      async "on-after-db-write"(_p, b) {
        await called("on-after-db-write", b, b);
      },
      async "on-stop-height"(_p, e) {
        await called("on-stop-height", e);
      },
    },
  };
}
