import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { checkLedgerPackage, checkLedgerPackages } from "../../src/ledger/identity.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { PATIENCE_MS } from "../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { core, entryOf, settle, startProcess } from "../runner/process-build.js";
import {
  expectProcessChecks,
  expectWorkerChecks,
  type InstallationCopy,
  installationCopy,
  PACKAGE_FILES,
} from "./package-startup-checks.js";
import { copyVendoredLedger } from "./version-checks.js";

/**
 * A173 (`openspec/changes/core-arch/acceptance.md` §12; LG-5, `design.md` §5.2; task 12.2b, the threat model draft's
 * gap 3): the vendored ledger packages are checked against their recorded SHA-256 before any of them is imported. The
 * process checks every version the build carries at startup, before it starts its ledger worker and before block S
 * (`src/runner/process.ts`, `checkLedgerPackages`), and refuses `ledgerSources: released`; the ledger worker checks a
 * version's package before it imports it (`src/ledger/load.ts`, `checkLedgerPackage`). Each thread hashes a version's
 * files once. On PGlite: the criterion is about startup, not stored data. The checks are `./package-startup-checks.ts`;
 * the negative control, a startup that never calls the check, is `package-startup.negative-control.test.ts`.
 */

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

describe("A173: the vendored ledger packages checked before any is imported (LG-5)", () => {
  let copy: InstallationCopy;
  beforeAll(async () => {
    copy = installationCopy();
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    copy?.remove();
    await backend.stop();
  }, 60_000);

  it(
    "in the process: a changed JS or WASM file refuses startup before block S naming it, before its worker starts; released refuses naming the setting; unchanged starts",
    async () => {
      await expectProcessChecks(copy, () => backend.database(), (startup, input) =>
        startProcess({ ...input, checkLedgerPackages: (options) => checkLedgerPackages({ ...options, root: startup.root }) }),
      );
    },
    PATIENCE_MS,
  );

  it("in the process, over the repository's own packages: they start; ledgerSources released refuses naming the setting", async () => {
    const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED];
    const run = async (extra: Readonly<Record<string, unknown>>) => {
      const db = await backend.database();
      const source = new InMemoryBlockSource({ head: 7n });
      const handle = startProcess({
        declarations: chainDeclarations([], { core: modules }),
        config: { data: { entries: [core(db.setting, 5, { extra }), ...modules.map((module) => entryOf(module, 5))] } },
        source,
        log: () => undefined,
        admin: false,
      });
      return { handle, source };
    };
    const started = await run({});
    try {
      expect(await settle(started.handle, started.source, 7n)).toBe("waiting");
      expect(started.handle.status()).toMatchObject({ cursor: 7n, reason: null });
    } finally {
      await started.handle.stop();
    }
    const refused = await run({ ledgerSources: { v9: "released" } });
    try {
      const error = await refused.handle.started.then(
        () => null,
        (thrown: unknown) => thrown,
      );
      expect(error).toMatchObject({ code: "invalid-configuration", details: { reason: "ledger-source-unavailable", ledger: "v9" } });
      expect((error as Error).message).toContain("ledgerSources.v9 is released");
      expect(refused.handle.status()).toMatchObject({ state: "refused", cursor: null, reason: { code: "invalid-configuration" } });
    } finally {
      await refused.handle.stop();
    }
  }, PATIENCE_MS);

  it(
    "in the ledger worker: a changed JS or WASM file of each version refuses its load naming it, before the package is imported; unchanged loads",
    async () => {
      await expectWorkerChecks(copy, () => startLedgerWorker({ loader: copy.loader }));
    },
    PATIENCE_MS,
  );
});

describe("the startup check's cost: each version's files hashed once per thread (task 12.2b)", () => {
  let packages: ReturnType<typeof copyVendoredLedger>;
  beforeAll(() => {
    packages = copyVendoredLedger();
  });
  afterAll(() => packages?.remove());

  it("reads a version's files again only until they passed in this thread; a refusal is not remembered; ledgerSources is read at every call", () => {
    const entry = join(packages.root, "v9", PACKAGE_FILES.v9.entry);
    const original = readFileSync(entry);
    writeFileSync(entry, Buffer.concat([original, Buffer.from("\n")]));
    expect(() => checkLedgerPackages({ root: packages.root })).toThrow(/vendored ledger v9 package .*pkg\/midnight_ledger_wasm_v9_fs\.js has SHA-256/);
    // Not remembered: the same call fails again, and passes once the file is restored.
    expect(() => checkLedgerPackage("v9", { root: packages.root })).toThrow(/pkg\/midnight_ledger_wasm_v9_fs\.js has SHA-256/);
    writeFileSync(entry, original);
    checkLedgerPackages({ root: packages.root });
    // Passed in this thread: the files are not read again (the thread imports each package once).
    writeFileSync(entry, Buffer.concat([original, Buffer.from("\n")]));
    try {
      expect(() => checkLedgerPackages({ root: packages.root })).not.toThrow();
      expect(() => checkLedgerPackage("v9", { root: packages.root })).not.toThrow();
      expect(() => checkLedgerPackages({ root: packages.root, sources: { v9: "released" } })).toThrow(/ledgerSources\.v9 is released/);
      // Another root is another set of files.
      const other = copyVendoredLedger();
      try {
        writeFileSync(join(other.root, "v8", PACKAGE_FILES.v8.wasm), Buffer.from("changed"));
        expect(() => checkLedgerPackage("v8", { root: other.root })).toThrow(/pkg\/midnight_ledger_wasm_bg\.wasm has SHA-256/);
        expect(() => checkLedgerPackage("v9", { root: other.root })).not.toThrow();
      } finally {
        other.remove();
      }
    } finally {
      writeFileSync(entry, original);
    }
  });
});
