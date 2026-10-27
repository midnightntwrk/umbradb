import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { build } from "esbuild";
import type { ApplyInput, ApplyOutput, ParsedTransaction, StoredNode } from "../../src/ledger/types.js";
import type { Ledger } from "./adapter-fixtures.js";

// Task 12.1 (A98; LG-7, Q49): runs `fixtures/adapter-worker.ts` in a worker thread of its own. The entry is bundled
// with esbuild (a plain worker cannot load the TypeScript sources), leaving the vendored ledger packages out of the
// bundle as imports of their own files: their Node.js entries read the `.wasm` beside them. This is the hook a build of
// the adapters needs (task 16.1 maps the same imports to the packages' browser entries).

export type AdapterWorkerRequest =
  | { op: "load"; ledger: Ledger; networkId: string; key: Uint8Array; nodes: StoredNode[] }
  | { op: "convert"; ledger: "v9"; networkId: string; key: Uint8Array; nodes: StoredNode[] }
  | { op: "replay"; ledger: Ledger; networkId: string; blocks: ApplyInput[] };

export interface LoadedState {
  stateRoot: Uint8Array;
  stateKey: Uint8Array;
}

export interface Replayed {
  parsed: ParsedTransaction[][];
  outputs: ApplyOutput[];
  roots: Uint8Array[];
  stateKey: Uint8Array;
}

export interface AdapterWorkerAnswer<T> {
  result?: T;
  error?: string;
}

const ENTRY = fileURLToPath(new URL("./fixtures/adapter-worker.ts", import.meta.url));
const VENDORED = /[/\\]vendor[/\\]ledger[/\\]v[0-9]+(?:-rc[0-9]+)?[/\\]pkg[/\\][^/\\]+\.js$/;

/** A bundle of the worker entry, built once per test file. */
export class AdapterWorkerHost {
  private directory: string | undefined;
  private bundle: string | undefined;

  async start(): Promise<void> {
    this.directory = mkdtempSync(join(tmpdir(), "umbradb-adapter-worker-"));
    this.bundle = join(this.directory, "adapter-worker.mjs");
    await build({
      entryPoints: [ENTRY],
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node24",
      outfile: this.bundle,
      logLevel: "silent",
      plugins: [
        {
          name: "vendored-ledger-external",
          setup(context) {
            context.onResolve({ filter: /vendor\/ledger\// }, (args) => {
              const path = resolve(dirname(args.importer), args.path);
              if (!VENDORED.test(path)) return undefined;
              return { path: pathToFileURL(path).href, external: true };
            });
          },
        },
      ],
    });
  }

  run<T>(request: AdapterWorkerRequest): Promise<AdapterWorkerAnswer<T>> {
    const bundle = this.bundle;
    if (bundle === undefined) throw new Error("the worker host was not started");
    return new Promise((settle, reject) => {
      const worker = new Worker(bundle, { workerData: request });
      let answered = false;
      worker.once("message", (answer: AdapterWorkerAnswer<T>) => {
        answered = true;
        settle(answer);
        void worker.terminate();
      });
      worker.once("error", (error) => {
        if (!answered) reject(error);
      });
      worker.once("exit", (code) => {
        if (!answered) reject(new Error(`the adapter worker exited with code ${code} before answering`));
      });
    });
  }

  stop(): void {
    if (this.directory !== undefined) rmSync(this.directory, { recursive: true, force: true });
    this.directory = undefined;
    this.bundle = undefined;
  }
}
