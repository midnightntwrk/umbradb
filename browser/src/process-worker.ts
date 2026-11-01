/**
 * One process of the browser build in a dedicated Web Worker: the core (`./core-worker.ts`) or a private instance
 * (`./private-worker.ts`). It is started through the engine (`startProcess`, `src/runner/process.ts`), as `umbradb run`
 * and `startUmbraDB` start one, with the browser's ports. [BR-1, BR-2, BR-3, BR-4, LM-1, LM-11; design §8]
 * - the configuration is `{ data }`: the bundled module's data for this run (`umbradb:configuration`,
 *   `./configuration.ts`), with the development opt-in set on every `core` entry. The browser build always runs under
 *   it, as it runs PGlite only. Startup requires it to be plain data and validates it [BR-1, CF-1]; the working
 *   directory is `/`;
 * - the build is the resolver's for the side the configuration describes, with the configuration's user modules as
 *   objects (`src/runner/resolve.ts`);
 * - the ports: the log (the page's), the ledger worker's entry (`ledger-worker.js`, a Web Worker beside this one, its
 *   node-store bridge a `SharedArrayBuffer`: the page is cross-origin isolated); no admin listener;
 * - the network: nothing listens. The core's private link runs over channels (`publicSide: { channels: true }`), each
 *   one the page hands it for a private process (`./link.ts`); a private process connects over a new `MessageChannel`
 *   the page makes at each (re)connection (`privateSide: { connect }`). The module API and admin are answered by the
 *   process's fetch-style handlers (`api.fetch`, `admin.fetch`) and its subscriptions on a channel (`api.connect`),
 *   all on this worker's message channel [BR-3, LM-3];
 * - the contents hash, the page's reads and the backup read the database the process opened, while its module API is
 *   open (`ProcessHandle.opened`).
 *
 * **S.** The page gives the core S when its database exists (an OPFS database it created before, or a restored
 * backup); for a new database it gives none, and the worker reads the node's finalized head at that moment — its hash,
 * then its header's number — and runs with it as S, which it tells the page, so that the page starts the private
 * instances, and later runs of the same database, with it. The process then records it in the configuration history,
 * as it records any S. [BR-2]
 *
 * A refusal of the configuration itself ends the process: the worker reports it (`refused`, with the finding's
 * details) and the process's log has every finding; the admin endpoints keep answering from the process's last
 * snapshot. [Q137 B, LM-5]
 *
 * **Backup and restore.** `backup` writes a backup of the process's database as `umbradb backup` does on PGlite, and
 * gives the page its text, which the page saves as a file. The backup is the manifest and `pg_dump` of
 * `@electric-sql/pglite-tools` (bundled), taken in one exclusive job of the database's queue, so commits wait
 * (`src/backup/pglite-backup.ts`). [BK-5, BR-3, A131]
 *
 * `restore` restores the file the user picked (a `Blob`) into the core's OPFS database before its process starts, as
 * `umbradb restore` does (`src/backup/restore.ts`, with every restore check, in its order). The configuration is the
 * bundled module's for the run with the backup's S, since a restored database keeps it. Its chain is the configured
 * node (`nodeSourceOf` on a node client of its own, closed when the restore ends). The page then starts the process
 * with that S, and it resumes from the backup's height + 1. [BK-3, BK-4]
 *
 * A memory database ends with its worker, so it is not restored into. Nor is a private instance's: its checks need its
 * public database's core running, which the page starts only after the restore. [Q153]
 */

import "./shims/prelude.js";
import { pgDump } from "@electric-sql/pglite-tools/pg_dump";
import configuration from "umbradb:configuration";
import { readCursor } from "../../src/backbone/core-block-commit/sql.js";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { nodeOptionsOf } from "../../src/backbone/core-chain/core-chain.js";
import { manifestLine, readManifestLine } from "../../src/backup/manifest.js";
import { type PgliteDump, pgliteBackupText } from "../../src/backup/pglite-backup.js";
import { type RestoreSeams, restoreBackup } from "../../src/backup/restore.js";
import { blobText } from "../../src/backup/text.js";
import type { PlainObject } from "../../src/config/plain-data.js";
import type { CommittedHeight } from "../../src/db/api.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { messagePortChannel, type PrivateLinkChannel } from "../../src/library/channels.js";
import { NodeClient } from "../../src/node/client.js";
import { type OpenedProcess, type ProcessHandle, startProcess } from "../../src/runner/process.js";
import { type NetworkRequest, resolve } from "../../src/runner/resolve.js";
import { type BrowserConfiguration, type BrowserRun, withDevelopmentOptIn } from "./configuration.js";
import { openConfiguredDatabase } from "./db/database.js";
import { type DemoLink, demoLink } from "./link.js";
import { crossedError, type FromProcessWorker, jsonSafe, type StartRun, type ToProcessWorker } from "./protocol.js";

/** The worker's global scope, as this module uses it. */
interface Scope {
  readonly location: { readonly href: string };
  postMessage(message: FromProcessWorker): void;
  addEventListener(type: "message", listener: (event: MessageEvent<ToProcessWorker>) => void): void;
}

const scope = globalThis as unknown as Scope;
const post = (message: FromProcessWorker): void => scope.postMessage(message);

let handle: ProcessHandle | null = null;
let starting: Promise<void> | null = null;
/** This worker's ends of the link channels, by the page's link id (`./link.ts`). */
const links = new Map<number, DemoLink>();
/** The core's link channels the page handed over before its process started: accepted once it starts. */
const early: PrivateLinkChannel[] = [];
/** A private process's `connect()` calls waiting for the page's channel, by request. */
const asked = new Map<number, (channel: PrivateLinkChannel) => void>();
let nextAsk = 1;
/**
 * The side of the process this worker started, which `backup` checks since a private database is not backed up without
 * the development opt-in; the core's until `start` says. [PP-12]
 */
let side: "public" | "private" = "public";
/** Whether a restore runs in this worker now (one at a time). */
let restoring = false;

/** The committed height of a core's database: its cursor's; a restore's target is a core's (see above). [DB-2] */
const coreCommittedHeight: CommittedHeight = async (read) => (await readCursor(read))?.height ?? null;

/** The negative control of the page's restore (`browser/build.ts`): the contents hash's check skipped. [A131] */
const RESTORE_SEAMS: RestoreSeams =
  __UMBRADB_BROWSER_CONTROL__ === "restore-skips-contents-hash" ? { skip: { contentsHash: true } } : {};

/** The process's database and its `deterministic: false` tables while its module API is open, or null. */
const openedProcess = (): OpenedProcess | null => handle?.opened() ?? null;

/** A backup of this worker's process's database (see the module comment): its manifest's facts and the file's text. */
async function backUp(): Promise<unknown> {
  const opened = openedProcess();
  if (opened === null) throw new Error("the process has not completed its startup, or has stopped: nothing to back up");
  // The database the process opened and handed its module API: a PGlite database (exclusiveJob checks it).
  const { db } = opened;
  const { manifest, text } = await pgliteBackupText(
    { db, optedOut: opened.optedOut, side, developmentOptIn: true },
    pgDump as unknown as PgliteDump,
  );
  return {
    height: manifest.height,
    start: manifest.start,
    contentsHash: manifest.contentsHash,
    text: manifestLine(manifest) + text,
  };
}

/** Restores the backup `file` into the core's database before its process starts (see the module comment). */
async function restoreInto(file: Blob, run: StartRun): Promise<unknown> {
  if (starting !== null) {
    throw new Error(
      "a backup is restored into the core's database before its process starts: this worker's process " +
        "has started already",
    );
  }
  if (run.storage === "memory") {
    throw new Error(
      "a backup is restored into an OPFS database (the page's storage parameter), not into memory, which ends with " +
        "the restore's worker",
    );
  }
  if (restoring) throw new Error("a restore already runs in this worker");
  restoring = true;
  try {
    const text = blobText(file);
    // The backup's S [BK-4]. A file without a readable manifest is refused by the restore itself, in the order of its
    // checks [BK-3].
    const start = await text.firstLine().then(
      (line) => Number(readManifestLine(line).start),
      () => run.start ?? 0,
    );
    const { data, modules } = (configuration as BrowserConfiguration).core({ ...run, start });
    const resolved = resolve({ data: withDevelopmentOptIn(data), file: null, userModules: modules, side: "public" });
    const { declarations, checked: config, core } = resolved;
    const options = nodeOptionsOf(core.settings as PlainObject);
    if (options === null) throw new Error("the core's configuration has no node to check the backup against");
    const client = new NodeClient({
      ...options,
      onRetry: (retry) => post({ type: "log", line: `restore: node retries in ${retry.delayMs} ms (${retry.operation})` }),
    });
    const source = nodeSourceOf(core, { nodeClient: client });
    try {
      const restored = await restoreBackup(
        {
          file: text,
          target: { backend: "pglite", exists: true },
          open: () => openConfiguredDatabase(core, { committedHeight: coreCommittedHeight }),
          config,
          declarations,
          core,
          source,
        },
        RESTORE_SEAMS,
      );
      const { manifest } = restored;
      post({
        type: "log",
        line: `restored a backup of height ${manifest.height} (S ${manifest.start}, ${restored.statements} statements)`,
      });
      return { start, height: manifest.height, contentsHash: manifest.contentsHash, statements: restored.statements };
    } finally {
      await source.close();
      await client.close();
    }
  } finally {
    restoring = false;
  }
}

/** The node's finalized head's height now: its hash, then its header's number. [BR-2] */
async function finalizedHeight(node: string): Promise<number> {
  const client = new NodeClient({ url: node });
  try {
    const hash = await client.finalizedHead();
    return Number((await client.header(hash)).number);
  } finally {
    await client.close();
  }
}

/**
 * A private process's `connect`: asks the page for a new link channel and resolves with this worker's end. The page
 * always answers; an end it gives after the process stopped is closed by the process. [LM-6, LM-11]
 */
function connectLink(): Promise<PrivateLinkChannel> {
  const ask = nextAsk++;
  return new Promise((resolve) => {
    asked.set(ask, resolve);
    post({ type: "link-connect", ask });
  });
}

/** Takes the page's link messages (see `./protocol.ts`). */
function onLink(message: Exclude<ToProcessWorker, { type: "start" } | { type: "call" }>): void {
  if (message.type === "link-drop") {
    links.get(message.link)?.end();
    links.delete(message.link);
    return;
  }
  const link = demoLink(message.port);
  links.set(message.link, link);
  if (message.type === "link-accept") {
    if (handle === null) early.push(link.channel);
    else handle.privateLink.accept(link.channel);
    return;
  }
  const resolve = asked.get(message.ask);
  asked.delete(message.ask);
  resolve?.(link.channel);
}

/** Starts this worker's process (see the module comment). */
async function startWorkerProcess(message: Extract<ToProcessWorker, { type: "start" }>): Promise<void> {
  side = message.side;
  const chosen = configuration as BrowserConfiguration;
  const isCore = message.side === "public";
  const s = message.run.start ?? (isCore ? await finalizedHeight(message.run.node) : null);
  if (s === null) throw new Error("a private instance starts with the core's S");
  const run: BrowserRun = { ...message.run, start: s };
  const instances = chosen.instances?.(run) ?? [];
  post({ type: "chosen", start: s, instances: isCore ? instances.map((instance) => instance.id) : [] });
  const instance = isCore ? null : instances.find((candidate) => candidate.id === message.instance);
  if (instance === undefined) throw new Error(`the configuration has no private instance ${message.instance}`);
  const { data, modules } = instance === null ? chosen.core(run) : instance.configure(run);
  const ledgerEntry = new URL("./ledger-worker.js", scope.location.href);
  // The engine's resolver takes the side from the configuration: a private instance's has instanceId and no node.
  // Nothing listens: the link over the page's channels, the module API and admin through the handle. [LM-3, LM-11]
  const network: NetworkRequest = isCore
    ? { privateLink: { publicSide: { channels: true } } }
    : { privateLink: { privateSide: { connect: connectLink } } };
  const started = startProcess({
    config: { data: withDevelopmentOptIn(data) },
    cwd: "/",
    network,
    userModules: { modules },
    log: (line) => post({ type: "log", line }),
    ledgerWorkerEntry: ledgerEntry,
  });
  handle = started;
  for (const channel of early.splice(0)) started.privateLink.accept(channel);
  started.started.then(
    () => post({ type: "started" }),
    (error: unknown) => post({ type: "refused", error: crossedError(error) }),
  );
  void started.ended.then((end) => post({ type: "ended", end: jsonSafe(end) }));
}

/** Answers one call of the page (see `./protocol.ts`). */
async function answer(method: string, args: readonly unknown[]): Promise<unknown> {
  // Every call answers at once, also while S is being asked of the node (a node that does not answer yet).
  switch (method) {
    case "status":
      return jsonSafe(handle?.status() ?? null);
    case "admin": {
      if (handle === null) throw new Error("no admin endpoint answers yet: the process has not started");
      const answered = await handle.admin.fetch(new Request(new URL(String(args[0]), scope.location.href)));
      return { status: answered.status, body: await answered.json() };
    }
    case "contents-hash": {
      const opened = openedProcess();
      if (opened === null) throw new Error("the process has not completed its startup, or has stopped");
      return opened.db.read(async (read) => ({
        height: jsonSafe(read.height),
        hash: jsonSafe(await contentsHash(read, { optedOut: opened.optedOut })),
      }));
    }
    case "read": {
      const opened = openedProcess();
      if (opened === null) throw new Error("the process has not completed its startup, or has stopped");
      const [sql, params] = args as [string, unknown[] | undefined];
      return opened.db.read(async (read) => jsonSafe({ height: read.height, rows: await read.query(sql, params ?? []) }));
    }
    case "api": {
      if (handle === null) throw new Error("no module API answers yet: the process has not started");
      const [request] = args as [{ method: string; path: string; query?: [string, string][]; body?: string }];
      const url = new URL(request.path, scope.location.href);
      for (const [name, value] of request.query ?? []) url.searchParams.append(name, value);
      const answered = await handle.api.fetch(new Request(url, { method: request.method, ...(request.body === undefined ? {} : { body: request.body }) }));
      return { status: answered.status, headers: Object.fromEntries(answered.headers), body: await answered.text() };
    }
    case "connect-api": {
      if (handle === null) throw new Error("no module API answers yet: the process has not started");
      const [port] = args as [MessagePort];
      handle.api.connect(messagePortChannel(port));
      return null;
    }
    case "backup":
      return backUp();
    case "restore": {
      const [file, run] = args as [Blob, StartRun];
      return restoreInto(file, run);
    }
    case "stop":
      await starting;
      await handle?.stop();
      return jsonSafe(handle?.status() ?? null);
    default:
      throw new Error(`no call ${method}`);
  }
}

scope.addEventListener("message", (event) => {
  const message = event.data;
  if (message.type === "link-accept" || message.type === "link-channel" || message.type === "link-drop") {
    onLink(message);
    return;
  }
  if (message.type === "start") {
    if (starting !== null || restoring) return;
    starting = startWorkerProcess(message).catch((error: unknown) => {
      post({ type: "log", line: `the worker could not start its process: ${error instanceof Error ? error.message : String(error)}` });
      post({ type: "refused", error: crossedError(error) });
    });
    return;
  }
  answer(message.method, message.args).then(
    (value) => post({ type: "result", id: message.id, ok: true, value }),
    (error: unknown) => post({ type: "result", id: message.id, ok: false, error: crossedError(error) }),
  );
});
