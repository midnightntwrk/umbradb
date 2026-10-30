import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { checkLedgerPackages } from "../../src/ledger/identity.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { PATIENCE_MS } from "../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { expectProcessChecks, expectWorkerChecks, type InstallationCopy, installationCopy } from "./package-startup-checks.js";

/**
 * The committed negative control for the package checks: a startup that never calls the check fails the checks of
 * `./package-startup-checks.ts`. [A173, LG-5; acceptance §12]
 * - **The process** started without its check (`ProcessInput.checkLedgerPackages` checking nothing) goes on to start
 *   its ledger worker over a package whose Node.js entry changed, and fails the check `ledger workers started`.
 * - **The ledger worker** over a copy whose `src/ledger/load.ts` never calls `checkLedgerPackage` imports the changed
 *   entry, which records its import, and fails the check `the worker imported the package`.
 *
 * The real ones pass the same checks in this file's build.
 */

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

/** The assertion error a check fails with; fails the test if the check passes or fails otherwise. */
async function assertionFailure(check: () => unknown): Promise<Error> {
  try {
    await check();
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed against a startup that never calls it");
}

describe("A173's negative control: a startup that never calls the check", () => {
  let copy: InstallationCopy;
  let unchecked: InstallationCopy;
  beforeAll(async () => {
    copy = installationCopy();
    unchecked = installationCopy({ withoutCheck: true });
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    copy?.remove();
    unchecked?.remove();
    await backend.stop();
  }, 60_000);

  it(
    "the process that never calls it starts its ledger worker over a changed package, and fails A173",
    async () => {
      const failure = await assertionFailure(() =>
        expectProcessChecks(copy, () => backend.database(), (_startup, input) => startProcess({ ...input, checkLedgerPackages: () => undefined })),
      );
      expect(failure.message).toMatch(/v8 pkg\/midnight_ledger_wasm_fs\.js changed: ledger workers started/);
    },
    PATIENCE_MS,
  );

  it(
    "the ledger worker that never calls it imports a changed package, and fails A173",
    async () => {
      const failure = await assertionFailure(() => expectWorkerChecks(unchecked, () => startLedgerWorker({ loader: unchecked.loader })));
      // The changed entry ran: it recorded its import.
      expect(failure.message).toMatch(/v8 pkg\/midnight_ledger_wasm_fs\.js changed: the worker imported the package/);
    },
    PATIENCE_MS,
  );

  it(
    "the real ones pass A173 in this file's build",
    async () => {
      await expectProcessChecks(copy, () => backend.database(), (startup, input) =>
        startProcess({ ...input, checkLedgerPackages: (options) => checkLedgerPackages({ ...options, root: startup.root }) }),
      );
      await expectWorkerChecks(copy, () => startLedgerWorker({ loader: copy.loader }));
    },
    PATIENCE_MS,
  );
});
