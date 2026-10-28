import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { open } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BackupSeams } from "../../src/backup/backup.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  startTicker,
  type TickerProcess,
  tickerModule,
  writeTickerConfig,
} from "./backup-fixtures.js";
import { modeProblems, watchFileModes } from "./file-modes.js";

/**
 * A174's committed negative control (task 15.1b; BK-1, the threat model draft's gap 7): with a umask of `000`, on PGlite
 * 0.5.10, a process's backups (`ProcessHandle.backup`) whose temporary file is created another way — the seam
 * `BackupSeams.createTemporary` — fail A174's oracle (`./file-modes.ts`), while the same process's own backup passes it:
 * - created with the umask's mode, as `src/backup/backup.ts` created it before task 15.1b (`open(path, "wx")`): `0666`
 *   from its creation to after its rename;
 * - created open to all (`0666`) and narrowed to `0600` at once, before its first byte: `0600` at the end, but not from
 *   creation — another process could have opened it meanwhile and kept reading;
 * - and a backup written while nothing watched is not taken as checked: its creation was not seen.
 */

const TEST_TIMEOUT_MS = 900_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let root: string;
let umask: number | undefined;

beforeAll(async () => {
  umask = process.umask(0o000);
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  root = mkdtempSync(join(tmpdir(), "umbradb-modes-control-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (root !== undefined) rmSync(root, { recursive: true, force: true });
  project?.remove();
  if (umask !== undefined) process.umask(umask);
}, 120_000);

/** A backup of `ticker`'s database to a new directory of its own, watched; resolves with the oracle's problems. */
async function watchedBackup(ticker: TickerProcess, name: string, seams: BackupSeams = {}): Promise<string[]> {
  const dir = join(root, name);
  mkdirSync(dir);
  const out = join(dir, `${name}.backup`);
  const watch = watchFileModes(dir);
  try {
    await ticker.handle.backup(out, seams);
  } finally {
    watch.stop();
  }
  return modeProblems(out, watch.observations());
}

describe("A174's negative control: temporary files created otherwise fail the oracle (PGlite, umask 000)", () => {
  it(
    "created with the umask's mode, or open to all and narrowed at once, fails; unwatched is not checked; the real " +
      "backup passes",
    async () => {
      const db = await PGLITE.database();
      const ticker = await startTicker(writeTickerConfig(project, { database: db.setting, stop: 4 }), 10n);
      try {
        expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: 4n, core: true });

        // The control's control: the process's own backup, watched the same way.
        expect(await watchedBackup(ticker, "real")).toEqual([]);

        // As before task 15.1b: the temporary file created with Node.js's default mode, which the umask leaves 0666.
        const umaskMode = await watchedBackup(ticker, "umask-mode", { createTemporary: (path) => open(path, "wx") });
        expect(umaskMode).toContainEqual(expect.stringMatching(/^created \.umask-mode\.backup\.\d+\.[0-9a-f]+\.partial: mode 0666$/));
        expect(umaskMode).toContain("umask-mode.backup at the end: mode 0666");

        // Open to all at its creation, narrowed to 0600 before its first byte: right at the end, wrong from creation.
        const narrowed = await watchedBackup(ticker, "narrowed", {
          createTemporary: async (path) => {
            const handle = await open(path, "wx", 0o666);
            await handle.chmod(0o600);
            return handle;
          },
        });
        expect(narrowed).toContainEqual(expect.stringMatching(/^created \.narrowed\.backup\.\d+\.[0-9a-f]+\.partial: mode 0666$/));
        // Its only problems are of the moment before the narrowing (a poll may have caught it too): none at the end.
        const early = /^(created|seen) \.narrowed\.backup\.\d+\.[0-9a-f]+\.partial: mode 0666$/;
        expect(narrowed.filter((problem) => !early.test(problem))).toEqual([]);

        // Written while nothing watched: not taken as checked from creation.
        const dir = join(root, "unwatched");
        mkdirSync(dir);
        const out = join(dir, "unwatched.backup");
        await ticker.handle.backup(out);
        expect(modeProblems(out, [])).toEqual([
          "unwatched.backup: its creation was not seen, so its mode is not known from creation",
        ]);
      } finally {
        await ticker.handle.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
