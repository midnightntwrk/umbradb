import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { backupCommand, EXIT, runProcessCommand } from "../../src/cli/command.js";
import { openConfiguredDatabase } from "../../src/config/database.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { plainData } from "../../src/config/plain-data.js";
import { processCoreEntry } from "../../src/config/process.js";
import { validateConfig } from "../../src/config/validate.js";
import type { CommittedHeight } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { statusWhen } from "../admin/admin-harness.js";
import { BACKUP_BACKENDS, type BackupBackend, tickerModule, writeTickerConfig } from "../backup/backup-fixtures.js";
import { backupAt, chain, codeIn, restoreRun } from "../backup/restore-fixtures.js";
import {
  type CliProject,
  cliProject,
  configText,
  coreSettings as checkSettings,
  inProcess,
} from "../cli/cli-fixtures.js";
import { chainNode, exitWithin, runCoreSettings, runInChild } from "../cli/run-fixtures.js";
import { core, startProcess, testBuild } from "../runner/process-build.js";
import { committedIn, processOn, processProblems, rowsIn, S } from "./pglite-directory-fixtures.js";

/**
 * A166 `[CI]` (task 2.2c; CF-4, CF-9, CF-10, BK-1, BK-3; `design.md` §7; owner decision Q163 A): under the development
 * opt-in, a PGlite directory whose parent is missing is created with that parent by what writes the database — the
 * runner's `startProcess` and `umbradb run` (here in this process, and as the command itself in a child process with
 * CF-4's relative path `data/preview`), and `umbradb restore` into its target —, each then committing (block S; the
 * backup's height), while the read-only uses — `umbradb config check --database` and `umbradb backup` — create no
 * directory. Also, at `openConfiguredDatabase`: nothing is created without the opt-in (CF-9: PGlite refuses before
 * anything is created), a restore refused before loading creates nothing, `file://` paths are created as bare ones, a
 * path through a file is refused (`database-error`, `open-failed`, not naming the path) creating nothing, and
 * PGlite in memory and the browser's file systems create nothing. The committed negative control (a build that never
 * creates the parents) is `./pglite-directory.negative-control.test.ts`.
 */

/** How long a process may take to commit and stop, or a backup's process to reach its height, on a loaded machine. */
const PATIENCE_MS = Number(process.env.UMBRADB_TEST_PATIENCE_MS ?? 300_000);

/** The backup's height for the restore, and the in-memory chain's head the restore checks against. */
const BACKUP_HEIGHT = 3n;
const CHAIN_HEAD = 10n;

const PGLITE = BACKUP_BACKENDS.find((backend) => backend.kind === "pglite") as BackupBackend;

let project: CliProject;
/** Every PGlite directory of the tests is under it; removed afterwards. */
let tmp = "";

beforeAll(async () => {
  project = await cliProject({ cli: true });
  project.write("ticker.ts", tickerModule(project.builders));
  tmp = mkdtempSync(join(tmpdir(), "umbradb-2-2c-"));
  await PGLITE.start();
}, 180_000);

afterAll(async () => {
  await PGLITE?.stop();
  if (tmp !== "") rmSync(tmp, { recursive: true, force: true });
  project?.remove();
}, 60_000);

let files = 0;

/** A configuration file of a public process on `database` reading the tape node `node`: one `core` entry, from S. */
function runConfigText(database: DatabaseParts, node: string): string {
  return [
    `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
    `const core = coreEntry({ start: ${S}, config: ${runCoreSettings(database, node)} });`,
    "export default defineConfig({ entries: [core] });",
    "",
  ].join("\n");
}

/** Waits until `check` holds, failing at once when `failed` says why, or after `PATIENCE_MS`. */
async function until(check: () => boolean, failed: () => string | null): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!check()) {
    const why = failed();
    if (why !== null) throw new Error(why);
    if (Date.now() > deadline) throw new Error(`timed out after ${PATIENCE_MS} ms`);
    await sleep(20);
  }
}

describe("A166: what writes a PGlite database creates its directory with any missing parent (CF-4, Q163)", () => {
  it("startProcess creates <tmp>/a/b with <tmp>/a, takes the lock beside it, and commits block S", async () => {
    const directory = join(tmp, "a", "b");
    expect(existsSync(join(tmp, "a"))).toBe(false);
    expect(processProblems(await processOn(directory))).toEqual([]);
    expect(statSync(join(tmp, "a")).isDirectory()).toBe(true);
  }, PATIENCE_MS * 2);

  it("umbradb run, in this process, creates <tmp>/run/a/b with its parents and commits block S", async () => {
    const tape = await chainNode();
    const directory = join(tmp, "run", "a", "b");
    try {
      const file = project.write(`run-${++files}.config.ts`, runConfigText({ kind: "pglite", path: directory }, tape.url));
      const signals = new EventEmitter();
      let handle: ProcessHandle | undefined;
      const run = runProcessCommand({
        signals,
        start: startProcess,
        started: (started) => {
          handle = started;
        },
      });
      const result = inProcess(["run", "--config", file], project.dir, { run });
      await until(
        () => {
          const cursor = handle?.status().cursor;
          return cursor !== undefined && cursor !== null && cursor >= S;
        },
        () => {
          const status = handle?.status();
          const over = status !== undefined && (["refused", "halted"].includes(status.state) || status.ended !== null);
          return over ? `the process did not commit block S: ${status.state} (${String(status.reason?.code)})` : null;
        },
      );
      signals.emit("SIGTERM");
      const { code, stderr } = await result;
      expect(stderr).not.toMatch(/startup refused|processing halted/);
      // Q165 B with Q167 A: the log names the directory created, as configured.
      expect(stderr).toContain(`created a new PGlite data directory ${directory} (and 2 missing parent directories)`);
      expect(code).toBe(EXIT.ok);
    } finally {
      await tape.close();
    }
    expect(existsSync(`${directory}.lock.sqlite`)).toBe(true);
    expect(await committedIn(directory, S)).toBe(true);
  }, PATIENCE_MS * 2);

  it(
    "umbradb run, the command in a child process, creates CF-4's relative path data/preview with data/ in its " +
      "working directory and commits block S",
    async () => {
      const tape = await chainNode();
      const work = join(project.dir, `work-${++files}`);
      mkdirSync(work);
      try {
        writeFileSync(join(work, "umbradb.config.ts"), runConfigText({ kind: "pglite", path: "data/preview" }, tape.url));
        const run = runInChild(project, [], work);
        try {
          const port = await run.adminPort(PATIENCE_MS);
          await statusWhen(
            `http://127.0.0.1:${port}`,
            (body) => {
              if (body.state === "refused" || body.state === "halted") {
                throw new Error(`the process ${body.state} (${String(body.reason?.code)})`);
              }
              return body.cursor !== null && BigInt(body.cursor) >= S;
            },
            PATIENCE_MS,
          );
          run.child.kill("SIGTERM");
          expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.ok);
          expect(run.stderr()).not.toMatch(/startup refused|processing halted/);
          expect(run.stderr()).toContain("created a new PGlite data directory data/preview (and 1 missing parent directory)");
        } finally {
          run.child.kill("SIGKILL");
        }
      } finally {
        await tape.close();
      }
      expect(existsSync(join(work, "data", "preview.lock.sqlite"))).toBe(true);
      expect(await committedIn(join(work, "data", "preview"), S)).toBe(true);
    },
    PATIENCE_MS * 2,
  );

  it(
    "umbradb restore into <tmp>/c/d creates it with <tmp>/c, says so naming it, and restores; a restore refused " +
      "before loading creates nothing",
    async () => {
      const { file } = await backupAt(project, PGLITE, BACKUP_HEIGHT, join(tmp, "ticker.backup"));

      // Refused before loading (BK-3: the file is no backup): the target, not created yet, is left as it was.
      const garbage = join(tmp, "garbage.backup");
      writeFileSync(garbage, "-- not a manifest\nSELECT 1;\n");
      const refusedTarget = join(tmp, "x", "y");
      const refusedConfig = writeTickerConfig(project, { database: { kind: "pglite", path: refusedTarget } });
      const refused = await restoreRun(project, garbage, refusedConfig, chain(CHAIN_HEAD));
      expect(codeIn(refused.stderr)).toBe("backup-format-unknown");
      expect(refused.code).toBe(EXIT.failed);
      expect(existsSync(join(tmp, "x"))).toBe(false);

      const target = join(tmp, "c", "d");
      expect(existsSync(join(tmp, "c"))).toBe(false);
      const config = writeTickerConfig(project, { database: { kind: "pglite", path: target } });
      const restored = await restoreRun(project, file, config, chain(CHAIN_HEAD));
      expect(restored.stderr).toBe("");
      expect(restored.code).toBe(EXIT.ok);
      expect(restored.stdout).toContain(`created a new PGlite data directory ${target} (and 1 missing parent directory)`);
      expect(restored.stdout).toContain(`height ${BACKUP_HEIGHT}, contents hash`);
      const [row] = await rowsIn(
        target,
        "SELECT max(height)::text AS h, (SELECT count(*) FROM ticker.rows)::text AS n FROM core_block_commit.blocks",
      );
      expect(row).toEqual({ h: `${BACKUP_HEIGHT}`, n: `${BACKUP_HEIGHT}` });
    },
    PATIENCE_MS * 2,
  );

  it("umbradb config check --database on a file naming <tmp>/e/f checks a new database and creates no directory", async () => {
    const checked: DatabaseParts = { kind: "pglite", path: join(tmp, "e", "f") };
    const file = project.write(
      `check-${++files}.config.ts`,
      configText(project.builders, [
        `const core = coreEntry({ start: 0, config: ${checkSettings(checked, { developmentOptIn: true })} });`,
        "export default defineConfig({ entries: [core] });",
      ]),
    );
    const result = await inProcess(["config", "check", file, "--database"], project.dir);
    expect(result.stdout).toContain("passed — no PGlite database at that directory yet: checked as a new database");
    expect(result.code).toBe(EXIT.ok);
    expect(existsSync(join(tmp, "e"))).toBe(false);
  }, 120_000);

  it("umbradb backup of <tmp>/g/h refuses, nothing to back up, and creates no directory", async () => {
    const config = writeTickerConfig(project, { database: { kind: "pglite", path: join(tmp, "g", "h") } });
    const out = join(tmp, "g-h.backup");
    let stderr = "";
    const code = await backupCommand()(["--out", out, "--config", config], {
      cwd: project.dir,
      env: PGLITE.env(),
      stdout: () => undefined,
      stderr: (text) => {
        stderr += text;
      },
    });
    expect(stderr).toMatch(/^umbradb backup: no-committed-height: /);
    expect(code).toBe(EXIT.failed);
    expect(existsSync(join(tmp, "g"))).toBe(false);
    expect(existsSync(out)).toBe(false);
  }, 120_000);
});

describe("openConfiguredDatabase and a PGlite directory's missing parents (CF-4, CF-9, Q163)", () => {
  const declarations = validateDeclarations({ backbone: testBuild([]).declarations.backbone, core: [], user: [] });
  const noHeight: CommittedHeight = async () => null;

  /** The process's `core` revision for `database`, with `extra` settings (the opt-in unless they say otherwise). */
  const coreRevision = (database: DatabaseParts, extra: Readonly<Record<string, unknown>> = {}) =>
    processCoreEntry(
      validateConfig({
        config: { data: plainData({ entries: [core(database, 1, { extra })] }) },
        declarations,
        side: "public",
      }),
    );

  /** The `UmbraError` `run` rejects with; fails the test otherwise. */
  async function refusal(run: () => Promise<unknown>): Promise<UmbraError> {
    try {
      await run();
    } catch (error) {
      expect(error).toBeInstanceOf(UmbraError);
      return error as UmbraError;
    }
    return expect.unreachable("expected a refusal");
  }

  it("creates nothing without the development opt-in: PGlite refuses first (CF-9)", async () => {
    const entry = coreRevision({ kind: "pglite", path: join(tmp, "n", "o") }, { developmentOptIn: false });
    const error = await refusal(() => openConfiguredDatabase(entry, { committedHeight: noHeight }));
    expect(error.code).toBe("development-opt-in-required");
    expect(existsSync(join(tmp, "n"))).toBe(false);
  });

  it("creates a file:// directory with its parents, as a bare one", async () => {
    const directory = join(tmp, "p", "q");
    const db = await openConfiguredDatabase(coreRevision({ kind: "pglite", path: `file://${directory}` }), {
      committedHeight: noHeight,
    });
    try {
      expect(await db.read((read) => read.query("SELECT 1 AS one"))).toEqual([{ one: 1 }]);
    } finally {
      await db.close();
    }
    expect(existsSync(join(directory, "PG_VERSION"))).toBe(true);
    expect(existsSync(`${directory}.lock.sqlite`)).toBe(true);
  });

  it("refuses a path through a file as open-failed, without naming it, creating nothing", async () => {
    const file = join(tmp, "a-file");
    writeFileSync(file, "x");
    const directory = join(file, "r", "s");
    const entry = coreRevision({ kind: "pglite", path: directory });
    const error = await refusal(() => openConfiguredDatabase(entry, { committedHeight: noHeight }));
    expect(error.code).toBe("database-error");
    expect(error.details).toEqual({ reason: "open-failed" });
    expect(error.message).not.toContain(tmp);
    expect(statSync(file).isFile()).toBe(true);
    expect(existsSync(`${directory}.lock.sqlite`)).toBe(false);
  });

  it("opens an existing directory as it is; creates nothing for pglite:memory or a browser file system", async () => {
    const existing = join(tmp, "existing");
    mkdirSync(existing);
    const lines: string[] = [];
    const db = await openConfiguredDatabase(coreRevision({ kind: "pglite", path: existing }), {
      committedHeight: noHeight,
      log: (line) => lines.push(line),
    });
    await db.close();
    expect(readdirSync(existing)).toContain("PG_VERSION");
    // An existing directory is not created: no line says so.
    expect(lines).toEqual([]);
    // `memory://` and `idb://…` read as relative paths would be `memory:` and `idb:` in the working directory.
    const memory = await openConfiguredDatabase(coreRevision({ kind: "pglite", memory: true }), { committedHeight: noHeight });
    await memory.close();
    const idb = coreRevision({ kind: "pglite", path: "idb://umbradb-2-2c" });
    const browser = await refusal(() => openConfiguredDatabase(idb, { committedHeight: noHeight }));
    expect(browser.code).toBe("invalid-configuration");
    expect(existsSync(resolve("memory:"))).toBe(false);
    expect(existsSync(resolve("idb:"))).toBe(false);
  });
});
