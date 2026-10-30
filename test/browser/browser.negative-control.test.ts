import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { listenOnRandomPort } from "../../tools/tape/port.js";
import { TapeNode } from "../../tools/tape/index.js";
import { networkProblems, restoreProblems, sameHashProblems, secondTabProblems } from "./browser-checks.js";
import {
  BROWSER_TEST_TIMEOUT_MS,
  backupThrough,
  contentsHashOf,
  eventWhen,
  type PageBench,
  pageBench,
  pageUrl,
  restoreThrough,
  statusOf,
  statusWhen,
  tamperedBackup,
} from "./browser-harness.js";
import { type ChromeBrowser, launchChrome } from "./chrome.js";
import { nodeRun } from "./node-run.js";
import { browserChain, headSession, KEPT_OPEN, restoreSession, resumeSession, syncSession } from "./tapes.js";

/**
 * The committed negative controls of the browser build's criteria: each builds a page that differs from
 * the real one in one way (`browser/build.ts`'s `control`) and runs the criterion's own oracle (`./browser-checks.ts`)
 * over it, which must then fail — the real build passing the same oracle is `./browser.test.ts`.
 *
 * - The second-tab check: a page that takes no Web Lock (`ignore-web-lock`) lets the second tab's core go for the
 *   database the first tab holds, and the check that it refused with `writer-lock-held` fails [A129].
 * - The network check: a page that requests one URL beside the node (`foreign-request`) fails it, naming the URL
 *   [A131].
 * - The equality with Node.js: a page whose JSON reader is `JSON.parse` (`plain-json-reader`) reads the `probe`
 *   module's `jsonb` integers beyond 2^53 rounded. The canonical encoding then refuses them, so its core halts at S,
 *   and it never has Node.js's contents hash [A132].
 * - The restore check: a page whose restore skips the backup's contents hash check (`restore-skips-contents-hash`)
 *   commits a tampered backup into a fresh profile, and the check that it is refused `contents-hash-mismatch` fails
 *   [A131, BK-3, BK-5].
 */

const chain = browserChain();
const browsers: ChromeBrowser[] = [];
const nodes: TapeNode[] = [];
const benches: PageBench[] = [];
const directories: string[] = [];

async function chrome(): Promise<ChromeBrowser> {
  const browser = await launchChrome();
  browsers.push(browser);
  return browser;
}

async function tapeNode(records: Parameters<typeof TapeNode.start>[0]["records"]): Promise<TapeNode> {
  const node = await TapeNode.start({ records });
  nodes.push(node);
  return node;
}

let noLock: PageBench;
let foreign: PageBench;
let plainJson: PageBench;
let skipsHash: PageBench;

beforeAll(async () => {
  noLock = await pageBench("ignore-web-lock");
  foreign = await pageBench("foreign-request");
  plainJson = await pageBench("plain-json-reader");
  skipsHash = await pageBench("restore-skips-contents-hash");
  benches.push(noLock, foreign, plainJson, skipsHash);
}, BROWSER_TEST_TIMEOUT_MS);

afterAll(async () => {
  for (const browser of browsers.splice(0)) await browser.close();
  for (const node of nodes.splice(0)) await node.close();
  for (const bench of benches.splice(0)) await bench.close();
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
}, BROWSER_TEST_TIMEOUT_MS);

describe("the browser build's negative controls (task 16.1)", () => {
  it(
    "A129's control: a page that takes no Web Lock lets a second tab's core go for the held database, and the " +
      "writer-lock-held check fails",
    async () => {
      const node = await tapeNode([...headSession(chain, 3n), ...syncSession(chain, 3n, 6n), ...KEPT_OPEN, ...resumeSession(chain, 6n)]);
      const browser = await chrome();
      const url = pageUrl(noLock.server.origin, { genesis: chain.genesis, node: node.url, storage: "control" });
      const tab = await browser.open(url);
      const core = await statusWhen(tab, "core", (s) => s.cursor === "6" && s.state === "following", "following at 6");
      const before = await contentsHashOf(tab, "core");
      const second = await browser.open(url);
      // Without the lock the second core opens the database PGlite's OPFS storage holds: it does not refuse with
      // writer-lock-held — it fails otherwise, or goes on. Either way the oracle must fail.
      const settled = await statusWhen(second, "core", (s) => s.state !== "starting", "past starting");
      const refused = (await eventWhen(second, "core", "refused").catch(() => undefined)) ?? undefined;
      const firstStatus = await statusOf(tab, "core");
      const after = firstStatus?.state === "following" ? await contentsHashOf(tab, "core") : { hash: "(unreadable)" };
      const problems = secondTabProblems(
        { status: settled, refused },
        { status: firstStatus, cursor: core.cursor, hashBefore: before.hash, hashAfter: after.hash },
      );
      expect(problems.some((problem) => problem.includes("not writer-lock-held"))).toBe(true);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A131's control: a page that requests a URL beside the node fails the network check, naming it",
    async () => {
      const elsewhere = createServer((_request, response) => response.end("elsewhere"));
      const port = await listenOnRandomPort(elsewhere);
      try {
        const node = await tapeNode([...headSession(chain, 3n), ...syncSession(chain, 3n, 5n)]);
        const browser = await chrome();
        const target = `http://127.0.0.1:${port}/elsewhere`;
        const tab = await browser.open(pageUrl(foreign.server.origin, { genesis: chain.genesis, node: node.url, foreign: target }));
        await statusWhen(tab, "core", (s) => s.cursor === "5" && s.state === "following", "following at 5");
        const problems = networkProblems(tab.requests, { origin: foreign.server.origin, node: node.url, files: foreign.build.files });
        expect(problems).toEqual([`the page requested ${target}, outside the page's origin and not the node`]);
      } finally {
        await new Promise<void>((resolve) => elsewhere.close(() => resolve()));
      }
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A132's control: a page whose JSON reader is JSON.parse gives another contents hash than Node.js's on the same tape",
    async () => {
      const records = [...headSession(chain, 3n), ...syncSession(chain, 3n, 9n)];
      const node = await tapeNode(records);
      const browser = await chrome();
      const tab = await browser.open(pageUrl(plainJson.server.origin, { genesis: chain.genesis, node: node.url }));
      const chosen = await eventWhen(tab, "core", "chosen");
      // JSON.parse rounds the probe's integers beyond 2^53, which the canonical encoding refuses: the core halts at S
      // (core-digest's capture of the row cannot encode it), so it never reaches 9 with Node.js's hash.
      const status = await statusWhen(tab, "core", (s) => (s.cursor === "9" && s.state === "following") || s.state === "halted", "following at 9, or halted");
      const inChrome = status.state === "following" ? await contentsHashOf(tab, "core") : { height: null, hash: null };
      const inNode = await nodeRun(records, { genesis: chain.genesis }, 9n);
      const problems = sameHashProblems({ start: chosen.start, status, ...inChrome }, inNode);
      expect(problems).toContain(`Chrome's contents hash is ${inChrome.hash}, Node.js's ${inNode.hash}`);
      expect(problems.length).toBeGreaterThan(0);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );

  it(
    "A131's restore control: a page whose restore skips the contents hash check commits a tampered backup, and the " +
      "check that BK-3 refuses it fails",
    async () => {
      const node = await tapeNode([
        ...headSession(chain, 3n),
        ...syncSession(chain, 3n, 6n),
        ...KEPT_OPEN,
        ...restoreSession(chain, 6n, 6n),
        ...resumeSession(chain, 6n),
      ]);
      const directory = mkdtempSync(join(tmpdir(), "umbradb-a131-control-"));
      directories.push(directory);
      const url = (more: Readonly<Record<string, string>>): string =>
        pageUrl(skipsHash.server.origin, { genesis: chain.genesis, node: node.url, storage: "control", ...more });
      const first = await chrome();
      await first.saveDownloads(directory);
      const tab = await first.open(url({}));
      await statusWhen(tab, "core", (s) => s.cursor === "6" && s.state === "following", "following at 6");
      const { path } = await backupThrough(first, tab);
      const tampered = join(directory, "tampered.backup");
      writeFileSync(tampered, tamperedBackup(readFileSync(path, "utf8")));
      const fresh = await (await chrome()).open(url({ restore: "1" }));
      const record = await restoreThrough(fresh, tampered);
      const problems = restoreProblems([{ what: "the tampered backup", expected: "contents-hash-mismatch", record }]);
      expect(record.restored).toBe(true);
      expect(problems).toEqual(["the tampered backup: restored, where BK-3 says contents-hash-mismatch"]);
    },
    BROWSER_TEST_TIMEOUT_MS,
  );
});
