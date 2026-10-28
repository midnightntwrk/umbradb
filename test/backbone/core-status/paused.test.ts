import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PATIENCE_MS } from "../../backup/backup-fixtures.js";
import type { CliProject } from "../../cli/cli-fixtures.js";
import { type ProcessBackend, PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { a176Project, pauseRun, signalRun } from "./paused-harness.js";

/**
 * A176 `[CI]` (task 8.3b; AE-3 as amended, AE-4; owner decision Q174 B), on PostgreSQL 18.6 and PGlite 0.5.10: `/status`
 * of a process paused by `pause()` lists one condition `{ code: "paused", since, by: "pause" }` — `since` the time the
 * loop paused, RFC 3339 UTC text (Q68), kept while paused —, valid against `./status.schema.json`, and none once
 * `resume()` let the loop run; on PGlite, a backup on SIGUSR2 lists `by: "signal"` from its pause until the backup is
 * written; `/health/ready` answers as an unpaused process with the same lag would — not ready while paused 30 behind,
 * ready while paused at the head. The runs and their checks are `./paused-harness.ts`'s; the committed negative
 * controls, a process that never publishes the pause and one that keeps it after the loop runs again, are
 * `./paused.negative-control.test.ts`.
 */

/** How long a phase reads `/status` for what A176 expects once the process shows its precondition (a loaded machine). */
const PHASE_PATIENCE_MS = 30_000;

const PGLITE = PROCESS_BACKENDS[1] as ProcessBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await a176Project();
  dir = mkdtempSync(join(tmpdir(), "umbradb-a176-"));
}, 300_000);

afterAll(() => {
  project?.remove();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
});

describe.each(PROCESS_BACKENDS)("A176: a paused loop on /status on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A176: pause() lists paused by pause with the time it paused, none once resume() let the loop run; readiness unchanged", async () => {
    expect(await pauseRun(project, await backend.database(), { patienceMs: PHASE_PATIENCE_MS })).toEqual([]);
  }, PATIENCE_MS * 2);

  it.runIf(backend === PGLITE)(
    "A176: a backup on SIGUSR2 lists paused by signal from its pause until the backup is written",
    async () => {
      const out = join(dir, "signal.backup");
      expect(await signalRun(project, await backend.database(), out, { patienceMs: PHASE_PATIENCE_MS })).toEqual([]);
    },
    PATIENCE_MS * 2,
  );
});
