import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildBrowser } from "../../../browser/build.js";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { FIRST_CONTRACT_LOG_HEIGHTS, TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { TapeNode, type TapeRecord } from "../../../tools/tape/index.js";
import { FAST_CORE } from "../../backbone/contract-data-checks.js";
import { genesisRecords, TOKENS_PATH } from "../token-metadata/harness.js";
import { committed, ingest } from "../../backbone/ingest-harness.js";
import { BROWSER_TEST_TIMEOUT_MS, call, eventWhen, pageUrl, statusWhen, tabReport } from "../../browser/browser-harness.js";
import { type ChromeBrowser, chromeVersion, launchChrome } from "../../browser/chrome.js";
import { type PageServer, servePage } from "../../browser/page-server.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { findTape } from "../../tape/real/real-tapes.js";

/**
 * The browser build in headless Chrome, served the preprod tape `preprod-3348334-3348534` by a tape node, with a
 * configuration listing `core-contract-logs-fast`, `token-metadata` and `token-metadata-api`
 * (`./fixtures/browser-configuration.ts`). The page asks to start above preprod's first block with contract logs (as a
 * page starting at the node's finalized head would), so the database starts at that block, the indexer's latest start,
 * and backfills from it (its database records that block as its start); it then answers the tokens route as the server does:
 * the same status, body and view headers as a Node.js process on the same tape and configuration. The page is given its
 * start through the start it keeps for its database (`umbradb-start:<storage>`), set before it loads. Startup asks for
 * the genesis hash and header, which a mid-chain tape does not hold: they come from
 * `test/ledger/fixtures/networks/preprod.json`, the node's own answers, put before the tape's records.
 */

const TAPE = "preprod-3348334-3348534";
/** The start the page asks for: above preprod's first contract-log block, as a page starting at the tip would. */
const ASKED = 3_348_500;
/** Where the database starts: `token-metadata`'s latest start on preprod, the first block with contract logs. */
const S = FIRST_CONTRACT_LOG_HEIGHTS.preprod!;
const STOP = 3_348_534;
const STORAGE = "token-metadata";
const CONFIGURATION = fileURLToPath(new URL("./fixtures/browser-configuration.ts", import.meta.url));
/** What the page and the server are asked: one contract's tokens (preprod has no MIP-0018 event), and many colors. */
const BODIES = [{ contract: "00".repeat(32) }, { colors: ["00".repeat(32), "11".repeat(32)] }];

const PRESENT = findTape(TAPE).found;

(PRESENT ? describe : describe.skip)("token-metadata in the browser build", () => {
  let server: PageServer;
  let node: TapeNode;
  let browser: ChromeBrowser;
  let records: TapeRecord[];

  beforeAll(async () => {
    expect(chromeVersion()).toMatch(/Chrom/);
    const found = findTape(TAPE);
    if (!found.found) throw new Error(found.reason);
    records = [...genesisRecords("preprod"), ...found.read().records];
    const outdir = mkdtempSync(join(tmpdir(), "umbradb-browser-token-metadata-"));
    await buildBrowser({ outdir, configuration: CONFIGURATION });
    server = await servePage(outdir);
    node = await TapeNode.start({ records });
    browser = await launchChrome();
  }, BROWSER_TEST_TIMEOUT_MS);

  afterAll(async () => {
    await browser?.close();
    await node?.close();
    await server?.close();
  }, BROWSER_TEST_TIMEOUT_MS);

  it(
    "asked to start above the first contract-log block, starts there, backfills, and answers the tokens route as the server does",
    async () => {
      // The page keeps S for a stored database: set it on the page's origin before the page loads.
      const tab = await browser.open(`${server.origin}/not-the-page`);
      await tab.evaluate(`localStorage.setItem(${JSON.stringify(`umbradb-start:${STORAGE}`)}, "${ASKED}")`);
      await tab.navigate(pageUrl(server.origin, { node: node.url, storage: STORAGE, stop: String(STOP) }));
      const chosen = await eventWhen(tab, "core", "chosen");
      expect(chosen.start).toBe(ASKED);
      await statusWhen(tab, "core", (s) => s.cursor === String(STOP), `the cursor at ${STOP}`, 600_000).catch(async (error: unknown) => {
        throw new Error(`${String(error)}\n${await tabReport(tab)}`);
      });
      const inChrome: { status: number; headers: Record<string, string>; body: string }[] = [];
      for (const body of BODIES) {
        inChrome.push((await call<{ status: number; headers: Record<string, string>; body: string }>(tab, "core", "api", { method: "POST", path: TOKENS_PATH, body: JSON.stringify(body) }))!);
      }
      // The page's database starts at the first contract-log block, not the start it asked for.
      const pageStart = await call<{ rows: { s: number }[] }>(tab, "core", "read", "SELECT start_height::int AS s FROM core_chain.identity");
      expect(pageStart!.rows).toEqual([{ s: S }]);

      // The server: a Node.js process on the same tape, configuration and S.
      const backend = PROCESS_BACKENDS.find((b) => b.kind === "pglite")!;
      await backend.start();
      try {
        const db = await backend.database();
        const run = await ingest(db, records, {
          start: BigInt(ASKED),
          stop: BigInt(STOP),
          core: FAST_CORE,
          user: [TOKEN_METADATA as ModuleDeclaration, TOKEN_METADATA_API as ModuleDeclaration],
          settings: { network: "preprod", listen: { api: "127.0.0.1:0" } },
        });
        try {
          await committed(run, BigInt(STOP), 600_000);
          const api = run.handle.listening().api!;
          const origin = `http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`;
          expect(await db.query("SELECT start_height::int AS s FROM core_chain.identity")).toEqual([{ s: S }]);
          for (const [i, request] of BODIES.entries()) {
            const at = JSON.stringify(request);
            const response = await fetch(`${origin}${TOKENS_PATH}`, { method: "POST", headers: { "content-type": "application/json" }, body: at });
            const body = await response.text();
            expect([at, inChrome[i]!.status, inChrome[i]!.body]).toEqual([at, response.status, body]);
            expect([at, response.status, JSON.parse(body).items]).toEqual([at, 200, []]);
            for (const name of ["x-umbra-view", "x-umbra-height", "x-umbra-hash", "content-type"]) {
              expect([at, name, inChrome[i]!.headers[name]]).toEqual([at, name, response.headers.get(name)]);
            }
            expect(response.headers.get("x-umbra-height")).toBe(String(STOP));
          }
        } finally {
          await run.close();
        }
      } finally {
        await backend.stop();
      }
    },
    BROWSER_TEST_TIMEOUT_MS,
  );
});
