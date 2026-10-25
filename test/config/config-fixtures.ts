import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { defineModule } from "../../src/modules/declaration.js";

/**
 * Modules and settings for the tests of `src/config/` (task 4.1; CF-1, CF-2): two user modules declared as a module
 * package declares them — with `defineModule` on a literal, so that each `entry` builder is typed by its own settings
 * schema — and a `core` entry's settings every check accepts. The configuration files the tests write import this file
 * by its absolute path, as an operator's file imports a module package.
 */

/** The repository's root directory. */
export const REPOSITORY = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** A module whose settings are a data field with a default, an operational one and an optional secret. */
export const stats = defineModule({
  id: "stats",
  version: "1.2.0",
  side: "public",
  requires: ["block-header"],
  provides: [
    { name: "stats-rows", lifetimes: ["block", "table"], table: { schema: "stats", tables: ["rows"], kind: "append-only" } },
  ],
  startsMidChain: true,
  configSchema: z.object({
    limit: z.number().int().default(10).meta({ kind: "data" }),
    pollMs: z.number().int().meta({ kind: "operational" }),
    token: z.string().optional().meta({ kind: "secret" }),
  }),
  migrations: [{ id: "001", sql: "CREATE TABLE stats.rows (height bigint PRIMARY KEY)" }],
  points: {},
});

/** Another module, whose settings share no field with `stats`'s. */
export const prices = defineModule({
  id: "prices",
  version: "0.3.1",
  side: "public",
  requires: ["block-header"],
  provides: [{ name: "price-feed", lifetimes: ["block"] }],
  startsMidChain: false,
  configSchema: z.object({
    feedUrl: z.string().meta({ kind: "operational" }),
    decimals: z.number().int().default(6).meta({ kind: "data" }),
  }),
  migrations: [],
  points: {},
});

/** A public process's `core` settings with the required fields only. */
export const CORE_SETTINGS = {
  network: "preprod",
  database: "pglite:memory",
  node: "ws://127.0.0.1:9944",
} as const;
