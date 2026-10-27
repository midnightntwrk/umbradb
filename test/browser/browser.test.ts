import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TapeNode } from "../../tools/tape/index.js";
import {
  midChainProblems,
  networkProblems,
  resumeProblems,
  sameHashProblems,
  secondTabProblems,
  startProblems,
  syncedProblems,
} from "./browser-checks.js";
import {
  BROWSER_TEST_TIMEOUT_MS,
  call,
  contentsHashOf,
  eventWhen,
  type PageBench,
  pageBench,
  pageUrl,
  readOf,
  statusOf,
  statusWhen,
} from "./browser-harness.js";
import { type ChromeBrowser, chromeVersion, launchChrome } from "./chrome.js";
import { nodeRun } from "./node-run.js";
import { browserChain, headSession, KEPT_OPEN, resumeSession, syncSession } from "./tapes.js";

/**
 * The browser build in headless Chrome (task 16.1; `openspec/changes/core-arch/specs/browser/spec.md` BR-1 to BR-4,
 * `specs/backups/spec.md` BK-5; acceptance A129–A132). One page build with the tests' configuration
 * (`./fixtures/configuration.ts`) is served for the file; each test starts Chrome on a profile of its own
 * (`./chrome.ts`: the machine's Chrome over the DevTools protocol, no test dependency) and a tape node serving the
 * browser tapes (`./tapes.ts`); everything is read through the page's own calls (`window.umbradb`: the admin endpoints'
 * `/status`, the contents hash, reads of the workers' databases). A machine without Chrome fails these tests, naming
 * `UMBRADB_CHROME`; none is skipped. The committed negative controls are `./browser.negative-control.test.ts`.
 */

const chain = browserChain();
const params = (more: Readonly<Record<string, string>>): Record<string, string> => ({ genesis: chain.genesis, ...more });

let bench: PageBench;
const browsers: ChromeBrowser[] = [];
const nodes: TapeNode[] = [];

/** Chrome on a new profile, closed after the file. */
async function chrome(): Promise<ChromeBrowser> {
  const browser = await launchChrome();
  browsers.push(browser);
  return browser;
}

/** A tape node serving `records`, closed after the file. */
async function tapeNode(records: Parameters<typeof TapeNode.start>[0]["records"]): Promise<TapeNode> {
  const node = await TapeNode.start({ records });
  nodes.push(node);
  return node;
}

beforeAll(async () => {
  // Fails here, naming UMBRADB_CHROME, on a machine without Chrome.
  expect(chromeVersion()).toMatch(/Chrom/);
  bench = await pageBench();
}, BROWSER_TEST_TIMEOUT_MS);

afterAll(async () => {
  for (const browser of browsers.splice(0)) await browser.close();
  for (const node of nodes.splice(0)) await node.close();
  await bench?.close();
}, BROWSER_TEST_TIMEOUT_MS);

describe("the browser build in headless Chrome (task 16.1)", () => {
  it(
    "A129 [CI] in memory: the core, the ledger worker and a lockstep private instance run in workers on PGlite under " +
      "the development opt-in; A131 [CI]: the page's requests go to its own files and the node only",
    async () => {
      const node = await tapeNode([...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)]);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url, private: "1", lockstep: "1", api: "1" })));
      const core = await statusWhen(tab, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      const p1 = await statusWhen(tab, "p1", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      expect([...syncedProblems("the core", core, 9n), ...syncedProblems("p1", p1, 9n)]).toEqual([]);

      // Three workers besides the page: the core's, the private instance's and the ledger worker (BR-1).
      expect(tab.workers.map((url) => new URL(url).pathname).sort()).toEqual(["/core-worker.js", "/ledger-worker.js", "/private-worker.js"]);
      // The ledger worker parsed every transaction of the blocks it was given (heights 4 and 6; CD-5, LG-7).
      const parsed = await readOf(tab, "core", "SELECT height, count(*)::int AS n FROM core_block_parsed.transactions GROUP BY height ORDER BY height");
      expect(parsed.rows).toEqual([
        { height: "4", n: 2 },
        { height: "6", n: 3 },
      ]);
      const results = await readOf(tab, "core", "SELECT count(*)::int AS n FROM core_tx_results.results WHERE outcome = 'success'");
      expect(results.rows).toEqual([{ n: 5 }]);
      // The admin endpoints, as calls on each worker's channel (BR-3): live while the worker's heartbeat ticks, ready.
      for (const who of ["core", "p1"]) {
        const live = await call<{ status: number; body: { live: boolean; heartbeatAgeMs: number } }>(tab, who, "admin", "/health/live");
        expect(live).toMatchObject({ status: 200, body: { live: true, livenessTimeoutMs: 30_000 } });
        // The worker's own heartbeat (`performance.now()`), ticking every second.
        expect(live?.body.heartbeatAgeMs).toBeGreaterThanOrEqual(0);
        expect(live?.body.heartbeatAgeMs).toBeLessThan(10_000);
        expect(await call(tab, who, "admin", "/health/ready")).toMatchObject({ status: 200, body: { ready: true } });
        expect(await call(tab, who, "admin", "/metrics")).toMatchObject({ status: 404 });
      }
      // PGlite under the development opt-in, which the browser build sets (BR-1, CF-9; the configuration does not).
      for (const who of ["core", "p1"]) {
        const config = (await tab.evaluate<{ body: { core: { settings: Record<string, unknown> } } }>(
          `window.umbradb.${who === "core" ? "core" : "instances.p1"}.call("admin", "/config")`,
        )).body;
        expect(config.core.settings.developmentOptIn).toBe(true);
        expect(config.core.settings.database).toBe("[redacted]");
        const version = await readOf(tab, who, "SELECT version() AS v");
        expect(String(version.rows[0]?.v)).toMatch(/^PostgreSQL 18\.\d+ .*emscripten/i);
      }
      // The lockstep instance read each public block through the core's transport (PP-4, PP-6) and stored its hash.
      expect(p1.public).toMatchObject({ cursor: "9", lockstep: true });
      const shadow = await readOf(tab, "p1", "SELECT height, public_hash FROM shadow.rows ORDER BY height");
      expect(shadow.rows).toEqual(chain.blocks.slice(3, 10).map((block) => ({ height: `${block.height}`, public_hash: block.hex })));

      // The module API answers on the core worker's channel (`listen.api`), which startup reports as its address.
      expect((await eventWhen(tab, "core", "started")).api).toEqual({ host: "message-channel", port: 0 });
      expect((await eventWhen(tab, "p1", "started")).api).toBeNull();
      // The handler's answer, written as the module
      // API writes JSON (a bigint as its decimal text), the jsonb integers beyond 2^53 kept exactly.
      const answer = await call<{ status: number; body: string }>(tab, "core", "api", { method: "GET", path: "/probe/5" });
      expect(answer?.status).toBe(200);
      expect(answer?.body).toContain(`"big":"${9_007_199_254_740_993n + 5_000n}"`);
      expect(answer?.body).toContain('"readHeight":"9"');
      expect((await call<{ status: number }>(tab, "core", "api", { method: "GET", path: "/probe/2" }))?.status).toBe(404);
      await expect(call(tab, "core", "subscribe", "s1", "nothing")).rejects.toThrow(/no subscription is named nothing/);

      // A131: nothing but the page's own files and the node (BR-3).
      expect(networkProblems(tab.requests, { origin: bench.server.origin, node: node.url, files: bench.build.files })).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A129 [CI] with OPFS: one Web Lock per database; a second tab on the same database refuses with writer-lock-held; " +
      "a reload resumes from the cursor with the same contents hash",
    async () => {
      const node = await tapeNode([...headSession(chain, 3n), ...syncSession(chain, 3n, 6n), ...KEPT_OPEN, ...resumeSession(chain, 6n)]);
      const browser = await chrome();
      const url = pageUrl(bench.server.origin, params({ node: node.url, storage: "a129", private: "1", lockstep: "1" }));
      const tab = await browser.open(url);
      const core = await statusWhen(tab, "core", (s) => s.cursor === "6" && s.state === "following", "following at 6");
      const p1 = await statusWhen(tab, "p1", (s) => s.cursor === "6" && s.state === "following", "following at 6");
      expect([...syncedProblems("the core", core, 6n), ...syncedProblems("p1", p1, 6n)]).toEqual([]);
      const held = await tab.evaluate<{ held: { name: string; mode: string }[] }>("navigator.locks.query()");
      expect(held.held.map((lock) => `${lock.name} ${lock.mode}`).sort()).toEqual([
        "umbradb-database:a129 exclusive",
        "umbradb-database:a129-p1 exclusive",
      ]);
      const before = { core: await contentsHashOf(tab, "core"), p1: await contentsHashOf(tab, "p1") };

      // A second tab on the same databases: refused, the first tab's untouched.
      const second = await browser.open(url);
      const refused = await eventWhen(second, "core", "refused");
      const secondStatus = await statusWhen(second, "core", (s) => s.state === "refused", "refused");
      const p1Refused = await eventWhen(second, "p1", "refused");
      expect(p1Refused.error?.code).toBe("writer-lock-held");
      const firstHash = await contentsHashOf(tab, "core");
      expect(
        secondTabProblems(
          { status: secondStatus, refused },
          { status: await statusOf(tab, "core"), cursor: core.cursor, hashBefore: before.core.hash, hashAfter: firstHash.hash },
        ),
      ).toEqual([]);
      await second.close();

      // A reload: the workers end, the page starts new ones on the same databases, which resume from their cursors.
      await tab.reload();
      const coreAfter = await statusWhen(tab, "core", (s) => s.state === "following", "following after the reload");
      const p1After = await statusWhen(tab, "p1", (s) => s.state === "following", "following after the reload");
      const after = { core: await contentsHashOf(tab, "core"), p1: await contentsHashOf(tab, "p1") };
      expect([
        ...resumeProblems("the core", { cursor: core.cursor, hash: before.core.hash }, { status: coreAfter, ...after.core }),
        ...resumeProblems("p1", { cursor: p1.cursor, hash: before.p1.hash }, { status: p1After, ...after.p1 }),
      ]).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A130 [CI] an empty profile records S as the node's finalized head at creation",
    async () => {
      const node = await tapeNode([...headSession(chain, 5n), ...syncSession(chain, 5n, 7n)]);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url, storage: "a130" })));
      const chosen = await eventWhen(tab, "core", "chosen");
      await statusWhen(tab, "core", (s) => s.cursor === "7" && s.state === "following", "following at 7");
      const identity = await readOf(tab, "core", "SELECT start_height FROM core_chain.identity");
      const config = await readOf(tab, "core", "SELECT start FROM core_chain.config WHERE entry_id = 'core'");
      const first = await readOf(tab, "core", "SELECT min(height) AS h FROM core_block_commit.blocks");
      expect(
        startProblems(5n, {
          chosen: chosen.start,
          identityStart: (identity.rows[0]?.start_height as string | undefined) ?? null,
          configStart: (config.rows[0]?.start as string | undefined) ?? null,
          firstBlock: (first.rows[0]?.h as string | undefined) ?? null,
        }),
      ).toEqual([]);
      // The page keeps S for its OPFS database (a reload or a second tab runs it with the same configuration).
      expect(await tab.evaluate("localStorage.getItem('umbradb-start:a130')")).toBe("5");
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A130 [CI] enabling core-ledger-state without a restored backup refuses startup, naming it (S above 0, BR-2)",
    async () => {
      const node = await tapeNode([...headSession(chain, 5n), ...syncSession(chain, 5n, 7n)]);
      const browser = await chrome();
      const modules = "core-chain-events,core-block-parsed,core-tx-results,core-ledger-state";
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url, modules })));
      const refused = await eventWhen(tab, "core", "refused");
      const status = await statusWhen(tab, "core", (s) => s.state === "refused", "refused");
      expect(midChainProblems("core-ledger-state", status, refused)).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it.todo(
    "A131 [CI] backing up the page's database and restoring the file in a fresh profile runs every BK-3 check and continues " +
      "from its height + 1 (BK-5): waits for umbradb backup and restore (tasks 15.1, 15.2)",
  );

  it(
    "A132 [DIFF] the same tape and configuration in Chrome and in Node.js on PGlite give equal contents hashes",
    async () => {
      const records = [...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)];
      const node = await tapeNode(records);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url })));
      const chosen = await eventWhen(tab, "core", "chosen");
      const status = await statusWhen(tab, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      const inChrome = await contentsHashOf(tab, "core");
      const inNode = await nodeRun(records, params({}), 9n);
      expect(sameHashProblems({ start: chosen.start, status, ...inChrome }, inNode)).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );
});
