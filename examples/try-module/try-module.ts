/**
 * A module test: UmbraDB runs a module in the test's own process, on an in-memory chain — no node, no database
 * server, no file. Run it with `node --test try-module.ts` in a project that installed `umbradb` (and `zod`).
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import { z } from "zod";
import { answerChainData, coreEntry, defineConfig, defineModule, InMemoryBlockSource, startUmbraDB } from "umbradb";

// The module under test: for each height, the runtime version of its block and how many extrinsics it carried, and
// one route that answers the latest row.
const blockRuntimes = defineModule({
  id: "block-runtimes",
  version: "1.0.0",
  side: "public",
  requires: ["block-body"],
  provides: [
    {
      name: "block-runtimes-rows",
      lifetimes: ["table"],
      table: { schema: "block_runtimes", tables: ["rows"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [
    {
      id: "001",
      sql: `CREATE TABLE block_runtimes.rows (
        height bigint PRIMARY KEY,
        spec_version integer NOT NULL,
        extrinsics integer NOT NULL
      )`,
    },
  ],
  points: {
    async "on-db-write"(_processContext, block, writer) {
      const body = block.items.get("block-body") as { specVersion: number; extrinsics: readonly unknown[] };
      await writer.execute("INSERT INTO block_runtimes.rows (height, spec_version, extrinsics) VALUES ($1, $2, $3)", [
        block.height,
        body.specVersion,
        body.extrinsics.length,
      ]);
    },
    async "on-start-api"(_processContext, api) {
      api.http("GET", "/block-runtimes/latest", async (_request, read) =>
        answerChainData(read, async (view) => {
          const [row] = await read.query("SELECT * FROM block_runtimes.rows WHERE height = $1", [view.height]);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );
    },
  },
});

test("block-runtimes stores every height and answers the latest", async () => {
  // Blocks 0 to 10 in memory, each of runtime 2,001,000 with no extrinsics. The `custom` network's genesis is the
  // chain's block 0, and its ledger table gives that runtime a ledger version (v9).
  const source = new InMemoryBlockSource({ head: 10n });
  const genesis = await source.block(0n);
  const config = defineConfig({
    entries: [
      coreEntry({
        start: 0,
        stop: 10, // the run ends on its own once height 10 is committed
        config: {
          network: "custom",
          genesisHash: `0x${Buffer.from(genesis.hash).toString("hex")}`,
          ledgerTable: {
            rows: [
              { specVersionMin: 22_000, specVersionMax: 22_999, ledger: "v8" },
              { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
              { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
            ],
          },
          node: "ws://127.0.0.1:9", // never contacted: the in-memory chain is the source
          database: { kind: "pglite", memory: true },
          developmentOptIn: true, // PGlite is a development database
        },
      }),
      blockRuntimes.entry({ start: 0, config: {} }),
    ],
  });

  const handle = startUmbraDB({ config: { data: config }, modules: [blockRuntimes], source });
  // UmbraDB listens on no port: the test's own server calls the module API's handler.
  const server = createServer((request, response) => handle.api.http(request, response));
  try {
    await handle.started;
    assert.deepEqual(await handle.ended, { kind: "stopped", height: 10n, core: true, upgrade: null });
    assert.equal(handle.status().cursor, 10n);

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    const answer = await fetch(`http://127.0.0.1:${port}/block-runtimes/latest`);
    assert.equal(answer.status, 200);
    assert.equal(answer.headers.get("x-umbra-height"), "10");
    assert.deepEqual(await answer.json(), { height: "10", spec_version: 2_001_000, extrinsics: 0 });
  } finally {
    server.close();
    await handle.stop();
    await handle.closed;
  }
});
