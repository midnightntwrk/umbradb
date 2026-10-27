import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { type BrowserBuild, type BrowserControl, buildBrowser } from "../../browser/build.js";
import type { ChromeTab } from "./chrome.js";
import { type PageServer, servePage } from "./page-server.js";

/**
 * What the browser build's tests share (task 16.1; A129–A132): a build of the page with the tests' configuration
 * (`./fixtures/configuration.ts`) served on its own port ({@link pageBench}), the page's address, and the page's own
 * calls made through Chrome (`window.umbradb`, `browser/src/page.ts`): the admin endpoints' `/status` (BR-3), the
 * contents hash, a read, and what each worker told the page. Every wait is for a condition, read again until it holds
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
