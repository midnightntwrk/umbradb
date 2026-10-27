/**
 * The page of the browser build (`openspec/changes/core-arch/specs/browser/spec.md` BR-1 to BR-4; `specs/backups/
 * spec.md` BK-5; `design.md` §9.2; task 16.1): a static page that runs the core and its modules in the browser, for
 * showing the product and testing modules — a development setup.
 *
 * **What it starts.** The core worker (`core-worker.js`), then one private worker (`private-worker.js`) for each
 * private instance the bundled configuration has, once the core has chosen S; every worker joins the page's message
 * network (`./net/broker.ts`), over which the private instances reach the core's transport. Each worker owns its
 * database, through its Web Lock (BR-1).
 *
 * **Its address's parameters.** `node` — the node's WebSocket URL, which must allow the page's origin (BR-3); `storage`
 * — `memory` (the default: a new database at each load) or a name, the database's in the origin's private file system
 * (OPFS), which survives a reload; any other parameter is the configuration's to read (`./configuration.ts`).
 *
 * **S (BR-2).** For an OPFS database the page keeps the S it was created with in the origin's `localStorage`
 * (`umbradb-start:<name>`), so a reload, or a second tab, runs it with the same configuration; a database it has no S
 * for is new, and the core worker chooses S as the node's finalized head at that moment.
 *
 * **What it reaches** (BR-3): its own origin, for its files, and the node, through the core worker's WebSocket; the
 * admin endpoints and the module API are calls on the workers' channels. Backup and restore of the page's database
 * (BK-5) wait for `umbradb backup` and `umbradb restore` (tasks 15.1, 15.2): the page shows them, disabled.
 *
 * **`window.umbradb`** is the page's state and its calls, for whoever drives it (the tests, a console): `ready`
 * (resolves once every worker is started), `start` (S), `core` and `instances` (each with `call`, its `log` and its
 * `events`), and `errors` (the page's own).
 */

import { NetworkBroker } from "./net/broker.js";
import type { CallMethod, CrossedError, FromProcessWorker, StartRun, ToProcessWorker } from "./protocol.js";

/** A process worker as the page drives it. */
export interface ProcessView {
  readonly name: string;
  /** Calls the process (`./protocol.ts`); rejects with the worker's error (its name, message, code and details). */
  call(method: CallMethod, ...args: unknown[]): Promise<unknown>;
  /** Its log lines, in order. */
  readonly log: string[];
  /** What it told the page besides log lines and results: `chosen`, `started`, `refused`, `ended`, `next`. */
  readonly events: FromProcessWorker[];
}

/** What the page shows of itself (see the module comment). */
export interface PageState {
  readonly ready: Promise<void>;
  start: number | null;
  readonly core: ProcessView;
  readonly instances: Record<string, ProcessView>;
  readonly errors: string[];
}

const params = Object.fromEntries(new URLSearchParams(location.search).entries());
const storage = params.storage ?? "memory";
const node = params.node ?? "";
const startKey = `umbradb-start:${storage}`;
const broker = new NetworkBroker();
const errors: string[] = [];

/** The S this page keeps for its OPFS database, or null (see the module comment). */
function keptStart(): number | null {
  if (storage === "memory") return null;
  const kept = localStorage.getItem(startKey);
  return kept === null ? null : Number(kept);
}

/** Starts a process worker (`file`) with `side` and `instance`, and gives the page its view. */
function startWorker(file: string, name: string, side: "public" | "private", instance: string | null, run: StartRun): ProcessView & { readonly worker: Worker } {
  const worker = new Worker(new URL(file, location.href), { type: "module", name });
  const waiting = new Map<number, { resolve(value: unknown): void; reject(error: Error): void }>();
  const log: string[] = [];
  const events: FromProcessWorker[] = [];
  let next = 1;
  worker.addEventListener("message", (event: MessageEvent<FromProcessWorker>) => {
    const message = event.data;
    if (message.type === "log") {
      log.push(message.line);
      appendLog(name, message.line);
      return;
    }
    if (message.type === "result") {
      const call = waiting.get(message.id);
      waiting.delete(message.id);
      if (message.ok) call?.resolve(message.value);
      else call?.reject(Object.assign(new Error(message.error.message), message.error));
      return;
    }
    events.push(message);
    onEvent(name, message);
  });
  worker.addEventListener("error", (event) => {
    errors.push(`${name}: ${event.message}`);
  });
  const network = broker.join();
  worker.postMessage({ type: "start", side, instance, run, network } satisfies ToProcessWorker, [network]);
  return {
    name,
    worker,
    log,
    events,
    call(method, ...args) {
      const id = next++;
      return new Promise((resolve, reject) => {
        waiting.set(id, { resolve, reject });
        worker.postMessage({ type: "call", id, method, args } satisfies ToProcessWorker);
      });
    },
  };
}

/** Resolves with the core's `chosen` event. */
function chosen(view: ProcessView): Promise<Extract<FromProcessWorker, { type: "chosen" }>> {
  return new Promise((resolve, reject) => {
    const check = (): void => {
      const found = view.events.find((event) => event.type === "chosen");
      if (found !== undefined) resolve(found as Extract<FromProcessWorker, { type: "chosen" }>);
      else if (view.events.some((event) => event.type === "refused")) {
        const refused = view.events.find((event) => event.type === "refused") as { readonly error: CrossedError };
        reject(new Error(`the core did not start: ${refused.error.message}`));
      } else setTimeout(check, 50);
    };
    check();
  });
}

const run: StartRun = { node, storage, start: keptStart(), params };
const core = startWorker("./core-worker.js", "core", "public", null, run);
const instances: Record<string, ProcessView> = {};
const state: PageState = {
  ready: chosen(core).then(({ start, instances: ids }) => {
    state.start = start;
    if (storage !== "memory") localStorage.setItem(startKey, String(start));
    for (const id of ids) instances[id] = startWorker("./private-worker.js", id, "private", id, { ...run, start });
    render();
  }),
  start: null,
  core,
  instances,
  errors,
};
state.ready.catch((error: unknown) => errors.push(String(error)));
(globalThis as { umbradb?: PageState }).umbradb = state;

if (__UMBRADB_BROWSER_CONTROL__ === "foreign-request" && params.foreign !== undefined) {
  // The negative control of A131: a page that reaches something beside the node.
  void fetch(params.foreign, { mode: "no-cors" }).catch(() => undefined);
}

// ── What the page shows ──────────────────────────────────────────────────────────────────────────────────────────────

function element(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function appendLog(name: string, line: string): void {
  const list = element("log");
  if (list === null) return;
  const item = document.createElement("li");
  item.textContent = `${name}: ${line}`;
  list.append(item);
  while (list.childElementCount > 500) list.firstElementChild?.remove();
}

function onEvent(name: string, message: FromProcessWorker): void {
  if (message.type === "refused") appendLog(name, `startup refused: ${message.error.code ?? message.error.name}: ${message.error.message}`);
  if (message.type === "ended") appendLog(name, `processing ended: ${JSON.stringify(message.end)}`);
}

async function render(): Promise<void> {
  const table = element("processes");
  if (table === null) return;
  const views = [core, ...Object.values(instances)];
  const rows = await Promise.all(
    views.map(async (view) => {
      const status = (await view.call("admin", "/status").catch(() => null)) as { body?: Record<string, unknown> } | null;
      const body = status?.body ?? {};
      return [view.name, String(body.state ?? "-"), String(body.cursor ?? "-"), String(body.head ?? "-"), String(body.lag ?? "-")];
    }),
  );
  table.replaceChildren(
    ...rows.map((cells) => {
      const row = document.createElement("tr");
      for (const cell of cells) {
        const td = document.createElement("td");
        td.textContent = cell;
        row.append(td);
      }
      return row;
    }),
  );
  const start = element("start");
  if (start !== null) start.textContent = state.start === null ? "choosing…" : String(state.start);
}

setInterval(() => void render(), 1_000);
const where = element("where");
if (where !== null) where.textContent = `storage ${storage}`;
