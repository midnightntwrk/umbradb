import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { expect } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import type { LedgerName } from "../../src/ledger/types.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { ProcessHandle, ProcessInput } from "../../src/runner/process.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf, settle, startProcess } from "../runner/process-build.js";
import { VENDORED_LEDGERS } from "./version-checks.js";

/**
 * Checks that the vendored ledger packages are checked against their recorded SHA-256 before any of them is imported:
 * at the process's startup, before block S, and in the ledger worker, before it imports a version's package. They also
 * check that `ledgerSources: released` refuses startup naming the setting. Shared by `package-startup.test.ts` and its
 * negative control (a startup that never calls the check). [A173, LG-5; acceptance §12; design §5.2]
 *
 * The packages a test changes are a copy's: {@link installationCopy} copies `src/` and `vendor/ledger/` into a
 * temporary directory, so that the copy's `src/ledger/load.ts` — the ledger worker's loader, given to it as a test
 * package's (`startLedgerWorker({ loader })`) — checks and imports the copy's packages, as the repository's checks and
 * imports its own. The repository's vendored packages are never changed.
 */

/** The repository's root. */
export const REPOSITORY = fileURLToPath(new URL("../../", import.meta.url));

/** Each vendored version's Node.js entry (`src/ledger/load.ts` imports it) and WebAssembly, by its manifest's paths. */
export const PACKAGE_FILES: Readonly<Record<(typeof VENDORED_LEDGERS)[number], { readonly entry: string; readonly wasm: string }>> = {
  v8: { entry: "pkg/midnight_ledger_wasm_fs.js", wasm: "pkg/midnight_ledger_wasm_bg.wasm" },
  "v9-rc3": { entry: "pkg/midnight_ledger_wasm_v9_fs.js", wasm: "pkg/midnight_ledger_wasm_v9_bg.wasm" },
  v9: { entry: "pkg/midnight_ledger_wasm_v9_fs.js", wasm: "pkg/midnight_ledger_wasm_v9_bg.wasm" },
};

/** A file of a package a test changes: its Node.js entry or its WebAssembly. */
export type ChangedFile = "entry" | "wasm";

/** A copy of the repository's `src/` and vendored ledger packages (see the module comment). */
export interface InstallationCopy {
  readonly dir: string;
  /** The copy's `vendor/ledger/`: the startup check's root over the copy's packages. */
  readonly root: string;
  /** The copy's `src/ledger/load.ts`, which a ledger worker imports in place of the repository's. */
  readonly loader: URL;
  /**
   * Changes one file of `ledger`'s package and returns what restores it: its entry gains one statement, which writes
   * {@link imported}'s file when the package is imported; its WebAssembly has one byte flipped.
   */
  change(ledger: LedgerName, file: ChangedFile): () => void;
  /** Whether `ledger`'s changed entry was imported (by any thread) since it was changed. */
  imported(ledger: LedgerName): boolean;
  remove(): void;
}

/** A copy's `src/ledger/load.ts` without its check of each package before importing it: a negative control's. */
function withoutCheck(text: string): string {
  const call = /^\s*checkLedgerPackage\(.*\);\n/gm;
  const calls = text.match(call)?.length ?? 0;
  if (calls !== VENDORED_LEDGERS.length) {
    throw new Error(`src/ledger/load.ts calls checkLedgerPackage ${calls} times, not once per vendored version: update the negative control`);
  }
  return text.replace(call, "");
}

/** A new {@link InstallationCopy}; `options.withoutCheck` gives its `load.ts` no check (a negative control's). */
export function installationCopy(options: { readonly withoutCheck?: boolean } = {}): InstallationCopy {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-12.2b-"));
  cpSync(join(REPOSITORY, "src"), join(dir, "src"), { recursive: true });
  for (const ledger of VENDORED_LEDGERS) {
    cpSync(join(REPOSITORY, "vendor/ledger", ledger, "SHA256SUMS"), join(dir, "vendor/ledger", ledger, "SHA256SUMS"));
    cpSync(join(REPOSITORY, "vendor/ledger", ledger, "pkg"), join(dir, "vendor/ledger", ledger, "pkg"), { recursive: true });
  }
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  symlinkSync(join(REPOSITORY, "node_modules"), join(dir, "node_modules"), "dir");
  const load = join(dir, "src/ledger/load.ts");
  if (options.withoutCheck === true) writeFileSync(load, withoutCheck(readFileSync(load, "utf8")));
  const marker = (ledger: LedgerName): string => join(dir, `imported-${ledger}`);
  return {
    dir,
    root: join(dir, "vendor/ledger"),
    loader: pathToFileURL(load),
    change(ledger, file) {
      const path = join(dir, "vendor/ledger", ledger, PACKAGE_FILES[ledger as keyof typeof PACKAGE_FILES][file]);
      const original = readFileSync(path);
      if (file === "entry") {
        const record = `\nprocess.getBuiltinModule("node:fs").writeFileSync(${JSON.stringify(marker(ledger))}, "imported\\n");\n`;
        writeFileSync(path, Buffer.concat([original, Buffer.from(record)]));
      } else {
        const changed = Buffer.from(original);
        const at = Math.floor(changed.length / 2);
        changed[at] = (changed[at] as number) ^ 0x01;
        writeFileSync(path, changed);
      }
      return () => {
        writeFileSync(path, original);
        rmSync(marker(ledger), { force: true });
      };
    },
    imported: (ledger) => existsSync(marker(ledger)),
    remove: () => rmSync(dir, { recursive: true, force: true }),
  };
}

// ---- The ledger worker -------------------------------------------------------------------------------------------

interface GenesisFixture {
  readonly file: string;
  readonly ledger: string;
  readonly stateRoot: string;
}

const GENESIS = fileURLToPath(new URL("./fixtures/genesis/", import.meta.url));
const ROOTS = (JSON.parse(readFileSync(join(GENESIS, "node-roots.json"), "utf8")) as { states: GenesisFixture[] }).states;

/** A genesis state of `ledger` and the root its node reported for it (`fixtures/genesis/node-roots.json`). */
function genesisOf(ledger: LedgerName): { readonly bytes: Uint8Array; readonly root: string } {
  const fixture = ROOTS.find((state) => state.ledger === ledger) as GenesisFixture;
  return { bytes: new Uint8Array(readFileSync(join(GENESIS, fixture.file))), root: fixture.stateRoot };
}

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/**
 * The package check in the ledger worker. For each vendored version, its Node.js entry is changed (one added statement
 * records its import) and, separately, its WebAssembly is changed by one byte. The worker's first request needing that
 * version (a genesis state's root) then fails naming the version's package and the file, and the package was not
 * imported. With the package unchanged, the same request gives the node's root. `start` starts a ledger worker over
 * `copy`'s packages. [A173]
 */
export async function expectWorkerChecks(copy: InstallationCopy, start: () => LedgerHost): Promise<void> {
  for (const ledger of VENDORED_LEDGERS) {
    const genesis = genesisOf(ledger);
    for (const file of ["entry", "wasm"] as const) {
      const path = PACKAGE_FILES[ledger][file];
      const restore = copy.change(ledger, file);
      const host = start();
      try {
        const failure = await host.genesisRoot(ledger, genesis.bytes).then(
          () => null,
          (error: unknown) => error,
        );
        expect(copy.imported(ledger), `${ledger} ${path} changed: the worker imported the package`).toBe(false);
        expect(failure, `${ledger} ${path} changed: the worker loaded the package`).toBeInstanceOf(Error);
        expect((failure as Error).message, `${ledger} ${path} changed`).toContain(`the vendored ledger ${ledger} package`);
        expect((failure as Error).message, `${ledger} ${path} changed`).toContain(`${path} has SHA-256`);
      } finally {
        await host.close();
        restore();
      }
    }
    const host = start();
    try {
      expect(hex(await host.genesisRoot(ledger, genesis.bytes)), `${ledger} unchanged`).toBe(genesis.root);
    } finally {
      await host.close();
    }
  }
}

// ---- The process -------------------------------------------------------------------------------------------------

/** What a process of {@link expectProcessChecks} is started with. */
export interface PackageStartup {
  /** Its database. */
  readonly db: ProcessDatabase;
  /** The vendored packages it is to check: a copy's root. */
  readonly root: string;
  /** Its `core` entry's `ledgerSources`, when given. */
  readonly ledgerSources?: Readonly<Record<string, string>>;
  /** Starts its ledger worker (the test counts them). */
  readonly ledgerWorker: () => LedgerHost;
}

/** Starts a process (see {@link expectProcessChecks}). */
export type StartPackageProcess = (startup: PackageStartup, input: ProcessInput) => ProcessHandle;

/** The block the processes start at, S, and the in-memory chain's finalized head: blocks S to it can be processed. */
const S = 5;
const HEAD = BigInt(S + 2);

/**
 * A process whose graph parses (`core-block-parsed`), so that it starts a ledger worker, over an in-memory chain whose
 * finalized head is S + 2: `start` gives it the startup check over `startup.root` — or a negative control's startup,
 * none.
 */
function packageProcess(start: StartPackageProcess, startup: PackageStartup): { handle: ProcessHandle; source: InMemoryBlockSource } {
  const source = new InMemoryBlockSource({ head: HEAD });
  const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED];
  const extra = startup.ledgerSources === undefined ? {} : { extra: { ledgerSources: startup.ledgerSources } };
  const input: ProcessInput = {
    declarations: chainDeclarations([], { core: modules }),
    config: { data: { entries: [core(startup.db.setting, S, extra), ...modules.map((module) => entryOf(module, S))] } },
    source,
    log: () => undefined,
    admin: false,
    ledgerWorker: startup.ledgerWorker,
  };
  return { handle: start(startup, input), source };
}

/**
 * The package check in the process:
 * - A vendored package whose Node.js entry (v8's) or WebAssembly (v9's) differs from its recorded SHA-256 refuses
 *   startup with `package-hash-mismatch` naming the version and the file. The process is `refused` with no block
 *   committed, though blocks S to the head are finalized; its ledger worker never started and the package was never
 *   imported.
 * - `ledgerSources` naming `released` for a version the build carries refuses with `invalid-configuration`
 *   (`ledger-source-unavailable`) naming the setting.
 * - With the packages unchanged, the process starts its ledger worker (over the copy's packages) and commits S to the
 *   head.
 *
 * `database` gives each process a new database. [A173]
 */
export async function expectProcessChecks(
  copy: InstallationCopy,
  database: () => Promise<ProcessDatabase>,
  start: StartPackageProcess,
): Promise<void> {
  const refusal = async (startup: Omit<PackageStartup, "ledgerWorker">, what: string): Promise<unknown> => {
    let workers = 0;
    const { handle } = packageProcess(start, {
      ...startup,
      ledgerWorker: () => {
        workers += 1;
        throw new Error(`${what}: the process started its ledger worker`);
      },
    });
    try {
      const error = await handle.started.then(
        () => null,
        (thrown: unknown) => thrown,
      );
      expect(error, `${what}: the process started`).not.toBeNull();
      expect(workers, `${what}: ledger workers started`).toBe(0);
      expect(handle.status(), what).toMatchObject({ state: "refused", cursor: null });
      expect(handle.status().reason?.code, what).toBe((error as { readonly code?: unknown }).code);
      return error;
    } finally {
      await handle.stop();
    }
  };

  for (const [ledger, file] of [
    ["v8", "entry"],
    ["v9", "wasm"],
  ] as const) {
    const path = PACKAGE_FILES[ledger][file];
    const restore = copy.change(ledger, file);
    try {
      const what = `${ledger} ${path} changed`;
      const error = await refusal({ db: await database(), root: copy.root }, what);
      expect(error, what).toMatchObject({ code: "package-hash-mismatch", details: { ledger, file: path, reason: "changed" } });
      expect((error as Error).message, what).toContain(`${path} has SHA-256`);
      expect(copy.imported(ledger), `${what}: the package was imported`).toBe(false);
    } finally {
      restore();
    }
  }

  const released = await refusal({ db: await database(), root: copy.root, ledgerSources: { "v9-rc3": "released" } }, "v9-rc3 released");
  expect(released, "v9-rc3 released").toMatchObject({
    code: "invalid-configuration",
    details: { reason: "ledger-source-unavailable", ledger: "v9-rc3", source: "released" },
  });
  expect((released as Error).message).toContain("ledgerSources.v9-rc3 is released");

  let workers = 0;
  const { handle, source } = packageProcess(start, {
    db: await database(),
    root: copy.root,
    ledgerWorker: () => {
      workers += 1;
      return startLedgerWorker({ loader: copy.loader });
    },
  });
  try {
    expect(await settle(handle, source, HEAD)).toBe("waiting");
    expect(handle.status(), "unchanged packages").toMatchObject({ cursor: HEAD, reason: null });
    expect(workers, "unchanged packages: ledger workers started").toBe(1);
  } finally {
    await handle.stop();
  }
}
