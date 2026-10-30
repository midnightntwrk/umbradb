import { EventEmitter } from "node:events";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { open } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { writeBackup } from "../../src/backup/backup.js";
import { backupCommand, EXIT } from "../../src/cli/command.js";
import { openPglite } from "../../src/db/pglite.js";
import { spawnChild } from "../child-processes.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  manifestOf,
  PATIENCE_MS,
  pathOf,
  startTicker,
  type TickerProcess,
  tickerModule,
  writeTickerConfig,
} from "./backup-fixtures.js";
import {
  type ModeObservation,
  modeProblems,
  OWNER_ONLY,
  type PgDumpWatch,
  watchFileModes,
  watchingPgDump,
} from "./file-modes.js";

/**
 * With a umask of `000`, every backup file UmbraDB writes on Node.js — `ProcessHandle.backup`, at stop
 * (`backupAtStop`), on SIGUSR2 (`backupOnSignal`), `umbradb backup` in this process and as a process of its own whose
 * umask a shell set — has mode `0600` from creation (its temporary file included) to after its rename, on PostgreSQL
 * 18.6, where `pg_dump`'s output fills it, and PGlite 0.5.10, where the process writes the dump itself; an earlier file
 * at the path, open to all, is replaced, not written into. [A174 CI, BK-1; design §9.1; threat model gap 7]
 *
 * Seen from outside the code that writes the files: `./file-modes.ts` (each file's mode at its creation, at each open
 * and rename, every millisecond between them, while `pg_dump` runs, and at the end). Also: a file system that refuses
 * to set the mode fails the backup, leaving no file. The committed negative control is
 * `./file-mode.negative-control.test.ts`.
 *
 * This test process's umask is `000` from `beforeAll` to `afterAll` (Vitest's `forks` pool: a process of its own).
 */

/** Each test waits on purpose for processes and databases: its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

/** The in-memory chain's head: far above the heights backed up, so blocks keep committing meanwhile. */
const HEAD = 600n;

const POSTGRES = BACKUP_BACKENDS[0] as BackupBackend;
const PRELOAD = fileURLToPath(new URL("./file-modes.preload.ts", import.meta.url));

let project: CliProject;
let root: string;
let umask: number | undefined;

beforeAll(async () => {
  umask = process.umask(0o000);
  project = await cliProject({ cli: true });
  project.write("ticker.ts", tickerModule(project.builders));
  root = mkdtempSync(join(tmpdir(), "umbradb-modes-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (root !== undefined) rmSync(root, { recursive: true, force: true });
  project?.remove();
  if (umask !== undefined) process.umask(umask);
}, 120_000);

/** Where one backup is written, and what runs its `pg_dump`. */
interface Place {
  /** The backup's own directory: the watched one. */
  readonly dir: string;
  readonly out: string;
  /** `PATH`, and on PostgreSQL `UMBRADB_PG_DUMP` naming the watching `pg_dump`. */
  readonly env: Record<string, string>;
  /** The watching `pg_dump` (PostgreSQL), else null. */
  readonly pgDump: PgDumpWatch | null;
}

let places = 0;

/**
 * A new directory for one backup on `backend`; on PostgreSQL, a `pg_dump` that watches it (`./file-modes.ts`), named by
 * this process's `UMBRADB_PG_DUMP` too, for the process's own backups.
 */
function placeFor(backend: BackupBackend, name: string): Place {
  places += 1;
  const dir = join(root, `${name}-${places}`);
  mkdirSync(dir);
  const out = join(dir, `${name}.backup`);
  if (backend.kind === "pglite") return { dir, out, env: backend.env(), pgDump: null };
  const pgDump = watchingPgDump(backend.env().UMBRADB_PG_DUMP as string, dir, join(root, `${name}-${places}-tools`));
  process.env.UMBRADB_PG_DUMP = pgDump.path;
  return { dir, out, env: { PATH: String(process.env.PATH), UMBRADB_PG_DUMP: pgDump.path }, pgDump };
}

/**
 * The file-mode oracle for the backup at `place` given what this process's observer saw (and its `pg_dump`'s). [A174 CI]
 */
function problemsAt(place: Place, observations: readonly ModeObservation[]): string[] {
  const all = [...observations, ...(place.pgDump?.observations() ?? [])];
  return modeProblems(place.out, all, { whileDumping: place.pgDump !== null });
}

/** An earlier file at the path, readable by all: a backup must replace it, not write into it. */
function earlierFile(out: string): void {
  writeFileSync(out, "an earlier file, open to all\n");
  chmodSync(out, 0o644);
}

/** Waits until `ready()`, failing with the process's log once `PATIENCE_MS` passed. */
async function until(ticker: TickerProcess, ready: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!ready()) {
    if (Date.now() > deadline) throw new Error(`not ${what} after ${PATIENCE_MS} ms: ${ticker.lines.join(" | ")}`);
    await sleep(10);
  }
}

/** `umbradb backup --out <out> --config <config>` in this process, with `env`. */
async function backupInProcess(out: string, config: string, env: Record<string, string>) {
  let stdout = "";
  let stderr = "";
  const code = await backupCommand()(["--out", out, "--config", config], {
    cwd: project.dir,
    env,
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
  });
  return { code, stdout, stderr };
}

/** A process of `config` synced to its core's stop `stop` and stopped, so the command can open its database. */
async function syncedTo(config: string, stop: bigint): Promise<void> {
  const ticker = await startTicker(config, stop + 5n);
  try {
    expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: stop, core: true });
  } finally {
    await ticker.handle.stop();
  }
}

/**
 * The `database` setting a process of its own can open after this one synced `setting`: on PGlite, a copy of the data
 * directory, which this process never opened — it holds the writer lock of every directory it opened until it ends
 * (`src/db/pglite-lock.ts`), so the command in a child would refuse `writer-lock-held`; on PostgreSQL, `setting`.
 */
function forAnotherProcess(backend: BackupBackend, setting: DatabaseParts): DatabaseParts {
  if (backend.kind !== "pglite") return setting;
  const dir = pathOf(setting);
  const copy = `${dir}-copy`;
  cpSync(dir, copy, { recursive: true });
  return { kind: "pglite", path: copy };
}

describe("A174: the observer (a umask of 000)", () => {
  it("sees a file Node.js creates with its default mode at its creation: 0666 under this umask, which the oracle refuses", async () => {
    const dir = mkdtempSync(join(root, "plain-"));
    const file = join(dir, "plain");
    const watch = watchFileModes(dir);
    try {
      // `open` imported by name from node:fs/promises, as `src/backup/backup.ts` imports it.
      await (await open(file, "wx")).close();
    } finally {
      watch.stop();
    }
    expect(statSync(file).mode & 0o777).toBe(0o666);
    expect(watch.observations().filter((seen) => seen.at === "created")).toMatchObject([{ name: "plain", mode: 0o666 }]);
    // The poll may see the file before the wrapped `open` records its creation: compared without their order.
    expect([...modeProblems(file, watch.observations())].sort()).toEqual(
      ["created plain: mode 0666", "plain at the end: mode 0666", "seen plain: mode 0666"].sort(),
    );
  });
});

describe.each(BACKUP_BACKENDS)("A174 on $name: every backup file is 0600 from creation to after its rename", (backend) => {
  it(
    "ProcessHandle.backup, while blocks commit; an earlier file at the path, open to all, replaced",
    async () => {
      const db = await backend.database();
      const place = placeFor(backend, "handle");
      earlierFile(place.out);
      const ticker = await startTicker(writeTickerConfig(project, { database: db.setting }), 1n);
      let observations: ModeObservation[] = [];
      try {
        await ticker.handle.started;
        ticker.feed(HEAD);
        await ticker.reach(10n);
        const watch = watchFileModes(place.dir);
        try {
          await ticker.handle.backup(place.out);
        } finally {
          watch.stop();
          observations = watch.observations();
        }
      } finally {
        await ticker.handle.stop();
      }
      expect(problemsAt(place, observations)).toEqual([]);
      expect(BigInt(manifestOf(place.out).height)).toBeGreaterThanOrEqual(10n);
      expect(readdirSync(place.dir)).toEqual(["handle.backup"]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "the backup at the core's stop (backupAtStop)",
    async () => {
      const db = await backend.database();
      const place = placeFor(backend, "at-stop");
      const config = writeTickerConfig(project, { database: db.setting, stop: 6, extra: { backupAtStop: place.out } });
      const watch = watchFileModes(place.dir);
      let lines: string[] = [];
      try {
        const ticker = await startTicker(config, 20n);
        try {
          expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: 6n, core: true });
        } finally {
          await ticker.handle.stop();
          lines = ticker.lines;
        }
      } finally {
        watch.stop();
      }
      expect(lines.some((line) => line.startsWith(`backup at stop written to ${place.out}: height 6, `))).toBe(true);
      expect(problemsAt(place, watch.observations())).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "the backup on SIGUSR2 (backupOnSignal), while blocks commit",
    async () => {
      const db = await backend.database();
      const place = placeFor(backend, "on-signal");
      const signals = new EventEmitter();
      const config = writeTickerConfig(project, { database: db.setting, extra: { backupOnSignal: place.out } });
      const ticker = await startTicker(config, 1n, undefined, { backupSignals: signals });
      const written = `backup on signal written to ${place.out}: height `;
      let observations: ModeObservation[] = [];
      try {
        await ticker.handle.started;
        ticker.feed(HEAD);
        await ticker.reach(5n);
        const watch = watchFileModes(place.dir);
        try {
          signals.emit("SIGUSR2");
          await until(ticker, () => ticker.lines.some((line) => line.startsWith(written)), "the backup on signal written");
        } finally {
          watch.stop();
          observations = watch.observations();
        }
      } finally {
        await ticker.handle.stop();
      }
      expect(ticker.lines.some((line) => line.startsWith("backup on signal failed"))).toBe(false);
      expect(problemsAt(place, observations)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "umbradb backup in this process; an earlier file at the path, open to all, replaced",
    async () => {
      const db = await backend.database();
      const config = writeTickerConfig(project, { database: db.setting, stop: 4 });
      await syncedTo(config, 4n);
      const place = placeFor(backend, "command");
      earlierFile(place.out);
      const watch = watchFileModes(place.dir);
      let result;
      try {
        result = await backupInProcess(place.out, config, place.env);
      } finally {
        watch.stop();
      }
      expect(result.stderr).toBe("");
      expect(result.code).toBe(EXIT.ok);
      expect(problemsAt(place, watch.observations())).toEqual([]);
      expect(manifestOf(place.out).height).toBe("4");
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "umbradb backup as a process of its own (the bundled command), its umask 000 set by a shell",
    async () => {
      const db = await backend.database();
      const synced = writeTickerConfig(project, { database: db.setting, stop: 4 });
      await syncedTo(synced, 4n);
      const config = writeTickerConfig(project, { database: forAnotherProcess(backend, db.setting), stop: 4 });
      const place = placeFor(backend, "child");
      const log = join(root, `child-${places}-modes.log`);
      // This process watches too, by polling: the child's own calls are seen by the observer it loads.
      const watch = watchFileModes(place.dir);
      let exit: { code: number | null; stdout: string; stderr: string };
      try {
        exit = await new Promise((resolve, reject) => {
          const child = spawnChild(
            "/bin/sh",
            [
              "-c",
              'umask 000 && exec "$@"',
              "sh",
              process.execPath,
              // `node:sqlite`'s experimental warning (the PGlite writer lock) would fill stderr.
              "--no-warnings",
              "--import",
              "tsx",
              "--import",
              PRELOAD,
              project.cli,
              "backup",
              "--out",
              place.out,
              "--config",
              config,
            ],
            {
              cwd: project.dir,
              env: { ...process.env, ...place.env, UMBRADB_TEST_MODES_DIR: place.dir, UMBRADB_TEST_MODES_LOG: log },
              stdio: ["ignore", "pipe", "pipe"],
            },
          );
          let stdout = "";
          let stderr = "";
          child.stdout?.setEncoding("utf8").on("data", (chunk: string) => {
            stdout += chunk;
          });
          child.stderr?.setEncoding("utf8").on("data", (chunk: string) => {
            stderr += chunk;
          });
          const timer = setTimeout(() => {
            child.kill("SIGKILL");
            reject(new Error(`umbradb backup ran longer than ${PATIENCE_MS} ms:\n${stdout}\n${stderr}`));
          }, PATIENCE_MS);
          child.once("error", reject);
          child.once("close", (code) => {
            clearTimeout(timer);
            resolve({ code, stdout, stderr });
          });
        });
      } finally {
        watch.stop();
      }
      expect(exit.stderr).toBe("");
      expect(exit.code).toBe(EXIT.ok);
      expect(exit.stdout).toContain(`umbradb backup: wrote ${place.out}: height 4, `);
      expect(existsSync(log), "the child's observer wrote what it saw").toBe(true);
      const child = readFileSync(log, "utf8")
        .split("\n")
        .filter((line) => line !== "")
        .flatMap((line) => JSON.parse(line) as ModeObservation[]);
      expect(problemsAt(place, [...child, ...watch.observations()])).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});

describe("A174: a file system that refuses the mode", () => {
  it("fails the backup with its error, its temporary file removed and no file written", async () => {
    const dir = mkdtempSync(join(root, "refused-"));
    const out = join(dir, "refused.backup");
    // FileHandle's class is not exported: its prototype, from a handle.
    const handle = await open(join(root, "prototype"), "w");
    const prototype = Object.getPrototypeOf(handle) as { chmod(mode: number): Promise<void> };
    await handle.close();
    const refused = Object.assign(new Error("EPERM: operation not permitted, fchmod"), { code: "EPERM" });
    const chmod = vi.spyOn(prototype, "chmod").mockRejectedValueOnce(refused);
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => 1n, developmentOptIn: true });
    try {
      await expect(
        writeBackup({ db, target: { backend: "pglite" }, out, optedOut: [], developmentOptIn: true }),
      ).rejects.toBe(refused);
      expect(chmod).toHaveBeenCalledWith(OWNER_ONLY);
    } finally {
      chmod.mockRestore();
      await db.close();
    }
    expect(readdirSync(dir)).toEqual([]);
  });
});
