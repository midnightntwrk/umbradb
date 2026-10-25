import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type * as BuildFlags from "../../../src/backbone/core-digest/build-flags.js";
import { CHECKPOINT_INTERVAL } from "../../../src/backbone/core-digest/build-flags.js";
import { BACKENDS } from "../../db/backends.js";
import { checkpointRows, digestRows, runBlocks, startChain, testModule } from "./chain.js";

/**
 * A57's checkpoints over several intervals (DT-5, owner decision Q86; task 7.1), on both backends, with the interval
 * shortened from 14,400 to 4 by a build flag no exported surface reaches, as A11's negative control does: the flag is
 * `CHECKPOINT_INTERVAL`, a constant of `src/backbone/core-digest/build-flags.ts`, 14,400 in the source and so in every
 * build made from it. Nothing at run time can change it — an importer cannot assign a `const` export, no option,
 * setting or environment variable reads it, and the module is not part of the package's surface (`package.json`
 * exports `"."` only). Only another build of that module changes it, which this file makes for itself: `vi.mock`
 * replaces the module, in this test file's module graph only, with one whose interval is 4.
 */

vi.mock("../../../src/backbone/core-digest/build-flags.js", () => ({ CHECKPOINT_INTERVAL: 4n }));

/** A module whose table changes at every height, so every table has a row at every checkpoint. */
const counter = testModule("counter", {
  provides: [{ name: "counts", lifetimes: ["table"], table: { schema: "counter", tables: ["n"], kind: "mutable" } }],
  migrations: [{ id: "001", sql: "CREATE TABLE counter.n (k bigint PRIMARY KEY, v bigint NOT NULL)" }],
  points: {
    async "on-db-write"(_p, b, w) {
      if (b.height % 3n === 0n) return; // unchanged at every third height: its row is kept, and so checkpointed
      await w.execute("INSERT INTO counter.n (k, v) VALUES (1, $1) ON CONFLICT (k) DO UPDATE SET v = $1", [b.height]);
    },
  },
});

describe("the checkpoint interval is a build flag", () => {
  it("is 14,400 in the source and in every build made from it, and nothing at run time can change it", async () => {
    const actual = await vi.importActual<typeof BuildFlags>("../../../src/backbone/core-digest/build-flags.js");
    expect(actual.CHECKPOINT_INTERVAL).toBe(14_400n);
    const source = readFileSync(new URL("../../../src/backbone/core-digest/build-flags.ts", import.meta.url), "utf8");
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .trim();
    expect(code).toBe("export const CHECKPOINT_INTERVAL = 14_400n;");
    for (const entry of ["../../../src/index.ts", "../../../src/backbone/core-digest/index.ts"]) {
      expect(readFileSync(new URL(entry, import.meta.url), "utf8")).not.toMatch(/build-flags\.js|CHECKPOINT_INTERVAL =/);
    }
    const manifest = JSON.parse(readFileSync(new URL("../../../package.json", import.meta.url), "utf8")) as {
      exports: Record<string, unknown>;
    };
    expect(Object.keys(manifest.exports)).toEqual(["."]);
    // This file's build: the interval is 4.
    expect(CHECKPOINT_INTERVAL).toBe(4n);
  });
});

describe.each(BACKENDS)("A57's checkpoints with the interval shortened to 4, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  for (const start of [1n, 5n, 8n]) {
    it(`from S = ${start}: checkpoints exactly at the heights h >= S with h mod 4 = 0, equal to the tables' rows there`, async () => {
      const { db } = await backend.database("SELECT 1");
      const chain = await startChain(db, [counter], { start });
      const rowsAt = new Map<bigint, Record<string, string>>();
      await runBlocks(chain, 14n, async (h) => {
        rowsAt.set(h, Object.fromEntries(Object.entries(await digestRows(db)).map(([table, row]) => [table, row.digest])));
      });
      const expected = [4n, 8n, 12n].filter((h) => h >= start);
      const checkpoints = await checkpointRows(db);
      expect(Object.keys(checkpoints)).toEqual(expected.map(String));
      for (const h of expected) expect(checkpoints[String(h)], `at ${h}`).toEqual(rowsAt.get(h));
      // At 12 the counter was unchanged (12 mod 3 = 0): its kept row is what the checkpoint holds.
      if (start <= 12n) {
        expect(Object.keys(checkpoints["12"] ?? {}).sort()).toEqual(["core_block_commit.blocks", "counter.n"]);
      }
    }, 120_000);
  }
});
