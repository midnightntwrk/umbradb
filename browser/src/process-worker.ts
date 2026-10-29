/**
 * One process of the browser build in a dedicated Web Worker: the core (`./core-worker.ts`) or a private instance
 * (`./private-worker.ts`). It is started as `umbradb run` starts one (`src/cli/run.ts`), with the same build and the
 * same runner. [BR-1, BR-2, BR-3, BR-4; design §9.2]
 * - the build is the command's (`commandBuild`: UmbraDB's backbone parts and core modules, and the configuration's user
 *   modules; a private process's backbone with its private intake);
 * - the configuration is the bundled module's data for this run (`umbradb:configuration`, `./configuration.ts`), with
 *   the development opt-in set on every `core` entry. The browser build always runs under it, as it runs PGlite only.
 *   Startup requires it to be plain data and validates it [BR-1, CF-1];
 * - the block source is the node's (`nodeSourceOf`) for the core, the private intake's for a private process, whose
 *   transport to the core runs over the page's message network (`./net/`);
 * - the ledger worker is a Web Worker beside this one (`ledger-worker.js`, `src/ledger/worker/host.ts` unchanged), its
 *   node-store bridge a `SharedArrayBuffer` (the page is cross-origin isolated);
 * - the admin endpoints are calls on this worker's channel (`./admin.ts`), and so is the module API (`./runner/
 *   api.ts`) [BR-3].
 *
 * **S.** The page gives the core S when its database exists (an OPFS database it created before, or a restored
 * backup); for a new database it gives none, and the worker reads the node's finalized head at that moment — its hash,
 * then its header's number — and runs with it as S, which it tells the page, so that the page starts the private
 * instances, and later runs of the same database, with it. The process then records it in the configuration history,
 * as it records any S. [BR-2]
 *
 * A refusal of the configuration itself ends the process: the worker reports it (`refused`, with the finding's
 * details) and the process's log has every finding. Nothing more answers but the worker's own calls. [Q137 B]
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
import { readCursor } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { nodeOptionsOf } from "../../src/backbone/core-chain/core-chain.js";
import { privateIntake } from "../../src/backbone/core-private-source/index.js";
import { manifestLine, readManifestLine } from "../../src/backup/manifest.js";
import { type PgliteDump, pgliteBackupText } from "../../src/backup/pglite-backup.js";
import { type RestoreSeams, restoreBackup } from "../../src/backup/restore.js";
import { blobText } from "../../src/backup/text.js";
import { buildDeclarations, commandBuild } from "../../src/cli/build-modules.js";
import { type PlainObject, plainData } from "../../src/config/plain-data.js";
import { processCoreEntry } from "../../src/config/process.js";
import { validateConfig } from "../../src/config/validate.js";
import type { CommittedHeight, Database } from "../../src/db/api.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { NodeClient } from "../../src/node/client.js";
import { type ProcessHandle, type ProcessInput, startProcess } from "../../src/runner/process.js";
import { adminAnswer, messageAdmin } from "./admin.js";
import { type BrowserConfiguration, type BrowserRun, withDevelopmentOptIn } from "./configuration.js";
import { openConfiguredDatabase } from "./db/database.js";
import { useNetwork } from "./net/network.js";
import { crossedError, type FromProcessWorker, jsonSafe, type StartRun, type ToProcessWorker } from "./protocol.js";
import { openedProcess } from "./runner/process-registry.js";

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
/**
 * The side of the process this worker started, which `backup` checks since a private database is not backed up without
 * the development opt-in; the core's until `start` says. [PP-12]
 */
let side: "public" | "private" = "public";
/** Whether a restore runs in this worker now (one at a time). */
let restoring = false;
const subscriptions = new Map<string, () => void>();

/** The committed height of a core's database: its cursor's; a restore's target is a core's (see above). [DB-2] */
const coreCommittedHeight: CommittedHeight = async (read) => (await readCursor(read))?.height ?? null;

/** The negative control of the page's restore (`browser/build.ts`): the contents hash's check skipped. [A131] */
const RESTORE_SEAMS: RestoreSeams =
  __UMBRADB_BROWSER_CONTROL__ === "restore-skips-contents-hash" ? { skip: { contentsHash: true } } : {};

/** A backup of this worker's process's database (see the module comment): its manifest's facts and the file's text. */
async function backUp(): Promise<unknown> {
  const opened = openedProcess();
  if (opened === null) throw new Error("the process has not completed its startup, or has stopped: nothing to back up");
  // The database the process opened and handed its module API: a PGlite database of the API (exclusiveJob checks it).
  const db = opened.db as Database;
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
    const declarations = buildDeclarations(modules);
    const config = validateConfig({ config: { data: plainData(withDevelopmentOptIn(data)) }, declarations, side: "public" });
    const core = processCoreEntry(config);
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

/** Starts this worker's process (see the module comment). */
async function startWorkerProcess(message: Extract<ToProcessWorker, { type: "start" }>): Promise<void> {
  useNetwork(message.network);
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
  const intake = isCore ? null : privateIntake();
  const declarations = intake === null ? commandBuild(modules) : commandBuild(modules, { side: "private", intake });
  const source: ProcessInput["source"] = intake === null ? nodeSourceOf : (core, shared) => intake.source(core, shared);
  const ledgerEntry = new URL("./ledger-worker.js", scope.location.href);
  handle = startProcess({
    declarations,
    config: { data: withDevelopmentOptIn(data) },
    source,
    side: message.side,
    log: (line) => post({ type: "log", line }),
    admin: messageAdmin,
    ledgerWorker: () => startLedgerWorker({ entry: ledgerEntry }),
  });
  handle.started.then(
    (started) => post({ type: "started", api: started.api }),
    (error: unknown) => post({ type: "refused", error: crossedError(error) }),
  );
  void handle.ended.then((end) => post({ type: "ended", end: jsonSafe(end) }));
}

/** Answers one call of the page (see `./protocol.ts`). */
async function answer(method: string, args: readonly unknown[]): Promise<unknown> {
  // Every call answers at once, also while S is being asked of the node (a node that does not answer yet).
  switch (method) {
    case "status":
      return jsonSafe(handle?.status() ?? null);
    case "admin": {
      const answered = adminAnswer("GET", String(args[0]));
      if (answered === null) throw new Error("no admin endpoint is served: the process's core revision is not known");
      return jsonSafe(answered);
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
      const api = openedProcess()?.api ?? null;
      if (api === null) throw new Error("no module API answers: the process has no listen.api, or has not started it");
      const [request] = args as [{ method: string; path: string; query?: [string, string][]; body?: string }];
      return jsonSafe(await api.answer(request));
    }
    case "subscribe": {
      const api = openedProcess()?.api ?? null;
      if (api === null) throw new Error("no module API answers: the process has no listen.api, or has not started it");
      const [id, name, subscriptionArgs] = args as [string, string, unknown];
      if (subscriptions.has(id)) throw new Error(`subscription ${id} is open already`);
      subscriptions.set(id, api.subscribe(name, subscriptionArgs, (value) => post({ type: "next", subscription: id, value: jsonSafe(value) })));
      return null;
    }
    case "unsubscribe": {
      const [id] = args as [string];
      subscriptions.get(id)?.();
      subscriptions.delete(id);
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
