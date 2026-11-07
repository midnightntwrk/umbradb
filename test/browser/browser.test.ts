import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TapeNode } from "../../tools/tape/index.js";
import {
  continuedProblems,
  midChainProblems,
  networkProblems,
  restoreProblems,
  resumeProblems,
  sameHashProblems,
  secondTabProblems,
  startProblems,
  syncedProblems,
} from "./browser-checks.js";
import {
  apiChannel,
  BROWSER_TEST_TIMEOUT_MS,
  backupThrough,
  call,
  contentsHashOf,
  eventWhen,
  linksOf,
  logOf,
  type PageBench,
  pageBench,
  pageUrl,
  readOf,
  restoreThrough,
  statusOf,
  statusWhen,
  tamperedBackup,
} from "./browser-harness.js";
import { type ChromeBrowser, chromeVersion, launchChrome } from "./chrome.js";
import { nodeRun } from "./node-run.js";
import {
  browserChain,
  continueSession,
  headSession,
  heldBefore,
  heldClock,
  KEPT_OPEN,
  otherGenesisSession,
  raisedHeadSession,
  restoreSession,
  resumeSession,
  syncSession,
} from "./tapes.js";

/**
 * The browser build in headless Chrome. One page build with the tests' configuration (`./fixtures/configuration.ts`) is
 * served for the file; each test starts Chrome on a profile of its own
 * (`./chrome.ts`: the machine's Chrome over the DevTools protocol, no test dependency) and a tape node serving the
 * browser tapes (`./tapes.ts`); everything is read through the page's own calls (`window.umbradb`: the admin endpoints'
 * `/status`, the contents hash, reads of the workers' databases; the page's backup and restore as the user makes them).
 * A machine without Chrome fails these tests, naming `UMBRADB_CHROME`; none is skipped. The committed negative controls
 * are `./browser.negative-control.test.ts`. [BR-1 to BR-4, BK-5, A129–A132]
 *
 * The page runs each process on the engine (`browser/src/process-worker.ts`): nothing listens; the private link runs
 * over a `MessageChannel` the page makes for each (re)connection, the module API and admin through the process's
 * fetch-style handlers, the subscriptions on a channel of their own. [LM-11, L58]
 */

const chain = browserChain();
const params = (more: Readonly<Record<string, string>>): Record<string, string> => ({ genesis: chain.genesis, ...more });

let bench: PageBench;
const browsers: ChromeBrowser[] = [];
const nodes: TapeNode[] = [];
const directories: string[] = [];

/** Chrome on a new profile, closed after the file. */
async function chrome(): Promise<ChromeBrowser> {
  const browser = await launchChrome();
  browsers.push(browser);
  return browser;
}

/** A tape node serving `records` (on `clock`, a hold's), closed after the file. */
async function tapeNode(records: Parameters<typeof TapeNode.start>[0]["records"], clock?: ReturnType<typeof heldClock>["clock"]): Promise<TapeNode> {
  const node = await TapeNode.start({ records, ...(clock === undefined ? {} : { clock }) });
  nodes.push(node);
  return node;
}

beforeAll(async () => {
  // Fails here, naming UMBRADB_CHROME, on a machine without Chrome.
  expect(chromeVersion()).toMatch(/Chrom/);
  bench = await pageBench();
}, BROWSER_TEST_TIMEOUT_MS);

afterAll(async () => {
  // Each Chrome is closed with bounded waits, then killed (`./chrome.ts`); one that fails to end does not keep the
  // others, the nodes or the page's server open: its failure is reported once everything else is closed.
  // [docs/issues/00041]
  const failures: unknown[] = [];
  for (const browser of browsers.splice(0)) await browser.close().catch((error: unknown) => failures.push(error));
  for (const node of nodes.splice(0)) await node.close();
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
  await bench?.close();
  if (failures.length > 0) throw new AggregateError(failures, `${failures.length} Chrome process(es) did not end`);
}, BROWSER_TEST_TIMEOUT_MS);

describe("the browser build in headless Chrome (task 16.1)", () => {
  it(
    "A129 [CI] in memory: the core, the ledger worker and a lockstep private instance run in workers on PGlite under " +
      "the development opt-in; A131 [CI]: the page's requests go to its own files and the node only",
    async () => {
      const node = await tapeNode([...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)]);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url, private: "1", lockstep: "1" })));
      const core = await statusWhen(tab, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      const p1 = await statusWhen(tab, "p1", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      expect([...syncedProblems("the core", core, 9n), ...syncedProblems("p1", p1, 9n)]).toEqual([]);

      // Three workers besides the page: the core's, the private instance's and the ledger worker. [BR-1]
      expect(tab.workers.map((url) => new URL(url).pathname).sort()).toEqual(["/core-worker.js", "/ledger-worker.js", "/private-worker.js"]);
      // The ledger worker parsed every transaction of the blocks it was given (heights 4 and 6). [CD-5, LG-7]
      const parsed = await readOf(tab, "core", "SELECT height, count(*)::int AS n FROM core_block_parsed.transactions GROUP BY height ORDER BY height");
      expect(parsed.rows).toEqual([
        { height: "4", n: 2 },
        { height: "6", n: 3 },
      ]);
      const results = await readOf(tab, "core", "SELECT count(*)::int AS n FROM core_tx_results.results WHERE outcome = 'success'");
      expect(results.rows).toEqual([{ n: 5 }]);
      // The admin endpoints, as calls on each worker's channel: live while the worker's heartbeat ticks, ready. [BR-3]
      for (const who of ["core", "p1"]) {
        const live = await call<{ status: number; body: { live: boolean; heartbeatAgeMs: number } }>(tab, who, "admin", "/health/live");
        expect(live).toMatchObject({ status: 200, body: { live: true, livenessTimeoutMs: 30_000 } });
        // The worker's own heartbeat (`performance.now()`), ticking every second.
        expect(live?.body.heartbeatAgeMs).toBeGreaterThanOrEqual(0);
        expect(live?.body.heartbeatAgeMs).toBeLessThan(10_000);
        expect(await call(tab, who, "admin", "/health/ready")).toMatchObject({ status: 200, body: { ready: true } });
        expect(await call(tab, who, "admin", "/metrics")).toMatchObject({ status: 404 });
      }
      // PGlite under the development opt-in, which the browser build sets (the configuration does not). [BR-1, CF-9]
      for (const who of ["core", "p1"]) {
        const config = (await tab.evaluate<{ body: { core: { settings: Record<string, unknown> } } }>(
          `window.umbradb.${who === "core" ? "core" : "instances.p1"}.call("admin", "/config")`,
        )).body;
        expect(config.core.settings.developmentOptIn).toBe(true);
        // The database setting's parts are shown; PGlite in memory has no password. [CF-4, Q167 A]
        expect(config.core.settings.database).toEqual({ kind: "pglite", memory: true });
        const version = await readOf(tab, who, "SELECT version() AS v");
        expect(String(version.rows[0]?.v)).toMatch(/^PostgreSQL 18\.\d+ .*emscripten/i);
      }
      // The lockstep instance read each public block through the core's link and stored its hash. [PP-4, PP-6]
      expect(p1.public).toMatchObject({ cursor: "9", lockstep: true });
      const shadow = await readOf(tab, "p1", "SELECT height, public_hash FROM shadow.rows ORDER BY height");
      expect(shadow.rows).toEqual(chain.blocks.slice(3, 10).map((block) => ({ height: `${block.height}`, public_hash: block.hex })));

      // Nothing listens: the link over the page's channels (one, made when p1 connected), the module API and admin
      // through the handlers. [LM-3, LM-11]
      for (const [who, link] of [["core", "channels"], ["p1", "connect"]] as const) {
        const config = (await call<{ body: { network: unknown } }>(tab, who, "admin", "/config"))?.body;
        expect(config?.network, who).toEqual({ api: "mounted", admin: "mounted", privateLink: link });
      }
      expect(await logOf(tab, "core")).toContain("private link: accepting channels");
      expect(await linksOf(tab)).toEqual([{ link: 1, instance: "p1", dropped: false }]);
      // The module API's fetch-style handler: the handler's answer written as the module API writes JSON (a bigint as
      // its decimal text), the jsonb integers beyond 2^53 kept exactly, with the core's headers. [RN-16]
      const answer = await call<{ status: number; headers: Record<string, string>; body: string }>(tab, "core", "api", { method: "GET", path: "/probe/5" });
      expect(answer?.status).toBe(200);
      expect(answer?.body).toContain(`"big":"${9_007_199_254_740_993n + 5_000n}"`);
      expect(answer?.body).toContain('"readHeight":"9"');
      expect(answer?.headers["x-umbra-version"]).toMatch(/^\d+\.\d+\.\d+/);
      expect(answer?.headers["x-umbra-config-hash"]).toMatch(/^0x[0-9a-f]{64}$/);
      expect((await call<{ status: number }>(tab, "core", "api", { method: "GET", path: "/probe/2" }))?.status).toBe(404);
      // The subscriptions, on a channel of their own (api.connect).
      const subscriptions = await apiChannel(tab, "core", "a129");
      await subscriptions.send({ type: "subscribe", id: "s1", name: "nothing" });
      expect(await subscriptions.until(1, "the answer to an unknown subscription")).toEqual([
        { type: "error", id: "s1", error: { code: "not-found", message: "no subscription is named nothing" } },
      ]);

      // The page reached nothing but its own files and the node. [A131 CI, BR-3]
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
    "issue 00074: the core's /status reports the head its node source holds while the loop is in an older batch: " +
      "head, node.finalizedHead, the lag and the state from it",
    async () => {
      // The loop reads head 6 and processes 4 to 6; once 4 and 5 are fetched the node finalizes 9, and the core is held
      // before 6 (its first node call of 6 unanswered until the hold is released). [AE-3, AE-5]
      const hold = heldClock();
      const node = await tapeNode([...headSession(chain, 3n), ...heldBefore(raisedHeadSession(chain, 3n, 6n, 9n), 6n)], hold.clock);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url })));
      await statusWhen(tab, "core", (s) => s.cursor === "5", "the core at 5, held before 6");
      // The head the loop read is 6 (lag 1, following); the source's is 9.
      const held = await statusWhen(tab, "core", (s) => s.head === "9", "the head at 9 while held at 5", 30_000);
      expect(held).toMatchObject({ state: "syncing", cursor: "5", head: "9", lag: "4", node: { finalizedHead: "9" } });
      hold.release();
      const synced = await statusWhen(tab, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      expect(synced).toMatchObject({ head: "9", lag: "0", node: { finalizedHead: "9" } });
      expect(networkProblems(tab.requests, { origin: bench.server.origin, node: node.url, files: bench.build.files })).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "L58 [CI][DIFF] the demo on the engine: the lockstep private worker connects again over a new MessageChannel and " +
      "goes on in lockstep; the module API's subscriptions run through api.connect; the page reaches its files and the node only",
    async () => {
      // The core is held before height 6 (its first node call of 6 unanswered until the hold is released): with p1
      // listed as lockstep, both wait at 5 while the page drops p1's link and p1 connects again; then 6 to 9 go over
      // the new channel. [LM-11, PP-6]
      const hold = heldClock();
      const node = await tapeNode([...headSession(chain, 3n), ...heldBefore(syncSession(chain, 3n, 9n), 6n)], hold.clock);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(bench.server.origin, params({ node: node.url, private: "1", lockstep: "1" })));
      await statusWhen(tab, "core", (s) => s.cursor === "5", "the core at 5, held before 6");
      await statusWhen(tab, "p1", (s) => s.cursor === "5", "p1 at 5");
      const subscriptions = await apiChannel(tab, "core", "l58");
      await subscriptions.send({ type: "subscribe", id: "h", name: "probe-heights" });
      expect(await subscriptions.until(1, "the subscription's acknowledgement")).toEqual([{ type: "subscribed", id: "h" }]);
      expect(await linksOf(tab)).toEqual([{ link: 1, instance: "p1", dropped: false }]);

      // The page drops the link, as a lost connection: p1 asks for a new channel, and the core takes it.
      expect(await tab.evaluate<number | null>('window.umbradb.dropLink("p1")')).toBe(1);
      const reconnected = async (): Promise<boolean> => {
        const links = await linksOf(tab);
        const core = await statusOf(tab, "core");
        const instance = (core as { privateInstances?: { id: string; connected: boolean }[] } | null)?.privateInstances?.find((one) => one.id === "p1");
        return links.length === 2 && instance?.connected === true;
      };
      const deadline = Date.now() + 120_000;
      while (!(await reconnected())) {
        if (Date.now() > deadline) throw new Error(`p1 did not connect again: links ${JSON.stringify(await linksOf(tab))}, core ${JSON.stringify(await statusOf(tab, "core"))}`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      expect(await linksOf(tab)).toEqual([
        { link: 1, instance: "p1", dropped: true },
        { link: 2, instance: "p1", dropped: false },
      ]);
      // Still held: nothing has moved past 5.
      expect([(await statusOf(tab, "core"))?.cursor, (await statusOf(tab, "p1"))?.cursor]).toEqual(["5", "5"]);

      hold.release();
      const core = await statusWhen(tab, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      const p1 = await statusWhen(tab, "p1", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      expect([...syncedProblems("the core", core, 9n), ...syncedProblems("p1", p1, 9n)]).toEqual([]);
      expect(p1.public).toMatchObject({ cursor: "9", lockstep: true });
      // p1 read 6 to 9 through the core over the new channel, each public block's hash as the core committed it.
      const shadow = await readOf(tab, "p1", "SELECT height, public_hash FROM shadow.rows ORDER BY height");
      expect(shadow.rows).toEqual(chain.blocks.slice(3, 10).map((block) => ({ height: `${block.height}`, public_hash: block.hex })));
      expect(await linksOf(tab)).toHaveLength(2);
      // The subscription got each height the core committed after it opened, in order, with its hash.
      const values = await subscriptions.until(5, "the values of 6 to 9");
      expect(values.slice(1)).toEqual(
        chain.blocks.slice(6, 10).map((block) => ({ type: "next", id: "h", value: { height: `${block.height}`, hash: block.hex } })),
      );
      // The same contents hash as Node.js on the same tape and configuration. [A132]
      const chosen = await eventWhen(tab, "core", "chosen");
      const inChrome = await contentsHashOf(tab, "core");
      const inNode = await nodeRun([...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)], params({}), 9n);
      expect(sameHashProblems({ start: chosen.start, status: core, ...inChrome }, inNode)).toEqual([]);
      expect(networkProblems(tab.requests, { origin: bench.server.origin, node: node.url, files: bench.build.files })).toEqual([]);
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

  it(
    "A131 [CI] backing up the page's database and restoring the file in a fresh profile runs every BK-3 check and " +
      "continues from its height + 1 (BK-5); the page reaches its files and the node only",
    async () => {
      // The tape's sessions, one per connection, in order: the first profile's head question and sync from S 3 to 6;
      // then the fresh profile's restores that reach the node — another chain's genesis, a head below the backup, the
      // tampered file and the backup —; then the restored core going on to 9. The restores refused before the node is
      // asked make no connection.
      const node = await tapeNode([
        ...headSession(chain, 3n),
        ...syncSession(chain, 3n, 6n),
        ...KEPT_OPEN,
        ...otherGenesisSession(),
        ...restoreSession(chain, 5n, 6n),
        ...restoreSession(chain, 6n, 6n),
        ...restoreSession(chain, 6n, 6n),
        ...continueSession(chain, 6n, 9n),
      ]);
      const directory = mkdtempSync(join(tmpdir(), "umbradb-a131-"));
      directories.push(directory);
      const url = (more: Readonly<Record<string, string>>): string =>
        pageUrl(bench.server.origin, params({ node: node.url, storage: "a131", ...more }));
      const reachable = { origin: bench.server.origin, node: node.url, files: bench.build.files };

      // The first profile: the page syncs its OPFS database from S 3 to 6, and the user backs it up.
      const first = await chrome();
      await first.saveDownloads(directory);
      const tab = await first.open(url({}));
      await statusWhen(tab, "core", (s) => s.cursor === "6" && s.state === "following", "following at 6");
      const hashThen = await contentsHashOf(tab, "core");
      const { saved, path } = await backupThrough(first, tab);
      const text = readFileSync(path, "utf8");
      const tampered = join(directory, "tampered.backup");
      writeFileSync(tampered, tamperedBackup(text));
      const notABackup = join(directory, "not-a.backup");
      writeFileSync(notABackup, "SELECT 1;\n");
      expect(networkProblems(tab.requests, reachable)).toEqual([]);

      // The same profile, its database not empty: refused first (the first tab closed, so its Web Lock is free).
      await tab.close();
      const notEmpty = await restoreThrough(await first.open(url({ restore: "1" })), path);

      // A fresh profile: a page configured with other modules, then the page with the backup's configuration.
      const second = await chrome();
      const otherModules = await second.open(url({ restore: "1", modules: "core-chain-events" }));
      const history = await restoreThrough(otherModules, path);
      await otherModules.close();
      const fresh = await second.open(url({ restore: "1" }));
      const format = await restoreThrough(fresh, notABackup);
      const genesis = await restoreThrough(fresh, path);
      const head = await restoreThrough(fresh, path);
      const hash = await restoreThrough(fresh, tampered);
      // After five refusals the target is still empty, or this restore would be refused restore-target-not-empty.
      const restored = await restoreThrough(fresh, path);
      expect(
        restoreProblems([
          { what: "the backup into the first profile's database", expected: "restore-target-not-empty", record: notEmpty },
          { what: "the backup with other modules configured", expected: "backup-history-mismatch", record: history },
          { what: "a file that is no backup", expected: "backup-format-unknown", record: format },
          { what: "the backup against another chain", expected: "backup-genesis-mismatch", record: genesis },
          { what: "the backup above the node's head", expected: "backup-block-not-finalized", record: head },
          { what: "the tampered backup", expected: "contents-hash-mismatch", record: hash },
          { what: "the backup", expected: "restored", record: restored },
        ]),
      ).toEqual([]);

      // The restored core goes on from 7 to 9, as one that never stopped.
      const status = await statusWhen(fresh, "core", (s) => s.cursor === "9" && s.state === "following", "following at 9");
      const blocks = await readOf(fresh, "core", "SELECT height FROM core_block_commit.blocks ORDER BY height");
      const continued = await contentsHashOf(fresh, "core");
      const uninterrupted = await nodeRun([...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)], params({}), 9n);
      expect(
        continuedProblems({ saved, hashThen }, restored, {
          keptStart: await fresh.evaluate("localStorage.getItem('umbradb-start:a131')"),
          chosen: (await eventWhen(fresh, "core", "chosen")).start,
          status,
          blocks: blocks.rows.map((row) => String(row.height)),
          ...continued,
        }, uninterrupted),
      ).toEqual([]);
      expect(networkProblems(fresh.requests, reachable)).toEqual([]);
    },
    BROWSER_TEST_TIMEOUT_MS,
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
