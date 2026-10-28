import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PATIENCE_MS } from "../../backup/backup-fixtures.js";
import type { CliProject } from "../../cli/cli-fixtures.js";
import { type ProcessBackend, PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { a176Project, keepingPause, pauseRun, signalRun, withoutPause } from "./paused-harness.js";

/**
 * A176's committed negative controls (task 8.3b), on PostgreSQL 18.6 and PGlite 0.5.10 (SIGUSR2 on PGlite): the same
 * runs as `./paused.test.ts`'s, with the snapshots the runner publishes changed on their way to the admin worker, each
 * failing A176 in exactly the phases it should and nothing else:
 * - **never publishes the pause** (`withoutPause`, what `/status` showed before this task): the phases that wait for
 *   `paused` never see it, and the reads meant to show the same pause later find none; every other phase passes;
 * - **keeps the pause after the loop runs again** (`keepingPause`): the phases after each `resume()` and after the
 *   backup was written never see the loop without `paused`, and the bodies read there list it with the cursor past the
 *   pause; the phases of the pauses themselves pass.
 * Each phase reads `/status` for a shorter time than the test's: the failing ones are expected to run out of it.
 */

/** How long a phase reads `/status` here: the failing ones run out of it. */
const PHASE_PATIENCE_MS = 8_000;

const PGLITE = PROCESS_BACKENDS[1] as ProcessBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await a176Project();
  dir = mkdtempSync(join(tmpdir(), "umbradb-a176-control-"));
}, 300_000);

afterAll(() => {
  project?.remove();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
});

let outputs = 0;
const output = (): string => join(dir, `signal-${++outputs}.backup`);

describe.each(PROCESS_BACKENDS)("A176's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a process that never publishes the pause fails A176 where paused should show", async () => {
    const problems = await pauseRun(project, await backend.database(), { patienceMs: PHASE_PATIENCE_MS, wrap: withoutPause() });
    expect(problems).toEqual([
      "paused by pause() at 10, syncing: /status never showed it",
      "still paused at 10: no paused listed",
      "paused by pause() while waiting for the head at 40: /status never showed it",
      "pause() asked again, the same pause: no paused listed",
    ]);
  }, PATIENCE_MS * 2);

  it("a process that keeps the pause after resume() fails A176 once the loop runs again", async () => {
    const problems = await pauseRun(project, await backend.database(), { patienceMs: PHASE_PATIENCE_MS, wrap: keepingPause() });
    expect(problems).toEqual([
      "resumed, following at 40: /status never showed it",
      "after the first resume(): /status listed paused with the cursor above 10",
      "resumed, following at 45: /status never showed it",
      "after the second resume(): /status listed paused with the cursor above 40",
    ]);
  }, PATIENCE_MS * 2);

  it.runIf(backend === PGLITE)("a process that never publishes the backup's pause fails A176's SIGUSR2 half", async () => {
    const problems = await signalRun(project, await backend.database(), output(), {
      patienceMs: PHASE_PATIENCE_MS,
      wrap: withoutPause(),
    });
    expect(problems).toEqual(["paused by SIGUSR2, the backup waiting: /status never showed it"]);
  }, PATIENCE_MS * 2);

  it.runIf(backend === PGLITE)("a process that keeps the backup's pause after it was written fails A176's SIGUSR2 half", async () => {
    const problems = await signalRun(project, await backend.database(), output(), {
      patienceMs: PHASE_PATIENCE_MS,
      wrap: keepingPause(),
    });
    expect(problems).toEqual([
      "the backup written: /status never showed it",
      "the loop ran on to 15: /status never showed it",
      "after the backup: /status listed paused with the cursor above 10",
    ]);
  }, PATIENCE_MS * 2);
});
