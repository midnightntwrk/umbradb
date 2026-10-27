import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { type BrowserBuild, type BrowserControl, buildBrowser } from "../../browser/build.js";
import type { ChromeBrowser, ChromeTab } from "./chrome.js";
import { type PageServer, servePage } from "./page-server.js";

/**
 * What the browser build's tests share (task 16.1; A129–A132): a build of the page with the tests' configuration
 * (`./fixtures/configuration.ts`) served on its own port ({@link pageBench}), the page's address, and the page's own
 * calls made through Chrome (`window.umbradb`, `browser/src/page.ts`): the admin endpoints' `/status` (BR-3), the
 * contents hash, a read, what each worker told the page, and the page's backup and restore as the user makes them
 * (BK-5: the "Back up" button's saved file, a file picked in "Restore a backup"). Every wait is for a condition, read again until it holds
 * or the patience runs out (a loaded machine), never a single sample.
 */

/** The tests' configuration module (bundled into the page; the Node.js run of A132 imports it too). */
export const TEST_CONFIGURATION = fileURLToPath(new URL("./fixtures/configuration.ts", import.meta.url));

/** How long a condition may take on a loaded machine (`UMBRADB_BROWSER_PATIENCE_MS` sets another: a scratch run's). */
export const PATIENCE_MS = Number(process.env.UMBRADB_BROWSER_PATIENCE_MS ?? 240_000);

/** A test's budget: Chrome, a build, PGlite in workers and a tape node, on a loaded machine. */
export const BROWSER_TEST_TIMEOUT_MS = 900_000;

/** A page built and served. */
export interface PageBench {
  readonly build: BrowserBuild;
  readonly server: PageServer;
  close(): Promise<void>;
}

/** Builds the page with the tests' configuration (and `control`, a negative control's build) and serves it. */
export async function pageBench(control: BrowserControl = ""): Promise<PageBench> {
  const outdir = mkdtempSync(join(tmpdir(), "umbradb-browser-"));
  const build = await buildBrowser({ outdir, configuration: TEST_CONFIGURATION, control });
  const server = await servePage(outdir);
  return {
    build,
    server,
    async close() {
      await server.close();
      rmSync(outdir, { recursive: true, force: true });
    },
  };
}

/** The page's address with `params` (its `node`, `storage`, `genesis`, …). */
export function pageUrl(origin: string, params: Readonly<Record<string, string>>): string {
  return `${origin}/?${new URLSearchParams(params).toString()}`;
}

/** A process of the page: the core, or a private instance by its id. */
export type ProcessName = "core" | string;

/** `/status`'s body, as far as the tests read it (AE-5; heights as decimal text). */
export interface StatusBody {
  readonly state: string;
  readonly ready: boolean;
  readonly cursor: string | null;
  readonly head: string | null;
  readonly reason: { readonly code: string; readonly module: string | null; readonly message: string } | null;
  readonly conditions: readonly { readonly code: string }[];
  readonly public?: { readonly cursor: string | null; readonly lockstep: boolean | null } | null;
}

/** An event a worker told the page (`browser/src/protocol.ts`). */
export interface PageEvent {
  readonly type: string;
  readonly start?: number;
  readonly instances?: readonly string[];
  readonly error?: { readonly name: string; readonly message: string; readonly code: string | null; readonly details: unknown };
  readonly end?: unknown;
  readonly api?: { readonly host: string; readonly port: number } | null;
}

const viewOf = (who: ProcessName): string =>
  who === "core" ? "window.umbradb?.core" : `window.umbradb?.instances?.[${JSON.stringify(who)}]`;

/** Calls `method` of `who` in the page; null while the page or the process is not there yet. */
export async function call<T>(tab: ChromeTab, who: ProcessName, method: string, ...args: unknown[]): Promise<T | null> {
  const list = args.map((arg) => JSON.stringify(arg)).join(", ");
  return tab.evaluate<T | null>(
    `(async () => { const view = ${viewOf(who)}; if (view === undefined) return null; ` +
      `return await view.call(${JSON.stringify(method)}${list === "" ? "" : `, ${list}`}); })()`,
  );
}

/** `/status` of `who` through the admin endpoints' channel (BR-3), or null while nothing answers. */
export async function statusOf(tab: ChromeTab, who: ProcessName): Promise<StatusBody | null> {
  const answer = await call<{ status: number; body: StatusBody }>(tab, who, "admin", "/status").catch(() => null);
  return answer?.body ?? null;
}

/** What `who` told the page besides its log and its results. */
export async function eventsOf(tab: ChromeTab, who: ProcessName): Promise<PageEvent[]> {
  return (await tab.evaluate<PageEvent[] | null>(`${viewOf(who)}?.events ?? null`).catch(() => null)) ?? [];
}

/** `who`'s log lines. */
export async function logOf(tab: ChromeTab, who: ProcessName): Promise<string[]> {
  return (await tab.evaluate<string[] | null>(`${viewOf(who)}?.log ?? null`).catch(() => null)) ?? [];
}

/** What the tab shows for a failure's message: each process's log, the page's errors, the console. */
export async function tabReport(tab: ChromeTab, who: readonly ProcessName[] = ["core"]): Promise<string> {
  const logs = await Promise.all(who.map(async (name) => `${name}: ${(await logOf(tab, name)).join(" | ")}`));
  const errors = await tab.evaluate<string[] | null>("window.umbradb?.errors ?? null").catch(() => null);
  return `${logs.join("\n")}\npage errors: ${JSON.stringify(errors)}\nconsole: ${tab.console.slice(-40).join(" | ")}`;
}

/**
 * Waits until `who`'s `/status` satisfies `check`; fails, naming `what` with the tab's report, after `patience`, or at
 * once when the process is refused or halted and `check` does not take that.
 */
export async function statusWhen(
  tab: ChromeTab,
  who: ProcessName,
  check: (status: StatusBody) => boolean,
  what: string,
  patience: number = PATIENCE_MS,
): Promise<StatusBody> {
  const deadline = Date.now() + patience;
  let last: StatusBody | null = null;
  for (;;) {
    last = await statusOf(tab, who);
    if (last !== null && check(last)) return last;
    // A refused or halted process stays so until stopped: no use waiting longer.
    const ended = last !== null && (last.state === "refused" || last.state === "halted");
    if (ended || Date.now() > deadline) {
      throw new Error(`${ended ? "ended" : "timed out"} waiting for ${who}: ${what}; last /status ${JSON.stringify(last)}\n${await tabReport(tab, [who])}`);
    }
    await sleep(200);
  }
}

/** Waits until `who` told the page an event of `type`; fails after `patience`. */
export async function eventWhen(tab: ChromeTab, who: ProcessName, type: string, patience: number = PATIENCE_MS): Promise<PageEvent> {
  const deadline = Date.now() + patience;
  for (;;) {
    const found = (await eventsOf(tab, who)).find((event) => event.type === type);
    if (found !== undefined) return found;
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${who}'s ${type}\n${await tabReport(tab, [who])}`);
    await sleep(200);
  }
}

/** `who`'s contents hash now (DT-3), with the height its read saw. */
export async function contentsHashOf(tab: ChromeTab, who: ProcessName): Promise<{ readonly height: string | null; readonly hash: string }> {
  const answer = await call<{ height: string | null; hash: string }>(tab, who, "contents-hash");
  if (answer === null) throw new Error(`the page has no process ${who}`);
  return answer;
}

/** One read of `who`'s database (`sql`, `params`): its height and rows, values as JSON-ready data. */
export async function readOf(
  tab: ChromeTab,
  who: ProcessName,
  sql: string,
  params: readonly unknown[] = [],
): Promise<{ readonly height: string | null; readonly rows: readonly Record<string, unknown>[] }> {
  const answer = await call<{ height: string | null; rows: Record<string, unknown>[] }>(tab, who, "read", sql, params);
  if (answer === null) throw new Error(`the page has no process ${who}`);
  return answer;
}

/** What the page records of a backup it saved (`browser/src/page.ts`'s `SavedBackup`). */
export interface PageBackup {
  readonly file: string;
  readonly height: string;
  readonly start: string;
  readonly contentsHash: string;
  readonly bytes: number;
}

/** What the page records of a restore (`browser/src/page.ts`'s `RestoreRecord`). */
export interface PageRestore {
  readonly file: string;
  readonly restored: boolean;
  readonly code?: string | null;
  readonly message?: string;
  readonly details?: unknown;
  readonly start?: number;
  readonly height?: string;
  readonly contentsHash?: string;
  readonly statements?: number;
}

/** Waits until `expression` (evaluated in the page) is true; fails naming `what` with the tab's report. */
async function pageWhen(tab: ChromeTab, expression: string, what: string, patience: number = PATIENCE_MS): Promise<void> {
  const deadline = Date.now() + patience;
  while ((await tab.evaluate<boolean>(`Boolean(${expression})`).catch(() => false)) !== true) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}\n${await tabReport(tab)}`);
    await sleep(200);
  }
}

/**
 * Backs the page's database up as the user does — a click on "Back up" once the core has started — and waits for the
 * file it saves (`browser` saving its downloads, `ChromeBrowser.saveDownloads`): what the page recorded, and the
 * file's path.
 */
export async function backupThrough(
  browser: ChromeBrowser,
  tab: ChromeTab,
  patience: number = PATIENCE_MS,
): Promise<{ readonly saved: PageBackup; readonly path: string }> {
  await pageWhen(tab, "document.getElementById('backup')?.disabled === false", "the Back up button to be enabled", patience);
  const before = browser.downloads.length;
  const saved = (await tab.evaluate<number>("window.umbradb.backups.length")) as number;
  await tab.evaluate("document.getElementById('backup').click()", { userGesture: true });
  await pageWhen(tab, `window.umbradb.backups.length > ${saved}`, "the page's backup", patience);
  const deadline = Date.now() + patience;
  for (;;) {
    const download = browser.downloads[before];
    if (download?.state === "completed") {
      const record = await tab.evaluate<PageBackup>(`window.umbradb.backups[${saved}]`);
      if (download.suggested !== record.file) throw new Error(`the page saved ${download.suggested}, and recorded ${record.file}`);
      return { saved: record, path: download.path };
    }
    if (download?.state === "canceled" || Date.now() > deadline) {
      throw new Error(`the backup's file was not saved (${download?.state ?? "no download began"})\n${await tabReport(tab)}`);
    }
    await sleep(100);
  }
}

/** Picks `path` in the page's "Restore a backup" once it takes a file, and gives what the page recorded of the restore. */
export async function restoreThrough(tab: ChromeTab, path: string, patience: number = PATIENCE_MS): Promise<PageRestore> {
  await pageWhen(tab, "document.getElementById('restore-file')?.disabled === false", "the restore input to take a file", patience);
  const before = await tab.evaluate<number>("window.umbradb.restores.length");
  await tab.setInputFiles("#restore-file", [path]);
  await pageWhen(tab, `window.umbradb.restores.length > ${before}`, `the restore of ${path}`, patience);
  return tab.evaluate<PageRestore>(`window.umbradb.restores[${before}]`);
}

/**
 * A backup's text with one value changed in a row the contents hash covers (DT-3): `probe.rows`' row of height 5 moved
 * to 50 — what BK-3's `contents-hash-mismatch` must refuse.
 */
export function tamperedBackup(text: string): string {
  const row = /^INSERT INTO probe\.rows VALUES \(5, /m;
  if (!row.test(text)) throw new Error("the backup has no probe.rows row of height 5 to change");
  return text.replace(row, "INSERT INTO probe.rows VALUES (50, ");
}
