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
 * **What it reaches** (BR-3): its own origin, for its files, the node, through the core worker's WebSocket, and a backup
 * file the user picks; the admin endpoints and the module API are calls on the workers' channels.
 *
 * **Backup and restore (BK-5).** "Back up" asks the core worker for a backup of its database (`umbradb backup`'s on
 * PGlite: the manifest and `pglite-tools`' dump, taken while commits wait) and saves it as a file
 * (`umbradb-<storage>-<height>.backup`). A backup is restored into a new OPFS database: with the `restore` parameter
 * the page does not start the core; the file the user then picks is restored by the core worker with every check of
 * BK-3 (`umbradb restore`'s; the configured node's genesis and blocks), a refused one leaving the database empty and
 * the page waiting for another file. Once one is restored the page keeps the backup's S for the database and starts
 * the core, which resumes from the backup's height + 1 (BK-4).
 *
 * **`window.umbradb`** is the page's state and its calls, for whoever drives it (the tests, a console): `ready`
 * (resolves once every worker is started), `start` (S), `core` and `instances` (each with `call`, its `log` and its
 * `events`), `backup()` and `restore(file)` (the buttons' work), what each did (`backups`, `restores`), and `errors`
 * (the page's own).
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

/** What a restore of a picked file did: restored, or refused with BK-3's code and the worker's message and details. */
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
  readonly errors: string[];
}

const params = Object.fromEntries(new URLSearchParams(location.search).entries());
const storage = params.storage ?? "memory";
const node = params.node ?? "";
const startKey = `umbradb-start:${storage}`;
/** Whether the page waits for a backup to restore before it starts the core (see the module comment). */
const restoreMode = params.restore !== undefined && storage !== "memory";
const broker = new NetworkBroker();
const errors: string[] = [];
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
      const network = broker.join();
      worker.postMessage({ type: "start", side, instance, run, network } satisfies ToProcessWorker, [network]);
    },
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

/** Makes a process worker and starts its process at once. */
function startWorker(file: string, name: string, side: "public" | "private", instance: string | null, run: StartRun): WorkerView {
  const view = makeWorker(file, name);
  view.begin(side, instance, run);
  return view;
}

const run: StartRun = { node, storage, start: keptStart(), params };
const core = makeWorker("./core-worker.js", "core");
const instances: Record<string, ProcessView> = {};
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
  errors,
};
state.ready.catch((error: unknown) => errors.push(String(error)));
(globalThis as { umbradb?: PageState }).umbradb = state;
if (!restoreMode) beginCore(run);

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

// ── Backup and restore (BK-5) ────────────────────────────────────────────────────────────────────────────────────────

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
