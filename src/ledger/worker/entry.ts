/**
 * The ledger worker thread's entry (`openspec/changes/core-arch/design.md` §5.3; task 12.3): the engine (`./engine.ts`)
 * over the adapters `../load.ts` loads — or a test package's loader (`workerData.loader`) — and the worker's side of
 * the node-store bridge (`./node-bridge.ts`), answering the main thread's requests one at a time, in the order they
 * came (`./host.ts`). A package that traps (a WebAssembly `RuntimeError`) leaves its module in no known state: the
 * answer says so (`fatal`), nothing runs after it, and the host ends the thread. Runs only as a thread of its own
 * (out of coverage; what it runs, the engine and the bridge, is covered on the main thread too).
 */

import { parentPort, workerData } from "node:worker_threads";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "../types.js";
import { LedgerEngine, type LedgerLoader } from "./engine.js";
import { bridgeStore } from "./node-bridge.js";
import type { FromLedgerWorker, LedgerRequest, ToLedgerWorker } from "./protocol.js";

interface LoaderModule {
  loadLedger?(ledger: LedgerName, options: LedgerPackageOptions, data: unknown): Promise<LedgerPackage>;
  loadLedgerPackage?: LedgerLoader;
  probe?(): unknown;
}

const { memory, loader, loaderData } = workerData as { memory: SharedArrayBuffer; loader: string | null; loaderData?: unknown };
const port = parentPort as NonNullable<typeof parentPort>;
const loaded = (loader === null ? await import("../load.js") : await import(loader)) as LoaderModule;
const load: LedgerLoader =
  loaded.loadLedger === undefined
    ? (loaded.loadLedgerPackage as LedgerLoader)
    : (ledger, options) => (loaded.loadLedger as NonNullable<LoaderModule["loadLedger"]>)(ledger, options, loaderData);
let current = 0;
const store = bridgeStore(
  memory,
  () => port.postMessage({ type: "node", id: current } satisfies FromLedgerWorker),
  (key) => engine.pendingNode(key),
);
const engine: LedgerEngine = new LedgerEngine({ load, store });

async function run(request: LedgerRequest): Promise<unknown> {
  switch (request.type) {
    case "parse":
      return engine.parse(request.ledger, request.block, request.transactions);
    case "genesis-root":
      return engine.genesisRoot(request.ledger, request.bytes);
    case "genesis":
      return engine.genesis(request.input);
    case "apply":
      return engine.apply(request.input);
    case "commit":
      return engine.commit(request.block);
    case "release":
      return engine.release(request.drop);
    case "load":
      return engine.load(request.input);
    case "retained":
      return engine.retained(request.input);
    case "evict":
      return engine.evict(request.keys);
    case "probe":
      return loaded.probe?.() ?? null;
  }
}

let chain: Promise<void> = Promise.resolve();
/** The trap that left the package in no known state, after which nothing runs (the host ends the thread). */
let trapped: Error | null = null;
port.on("message", ({ id, request }: ToLedgerWorker) => {
  chain = chain.then(async () => {
    current = id;
    store.begin();
    try {
      if (trapped !== null) throw trapped;
      const value = await run(request);
      port.postMessage({ type: "answer", id, ok: true, value } satisfies FromLedgerWorker);
    } catch (thrown) {
      const fatal = thrown instanceof WebAssembly.RuntimeError;
      const error = thrown instanceof Error ? thrown : new Error(String(thrown));
      const read = store.lastError === null ? "" : ` (the node store: ${store.lastError})`;
      port.postMessage({
        type: "answer",
        id,
        ok: false,
        fatal,
        error: { name: error.name, message: `${error.message}${read}` },
      } satisfies FromLedgerWorker);
      if (fatal) trapped = error;
    }
  });
});
