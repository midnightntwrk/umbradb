import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildBrowser } from "../../../browser/build.js";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { TapeNode, type TapeRecord } from "../../../tools/tape/index.js";
import { FAST_CORE } from "../../backbone/contract-data-checks.js";
import { committed, ingest } from "../../backbone/ingest-harness.js";
import { BROWSER_TEST_TIMEOUT_MS, call, eventWhen, pageUrl, statusWhen, tabReport } from "../../browser/browser-harness.js";
import { type ChromeBrowser, chromeVersion, launchChrome } from "../../browser/chrome.js";
import { type PageServer, servePage } from "../../browser/page-server.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { findTape } from "../../tape/real/real-tapes.js";

/**
 * The browser build in headless Chrome, served the preprod tape `preprod-3348334-3348534` by a tape node, with a
 * configuration listing `core-contract-logs-fast`, `token-metadata` and `token-metadata-api` (`./fixtures/browser-configuration.ts`), starts
 * at the tape's first height + 1 and answers `/v1/status` and `/v1/tokens` as the server does: the same status, body and
 * view headers as a Node.js process on the same tape, configuration and S. The page is given S through the start it
 * keeps for its database (`umbradb-start:<storage>`), set before it loads. Startup asks for the genesis hash and header,
 * which a mid-chain tape does not hold: they come from `test/ledger/fixtures/networks/preprod.json`, the node's own
 * answers, put before the tape's records.
 */

const TAPE = "preprod-3348334-3348534";
const S = 3_348_335;
const STOP = 3_348_534;
const STORAGE = "token-metadata";
const CONFIGURATION = fileURLToPath(new URL("./fixtures/browser-configuration.ts", import.meta.url));
const PATHS = ["/v1/status", "/v1/tokens?limit=10"];

/** The genesis hash's and header's records of preprod, as its node answered them. */
function genesisRecords(): TapeRecord[] {
  const fixture = JSON.parse(readFileSync(new URL("../../ledger/fixtures/networks/preprod.json", import.meta.url), "utf8")) as {
    genesis: { hash: string };
    calls: TapeRecord[];
  };
  const wanted = (record: TapeRecord) =>
    "method" in record &&
    ((record.method === "chain_getBlockHash" && JSON.stringify(record.params) === "[0]") ||
      (record.method === "chain_getHeader" && JSON.stringify(record.params) === JSON.stringify([fixture.genesis.hash])));
  return fixture.calls.filter(wanted);
}
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
    const genesis = genesisRecords();
    expect(genesis).toHaveLength(2);
    records = [...genesis, ...found.read().records];
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
    "starts at the tape's first height + 1 and answers /v1/status and /v1/tokens as the server does",
    async () => {
      // The page keeps S for a stored database: set it on the page's origin before the page loads.
      const tab = await browser.open(`${server.origin}/not-the-page`);
      await tab.evaluate(`localStorage.setItem(${JSON.stringify(`umbradb-start:${STORAGE}`)}, "${S}")`);
      await tab.navigate(pageUrl(server.origin, { node: node.url, storage: STORAGE, stop: String(STOP) }));
      const chosen = await eventWhen(tab, "core", "chosen");
      expect(chosen.start).toBe(S);
      await statusWhen(tab, "core", (s) => s.cursor === String(STOP), `the cursor at ${STOP}`, 600_000).catch(async (error: unknown) => {
        throw new Error(`${String(error)}\n${await tabReport(tab)}`);
      });
      const inChrome: { status: number; headers: Record<string, string>; body: string }[] = [];
      for (const path of PATHS) inChrome.push((await call<{ status: number; headers: Record<string, string>; body: string }>(tab, "core", "api", { method: "GET", path }))!);

      // The server: a Node.js process on the same tape, configuration and S.
      const backend = PROCESS_BACKENDS.find((b) => b.kind === "pglite")!;
      await backend.start();
      try {
        const run = await ingest(await backend.database(), records, {
          start: BigInt(S),
          stop: BigInt(STOP),
          core: FAST_CORE,
          user: [TOKEN_METADATA as ModuleDeclaration, TOKEN_METADATA_API as ModuleDeclaration],
          settings: { network: "preprod", listen: { api: "127.0.0.1:0" } },
        });
        try {
          await committed(run, BigInt(STOP), 600_000);
          const api = run.handle.listening().api!;
          const origin = `http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`;
          expect(JSON.parse(inChrome[0]!.body)).toMatchObject({ network: "preprod", startHeight: S, indexedHeight: STOP });
          for (const [i, path] of PATHS.entries()) {
            const response = await fetch(`${origin}${path}`);
            const body = await response.text();
            expect([path, inChrome[i]!.status, inChrome[i]!.body]).toEqual([path, response.status, body]);
            expect(response.status).toBe(200);
            for (const name of ["x-umbra-view", "x-umbra-height", "x-umbra-hash", "content-type"]) {
              expect([path, name, inChrome[i]!.headers[name]]).toEqual([path, name, response.headers.get(name)]);
            }
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
