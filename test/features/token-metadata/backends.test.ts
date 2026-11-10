import fc from "fast-check";
import { z } from "zod";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import { contentsHash } from "../../../src/library/contents-hash.js";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { build, chainArb, S } from "./chains.js";
import { readStopped, runTo } from "./harness.js";

/**
 * Generated chains processed on PostgreSQL 18 and on PGlite give equal per-block digests of the module's
 * tables and equal contents hashes. A probe module reads `core_digest.tables`' rows of `token_metadata` at every
 * height (each block's digests of the blocks before it), and the final rows and the contents hash are read through the
 * database API once the run stopped.
 */

const hex = (bytes: unknown): string => Buffer.from(bytes as Uint8Array).toString("hex");

/** A module noting, at each height, the digests of the module's tables as they stand before the block's own. */
function digestProbe(seen: string[]): ModuleDeclaration {
  return defineModule({
    id: "token-metadata-digests",
    version: "1.0.0",
    side: "public",
    requires: ["token-metadata-state", "token-metadata-events"],
    provides: [{ name: "token-metadata-digests-rows", lifetimes: ["table"], table: { schema: "token_metadata_digests", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE token_metadata_digests.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b, w) {
        const rows = await w.query(
          `SELECT "table", height, digest FROM core_digest.tables WHERE "schema" = 'token_metadata' ORDER BY "table"`,
        );
        seen.push(`${b.height}: ${rows.map((r) => `${r.table as string}@${r.height as bigint} ${hex(r.digest)}`).join(", ")}`);
      },
    },
  }) as ModuleDeclaration;
}

describe("token-metadata on PostgreSQL 18 and PGlite", () => {
  const [postgres, pglite] = PROCESS_BACKENDS;
  beforeAll(() => Promise.all([postgres!.start(), pglite!.start()]), 180_000);
  afterAll(() => Promise.all([postgres!.stop(), pglite!.stop()]), 60_000);

  it("give equal per-block digests of its tables and equal contents hashes for generated chains", async () => {
    let tablesSeen = 0;
    await fc.assert(
      fc.asyncProperty(chainArb, async (chain) => {
        const { logs, head } = build(chain);
        const results = [];
        for (const backend of [postgres!, pglite!]) {
          const seen: string[] = [];
          const db = await backend.database();
          await runTo(db, { start: S, head, logs, modules: [TOKEN_METADATA as ModuleDeclaration, digestProbe(seen)] });
          const final = await readStopped(db, async (read) => ({
            digests: (await read.query(`SELECT "table", height, digest FROM core_digest.tables WHERE "schema" = 'token_metadata' ORDER BY "table"`)).map(
              (r) => `${r.table as string}@${r.height as bigint} ${hex(r.digest)}`,
            ),
            hash: hex(await contentsHash(read)),
          }));
          results.push({ seen, ...final });
        }
        expect(results[1]).toEqual(results[0]);
        tablesSeen = Math.max(tablesSeen, results[0]!.digests.length);
      }),
      { seed: 18_0002, numRuns: 10 },
    );
    // The chains reached every one of the module's tables (events, fields, withdrawals).
    expect(tablesSeen).toBe(3);
  }, 900_000);
});
