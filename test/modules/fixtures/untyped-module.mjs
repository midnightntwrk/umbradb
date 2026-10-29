// A module declaration written in JavaScript, built without TypeScript's types: the declaration of
// `test/modules/declarations.test.ts`'s type test, with its callback under the unknown point name `on-fetched` (the
// point is `on-fetch`). Nothing checks it before startup, which must refuse it with `unknown-point`. [A20, MD-1]
import { z } from "zod";

export default {
  id: "fetch-stats",
  version: "1.0.0",
  side: "public",
  requires: ["block-header"],
  provides: [
    { name: "fetch-stats-rows", lifetimes: ["block", "table"], table: { schema: "fetch_stats", tables: ["rows"], kind: "append-only" } },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [{ id: "001", sql: "CREATE TABLE fetch_stats.rows (height bigint PRIMARY KEY)" }],
  points: {
    "on-fetched": async () => {},
  },
};
