import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { CopyFault } from "../../src/backbone/core-ledger-state/counts-copy.js";
import { UmbraError } from "../../src/db/errors.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The negative controls of `ledger-refcount-copy.test.ts`, through the process on PostgreSQL 18 and PGlite 0.5.10, on
 * the extended DAG fixture: each puts one fault into `core-ledger-state`'s use of its copy of the counts and child
 * lists (`CoreLedgerStateOptions.copyFault`), and what that file requires must then fail.
 * - `net-not-applied`: the copy is not updated from the net write, so it keeps what the tables held before. Verifying,
 *   the first height that reads a key whose count, root count or row changed since halts with `ledger-refcount-invalid`
 *   (`copy-mismatch`), naming the key; not verifying, the run does not store the reference's tables, or halts.
 * - `roots-not-added`: a root count held is answered without the run's change. Verifying, the first height that
 *   releases or raises a held key halts the same way; not verifying, the run goes wrong as above.
 */

describe.each(PROCESS_BACKENDS)("the copy's negative controls through the process, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  for (const fault of ["net-not-applied", "roots-not-added"] as const satisfies readonly CopyFault[]) {
    it(`${fault}: verifying, a height halts with copy-mismatch naming the key; not verifying, the run does not end as it must`, async () => {
      const verifying = await runDag(await backend.database(), { dag: "extended", halts: true, core: { copyFault: fault }, settings: { reclamationCache: { verify: true } } });
      expect(verifying.status).toMatchObject({ state: "halted", reason: { code: "ledger-refcount-invalid", module: CORE_LEDGER_STATE_ID, point: "on-settle" } });
      const error = verifying.errors.at(-1) as UmbraError;
      expect(error).toBeInstanceOf(UmbraError);
      expect(error.details).toMatchObject({ reason: "copy-mismatch", key: expect.stringMatching(/^0x[0-9a-f]{64}$/) as unknown, what: expect.stringMatching(/^(counts|references)$/) as unknown });
      expect(error.message).toContain((error.details as { key: string }).key);
      // The verifying build without the fault ends at the last height (ledger-refcount-copy.test.ts).
      const quiet = await runDag(await backend.database(), { dag: "extended", halts: true, core: { copyFault: fault }, settings: { reclamationCache: { verify: false } } });
      const endsAsItMust = quiet.status.cursor === BigInt(LAST) && quiet.status.reason === null && runProblems(quiet, "extended").length === 0;
      expect(endsAsItMust).toBe(false);
    }, PATIENCE_MS * 6);
  }
});
