import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { spawnChild } from "../child-processes.js";

/**
 * Headless Chrome for the browser build's tests (task 16.1; A129–A132 `[CI]`, `[DIFF]`): the machine's Chrome, driven
 * over the Chrome DevTools Protocol with Node.js's own `WebSocket` — no test dependency is added (no Playwright or
 * Puppeteer, which `.npmrc`'s supply-chain rules would make a new pinned package and its browser download).
 *
 * **Which Chrome.** `UMBRADB_CHROME` when set; else the platform's usual place — `/Applications/Google Chrome.app` on
 * macOS, `google-chrome-stable`, `google-chrome`, `chromium` or `chromium-browser` on `PATH` elsewhere (GitHub's Ubuntu
 * runners have Google Chrome). None found fails the test that asked, naming `UMBRADB_CHROME`: the browser criteria are
 * never skipped silently.
 *
 * **A profile** is a Chrome process of its own on a new, empty user data directory (deleted when it closes): "a fresh
 * profile" (A130, A131) is a new {@link launchChrome}. Chrome runs headless with no first-run, sync, component update
 * or background networking, so the only requests are the pages'. On Linux under CI it runs with `--no-sandbox` (a
 * container's or runner's user namespaces may refuse Chrome's sandbox); the pages it loads are the tests' own.
 *
 * **Ending.** {@link ChromeBrowser.close} asks Chrome to close (`Browser.close`), then kills it with SIGKILL if it has
 * not exited within 10 s; Chrome's own helper processes exit with it. The process is started with `spawnChild`, so it
 * is killed too if the test process ends first.
 */

/** Where the machine's Chrome is (see the module comment); throws, naming `UMBRADB_CHROME`, when none is found. */
export function chromePath(): string {
  const given = process.env.UMBRADB_CHROME;
  if (given !== undefined && given !== "") {
    if (!existsSync(given)) throw new Error(`UMBRADB_CHROME names ${given}, which does not exist`);
    return given;
  }
  if (process.platform === "darwin") {
    for (const app of ["Google Chrome", "Google Chrome for Testing", "Chromium"]) {
      const path = `/Applications/${app}.app/Contents/MacOS/${app}`;
      if (existsSync(path)) return path;
    }
  }
  for (const name of ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"]) {
    for (const directory of (process.env.PATH ?? "").split(delimiter)) {
      const path = join(directory, name);
      if (directory !== "" && existsSync(path)) return path;
    }
  }
  throw new Error(
    "no Chrome found for the browser build's tests (A129–A132): install Google Chrome, or set UMBRADB_CHROME to a Chrome " +
      "or Chromium executable",
  );
}

/** The version Chrome reports (`--version`). */
export function chromeVersion(path: string = chromePath()): string {
  return execFileSync(path, ["--version"], { encoding: "utf8" }).trim();
}

/** A CDP event: its method, its parameters and the session it came on (undefined: the browser's). */
export interface CdpEvent {
  readonly method: string;
  readonly params: Record<string, unknown>;
  readonly sessionId: string | undefined;
}

/** A connection to Chrome's DevTools endpoint. */
export class Cdp {
  readonly #socket: WebSocket;
  readonly #pending = new Map<number, { resolve(value: unknown): void; reject(error: Error): void; method: string }>();
  readonly #listeners = new Set<(event: CdpEvent) => void>();
  #next = 1;
  #closed: Error | null = null;

  private constructor(socket: WebSocket) {
    this.#socket = socket;
    socket.addEventListener("message", (event: MessageEvent) => this.#receive(String(event.data)));
    socket.addEventListener("close", () => {
      this.#closed = new Error("the DevTools connection closed");
      for (const call of this.#pending.values()) call.reject(this.#closed);
      this.#pending.clear();
    });
  }

  static open(url: string): Promise<Cdp> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      socket.addEventListener("open", () => resolve(new Cdp(socket)), { once: true });
      socket.addEventListener("error", () => reject(new Error(`could not connect to Chrome's DevTools at ${url}`)), { once: true });
    });
  }

  /** Sends `method` (on `sessionId`'s target, else the browser) and resolves with its result. */
  send<T = Record<string, unknown>>(method: string, params: Record<string, unknown> = {}, sessionId?: string): Promise<T> {
    if (this.#closed !== null) return Promise.reject(this.#closed);
    const id = this.#next++;
    return new Promise<T>((resolve, reject) => {
      this.#pending.set(id, { resolve: resolve as (value: unknown) => void, reject, method });
      this.#socket.send(JSON.stringify({ id, method, params, ...(sessionId === undefined ? {} : { sessionId }) }));
    });
  }

  /** Tells `listener` every event from now on; returns what stops it. */
  listen(listener: (event: CdpEvent) => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  close(): void {
    this.#socket.close();
  }

  #receive(text: string): void {
    const message = JSON.parse(text) as {
      id?: number;
      result?: unknown;
      error?: { message: string };
      method?: string;
      params?: Record<string, unknown>;
      sessionId?: string;
    };
    if (message.id !== undefined) {
      const call = this.#pending.get(message.id);
      this.#pending.delete(message.id);
      if (message.error !== undefined) call?.reject(new Error(`${call.method}: ${message.error.message}`));
      else call?.resolve(message.result);
      return;
    }
    if (message.method === undefined) return;
    const event: CdpEvent = { method: message.method, params: message.params ?? {}, sessionId: message.sessionId };
    for (const listener of [...this.#listeners]) listener(event);
  }
}

/** A request one of a page's targets (the page, its workers) made, as CDP's Network domain reported it. */
export interface PageRequest {
  readonly url: string;
  /** `page`, `worker` (a dedicated worker), …: the target's type. */
  readonly target: string;
  /** `request` (HTTP, fetch, a worker's script) or `websocket`. */
  readonly kind: "request" | "websocket";
}

/** A tab of a {@link ChromeBrowser}: its page and every worker it starts, attached and watched. */
export class ChromeTab {
  readonly requests: PageRequest[] = [];
  /** The script URL of every worker the page and its workers started, in the order they started. */
  readonly workers: string[] = [];
  /** Console messages and uncaught exceptions of the page and its workers. */
  readonly console: string[] = [];
  readonly #cdp: Cdp;
  readonly #session: string;
  readonly #targetId: string;
  readonly #sessions = new Map<string, string>();
  readonly #stop: () => void;

  constructor(cdp: Cdp, targetId: string, session: string) {
    this.#cdp = cdp;
    this.#targetId = targetId;
    this.#session = session;
    this.#sessions.set(session, "page");
    this.#stop = cdp.listen((event) => this.#onEvent(event));
  }

  /** Watches `session` (the page's, or a worker's): its requests, its console, and the workers it starts. */
  async watch(session: string): Promise<void> {
    await this.#cdp.send("Network.enable", {}, session);
    await this.#cdp.send("Runtime.enable", {}, session);
    await this.#cdp.send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, session);
  }

  /** Loads `url` in the tab. */
  async navigate(url: string): Promise<void> {
    await this.#cdp.send("Page.navigate", { url }, this.#session);
  }

  /** Reloads the tab (its workers end; the new page starts new ones). */
  async reload(): Promise<void> {
    await this.#cdp.send("Page.reload", { ignoreCache: true }, this.#session);
  }

  /**
   * Evaluates `expression` in the page, awaiting a promise, and gives its value (JSON data); with `userGesture`, as if
   * the user had acted (a click that saves a file).
   */
  async evaluate<T = unknown>(expression: string, options: { readonly userGesture?: boolean } = {}): Promise<T> {
    const result = await this.#cdp.send<{
      result: { value?: unknown };
      exceptionDetails?: { text: string; exception?: { description?: string } };
    }>(
      "Runtime.evaluate",
      { expression, awaitPromise: true, returnByValue: true, userGesture: options.userGesture === true },
      this.#session,
    );
    if (result.exceptionDetails !== undefined) {
      throw new Error(`the page threw: ${result.exceptionDetails.exception?.description ?? result.exceptionDetails.text}`);
    }
    return result.result.value as T;
  }

  /** Picks `files` (paths on this machine) in the page's file input `selector`, as the user would (its `change` fires). */
  async setInputFiles(selector: string, files: readonly string[]): Promise<void> {
    const { root } = await this.#cdp.send<{ root: { nodeId: number } }>("DOM.getDocument", { depth: 0 }, this.#session);
    const { nodeId } = await this.#cdp.send<{ nodeId: number }>("DOM.querySelector", { nodeId: root.nodeId, selector }, this.#session);
    if (nodeId === 0) throw new Error(`the page has no ${selector}`);
    await this.#cdp.send("DOM.setFileInputFiles", { files, nodeId }, this.#session);
  }

  /** Closes the tab. */
  async close(): Promise<void> {
    this.#stop();
    await this.#cdp.send("Target.closeTarget", { targetId: this.#targetId }).catch(() => undefined);
  }

  #onEvent(event: CdpEvent): void {
    const { sessionId, params } = event;
    if (event.method === "Target.attachedToTarget" && sessionId !== undefined && this.#sessions.has(sessionId)) {
      const child = params.sessionId as string;
      const info = params.targetInfo as { type: string };
      this.#sessions.set(child, info.type);
      if (info.type === "worker") this.workers.push((params.targetInfo as { url: string }).url);
      void this.watch(child)
        .catch((error: unknown) => this.console.push(`watching a ${info.type} failed: ${String(error)}`))
        .finally(() =>
          void this.#cdp
            .send("Runtime.runIfWaitingForDebugger", {}, child)
            .catch((error: unknown) => this.console.push(`resuming a ${info.type} failed: ${String(error)}`)),
        );
      return;
    }
    if (sessionId === undefined || !this.#sessions.has(sessionId)) return;
    const target = this.#sessions.get(sessionId) as string;
    if (event.method === "Network.requestWillBeSent") {
      this.requests.push({ url: (params.request as { url: string }).url, target, kind: "request" });
    } else if (event.method === "Network.webSocketCreated") {
      this.requests.push({ url: params.url as string, target, kind: "websocket" });
    } else if (event.method === "Runtime.consoleAPICalled") {
      const args = (params.args as { value?: unknown; description?: string }[]).map((arg) => String(arg.value ?? arg.description ?? ""));
      this.console.push(`${target} ${params.type as string}: ${args.join(" ")}`);
    } else if (event.method === "Runtime.exceptionThrown") {
      const details = params.exceptionDetails as { text: string; exception?: { description?: string } };
      this.console.push(`${target} exception: ${details.exception?.description ?? details.text}`);
    }
  }
}

/** A file a page saved (see {@link ChromeBrowser.saveDownloads}). */
export interface Download {
  readonly guid: string;
  /** The name the page gave it. */
  readonly suggested: string;
  /** Where it is saved: the downloads directory and its `guid`. */
  readonly path: string;
  state: "inProgress" | "completed" | "canceled";
}

/** A Chrome process on a profile of its own (see the module comment). */
export class ChromeBrowser {
  readonly profile: string;
  /** The files its pages saved, once {@link saveDownloads} allowed it, in the order they began. */
  readonly downloads: Download[] = [];
  readonly #cdp: Cdp;
  readonly #exited: Promise<void>;
  readonly #kill: () => void;
  #closing: Promise<void> | undefined;

  constructor(profile: string, cdp: Cdp, exited: Promise<void>, kill: () => void) {
    this.profile = profile;
    this.#cdp = cdp;
    this.#exited = exited;
    this.#kill = kill;
  }

  /** Opens a new tab, watched from its first request, and loads `url` in it. */
  async open(url: string): Promise<ChromeTab> {
    const { targetId } = await this.#cdp.send<{ targetId: string }>("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await this.#cdp.send<{ sessionId: string }>("Target.attachToTarget", { targetId, flatten: true });
    const tab = new ChromeTab(this.#cdp, targetId, sessionId);
    await tab.watch(sessionId);
    await this.#cdp.send("Page.enable", {}, sessionId);
    await tab.navigate(url);
    return tab;
  }

  /**
   * Lets its pages save files (a page's backup, BK-5) into `directory`, each named by its download's id, and records
   * them in {@link downloads} (headless Chrome saves nothing unless told where).
   */
  async saveDownloads(directory: string): Promise<void> {
    this.#cdp.listen((event) => {
      if (event.sessionId !== undefined) return;
      const params = event.params as { guid?: string; suggestedFilename?: string; state?: Download["state"] };
      if (event.method === "Browser.downloadWillBegin" && params.guid !== undefined) {
        this.downloads.push({
          guid: params.guid,
          suggested: params.suggestedFilename ?? "",
          path: join(directory, params.guid),
          state: "inProgress",
        });
      } else if (event.method === "Browser.downloadProgress" && params.state !== undefined) {
        const download = this.downloads.find((candidate) => candidate.guid === params.guid);
        if (download !== undefined) download.state = params.state;
      }
    });
    await this.#cdp.send("Browser.setDownloadBehavior", { behavior: "allowAndName", downloadPath: directory, eventsEnabled: true });
  }

  /** Closes Chrome (SIGKILL after 10 s) and deletes its profile. */
  close(): Promise<void> {
    this.#closing ??= (async () => {
      await this.#cdp.send("Browser.close").catch(() => undefined);
      this.#cdp.close();
      const timer = setTimeout(this.#kill, 10_000);
      await this.#exited;
      clearTimeout(timer);
      rmSync(this.profile, { recursive: true, force: true });
    })();
    return this.#closing;
  }
}

/** Starts Chrome headless on a new, empty profile (see the module comment). */
export async function launchChrome(): Promise<ChromeBrowser> {
  const path = chromePath();
  const profile = mkdtempSync(join(tmpdir(), "umbradb-chrome-"));
  const args = [
    "--headless",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--disable-default-apps",
    "--disable-extensions",
    "--metrics-recording-only",
    "--password-store=basic",
    "--use-mock-keychain",
    "--mute-audio",
    ...(process.platform === "linux" && process.env.CI !== undefined ? ["--no-sandbox"] : []),
    "about:blank",
  ];
  const child = spawnChild(path, args, { stdio: ["ignore", "ignore", "pipe"] });
  const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
  const endpoint = await new Promise<string>((resolve, reject) => {
    let text = "";
    const timer = setTimeout(() => reject(new Error(`Chrome did not open its DevTools endpoint within 60 s: ${text}`)), 60_000);
    let found = false;
    child.stderr?.on("data", (chunk: Buffer) => {
      // Chrome's later output is drained, not kept.
      if (found) return;
      text += chunk.toString("utf8");
      const endpoint = /DevTools listening on (ws:\/\/\S+)/.exec(text);
      if (endpoint !== null) {
        found = true;
        clearTimeout(timer);
        resolve(endpoint[1] as string);
      }
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited (${code}) before opening its DevTools endpoint: ${text}`));
    });
  }).catch((error: unknown) => {
    child.kill("SIGKILL");
    rmSync(profile, { recursive: true, force: true });
    throw error;
  });
  const cdp = await Cdp.open(endpoint);
  return new ChromeBrowser(profile, cdp, exited, () => child.kill("SIGKILL"));
}
