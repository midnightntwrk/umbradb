import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  hashOf,
  heightsAt,
  manifestOf,
  PATIENCE_MS,
  tableHeights,
  tickerModule,
} from "./backup-fixtures.js";
import {
  backupAtPause,
  eachHeightOnce,
  goesOn,
  hookAt,
  hashUnpausedAt,
  PAUSED_MS,
  pausedBetweenHeights,
  type Pausable,
  recorderModule,
  startPausable,
  stopEndsWhilePaused,
  within,
  writePausableConfig,
} from "./pause-fixtures.js";
import { chain, restoreRun } from "./restore-fixtures.js";

/**
 * On PGlite 0.5.10 with a running process (`./pause-fixtures.ts`: the backups' build with a recorder of every point):
 * [A163 CI, BK-1, CF-4, RN-13, Q152 B; design §9.1]
 * - paused (`ProcessHandle.pause()`) while it processes a height, it pauses once that height committed and its later
 *   points ended, no block transaction open, and starts nothing while paused; resumed, it goes on from the next height;
 *   three pauses on the way to the core's stop at 60 lose and repeat no height — every height's points once, and the
 *   committed heights and the contents hash those of an unpaused run to 60;
 * - paused while it waits for the head, at once, and nothing starts when the head rises; a stop while paused ends the
 *   process; `pause()` after processing ended resolves at once [RN-13];
 * - with `backupOnSignal`, a SIGUSR2 that arrives while height 20 is processed writes a backup of 20 at the next pause,
 *   nothing running while it is written, and the process goes on from 21; the file restores with `umbradb restore` like
 *   any other, every restore check passing, its contents hash an unpaused run's at 20; a second SIGUSR2 meanwhile adds
 *   none; the listener is gone once the process closed [BK-3];
 * - SIGUSR2 on a process stopped at the core's stop writes a backup of that height, and none again while the file is one
 *   of that height; while stopping, or with a stop before the pause, none; before any height committed the backup is
 *   refused (`no-committed-height`) and the process goes on; a process whose startup refused writes none.
 * A real SIGUSR2 to a process of its own is `./signal-backup.test.ts`; the loop's pause on both backends
 * `test/runner/pause.test.ts`; the committed negative controls `./pause.negative-control.test.ts`.
 */

/** Each test waits on purpose for processes to reach heights: its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-pause-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

let outputs = 0;
/** A new backup file's path in the test's directory. */
const output = (name: string): string => join(dir, `${name}-${++outputs}.backup`);

/**
 * Waits until `ready()`; rejects once `PATIENCE_MS` passed, or at once when `run`'s processing ended other than at its
 * stop (a halt, a refusal), with its log.
 */
async function until(ready: () => boolean, what: string, run?: Pausable): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!ready()) {
    const ended = run?.handle.status().ended;
    if (ended !== undefined && ended !== null && ended.kind !== "stopped") {
      throw new Error(`not ${what}: processing ended (${ended.kind}): ${run?.lines().join(" | ")}`);
    }
    if (Date.now() > deadline) throw new Error(`not ${what} within ${PATIENCE_MS} ms`);
    await sleep(10);
  }
}

/** Waits until `run` logged `line`. */
const logged = (run: Pausable, line: string) => until(() => run.lines().includes(line), `logged: ${line}`);

/** Waits until `run` logged a line starting with `prefix`; resolves with it. */
async function loggedStarting(run: Pausable, prefix: string): Promise<string> {
  await until(() => run.lines().some((line) => line.startsWith(prefix)), `logged: ${prefix}…`);
  return run.lines().find((line) => line.startsWith(prefix)) as string;
}

/** The heights from `from` to `to` as text. */
const heights = (from: number, to: number): string[] => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

describe("A163: a running process on PGlite pauses and resumes between heights (BK-1, Q152 B)", () => {
  it(
    "A163: paused and resumed three times on the way to its stop, it loses and repeats no height: its committed " +
      "heights and contents hash equal an unpaused run's",
    async () => {
      const db = await PGLITE.database();
      const stop = 60n;
      const run = await startPausable(writePausableConfig(project, { database: db.setting, stop: Number(stop) }), {
        head: stop + 20n,
      });
      const at = [10n, 25n, 40n];
      const pauses: Promise<void>[] = [];
      for (const height of at) hookAt("on-db-write", height, () => pauses.push(run.handle.pause()));
      try {
        await run.handle.started;
        for (const [index, height] of at.entries()) {
          await until(() => pauses[index] !== undefined, `asked to pause at ${height}`, run);
          expect(await pausedBetweenHeights(run, pauses[index] as Promise<void>, height)).toBe(height);
          // Asked again while paused: the same pause, at once.
          await within(run.handle.pause(), 5_000, "a second pause()");
          await goesOn(run, height);
        }
        expect(await run.handle.ended).toMatchObject({ kind: "stopped", height: stop, core: true });
      } finally {
        await run.handle.stop();
      }
      eachHeightOnce(run.points(), 1n, stop);
      const committed = await db.query("SELECT height::text AS h FROM core_block_commit.blocks ORDER BY height");
      expect(committed.map((row) => row.h)).toEqual(heights(1, Number(stop)));
      expect(await tableHeights(db)).toEqual(heightsAt(String(stop)));
      expect(await hashOf(db)).toBe(await hashUnpausedAt(project, PGLITE, stop));
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A163: paused while it waits for the head, at once, it starts nothing when the head rises; resumed, it goes on; a " +
      "stop while paused ends the process (RN-13); pause() after processing ended resolves at once",
    async () => {
      const db = await PGLITE.database();
      const run = await startPausable(writePausableConfig(project, { database: db.setting }), { head: 8n });
      let paused: Promise<void> | undefined;
      try {
        await run.handle.started;
        await within(run.source.waiting(8n), PATIENCE_MS, "the loop waiting at 8");
        const idle = run.handle.pause();
        await within(idle, 5_000, "pause() while waiting for the head");
        const points = run.points().length;
        run.source.finalize(20n);
        await sleep(PAUSED_MS);
        expect(run.points().slice(points)).toEqual([]);
        expect(run.handle.status().cursor).toBe(8n);
        run.handle.resume();
        // Resumed twice: nothing more to do.
        run.handle.resume();
        await within(run.source.waiting(20n), PATIENCE_MS, "the loop waiting at 20");
        hookAt("on-db-write", 25n, () => {
          paused = run.handle.pause();
        });
        run.source.finalize(40n);
        await until(() => paused !== undefined, "asked to pause at 25", run);
        await stopEndsWhilePaused(run, paused as Promise<void>);
        expect(run.handle.status().cursor).toBe(25n);
        await within(run.handle.pause(), 5_000, "pause() after processing ended");
        run.handle.resume();
      } finally {
        await run.handle.stop();
      }
      eachHeightOnce(run.points(), 1n, 25n);
      expect(await tableHeights(db)).toEqual(heightsAt("25"));
    },
    TEST_TIMEOUT_MS,
  );
});

describe("A163: SIGUSR2 writes a backup at the next pause (backupOnSignal, BK-1, Q152 B)", () => {
  it(
    "A163: with backupOnSignal set, SIGUSR2 while blocks commit writes a backup at the next pause, the process goes " +
      "on, and the file restores like any other, every check of BK-3 passing",
    async () => {
      const db = await PGLITE.database();
      const out = output("signal");
      const signals = new EventEmitter();
      const head = 80n;
      const run = await startPausable(writePausableConfig(project, { database: db.setting, extra: { backupOnSignal: out } }), {
        head,
        backupSignals: signals,
      });
      // The signal arrives while height 20 is processed; a second one while the first's backup waits or is written.
      hookAt("on-compute", 20n, () => {
        signals.emit("SIGUSR2");
        signals.emit("SIGUSR2");
      });
      try {
        await run.handle.started;
        expect(signals.listenerCount("SIGUSR2")).toBe(1);
        await within(run.source.waiting(head), PATIENCE_MS, `the loop waiting at ${head}`);
      } finally {
        await run.handle.stop();
      }
      expect(signals.listenerCount("SIGUSR2")).toBe(0);
      expect(run.lines()).toContain(`SIGUSR2 writes a backup to ${out} at the loop's next pause (backupOnSignal)`);
      expect(run.lines()).toContain(`SIGUSR2: a backup on signal to ${out} is already being written; this signal adds none`);
      const { height, contentsHash } = backupAtPause(run, out);
      expect(height).toBe(20n);
      eachHeightOnce(run.points(), 1n, head);
      const manifest = manifestOf(out);
      expect(manifest).toMatchObject({ height: "20", contentsHash, tool: { name: "pglite-tools" } });
      // Restored like any other backup: every restore check passes, and it holds height 20. [BK-3]
      const target = await PGLITE.database();
      const restored = await restoreRun(project, out, writePausableConfig(project, { database: target.setting }), chain(head));
      expect(restored.stderr).toBe("");
      expect(restored.code).toBe(EXIT.ok);
      expect(await tableHeights(target)).toEqual(heightsAt("20"));
      expect(await hashOf(target)).toBe(manifest.contentsHash);
      expect(await hashUnpausedAt(project, PGLITE, 20n)).toBe(manifest.contentsHash);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "SIGUSR2 on a process stopped at the core's stop writes a backup of that height, then none while the file is " +
      "one of it; while stopping none",
    async () => {
      const db = await PGLITE.database();
      const out = output("stopped");
      const signals = new EventEmitter();
      const run = await startPausable(
        writePausableConfig(project, { database: db.setting, stop: 12, extra: { backupOnSignal: out } }),
        { head: 20n, backupSignals: signals },
      );
      try {
        expect(await run.handle.ended).toMatchObject({ kind: "stopped", height: 12n, core: true });
        signals.emit("SIGUSR2");
        await logged(run, "backup on signal: processing ended at height 12");
        await loggedStarting(run, `backup on signal written to ${out}: height 12, contents hash `);
        expect(manifestOf(out).height).toBe("12");
        signals.emit("SIGUSR2");
        await logged(run, `backup on signal: ${out} holds a backup of height 12 already, so none was written`);
        const stopping = run.handle.stop();
        signals.emit("SIGUSR2");
        await stopping;
      } finally {
        await run.handle.stop();
      }
      expect(run.lines()).toContain("SIGUSR2: no backup on signal, the process is stopping");
      expect(await tableHeights(await PGLITE.load(out))).toEqual(heightsAt("12"));
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "SIGUSR2 with a stop before the next pause writes nothing; before any height committed the backup is refused " +
      "(no-committed-height) and the process goes on; a process whose startup refused writes none",
    async () => {
      // A stop while the signal waits for the pause: the height in progress finishes, and no backup is written.
      const stopped = output("stopping");
      const signals = new EventEmitter();
      const first = await startPausable(
        writePausableConfig(project, { database: (await PGLITE.database()).setting, extra: { backupOnSignal: stopped } }),
        { head: 10n, backupSignals: signals },
      );
      hookAt("on-compute", 3n, () => {
        signals.emit("SIGUSR2");
        void first.handle.stop();
      });
      try {
        await first.handle.started;
        await within(first.handle.closed, PATIENCE_MS, "the stop");
      } finally {
        await first.handle.stop();
      }
      expect(first.lines()).toContain("backup on signal not written: the process is stopping");
      expect(first.handle.status().cursor).toBe(3n);
      expect(existsSync(stopped)).toBe(false);

      // S = 5 above the head 3: the bootstrap's wait; the signal's pause comes before block S commits.
      const none = output("none");
      const early = await startPausable(
        writePausableConfig(project, { database: (await PGLITE.database()).setting, start: 5, extra: { backupOnSignal: none } }),
        { head: 3n, backupSignals: signals },
      );
      try {
        await until(() => signals.listenerCount("SIGUSR2") === 1, "listening for SIGUSR2", early);
        signals.emit("SIGUSR2");
        early.source.finalize(8n);
        await within(early.source.waiting(8n), PATIENCE_MS, "the loop waiting at 8");
      } finally {
        await early.handle.stop();
      }
      expect(early.lines()).toContain("backup on signal: processing paused before any height committed");
      const failed = early.lines().find((line) => line.startsWith("backup on signal failed (no-committed-height): "));
      expect(failed).toMatch(/; no backup was written$/);
      expect(existsSync(none)).toBe(false);
      eachHeightOnce(early.points(), 5n, 8n);

      // Startup refused (the node serves another network): the signal writes nothing.
      const refused = output("refused");
      const other = await startPausable(
        writePausableConfig(project, {
          database: (await PGLITE.database()).setting,
          extra: { backupOnSignal: refused, genesisHash: `0x${"ab".repeat(32)}` },
        }),
        { head: 3n, backupSignals: signals },
      );
      try {
        await expect(other.handle.started).rejects.toMatchObject({ code: "genesis-mismatch" });
        signals.emit("SIGUSR2");
        await logged(other, "backup on signal not written: startup refused, so no database is open");
      } finally {
        await other.handle.stop();
      }
      expect(signals.listenerCount("SIGUSR2")).toBe(0);
      expect(existsSync(refused)).toBe(false);
    },
    TEST_TIMEOUT_MS,
  );
});
