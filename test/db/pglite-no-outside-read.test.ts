import { afterAll, beforeAll, describe, it } from "vitest";
import { A11_BLOCKS, expectNoOutsideReads, runUnderReadLoad } from "./pglite-outside-reads.js";
import { type PgliteTestServer, startPgliteServer } from "./pglite-server.js";

/**
 * A11 [CI] (DB-4): on PGlite, under a constant read load, zero outside reads run between any block's `BEGIN` and its
 * `COMMIT`, over 200 blocks — the database API runs every read and every transaction as one job of one queue, and a
 * block transaction is one exclusive job. The instrumented run and its assertions are `pglite-outside-reads.ts`'s; its
 * negative control (the build that lets reads bypass the queue) is `pglite-no-outside-read.negative-control.test.ts`.
 */

let server: PgliteTestServer;

beforeAll(async () => {
  server = await startPgliteServer();
}, 120_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

describe("A11 (DB-4) — no outside read inside a block transaction on PGlite", () => {
  it(`[[db.pglite.no-outside-read-in-transaction]] records zero outside reads between BEGIN and COMMIT over ${A11_BLOCKS} blocks under a constant read load`, async () => {
    const outcome = await runUnderReadLoad(await server.createDatabase());
    expectNoOutsideReads(outcome);
  }, 120_000);
});
