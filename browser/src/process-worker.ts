/**
 * One process of the browser build in a dedicated Web Worker (`openspec/changes/core-arch/specs/browser/spec.md` BR-1
 * to BR-4; `design.md` §9.2; task 16.1): the core (`./core-worker.ts`) or a private instance (`./private-worker.ts`),
 * started as `umbradb run` starts one (`src/cli/run.ts`), with the same build and the same runner:
 * - the build is the command's (`commandBuild`: UmbraDB's backbone parts and core modules, and the configuration's user
 *   modules; a private process's backbone with its private intake);
 * - the configuration is the bundled module's data for this run (`umbradb:configuration`, `./configuration.ts`), with
 *   the development opt-in set on every `core` entry — the browser build always runs under it (BR-1), as it runs PGlite
 *   only —; startup holds it to CF-1's plain data and validates it;
 * - the block source is the node's (`nodeSourceOf`) for the core, the private intake's for a private process, whose
 *   transport to the core runs over the page's message network (`./net/`);
 * - the ledger worker is a Web Worker beside this one (`ledger-worker.js`, `src/ledger/worker/host.ts` unchanged), its
 *   node-store bridge a `SharedArrayBuffer` (the page is cross-origin isolated);
 * - the admin endpoints are calls on this worker's channel (`./admin.ts`, BR-3), and so is the module API (`./runner/
 *   api.ts`).
 *
 * **S (BR-2).** The page gives the core S when its database exists (an OPFS database it created before, or a restored
 * backup); for a new database it gives none, and the worker reads the node's finalized head at that moment — its hash,
 * then its header's number — and runs with it as S, which it tells the page, so that the page starts the private
 * instances, and later runs of the same database, with it. The process then records it in the configuration history,
 * as it records any S.
 *
 * A refusal of the configuration itself ends the process (Q137 B): the worker reports it (`refused`, with the
 * finding's details) and the process's log has every finding; nothing more answers but the worker's own calls.
 */

import "./shims/prelude.js";
import configuration from "umbradb:configuration";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { privateIntake } from "../../src/backbone/core-private-source/index.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { NodeClient } from "../../src/node/client.js";
import { type ProcessHandle, type ProcessInput, startProcess } from "../../src/runner/process.js";
import { adminAnswer, messageAdmin } from "./admin.js";
import { type BrowserConfiguration, type BrowserRun, withDevelopmentOptIn } from "./configuration.js";
import { useNetwork } from "./net/network.js";
import { crossedError, type FromProcessWorker, jsonSafe, type ToProcessWorker } from "./protocol.js";
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
const subscriptions = new Map<string, () => void>();

/** The node's finalized head's height now (BR-2): its hash, then its header's number. */
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
    if (starting !== null) return;
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
