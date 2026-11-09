/**
 * The page of the browser build: a static page that runs the core and its modules in the browser, for showing the
 * product and testing modules. It is a development setup.
 *
 * **What it starts.** The core worker (`core-worker.js`), then, once the core has chosen S, one private worker
 * (`private-worker.js`) for each private instance the bundled configuration has. Each worker owns its database,
 * through its Web Lock.
 *
 * **The private link.** When a private worker's process connects to the core (at its start, and again after a lost
 * connection), it asks the page for a channel: the page makes a new `MessageChannel`, gives one end to the core worker
 * and the other to the private worker, and records it (`links`); the link's messages then go from worker to worker.
 * `dropLink(instance)` drops an instance's channel, as a lost connection would end it: both workers are told, and the
 * private process connects again over a new channel (`./link.ts`).
 *
 * **Its address's parameters.**
 * - `node`: the node's WebSocket URL, which must allow the page's origin.
 * - `storage`: `memory` (the default: a new database at each load), or a name: the database's, in the origin's private
 *   file system (OPFS), which survives a reload.
 * - Any other parameter is the configuration's to read (`./configuration.ts`).
 *
 * **S.** For an OPFS database the page keeps the S it was created with in the origin's `localStorage`
 * (`umbradb-start:<name>`), so a reload, or a second tab, runs it with the same configuration. A database it has no S
 * for is new, and the core worker chooses S as the node's finalized head at that moment.
 *
 * **What it reaches:** its own origin, for its files; the node, through the core worker's WebSocket; and a backup file
 * the user picks. The admin endpoints and the module API are calls on the workers' channels, and the module API's
 * subscriptions run on a `MessageChannel` of their own (`openApi`).
 *
 * **Backup and restore.** "Back up" asks the core worker for a backup of its database and saves it as a file
 * (`umbradb-<storage>-<height>.backup`). The backup is the one `umbradb backup` takes on PGlite: the manifest and
 * `pglite-tools`' dump, taken while commits wait.
 *
 * A backup is restored into a new OPFS database. With the `restore` parameter the page does not start the core. The
 * core worker restores the file the user then picks with every check `umbradb restore` makes (the configured node's
 * genesis and blocks); a refused file leaves the database empty and the page waiting for another file. Once one is
 * restored, the page keeps the backup's S for the database and starts the core, which resumes from the backup's
 * height + 1.
 *
 * **`window.umbradb`** is the page's state and its calls, for whoever drives it (the tests, a console): `ready`
 * (resolves once every worker is started), `start` (S), `core` and `instances` (each with `call`, `openApi`, its `log`
 * and its `events`), `backup()` and `restore(file)` (the buttons' work), what each did (`backups`, `restores`), the
 * link channels made (`links`) and `dropLink(instance)`, and `errors` (the page's own).
 */

import type { CallMethod, CrossedError, FromProcessWorker, StartRun, ToProcessWorker } from "./protocol.js";

/** A channel of the module API's subscriptions (`openApi`): the page's end, every message kept parsed. */
export interface ApiChannel {
  /** Sends `message` as JSON text (a text as it is). */
  send(message: unknown): void;
  /** Every message the process sent, parsed, in order. */
  readonly received: unknown[];
  close(): void;
}

/** A link channel the page made (see the module comment). */
export interface LinkRecord {
  readonly link: number;
  /** The private instance that asked for it. */
  readonly instance: string;
  /** Whether the page dropped it. */
  dropped: boolean;
}

/** A process worker as the page drives it. */
export interface ProcessView {
  readonly name: string;
  /** Calls the process (`./protocol.ts`); rejects with the worker's error (its name, message, code and details). */
  call(method: CallMethod, ...args: unknown[]): Promise<unknown>;
  /** Opens a channel on which the process serves the module API's subscriptions (`api.connect`). */
  openApi(): Promise<ApiChannel>;
  /** Its log lines, in order. */
  readonly log: string[];
  /** What it told the page besides log lines, results and link requests: `chosen`, `started`, `refused`, `ended`. */
  readonly events: FromProcessWorker[];
}

/** A backup the page saved (see the module comment). */
export interface SavedBackup {
  /** The file's name. */
  readonly file: string;
  readonly height: string;
  readonly start: string;
  readonly contentsHash: string;
  /** The file's size in bytes. */
  readonly bytes: number;
}

/** What a restore of a picked file did: restored, or refused with the restore's code, message and details. */
export type RestoreRecord =
  | {
      readonly file: string;
      readonly restored: true;
      readonly start: number;
      readonly height: string;
      readonly contentsHash: string;
      readonly statements: number;
    }
  | {
      readonly file: string;
      readonly restored: false;
      readonly code: string | null;
      readonly message: string;
      readonly details: unknown;
    };

/** What the page shows of itself (see the module comment). */
export interface PageState {
  readonly ready: Promise<void>;
  start: number | null;
  readonly core: ProcessView;
  readonly instances: Record<string, ProcessView>;
  /** Backs the core's database up and saves the file. */
  backup(): Promise<SavedBackup>;
  /** Restores `file` into the core's database (`restore` parameter only), then starts the core. */
  restore(file: Blob, name?: string): Promise<RestoreRecord>;
  readonly backups: SavedBackup[];
  readonly restores: RestoreRecord[];
  /** Every link channel the page made, in order. */
  readonly links: LinkRecord[];
  /** Drops `instance`'s link channel now open, as a lost connection (see the module comment); its id, or null. */
  dropLink(instance: string): number | null;
  readonly errors: string[];
}

const params = Object.fromEntries(new URLSearchParams(location.search).entries());
const storage = params.storage ?? "memory";
const node = params.node ?? "";
const startKey = `umbradb-start:${storage}`;
/** Whether the page waits for a backup to restore before it starts the core (see the module comment). */
const restoreMode = params.restore !== undefined && storage !== "memory";
const errors: string[] = [];
const links: LinkRecord[] = [];
let nextLink = 1;
const backups: SavedBackup[] = [];
const restores: RestoreRecord[] = [];

/** The S this page keeps for its OPFS database, or null (see the module comment). */
function keptStart(): number | null {
  if (storage === "memory") return null;
  const kept = localStorage.getItem(startKey);
  return kept === null ? null : Number(kept);
}

/** A process worker the page made, and what starts its process. */
type WorkerView = ProcessView & {
  readonly worker: Worker;
  begin(side: "public" | "private", instance: string | null, run: StartRun): void;
};

/** Makes a process worker (`file`) and gives the page its view; its process starts with `begin`. */
function makeWorker(file: string, name: string): WorkerView {
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
    if (message.type === "link-connect") {
      makeLink(name, worker, message.ask);
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
  return {
    name,
    worker,
    log,
    events,
    begin(side, instance, run) {
      worker.postMessage({ type: "start", side, instance, run } satisfies ToProcessWorker);
    },
    call,
    async openApi() {
      const channel = new MessageChannel();
      const received: unknown[] = [];
      channel.port1.onmessage = (event: MessageEvent<unknown>) =>
        received.push(typeof event.data === "string" ? JSON.parse(event.data) : event.data);
      await call("connect-api", channel.port2);
      return {
        send: (message: unknown) => channel.port1.postMessage(typeof message === "string" ? message : JSON.stringify(message)),
        received,
        close: () => channel.port1.close(),
      };
    },
  };

  function call(method: CallMethod, ...args: unknown[]): Promise<unknown> {
    const id = next++;
    // A port among the arguments goes to the worker (`connect-api`'s).
    const transfer = args.filter((arg): arg is MessagePort => arg instanceof MessagePort);
    return new Promise((resolve, reject) => {
      waiting.set(id, { resolve, reject });
      worker.postMessage({ type: "call", id, method, args } satisfies ToProcessWorker, transfer);
    });
  }
}

/**
 * A new link channel for private instance `instance` (its worker `from`), the answer to its request `ask`: one end to
 * the core worker, the other to it (see the module comment).
 */
function makeLink(instance: string, from: Worker, ask: number): void {
  const link = nextLink++;
  const channel = new MessageChannel();
  links.push({ link, instance, dropped: false });
  core.worker.postMessage({ type: "link-accept", link, port: channel.port1 } satisfies ToProcessWorker, [channel.port1]);
  from.postMessage({ type: "link-channel", ask, link, port: channel.port2 } satisfies ToProcessWorker, [channel.port2]);
}

/** Drops `instance`'s link channel now open (see the module comment). */
function dropLink(instance: string): number | null {
  const open = links.findLast((record) => record.instance === instance && !record.dropped);
  const view = instances[instance] as WorkerView | undefined;
  if (open === undefined || view === undefined) return null;
  open.dropped = true;
  for (const worker of [core.worker, view.worker]) worker.postMessage({ type: "link-drop", link: open.link } satisfies ToProcessWorker);
  return open.link;
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

/** Makes a process worker and starts its process at once. */
function startWorker(file: string, name: string, side: "public" | "private", instance: string | null, run: StartRun): WorkerView {
  const view = makeWorker(file, name);
  view.begin(side, instance, run);
  return view;
}

const run: StartRun = { node, storage, start: keptStart(), params };
const core = makeWorker("./core-worker.js", "core");
const instances: Record<string, WorkerView> = {};
/** Starts the core's process with `started` (at once, or once a backup is restored). */
let beginCore: (started: StartRun) => void = () => undefined;
const coreBegun = new Promise<void>((resolve) => {
  beginCore = (started) => {
    core.begin("public", null, started);
    resolve();
  };
});

/** Backs the core's database up and saves the file (see the module comment). */
async function backUp(): Promise<SavedBackup> {
  const made = (await core.call("backup")) as { height: string; start: string; contentsHash: string; text: string };
  const blob = new Blob([made.text], { type: "application/octet-stream" });
  const file = `umbradb-${storage}-${made.height}.backup`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  const saved: SavedBackup = { file, height: made.height, start: made.start, contentsHash: made.contentsHash, bytes: blob.size };
  backups.push(saved);
  return saved;
}

let restored = false;

/** Restores `file` into the core's database, then starts the core with the backup's S (see the module comment). */
async function restoreFrom(file: Blob, name: string): Promise<RestoreRecord> {
  if (!restoreMode || restored) {
    throw new Error(
      "a backup is restored into a new OPFS database: open the page with the restore parameter and a storage name, " +
        "before the core starts",
    );
  }
  let record: RestoreRecord;
  try {
    const made = (await core.call("restore", file, run)) as {
      start: number;
      height: string;
      contentsHash: string;
      statements: number;
    };
    record = { file: name, restored: true, ...made };
  } catch (error) {
    const crossed = error as Partial<CrossedError> & Error;
    record = { file: name, restored: false, code: crossed.code ?? null, message: crossed.message, details: crossed.details ?? null };
    restores.push(record);
    return record;
  }
  restores.push(record);
  restored = true;
  localStorage.setItem(startKey, String(record.start));
  beginCore({ ...run, start: record.start });
  return record;
}

const state: PageState = {
  ready: coreBegun
    .then(() => chosen(core))
    .then(({ start, instances: ids }) => {
      state.start = start;
      if (storage !== "memory") localStorage.setItem(startKey, String(start));
      for (const id of ids) instances[id] = startWorker("./private-worker.js", id, "private", id, { ...run, start });
      render();
    }),
  start: null,
  core,
  instances,
  backup: backUp,
  restore: (file, name) => restoreFrom(file, name ?? (file as { name?: string }).name ?? "backup"),
  backups,
  restores,
  links,
  dropLink,
  errors,
};
state.ready.catch((error: unknown) => errors.push(String(error)));
(globalThis as { umbradb?: PageState }).umbradb = state;
if (!restoreMode) beginCore(run);

if (__UMBRADB_BROWSER_CONTROL__ === "foreign-request" && params.foreign !== undefined) {
  // The negative control for what the page reaches: a page that reaches something beside the node.
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

// ── Backup and restore ────────────────────────────────────────────────────────────────────────────────────────

const backupButton = element("backup") as HTMLButtonElement | null;
const restoreInput = element("restore-file") as HTMLInputElement | null;
const backupNote = element("backup-note");

function note(text: string): void {
  if (backupNote !== null) backupNote.textContent = text;
}

if (backupButton !== null) {
  // Enabled once the core has started (its database open).
  const enable = setInterval(() => {
    if (core.events.some((event) => event.type === "started")) {
      backupButton.disabled = false;
      clearInterval(enable);
    }
  }, 250);
  backupButton.addEventListener("click", () => {
    backupButton.disabled = true;
    backUp().then(
      (saved) => note(`saved ${saved.file}: height ${saved.height}, ${saved.bytes} bytes`),
      (error: unknown) => note(`backup failed: ${error instanceof Error ? error.message : String(error)}`),
    ).finally(() => {
      backupButton.disabled = false;
    });
  });
}

if (restoreInput !== null) {
  restoreInput.disabled = !restoreMode;
  if (restoreMode) note("pick a backup to restore into this database; the core starts once one is restored");
  restoreInput.addEventListener("change", () => {
    const file = restoreInput.files?.[0];
    if (file === undefined) return;
    restoreInput.disabled = true;
    restoreFrom(file, file.name).then(
      (record) => {
        restoreInput.value = "";
        if (record.restored) note(`restored ${record.file}: height ${record.height}; the core resumes from there`);
        else {
          restoreInput.disabled = false;
          note(`restore refused (${record.code ?? "error"}): ${record.message}`);
        }
      },
      (error: unknown) => {
        restoreInput.value = "";
        restoreInput.disabled = false;
        note(`restore failed: ${error instanceof Error ? error.message : String(error)}`);
      },
    );
  });
}
