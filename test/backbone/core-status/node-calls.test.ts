import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type AdminServer, type AdminStarter, startAdminServer } from "../../../src/admin/server.js";
import { NODE_METHODS } from "../../../src/node/methods.js";
import { ask } from "../../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../../admin/json-schema.js";
import { processBackend } from "../../runner/process-backends.js";
import { type ChainBlock, chainOf, finalized, opening, RUNTIME } from "../fetch-fixtures.js";
import { committed, ingest, PATIENCE_MS } from "../ingest-harness.js";

/**
 * `/status`'s `node.calls` (FR-015 of the node call budget): a core synced over a tape node from S = 1 to its stop 6
 * shows, per method it asked, the calls, tries and frames the tape node received — the counters' totals are the tape
 * node's call log's — and no failure; a method it never asked is absent. Every body read validates against
 * `./status.schema.json`.
 *
 * The counts are the node client's own and do not depend on the database, so the run is on PGlite only.
 */

const STATUS_SCHEMA = validatorOf(schemaFile(new URL("./status.schema.json", import.meta.url)));
const STOP = 6n;
const CHAIN = chainOf(STOP);
const at = (height: number): ChainBlock => CHAIN[height] as ChainBlock;

/** The admin listener's origin, once it listens. */
function listening(): { readonly starter: AdminStarter; origin(): string | null } {
  let server: AdminServer | undefined;
  return {
    starter: async (options) => {
      server = await startAdminServer(options);
      return server;
    },
    origin: () => (server === undefined ? null : `http://${server.host}:${server.port}`),
  };
}

describe("the node's call counts on /status", () => {
  const backend = processBackend("pglite");
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("show per method the calls, attempts and frames the node received, equal to its call log, and no failure", async () => {
    const records = [
      ...opening(at(0), at(Number(STOP))),
      ...finalized(at(1), RUNTIME, true),
      ...[2, 3, 4, 5, 6].flatMap((height) => finalized(at(height))),
    ];
    const admin = listening();
    const run = await ingest(await backend.database(), records, {
      start: 1n,
      stop: STOP,
      settings: { listen: { admin: "127.0.0.1:0" } },
      admin: admin.starter,
    });
    try {
      await committed(run, STOP);
      // The tape node's log, per method: every request it received.
      const logged = new Map<string, number>();
      for (const call of run.node.calls) logged.set(call.method as string, (logged.get(call.method as string) ?? 0) + 1);
      const expected = Object.fromEntries(
        [...logged].sort(([a], [b]) => a.localeCompare(b)).map(([method, n]) => [method, { calls: n, attempts: n, frames: n, failures: {} }]),
      );
      // The run asked the per-block methods and startup's, not a method of the ledger it does not run.
      expect(Object.keys(expected)).toEqual(expect.arrayContaining(["chain_getBlock", "chain_getBlockHash", "chain_subscribeFinalizedHeads", "state_getRuntimeVersion"]));
      expect(expected).not.toHaveProperty("midnight_ledgerStateRoot");
      expect((expected.chain_getBlock as { calls: number }).calls).toBe(Number(STOP));
      let shown: unknown;
      const deadline = Date.now() + 30_000;
      for (;;) {
        const origin = admin.origin();
        if (origin !== null) {
          const answer = await ask(origin, "/status");
          const body = answer.json as { node?: { calls?: unknown } } | undefined;
          if (answer.status === 200 && body !== undefined) {
            expect(STATUS_SCHEMA.problems(body)).toEqual([]);
            shown = body.node?.calls;
            if (JSON.stringify(shown) === JSON.stringify(expected)) break;
          }
        }
        if (Date.now() > deadline) break;
        await sleep(50);
      }
      expect(shown).toEqual(expected);
      expect(Object.keys(shown as object).every((method) => (NODE_METHODS as readonly string[]).includes(method))).toBe(true);
      expect(run.handle.status().cursor).toBe(STOP);
    } finally {
      await run.close();
    }
  }, PATIENCE_MS * 2);
});
