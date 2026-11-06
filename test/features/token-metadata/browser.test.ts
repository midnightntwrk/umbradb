import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { buildBrowser } from "../../../browser/build.ts";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.ts";
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
 * M21: the browser build in headless Chrome, served the stagenet tape `stagenet-714485-715183` by a tape node, with a
 * configuration listing `core-contract-logs-fast` and `token-metadata` (`./fixtures/browser-configuration.ts`), starts
 * at the tape's first height and answers `/v1/identities` for case C01's identity as the server does: the same status,
 * body and view headers as a Node.js process on the same tape and configuration. The page is given S through the
 * start it keeps for its database (`umbradb-start:<storage>`), set before it loads; as in `./stagenet.test.ts`, S is
 * the tape's first height + 1 and the genesis records are put before the tape's. [TM-16; task 5.2]
 */

const TAPE = "stagenet-714485-715183";
const S = 714_486;
const STOP = 715_183;
const STORAGE = "token-metadata";
const CONFIGURATION = fileURLToPath(new URL("./fixtures/browser-configuration.ts", import.meta.url));
const GENESIS = (JSON.parse(readFileSync(new URL("./fixtures/stagenet-genesis.json", import.meta.url), "utf8")) as { records: TapeRecord[] }).records;
const CASES = JSON.parse(readFileSync(new URL("../../fixtures/mip0018/case-index.json", import.meta.url), "utf8")) as {
  cases: Record<string, { contract: string }>;
};
const C01 = JSON.parse(readFileSync(new URL("../../fixtures/mip0018/cases/C01/expected.json", import.meta.url), "utf8")) as {
  identities: { domainSep: string; kind: number }[];
};
const PATH = `/v1/identities/${CASES.cases.C01!.contract}/${C01.identities[0]!.domainSep.slice(2)}/${C01.identities[0]!.kind}`;
const PRESENT = findTape(TAPE).found;

(PRESENT ? describe : describe.skip)("M21: token-metadata in the browser build", () => {
  let server: PageServer;
  let node: TapeNode;
  let browser: ChromeBrowser;
  let records: TapeRecord[];

  beforeAll(async () => {
    expect(chromeVersion()).toMatch(/Chrom/);
    const found = findTape(TAPE);
    if (!found.found) throw new Error(found.reason);
    records = [...GENESIS, ...found.read().records];
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
    "starts at the tape's first height and answers /v1/identities for C01's identity as the server does",
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
      const inChrome = await call<{ status: number; headers: Record<string, string>; body: string }>(tab, "core", "api", { method: "GET", path: PATH });

      // The server: a Node.js process on the same tape, configuration and S.
      const backend = PROCESS_BACKENDS.find((b) => b.kind === "pglite")!;
      await backend.start();
      try {
        const run = await ingest(await backend.database(), records, {
          start: BigInt(S),
          stop: BigInt(STOP),
          core: FAST_CORE,
          user: [TOKEN_METADATA as ModuleDeclaration],
          settings: { network: "stagenet", listen: { api: "127.0.0.1:0" } },
        });
        try {
          await committed(run, BigInt(STOP), 600_000);
          const api = run.handle.listening().api!;
          const response = await fetch(`http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}${PATH}`);
          const body = await response.text();
          expect(inChrome!.status).toBe(200);
          expect(JSON.parse(inChrome!.body).common).toMatchObject({ name: "Acme Gold", symbol: "AGLD", decimals: "6" });
          expect([inChrome!.status, inChrome!.body]).toEqual([response.status, body]);
          for (const name of ["x-umbra-view", "x-umbra-height", "x-umbra-hash", "content-type"]) {
            expect([name, inChrome!.headers[name]]).toEqual([name, response.headers.get(name)]);
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
